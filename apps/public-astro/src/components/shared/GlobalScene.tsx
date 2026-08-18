/**
 * GlobalScene — persistent single-canvas Three.js ambient world mounted from BaseLayout.
 *
 * One renderer/canvas survives Astro ClientRouter navigation. Renders a starfield:
 * small dots streaming toward the camera through deep space.
 *
 * Reveal model (single `warp` 0→1 drives everything):
 *   burst  — page load: stars packed at center, explode outward + zoom to camera, settle.
 *   reveal — astro:page-load: quick fade + lighter re-burst each navigation.
 *   idle   — gentle constant drift toward camera (endless wrap).
 *
 * Interactions: mouse parallax, cursor repel, scroll speedup (dots stretch into
 * streaks at speed). Stars use a natural palette (blue-white hot → dim red) so they
 * never clash with teal/amber text.
 *
 * aria-hidden, pointer-events-none, pauses when tab hidden. Mobile / reduced-motion /
 * save-data / WebGL-failure fall back to a static CSS/SVG snapshot (the .scene-fallback
 * class on the container, not this component). Three.js is dynamically imported so it
 * is code-split out of the initial content bundle.
 *
 * Scene-state protocol (DESIGN.md scene map): route + visible `[data-scene]` sections
 * morph the shared particle buffers through four states — terrain (hero), circuit
 * (credibility/projects/about), flow (writing), signal (guestbook/contact). One
 * IntersectionObserver picks the dominant visible section; pages without sections
 * fall back to a route default. Moods are tint/speed/softness/twinkle morphs plus a
 * radar-ping pulse in `signal`; no new geometry is allocated on state change.
 */
import { useEffect, useRef } from 'react';
import type * as ThreeNS from 'three';

// ── Natural star palette (spectral-ish, dim). [r,g,b] in 0..1 ────────────
// O/B hot blue-white, A/F white, G sun-like, K dim orange, M dim red.
const STAR_COLORS: ReadonlyArray<readonly [number, number, number]> = [
  [0.62, 0.72, 1.0],  // O/B vivid blue-white
  [1.0, 1.0, 1.0],    // A/F pure white
  [1.0, 0.93, 0.66],  // G golden
  [1.0, 0.72, 0.42],  // K warm orange
  [1.0, 0.5, 0.38],   // M warm red
];
// Population weights favor brighter, more colorful classes so the field reads rich.
const STAR_WEIGHTS: ReadonlyArray<number> = [0.28, 0.3, 0.2, 0.14, 0.08];
// Relative brightness/size per class (bright classes bigger, dim classes smaller).
const STAR_SCALE: ReadonlyArray<number> = [1.9, 1.5, 1.15, 0.9, 0.7];

// ── Scene-state protocol ──────────────────────────────────────────────────
/** The four scene moods a route/section can drive the canvas into. */
export type SceneStateName = 'terrain' | 'circuit' | 'flow' | 'signal';

const SCENE_ORDER: ReadonlyArray<SceneStateName> = ['terrain', 'circuit', 'flow', 'signal'];

interface SceneMood {
  /** Multiplied over the natural star palette to tint the field. */
  rgb: readonly [number, number, number];
  /** Global opacity scale for the field. */
  opacity: number;
  /** Idle forward-speed multiplier. */
  speed: number;
  /** Sprite softness 0..1 (bigger, dimmer dots read softer). */
  softness: number;
  /** Extra twinkle amplitude, may be negative to calm the field. */
  twinkle: number;
  /** Periodic radar ping pulses particle brightness (signal state). */
  ping?: boolean;
}

const SCENE_MOODS: Record<SceneStateName, SceneMood> = {
  // Hero / identity — natural star palette, bright, lively drift.
  terrain: { rgb: [1, 1, 1], opacity: 1, speed: 1, softness: 0, twinkle: 0 },
  // Credibility / projects / about — teal circuit traces, steadier.
  circuit: { rgb: [0.55, 1.05, 0.95], opacity: 0.85, speed: 0.75, softness: 0.35, twinkle: 0.5 },
  // Writing / blogs — warm amber, soft, dim, slow.
  flow: { rgb: [1.08, 0.9, 0.62], opacity: 0.55, speed: 0.45, softness: 1, twinkle: -0.4 },
  // Guestbook / contact / chat — cool beacon with radar pings.
  signal: { rgb: [0.5, 1.1, 1.0], opacity: 0.7, speed: 0.6, softness: 0.55, twinkle: 0.6, ping: true },
};

function isSceneName(v: string | undefined): v is SceneStateName {
  return v !== undefined && (SCENE_ORDER as ReadonlyArray<string>).includes(v);
}

/** Pages without [data-scene] sections fall back to a route-driven default. */
function routeDefault(pathname: string): SceneStateName {
  if (pathname.startsWith('/blogs')) return 'flow';
  if (pathname.startsWith('/contact') || pathname.startsWith('/guestbook') || pathname.startsWith('/ai-chatbot')) return 'signal';
  return 'circuit';
}

function pickStarClass(rand: number): number {
  let acc = 0;
  for (let i = 0; i < STAR_WEIGHTS.length; i++) {
    acc += STAR_WEIGHTS[i];
    if (rand <= acc) return i;
  }
  return STAR_WEIGHTS.length - 1;
}

// ── Capability detection ──────────────────────────────────────────────────
function shouldUseWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.innerWidth < 768) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return false;
  try {
    const test = document.createElement('canvas');
    const gl = test.getContext('webgl2') || test.getContext('webgl');
    if (!gl) return false;
  } catch {
    return false;
  }
  return true;
}

// ── Soft round dot sprite (radial alpha) ──────────────────────────────────
function makeDotTexture(THREE: typeof ThreeNS): ThreeNS.Texture {
  const S = 64;
  const cv = document.createElement('canvas');
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.85)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// ── Scene engine ──────────────────────────────────────────────────────────
function initEngine(
  THREE: typeof ThreeNS,
  container: HTMLDivElement
): () => void {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    62,
    window.innerWidth / window.innerHeight,
    0.1,
    400
  );
  camera.position.set(0, 0, 0);

  // ══════════════════════════════════════════════════════════════════════
  // STARS — one Points system. Each star: home (x,y), depth z, palette class.
  // Field spans a cylinder ahead of the camera; stars advance +z and wrap.
  // ══════════════════════════════════════════════════════════════════════
  const COUNT = 2000;
  const DEPTH = 240;          // wrap depth (how far ahead stars spawn)
  const RADIUS = 90;          // horizontal/vertical spread
  const NEAR = 6;             // closest pass distance before wrap

  const homeX = new Float32Array(COUNT);
  const homeY = new Float32Array(COUNT);
  const posX = new Float32Array(COUNT);
  const posY = new Float32Array(COUNT);
  const posZ = new Float32Array(COUNT);
  const speed = new Float32Array(COUNT);
  const starClass = new Uint8Array(COUNT);
  const twPhase = new Float32Array(COUNT);
  const repelX = new Float32Array(COUNT);
  const repelY = new Float32Array(COUNT);

  const dotPositions = new Float32Array(COUNT * 3);
  const dotColors = new Float32Array(COUNT * 3);
  const dotSizes = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    // Near-uniform radial fill so stars cover the whole viewport (every section),
    // with only a slight center bias so the initial burst still reads "from center".
    const r = Math.pow(Math.random(), 0.85) * RADIUS;
    const a = Math.random() * Math.PI * 2;
    homeX[i] = Math.cos(a) * r;
    homeY[i] = Math.sin(a) * r; // full vertical spread so lower sections stay populated
    posZ[i] = -Math.random() * DEPTH;
    speed[i] = 0.6 + Math.random() * 1.4;
    const cls = pickStarClass(Math.random());
    starClass[i] = cls;
    const c = STAR_COLORS[cls];
    dotColors[i * 3] = c[0];
    dotColors[i * 3 + 1] = c[1];
    dotColors[i * 3 + 2] = c[2];
    dotSizes[i] = STAR_SCALE[cls] * (0.9 + Math.random() * 1.0);
    twPhase[i] = Math.random() * Math.PI * 2;
  }

  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
  dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
  dotGeo.setAttribute('size', new THREE.BufferAttribute(dotSizes, 1));

  // Custom points shader: per-star size + round soft sprite + twinkle alpha.
  const dotMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTex: { value: null as ThreeNS.Texture | null },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSoft: { value: 0 },
      uTwAmp: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float size;
      varying vec3 vColor;
      varying float vTwinkle;
      uniform float uTime;
      uniform float uSoft;
      uniform float uTwAmp;
      uniform float uPixelRatio;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float tw = 0.82 + (0.18 + uTwAmp) * sin(uTime * 2.2 + position.x * 12.0 + position.y * 7.0 + 0.6);
        vTwinkle = tw;
        gl_PointSize = size * uPixelRatio * tw * mix(1.0, 1.35, uSoft) * (140.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex;
      uniform float uOpacity;
      uniform float uSoft;
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vec4 tex = texture2D(uTex, gl_PointCoord);
        // Crisp star core always; uSoft adds a soft halo skirt without blurring the core.
        float a = mix(tex.a, max(tex.a, pow(tex.a, 0.45) * 0.6), uSoft);
        gl_FragColor = vec4(vColor, a * vTwinkle * uOpacity);
      }
    `,
    vertexColors: true,
  });
  const dotPoints = new THREE.Points(dotGeo, dotMat);
  dotPoints.frustumCulled = false;
  scene.add(dotPoints);

  // ══════════════════════════════════════════════════════════════════════
  // STREAKS — LineSegments that stretch each star backward along +z motion
  // when overall speed is high (scroll / warp). Hidden at idle.
  // ══════════════════════════════════════════════════════════════════════
  const streakPositions = new Float32Array(COUNT * 6);
  const streakColors = new Float32Array(COUNT * 6);
  const streakGeo = new THREE.BufferGeometry();
  streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));
  streakGeo.setAttribute('color', new THREE.BufferAttribute(streakColors, 3));
  const streakMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const streaks = new THREE.LineSegments(streakGeo, streakMat);
  streaks.frustumCulled = false;
  scene.add(streaks);

  // ── Reveal state machine ──
  // warp 0→1 over `warpDur` seconds drives the initial center-burst reveal.
  // Page transitions: the field DRIFTS in a direction with a soft fade — stars
  // get a lateral velocity push and the scene dips, then settles. No re-burst.
  let warp = 0;
  let warpDur = 1.4;
  let fade = 0;
  let fadeTarget = 1;
  let panX = 0;          // accumulated lateral field offset (decays back to 0)
  let panY = 0;
  let driftVelX = 0;     // lateral star drift velocity (decays)
  let driftVelY = 0;

  function startBurst(dur: number): void {
    warp = 0;
    warpDur = dur;
    // Re-pack stars near center + deep so the burst reads "from the middle".
    for (let i = 0; i < COUNT; i++) {
      posZ[i] = -DEPTH * (0.55 + Math.random() * 0.45);
      repelX[i] = 0;
      repelY[i] = 0;
    }
  }
  startBurst(1.4); // initial page-load warp burst

  function onPageLoad(): void {
    // Page transition = change direction + fade. Push the field in a random
    // lateral direction and dip opacity; both ease back. Stars keep their depth
    // and forward speed — nothing re-packs to center.
    const ang = Math.random() * Math.PI * 2;
    driftVelX = Math.cos(ang) * 26;
    driftVelY = Math.sin(ang) * 16;
    fadeTarget = 0.25;
    window.setTimeout(() => { fadeTarget = 1; }, 260);
  }
  document.addEventListener('astro:page-load', onPageLoad);

  // ══════════════════════════════════════════════════════════════════════
  // SCENE-STATE MOOD — morphs the shared buffers per route/section protocol
  // ══════════════════════════════════════════════════════════════════════
  const dotTexture = makeDotTexture(THREE);
  dotMat.uniforms.uTex.value = dotTexture;

  // Per-star palette baked into the color buffer once up front.
  const baseColors = new Float32Array(dotColors);
  const softMult = new Float32Array(COUNT);

  let moodR = 1, moodG = 1, moodB = 1;
  let moodOpacity = 1, moodSpeed = 1, moodSoft = 0, moodTwinkleAmp = 0;
  let moodRt = 1, moodGt = 1, moodBt = 1;
  let moodOpacityT = 1, moodSpeedT = 1, moodSoftT = 0, moodTwinkleAmpT = 0;
  let pingOn = false, pingEnv = 0;

  function bakeMood(rgb: readonly [number, number, number], softness: number): void {
    for (let i = 0; i < COUNT; i++) {
      // soft states compress dynamic range so the field converges to one dim glow
      softMult[i] = 1 - softness * 0.85 * (0.35 + 0.65 * (starClass[i] / (STAR_COLORS.length - 1)));
      dotColors[i * 3] = baseColors[i * 3] * rgb[0] * softMult[i];
      dotColors[i * 3 + 1] = baseColors[i * 3 + 1] * rgb[1] * softMult[i];
      dotColors[i * 3 + 2] = baseColors[i * 3 + 2] * rgb[2] * softMult[i];
    }
    (dotGeo.attributes.color as ThreeNS.BufferAttribute).needsUpdate = true;
  }

  const initialSceneName = container.dataset.scene;
  let currentScene: SceneStateName = isSceneName(initialSceneName)
    ? initialSceneName
    : routeDefault(window.location.pathname);

  {
    const m = SCENE_MOODS[currentScene];
    moodR = moodRt = m.rgb[0];
    moodG = moodGt = m.rgb[1];
    moodB = moodBt = m.rgb[2];
    moodOpacity = moodOpacityT = m.opacity;
    moodSpeed = moodSpeedT = m.speed;
    moodSoft = moodSoftT = m.softness;
    moodTwinkleAmp = moodTwinkleAmpT = m.twinkle;
    pingOn = Boolean(m.ping);
    bakeMood(m.rgb, m.softness);
  }

  /**
   * Scene director: the dominant visible `[data-scene]` section wins; pages
   * without sections fall back to the route default. Sections discovered at
   * page-load are picked up by the scan, then tracked by one observer.
   *
   * ponytail: section→mood binding is one-way (content declares, canvas
   * reacts). Upgrade path: per-project accent hues once chapters carry a
   * design accent color.
   */
  const sectionEntries = new Map<Element, { rootTop: number }>();
  let targetScene: SceneStateName = currentScene;

  const sceneObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const prev = sectionEntries.get(entry.target);
      if (prev) prev.rootTop = entry.isIntersecting ? entry.boundingClientRect.top : Number.POSITIVE_INFINITY;
    }
    let best: Element | null = null;
    let bestTop = Number.POSITIVE_INFINITY;
    for (const [el, meta] of sectionEntries) {
      if (meta.rootTop < bestTop) { bestTop = meta.rootTop; best = el; }
    }
    const raw = best?.getAttribute('data-scene');
    const next: SceneStateName = isSceneName(raw) ? raw : routeDefault(window.location.pathname);
    if (next !== targetScene) targetScene = next;
  }, {});

  function scanSceneSections(): void {
    for (const el of Array.from(document.querySelectorAll('[data-scene]'))) {
      if (!sectionEntries.has(el)) {
        sectionEntries.set(el, { rootTop: Number.POSITIVE_INFINITY });
        sceneObserver.observe(el);
      }
    }
    for (const [el] of sectionEntries) {
      if (!document.contains(el)) {
        sceneObserver.unobserve(el);
        sectionEntries.delete(el);
      }
    }
  }

  function onPageLoadScene(): void {
    scanSceneSections();
    targetScene = routeDefault(window.location.pathname);
  }
  document.addEventListener('astro:page-load', onPageLoadScene);
  scanSceneSections();

  // ── Pointer (parallax + repel) ──
  const pointer = { x: 0, y: 0 };
  let pointerActive = false;
  function onPointerMove(e: PointerEvent): void {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    pointerActive = true;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // ── Scroll speedup ──
  let scrollVel = 0;
  let lastScrollY = window.scrollY;
  let scrollTicking = false;
  function onScroll(): void {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollVel = Math.min(Math.abs(dy) * 0.02, 3);
      scrollTicking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function onResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    dotMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }
  window.addEventListener('resize', onResize);

  // ── Visibility (pause when hidden) ──
  let tabVisible = !document.hidden;
  function onVisibility(): void {
    tabVisible = !document.hidden;
  }
  document.addEventListener('visibilitychange', onVisibility);

  // ══════════════════════════════════════════════════════════════════════
  // RENDER LOOP
  // ══════════════════════════════════════════════════════════════════════
  const clock = new THREE.Clock();
  let rafId = 0;

  const BASE_SPEED = 3.0;     // idle drift units/sec
  const BURST_SPEED = 150;    // peak forward speed at warp apex
  const SCROLL_SPEED = 40;    // extra speed per scrollVel unit
  const MOOD_LERP = 1 - Math.pow(0.12, 1 / 60); // ~0.35s ease between scene states

  function render(): void {
    rafId = requestAnimationFrame(render);
    if (!tabVisible) return;

    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.getElapsedTime();

    // ── scene-state morph: ease mood toward the dominant section's target ──
    if (targetScene !== currentScene) {
      currentScene = targetScene;
      const m = SCENE_MOODS[currentScene];
      moodRt = m.rgb[0];
      moodGt = m.rgb[1];
      moodBt = m.rgb[2];
      moodOpacityT = m.opacity;
      moodSpeedT = m.speed;
      moodSoftT = m.softness;
      moodTwinkleAmpT = m.twinkle;
      pingOn = Boolean(m.ping);
      container.dataset.scene = currentScene;
    }
    const moodK = 1 - Math.pow(1 - MOOD_LERP, dt * 60);
    moodR += (moodRt - moodR) * moodK;
    moodG += (moodGt - moodG) * moodK;
    moodB += (moodBt - moodB) * moodK;
    moodOpacity += (moodOpacityT - moodOpacity) * moodK;
    moodSpeed += (moodSpeedT - moodSpeed) * moodK;
    moodSoft += (moodSoftT - moodSoft) * moodK;
    moodTwinkleAmp += (moodTwinkleAmpT - moodTwinkleAmp) * moodK;
    const tintDelta = Math.abs(moodRt - moodR) + Math.abs(moodGt - moodG) + Math.abs(moodBt - moodB);
    if (tintDelta > 0.003) {
      for (let i = 0; i < COUNT * 3; i++) {
        dotColors[i] = baseColors[i] * ((i % 3 === 0) ? moodR : (i % 3 === 1) ? moodG : moodB) * softMult[Math.floor(i / 3)];
      }
      (dotGeo.attributes.color as ThreeNS.BufferAttribute).needsUpdate = true;
    }
    // radar ping pulse while the signal state is live
    pingEnv = pingOn ? Math.max(0, Math.sin(time * 1.4) - 0.62) * 2.6 * moodK + pingEnv * (1 - moodK) : pingEnv * 0.9;

    // advance warp + fade
    if (warp < 1) {
      warp = Math.min(warp + dt / warpDur, 1);
    }
    fade += (fadeTarget - fade) * 0.08;

    // decay scroll velocity + integrate page-transition drift, then ease back to center
    scrollVel *= 0.92;
    panX += driftVelX * dt;
    panY += driftVelY * dt;
    driftVelX *= Math.pow(0.05, dt);
    driftVelY *= Math.pow(0.05, dt);
    panX *= Math.pow(0.2, dt);
    panY *= Math.pow(0.2, dt);

    const warpEase = easeOutCubic(1 - warp); // 1 at start → 0 when settled
    const forward = moodSpeed * BASE_SPEED + BURST_SPEED * warpEase + SCROLL_SPEED * scrollVel;

    // pointer world target for repel (at a mid depth plane)
    const repelWorldX = pointer.x * 30;
    const repelWorldY = pointer.y * 18;

    let posIdx = 0;
    let strIdx = 0;
    const streakActive = forward > 14;

    for (let i = 0; i < COUNT; i++) {
      // advance depth toward camera; wrap to the back
      posZ[i] += forward * speed[i] * dt;
      if (posZ[i] > NEAR) {
        posZ[i] -= DEPTH + NEAR;
        repelX[i] = 0;
        repelY[i] = 0;
      }

      // cursor repel (spring toward offset when near pointer)
      if (pointerActive) {
        const dx = homeX[i] + repelX[i] - repelWorldX;
        const dy = homeY[i] + repelY[i] - repelWorldY;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120) {
          const d = Math.sqrt(d2) || 0.001;
          const force = (1 - d / 11) * 6;
          repelX[i] += (dx / d) * force * dt * 10;
          repelY[i] += (dy / d) * force * dt * 10;
        }
        repelX[i] *= 0.92;
        repelY[i] *= 0.92;
      }

      // burst radial expansion: stars start pulled toward center, expand home.
      // Page-transition drift: lateral velocity nudges the whole field sideways.
      const expand = 0.12 + 0.88 * easeOutCubic(warp);
      posX[i] = (homeX[i] + repelX[i]) * expand + panX;
      posY[i] = (homeY[i] + repelY[i]) * expand + panY;

      dotPositions[posIdx] = posX[i];
      dotPositions[posIdx + 1] = posY[i];
      dotPositions[posIdx + 2] = posZ[i];
      posIdx += 3;

      if (streakActive) {
        const tail = Math.min((forward - 12) * 0.06, 6) * speed[i];
        const c = STAR_COLORS[starClass[i]];
        streakPositions[strIdx] = posX[i];
        streakPositions[strIdx + 1] = posY[i];
        streakPositions[strIdx + 2] = posZ[i];
        streakPositions[strIdx + 3] = posX[i];
        streakPositions[strIdx + 4] = posY[i];
        streakPositions[strIdx + 5] = posZ[i] - tail;
        // head bright, tail fades
        streakColors[strIdx] = c[0];
        streakColors[strIdx + 1] = c[1];
        streakColors[strIdx + 2] = c[2];
        streakColors[strIdx + 3] = c[0] * 0.05;
        streakColors[strIdx + 4] = c[1] * 0.05;
        streakColors[strIdx + 5] = c[2] * 0.05;
      }
      strIdx += 6;
    }

    (dotGeo.attributes.position as ThreeNS.BufferAttribute).needsUpdate = true;
    (streakGeo.attributes.position as ThreeNS.BufferAttribute).needsUpdate = true;
    (streakGeo.attributes.color as ThreeNS.BufferAttribute).needsUpdate = true;

    // fade streaks in/out with speed; keep dots always present
    const streakTarget = streakActive ? Math.min((forward - 12) / 30, 0.8) : 0;
    streakMat.opacity += (streakTarget - streakMat.opacity) * 0.2;

    dotMat.uniforms.uTime.value = time;
    dotMat.uniforms.uSoft.value = moodSoft;
    dotMat.uniforms.uTwAmp.value = moodTwinkleAmp;
    dotMat.uniforms.uOpacity.value = fade * moodOpacity * (0.45 + 0.55 * easeOutCubic(warp)) * (1 + pingEnv * 0.6);

    // camera parallax (gentle) + page-transition pan + tiny drift for life
    camera.position.x += (pointer.x * 3 + panX - camera.position.x) * 0.06;
    camera.position.y += (pointer.y * 2 + panY - camera.position.y) * 0.04;
    camera.lookAt(panX * 0.6, panY * 0.6, -50);

    renderer.render(scene, camera);
  }

  clock.start();
  render();

  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener('astro:page-load', onPageLoad);
    document.removeEventListener('astro:page-load', onPageLoadScene);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    sceneObserver.disconnect();

    dotGeo.dispose();
    dotTexture.dispose();
    dotMat.dispose();
    streakGeo.dispose();
    streakMat.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

// ── React component (mounts once from BaseLayout, survives ClientRouter) ──
export function GlobalScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!shouldUseWebGL()) {
      container.classList.add('scene-fallback');
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import('three').then((THREE) => {
      if (cancelled || !containerRef.current) return;
      try {
        cleanup = initEngine(THREE, containerRef.current);
      } catch {
        containerRef.current.classList.add('scene-fallback');
      }
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="global-scene"
      aria-hidden="true"
      className="scene-layer pointer-events-none fixed inset-0 z-0 hidden select-none md:block"
    />
  );
}
