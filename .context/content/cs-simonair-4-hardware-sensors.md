## PROBLEM

Discus fish are unforgiving tenants. Water quality drifts continuously: pH creeps, dissolved oxygen sags overnight, temperature swings with the room: and the fish show stress long before a person notices anything wrong. The standard answer is manual measurement: dip a probe, write the number down, repeat twice a day.

That leaves two problems nobody solves by trying harder. Everything between readings is invisible, so an overnight oxygen crash is discovered in the morning as a dead fish rather than as an event. And a single number in a notebook says nothing about which direction the tank is heading.

The research this rig supports needed continuous data across four parameters at once, from a site where mains power cuts and the network drops without warning. Consumer probes are noisy and drift over weeks. A rig that only works while the internet holds is not a monitoring system, it is a demo.

## SOLUTION

A Raspberry Pi 4 wired directly to pH, TDS, dissolved oxygen, and temperature probes, polling on a fixed interval and publishing over MQTT to the paired dashboard.

The Pi was chosen over an ESP32 or Arduino for four concrete reasons, each one a requirement the microcontroller path could not meet cleanly:

**Local storage with autosync.** Readings are written to disk first, then published. When the network drops, sampling continues uninterrupted and the backlog syncs once the connection returns. Nothing is lost to a dead router.

**On-device calibration and alerting.** Probe drift is corrected against calibration curves on the Pi itself, and threshold alerts fire locally. The tank does not need a working internet connection to know something is wrong.

**Bidirectional MQTT.** The channel runs both ways: device publishes telemetry upward, cloud pushes configuration and commands down. Polling intervals and thresholds can be changed without touching the hardware.

**Headroom for fast, accurate reads.** Signal conditioning and filtering happen inline without stalling the sampling loop.

Built solo end to end: sensor wiring, calibration, firmware, network transmission.

## RESULT

The rig streams continuous multi-parameter water quality data and feeds ongoing academic research into discus fish aquarium monitoring at IPB University.

The build covered every layer: sensor specification, drift correction, firmware, offline-first sync, and the network transmission that feeds the dashboard. First wire to live telemetry, no handoff in between.

## Ringkasan

Sistem monitoring kualitas air berbasis IoT untuk akuarium ikan discus, dibangun sendiri dari nol. Raspberry Pi 4 membaca sensor pH, TDS, dissolved oxygen, dan suhu, lalu mengirimkannya lewat MQTT ke dashboard web secara real-time.

Raspberry Pi dipilih menggantikan mikrokontroler karena empat kebutuhan nyata: penyimpanan lokal dengan autosync saat koneksi putus, kalibrasi dan alerting langsung di perangkat, kanal MQTT dua arah sehingga konfigurasi bisa diubah dari cloud, dan tenaga proses yang cukup untuk pembacaan cepat dan akurat.

Mendukung riset akademik tentang pemantauan akuarium ikan discus di IPB University. Relevan untuk kebutuhan jasa pembuatan sistem monitoring IoT, integrasi sensor ke dashboard web, dan pemantauan kualitas air untuk akuakultur di Indonesia.
