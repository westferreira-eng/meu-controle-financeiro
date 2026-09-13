import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const names = Array.from({ length: 8 }, (_, i) => `part0${i}.txt`);
const parts = names.map((name) => fs.readFileSync(path.join(root, 'appdata', name), 'utf8').trim());
const b64 = parts.join('').replace(/\s+/g, '');
if (!b64 || b64.length % 4 !== 0) throw new Error(`Payload Base64 inválido: ${b64.length} caracteres`);
const html = zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8');
if (!html.toLowerCase().includes('<!doctype html')) throw new Error('Payload não produziu HTML válido');
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
console.log(`Meu Controle Financeiro: ${html.length} bytes gerados em dist/index.html`);
