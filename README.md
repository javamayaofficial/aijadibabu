# AI Jadi Babu

AI Jadi Babu membantu mengubah ide aplikasi menjadi 3 super prompt siap pakai untuk AI produksi seperti Claude. Pengguna cukup menjelaskan ide, lalu sistem akan memberi analisis dan prompt yang bisa langsung dipakai untuk membangun aplikasi tanpa coding dari nol.

## Fitur Utama
- App Builder untuk menyusun 3 super prompt: `App Builder`, `PRD`, dan `Developer`.
- AI Review untuk membaca ide, memberi skor peluang, risiko, dan arah versi aplikasi.
- Salespage Builder dengan berbagai framework copywriting yang sudah terbuka.
- Form Builder dengan integrasi WhatsApp Fonnte, Facebook Pixel, dan Google Spreadsheet.
- Jalur versi `QUICK`, `GROWTH`, dan `PRO`.

## Aturan Akses Versi
- `QUICK` terbuka penuh.
- `GROWTH` terbuka penuh.
- `PRO` mendapat jatah 5 kali generate per browser/device.
- Setelah kuota `PRO` habis, pengguna akan diarahkan untuk upgrade.

## Cara Menjalankan
Karena project ini berbasis `HTML`, `CSS`, dan `JavaScript` murni, tidak perlu build process.

1. Download atau clone repository.
2. Buka file `index.html` di browser.
3. Aplikasi langsung bisa digunakan.

## Struktur File
- `index.html` : halaman utama aplikasi
- `style.css` : tampilan dan styling
- `script.js` : logika utama aplikasi
- `categories.js` : kategori dan analisis AI review
- `app-builder.js` : template prompt App Builder
- `prd.js` : template prompt PRD
- `developer.js` : template prompt Developer
- `ideas.js` : data ide dan referensi konten
- `name-generator.js` : generator nama

## Deploy

### cPanel
1. Login ke cPanel.
2. Buka `File Manager`.
3. Masuk ke `public_html` atau folder domain aktif.
4. Upload file project atau ZIP.
5. Extract bila perlu.
6. Pastikan `index.html` ada di root folder website.

### Netlify
1. Login ke Netlify.
2. Pilih deploy manual.
3. Upload folder project ini.
4. Tunggu deploy selesai.

### Shared Hosting / Static Hosting
Project ini cocok untuk hosting statis selama file `index.html`, `style.css`, dan `script.js` dapat diakses langsung.

## Catatan
- Project ini tidak memerlukan Node.js atau npm untuk dijalankan.
- Counter kuota `PRO` saat ini disimpan di `localStorage`, jadi sifatnya per browser/device.
- Untuk proteksi yang lebih kuat, mekanisme akses `PRO` sebaiknya dipindahkan ke backend pada tahap berikutnya.

## Tagline
Dream Big. Build Mini. Launch Fast.
