(function () {
  "use strict";

  function hashString(str) {
    let h = 2166136261;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function makeRng(seed) {
    let x = seed >>> 0;
    return function () {
      x ^= x << 13; x >>>= 0;
      x ^= x >> 17; x >>>= 0;
      x ^= x << 5;  x >>>= 0;
      return (x >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function cleanText(s) {
    return String(s || "")
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const stop = new Set([
    "yang","dan","atau","untuk","dengan","tanpa","dari","ke","di","pada","dalam","itu","ini","saya","anda","kamu","kami",
    "aplikasi","app","platform","website","web","online","digital","sistem","buat","membuat","jadi","agar","biar","bisa",
    "seperti","versi","untuknya","nya","dulu","lebih","langsung","contoh","misal","misalnya","yang","para","sebuah","sebagai",
    "kota","desa","indonesia","indonesian","startup","usaha","bisnis"
  ]);

  function tokenize(idea) {
    const t = cleanText(idea).toLowerCase();
    if (!t) return [];
    return t.split(" ")
      .map((w) => w.replace(/^-+|-+$/g, ""))
      .filter((w) => w.length >= 3 && !stop.has(w));
  }

  function titleWord(w) {
    const s = String(w || "").trim();
    if (!s) return "";
    return s[0].toUpperCase() + s.slice(1);
  }

  function pascal(words) {
    return words.map(titleWord).join("");
  }

  function initials(words) {
    return words.map((w) => String(w || "")[0] || "").join("").toUpperCase();
  }

  function detectDomain(idea) {
    if (typeof window.deteksiKategori === "function") {
      const id = window.deteksiKategori(idea);
      if (id) return id;
    }
    const t = String(idea || "").toLowerCase();
    const rules = [
      ["booking", ["booking","reservasi","appointment","jadwal","antrian","janji"]],
      ["marketplace", ["marketplace","jual","beli","katalog","toko","produk","olshop","shop","mart"]],
      ["edukasi", ["belajar","kursus","kelas","soal","les","bimbel","murid","siswa","guru","dosen","lms"]],
      ["kesehatan", ["klinik","dokter","bidan","kesehatan","obat","pasien","medis","apotek"]],
      ["travel", ["travel","wisata","trip","tour","hotel","tiket","itinerary","open","destinasi"]],
      ["wedding", ["wedding","nikah","wo","pernikahan","bridestory","mua","catering","dekor"]],
      ["kuliner", ["kuliner","makan","resto","restoran","cafe","kafe","menu","kopi","gofood"]],
      ["jasa", ["jasa","service","servis","laundry","cleaning","tukang","konsultan","freelance"]],
      ["keuangan", ["keuangan","uang","budget","anggaran","pengeluaran","pemasukan","cicilan","kpr","investasi"]],
      ["produktivitas", ["produktivitas","todo","to-do","task","catatan","agenda","checklist","planner","habit"]]
    ];
    for (const [id, kws] of rules) {
      for (const kw of kws) if (t.includes(kw)) return id;
    }
    return "umum";
  }

  function basePack(domain) {
    const map = {
      marketplace: { noun: ["Mart","Market","Shop","Store","Katalog"], indo: ["Belanja","Toko","Produk"] },
      booking: { noun: ["Book","Reserve","Schedule","Slot","Antri"], indo: ["Jadwal","Booking","Antrian"] },
      edukasi: { noun: ["Edu","Class","Study","Learn","Campus"], indo: ["Belajar","Kelas","Soal"] },
      kesehatan: { noun: ["Clinic","Med","Care","Health","Syifa"], indo: ["Sehat","Klinik","Care"] },
      travel: { noun: ["Trip","Tour","Go","Route","Itin"], indo: ["Wisata","Trip","Jalan"] },
      wedding: { noun: ["Wed","Love","Bride","Groom","Vow"], indo: ["Nikah","Rias","Pesta"] },
      kuliner: { noun: ["Food","Bite","Kitchen","Taste","Menu"], indo: ["Rasa","Dapur","Menu"] },
      jasa: { noun: ["Pro","Service","Fix","Care","Helper"], indo: ["Jasa","Beres","Tuntas"] },
      keuangan: { noun: ["Fin","Pay","Cash","Budget","Ledger"], indo: ["Uang","Kas","Hemat"] },
      produktivitas: { noun: ["Task","Flow","Focus","Plan","Note"], indo: ["Rapi","Fokus","Ceklis"] },
      umum: { noun: ["Hub","Plus","Mate","Works","Pilot"], indo: ["Ruang","Pintar","Maju"] }
    };
    return map[domain] || map.umum;
  }

  function clampLen(name) {
    const n = String(name || "").replace(/\s+/g, "");
    if (n.length < 2) return "";
    if (n.length > 24) return n.slice(0, 24);
    return n;
  }

  function addUnique(arr, set, name) {
    const n = clampLen(name);
    if (!n) return false;
    const key = n.toLowerCase();
    if (set.has(key)) return false;
    set.add(key);
    arr.push(n);
    return true;
  }

  function syllable(w) {
    const s = String(w || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (s.length <= 3) return s;
    const m = s.match(/^[^aeiou]*[aeiou]+[^aeiou]*/);
    return (m && m[0]) ? m[0].slice(0, 4) : s.slice(0, 4);
  }

  function generate(idea, opts) {
    const variant = (opts && opts.variant) ? Number(opts.variant) : 0;
    const domain = detectDomain(idea);
    const words = tokenize(idea);
    const top = [];
    const seenTop = new Set();
    for (const w of words) {
      if (seenTop.has(w)) continue;
      seenTop.add(w);
      top.push(w);
      if (top.length >= 4) break;
    }
    const pack = basePack(domain);
    const baseA = top[0] ? titleWord(top[0]) : pack.noun[0];
    const baseB = top[1] ? titleWord(top[1]) : pack.noun[1];
    const baseIndo = top[0] ? titleWord(top[0]) : pack.indo[0];
    const baseInit = initials(top.length ? top.slice(0, 3) : [baseA, baseB]);
    const seed = hashString(String(idea || "") + "|" + domain + "|" + variant);
    const rng = makeRng(seed);

    const out = { Premium: [], Modern: [], Indonesia: [], Brandable: [], Islami: [], Singkat: [] };
    const used = new Set();

    const premiumPre = shuffle(["Prime","Elite","Nexa","Lux","Aura","Vertex","Zenith","Royal","Opal","Sterling","Sigma","Astra"], rng);
    const modernPre = shuffle(["Nova","Pulse","Spark","Loop","Shift","Orbit","Pixel","Flow","Cloud","Zen","Kite","Beam"], rng);
    const islPre = shuffle(["Barakah","Amanah","Sakinah","Nuur","Rahmah","Ihsan","Taqwa","Hijrah","Halal","Syifa","Hikmah","Falah"], rng);
    const indoPre = shuffle(["Karya","Ruang","Pintar","Maju","Bersama","Sahabat","Jago","Cepat","Rapi","Sehat","Usaha","Tumbuh"], rng);
    const brandSuf = shuffle(["io","ly","in","go","ku","ify","labs","hub","co","plus","mate"], rng);

    const baseComb = shuffle([
      pascal([baseA, pack.noun[0]]),
      pascal([baseA, pack.noun[1]]),
      pascal([baseA, pack.noun[2]]),
      pascal([baseB, pack.noun[0]]),
      pascal([baseIndo, pack.indo[0]]),
      pascal([baseIndo, pack.indo[1]]),
      pascal([baseA, "Pro"]),
      pascal([baseA, "Plus"]),
      pascal([pack.noun[0], baseA])
    ], rng);

    function fillCategory(cat, makeOne) {
      const arr = out[cat];
      let tries = 0;
      while (arr.length < 6 && tries < 120) {
        tries++;
        const cand = makeOne();
        addUnique(arr, used, cand);
      }
    }

    let iPremium = 0;
    fillCategory("Premium", () => {
      const p = premiumPre[iPremium++ % premiumPre.length];
      const b = baseComb[(iPremium + 3) % baseComb.length];
      return pascal([p, b]);
    });

    let iModern = 0;
    fillCategory("Modern", () => {
      const p = modernPre[iModern++ % modernPre.length];
      const b = baseComb[(iModern + 5) % baseComb.length];
      return pascal([p, b]);
    });

    let iIndo = 0;
    fillCategory("Indonesia", () => {
      const p = indoPre[iIndo++ % indoPre.length];
      const b = shuffle([baseIndo, pack.indo[iIndo % pack.indo.length], pack.noun[iIndo % pack.noun.length]], rng)[0];
      return pascal([p, b]);
    });

    let iBrand = 0;
    fillCategory("Brandable", () => {
      const a = syllable(top[0] || baseA);
      const b = syllable(top[1] || baseB);
      const suf = brandSuf[iBrand++ % brandSuf.length];
      const mid = (a + b).replace(/[^a-z0-9]/g, "");
      const core = mid.length >= 4 ? mid.slice(0, 8) : (mid + (top[2] ? syllable(top[2]) : "a"));
      return titleWord(core) + suf;
    });

    let iIsl = 0;
    fillCategory("Islami", () => {
      const p = islPre[iIsl++ % islPre.length];
      const b = shuffle([baseIndo, baseA, pack.indo[iIsl % pack.indo.length], pack.noun[iIsl % pack.noun.length]], rng)[0];
      return pascal([p, b]);
    });

    let iShort = 0;
    fillCategory("Singkat", () => {
      const modes = [
        () => (baseInit.slice(0, 4) || "APP") + brandSuf[iShort % brandSuf.length],
        () => titleWord((syllable(top[0] || baseA) + (brandSuf[iShort % brandSuf.length] || "ku")).slice(0, 10)),
        () => pascal([pack.noun[iShort % pack.noun.length], "Ku"]),
        () => pascal([pack.indo[iShort % pack.indo.length], "Ku"])
      ];
      const cand = modes[iShort % modes.length]();
      iShort++;
      return cand;
    });

    for (const k of Object.keys(out)) {
      out[k] = out[k].slice(0, 6);
    }
    return out;
  }

  window.AIJB_NAME = { generate: generate };
})();
