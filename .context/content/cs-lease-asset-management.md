## PROBLEM

A bank's retail network is thousands of lease agreements attached to thousands of physical locations, and the two facts drift apart the moment they are tracked separately.

An outlet sits in a leased unit. An ATM sits in a leased corner of somebody else's building. Each of those has a contract with a term, a renewal date, and an obligation attached to it. Track the lease in one system and the asset placement in another, and nobody can answer the question that actually matters: which contracts are expiring, and what physical infrastructure is sitting on them.

Kept in spreadsheets and outlet by outlet records, the failure is not messy data. It is a renewal date that passes unnoticed on a unit that is still operating, or a lease being paid on a location that no longer has anything installed. Both are direct financial exposure.

Banking adds a constraint that changes how the system has to be built. This data is contractual and auditable. A record that is merely probably correct is not usable.

## SOLUTION

A lease and asset management system on **Laravel** with **MySQL**, built for a bank client in Indonesia. Client details remain confidential under the engagement.

**Lease obligation and asset placement in one relational model.** Contract terms and the physical location of each outlet or ATM are linked in the schema rather than reconciled by hand. The link is the whole product.

**Renewal dates as tracked state.** Contract periods and renewal timing are modelled data, not something a person has to notice in a column. Expiry is queryable.

**Validation shaped by audit requirements.** Banking clients expect strict accuracy for anything touching contractual obligations and physical assets, and that expectation drove how lease records, dates, and location data are validated on entry rather than corrected later.

**Laravel and MySQL because the requirement is reliability.** The interesting engineering here is the data model and its integrity guarantees, not the framework. A mature, well understood stack is the correct choice when the system's value is that its records can be trusted.

## RESULT

The bank gained a centralised view of lease obligations and asset placement across its retail and ATM network, replacing manual outlet by outlet record keeping.

This is unglamorous back office software, and that is the point. It is the category real financial institutions depend on daily, and delivering it under a confidential banking engagement means the work met enterprise expectations for accuracy and auditability rather than demo standards.

## Ringkasan

Sistem manajemen sewa dan aset untuk klien perbankan di Indonesia, mengelola penyewaan gerai retail dan unit ATM. Dibangun dengan **Laravel** dan **MySQL**. Detail klien bersifat rahasia sesuai ketentuan kerja sama.

Jaringan retail sebuah bank berisi ribuan perjanjian sewa yang menempel pada ribuan lokasi fisik, dan dua fakta itu mulai berbeda begitu dicatat di tempat terpisah. Gerai berada di unit sewaan. ATM menempati sudut bangunan milik pihak lain. Masing-masing punya kontrak dengan masa berlaku, tanggal perpanjangan, dan kewajiban yang mengikat.

Kalau sewa dicatat di satu tempat dan penempatan aset di tempat lain, tidak ada yang bisa menjawab pertanyaan yang sebenarnya penting: kontrak mana yang akan berakhir, dan aset fisik apa yang bergantung padanya.

Dikelola lewat spreadsheet, risikonya bukan sekadar data berantakan, tapi tanggal perpanjangan terlewat pada unit yang masih beroperasi, atau sewa yang terus dibayar untuk lokasi yang sudah tidak ada perangkatnya. Keduanya kerugian finansial langsung.

Sektor perbankan menambah syarat yang mengubah cara sistem dibangun: data ini bersifat kontraktual dan harus bisa diaudit. Karena itu validasi ditegakkan saat data masuk, bukan diperbaiki belakangan.

Relevan untuk kebutuhan jasa pembuatan sistem informasi perusahaan, manajemen aset, dan aplikasi web custom untuk institusi keuangan.
