# Project Audit — naufalrf-portfolio monorepo

Generated: 2026-08-26. Bun workspace monorepo, 6 apps + 4 shared packages, 1 centralized Postgres (pgvector).

---

## 1. Apps/Services Overview

| App/Service | Path | Framework | Peran | DB Access | Auth |
|---|---|---|---|---|---|
| **admin** | apps/admin | Next.js 16.1.1 | Central API authority + dashboard | Ya — Drizzle+postgres langsung, owner schema utama | NextAuth v5 (Google OAuth allowlist) + env-gated demo bypass |
| **public-astro** | apps/public-astro | Astro 5 + React 19 | Portfolio publik, AI chatbot, booking, guestbook | Tidak — API-only ke admin | Guestbook OAuth sync via admin |
| **links-astro** | apps/links-astro | Astro 5 + React 19 | Link-in-bio hub (links.naufalrf.tech) | Tidak — API-only | none (public) |
| **ngl-svelte** | apps/ngl-svelte | SvelteKit 2 (Svelte 5) | Anonymous message app | Tidak — API-only | none, Turnstile captcha |
| **live-presence** | apps/live-presence | Bun native websocket | Ephemeral online/cursor presence, room-based | Tidak — no DB, no admin proxy | none |
| **rag-service** | apps/rag-service | Bun + Hono | RAG chatbot pipeline, ingest, agentic tools | Ya — langsung Postgres `rag` schema (pgvector) + internal API ke admin | `X-Service-Token` dua arah |
| **packages/contracts** | packages/contracts | TS types-only | Shared API response types | - | admin, public-astro, links-astro, ngl-svelte (rag-service **tidak** pakai) |
| **packages/http** | packages/http | TS utils-only | fetch helper, proxy header builder, error normalize | - | sama seperti contracts |
| **packages/design-tokens** | packages/design-tokens | CSS-only | shared dark-first design token | - | 4 frontend (admin, public, links, ngl) |
| **packages/tsconfig** | packages/tsconfig | config-only | strict TS base config | - | contracts, http, rag-service (via relative extends, tanpa workspace dep) |

Integrasi kunci: admin↔rag-service pakai `X-Service-Token` dua arah (`RAG_INGEST_SERVICE_TOKEN`/legacy `ADMIN_SERVICE_TOKEN` admin→rag, `ADMIN_INTERNAL_API_TOKEN` rag→admin). live-presence murni ephemeral, konsumen: public-astro, links-astro, ngl-svelte via websocket.

---

## 2. Modul Fitur — apps/admin

| Modul | Fungsi | Konsumen luar |
|---|---|---|
| Dashboard | overview stats/analytics | - |
| Projects | CRUD project + gallery + reorder + fix-content repair | public-astro |
| Blogs | CRUD blog + reorder | public-astro |
| About | profile/bio/skill/experience/freelance profile | public-astro, links-astro |
| Achievements | CRUD achievement + reorder | public-astro |
| Links | link-in-bio management + reorder | links-astro |
| Bookings | booking + slot bulk/copy + Google Calendar OAuth sync | public-astro (submit), admin (approve) |
| Contacts | inbox contact form + bulk update | public-astro (submit) |
| Messages | anonymous message inbox + location stats | ngl-svelte (submit) |
| Guestbook | entry + visibility moderation | public-astro |
| Chat Logs | log chatbot RAG, cron cleanup (7 hari) | rag-service (write via internal API) |
| Knowledge base | CRUD knowledge doc + trigger ingest per-doc | rag-service (`/ingest`) |
| Analytics | pageview/event/country/entity breakdown | semua frontend (proxy analytics) |
| Settings/LLM config | provider/model config, model list fetch | rag-service (baca via internal API) |
| Upload | file/image ke GCS | - |
| Auth | admin login (NextAuth) + public-auth sync/complete | public-astro (guestbook sign-in) |

## 3. Modul Fitur — Frontend Apps

| App | Modul/Fitur |
|---|---|
| public-astro | Home (hero+scene animasi morph terrain/circuit/flow/signal), About, Projects+detail, Blogs, AI Chatbot (RAG), Contact+Booking calendar, Guestbook (Turnstile+rate limit), Live cursor presence band, mock-data mode, SEO/sitemap |
| links-astro | Profile header, Link buttons, Social icon classify+normalize, Live presence pill, Theme toggle, Analytics proxy, error-state fallback profile |
| ngl-svelte | Form pesan anonim (max 500 char), Turnstile captcha, Analytics proxy, Live presence badge, Theme toggle |
| live-presence | Room-based join/move/ping/leave protocol, idle cleanup 15s, origin allowlist CORS, in-memory only, no persistence |

## 4. Modul Fitur — rag-service

| Modul | Fungsi |
|---|---|
| chat-service | orkestrasi turn: regex intent short-circuit, load history, query plan (LLM), tool exec opsional, hybrid retrieval, confidence-gated abstain, generate, persist log |
| ingest-service | chunk (paragraph-aware) + embed + upsert `rag.documents`/replace `rag.chunks`, SHA-256 hash tracking |
| repository | hybrid search dense (pgvector cosine) + lexical (ts_rank_cd), weight 0.7/0.3 |
| tool-service | freelance pricing quote + profile lookup (deterministic, en/id) |
| agentic-tools | stage/execute: submit_guestbook, send_message, create_booking → admin public endpoints |
| llm-provider | abstraksi OpenAI-compatible + Gemini, main→fallback retry |
| llm-config-service | fetch live config dari admin `/internal/llm-config`, cache 10s, fallback env |
| admin-client | internal API client (`X-Service-Token`) |

---

## 5. Skema Database Lengkap (Drizzle — `apps/admin/src/lib/db/schema.ts`)

Enums: `BookingStatus` (PENDING/CONFIRMED/CANCELLED/COMPLETED), `SlotStatus` (AVAILABLE/BOOKED/BLOCKED), `UserRole` (ADMIN/USER). `rag` = schema Postgres terpisah, `vector(1536)` pgvector custom type.

### Public schema tables

| Table | Kolom kunci | Relasi |
|---|---|---|
| `_prisma_migrations` | legacy leftover, tidak dipakai Drizzle | - |
| `chat_logs` | id, sessionId(unique), messages(jsonb), createdAt, updatedAt | - |
| `profile_links` | id, label, url, icon, visible, order | - |
| `knowledge_docs` | id, filename(unique), content, indexed | - |
| `users` | id, email(unique), name, image, role(enum) | has many accounts/sessions/guestbookEntries |
| `verification_tokens` | identifier+token(unique), expires | - |
| `contact_settings` | id, notificationEmail, blockedKeywords[] | - |
| `booking_settings` | notificationEmail, reminderEnabled/Day/Time, timezone, google_calendar_* (refresh_token, calendar_id/name, connected_email, granted_scopes[], connected_at) | - |
| `booking_availability` | dayOfWeek, startTime, endTime, enabled — unique(day,start,end) | - |
| `accounts` | userId FK→users(cascade), provider+providerAccountId(unique), oauth tokens | belongs to users |
| `sessions` | sessionToken(unique), userId FK→users(cascade), expires | belongs to users |
| `project_images` | projectId FK→projects(cascade), url, key, order, caption, alt | belongs to projects |
| `booking_slots` | date+time(unique), duration, status(enum) | has one bookings |
| `anonymous_messages` | content, ipHash, metadata(jsonb), read, geo (city/country/countryCode/ipAddress/region) | - |
| `analytics_events` | page, entityType, entityId, eventType, data(jsonb), userSession, geo | - |
| `bookings` | name/email/phone/notes, metadata, status(enum), slotId FK→booking_slots(unique, set null), ipHash, geo | belongs to booking_slots |
| `contact_forms` | name/email/subject/message, ipHash, metadata, read, replied, geo | - |
| `guestbook_entries` | userId FK→users(cascade), message, ipHash, metadata, reactions(jsonb), visible, geo | belongs to users |
| `projects` | title, slug(unique), summary, description, category, techStack[], liveUrl, repoUrl, imageUrl, featured, visible, order, content, thumbnailId, startDate/endDate, projectDate, tags[] | has many project_images |
| `BlogLink` | url, title, description, imageUrl, source, category, tags[], publishedAt, visible, order — **tidak ada index** | - |
| `AboutMe` | fullName, tagline, roles[], shortBio, bio, email, phone, location, avatarUrl, resumeUrl, availabilityStatus, skills(jsonb, was text[]), experience(jsonb), socialLinks(jsonb), freelanceProfile(jsonb) | single-row |
| `achievements` | name, location, monthYear, photos[], description, externalUrl, order, visible | - |
| `llm_settings` | main_provider/base_url/api_key/model, fallback_*, embedding_provider/base_url/api_key/model/dimension(default 1536) | single-row, kolom api_key = secret |

### `rag` schema (pgvector)

| Table | Kolom kunci | Relasi |
|---|---|---|
| `rag.documents` | source_type+source_ref(unique), title, visibility, sensitivity, storage_key, mime_type, status, tags(jsonb), metadata(jsonb), content_hash, content_excerpt, last_ingested_at | has many chunks, ingestion_runs |
| `rag.chunks` | document_id FK→documents(cascade), chunk_index+document_id(unique), source_type/ref, visibility, content, **contextual_content (NOT NULL)**, token_count, checksum, metadata, embedding vector(1536) | belongs to documents |
| `rag.ingestion_runs` | document_id FK→documents(set null), trigger_type, request_payload(jsonb), status, chunks_written, error_message, started_at, completed_at | belongs to documents (nullable) |

### Migration history (`apps/admin/drizzle/*.sql`)

| # | File | Ringkasan |
|---|---|---|
| 0000 | high_photon | Baseline: 23 tabel + enums + ~35 index/FK |
| 0001 | grey_invaders | RAG v1: tabel `rag_sources` (public schema) — **dibuang lagi** |
| 0002 | slippery_moira_mactaggert | Revert RAG v1 (drop `rag_sources` + enum) |
| 0003 | smart_wild_pack | RAG v2: enable vector ext, schema `rag`, buat chunks/documents/ingestion_runs, HNSW index |
| 0004 | huge_silver_fox | Tambah `AboutMe.shortBio` |
| 0005 | polite_tony_stark | Drop `project_contexts` table + enum (fitur dibuang) |
| 0006 | fair_interactions | Tambah `metadata`/`ipHash` ke anonymous_messages/bookings/contact_forms/guestbook_entries |
| 0007 | nifty_exodus | Tambah `AboutMe.freelanceProfile`; ulang kolom 0006 (idempotent) |
| 0008 | wild_red_hulk | Tabel `llm_settings`; `AboutMe.skills` text[]→jsonb; 6 kolom Google Calendar |
| 0009 | productive_lady_vermin | Set `DEFAULT gen_random_uuid()` pada id rag.* tables |
| 0010 | parallel_lady_shuma | `rag.chunks.contextual_content` jadi nullable (temporary) |
| 0011 | skinny_dreadnoughts | Re-impose NOT NULL `contextual_content`; default llm_settings embedding; re-assert vector(1536) |

**Catatan**: `project_contexts` table pernah ada (migrasi 0000), didrop di 0005 — fitur "per-project structured context" sudah dibuang total, tidak ada sisa di schema.ts.

---

## 6. Inventory API Route Lengkap

### admin — Auth & Cron

| Path | Method | Fungsi |
|---|---|---|
| `/api/auth/[...nextauth]` | NextAuth handler | session/signin/callback |
| `/api/cron/cleanup-chatlogs` | GET, POST | hapus chat log >7 hari, guard `CRON_SECRET` |

### admin — Public tier (`/api/v1/public/*`)

| Path | Method | Konsumen |
|---|---|---|
| `/about` | GET | public-astro, links-astro |
| `/achievements` | GET | public-astro |
| `/analytics` | POST | semua frontend (proxy) |
| `/auth/complete` | GET | public-astro |
| `/auth/sync` | POST | **⚠️ orphan, tidak dipanggil siapapun** |
| `/blogs` | GET | public-astro |
| `/bookings/available` | GET | public-astro |
| `/bookings` | POST | public-astro, rag-service (agentic) |
| `/contact` | POST | public-astro |
| `/guestbook` | GET, POST | public-astro, rag-service (agentic) |
| `/links` | GET | links-astro |
| `/messages` | POST | ngl-svelte, rag-service (agentic) |
| `/projects` | GET | public-astro |
| `/projects/[slug]` | GET | public-astro |

### admin — Internal tier (`/api/v1/internal/*`) — service-to-service

| Path | Method | Fungsi |
|---|---|---|
| `/chat-logs` | GET, POST | rag-service simpan/baca log |
| `/content` | GET | rag-service export content utk ingest |
| `/intent-context/freelance-profile` | GET | rag-service ambil profil freelance |
| `/knowledge/[id]/indexed` | PATCH | rag-service tandai indexed |
| `/knowledge/[id]` | GET | rag-service ambil 1 doc |
| `/knowledge` | GET | rag-service list doc |
| `/llm-config` | GET | rag-service ambil config LLM aktif |

### admin — Admin tier (`/api/v1/admin/*`) — ~50 route, ringkasan per modul

about, achievements(+reorder), analytics(+countries/entities/events/overview/page-views), blogs(+reorder), booking-settings(+google connect/callback/calendars/disconnect), bookings(+calendar/[id]/status), booking-slots(+bulk/copy), chat-logs, contacts(+bulk), contact-settings, guestbook(+visibility), knowledge(+ingest), links(+reorder), llm-config(+models), messages(+read/stats/locations), projects(+content/images/fix-content), stats, upload — semua CRUD standard, auth-gated ADMIN role.

### rag-service (Hono)

| Path | Method | Fungsi |
|---|---|---|
| `/health` | GET | health check |
| `/chat` | POST | chat turn |
| `/chat/confirm` | POST | eksekusi agentic tool (guestbook/message/booking) |
| `/ingest` | POST | trigger ingest, guard `X-Service-Token` |

### live-presence (Bun.serve)

| Path | Method | Fungsi |
|---|---|---|
| `/health` | GET, OPTIONS | health + room count |
| `/ws` | upgrade | websocket presence room |

### Proxy lokal (frontend → admin/rag)

| App | Path lokal | Target |
|---|---|---|
| public-astro | `/api/analytics`, `/api/bookings`, `/api/bookings/available`, `/api/contact`, `/api/guestbook`, `/api/auth/guestbook-start` | admin public/* |
| public-astro | `/api/rag/chat`, `/api/rag/chat/confirm` | rag-service |
| links-astro | `/api/analytics` | admin public/analytics |
| ngl-svelte | `/api/analytics` | admin public/analytics |

**Cross-check hasil**: tidak ada broken contract (semua path yang dipanggil consumer ada di admin). Hanya 1 orphan: `/api/v1/public/auth/sync` — didefinisikan tapi tak pernah dipanggil app manapun (kemungkinan dead code / webhook belum diwire).

**Catatan (2026-08-26)**: `POST /api/v1/admin/messages` dulu ter-export tanpa `withAdminAuth` — bukan orphan, tapi auth bypass. Sudah difix, lihat §8.

---

## 7. Checklist Inkonsistensi (terverifikasi via grep/read, bukan spekulasi)

**Update 2026-08-26: 5 doc drift dibawah sudah difix (9 file diedit).** Sisa: 1 bug kode nyata belum difix (butuh keputusan/patch kode, bukan doc), 1 dead-code decision pending, 1 gap dokumentasi opsional.

- [x] **FIXED — HIGH — `.context` docs bilang `reset:seed` broken, padahal sudah fix.** ~~`.context/base/tech-stack.yaml:15`, `workflow.yaml:14`, `requirements.yaml:21`, `.context/README.md:32,39` klaim `./reset-seed-rag.sh` hilang.~~ Realita: root `package.json` `reset:seed` → `bash ./scripts/docker-dev-reset-seed.sh`, file **ada**. **Diperbaiki**: 4 file diupdate, wording sekarang bilang command ini valid/jalan.
- [x] **FIXED — HIGH — RAG bug nyata: `rag.chunks.contextual_content` NOT NULL tapi rag-service insert tidak mengisi kolom itu.** Migrasi 0011 re-impose NOT NULL tanpa DB-level default; `apps/rag-service/src/repository.ts` (`replaceChunks`) INSERT dulu tanpa `contextual_content` → constraint violation tiap chunk write. Investigasi: kolom ini dead/write-only, tidak ada read path (grep bersih di seluruh `apps/rag-service/src` dan `apps/admin/src`), jadi diisi `chunk.content` (sama seperti kolom `content`) daripada migrasi nullable-lagi (hindari resiko `drizzle-kit migrate` yang punya riwayat silent-fail di repo ini). Param `$N` INSERT direnumber, dicek posisi 1:1 oleh qa-reviewer. **Runtime-verified**: test langsung ke Postgres dev nyata (`portfolio-nopal-dev-db-1`) — `upsertDocument`+`replaceChunks` dengan data dummy, insert sukses tanpa NOT NULL violation, readback konfirmasi `contextual_content == content` untuk semua row, cleanup bersih. `tsc --noEmit` clean, 17 test lama masih pass. File diubah: `apps/rag-service/src/repository.ts` saja (scope dicek via `git diff --stat`).
- [x] **FIXED — HIGH — dokumentasi AI stack rag-service salah total.** ~~`.context/base/tech-stack.yaml` (`rag_service.ai_stack`) dan `apps/rag-service/AGENTS.md:23` masih bilang "Google Gemini (`GEMINI_API_KEY`)".~~ Realita sejak commit `8e4e491`: default provider openai-compatible, `text-embedding-3-small`, `gpt-4o-mini`, `OPENAI_API_KEY`, Gemini masih didukung sebagai provider alternate lewat abstraksi yang sama. **Diperbaiki**: kedua file diupdate ke wording multi-provider (openai-compatible default + Gemini alternate).
- [x] **FIXED — MEDIUM — root `build`/`typecheck` script docs stale.** ~~`.context/base/tech-stack.yaml:11,13`, `workflow.yaml:4,6`, `testing.yaml` klaim build exclude rag-service & typecheck cuma filter admin.~~ Realita: build **include** rag-service, typecheck **3 filter** (admin+ngl-svelte+rag-service). **Diperbaiki**: 3 file (tech-stack.yaml, workflow.yaml, testing.yaml) diupdate ke deskripsi yang benar.
- [x] **FIXED — MEDIUM — `security.yaml` & `apps/admin/AGENTS.md:79` masih sebut `AUTH_TRUST_HOST`.** Var ini sudah dihapus commit `94f6306`, sudah tidak ada di kode (`grep` kosong). **Diperbaiki**: bullet stale dihapus dari kedua file.
- [x] **FIXED — MEDIUM — `apps/public-astro/AGENTS.md:73` refer ke `NeuButton.tsx` yang sudah tidak ada.** File sudah direname jadi Card/Button/Badge, AGENTS.md tidak diupdate. **Diperbaiki**: baris diganti jadi catatan bahwa rename Neu*→Card/Button/Badge/Input/Textarea sudah selesai.
- [x] **LOW — PROGRESS.md sebut nama file migrasi yang sudah tidak match.** Contoh: PROGRESS.md sebut `0008_talented_skill_categories.sql` & `0009_google_calendar_connect.sql`, file di disk sekarang `0008_wild_red_hulk.sql` & `0009_productive_lady_vermin.sql` (drizzle-kit random rename, isi sama). Historical log, tidak diubah — biarkan sebagai jejak progres lama, bukan doc rujukan aktif.
- [x] **LOW/operational risk — `drizzle-kit migrate` pernah silently fail** (dicatat di PROGRESS.md 2026-08-18): transaksi abort setelah NOTICE "already exists" tapi spinner tidak tampilkan error asli, journal jadi kosong padahal DDL sebagian jalan. Workaround manual (`psql` langsung + seed journal manual) sudah dipakai sekali — risiko berulang kalau migrate lagi tanpa awas. Tidak ada fix kode untuk ini, cuma catatan waspada operasional.
- [ ] **LOW, informational — rag-service tidak pakai `@naufalrf/contracts`/`@naufalrf/http`.** Bukan bug (semua endpoint yang dipanggil valid, tidak ada broken contract), tapi juga tidak didokumentasikan alasannya kenapa beda dari 4 app lain yang konsisten pakai shared package. Belum ditulis dokumentasinya — opsional.
- [ ] **Bukan masalah — env var alias, naming `neu-*`, lockfile policy, TODO/FIXME grep**: semua konsisten dengan dokumentasi, sudah dicek eksplisit, tidak ada drift.
- [ ] **Info — `/api/v1/public/auth/sync` orphan endpoint**, tidak dipanggil consumer manapun. Cek apakah masih dibutuhkan atau dead code kandidat cleanup. Belum ada keputusan.

### Doc yang sudah diedit sesi ini (9 file)
`.context/base/tech-stack.yaml`, `.context/base/workflow.yaml`, `.context/base/requirements.yaml`, `.context/README.md`, `.context/base/testing.yaml`, `.context/base/security.yaml`, `apps/admin/AGENTS.md`, `apps/public-astro/AGENTS.md`, `apps/rag-service/AGENTS.md`.

### Sisa kerja
Semua temuan HIGH/MEDIUM sudah selesai (5 doc drift + 1 bug kode, semua diverifikasi). Sisa cuma item low-priority/opsional:
1. Putuskan nasib `/api/v1/public/auth/sync` (dead code atau selesaikan wiring).
2. Dokumentasikan (opsional) kenapa rag-service skip shared packages contracts/http.

---

## 8. Audit Keamanan & Konsistensi Menyeluruh (2026-08-26, sesi kedua)

Audit lanjutan: 4 explore agent paralel (admin API surface, rag-service, frontend+proxy, infra/scripts), setiap temuan HIGH/MED diverifikasi ulang manual sebelum dipatch. Semua item dibawah **sudah difix dan diverifikasi runtime**, bukan sekadar dibaca.

### 8.1 HIGH — sudah difix

- [x] **Auth bypass: `POST /api/v1/admin/messages` tidak ter-guard.** `GET` dibungkus `withAdminAuth`, `POST` di-export mentah (`export const POST = handlePost`) → siapapun bisa insert `anonymous_messages` lewat namespace admin, tanpa rate limit, tanpa Turnstile. **Fix**: `export const POST = withAdminAuth(handlePost)`.
- [x] **Cron fail-open: `/api/cron/cleanup-chatlogs` menerima semua request kalau `CRON_SECRET` unset.** Guard lama `if (CRON_SECRET && authHeader !== ...)` → kalau env kosong, kondisi selalu false dan endpoint delete chat log terbuka untuk publik (GET maupun POST). **Fix**: `if (!CRON_SECRET || authHeader !== ...)` — fail-closed. `CRON_SECRET` ditambahkan ke `apps/admin/.env.example`.
- [x] **IP spoofing membatalkan seluruh rate limiting publik.** `packages/http` mem-forward `x-forwarded-for`/`x-real-ip`/`x-vercel-forwarded-for`/`cf-connecting-ip` apa adanya dari browser, lalu `submission-context.ts` mengambil **hop pertama** dari chain itu untuk key rate limiter, ipHash, dan atribusi geo. Konsekuensi: attacker cukup rotasi header per request → limit contact/guestbook/booking/messages/analytics/RAG-chat lolos semua, dan data geo bisa diracuni. **Fix dua sisi**: (a) `buildProxyHeaders` tidak lagi merelay header IP milik klien, sekarang menerima `clientAddress` (socket IP asli) dan menempelkannya sebagai hop terakhir; kalau tidak ada socket IP tepercaya, header `x-forwarded-for` di-**drop** total. (b) Admin `getClientIp` sekarang membaca **hop terakhir** (yang ditulis proxy tepercaya), bukan hop pertama yang dikendalikan klien. Semua 9 call site ikut diupdate memakai Astro `clientAddress` / SvelteKit `getClientAddress()`.
- [x] **Open redirect protocol-relative di flow auth guestbook.** `guestbook-start.ts` menerima `callbackUrl` asal diawali `/`; `//attacker.example` lolos cek dan `new URL()` meresolusinya ke origin eksternal. **Fix**: tolak juga prefix `//`.
- [x] **live-presence tanpa batas resource sama sekali.** Tidak ada cap koneksi, cap room, cap peserta per room, maupun cek ukuran frame — satu klien bisa bikin room tak terhingga dan mem-broadcast state ke semua socket. **Fix**: `MAX_SOCKETS=500` (upgrade ditolak 503), `MAX_ROOMS=32` (room diluar allowlist `public-home`/`links-home`/`ngl-home` jatuh ke room default saat kuota penuh), `MAX_ROOM_PARTICIPANTS=200`, `MAX_MESSAGE_BYTES=4096` (frame lebih besar diabaikan diam-diam, tidak crash).
- [x] **rag-service `/chat` & `/chat/confirm` tanpa batas input.** Pesan chat tak terbatas panjangnya (biaya LLM/embedding bisa diledakkan), `sessionId` diterima mentah string apapun. **Fix**: `MAX_CHAT_MESSAGE_LENGTH=2000`, `sessionId` harus cocok `/^[A-Za-z0-9_-]{8,64}$/` (kalau tidak, diabaikan dan service generate UUID baru — tidak bocor ke history orang lain).
- [x] **Agentic tool bisa dipakai spam Admin lewat `/chat/confirm`.** Executor guestbook/message/booking mengirim payload apapun yang dikasih pemanggil, dengan `turnstileToken: ""`. **Fix**: validasi panjang & isi di sisi executor sebelum hit Admin — guestbook/message max 500 char + wajib non-empty, booking menolak nama placeholder dan membatasi slotId/name/email/phone/notes.
- [x] **Webhook deploy: body tanpa batas + delivery ID dipakai mentah sebagai nama file.** `Content-Length` dibaca langsung ke `read()` (OOM/`ValueError`), dan `X-GitHub-Delivery` — header yang tidak dilindungi HMAC — jadi path filesystem (`DELIVERY_DIR / delivery_id`), membuka path traversal. **Fix**: batas body 5 MiB + validasi `Content-Length`, dan delivery ID di-SHA-256 dulu sebelum jadi nama marker.

### 8.2 MEDIUM — sudah difix

- [x] **`hashIp` unsalted SHA-256 dipotong 64-bit** → ruang alamat IPv4 kecil, hash bisa dibalik dengan enumerasi. **Fix**: HMAC-SHA256 dengan `IP_HASH_SECRET` (env baru, didokumentasikan) dan panjang dinaikkan ke 32 hex char; tanpa secret tetap jalan (fallback SHA-256) supaya tidak breaking.
- [x] **Schema contact publik tanpa batas panjang.** `name`/`subject`/`message` cuma `min(1)` → payload raksasa masuk DB dan email. **Fix**: max 100/200/5000, email 255, turnstileToken 2048.
- [x] **Analytics `data` jsonb tak terbatas.** Tidak ada batas jumlah key maupun panjang value. **Fix**: key max 64 char, value string max 500, maksimal 20 key.
- [x] **Port docker dev bind ke `0.0.0.0`** termasuk Postgres yang password-nya literal `portfolio` → database terbuka ke seluruh LAN. **Fix**: semua 7 port di `docker-compose.dev.yml` dibind ke `127.0.0.1`.
- [x] **`start-dev.sh` menyembunyikan kegagalan service.** `bash -lc "$cmd" | sed ...` tanpa `pipefail` → `wait` bisa sukses padahal app mati. **Fix**: `bash -o pipefail -lc`.
- [x] **`/health` live-presence membocorkan state operasional** (`roomCount`, `port`) ke siapapun. **Fix**: balas `{ ok: true }` saja.
- [x] **Token `/ingest` dibandingkan dengan `===`** (timing leak). **Fix**: `timingSafeEqual` setelah cek panjang. Perilaku fail-closed saat token unset dipertahankan.
- [x] **links-astro menampilkan `error.message` mentah ke user** — bocor detail endpoint/timeout internal. **Fix**: pesan generic, exception tetap di-`console.error` server-side.

### 8.3 Drift konfigurasi lintas app — sudah difix

- [x] `Navbar.astro` memakai `PRESENCE_SOCKET_URL` sementara `BaseLayout.astro` memakai `PUBLIC_CURSOR_WS_URL` → kalau cuma satu yang diset, navbar diam-diam fallback ke localhost. Sekarang keduanya `PUBLIC_CURSOR_WS_URL`.
- [x] `.env.example` links-astro & ngl-svelte tidak mencantumkan `PUBLIC_CURSOR_WS_URL` padahal dibaca kodenya — ditambahkan.
- [x] `apps/live-presence/.env.example` hanya melist origin port 3000, sehingga developer yang menyalin file itu apa adanya memblokir links (3002) dan ngl (3003) — dilengkapi ketiganya.
- [x] `CRON_SECRET`, `IP_HASH_SECRET`, `NEXT_PUBLIC_APP_URL` dipakai kode tapi tidak ada di `.env.example` manapun — didokumentasikan.

### 8.4 Migrasi domain `naufalrf.tech` → `naufalrf.net`

80 occurrence di 27 file source/config diganti (env example, astro config, llms.txt, robots/sitemap, seed, email template, presence origin allowlist, mock-data, konstanta). Build artifact (`dist/`, `build/`, `.astro/`, `.next/`) sengaja tidak disentuh karena regenerated. **Perlu tindak lanjut diluar repo**: DNS, OAuth redirect URI Google, dan `ALLOWED_ORIGINS`/`*_DOMAIN` di environment produksi.

### 8.5 Sudah dicek — bukan masalah

- **SQL injection**: bersih di admin dan rag-service. `sql.unsafe` di `repository.ts` memakai statement statik dengan bound parameter `$1..$n`; interpolasi Drizzle terparameterisasi.
- **Internal tier `/api/v1/internal/*`**: `withServiceAuth` konsisten di semua route, fail-closed saat token unset, sudah `timingSafeEqual`.
- **Turnstile**: benar-benar diverifikasi server-side ke Cloudflare siteverify, wajib di produksi. (Hardening opsional yang belum dilakukan: validasi `hostname`/`action` pada response, sekarang hanya cek `success`.)
- **Admin tier**: seluruh route lain sudah ter-guard `withAdminAuth`/cek eksplisit role ADMIN; hanya messages POST yang bolong dan itu sudah difix.
- **S.S.R.F pada proxy**: tidak ada. Target URL selalu konstanta dari env, tidak pernah diturunkan dari body/query user.
- **Secret di bundle klien**: tidak ada. Semua `PUBLIC_*` hanya site key Turnstile, GA measurement ID, dan URL — tidak ada secret.
- **Shared package**: tidak ada export mati. `Project` alias di contracts memang sengaja dipertahankan sebagai legacy.

### 8.6 Sisa kerja (belum dikerjakan, butuh keputusan)

1. **Rate limiter admin masih in-memory per proses** (`Map` module-level) — hilang saat restart dan tidak dibagi antar replica. Aman untuk deployment single-container sekarang, tapi harus pindah ke store bersama (Redis/edge limiter) begitu di-scale horizontal.
2. **`/chat/confirm` masih tanpa staged-action server-side.** Payload dibawa klien, jadi tidak ada TTL, single-use, maupun ikatan ke sesi yang menstage aksi. Guardrail panjang/isi sudah dipasang sebagai mitigasi, tapi solusi benar adalah tabel staged action (id acak, expiry, consumed flag) — perubahan desain, bukan patch.
3. **rag-service `/chat` tidak punya auth/rate limit di level service.** Perlindungan sekarang bergantung pada proxy public-astro (12 req/menit) + isolasi jaringan. Kalau port 3005 pernah terekspos publik, wajib tambah limiter sendiri.
4. **Upload memvalidasi MIME dari klien**, tanpa magic-byte sniffing; key GCS pakai `Date.now()`+nama file sehingga bisa tabrakan. Rendah risiko (route admin-only), tapi layak diperbaiki.
5. **`allowDangerousEmailAccountLinking: true`** pada provider Google — tidak ada bypass langsung karena email verified + allowlist `ADMIN_EMAILS` tetap dicek, tapi konfigurasi ini melemahkan proteksi account-linking Auth.js tanpa alasan terdokumentasi.
6. **Deploy produksi tanpa health gate / rollback.** `set -euo pipefail` menghentikan langkah berikutnya, tapi tidak membatalkan `docker compose up` yang sudah jalan — bisa berakhir setengah ter-deploy.
7. **Seed `data/id_personal.json` berisi PII asli** (nama, telepon, email, lokasi). Kalau memang konten portfolio publik, klasifikasikan eksplisit; kalau tidak, jangan di-track.
8. **Aksesibilitas**: `ResponsiveModal` belum punya focus trap/restore; toggle presence di links & ngl belum punya `aria-expanded`/`aria-controls` dan status koneksi hanya diwakili warna; feedback submit NGL belum `aria-live`.

### 8.7 Verifikasi yang dijalankan

- `bun run typecheck` admin — clean. `bun run lint` admin — clean.
- `bun run typecheck` rag-service — clean. `bun test` rag-service — 17 pass.
- `bun test` packages/http — 26 pass (1 test lama diupdate karena mengunci perilaku relay XFF yang sengaja dihapus, ditambah 3 test baru untuk kontrak socket-IP). packages/contracts — 9 pass.
- `bun run build` public-astro & links-astro — sukses. `bun run check` ngl-svelte — 0 error.
- **Runtime**: live-presence dijalankan nyata (health minimal, origin asing ditolak 403, frame 9 KB diabaikan tanpa crash, join multi-room jalan). rag-service dijalankan nyata (`/ingest` tanpa/salah token → 401, token benar lolos auth, pesan 2500 char ditolak 400, sessionId `../../etc/passwd` diabaikan tanpa error, guestbook 900 char ditolak, booking nama `you` ditolak). Rantai XFF diuji langsung: spoof `6.6.6.6, 7.7.7.7` + socket `203.0.113.9` → admin mengambil `203.0.113.9`; tanpa socket tepercaya header di-drop.

### 8.8 File yang diubah sesi ini

**Keamanan**: `apps/admin/src/app/api/v1/admin/messages/route.ts`, `apps/admin/src/app/api/cron/cleanup-chatlogs/route.ts`, `apps/admin/src/lib/utils/hash.ts`, `apps/admin/src/lib/api/submission-context.ts`, `apps/admin/src/app/api/v1/public/contact/route.ts`, `apps/admin/src/lib/validations/analytics.schema.ts`, `packages/http/src/index.ts`, `packages/http/__tests__/index.test.ts`, `apps/rag-service/src/index.ts`, `apps/rag-service/src/agentic-tools.ts`, `apps/live-presence/src/server.ts`, `apps/public-astro/src/pages/api/auth/guestbook-start.ts`, `scripts/github_webhook_server.py`, `docker-compose.dev.yml`, `start-dev.sh`.

**Proxy client-IP threading**: `apps/public-astro/src/lib/submission-context.ts`, `apps/public-astro/src/pages/api/{analytics,contact,bookings,guestbook}.ts`, `apps/public-astro/src/pages/api/rag/chat.ts`, `apps/public-astro/src/pages/api/rag/chat/confirm.ts`, `apps/links-astro/src/lib/analytics.ts`, `apps/links-astro/src/pages/api/analytics.ts`, `apps/ngl-svelte/src/lib/api.ts`, `apps/ngl-svelte/src/routes/+page.server.ts`, `apps/ngl-svelte/src/routes/api/analytics/+server.ts`.

**Konsistensi/env**: `apps/public-astro/src/components/layout/Navbar.astro`, `apps/links-astro/src/pages/index.astro`, `apps/admin/.env.example`, `apps/links-astro/.env.example`, `apps/ngl-svelte/.env.example`, `apps/live-presence/.env.example`.
