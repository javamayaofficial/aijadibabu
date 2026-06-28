/* ============================================================
   AI JADI BABU
   script.js — logika wizard, AI Review, generate, copy
   ============================================================ */

(function () {
  "use strict";

  // ---------- State ----------
  const STORE_KEY = "nexla_app_v1";
  const LEGACY_STORE_KEY = "aijb_appbuilder_v1";
  const PRO_GENERATE_COUNT_KEY = "nexla_pro_generate_count_v1";
  const AUTH_KEY = "nexla_auth";
  const AUTH_VALUE = "authenticated";
  const AUTH_PASSWORD = "ai-jadi-babu";
  const BRAND_NAME = "AI Jadi Babu";
  const UPGRADE_URL = "https://www.aksen.in/Nexla-AI/";
  const APP_UNLOCKED_VERSIONS = ["QUICK", "GROWTH"];
  const PRO_GENERATE_LIMIT = 5;
  const PAGE_UNLOCKED_FRAMEWORKS = ["aida", "pas", "bab", "4p", "quest", "tofu", "mofu", "bofu", "vsl", "advertorial", "longform", "fsp", "status-whatsapp"];
  const FORM_UNLOCKED_INTEGRATIONS = ["pixel", "wa", "sheet"];
  const state = {
    step: 1,
    idea: "",
    name: "",
    goal: "",
    category: "umum",
    secondary: null,
    version: "QUICK",
    generated: { app: "", prd: "", dev: "" }
  };

  // ---------- Helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const appRoot = document.querySelector('[data-suite-module="app"]') || document;
  const $app = (sel) => appRoot.querySelector(sel);
  const $$app = (sel) => Array.from(appRoot.querySelectorAll(sel));

  function getProGenerateCount() {
    try {
      const raw = parseInt(localStorage.getItem(PRO_GENERATE_COUNT_KEY), 10);
      if (!Number.isFinite(raw) || raw < 0) return 0;
      return Math.min(raw, PRO_GENERATE_LIMIT);
    } catch (e) {
      return 0;
    }
  }

  function setProGenerateCount(count) {
    try {
      const next = Math.max(0, Math.min(PRO_GENERATE_LIMIT, parseInt(count, 10) || 0));
      localStorage.setItem(PRO_GENERATE_COUNT_KEY, String(next));
    } catch (e) { }
  }

  function getProGeneratesRemaining() {
    return Math.max(0, PRO_GENERATE_LIMIT - getProGenerateCount());
  }

  function isAppVersionUnlocked(version) {
    const key = String(version || "").toUpperCase();
    if (key === "PRO") return getProGeneratesRemaining() > 0;
    return APP_UNLOCKED_VERSIONS.includes(key);
  }

  function consumeProGenerate() {
    if (String(state.version || "").toUpperCase() !== "PRO") return true;
    const remaining = getProGeneratesRemaining();
    if (remaining <= 0) return false;
    setProGenerateCount(getProGenerateCount() + 1);
    return true;
  }

  function isPageFrameworkUnlocked(framework) {
    return PAGE_UNLOCKED_FRAMEWORKS.includes(String(framework || "").toLowerCase());
  }

  function getFrameworkFallback(framework) {
    const key = String(framework || "").toLowerCase();
    const fallbackMap = {
      quest: "aida",
      tofu: "aida",
      mofu: "aida",
      bofu: "aida",
      vsl: "4p",
      advertorial: "4p",
      longform: "4p",
      fsp: "pas",
      "status-whatsapp": "pas"
    };
    return fallbackMap[key] || "aida";
  }

  const ICON_MAP = {
    "🧠": "brain",
    "📋": "clipboard",
    "🚀": "rocket",
    "📱": "phone",
    "🧾": "page",
    "📝": "form",
    "🧩": "layers",
    "✨": "sparkles",
    "🎯": "target",
    "📅": "calendar",
    "🛍️": "bag",
    "🔁": "repeat",
    "⚡": "bolt",
    "🤖": "robot",
    "🛠️": "tools",
    "🎉": "check-circle",
    "💬": "chat",
    "💳": "card",
    "📣": "megaphone",
    "🎲": "dice",
    "↻": "refresh",
    "📊": "chart",
    "📈": "chart",
    "⚙️": "settings",
    "🛡️": "shield",
    "📌": "pin",
    "🧬": "dna",
    "🔓": "unlock",
    "⏱️": "clock",
    "🏆": "trophy",
    "💡": "bulb",
    "💸": "coins",
    "⚠️": "warning",
    "✅": "check-circle",
    "🧭": "compass",
    "🎓": "graduation",
    "🩺": "stethoscope",
    "✈️": "plane",
    "💍": "ring",
    "🍜": "bowl",
    "🔧": "wrench",
    "💰": "money"
  };

  function resolveIconName(icon) {
    return ICON_MAP[icon] || String(icon || "sparkles").replace(/^icon-/, "");
  }

  function iconSvg(icon, className) {
    const name = resolveIconName(icon);
    const classes = ["icon-svg", className].filter(Boolean).join(" ");
    return '<svg class="' + classes + '" aria-hidden="true" focusable="false"><use href="#icon-' + name + '"></use></svg>';
  }

  function iconLabelHtml(icon, label) {
    return '<span class="icon-label">' + iconSvg(icon) + '<span>' + escapeHtml(label) + "</span></span>";
  }

  function setButtonLabel(btn, icon, label) {
    if (!btn) return;
    btn.innerHTML = iconLabelHtml(icon, label);
  }

  function setInlineLabel(el, icon, label) {
    if (!el) return;
    el.innerHTML = iconLabelHtml(icon, label);
  }

  function hydrateStaticIcons() {
    $$(".benefit-ic, .suite-ic, .option-ic, .ai-avatar, .ai-ic, .success-ic").forEach((el) => {
      const raw = String(el.textContent || "").trim();
      if (raw) el.innerHTML = iconSvg(raw);
    });

    [
      ["#inspirationBtn", "✨", "Beri Saya Inspirasi"],
      ["#nameIdeaBtn", "✨", "Bingung? Beri Saya Ide Nama"],
      ["#generateBtn", "🚀", "Susun 3 Super Prompt"],
      ["#shareWa", "💬", "Bagikan ke Teman via WhatsApp"],
      ["#pageIdeasBtn", "✨", "Beri Saya Ide"],
      ["#pageIdeasBtnDetail", "✨", "Beri Saya Ide"],
      ["#pageRecommendFrameworkBtn", "✨", "Saya Bingung, Pilihkan untuk Saya"],
      ["#pageGenerateBtn", "🚀", "Susun 3 Super Prompt"],
      ["#pageShareWa", "💬", "Bagikan ke Teman via WhatsApp"],
      ["#formIdeasBtnType", "✨", "Beri Saya Ide"],
      ["#formIdeasBtnPurpose", "✨", "Beri Saya Ide"],
      ["#formGenerateBtn", "🚀", "Susun 3 Super Prompt"],
      ["#formShareWa", "💬", "Bagikan ke Teman via WhatsApp"],
      ["#ideasRandomBtn", "🎲", "Ide Acak"],
      ["#pageIdeasRandomBtn", "🎲", "Ide Acak"],
      ["#formIdeasRandomBtn", "🎲", "Ide Acak"],
      ["#nameRefreshBtn", "↻", "Perbarui"]
    ].forEach((item) => setButtonLabel($(item[0]), item[1], item[2]));

    $$("[data-copy]").forEach((btn) => setButtonLabel(btn, "📋", "Salin"));
    setInlineLabel($("#pageBadge"), "🧾", "Salespage Builder Review");
    setInlineLabel($("#formBadge"), "📝", "Form Builder Review");
  }

  let audioCtx = null;
  function ensureAudio() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx && audioCtx.state === "suspended") {
      try { audioCtx.resume(); } catch (e) { }
    }
    return audioCtx;
  }

  function playTone(freq, startOffset, duration, type, peak) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime + (startOffset || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak || 0.04, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (duration || 0.08));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (duration || 0.08) + 0.02);
  }

  function playClickSound() {
    playTone(880, 0, 0.045, "triangle", 0.03);
  }

  function playSuccessSound() {
    playTone(660, 0, 0.08, "sine", 0.05);
    playTone(990, 0.09, 0.12, "sine", 0.045);
  }

  function playErrorSound() {
    playTone(220, 0, 0.12, "sawtooth", 0.02);
  }

  // ---------- Login gate ----------
  // Gate ini sengaja dibuat terpisah agar tidak mengubah flow wizard/modul yang sudah ada.
  function setupAuthGate() {
    const gate = $("#authGate");
    const form = $("#authGateForm");
    const input = $("#authPasswordInput");
    const error = $("#authGateError");
    const logoutBtn = $("#logoutBtn");
    if (!gate || !form || !input || !error || !logoutBtn) return;

    let isAuthenticated = false;

    function setStoredAuth(enabled) {
      try {
        if (enabled) localStorage.setItem(AUTH_KEY, AUTH_VALUE);
        else localStorage.removeItem(AUTH_KEY);
      } catch (e) { }
    }

    function getStoredAuth() {
      try {
        return localStorage.getItem(AUTH_KEY) === AUTH_VALUE;
      } catch (e) {
        return false;
      }
    }

    function focusInput() {
      setTimeout(() => {
        try {
          input.focus();
          input.select();
        } catch (e) { }
      }, 20);
    }

    function clearError() {
      error.textContent = "";
    }

    function showGate() {
      isAuthenticated = false;
      gate.hidden = false;
      gate.setAttribute("aria-hidden", "false");
      logoutBtn.hidden = true;
      document.body.classList.add("auth-locked");
      input.value = "";
      clearError();
      focusInput();
    }

    function hideGate() {
      isAuthenticated = true;
      gate.hidden = true;
      gate.setAttribute("aria-hidden", "true");
      logoutBtn.hidden = false;
      document.body.classList.remove("auth-locked");
      clearError();
    }

    function resetSession() {
      setStoredAuth(false);
      showGate();
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = String(input.value || "").trim();
      if (value !== AUTH_PASSWORD) {
        error.textContent = "Password tidak valid";
        playErrorSound();
        focusInput();
        return;
      }
      setStoredAuth(true);
      hideGate();
      playSuccessSound();
    });

    input.addEventListener("input", () => {
      if (error.textContent) clearError();
    });

    logoutBtn.addEventListener("click", () => {
      if (!isAuthenticated) return;
      resetSession();
    });

    if (getStoredAuth()) hideGate();
    else showGate();
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        idea: state.idea, name: state.name, goal: state.goal, version: state.version
      }));
    } catch (e) { /* localStorage tidak tersedia — abaikan dengan aman */ }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem(LEGACY_STORE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.idea) { state.idea = d.idea; $("#inputIdea").value = d.idea; }
      if (d.name) { state.name = d.name; $("#inputName").value = d.name; }
      if (d.goal) { state.goal = d.goal; markGoal(d.goal); }
      if (d.version) {
        state.version = isAppVersionUnlocked(d.version) ? d.version : "QUICK";
        markVersion(state.version);
      }
    } catch (e) { /* abaikan */ }
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function openUpgradePage(message) {
    if (message) toast(message);
    window.open(UPGRADE_URL, "_blank");
  }

  document.addEventListener("pointerdown", (e) => {
    const hit = e.target && e.target.closest
      ? e.target.closest("button,.btn,.option,.chip,.ai-card,.framework-card,.version-card")
      : null;
    if (!hit) return;
    playClickSound();
  }, true);

  document.addEventListener("contextmenu", (e) => {
    const el = e.target;
    const allow =
      (el && el.closest && el.closest("input,textarea,select,[contenteditable='true']")) ||
      (el && el.isContentEditable);
    if (allow) return;
    e.preventDefault();
    toast("Klik kanan dinonaktifkan.");
    playErrorSound();
  });

  // ---------- Step navigation ----------
  function goToStep(n, doScroll) {
    state.step = n;
    $$app(".wizard-panel").forEach((p) => p.classList.toggle("active", +p.dataset.step === n));
    // progress fill
    $("#progressFill").style.width = (n / 5 * 100) + "%";
    $$app(".pstep").forEach((s) => {
      const p = +s.dataset.p;
      s.classList.toggle("active", p === n);
      s.classList.toggle("done", p < n);
    });
    // scroll ke atas wizard agar pengguna tidak bingung (kecuali saat init)
    if (doScroll !== false) {
      const w = $app("#wizard");
      if (w) {
        const y = w.getBoundingClientRect().top + window.scrollY - 12;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }

  // ---------- Validation per step ----------
  function validateStep(n) {
    if (n === 1) {
      const v = $("#inputIdea").value.trim();
      if (v.length < 3) { showErr("#errIdea"); return false; }
      state.idea = v; saveState(); return true;
    }
    if (n === 2) {
      const v = $("#inputName").value.trim();
      if (v.length < 3) { showErr("#errName"); return false; }
      state.name = v; saveState(); return true;
    }
    if (n === 3) {
      if (!state.goal) { showErr("#errGoal"); return false; }
      return true;
    }
    return true;
  }

  function showErr(sel) {
    const el = $(sel);
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 3000);
    playErrorSound();
  }

  // ---------- Goal selection ----------
  function markGoal(goal) {
    $$("#goalGrid .option").forEach((o) => o.classList.toggle("selected", o.dataset.goal === goal));
  }

  // ---------- Version selection ----------
  function markVersion(v) {
    $$("#versionGrid .version-card").forEach((c) => {
      const key = String(c.dataset.version || "").toUpperCase();
      const unlocked = isAppVersionUnlocked(c.dataset.version);
      c.classList.toggle("selected", c.dataset.version === v);
      c.classList.toggle("locked", !unlocked);
      c.setAttribute("aria-disabled", unlocked ? "false" : "true");
      if (!unlocked && !c.querySelector(".lock-badge")) {
        const badge = document.createElement("span");
        badge.className = "lock-badge";
        badge.textContent = key === "PRO" ? "PRO" : "Upgrade";
        c.appendChild(badge);
      }
      if (!unlocked) {
        c.title = key === "PRO"
          ? "Kuota PRO habis. Upgrade untuk lanjut pakai PRO."
          : "Versi ini tersedia di paket PRO";
      } else if (key === "PRO") {
        c.title = "Sisa generate PRO: " + getProGeneratesRemaining() + "/" + PRO_GENERATE_LIMIT;
      } else {
        c.title = "";
      }
    });
  }

  function updateGenerateButton() {
    const btn = $("#generateBtn");
    if (!btn) return;
    const unlocked = isAppVersionUnlocked(state.version);
    const isPro = String(state.version || "").toUpperCase() === "PRO";
    const label = unlocked
      ? (isPro ? ("Susun PRO (" + getProGeneratesRemaining() + "/" + PRO_GENERATE_LIMIT + ")") : "Susun 3 Super Prompt")
      : "Buka Paket PRO";
    setButtonLabel(btn, unlocked ? "🚀" : "🔒", label);
    btn.disabled = !unlocked;
    btn.classList.toggle("btn-primary", unlocked);
    btn.classList.toggle("btn-wa", !unlocked);
  }

  // ---------- AI Review ----------
  const thinkingLines = [
    "Membaca ide Anda...",
    "Mengenali kategori bisnisnya...",
    "Menyusun peta QUICK, GROWTH, dan PRO...",
    "Mencari WOW factor dan peluang monetisasi...",
    "Menyelesaikan rekomendasi untuk Anda..."
  ];

  function runAIReview() {
    const hasil = deteksiKategoriHybrid(state.idea);
    state.category = hasil.primary;
    state.secondary = hasil.secondary;
    const review = buatAIReview(state);

    const thinkingEl = $("#aiThinking");
    const reviewEl = $("#aiReview");
    const labelEl = $("#thinkingLabel");

    thinkingEl.hidden = false;
    reviewEl.hidden = true;

    // animasi "berpikir" — ganti label bertahap
    let i = 0;
    labelEl.textContent = thinkingLines[0];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interval = reduce ? 120 : 620;

    const ticker = setInterval(() => {
      i++;
      if (i < thinkingLines.length) {
        labelEl.textContent = thinkingLines[i];
      } else {
        clearInterval(ticker);
        renderReview(review);
        thinkingEl.hidden = true;
        reviewEl.hidden = false;
      }
    }, interval);
  }

  function renderReview(review) {
    let badge = iconSvg(review.kategoriIcon) + ' Kategori: <b style="margin-left:4px">' + review.kategoriLabel + "</b>";
    $("#catBadge").innerHTML = badge;
    // Hybrid DNA badge
    const head = $(".ai-review-head");
    let dna = head.querySelector(".dna-badge");
    if (review.secondaryLabel) {
      if (!dna) { dna = document.createElement("span"); dna.className = "dna-badge"; head.appendChild(dna); }
      dna.innerHTML = iconSvg("🧬") + ' DNA tambahan: <b style="margin-left:4px">' + review.secondaryLabel + "</b>";
    } else if (dna) {
      dna.remove();
    }

    const wrap = $("#reviewBlocks");
    wrap.innerHTML = "";
    review.blok.forEach((b, idx) => {
      const div = document.createElement("div");
      div.className = "review-block";
      div.style.animationDelay = (idx * 0.06) + "s";

      let inner = '<h4><span class="rb-ic">' + iconSvg(b.icon) + "</span>" + escapeHtml(b.judul) + "</h4>";

      if (b.type === "score") {
        div.classList.add("is-score");
        inner +=
          '<div class="score-row">' +
            '<span class="score-num">' + b.score + '<small>/10</small></span>' +
            '<span class="score-bar"><span style="width:' + (b.score * 10) + '%"></span></span>' +
          '</div>' +
          '<ul class="score-reasons">' + b.reasons.map((r) => "<li>" + escapeHtml(r) + "</li>").join("") + "</ul>";
      } else if (b.type === "meter") {
        let rows = b.meters.map((m) => {
          let bars = "";
          for (let i = 1; i <= 5; i++) {
            bars += '<i class="' + (i <= m.value ? "on-" + m.value : "") + '"></i>';
          }
          return '<div class="meter-row"><span class="meter-label">' + m.label + '</span><span class="meter-bars">' + bars + "</span></div>";
        }).join("");
        inner += rows + '<p class="meter-cap">' + escapeHtml(b.isi) + "</p>";
      } else if (b.type === "whyquick") {
        div.classList.add("is-whyquick");
        inner += '<ul class="whyquick-list">' + b.points.map((p) => "<li>" + escapeHtml(p) + "</li>").join("") + "</ul>";
      } else {
        inner += "<p>" + b.isi + "</p>";
        if (b.list && b.list.length) {
          inner += '<ul class="review-list">' + b.list.map((x) => "<li>" + escapeHtml(x) + "</li>").join("") + "</ul>";
        }
      }
      div.innerHTML = inner;
      wrap.appendChild(div);
    });
  }

  // ---------- Panduan versi otomatis ----------
  function renderGuide(targetSel) {
    const v = state.version;
    const g = VERSI_PANDUAN[v];
    if (!g) return;
    const unlocked = isAppVersionUnlocked(v);
    const proRemaining = getProGeneratesRemaining();
    const accessText = String(v || "").toUpperCase() === "PRO"
      ? (unlocked ? ("terbuka (" + proRemaining + "/" + PRO_GENERATE_LIMIT + " sisa)") : "kuota PRO habis")
      : (unlocked ? "terbuka" : "khusus PRO");
    let bars = "";
    for (let i = 1; i <= 5; i++) bars += '<i class="' + (i <= g.kesulitan ? "on-" + g.kesulitan : "") + '"></i>';
    const html =
      '<div class="guide-card">' +
        '<div class="guide-head"><strong>Panduan Versi ' + v + '</strong><span class="guide-cocok">' + g.cocok + '</span></div>' +
        '<div class="guide-facts">' +
          '<div class="guide-fact">' + iconSvg(unlocked ? "🔓" : "⚠️") + '<span>Akses: <b>' + accessText + '</b></span></div>' +
          '<div class="guide-fact">' + iconSvg("🛠️") + '<span>Yang dibutuhkan: <b>' + g.butuh + '</b></span></div>' +
          '<div class="guide-fact">' + iconSvg("⏱️") + '<span>Estimasi waktu: <b>' + g.estimasi + '</b></span></div>' +
        '</div>' +
        '<ol class="guide-steps">' + g.langkah.map((l) => "<li>" + l + "</li>").join("") + '</ol>' +
        '<div class="guide-meter"><span>Tingkat kesulitan: ' + g.kesulitan + '/5</span><span class="meter-bars">' + bars + '</span></div>' +
      '</div>';
    const el = $(targetSel);
    if (el) el.innerHTML = html;
  }

  function escapeHtml(str) {
    // Hanya untuk teks yang tidak sengaja mengandung HTML dari input pengguna.
    // Catatan: konten review yang memang berisi <strong> sudah aman karena
    // dibuat oleh sistem, bukan input mentah; di sini kita escape judul & list.
    return String(str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  function setupSuiteNavigation() {
    const SUITE_KEY = "nexla_suite_module_v1";
    const wizardIdByModule = { app: "wizard", page: "page-wizard", form: "form-wizard" };
    const allowed = Object.keys(wizardIdByModule);

    function normalize(m) {
      const v = String(m || "").toLowerCase().trim();
      return allowed.includes(v) ? v : "app";
    }

    function updateStartLinks(module) {
      const id = wizardIdByModule[module] || "wizard";
      const href = "#" + id;
      const start = $("#suiteStartBtn");
      const hero = $("#heroStartBtn");
      if (start) start.setAttribute("href", href);
      if (hero) hero.setAttribute("href", href);
    }

    function setActive(module, opts) {
      const m = normalize(module);
      try { localStorage.setItem(SUITE_KEY, m); } catch (e) { }

      $$("[data-suite-module]").forEach((el) => el.classList.toggle("active", el.dataset.suiteModule === m));
      $$("[data-suite-tab]").forEach((el) => el.classList.toggle("active", el.dataset.suiteTab === m));

      updateStartLinks(m);

      const shouldScroll = !(opts && opts.scroll === false);
      if (shouldScroll) {
        const target = document.getElementById(wizardIdByModule[m] || "wizard");
        if (target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 12;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }

    const tabs = $$("[data-suite-tab]");
    if (!tabs.length) return;
    tabs.forEach((btn) => btn.addEventListener("click", () => setActive(btn.dataset.suiteTab)));

    let initial = "app";
    try { initial = normalize(localStorage.getItem(SUITE_KEY)); } catch (e) { initial = "app"; }
    setActive(initial, { scroll: false });
  }

  function renderStaticGuide(targetSel, title, facts, steps) {
    const el = $(targetSel);
    if (!el) return;
    const html =
      '<div class="guide-card">' +
        '<div class="guide-head"><strong>' + escapeHtml(title) + '</strong><span class="guide-cocok">' + escapeHtml(facts.cocok || "") + '</span></div>' +
        '<div class="guide-facts">' +
          (facts.ai ? ('<div class="guide-fact">' + iconSvg("🤖") + '<span>AI produksi: <b>' + escapeHtml(facts.ai) + '</b></span></div>') : "") +
          (facts.butuh ? ('<div class="guide-fact">' + iconSvg("🛠️") + '<span>Yang dibutuhkan: <b>' + escapeHtml(facts.butuh) + '</b></span></div>') : "") +
          (facts.deploy ? ('<div class="guide-fact">' + iconSvg("🚀") + '<span>Opsi deploy: <b>' + escapeHtml(facts.deploy) + '</b></span></div>') : "") +
        '</div>' +
        '<ol class="guide-steps">' + (steps || []).map((l) => "<li>" + escapeHtml(l) + "</li>").join("") + '</ol>' +
      '</div>';
    el.innerHTML = html;
  }

  const PAGE_FRAMEWORKS = {
    aida: {
      label: "AIDA",
      flow: "Attention → Interest → Desire → Action",
      fit: "Produk umum, UMKM, landing page sederhana"
    },
    pas: {
      label: "PAS",
      flow: "Problem → Agitate → Solution",
      fit: "Produk pemecah masalah, jasa, konsultan"
    },
    bab: {
      label: "BAB",
      flow: "Before → After → Bridge",
      fit: "Produk transformasi, kursus, coaching"
    },
    "4p": {
      label: "4P",
      flow: "Promise → Picture → Proof → Push",
      fit: "Produk digital, webinar, lead magnet"
    },
    quest: {
      label: "QUEST",
      flow: "Qualify → Understand → Educate → Stimulate → Transition",
      fit: "Audiens yang perlu edukasi"
    },
    tofu: {
      label: "TOFU",
      flow: "Top of Funnel",
      fit: "Audiens baru, awareness"
    },
    mofu: {
      label: "MOFU",
      flow: "Middle of Funnel",
      fit: "Audiens yang sudah kenal, pertimbangan"
    },
    bofu: {
      label: "BOFU",
      flow: "Bottom of Funnel",
      fit: "Audiens siap membeli, closing"
    },
    vsl: {
      label: "VSL",
      flow: "Video Sales Letter",
      fit: "Produk harga tinggi, webinar, high ticket"
    },
    advertorial: {
      label: "Advertorial",
      flow: "Native marketing / soft selling",
      fit: "Native marketing, soft selling"
    },
    longform: {
      label: "Long Form Salesletter",
      flow: "Penjualan mendalam",
      fit: "Produk kompleks, penjelasan mendalam"
    },
    fsp: {
      label: "FSP",
      flow: "Fakta → Story → Penawaran",
      fit: "Pasar Indonesia, WhatsApp, story selling"
    },
    "status-whatsapp": {
      label: "Status WhatsApp",
      flow: "Promosi singkat dan rutin",
      fit: "Promosi harian, broadcast"
    }
  };

  const PAGE_IDEAS = {
    Fashion: [
      { product: "Brand modest wear premium untuk wanita aktif.", detail: "Target pembeli: wanita 22-35 tahun. Keunggulan: bahan adem, cutting rapi, look premium, cocok untuk kerja dan hangout." },
      { product: "Paket hampers fashion kantor untuk tim perusahaan.", detail: "Target pembeli: HR dan perusahaan. Fokus pada hampers seragam, eksklusif, dan mudah dipesan via WhatsApp." }
    ],
    Kuliner: [
      { product: "Catering sehat harian untuk pekerja kantor.", detail: "Target pembeli: profesional sibuk. Keunggulan: menu berubah tiap hari, kalori jelas, pengiriman terjadwal." },
      { product: "Dessert box premium untuk hadiah perusahaan.", detail: "Target pembeli: corporate gifting dan event kecil. Fokus pada kemasan premium dan pemesanan cepat." }
    ],
    Jasa: [
      { product: "Jasa desain interior untuk rumah minimalis.", detail: "Target pembeli: pasangan muda dan keluarga baru. Keunggulan: konsep modern, konsultasi cepat, hasil visual rapi." },
      { product: "Jasa pembuatan konten Instagram untuk UMKM.", detail: "Target pembeli: owner UMKM. Hasil yang dijual: feed lebih rapi, posting lebih konsisten, dan hemat waktu." }
    ],
    Pendidikan: [
      { product: "Kelas online belajar Canva untuk guru.", detail: "Target pembeli: guru dan tenaga pengajar. Fokus pada materi praktis, template siap pakai, dan kelas ramah pemula." },
      { product: "Program les privat matematika untuk SMP.", detail: "Target pembeli: orang tua siswa. Keunggulan: kelas personal, progress terukur, dan laporan belajar berkala." }
    ],
    Kesehatan: [
      { product: "Program konsultasi nutrisi untuk ibu bekerja.", detail: "Target pembeli: ibu usia 25-40 tahun. Hasil yang dijual: pola makan lebih teratur dan program yang realistis." },
      { product: "Layanan homecare pasca rawat inap.", detail: "Target pembeli: keluarga pasien. Fokus pada rasa aman, tenaga profesional, dan kemudahan booking." }
    ],
    Kecantikan: [
      { product: "Klinik treatment wajah untuk kulit sensitif.", detail: "Target pembeli: wanita 20-35 tahun. Keunggulan: konsultasi personal, treatment aman, dan before-after jelas." },
      { product: "Paket bridal makeup premium untuk acara intimate wedding.", detail: "Target pembeli: calon pengantin. Fokus pada tampilan elegan, tahan lama, dan pendampingan sampai hari acara." }
    ],
    Properti: [
      { product: "Jasa pemasaran rumah second area kota besar.", detail: "Target pembeli: pemilik rumah dan investor. Fokus pada listing premium, lead berkualitas, dan follow-up cepat." },
      { product: "Konsultasi desain interior untuk apartemen mungil.", detail: "Target pembeli: penghuni apartemen baru. Keunggulan: space-saving, tampilan estetik, dan budgeting realistis." }
    ],
    Affiliate: [
      { product: "Halaman rekomendasi gadget kerja untuk freelancer.", detail: "Target pembeli: pekerja remote dan freelancer. Fokus pada rekomendasi praktis, review singkat, dan CTA beli." },
      { product: "Kurasi produk skincare aman untuk pemula.", detail: "Target pembeli: wanita 18-30 tahun. Hasil yang dijual: mempermudah memilih produk tanpa bingung." }
    ],
    "Digital Product": [
      { product: "Template Notion untuk manajemen konten creator.", detail: "Target pembeli: content creator dan solopreneur. Keunggulan: siap pakai, mudah diadaptasi, dan bikin kerja lebih rapi." },
      { product: "E-book strategi WhatsApp marketing untuk UMKM.", detail: "Target pembeli: owner bisnis kecil. Fokus pada langkah praktis, contoh nyata, dan hasil cepat diterapkan." }
    ],
    Webinar: [
      { product: "Webinar optimasi AI untuk bisnis jasa.", detail: "Target pembeli: owner jasa dan konsultan. Fokus pada edukasi, demo praktis, dan CTA pendaftaran." },
      { product: "Workshop live bikin salespage tanpa coding.", detail: "Target pembeli: freelancer, UMKM, dan creator. Hasil yang dijual: peserta langsung punya halaman jualan siap online." }
    ],
    UMKM: [
      { product: "Paket branding sederhana untuk UMKM baru.", detail: "Target pembeli: owner bisnis baru. Keunggulan: cepat, jelas, dan langsung bisa dipakai jualan." },
      { product: "Jasa foto produk rumahan untuk katalog online.", detail: "Target pembeli: UMKM makanan dan fashion. Fokus pada visual lebih meyakinkan dan cepat dipakai promosi." }
    ],
    Freelance: [
      { product: "Jasa landing page untuk freelancer dan agency kecil.", detail: "Target pembeli: freelancer, agency kecil, dan konsultan. Hasil yang dijual: closing lebih rapi dan lebih meyakinkan." },
      { product: "Paket personal branding LinkedIn untuk profesional.", detail: "Target pembeli: job seeker dan profesional. Fokus pada positioning, profil kuat, dan CTA konsultasi." }
    ]
  };

  const FORM_IDEAS = {
    Leads: [
      {
        title: "Form Konsultasi Jasa (Lead)",
        type: "lead",
        purpose: "Calon klien isi nama, nomor WhatsApp, email (opsional), dan kebutuhan singkat. Setelah submit, data masuk ke Spreadsheet dan admin dapat notifikasi WhatsApp untuk follow up cepat.",
        fields: ["nama", "wa", "email", "kebutuhan"]
      },
      {
        title: "Form Request Penawaran (B2B)",
        type: "kontak",
        purpose: "Prospek isi nama, perusahaan, jabatan, WhatsApp, dan kebutuhan. Saya ingin follow up via WhatsApp dengan ringkasan yang rapi agar cepat closing.",
        fields: ["nama", "perusahaan", "jabatan", "wa", "kebutuhan"]
      }
    ],
    Booking: [
      {
        title: "Form Booking Jadwal",
        type: "booking",
        purpose: "Pelanggan pilih tanggal & jam, isi nama dan WhatsApp. Setelah submit, tampil pesan sukses dan admin dapat notifikasi agar bisa konfirmasi jadwal.",
        fields: ["nama", "wa", "tanggal", "jam", "catatan"]
      }
    ],
    Webinar: [
      {
        title: "Form Registrasi Webinar",
        type: "webinar",
        purpose: "Peserta daftar webinar dengan nama, WhatsApp, dan email. Data tersimpan di Spreadsheet. Saya ingin event Pixel: CompleteRegistration (opsional).",
        fields: ["nama", "wa", "email"]
      }
    ],
    Order: [
      {
        title: "Form Order Sederhana",
        type: "order",
        purpose: "Pelanggan order produk: nama, WhatsApp, alamat, jumlah, dan catatan. Admin dapat notifikasi WhatsApp. Saya ingin event Pixel: Purchase (opsional).",
        fields: ["nama", "wa", "alamat", "jumlah", "catatan"]
      }
    ],
    Survey: [
      {
        title: "Form Survey Kepuasan",
        type: "survey",
        purpose: "Kumpulkan feedback singkat setelah layanan/kelas. Saya butuh nama, WhatsApp (opsional), email (opsional), dan catatan feedback. Simpan ke Spreadsheet.",
        fields: ["nama", "wa", "email", "catatan"]
      }
    ],
    HR: [
      {
        title: "Form Submit Application",
        type: "lamaran",
        purpose: "Pelamar isi nama, WhatsApp, email, kota, dan catatan singkat (link CV/portofolio). Data masuk Spreadsheet untuk screening awal.",
        fields: ["nama", "wa", "email", "kota", "catatan"],
        customFields: "Link CV\nLink Portofolio"
      }
    ]
  };

  function recommendPageFramework(input) {
    const product = String(input.product || "").toLowerCase();
    const audience = String(input.audience || "").toLowerCase();
    const priceRaw = String(input.price || "").toLowerCase();
    const awareness = String(input.awareness || "").toLowerCase();
    const priceNum = parseInt(priceRaw.replace(/[^\d]/g, ""), 10) || 0;
    const combined = [product, audience, priceRaw].join(" ");

    let framework = "aida";
    let reason = "Framework ini paling aman untuk menjelaskan produk dengan alur yang mudah diikuti.";

    if (/whatsapp|broadcast|status/.test(combined)) {
      framework = "status-whatsapp";
      reason = "Karena channel utamanya promosi singkat dan rutin, format Status WhatsApp akan lebih cepat dipakai dan lebih mudah dikonsumsi audiens.";
    } else if (/affiliate|native|artikel|review/.test(combined)) {
      framework = "advertorial";
      reason = "Karena gaya jualannya lebih cocok dibawa sebagai konten edukatif atau soft selling, advertorial terasa lebih natural.";
    } else if (/kursus|coaching|mentoring|transformasi|belajar/.test(combined)) {
      framework = "bab";
      reason = "Karena produk Anda menjual perubahan kondisi, BAB membantu memperjelas sebelum-sesudah dan menjembatani penawaran.";
    } else if (/webinar|lead magnet|ebook|e-book|template|digital/.test(combined)) {
      framework = priceNum >= 1000000 ? "vsl" : "4p";
      reason = framework === "vsl"
        ? "Karena produk bernilai tinggi dan butuh presentasi yang lebih persuasif, VSL akan membantu memperpanjang perhatian audiens."
        : "Karena produk digital atau lead magnet butuh janji hasil yang jelas, 4P biasanya paling efektif.";
    } else if (/jasa|konsultan|konsultasi|solusi|perbaiki|atasi|bantu/.test(combined)) {
      framework = "pas";
      reason = "Kami merekomendasikan PAS karena produk Anda menyelesaikan masalah yang jelas dan target pasar perlu diyakinkan terlebih dahulu.";
    } else if (awareness === "baru") {
      framework = /edukasi|baru|awam|pemula/.test(combined) ? "quest" : "tofu";
      reason = framework === "quest"
        ? "Audiens Anda masih butuh edukasi, jadi QUEST membantu mengajar sambil membangun minat beli."
        : "Karena audiens masih baru, TOFU lebih cocok untuk membangun awareness dan ketertarikan awal.";
    } else if (awareness === "sedikit") {
      framework = "mofu";
      reason = "Karena audiens sudah mulai kenal tapi masih mempertimbangkan, MOFU cocok untuk memperkuat alasan membeli.";
    } else if (awareness === "sudah") {
      framework = priceNum >= 2000000 ? "vsl" : "bofu";
      reason = framework === "vsl"
        ? "Audiens sudah kenal dan harga cukup tinggi, jadi VSL membantu mengemas penjelasan lebih meyakinkan."
        : "Karena audiens sudah kenal dan siap mengambil keputusan, BOFU akan lebih tajam untuk closing.";
    } else if (/kompleks|paket lengkap|sistem|enterprise/.test(combined) || priceNum >= 3000000) {
      framework = "longform";
      reason = "Karena produknya relatif kompleks atau bernilai tinggi, long form salesletter memberi ruang untuk penjelasan yang lebih lengkap.";
    } else if (/indonesia|story|cerita|whatsapp/.test(combined)) {
      framework = "fsp";
      reason = "Karena pasar dan channel yang dipakai cocok dengan pendekatan story selling, FSP akan terasa lebih natural.";
    }

    return { framework: framework, reason: reason };
  }

  function promptPageOfferStrategist(s) {
    const goalLabel = {
      jualan: "langsung jual",
      prospek: "kumpulkan leads",
      booking: "booking",
      whatsapp: "chat WhatsApp",
      info: "informasi + CTA"
    }[s.goal] || "menjual";
    const framework = PAGE_FRAMEWORKS[s.framework] || PAGE_FRAMEWORKS.aida;

    return `Kamu adalah Offer Strategist senior (copy + positioning) untuk Salespage Builder. Filosofi: Result First.

=== INPUT ===
Apa yang dijual: ${s.product}
Detail singkat: ${s.detail}
Tujuan salespage: ${goalLabel}
Framework salespage: ${framework.label} (${framework.flow})

=== TUGAS ===
Buatkan strategi offer yang siap dieksekusi untuk salespage:
1) POSITIONING
- Unique value proposition (1 kalimat)
- Diferensiasi (3 poin)
- Alasan percaya (proof ideas)

2) TARGET MARKET
- Persona utama (siapa, masalah, keinginan)
- Situasi pemicu (kapan mereka butuh)
- Keberatan umum (min. 5) + jawaban singkat

3) ANGLE PENJUALAN
- 3 angle utama (nama angle + 1-2 kalimat)
- 1 angle utama yang paling kuat + alasan

4) STRUCTURE OFFER
- Paket (Basic/Standard/Premium) atau format yang paling cocok
- Apa yang termasuk (bullet)
- Bonus (opsional)
- Garansi (jika relevan)
- CTA utama + CTA alternatif (WhatsApp/Booking)

5) ARAH FRAMEWORK
- Jelaskan kenapa framework ${framework.label} cocok untuk salespage ini.
- Tulis bagaimana alur ${framework.flow} diterapkan ke section salespage.

ATURAN
- Bahasa Indonesia, ringkas, tidak lebay, fokus hasil dan manfaat.
- Asumsikan pembaca adalah non-teknis (UMKM/guru/freelancer/founder).
- Jangan menulis HTML atau kode. Ini murni strategi.`;
  }

  function promptPageCopywriterArchitect(s) {
    const goalLabel = {
      jualan: "langsung jual",
      prospek: "kumpulkan leads",
      booking: "booking",
      whatsapp: "chat WhatsApp",
      info: "informasi + CTA"
    }[s.goal] || "menjual";
    const framework = PAGE_FRAMEWORKS[s.framework] || PAGE_FRAMEWORKS.aida;

    return `Kamu adalah Copywriter Architect untuk Salespage Builder. Filosofi: Result First.

=== INPUT ===
Apa yang dijual: ${s.product}
Detail singkat: ${s.detail}
Tujuan salespage: ${goalLabel}
Framework salespage: ${framework.label} (${framework.flow})

=== OUTPUT WAJIB ===
1) HEADLINE SET
- Headline utama (max 12 kata)
- Subheadline (1-2 kalimat)
- 3 variasi headline alternatif

2) BODY COPY
- Opening (empathy + problem)
- Value bullets (6-9 bullet)
- Proof ideas (testimoni placeholder, before/after, data, proses)
- Offer section (ringkas)

3) CTA
- CTA utama (bahasa aksi)
- CTA untuk WhatsApp (dengan contoh pesan)
- CTA sticky mobile (teks tombol)

4) FAQ
- Minimal 8 FAQ + jawaban singkat

5) STRUKTUR SALESPAGE
Tulis urutan section dari atas ke bawah mengikuti framework ${framework.label}.

ATURAN
- Bahasa Indonesia yang rapi, premium, dan mudah dipahami.
- Fokus konversi. Hindari jargon teknis.`;
  }

  function promptPageDeveloper(s) {
    const goalLabel = {
      jualan: "langsung jual",
      prospek: "kumpulkan leads",
      booking: "booking",
      whatsapp: "chat WhatsApp",
      info: "informasi + CTA"
    }[s.goal] || "menjual";
    const framework = PAGE_FRAMEWORKS[s.framework] || PAGE_FRAMEWORKS.aida;

    return `Kamu adalah Salespage Developer senior untuk Salespage Builder.

Tujuanmu: bangun salespage "${s.product}" yang mobile-first, premium, cepat, dan siap deploy sebagai ZIP.

=== INPUT ===
Apa yang dijual: ${s.product}
Detail singkat: ${s.detail}
Tujuan salespage: ${goalLabel}
Framework salespage: ${framework.label} (${framework.flow})

=== STACK WAJIB ===
- HTML, CSS, JavaScript murni (tanpa framework, tanpa build process).
- Tidak ada Node.js, npm, terminal, Vite, React, Vue.
- Fokus performa, aksesibilitas, dan SEO dasar (title, meta description, heading rapi).

=== FITUR WAJIB ===
- Hero + CTA kuat
- Struktur salespage lengkap yang mengikuti framework ${framework.label}
- Tombol WhatsApp dengan pesan otomatis (wa.me/?text=...)
- Sticky CTA di mobile
- Smooth scroll untuk anchor
- Tidak ada error console

=== OUTPUT ===
Berikan kode lengkap untuk file:
project/
├── index.html
├── style.css
└── script.js

Pastikan semua file bisa di-zip dan langsung deploy.

=== PANDUAN DEPLOY (WAJIB DITULIS DI BAGIAN AKHIR OUTPUT) ===
Static HTML/CSS/JS, beri 3 opsi deploy yang mudah dipahami:
1) Netlify (prioritas)
2) Scalev
3) cPanel File Manager (upload ZIP → extract → pastikan index.html di folder yang benar)
Jangan menjadikan Docker/SSH/VPS/Vercel sebagai jalur utama.`;
  }

  function setupPageModule() {
    const root = document.querySelector('[data-suite-module="page"]');
    if (!root) return;

    const STORE_KEY_PAGE = "nexla_page_v1";
    const s = {
      step: 1,
      product: "",
      detail: "",
      goal: "",
      framework: "",
      frameworkReason: "",
      ai: "claude",
      generated: { offer: "", copy: "", dev: "" }
    };

    const $p = (sel) => root.querySelector(sel);
    const $$p = (sel) => Array.from(root.querySelectorAll(sel));
    const pageIdeasModal = $("#pageIdeasModal");
    const pageIdeasList = $("#pageIdeasList");
    const pageIdeasCategory = $("#pageIdeasCategory");
    const pageIdeasRandomBtn = $("#pageIdeasRandomBtn");
    const pageIdeasResetBtn = $("#pageIdeasResetBtn");

    function save() {
      try {
        localStorage.setItem(STORE_KEY_PAGE, JSON.stringify({
          product: s.product,
          detail: s.detail,
          goal: s.goal,
          framework: s.framework,
          frameworkReason: s.frameworkReason,
          ai: s.ai
        }));
      } catch (e) { }
    }

    function load() {
      try {
        const raw = localStorage.getItem(STORE_KEY_PAGE);
        if (!raw) return;
        const d = JSON.parse(raw);
        if (d.product) { s.product = d.product; $p("#pageInputProduct").value = d.product; }
        if (d.detail) { s.detail = d.detail; $p("#pageInputDetail").value = d.detail; }
        if (d.goal) { s.goal = d.goal; markGoal(d.goal); }
        if (d.framework && isPageFrameworkUnlocked(d.framework)) { s.framework = d.framework; markFramework(d.framework); }
        if (d.frameworkReason) { s.frameworkReason = d.frameworkReason; }
        if (d.ai) { s.ai = d.ai; markAi(d.ai); }
      } catch (e) { }
    }

    function goTo(n, doScroll) {
      s.step = n;
      $$p(".wizard-panel").forEach((p) => p.classList.toggle("active", +p.dataset.step === n));
      const fill = $p("#pageProgressFill");
      if (fill) fill.style.width = (n / 6 * 100) + "%";
      $$p(".pstep").forEach((el) => {
        const p = +el.dataset.p;
        el.classList.toggle("active", p === n);
        el.classList.toggle("done", p < n);
      });
      if (doScroll !== false) {
        const w = $p("#page-wizard");
        if (w) {
          const y = w.getBoundingClientRect().top + window.scrollY - 12;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }

    function applyPageIdea(item) {
      if (!item) return;
      const product = String(item.product || "").trim();
      const detail = String(item.detail || "").trim();
      if (product) {
        s.product = product;
        $p("#pageInputProduct").value = product;
      }
      if (detail) {
        s.detail = detail;
        $p("#pageInputDetail").value = detail;
      }
      save();
      closePageIdeasModal();
      toast("Ide salespage dipakai. Silakan edit sesuai kebutuhan Anda.");
    }

    function renderPageIdeas(category) {
      if (!pageIdeasList) return;
      const keys = Object.keys(PAGE_IDEAS);
      const active = category && PAGE_IDEAS[category] ? category : "";
      const items = active
        ? PAGE_IDEAS[active].map((item) => ({ category: active, item: item }))
        : keys.flatMap((key) => PAGE_IDEAS[key].map((item) => ({ category: key, item: item })));

      pageIdeasList.innerHTML = "";
      items.forEach((entry) => {
        const card = document.createElement("div");
        card.className = "idea-item";
        card.setAttribute("role", "listitem");
        card.innerHTML =
          '<div class="idea-top">' +
            '<div>' +
              '<div class="idea-title">' + escapeHtml(entry.item.product) + '</div>' +
              '<div class="idea-meta"><span class="idea-badge">' + escapeHtml(entry.category) + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="idea-desc">' + escapeHtml(entry.item.detail) + '</div>' +
          '<div class="idea-actions"><button class="btn btn-primary" type="button">Gunakan Ide Ini</button></div>';
        const btn = card.querySelector("button");
        if (btn) btn.addEventListener("click", () => applyPageIdea(entry.item));
        pageIdeasList.appendChild(card);
      });
    }

    function renderRandomPageIdea() {
      if (!pageIdeasList) return;
      const entries = Object.keys(PAGE_IDEAS).flatMap((key) => PAGE_IDEAS[key].map((item) => ({ category: key, item: item })));
      if (!entries.length) return;
      const entry = entries[Math.floor(Math.random() * entries.length)];
      pageIdeasList.innerHTML = "";
      const card = document.createElement("div");
      card.className = "idea-item";
      card.setAttribute("role", "listitem");
      card.innerHTML =
        '<div class="idea-top">' +
          '<div>' +
            '<div class="idea-title">' + escapeHtml(entry.item.product) + '</div>' +
            '<div class="idea-meta"><span class="idea-badge">' + escapeHtml(entry.category) + '</span><span class="idea-badge soft">Acak</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="idea-desc">' + escapeHtml(entry.item.detail) + '</div>' +
        '<div class="idea-actions"><button class="btn btn-primary" type="button">Gunakan Ide Ini</button></div>';
      const btn = card.querySelector("button");
      if (btn) btn.addEventListener("click", () => applyPageIdea(entry.item));
      pageIdeasList.appendChild(card);
    }

    function openPageIdeasModal() {
      if (!pageIdeasModal) return;
      pageIdeasModal.hidden = false;
      pageIdeasModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      renderPageIdeas(pageIdeasCategory ? pageIdeasCategory.value : "");
    }

    function closePageIdeasModal() {
      if (!pageIdeasModal) return;
      pageIdeasModal.hidden = true;
      pageIdeasModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }

    function showErr(idSel) {
      const el = $p(idSel);
      if (!el) return;
      el.classList.add("show");
      setTimeout(() => el.classList.remove("show"), 3000);
    }

    function validateStep(n) {
      if (n === 1) {
        const v = String($p("#pageInputProduct").value || "").trim();
        if (v.length < 2) { showErr("#pageErrProduct"); return false; }
        s.product = v; save(); return true;
      }
      if (n === 2) {
        const v = String($p("#pageInputDetail").value || "").trim();
        if (v.length < 8) { showErr("#pageErrDetail"); return false; }
        s.detail = v; save(); return true;
      }
      if (n === 3) {
        if (!s.goal) { showErr("#pageErrGoal"); return false; }
        return true;
      }
      if (n === 4) {
        if (!s.framework) { showErr("#pageErrFramework"); return false; }
        return true;
      }
      return true;
    }

    function markGoal(goal) {
      $$p("#pageGoalGrid .option").forEach((o) => o.classList.toggle("selected", o.dataset.goal === goal));
    }

    function decorateFrameworkCards() {
      $$p("#pageFrameworkGrid .framework-card").forEach((card) => {
        const unlocked = isPageFrameworkUnlocked(card.dataset.framework);
        card.classList.toggle("locked", !unlocked);
        card.setAttribute("aria-disabled", unlocked ? "false" : "true");
        if (!unlocked && !card.querySelector(".lock-badge")) {
          const badge = document.createElement("span");
          badge.className = "lock-badge";
          badge.textContent = "Upgrade";
          card.appendChild(badge);
        }
        if (!unlocked) card.title = "Klik untuk upgrade";
      });
    }

    function markFramework(framework, reason) {
      const key = String(framework || "").toLowerCase();
      if (key && !isPageFrameworkUnlocked(key)) {
        openUpgradePage("Model ini tersedia setelah upgrade.");
        return false;
      }
      s.framework = PAGE_FRAMEWORKS[key] ? key : "";
      if (typeof reason === "string") s.frameworkReason = reason;
      $$p("#pageFrameworkGrid .framework-card").forEach((card) => {
        const unlocked = isPageFrameworkUnlocked(card.dataset.framework);
        card.classList.toggle("selected", unlocked && card.dataset.framework === s.framework);
      });
      const err = $p("#pageErrFramework");
      if (err && s.framework) err.classList.remove("show");
      save();
      return true;
    }

    function markAi(ai) {
      const v = String(ai || "").toLowerCase();
      const allowed = ["claude", "deepseek"];
      s.ai = allowed.includes(v) ? v : "claude";
      $$p("#pageAiGrid .ai-card").forEach((c) => {
        const on = c.dataset.ai === s.ai;
        c.classList.toggle("selected", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      save();
    }

    function renderGuide(targetSel) {
      const aiLabel = s.ai === "deepseek" ? "DeepSeek" : "Claude";
      const aiBenefit = s.ai === "deepseek"
        ? "Cepat untuk iterasi angle/copy dan output code."
        : "Kuat untuk copy premium + struktur yang rapi.";
      const fw = PAGE_FRAMEWORKS[s.framework] || null;
      renderStaticGuide(targetSel, "Panduan Produksi (Salespage)", {
        cocok: fw ? (fw.label + " · " + fw.fit) : "Model starter: AIDA, PAS, BAB, 4P",
        ai: aiLabel + " — " + aiBenefit,
        butuh: "AI pilihan + ZIP",
        deploy: "Netlify · Scalev · cPanel"
      }, [
        "Pilih model yang terbuka: AIDA, PAS, BAB, atau 4P",
        "Pilih AI produksi (Claude atau DeepSeek)",
        "Tempel Prompt Offer Strategist → dapatkan positioning, target market, angle",
        "Tempel Prompt Copywriter Architect → dapatkan headline, copy, CTA, FAQ",
        "Tempel Prompt Salespage Developer → minta output project + ZIP siap deploy",
        "Download ZIP → simpan sebagai arsip",
        "Deploy Netlify (upload folder/ZIP) atau Scalev (upload ZIP) atau cPanel (upload ZIP → extract)",
        "Buka URL → salespage online",
        "Upgrade paket jika ingin membuka model salespage lainnya"
      ]);
    }

    const thinkingLines = [
      "Membaca detail produk/jasa...",
      "Menyusun positioning dan target market...",
      "Mencari angle jualan yang paling kuat...",
      "Menyiapkan struktur salespage...",
      "Selesai. Siap generate prompt."
    ];

    function buildReviewBlocks() {
      const product = escapeHtml(s.product || "produk/jasa");
      const framework = PAGE_FRAMEWORKS[s.framework] || PAGE_FRAMEWORKS.aida;
      const blocks = [
        { icon: "🎯", title: "Tujuan", text: "Salespage difokuskan untuk: " + escapeHtml(s.goal || "—") + "." },
        { icon: "🧩", title: "Framework Terpilih", text: framework.label + " — " + framework.flow + ". " + (s.frameworkReason || "Framework ini akan menjadi tulang punggung urutan section dan alur penjualannya.") },
        { icon: "🧠", title: "Positioning Draft", text: "Bantu calon pembeli paham hasil yang mereka dapat dari " + product + " dalam 5 detik pertama." },
        { icon: "📌", title: "Angle Cepat", text: "Gunakan 1 angle utama + 2 angle pendukung agar copy lebih tajam dan tidak generik." },
        { icon: "💬", title: "CTA Utama", text: "Sediakan CTA WhatsApp dengan pesan otomatis agar pengguna tinggal klik dan kirim." }
      ];

      const wrap = $p("#pageReviewBlocks");
      if (!wrap) return;
      wrap.innerHTML = "";
      blocks.forEach((b, idx) => {
        const div = document.createElement("div");
        div.className = "review-block";
        div.style.animationDelay = (idx * 0.06) + "s";
        div.innerHTML =
          '<h4><span class="rb-ic">' + iconSvg(b.icon) + "</span>" + escapeHtml(b.title) + "</h4>" +
          "<p>" + escapeHtml(b.text) + "</p>";
        wrap.appendChild(div);
      });
    }

    function runAIReview() {
      const thinkingEl = $p("#pageAiThinking");
      const reviewEl = $p("#pageAiReview");
      const labelEl = $p("#pageThinkingLabel");
      if (!thinkingEl || !reviewEl || !labelEl) return;

      thinkingEl.hidden = false;
      reviewEl.hidden = true;

      let i = 0;
      labelEl.textContent = thinkingLines[0];
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const interval = reduce ? 120 : 520;
      const ticker = setInterval(() => {
        i++;
        if (i >= thinkingLines.length) {
          clearInterval(ticker);
          buildReviewBlocks();
          thinkingEl.hidden = true;
          reviewEl.hidden = false;
          return;
        }
        labelEl.textContent = thinkingLines[i];
      }, interval);
    }

    function generatePrompts() {
      s.generated.offer = promptPageOfferStrategist(s);
      s.generated.copy = promptPageCopywriterArchitect(s);
      s.generated.dev = promptPageDeveloper(s);

      $p("#pageOutOffer").textContent = s.generated.offer;
      $p("#pageOutCopy").textContent = s.generated.copy;
      $p("#pageOutDev").textContent = s.generated.dev;

      const aiLabel = s.ai === "deepseek" ? "DeepSeek" : "Claude";
      const framework = PAGE_FRAMEWORKS[s.framework] || PAGE_FRAMEWORKS.aida;
      $p("#pageResultMeta").innerHTML =
        '<span class="meta-chip">' + iconSvg("🧾") + ' <b>' + escapeHtml(s.product) + "</b></span>" +
        '<span class="meta-chip">' + iconSvg("🎯") + ' <b>' + escapeHtml(s.goal || "—") + "</b></span>" +
        '<span class="meta-chip">' + iconSvg("🧩") + ' <b>' + escapeHtml(framework.label) + "</b></span>" +
        '<span class="meta-chip">' + iconSvg("🤖") + ' <b>' + escapeHtml(aiLabel) + "</b></span>";

      renderGuide("#pageGuideBoxResult");

      const result = $p("#pageResult");
      result.hidden = false;
      setTimeout(() => {
        const y = result.getBoundingClientRect().top + window.scrollY - 10;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 60);
      playSuccessSound();
    }

    function shareWhatsApp() {
      const msg = "Saya baru bikin super prompt salespage \"" + (s.product || "produk saya") +
        "\" pakai " + BRAND_NAME + " dengan framework " + ((PAGE_FRAMEWORKS[s.framework] || PAGE_FRAMEWORKS.aida).label) +
        "! Copy + struktur + ZIP siap deploy. Coba juga ya.";
      window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
    }

    function restart() {
      const result = $p("#pageResult");
      if (result) result.hidden = true;
      goTo(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    $$p("[data-next]").forEach((b) => b.addEventListener("click", () => {
      if (validateStep(s.step)) goTo(s.step + 1);
    }));
    $$p("[data-prev]").forEach((b) => b.addEventListener("click", () => goTo(Math.max(1, s.step - 1))));

    $p("#pageInputProduct").addEventListener("input", (e) => { s.product = e.target.value; });
    $p("#pageInputDetail").addEventListener("input", (e) => { s.detail = e.target.value; });

    $$p("#pageGoalGrid .option").forEach((o) => o.addEventListener("click", () => {
      s.goal = o.dataset.goal;
      markGoal(s.goal);
      save();
      const err = $p("#pageErrGoal");
      if (err) err.classList.remove("show");
    }));

    $$p("#pageFrameworkGrid .framework-card").forEach((card) => card.addEventListener("click", () => {
      if (markFramework(card.dataset.framework, "")) renderGuide("#pageGuideBox");
    }));

    $$p("#pageAiGrid .ai-card").forEach((c) => c.addEventListener("click", () => {
      markAi(c.dataset.ai);
      renderGuide("#pageGuideBox");
    }));

    $p("#pageToFrameworkBtn").addEventListener("click", () => {
      if (!validateStep(3)) return;
      goTo(4);
    });

    $p("#pageToReviewBtn").addEventListener("click", () => {
      if (!validateStep(4)) return;
      goTo(5);
      runAIReview();
    });

    $p("#pageToGenerateBtn").addEventListener("click", () => {
      goTo(6);
      renderGuide("#pageGuideBox");
    });

    $p("#pageGenerateBtn").addEventListener("click", () => generatePrompts());

    $$p("[data-copy]").forEach((b) => b.addEventListener("click", () => {
      const key = b.dataset.copy;
      const map = { offer: s.generated.offer, copy: s.generated.copy, dev: s.generated.dev };
      copyText(map[key] || "", b);
    }));

    $p("#pageShareWa").addEventListener("click", shareWhatsApp);
    $p("#pageRestartBtn").addEventListener("click", restart);

    if (pageIdeasCategory) {
      pageIdeasCategory.innerHTML = ['<option value="">Semua Kategori</option>'].concat(
        Object.keys(PAGE_IDEAS).map((key) => '<option value="' + escapeHtml(key) + '">' + escapeHtml(key) + '</option>')
      ).join("");
      pageIdeasCategory.addEventListener("change", () => renderPageIdeas(pageIdeasCategory.value));
    }
    if (pageIdeasRandomBtn) {
      pageIdeasRandomBtn.addEventListener("click", () => {
        renderRandomPageIdea();
      });
    }
    if (pageIdeasResetBtn) {
      pageIdeasResetBtn.addEventListener("click", () => {
        if (pageIdeasCategory) pageIdeasCategory.value = "";
        renderPageIdeas("");
      });
    }
    ["#pageIdeasBtn", "#pageIdeasBtnDetail"].forEach((sel) => {
      const btn = $p(sel);
      if (btn) btn.addEventListener("click", openPageIdeasModal);
    });
    $$("[data-page-ideas-close]").forEach((btn) => btn.addEventListener("click", closePageIdeasModal));

    const advisorBox = $p("#pageAdvisorBox");
    const advisorResult = $p("#pageAdvisorResult");
    const advisorProduct = $p("#pageAdvisorProduct");
    const advisorAudience = $p("#pageAdvisorAudience");
    const advisorPrice = $p("#pageAdvisorPrice");
    const advisorAwareness = $p("#pageAdvisorAwareness");
    const recommendBtn = $p("#pageRecommendFrameworkBtn");
    const advisorCloseBtn = $p("#pageAdvisorCloseBtn");
    const advisorRunBtn = $p("#pageAdvisorRunBtn");

    if (recommendBtn && advisorBox) {
      recommendBtn.addEventListener("click", () => {
        advisorBox.hidden = false;
        if (advisorProduct && !advisorProduct.value) advisorProduct.value = s.product;
        if (advisorAudience) advisorAudience.focus();
      });
    }
    if (advisorCloseBtn && advisorBox) {
      advisorCloseBtn.addEventListener("click", () => {
        advisorBox.hidden = true;
        if (advisorResult) advisorResult.hidden = true;
      });
    }
    if (advisorRunBtn && advisorProduct && advisorAudience && advisorPrice && advisorAwareness && advisorResult) {
      advisorRunBtn.addEventListener("click", () => {
        const rec = recommendPageFramework({
          product: advisorProduct.value || s.product,
          audience: advisorAudience.value,
          price: advisorPrice.value,
          awareness: advisorAwareness.value
        });
        const targetFramework = isPageFrameworkUnlocked(rec.framework) ? rec.framework : getFrameworkFallback(rec.framework);
        const fw = PAGE_FRAMEWORKS[targetFramework] || PAGE_FRAMEWORKS.aida;
        const reason = isPageFrameworkUnlocked(rec.framework)
          ? rec.reason
          : (rec.reason + " Versi saat ini membuka model starter, jadi kami arahkan ke " + fw.label + ".");
        markFramework(targetFramework, reason);
        advisorResult.innerHTML =
          '<strong>Kami merekomendasikan ' + escapeHtml(fw.label) + '</strong>' +
          '<p>' + escapeHtml(reason) + '</p>' +
          '<p>Cocok untuk: ' + escapeHtml(fw.fit) + '</p>';
        advisorResult.hidden = false;
        renderGuide("#pageGuideBox");
      });
    }

    load();
    decorateFrameworkCards();
    renderGuide("#pageGuideBox");
    goTo(1, false);
  }

  function promptFormStrategist(s) {
    const typeLabel = {
      kontak: "Form Kontak",
      booking: "Form Booking / Reservasi",
      registrasi: "Form Registrasi",
      survey: "Form Survey",
      order: "Form Order / Pemesanan",
      webinar: "Form Webinar",
      lead: "Form Lead / Konsultasi",
      lamaran: "Form Submit Application"
    }[s.type] || "Form";

    const fieldLabels = {
      nama: "Nama",
      wa: "No WhatsApp",
      email: "Email",
      kota: "Kota",
      alamat: "Alamat",
      perusahaan: "Perusahaan",
      jabatan: "Jabatan",
      kebutuhan: "Kebutuhan",
      tanggal: "Tanggal",
      jam: "Jam",
      jumlah: "Jumlah",
      catatan: "Catatan"
    };
    const customFields = String(s.customFields || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const selectedFields = (s.fields || []).map((k) => fieldLabels[k] || k).concat(customFields);
    const fieldsText = selectedFields.length ? selectedFields.join(", ") : "—";

    const pixel = s.integrations?.pixel || {};
    const wa = s.integrations?.wa || {};
    const sheet = s.integrations?.sheet || {};
    const pixelEvent = pixel.event === "Custom" ? (pixel.customEvent || "Custom") : (pixel.event || "—");
    const waRecipients = []
      .concat(wa.toAdmin ? ["Admin"] : [])
      .concat(wa.toUser ? ["Pengisi Form"] : []);
    const integrationsText = [
      pixel.enabled ? ("Pixel: " + (pixel.id || "—") + " · Event: " + pixelEvent) : "Pixel: off",
      wa.enabled ? ("WhatsApp: on · Penerima: " + (waRecipients.join(", ") || "—")) : "WhatsApp: off",
      sheet.enabled ? ("Spreadsheet: on · Apps Script URL: " + (sheet.appsScriptUrl || "—")) : "Spreadsheet: off"
    ].join(" | ");

    return `Kamu adalah Form Strategist untuk Form Builder. Filosofi: Ready to Use.

=== INPUT ===
Jenis form: ${typeLabel}
Tujuan form: ${s.purpose}
Field yang dibutuhkan: ${fieldsText}
Integrasi bisnis (opsional): ${integrationsText}

=== TUGAS ===
1) Finalisasi daftar field (wajib vs opsional) dari input di atas. Jika ada field yang kurang penting, sarankan untuk dipindah jadi opsional agar friksi rendah.
2) Validasi yang relevan untuk bisnis Indonesia (WA/Email/angka/tanggal), lengkap dengan contoh error message yang ramah.
3) Strategi konversi: CTA, microcopy, dan urutan field agar tingkat submit tinggi.
4) Strategi operasional: apa yang admin butuhkan untuk follow up cepat (mis. ringkasan data, format yang rapi).
5) Jika integrasi diaktifkan, tulis rekomendasi eksekusi:
   - Spreadsheet: mapping kolom dan format data.
   - WhatsApp: template pesan Admin dan Pengisi Form (pakai variabel {{nama}}, {{wa}}, {{email}} dan field tambahan).
   - Pixel: validasi pemilihan event agar sesuai tipe form.
6) State: loading, error, success. Prinsip wajib: kalau salah satu integrasi gagal, submit form tetap sukses dan proses lanjut.

ATURAN
- Bahasa Indonesia, ringkas, fokus kegunaan.
- Jangan tulis kode.`;
  }

  function promptFormArchitect(s) {
    const typeLabel = {
      kontak: "Form Kontak",
      booking: "Form Booking / Reservasi",
      registrasi: "Form Registrasi",
      survey: "Form Survey",
      order: "Form Order / Pemesanan",
      webinar: "Form Webinar",
      lead: "Form Lead / Konsultasi",
      lamaran: "Form Submit Application"
    }[s.type] || "Form";

    const fieldLabels = {
      nama: "Nama",
      wa: "No WhatsApp",
      email: "Email",
      kota: "Kota",
      alamat: "Alamat",
      perusahaan: "Perusahaan",
      jabatan: "Jabatan",
      kebutuhan: "Kebutuhan",
      tanggal: "Tanggal",
      jam: "Jam",
      jumlah: "Jumlah",
      catatan: "Catatan"
    };
    const customFields = String(s.customFields || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const selectedFields = (s.fields || []).map((k) => fieldLabels[k] || k).concat(customFields);
    const fieldsText = selectedFields.length ? selectedFields.join(", ") : "—";

    const pixel = s.integrations?.pixel || {};
    const wa = s.integrations?.wa || {};
    const sheet = s.integrations?.sheet || {};
    const pixelEvent = pixel.event === "Custom" ? (pixel.customEvent || "Custom") : (pixel.event || "—");
    const waRecipients = []
      .concat(wa.toAdmin ? ["Admin"] : [])
      .concat(wa.toUser ? ["Pengisi Form"] : []);
    const integrationsText = [
      pixel.enabled ? ("Pixel: " + (pixel.id || "—") + " · Event: " + pixelEvent) : "Pixel: off",
      wa.enabled ? ("WhatsApp: on · Penerima: " + (waRecipients.join(", ") || "—")) : "WhatsApp: off",
      sheet.enabled ? ("Spreadsheet: on") : "Spreadsheet: off"
    ].join(" | ");

    return `Kamu adalah Form Architect untuk Form Builder. Filosofi: Ready to Use.

=== INPUT ===
Jenis form: ${typeLabel}
Tujuan form: ${s.purpose}
Field yang dibutuhkan: ${fieldsText}
Integrasi bisnis (opsional): ${integrationsText}

=== OUTPUT WAJIB ===
1) STRUKTUR HALAMAN
- Header, deskripsi, form, dan halaman sukses

2) SPEC FIELD
Untuk setiap field: key data (mis. nama/wa/email), label, tipe input, placeholder, required, validasi, error message.

3) FLOW SUBMIT
- Urutan proses saat submit:
  1. Validasi data
  2. Simpan ke Spreadsheet via Apps Script (jika aktif)
  3. Trigger Facebook Pixel Event (jika aktif)
  4. Kirim WhatsApp Admin (jika aktif)
  5. Kirim WhatsApp Pengisi Form (jika aktif)
  6. Tampilkan halaman sukses
- Prinsip fail-soft: jika satu integrasi gagal, proses berikutnya tetap jalan dan submit tidak dianggap gagal.
- Catat error (log) dengan aman (tanpa membocorkan token).

4) INTEGRASI (BLUEPRINT)
- Facebook Pixel: cara memanggil event pada submit sukses, termasuk Custom Event.
- WhatsApp (Fonnte): definisikan placeholder variabel, penerima, dan format pesan.
- Spreadsheet: definisikan schema kolom dan payload yang dikirim ke Apps Script Web App.

5) ACCESSIBILITY
- Label terkait input, fokus state, pesan error jelas

ATURAN
- Jangan tulis kode HTML/CSS/JS. Ini blueprint.`;
  }

  function promptFormDeveloper(s) {
    const typeLabel = {
      kontak: "Form Kontak",
      booking: "Form Booking / Reservasi",
      registrasi: "Form Registrasi",
      survey: "Form Survey",
      order: "Form Order / Pemesanan",
      webinar: "Form Webinar",
      lead: "Form Lead / Konsultasi",
      lamaran: "Form Submit Application"
    }[s.type] || "Form";

    const fieldLabels = {
      nama: "Nama",
      wa: "No WhatsApp",
      email: "Email",
      kota: "Kota",
      alamat: "Alamat",
      perusahaan: "Perusahaan",
      jabatan: "Jabatan",
      kebutuhan: "Kebutuhan",
      tanggal: "Tanggal",
      jam: "Jam",
      jumlah: "Jumlah",
      catatan: "Catatan"
    };
    const customFields = String(s.customFields || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const selectedFields = (s.fields || []).map((k) => fieldLabels[k] || k).concat(customFields);
    const fieldsText = selectedFields.length ? selectedFields.join(", ") : "—";

    const pixel = s.integrations?.pixel || {};
    const wa = s.integrations?.wa || {};
    const sheet = s.integrations?.sheet || {};
    const pixelEvent = pixel.event === "Custom" ? (pixel.customEvent || "Custom") : (pixel.event || "");
    const waRecipients = []
      .concat(wa.toAdmin ? ["Admin"] : [])
      .concat(wa.toUser ? ["Pengisi Form"] : []);
    const useBackend = !!(wa.enabled || sheet.enabled);
    const integrationsText = [
      pixel.enabled ? ("Facebook Pixel: on (" + (pixel.id || "—") + " / " + (pixelEvent || "—") + ")") : "Facebook Pixel: off",
      wa.enabled ? ("WhatsApp Fonnte: on (Penerima: " + (waRecipients.join(", ") || "—") + ")") : "WhatsApp Fonnte: off",
      sheet.enabled ? ("Spreadsheet Apps Script: on (" + (sheet.appsScriptUrl || "—") + ")") : "Spreadsheet Apps Script: off"
    ].join(" | ");

    return `Kamu adalah Form Developer senior untuk Form Builder.

Tujuanmu: bangun ${typeLabel} sebagai "Business Automation Engine" yang mobile-first, premium, dan siap deploy sebagai ZIP.

=== INPUT ===
Tujuan form: ${s.purpose}
Field yang dibutuhkan: ${fieldsText}
Integrasi bisnis (opsional): ${integrationsText}

=== STACK WAJIB ===
- HTML, CSS, JavaScript murni (tanpa framework, tanpa build process).
- Tidak ada Node.js, npm, terminal, Vite, React, Vue.
- PHP boleh digunakan jika diperlukan untuk endpoint backend (mis. menyimpan token Fonnte agar tidak bocor).

=== FITUR WAJIB ===
- Validasi ramah + error message jelas
- Success state yang meyakinkan
- Alur saat form dikirim (WAJIB):
  1) Validasi data
  2) Simpan ke Google Spreadsheet via Google Apps Script Web App (jika aktif)
  3) Trigger Facebook Pixel Event (jika aktif)
  4) Kirim WhatsApp ke Admin via Fonnte (jika aktif)
  5) Kirim WhatsApp ke Pengisi Form via Fonnte (jika aktif)
  6) Tampilkan halaman sukses
- Fail-soft: jika salah satu integrasi gagal, jangan menggagalkan submit. Catat error dan lanjutkan proses berikutnya.
- Tidak ada error console

=== OUTPUT ===
Berikan kode lengkap untuk file:
project/
├── index.html
├── style.css
└── script.js
${useBackend ? "├── api/\\n│   └── submit.php\\n" : ""}└── apps-script/
    └── Code.gs

=== GOOGLE APPS SCRIPT (WAJIB JIKA SPREADSHEET AKTIF) ===
Berikan:
1) Template Code.gs lengkap untuk menerima POST JSON dan menulis ke Google Spreadsheet.
2) Panduan langkah demi langkah:
   - Buka script.google.com
   - Paste Code.gs
   - Buat/siapkan Spreadsheet dan pastikan header kolom sesuai field
   - Deploy sebagai Web App (Execute as: Me, Who has access: Anyone)
   - Salin Web App URL dan pakai sebagai endpoint

=== WHATSAPP (FONNTE) (WAJIB JIKA AKTIF) ===
- Jangan expose token di front-end.
- Gunakan endpoint backend (PHP) sebagai proxy untuk call API Fonnte.
- Dukung penerima Admin dan Pengisi Form, dengan template default:
Admin:
${wa.templateAdmin || "Ada data masuk baru.\\n\\nNama: {{nama}}\\nNo WA: {{wa}}\\nEmail: {{email}}\\n\\nSilakan segera follow up."}
Pengisi Form:
${wa.templateUser || "Terima kasih, {{nama}}.\\n\\nData Anda sudah kami terima.\\nTim kami akan segera menghubungi Anda."}

=== PANDUAN DEPLOY (WAJIB DITULIS DI BAGIAN AKHIR OUTPUT) ===
Jika hanya static (tanpa backend):
1) Netlify (prioritas)
2) Scalev
3) cPanel File Manager (upload ZIP → extract)

Jika pakai integrasi Spreadsheet/Fonnte (butuh endpoint backend):
1) cPanel (default): upload project + api/submit.php, atur config, tes endpoint
2) Opsi tambahan: Scalev jika kompatibel untuk PHP
3) Alternatif lanjutan (opsional): webhook/serverless (bukan jalur utama)

Jangan menjadikan Docker/SSH/VPS/Vercel sebagai jalur utama.`;
  }

  function setupFormModule() {
    const root = document.querySelector('[data-suite-module="form"]');
    if (!root) return;

    const STORE_KEY_FORM = "nexla_form_v2";
    const s = {
      step: 1,
      type: "",
      purpose: "",
      fields: [],
      customFields: "",
      integrations: {
        pixel: { enabled: false, id: "", event: "", customEvent: "" },
        wa: {
          enabled: false,
          token: "",
          toAdmin: true,
          toUser: true,
          templateAdmin: "Ada data masuk baru.\n\nNama: {{nama}}\nNo WA: {{wa}}\nEmail: {{email}}\n\nSilakan segera follow up.",
          templateUser: "Terima kasih, {{nama}}.\n\nData Anda sudah kami terima.\nTim kami akan segera menghubungi Anda.",
          status: "disconnected",
          lastMessage: "",
          lastTestAt: 0
        },
        sheet: { enabled: false, appsScriptUrl: "", status: "disconnected", lastMessage: "", lastTestAt: 0 }
      },
      ai: "claude",
      generated: { strategy: "", arch: "", dev: "" }
    };

    const $f = (sel) => root.querySelector(sel);
    const $$f = (sel) => Array.from(root.querySelectorAll(sel));
    const formIdeasModal = $("#formIdeasModal");
    const formIdeasList = $("#formIdeasList");
    const formIdeasCategory = $("#formIdeasCategory");
    const formIdeasRandomBtn = $("#formIdeasRandomBtn");
    const formIdeasResetBtn = $("#formIdeasResetBtn");

    function isFormIntegrationUnlocked(key) {
      return FORM_UNLOCKED_INTEGRATIONS.includes(String(key || "").toLowerCase());
    }

    function save() {
      try {
        localStorage.setItem(STORE_KEY_FORM, JSON.stringify({
          type: s.type,
          purpose: s.purpose,
          fields: s.fields,
          customFields: s.customFields,
          integrations: {
            pixel: {
              enabled: !!s.integrations.pixel.enabled,
              id: s.integrations.pixel.id,
              event: s.integrations.pixel.event,
              customEvent: s.integrations.pixel.customEvent
            },
            wa: {
              enabled: !!s.integrations.wa.enabled,
              toAdmin: !!s.integrations.wa.toAdmin,
              toUser: !!s.integrations.wa.toUser,
              templateAdmin: s.integrations.wa.templateAdmin,
              templateUser: s.integrations.wa.templateUser,
              status: s.integrations.wa.status,
              lastMessage: s.integrations.wa.lastMessage,
              lastTestAt: s.integrations.wa.lastTestAt
            },
            sheet: {
              enabled: !!s.integrations.sheet.enabled,
              appsScriptUrl: s.integrations.sheet.appsScriptUrl,
              status: s.integrations.sheet.status,
              lastMessage: s.integrations.sheet.lastMessage,
              lastTestAt: s.integrations.sheet.lastTestAt
            }
          },
          ai: s.ai
        }));
      } catch (e) { }
    }

    function load() {
      try {
        const raw = localStorage.getItem(STORE_KEY_FORM);
        if (!raw) return;
        const d = JSON.parse(raw);
        if (d.type) { s.type = d.type; $f("#formType").value = d.type; }
        if (d.purpose) { s.purpose = d.purpose; $f("#formPurpose").value = d.purpose; }
        if (Array.isArray(d.fields)) { s.fields = d.fields; }
        if (typeof d.customFields === "string") { s.customFields = d.customFields; }
        if (d.integrations?.pixel) {
          s.integrations.pixel.enabled = isFormIntegrationUnlocked("pixel") && !!d.integrations.pixel.enabled;
          s.integrations.pixel.id = d.integrations.pixel.id || "";
          s.integrations.pixel.event = d.integrations.pixel.event || "";
          s.integrations.pixel.customEvent = d.integrations.pixel.customEvent || "";
        }
        if (d.integrations?.wa) {
          s.integrations.wa.enabled = !!d.integrations.wa.enabled;
          s.integrations.wa.toAdmin = d.integrations.wa.toAdmin !== false;
          s.integrations.wa.toUser = d.integrations.wa.toUser !== false;
          if (typeof d.integrations.wa.templateAdmin === "string") s.integrations.wa.templateAdmin = d.integrations.wa.templateAdmin;
          if (typeof d.integrations.wa.templateUser === "string") s.integrations.wa.templateUser = d.integrations.wa.templateUser;
          s.integrations.wa.status = d.integrations.wa.status || "disconnected";
          s.integrations.wa.lastMessage = d.integrations.wa.lastMessage || "";
          s.integrations.wa.lastTestAt = d.integrations.wa.lastTestAt || 0;
        }
        if (d.integrations?.sheet) {
          s.integrations.sheet.enabled = isFormIntegrationUnlocked("sheet") && !!d.integrations.sheet.enabled;
          s.integrations.sheet.appsScriptUrl = d.integrations.sheet.appsScriptUrl || "";
          s.integrations.sheet.status = d.integrations.sheet.status || "disconnected";
          s.integrations.sheet.lastMessage = d.integrations.sheet.lastMessage || "";
          s.integrations.sheet.lastTestAt = d.integrations.sheet.lastTestAt || 0;
        }
        if (d.ai) { s.ai = d.ai; markAi(d.ai); }
      } catch (e) { }
    }

    function goTo(n, doScroll) {
      s.step = n;
      $$f(".wizard-panel").forEach((p) => p.classList.toggle("active", +p.dataset.step === n));
      const fill = $f("#formProgressFill");
      if (fill) fill.style.width = (n / 6 * 100) + "%";
      $$f(".pstep").forEach((el) => {
        const p = +el.dataset.p;
        el.classList.toggle("active", p === n);
        el.classList.toggle("done", p < n);
      });
      if (doScroll !== false) {
        const w = $f("#form-wizard");
        if (w) {
          const y = w.getBoundingClientRect().top + window.scrollY - 12;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }

    function showErr(idSel) {
      const el = $f(idSel);
      if (!el) return;
      el.classList.add("show");
      setTimeout(() => el.classList.remove("show"), 3000);
    }

    const FIELD_LABELS = {
      nama: "Nama",
      wa: "No WhatsApp",
      email: "Email",
      kota: "Kota",
      alamat: "Alamat",
      perusahaan: "Perusahaan",
      jabatan: "Jabatan",
      kebutuhan: "Kebutuhan",
      tanggal: "Tanggal",
      jam: "Jam",
      jumlah: "Jumlah",
      catatan: "Catatan"
    };

    function normalizeListLines(text) {
      return String(text || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    }

    function getSelectedFieldsText() {
      const custom = normalizeListLines(s.customFields);
      const chosen = (s.fields || []).map((k) => FIELD_LABELS[k] || k).concat(custom);
      return chosen;
    }

    function slugifyFieldKey(label, used) {
      const base = String(label || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "field";
      let key = base;
      let i = 2;
      while (used.has(key)) {
        key = base + "_" + i;
        i++;
      }
      used.add(key);
      return key;
    }

    function getFieldSchema() {
      const used = new Set(Object.keys(FIELD_LABELS));
      const schema = [];
      (s.fields || []).forEach((k) => {
        const key = String(k || "").trim();
        if (!key) return;
        schema.push({ key: key, label: FIELD_LABELS[key] || key });
        used.add(key);
      });
      normalizeListLines(s.customFields).forEach((label) => {
        const key = slugifyFieldKey(label, used);
        schema.push({ key: key, label: label });
      });
      return schema;
    }

    function buildAppsScriptCode(schema) {
      const sheetName = "FormPay";
      const schemaArr = Array.isArray(schema) ? schema : [];
      const knownKeys = schemaArr.map((f) => String(f.key || "").trim()).filter(Boolean);
      const headerKeys = ["timestamp"].concat(knownKeys);
      const headerKeysJson = JSON.stringify(headerKeys);
      const sheetNameJson = JSON.stringify(sheetName);

      return `function doPost(e) {
  try {
    var body = {};
    try {
      body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    } catch (err) {
      body = {};
    }

    if (body && body.data && typeof body.data === "object" && !Array.isArray(body.data)) {
      body = body.data;
    }

    if (body && typeof body === "object" && !Array.isArray(body)) {
      if (!body.timestamp) {
        body.timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      }
    } else {
      body = { timestamp: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss") };
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      var props = PropertiesService.getScriptProperties();
      var sheetId = props.getProperty("SHEET_ID");
      if (!sheetId) {
        ss = SpreadsheetApp.create("AI Jadi Babu Form Responses");
        sheetId = ss.getId();
        props.setProperty("SHEET_ID", sheetId);
      } else {
        ss = SpreadsheetApp.openById(sheetId);
      }
    }

    var sheet = ss.getSheetByName(${sheetNameJson}) || ss.getSheets()[0];

    var existingHeaders = [];
    try {
      existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0] || [];
    } catch (err) {
      existingHeaders = [];
    }
    existingHeaders = existingHeaders.filter(function (h) { return String(h || "").trim(); });

    var headers = existingHeaders.slice();
    var preset = ${headerKeysJson};
    preset.forEach(function (k) { if (headers.indexOf(k) === -1) headers.push(k); });

    var keys = Object.keys(body || {});
    keys.forEach(function (k) {
      if (headers.indexOf(k) === -1) headers.push(k);
    });

    if (headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }

    var row = headers.map(function (h) {
      var v = body[h];
      if (Array.isArray(v)) return v.join(", ");
      if (v == null) return "";
      if (typeof v === "object") return JSON.stringify(v);
      return String(v);
    });
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false });
  }
}

function doGet(e) {
  var ping = e && e.parameter && String(e.parameter.ping || "") === "1";
  var res = { ok: true, ping: ping };
  var cb = e && e.parameter && e.parameter.callback ? String(e.parameter.callback) : "";
  if (cb) {
    return ContentService.createTextOutput(cb + "(" + JSON.stringify(res) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(res);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}`;
    }

    function syncFieldUI() {
      $$f("#formFieldsGrid .chip").forEach((btn) => {
        const on = (s.fields || []).includes(btn.dataset.field);
        btn.classList.toggle("selected", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      const ta = $f("#formCustomFields");
      if (ta && ta.value !== s.customFields) ta.value = s.customFields || "";
    }

    function applyFormIdea(item) {
      if (!item) return;
      const type = String(item.type || "").trim();
      const purpose = String(item.purpose || "").trim();
      const fields = Array.isArray(item.fields) ? item.fields : [];
      const custom = String(item.customFields || "").trim();

      if (type) {
        s.type = type;
        const sel = $f("#formType");
        if (sel) sel.value = type;
      }
      if (purpose) {
        s.purpose = purpose;
        const ta = $f("#formPurpose");
        if (ta) ta.value = purpose;
      }
      if (fields.length) s.fields = Array.from(new Set(fields));
      if (custom) s.customFields = custom;

      s.integrations.sheet.status = "disconnected";
      s.integrations.sheet.lastMessage = "Template dipakai";
      s.integrations.wa.status = "disconnected";
      s.integrations.wa.lastMessage = "Template dipakai";
      save();
      syncFieldUI();
      syncIntegrationsUI();
      closeFormIdeasModal();
      toast("Template form dipakai. Silakan edit sesuai kebutuhan Anda.");
    }

    function renderFormIdeas(category) {
      if (!formIdeasList) return;
      const keys = Object.keys(FORM_IDEAS);
      const active = category && FORM_IDEAS[category] ? category : "";
      const items = active
        ? FORM_IDEAS[active].map((item) => ({ category: active, item: item }))
        : keys.flatMap((key) => FORM_IDEAS[key].map((item) => ({ category: key, item: item })));

      formIdeasList.innerHTML = "";
      items.forEach((entry) => {
        const card = document.createElement("div");
        card.className = "idea-item";
        card.setAttribute("role", "listitem");
        const typeLabel = {
          kontak: "Kontak",
          booking: "Booking",
          registrasi: "Registrasi",
          survey: "Survey",
          order: "Order",
          webinar: "Webinar",
          lead: "Lead",
          lamaran: "Lamaran"
        }[entry.item.type] || "Form";
        card.innerHTML =
          '<div class="idea-top">' +
            '<div>' +
              '<div class="idea-title">' + escapeHtml(entry.item.title || "Template Form") + '</div>' +
              '<div class="idea-meta"><span class="idea-badge">' + escapeHtml(entry.category) + '</span><span class="idea-badge soft">' + escapeHtml(typeLabel) + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="idea-desc">' + escapeHtml(entry.item.purpose || "") + '</div>' +
          '<div class="idea-actions"><button class="btn btn-primary" type="button">Gunakan Template</button></div>';
        const btn = card.querySelector("button");
        if (btn) btn.addEventListener("click", () => applyFormIdea(entry.item));
        formIdeasList.appendChild(card);
      });
    }

    function openFormIdeasModal() {
      if (!formIdeasModal) return;
      formIdeasModal.hidden = false;
      formIdeasModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      renderFormIdeas(formIdeasCategory ? formIdeasCategory.value : "");
    }

    function closeFormIdeasModal() {
      if (!formIdeasModal) return;
      formIdeasModal.hidden = true;
      formIdeasModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }

    function ensureDefaultFields() {
      if ((s.fields || []).length || normalizeListLines(s.customFields).length) return;
      const defaults = {
        kontak: ["nama", "wa", "email", "kebutuhan"],
        lead: ["nama", "wa", "email", "kebutuhan"],
        booking: ["nama", "wa", "tanggal", "jam"],
        registrasi: ["nama", "wa", "email"],
        webinar: ["nama", "wa", "email"],
        survey: ["nama", "wa", "email", "catatan"],
        order: ["nama", "wa", "alamat", "jumlah"],
        lamaran: ["nama", "wa", "email", "catatan"]
      }[s.type] || ["nama", "wa", "email"];
      s.fields = Array.from(new Set(defaults));
      save();
      syncFieldUI();
    }

    function recommendedPixelEventByType(type) {
      const t = String(type || "").toLowerCase();
      if (t === "webinar" || t === "registrasi") return "CompleteRegistration";
      if (t === "lead") return "Lead";
      if (t === "order") return "Purchase";
      if (t === "lamaran") return "SubmitApplication";
      if (t === "kontak" || t === "booking") return "Contact";
      return "Lead";
    }

    function decorateIntegrationCards() {
      [
        { key: "pixel", selector: "#formPixelToggle", note: "Facebook Pixel tersedia setelah upgrade." },
        { key: "sheet", selector: "#formSheetToggle", note: "Google Spreadsheet tersedia setelah upgrade." },
        { key: "wa", selector: "#formWaToggle", note: "" }
      ].forEach((item) => {
        const toggle = $f(item.selector);
        const card = toggle && toggle.closest ? toggle.closest(".integration-card") : null;
        if (!card) return;
        const unlocked = isFormIntegrationUnlocked(item.key);
        card.classList.toggle("locked", !unlocked);
        card.setAttribute("data-integration-key", item.key);
        if (!unlocked) {
          if (!card.querySelector(".lock-badge")) {
            const badge = document.createElement("span");
            badge.className = "lock-badge";
            badge.textContent = "Upgrade";
            card.appendChild(badge);
          }
          if (!card.querySelector(".upgrade-note")) {
            const note = document.createElement("p");
            note.className = "upgrade-note";
            note.innerHTML = item.note + ' <a href="' + UPGRADE_URL + '" target="_blank" rel="noreferrer">Upgrade di sini</a>.';
            const head = card.querySelector(".integration-head");
            if (head && head.parentNode) head.parentNode.insertBefore(note, head.nextSibling);
          }
          card.title = "Klik untuk upgrade";
        }
      });
    }

    function syncIntegrationsUI() {
      const pixelUnlocked = isFormIntegrationUnlocked("pixel");
      const sheetUnlocked = isFormIntegrationUnlocked("sheet");
      if (!pixelUnlocked) s.integrations.pixel.enabled = false;
      if (!sheetUnlocked) s.integrations.sheet.enabled = false;
      const pixelToggle = $f("#formPixelToggle");
      const pixelBody = $f("#formPixelBody");
      const pixelId = $f("#formPixelId");
      const pixelEvent = $f("#formPixelEvent");
      const pixelCustom = $f("#formPixelCustomEvent");
      const pixelHint = $f("#formPixelHint");

      if (pixelToggle) {
        pixelToggle.checked = pixelUnlocked && !!s.integrations.pixel.enabled;
        pixelToggle.disabled = !pixelUnlocked;
      }
      if (pixelBody) pixelBody.hidden = !(pixelUnlocked && s.integrations.pixel.enabled);
      if (pixelId) pixelId.value = s.integrations.pixel.id || "";
      if (pixelEvent) pixelEvent.value = s.integrations.pixel.event || "";
      if (pixelCustom) {
        const showCustom = pixelUnlocked && s.integrations.pixel.enabled && (s.integrations.pixel.event === "Custom");
        pixelCustom.hidden = !showCustom;
        pixelCustom.value = s.integrations.pixel.customEvent || "";
      }
      if (pixelHint) {
        const rec = recommendedPixelEventByType(s.type);
        const map = {
          webinar: "Form Webinar → CompleteRegistration",
          lead: "Form Lead → Lead",
          order: "Form Order → Purchase",
          kontak: "Form Konsultasi → Contact",
          booking: "Form Konsultasi → Contact"
        };
        const hint = map[s.type] || ("Rekomendasi event: " + rec);
        pixelHint.textContent = hint;
      }

      const waToggle = $f("#formWaToggle");
      const waBody = $f("#formWaBody");
      const waToken = $f("#formFonnteToken");
      const waToAdmin = $f("#formWaToAdmin");
      const waToUser = $f("#formWaToUser");
      const waTplAdmin = $f("#formWaTemplateAdmin");
      const waTplUser = $f("#formWaTemplateUser");
      const waStatus = $f("#formWaStatusBadge");
      const waTestBtn = $f("#formWaTestBtn");

      if (waToggle) {
        waToggle.checked = !!s.integrations.wa.enabled;
        waToggle.disabled = false;
      }
      if (waBody) waBody.hidden = !s.integrations.wa.enabled;
      if (waToken) waToken.value = s.integrations.wa.token || "";
      if (waToAdmin) waToAdmin.checked = !!s.integrations.wa.toAdmin;
      if (waToUser) waToUser.checked = !!s.integrations.wa.toUser;
      if (waTplAdmin) waTplAdmin.value = s.integrations.wa.templateAdmin || "";
      if (waTplUser) waTplUser.value = s.integrations.wa.templateUser || "";
      if (waStatus) {
        const status = s.integrations.wa.status || "disconnected";
        waStatus.classList.remove("ok", "off", "warn");
        waStatus.classList.add(status === "connected" ? "ok" : (status === "error" || status === "testing" ? "warn" : "off"));
        waStatus.textContent =
          status === "connected" ? "Berhasil Terhubung" :
          status === "testing" ? "Menguji..." :
          status === "error" ? "Gagal Terhubung" :
          "Belum Terhubung";
      }
      if (waTestBtn) waTestBtn.disabled = !s.integrations.wa.enabled;

      const sheetToggle = $f("#formSheetToggle");
      const sheetBody = $f("#formSheetBody");
      const sheetUrl = $f("#formAppsScriptUrl");
      const sheetStatus = $f("#formSheetStatusBadge");
      const sheetTestBtn = $f("#formSheetTestBtn");
      const sheetSetupBtn = $f("#formSheetSetupBtn");

      if (sheetToggle) {
        sheetToggle.checked = sheetUnlocked && !!s.integrations.sheet.enabled;
        sheetToggle.disabled = !sheetUnlocked;
      }
      if (sheetBody) sheetBody.hidden = !(sheetUnlocked && s.integrations.sheet.enabled);
      if (sheetUrl) sheetUrl.value = s.integrations.sheet.appsScriptUrl || "";
      if (sheetStatus) {
        const status = s.integrations.sheet.status || "disconnected";
        sheetStatus.classList.remove("ok", "off", "warn");
        sheetStatus.classList.add(status === "connected" ? "ok" : (status === "error" || status === "testing" ? "warn" : "off"));
        sheetStatus.textContent =
          status === "connected" ? "Berhasil Terhubung" :
          status === "testing" ? "Menguji..." :
          status === "error" ? "Gagal Terhubung" :
          "Belum Terhubung";
      }
      if (sheetTestBtn) sheetTestBtn.disabled = !(sheetUnlocked && s.integrations.sheet.enabled);
      if (sheetSetupBtn) sheetSetupBtn.disabled = !(sheetUnlocked && s.integrations.sheet.enabled);
    }

    function validateStep(n) {
      if (n === 1) {
        const v = String($f("#formType").value || "").trim();
        if (!v) { showErr("#formErrType"); return false; }
        s.type = v; save(); return true;
      }
      if (n === 2) {
        const v = String($f("#formPurpose").value || "").trim();
        if (v.length < 8) { showErr("#formErrPurpose"); return false; }
        s.purpose = v; save(); return true;
      }
      if (n === 3) {
        ensureDefaultFields();
        const hasChips = (s.fields || []).length > 0;
        const hasCustom = normalizeListLines(s.customFields).length > 0;
        if (!hasChips && !hasCustom) { showErr("#formErrFields"); return false; }
        save();
        return true;
      }
      if (n === 4) {
        if (s.integrations.pixel.enabled) {
          const id = String($f("#formPixelId")?.value || "").trim();
          const ev = String($f("#formPixelEvent")?.value || "").trim();
          const custom = String($f("#formPixelCustomEvent")?.value || "").trim();
          if (!id || !ev || (ev === "Custom" && !custom)) { showErr("#formErrPixel"); return false; }
        }
        if (s.integrations.wa.enabled) {
          const token = String($f("#formFonnteToken")?.value || "").trim();
          const toAdmin = !!$f("#formWaToAdmin")?.checked;
          const toUser = !!$f("#formWaToUser")?.checked;
          if (!token || (!toAdmin && !toUser)) { showErr("#formErrWa"); return false; }
        }
        if (s.integrations.sheet.enabled) {
          const url = String($f("#formAppsScriptUrl")?.value || "").trim();
          if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(url)) { showErr("#formErrSheet"); return false; }
        }
        save();
        return true;
      }
      return true;
    }

    function markAi(ai) {
      const v = String(ai || "").toLowerCase();
      const allowed = ["claude", "deepseek", "trae"];
      s.ai = allowed.includes(v) ? v : "claude";
      $$f("#formAiGrid .ai-card").forEach((c) => {
        const on = c.dataset.ai === s.ai;
        c.classList.toggle("selected", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      save();
    }

    function setSheetStatus(status, message) {
      s.integrations.sheet.status = status || "disconnected";
      s.integrations.sheet.lastMessage = message || "";
      s.integrations.sheet.lastTestAt = Date.now();
      save();
      syncIntegrationsUI();
    }

    function setWaStatus(status, message) {
      s.integrations.wa.status = status || "disconnected";
      s.integrations.wa.lastMessage = message || "";
      s.integrations.wa.lastTestAt = Date.now();
      save();
      syncIntegrationsUI();
    }

    async function testWaConnection() {
      if (!s.integrations.wa.enabled) return;
      const token = String($f("#formFonnteToken")?.value || "").trim();
      if (!token) {
        showErr("#formErrWa");
        return;
      }
      setWaStatus("testing", "");
      try {
        const resp = await fetch("https://api.fonnte.com/device", {
          method: "POST",
          headers: { Authorization: token }
        });
        const data = await resp.json().catch(() => ({}));
        if (data && data.status === true) {
          const testMessage = "Test Berhasil Connect. Sudah Connect Bosku !";
          let sendResult = "";
          if (data.device) {
            try {
              const body = new URLSearchParams();
              body.set("target", String(data.device));
              body.set("message", testMessage);
              const sendResp = await fetch("https://api.fonnte.com/send", {
                method: "POST",
                headers: { Authorization: token, "Content-Type": "application/x-www-form-urlencoded" },
                body: body.toString()
              });
              const sendData = await sendResp.json().catch(() => ({}));
              const ok = sendData && (sendData.status === true || sendData.status === "true");
              sendResult = ok ? "Pesan test terkirim." : "Pesan test tidak terkirim (token valid).";
            } catch (e) {
              sendResult = "Pesan test tidak terkirim (token valid).";
            }
          }
          setWaStatus("connected", "");
          toast("Koneksi Fonnte berhasil. " + (sendResult || ""));
          playSuccessSound();
          return;
        }
        const reason = data && data.reason ? String(data.reason) : "Token invalid atau device tidak siap";
        setWaStatus("error", reason);
        toast("Koneksi Fonnte gagal. " + reason);
        playErrorSound();
      } catch (e) {
        const msg = String(e && e.message ? e.message : "Gagal terhubung");
        setWaStatus("error", msg);
        toast("Koneksi Fonnte gagal. Jika browser memblokir (CORS), lakukan tes setelah deploy backend.");
        playErrorSound();
      }
    }

    function getAppsScriptPingUrl(execUrl) {
      const url = String(execUrl || "").trim();
      if (!url) return "";
      return url + (url.includes("?") ? "&" : "?") + "ping=1";
    }

    async function testSheetConnection() {
      if (!isFormIntegrationUnlocked("sheet")) {
        openUpgradePage("Integrasi Spreadsheet tersedia setelah upgrade.");
        return;
      }
      if (!s.integrations.sheet.enabled) return;
      const url = String($f("#formAppsScriptUrl")?.value || "").trim();
      if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(url)) {
        showErr("#formErrSheet");
        return;
      }
      setSheetStatus("testing", "");
      const pingUrl = getAppsScriptPingUrl(url);
      try {
        const data = await new Promise((resolve, reject) => {
          const cb = "__nexla_sheet_ping_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2);
          const src = pingUrl + "&callback=" + encodeURIComponent(cb);
          const script = document.createElement("script");
          let done = false;

          function cleanup() {
            if (done) return;
            done = true;
            try { delete window[cb]; } catch (e) { window[cb] = undefined; }
            if (script.parentNode) script.parentNode.removeChild(script);
          }

          const timer = setTimeout(() => {
            cleanup();
            reject(new Error("Timeout"));
          }, 9000);

          window[cb] = (payload) => {
            clearTimeout(timer);
            cleanup();
            resolve(payload);
          };

          script.onerror = () => {
            clearTimeout(timer);
            cleanup();
            reject(new Error("Script load error"));
          };

          script.src = src;
          document.head.appendChild(script);
        });
        if (data && data.ok) {
          setSheetStatus("connected", "");
          toast("Koneksi Spreadsheet berhasil. " + BRAND_NAME + " siap kirim data ke Spreadsheet.");
          playSuccessSound();
          return;
        }
        setSheetStatus("error", "Response tidak valid");
        toast("Koneksi gagal. Pastikan Web App sudah di-deploy sebagai Anyone dan URL benar.");
        playErrorSound();
      } catch (e) {
        setSheetStatus("error", String(e && e.message ? e.message : "Gagal terhubung"));
        toast("Koneksi gagal. Pastikan Web App sudah di-deploy sebagai Anyone dan URL benar.");
        playErrorSound();
      }
    }

    function renderGuide(targetSel) {
      const aiLabel = s.ai === "deepseek" ? "DeepSeek" : (s.ai === "trae" ? "TRAE" : "Claude");
      const aiBenefit = s.ai === "trae"
        ? "Terbaik untuk lanjut edit, debug, dan maintain di IDE."
        : (s.ai === "deepseek" ? "Cepat untuk output code dan iterasi singkat." : "Kuat untuk UX, validasi, dan copy UI yang rapi.");
      const needsBackend = !!s.integrations.wa.enabled;
      const deploy = needsBackend ? "cPanel (default) · Scalev (jika PHP)" : "Netlify · Scalev · cPanel";
      const integrations = [
        s.integrations.wa.enabled ? "WhatsApp" : null,
        "Upgrade untuk Spreadsheet/Pixel"
      ].filter(Boolean);
      renderStaticGuide(targetSel, "Panduan Produksi (Form)", {
        cocok: needsBackend ? "Operasional bisnis sederhana" : "Static HTML/CSS/JS",
        ai: aiLabel + " — " + aiBenefit,
        butuh: "AI pilihan + ZIP",
        deploy: deploy
      }, [
        "Pilih AI produksi (Claude / DeepSeek / TRAE)",
        "Tempel Prompt Form Strategist → finalisasi field, validasi, CTA, dan alur follow-up",
        "Tempel Prompt Form Architect → blueprint UI + flow submit + fail-soft integrasi",
        "Tempel Prompt Form Developer → minta output project + ZIP siap deploy" + (integrations.length ? (" + integrasi (" + integrations.join(", ") + ")") : ""),
        "Download ZIP → simpan sebagai arsip",
        needsBackend
          ? "Deploy default: cPanel (upload ZIP → extract) lalu pastikan endpoint backend berjalan"
          : "Deploy Netlify atau Scalev atau cPanel (upload ZIP → extract)",
        "Buka URL → form online",
        "Upgrade paket jika ingin membuka Google Spreadsheet atau Facebook Pixel"
      ]);

      if (!s.integrations.sheet.enabled) return;
      const host = $f(targetSel);
      if (!host) return;
      const card = host.querySelector(".guide-card");
      if (!card) return;

      const schema = getFieldSchema();
      const code = buildAppsScriptCode(schema);
      const status = s.integrations.sheet.status || "disconnected";

      const extra = document.createElement("div");
      extra.className = "guide-extra";
      const statusText =
        status === "connected" ? "Berhasil Terhubung" :
        status === "testing" ? "Menguji..." :
        status === "error" ? "Gagal Terhubung" :
        "Belum Terhubung";
      const statusClass = status === "connected" ? "ok" : (status === "error" || status === "testing" ? "warn" : "off");

      extra.innerHTML =
        '<div class="guide-extra-head">' +
          '<strong>Google Spreadsheet (Apps Script)</strong>' +
          '<span class="status-pill ' + statusClass + '">' + escapeHtml(statusText) + '</span>' +
        '</div>' +
        '<ol class="guide-steps">' +
          '<li>Buat Spreadsheet baru di docs.google.com/spreadsheets (Blank)</li>' +
          '<li>Extensions → Apps Script (agar script terhubung ke Spreadsheet)</li>' +
          '<li>Klik Salin Kode → paste ke Code.gs (hapus isi lama jika ada)</li>' +
          '<li>Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone)</li>' +
          '<li>Salin Web App URL (…/exec) → paste ke kolom URL di ' + BRAND_NAME + '</li>' +
          '<li>Klik Tes Koneksi → status berubah menjadi Berhasil Terhubung</li>' +
        '</ol>' +
        '<div class="code-wrap">' +
          '<div class="code-actions">' +
            '<button class="btn btn-copy" type="button" data-copy-apps-script>' + iconLabelHtml("📋", "Salin Kode") + '</button>' +
          '</div>' +
          '<pre class="code-block"></pre>' +
        '</div>';

      const pre = extra.querySelector("pre");
      if (pre) pre.textContent = code;
      const copyBtn = extra.querySelector("[data-copy-apps-script]");
      if (copyBtn) copyBtn.addEventListener("click", () => copyText(code, copyBtn));

      card.appendChild(extra);
    }

    const thinkingLines = [
      "Membaca tujuan form...",
      "Menyusun field paling penting untuk follow-up...",
      "Menyiapkan validasi yang ramah...",
      "Mengecek kebutuhan integrasi (Spreadsheet, WhatsApp, Pixel)...",
      "Menyiapkan alur fail-soft agar submit tidak gagal...",
      "Selesai. Siap generate prompt."
    ];

    function buildReviewBlocks() {
      const fields = getSelectedFieldsText();
      const fieldsShort = fields.length ? fields.slice(0, 6).join(", ") + (fields.length > 6 ? "…" : "") : "—";
      const pixel = "Upgrade";
      const wa = s.integrations.wa.enabled ? "Aktif" : "Nonaktif";
      const sheet = "Upgrade";
      const recEvent = recommendedPixelEventByType(s.type);
      const blocks = [
        { icon: "🧩", title: "Field Terpilih", text: "Field ringkas agar cepat diisi di HP. Pilihan Anda: " + fieldsShort + "." },
        { icon: "⚙️", title: "Integrasi", text: "Spreadsheet: " + sheet + " · WhatsApp: " + wa + " · Pixel: " + pixel + (s.integrations.pixel.enabled ? (" (event disarankan: " + recEvent + ")") : "") + "." },
        { icon: "🛡️", title: "Fail-soft", text: "Jika salah satu integrasi gagal, submit tetap sukses. Error dicatat, lalu proses berikutnya lanjut." },
        { icon: "✨", title: "Pengalaman", text: "Pengguna merasa form terkirim; admin langsung siap follow-up karena data rapi dan notifikasi cepat." }
      ];
      const wrap = $f("#formReviewBlocks");
      if (!wrap) return;
      wrap.innerHTML = "";
      blocks.forEach((b, idx) => {
        const div = document.createElement("div");
        div.className = "review-block";
        div.style.animationDelay = (idx * 0.06) + "s";
        div.innerHTML =
          '<h4><span class="rb-ic">' + iconSvg(b.icon) + "</span>" + escapeHtml(b.title) + "</h4>" +
          "<p>" + escapeHtml(b.text) + "</p>";
        wrap.appendChild(div);
      });
    }

    function runAIReview() {
      const thinkingEl = $f("#formAiThinking");
      const reviewEl = $f("#formAiReview");
      const labelEl = $f("#formThinkingLabel");
      if (!thinkingEl || !reviewEl || !labelEl) return;

      thinkingEl.hidden = false;
      reviewEl.hidden = true;

      let i = 0;
      labelEl.textContent = thinkingLines[0];
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const interval = reduce ? 120 : 520;
      const ticker = setInterval(() => {
        i++;
        if (i >= thinkingLines.length) {
          clearInterval(ticker);
          buildReviewBlocks();
          thinkingEl.hidden = true;
          reviewEl.hidden = false;
          return;
        }
        labelEl.textContent = thinkingLines[i];
      }, interval);
    }

    function generatePrompts() {
      s.integrations.pixel.id = String($f("#formPixelId")?.value || "").trim();
      s.integrations.pixel.event = String($f("#formPixelEvent")?.value || "").trim();
      s.integrations.pixel.customEvent = String($f("#formPixelCustomEvent")?.value || "").trim();
      s.integrations.wa.token = String($f("#formFonnteToken")?.value || "").trim();
      s.integrations.wa.toAdmin = !!$f("#formWaToAdmin")?.checked;
      s.integrations.wa.toUser = !!$f("#formWaToUser")?.checked;
      s.integrations.wa.templateAdmin = String($f("#formWaTemplateAdmin")?.value || s.integrations.wa.templateAdmin || "");
      s.integrations.wa.templateUser = String($f("#formWaTemplateUser")?.value || s.integrations.wa.templateUser || "");
      s.integrations.sheet.appsScriptUrl = String($f("#formAppsScriptUrl")?.value || "").trim();

      s.generated.strategy = promptFormStrategist(s);
      s.generated.arch = promptFormArchitect(s);
      s.generated.dev = promptFormDeveloper(s);

      $f("#formOutStrategy").textContent = s.generated.strategy;
      $f("#formOutArch").textContent = s.generated.arch;
      $f("#formOutDev").textContent = s.generated.dev;

      const typeText = $f("#formType").options[$f("#formType").selectedIndex]?.textContent || "Form";
      const aiLabel = s.ai === "deepseek" ? "DeepSeek" : (s.ai === "trae" ? "TRAE" : "Claude");
      const integrations = [
        s.integrations.sheet.enabled ? "Spreadsheet" : null,
        s.integrations.wa.enabled ? "WhatsApp" : null,
        s.integrations.pixel.enabled ? "Pixel" : null
      ].filter(Boolean);
      $f("#formResultMeta").innerHTML =
        '<span class="meta-chip">' + iconSvg("📝") + ' <b>' + escapeHtml(typeText) + "</b></span>" +
        (integrations.length ? ('<span class="meta-chip">' + iconSvg("⚙️") + ' <b>' + escapeHtml(integrations.join(" · ")) + '</b></span>') : ('<span class="meta-chip">' + iconSvg("⚙️") + ' <b>Tanpa integrasi</b></span>')) +
        '<span class="meta-chip">' + iconSvg("🤖") + ' <b>' + escapeHtml(aiLabel) + "</b></span>";

      renderGuide("#formGuideBoxResult");

      const result = $f("#formResult");
      result.hidden = false;
      setTimeout(() => {
        const y = result.getBoundingClientRect().top + window.scrollY - 10;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 60);
      playSuccessSound();
    }

    function shareWhatsApp() {
      const typeText = $f("#formType").options[$f("#formType").selectedIndex]?.textContent || "form";
      const msg = "Saya baru bikin super prompt " + typeText +
        " pakai " + BRAND_NAME + "! Form + automasi WhatsApp Fonnte + ZIP siap deploy. Coba juga ya.";
      window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
    }

    function restart() {
      const result = $f("#formResult");
      if (result) result.hidden = true;
      goTo(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    $$f("[data-next]").forEach((b) => b.addEventListener("click", () => {
      if (!validateStep(s.step)) return;
      goTo(s.step + 1);
      if (s.step === 3) ensureDefaultFields();
      if (s.step === 4) syncIntegrationsUI();
      if (s.step === 6) renderGuide("#formGuideBox");
    }));
    $$f("[data-prev]").forEach((b) => b.addEventListener("click", () => goTo(Math.max(1, s.step - 1))));

    $f("#formType").addEventListener("change", (e) => {
      s.type = e.target.value;
      save();
      const err = $f("#formErrType");
      if (err) err.classList.remove("show");
      syncIntegrationsUI();
    });
    $f("#formPurpose").addEventListener("input", (e) => { s.purpose = e.target.value; });

    $$f("#formFieldsGrid .chip").forEach((btn) => btn.addEventListener("click", () => {
      const key = btn.dataset.field;
      s.fields = Array.isArray(s.fields) ? s.fields : [];
      if (s.fields.includes(key)) s.fields = s.fields.filter((k) => k !== key);
      else s.fields = s.fields.concat([key]);
      save();
      syncFieldUI();
      if (s.integrations.sheet.enabled) setSheetStatus("disconnected", "Field berubah");
      const err = $f("#formErrFields");
      if (err) err.classList.remove("show");
    }));
    $f("#formCustomFields").addEventListener("input", (e) => {
      s.customFields = e.target.value;
      save();
      if (s.integrations.sheet.enabled) setSheetStatus("disconnected", "Field berubah");
    });

    $f("#formPixelToggle").addEventListener("change", (e) => {
      if (!isFormIntegrationUnlocked("pixel")) {
        e.target.checked = false;
        openUpgradePage("Facebook Pixel tersedia setelah upgrade.");
        syncIntegrationsUI();
        return;
      }
      s.integrations.pixel.enabled = !!e.target.checked;
      if (s.integrations.pixel.enabled && !s.integrations.pixel.event) {
        s.integrations.pixel.event = recommendedPixelEventByType(s.type);
      }
      save();
      syncIntegrationsUI();
    });
    $f("#formPixelId").addEventListener("input", (e) => { s.integrations.pixel.id = e.target.value; save(); });
    $f("#formPixelEvent").addEventListener("change", (e) => {
      s.integrations.pixel.event = e.target.value;
      save();
      syncIntegrationsUI();
    });
    $f("#formPixelCustomEvent").addEventListener("input", (e) => { s.integrations.pixel.customEvent = e.target.value; save(); });

    $f("#formWaToggle").addEventListener("change", (e) => {
      s.integrations.wa.enabled = !!e.target.checked;
      s.integrations.wa.status = "disconnected";
      s.integrations.wa.lastMessage = "";
      save();
      syncIntegrationsUI();
    });
    $f("#formFonnteToken").addEventListener("input", (e) => {
      s.integrations.wa.token = e.target.value;
      s.integrations.wa.status = "disconnected";
      s.integrations.wa.lastMessage = "";
      save();
      syncIntegrationsUI();
    });
    $f("#formWaToAdmin").addEventListener("change", (e) => { s.integrations.wa.toAdmin = !!e.target.checked; save(); });
    $f("#formWaToUser").addEventListener("change", (e) => { s.integrations.wa.toUser = !!e.target.checked; save(); });
    $f("#formWaTemplateAdmin").addEventListener("input", (e) => { s.integrations.wa.templateAdmin = e.target.value; save(); });
    $f("#formWaTemplateUser").addEventListener("input", (e) => { s.integrations.wa.templateUser = e.target.value; save(); });
    $f("#formWaTestBtn").addEventListener("click", () => testWaConnection());

    $f("#formSheetToggle").addEventListener("change", (e) => {
      if (!isFormIntegrationUnlocked("sheet")) {
        e.target.checked = false;
        openUpgradePage("Google Spreadsheet tersedia setelah upgrade.");
        syncIntegrationsUI();
        return;
      }
      s.integrations.sheet.enabled = !!e.target.checked;
      s.integrations.sheet.status = "disconnected";
      s.integrations.sheet.lastMessage = "";
      save();
      syncIntegrationsUI();
    });
    $f("#formAppsScriptUrl").addEventListener("input", (e) => {
      s.integrations.sheet.appsScriptUrl = e.target.value;
      s.integrations.sheet.status = "disconnected";
      s.integrations.sheet.lastMessage = "";
      save();
      syncIntegrationsUI();
    });
    $f("#formSheetTestBtn").addEventListener("click", () => testSheetConnection());

    const sheetSetupModal = $("#formSheetSetupModal");
    const sheetCopyBtn = $("#formSheetCopyCodeBtn");
    const sheetOpenBtn = $("#formSheetOpenSheetsBtn");

    function setSheetSetupOpen(isOpen) {
      if (!sheetSetupModal) return;
      sheetSetupModal.hidden = !isOpen;
      sheetSetupModal.setAttribute("aria-hidden", isOpen ? "false" : "true");
      document.body.classList.toggle("modal-open", isOpen);
    }

    function openSheetSetup() { setSheetSetupOpen(true); }
    function closeSheetSetup() { setSheetSetupOpen(false); }

    const sheetSetupBtn = $f("#formSheetSetupBtn");
    if (sheetSetupBtn) sheetSetupBtn.addEventListener("click", openSheetSetup);
    $$("[data-form-sheet-setup-close]").forEach((el) => el.addEventListener("click", closeSheetSetup));

    if (sheetCopyBtn) {
      sheetCopyBtn.addEventListener("click", () => {
        const schema = getFieldSchema();
        const code = buildAppsScriptCode(schema);
        copyText(code, sheetCopyBtn);
      });
    }

    if (sheetOpenBtn) {
      sheetOpenBtn.addEventListener("click", () => {
        window.open("https://docs.google.com/spreadsheets/u/0/", "_blank");
      });
    }

    $$f("#formAiGrid .ai-card").forEach((c) => c.addEventListener("click", () => {
      markAi(c.dataset.ai);
      renderGuide("#formGuideBox");
    }));

    $f("#formToReviewBtn").addEventListener("click", () => {
      if (!validateStep(3)) return;
      if (!validateStep(4)) return;
      goTo(5);
      runAIReview();
    });

    $f("#formToGenerateBtn").addEventListener("click", () => {
      goTo(6);
      renderGuide("#formGuideBox");
    });

    $f("#formGenerateBtn").addEventListener("click", () => generatePrompts());

    $$f("[data-copy]").forEach((b) => b.addEventListener("click", () => {
      const key = b.dataset.copy;
      const map = { strategy: s.generated.strategy, arch: s.generated.arch, dev: s.generated.dev };
      copyText(map[key] || "", b);
    }));

    $f("#formShareWa").addEventListener("click", shareWhatsApp);
    $f("#formRestartBtn").addEventListener("click", restart);

    if (formIdeasCategory) {
      formIdeasCategory.innerHTML = ['<option value="">Semua Kategori</option>'].concat(
        Object.keys(FORM_IDEAS).map((key) => '<option value="' + escapeHtml(key) + '">' + escapeHtml(key) + '</option>')
      ).join("");
      formIdeasCategory.addEventListener("change", () => renderFormIdeas(formIdeasCategory.value));
    }
    if (formIdeasRandomBtn) {
      formIdeasRandomBtn.addEventListener("click", () => {
        const entries = Object.keys(FORM_IDEAS).flatMap((key) => FORM_IDEAS[key]);
        if (!entries.length) return;
        const item = entries[Math.floor(Math.random() * entries.length)];
        applyFormIdea(item);
      });
    }
    if (formIdeasResetBtn) {
      formIdeasResetBtn.addEventListener("click", () => {
        if (formIdeasCategory) formIdeasCategory.value = "";
        renderFormIdeas("");
      });
    }
    ["#formIdeasBtnType", "#formIdeasBtnPurpose"].forEach((sel) => {
      const btn = $f(sel);
      if (btn) btn.addEventListener("click", openFormIdeasModal);
    });
    $$("[data-form-ideas-close]").forEach((btn) => btn.addEventListener("click", closeFormIdeasModal));

    load();
    syncFieldUI();
    decorateIntegrationCards();
    syncIntegrationsUI();
    renderGuide("#formGuideBox");
    goTo(1, false);
  }

  function setupIdeasModal() {
    const modal = $("#ideasModal");
    if (!modal) return;

    const data = window.AIJB_IDEAS || {};
    const catMap = data.categories || {};
    const profMap = data.professions || {};

    const openBtn = $("#inspirationBtn");
    const searchEl = $("#ideasSearch");
    const catEl = $("#ideasCategory");
    const profEl = $("#ideasProfession");
    const listEl = $("#ideasList");
    const randomBtn = $("#ideasRandomBtn");
    const clearBtn = $("#ideasClearBtn");

    if (!openBtn || !searchEl || !catEl || !profEl || !listEl || !randomBtn || !clearBtn) return;

    const stateIdeas = { q: "", category: "", profession: "" };

    function setOpen(isOpen) {
      modal.hidden = !isOpen;
      modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
      document.body.classList.toggle("modal-open", isOpen);
      if (isOpen) {
        setTimeout(() => searchEl.focus(), 0);
      }
    }

    function close() { setOpen(false); }
    function open() { setOpen(true); render(); }

    function setSelectOptions(el, items) {
      el.innerHTML = "";
      items.forEach((it) => {
        const opt = document.createElement("option");
        opt.value = it.value;
        opt.textContent = it.label;
        el.appendChild(opt);
      });
    }

    const categoryKeys = Object.keys(catMap);
    setSelectOptions(catEl, [{ value: "", label: "Semua Kategori" }].concat(
      categoryKeys.map((k) => ({ value: k, label: k }))
    ));

    const professionKeys = Object.keys(profMap);
    setSelectOptions(profEl, [{ value: "", label: "Rekomendasi Profesi (Opsional)" }].concat(
      professionKeys.map((k) => ({ value: k, label: k }))
    ));

    function buildPool() {
      if (stateIdeas.profession) {
        const arr = profMap[stateIdeas.profession] || [];
        return arr.map((title) => ({ title: title, category: "Profesi", tag: stateIdeas.profession }));
      }
      const out = [];
      if (stateIdeas.category && catMap[stateIdeas.category]) {
        catMap[stateIdeas.category].forEach((t) => out.push({ title: t, category: stateIdeas.category, tag: null }));
        return out;
      }
      categoryKeys.forEach((k) => (catMap[k] || []).forEach((t) => out.push({ title: t, category: k, tag: null })));
      return out;
    }

    function normalize(s) { return String(s || "").toLowerCase().trim(); }

    function getFiltered() {
      const q = normalize(stateIdeas.q);
      const pool = buildPool();
      if (!q) return pool;
      return pool.filter((it) => normalize(it.title).includes(q) || normalize(it.category).includes(q) || normalize(it.tag).includes(q));
    }

    function applyIdea(text) {
      const idea = String(text || "").trim();
      if (!idea) return;
      const input = $("#inputIdea");
      if (!input) return;
      input.value = idea;
      state.idea = idea;
      saveState();
      $("#errIdea").classList.remove("show");
      close();
      toast("Ide terisi otomatis ✓");
      setTimeout(() => input.focus(), 0);
    }

    function render() {
      const items = getFiltered();
      listEl.innerHTML = "";

      if (!items.length) {
        const empty = document.createElement("div");
        empty.className = "ideas-empty";
        const strong = document.createElement("strong");
        strong.textContent = "Tidak ada hasil.";
        const desc = document.createElement("div");
        desc.textContent = "Coba ubah kata kunci atau reset filter.";
        empty.appendChild(strong);
        empty.appendChild(desc);
        listEl.appendChild(empty);
        return;
      }

      const frag = document.createDocumentFragment();
      items.forEach((it) => {
        const card = document.createElement("div");
        card.className = "idea-item";
        card.setAttribute("role", "listitem");

        const top = document.createElement("div");
        top.className = "idea-top";

        const left = document.createElement("div");
        const title = document.createElement("div");
        title.className = "idea-title";
        title.textContent = it.title;

        const meta = document.createElement("div");
        meta.className = "idea-meta";
        const badgeCat = document.createElement("span");
        badgeCat.className = "idea-badge";
        badgeCat.textContent = it.category === "Profesi" ? "Rekomendasi Profesi" : it.category;
        meta.appendChild(badgeCat);
        if (it.tag) {
          const badgeTag = document.createElement("span");
          badgeTag.className = "idea-badge soft";
          badgeTag.textContent = it.tag;
          meta.appendChild(badgeTag);
        }

        left.appendChild(title);
        left.appendChild(meta);

        const actions = document.createElement("div");
        actions.className = "idea-actions";
        const useBtn = document.createElement("button");
        useBtn.type = "button";
        useBtn.className = "btn btn-primary";
        useBtn.textContent = "Gunakan Ide Ini";
        useBtn.addEventListener("click", () => applyIdea(it.title));
        actions.appendChild(useBtn);

        top.appendChild(left);
        top.appendChild(actions);
        card.appendChild(top);
        frag.appendChild(card);
      });
      listEl.appendChild(frag);
    }

    function resetFilters() {
      stateIdeas.q = "";
      stateIdeas.category = "";
      stateIdeas.profession = "";
      searchEl.value = "";
      catEl.value = "";
      profEl.value = "";
      catEl.disabled = false;
      render();
      toast("Filter direset");
    }

    function pickRandom() {
      const items = getFiltered();
      if (!items.length) return;
      const it = items[Math.floor(Math.random() * items.length)];
      applyIdea(it.title);
    }

    openBtn.addEventListener("click", open);
    modal.querySelectorAll("[data-ideas-close]").forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });

    searchEl.addEventListener("input", (e) => { stateIdeas.q = e.target.value; render(); });
    catEl.addEventListener("change", (e) => { stateIdeas.category = e.target.value; render(); });
    profEl.addEventListener("change", (e) => {
      stateIdeas.profession = e.target.value;
      catEl.disabled = !!stateIdeas.profession;
      if (stateIdeas.profession) { stateIdeas.category = ""; catEl.value = ""; }
      render();
    });
    randomBtn.addEventListener("click", pickRandom);
    clearBtn.addEventListener("click", resetFilters);
  }

  function setupNameModal() {
    const modal = $("#nameModal");
    if (!modal) return;

    const gen = window.AIJB_NAME;
    const openBtn = $("#nameIdeaBtn");
    const listEl = $("#nameList");
    const previewEl = $("#nameIdeaPreview");
    const refreshBtn = $("#nameRefreshBtn");
    const ideaInput = $("#inputIdea");
    const nameInput = $("#inputName");

    if (!gen || !openBtn || !listEl || !previewEl || !refreshBtn || !ideaInput || !nameInput) return;

    const order = ["Premium", "Modern", "Indonesia", "Brandable", "Islami", "Singkat"];
    const ui = { variant: 0, _timer: null };

    function setOpen(isOpen) {
      modal.hidden = !isOpen;
      modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
      document.body.classList.toggle("modal-open", isOpen);
    }

    function close() { setOpen(false); }

    function applyName(val) {
      const name = String(val || "").trim();
      if (name.length < 2) return;
      nameInput.value = name;
      state.name = name;
      saveState();
      $("#errName").classList.remove("show");
      close();
      toast("Nama terisi otomatis ✓");
      setTimeout(() => nameInput.focus(), 0);
    }

    function renderEmpty(msg) {
      listEl.innerHTML = "";
      const empty = document.createElement("div");
      empty.className = "ideas-empty";
      const strong = document.createElement("strong");
      strong.textContent = "Isi ide dulu ya.";
      const desc = document.createElement("div");
      desc.textContent = msg || "Tulis ide aplikasi di langkah 1, lalu kembali ke sini untuk dapat rekomendasi nama.";
      empty.appendChild(strong);
      empty.appendChild(desc);
      listEl.appendChild(empty);
    }

    function render() {
      const idea = String(ideaInput.value || "").trim();
      previewEl.textContent = idea ? ("Ide: " + idea) : "Ide belum diisi.";
      if (idea.length < 3) {
        renderEmpty();
        return;
      }

      const rec = gen.generate(idea, { variant: ui.variant });
      listEl.innerHTML = "";

      const frag = document.createDocumentFragment();
      order.forEach((cat) => {
        const arr = (rec && rec[cat]) ? rec[cat].slice(0, 6) : [];
        if (!arr.length) return;

        const group = document.createElement("div");
        group.className = "name-group";

        const head = document.createElement("div");
        head.className = "name-group-head";

        const hLeft = document.createElement("div");
        const title = document.createElement("div");
        title.className = "name-group-title";
        title.textContent = cat;
        const sub = document.createElement("div");
        sub.className = "name-group-sub";
        sub.textContent = "4–6 rekomendasi";
        hLeft.appendChild(title);
        hLeft.appendChild(sub);

        head.appendChild(hLeft);
        group.appendChild(head);

        const grid = document.createElement("div");
        grid.className = "name-grid";
        arr.forEach((nm) => {
          const item = document.createElement("div");
          item.className = "name-item";

          const left = document.createElement("div");
          left.className = "name-text";
          const val = document.createElement("div");
          val.className = "name-value";
          val.textContent = nm;
          const note = document.createElement("div");
          note.className = "name-note";
          note.textContent = "Gaya: " + cat;
          left.appendChild(val);
          left.appendChild(note);

          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-primary name-use-btn";
          btn.textContent = "Gunakan Nama Ini";
          btn.addEventListener("click", () => applyName(nm));

          item.appendChild(left);
          item.appendChild(btn);
          grid.appendChild(item);
        });

        group.appendChild(grid);
        frag.appendChild(group);
      });
      listEl.appendChild(frag);
    }

    function open() {
      setOpen(true);
      ui.variant = 0;
      render();
    }

    function refresh() {
      ui.variant++;
      render();
    }

    openBtn.addEventListener("click", open);
    refreshBtn.addEventListener("click", refresh);
    modal.querySelectorAll("[data-name-close]").forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });

    ideaInput.addEventListener("input", () => {
      if (modal.hidden) return;
      clearTimeout(ui._timer);
      ui._timer = setTimeout(render, 180);
    });
  }

  // ---------- Generate prompts ----------
  function generatePrompts() {
    if (!consumeProGenerate()) {
      openUpgradePage("Kuota generate PRO sudah habis. Upgrade untuk lanjut pakai PRO.");
      markVersion(state.version);
      renderGuide("#guideBox");
      updateGenerateButton();
      saveState();
      return;
    }
    state.generated.app = promptAppBuilder(state);
    state.generated.prd = promptPRD(state);
    state.generated.dev = promptDeveloper(state);

    $("#outApp").textContent = state.generated.app;
    $("#outPrd").textContent = state.generated.prd;
    $("#outDev").textContent = state.generated.dev;

    // meta chips
    const goalLabel = {
      prospek: "Cari Prospek", booking: "Booking", marketplace: "Marketplace",
      subscription: "Langganan", produktivitas: "Produktivitas"
    }[state.goal] || "—";
    $("#resultMeta").innerHTML =
      '<span class="meta-chip">' + iconSvg("📱") + ' <b>' + escapeHtml(state.name) + "</b></span>" +
      '<span class="meta-chip">' + iconSvg("🎯") + ' <b>' + goalLabel + "</b></span>" +
      '<span class="meta-chip">' + iconSvg("⚙️") + ' Versi <b>' + state.version + "</b></span>";

    renderGuide("#guideBoxResult");

    const result = $("#result");
    result.hidden = false;
    setTimeout(() => {
      const y = result.getBoundingClientRect().top + window.scrollY - 10;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 60);
    if (String(state.version || "").toUpperCase() === "PRO") {
      const remaining = getProGeneratesRemaining();
      toast("Generate PRO berhasil. Sisa kuota PRO: " + remaining + "/" + PRO_GENERATE_LIMIT + ".");
      markVersion(state.version);
      renderGuide("#guideBox");
      renderGuide("#guideBoxResult");
      updateGenerateButton();
      saveState();
    }
    playSuccessSound();
  }

  // ---------- Copy (dengan fallback) ----------
  async function copyText(text, btn) {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (e) { ok = false; }

    if (!ok) {
      // fallback untuk HP / browser dalam-app / non-HTTPS
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (e) { ok = false; }
    }

    if (ok) {
      toast("Prompt berhasil disalin ✓");
      if (btn) {
        const old = btn.innerHTML;
        btn.innerHTML = iconLabelHtml("✅", "Tersalin");
        btn.classList.add("done");
        setTimeout(() => { btn.innerHTML = old; btn.classList.remove("done"); }, 2000);
      }
    } else {
      toast("Salin manual: tekan lama pada teks lalu pilih Copy");
    }
  }

  // ---------- WhatsApp share ----------
  function shareWhatsApp() {
    const msg = "Saya baru bikin super prompt aplikasi \"" + state.name +
      "\" pakai " + BRAND_NAME + "! Ubah ide jadi aplikasi siap online tanpa coding. Coba juga ya.";
    const url = "https://wa.me/?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  }

  // ---------- Restart ----------
  function restart() {
    $("#result").hidden = true;
    goToStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- Event binding ----------
  function bind() {
    // Tombol Lanjut / Kembali generik
    $$app("[data-next]").forEach((b) => b.addEventListener("click", () => {
      if (validateStep(state.step)) goToStep(state.step + 1);
    }));
    $$app("[data-prev]").forEach((b) => b.addEventListener("click", () => {
      goToStep(Math.max(1, state.step - 1));
    }));

    // Input live save
    $("#inputIdea").addEventListener("input", (e) => { state.idea = e.target.value; });
    $("#inputName").addEventListener("input", (e) => { state.name = e.target.value; });

    // Goal options
    $$app("#goalGrid .option").forEach((o) => o.addEventListener("click", () => {
      state.goal = o.dataset.goal; markGoal(state.goal); saveState();
      $("#errGoal").classList.remove("show");
    }));

    // Step 3 -> AI Review
    $("#toReviewBtn").addEventListener("click", () => {
      if (!validateStep(3)) return;
      goToStep(4);
      runAIReview();
    });

    // AI Review -> Generate step
    $("#toGenerateBtn").addEventListener("click", () => {
      goToStep(5);
      renderGuide("#guideBox");
      updateGenerateButton();
    });

    // Version cards
    $$app("#versionGrid .version-card").forEach((c) => c.addEventListener("click", () => {
      if (!isAppVersionUnlocked(c.dataset.version)) {
        openUpgradePage("Kuota PRO habis. Upgrade untuk dapat akses PRO lagi.");
        updateGenerateButton();
        return;
      }
      state.version = c.dataset.version; markVersion(state.version); saveState();
      renderGuide("#guideBox");
      updateGenerateButton();
    }));

    // Generate
    $("#generateBtn").addEventListener("click", () => {
      generatePrompts();
    });

    // Copy buttons
    $$app("[data-copy]").forEach((b) => b.addEventListener("click", () => {
      const key = b.dataset.copy;
      const map = { app: state.generated.app, prd: state.generated.prd, dev: state.generated.dev };
      copyText(map[key] || "", b);
    }));

    // Share + restart
    $("#shareWa").addEventListener("click", shareWhatsApp);
    $("#restartBtn").addEventListener("click", restart);

    // Enter di field nama = lanjut
    $("#inputName").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); if (validateStep(2)) goToStep(3); }
    });
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    setupAuthGate();
    setupSuiteNavigation();
    hydrateStaticIcons();
    bind();
    setupPageModule();
    setupFormModule();
    setupIdeasModal();
    setupNameModal();
    loadState();
    renderGuide("#guideBox");
    updateGenerateButton();
    goToStep(1, false);
  });
})();
