// Patche les 21 articles pour pointer vers /photos/og/<slug>.jpg
// + ajoute width/height/twitter:image. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SLUGS = [
  "agents-ia-guide",
  "autoresearch-karpathy",
  "better-call-vs-associe",
  "booking-eurofiscalis-making-of",
  "claude-code-workflow-tips",
  "dev-browser",
  "guerres-d-ia-podcast",
  "hermes-agent",
  "karpathy",
  "limova-vs-claude-code",
  "llm-local-pour-non-dev",
  "llm-wiki-karpathy",
  "loops-claude",
  "monde-ia-5-10-20-ans",
  "open-source-pour-non-dev",
  "outil-vente-claude-code",
  "plan-chine-2026-2030",
  "superpowers",
  "tuto-agent-contrats",
  "tuto-agent-gmail",
  "veille-pour-demain"
];

const report = [];

for (const slug of SLUGS) {
  const file = resolve(ROOT, "articles", `${slug}.html`);
  let html = readFileSync(file, "utf8");
  const before = html;
  const imgUrl = `https://jerwis.fr/photos/og/${slug}.jpg`;

  // Bloc à injecter (4 balises)
  const block = [
    `<meta property="og:image" content="${imgUrl}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:image" content="${imgUrl}">`
  ].join("\n");

  // 1) Retire toutes les balises og:image / og:image:width / og:image:height / twitter:image existantes
  html = html.replace(/^[ \t]*<meta[^>]*\b(?:property|name)=["'](?:og:image(?::width|:height)?|twitter:image)["'][^>]*>\s*\n?/gim, "");

  // 2) Choisit le point d'insertion : après la dernière balise og:* OU og: présente, sinon avant </head>
  let insertedFlag = false;

  // Trouve la dernière balise <meta property="og:..."> (n'importe laquelle)
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
  } else {
    // fallback : avant </head>
    if (html.includes("</head>")) {
      html = html.replace("</head>", block + "\n</head>");
      insertedFlag = true;
    }
  }

  if (!insertedFlag) {
    report.push({ slug, status: "FAIL", reason: "no </head> found" });
    continue;
  }

  if (html === before) {
    report.push({ slug, status: "NOOP", reason: "no change" });
  } else {
    writeFileSync(file, html);
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
