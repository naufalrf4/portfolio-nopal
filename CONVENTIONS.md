# Conventions

## 1. Naming Convention

- **File**: `kebab-case.ts` untuk service/route/schema (`notification-outbox.service.ts`, `anonymous-message.schema.ts`), tapi `camelCase.ts` untuk service lama/util (`emailService.ts`, `geoIpService.ts`, `useMessages.ts`). Kedua gaya hidup berdampingan — pilih salah satu secara konsisten per folder baru, jangan campur dalam satu folder.
- **Komponen React**: `PascalCase.tsx`, nama file = nama export (`MessageCard.tsx` → `export function MessageCard`).
- **Hook**: `useXxx.ts`, satu hook = satu file, di-barrel lewat `hooks/index.ts`.
- **Service class**: `PascalCase` class + instance singleton lowerCamel dengan nama sama:
  ```ts
  export class AnonymousMessagesService { /* ... */ }
  export const anonymousMessagesService = new AnonymousMessagesService();
  ```
- **Schema Zod**: `xxxSchema` (`createEntitySchema`, `updateStatusSchema`), tipe hasil inferensi `XxxInput`:
  ```ts
  export const createEntitySchema = z.object({ /* ... */ });
  export type CreateEntityInput = z.infer<typeof createEntitySchema>;
  ```
- **Constant**: `UPPER_SNAKE_CASE` untuk nilai tetap tunggal (`INSTAGRAM_STORY_WIDTH`), object konfigurasi tetap `UPPER_SNAKE_CASE` dengan `as const` (`STORY_DARK_PALETTE`).
- **Boolean/flag variable**: prefiks `is`/`has`/`should` jarang dipaksakan tapi ketika ada — konsisten (`markingAllRead`, `loading`, bukan `isLoading` — proyek ini lebih sering pakai nama state polos tanpa prefiks `is`).
- **Folder**: selalu plural untuk domain (`messages`, `bookings`, `contacts`), singular untuk kategori teknis (`components`, `hooks`, `types`, `utils`, `constants`, `services`).

## 2. Struktur Folder/Organisasi Module

Hybrid **feature-based** (UI) + **layer-based** (infra), bukan murni satu pendekatan:

```
src/
  app/                       # Next.js routing murni (page.tsx, route.ts) — tipis, delegasi ke features/lib
    api/v1/{admin,public,internal}/<resource>/route.ts
    (dashboard)/<resource>/page.tsx
  features/<domain>/         # UI + client logic per domain
    components/
    hooks/
    types/
    constants/
    utils/
    __tests__/
    index.ts                 # barrel export
  lib/
    api/{handlers,responses,middleware,utils}/   # server-side: service class, response helper, auth middleware
    validations/              # zod schema, satu file per resource
    services/                 # cross-cutting service (email, geo-ip, rate-limit, notifikasi)
    db/                       # schema & client
    utils/                    # helper generik (logger, date, string)
```

Aturan pemisahan: `app/api/**/route.ts` hanya orkestrasi (auth wrapper → parse body → panggil service → bungkus response). Business logic & query DB tinggal di `lib/api/handlers/*.service.ts`. Client-side state/efek tinggal di `features/<domain>/hooks`. Tidak ada logic Drizzle di komponen React.

Route API dibagi 3 namespace eksplisit: `admin` (butuh sesi admin), `public` (tanpa auth), `internal` (service-to-service token). Ini konsisten dan sengaja.

## 3. Gaya Penulisan Komentar

- **Densitas sangat rendah.** Mayoritas file tanpa komentar sama sekali — logic diharapkan self-explanatory lewat naming.
- Komentar hanya muncul untuk: (a) alasan non-obvious/workaround (mis. kenapa fallback insert tanpa kolom metadata dilakukan), (b) constant ajaib yang butuh konteks, (c) TODO/catatan migrasi jarang dipakai.
- Tidak ada JSDoc block di function biasa. Tidak ada comment banner pemisah section.
- Kalau perlu jelasin "kenapa", taruh sebagai komentar satu baris tepat di atas baris terkait — bukan paragraf panjang di atas function.

```ts
// hanya kalau perilaku tidak jelas dari nama fungsi/variabel
if (!isMissingMetadataColumnError(error)) {
  throw error;
}
```

## 4. Pattern Error Handling

- **Try/catch lokal di setiap route handler**, tangkap generik lalu map ke response helper — tidak melempar error mentah ke client:
  ```ts
  try {
    const parsed = createEntitySchema.parse(body);
    const result = await entityService.create(parsed);
    return successResponse(result, 'Created successfully');
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationErrorResponse(error);
    }
    return serverErrorResponse();
  }
  ```
- Ada dua lapis: response helper sederhana (`successResponse`/`errorResponse`/`notFoundResponse`/`validationErrorResponse`/`serverErrorResponse`) untuk kasus umum, dan `handleApiError` (klasifikasi by error type + logging terstruktur) untuk kasus yang butuh audit trail lebih detail. Pilih salah satu per route secara konsisten, jangan campur keduanya di satu handler.
- Response envelope selalu seragam: `{ success: boolean, data | error, message? }`.
- Di client (hooks), error di-catch, di-log lewat logger util, lalu ditampilkan sebagai toast — tidak pernah throw ke UI:
  ```ts
  } catch (error) {
    logger.error('Failed to update entity', error);
    toast.error('Failed to update entity');
  }
  ```
- Abort/cancel fetch dibedakan dari error asli (`error.name !== 'AbortError'`) supaya tidak salah tampil toast saat unmount.
- Service layer melempar error apa adanya (tidak menelan); hanya membungkus jika ada kondisi spesifik yang perlu fallback logic (retry tanpa kolom optional, dsb).

## 5. Konvensi Import/Dependency

- **Alias absolut `@/*` → `src/*`** untuk semua lintas-folder; import relatif (`./`, `../`) hanya dipakai dalam satu feature/folder yang sama.
  ```ts
  import { withAdminAuth } from '@/lib/api/middleware/auth';
  import type { Entity, FilterTab } from '../types/entity.types';
  ```
- Urutan import tidak di-lint ketat tapi pola yang konsisten: (1) library eksternal (`next/server`, `react`, `zod`, package pihak ketiga), (2) alias internal `@/...`, (3) relative import lokal, (4) `import type` dipisah/diletakkan di antara sesuai kebutuhan (kadang inline `import type {X} from 'y'`, kadang gabung `import { z } from 'zod'` biasa saja).
- Barrel file (`index.ts`) dipakai di level `components/`, `hooks/`, dan root `features/<domain>/index.ts` untuk re-export publik — konsumen dari luar folder impor lewat barrel, bukan file dalam.
- Tidak ada default export untuk service/util/hook — semua named export. Default export dipakai murni untuk Next.js page/layout/route sesuai requirement framework.

## 6. Gaya Penulisan Test

- Runtime: **`bun:test`** (`describe`, `it`/`test`, `expect`) — bukan Jest/Vitest langsung diimpor.
- File test: `xxx.test.ts(x)` di folder `__tests__/` sejajar dengan kode yang diuji (`features/<domain>/__tests__/`, `lib/services/__tests__/`).
- Nama test ditulis sebagai kalimat perilaku (behavior sentence), bukan `it('should ...')`:
  ```ts
  test('escapes message content without relying on the DOM', () => { ... });
  it('defers a 429 response and stops before the next queued delivery', async () => { ... });
  ```
- **Mocking pattern**: tidak pakai mocking library berat (jest.mock dsb) — pakai **manual fake/harness object** yang implement interface yang sama dengan dependency asli, di-inject via constructor/parameter:
  ```ts
  function createHarness(rows: readonly Row[]) {
    const sent: { id: string }[] = [];
    const database: DispatchDatabase = {
      withClaimedPending: async (limit, handler) => handler(rows.slice(0, limit), {
        markSent: async (id) => { sent.push({ id }); },
      }),
    };
    return { service: new Service(database), sent };
  }
  ```
- Assertion lebih suka `toEqual` pada object hasil utuh daripada banyak assertion kecil terpisah — satu snapshot logis per test.
- Test menguji **kontrak/output**, bukan implementasi detail (mis. cek string HTML yang dihasilkan mengandung/tidak mengandung token tertentu, bukan cek internal call count berlebihan).

## 7. Konvensi API/Interface Design

- **REST via Next.js route handler** (`route.ts` per resource, method-based export `GET/POST/PATCH/DELETE`), bukan RPC/tRPC/server actions untuk data mutation admin.
- Struktur path: `/api/v1/{admin|public|internal}/<resource>/[id]/<sub-action>`. Sub-aksi non-CRUD (reorder, bulk, status toggle) jadi sub-route sendiri (`<resource>/reorder/route.ts`, `<resource>/[id]/status/route.ts`) bukan query param action.
- Handler function diberi nama `handleGet`/`handlePost` internal, lalu di-export dengan dibungkus middleware:
  ```ts
  async function handleGet(req: NextRequest) { /* ... */ }
  async function handlePost(req: NextRequest) { /* ... */ }
  export const GET = withAdminAuth(handleGet);
  export const POST = withAdminAuth(handlePost);
  ```
- Auth sebagai **higher-order function wrapper** (`withAdminAuth`, `withServiceAuth`, `withAdminAuthContext`) — bukan middleware global tunggal — supaya level akses eksplisit per route.
- Context param untuk dynamic route selalu di-type eksplisit dan di-`await` (Next 15 async params):
  ```ts
  type RouteContext = { params: Promise<{ id: string }> };
  const { id } = await context.params;
  ```
- Response selalu envelope konsisten `{ success, data, message? }` / `{ success: false, error }` — dipakai sama di admin, public, dan internal API.

## 8. Tone/Gaya Commit Message

Format: `<type>(<scope>): <deskripsi singkat, present tense, huruf kecil>` — Conventional Commits, scope hampir selalu nama app/domain.

Contoh nyata dari `git log`:
```
fix(admin): render shared brand-mark image in message story export
refactor(admin): pin dashboard greeting and sign-in label to Jakarta
feat(admin): add publications dashboard feature
chore(admin): update next-env.d.ts for dev types path
docs(infra): record Jakarta timezone contract and cron sidecar rules
```

- Type yang dipakai: `feat`, `fix`, `refactor`, `chore`, `docs`. Tidak ada gaya emoji/kapital berlebihan.
- Deskripsi to-the-point, tanpa kata kerja bantu ("this commit adds..."), langsung aksi ("add", "fix", "render", "pin").
- Sering ada rangkaian commit `refactor(<scope>): <spesifik micro-change>` berurutan untuk satu migrasi besar yang dipecah kecil-kecil per lapisan (contoh: migrasi timezone dipecah ~15 commit per sub-area).

## 9. Pemakaian Tipe/Validasi

- **TypeScript `strict: true`**, alias path `@/*`, tanpa `any` eksplisit di kode representatif — pakai `unknown` + narrowing manual (`error instanceof Error`, `'code' in cause`).
- **Zod untuk semua runtime validation** di boundary request masuk (`schema.parse(body)` di route handler), tipe statis diturunkan otomatis via `z.infer<>` — tidak menulis interface input terpisah secara manual jika schema Zod sudah ada.
- Optional/nullable field API dipetakan eksplisit `.optional().nullable()` ketika field boleh kosong di DB tapi opsional di client.
- Error dari validasi dilempar sebagai exception (`schema.parse`, bukan `.safeParse` dominan di route layer), ditangkap di try/catch terluar, dan dikonversi ke `validationErrorResponse`.
- Tipe domain (entity shape) didefinisikan di `features/<domain>/types/*.types.ts`, dipisah dari Zod schema request — schema request bisa punya shape berbeda (subset) dari entity penuh.
- Interface kecil untuk parameter object (bukan banyak positional argument) dipakai konsisten di fungsi dengan >2 argumen:
  ```ts
  interface ImageGeneratorOptions {
    message: StoryMessage;
    onProgress?: (progress: number) => void;
  }
  export async function generateMessageImage({ message, onProgress }: ImageGeneratorOptions) { ... }
  ```

## 10. Hal Spesifik Lain yang Konsisten

- **Inline style + CSS variable hybrid**: komponen banyak pakai `style={{ backgroundColor: TOKEN.x }}` untuk value dinamis dari constant palette, dikombinasikan dengan Tailwind class untuk layout/spacing/transition. CSS var (`var(--radius-container)`, `var(--border)`) dipakai untuk token desain global, object JS constant (`COLORS`, `SURFACE_SHADOWS`) untuk token yang butuh dipakai sebagai raw value di `style`.
- **Timezone/locale pinning eksplisit**: semua fungsi tanggal/waktu sengaja di-pin ke satu timezone tetap lewat helper khusus, bukan `new Date()` default — konvensi ini di-rollout sebagai seri refactor terpisah per titik pakai.
- **AbortController wajib di setiap `useEffect` yang fetch**, dengan cleanup return dan pengecualian eksplisit untuk `AbortError` di catch block.
- **Singleton service instance** diekspor bersamaan dengan class-nya di file yang sama (`export class X {}` + `export const xInstance = new X()`), dependency lain mengimpor instance tersebut, bukan meng-instansiasi ulang.
- **Feature flag/graceful fallback query**: service query menyiapkan jalur fallback eksplisit ketika kolom/skema opsional belum ter-migrasi (deteksi lewat error code Postgres), daripada membiarkan request gagal total — pola ini dipakai untuk migrasi tanpa downtime.
- **Barrel export wajib per feature** (`features/<domain>/index.ts` re-export types, constants, hooks, components) sehingga import dari luar domain selalu satu baris ke root domain, bukan menembus path dalam.
