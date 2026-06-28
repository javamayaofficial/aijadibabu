/* ============================================================
   AI JADI BABU — APP BUILDER V1
   categories.js — Mesin "Template Cerdas" berbasis kategori ide.
   v1.1 — + Opportunity Score, Difficulty Meter, Hybrid Category,
   blok "Mengapa Kami Menyarankan QUICK?".
   ============================================================ */

const KATEGORI = {
  marketplace: {
    label: "Marketplace / Toko Online", icon: "🛍️",
    keywords: ["jual","beli","toko","tokopedia","shopee","shop","produk","umkm","mart","dagang","lapak","katalog","marketplace","olshop","warung","grosir","reseller"],
    dream: "platform tempat banyak penjual dan pembeli bertemu — sebuah marketplace yang punya potensi tumbuh menjadi pusat transaksi bagi komunitas Anda",
    quick: ["Katalog produk yang rapi dan menarik","Detail produk + harga","Tombol pesan langsung via WhatsApp","Keranjang sederhana di perangkat pengguna","Halaman premium yang siap dibagikan"],
    growth: ["Login penjual & pembeli","Database produk online (bisa diatur dari mana saja)","Riwayat pesanan","Dashboard penjualan sederhana","Banyak penjual dalam satu platform"],
    pro: ["Sistem pembayaran terintegrasi","Panel admin lengkap","Manajemen banyak toko (multi-vendor)","Notifikasi & pelacakan pesanan","Laporan keuangan otomatis"],
    wow: "katalog produk yang tampil elegan plus tombol \"Pesan via WhatsApp\" yang otomatis menulis pesan lengkap dengan nama produk — pembeli tinggal kirim, Anda langsung dapat order",
    monetization: ["Komisi dari setiap transaksi penjual","Biaya berlangganan untuk penjual premium","Slot iklan / produk unggulan di halaman depan","Paket promosi berbayar untuk UMKM"],
    risk: "menjaga data produk tetap rapi saat jumlahnya banyak, dan memastikan alur \"lihat produk → pesan\" semulus mungkin agar pembeli tidak kabur",
    recommendation: "Mulai dari QUICK: tampilkan katalog produk Anda dengan tombol WhatsApp. Begitu sudah ada penjual lain yang ingin ikut, naik ke GROWTH untuk login & database online.",
    opportunity: { score: 9, reasons: ["Jutaan UMKM Indonesia sedang beralih ke digital","Orang Indonesia terbiasa belanja online lewat HP","Modal awal kecil, cukup katalog + WhatsApp","Bisa menyasar komunitas/niche yang belum terlayani","Potensi pendapatan dari komisi & iklan"] }
  },

  booking: {
    label: "Booking / Reservasi", icon: "📅",
    keywords: ["booking","reservasi","jadwal","appointment","salon","cukur","barber","spa","pijat","sewa","rental","pesan tempat","antrian","janji","konsultasi","studio","lapangan"],
    dream: "aplikasi yang membuat pelanggan bisa memesan jadwal Anda kapan saja tanpa harus chat bolak-balik — sebuah sistem reservasi yang membuat bisnis Anda terlihat profesional dan terkelola",
    quick: ["Daftar layanan + harga yang jelas","Form booking singkat (nama, WhatsApp, jadwal)","Konfirmasi otomatis lewat WhatsApp","Tampilan jadwal sederhana","Halaman yang membangun kepercayaan"],
    growth: ["Kalender ketersediaan online","Riwayat booking pelanggan","Pengingat jadwal otomatis","Dashboard pemilik usaha","Banyak staf / layanan"],
    pro: ["Sistem pembayaran DP online","Panel admin penuh","Manajemen banyak cabang","Integrasi kalender & notifikasi","Analitik okupansi & pendapatan"],
    wow: "form booking yang ringkas, lalu langsung membuka WhatsApp dengan pesan reservasi yang sudah tertulis lengkap — pelanggan merasa dilayani, Anda tidak perlu mengetik ulang",
    monetization: ["Biaya per reservasi","Paket langganan untuk pemilik usaha","Fitur premium (DP online, pengingat otomatis)","Komisi dari mitra penyedia layanan"],
    risk: "menghindari bentrok jadwal dan memastikan pelanggan benar-benar menerima konfirmasi — di versi QUICK ini ditangani lewat WhatsApp, di GROWTH baru pakai kalender online",
    recommendation: "Mulai dari QUICK: daftar layanan + form booking yang mengarah ke WhatsApp. Saat booking makin ramai, naik ke GROWTH untuk kalender ketersediaan online.",
    opportunity: { score: 8, reasons: ["Banyak usaha jasa (salon, klinik, sewa) butuh sistem booking","Mengurangi chat bolak-balik yang melelahkan","Membuat usaha kecil terlihat profesional","Pelanggan suka memesan kapan saja tanpa menunggu"] }
  },

  edukasi: {
    label: "Edukasi / Belajar", icon: "🎓",
    keywords: ["belajar","kursus","guru","soal","les","ruangguru","sekolah","lms","edukasi","pelajaran","murid","siswa","ujian","materi","kelas","ngajar","tryout","bimbel","akademi"],
    dream: "platform belajar yang membantu banyak murid berkembang — cikal bakal sebuah \"Ruangguru versi Anda\" yang berangkat dari keahlian dan materi yang Anda kuasai",
    quick: ["Daftar materi / kelas yang tertata","Detail tiap pelajaran","Tombol daftar / konsultasi via WhatsApp","Penyimpanan progres sederhana di perangkat","Tampilan yang membuat murid percaya"],
    growth: ["Login murid & pengajar","Database materi online","Pelacakan progres belajar","Dashboard guru","Banyak kelas & murid"],
    pro: ["Sistem pembayaran kursus","Kuis & penilaian otomatis","Sertifikat digital","Panel admin sekolah/bimbel","Analitik perkembangan murid"],
    wow: "daftar materi yang tersusun rapi seperti silabus profesional, plus tombol \"Daftar Kelas\" yang langsung mengirim pesan WhatsApp — murid merasa ini lembaga serius, bukan les biasa",
    monetization: ["Biaya pendaftaran per kelas","Langganan akses materi premium","Paket bimbingan privat","Penjualan modul / e-book pendukung"],
    risk: "menjaga materi tetap terstruktur agar murid tidak bingung urutan belajarnya — mulai sederhana dulu, progres bisa disimpan online saat naik ke GROWTH",
    recommendation: "Mulai dari QUICK: tampilkan kelas/materi Anda dengan tombol daftar via WhatsApp. Saat murid bertambah, naik ke GROWTH untuk login & pelacakan progres.",
    opportunity: { score: 9, reasons: ["Permintaan belajar online di Indonesia terus tumbuh","Orang tua rela berinvestasi untuk pendidikan anak","Bisa berangkat dari satu keahlian yang Anda kuasai","Materi bisa dijual berulang tanpa biaya tambahan","Pasar luas: pelajar, mahasiswa, profesional"] }
  },

  kesehatan: {
    label: "Kesehatan / Klinik", icon: "🩺",
    keywords: ["klinik","dokter","halodoc","sehat","obat","pasien","kesehatan","rumah sakit","apotek","konsultasi dokter","bidan","terapi","medis","fisioterapi","gigi","kecantikan"],
    dream: "aplikasi yang mendekatkan layanan kesehatan ke masyarakat — sebuah \"Halodoc versi Anda\" yang membuat pasien lebih mudah terhubung dengan layanan Anda",
    quick: ["Daftar layanan kesehatan + info jelas","Profil dokter / tenaga ahli","Tombol konsultasi / janji via WhatsApp","Jam praktik yang mudah dibaca","Tampilan bersih yang menumbuhkan rasa percaya"],
    growth: ["Login pasien","Riwayat konsultasi online","Jadwal praktik & ketersediaan","Dashboard klinik","Banyak dokter / layanan"],
    pro: ["Konsultasi/chat real-time","Rekam medis digital","Pembayaran & resep online","Panel admin klinik","Integrasi apotek & laboratorium"],
    wow: "profil dokter yang meyakinkan plus tombol \"Buat Janji\" yang langsung membuka WhatsApp — pasien merasa ditangani fasilitas yang rapi dan terpercaya",
    monetization: ["Biaya konsultasi","Langganan paket kesehatan","Komisi dari mitra dokter/apotek","Layanan premium (prioritas, home visit)"],
    risk: "menjaga kepercayaan & kejelasan informasi layanan — hindari klaim berlebihan, fokus pada kemudahan pasien menghubungi Anda lewat WhatsApp",
    recommendation: "Mulai dari QUICK: tampilkan layanan & profil tenaga ahli dengan tombol janji via WhatsApp. Saat pasien banyak, naik ke GROWTH untuk login & riwayat.",
    opportunity: { score: 8, reasons: ["Kesadaran kesehatan masyarakat meningkat","Pasien ingin akses layanan yang mudah dari HP","Klinik & praktik mandiri butuh wajah digital","Kepercayaan tinggi = pelanggan loyal"] }
  },

  travel: {
    label: "Travel / Wisata", icon: "✈️",
    keywords: ["travel","wisata","tour","trip","liburan","hotel","tiket","open trip","paket wisata","destinasi","jalan-jalan","traveloka","penginapan","villa","rekreasi"],
    dream: "platform yang menjual pengalaman, bukan sekadar tiket — sebuah aplikasi travel yang membuat orang berkata \"saya mau ikut trip ini sekarang\"",
    quick: ["Etalase paket wisata yang menggoda","Detail itinerary tiap paket","Kalkulator estimasi biaya sederhana","Tombol booking via WhatsApp","Hero premium yang membangkitkan keinginan jalan-jalan"],
    growth: ["Login pelanggan","Database paket & jadwal online","Riwayat pemesanan","Dashboard penyelenggara trip","Banyak paket & rute"],
    pro: ["Pembayaran DP & pelunasan online","Manajemen kuota peserta otomatis","Panel admin agen travel","Integrasi tiket & akomodasi","Program loyalitas pelanggan"],
    wow: "kartu paket wisata yang memukau dengan detail itinerary dan kalkulator biaya, lalu tombol \"Booking Sekarang\" yang langsung ke WhatsApp — calon pelanggan langsung terbayang liburannya",
    monetization: ["Margin dari paket wisata","Komisi dari mitra hotel/transport","Paket premium / private trip","Fitur unggulan berbayar untuk penyelenggara"],
    risk: "menjaga itinerary & biaya tetap akurat agar pelanggan tidak kecewa — versi QUICK menampilkan info, transaksi tetap lewat WhatsApp untuk membangun kepercayaan dulu",
    recommendation: "Mulai dari QUICK: pamerkan paket wisata + kalkulator biaya + tombol WhatsApp. Saat pemesanan stabil, naik ke GROWTH untuk database & manajemen kuota.",
    opportunity: { score: 8, reasons: ["Minat liburan & open trip terus meningkat","Pengalaman wisata mudah dipasarkan lewat foto","Margin per paket bisa besar","Banyak destinasi lokal belum tergarap maksimal"] }
  },

  wedding: {
    label: "Wedding / Event Organizer", icon: "💍",
    keywords: ["wedding","nikah","wo","pernikahan","bridestory","undangan","acara","event","ulang tahun","pesta","dekorasi","catering nikah","mua","prewedding","organizer"],
    dream: "platform yang membantu pasangan mewujudkan hari paling penting dalam hidup mereka — sebuah \"Bridestory versi Anda\" yang menampilkan layanan dan portofolio Anda secara memukau",
    quick: ["Etalase paket pernikahan / event","Galeri portofolio hasil kerja","Detail tiap paket + harga","Tombol konsultasi via WhatsApp","Tampilan elegan yang membangun emosi"],
    growth: ["Login klien & vendor","Database paket & jadwal online","Riwayat konsultasi","Dashboard penyelenggara","Banyak vendor dalam satu platform"],
    pro: ["Pembayaran DP online","Manajemen rundown & vendor","Panel admin EO","Integrasi undangan digital","Sistem rating & testimoni terverifikasi"],
    wow: "galeri portofolio yang menyentuh emosi plus tombol \"Konsultasi Gratis\" yang langsung membuka WhatsApp — calon pengantin langsung merasa \"ini WO yang saya cari\"",
    monetization: ["Margin per paket event","Komisi dari vendor mitra","Paket premium / all-in","Fitur unggulan berbayar untuk vendor"],
    risk: "menonjolkan portofolio & kepercayaan karena keputusan pernikahan sangat emosional — fokuskan QUICK pada galeri & testimoni yang kuat",
    recommendation: "Mulai dari QUICK: tampilkan portofolio & paket dengan tombol konsultasi WhatsApp. Saat klien & vendor bertambah, naik ke GROWTH untuk login & database.",
    opportunity: { score: 8, reasons: ["Pasar pernikahan & event selalu ada setiap tahun","Keputusan emosional = pelanggan rela bayar lebih","Portofolio visual mudah viral di media sosial","Bisa menggabungkan banyak vendor jadi satu platform"] }
  },

  kuliner: {
    label: "Kuliner / Makanan", icon: "🍜",
    keywords: ["makan","resto","restoran","cafe","kafe","kuliner","catering","food","kue","masakan","warteg","frozen","snack","minuman","kopi","bakery","jajanan","pesan makan","gofood"],
    dream: "platform yang membuat orang lapar hanya dengan melihatnya — sebuah aplikasi kuliner yang mengubah dapur Anda menjadi brand yang dipesan banyak orang",
    quick: ["Menu yang tampil menggugah selera","Foto & harga tiap menu","Tombol pesan via WhatsApp","Keranjang pesanan sederhana","Tampilan yang bikin lapar dan percaya"],
    growth: ["Login pelanggan","Database menu online","Riwayat pesanan","Dashboard penjualan","Banyak outlet / cabang"],
    pro: ["Pembayaran online","Integrasi pengantaran","Panel admin dapur","Manajemen stok bahan","Laporan penjualan otomatis"],
    wow: "menu dengan foto menggugah selera dan tombol \"Pesan Sekarang\" yang otomatis menulis daftar pesanan lengkap ke WhatsApp — pelanggan tinggal kirim, dapur Anda langsung sibuk",
    monetization: ["Margin penjualan menu","Paket catering / langganan harian","Biaya kemasan / pengantaran","Menu premium & bundling"],
    risk: "menjaga foto & harga menu tetap menggugah dan akurat — versi QUICK fokus pada etalase menu + pemesanan WhatsApp yang mulus",
    recommendation: "Mulai dari QUICK: tampilkan menu dengan foto menarik + tombol pesan WhatsApp. Saat order ramai, naik ke GROWTH untuk database menu & riwayat pesanan.",
    opportunity: { score: 9, reasons: ["Bisnis makanan selalu punya pasar setiap hari","Foto makanan sangat mudah menarik pembeli","Modal bisa dimulai dari dapur rumah","Pelanggan suka pesan cepat lewat WhatsApp","Peluang langganan harian & catering"] }
  },

  jasa: {
    label: "Jasa / Layanan", icon: "🔧",
    keywords: ["jasa","service","servis","perbaikan","laundry","cleaning","bersih","tukang","bengkel","desain","fotografi","percetakan","konsultan","freelance","perawatan","instalasi","pasang"],
    dream: "platform yang menghubungkan keahlian Anda dengan orang yang membutuhkannya — sebuah aplikasi layanan yang membuat jasa Anda mudah ditemukan dan dipesan",
    quick: ["Daftar layanan + harga transparan","Penjelasan tiap layanan","Tombol pesan / konsultasi via WhatsApp","Galeri hasil kerja","Tampilan profesional yang menumbuhkan percaya"],
    growth: ["Login pelanggan & penyedia jasa","Database pesanan online","Riwayat & status pengerjaan","Dashboard penyedia jasa","Banyak layanan / teknisi"],
    pro: ["Pembayaran online","Pelacakan status pengerjaan real-time","Panel admin","Manajemen banyak teknisi/mitra","Sistem rating & ulasan"],
    wow: "galeri hasil kerja yang meyakinkan plus tombol \"Pesan Layanan\" yang langsung membuka WhatsApp berisi detail layanan — pelanggan langsung percaya dan menghubungi",
    monetization: ["Biaya per pesanan layanan","Langganan untuk penyedia jasa","Komisi dari mitra/teknisi","Paket layanan premium"],
    risk: "membangun kepercayaan lewat bukti hasil kerja & ulasan — versi QUICK menonjolkan galeri & tombol WhatsApp yang jelas",
    recommendation: "Mulai dari QUICK: tampilkan layanan & galeri hasil kerja dengan tombol pesan WhatsApp. Saat pesanan bertambah, naik ke GROWTH untuk pelacakan status.",
    opportunity: { score: 8, reasons: ["Permintaan jasa harian (laundry, servis, bersih) stabil","Orang mencari penyedia jasa lewat HP","Keahlian Anda bisa langsung jadi penghasilan","Galeri hasil kerja cepat membangun kepercayaan"] }
  },

  keuangan: {
    label: "Keuangan / Produktivitas Uang", icon: "💰",
    keywords: ["keuangan","uang","budget","anggaran","finansial","tabungan","investasi","catat keuangan","pengeluaran","pemasukan","hutang","arisan","koperasi","zakat","kalkulator biaya"],
    dream: "aplikasi yang membantu orang mengelola uang dengan lebih cerdas — sebuah alat finansial yang membuat keputusan keuangan terasa ringan dan terkendali",
    quick: ["Kalkulator / pencatat keuangan yang mudah","Ringkasan visual sederhana","Penyimpanan data di perangkat pengguna","Tombol bagikan hasil via WhatsApp","Tampilan bersih dan menenangkan"],
    growth: ["Login pengguna","Data tersimpan online & sinkron","Riwayat & grafik perkembangan","Dashboard ringkasan","Banyak kategori / akun"],
    pro: ["Multi-pengguna / keluarga / tim","Laporan otomatis & ekspor","Panel admin","Integrasi rekening / e-wallet","Pengingat & target finansial"],
    wow: "ringkasan keuangan yang langsung bisa dipahami dalam sekejap, plus tombol bagikan hasil ke WhatsApp — pengguna merasa pegang kendali penuh atas uangnya",
    monetization: ["Langganan fitur premium","Versi pro untuk usaha kecil","Konsultasi keuangan berbayar","Fitur laporan & ekspor premium"],
    risk: "menjaga perhitungan tetap akurat & data tersimpan aman — versi QUICK menyimpan di perangkat, GROWTH baru menyimpan online dengan login",
    recommendation: "Mulai dari QUICK: bangun kalkulator/pencatat yang menyimpan data di perangkat. Saat pengguna ingin akses dari banyak HP, naik ke GROWTH untuk sinkron online.",
    opportunity: { score: 7, reasons: ["Kesadaran mengatur keuangan makin tinggi","Alat sederhana yang dipakai harian mudah melekat","Bisa menyasar UMKM yang butuh catat keuangan","Peluang langganan untuk fitur lanjutan"] }
  },

  produktivitas: {
    label: "Produktivitas / Alat Bantu", icon: "⚡",
    keywords: ["produktivitas","to-do","todo","catatan","task","kelola","manajemen","checklist","pengingat","agenda","organizer","absensi","data","laporan","form","survei","antrean"],
    dream: "alat yang membuat pekerjaan jadi lebih ringan dan teratur — sebuah aplikasi produktivitas yang bisa berkembang menjadi tool andalan banyak orang",
    quick: ["Antarmuka yang fokus & mudah dipakai","Input data cepat","Penyimpanan di perangkat pengguna","Ringkasan / status yang jelas","Tombol bagikan via WhatsApp"],
    growth: ["Login pengguna","Data tersimpan online & sinkron antar perangkat","Riwayat aktivitas","Dashboard ringkasan","Kolaborasi sederhana"],
    pro: ["Multi-pengguna / tim","Peran & izin akses","Panel admin","Integrasi & otomatisasi","Analitik penggunaan"],
    wow: "alur kerja yang begitu sederhana sampai pengguna langsung paham tanpa diajari, plus hasil yang bisa dibagikan ke WhatsApp dalam satu ketukan",
    monetization: ["Langganan fitur premium","Versi tim / bisnis","Fitur lanjutan berbayar","Paket white-label untuk usaha"],
    risk: "menjaga aplikasi tetap sederhana agar tidak kehilangan kekuatan utamanya — tambahkan fitur hanya saat benar-benar dibutuhkan pengguna",
    recommendation: "Mulai dari QUICK: bangun alat inti yang menyimpan data di perangkat. Saat pengguna butuh akses lintas HP atau tim, naik ke GROWTH untuk sinkron online.",
    opportunity: { score: 7, reasons: ["Banyak orang & usaha kecil butuh alat bantu kerja","Alat sederhana yang menyelesaikan satu masalah mudah dipakai","Mudah dikembangkan jadi versi tim berbayar","Bisa menyasar niche pekerjaan tertentu"] }
  },

  umum: {
    label: "Aplikasi Digital", icon: "🚀",
    keywords: [],
    dream: "sebuah aplikasi yang berangkat dari kebutuhan nyata di sekitar Anda — versi awal dari ide yang berpotensi tumbuh menjadi produk yang dipakai banyak orang",
    quick: ["Halaman utama premium yang jelas tujuannya","Fitur inti yang langsung bermanfaat","Penyimpanan data sederhana di perangkat","Tombol aksi via WhatsApp","Tampilan profesional yang membangun kepercayaan"],
    growth: ["Login pengguna","Database online & sinkron","Riwayat penggunaan","Dashboard sederhana","Skala ke lebih banyak pengguna"],
    pro: ["Backend penuh","Multi-pengguna","Panel admin","Integrasi pihak ketiga","Analitik & laporan otomatis"],
    wow: "satu fitur inti yang dieksekusi dengan sangat rapi plus tombol aksi WhatsApp — membuat pengguna langsung merasa aplikasi ini serius dan layak dipakai",
    monetization: ["Langganan fitur premium","Versi bisnis / pro","Komisi atau biaya transaksi","Iklan / kemitraan yang relevan"],
    risk: "menjaga fokus pada satu manfaat inti agar tidak terlalu rumit — bangun versi mini yang tuntas dulu sebelum menambah fitur",
    recommendation: "Mulai dari QUICK: wujudkan fitur inti dalam bentuk paling sederhana yang sudah bermanfaat. Lalu naik ke GROWTH saat pengguna mulai bertambah.",
    opportunity: { score: 7, reasons: ["Ide yang berangkat dari masalah nyata punya pasar","Versi mini cepat diuji ke calon pengguna","Bisa berkembang bertahap tanpa modal besar"] }
  }
};

/* Tingkat kesulitan membangun tiap versi (untuk Difficulty Meter), 1-5 bar */
const DIFFICULTY = { QUICK: 2, GROWTH: 4, PRO: 5 };

/* Panduan otomatis per versi (ditampilkan setelah peserta memilih versi) */
const VERSI_PANDUAN = {
  QUICK: {
    cocok: "Cocok untuk mulai cepat",
    butuh: "Claude + ZIP",
    estimasi: "15–30 menit",
    kesulitan: 2,
    langkah: [
      "Produksi utama: Claude (Direkomendasikan)",
      "Tempel Prompt Strategist (App Builder) → dapatkan blueprint",
      "Tempel Prompt PRD Architect → dapatkan PRD lengkap",
      "Tempel Prompt Senior Developer → minta output file lengkap + ZIP siap deploy",
      "Download ZIP dari Claude → simpan sebagai arsip",
      "Deploy opsi 1 (Netlify): deploy manual (upload folder/ZIP) → publish",
      "Deploy opsi 2 (Scalev): upload ZIP → publish",
      "Deploy opsi 3 (cPanel): File Manager → upload ZIP → extract → pastikan index.html di folder yang benar",
      "Buka URL/domain → aplikasi online",
      "Jika perlu revisi/rapihin kode, lanjutkan pengembangan di TRAE"
    ]
  },
  GROWTH: {
    cocok: "Cocok untuk yang mulai serius",
    butuh: "Claude + Hosting cPanel (PHP) + MySQL (phpMyAdmin)",
    estimasi: "1–3 jam",
    kesulitan: 4,
    langkah: [
      "Produksi utama: Claude (Direkomendasikan)",
      "Tempel 3 Super Prompt versi GROWTH (Strategist → PRD → Developer)",
      "Download ZIP dari Claude → simpan sebagai arsip",
      "Deploy utama (cPanel): upload ZIP → extract → pastikan file berada di folder website",
      "Buat database + user (cPanel) → catat nama DB, user, password",
      "Import database .sql lewat phpMyAdmin",
      "Edit config.php sesuai kredensial DB",
      "Tes fitur penting (login, simpan data) → lalu online",
      "Opsi tambahan: Scalev jika hosting mendukung PHP + MySQL (bukan jalur utama)",
      "Jika perlu revisi/rapihin kode, lanjutkan pengembangan di TRAE"
    ]
  },
  PRO: {
    cocok: "Cocok untuk sistem profesional",
    butuh: "Claude + Hosting cPanel (PHP) + MySQL",
    estimasi: "1–3 hari",
    kesulitan: 5,
    langkah: [
      "Produksi utama: Claude (Direkomendasikan)",
      "Tempel 3 Super Prompt versi PRO (Strategist → PRD → Developer)",
      "Download ZIP dari Claude → simpan sebagai arsip",
      "Deploy utama (cPanel): upload ZIP → extract → pastikan file berada di folder website",
      "Buat database + user (cPanel) → catat kredensial",
      "Buka domain/install.php → ikuti Installer Wizard (cek requirement, isi DB, buat akun admin)",
      "Lock/hapus installer sesuai instruksi, lalu login admin",
      "Atur role, membership (jika ada), dan backup/restore",
      "Opsi tambahan: Scalev jika hosting mendukung PHP + MySQL (bukan jalur utama)",
      "Jika perlu revisi/rapihin kode, lanjutkan pengembangan di TRAE"
    ]
  }
};

/* Deteksi kategori + Hybrid. Mengembalikan kategori utama, dan kategori
   tambahan (DNA) bila skornya sama atau selisih 1 poin (dan > 0). */
function deteksiKategoriHybrid(ide) {
  const teks = (ide || "").toLowerCase();
  const skor = [];
  for (const id in KATEGORI) {
    if (id === "umum") continue;
    let s = 0;
    for (const kata of KATEGORI[id].keywords) {
      if (teks.includes(kata)) s++;
    }
    skor.push({ id: id, skor: s });
  }
  skor.sort((a, b) => b.skor - a.skor);

  if (!skor.length || skor[0].skor === 0) {
    return { primary: "umum", secondary: null };
  }
  const primary = skor[0].id;
  let secondary = null;
  if (skor[1] && skor[1].skor > 0 && (skor[0].skor - skor[1].skor) <= 1) {
    secondary = skor[1].id;
  }
  return { primary: primary, secondary: secondary };
}

/* Versi sederhana yang hanya mengembalikan id kategori utama */
function deteksiKategori(ide) {
  return deteksiKategoriHybrid(ide).primary;
}

function rapikanNama(nama) { return (nama || "Aplikasi Anda").trim(); }

const LABEL_TUJUAN = {
  prospek: "mencari prospek & pelanggan baru",
  booking: "menerima booking / reservasi",
  marketplace: "menjadi marketplace / tempat jual-beli",
  subscription: "membangun layanan langganan",
  produktivitas: "meningkatkan produktivitas"
};

/* Susun seluruh konten AI Review. state membutuhkan:
   idea, name, goal, category, secondary (boleh null) */
function buatAIReview(state) {
  const kat = KATEGORI[state.category] || KATEGORI.umum;
  const sec = state.secondary ? KATEGORI[state.secondary] : null;
  const nama = rapikanNama(state.name);
  const ide = (state.idea || "").trim();
  const tujuan = LABEL_TUJUAN[state.goal] || "tumbuh menjadi produk yang dipakai banyak orang";

  // Mimpi besar — diperkaya DNA tambahan bila hybrid
  let mimpi = `Anda tidak sedang membuat aplikasi biasa. <strong>${nama}</strong> adalah cikal bakal ${kat.dream}. Ide Anda — "${ide}" — dengan fokus ${tujuan}, punya arah yang jelas.`;
  if (sec) {
    mimpi += ` Idenya juga punya sentuhan <strong>${sec.label}</strong>, jadi kita padukan kekuatan keduanya.`;
  }
  mimpi += ` Kita akan jaga mimpi besar ini tetap hidup, lalu membangun versi mini-nya yang realistis dan bisa Anda luncurkan hari ini.`;

  // WOW — diperkaya DNA tambahan bila hybrid
  let wowText = `Satu hal yang akan membuat ${nama} terasa istimewa: ${kat.wow}.`;
  if (sec) {
    wowText += ` Tambahan dari sisi ${sec.label}: ${sec.wow}.`;
  }

  const blok = [
    { type: "text", judul: "Mimpi Besar Anda", icon: "✨", isi: mimpi },
    { type: "score", judul: "Opportunity Score", icon: "📊", score: kat.opportunity.score, reasons: kat.opportunity.reasons.slice(0, 5) },
    { type: "text", judul: "Versi QUICK — Punya Aplikasi Hari Ini", icon: "🚀", list: kat.quick, isi: "Versi paling cepat untuk langsung online. Cukup HTML, CSS, dan JavaScript — tinggal upload, langsung jalan." },
    { type: "text", judul: "Versi GROWTH — Mulai Berkembang", icon: "📈", list: kat.growth, isi: `Saat ${nama} mulai dipakai serius, naik ke sini. Pengguna bisa login dan data tersimpan online di MySQL — tetap deploy lewat cPanel (upload, import database, edit config.php) tanpa terminal.` },
    { type: "text", judul: "Versi PRO — Sistem Profesional", icon: "🏆", list: kat.pro, isi: `Saat ${nama} sudah jadi sistem yang lebih kompleks, ini versi paling lengkap: PHP modular + MySQL, admin, multi-role, membership, Installer Wizard (install.php), dan backup/restore — tetap deploy lewat cPanel.` },
    { type: "meter", judul: "Difficulty Meter", icon: "🛠️", meters: [
        { label: "QUICK", value: DIFFICULTY.QUICK },
        { label: "GROWTH", value: DIFFICULTY.GROWTH },
        { label: "PRO", value: DIFFICULTY.PRO }
      ], isi: "Semakin sedikit bar, semakin mudah dibangun. Inilah kenapa kami sarankan mulai dari QUICK." },
    { type: "text", judul: "WOW Factor", icon: "💡", isi: wowText },
    { type: "text", judul: "Peluang Monetisasi", icon: "💸", list: kat.monetization, isi: `${nama} bukan hanya aplikasi — ini bisa jadi sumber penghasilan. Beberapa cara menghasilkan uang darinya:` },
    { type: "text", judul: "Risiko Implementasi", icon: "⚠️", isi: `Yang perlu Anda jaga: ${kat.risk}. Tenang — ini sudah kami pertimbangkan dalam super prompt yang akan dibuat.` },
    { type: "whyquick", judul: "Mengapa Kami Menyarankan QUICK?", icon: "✅", points: ["Bisa online hari ini","Cukup upload lewat File Manager cPanel","Tidak perlu coding","Tidak perlu terminal atau instalasi"] },
    { type: "text", judul: "Rekomendasi untuk Anda", icon: "🧭", isi: kat.recommendation }
  ];

  return {
    kategoriLabel: kat.label,
    kategoriIcon: kat.icon,
    secondaryLabel: sec ? sec.label : null,
    secondaryIcon: sec ? sec.icon : null,
    blok: blok
  };
}
