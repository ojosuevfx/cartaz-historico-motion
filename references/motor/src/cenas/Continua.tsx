import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F, NomeLetras, SANS, k, lerp} from '../kit';

// CARD FINAL "CONTINUA": entra depois da última fala, no mesmo cartaz laranja dos capítulos, em corte seco.
export const Continua: React.FC<{T: number; t0: number; t1: number; apoio?: string; bg?: string}> = ({T, t0, t1, apoio = 'este ainda não é o fim', bg = 'img/bg_capitulo_01.jpg'}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  const t = T - t0;
  const pontos = t < 1.5 ? 0 : Math.min(3, Math.floor((t - 1.5) / 0.28) + 1);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.lar}}>
      <Img src={staticFile(bg)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.02, 1.1, q)})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${lerp(0.98, 1.04, q)})`}}>
        <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 44, color: F.paper, opacity: k(T, t0 + 0.2, 0.4), letterSpacing: '0.02em', marginBottom: 18}}>{apoio}</div>
        <div style={{position: 'relative', transform: 'translateX(-95px)'}}>
          <NomeLetras T={T} t0={t0 + 0.45} linhas={['CONTINUA']} size={230} color={F.paper} seed="continua" dur={0.9} lh={0.88} align="center" />
          <div style={{position: 'absolute', left: '100%', bottom: 0, fontFamily: "'Archivo Black', Arial", fontSize: 230, lineHeight: 0.88, color: F.paper, letterSpacing: '-0.035em', whiteSpace: 'pre'}}>{'.'.repeat(pontos)}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
