---
title: "Pertanyaan, terjawab"
description: "Pertanyaan umum tentang shhnote — akun, tautan, frasa sandi, masa kedaluwarsa, dan detail teknis bagi yang peduli keamanan."
eyebrow: "FAQ"
intro: "Jawaban singkat lebih dulu, jawaban teknis sesudahnya. Jika pertanyaan Anda tidak ada di sini, halaman cara kerja dan keamanan membahasnya lebih dalam, dan Anda selalu bisa bertanya kepada kami."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Apakah saya perlu akun?</summary>
    <p>Tidak. Tidak ada yang perlu didaftarkan dan tidak ada yang perlu dipasang. Buka shhnote, tulis rahasia Anda, bagikan tautannya. Itu saja.</p>
  </details>
  <details>
    <summary>Bagaimana jika tautannya dilihat orang yang salah?</summary>
    <p>Rahasia sekali lihat hanya bisa dibaca oleh orang pertama yang membukanya — setelah itu rahasia dimusnahkan, dan Anda akan tahu ada yang sudah membacanya karena penerima yang dituju tidak menemukan apa-apa. Untuk keamanan ekstra, Anda bisa menambahkan frasa sandi dan membagikannya secara terpisah, sehingga tautannya saja tidak cukup. Dan jika Anda berubah pikiran, Anda bisa memusnahkan rahasia itu sendiri dengan tautan pemusnah pribadi Anda.</p>
  </details>
  <details>
    <summary>Bisakah shhnote membaca rahasia saya?</summary>
    <p>Tidak. Kunci untuk membukanya tidak pernah sampai kepada kami — kunci itu tersimpan di dalam tautan Anda, di pihak Anda. Kami hanya memegang versi teracak yang tidak mungkin kami buka.</p>
  </details>
  <details>
    <summary>Apa yang terjadi jika tidak ada yang membukanya?</summary>
    <p>Anda memilih masa kedaluwarsa — mulai dari 15 menit hingga 14 hari. Saat waktunya habis, rahasia dihapus secara otomatis, entah sudah dibuka atau belum.</p>
  </details>
  <details>
    <summary>Apa bedanya rahasia sekali lihat dengan rahasia berbatas waktu?</summary>
    <p>Rahasia sekali lihat dimusnahkan begitu dibuka. Rahasia berbatas waktu bisa dibuka lagi sampai kedaluwarsa — tetapi halamannya tidak pernah memberi tahu berapa lama waktu yang tersisa, jadi perlakukan setiap rahasia sebagai sesuatu yang harus disimpan saat pertama kali dibaca.</p>
  </details>
  <details>
    <summary>Apa itu tautan pemusnah?</summary>
    <p>Tautan kedua yang bersifat pribadi, yang Anda dapatkan saat membuat rahasia. Membukanya akan menampilkan konfirmasi; mengonfirmasinya akan langsung memusnahkan rahasia, sebelum ada yang sempat membacanya. Simpan untuk diri Anda sendiri.</p>
  </details>
  <details>
    <summary>Bisakah saya mengirim file?</summary>
    <p>Bisa. File dienkripsi di browser Anda persis seperti teks dan dikirim di dalam gumpalan data tersegel yang sama. Semuanya diberi padding hingga ukuran standar, sehingga bahkan kami pun tidak bisa membedakan catatan pendek dari file kecil.</p>
  </details>
  <details>
    <summary>Apakah shhnote berfungsi di Tor Browser atau tanpa JavaScript?</summary>
    <p>Membuat dan menampilkan rahasia memerlukan JavaScript, karena enkripsinya berlangsung di browser Anda. shhnote berfungsi di Tor Browser pada tingkat “Safer”; pada tingkat “Safest”, WebAssembly dimatikan, sehingga rahasia yang dilindungi frasa sandi tidak bisa dibuka dan halaman akan memberi tahu hal itu. Semua halaman lain berfungsi tanpa JavaScript.</p>
  </details>
  <details>
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
  <details>
    <summary>Apakah tersedia API?</summary>
    <p>Ya — API yang sama dengan yang dipakai situs ini. <a href="/en/docs/">Dokumentasinya</a> menjelaskan API tersebut, dan paket klien sumber terbuka mengimplementasikan protokolnya untuk alat Anda sendiri.</p>
  </details>
</div>

<p class="prose-note">Masih penasaran? Baca <a href="/id/how-it-works/">cara kerjanya</a>, <a href="/id/security/">detail keamanan</a>, atau <a href="/id/contact/">tanyakan kepada kami</a>.</p>
</div>
</section>
