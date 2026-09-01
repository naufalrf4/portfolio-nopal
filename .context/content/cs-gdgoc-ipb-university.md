## PROBLEM

A campus developer community turns over its people every year, which means it runs registration every year.

Core team, mentors, active members. Each cycle brings a new intake with different roles, and each role needs different information collected. Google Forms handles the first cohort fine. By the time the community has grown, the leadership team is reconciling several spreadsheets by hand, has no reliable list of who currently holds which role, and repeats the whole coordination effort next cycle from scratch.

The constraint that shapes the answer is who maintains it. This is a volunteer run community. Whoever builds the tool graduates. A custom backend needing someone to patch a server and rotate credentials is a tool that stops working the year its author leaves.

So the requirement was proper registration and role management with as little ongoing maintenance as the architecture allows.

## SOLUTION

A platform on **Next.js** and **Tailwind CSS** with **Supabase** handling authentication and data.

**Supabase instead of a custom backend.** The decision was explicitly about maintenance burden, not capability. It provides production grade auth and a Postgres database with no server for a volunteer team to operate, and it trades some flexibility for exactly that.

**Postgres underneath, not a document store.** Members, roles, and cycles are relational, so the relationships that matter are enforced by the database rather than by convention.

**Roles as modelled data.** Core team, mentor, and member are distinct in the schema, which is what makes the difference between a list of names and a system that can answer who holds what.

**Self service by design.** Registration and role management run without a coordinator in the loop, which is the actual goal: less manual work for whoever leads the chapter this cycle.

Live at [gdgipb.site](https://gdgipb.site).

## RESULT

Registration and role management for the GDGoC IPB University chapter became self service and organised, cutting the manual coordination the leadership team repeated every cycle.

The judgement worth noting is choosing the boring option. A community tool that outlives its author has to be cheap to keep running, and picking managed infrastructure over a custom backend was a decision about the next maintainer rather than about this build.

## Ringkasan

Platform pendaftaran untuk core team, mentor, dan anggota aktif Google Developer Group on Campus (GDGoC) IPB University. Dibangun dengan **Next.js**, **Tailwind CSS**, dan **Supabase**. Live di gdgipb.site.

Komunitas developer kampus mengganti orangnya setiap tahun, artinya proses pendaftaran juga berulang setiap tahun. Core team, mentor, anggota aktif, masing-masing dengan peran berbeda dan kebutuhan data berbeda.

Google Forms cukup untuk angkatan pertama. Begitu komunitasnya tumbuh, tim pengurus mulai menyatukan beberapa spreadsheet secara manual, tidak punya daftar tepercaya tentang siapa memegang peran apa saat ini, dan mengulang seluruh koordinasi itu dari nol pada siklus berikutnya.

Syarat yang paling menentukan solusinya adalah siapa yang akan merawatnya. Ini komunitas yang dijalankan relawan, dan siapa pun yang membangun alatnya akan lulus. Backend custom yang butuh orang untuk menambal server dan memutar kredensial adalah alat yang berhenti bekerja di tahun penulisnya pergi.

Karena itu Supabase dipilih dengan alasan beban perawatan, bukan kemampuan: menyediakan autentikasi kelas produksi dan basis data Postgres tanpa server yang harus dioperasikan tim relawan. Peran dimodelkan sebagai data, bukan sekadar kolom teks, supaya sistemnya bisa menjawab siapa memegang apa.

Relevan untuk kebutuhan jasa pembuatan sistem pendaftaran, platform manajemen keanggotaan komunitas, dan aplikasi web dengan autentikasi.
