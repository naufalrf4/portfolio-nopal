import "./main.css";

const $ = (sel, root = document) => root.querySelector(sel);

async function loadText(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.text();
}

async function boot() {
  const deck = $("#deck");
  let decksIndex;
  try {
    decksIndex = await fetch("decks-index.json", { cache: "no-cache" }).then((r) => r.json());
  } catch (e) {
    deck.innerHTML = `<p style="padding:40px;font-family:sans-serif">Failed to load decks-index.json — serve over HTTP, not file://</p>`;
    return;
  }

  const requestedSlug = new URLSearchParams(location.search).get("deck");
  const slug = requestedSlug || decksIndex[0]?.slug;

  if (!slug || !decksIndex.some((d) => d.slug === slug)) {
    deck.innerHTML = `<p style="padding:40px;font-family:sans-serif">Deck "${slug || ""}" not found — check the ?deck= query param.</p>`;
    return;
  }

  let manifest;
  try {
    manifest = await fetch(`decks/${slug}/manifest.json`, { cache: "no-cache" }).then((r) => r.json());
  } catch (e) {
    deck.innerHTML = `<p style="padding:40px;font-family:sans-serif">Failed to load decks/${slug}/manifest.json — serve over HTTP, not file://</p>`;
    return;
  }

  if (manifest.title) document.title = manifest.title;
  if (manifest.theme) document.body.setAttribute("data-theme", manifest.theme);

  try {
    const sprite = await loadText("icons.svg");
    $("#sprite-host").innerHTML = sprite;
  } catch {}

  const total = manifest.slides.length;
  const frags = await Promise.all(
    manifest.slides.map((path) =>
      loadText(`decks/${slug}/${path}`).catch(
        (e) => `<section class="slide"><div class="pad"><p style="padding:40px">${path}: ${e.message}</p></div></section>`,
      ),
    ),
  );

  deck.innerHTML = frags.join("\n");
  const slides = Array.from(deck.querySelectorAll(".slide"));
  slides.forEach((s, i) => {
    s.dataset.index = String(i);
    s.querySelectorAll("[data-pagenum]").forEach((el) => {
      el.textContent = `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    });
    if (manifest.footerLogo) {
      s.querySelectorAll("[data-logo]").forEach((img) => { img.src = manifest.footerLogo; });
    }
  });

  deck.removeAttribute("aria-busy");
  wireReveal(slides);
  wireProgress();
  wireNav(slides);
  wirePresent(slides);
}

function wireReveal(slides) {
  const io = new IntersectionObserver(
    (ents) => {
      for (const en of ents) {
        if (!en.isIntersecting) continue;
        en.target.classList.add("in");
        en.target.querySelectorAll("[data-count]").forEach(runCount);
      }
    },
    { threshold: 0.4 },
  );
  slides.forEach((s) => io.observe(s));
}

function runCount(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const dur = 1100;
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = Math.round(target * eased);
    const shown = v >= 1000 ? (v / 1000).toFixed(1).replace(".0", "") + "K" : String(v);
    el.textContent = shown + (p === 1 ? suffix : "");
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function wireProgress() {
  const prog = $("#prog");
  if (!prog) return;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function wireNav(slides) {
  let idx = 0;
  const io = new IntersectionObserver(
    (ents) => ents.forEach((en) => { if (en.isIntersecting) idx = Number(en.target.dataset.index); }),
    { threshold: 0.6 },
  );
  slides.forEach((s) => io.observe(s));
  const go = (n) => {
    idx = Math.max(0, Math.min(slides.length - 1, n));
    slides[idx].scrollIntoView({ behavior: "smooth", block: "center" });
  };
  window.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("presenting")) return;
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(idx + 1); }
    if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(idx - 1); }
  });
}

boot();

function wirePresent(slides) {
  const deck = $("#deck");
  let cur = 0;
  let hintTimer = null;

  const hint = document.createElement("div");
  hint.className = "present-hint";
  hint.textContent = "← →  navigate     Esc  exit";
  const counter = document.createElement("div");
  counter.className = "present-counter";
  document.body.append(hint, counter);

  function show(i) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, k) => {
      const active = k === cur;
      s.classList.toggle("present-active", active);
      if (active) {
        s.classList.remove("in");
        void s.offsetWidth;
        requestAnimationFrame(() => s.classList.add("in"));
        s.querySelectorAll("[data-count]").forEach((el) => { delete el.dataset.done; runCount(el); });
      }
    });
    counter.textContent = `${cur + 1} / ${slides.length}`;
  }

  function enter() {
    document.body.classList.add("presenting");
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    show(0);
    flashHint();
  }

  function exit() {
    document.body.classList.remove("presenting");
    slides.forEach((s) => s.classList.remove("present-active"));
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    slides[cur]?.scrollIntoView({ block: "center" });
  }

  function flashHint() {
    hint.classList.remove("fade");
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.classList.add("fade"), 2600);
  }

  window.addEventListener("keydown", (e) => {
    if (!document.body.classList.contains("presenting")) return;
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); show(cur + 1); flashHint(); }
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); show(cur - 1); flashHint(); }
    else if (e.key === "Escape") { exit(); }
    else if (e.key === "Home") { show(0); }
    else if (e.key === "End") { show(slides.length - 1); }
  });

  deck.addEventListener("click", (e) => {
    if (!document.body.classList.contains("presenting")) return;
    if (e.clientX < window.innerWidth * 0.32) show(cur - 1);
    else show(cur + 1);
    flashHint();
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && document.body.classList.contains("presenting")) exit();
  });

  const btn = $("#btn-present");
  if (btn) btn.addEventListener("click", enter);
}
