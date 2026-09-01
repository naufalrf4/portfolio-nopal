# techStack: 13 project yang masih kosong

Diambil dari deskripsi CMS masing-masing project pada 2026-09-01. Tidak ada yang
ditambahkan di luar yang sudah tertulis di sana.

Isi di Admin -> Projects -> pilih project -> field techStack. Begitu tersimpan,
chip tech stack muncul di halaman dan `keywords` di schema JSON-LD ikut terisi.

Delapan project lama (SIMONAIR x2, Photobon x3, SAKINA, thesis, veilproxy) sudah
punya techStack, tidak perlu diubah.

---

## designlabs

```
React, Vite, TanStack Router, Tailwind CSS, shadcn/ui, Radix UI
```

## brieff-website

```
Laravel, CodeIgniter, MySQL
```

Catatan: 5.0 memakai CodeIgniter, 6.0 dan 7.0 Laravel. Keduanya dimasukkan karena
migrasi itu justru bagian penting dari ceritanya.

## agridation-2024

```
Laravel, MySQL
```

## semapor

```
Laravel, MySQL
```

## islamicverse

```
HTML, CSS, JavaScript, Express.js, OpenAI API
```

## massi-id

```
Laravel, Inertia.js, React, Tailwind CSS
```

## elsa-iot-hardware-sensors

```
ESP32-S3, Water Quality Sensors, MQTT
```

Catatan: deskripsi menyebut "transmitting telemetry to the cloud" dan bagian
TRADEOFFS menyebut "MQTT publishing". Kalau sebenarnya bukan MQTT, hapus saja
dari daftar.

## elsa-iot-web-dashboard

```
Next.js, Tailwind CSS, Firebase
```

## indonesia-human-development-center

```
React, Tailwind CSS
```

## lease-asset-management

```
Laravel, MySQL
```

## gdgoc-ipb-university

```
Next.js, Tailwind CSS, Supabase, PostgreSQL
```

Catatan: PostgreSQL disertakan karena Supabase memang berjalan di atas Postgres,
dan itu istilah yang dicari recruiter. Hapus kalau terasa berlebihan.

## visitor-management-system

```
React, Tailwind CSS, Express.js, PostgreSQL, Face Recognition, NFC
```

## hris-kpi-management

```
Next.js, Tailwind CSS, PostgreSQL
```

---

## Kenapa ini penting

Tiga hal ikut terpengaruh oleh field yang kosong:

1. Kartu project di `/projects` tidak menampilkan chip tech stack, jadi
   pengunjung harus membuka halaman detail untuk tahu teknologinya
2. `keywords` di schema `CreativeWork` kosong, sehingga mesin pencari dan mesin
   jawaban AI kehilangan sinyal teknologi paling eksplisit yang bisa diberikan
3. Halaman `/projects` kehilangan istilah teknis yang justru dicari orang, karena
   chip itu adalah satu-satunya tempat nama teknologi muncul sebagai teks pendek
   yang bisa dipindai cepat
