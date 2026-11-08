import React from 'react';
import {At, Bloco, Cruz, Fio, LIN, Mono} from '../colagem';
import {AbsoluteFill} from 'remotion';
import {F, GROT, Papel, S, k} from '../kit';
import {CamKey, Stage} from '../palco';

// LINHA DO TEMPO: régua, barra que cresce e marcos com fio + cruz, num palco 3D com câmera viva.
// Use sempre que a fala encadear fatos no tempo. Texto solto e seco ("NÃO" carimbado) não entra aqui.
export type MarcoT = {v: number; at: number; big: string; sub?: string; subAt?: number; dy?: number; left?: boolean; cor?: string; size?: number};
export type ReguaT = {v: number; label: string; forte?: boolean};

const AX = 20;

const Marco: React.FC<{T: number; x: number; m: MarcoT}> = ({T, x, m}) => {
  const {at, big, sub, subAt, dy = 0, left, cor = F.ink, size = 50} = m;
  const q = k(T, at - 0.05, 0.4, S);
  return (
    <>
      <Fio pts={[[x, AX + 6], [x, AX + 110 + dy]]} kk={q} w={1.6} color={cor} />
      <Cruz x={x} y={AX + 110 + dy} kk={q} s={9} />
      <At x={left ? x - 16 : x + 16} y={AX + 120 + dy}>
        <div style={{opacity: q, transform: `translate(${left ? '-100%' : '0'}, ${(1 - q) * 16}px)`, textAlign: left ? 'right' : 'left'}}>
          <div style={{fontFamily: GROT, fontSize: size, lineHeight: 1, color: cor, whiteSpace: 'nowrap', letterSpacing: '-0.02em'}}>{big}</div>
          {sub ? <div style={{marginTop: 10}}><Mono text={sub} kk={k(T, subAt ?? at + 0.4, 0.7, LIN)} size={24} /></div> : null}
        </div>
      </At>
    </>
  );
};

export const LinhaTempo: React.FC<{
  T: number; t0: number; cam: CamKey[];
  x: (v: number) => number; // converte o valor (ano, mês) em x no palco
  regua: ReguaT[]; de: number; ate: number;
  barra?: {de: number; ate: number; t0: number; d: number; txt?: string; cor?: string};
  marcos: MarcoT[];
}> = ({T, t0, cam, x, regua, de, ate, barra, marcos}) => {
  const rule = k(T, t0 + 0.05, 0.9, S);
  const grow = barra ? k(T, barra.t0, barra.d, S) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Papel T={T} />
      <Stage T={T} keys={cam}>
        <Fio pts={[[x(de), AX], [x(ate), AX]]} kk={rule} w={2} />
        {regua.map((r, i) => {
          const q = k(T, t0 + 0.1 + i * 0.04, 0.3);
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: x(r.v) - 0.75, top: AX - 10, width: 1.5, height: 20, background: F.ink, opacity: q}} />
              <At x={x(r.v) - 30} y={AX - 50}><Mono text={r.label} kk={q} size={r.forte ? 26 : 20} color={r.forte ? F.ink : 'rgba(22,17,14,0.55)'} /></At>
            </React.Fragment>
          );
        })}
        {barra && grow > 0 ? <Bloco x={x(barra.de)} y={AX + 18} w={(x(barra.ate) - x(barra.de)) * grow} h={46} color={barra.cor ?? F.lar} /> : null}
        {barra?.txt ? <At x={x(barra.de) + 14} y={AX + 27}><div style={{fontFamily: GROT, fontSize: 26, color: F.paper, opacity: k(T, barra.t0 + 0.3, 0.4), whiteSpace: 'nowrap'}}>{barra.txt}</div></At> : null}
        {marcos.map((m, i) => <Marco key={i} T={T} x={x(m.v)} m={m} />)}
      </Stage>
    </AbsoluteFill>
  );
};
