========================================
  AI JADI BABU
  Panduan Penggunaan (Bahasa Indonesia)
========================================

TENTANG APLIKASI
----------------
AI Jadi Babu membantu Anda mengubah ide aplikasi
menjadi 3 "Super Prompt" siap pakai untuk Claude (claude.ai).

Caranya: Anda cukup menceritakan ide Anda, lalu aplikasi ini
akan menganalisisnya seperti seorang konsultan (AI Review),
dan memberi Anda 3 prompt profesional yang tinggal ditempel
ke Claude untuk menghasilkan aplikasi nyata — tanpa coding.

Cocok untuk pemula yang belum pernah membuat aplikasi sekalipun.


CARA MENJALANKAN DI KOMPUTER (UNTUK MENGECEK)
---------------------------------------------
1. Klik dua kali file "index.html".
2. Aplikasi akan terbuka di browser (Chrome/Edge/Firefox).
   Tidak perlu install apa pun.


CARA MEMAKAI APLIKASI
---------------------
1. Klik "Mulai Sekarang".
2. Tulis ide aplikasi Anda.
3. Beri nama aplikasinya.
4. Pilih tujuan utamanya.
5. Klik "Analisis Ide Saya" — AI akan menampilkan:
   - Mimpi Besar Anda
   - Opportunity Score (skor peluang 1-10)
   - Versi QUICK / GROWTH / PRO
   - Difficulty Meter
   - WOW Factor
   - Peluang Monetisasi
   - Risiko Implementasi
   - Mengapa Kami Menyarankan QUICK
   - Rekomendasi untuk Anda
6. Di App Builder, versi QUICK dan GROWTH terbuka penuh.
7. Versi PRO mendapat jatah 5 kali generate per browser/device.
8. Jika kuota PRO habis, pengguna akan diarahkan untuk upgrade.
9. Klik "Buat Super Prompt".
10. Salin ketiga prompt, lalu tempel satu per satu ke Claude.


CARA GANTI NOMOR WHATSAPP
-------------------------
Aplikasi ini memakai tombol "Bagikan ke Teman via WhatsApp"
yang membuka WhatsApp tanpa nomor tujuan tetap (pengguna memilih
sendiri kontaknya). Jadi tidak ada nomor yang perlu diganti.

Jika nanti Anda membuat aplikasi bisnis lewat Claude dan ingin
mengarahkan tombol WhatsApp ke nomor Anda, ubah bagian nomor
pada file JavaScript aplikasi tersebut menjadi:
   628xxxxxxxxxx
(format internasional: 62 diikuti nomor tanpa angka 0 di depan)


CARA GANTI DATA / TEKS
----------------------
- Mengubah daftar kategori, skor peluang, atau isi AI Review:
  buka file "categories.js" dan sesuaikan teksnya.
- Mengubah isi 3 Super Prompt:
  buka file: app-builder.js, prd.js, atau developer.js.
- Mengubah tampilan: buka "style.css".


STRUKTUR FILE
-------------
index.html            -> halaman utama
style.css            -> tampilan (desain premium)
categories.js        -> mesin AI Review (kategori, skor, dll)
script.js            -> logika aplikasi
app-builder.js       -> Super Prompt #1
prd.js               -> Super Prompt #2
developer.js         -> Super Prompt #3
README.txt            -> panduan ini


CARA UPLOAD KE cPANEL (FILE MANAGER)
-----------------------------------
Patokan utama deployment AI Jadi Babu adalah shared hosting Indonesia:
cPanel + File Manager. Tanpa terminal.

1. Login ke cPanel hosting Anda.
2. Buka menu "File Manager".
3. Masuk ke folder website utama: public_html
   (atau folder domain/subdomain yang Anda gunakan).
4. Upload file ZIP aplikasi ini.
5. Klik kanan ZIP → Extract.
6. Pastikan file "index.html" ada di folder yang benar.
7. Buka domain Anda — AI Jadi Babu sudah online.
8. (Opsional) Aktifkan SSL (HTTPS) dari menu hosting Anda bila tersedia.


CARA UPLOAD QUICK KE NETLIFY (OPSIONAL)
--------------------------------------
Ini cocok untuk versi QUICK (HTML/CSS/JS).

1. Buka https://www.netlify.com lalu login/daftar.
2. Pilih "Add new site" → "Deploy manually".
3. Upload folder aplikasi (atau ZIP-nya).
4. Tunggu deploy selesai.
5. Buka URL dari Netlify — aplikasi online.


CARA UPLOAD QUICK KE SCALEV (OPSIONAL)
-------------------------------------
Ini cocok untuk versi QUICK (HTML/CSS/JS).

1. Masuk ke dashboard Scalev.
2. Pilih menu upload website.
3. Upload file ZIP aplikasi.
4. Extract/publish sesuai instruksi di dashboard.
5. Buka URL website Anda — aplikasi online.


TIDAK PERLU
-----------
- Tidak perlu install Node.js, npm, atau program apa pun.
- Tidak perlu terminal.
- Tidak perlu proses build/compile.
Cukup upload, langsung jalan.


========================================
Dream Big. Build Mini. Launch Fast.
AI Jadi Babu
========================================
