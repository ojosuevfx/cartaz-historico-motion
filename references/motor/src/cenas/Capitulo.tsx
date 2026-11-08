import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EOUT, F, NomeLetras, k, lerp} from '../kit';

// CARD DE CAPÍTULO, na troca de assunto: fundo de cartaz laranja texturizado com fios/ornamentos creme,
// zoom in contínuo, figura P&B em cada lateral (a da direita mais perto: parallax maior),
// "capítulo 0X" pequeno + título grande entre elas, letras espalhadas.
export const Capitulo: React.FC<{
  T: number; t0: number; t1: number; bg: string; num: string; titulo: string[];
  esq?: {src: string; h: number}; dir?: {src: string; h: number}; tx?: number; ty?: number; tsize?: number;
}> = ({T, t0, t1, bg, num, titulo, esq, dir, tx = 700, ty = 380, tsize = 150}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  const entra = k(T, t0, 0.5, EOUT);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.lar}}>
      {/* fundo: zoom in lento */}
      <Img src={staticFile(bg)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.02, 1.12, q)})`}} />
      {/* título no vão entre as figuras, atrás da figura da direita */}
      <div style={{position: 'absolute', left: tx, top: ty, transform: `scale(${lerp(0.97, 1.05, q)})`, transformOrigin: '0 50%'}}>
        <div style={{position: 'relative'}}>
          <div style={{position: 'absolute', left: titulo[0].length <= 3 ? tsize * 0.95 : 0, top: titulo[0].length <= 3 ? 44 + tsize * 0.28 : -6, fontFamily: "'Archivo', Arial", fontWeight: 500, fontSize: 40, color: F.paper, opacity: k(T, t0 + 0.35, 0.4)}}>{num ? `capítulo ${num}` : ''}</div>
          <div style={{paddingTop: 44}}>
            <NomeLetras T={T} t0={t0 + 0.45} linhas={titulo} size={tsize} color={F.paper} seed={`cap${num}`} dur={0.9} lh={0.88} />
          </div>
        </div>
      </div>
      {/* figuras P&B nas laterais, em primeiro plano */}
      {esq ? (
        <div style={{position: 'absolute', left: lerp(70, 40, q), bottom: -20, transform: `translateX(${(1 - entra) * -80}px) scale(${lerp(1, 1.06, q)})`, transformOrigin: '50% 100%'}}>
          <Img src={staticFile(esq.src)} style={{height: esq.h, display: 'block', filter: 'url(#pb) contrast(1.12) drop-shadow(0 20px 30px rgba(0,0,0,0.3))'}} />
        </div>
      ) : null}
      {dir ? (
        <div style={{position: 'absolute', right: lerp(-130, -170, q), bottom: -60, transform: `translateX(${(1 - entra) * 120}px) scale(${lerp(1.02, 1.12, q)})`, transformOrigin: '50% 100%'}}>
          <Img src={staticFile(dir.src)} style={{height: dir.h, display: 'block', filter: 'url(#pb) contrast(1.12) drop-shadow(0 20px 30px rgba(0,0,0,0.3))'}} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
