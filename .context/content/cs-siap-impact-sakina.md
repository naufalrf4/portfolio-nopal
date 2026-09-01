## PROBLEM

A national government programme opens registration and the participants arrive all at once. Not steadily over a month: in bursts, when the announcement circulates.

Run that on forms and spreadsheets and the failure is predictable. Organisers spend their time transcribing entries and chasing incomplete submissions instead of running the programme. Participants have no way to know whether their registration went through. Duplicate entries accumulate because nothing prevents the same person registering twice. And the moment traffic spikes, the process that was merely tedious becomes the bottleneck that decides who gets in.

Government programmes add a constraint most projects do not have. The registration record is not a marketing lead, it is an official record of participation, which means data validation is not a nice-to-have and the audit trail matters as much as the feature set.

## SOLUTION

A registration platform on **Laravel** with a **React** and **Tailwind CSS** front end, backed by **MySQL**.

**Validation at the point of entry.** Requirements are enforced when the participant submits rather than discovered later by an organiser reading a spreadsheet. A registration that reaches the database is already a usable record.

**Duplicate prevention in the schema.** Uniqueness is a database constraint, not a check somebody remembers to run. The same person cannot register twice by refreshing the page.

**Built for burst traffic.** Registration load arrives in spikes tied to announcements, so the data layer and query patterns were designed for the peak rather than the average.

**Organiser administration as a first-class surface.** Reviewing, filtering, and managing participants is part of the product, not a database client and a developer on standby. The people running the programme operate it themselves.

**Laravel because the problem is conventional.** Registration, validation, and administration are exactly what a mature framework already solves well. Choosing something more novel would have added risk without adding capability.

Live in production at [siapimpact.kemendukbangga.id](https://siapimpact.kemendukbangga.id).

## RESULT

The platform digitised participant sign-up and organiser administration for a national programme run under Kemendukbangga, replacing manual handling with a system the organisers operate directly.

What it demonstrates is delivery against real constraints rather than technical novelty: a public-facing government surface, unpredictable load, and data quality requirements that cannot be cleaned up after the fact.

---

## Ringkasan

Platform pendaftaran yang mendigitalkan proses registrasi peserta dan administrasi penyelenggara untuk program pemerintah nasional di bawah Kemendukbangga.

Dibangun dengan **Laravel**, antarmuka **React** dan **Tailwind CSS**, basis data **MySQL**. Live di siapimpact.kemendukbangga.id.

Masalahnya bukan sekadar memindahkan formulir ke web. Pendaftaran program pemerintah datang dalam lonjakan besar begitu pengumuman menyebar, bukan mengalir merata. Kalau dikelola manual, penyelenggara habis waktu menyalin data dan mengejar berkas yang kurang, peserta tidak tahu pendaftarannya masuk atau tidak, dan data ganda menumpuk karena tidak ada yang mencegahnya.

Karena itu validasi ditegakkan saat peserta mengirim, bukan ditemukan belakangan saat penyelenggara membaca spreadsheet. Pencegahan data ganda ditaruh sebagai constraint di level basis data, bukan pemeriksaan yang harus diingat seseorang. Struktur data dan pola query dirancang untuk beban puncak, bukan beban rata-rata.

Antarmuka administrasi dibuat sebagai bagian dari produk supaya penyelenggara bisa mengelola pesertanya sendiri, tanpa perlu developer standby.

Relevan untuk kebutuhan jasa pembuatan sistem informasi, aplikasi web custom untuk instansi, dan platform pendaftaran acara berskala nasional.
