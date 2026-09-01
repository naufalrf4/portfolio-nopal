# Validasi Fakta Case Study

**Sudah dikoreksi 2026-09-01:** risk index dipindah dari SIMONAIR ke ELSA
dashboard (dikembangkan untuk penelitian tugas akhir ikan discus), ELSA memakai
Firebase bukan MQTT, HRIS milik klien, SEMAPOR hanya proyek kompetisi. Empat
klaim itu sudah dihapus dari daftar di bawah.

Tandai setiap klaim: **OK**, **SALAH: <koreksi>**, atau **HAPUS**.

Yang ada di bawah ini hanya klaim yang **saya tambahkan atau simpulkan sendiri**,
bukan yang sudah tertulis di CMS. Itu bagian yang paling mungkin salah.

---

## 1. simonair-4-hardware-sensors

- Ikan discus butuh pemantauan terus-menerus, pembacaan manual 2x sehari
- Alasan Raspberry Pi: offline storage + autosync, kalibrasi & alerting di perangkat, MQTT dua arah, tenaga proses
- MQTT dua arah dipakai untuk mengubah interval polling & threshold dari cloud
- Lokasi riset sering mati listrik dan sinyal drop
- Dibangun sendiri penuh (solo)

## 2. simonair-4-web-dashboard

- Penggunanya peternak ikan & peneliti, bukan engineer
- UI memberi tahu saat sensor berhenti mengirim
- Mobile-first karena dipakai sambil berdiri di depan tangki
- Dashboard subscribe langsung ke MQTT (bukan lewat backend)

## 3. photobon-id-hardware-device

- Printer termal satu-satunya komponen bergerak
- Kegagalan tersering: macet & habis kertas
- Status alat terbaca di kabinet supaya operator non-teknis bisa atasi sendiri
- Jalur kertas dirancang supaya ganti kertas tanpa bongkar
- Beroperasi di Bali, Bandung, Jabodetabek (sewa + jual)

## 4. photobon-id-desktop-control-app

- Tauri dipilih karena binary lebih kecil & memori lebih rendah dari Electron
- Rust dipakai khusus untuk lapisan hardware / serial
- Offline first: sesi dicatat lokal lalu sync
- React dipakai karena UI operator lebih sering berubah dari protokol hardware
- Update aplikasi dikirim ke unit yang tersebar (**saya tidak tahu caranya, tolong isi atau hapus**)

## 5. photobon-id-web-cloud-platform

- Mengelola: lokasi unit, jadwal sewa, inventaris, hasil sesi
- Double booking dicegah lewat constraint basis data
- Lokasi/kota bagian dari model data
- Data sesi masuk otomatis dari aplikasi desktop di booth
- Cloud storage untuk foto & struk

## 6. siap-impact-sakina

- Pendaftaran datang dalam lonjakan setelah pengumuman
- Validasi ditegakkan saat submit
- Data ganda dicegah lewat unique constraint
- Data layer dirancang untuk beban puncak
- Ada antarmuka admin untuk penyelenggara
- Program di bawah Kemendukbangga
- **Kamu kerja sendiri atau dalam tim? Bagian mana yang kamu pegang?**

## 7. thesis-final-project-showcase

- Menggantikan slide presentasi untuk sidang
- Pixel-art dipilih supaya dokumen akademik terasa lebih mudah didekati
- Bisa dijelajahi bebas, tidak berurutan
- **Tesisnya tentang apa? (belum saya sebut sama sekali)**

## 8. veilproxy

- Regex untuk email, telepon, NIK, kartu kredit
- Custom filter: replace atau delete
- Go dipilih karena binary tunggal, start instan, overhead rendah
- SQLite untuk aturan & state lokal
- Semua proses lokal, tidak ada data keluar
- **Apakah menangani HTTPS/TLS? (belum saya sebut)**

## 9. semapor

- Warga lapor lewat WhatsApp/medsos lalu hilang
- Formulir publik sengaja singkat
- Sisi petugas berupa antrean dengan status & penugasan
- Juara 1 DINACOM 2024
- **Beneran untuk Kota Semarang, atau nama saja?**

## 10. islamicverse

- Bahaya API key di browser bisa dibaca lewat view source
- Express proxy hanya untuk menahan API key di server
- Frontend statis karena kontennya statis
- Juara 1 Festival Teknik Informatika 2023
- **Fiturnya apa saja? (saya cuma tulis "informasi & layanan keislaman")**

## 11. visitor-management-system

- Buku tamu kertas: tulisan tak terbaca, baris terlewat
- Face recognition = probabilistik, NFC = deterministik
- API dirancang supaya keduanya jadi bentuk identitas sama
- Magang di PT Nutech Integrasi (TelkomGroup)
- **Face recognition pakai library/model apa?**
- **Sudah benar-benar dipakai, atau selesai sebagai deliverable magang?**

## 12. elsa-iot-hardware-sensors

- ELSA = versi murah & ringan dari SIMONAIR
- ESP32-S3 dipilih: Wi-Fi built-in, cukup untuk polling + publish
- Sasarannya penghobi & usaha kecil
- ELSA melepas kalibrasi di perangkat & tenaga proses
- **Sensor apa saja? (SIMONAIR 4 parameter, ELSA berapa?)**

## 13. elsa-iot-web-dashboard

- Firebase dipilih supaya tidak perlu rawat server
- Real-time sync dari Firebase, bukan dibangun sendiri
- Responsive karena dicek dari ponsel

## 14. lease-asset-management

- Melacak: masa kontrak, tanggal perpanjangan, lokasi fisik gerai/ATM
- Risiko: tanggal perpanjangan terlewat, sewa dibayar untuk lokasi kosong
- Validasi ketat karena tuntutan audit perbankan
- Klien bank tidak disebut namanya
- **Sudah dipakai produksi, atau berhenti di delivery?**
- **Kamu solo atau dalam tim?**

## 15. hris-kpi-management

- Spreadsheet gagal karena relasi objektif-KPI-periode hilang
- MBO dipilih supaya penilaian terukur & sebanding antar tim
- Siklus review dimodelkan sebagai data
- Bagian dari suite HRIS yang lebih besar
- **Sudah dipakai perusahaan, atau masih demo?**

## 16. designlabs

- 15 design system di atas SATU set komponen bersama
- Radix UI + shadcn/ui sebagai fondasi supaya tidak fork komponen
- Identitas dibawa lewat token CSS + font
- Bagian tersulit: spasi, shadow, tipografi
- Tiap sistem ada design spec yang bisa diunduh
- **Beneran 15? Ada daftar lengkapnya?**

## 17. brieff-website

- 5.0 CodeIgniter, 6.0 & 7.0 Laravel
- Migrasi karena struktur CodeIgniter jadi penghambat fitur
- Peran naik: staf IT (5.0) ke ketua divisi IT (6.0, 7.0)
- Kamu yang mengambil keputusan migrasinya
- Tenggat festival tidak bisa digeser
- **Apakah situsnya masih online? (liveUrl kosong)**

## 18. massi-id

- 16th International Sago Symposium, Bogor, bareng IPB University
- Inertia.js dipakai supaya tak perlu lapisan API terpisah
- Ilustrasi sagu dibuat khusus
- Dwibahasa ID/EN + light/dark theme
- **Ilustrasinya kamu yang buat, atau orang lain?**
- **Kamu solo atau dalam tim?**

## 19. gdgoc-ipb-university

- Registrasi core team, mentor, anggota aktif
- Supabase dipilih karena beban perawatan (pembuatnya akan lulus)
- Menggantikan Google Forms + spreadsheet
- Peran dimodelkan sebagai data
- **Masih dipakai sekarang?**

## 20. indonesia-human-development-center

- Pengunjung: donatur, mitra, masyarakat
- Statis, tanpa animasi berat, prioritas kecepatan muat
- **Klien berbayar atau pro bono?**
- **Kamu solo?**

## 21. agridation-2024

- Acara kompetisi bertema pertanian
- Laravel dipilih karena tenggat, bukan kompleksitas
- Cakupan: program, jadwal, detail kompetisi
- **Ada fitur pendaftaran, atau hanya informasi?**
- **Acara di kampus mana?**

---

## Temuan lain dari CMS

**`featured` dan `tags`.** Project baru punya `featured: false` dan `tags: {}`
kosong. Delapan project lama semuanya `featured: true`. Perlu kamu putuskan mana
yang layak tampil di homepage, karena sekarang homepage hanya menampilkan 8 yang
lama.

**`projectDate` kosong di 8 project lama** padahal 13 yang baru terisi. Schema
sekarang hanya memakai `projectDate`, jadi project tanpa nilai itu tidak
mengeluarkan `dateCreated` sama sekali. Sebelumnya jatuh ke `createdAt` yang
isinya tanggal entri CMS, sehingga proyek 2023 terbaca dibuat 2026. Mengisi
`projectDate` di 8 project lama akan memulihkan tahun aslinya.

**`imageUrl` dan `images` kosong di semua 21.** Sesuai keputusanmu, dibiarkan
dulu sampai cover siap.

**`repoUrl` hanya terisi di veilproxy.** Kalau ada project lain yang repo-nya
publik, itu sinyal kuat untuk recruiter teknis.
