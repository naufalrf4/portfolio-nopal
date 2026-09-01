## PROBLEM

Every photobooth unit needs software running on it, physically at the venue, driving real hardware. That rules out a web app: a browser tab cannot reliably hold a serial connection to a camera and a thermal printer, and it cannot keep working when the venue wifi disappears.

The constraints stack up quickly. The app has to talk to hardware directly. It has to keep operating when the network drops, because a guest standing in front of the booth does not care that the router rebooted. It has to sync sessions to the cloud once connectivity returns, without losing anything or double counting. And it has to be updated across units scattered across three regions without sending a person to each one.

It also has to be light. These are not workstations, and a runtime that eats several hundred megabytes of memory to render a few buttons is a poor trade on hardware that also has to run a capture pipeline.

## SOLUTION

A native desktop application in **Rust** with **Tauri**, using **React** for the interface.

**Tauri over Electron.** Tauri uses the operating system's own webview instead of bundling a browser, which produces a dramatically smaller binary and a much lower memory floor. On hardware that is simultaneously driving a camera and a printer, that headroom goes to the work that matters.

**Rust for the hardware layer.** Serial communication and device control sit in Rust, where failure modes are explicit rather than discovered at runtime. A dropped connection or an unexpected device response is a value to handle, not an exception that surfaces mid-session.

**Offline first, sync second.** Sessions are recorded locally as they happen and pushed to the cloud when the connection allows. The booth never waits on the network to serve the person in front of it.

**React where iteration is cheap.** The operator-facing interface changes far more often than the hardware protocol does, so it lives in the stack that is fastest to change safely.

The result is one application that owns both sides: hardware control at the device, session state to the cloud.

## RESULT

The app runs on-site at every Photobon.id unit across **Bali, Bandung, and Jabodetabek**, controlling the hardware and keeping session data synced to the platform.

It is the layer that makes the physical product a system. The same engineer built the cabinet it runs on and the cloud platform it reports to, so the boundaries between hardware, local software, and backend were designed once instead of negotiated across teams.

## Ringkasan

Aplikasi desktop native yang berjalan langsung di setiap unit photobooth, mengendalikan hardware dan menyinkronkan data sesi ke cloud.

Dibangun dengan **Rust** dan **Tauri**, antarmukanya **React**. Tauri dipilih menggantikan Electron karena memakai webview milik sistem operasi, bukan membungkus browser sendiri: ukuran binary jauh lebih kecil dan konsumsi memori lebih rendah. Pada perangkat yang sekaligus menjalankan kamera dan printer termal, selisih memori itu terpakai untuk hal yang lebih penting.

Rust dipakai di lapisan hardware karena komunikasi serial dan kontrol perangkat butuh penanganan kegagalan yang eksplisit, bukan error yang baru muncul saat acara berjalan.

Prinsip utamanya offline first: sesi dicatat lokal saat terjadi, lalu dikirim ke cloud ketika koneksi memungkinkan. Booth tidak pernah menunggu jaringan untuk melayani orang yang sedang berdiri di depannya.

Beroperasi di seluruh unit Photobon.id di Bali, Bandung, dan Jabodetabek. Relevan untuk kebutuhan jasa pembuatan aplikasi desktop untuk kontrol perangkat dan integrasi hardware ke sistem cloud.
