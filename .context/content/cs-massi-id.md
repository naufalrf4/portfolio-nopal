## PROBLEM

An international academic symposium has to look credible before anyone reads a word of it.

The 16th International Sago Symposium brings researchers and delegates from multiple countries to Bogor, co-organised with IPB University. Two things follow from that. The site has to work fully in both Indonesian and English, because half the audience is domestic and half is not, and translation cannot be an afterthought bolted onto a monolingual structure.

The second is harder to name but easier to feel. Conference sites overwhelmingly look the same, because they are built from the same templates. For an event representing a specific global research community, generic is its own kind of failure: the site says nothing about the field it belongs to, and delegates deciding whether to attend read that.

Both problems had to be solved without stretching the timeline of an event with a fixed date.

## SOLUTION

**Laravel** with **Inertia.js**, **React**, and **Tailwind CSS**, fully bilingual with light and dark theming.

**Inertia.js to skip the API layer.** Backend and frontend share routing and data directly, so there is no separate REST or GraphQL layer to build and keep in sync. Laravel's strengths stay available while the interface behaves like an SPA.

**Bilingual as structure, not translation.** Indonesian and English are supported throughout rather than patched in, which is the only way this works when the audience is genuinely split between both.

**Custom sago palm illustrations.** Commissioned deliberately instead of using conference templates. The visual identity is tied to the subject of the symposium itself, which is what separates a site that represents a research community from one that could belong to any event.

**Theming across the whole surface.** Light and dark are consistent throughout rather than partially applied, because an international audience arrives on every kind of device and setting.

Live at [massi.id](https://massi.id).

## RESULT

The symposium's programme, host institutions, and partner network are presented in a format that holds up in front of an international academic and industry audience.

Pairing Inertia.js with Laravel removed an entire layer most teams build by default, which was the right call here because nothing in the requirements needed a separate API.

## Ringkasan

Situs pemasaran dan pendaftaran dwibahasa untuk 16th International Sago Symposium (ISS 2026) di Bogor, diselenggarakan bersama IPB University. Dibangun dengan **Laravel**, **Inertia.js**, **React**, dan **Tailwind CSS**. Live di massi.id.

Simposium akademik internasional harus tampak kredibel sebelum satu kata pun dibaca. Acara ini mendatangkan peneliti dan delegasi dari berbagai negara, dan dua hal mengikuti dari situ. Situsnya harus benar-benar berfungsi dalam Bahasa Indonesia dan Inggris, karena separuh audiensnya domestik dan separuhnya bukan, sehingga penerjemahan tidak bisa ditempelkan belakangan pada struktur satu bahasa.

Masalah kedua lebih halus tapi lebih terasa: situs konferensi hampir selalu terlihat serupa karena dibangun dari templat yang sama. Untuk acara yang mewakili komunitas riset tertentu, tampilan generik itu sendiri sudah sebuah kegagalan, karena situsnya tidak mengatakan apa pun tentang bidang yang diwakilinya.

Inertia.js dipakai supaya backend dan frontend berbagi routing dan data secara langsung, tanpa perlu membangun lapisan REST atau GraphQL terpisah yang harus dijaga tetap sinkron. Ilustrasi bertema pohon sagu dibuat khusus, bukan memakai templat konferensi, supaya identitas visualnya terikat pada subjek simposium itu sendiri.

Relevan untuk kebutuhan jasa pembuatan website acara internasional, situs dwibahasa, dan aplikasi web Laravel dengan antarmuka modern.
