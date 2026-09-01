## PROBLEM

The sensor rig produces a continuous stream of four numbers. That is data, not an answer.

The people who need it are fish farmers and researchers, not engineers. They are standing beside a tank holding a phone, and the question in their head is simple: is the water safe right now, and is it getting better or worse? Handing them four raw parameters means handing them the interpretation work too, and pH plus TDS plus dissolved oxygen plus temperature is genuinely hard to read together at a glance.

Two more constraints came from the site rather than the screen. Sensors go quiet: power cuts, network drops: and a dashboard that keeps displaying the last known value as if it were live is worse than one that admits it does not know. And nobody checks a tank from a desk, so a desktop-first layout would go unused.

## SOLUTION

A mobile-first dashboard subscribing to the same MQTT stream the rig publishes to, rendering live readings the moment they arrive.

**Four parameters, read together.** pH, TDS, dissolved oxygen, and temperature are presented so they can be assessed as one picture rather than four unrelated gauges. Reading them in isolation is what makes the raw feed hard to use.

**Trend over snapshot.** A single reading tells you where the tank is; the line tells you where it is heading. Drift is a slope, so the interface shows movement rather than isolated points.

**Honest about silence.** When a sensor stops reporting, the interface says so instead of leaving a stale number sitting there looking current. A monitoring tool that cannot distinguish "fine" from "not reporting" is a liability.

**Built for the phone.** Layout, tap targets, and information density were designed for someone standing at the tank, not sitting at a desk.

React and Tailwind CSS on the front, MQTT over the wire: the same protocol the hardware speaks, so there is no translation layer to fall out of sync.

## RESULT

The dashboard turns a raw four parameter sensor feed into a readable water quality picture on a phone, and is the surface through which the research data is actually used. Live at [simonair.web.id](https://simonair.web.id).

The design decisions that matter came from the site rather than the screen: showing movement instead of isolated readings, and admitting when a sensor has gone quiet rather than leaving a stale number looking current.

## Ringkasan

Dashboard web mobile-first yang mengubah data sensor kualitas air menjadi informasi yang langsung bisa dipahami peternak ikan dan peneliti: bukan sekadar menampilkan angka mentah.

Terhubung ke aliran MQTT yang sama dengan perangkat sensornya. Empat parameter (pH, TDS, dissolved oxygen, suhu) disajikan supaya bisa dibaca sebagai satu gambaran utuh, bukan empat pengukur yang berdiri sendiri.

Tiga keputusan desain yang berangkat dari kondisi lapangan: menampilkan tren bukan sekadar nilai sesaat karena drift itu berupa kemiringan grafik, secara eksplisit memberi tahu ketika sensor berhenti mengirim daripada membiarkan angka lama terlihat seolah masih aktual, dan dirancang untuk layar ponsel karena tidak ada yang memantau akuarium dari meja kerja.

Dibangun dengan React, Tailwind CSS, dan MQTT. Live di simonair.web.id. Relevan untuk kebutuhan jasa pembuatan dashboard monitoring IoT dan integrasi sensor ke antarmuka web real-time.
