import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F, GROT, lerp} from '../kit';

// CITAÇÃO: animação central sobre o fundo laranja de cartaz, o texto aparecendo
// como máquina de escrever — letra por letra, sem desfoque, sem fade, no tempo da fala.
// linhas: cada palavra com o instante em que é dita; destaque = palavra em tom escuro.
export type PalavraCit = [string, number, boolean?];

// Atalho para escrever uma linha: P('OS@27.4 HOMENS@27.7 *LIVRES@29.8 DIREITOS_HUMANOS@31.2')
// palavra@segundo; * marca o destaque; _ vira espaço dentro do mesmo bloco de tempo.
export const P = (s: string): PalavraCit[] => s.split(' ').map((w) => {
  const [txt, t] = w.split('@');
  return [txt.replace('*', '').replace(/_/g, ' '), Number(t), txt.startsWith('*')] as PalavraCit;
});

export const CitacaoMaquina: React.FC<{T: number; t0: number; t1: number; linhas: PalavraCit[][]; fonte: string; fonteT: number; size?: number; bg?: string; sobre?: string}> = ({T, t0, t1, linhas, fonte, fonteT, size = 64, bg = 'img/bg_laranja_liso.jpg', sobre}) => {
  const q = Math.min(1, Math.max(0, (T - t0) / (t1 - t0)));
  const todas = linhas.flat();
  // duração de cada palavra = até a próxima palavra (máx. 0,45 s)
  const durDe = (i: number) => Math.max(0.08, Math.min(0.45, (todas[i + 1]?.[1] ?? todas[i][1] + 0.4) - todas[i][1]));
  let idx = 0;
  // cursor: no fim do que já foi digitado
  const ultimo = todas.reduce((acc, w, i) => (T >= w[1] ? i : acc), -1);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: F.lar}}>
      <Img src={staticFile(bg)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.02, 1.08, q)})`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{maxWidth: 1500, textAlign: 'center', transform: `scale(${lerp(0.98, 1.02, q)})`}}>
          {sobre ? <div style={{fontFamily: "'Roboto Mono', monospace", fontSize: 28, color: F.paper, marginBottom: 30, opacity: T >= t0 ? 1 : 0}}>{sobre}</div> : null}
          <div style={{fontFamily: GROT, fontSize: size, lineHeight: 1.18, color: F.paper, letterSpacing: '-0.01em'}}>
            {linhas.map((linha, li) => (
              <div key={li} style={{whiteSpace: 'nowrap'}}>
                {linha.map(([w, t, hl], wi) => {
                  const i = idx++;
                  const n = T < t ? 0 : Math.min(w.length, Math.floor(((T - t) / durDe(i)) * w.length) + 1);
                  return (
                    <span key={wi} style={{color: hl ? F.ink : F.paper}}>
                      {w.slice(0, n)}
                      <span style={{visibility: 'hidden'}}>{w.slice(n)}</span>
                      {i === ultimo && n === w.length && Math.floor(T * 2.5) % 2 === 0 ? <span style={{display: 'inline-block', width: size * 0.08, height: size * 0.82, background: F.paper, verticalAlign: '-0.1em', marginLeft: 4}} /> : null}
                      {wi < linha.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{marginTop: 40, fontFamily: "'Roboto Mono', monospace", fontSize: 28, color: F.ink}}>
            {(() => {
              // reserva a linha desde o início: sem isso, o bloco pula quando a fonte começa
              const n = T >= fonteT ? Math.min(fonte.length, Math.floor((T - fonteT) * 40)) : 0;
              return <>{fonte.slice(0, n)}<span style={{visibility: 'hidden'}}>{fonte.slice(n) || '\u00a0'}</span></>;
            })()}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
