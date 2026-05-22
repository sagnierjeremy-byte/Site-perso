// Patche les 8 pages root pour pointer vers /photos/og/<slug>.jpg
// + ajoute width/height/twitter:image. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// slug → fichier (slug = nom de l'image, fichier = HTML)
const PAGES = [
  { slug: "lexique",          file: "lexique.html" },
  { slug: "claude-code",      file: "claude-code.html" },
  { slug: "apprendre",        file: "apprendre.html" },
  { slug: "modeles-ia",       file: "modeles-ia.html" },
  { slug: "modeles-image-ia", file: "modeles-image-ia.html" },
  { slug: "workflows",        file: "workflows.html" },
  { slug: "podcast",          file: "podcast.html" },
  { slug: "outils",           file: "outils.html" }
];

const report = [];

for (const { slug, file } of PAGES) {
  const path = resolve(ROOT, file);
  let html = readFileSync(path, "utf8");
  const before = html;
  const imgUrl = `https://jerwis.fr/photos/og/${slug}.jpg`;

  // Bloc canonique à injecter
  const block = [
    `<meta property="og:image" content="${imgUrl}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:image" content="${imgUrl}">`
  ].join("\n");

  // 1) Retire toutes les balises og:image / og:image:width / og:image:height / twitter:image existantes
  html = html.replace(/^[ \t]*<meta[^>]*\b(?:property|name)=["'](?:og:image(?::width|:height)?|twitter:image)["'][^>]*>\s*\n?/gim, "");

  // 2) Insertion : juste après la dernière balise og:* OU avant </head>
  let insertedFlag = false;
  const ogRegex = /<meta\s+property=["']og:[^"']+["'][^>]*>/gi;
  let lastMatch = null;
  let m;
  while ((m = ogRegex.exec(html)) !== null) {
    lastMatch = { index: m.index, length: m[0].length };
  }
  if (lastMatch) {
    const insertAt = lastMatch.index + lastMatch.length;
    html = html.slice(0, insertAt) + "\n" + block + html.slice(insertAt);
    insertedFlag = true;
  } else if (html.includes("</head>")) {
    html = html.replace("</head>", block + "\n</head>");
    insertedFlag = true;
  }

  if (!insertedFlag) {
    report.push({ slug, status: "FAIL", reason: "no </head> found" });
    continue;
  }

  if (html === before) {
    report.push({ slug, status: "NOOP" });
  } else {
    writeFileSync(path, html);
    report.push({ slug, status: "OK" });
  }
}

const ok = report.filter(r => r.status === "OK").length;
const fail = report.filter(r => r.status === "FAIL").length;
const noop = report.filter(r => r.status === "NOOP").length;
console.log(`OK: ${ok} · NOOP: ${noop} · FAIL: ${fail}`);
for (const r of report) {
  if (r.status !== "OK") console.log(`  ${r.status} ${r.slug} ${r.reason || ""}`);
}
