

==============================================================================
## SIMONAIR 4.0 - Hardware & Sensors
`simonair-4-hardware-sensors`
==============================================================================

kategori   : IoT & Hardware
techStack  : Raspberry Pi 4, MQTT, pH Sensor, TDS Sensor, Dissolved Oxygen Sensor, Temperature Sensor
liveUrl    : https://simonair.web.id
repoUrl    : None
projectDate: 2025

--- summary (19 kata) ---
A solo-built sensor rig on a Raspberry Pi 4 that feeds real-time water quality data into ongoing aquaculture research.

--- description (75 kata) ---
This rig wires pH, TDS, dissolved oxygen, and temperature sensors to a Raspberry Pi 4, transmitting readings via MQTT to the paired web dashboard. Built solo end-to-end, from sensor wiring and calibration through firmware and network transmission, it supports ongoing academic research into freshwater ornamental fish aquarium monitoring. As a flagship, fully independent IoT build, it's a strong signal of hands-on embedded systems and IoT engineering ability, not just software skill applied to a screen.

--- content (199 kata) ---
## CONTEXT

SIMONAIR 4.0 is the fourth iteration of an ongoing academic research project on freshwater ornamental fish aquarium monitoring. This entry covers the physical hardware rig, built solo end-to-end as the sensing and transmission backbone of the whole system.

## ARCHITECTURE

A Raspberry Pi 4 is wired to pH, TDS, dissolved oxygen, and temperature sensors, publishing readings over MQTT to the paired web dashboard in real time, with the Pi's onboard processing handling sensor polling, basic signal conditioning, and message publishing.

## ROLE

The full hardware build, from sensor wiring to firmware and MQTT integration, was designed and implemented solo as part of ongoing academic research, covering every layer from the physical sensor interface up through network transmission.

## CHALLENGE

Multi-parameter water quality sensors are notoriously noisy and drift-prone over time, so getting reliable, research-grade readings out of consumer-grade pH, TDS, and dissolved oxygen probes required careful wiring, filtering, and calibration work beyond just connecting a sensor and reading a value.

## RESULT

The rig reliably streams multi-parameter water quality data, forming the flagship hardware component of an ongoing aquaculture research program and demonstrating real embedded systems and IoT engineering delivered independently from first wire to live telemetry.


==============================================================================
## SIMONAIR 4.0 - Web Dashboard
`simonair-4-web-dashboard`
==============================================================================

kategori   : Web Development
techStack  : React, Tailwind CSS, MQTT
liveUrl    : https://simonair.web.id
repoUrl    : None
projectDate: 2025

--- summary (17 kata) ---
A mobile-friendly dashboard that turns live aquarium sensor readings into real-time water quality insights for fish farmers.

--- description (87 kata) ---
SIMONAIR 4.0's web dashboard is built with React and Tailwind CSS to visualize pH, TDS, dissolved oxygen, and temperature data streamed live over MQTT. As the front-end half of a full-stack IoT monitoring system, it gives ornamental fish farmers an at-a-glance view of tank conditions without needing to interpret raw sensor output themselves. The interface was designed mobile-first, since most users check on their tanks from a phone rather than a desktop. It reflects hands-on full-stack development experience spanning both real-time data visualization and IoT systems integration.

--- content (230 kata) ---
## CONTEXT

SIMONAIR is an ongoing academic research project on freshwater ornamental fish aquarium monitoring, now in its 4th iteration. This entry covers the web side: a mobile-optimized dashboard that turns raw sensor telemetry into readable, actionable water quality data for non-technical users.

## ARCHITECTURE

The dashboard is a React and Tailwind CSS single-page app that subscribes to an MQTT broker as a client, consuming pH, TDS, dissolved oxygen, and temperature readings pushed by the paired hardware rig in real time. Using a pub/sub protocol rather than polling keeps the UI responsive and low-latency, which matters when farmers need to react quickly to a water quality change.

## DECISIONS

The UI was built mobile-first since most users check tank conditions from their phones rather than sitting at a desktop dashboard, so layout, tap targets, and data density were all designed around a small screen first, then scaled up.

## CHALLENGE

Translating multi-parameter sensor streams (four different units, different normal ranges, different urgency thresholds) into a single glanceable view without overwhelming a non-technical user required deliberate UX simplification rather than just dumping raw numbers on a screen.

## RESULT

The dashboard gives fish farmers a simplified, always-current view of water quality without needing raw sensor knowledge, directly supporting faster feeding and treatment decisions in ornamental fish farming and demonstrating practical IoT-to-web integration skills valuable to any team building connected hardware products.


==============================================================================
## Photobon.id - Hardware Device
`photobon-id-hardware-device`
==============================================================================

kategori   : IoT & Hardware
techStack  : Embedded Hardware, Camera Module, Thermal Printer Integration
liveUrl    : None
repoUrl    : None
projectDate: 2026

--- summary (16 kata) ---
A custom-engineered receipt-photobooth unit built to run reliably at real events, not just in a lab.

--- description (68 kata) ---
This hardware device integrates a camera, thermal receipt printer, and embedded control logic into a custom-engineered receipt-photobooth unit. It's built for reliable operation across both rental and outright-sale deployments at real events, where there's no IT department on standby if something jams or crashes mid-party. As CTO, owning this hardware design end-to-end alongside the software stack is a rare, complete demonstration of hardware-software co-design in a commercial product.

--- content (208 kata) ---
## CONTEXT

Photobon.id is a receipt-photobooth hardware and software product. This entry covers the physical device itself, the core product being deployed at events across Bali, Bandung, and Jabodetabek, where it has to perform flawlessly in front of live guests.

## ROLE

As CTO of the product, the hardware design integrates a camera, thermal receipt printer, and embedded control logic into a single reliable unit, a role spanning component selection, mechanical and electrical integration, and firmware behavior.

## ARCHITECTURE

The device combines a camera module and thermal printer with embedded control logic, engineered to handle the wear and tear of repeated use at live events, where hundreds of print cycles and camera triggers can happen in a single evening.

## OPERATIONS

The unit is built to run reliably across both rental deployments and outright hardware sales, meaning it has to hold up under varied, less-controlled operating conditions and different levels of on-site technical supervision, a much harder reliability bar than a device that only ever runs in a controlled environment.

## RESULT

The device is the flagship physical product behind the business, deployed across multiple cities in both rental and sale formats, and demonstrates practical embedded hardware engineering shipped into a real, revenue-generating product rather than a prototype.


==============================================================================
## Photobon.id - Desktop Control App
`photobon-id-desktop-control-app`
==============================================================================

kategori   : Desktop Application
techStack  : Rust, Tauri, React
liveUrl    : None
repoUrl    : None
projectDate: 2026

--- summary (20 kata) ---
A native desktop app that runs on-site at every photobooth unit, controlling the hardware and syncing sessions to the cloud.

--- description (86 kata) ---
Built with Rust, Tauri, and a React frontend, this desktop app controls the camera and printer hardware at each photobooth unit and syncs captured sessions to the cloud backend. Tauri was chosen specifically for its small footprint and native performance on constrained kiosk hardware, letting the same UI logic that ships on the web platform extend into a native desktop control layer. It's a concrete example of applying Rust and modern native app tooling to solve a real, hardware-adjacent product problem, not just a web-only skillset.

--- content (206 kata) ---
## CONTEXT

This desktop app runs directly on-site at each Photobon.id photobooth unit, acting as the control layer between the hardware and the cloud backend, and has to keep functioning reliably even with an unstable event Wi-Fi connection.

## ARCHITECTURE

Built with Rust and Tauri, using React for the frontend, the app controls the camera and thermal printer hardware and syncs captured sessions to the cloud in real time, with Rust's low-level system access handling direct hardware I/O that a pure web app couldn't reach.

## DECISIONS

Tauri was chosen over an Electron-based approach specifically for its small footprint and native performance, which matters on the constrained kiosk hardware running at events, where every megabyte of memory and every millisecond of camera latency affects the guest experience.

## TRADEOFFS

Building on Rust and Tauri instead of a more familiar Electron/Node stack meant a steeper initial learning curve, but paid off in a smaller binary, lower resource usage, and better performance on the modest hardware actually deployed at events.

## RESULT

The app gives each photobooth unit a lightweight, reliable control layer, letting hardware operate independently on-site while staying synced to the backend, and reflects genuine cross-stack ability spanning systems-level Rust code and modern React UI work.


==============================================================================
## Photobon.id - Web & Cloud Platform
`photobon-id-web-cloud-platform`
==============================================================================

kategori   : Web Development
techStack  : Next.js, React, PostgreSQL, Cloud Storage
liveUrl    : None
repoUrl    : None
projectDate: 2026 (ongoing)

--- summary (19 kata) ---
The web and cloud backbone that runs rental and sales operations for a receipt-photobooth hardware business across multiple cities.

--- description (75 kata) ---
Built with Next.js, React, and PostgreSQL, this platform manages rentals, outright hardware sales, and client operations for a receipt-photobooth product across Bali, Bandung, and Jabodetabek. It includes cloud storage and real-time monitoring to keep event-day operations running smoothly across a distributed fleet of devices. As CTO of the business behind it, this is a from-scratch, ongoing full-stack build spanning product architecture, database design, and multi-city operational logistics, not a feature ticket in someone else's codebase.

--- content (264 kata) ---
## CONTEXT

Photobon.id is a receipt-photobooth hardware and software product. This entry covers the web and cloud platform behind it, which handles the business side of running the product across multiple event locations in Indonesia, from booking through device monitoring to post-event fulfillment.

## ROLE

As CTO of the product, this platform is designed and maintained end to end to support both rental and outright hardware sales models, coordinating client operations across Bali, Bandung, and Jabodetabek - a role covering product decisions, architecture, and hands-on implementation rather than a single narrow function.

## ARCHITECTURE

The platform is a Next.js and React web interface backed by PostgreSQL, cloud storage for captured event media, and a real-time monitoring layer that tracks device status and event activity as it happens, giving operations staff live visibility into a fleet of physically distributed hardware units.

## DECISIONS

Supporting both rental and outright-sale business models within the same platform, rather than building two separate systems, required a data model flexible enough to handle different ownership, billing, and support workflows without duplicating logic.

## OPERATIONS

Running the platform across three regions with different logistics and client needs means the system has to stay reliable on event day, when there's no room for downtime - this shaped decisions around monitoring and alerting from the start.

## RESULT

The platform is the operational core of the business, letting a small team manage rentals, sales, and multi-city event logistics from one place, and stands as a working example of building and scaling a full-stack SaaS-like product from the ground up as a technical founder.


==============================================================================
## Siap Impact SAKINA
`siap-impact-sakina`
==============================================================================

kategori   : Web Development
techStack  : Laravel, React, Tailwind CSS, MySQL
liveUrl    : https://siapimpact.kemendukbangga.id
repoUrl    : None
projectDate: 2025

--- summary (15 kata) ---
A registration platform that digitizes participant sign-up and organizer administration for a national government program.

--- description (77 kata) ---
Siap Impact SAKINA is a Laravel, React, and Tailwind CSS platform built for a national program under a government ministry, handling digital participant registration and organizer administration. It replaces manual paperwork with a structured online workflow for both participants and organizers, a system that had to hold up under the scale and scrutiny of a nationwide government rollout. Delivering a government-grade platform like this speaks directly to experience with full-stack development under real compliance and reliability expectations.

--- content (194 kata) ---
## CONTEXT

SAKINA is a national program under a government ministry (Kemendukbangga) that needed a digital way to manage participant registration and organizer administration at scale, replacing what had previously been manual, paper-based processes across many regions.

## ARCHITECTURE

The platform pairs a Laravel backend and MySQL database with a React and Tailwind CSS frontend, handling registration forms, submission tracking, and administrative review in one system, with Laravel's mature ecosystem providing the validation, authentication, and role-based access control a government platform demands.

## DECISIONS

Splitting the frontend into React while keeping Laravel as an API-driven backend, rather than using Laravel's native Blade templating, was chosen to give the UI more flexibility for the kind of dynamic, multi-step registration forms a national program requires.

## OPERATIONS

Running under a government ministry domain means the platform has to meet a higher bar for uptime, data integrity, and administrative auditability than a typical client project, which shaped decisions around validation and access control throughout.

## RESULT

Registration and organizer administration moved from manual processes to a structured digital workflow, supporting the program's national rollout and demonstrating the ability to deliver reliable, government-grade software under real operational stakes.


==============================================================================
## Thesis Final Project - Interactive Showcase
`thesis-final-project-showcase`
==============================================================================

kategori   : Web Development
techStack  : Next.js, Tailwind CSS
liveUrl    : None
repoUrl    : None
projectDate: 2026

--- summary (19 kata) ---
A pixel-art styled site that turns a dense academic thesis into something genuinely fun to explore before a defense.

--- description (75 kata) ---
Built with Next.js and Tailwind CSS, this interactive site presents an IPB thesis on IoT-based water quality monitoring for discus fish aquariums, including the full seminar paper, thesis document, and study notes. Light gamification and an anticipated-questions section make thesis defense preparation more approachable, turning a stack of PDFs into a browsable, organized experience. It's a small but telling example of applying front-end craft to a personal, high-stakes deadline rather than just a client brief.

--- content (166 kata) ---
## CONTEXT

This project presents the IPB thesis "Implementation of an IoT-Based Water Quality Monitoring System for Discus Fish Aquariums with a Risk Index" in a format built for exploration rather than a static PDF, tying directly into the same IoT water-monitoring research theme as the SIMONAIR and ELSA projects.

## ARCHITECTURE

The site is built with Next.js and Tailwind CSS in a pixel-art visual style, hosting the full seminar paper, the complete thesis document, study notes, and an anticipated-questions section for defense preparation, all organized as a navigable, linked experience rather than separate downloadable files.

## DECISIONS

Light gamification elements were added deliberately to make a dense academic paper more approachable, both for the author's own review and for anyone browsing the research, a design choice that prioritized usability over academic convention.

## RESULT

The showcase turned thesis defense prep into an interactive, organized experience instead of scattered documents and notes, demonstrating that even a personal academic deliverable can be treated with real product-design thinking.


==============================================================================
## veilproxy
`veilproxy`
==============================================================================

kategori   : Desktop Application
techStack  : Go, SQLite
liveUrl    : None
repoUrl    : https://github.com/naufalrf4/veilproxy
projectDate: 2026

--- summary (18 kata) ---
An open-source local proxy that scrubs personal data out of your prompts before they reach an LLM provider.

--- description (82 kata) ---
veilproxy is an open-source Go reverse proxy that intercepts outgoing LLM API traffic and scrubs PII like emails, phone numbers, API keys, and names using CSV-driven rules. It ships as a single CGO-free binary with an embedded web dashboard and CLI, making it easy to run locally with zero external dependencies. Built and published on GitHub under MIT license, it's a self-initiated open-source tool that shows independent backend engineering ability and a sharp read on a real, timely problem in AI-augmented workflows.

--- content (250 kata) ---
## CONTEXT

veilproxy addresses a real problem in AI-augmented workflows: sensitive data leaking into prompts sent to third-party LLM providers, an increasingly common risk as more teams wire LLM APIs directly into their tools. It's built as an open-source, MIT-licensed tool anyone can run locally rather than trusting a third-party SaaS with the same job.

## ARCHITECTURE

Written in Go with a pure-Go SQLite backend (modernc.org/sqlite), veilproxy sits as a local reverse proxy between the user and the upstream LLM API, intercepting outgoing prompts and applying CSV-driven scrubbing rules (remove, replace, regex, block) to catch emails, phone numbers, API keys, JWTs, names, and credit card numbers before they ever leave the machine.

## DECISIONS

Choosing a CGO-free SQLite driver keeps the tool shipping as a single static binary with no external dependencies, which matters for a security tool people need to trust and install easily, a real engineering tradeoff made in favor of distribution simplicity and auditability.

## STACK RATIONALE

Go was chosen for its strong concurrency model, fast compile times, and single-binary distribution story, all of which matter for a proxy that needs to be lightweight, fast, and trivially easy for a security-conscious user to install and verify.

## RESULT

veilproxy gives individuals and small teams a practical, self-hosted way to reduce PII exposure in their LLM usage, packaged as a single binary with both a CLI and an embedded web dashboard, and stands as public, inspectable proof of backend engineering skill applied to a genuinely useful security tool.
