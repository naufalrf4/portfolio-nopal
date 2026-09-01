## PROBLEM

People paste real data into LLM prompts. Not carelessly, just in the ordinary course of getting work done: a customer email with a full name and address, a log file carrying phone numbers, a spreadsheet row with an ID number still in it.

Once that prompt leaves the machine it is gone. It sits in a provider's logs, possibly in a training corpus, definitely outside whatever data policy the person was supposed to be following. Individuals and small teams have no infrastructure for this. Enterprise DLP exists, but it is priced and deployed for organisations with a security department.

The awkward part is that the useful fix and the convenient fix point in opposite directions. Reviewing every prompt by hand works and nobody does it. So the protection has to sit in the path automatically, without the user changing how they work.

## SOLUTION

A local proxy in **Go** with **SQLite**, sitting between the user and the LLM provider. Prompts are scrubbed on the way out.

**Regex detection for structured PII.** Emails, phone numbers, national ID numbers, card numbers: data with predictable shape, matched deterministically. No model inference, no ambiguity about whether a match happened.

**Custom filters with replace or delete.** Beyond the built-in patterns, users define their own rules and choose the action: substitute a placeholder or remove the value outright. Redaction policy differs by context, so the tool takes direction rather than deciding for everyone.

**Go because it has to be invisible.** A proxy in the request path adds latency to every prompt. Go compiles to a single binary with no runtime to install, starts instantly, and handles concurrent requests without ceremony. Python or Node would have meant a heavier install and more overhead in the hot path.

**SQLite because it needs no server.** Rules and local state persist in a single file. A tool meant to protect one person's data should not require standing up a database.

**Local by design.** Nothing about the scrubbing leaves the machine. A privacy tool that phones home to work has misunderstood its own purpose.

Open source at [github.com/naufalrf4/veilproxy](https://github.com/naufalrf4/veilproxy).

## RESULT

veilproxy gives individuals and small teams a practical way to keep personal data out of LLM prompts without changing how they work or buying enterprise tooling. It runs locally, adds negligible overhead, and applies rules the user controls.

It is also the clearest example of a habit visible across this portfolio: the interesting engineering is rarely the model call. It is the boundary around it, where correctness has consequences.

## Ringkasan

Proxy lokal open-source yang membersihkan data pribadi dari prompt sebelum sampai ke penyedia LLM. Dibangun dengan **Go** dan **SQLite**.

Masalahnya sederhana tapi nyata: orang menempelkan data asli ke prompt bukan karena lalai, tapi karena sedang bekerja. Email pelanggan lengkap dengan nama dan alamat, file log berisi nomor telepon, baris spreadsheet yang masih memuat NIK. Begitu prompt itu terkirim, datanya sudah di luar kendali.

Deteksinya memakai **regex untuk PII berformat pasti** seperti email, nomor telepon, NIK, dan nomor kartu, ditambah **custom filter** di mana pengguna menentukan aturannya sendiri dan memilih tindakannya: ganti dengan placeholder atau hapus sepenuhnya.

Go dipilih karena proxy yang duduk di jalur request menambah latensi ke setiap prompt: Go menghasilkan satu binary tanpa runtime tambahan, start instan, dan menangani request bersamaan tanpa beban berarti. SQLite dipakai supaya aturan dan state tersimpan dalam satu file, tanpa perlu menjalankan server basis data.

Seluruh proses berjalan lokal. Alat privasi yang harus mengirim data ke luar untuk bekerja sudah salah memahami tujuannya sendiri.

Source code di github.com/naufalrf4/veilproxy. Relevan untuk kebutuhan implementasi AI yang aman, penanganan data sensitif, dan integrasi LLM untuk perusahaan.
