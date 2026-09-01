# Draft Case Study — Naufal Rizqullah Firdaus

Status: menunggu isian dari Naufal. Dibuat 2026-09-01.
Isi mentah dari produksi ada di `project-content-current.md`.

---

## TEMUAN PENTING SEBELUM MENULIS

**1. Koreksi klaim saya sebelumnya.** Saya sempat bilang case study "nol H2".
Itu salah — saya membacanya dari HTML, bukan dari sumbernya. Field `content`
di Admin SUDAH punya struktur H2 (`## CONTEXT`, `## ARCHITECTURE`, `## ROLE`,
`## CHALLENGE`/`## DECISIONS`, `## RESULT`). Rata-rata 5 section per project,
total 1717 kata di 8 project.

**2. Tapi ada bug SEO yang lebih serius.**
`ProjectArticle.tsx` merender section sebagai **tab**, dan hanya tab aktif
yang masuk HTML. Terverifikasi di produksi pada `simonair-4-hardware-sensors`:

| Frasa | Ada di HTML? |
|---|---|
| `fourth iteration` (section CONTEXT, tab pertama) | ya |
| `signal conditioning` (ARCHITECTURE) | **tidak** |
| `drift-prone` (CHALLENGE) | **tidak** |
| `first wire to live telemetry` (RESULT) | **tidak** |

Artinya: **crawler dan mesin jawaban AI hanya melihat section pertama.**
Sisanya baru dirender setelah user mengklik tab. Menambah konten tanpa
memperbaiki ini tidak akan menaikkan apa pun — teks barunya tidak akan
terindeks.

Ada tombol "show all" di komponen itu, jadi kemungkinan perbaikannya kecil:
render semua section di HTML, lalu sembunyikan lewat CSS/JS untuk interaksi
tab. Perlu hati-hati karena menyentuh UI — tampilan tab harus tetap sama.

**Urutan yang benar: perbaiki renderer dulu, baru tambah konten.**

**3. Konten sekarang deskriptif, bukan naratif.**
Isinya benar dan tidak mengarang, tapi ditulis dengan bahasa yang menjaga
jarak ("was designed and implemented solo", "notoriously noisy and
drift-prone"). Yang membuat case study dikutip dan dipercaya justru
keputusan spesifik: angka, kegagalan, alasan memilih A bukan B.

---

## YANG SAYA TIDAK TAHU — TOLONG ISI

Saya tidak akan mengarang detail teknis. Semua di bawah ini kosong karena
tidak ada di API produksi. Jawab sesingkat mungkin, saya yang susun jadi
prosa.

### SIMONAIR 4.0 — Hardware & Sensors

Yang sudah ada: Raspberry Pi 4, MQTT, sensor pH/TDS/DO/suhu, riset akuakultur
ikan hias air tawar, iterasi ke-4, solo build.

- Kenapa Raspberry Pi 4, bukan mikrokontroler (ESP32/Arduino)? Apa yang butuh
  Linux atau daya proses lebih?
- Kalibrasi: probe mana yang paling rewel? Bagaimana cara kalibrasinya, dan
  seberapa sering perlu diulang?
- "Signal conditioning" itu konkretnya apa? Moving average? Median filter?
  Buang outlier?
- Interval polling berapa? Kenapa angka itu?
- Kalau koneksi/listrik putus di lokasi — apa yang terjadi ke data? Ada buffer
  lokal, atau hilang?
- QoS MQTT berapa? Kenapa?
- Sudah jalan berapa lama? Ada temuan dari datanya yang tidak terlihat dari
  pembacaan manual?
- Ada yang pernah rusak/gagal di lapangan? Apa penyebabnya?

### SIMONAIR 4.0 — Web Dashboard

Yang sudah ada: React, Tailwind, MQTT, mobile-friendly, untuk peternak ikan.

- Data MQTT masuk ke browser lewat apa? WebSocket langsung, atau lewat backend?
- Berapa banyak titik data yang ditampilkan sekaligus? Ada downsampling?
- Apa yang terjadi di UI kalau sensor berhenti mengirim?
- Ada threshold/alert? Siapa yang menentukan batasnya?
- Kenapa mobile-first? Peternak memakainya di mana?
- Bagian mana yang paling sering dipakai, dan mana yang ternyata tidak
  dipakai sama sekali?

### Photobon.id — Hardware Device

Yang sudah ada: embedded hardware, modul kamera, integrasi thermal printer,
dipakai di event nyata.

- Thermal printer merek/model apa? Antarmukanya serial, USB, atau lain?
- Berapa lama dari tekan tombol sampai struk keluar? Ada target waktu?
- Apa yang paling sering gagal di event? Kertas habis, kamera, listrik?
- Bagaimana operator tahu ada masalah tanpa harus paham teknis?
- Berapa unit sudah dibuat? Dipakai di kota mana saja?
- Ada iterasi hardware? Versi 1 gagal di mana?

### Photobon.id — Desktop Control App

Yang sudah ada: Rust, Tauri, React, jalan di setiap unit, kontrol hardware +
sync ke cloud.

- Kenapa Tauri, bukan Electron? Ukuran binary, memori, atau akses hardware?
- Kenapa Rust untuk bagian ini? Apa yang tidak bisa dilakukan dari JS?
- Komunikasi ke hardware lewat apa? Serial port? Library apa?
- Kalau internet mati di venue, apa yang terjadi? Ada queue lokal?
- Bagaimana update aplikasi dikirim ke unit yang tersebar di berbagai kota?
- Bug paling sulit yang pernah kamu kejar di sini?

### Photobon.id — Web & Cloud Platform

Yang sudah ada: Next.js, React, PostgreSQL, cloud storage, operasi rental +
penjualan lintas kota (Bali, Bandung, Jabodetabek).

- Apa yang sebenarnya dikelola sistem ini? Jadwal sewa? Inventaris unit?
  Pembayaran?
- Foto/struk disimpan bagaimana? Ada retensi?
- Berapa unit dan lokasi yang dilacak?
- Apa yang paling sering salah secara operasional, dan bagaimana software
  membantu?
- Ada yang dulu manual lalu jadi otomatis? Hemat waktu berapa?

### Siap Impact SAKINA

Yang sudah ada: Laravel, React, Tailwind, MySQL, platform registrasi program
pemerintah nasional, live di `siapimpact.kemendukbangga.id`.

- Berapa peserta yang mendaftar? (angka nyata kalau boleh disebut)
- Apa yang dulu dikerjakan manual oleh penyelenggara?
- Puncak beban trafik seperti apa? Ada masalah saat itu?
- Validasi data apa yang perlu? NIK, dokumen, verifikasi?
- Kamu kerja sendiri atau dalam tim? Bagian mana yang kamu pegang?
- Ada kendala khusus karena ini proyek pemerintah? Audit, keamanan, aksesibilitas?

### Thesis Final Project — Interactive Showcase

Yang sudah ada: Next.js, Tailwind, gaya pixel-art, untuk presentasi tesis.

- Tesisnya tentang apa? (ini penting — bisa jadi konten teknis kuat)
- Kenapa pixel-art? Ada alasan selain estetika?
- Apa yang berhasil dilakukan situs ini yang tidak bisa dilakukan slide?
- Reaksi dosen penguji?
- Ada bagian interaktif yang menjelaskan konsep tesis secara langsung?

### veilproxy

Yang sudah ada: Go, SQLite, proxy lokal open-source, membersihkan data pribadi
dari prompt sebelum sampai ke penyedia LLM, repo publik di GitHub.

- Deteksi data pribadinya bagaimana? Regex, NER, daftar kata?
- Apa saja yang dideteksi? Email, nomor telepon, NIK, nama?
- Kenapa Go, bukan Python atau Node?
- SQLite dipakai untuk apa? Log, cache, aturan?
- Bagaimana caranya menyisip di jalur request? Proxy HTTP? Ada TLS?
- Berapa overhead latensi yang ditambahkan?
- False positive-nya bagaimana? Pernah menyensor yang seharusnya lolos?
- Ada yang pakai selain kamu? Ada issue/PR dari orang lain?

---

## CATATAN CARA MENJAWAB

- **Angka lebih kuat dari kata sifat.** "Polling tiap 30 detik" mengalahkan
  "real-time". "Dipakai 6 bulan" mengalahkan "ongoing".
- **Kegagalan justru menaikkan kredibilitas.** "Probe DO drift 0.3 mg/L per
  minggu jadi harus kalibrasi ulang" itu bukti pengalaman lapangan, bukan
  kelemahan.
- **Kalau tidak ingat atau tidak boleh disebut, tulis "skip".** Lebih baik
  bagian itu hilang daripada saya mengarang.
- **Boleh campur bahasa.** Saya yang rapikan ke Inggris untuk konsistensi
  dengan situs.

---

## RENCANA SETELAH TERISI

1. Perbaiki `ProjectArticle.tsx` supaya semua section masuk HTML (tanpa
   mengubah tampilan tab)
2. Saya susun jawaban jadi prosa, pertahankan struktur H2 yang sudah ada
3. Masuk ke field `content` di Admin — langsung live tanpa deploy
4. Verifikasi frasa dari setiap section benar-benar ada di HTML produksi

Target realistis: 600-900 kata per project, naik dari ~200 sekarang. Cukup
untuk punya kedalaman, tidak sampai jadi tutorial yang tidak akan dibaca.
