/*
 * Halftone: a dot screen drawn on canvas. Each dot's area follows a field value in [0, 1].
 * Fields are plain functions (u, v, t, s) => value, where u/v are 0..1 across the canvas,
 * t is seconds and s carries size, aspect and the pointer. The pointer acts as a light.
 */
(function () {
  'use strict';

  // Smooth value noise, 3D (x, y, time). Small and fast enough for ~15k samples a frame.
  const P = new Uint8Array(512);
  (function seed() {
    const p = Array.from({ length: 256 }, (_, i) => i);
    let s = 1337;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
  })();
  const fade = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const h = (x, y, z) => P[(P[(P[x & 255] + y) & 511] + z) & 511] / 255;
  function noise(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    const fx = fade(x - X), fy = fade(y - Y), fz = fade(z - Z);
    const a = lerp(lerp(h(X, Y, Z), h(X + 1, Y, Z), fx), lerp(h(X, Y + 1, Z), h(X + 1, Y + 1, Z), fx), fy);
    const b = lerp(lerp(h(X, Y, Z + 1), h(X + 1, Y, Z + 1), fx), lerp(h(X, Y + 1, Z + 1), h(X + 1, Y + 1, Z + 1), fx), fy);
    return lerp(a, b, fz);
  }
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const smooth = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function mount(canvas, opts) {
    const o = Object.assign(
      {
        spacing: 9, // px between dot centres
        angle: 45, // screen angle in degrees (45 = classic halftone)
        color: '#000',
        shape: 'circle', // circle | square
        max: 0.98, // largest dot as a share of the cell
        min: 0.04, // values under this draw nothing
        fps: 60,
        pointer: true,
        pointerRadius: 0.18, // share of the canvas width
        pointerGain: -0.6, // negative lifts ink (light), positive adds it
        plates: null, // [{color, field, offset:[x,y]}] for multi-ink prints
        field: () => 0.5,
      },
      opts
    );
    const ctx = canvas.getContext('2d');
    const state = { w: 0, h: 0, dpr: 1, px: -9, py: -9, tx: -9, ty: -9, inside: false, visible: true, t0: performance.now(), raf: 0, last: 0, progress: 0 };

    function resize() {
      const r = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = Math.max(1, r.width);
      state.h = Math.max(1, r.height);
      canvas.width = Math.round(state.w * state.dpr);
      canvas.height = Math.round(state.h * state.dpr);
      draw(now());
    }

    const now = () => (reduced.matches ? 2.4 : (performance.now() - state.t0) / 1000);

    function drawPlate(color, field, off, t) {
      const { w, h: H } = state;
      const sp = o.spacing * (w < 560 ? 1.15 : 1);
      const a = (o.angle * Math.PI) / 180;
      const ca = Math.cos(a), sa = Math.sin(a);
      const diag = Math.hypot(w, H);
      const n = Math.ceil(diag / sp) + 2;
      const cx = w / 2, cy = H / 2;
      const s = { w, h: H, aspect: w / H, px: state.px, py: state.py, progress: state.progress, noise, smooth, clamp };
      const pr = o.pointerRadius * w;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = -n / 2; i < n / 2; i++) {
        for (let j = -n / 2; j < n / 2; j++) {
          const gx = i * sp, gy = j * sp;
          const x = cx + gx * ca - gy * sa + off[0];
          const y = cy + gx * sa + gy * ca + off[1];
          if (x < -sp || y < -sp || x > w + sp || y > H + sp) continue;
          let v = field(x / w, y / H, t, s);
          if (o.pointer && state.inside) {
            const d = Math.hypot(x - state.px * w, y - state.py * H);
            if (d < pr) v += o.pointerGain * (1 - d / pr) ** 2;
          }
          v = clamp(v);
          if (v < o.min) continue;
          // Dot area follows the value, so radius follows its square root.
          const r = Math.sqrt(v) * sp * 0.5 * o.max * (o.shape === 'square' ? 0.9 : 1.08);
          if (o.shape === 'square') {
            ctx.rect(x - r, y - r, r * 2, r * 2);
          } else {
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
    }

    function draw(t) {
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.w, state.h);
      // Ease the pointer so the light glides rather than jumps.
      state.px += (state.tx - state.px) * 0.12;
      state.py += (state.ty - state.py) * 0.12;
      const plates = o.plates || [{ color: o.color, field: o.field, offset: [0, 0] }];
      for (const p of plates) {
        if (p.blend) ctx.globalCompositeOperation = p.blend;
        drawPlate(p.color, p.field, p.offset || [0, 0], t);
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    function loop(ts) {
      state.raf = 0;
      if (!state.visible || document.hidden) return;
      if (ts - state.last >= 1000 / o.fps - 2) {
        state.last = ts;
        draw(now());
      }
      if (!reduced.matches || state.inside) state.raf = requestAnimationFrame(loop);
    }
    const kick = () => {
      if (!state.raf) state.raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      state.visible = e.isIntersecting;
      if (state.visible) kick();
    });
    io.observe(canvas);

    const host = o.pointerHost || canvas;
    function move(e) {
      const r = canvas.getBoundingClientRect();
      state.tx = (e.clientX - r.left) / r.width;
      state.ty = (e.clientY - r.top) / r.height;
      if (!state.inside) {
        state.px = state.tx;
        state.py = state.ty;
      }
      state.inside = true;
      kick();
    }
    function leave() {
      state.inside = false;
      kick();
    }
    if (o.pointer) {
      host.addEventListener('pointermove', move, { passive: true });
      host.addEventListener('pointerleave', leave);
    }
    document.addEventListener('visibilitychange', kick);
    resize();
    kick();

    return {
      setProgress(p) {
        state.progress = p;
        if (reduced.matches) draw(now());
        kick();
      },
      redraw: () => draw(now()),
      destroy() {
        cancelAnimationFrame(state.raf);
        ro.disconnect();
        io.disconnect();
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerleave', leave);
        document.removeEventListener('visibilitychange', kick);
      },
    };
  }

  /* Reusable fields ---------------------------------------------------------------------- */

  // A lit sphere: ink is dense at the shadowed rim, thin where the light falls.
  function sphere({ cx = 0.5, cy = 0.5, r = 0.36, light = [-0.45, -0.5], breathe = 0.025, grain = 0.18, invert = false } = {}) {
    return (u, v, t, s) => {
      const rr = r * (1 + breathe * Math.sin(t * 1.1));
      const dx = (u - cx) * s.aspect, dy = v - cy;
      const d = Math.hypot(dx, dy) / rr;
      if (d > 1.04) return 0;
      const z = Math.sqrt(Math.max(0, 1 - d * d));
      const nx = dx / rr, ny = dy / rr;
      const lit = clamp(nx * light[0] + ny * light[1] + z * 0.72);
      const n = (noise(u * 6 * s.aspect, v * 6, t * 0.25) - 0.5) * grain;
      const edge = smooth(1.04, 0.98, d);
      const val = invert ? lit * 0.95 + n : 1 - lit * 0.92 + n;
      return clamp(val) * edge;
    };
  }

  // Concentric rings radiating from a point, like sound leaving a speaker.
  function rings({ cx = 0.5, cy = 0.5, freq = 22, speed = 0.55, falloff = 1.1, core = 0.08 } = {}) {
    return (u, v, t, s) => {
      const dx = (u - cx) * s.aspect, dy = v - cy;
      const d = Math.hypot(dx, dy);
      const wave = 0.5 + 0.5 * Math.sin(d * freq - t * speed * 6);
      const env = clamp(1 - d / falloff);
      const glow = smooth(core * 2.4, 0, d);
      return clamp(wave * wave * env * 0.9 + glow);
    };
  }

  // Drifting fog of noise; useful as a quiet ground.
  function fog({ scale = 3, speed = 0.08, base = 0, gain = 1 } = {}) {
    return (u, v, t, s) => clamp(base + gain * (noise(u * scale * s.aspect, v * scale, t * speed) - 0.35) * 1.6);
  }

  window.Halftone = { mount, sphere, rings, fog, noise, smooth, clamp };
})();
