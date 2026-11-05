---
title: "Kebijakan privasi"
description: "Apa yang disimpan shhnote.com, berapa lama, dan apa yang tidak pernah dilakukannya. Kami tidak bisa membaca rahasia Anda, dan kami menyimpan sesedikit mungkin hal lain."
eyebrow: "Hukum"
updated: "5 November 2026"
---

> **Draf.** Kebijakan ini adalah titik awal dan belum ditinjau oleh pengacara.

## Versi singkatnya

shhnote.com (“situs ini”) tidak bisa membaca rahasia Anda. Rahasia dienkripsi di perangkat Anda, dan kuncinya tidak pernah sampai kepada kami. Kami menyimpan sesedikit mungkin hal lain, dan menghapusnya secepat mungkin.

## Apa yang kami simpan

Saat Anda membuat rahasia, kami menyimpan:

- **Rahasia terenkripsi.** Tanpa kunci di tautan Anda, rahasia ini tidak bisa dibaca, termasuk oleh kami.
- **Pengaturannya:** kapan kedaluwarsa dan apakah rahasia dihapus setelah sekali lihat.
- **Kredensial yang di-hash:** hash satu arah dari nilai yang dipakai browser Anda untuk menemukan atau memusnahkannya, yang tidak bisa diubah kembali menjadi sesuatu yang berguna.

Kami tidak menyimpan frasa sandi Anda, kunci dari tautan Anda, kapan rahasia dibuat, atau apakah frasa sandi dipasang. Waktu kedaluwarsa dibulatkan, sehingga tidak bisa dipakai untuk menghitung balik waktu pembuatan. Data terenkripsi diberi padding, sehingga kami hanya mengetahui kelas ukuran kasarnya.

Rahasia berukuran besar dapat disimpan di luar database, di disk atau di object storage. Penyimpanan itu mencatat kapan setiap file ditulis, dan itulah satu-satunya tempat waktu pembuatan tercatat. Catatan itu melekat pada file terenkripsi yang tidak bisa kami buka, dan ikut hilang saat file itu dihapus.

Jika seseorang melaporkan tautan, kami menghitung laporan itu untuk hari tersebut. Kami tidak menyimpan catatan tentang rahasia mana yang dilaporkan.

## Kapan kami menghapusnya

Rahasia dihapus saat kedaluwarsa, atau segera setelah dibuka jika rahasia itu sekali lihat. Rahasia yang sudah dihapus tidak bisa dipulihkan.

Penghapusan menghilangkan catatannya. Seperti di komputer mana pun, sisa data terenkripsi mungkin masih tertinggal di jurnal database, ruang disk kosong, atau cadangan sampai tertimpa. Sisa itu berupa ciphertext tanpa kunci, dan kami memperlakukan cadangan sesuai dengan itu.

## Yang tidak kami lakukan

- Kami tidak menggunakan cookie atau pelacakan, dan kami tidak menampilkan iklan.
- Kami tidak memuat apa pun dari situs lain: tidak ada font, skrip, atau gambar dari tempat lain, sehingga tidak ada pihak ketiga yang melihat kunjungan Anda.
- Kami tidak meminta Anda membuat akun.
- Kami tidak menjual atau membagikan data Anda.

Pilihan tema Anda dan, jika Anda memilihnya di menu bahasa, bahasa Anda diingat di local storage browser Anda dan tidak pernah dikirim ke mana pun.

## Log server

Situs ini tidak menyimpan log permintaan: server web di depannya tidak mencatat permintaan, dan server shhnote tidak menyimpan log akses per rahasia maupun riwayat IP (pembatasan laju memakai hash berkunci dari alamat dengan salt yang berganti secara berkala). Cloudflare mengakhiri TLS untuk situs ini dan melihat alamat IP berdasarkan kebijakan privasinya sendiri; Cloudflare tidak pernah melihat fragmen tautan atau kunci apa pun, karena browser tidak mengirimkan bagian tautan yang memuat kunci.

## Hak Anda

Tergantung di mana Anda tinggal, Anda mungkin berhak menanyakan data apa yang kami simpan tentang Anda, serta meminta data itu diperbaiki atau dihapus. Karena kami hampir tidak menyimpan apa pun yang mengidentifikasi Anda, biasanya hanya sedikit yang bisa dibagikan. Hubungi kami di [contact@shhnote.com](mailto:contact@shhnote.com).

## Kontak

Pertanyaan tentang kebijakan ini: [contact@shhnote.com](mailto:contact@shhnote.com).
