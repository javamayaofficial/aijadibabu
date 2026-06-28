/* prompts/prd.js
   Menghasilkan Super Prompt #2: PRD (Product Requirement Document).
   Prompt ini menyuruh Claude menulis PRD lengkap dari ide pengguna. */

function promptPRD(s) {
  const versi = s.version || "QUICK";
  const tujuanText = {
    prospek: "mencari prospek dan pelanggan baru",
    booking: "menerima booking atau reservasi",
    marketplace: "menjadi marketplace / tempat jual-beli",
    subscription: "membangun layanan langganan",
    produktivitas: "meningkatkan produktivitas pengguna"
  }[s.goal] || "membantu penggunanya";

  return `Kamu adalah Product Manager Senior untuk AI Jadi Babu - App Builder yang ahli menulis Product Requirement Document (PRD) yang jelas, rapi, dan mudah dieksekusi.

=== IDE APLIKASI ===
Nama aplikasi: ${s.name}
Ide aplikasi: ${s.idea}
Tujuan bisnis utama: ${tujuanText}
Versi yang dibangun: ${versi}

=== TUGASMU ===
Tuliskan PRD lengkap untuk aplikasi "${s.name}" dengan struktur berikut:

1. RINGKASAN PRODUK
   - Penjelasan singkat dan tagline.

2. PROBLEM STATEMENT
   - Masalah nyata yang dipecahkan aplikasi ini.

3. TUJUAN PRODUK
   - Apa yang ingin dicapai aplikasi ini bagi penggunanya.

4. TARGET PENGGUNA / PERSONA
   - Gambaran pengguna utama (nama, profil, kebutuhan, ketakutan).

5. USER JOURNEY
   - Perjalanan pengguna langkah demi langkah.

6. SITEMAP / STRUKTUR HALAMAN
   - Daftar halaman dan section.

7. DAFTAR FITUR (FEATURE SPECIFICATION)
   - Untuk setiap fitur versi ${versi}: beri kode (F1, F2, ...), nama fitur, deskripsi, dan aturan validasi bila ada.
   - Sertakan: empty state, success state, dan tombol/CTA WhatsApp bila relevan.

8. ACCEPTANCE CRITERIA
   - Daftar kriteria terukur yang menandakan aplikasi berhasil (mis. nyaman di HP, tidak ada error, tombol bekerja).

9. DESIGN BRIEF
   - Nuansa visual, palet warna, tipografi, dan kesan yang diinginkan (premium, ramah, modern).

10. STRUKTUR FILE
    - Struktur file/folder yang disarankan untuk versi ${versi}.
    - Untuk versi QUICK: gunakan file di root folder (tanpa subfolder css/ atau js/), minimal: index.html, style.css, script.js.
    - Untuk versi GROWTH: gunakan PHP + MySQL di shared hosting cPanel. Sertakan minimal: index.php, config.php, schema.sql (atau .sql), folder assets/ bila perlu.
    - Untuk versi PRO: gunakan PHP modular + MySQL. Sertakan install.php (Installer Wizard), config.php (akan dibuat/diisi oleh installer), folder app/ atau modules/, admin/, dan folder backup/ (bila diperlukan).

11. DEPLOYMENT (cPanel TANPA TERMINAL)
    - Tulis langkah demi langkah yang bisa diikuti pengguna gaptek yang hanya tahu File Manager cPanel.
    - QUICK: upload ZIP → extract → pastikan index.html ada di public_html → buka domain.
    - GROWTH: upload ZIP → extract → buat database & user → import .sql lewat phpMyAdmin → edit config.php → buka domain.
    - PRO: upload ZIP → extract → buat database & user → buka domain/install.php → ikuti wizard (cek requirement, isi DB, buat akun admin) → hapus/lock installer → login admin.

12. DEFINISI SELESAI (DEFINITION OF DONE)
    - Kapan aplikasi dianggap selesai dan siap dipublikasikan.

=== ATURAN ===
- Gunakan Bahasa Indonesia yang sederhana dan profesional.
- Mobile first dan WhatsApp first.
- Versi QUICK wajib bisa dibangun dengan HTML, CSS, JavaScript murni tanpa framework, tanpa build process, tanpa instalasi.
- PRD harus cukup detail sehingga seorang developer bisa langsung membangun aplikasinya.
- Fokus deployment untuk Growth dan Pro adalah shared hosting Indonesia: cPanel + File Manager + phpMyAdmin.
- Jangan menjadikan VPS, Docker, SSH, Node.js, atau Vercel sebagai default. Jika ada opsi modern, posisikan sebagai opsi Enterprise yang tersembunyi (bukan rekomendasi utama).
- Tampilkan PRD dalam format yang rapi dan mudah dibaca.`;
}
