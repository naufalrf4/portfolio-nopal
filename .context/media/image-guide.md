# Panduan Gambar — naufalrf.net

Dibuat 2026-09-01. Semua angka di sini diambil dari kode dan API produksi, bukan asumsi.

## Kondisi sekarang (terverifikasi dari API produksi)

| Slot | Status | Dampak |
|---|---|---|
| Project `imageUrl` | **null di 8/8 project** | Thumbnail `/projects` kosong, hero case study kosong |
| Project `images[]` | **kosong di 8/8** | Galeri case study kosong |
| Achievement `photos` | **kosong di 7/7** | Kartu achievement tampil "No image uploaded yet" |
| `og:image` | 1 gambar generik untuk SEMUA halaman | Semua link yang dishare terlihat identik |
| Avatar | Ada | Aman, tapi lihat catatan signed URL di bawah |
| Experience `logoUrl` | 8/15 terisi | 7 entri tanpa logo |

Prioritas: **thumbnail project dulu**, karena itu yang dilihat manusia di `/projects` dan yang dipakai jadi `og:image` per halaman. Achievement paling belakang.

---

## PENTING: masalah signed URL

Media dari Admin dilayani sebagai **signed GCS URL** dengan `X-Goog-Expires=3600` — kedaluwarsa 1 jam.

Konsekuensinya:
- Aman untuk `<img>` yang langsung dimuat pengunjung.
- **Tidak bisa dipakai** di structured data atau `og:image`, karena Google dan WhatsApp mengambil gambar itu belakangan, saat tanda tangannya sudah mati (403).

Kode sekarang otomatis membuang URL semacam itu dari schema (`stableImageUrl`), jadi lebih baik kosong daripada rusak. **Tapi artinya: selama gambar project hanya ada sebagai signed URL, `og:image` per project tetap tidak akan muncul.**

Untuk membuat preview share per project benar-benar jalan, salah satu ini harus dilakukan:
1. Bucket GCS dibuat public-read untuk folder media (URL jadi permanen tanpa tanda tangan), **atau**
2. Gambar OG disimpan sebagai file statis di `apps/public-astro/public/og/`, **atau**
3. Naikkan masa berlaku tanda tangan jadi sangat panjang (bukan solusi bagus, tanda tangan tetap akan mati)

Opsi 1 paling benar. Kalau kamu mau opsi 2, saya bisa buatkan generator otomatis dari data project.

---

## Ukuran yang dibutuhkan

### 1. Thumbnail / hero project — PRIORITAS TERTINGGI

Dipakai di kartu `/projects` (`aspect-video`) dan hero case study (`aspect-[16/9]`).

- **Ukuran: 1600 x 900 px** (16:9)
- Format: WebP kalau bisa, kalau tidak PNG
- Maks ~300 KB
- Jumlah: **8** (satu per project)
- Satu gambar ini bisa dipakai ganda sebagai `og:image` project

Kenapa 1600x900 dan bukan 1200x675: layar retina menampilkan kartu di ~2x, dan 1600 lebar masih aman untuk OG (minimum Facebook/WhatsApp 600x315, rekomendasi 1200x630 — 1600x900 memenuhi keduanya).

### 2. OG image per halaman (opsional, kalau mau beda dari thumbnail)

- **Ukuran: 1200 x 630 px** (rasio 1.91:1)
- Format PNG
- Maks ~300 KB (WhatsApp memotong preview di atas ~600 KB)
- Teks penting jangan lebih dekat dari **60 px** dari tepi — Twitter/X memotong sisi pada beberapa tampilan

### 3. Galeri case study (opsional, sangat dianjurkan)

Screenshot asli jauh lebih bernilai dari ilustrasi untuk kredibilitas.

- **Ukuran: 1600 x 900 px** atau lebar asli screenshot (min 1200 px lebar)
- 2-4 per project sudah cukup
- **Wajib isi `alt`** di Admin — ini yang dibaca Google Images dan screen reader

### 4. Logo organisasi (7 masih kosong)

- **Ukuran: 256 x 256 px**, background transparan
- Format PNG atau SVG
- Objek di tengah, ada ruang kosong ~10% di tepi

### 5. Foto achievement (prioritas terakhir)

- **Ukuran: 1200 x 800 px** (3:2)
- Foto asli acara/sertifikat jauh lebih baik dari gambar AI di sini, karena ini klaim faktual

---

## Panduan prompt AI untuk gambar

### Aturan wajib

1. **Jangan minta AI menulis teks di gambar.** Model gambar hampir selalu salah menulis, dan teks salah pada thumbnail teknis merusak kredibilitas. Kalau butuh judul di atas gambar, minta saya tambahkan lewat SVG.
2. **Jangan menggambarkan hardware yang tidak kamu pakai.** Stack asli per project sudah pasti (lihat tabel di bawah). Menampilkan ESP32 padahal Raspberry Pi 4 itu klaim palsu secara visual.
3. **Jangan pakai wajah orang.** Ini portofolio teknis, bukan stok foto korporat.
4. Selalu minta rasio eksplisit: `--ar 16:9` (Midjourney) atau "aspect ratio 16:9" (DALL-E/Ideogram).

### Palet warna situs (pakai ini biar konsisten)

```
Background gelap  #0a0f0d
Background alt    #0f1a17
Aksen teal        #14b8a6
Teks terang       #f4f7f6
Garis / border    #1d2b27
Teks redup        #9fb0ac
```

### Template prompt

Ganti bagian dalam `[...]`:

```
A dark technical illustration for an engineering portfolio thumbnail.
Subject: [ISI SESUAI PROJECT — lihat tabel di bawah].
Style: flat vector, thin precise linework, schematic and diagrammatic,
isometric or straight-on, generous negative space, subtle dot-grid texture
in the background.
Color: near-black background (#0a0f0d to #0f1a17), single teal accent
(#14b8a6) used sparingly for the most important element, muted desaturated
grey-green for everything else. No other colors.
Mood: calm, precise, engineered. Restrained, not flashy.
Composition: main subject slightly left of center, empty space on the right.
Aspect ratio 16:9.
Absolutely no text, no words, no letters, no numbers, no logos, no UI
mockups with readable labels, no people, no faces, no glossy 3D render,
no lens flare, no neon cyberpunk glow, no gradient mesh.
```

### Subject per project (pakai apa adanya — ini stack asli dari API)

| Project | Subject untuk prompt |
|---|---|
| `simonair-4-hardware-sensors` | a single-board computer connected by thin cables to water-quality probes submerged in an aquarium, sensor readings flowing upward as thin lines into a small cloud shape |
| `simonair-4-web-dashboard` | an abstract monitoring dashboard reduced to simple shapes: a line chart trending, three small gauge circles, a sidebar — all as flat outlines, no readable text |
| `photobon-id-hardware-device` | a compact freestanding photobooth cabinet in schematic outline, a camera lens circle at eye level, a narrow paper receipt curling out of a slot at the bottom |
| `photobon-id-desktop-control-app` | a desktop application window in flat outline connected by a thin cable to a small hardware device, indicating local machine controlling physical equipment |
| `photobon-id-web-cloud-platform` | several small photobooth unit icons in different city locations, thin lines converging upward into a single cloud shape holding a database cylinder |
| `siap-impact-sakina` | an abstract multi-step registration form flow, three stacked document outlines with checkmarks, arrows moving left to right |
| `thesis-final-project-showcase` | a pixel-art styled open book with small blocky decorative elements around it, retro 8-bit aesthetic but still dark and restrained |
| `veilproxy` | a shield or filter shape sitting between a user terminal on the left and a large cloud on the right, small data particles being caught by the filter |

Catatan: `veilproxy` ditulis huruf kecil semua di CMS — biarkan begitu, itu memang nama aslinya.

### Tool yang cocok

- **Ideogram** — paling bagus kalau memang butuh teks (tapi tetap hindari)
- **Midjourney** — paling bagus untuk gaya konsisten; pakai `--ar 16:9 --style raw`
- **DALL-E 3 via ChatGPT** — paling mudah diarahkan lewat percakapan, minta "flat vector schematic, no text"

Tips konsistensi: bikin **satu** gambar yang kamu suka dulu, lalu untuk 7 sisanya sebutkan "same visual style as before" di percakapan yang sama.

---

## Cara upload

1. Masuk Admin → Projects → pilih project
2. Isi field gambar utama (jadi `imageUrl`)
3. Untuk galeri, tambahkan di bagian images — **isi `alt` setiap gambar**
4. Simpan. Publik akan menampilkannya tanpa deploy ulang (data dibaca dari API saat request)

### Menulis `alt` yang benar

Jelaskan isinya, jangan ulangi judul.

- Buruk: `SIMONAIR 4.0 - Hardware & Sensors`
- Baik: `Raspberry Pi 4 terhubung ke probe pH, TDS, dan dissolved oxygen di dalam akuarium`

---

## Yang saya kerjakan setelah gambar masuk

- `og:image` per halaman otomatis memakai gambar project (tinggal jalan begitu URL-nya permanen)
- `image` di schema `CreativeWork` per project
- Related-projects antar case study
- Deep-dive konten case study (draft dari saya, kamu koreksi)
