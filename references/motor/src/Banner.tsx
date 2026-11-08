import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {Etiqueta, F, Filtros, GROT, MONO, useFontsFiguras} from './kit';

// Banners do repositório, feitos com o próprio kit (quadro único).
export const Banner: React.FC = () => {
  useFontsFiguras();
  const {width: W, height: H} = useVideoConfig();
  const s = Math.min(W / 1280, H / 640);
  const T = 99;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.lar}}>
      <Filtros />
      <Img src={staticFile('img/bg_laranja_liso.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', left: W - 690 * s, top: H / 2 - 190 * s}}>
        <div style={{fontFamily: MONO, fontSize: 25 * s, color: F.paper, marginBottom: 14 * s}}>skill de documentário animado</div>
        <div style={{fontFamily: GROT, fontSize: 112 * s, lineHeight: 0.92, color: F.paper, letterSpacing: '-0.035em'}}>CARTAZ<br />HISTÓRICO</div>
        <div style={{display: 'flex', gap: 12 * s, marginTop: 28 * s}}>
          <Etiqueta T={T} t0={0} text="CLAUDE CODE" size={27 * s} bg={F.ink} color={F.paper} />
          <Etiqueta T={T} t0={0} text="REMOTION" size={27 * s} bg={F.paper} color={F.ink} />
        </div>
      </div>
      <div style={{position: 'absolute', left: -20 * s, bottom: -6 * s}}>
        <Img src={staticFile('img/kant_recorte.png')} style={{height: 560 * s, display: 'block', filter: 'url(#pb) contrast(1.12) drop-shadow(0 20px 30px rgba(0,0,0,0.3))'}} />
      </div>
    </AbsoluteFill>
  );
};
