import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F, GROT, NomeLetras, S, k, lerp} from '../kit';

// DATAS E ACONTECIMENTOS: pintura de época do fato em tela cheia, colorida, com pan lento;
// lugares/fato em grotesca branca empilhada entrando letra a letra; anos em blocos de cor ligados por pontilhado.
export type LinhaEv = {txt: string; t: number; size: number};
export type AnoEv = {ano: string; t: number};

const BlocoAno: React.FC<{T: number; t: number; ano: string; size: number}> = ({T, t, ano, size}) => {
  const abre = k(T, t, 0.35, S);
  return (
    <div style={{position: 'relative', display: 'inline-block', height: size * 0.95, padding: `0 ${size * 0.08}px`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: F.lar, transformOrigin: 'left', transform: `scaleX(${abre})`}} />
      <div style={{position: 'relative', display: 'flex'}}>
        {ano.replace(/ /g, ' ').split('').map((d, i) => {
          const q = k(T, t + 0.12 + i * 0.1, 0.3, S);
          return <span key={i} style={{display: 'inline-block', fontFamily: GROT, fontSize: size, lineHeight: `${size * 0.95}px`, color: F.branco, letterSpacing: '-0.04em', transform: `translateY(${(1 - q) * size}px)`}}>{d}</span>;
        })}
      </div>
    </div>
  );
};

export const Evento: React.FC<{T: number; t0: number; t1: number; src: string; linhas: LinhaEv[]; anos?: AnoEv[]; x?: number; y?: number; pan?: [number, number]; zoom?: [number, number]; pos?: string; extra?: React.ReactNode; sombra?: number; dur?: number; anoSize?: number}> = ({T, t0, t1, src, linhas, anos = [], x = 120, y = 200, pan = [30, -30], zoom = [1.06, 1.14], pos = '50% 50%', extra, sombra = 0.45, dur = 0.75, anoSize = 130}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.ink}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos,
        transform: `translateX(${lerp(pan[0], pan[1], q)}px) scale(${lerp(zoom[0], zoom[1], q)})`, filter: 'saturate(0.9) contrast(1.02)'}} />
      {/* leve escurecimento do lado do texto */}
      <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(22,17,14,${sombra}) 0%, rgba(22,17,14,${sombra * 0.27}) 50%, transparent 75%)`}} />
      <div style={{position: 'absolute', left: x, top: y}}>
        {linhas.map((l, i) => (
          <NomeLetras key={i} T={T} t0={l.t} linhas={[l.txt]} size={l.size} color={F.branco} seed={`ev${i}${l.txt}`} dur={dur} lh={0.98} />
        ))}
        {anos.length ? (
          <div style={{display: 'flex', alignItems: 'center', marginTop: 16}}>
            {anos.map((a, i) => (
              <React.Fragment key={i}>
                {i > 0 ? <div style={{width: 120 * k(T, a.t - 0.25, 0.3), height: 6, margin: '0 6px', background: `repeating-linear-gradient(90deg, ${F.branco} 0 6px, transparent 6px 12px)`}} /> : null}
                <BlocoAno T={T} t={a.t} ano={a.ano} size={anoSize} />
              </React.Fragment>
            ))}
          </div>
        ) : null}
        {extra}
      </div>
    </AbsoluteFill>
  );
};
