## PROBLEM

Claymorphism, Y2K Cyber, Neo Brutalist, Swiss, Material 3, Dark Luxury. Fifteen visual languages with almost nothing in common, and the naive way to demonstrate them is to build fifteen sites.

That approach collapses under its own weight. Fifteen component sets means fifteen buttons, fifteen dialogs, fifteen tables, each maintained separately and each drifting from the others. Fixing a focus state means fixing it fifteen times, and any comparison between systems becomes unreliable because the underlying components are no longer the same.

The interesting question is the opposite one: how far can a single shared component layer stretch before it breaks? Brutalist and luxury are not variations on a theme. One is deliberately harsh, the other deliberately restrained. Making the same button convincingly native to both, without forking it, is a real constraint rather than a styling exercise.

## SOLUTION

A site on **React**, **Vite**, **TanStack Router**, and **Tailwind CSS** where fifteen design systems swap across one shared component set.

**Radix UI and shadcn/ui as the foundation.** Building on accessible primitives and a composable pattern, instead of restyling fifteen component libraries, is the decision that made token driven swapping possible at all. Behaviour and accessibility stay in one place.

**Tokens carry the identity.** Each system swaps CSS tokens and fonts. No component logic is duplicated per style, which means a system is defined by its values rather than by its own copy of the code.

**Realistic scenes, not swatches.** Each system renders working SaaS dashboards, editorial layouts, and landing pages. A palette on a grid tells you nothing about whether a design language survives an actual interface.

**Spacing, shadow, and typography as the hard part.** Making one component set feel native across fifteen aesthetics came down to a disciplined token system and attention to how those three properties carry a visual language. Colour is the easy half.

**A downloadable spec per system.** Each one ships a design spec for reference or reuse, so the output is usable rather than just viewable.

Live at [design.nrflabs.net](https://design.nrflabs.net).

## RESULT

Fifteen distinct visual identities running on one component layer, each demonstrated on realistic interfaces with a spec attached.

The reason this sits in an engineering portfolio rather than a design one is the combination. Design system thinking and front end architecture are usually separate people, and the constraint that makes this project work, no forked components, is an engineering constraint solved with design judgement.

## Ringkasan

Showcase interaktif berisi 15 sistem desain visual berbeda, dari Claymorphism, Y2K Cyber, Neo Brutalist, Swiss, Material 3, hingga Dark Luxury, semuanya berjalan di atas satu set komponen yang sama. Dibangun dengan **React**, **Vite**, **TanStack Router**, dan **Tailwind CSS**. Live di design.nrflabs.net.

Cara paling naif untuk memperagakan 15 bahasa visual adalah membangun 15 situs. Pendekatan itu runtuh sendiri: 15 set komponen berarti 15 tombol, 15 dialog, 15 tabel, masing-masing dirawat terpisah dan perlahan menyimpang satu dari yang lain. Memperbaiki satu focus state berarti memperbaikinya 15 kali, dan perbandingan antar sistem jadi tidak sahih karena komponen dasarnya sudah tidak sama.

Pertanyaan yang lebih menarik justru kebalikannya: seberapa jauh satu lapisan komponen bersama bisa ditarik sebelum jebol. Brutalist dan luxury bukan variasi dari tema yang sama. Satu sengaja kasar, satu sengaja tertahan.

Kuncinya membangun di atas primitif Radix UI dan pola komposisi shadcn/ui, bukan menata ulang 15 pustaka komponen. Identitas setiap sistem dibawa lewat pertukaran token CSS dan font, tanpa menduplikasi logika komponen. Bagian tersulit ternyata spasi, shadow, dan tipografi, karena tiga hal itulah yang paling menentukan rasa sebuah bahasa desain. Warna justru bagian yang mudah.

Setiap sistem juga menyertakan spesifikasi desain yang bisa diunduh. Relevan untuk kebutuhan jasa pembuatan design system, frontend engineering React, dan pengembangan komponen UI yang dapat digunakan ulang.
