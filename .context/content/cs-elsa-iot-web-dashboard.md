## PROBLEM

The sensor unit feeding this dashboard is deliberately cheap. Building it a dashboard that needs a server, a database, and someone to keep both running would undo the point of it.

That is the trap with small IoT projects. The device costs very little, then the software around it acquires a hosted backend, a managed database, and an operational burden that outlasts anyone's enthusiasm for the project. Six months later the hardware still works and the dashboard is down because a certificate expired.

The users are hobbyists and small operations. They want to check their water quality from a phone, from anywhere, without owning infrastructure. Nobody is going to administer a backend for one aquarium.

So the requirement was real time remote visibility with as close to zero operational overhead as the architecture allows.

## SOLUTION

A **Next.js** and **Tailwind CSS** dashboard with **Firebase** handling cloud sync between the hardware and the interface.

**Firebase instead of a custom backend.** Managed infrastructure absorbs the operations: no server to patch, no database to back up, no deployment pipeline to maintain. For a project whose whole premise is staying lightweight, that is the decision that keeps it alive.

**Real time sync as a primitive, not a feature to build.** Firebase provides the live channel between device and browser directly, so the dashboard reflects new readings without a polling loop or a websocket layer written by hand.

**Responsive because it is checked from a phone.** Nobody monitors a tank from a desk. The interface is built for the device people actually have with them.

**A risk index rather than four raw numbers.** pH, TDS, dissolved oxygen, and temperature are combined into a single composite water quality score. This is where the risk index lives, developed as part of final-year research into discus fish aquarium monitoring. Four raw parameters require interpretation; one score answers the question that was actually being asked, which is whether the water is safe right now.

**The tradeoff stated plainly.** Leaning on Firebase gives up architectural control and portability. In return development was fast and ongoing maintenance is close to nothing. For a system whose whole premise is staying lightweight that is the right side of the trade. For research grade instrumentation it would not have been.

Live at [elsaiot.nrflabs.net](https://elsaiot.nrflabs.net).

## RESULT

Users get remote, real time visibility into water quality without the cost or operational weight of a heavier platform.

It is also where the research contribution sits. The risk index was developed here as part of final-year work on discus fish aquarium monitoring, published as *Implementation of an IoT-Based Water Quality Monitoring System for Discus Fish Aquariums with a Risk Index* through IPB University.

The judgement worth noting is right sizing. A lean stack delivered a production IoT dashboard with a real research contribution attached, and choosing managed infrastructure over a custom backend is what kept it maintainable rather than abandoned.

## Ringkasan

Dashboard web ringan untuk memantau kualitas air secara real-time dari mana saja, dibangun dengan **Next.js**, **Tailwind CSS**, dan **Firebase** untuk sinkronisasi cloud. Live di elsaiot.nrflabs.net.

Perangkat sensor yang mengisi dashboard ini sengaja dibuat murah. Kalau dashboard-nya justru menuntut server, basis data, dan orang yang merawat keduanya, tujuan awalnya batal.

Itu jebakan umum pada proyek IoT kecil: alatnya murah, lalu perangkat lunak di sekitarnya menumpuk backend berbayar, basis data terkelola, dan beban operasional yang bertahan lebih lama daripada semangat mengerjakannya. Enam bulan kemudian hardware-nya masih jalan, dashboard-nya mati karena sertifikat kedaluwarsa.

Penggunanya penghobi dan usaha kecil. Mereka ingin memeriksa kualitas air dari ponsel, tanpa harus punya infrastruktur.

Firebase dipilih supaya infrastrukturnya dikelola pihak lain: tidak ada server yang perlu ditambal, tidak ada basis data yang perlu dicadangkan. Sinkronisasi real-time juga sudah tersedia sebagai kemampuan dasar, bukan sesuatu yang harus dibangun sendiri.

Di sinilah **risk index** diterapkan: pH, TDS, dissolved oxygen, dan suhu digabung menjadi satu skor status kualitas air. Indeks ini dikembangkan sebagai bagian dari penelitian tugas akhir tentang pemantauan akuarium ikan discus, dan sudah dipublikasikan melalui IPB University. Empat angka mentah menuntut penafsiran, satu skor langsung menjawab pertanyaan sebenarnya: apakah airnya aman sekarang.

Konsekuensinya disebut terbuka: bersandar pada Firebase berarti melepas kendali arsitektur dan portabilitas, ditukar dengan pengembangan cepat dan perawatan mendekati nol. Untuk sistem yang memang diniatkan tetap ringan, itu sisi pertukaran yang tepat. Untuk instrumentasi setara kebutuhan riset, pilihannya akan lain.

Relevan untuk kebutuhan jasa pembuatan dashboard IoT, sistem monitoring real-time, dan integrasi sensor ke aplikasi web.
