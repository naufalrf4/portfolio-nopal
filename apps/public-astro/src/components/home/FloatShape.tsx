import { useEffect, useRef } from 'react';
import type * as ThreeNS from 'three';
import { cn } from '@/lib/utils';

type ShapeKind = 'icosahedron' | 'torusKnot' | 'octahedron' | 'ring';

interface FloatShapeProps {
  shape: ShapeKind;
  /** Canvas size in px */
  size?: number;
  className?: string;
}

const THEME_COLORS = {
  dark: { teal: 0x3ed9c4, amber: 0xf2a64c },
  light: { teal: 0x0f8577, amber: 0xb5701e },
} as const;

const SHAPE_SPEED: Record<ShapeKind, { x: number; y: number }> = {
  icosahedron: { x: 0.1, y: 0.16 },
  torusKnot: { x: 0.08, y: 0.12 },
  octahedron: { x: 0.14, y: 0.1 },
  ring: { x: 0.12, y: 0.08 },
};

function buildGeometry(THREE: typeof ThreeNS, shape: ShapeKind): ThreeNS.BufferGeometry {
  switch (shape) {
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(0.72, 0.22, 72, 10);
    case 'octahedron':
      return new THREE.OctahedronGeometry(1, 0);
    case 'ring':
      return new THREE.TorusGeometry(0.85, 0.07, 10, 48);
    case 'icosahedron':
    default:
      return new THREE.IcosahedronGeometry(1, 0);
  }
}

function init(THREE: typeof ThreeNS, container: HTMLDivElement, shape: ShapeKind): () => void {
  const size = container.clientWidth;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
  camera.position.z = 3.1;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size, size);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  container.appendChild(renderer.domElement);

  const theme = THEME_COLORS[currentTheme()];
  const geometry = buildGeometry(THREE, shape);
  const material = new THREE.MeshBasicMaterial({
    color: shape === 'ring' ? theme.amber : theme.teal,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function currentTheme(): 'dark' | 'light' {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  }

  let inViewport = true;
  let tabVisible = !document.hidden;
  let rafId = 0;
  let running = false;

  const clock = new THREE.Clock();
  const speed = SHAPE_SPEED[shape];

  const renderFrame = () => {
    rafId = requestAnimationFrame(renderFrame);
    const elapsed = clock.getElapsedTime();

    // Slow self-rotation + extra roll driven by section position in viewport
    const rect = container.getBoundingClientRect();
    const viewportH = window.innerHeight || 1;
    const progress = 1 - (rect.top + rect.height / 2) / viewportH; // -0.x .. 1.x
    mesh.rotation.x = elapsed * speed.x + progress * 0.9;
    mesh.rotation.y = elapsed * speed.y + progress * 0.6;
    mesh.position.y = Math.sin(elapsed * 0.5) * 0.08;

    renderer.render(scene, camera);
  };

  const syncLoop = () => {
    const shouldRun = inViewport && tabVisible;
    if (shouldRun && !running) {
      running = true;
      clock.start();
      renderFrame();
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  };

  const handleVisibility = () => {
    tabVisible = !document.hidden;
    syncLoop();
  };

  const io = new IntersectionObserver(
    (entries) => {
      inViewport = entries[0]?.isIntersecting ?? true;
      syncLoop();
    },
    { threshold: 0 }
  );
  io.observe(container);

  const themeObserver = new MutationObserver(() => {
    const next = THEME_COLORS[currentTheme()];
    material.color.set(shape === 'ring' ? next.amber : next.teal);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  document.addEventListener('visibilitychange', handleVisibility);
  syncLoop();

  return () => {
    running = false;
    cancelAnimationFrame(rafId);
    io.disconnect();
    themeObserver.disconnect();
    document.removeEventListener('visibilitychange', handleVisibility);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

/**
 * Small decorative wireframe 3D object. One per section, slowly rotating,
 * with extra roll tied to the section's scroll position. Desktop only.
 */
export function FloatShape({ shape, size = 220, className }: FloatShapeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.innerWidth < 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Only load three.js when the section is near the viewport
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        loadObserver.disconnect();
        import('three').then((THREE) => {
          if (cancelled || !containerRef.current) return;
          cleanup = init(THREE, containerRef.current, shape);
        });
      },
      { rootMargin: '200px' }
    );
    loadObserver.observe(container);

    return () => {
      cancelled = true;
      loadObserver.disconnect();
      cleanup?.();
    };
  }, [shape]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute z-0 hidden select-none md:block', className)}
      style={{ width: size, height: size }}
    />
  );
}
