import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EOUT, Etiqueta, F, NomeLetras, S, k, lerp} from '../kit';

// PAINEL DE GRUPO — só com MAIS DE UMA pessoa: alguém já citado + alguém novo que a fala não aprofunda.
// As figuras (recortes P&B) ficam lado a lado embaixo; o painel laranja sobe por trás e termina RENTE aos ombros
// das figuras das pontas. Texto do painel entra letra a letra.
export type FiguraGrupo = {src: string; ar: number; nome: string; nomeT: number; hf?: number}; // hf = altura relativa (bustos mais fechados) // ar = largura/altura do recorte
export const CenaPainelGrupo: React.FC<{T: number; t0: number; figuras: FiguraGrupo[]; linhas: {txt: string; t: number; size: number; cor?: string}[]; h?: number; sobrepoe?: number}> = ({T, t0, figuras, linhas, h = 700, sobrepoe = 0.12}) => {
  const sobe = k(T, t0 + 0.05, 0.7, S);
  const drift = k(T, t0, 6, (q) => q);
  const ws = figuras.map((f) => f.ar * h * (f.hf ?? 1));
  const passo = ws.map((w) => w * (1 - sobrepoe));
  const total = passo.reduce((a, b) => a + b, 0) + ws[ws.length - 1] * sobrepoe;
  const x0 = 960 - total / 2;
  const painelTop = 60;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.paper}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 75% at 50% 45%, rgba(255,252,240,0.7) 0%, transparent 60%, rgba(120,90,50,0.22) 100%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${lerp(1, 1.035, drift)})`, transformOrigin: '50% 100%'}}>
        {/* painel: mesma largura do grupo (ombro a ombro) */}
        <div style={{position: 'absolute', left: x0, width: total, top: painelTop + (1080 - painelTop) * (1 - sobe), height: 1080 - painelTop + 20}}>
          <div style={{position: 'absolute', inset: 0, background: F.lar}} />
          <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.55}}>
            <filter id="grao-painel"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={7} /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="table" tableValues="0 0.9" /></feComponentTransfer></filter>
            <rect width="100%" height="100%" filter="url(#grao-painel)" />
          </svg>
          <div style={{position: 'absolute', left: 40, right: 40, top: 44}}>
            {linhas.map((l, i) => (
              <NomeLetras key={i} T={T} t0={l.t} linhas={[l.txt]} size={l.size} color={l.cor ?? F.paper} seed={`pg${i}${l.txt}`} dur={0.7} lh={0.95} />
            ))}
          </div>
        </div>
        {/* figuras */}
        {figuras.map((f, i) => {
          const x = x0 + passo.slice(0, i).reduce((a, b) => a + b, 0);
          const q = k(T, t0 + i * 0.12, 0.6, EOUT);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: 1080 - h * (f.hf ?? 1), width: ws[i], height: h * (f.hf ?? 1), transform: `translateY(${(1 - q) * 60}px)`, opacity: q}}>
              <Img src={staticFile(f.src)} style={{width: '100%', height: '100%', display: 'block', filter: 'url(#pb) contrast(1.15)'}} />
              <div style={{position: 'absolute', left: '50%', bottom: h * (f.hf ?? 1) * 0.16, transform: 'translateX(-50%)'}}>
                <Etiqueta T={T} t0={f.nomeT} text={f.nome} size={28} bg={F.larEsc} color={F.paper} font="'Archivo', Arial, sans-serif" />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
