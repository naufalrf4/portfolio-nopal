## PROBLEM

A photobooth at an event has one job and no second chance at it. There is a queue, the guests are already impatient, and if the unit stalls the failure happens in front of a room full of people rather than in a workshop where it can be debugged quietly.

The receipt format raises the stakes further. A thermal printer is a moving mechanical part in a box that otherwise has none: it jams, it runs out of paper mid-print, and it fails in ways a camera never does. Meanwhile the unit is trucked between venues, plugged into whatever power the venue happens to have, and operated by staff whose job is the event, not the equipment.

So the requirement was not "build a photobooth". It was: build something that keeps working after everyone stops paying attention to it, and that fails in a way a non-technical operator can understand and fix on the spot.

## SOLUTION

A custom-engineered receipt-photobooth cabinet, designed as one integrated unit rather than parts bolted together.

**Camera module and thermal printer as a single pipeline.** Capture, process, and print form one path with defined behaviour at each step, so a failure at the printer does not silently discard the photo that was already taken.

**Built for the venue, not the bench.** Power interruption and physical handling were treated as expected operating conditions rather than edge cases. The unit is moved, plugged in, and switched on by people who did not build it.

**Legible to the operator.** Status is visible at the cabinet itself, so a jam or an empty paper roll reads as an obvious physical condition rather than something that requires diagnosis. The person who can fix it fastest is the one standing next to it.

**Enclosure as part of the engineering.** Component layout, paper path, and access for reloading were designed together: a photobooth that needs disassembly to change paper is a photobooth that stops working at the worst possible moment.

Deployed to clients across **Bali, Bandung, and Jabodetabek**, operating as rental units and outright hardware sales.

## RESULT

The unit runs at live events as a commercial product, not a prototype: sold and rented to clients across three regions, with the reliability requirements that come from revenue depending on it working.

This is the hardware layer of a product where the same engineer also built the desktop control application driving it and the cloud platform running the business around it. The physical device, the software on it, and the system it reports to were designed as one thing.

## Ringkasan

Unit photobooth struk (receipt photobooth) yang dirancang dan dibangun khusus untuk beroperasi di acara nyata: bukan prototipe lab.

Tantangan utamanya bukan membuat photobooth, tapi membuat alat yang tetap jalan setelah tidak ada lagi yang memperhatikannya. Printer termal adalah satu-satunya komponen bergerak di dalam kabinet: bisa macet, bisa habis kertas di tengah cetak. Unitnya juga dipindah antar venue, dicolok ke listrik apa pun yang tersedia, dan dioperasikan staf acara yang bukan teknisi.

Karena itu modul kamera dan printer termal dirancang sebagai satu alur terpadu, kondisi seperti listrik terputus diperlakukan sebagai hal normal bukan kasus khusus, dan status alat dibuat terbaca langsung di kabinet supaya operator non-teknis bisa mengatasi macet atau ganti kertas tanpa perlu memahami sistemnya.

Sudah beroperasi untuk klien di **Bali, Bandung, dan Jabodetabek**, baik sebagai unit sewa maupun penjualan perangkat. Relevan untuk kebutuhan jasa pembuatan alat IoT custom dan pengembangan produk hardware komersial.
