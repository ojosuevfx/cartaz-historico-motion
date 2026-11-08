import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {LIN, Mono} from '../colagem';
import {AnoBloco, EOUT, F, NomeLetras, Papel, S, k, lerp} from '../kit';
import {Digita} from './Retratos';

// DOCUMENTO REAL inclinado, com título à esquerda e ano em bloco.
export const Documento: React.FC<{T: number; t0: number; t1: number; src: string; w: number; titulo: string[]; tituloT: number; size?: number; ano?: string; anoCima?: string; anoT?: number; apoio?: string; apoioT?: number; apoio2?: string; apoio2T?: number}> = ({T, t0, t1, src, w, titulo, tituloT, size = 110, ano, anoCima, anoT = 0, apoio, apoioT = 0, apoio2, apoio2T = 0}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  const e = k(T, t0, 0.6, EOUT);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Papel T={T} />
      <div style={{position: 'absolute', right: 130, top: 70, width: w, transform: `translateY(${(1 - e) * 90}px) rotate(${lerp(3, 1.8, q)}deg) scale(${lerp(1, 1.06, q)})`, transformOrigin: '50% 30%', boxShadow: '0 30px 60px rgba(40,25,10,0.35)'}}>
        <Img src={staticFile(src)} style={{width: '100%', display: 'block'}} />
      </div>
      <div style={{position: 'absolute', left: 110, top: 280}}>
        <NomeLetras T={T} t0={tituloT} linhas={titulo} size={size} color={F.ink} seed={`d5${titulo.join('')}`} dur={0.7} lh={0.92} />
        {apoio ? <div style={{marginTop: 16}}><Digita T={T} t0={apoioT} text={apoio} size={32} /></div> : null}
        {apoio2 ? <div style={{marginTop: 6}}><Digita T={T} t0={apoio2T} text={apoio2} size={32} color={F.larEsc} /></div> : null}
        {ano ? <div style={{marginTop: 30}}><AnoBloco T={T} t0={anoT} ano={ano} cima={anoCima} size={130} /></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// marca-texto que corre no tempo da fala
export const Marca: React.FC<{T: number; t: number; d?: number; children: React.ReactNode}> = ({T, t, d = 0.8, children}) => {
  const q = k(T, t, d, S);
  return <span style={{backgroundImage: `linear-gradient(${F.larClaro}, ${F.larClaro})`, backgroundRepeat: 'no-repeat', backgroundSize: `${q * 100}% 78%`, backgroundPosition: '0 70%'}}>{children}</span>;
};

// PÁGINA DE TEXTO recomposta (quando o original não existe em boa resolução ou no idioma):
// papel inclinado com cabeçalho e o trecho exato, marca-texto na palavra falada e a FONTE na tela.
export const PaginaDestaque: React.FC<{T: number; t0: number; t1: number; tipo?: string; titulo: string; subtitulo?: string; detalhe?: string; fonte: string; children: React.ReactNode}> = ({T, t0, t1, tipo, titulo, subtitulo, detalhe, fonte, children}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  const e = k(T, t0, 0.6, EOUT);
  const SERIF = "'Merriweather', Georgia, serif";
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Papel T={T} />
      <div style={{position: 'absolute', left: 260, top: 70, width: 1400, transformOrigin: '50% 55%', transform: `translateY(${(1 - e) * 90}px) rotate(${lerp(-1.4, -0.6, q)}deg) scale(${lerp(1.0, 1.12, q)})`,
        background: '#F7F2E2', boxShadow: '0 30px 70px rgba(40,25,10,0.32)', padding: '70px 110px 90px'}}>
        <Img src={staticFile('tex/impressao.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: 0.12}} />
        <div style={{position: 'relative', textAlign: 'center', fontFamily: SERIF, color: F.ink}}>
          {tipo ? <div style={{fontSize: 30, letterSpacing: '0.18em'}}>{tipo}</div> : null}
          <div style={{fontSize: 64, fontWeight: 700, letterSpacing: '0.06em', marginTop: 8, color: F.vinho}}>{titulo}</div>
          {subtitulo ? <div style={{fontSize: 26, letterSpacing: '0.14em', marginTop: 10}}>{subtitulo}</div> : null}
          {detalhe ? <div style={{fontSize: 24, fontStyle: 'italic', marginTop: 10, opacity: 0.75}}>{detalhe}</div> : null}
          <div style={{width: 160, height: 2, background: F.ink, opacity: 0.5, margin: '34px auto 0'}} />
        </div>
        <div style={{position: 'relative', marginTop: 40, fontFamily: SERIF, fontSize: 40, lineHeight: 1.55, color: F.ink, textAlign: 'justify'}}>{children}</div>
      </div>
      <div style={{position: 'absolute', right: 110, bottom: 60}}><Mono text={fonte} kk={k(T, t0 + 0.7, 0.8, LIN)} size={22} /></div>
    </AbsoluteFill>
  );
};
