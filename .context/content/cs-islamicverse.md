## PROBLEM

In 2023, wiring an LLM into a student project meant solving a problem most tutorials at the time got wrong.

The obvious path is to call the OpenAI API from the browser. It works immediately, which is exactly why it is dangerous: the API key ships inside the page source, where anyone can read it straight out of view source and spend against it. Plenty of projects from that period did precisely this and leaked their keys.

The competing pressure was the deadline. Festival Teknik Informatika 2023 was a fixed date, and standing up a full backend framework to hide one secret is a lot of scaffolding for a static content site that otherwise needs no server at all.

So the requirement was narrow and non negotiable: keep the key server side, without turning a static site into an application that needs one.

## SOLUTION

A static site in plain **HTML, CSS, and JavaScript**, paired with a minimal **Express.js** proxy sitting between the browser and the OpenAI API.

**The proxy exists for exactly one reason.** It forwards requests and holds the API key server side. The browser never sees the credential, so it cannot be harvested from page source.

**Express because the job was small.** A heavier framework would have added deployment weight and configuration for a service whose entire responsibility is passing a request along. The proxy is the smallest thing that solves the one security requirement.

**A static frontend because the content is static.** Islamic reference information does not need a rendering framework. Plain HTML and CSS load fast, deploy anywhere, and keep the whole surface small.

**Security treated as a requirement, not a follow up.** The key handling was designed in from the start rather than patched after a review, which is the difference between a project that happens to be safe and one built to be.

## RESULT

IslamicVerse won **1st place at Festival Teknik Informatika 2023**, recognised for delivering working AI features on a simple, secure architecture.

The pattern it used, never shipping a provider credential to the client, is still the baseline for production LLM applications years later. That makes this early evidence of a habit rather than a one off: reaching for the boundary that keeps a system safe, even under a deadline that rewards shortcuts.

## Ringkasan

Situs statis bertenaga AI yang menyajikan informasi dan layanan digital keislaman, dibangun dengan **HTML, CSS, JavaScript** biasa ditambah proxy **Express.js** ringan.

Pada 2023, menyambungkan LLM ke proyek mahasiswa berarti menghadapi masalah yang saat itu masih sering salah dikerjakan. Jalan tercepat adalah memanggil API OpenAI langsung dari browser, dan justru itu bahayanya: API key ikut terkirim ke dalam kode halaman, bisa dibaca siapa pun lewat view source, lalu dipakai atas tanggungan pemiliknya. Banyak proyek dari periode itu kebocoran key dengan cara ini.

Karena itu proxy Express.js dipasang di antara browser dan API OpenAI, dengan satu tugas saja: meneruskan permintaan sambil menahan API key tetap di sisi server. Browser tidak pernah melihat kredensialnya.

Express dipilih justru karena tugasnya kecil. Framework yang lebih berat hanya menambah beban deployment untuk layanan yang isinya meneruskan request. Frontend dibiarkan statis karena kontennya memang statis.

**Meraih juara 1 Festival Teknik Informatika 2023.** Pola tidak pernah mengirim kredensial penyedia ke sisi klien masih jadi standar dasar aplikasi LLM produksi sampai hari ini. Relevan untuk kebutuhan integrasi AI yang aman dan implementasi LLM untuk aplikasi web.
