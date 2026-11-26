import { useEffect, useMemo } from 'react';
import { CanvasTexture, NearestFilter, RepeatWrapping, SRGBColorSpace } from 'three';

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

/** A texture painted once on a 2D canvas: no image downloads, no loading states. */
export function useCanvasTexture(draw: Draw, width = 256, height = 256, opts: { pixelated?: boolean; repeat?: [number, number] } = {}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) draw(ctx, width, height);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    if (opts.pixelated) {
      tex.magFilter = NearestFilter;
      tex.minFilter = NearestFilter;
      tex.generateMipmaps = false;
    }
    if (opts.repeat) {
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(opts.repeat[0], opts.repeat[1]);
    }
    return tex;
    // Draw functions are static module-level painters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** Deterministic pseudo-random numbers so the room looks the same on every visit. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const drawPlanks: Draw = (ctx, w, h) => {
  const rand = seeded(7);
  const rows = 8;
  const rowH = h / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand() * 120;
    while (x < w) {
      const len = 110 + rand() * 120;
      const l = 58 + rand() * 9;
      ctx.fillStyle = `hsl(${32 + rand() * 6} 62% ${l + 8}%)`;
      ctx.fillRect(x, r * rowH, len, rowH);
      ctx.fillStyle = 'rgba(90,50,25,0.28)';
      ctx.fillRect(x, r * rowH, 2, rowH);
      x += len;
    }
    ctx.fillStyle = 'rgba(90,50,25,0.3)';
    ctx.fillRect(0, r * rowH, w, 2);
  }
};

export const drawWallDots: Draw = (ctx, w, h) => {
  ctx.fillStyle = '#f8e6d3';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(226,114,91,0.13)';
  for (let y = 0; y < 4; y++)
    for (let x = 0; x < 4; x++) {
      ctx.beginPath();
      ctx.arc((x + (y % 2 ? 0.5 : 0)) * (w / 4) + w / 8, y * (h / 4) + h / 8, w / 36, 0, Math.PI * 2);
      ctx.fill();
    }
};

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.38 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

/** The painting on the easel: a round, starry-eyed little character. */
export const drawPainting: Draw = (ctx, w, h) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#ffd9a8');
  g.addColorStop(0.6, '#f7a8a0');
  g.addColorStop(1, '#b98bc9');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // sun
  ctx.fillStyle = 'rgba(255,246,220,0.85)';
  ctx.beginPath();
  ctx.arc(w * 0.72, h * 0.24, w * 0.16, 0, Math.PI * 2);
  ctx.fill();
  // hills
  ctx.fillStyle = '#7a5aa0';
  ctx.beginPath();
  ctx.ellipse(w * 0.2, h * 1.02, w * 0.6, h * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5f8f7d';
  ctx.beginPath();
  ctx.ellipse(w * 0.85, h * 1.04, w * 0.6, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  // character
  const cx = w * 0.44;
  const cy = h * 0.62;
  ctx.fillStyle = '#fff6ea';
  ctx.beginPath();
  ctx.ellipse(cx, cy, w * 0.2, h * 0.17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - w * 0.11, cy - h * 0.2, w * 0.045, h * 0.1, -0.2, 0, Math.PI * 2);
  ctx.ellipse(cx + w * 0.09, cy - h * 0.2, w * 0.045, h * 0.1, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3b2a3a';
  ctx.beginPath();
  ctx.arc(cx - w * 0.07, cy - h * 0.02, w * 0.022, 0, Math.PI * 2);
  ctx.arc(cx + w * 0.07, cy - h * 0.02, w * 0.022, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f08fa0';
  ctx.beginPath();
  ctx.arc(cx - w * 0.12, cy + h * 0.035, w * 0.028, 0, Math.PI * 2);
  ctx.arc(cx + w * 0.12, cy + h * 0.035, w * 0.028, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3b2a3a';
  ctx.lineWidth = w * 0.012;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy + h * 0.02, w * 0.03, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  star(ctx, w * 0.16, h * 0.2, w * 0.05, '#fff6c9');
  star(ctx, w * 0.3, h * 0.1, w * 0.028, '#fff6c9');
  star(ctx, w * 0.86, h * 0.56, w * 0.035, '#fff6c9');
};

/** A tiny landscape for each polaroid, varied by index. */
export function drawPolaroid(index: number): Draw {
  const skies = [
    ['#ffcf9e', '#f58f7c'],
    ['#a9d6e5', '#f6e7c1'],
    ['#c9b6e4', '#f7b7a3'],
    ['#9bd3c1', '#f5e6a8'],
    ['#f7c59f', '#8fb5d9'],
  ];
  return (ctx, w, h) => {
    const [a, b] = skies[index % skies.length];
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, a);
    g.addColorStop(1, b);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const rand = seeded(index * 31 + 5);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(w * (0.25 + rand() * 0.5), h * (0.25 + rand() * 0.2), w * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(59,42,58,0.75)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    let x = 0;
    while (x <= w) {
      ctx.lineTo(x, h * (0.6 + rand() * 0.22));
      x += w / 6;
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  };
}

/** Wall poster with big friendly lettering. */
export function drawPoster(lines: string[], bg: string, fg: string, accent: string): Draw {
  return (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(w * 0.72, h * 0.3, w * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(w * 0.3, h * 0.46, w * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.font = `800 ${Math.round(w * 0.15)}px Georgia, serif`;
    ctx.textBaseline = 'alphabetic';
    lines.forEach((line, i) => ctx.fillText(line, w * 0.08, h * 0.74 + i * w * 0.16));
  };
}

/** A child's crayon drawing: wobbly flowers under a scribbled sun. */
export const drawCrayon: Draw = (ctx, w, h) => {
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(0, 0, w, h);
  const rand = seeded(23);
  ctx.lineCap = 'round';
  const scribble = (x: number, y: number, r: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w * 0.022;
    ctx.beginPath();
    for (let i = 0; i < 26; i++) {
      const a = i * 0.9;
      const rr = r * (0.25 + (i / 26) * 0.75);
      ctx.lineTo(x + Math.cos(a) * rr + (rand() - 0.5) * 3, y + Math.sin(a) * rr + (rand() - 0.5) * 3);
    }
    ctx.stroke();
  };
  scribble(w * 0.78, h * 0.18, w * 0.11, '#f2b63c');
  ['#e2725b', '#8e6aa8', '#e79bb0', '#5d7bd5'].forEach((c, i) => {
    const x = w * (0.16 + i * 0.22);
    const top = h * (0.42 + (i % 2) * 0.1);
    ctx.strokeStyle = '#5f9a63';
    ctx.lineWidth = w * 0.02;
    ctx.beginPath();
    ctx.moveTo(x, h * 0.9);
    ctx.quadraticCurveTo(x + (i % 2 ? 10 : -10), h * 0.7, x, top);
    ctx.stroke();
    scribble(x, top, w * 0.085, c);
  });
  ctx.strokeStyle = '#5f9a63';
  ctx.lineWidth = w * 0.025;
  ctx.beginPath();
  for (let x = 0; x <= w; x += w / 14) ctx.lineTo(x, h * 0.92 + (rand() - 0.5) * h * 0.04);
  ctx.stroke();
};

/** Botanical print: a single stem of leaves on cream paper. */
export function drawLeafPrint(variant: string): Draw {
  return (ctx, w, h) => {
    ctx.fillStyle = '#fbf3e4';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#4f7a52';
    ctx.fillStyle = variant === 'fern' ? '#6fa06f' : '#8fb58a';
    ctx.lineWidth = w * 0.02;
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.9);
    ctx.lineTo(w / 2, h * 0.14);
    ctx.stroke();
    const pairs = variant === 'fern' ? 7 : 4;
    for (let i = 0; i < pairs; i++) {
      const y = h * (0.78 - (i / pairs) * 0.6);
      const len = w * (variant === 'fern' ? 0.3 - i * 0.03 : 0.26);
      for (const dir of [-1, 1]) {
        ctx.save();
        ctx.translate(w / 2, y);
        ctx.rotate(dir * -0.55);
        ctx.beginPath();
        ctx.ellipse((dir * len) / 2, 0, len / 2, len * (variant === 'fern' ? 0.16 : 0.3), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  };
}

export const drawPegboard: Draw = (ctx, w, h) => {
  ctx.fillStyle = '#f4e3c4';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(120,80,50,0.35)';
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 12; x++) {
      ctx.beginPath();
      ctx.arc((x + 0.5) * (w / 12), (y + 0.5) * (h / 8), w / 110, 0, Math.PI * 2);
      ctx.fill();
    }
};
