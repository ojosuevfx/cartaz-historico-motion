import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Etiqueta, F, NomeLetras, S, k, lerp} from '../kit';

// Modelos de pessoa:
//  RetratoPintado: pintura em tela cheia, push lento, nome em letras espalhadas ao lado do rosto.
//  Serigrafia: close extremo no rosto duotone laranja → recua; nome grande ATRÁS da figura.

export type Info = {txt: string; t: number; cor?: 'lar' | 'esc' | 'claro' | 'texto'};
const Infos: React.FC<{T: number; infos: Info[]; size?: number; claro?: boolean}> = ({T, infos, size = 30, claro}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
    {infos.map((i, n) => i.cor === 'texto' ? (
      <div key={n} style={{fontFamily: "'Archivo', Arial", fontWeight: 500, fontSize: size * 0.9, color: claro ? F.branco : F.ink, opacity: k(T, i.t, 0.5)}}>{i.txt}</div>
    ) : (
      <Etiqueta key={n} T={T} t0={i.t} text={i.txt} size={size} font="'Archivo', Arial, sans-serif"
        bg={i.cor === 'esc' ? F.larEsc : i.cor === 'claro' ? F.larClaro : F.lar} color={i.cor === 'claro' ? F.ink : F.branco} />
    ))}
  </div>
);

export const RetratoPintado: React.FC<{T: number; t0: number; t1: number; src: string; nome: string[]; nomeT: number;
  x: number; y: number; size?: number; infos?: Info[]; pos?: string; origin?: string; z?: [number, number]}> = ({T, t0, t1, src, nome, nomeT, x, y, size = 150, infos = [], pos = '50% 30%', origin = '50% 30%', z = [1.04, 1.16]}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.ink}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transformOrigin: origin, transform: `scale(${lerp(z[0], z[1], q)})`}} />
      <div style={{position: 'absolute', left: x, top: y}}>
        <NomeLetras T={T} t0={nomeT} linhas={nome} size={size} color={F.branco} seed={`rp${nome.join('')}`} lh={0.86} />
        <div style={{marginTop: 18}}><Infos T={T} infos={infos} claro /></div>
      </div>
    </AbsoluteFill>
  );
};

export const Serigrafia: React.FC<{T: number; t0: number; recuaT: number; src: string; alfa: string; foco: [number, number];
  sobre?: string; sobreT?: number; nome: string[]; nomeT: number; size?: number; x?: number; y?: number; infos?: Info[]; closeInfos?: Info[]}> = ({T, t0, recuaT, src, alfa, foco, sobre, sobreT, nome, nomeT, size = 200, x = 80, y = 280, infos = [], closeInfos = []}) => {
  const recua = k(T, recuaT, 0.9, S);
  const push = k(T, t0, Math.max(0.5, recuaT - t0), (q) => q);
  const z = lerp(lerp(2.3, 2.45, push), lerp(1.0, 1.05, k(T, recuaT + 0.8, 4, (q) => q)), recua);
  const fx = lerp(foco[0], 0.5, recua), fy = lerp(foco[1], 0.5, recua);
  const tr = `translate(${960 - fx * 1920 * z}px, ${540 - fy * 1080 * z}px) scale(${z})`;
  const img: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', transformOrigin: '0 0', transform: tr};
  const vis = recua > 0.02 ? 1 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.paper}}>
      <Img src={staticFile(src)} style={img} />
      <div style={{position: 'absolute', left: x, top: y, opacity: vis}}>
        {sobre ? <div style={{fontFamily: "'Archivo', Arial", fontWeight: 600, fontSize: size * 0.3, color: F.larEsc, opacity: k(T, sobreT ?? nomeT - 0.1, 0.4), letterSpacing: '-0.02em', marginLeft: 8}}>{sobre}</div> : null}
        <NomeLetras T={T} t0={nomeT} linhas={nome} size={size} color={F.lar} seed={`sg${nome.join('')}`} lh={0.9} dur={0.8} />
      </div>
      <Img src={staticFile(alfa)} style={{...img, opacity: vis}} />
      <div style={{position: 'absolute', left: x + 20, top: y + size * 0.95 * nome.length + (sobre ? size * 0.35 : 0) + 40, opacity: vis}}><Infos T={T} infos={infos} /></div>
      <div style={{position: 'absolute', left: 120, bottom: 120, opacity: 1 - recua}}><Infos T={T} infos={closeInfos} size={40} /></div>
    </AbsoluteFill>
  );
};
