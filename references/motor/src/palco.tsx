import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';

// Palco das explicações: mundo em 3D com câmera que anda devagar e nunca para.
const SMOOTH = Easing.bezier(0.65, 0, 0.35, 1);

// ---------- câmera 3D ----------
export type CamKey = {t: number; x: number; y: number; s: number; rx?: number; ry?: number};
export const camAt = (T: number, keys: CamKey[]) => {
  const f = (c: CamKey) => ({x: c.x, y: c.y, s: c.s, rx: c.rx ?? 0, ry: c.ry ?? 0});
  if (T <= keys[0].t) return f(keys[0]);
  for (let i = 0; i < keys.length - 1; i++) {
    if (T <= keys[i + 1].t) {
      const a = f(keys[i]), b = f(keys[i + 1]);
      const q = SMOOTH((T - keys[i].t) / (keys[i + 1].t - keys[i].t));
      return {x: a.x + (b.x - a.x) * q, y: a.y + (b.y - a.y) * q, s: a.s * Math.pow(b.s / a.s, q), rx: a.rx + (b.rx - a.rx) * q, ry: a.ry + (b.ry - a.ry) * q};
    }
  }
  return f(keys[keys.length - 1]);
};

// palco: perspectiva + mundo em 3D; blur de movimento leve aplicado no palco inteiro
export const Stage: React.FC<{T: number; keys: CamKey[]; extraScale?: number; blurExtra?: number; children: React.ReactNode}> = ({T, keys, extraScale = 1, blurExtra = 0, children}) => {
  const c = camAt(T, keys), c0 = camAt(T - 1 / 30, keys);
  const vel = Math.hypot((c.x - c0.x) * c.s, (c.y - c0.y) * c.s) + Math.abs(Math.log(c.s / c0.s)) * 900;
  const blur = Math.min(2.6, vel * 0.045) + blurExtra;
  const dx = Math.sin(T * 0.33) * 9, dy = Math.cos(T * 0.27) * 6;
  const drx = Math.sin(T * 0.21) * 0.8, dry = Math.cos(T * 0.25) * 1.1;
  return (
    <AbsoluteFill style={{filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
      <AbsoluteFill style={{perspective: 1900, perspectiveOrigin: '50% 48%'}}>
        <div style={{position: 'absolute', left: 960, top: 540, width: 0, height: 0, transformStyle: 'preserve-3d',
          transform: `rotateX(${c.rx + drx}deg) rotateY(${c.ry + dry}deg) scale(${c.s * extraScale}) translate3d(${-c.x + dx}px, ${-c.y + dy}px, 0px)`}}>
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
