# E2E System Adjust + Remaining Work Plan

> Scope keputusan (user, 2026-08-26): **API-only E2E, tanpa browser, untuk local pre-deploy check saja.** Bukan CI, bukan Playwright, bukan full UI coverage. Fokus mengunci perilaku fix keamanan §8 + critical path `.context/base/testing.yaml`.
>
> Prinsip: `bun test` native + `fetch` global + `node:net`/`child_process` untuk orchestration. **Zero new runtime dependency.** Tidak ada browser, tidak ada test framework eksternal.

---

## Bagian A — Sistem E2E (API-only, local pre-deploy)

### A.1 Arsitektur

Tambah folder `e2e/` di root (bukan di app, karena test-nya cross-app). Satu runner script + helper bersama + spec per domain. Jalan via `bun test e2e/`. Root orchestration `bun run test:e2e` yang: start service → tunggu sehat → jalan → matikan → exit code benar.

```
e2e/
  README.md                 # cara jalan, env yang dipakai, cara nambah spec
  helpers/
    env.ts                  # baca base URL + token dari env, default localhost ports
    waitFor.ts              # poll URL sampai 2xx atau timeout
    http.ts                 # fetch wrapper: json(), expectStatus(), noisy-fail dgn body
    wsClient.ts             # WS client minimal utk presence (node http Upgrade manual)
    seed.ts                 # guard: pastikan DB seeded, expose fixture id (guestbook/slot)
  specs/
    admin-auth.spec.ts      # critical path: admin tier gating
    admin-cron.spec.ts      # cron fail-closed (fix §8.1)
    public-write.spec.ts    # contact/guestbook/analytics bounds (fix §8.2)
    ip-spoofing.spec.ts     # XFF handling end-to-end (fix §8.1)
    presence.spec.ts        # WS limits + minimal health (fix §8.1)
    rag-chat.spec.ts        # /chat /chat/confirm /ingest (fix §8.1)
    webhook.spec.ts         # body cap + delivery-id sanitization (fix §8.1)
```

### A.2 Helper contract (tulis sekali, dipakai semua spec)

- `env.ts` — expose: `ADMIN_URL`(3001), `PUBLIC_URL`(3000), `LINKS_URL`(3002), `NGL_URL`(3003), `RAG_URL`(3005), `PRESENCE_URL`(3006), `CRON_SECRET`, `IP_HASH_SECRET`, `RAG_INGEST_SERVICE_TOKEN`, `INTERNAL_API_TOKEN`, `DEMO_AUTH_PASSWORD`. Semua dari `process.env`, default ke localhost port dev. Tidak hardcode secret; kalau secret wajib kosong → spec itu `skip` dengan pesan jelas (bukan fail semu).
- `waitFor(url, timeoutMs)` — GET tiap 250ms sampai status <500. Dipakai orchestration sebelum test jalan.
- `http.ts` — `expectStatus(res, n)` yang kalau gagal melempar error berisi status + body (biar debug cepat), `postJson(url, body, headers)`.
- `wsClient.ts` — presence butuh WebSocket mentah. Bun punya `WebSocket` global; bungkus jadi `connect(origin)` + `sendJson` + `expectNoClose(ms)` untuk test "frame besar diabaikan tanpa crash". Origin header diset manual untuk test 403.

### A.3 Spec per domain — apa yang dikunci (mengunci fix §8, bukan nulis ulang unit test)

1. **admin-auth.spec.ts**
   - `POST /api/v1/admin/messages` tanpa session → **401/403** (mengunci fix auth bypass §8.1).
   - Route admin lain yang di-sample (mis. `GET /api/v1/admin/*`) tanpa session → 401/403.
   - (Opsional, kalau `DEMO_AUTH_*` diset) login credentials → cookie → akses admin → 200. Kalau tidak diset, skip.

2. **admin-cron.spec.ts**
   - `GET/POST /api/cron/cleanup-chatlogs` **tanpa** Authorization → **401** (fail-closed).
   - Dengan `Bearer $CRON_SECRET` → bukan 401 (200/204). Mengunci fix fail-open §8.1.

3. **public-write.spec.ts**
   - `POST /api/v1/public/contact` dengan `message` 5001 char → **400** (schema bound §8.2); tanpa Turnstile token di mode wajib → **400/403** (Turnstile masih ditegakkan §8.5).
   - `POST /api/v1/public/analytics` dengan 21 key di `data` → **400** (jsonb bound §8.2).
   - Rate limit smoke: hit endpoint publik >12× cepat → akhirnya **429** (limiter jalan; in-memory oke untuk single container).

4. **ip-spoofing.spec.ts** (end-to-end lewat public proxy)
   - POST ke public-astro `/api/contact` dengan header `X-Forwarded-For: 6.6.6.6` → request tetap diproses normal (bukan 5xx), dan *tidak* ada cara spoof menurunkan limiter. Verifikasi unit sudah di packages/http; di E2E cukup pastikan chain tidak error + response benar. **Catatan:** cek ipHash penuh butuh akses DB — di luar scope API-only; dokumentasikan sebagai batas.
   - Header raksasa / aneh → tidak crash.

5. **presence.spec.ts**
   - `GET /health` → body **persis** `{ok:true}` (mengunci fix info-leak §8.1).
   - WS connect dengan Origin asing → ditolak (bukan ter-upgrade). Origin valid → `welcome` message.
   - Kirim frame >4KB → koneksi tetap hidup, server tidak crash (mengunci MAX_MESSAGE_BYTES).
   - Join >`MAX_ROOM_PARTICIPANTS` simulasi berat — **skip**, dokumentasikan butuh load harness; unit-level cap sudah ada di server.

6. **rag-chat.spec.ts**
   - `POST /ingest` tanpa token / token salah → **401**; token benar → lolos auth (mengunci timingSafeEqual + fail-closed §8.1/§8.2).
   - `POST /chat` pesan 2001 char → **400** (mengunci MAX_CHAT_MESSAGE_LENGTH).
   - `POST /chat` `sessionId: "../../etc/passwd"` → tidak error 5xx, service balas normal (mengunci regex sessionId).
   - `POST /chat/confirm` guestbook 900 char → ditolak; booking name `you` → ditolak (mengunci guardrail §8.1).

7. **webhook.spec.ts**
   - POST dengan `Content-Length` > 5MiB → ditolak sebelum baca body (mengunci body cap §8.1).
   - (Unit untuk SHA-256 delivery-id sudah cukup di level kode; E2E cukup cap + auth fail tanpa signature valid.)

### A.4 Orchestration — `bun run test:e2e`

Tambah `scripts/test-e2e.ts` (Bun) + script root:

- **Strategi start:** pakai `start-dev.sh` yang sudah ada (start semua app) **atau** start per-service lewat `docker compose`/`bun run dev`. Pilih yang paling sedikit duplikasi: panggil `start-dev.sh` di background, poll health endpoint, jalan, `pkill` anak-anaknya.
- **Health poll:** public:3000 (200), links:3002 (200), admin:3001 (307 root OK sebagai "up"), rag:3005 `/health`, presence:3006 `/health`. **Catatan:** admin tidak punya `/api/health` — poll root 307 sebagai sinyal up; jangan invent endpoint baru.
- **Seed:** jalankan `bun run docker:dev:seed` (bukan reset) sebelum test kalau DB belum seeded; fixture id diambil lewat query langsung oleh `helpers/seed.ts`. Guard: kalau DB tidak reachable, skip spec yang butuh data dengan pesan.
- **Exit code:** non-zero kalau ada spec gagal; print ringkasan per-spec.
- **Timeout global:** mis. 120s; tiap fetch punya timeout sendiri supaya tidak hang.

`package.json` root tambah:
```jsonc
"test:e2e": "bun run scripts/test-e2e.ts",
"test:e2e:specs-only": "bun test e2e/specs"   // kalau service sudah jalan manual
```

### A.5 Yang **sengaja tidak** dikerjakan (YAGNI / di luar scope)

- Tidak ada Playwright/browser — keputusan user.
- Tidak ada CI workflow — keputusan user (local pre-deploy saja). Kalau nanti mau CI, tinggal panggil `bun run test:e2e` di GitHub Actions.
- Tidak mengunci ipHash HMAC lewat E2E (butuh DB read; sudah di-cover unit di `hash.ts` via runtime check).
- Tidak load-test presence participant cap / rag concurrency — butuh harness terpisah.
- Tidak test OAuth Google sungguhan (butuh interaksi eksternal); hanya credentials demo + negative-path.

### A.6 Acceptance criteria E2E

- `bun run test:e2e` dari keadaan service mati → start semua, semua spec hijau atau ter-skip dgn alasan, exit 0, service mati lagi.
- Salah satu fix §8 di-regress (mis. hapus guard cron) → spec terkait merah, exit non-zero.
- Tidak menambah dependency runtime baru; `bun install` tidak berubah kecuali (mungkin) tidak sama sekali.
- Dokumentasi jalan di `e2e/README.md` + ringkas di root `README.md`/`testing.yaml`.

---

## Bagian B — Sisa Pekerjaan (dari PROJECT_AUDIT.md §8.6)

Diurut dari **dampak ↑ / usaha ↓**. Tiap item: keputusan yang dibutuhkan + rekomendasi lazy-senior.

### B.1 Rate limiter admin masih in-memory (Map module-level)
- **Keputusan:** tetap in-memory (single container) **atau** pindah ke store bersama.
- **Rekomendasi:** *tunda* sampai horizontal scaling nyata. Kalau sudah perlu: Postgres-backed sliding window (DB sudah ada) — **jangan** tambah Redis hanya untuk ini (dependency baru). Saat di-scale, Dokploy multi-replica baru butuh.
- **Effort:** kecil (Postgres) / sedang.

### B.2 `/chat/confirm` tanpa staged-action server-side
- **Keputusan:** desain tabel staged action (id acak, payload, expiry TTL, consumed flag, session binding).
- **Rekomendasi:** ini **paling berdampak** menutup celah replay/forgery di agentic flow. Tambah tabel `rag.staged_actions` + endpoint `/chat` mengembalikan `actionId` (bukan payload mentah), `/chat/confirm` hanya terima `actionId` + validasi belum consumed + belum expired + milik sesi. Guardrail panjang tetap sebagai lapis kedua.
- **Effort:** sedang (migrasi + 2 endpoint + consumer public-astro). **Prioritas tertinggi** dari sisa.

### B.3 rag-service `/chat` tanpa auth/rate-limit di level service
- **Keputusan:** sekarang dilindungi proxy public-astro (12/menit) + isolasi jaringan.
- **Rekomendasi:** tambah **in-memory token-bucket per-IP** sederhana di rag-service (mirip pola admin) + opsi shared secret header yang hanya diketahui proxy. Murah, tidak butuh store bersama karena rag-service single instance.
- **Effort:** kecil. Lakukan kalau port 3005 berisiko terekspos.

### B.4 Upload validasi MIME dari klien saja
- **Keputusan:** magic-byte sniffing + GCS key anti-tabrakan.
- **Rekomendasi:** baca 12 byte pertama untuk whitelist (png/jpg/webp/pdf), ganti key jadi `crypto.randomUUID()` + ekstensi dari sniffing (bukan dari filename). Admin-only jadi risiko rendah — jadwalkan, bukan darurat.
- **Effort:** kecil.

### B.5 `allowDangerousEmailAccountLinking: true` (Google)
- **Keputusan:** tetap atau cabut.
- **Rekomendasi:** kalau tidak ada alasan terdokumentasi, **cabut** dan andalkan email verified + `ADMIN_EMAILS`. Uji login admin setelahnya.
- **Effort:** sangat kecil (1 baris + uji).

### B.6 Deploy produksi tanpa health gate / rollback
- **Keputusan:** tambah health-check pasca `docker compose up` + rollback otomatis kalau gagal.
- **Rekomendasi:** di `scripts/docker-prod-up.sh`: setelah up, poll health tiap service; kalau gagal → `docker compose down` + checkout ref sebelumnya (atau minimal notif gagal jelas). Tanpa ini, deploy setengah jalan bisa terjadi.
- **Effort:** sedang.

### B.7 Seed `data/id_personal.json` mengandung PII asli
- **Keputusan:** klasifikasi — memang konten publik (nama/email portfolio) atau data privat yang tidak sengaja ke-commit.
- **Rekomendasi:** kalau privat → ganti dengan placeholder + `.gitignore` + rotasi; kalau publik → dokumentasikan eksplisit di seed README. **Butuh jawaban user.**
- **Effort:** sangat kecil setelah diputuskan.

### B.8 Aksesibilitas (a11y) — jangan disederhanakan
- **ResponsiveModal:** focus trap + kembalikan fokus ke pemicu saat tutup (ESC & backdrop). 
- **Presence toggles (links & ngl):** tambah `aria-expanded`, `aria-controls`, dan indikator status koneksi yang **tidak hanya warna** (teks/ikon + `aria-live="polite"`).
- **NGL submit feedback:** bungkus pesan sukses/error dengan `aria-live`.
- **Effort:** kecil–sedang per app. Bisa dipecah jadi 3 todo terpisah.

### B.9 Out-of-repo (bukan kode)
DNS `naufalrf.net`, Google OAuth redirect URI, `ALLOWED_ORIGINS`/`*_DOMAIN` produksi, dan (kalau jadi) secret produksi `CRON_SECRET`/`IP_HASH_SECRET`/`RAG_INGEST_SERVICE_TOKEN` di Dokploy.

---

## Urutan eksekusi yang direkomendasikan

1. **A — E2E skeleton + spec security-critical** (A.1–A.4, spec 1–3 & 5–7 dulu): mengunci semua fix §8 sebelum ada perubahan lagi.
2. **B.2 staged action** (risiko tertinggi yang tersisa) — setelah E2E hijau supaya ada pengaman saat ubah agentic flow.
3. **B.5 + B.4** (perubahan kecil, cepat menang).
4. **B.3 + B.1** (saat keputusan scaling diambil).
5. **B.6** (sebelum deploy produksi berikutnya).
6. **B.8 a11y** (paralel, per app).
7. **B.7** (menunggu keputusan user soal PII).

> Gate tiap langkah: typecheck + lint app yang disentuh, `bun test` packages/rag bila relevan, dan `bun run test:e2e` hijau sebelum lanjut item berikutnya.
