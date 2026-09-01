## PROBLEM

A paper visitor logbook records that somebody wrote a name down. It does not record who actually walked in.

Handwriting is unreadable, entries are skipped when the lobby is busy, and nothing stops a person writing any name at all. For a workplace that needs to know who was on site and when, the logbook is a record of intent rather than a record of entry. Attendance tracking built on the same sheet inherits every one of those weaknesses.

Replacing it means authenticating people at the door, which is where the engineering gets awkward. Two authentication methods were in scope, and they behave nothing alike. Face recognition produces a probabilistic match from a biometric pipeline. An NFC card produces a deterministic ID from a hardware reader over a serial interface. One is a confidence score, the other is a byte string.

Build a separate path for each and you end up with two attendance systems that disagree. The application layer had to treat both as the same kind of thing.

## SOLUTION

A full stack system pairing a **React** and **Tailwind CSS** frontend with an **Express.js** and **PostgreSQL** backend, integrating face recognition and NFC card readers as interchangeable authentication methods.

**One identity signal, two sources.** The API was designed so face recognition and NFC resolve to the same shape before they reach the attendance record. Downstream logic never branches on which door somebody used.

**PostgreSQL because entry records are evidence.** Visitor identity, entry time, and method are relational and queryable, so "who was on site last Tuesday" is a query rather than a search through paper.

**Hardware I/O behind an application boundary.** Card reader input and the biometric pipeline are integrated at the edge of the system rather than threaded through the business logic, so a reader failure does not take out attendance logging.

**Verification and logging as one flow.** The system does not authenticate and then separately record. A successful verification produces the attendance record, which removes the gap where entries used to get skipped.

Built during a hardware engineering internship at PT Nutech Integrasi, TelkomGroup.

## RESULT

The system replaced manual visitor logbooks with automated, verifiable entry tracking, deployed as a real internship deliverable rather than an exercise.

What it demonstrates is the join between layers. Frontend, API, relational schema, biometric pipeline, and physical card readers had to agree on one model of identity, and getting that agreement right is the actual work. It is the same pattern that runs through the IoT projects: the interesting engineering sits at the boundary where hardware meets software.

## Ringkasan

Sistem keamanan dan absensi tempat kerja yang memverifikasi pengunjung menggunakan pengenalan wajah dan kartu NFC, menggantikan buku tamu manual. Dibangun dengan **React**, **Tailwind CSS**, **Express.js**, dan **PostgreSQL** selama magang engineering hardware di PT Nutech Integrasi (TelkomGroup).

Buku tamu kertas hanya mencatat bahwa seseorang menuliskan nama, bukan siapa yang benar-benar masuk. Tulisan tidak terbaca, baris terlewat saat lobi ramai, dan tidak ada yang mencegah orang menulis nama sembarangan.

Tantangan teknis utamanya: dua metode autentikasi yang sifatnya sangat berbeda. Pengenalan wajah menghasilkan kecocokan probabilistik dari alur biometrik, sementara kartu NFC menghasilkan ID pasti dari pembaca perangkat lewat antarmuka serial. Satu berupa skor keyakinan, satu berupa deretan byte.

Kalau masing-masing dibuat alur terpisah, hasilnya dua sistem absensi yang bisa saling bertentangan. Karena itu API dirancang supaya keduanya menghasilkan bentuk identitas yang sama sebelum mencapai catatan absensi, sehingga logika di belakangnya tidak perlu tahu pintu mana yang dipakai.

Relevan untuk kebutuhan jasa pembuatan sistem absensi, integrasi perangkat keras ke aplikasi web, dan sistem keamanan berbasis IoT.
