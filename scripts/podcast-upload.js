// Upload un fichier MP3 vers Cloudflare R2 avec @aws-sdk/client-s3.
// Usage : node scripts/podcast-upload.js <chemin-local-mp3>
// R2 est compatible API S3, on pointe juste endpoint sur *.r2.cloudflarestorage.com.

import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback sur .env

const BUCKET = 'jerwis-podcast-audio';
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL_BASE || `https://pub-${ACCOUNT_ID}.r2.dev`;

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY) {
  console.error('[upload] Manque R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY dans .env.local');
  process.exit(1);
}

const localPath = process.argv[2];
if (!localPath) {
  console.error('Usage : node scripts/podcast-upload.js <chemin-local.mp3>');
  process.exit(1);
}
if (!fs.existsSync(localPath)) {
  console.error(`[upload] Fichier introuvable : ${localPath}`);
  process.exit(1);
}

const filename = path.basename(localPath);
const size = fs.statSync(localPath).size;

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

const body = fs.readFileSync(localPath);

console.log(`[upload] ${filename} (${(size / 1024 / 1024).toFixed(1)} Mo) → R2 bucket ${BUCKET}...`);

await client.send(new PutObjectCommand({
  Bucket: BUCKET,
  Key: filename,
  Body: body,
  ContentType: 'audio/mpeg',
  CacheControl: 'public, max-age=31536000, immutable',
}));

const publicUrl = `${PUBLIC_URL_BASE}/${filename}`;
console.log(`[upload] OK ✓`);
console.log(`[upload] URL publique : ${publicUrl}`);
console.log(`[upload] Taille : ${size} bytes`);
