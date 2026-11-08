import React from 'react';
import {Easing, Img, interpolate, staticFile} from 'remotion';
import {CamKey, Stage} from './palco';

// ======================================================================
// KIT COLAGEM — explicações: papel claro, grotesca preta + mono, blocos com textura de impressão,
// fios finos que se desenham e marcas de construção, câmera 3D suave.
// ======================================================================
export {Stage};
export type {CamKey};

export const C = {
  ink: '#16110E',
  inkSoft: 'rgba(22,17,14,0.55)',
  hair: 'rgba(22,17,14,0.42)',
  grafite: '#4A443E',
  vinho: '#7E2328',
  lar: '#E0662A',
  paper: '#ECE6DA',
};
export const GROT = "'Archivo Black', 'Archivo', Arial, sans-serif";
export const MONO = "'Roboto Mono', Consolas, monospace";

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const EOUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EIN = Easing.bezier(0.7, 0, 0.84, 0);
export const S = Easing.bezier(0.65, 0, 0.35, 1);
export const LIN = (q: number) => q;
export const k = (T: number, a: number, d = 0.6, e = EOUT) => interpolate(T, [a, a + d], [0, 1], {...clamp, easing: e});
export const lerp = (a: number, b: number, q: number) => a + (b - a) * q;
export const mix = (a: string, b: string, q: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], q))).join(',')})`;
};

// ---------- primitivas ----------
export const At: React.FC<{x: number; y: number; z?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({x, y, z = 0, children, style}) => (
  <div style={{position: 'absolute', left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, ${z}px)`, transformStyle: 'preserve-3d', ...style}}>{children}</div>
);

export const Bloco: React.FC<{x: number; y: number; w: number; h?: number; color: string; o?: number; s?: number; rot?: number}> = ({x, y, w, h, color, o = 1, s = 1, rot = 0}) => (
  o <= 0.001 ? null : (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h ?? w, opacity: o, transform: `scale(${s}) rotate(${rot}deg)`, background: color, overflow: 'hidden'}}>
      <Img src={staticFile('tex/impressao.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: 0.55}} />
      <Img src={staticFile('tex/impressao.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'screen', opacity: 0.18, transform: 'scaleX(-1)'}} />
    </div>
  )
);

type Pt = [number, number];
// fio fino que se desenha (divs: SVG com overflow sai deslocado no palco 3D escalado)
export const Fio: React.FC<{pts: Pt[]; kk: number; w?: number; color?: string; arrow?: boolean; dash?: boolean}> = ({pts, kk, w = 2, color = C.ink, arrow, dash}) => {
  if (kk <= 0) return null;
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const L = segs.reduce((a, b) => a + b, 0);
  let rem = L * kk;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < segs.length && rem > 0; i++) {
    const q = Math.min(1, rem / segs[i]);
    out.push([lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]);
    rem -= segs[i];
  }
  const tip = out[out.length - 1], prev = out[out.length - 2] ?? pts[0];
  const ang = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  const bg = dash ? `repeating-linear-gradient(90deg, ${color} 0 6px, transparent 6px 12px)` : color;
  return (
    <>
      {out.slice(1).map((p, i) => {
        const a = out[i];
        const len = Math.hypot(p[0] - a[0], p[1] - a[1]);
        const an = Math.atan2(p[1] - a[1], p[0] - a[0]);
        return <div key={i} style={{position: 'absolute', left: a[0], top: a[1] - w / 2, width: len + (i < out.length - 2 ? w / 2 : 0), height: w, background: bg,
          transformOrigin: `0 ${w / 2}px`, transform: `rotate(${an}rad)`}} />;
      })}
      {arrow && kk > 0.98 ? (
        <div style={{position: 'absolute', left: tip[0] - 14, top: tip[1] - 7, width: 14, height: 14, background: color,
          clipPath: 'polygon(100% 50%, 0 0, 0 100%)', transformOrigin: '100% 50%', transform: `rotate(${ang}rad)`}} />
      ) : null}
    </>
  );
};

export const Cruz: React.FC<{x: number; y: number; kk: number; s?: number}> = ({x, y, kk, s = 12}) => (
  kk <= 0 ? null : (
    <div style={{position: 'absolute', left: x - s, top: y - s, width: s * 2, height: s * 2, opacity: kk, transform: `scale(${lerp(0.4, 1, kk)})`}}>
      <div style={{position: 'absolute', left: s - 0.75, top: 0, width: 1.5, height: s * 2, background: C.ink}} />
      <div style={{position: 'absolute', top: s - 0.75, left: 0, height: 1.5, width: s * 2, background: C.ink}} />
    </div>
  )
);

export const Milimetrado: React.FC<{x: number; y: number; w: number; h: number; kk: number}> = ({x, y, w, h, kk}) => (
  kk <= 0 ? null : (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: 0.5 * kk,
      backgroundImage: `linear-gradient(${C.hair} 1px, transparent 1px), linear-gradient(90deg, ${C.hair} 1px, transparent 1px)`, backgroundSize: '22px 22px',
      WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 30%, transparent 75%)', maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 30%, transparent 75%)',
      clipPath: `inset(0 ${(1 - kk) * 100}% 0 0)`}} />
  )
);

// caixa de destaque
export const Caixa: React.FC<{x: number; y: number; kk: number; text: string; size?: number; anchor?: 'left' | 'right' | 'center'; bg?: string; color?: string}> = ({x, y, kk, text, size = 46, anchor = 'left', bg = C.lar, color = C.ink}) => (
  kk <= 0 ? null : (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(${anchor === 'right' ? '-100%' : anchor === 'center' ? '-50%' : '0'}, -50%)`}}>
      <div style={{position: 'relative', background: bg, padding: `${size * 0.22}px ${size * 0.43}px ${size * 0.26}px`, clipPath: `inset(0 ${(1 - kk) * 100}% 0 0)`}}>
        <Img src={staticFile('tex/impressao.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: 0.22}} />
        <div style={{position: 'relative', fontFamily: GROT, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', letterSpacing: '-0.01em'}}>{text}</div>
      </div>
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => (
        <div key={i} style={{position: 'absolute', left: `${a * 100}%`, top: `${b * 100}%`, width: 18, height: 18, opacity: k(kk, 0.6, 0.4),
          transform: `translate(${a ? -4 : -14}px, ${b ? -4 : -14}px)`,
          borderLeft: a ? undefined : `1.5px solid ${C.ink}`, borderRight: a ? `1.5px solid ${C.ink}` : undefined,
          borderTop: b ? undefined : `1.5px solid ${C.ink}`, borderBottom: b ? `1.5px solid ${C.ink}` : undefined}} />
      ))}
    </div>
  )
);

// mono que se escreve
export const Mono: React.FC<{text: string; kk: number; size?: number; color?: string; style?: React.CSSProperties}> = ({text, kk, size = 22, color = C.ink, style}) => {
  const n = Math.round(text.length * Math.max(0, Math.min(1, kk)));
  return (
    <div style={{fontFamily: MONO, fontSize: size, color, whiteSpace: 'pre', letterSpacing: '0.02em', ...style}}>
      {text.slice(0, n)}
      <span style={{opacity: 0}}>{text.slice(n)}</span>
    </div>
  );
};

// grotesco que entra palavra por palavra (cada palavra no seu tempo de fala)
export const Palavras: React.FC<{T: number; items: [string, number][]; size: number; color?: string; style?: React.CSSProperties; hl?: number[]; hlK?: number}> = ({T, items, size, color = C.ink, style, hl = [], hlK = 0}) => (
  <div style={{fontFamily: GROT, fontSize: size, lineHeight: 1.04, color, letterSpacing: '-0.015em', whiteSpace: 'nowrap', ...style}}>
    {items.map(([w, t], i) => {
      const q = k(T, t - 0.06, 0.35, S);
      const isHl = hl.includes(i);
      return (
        <span key={i} style={{position: 'relative', display: 'inline-block', marginRight: '0.24em', opacity: q, transform: `translateY(${(1 - q) * size * 0.25}px)`}}>
          {isHl ? <span style={{position: 'absolute', left: '-0.08em', right: '-0.08em', top: '0.1em', bottom: '0.02em', background: C.lar, transformOrigin: 'left', transform: `scaleX(${hlK})`, zIndex: 0}} /> : null}
          <span style={{position: 'relative'}}>{w}</span>
        </span>
      );
    })}
  </div>
);

// foto de colagem: P&B desbotada, some no papel
export const Foto: React.FC<{src: string; w: number; h: number; kk: number; mask?: string; fade?: number; contrast?: number; bright?: number}> = ({src, w, h, kk, mask, fade = 0.82, contrast = 0.78, bright = 1.32}) => {
  if (kk <= 0) return null;
  const m = mask ?? 'radial-gradient(ellipse 52% 54% at 50% 46%, #000 45%, transparent 92%)';
  return (
    <div style={{position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, opacity: kk * fade, transform: `translateY(${(1 - kk) * 60}px)`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply',
        filter: `grayscale(1) contrast(${contrast}) brightness(${bright})`, WebkitMaskImage: m, maskImage: m}} />
    </div>
  );
};

// ---------- título fixo na tela ----------
export type Tit = {t: number; title: string; src?: string; srcT?: number};
export const Titulo: React.FC<{T: number; items: Tit[]; ruleAt: number; size?: number}> = ({T, items, ruleAt, size = 60}) => {
  let i = -1;
  items.forEach((x, n) => { if (T >= x.t - 0.05) i = n; });
  const rule = k(T, ruleAt, 0.7, S);
  return (
    <div style={{position: 'absolute', left: 150, top: 92}}>
      <div style={{position: 'absolute', left: -26, top: -22, width: 1.5, height: 150 * rule, background: C.ink}} />
      <div style={{position: 'absolute', left: -60, top: 80, height: 1.5, width: 1000 * rule, background: C.ink}} />
      {items.map((x, n) => {
        if (n !== i && n !== i - 1) return null;
        const inn = k(T, x.t - 0.05, 0.55, S);
        const out = n === i - 1 ? k(T, items[i].t - 0.05, 0.35, EIN) : 0;
        if (out >= 1) return null;
        return (
          <div key={n} style={{position: 'absolute', left: 0, top: 0}}>
            <div style={{fontFamily: GROT, fontSize: size, lineHeight: 1, color: C.ink, whiteSpace: 'nowrap', letterSpacing: '-0.015em',
              clipPath: `inset(-10px ${(1 - inn) * 100}% -10px ${out * 100}%)`, transform: `translateY(${-out * 8}px)`}}>{x.title}</div>
            {x.src ? (
              <div style={{position: 'absolute', top: 98, opacity: 1 - out}}>
                <Mono text={x.src} kk={k(T, x.srcT ?? x.t + 0.4, 0.7, LIN)} size={26} color={C.inkSoft} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
