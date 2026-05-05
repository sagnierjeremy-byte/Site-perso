// Client Resend — broadcasts, audiences, contacts, dedup multi-audience.
// Portage de la logique éprouvée du newsletter-dashboard Eurofiscalis (Leo).

const BASE = 'https://api.resend.com';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} manquant dans .env.local`);
  return value;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let queue = Promise.resolve();
const GAP = 250;

export async function resendFetch(path, options = {}) {
  const apiKey = requireEnv('RESEND_API_KEY');
  const result = queue.then(async () => {
    await wait(GAP);
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (res.status === 429) {
      await wait(1500);
      const retry = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      if (!retry.ok) {
        const text = await retry.text();
        throw new Error(`Resend ${retry.status}: ${text}`);
      }
      return retry.json();
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Resend ${res.status}: ${text}`);
    }
    return res.json();
  });
  queue = result.catch(() => {});
  return result;
}

// --- Audiences ---

export async function getAudiences() {
  const data = await resendFetch('/audiences');
  return data.data || [];
}

export async function createAudience(name) {
  return resendFetch('/audiences', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function deleteAudience(id) {
  await resendFetch(`/audiences/${id}`, { method: 'DELETE' });
}

export async function getContacts(audienceId) {
  const data = await resendFetch(`/audiences/${audienceId}/contacts`);
  return data.data || [];
}

export async function createContact(audienceId, payload) {
  return resendFetch(`/audiences/${audienceId}/contacts`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// --- Broadcasts ---

export async function getBroadcasts() {
  const list = await resendFetch('/broadcasts');
  return list.data || [];
}

export async function getBroadcast(id) {
  return resendFetch(`/broadcasts/${id}`);
}

export async function createBroadcast(payload) {
  // payload : { audience_id, from, subject, html, name, text? }
  return resendFetch('/broadcasts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function sendBroadcast(id) {
  await resendFetch(`/broadcasts/${id}/send`, { method: 'POST' });
}

export async function deleteBroadcast(id) {
  await resendFetch(`/broadcasts/${id}`, { method: 'DELETE' });
}

// --- Email test unitaire ---

export async function sendTestEmail(payload) {
  return resendFetch('/emails', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// --- Multi-audience dedup (audience temporaire) ---

const MERGE_PREFIX = '_merge_jerwis_';

function buildMergeAudienceName(label) {
  const ts = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8);
  const suffix = label
    ? `_${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`
    : '';
  return `${MERGE_PREFIX}${ts}_${rand}${suffix}`;
}

export async function getDeduplicatedContacts(audienceIds) {
  const failed = [];
  const lists = await Promise.all(
    audienceIds.map((id) =>
      getContacts(id).catch((err) => {
        failed.push(id);
        console.error(`[dedup] audience ${id} inaccessible:`, err.message);
        return [];
      })
    )
  );
  if (failed.length > 0) {
    throw new Error(
      `getDeduplicatedContacts : ${failed.length}/${audienceIds.length} audience(s) inaccessible(s). Annulation pour eviter envoi avec compte fausse.`
    );
  }
  const seen = new Map();
  for (const list of lists) {
    for (const c of list) {
      if (c.unsubscribed) continue;
      const key = c.email.trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, c);
    }
  }
  return Array.from(seen.values());
}

export async function prepareMultiAudience(audienceIds, label) {
  const ids = audienceIds.filter(Boolean);
  if (ids.length === 0) throw new Error('prepareMultiAudience : aucune audience');

  if (ids.length === 1) {
    const contacts = await getContacts(ids[0]);
    return {
      audienceId: ids[0],
      recipientCount: contacts.filter((c) => !c.unsubscribed).length,
      sourceAudienceIds: ids,
      mergeAudienceId: null,
    };
  }

  const deduped = await getDeduplicatedContacts(ids);
  if (deduped.length === 0) throw new Error('prepareMultiAudience : 0 destinataires apres dedup');

  const mergeName = buildMergeAudienceName(label);
  const { id: mergeId } = await createAudience(mergeName);

  let successes = 0;
  let failures = 0;
  for (const contact of deduped) {
    try {
      await createContact(mergeId, {
        email: contact.email,
        first_name: contact.first_name ?? undefined,
        last_name: contact.last_name ?? undefined,
      });
      successes++;
    } catch (err) {
      failures++;
      console.error('[dedup] contact ignore:', err.message);
    }
  }

  const failureRate = failures / deduped.length;
  if (failureRate > 0.1) {
    console.error(
      `[dedup] ${failures}/${deduped.length} echecs (${(failureRate * 100).toFixed(0)}%) — cleanup ${mergeId}`
    );
    try {
      await deleteAudience(mergeId);
    } catch (err) {
      console.error(`[dedup] cleanup orphan ${mergeId} echec:`, err.message);
    }
    throw new Error(
      `Import contacts : ${failures}/${deduped.length} echecs (${(failureRate * 100).toFixed(0)}%). Reessayez.`
    );
  }
  if (failures > 0) {
    console.warn(`[dedup] ${failures}/${deduped.length} contacts non ajoutes (taux acceptable)`);
  }

  return {
    audienceId: mergeId,
    recipientCount: successes,
    sourceAudienceIds: ids,
    mergeAudienceId: mergeId,
  };
}

export async function countUniqueRecipients(audienceIds) {
  const ids = audienceIds.filter(Boolean);
  if (ids.length === 0) return 0;
  const deduped = await getDeduplicatedContacts(ids);
  return deduped.length;
}

export async function pingResend() {
  // simple ping = list audiences (couvre auth + connectivité)
  await getAudiences();
  return { ok: true };
}
