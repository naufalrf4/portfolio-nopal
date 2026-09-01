## PROBLEM

Selling and renting hardware across three regions is an operations problem long before it is a software problem.

Units sit in Bali, Bandung, and Jabodetabek. Each one is either out on rental, back in inventory, or booked for a date that has not arrived yet. Every event produces session data and photo output that has to land somewhere durable. Bookings overlap, dates shift, and the same physical unit cannot be in two cities on the same weekend.

Run that on spreadsheets and messages and two things break. Nobody has a reliable answer to where a given unit is right now, and every question about availability requires a person to reconstruct the state from memory. The cost is not a lost file, it is a double booking on a wedding date.

The units are also already reporting in. The desktop app at each booth syncs sessions upward, so the platform is not a passive record; it is the destination for live operational data from hardware in the field.

## SOLUTION

A **Next.js** and **React** platform on **PostgreSQL**, with cloud storage for photo and session output.

**One source of truth for unit state.** Where each unit is, what it is committed to, and what it has produced live in one relational model rather than distributed across documents and chat history.

**Session data arrives from the field.** The desktop control app at every booth syncs upward, so operational reality flows into the platform automatically instead of being entered by hand after the fact.

**PostgreSQL because the constraints are relational.** Units, bookings, cities, and sessions are all bound to each other, and a double booking is precisely the class of mistake a relational database exists to make impossible.

**Cloud storage for output.** Photo and receipt output is bulky and grows every event, so it is stored where it can scale independently of the operational data describing it.

**Multi-city as a first-class concept.** Location is part of the model rather than a text field, because availability only makes sense per region.

## RESULT

The platform runs rental and sales operations for Photobon.id across **Bali, Bandung, and Jabodetabek**, holding unit inventory, bookings, and session output produced by hardware in the field.

The engineering value is in the schema rather than the interface. Availability across regions and double booking prevention are integrity problems, and solving them in the data model is what makes the platform trustworthy enough to run a business on.

## Ringkasan

Platform web dan cloud yang menjalankan operasional penyewaan dan penjualan unit photobooth di tiga wilayah: Bali, Bandung, dan Jabodetabek.

Dibangun dengan **Next.js**, **React**, dan **PostgreSQL**, ditambah cloud storage untuk menyimpan hasil foto dan data sesi.

Masalah yang diselesaikan sebenarnya masalah operasional, bukan sekadar teknis. Setiap unit bisa sedang disewa, kembali ke inventaris, atau sudah dipesan untuk tanggal tertentu, dan satu unit fisik tidak bisa berada di dua kota pada akhir pekan yang sama. Kalau dikelola lewat spreadsheet dan chat, risikonya bukan file hilang, tapi jadwal tabrakan di hari pernikahan klien.

PostgreSQL dipilih karena relasi antar unit, pemesanan, kota, dan sesi memang saling terikat, dan double booking justru jenis kesalahan yang paling tepat dicegah oleh basis data relasional. Lokasi diperlakukan sebagai bagian dari model data, bukan sekadar kolom teks, karena ketersediaan unit hanya bermakna per wilayah.

Data sesi juga mengalir masuk otomatis dari aplikasi desktop di setiap booth, sehingga kondisi lapangan tidak perlu dicatat ulang secara manual.

Relevan untuk kebutuhan jasa pembuatan sistem informasi perusahaan, aplikasi web custom untuk operasional bisnis, dan integrasi data dari perangkat ke platform cloud.
