## PROBLEM

Research grade water monitoring is expensive, and most people watching a tank do not need it. A hobbyist with an aquarium, or a small operation with a few ponds, does not need calibration curves or a message broker to maintain. They need to know the water is roughly where it should be, and they need the device to cost little enough that putting one on every tank is reasonable.

Reaching for the heavier build anyway is the easy mistake. A setup that already works gets reused whether or not the requirements justify it, and the price tag quietly excludes the people a simpler version would have served.

So the question was not how to build the most capable rig. It was how much rig the job actually needs.

## SOLUTION

An **ESP32-S3** wired to water quality sensors, pushing telemetry straight to Firebase for the paired web dashboard.

**Wi-Fi built into the chip.** The ESP32-S3 handles networking natively, so there is no separate module, no extra wiring, and no additional point of failure to buy and mount.

**A microcontroller because the workload is small.** Sensor polling and pushing readings to Firebase is well within what an ESP32-S3 handles on its own. The processing headroom a Raspberry Pi provides has nothing to do here.

**Cost and power as design targets.** Dropping from a single board computer to a microcontroller cuts both substantially. That is the entire point: the device has to be cheap enough to deploy widely and light enough to run continuously without attention.

**Firebase instead of a message broker.** Running a broker earns its keep when a device needs bidirectional control and offline buffering. This one needs neither, so it writes directly to Firebase and skips that layer entirely.

**A deliberate trade, not a downgrade.** The unit gives up on device calibration and processing headroom. In exchange it costs a fraction as much. For simple monitoring that is the correct side of the trade, and naming it as a trade is the difference between a considered decision and a corner cut.

## RESULT

The unit delivers reliable telemetry at a fraction of the cost and complexity of a research grade rig, sized for lighter monitoring.

The judgement worth noting is the restraint. Knowing when not to reach for the more capable option is a harder skill than being able to build it, and here the hardware tier was chosen against the requirements rather than out of habit.

## Ringkasan

Unit sensor berbasis **ESP32-S3** untuk pemantauan kualitas air, dirancang ringan dan berbiaya rendah.

Pemantauan kualitas air setara kebutuhan riset itu mahal, dan sebagian besar orang yang hanya ingin memantau akuarium tidak membutuhkannya. Penghobi atau usaha kecil dengan beberapa kolam tidak butuh kurva kalibrasi atau broker pesan yang harus dirawat. Mereka butuh tahu air masih dalam kondisi wajar, dengan harga alat yang cukup murah untuk dipasang di setiap tangki.

Kesalahan yang mudah terjadi adalah tetap memakai rakitan yang lebih berat karena sudah terbukti jalan, padahal kebutuhannya tidak menuntut itu, lalu harganya diam-diam menyingkirkan pengguna yang sebenarnya mau dilayani.

ESP32-S3 dipilih karena Wi-Fi sudah tertanam di chip sehingga tidak perlu modul jaringan terpisah, dan beban kerja membaca sensor lalu mengirim data ke Firebase memang masih sanggup ditangani mikrokontroler sendiri. Broker pesan baru sepadan kalau perangkatnya butuh kontrol dua arah dan buffer offline, dan unit ini tidak butuh keduanya, jadi datanya ditulis langsung ke Firebase. Konsekuensinya disadari: kalibrasi di perangkat dan cadangan tenaga proses dilepas, ditukar dengan biaya yang jauh lebih rendah.

Relevan untuk kebutuhan jasa pembuatan alat IoT custom, sistem monitoring sensor berbiaya rendah, dan integrasi ESP32 ke Firebase.
