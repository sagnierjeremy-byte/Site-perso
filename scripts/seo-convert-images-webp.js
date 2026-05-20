#!/usr/bin/env node
// Convertit les images JPG/JPEG/PNG > 300 KB en WebP à côté de l'original (cwebp -q 82).
// Met à jour les références dans les HTML, en préservant og:image et twitter:image
// (qui restent en JPG/PNG pour compat Meta/Twitter).
// Idempotent : skip conversion si .webp déjà présent et plus récent.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, relative, dirname, basename, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const MIN_SIZE = 300 * 1024; // 300 KB
const QUALITY = 82;
const SKIP_DIRS = new Set(['node_modules', '.git', 'audits', 'drafts', '_internal']);
const SKIP_HTML_DIRS = new Set(['node_modules', '.git', 'audits', 'drafts', '_internal', 'photos', 'downloads', 'feed']);

function walkImages(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkImages(full, out);
    else {
      const ext = extname(entry).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext) && st.size > MIN_SIZE) out.push({ path: full, size: st.size });
    }
  }
  return out;
}

function walkHtml(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_HTML_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkHtml(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

// === 1. Conversion ===
const images = walkImages(ROOT);
console.log(`\n=== ${images.length} images > 300 KB détectées ===\n`);
let converted = 0, skipped = 0, totalGainBytes = 0;
const conversions = []; // [{originalRel, webpRel, gain}]

for (const img of images) {
  const webpPath = img.path.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const rel = relative(ROOT, img.path);
  const webpRel = relative(ROOT, webpPath);

  // Idempotence
  if (existsSync(webpPath)) {
    const webpStat = statSync(webpPath);
    if (webpStat.mtimeMs >= statSync(img.path).mtimeMs) {
      skipped++;
      conversions.push({ originalRel: rel, webpRel, gain: 0, skipped: true });
      continue;
    }
  }

  try {
    execSync(`cwebp -q ${QUALITY} -quiet "${img.path}" -o "${webpPath}"`, { stdio: 'pipe' });
    const newSize = statSync(webpPath).size;
    const gain = img.size - newSize;
    totalGainBytes += gain;
    converted++;
    conversions.push({ originalRel: rel, webpRel, gain, origSize: img.size, newSize });
    const gainPct = ((gain / img.size) * 100).toFixed(0);
    console.log(`  ✓ ${rel} → ${webpRel} · ${(img.size/1024).toFixed(0)} KB → ${(newSize/1024).toFixed(0)} KB (-${gainPct}%)`);
  } catch (e) {
    console.log(`  × ${rel} échec : ${e.message}`);
  }
}

console.log(`\n${converted} converties · ${skipped} skip · gain total: ${(totalGainBytes / 1024 / 1024).toFixed(1)} MB`);

// === 2. Update HTML references ===
console.log(`\n=== Update HTML references ===\n`);

// Construire la liste des renames (originalBasename → webpBasename)
const renames = conversions.map(c => ({
  origBasename: basename(c.originalRel),
  webpBasename: basename(c.webpRel),
  origDir: dirname(c.originalRel),
}));

const htmlFiles = walkHtml(ROOT);
let htmlUpdated = 0;
let totalReplacements = 0;

// Regex qui matche les <img src> et style="background-image:url(...)" et href dans les <a> qui pointent vers une image
// MAIS PAS les meta og:image, twitter:image, ni les JSON-LD "image"
function updateHtml(content) {
  let totalCount = 0;

  for (const { origBasename, webpBasename } of renames) {
    // Match plus loin le pattern qui n'est pas dans une zone protégée
    // On regarde le contexte avant pour exclure og:image, twitter:image, "image":
    const escapedOrig = origBasename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Pattern : matche le nom de fichier précédé d'un / ou d'un ", DANS le contexte safe
    // On va le faire ligne par ligne pour pouvoir vérifier le contexte
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.includes(origBasename)) continue;
      // Skip si ligne contient og:image, twitter:image, ou JSON-LD "image":
      // (les meta tags og:image et twitter:image)
      if (/og:image|twitter:image/.test(line)) continue;
      // Skip si dans JSON-LD "image" (ligne avec "image": ou "image" :)
      if (/"image"\s*:/.test(line)) continue;
      // Skip si feat-image, hero-image, og-image variants (dans noms d'attribut on garde)
      // Remplace toutes les occurrences sur cette ligne
      const before = line;
      const re = new RegExp(escapedOrig, 'g');
      lines[i] = line.replace(re, webpBasename);
      if (lines[i] !== before) {
        const count = (before.match(re) || []).length;
        totalCount += count;
      }
    }
    content = lines.join('\n');
  }
  return { content, count: totalCount };
}

for (const file of htmlFiles) {
  const original = readFileSync(file, 'utf8');
  const { content: updated, count } = updateHtml(original);
  if (count > 0 && updated !== original) {
    writeFileSync(file, updated, 'utf8');
    htmlUpdated++;
    totalReplacements += count;
    console.log(`  ✓ ${relative(ROOT, file)} · ${count} ref(s)`);
  }
}

console.log(`\n✓ ${htmlUpdated} fichiers HTML mis à jour · ${totalReplacements} références patchées`);
console.log(`\n💾 Gain total estimé : ${(totalGainBytes / 1024 / 1024).toFixed(1)} MB sur ${converted} images.`);
console.log(`📌 Les fichiers originaux sont conservés au cas où. Tu peux les supprimer après validation visuelle.`);
