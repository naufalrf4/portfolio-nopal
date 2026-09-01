## PROBLEM

SIMONAIR solves water quality monitoring properly. Raspberry Pi 4, four probes, on device calibration, offline buffering, a composite risk index. It is research grade, and it costs what research grade costs.

That is the wrong answer for most people who want to watch a tank. A hobbyist with an aquarium, or a small operation with a few ponds, does not need a risk index or calibration curves. They need to know the water is roughly where it should be, and they need the device to cost little enough that putting one on every tank is reasonable.

Reaching for the same rig anyway is the easy mistake. It is the setup that already works, so it gets reused whether or not the requirements justify it, and the price tag quietly excludes the people the simpler version would have served.

So the question was not how to build a better rig. It was how much rig the job actually needs.

## SOLUTION

An **ESP32-S3** wired to water quality sensors, publishing telemetry to cloud storage for the paired ELSA dashboard.

**Wi-Fi built into the chip.** The ESP32-S3 handles networking natively, so there is no separate module, no extra wiring, and no additional point of failure to buy and mount.

**A microcontroller because the workload is small.** Sensor polling and publishing is well within what an ESP32-S3 handles on its own. The processing headroom a Raspberry Pi provides has nothing to do here.

**Cost and power as design targets.** Dropping from a single board computer to a microcontroller cuts both substantially. That is the entire point: the device has to be cheap enough to deploy widely and light enough to run continuously without attention.

**A deliberate trade, not a downgrade.** ELSA gives up SIMONAIR's on device calibration and processing headroom. In exchange it costs a fraction as much. For simple monitoring that is the correct side of the trade, and naming it as a trade is the difference between a considered decision and a corner cut.

## RESULT

The unit delivers reliable telemetry at a fraction of the cost and complexity of the SIMONAIR rig, sized for lighter monitoring rather than research.

Having both in the portfolio is the point. The same engineer built the research grade rig and the cheap one, which means the hardware tier was chosen against requirements rather than habit. Knowing when not to reach for the more capable option is a harder skill than being able to build it.

## Ringkasan

Unit sensor berbasis **ESP32-S3** untuk pemantauan kualitas air, dirancang sebagai alternatif yang lebih ringan dan murah dibanding SIMONAIR.

SIMONAIR menyelesaikan masalah pemantauan kualitas air secara menyeluruh: Raspberry Pi 4, empat probe, kalibrasi di perangkat, buffer offline, dan risk index. Kualitasnya setara kebutuhan riset, dan harganya mengikuti.

Untuk sebagian besar orang yang hanya ingin memantau akuarium, itu jawaban yang berlebihan. Penghobi atau usaha kecil dengan beberapa kolam tidak butuh risk index atau kurva kalibrasi. Mereka butuh tahu air masih dalam kondisi wajar, dengan harga alat yang cukup murah untuk dipasang di setiap tangki.

Kesalahan yang mudah terjadi adalah memakai rig yang sama karena sudah terbukti jalan, padahal kebutuhannya tidak menuntut itu, lalu harganya diam-diam menyingkirkan pengguna yang sebenarnya mau dilayani.

ESP32-S3 dipilih karena Wi-Fi sudah tertanam di chip sehingga tidak perlu modul jaringan terpisah, dan beban kerja membaca sensor lalu mengirim data memang masih sanggup ditangani mikrokontroler sendiri. Konsekuensinya jelas dan disadari: ELSA melepas kalibrasi di perangkat dan cadangan tenaga proses milik SIMONAIR, ditukar dengan biaya yang jauh lebih rendah.

Relevan untuk kebutuhan jasa pembuatan alat IoT custom, sistem monitoring sensor berbiaya rendah, dan integrasi ESP32 ke cloud.
