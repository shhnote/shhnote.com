---
title: "Siklus hidup kriptografi selengkapnya"
description: "Apa yang terjadi pada data Anda di setiap langkah di shhnote — primitif, parameter, dan batas kepercayaan dijabarkan, lengkap dengan catatan jujurnya."
eyebrow: "Keamanan · Mendalam"
intro: "Penjelasan rinci tentang apa yang terjadi pada data Anda di setiap langkah — dengan primitif, parameter, dan batas kepercayaan yang dijabarkan. Setiap langkah dibuka dengan ringkasan dalam bahasa sederhana, jadi Anda bisa membaca sedalam yang Anda mau."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Langkah 01 · Enkripsi</p>
      <h3>Rahasia Anda disegel di perangkat Anda</h3>
      <p class="plain"><b>Sederhananya:</b> pengacakan terjadi di browser Anda, sebelum apa pun diunggah. Yang kami terima sudah tidak bisa dibaca.</p>
    </div>
    <div class="explainer__detail">
      <p>Saat Anda menekan <b>Enkripsi</b>, browser membuat kunci konten 256-bit yang baru dari WebCrypto CSPRNG dan mengenkripsi payload Anda dengan <b>AES-256-GCM</b>. GCM bersifat terautentikasi: setiap potongan data membawa tag 128-bit, sehingga perubahan apa pun di kemudian hari terdeteksi, alih-alih didekripsi diam-diam.</p>
      <p>Teks dan file ditangani dengan cara yang sama — keduanya menjadi satu gumpalan data biner yang buram, diberi padding hingga ukuran standar sehingga kata sandi pendek dan file kecil tampak serupa. Plaintext tidak pernah menyentuh jaringan dan tidak pernah meninggalkan memori tab.</p>
      <div class="spec-list">
        <div><span class="k">Cipher</span><span class="v">AES-256-GCM, potongan 64 KiB</span></div>
        <div><span class="k">Kunci konten</span><span class="v">256-bit, baru untuk tiap rahasia</span></div>
        <div><span class="k">Nonce</span><span class="v">awalan acak 7 byte + penghitung</span></div>
        <div><span class="k">Tag autentikasi</span><span class="v">128-bit per potongan</span></div>
        <div><span class="k">Padding</span><span class="v">Padmé, minimal 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Langkah 02 · Penyimpanan kunci</p>
      <h3>Kunci tersembunyi di tautan, bukan di server kami</h3>
      <p class="plain"><b>Sederhananya:</b> bagian tautan setelah tanda <span class="color-accent">#</span> menyimpan kuncinya — dan browser tidak pernah mengirim bagian itu ke server mana pun.</p>
    </div>
    <div class="explainer__detail">
      <p>Tautan Anda membawa <b>seed</b> acak 256-bit di <b>fragmen</b> URL — semua yang ada setelah tanda <span class="color-accent">#</span>. Menurut spesifikasi URL, fragmen dibuang oleh browser dan <b>tidak pernah disertakan dalam permintaan</b> yang dikirim ke server kami. Dari seed itu, browser menurunkan dengan HKDF sebuah nilai pencarian untuk menemukan rahasia dan kunci yang membuka bungkus kunci konten. Server hanya pernah melihat hash dari nilai pencarian itu.</p>
      <p>Browser penerima membaca seed dari fragmen dan melakukan penurunan yang sama secara lokal. Inilah arti “zero-knowledge” di sini: memiliki ciphertext saja tidak ada gunanya tanpa tautannya.</p>
      <div class="spec-list">
        <div><span class="k">Lokasi kunci</span><span class="v">fragmen URL #</span></div>
        <div><span class="k">Dikirim ke server?</span><span class="v">tidak pernah</span></div>
        <div><span class="k">Seed</span><span class="v">32 byte acak, base64url</span></div>
        <div><span class="k">Derivasi</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Disimpan server</span><span class="v">hanya SHA-256(lookup)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Langkah 03 · Frasa sandi opsional</p>
      <h3>Kunci kedua yang hanya dipegang manusia</h3>
      <p class="plain"><b>Sederhananya:</b> tambahkan frasa sandi, dan bahkan orang yang memegang tautan lengkapnya tidak bisa membuka rahasia tanpa frasa sandi itu.</p>
    </div>
    <div class="explainer__detail">
      <p>Jika Anda memasang frasa sandi, frasa sandi itu diperkuat dengan <b>Argon2id</b> — fungsi derivasi kunci yang boros memori — lalu digabungkan dengan seed menjadi kunci yang membungkus kunci konten. Frasa sandinya sendiri tidak pernah dikirim atau disimpan; hanya Anda dan penerima yang mengetahuinya. Tebakan yang salah dicoba ulang di browser penerima terhadap data yang sudah dimilikinya, sehingga server tidak bisa menghitungnya.</p>
      <p>Sifat boros memori membuat penebakan offline berskala besar menjadi mahal, bahkan dengan GPU dan ASIC. Bagikan frasa sandi lewat <b>saluran yang berbeda</b> dari tautannya, sehingga kedua faktor itu tidak pernah bertemu di satu tempat. Modul Argon2 diambil pada setiap pembuatan dan penampilan rahasia, sehingga jaringan tidak bisa mengetahui rahasia mana yang memakai frasa sandi.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Salt</span><span class="v">acak 128-bit</span></div>
        <div><span class="k">Pembungkusan</span><span class="v">AES-256-GCM, IV 96-bit</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Langkah 04 · Transit &amp; penyimpanan</p>
      <h3>Hanya ciphertext yang meninggalkan perangkat Anda</h3>
      <p class="plain"><b>Sederhananya:</b> kami menyimpan kotak terkunci dan waktu kedaluwarsa. Tidak ada yang lain — tanpa plaintext, tanpa kunci, tanpa catatan tentang Anda.</p>
    </div>
    <div class="explainer__detail">
      <p>Gumpalan data diunggah lewat <b>TLS</b> dan disimpan sebagai ciphertext bersama kredensial yang di-hash, masa berlakunya, dan waktu kedaluwarsa yang dibulatkan. Kami sengaja <b>tidak</b> menyimpan identitas pengirim, penerima, log IP, waktu pembuatan, atau riwayat akses. Tidak ada sistem akun yang bisa mengaitkan rahasia dengan seseorang. Pembatasan laju bekerja dengan HMAC dari alamat menggunakan salt yang dirotasi, sehingga tidak ada data sebelum rotasi yang bisa dikaitkan dengan data sesudahnya.</p>
      <p>Karena objek yang disimpan tidak bermakna tanpa seed di fragmen, peretasan server atau surat perintah pengadilan hanya menghasilkan byte buram dan hash yang tidak bisa diubah kembali menjadi apa pun.</p>
      <div class="spec-list">
        <div><span class="k">Saat transit</span><span class="v">TLS</span></div>
        <div><span class="k">Saat disimpan</span><span class="v">ciphertext + kunci yang di-hash + waktu kedaluwarsa</span></div>
        <div><span class="k">Log</span><span class="v">tidak ada per rahasia</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Langkah 05 · Pengambilan &amp; pemusnahan</p>
      <h3>Pembaca pertama yang menang — lalu dihapus</h3>
      <p class="plain"><b>Sederhananya:</b> membuka tautan sekali pakai menyerahkan kotaknya satu kali dan menghapus salinan di server. Atau musnahkan sendiri, kapan saja.</p>
    </div>
    <div class="explainer__detail">
      <p>Tidak ada yang diambil saat halaman tampilan dimuat: permintaan baru dikirim saat ada klik atau tekan tombol yang sungguhan, sehingga pemindai tautan dan pratinjau chat tidak bisa menghabiskan rahasia. Untuk rahasia sekali lihat, server <b>mengklaim</b> barisnya dalam satu update bersyarat — tepat satu permintaan yang menang — dan rahasia dianggap sudah terpakai sejak saat itu. Browser yang sama dapat mengunduh ulang selama 15 menit jika koneksi terputus; tidak ada orang lain yang bisa, dan klaim yang tidak dikonfirmasi dimusnahkan, tidak pernah dibatalkan. Rahasia berbatas waktu cukup dibaca biasa sampai kedaluwarsa.</p>
      <p>Setiap rahasia juga memiliki <b>tautan pemusnah</b> pribadi. Membukanya saja tidak memusnahkan apa pun; mengonfirmasinya langsung menghapus ciphertext — sebelum penerima mana pun sempat membacanya.</p>
      <div class="spec-list">
        <div><span class="k">Sekali lihat</span><span class="v">klaim atomik, lalu dimusnahkan</span></div>
        <div><span class="k">Jangka waktu unduh ulang</span><span class="v">15 menit, hanya klien yang sama</span></div>
        <div><span class="k">Kedaluwarsa</span><span class="v">15 menit – 14 hari</span></div>
        <div><span class="k">Kendali pemilik</span><span class="v">tautan pemusnah</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Model ancaman</p>
  <h2 class="section__heading">Apa yang bisa dan tidak bisa dilihat shhnote</h2>
  <p class="section__intro">Versi jujurnya. Inilah persisnya letak batas kepercayaan.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Tidak pernah meninggalkan perangkat Anda</p>
    <h3>Yang tidak bisa kami lihat</h3>
    <p>Plaintext Anda · kunci konten dan seed · frasa sandi Anda · apakah frasa sandi dipasang · siapa yang membuat atau membuka rahasia · kapan rahasia dibuat · log akses tingkat IP. Tidak satu pun dikirim atau disimpan.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Disimpan di server kami</p>
    <h3>Yang memang kami simpan</h3>
    <p>Gumpalan data terenkripsi yang tidak bisa kami buka · kelas ukurannya setelah padding · hash satu arah dari nilai yang dipakai browser Anda untuk menemukan atau memusnahkannya · apakah rahasia itu sekali lihat atau berbatas waktu · waktu kedaluwarsa yang dibulatkan. Semuanya tidak berguna tanpa seed di tautan Anda.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Perlu diketahui</p>
    <h3>Catatan jujurnya</h3>
    <p>Siapa pun yang memegang tautan lengkapnya (dan frasa sandi, jika dipasang) dapat membaca rahasia sekali lihat — perlakukan tautan itu sebagai rahasianya. Setelah rahasia ditampilkan, halaman menimpa apa yang bisa ditimpanya saat Anda pergi, tetapi JavaScript tidak bisa menjaminnya; tutup tab setelah selesai. Browser yang dikendalikan otomatisasi dan menyuntikkan input sungguhan dapat membuka rahasia sekali lihat seperti yang dilakukan manusia — penerima kemudian tidak menemukan apa-apa, dan itulah hasil yang jujur. Menghapus rahasia menghilangkan catatannya; sisa data terenkripsi mungkin masih tertinggal di jurnal, ruang disk kosong, atau cadangan sampai tertimpa, sebagai ciphertext tanpa kunci. Rahasia berukuran besar yang disimpan di luar database membawa waktu file itu ditulis. Dan seperti aplikasi web mana pun, Anda memercayai kode yang dikirim ke browser Anda — karena itulah shhnote bersumber terbuka dan bisa di-host sendiri.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Spesifikasi kriptografi</p>
  <h2 class="section__heading">Setiap primitif, di satu tempat</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Enkripsi</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Enkripsi simetris terautentikasi dalam potongan 64 KiB. Kunci 256-bit ditambah tag integritas per potongan, sehingga perubahan atau pemotongan data terdeteksi — bukan sekadar menjadi tak terbaca.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Derivasi kunci</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Kunci dan pengenal diturunkan dari seed melalui HKDF-SHA-256. Frasa sandi opsional diperkuat dengan KDF yang boros memori, sehingga brute-force offline menjadi lambat dan mahal, bahkan dengan perangkat keras khusus.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Keacakan</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Seed, kunci, salt, dan nonce berasal dari generator acak browser yang aman secara kriptografis. Tidak pernah <span class="color-faint">Math.random()</span>, tidak pernah bisa ditebak.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Penyimpanan kunci</p>
    <div class="spec__val">Fragmen URL&nbsp;#</div>
    <p>Seed ikut di belakang tanda # pada tautan Anda. Browser tidak pernah mengirimkan fragmen, jadi seed tidak pernah sampai ke server kami.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Saat transit</p>
    <div class="spec__val">TLS</div>
    <p>Hanya ciphertext yang pernah meninggalkan perangkat Anda, dikirim lewat TLS modern. Yang kami terima hanyalah gumpalan data buram yang tidak bisa kami buka.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Saat disimpan</p>
    <div class="spec__val">Ciphertext + hash</div>
    <p>Kami menyimpan gumpalan data terenkripsi, hash satu arah dari kredensialnya, dan waktu kedaluwarsa yang dibulatkan — tanpa plaintext, tanpa kunci, tanpa metadata pengirim atau penerima.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">FAQ teknis</p>
  <h2 class="section__heading">Bagi yang peduli keamanan</h2>
</header>

<div class="faq">
  <details open>
    <summary>Bagaimana jaminan sekali lihat ditegakkan terhadap race condition?</summary>
    <p>Proses penampilan rahasia menjalankan satu update bersyarat yang memindahkan baris dari “active” ke “claimed”. Dua permintaan bersamaan tidak mungkin sama-sama berhasil; permintaan kedua melihat catatan yang sudah diklaim dan mendapat respons “rahasia tidak ditemukan” yang sama seperti orang lain. Klaim tidak pernah dibatalkan: jika unduhan terputus, pemegang token klaim mengunduh ulang dalam jangka waktu yang tersedia, dan jika tidak, rahasia dimusnahkan tanpa pernah dibaca.</p>
  </details>
  <details>
    <summary>Mengapa memakai fragmen URL, bukan parameter query?</summary>
    <p>Parameter query dikirim ke server dan masuk ke log akses, proxy, dan analitik. Fragmen (setelah <span class="color-accent">#</span>) menurut spesifikasi URL tetap berada di sisi klien — browser tidak pernah memasukkannya ke permintaan HTTP. Sifat itulah yang menjadi dasar seluruh rancangan zero-knowledge. Setelah rahasia ditampilkan, halaman juga menghapus fragmen dari bilah alamat dan riwayat.</p>
  </details>
  <details>
    <summary>Apa yang mencegah pemindai tautan memusnahkan rahasia sekali lihat lebih awal?</summary>
    <p>Halaman tampilan adalah dokumen statis yang sama untuk setiap rahasia dan tidak mengambil apa pun saat dimuat. Permintaan hanya dikirim saat ada klik atau tekan tombol yang tepercaya — <code>click()</code> lewat skrip atau pengiriman formulir tidak dihitung. Pemindai otomatis (keamanan email, pratinjau tautan di chat, antivirus) hanya pernah memuat kerangka statis itu.</p>
  </details>
  <details>
    <summary>Bisakah saya memverifikasi atau meng-host sendiri layanan ini?</summary>
    <p>Bisa. Seluruh kode sumbernya publik di bawah AGPLv3, protokolnya ditulis dalam spesifikasi dengan vektor kesesuaian yang bisa dipakai implementasi mana pun untuk memeriksa dirinya sendiri, dan tersedia panduan hosting mandiri. Anda dapat mengaudit kriptografi di sisi klien dan menjalankan instans Anda sendiri sehingga batas kepercayaan sepenuhnya ada di tangan Anda.</p>
  </details>
  <details>
    <summary>Apakah ada yang dicatat untuk mencegah penyalahgunaan?</summary>
    <p>Kami tidak menyimpan log akses per rahasia atau riwayat IP. Pembatasan laju menggunakan hash berkunci dari alamat dengan salt yang dirotasi, dan setiap rotasi ikut menghapus semua penghitung. Laporan penyalahgunaan dihitung per hari; tidak ada catatan tentang rahasia mana yang dilaporkan.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Tips berbagi dengan aman

- Kirim frasa sandi lewat cara yang berbeda dari tautannya, misalnya tautan lewat email dan frasa sandi lewat telepon.
- Pilih masa kedaluwarsa terpendek yang masih memadai untuk Anda.
- Gunakan rahasia sekali lihat untuk kata sandi dan informasi lain yang semestinya dibaca tepat satu kali.

<h2 id="reporting-a-vulnerability">Melaporkan kerentanan</h2>

Jika Anda yakin telah menemukan masalah keamanan di situs ini, mohon kirim email ke [security@shhnote.com](mailto:security@shhnote.com) dan beri tahu kami secara pribadi sebelum memberi tahu orang lain. Sertakan apa yang Anda temukan dan cara mereproduksinya.

Kami akan:

- membalas dalam 5 hari kerja;
- terus mengabari Anda selama kami memperbaikinya;
- mencantumkan nama Anda saat kami merilis perbaikannya, jika Anda menginginkannya.

Saat melakukan pengujian, mohon jangan mengakses data orang lain, mengganggu layanan, atau menjalankan pemindaian otomatis yang membebaninya secara berat.

Kerentanan pada perangkat lunak shhnote itu sendiri: lihat [kebijakan keamanan proyek](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/id/#create" class="btn btn--primary"><span>Buat rahasia</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Lihat kode sumber di GitHub</span></a></p>

</div>
</div>
</section>
