import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {F, FPS, S, k, lerp, useFontsFiguras} from '../kit';

// ALERTA INICIAL: fundo quase preto com gravuras-fantasma; "AVISO:" em vermelho + texto que se digita;
// depois "UMA PRODUÇÃO" / nome do canal no laranja da paleta. É a única peça que entra e sai em fade.
export const AV_DUR = 13.5;

const SERIF = "'Merriweather', Georgia, serif";
const C = {fundo: '#0B0A09', verm: '#B2351F', texto: '#E4DDD2', creme: '#EDE6DA'};

export type AvisoProps = {
  linhas?: string[]; // 3 linhas de comprimento parecido; escreva o que for verdade sobre o seu vídeo
  produtora?: string;
  fantasmas?: [string, string]; // duas imagens do próprio vídeo, quase invisíveis ao fundo
};

export const AVISO_PADRAO = [
  'Este é um documentário original, roteirizado e editado por uma equipe humana.',
  'As imagens partem de fontes históricas reais; algumas foram restauradas com apoio',
  'de inteligência artificial, sempre sob direção, pesquisa e verificação humana.',
];

// listras verticais finas dentro da letra
const listras = (cor: string, esc: string) => ({
  backgroundImage: `repeating-linear-gradient(90deg, ${cor} 0px, ${cor} 2.2px, ${esc} 2.2px, ${esc} 3.4px)`,
  WebkitBackgroundClip: 'text' as const,
  backgroundClip: 'text' as const,
  color: 'transparent',
});

const mascara = {WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 30%, transparent 75%)', maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 30%, transparent 75%)'};

const Fundo: React.FC<{T: number; fantasmas: [string, string]}> = ({T, fantasmas}) => (
  <AbsoluteFill style={{background: C.fundo, overflow: 'hidden'}}>
    <Img src={staticFile(fantasmas[0])} style={{position: 'absolute', left: -120 + T * 4, top: -80, width: 1300, opacity: 0.05, filter: 'grayscale(1) contrast(1.4) blur(1.5px)', ...mascara}} />
    <Img src={staticFile(fantasmas[1])} style={{position: 'absolute', right: -160 - T * 3, bottom: -220, width: 1000, opacity: 0.04, filter: 'grayscale(1) contrast(1.5) blur(1.5px)', ...mascara}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(11,10,9,0.35) 0%, rgba(11,10,9,0.92) 100%)'}} />
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'screen'}}>
      <filter id="grao"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(T * 12)} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="1920" height="1080" filter="url(#grao)" />
    </svg>
  </AbsoluteFill>
);

const Digitado: React.FC<{T: number; t0: number; cps: number; linhas: string[]}> = ({T, t0, cps, linhas}) => {
  let n = Math.max(0, Math.floor((T - t0) * cps));
  return (
    <div style={{fontFamily: SERIF, fontWeight: 400, fontSize: 41, lineHeight: 1.34, textAlign: 'center', ...listras(C.texto, '#A9A39A')}}>
      {linhas.map((l, i) => {
        const vis = l.slice(0, Math.max(0, n));
        n -= l.length;
        return <div key={i} style={{whiteSpace: 'pre'}}><span>{vis}</span><span style={{opacity: 0}}>{l.slice(vis.length)}</span></div>;
      })}
    </div>
  );
};

export const Aviso: React.FC<AvisoProps> = ({linhas = AVISO_PADRAO, produtora = 'SEU CANAL', fantasmas = ['img/ddhc_lebarbier.jpg', 'img/bastilha_houel.jpg']}) => {
  useFontsFiguras();
  const T = useCurrentFrame() / FPS;
  const a1 = k(T, 0.5, 0.6, S) * (1 - k(T, 7.4, 0.7, S));
  const pisca = T > 0.5 && T < 1.1 ? 0.75 + 0.25 * random(`p${Math.floor(T * 20)}`) : 1;
  const a2 = k(T, 8.4, 0.9, S) * (1 - k(T, 12.4, 0.9, S));
  const z = lerp(1.0, 1.05, Math.min(1, Math.max(0, (T - 8.4) / 5)));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: k(T, 0, 0.5, S) * (1 - k(T, AV_DUR - 0.5, 0.5, S))}}>
        <Fundo T={T} fantasmas={fantasmas} />
      </AbsoluteFill>
      {a1 > 0 ? (
        <AbsoluteFill style={{opacity: a1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
          <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 112, letterSpacing: '0.01em', lineHeight: 1, opacity: pisca, ...listras(C.verm, '#7E2416'), filter: 'drop-shadow(0 0 18px rgba(178,53,31,0.25))'}}>AVISO:</div>
          <div style={{marginTop: 22}}><Digitado T={T} t0={1.2} cps={58} linhas={linhas} /></div>
        </AbsoluteFill>
      ) : null}
      {a2 > 0 ? (
        <AbsoluteFill style={{opacity: a2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `scale(${z})`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <div style={{fontFamily: SERIF, fontWeight: 400, fontSize: 64, letterSpacing: '0.02em', lineHeight: 1, marginLeft: 8, ...listras(C.creme, '#A8A196')}}>UMA PRODUÇÃO</div>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 200, letterSpacing: '0.005em', lineHeight: 1.0, marginTop: -4, ...listras(F.lar, F.larEsc), filter: 'drop-shadow(0 0 24px rgba(224,102,42,0.22))', whiteSpace: 'nowrap'}}>{produtora}</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
