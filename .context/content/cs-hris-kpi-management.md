## PROBLEM

Performance reviews collapse into spreadsheets, and spreadsheets cannot hold the shape of a review cycle.

Objectives are set at the start of a period. KPIs hang off those objectives. Progress accumulates across the period. An appraisal happens at the end, against what was agreed at the beginning, and it needs to be comparable to the appraisal happening in another department. Model that in a spreadsheet and the relationships live in a person's head: which file is current, which objective a metric belongs to, which cycle a number came from.

The failure is not lost data. It is reviews that cannot be compared. Once appraisals become freeform narrative, one manager's "exceeds expectations" means something different from another's, and there is no basis for a decision that affects someone's promotion or pay.

The data model is where this is won or lost. Get the relationship between objectives, KPIs, and review periods wrong and no amount of interface work rescues it.

## SOLUTION

An HRIS module on **Next.js**, **Tailwind CSS**, and **PostgreSQL**, focused on objective setting, KPI tracking, and appraisal.

**Management by Objectives rather than freeform review.** Structuring the system around MBO was a deliberate constraint: appraisals stay measurable and comparable across teams instead of drifting into subjective narrative. The structure is the feature.

**PostgreSQL because the relationships are hierarchical.** Objectives contain KPIs, KPIs accumulate progress, and everything is scoped to a review period. That is relational data with real integrity requirements, and it is exactly what a relational database is for.

**Review cycles as first class.** A period is modelled, not implied by a filename. Historical appraisals stay intact and comparable rather than being overwritten each cycle.

**One interface for the whole flow.** Managers define objectives, track progress, and run appraisals in the same place, which removes the gap where spreadsheet versions used to diverge.

Built for a client as part of a broader HRIS suite. Demo at [mbo-demo.wisebyte.web.id](https://mbo-demo.wisebyte.web.id).

## RESULT

HR teams and managers gained a consistent, structured way to run evaluations that scales across departments and review cycles.

The engineering interest here is entirely in the modelling. This is a workflow that is easy to build wrong, because a system that technically stores appraisals but cannot compare them across teams has failed at the only thing it was for.

## Ringkasan

Modul HRIS milik klien untuk penetapan objektif, pelacakan KPI, dan penilaian kinerja bergaya Management by Objectives. Dibangun dengan **Next.js**, **Tailwind CSS**, dan **PostgreSQL**. Demo di mbo-demo.wisebyte.web.id.

Penilaian kinerja biasanya berakhir di spreadsheet, dan spreadsheet tidak mampu menampung bentuk sebuah siklus penilaian. Objektif ditetapkan di awal periode. KPI menempel pada objektif itu. Progres terkumpul sepanjang periode. Penilaian terjadi di akhir, diukur terhadap yang disepakati di awal, dan harus bisa dibandingkan dengan penilaian di divisi lain.

Kalau dimodelkan lewat spreadsheet, relasinya hanya hidup di kepala seseorang: berkas mana yang terbaru, metrik ini milik objektif yang mana, angka itu dari siklus kapan.

Masalahnya bukan data hilang, tapi penilaian yang tidak bisa dibandingkan. Begitu penilaian jadi narasi bebas, kalimat "melampaui ekspektasi" dari satu manajer berbeda maknanya dengan manajer lain, dan tidak ada dasar yang layak untuk keputusan yang menyangkut promosi atau gaji seseorang.

Karena itu sistem sengaja dibatasi pada kerangka Management by Objectives supaya penilaian tetap terukur dan sebanding antar tim. PostgreSQL dipakai karena relasi antara objektif, KPI, dan periode penilaian memang hierarkis dan menuntut integritas data.

Relevan untuk kebutuhan jasa pembuatan sistem informasi HR, aplikasi penilaian kinerja karyawan, dan sistem informasi perusahaan custom.
