# iPhone iOS Simulator — Cara Deploy ke Cloudflare Pages

Isi folder ini:
- index.html
- style.css
- script.js

## Cara upload (Cloudflare Pages — paling gampang)
1. Buka https://dash.cloudflare.com/ lalu masuk ke menu **Workers & Pages**.
2. Klik **Create application** → tab **Pages** → **Upload assets** (atau "Direct Upload").
3. Beri nama project (mis. `iphone-simulator`).
4. Drag & drop ketiga file di atas (index.html, style.css, script.js) — pastikan ketiganya ada di root, jangan di dalam subfolder.
5. Klik **Deploy site**. Tunggu beberapa detik, Cloudflare akan kasih URL publik (mis. `iphone-simulator.pages.dev`).
6. Selesai — buka URL-nya untuk melihat hasilnya.

## Update di kemudian hari
Kalau mau update, tinggal ulangi langkah upload assets di project yang sama (Cloudflare akan buat deployment baru), atau gunakan Wrangler CLI:
```
npx wrangler pages deploy . --project-name=iphone-simulator
```
