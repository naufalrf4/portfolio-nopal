## PROBLEM

An annual festival has a website with a hard deadline that arrives whether the code is ready or not, and the site outlives each edition.

BRIEFF, the Bogor Independent Film Festival, ran three consecutive editions with a growing set of requirements each year. Edition 5.0 shipped on CodeIgniter and worked. By 6.0 the framework's structure had become the thing slowing new features down, which is the ordinary way technical debt announces itself: not as a bug, but as every change costing more than it should.

The awkward part is the timing. A migration is a rewrite, and a rewrite competes directly with the festival deadline that does not move. Staying on CodeIgniter meant every future edition paying interest on the same debt. Moving meant absorbing the cost once, during a year that also had a festival to launch.

## SOLUTION

Rebuild on **Laravel** for 6.0 and 7.0, migrating off **CodeIgniter** and **MySQL** deliberately rather than incrementally.

**Migrate because the framework was the bottleneck.** The decision was specific: CodeIgniter's structure was constraining new features, so the upfront cost of a rewrite bought maintainability across every edition after it. That is a debt payoff with a return, not a rewrite for its own sake.

**Continuity as a hard requirement.** A recurring annual event cannot have a year where the site is broken. The migration had to land without breaking the festival's public presence between editions.

**Ownership grew with the work.** Involvement moved from IT division staff on 5.0 to IT division lead on 6.0 and 7.0, including making the migration call itself. The technical decision and the responsibility for it sat with the same person.

## RESULT

Three consecutive festival editions launched, on progressively more capable platforms, with the migration completed under a deadline that could not slip.

The useful part of this project is not the stack. It is having led a live framework migration on a production site with a fixed public date attached, and having decided to take that cost rather than inherit it. Most engineers meet legacy migration as something done to them; this was chosen.

## Ringkasan

Situs resmi Bogor Independent Film Festival (BRIEFF), dibangun ulang untuk tiga edisi berturut-turut. Edisi 5.0 memakai **CodeIgniter** dan **MySQL**, lalu 6.0 dan 7.0 dipindahkan ke **Laravel**. Dikerjakan bersama Agrimovie Filmmaker Club.

Festival tahunan punya tenggat yang datang entah kodenya siap atau tidak, dan situsnya harus bertahan melewati setiap edisi. Edisi 5.0 berjalan baik di CodeIgniter. Menjelang 6.0, struktur framework itu mulai menjadi penghambat fitur baru, dan begitulah utang teknis biasanya menampakkan diri: bukan sebagai bug, tapi sebagai setiap perubahan yang jadi lebih mahal dari seharusnya.

Bagian yang sulit adalah waktunya. Migrasi berarti menulis ulang, dan menulis ulang bersaing langsung dengan tenggat festival yang tidak bisa digeser. Tetap di CodeIgniter berarti setiap edisi berikutnya membayar bunga dari utang yang sama. Pindah berarti menanggung biayanya sekali, di tahun yang juga harus meluncurkan festival.

Kelangsungan jadi syarat mutlak: acara tahunan tidak boleh punya satu tahun di mana situsnya rusak.

Peran ikut tumbuh bersama pekerjaannya, dari staf divisi IT di edisi 5.0 menjadi ketua divisi IT di 6.0 dan 7.0, termasuk mengambil keputusan migrasinya sendiri.

Relevan untuk kebutuhan jasa pembuatan website acara, migrasi sistem legacy, dan pengembangan aplikasi web Laravel.
