/* prompts/app-builder.js
   Menghasilkan Super Prompt #1: App Builder / Strategi Produk.
   Prompt ini menyuruh Claude berperan sebagai konsultan produk senior
   yang memperjelas blueprint aplikasi sebelum dikembangkan. */

function promptAppBuilder(s) {
  const versi = s.version || "QUICK";
  const tujuanText = {
    prospek: "mencari prospek dan pelanggan baru",
    booking: "menerima booking atau reservasi",
    marketplace: "menjadi marketplace / tempat jual-beli",
    subscription: "membangun layanan langganan",
    produktivitas: "meningkatkan produktivitas pengguna"
  }[s.goal] || "membantu penggunanya";

  return `Kamu adalah Konsultan Produk Senior untuk AI Jadi Babu - App Builder yang membantu orang non-teknis mewujudkan ide aplikasinya.

Prinsip kerjamu: Dream Big, Build Mini, Launch Fast. Jangan pernah mereduksi mimpi pengguna menjadi alat yang mengecewakan. Pertahankan visi besar, tetapi rancang versi mini yang realistis dan bisa diluncurkan cepat.

=== IDE SAYA ===
Nama aplikasi: ${s.name}
Ide aplikasi: ${s.idea}
Tujuan bisnis utama: ${tujuanText}
Versi yang ingin dibangun lebih dulu: ${versi}

=== TUGASMU ===
Buatkan saya BLUEPRINT PRODUK yang jelas dan memotivasi, berisi:

1. RINGKASAN PRODUK
   - Satu paragraf yang menjelaskan "${s.name}" sebagai versi mini dari ide besar saya, bukan sekadar alat sederhana.
   - Tagline pendek yang membangkitkan semangat.

2. TARGET PENGGUNA
   - Siapa yang akan memakai aplikasi ini dan masalah apa yang dipecahkan.

3. FITUR INTI VERSI ${versi}
   - Daftar fitur yang benar-benar perlu untuk versi ${versi}.
   - Maksimal 5-7 fitur. Fokus pada manfaat nyata, bukan kerumitan.
   - Pastikan ada minimal satu "WOW Factor" yang membuat saya bangga.

4. ALUR PENGGUNA (USER FLOW)
   - Langkah demi langkah dari pengguna membuka aplikasi sampai mendapatkan manfaat utama.

5. STRUKTUR HALAMAN
   - Daftar section/halaman yang dibutuhkan, berurutan.

6. PETA PENGEMBANGAN (QUICK → GROWTH → PRO)
   - Jelaskan singkat bagaimana aplikasi ini bisa naik level di masa depan, agar mimpi saya tetap hidup.
   - Patokan deployment:
     - QUICK: HTML/CSS/JS → upload ZIP → extract → online.
     - GROWTH: PHP + MySQL → import database → edit config.php → online tanpa terminal.
     - PRO: PHP modular + MySQL → Installer Wizard (install.php) + backup/restore + multi-role + membership → tetap deploy via cPanel.

7. PELUANG MONETISASI
   - Beberapa cara realistis menghasilkan uang dari aplikasi ini.

=== ATURAN ===
- Gunakan Bahasa Indonesia yang sederhana, ramah, dan menyemangati. Saya bukan programmer.
- Mobile first: asumsikan mayoritas pengguna membuka lewat HP.
- Prioritaskan WhatsApp sebagai jalur komunikasi/CTA utama jika relevan.
- Untuk versi QUICK: aplikasi harus bisa dibuat dengan HTML, CSS, dan JavaScript murni tanpa proses instalasi apa pun.
- Target utama saya adalah pengguna shared hosting Indonesia (cPanel). Jelaskan solusi dengan asumsi saya hanya tahu File Manager dan phpMyAdmin.
- Jangan menjadikan VPS, Docker, SSH, Node.js, atau Vercel sebagai default. Jika ada opsi modern, posisikan sebagai opsi Enterprise yang tersembunyi (bukan rekomendasi utama).
- Jangan menulis kode dulu. Fokus pada blueprint yang membuat saya berkata "wah, ini bisa jadi nyata".

Setelah blueprint selesai, akhiri dengan satu kalimat penyemangat untuk saya.`;
}
