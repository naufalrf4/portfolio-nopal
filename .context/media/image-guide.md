# Panduan Gambar — naufalrf.net

Diperbarui 2026-09-01. Angka diambil dari `packages/design-tokens/tokens.css` dan API produksi.

## Palet resmi (JANGAN pakai hex dari og-image.svg — itu usang)

```
                    DARK          LIGHT
Background          #0b0d10       #faf8f4
Card                #1c2127       #ffffff
Border              #343b44       #d4cdbf
Teks utama          #e8eaed       #211c15
Teks redup          #8b93a1       #6b6558
Teal                #3ed9c4       #0f8577
```

**Untuk cover pakai `#0f8577`** (teal versi light). Contrast ratio 3.58 di card gelap
dan 4.52 di card terang — satu-satunya teal yang lolos di kedua tema. `#3ed9c4`
hanya 1.76 di tema terang, gagal.

Warna netral lain yang aman dua tema: `#6b7280` (3.35 / 4.83), `#7d8794` (4.45 / 3.64).

## Kondisi sekarang (dari API produksi)

| Slot | Status |
|---|---|
| Project `imageUrl` | **null di 8/8** |
| Project `images[]` | **kosong di 8/8** |
| Achievement `photos` | **kosong di 7/7** |
| `og:image` | 1 gambar generik untuk semua halaman |
| Experience `logoUrl` | 8/15 terisi |

## Ukuran

| Gambar | Ukuran | Jumlah |
|---|---|---|
| Cover project | **1600 x 900** | 8 |
| LinkedIn banner | **1584 x 396** | 1 |
| OG default situs | **1200 x 630** | 1 |
| Logo organisasi | **256 x 256** transparan | 7 |
| Foto achievement | **1200 x 800** | 7 |

Format PNG/WebP, maks ~300 KB.

**LinkedIn:** hindari kiri bawah **280x180 px** (ketutup foto profil). Elemen penting
di tengah-kanan, margin 80 px. Area aman mobile: tengah 1128 px.

## Layout cover: slot screenshot di TENGAH

```
Kanvas            1600 x 900

Slot screenshot   x: 400   y: 130   w: 800   h: 640
Strip kiri        x: 80    w: 320
Strip kanan       x: 1200  w: 320
```

Kenapa tengah, bukan kanan: crop kotak (WhatsApp sebagian klien, Google Discover)
mengambil 900x900 dari tengah = jendela x 350–1250. Slot di kanan (720–1520) hanya
kelihatan 530 dari 800 px — screenshot terpotong 34%. Slot di tengah (400–1200)
masuk seluruhnya.

Cover 16:9 dan container `aspect-video` juga 16:9, jadi **tidak ada crop** di halaman
`/projects` itu sendiri. Crop hanya terjadi di share/discover.

Konsekuensi: ilustrasi jadi dua strip tipis, jadi **jangan** paksa satu adegan utuh.
Perlakukan sebagai aksen tepi — garis terpotong yang seolah menerus di belakang
screenshot.

Screenshot diberi border `1px #343b44`, sudut bulat `12px`.

## Plat siap pakai

`apps/public-astro/public/covers/` berisi 16 PNG hasil generate: 8 plat bersih +
8 versi `-guide.png` bertanda "PASTE SCREENSHOT" beserta koordinatnya.

Catatan: plat itu digenerate saat slot masih di kanan dan pakai palet lama. Jalankan
ulang `bun run scripts/generate-project-covers.ts` setelah script disesuaikan, atau
abaikan kalau mau bikin manual.

## Aturan wajib prompt AI

1. **Jangan minta AI menulis teks.** Model gambar hampir selalu salah menulis; typo
   di thumbnail teknis merusak kredibilitas. Judul ditambahkan manual/SVG.
2. **Jangan gambarkan hardware yang tidak dipakai.** SIMONAIR = **Raspberry Pi 4**,
   bukan ESP32. ESP32 milik internship PT Nutech.
3. Jangan pakai wajah orang.
4. Sebut rasio eksplisit.

## Prompt utama (slot tengah)

```
A dark technical illustration used as a background plate for a portfolio cover,
with a large empty area reserved in the middle for a screenshot.

COMPOSITION — this is the most important constraint: the CENTER of the image, a
wide vertical band covering the middle 50 percent, must be completely empty.
Flat background only, no lines, no objects, no detail whatsoever. All
illustration lives in two narrow vertical strips at the far LEFT edge and far
RIGHT edge, each about 20 percent of the width. The strips read as fragments of
a larger schematic that continues behind the empty middle: partial lines,
cut-off shapes, thin connectors that enter from the edge and stop.

Subject fragments: [SUBJECT]

Style: flat vector, thin precise linework, schematic and diagrammatic, technical
drawing feel, subtle dot-grid texture on the background.
Color: one desaturated teal (#0f8577) on the most important lines only, muted
grey-green (#7d8794) for everything else, flat very dark background (#0b0d10).
No other colors.
Mood: calm, precise, engineered. Restrained, not flashy.
Aspect ratio 16:9.

No text, no words, no letters, no numbers, no logos, no readable UI labels, no
people, no faces, no glossy 3D render, no lens flare, no neon cyberpunk glow,
no gradient mesh, no frame or border around the empty middle.
```

Kalau model tetap mengisi tengah, tambahkan di akhir:
`the middle 50 percent is blank, unused, reserved space — leave it untouched`

## Subject fragments per project

| Project | `[SUBJECT]` |
|---|---|
| SIMONAIR Hardware | left strip: a single-board computer in outline with thin cables leaving toward the center. right strip: water-quality probes descending past a waterline into an aquarium |
| SIMONAIR Dashboard | left strip: a narrow sidebar with three small gauge circles. right strip: the tail of a rising line chart running off the edge |
| Photobon Hardware | left strip: the vertical edge of a photobooth cabinet with a camera lens circle. right strip: a narrow paper receipt curling downward |
| Photobon Desktop | left strip: the corner of a desktop window with a title bar and three dots. right strip: a small hardware device with a cable entering from the edge |
| Photobon Web/Cloud | left strip: three small booth icons stacked vertically. right strip: a cloud outline holding a database cylinder |
| Siap Impact SAKINA | left strip: stacked document outlines with checkmarks. right strip: a vertical progress stepper of small connected circles |
| Thesis Showcase | left strip: blocky pixel-art squares scattered vertically, retro 8-bit. right strip: the edge of an open book |
| veilproxy | left strip: a terminal window outline with a few short command lines. right strip: a shield or filter shape with small particles caught in it |

## Tool

- **Midjourney** — `--ar 16:9 --style raw --stylize 50` (stylize rendah = lebih patuh)
- **Ideogram** — kepatuhan prompt paling baik untuk negative space
- **DALL-E 3 (ChatGPT)** — paling mudah dikoreksi lewat percakapan

Konsistensi: bikin satu gambar yang disuka dulu, lalu 7 sisanya bilang
"same visual style as before" di chat yang sama.

## Kalau AI gagal terus dengan tengah kosong

Model gambar memang buruk menaati "biarkan tengah kosong". Alternatif yang lebih
pasti: minta ilustrasi **full-width** biasa, lalu potong sendiri jadi dua strip 320 px
dan susun di atas kanvas `#0b0d10`. Hasilnya lebih terkontrol daripada berdebat
dengan model.

## Soal tema terang

Cover itu file raster — tidak ikut berubah saat tema diganti. Garis `#0f8577` aman di
kedua tema, tapi **background gelap tetap akan tampak seperti lubang** di antara kartu
putih pada tema terang.

Pilihan:
1. **Background transparan** (PNG alpha, hanya garis) — paling menyatu, tapi butuh
   post-processing karena AI tidak menghasilkan alpha
2. **Netral** `#8a8578` atau `#6b7280` solid — aman dua tema, tapi terasa asing di keduanya
3. **Tetap gelap** — paling mudah, wajar untuk situs dark-first

**Penting:** `og:image` untuk share **tidak boleh transparan** — WhatsApp/Twitter
merender alpha jadi hitam/putih tak terduga. Versi OG harus ber-background solid.

## Kendala signed URL

Media Admin disimpan di bucket R2 privat dan dilayani sebagai signed URL S3 dengan
`X-Amz-Expires=3600` (mati 1 jam). Upload dan penghapusan berjalan server-side lewat Admin.

- Aman untuk `<img>` yang langsung dimuat pengunjung
- **Tidak bisa** dipakai di structured data atau `og:image` — Google/WhatsApp mengambil
  gambar belakangan saat tanda tangan sudah mati (403)

Kode sudah otomatis membuang URL semacam itu dari schema (`stableImageUrl`), jadi lebih
baik kosong daripada rusak. Artinya: setelah upload, thumbnail dan hero muncul, tapi
**cover share belum**. Perlu salah satu:

1. Bucket R2 dibuat public-read untuk folder media (URL permanen) — paling benar
2. Gambar OG disimpan statis di `apps/public-astro/public/og/`

## Upload

1. Admin → Projects → pilih project
2. Isi gambar utama (`imageUrl`)
3. Galeri: tambahkan di bagian images, **isi `alt` setiap gambar**
4. Simpan — publik langsung menampilkan, tanpa deploy ulang

`alt` yang benar menjelaskan isi, bukan mengulang judul:
- Buruk: `SIMONAIR 4.0 - Hardware & Sensors`
- Baik: `Raspberry Pi 4 terhubung ke probe pH, TDS, dan dissolved oxygen di akuarium`
