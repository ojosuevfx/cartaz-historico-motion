import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EOUT, F, NomeLetras, S, k, lerp} from '../kit';

// Todas as imagens de pessoa/fato partem de fonte REAL; só o fundo pode ser gerado do zero.

// linha pequena que se DIGITA (máquina de escrever), sem fade nem desfoque
export const Digita: React.FC<{T: number; t0: number; text: string; size?: number; color?: string; cps?: number; style?: React.CSSProperties}> = ({T, t0, text, size = 30, color = F.ink, cps = 34, style}) => {
  const n = T < t0 ? 0 : Math.min(text.length, Math.floor((T - t0) * cps) + 1);
  return (
    <div style={{fontFamily: "'Archivo', Arial", fontWeight: 500, fontSize: size, color, whiteSpace: 'nowrap', letterSpacing: '-0.005em', ...style}}>
      {text.slice(0, n)}<span style={{visibility: 'hidden'}}>{text.slice(n)}</span>
    </div>
  );
};

// fundo de papel com push lento
export const Fundo: React.FC<{T: number; t0: number; t1: number; src: string}> = ({T, t0, t1, src}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  return <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.02, 1.08, q)})`}} />;
};

// MEDALHÃO: retrato real num oval com borda, sobre o fundo com a faixa pintada
export const Medalhao: React.FC<{T: number; t0: number; t1: number; bg: string; src: string; pos?: string; linhas: {pre?: string; txt: string; t: number}[]; apoio?: string; apoioT?: number; size?: number}> = ({T, t0, t1, bg, src, pos = '50% 25%', linhas, apoio, apoioT = 0, size = 150}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  const e = k(T, t0, 0.5, EOUT);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.paper}}>
      <Fundo T={T} t0={t0} t1={t1} src={bg} />
      <div style={{position: 'absolute', left: 230, top: 170, width: 560, height: 740, borderRadius: '50%', overflow: 'hidden',
        border: `10px solid ${F.paper2}`, boxShadow: '0 0 0 3px rgba(60,40,20,0.35), 0 24px 50px rgba(40,25,10,0.3)',
        transform: `scale(${lerp(0.9, 1, e) * lerp(1, 1.04, q)})`, opacity: e}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${lerp(1.05, 1.12, q)})`}} />
      </div>
      <div style={{position: 'absolute', left: 900, top: 330}}>
        {linhas.map((l, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: 10}}>
            {l.pre ? <div style={{fontFamily: "'Archivo', Arial", fontWeight: 600, fontSize: size * 0.22, color: F.larEsc, marginTop: size * 0.08, opacity: T >= l.t ? 1 : 0}}>{l.pre}</div> : null}
            <NomeLetras T={T} t0={l.t} linhas={[l.txt]} size={size} color={F.lar} seed={`md${i}${l.txt}`} dur={0.8} lh={0.92} />
          </div>
        ))}
        {apoio ? <div style={{marginTop: 18}}><Digita T={T} t0={apoioT} text={apoio} size={32} /></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// RECORTE SOBRE O CREME: figura real recortada; título GIGANTE atrás; linha pequena digitada em cima
export const RecorteCreme: React.FC<{T: number; t0: number; t1: number; bg: string; recorte: string; h: number; x: number; titulo: string[]; tituloT: number; tx: number; ty: number; size?: number; apoio?: string; apoioT?: number}> = ({T, t0, t1, bg, recorte, h, x, titulo, tituloT, tx, ty, size = 200, apoio, apoioT = 0}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  const e = k(T, t0, 0.6, S);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.paper}}>
      <Fundo T={T} t0={t0} t1={t1} src={bg} />
      {apoio ? <div style={{position: 'absolute', left: tx + 8, top: ty - 46}}><Digita T={T} t0={apoioT} text={apoio} size={30} color={F.larEsc} /></div> : null}
      <div style={{position: 'absolute', left: tx, top: ty}}>
        <NomeLetras T={T} t0={tituloT} linhas={titulo} size={size} color={F.lar} seed={`rc${titulo.join('')}`} dur={0.9} lh={0.88} />
      </div>
      <div style={{position: 'absolute', left: x, bottom: -10, transformOrigin: '50% 100%', transform: `translateY(${(1 - e) * 60}px) scale(${lerp(1, 1.05, q)})`, opacity: e}}>
        <Img src={staticFile(recorte)} style={{height: h, display: 'block', filter: 'url(#pb) contrast(1.08)'}} />
      </div>
    </AbsoluteFill>
  );
};

// SEQUÊNCIA DE FOTOS REAIS: fotos P&B em tela cheia, push lento, corte seco entre elas
export const SequenciaFotos: React.FC<{T: number; fotos: {src: string; t: number; pos?: string}[]; fim: number; titulo?: string[]; tituloT?: number; apoio?: string; apoioT?: number}> = ({T, fotos, fim, titulo, tituloT = 0, apoio, apoioT = 0}) => {
  let i = 0;
  fotos.forEach((f, n) => { if (T >= f.t) i = n; });
  const f = fotos[i];
  const t1 = fotos[i + 1]?.t ?? fim;
  const q = Math.min(1, Math.max(0, (T - f.t) / (t1 - f.t)));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.ink}}>
      <Img src={staticFile(f.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: f.pos ?? '50% 50%', filter: 'grayscale(1) contrast(1.05)', transform: `scale(${lerp(1.03, 1.1, q)}) translateX(${lerp(10, -10, q)}px)`}} />
      {titulo ? (
        <div style={{position: 'absolute', left: 110, bottom: 140}}>
          <NomeLetras T={T} t0={tituloT} linhas={titulo} size={120} color={F.branco} seed={`sf${titulo.join('')}`} dur={0.8} />
          {apoio ? <div style={{marginTop: 12}}><Digita T={T} t0={apoioT} text={apoio} size={32} color={F.branco} /></div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

