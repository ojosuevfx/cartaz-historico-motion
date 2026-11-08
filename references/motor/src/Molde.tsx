import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Filtros, Fundo, Whip, useFontsFiguras, useT} from './kit';
import {Capitulo} from './cenas/Capitulo';

// PONTO DE PARTIDA de um capítulo. Duplique por capítulo (Cap01.tsx, Cap02.tsx...) e renomeie
// Molde, MOLDE_T0 e MOLDE_T1 (ex.: Cap01, C1_T0, C1_T1): tools/segmentos.py usa esse prefixo.
// T é o tempo da TIMELINE em segundos: escreva os tempos exatamente como o Whisper deu.
// Trecho sem <Whip> fica transparente e mostra o apresentador embaixo, no Premiere.
export const MOLDE_T0 = 0; // início do capítulo na timeline (s)
export const MOLDE_T1 = 8; // fim do capítulo na timeline (s)

export const Molde: React.FC<{camada?: boolean}> = ({camada}) => {
  useFontsFiguras();
  const T = useT(MOLDE_T0);
  return (
    <AbsoluteFill>
      <Fundo camada={camada} />
      <Filtros />
      <Whip T={T} a={0} b={4}>
        <Capitulo T={T} t0={0} t1={4} bg="img/bg_capitulo_01.jpg" num="01" titulo={['TÍTULO', 'DO CAPÍTULO']} tx={200} ty={320} tsize={150} />
      </Whip>
      {/* 4 s a 8 s: sem cena, apresentador na câmera */}
    </AbsoluteFill>
  );
};
