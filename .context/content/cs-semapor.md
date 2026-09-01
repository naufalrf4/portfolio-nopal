## PROBLEM

Citizens already report public problems. A broken streetlight, a blocked drain, a road that floods every rainy season. What they lack is anywhere for that report to land.

So it goes into whatever channel is available: a WhatsApp group, a comment on a government social media post, a phone call to someone who might know someone. Each of those loses the report the moment the conversation scrolls past. The citizen never learns whether anything happened, and city staff receive complaints with no structure, no location, no status, and no way to tell a new issue from one already being handled.

The harder half is that this is a two sided problem with two very different users. The public needs a form simple enough to complete on a phone while standing next to the problem. City staff need a queue they can assign, prioritise, and close. Design for one and the other becomes unusable.

## SOLUTION

SEMAPOR, short for Semarang Lapor, a civic reporting platform on **Laravel** and **MySQL** built around that split.

**A public form that asks only what it must.** Submission is deliberately short. Every additional required field is a report that never gets filed.

**A resolution queue for staff.** The internal side is a workflow rather than an inbox: status, assignment, and resolution history are first class, so a report has a state instead of an age.

**A data model that carries accountability.** Report status, staff assignment, and resolution history are modelled explicitly. That is what makes the difference between a complaint box and a system somebody can be held to.

**Laravel because the risk was in the workflow, not the stack.** The genuinely hard part was designing a two sided process that serves an untrained citizen and a working city official from the same database. Spending that effort on a novel framework would have added risk without adding capability.

## RESULT

SEMAPOR won **1st place at DINACOM 2024**, judged against other entries on both execution and real world relevance.

It was built for the competition rather than deployed with a city government, so the result to read here is the design work: civic tech fails when it serves only one of its two audiences, and the win says the two sided workflow held up under external scrutiny. That is a product thinking outcome as much as an engineering one.

## Ringkasan

SEMAPOR (Semarang Lapor) adalah platform pelaporan warga yang memungkinkan masyarakat melaporkan masalah publik langsung ke petugas kota, dan petugas melacak penyelesaiannya. Dibangun dengan **Laravel** dan **MySQL**.

Warga sebenarnya sudah melaporkan masalah: lampu jalan mati, saluran tersumbat, jalan yang selalu banjir. Yang tidak ada adalah tempat laporan itu mendarat. Akhirnya masuk ke grup WhatsApp atau kolom komentar media sosial, lalu hilang begitu percakapan bergeser. Warga tidak pernah tahu tindak lanjutnya, dan petugas menerima keluhan tanpa struktur, lokasi, atau status.

Tantangan sesungguhnya adalah dua sisi pengguna yang sangat berbeda. Warga butuh formulir yang cukup singkat untuk diisi dari ponsel sambil berdiri di depan masalahnya. Petugas butuh antrean yang bisa ditugaskan, diprioritaskan, dan ditutup. Kalau dirancang untuk salah satu saja, sisi lainnya jadi tidak terpakai.

Karena itu status laporan, penugasan petugas, dan riwayat penyelesaian dimodelkan secara eksplisit di basis data. Itu yang membedakan sistem yang bisa dipertanggungjawabkan dari sekadar kotak keluhan.

**Meraih juara 1 DINACOM 2024.** Dibangun untuk kompetisi, bukan diterapkan bersama pemerintah kota, jadi yang dibuktikan di sini adalah rancangan alur kerjanya. Relevan untuk kebutuhan jasa pembuatan sistem informasi pemerintahan, platform pelaporan masyarakat, dan aplikasi web custom untuk instansi publik.
