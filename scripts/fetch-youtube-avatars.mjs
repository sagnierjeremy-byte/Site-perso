#!/usr/bin/env node
// Fetch the real YouTube avatar URLs (yt3.googleusercontent.com CDN) for each
// channel listed in data/youtube-channels.json.
//
// Why: the local /photos/channels/cXX.jpg mapping was broken for ~22 channels.
// Using YouTube's CDN avatars is more reliable and self-syncing.
//
// Strategy:
//   1. Read data/youtube-channels.json
//   2. For each channel, fetch https://www.youtube.com/channel/<id>
//   3. Extract avatar URL from the page (multiple patterns, fallbacks)
//   4. Write back to JSON with new field `avatar_url`
//   5. Log progress per channel

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const JSON_PATH = join(ROOT, "data", "youtube-channels.json");

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchAvatar(channelId) {
  const url = `https://www.youtube.com/channel/${channelId}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const html = await res.text();

    // Primary: meta og:image (most stable, JPG cropped square)
    const og = html.match(/<meta property="og:image" content="(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/);
    if (og) return { ok: true, url: og[1], source: "og:image" };

    // Secondary: avatar.thumbnails in metadata payload (high-res, s900 by default)
    const avatar = html.match(/"avatar":\{"thumbnails":\[\{"url":"(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/);
    if (avatar) return { ok: true, url: avatar[1], source: "metadata.avatar" };

    // Tertiary: link rel="image_src"
    const linkImg = html.match(/<link rel="image_src" href="(https:\/\/yt3\.googleusercontent\.com\/[^"]+)"/);
    if (linkImg) return { ok: true, url: linkImg[1], source: "image_src" };

    return { ok: false, error: "no avatar URL found in page" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Normalize URL to request s240 (240px square, more than enough for a 48px display)
function normalizeAvatarUrl(url) {
  // YT CDN URLs end with `=sNNN-c-k-c0x00ffffff-no-rj` (size + crop options).
  // Force s240 for consistency and lighter payload.
  return url.replace(/=s\d+-/, "=s240-");
}

async function main() {
  console.log("Reading", JSON_PATH);
  const data = JSON.parse(readFileSync(JSON_PATH, "utf8"));

  console.log(`Fetching avatars for ${data.channels.length} channels…\n`);

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < data.channels.length; i++) {
    const ch = data.channels[i];
    process.stdout.write(`  [${String(i + 1).padStart(2, "0")}/${data.channels.length}] ${ch.handle.padEnd(28)} `);
    const res = await fetchAvatar(ch.id);
    if (res.ok) {
      ch.avatar_url = normalizeAvatarUrl(res.url);
      console.log(`OK  via ${res.source}`);
      ok++;
    } else {
      console.log(`FAIL ${res.error}`);
      fail++;
    }
    // throttle ~400ms between requests
    await new Promise((r) => setTimeout(r, 400));
  }

  data.generated_at = new Date().toISOString();
  writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");

  console.log(`\nWrote ${JSON_PATH}`);
  console.log(`Avatars résolus : ${ok}/${data.channels.length} (échecs : ${fail})`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
