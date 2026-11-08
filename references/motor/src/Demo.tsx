import React from 'react';
import {AbsoluteFill} from 'remotion';
import {At, Bloco, Cruz, Fio, LIN, Mono, Titulo} from './colagem';
import {AnoBloco, Etiqueta, F, Filtros, Fundo, GROT, Papel, S, Whip, k, useFontsFiguras, useT} from './kit';
import {CamKey, Stage} from './palco';
import {Capitulo} from './cenas/Capitulo';
import {CitacaoMaquina, P} from './cenas/CitacaoMaquina';
import {Continua} from './cenas/Continua';
import {Evento} from './cenas/Evento';
import {LinhaTempo} from './cenas/LinhaTempo';
import {Mapa} from './cenas/Mapa';
import {Serigrafia} from './cenas/Pessoa';

// DEMO: a Revolução Francesa em 45 s, sem narração, para mostrar cada tipo de cena.
// Tempos absolutos em segundos, como numa timeline. Num vídeo real, cada tempo vem da palavra falada no Whisper.
export const DEMO_DUR = 45;

// Explicação em blocos contáveis: cada bloco é 1% da população.
const TresEstados: React.FC<{T: number}> = ({T}) => {
  const cols = 20, rows = 5, P_ = 62, Q = 50, x0 = -cols * P_ / 2, y0 = -100;
  const cam: CamKey[] = [{t: 15.1, x: -120, y: 30, s: 1.12, ry: 4, rx: 3}, {t: 18.0, x: 0, y: 40, s: 1.02, ry: 0, rx: 3}, {t: 21.6, x: 40, y: 40, s: 0.98, ry: -2, rx: 3}];
  const out: React.ReactNode[] = [];
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    const qi = k(T, 15.4 + (c + r) * 0.035, 0.45, S);
    const elite = c === 0 && r < 2;
    const acende = !elite ? k(T, 17.8 + c * 0.04, 0.35, S) : 0;
    out.push(<Bloco key={`${c}-${r}`} x={x0 + c * P_} y={y0 + r * P_} w={Q} color={elite ? F.ink : acende > 0 ? F.lar : '#3B342E'} o={qi} s={0.7 + 0.3 * qi} />);
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Papel T={T} />
      <Stage T={T} keys={cam}>
        {out}
        <Fio pts={[[x0 + Q / 2, y0 - 8], [x0 + Q / 2, y0 - 70], [x0 + 60, y0 - 70]]} kk={k(T, 19.4, 0.5, S)} w={1.6} />
        <Cruz x={x0 + 60} y={y0 - 70} kk={k(T, 19.7, 0.3)} s={9} />
        <At x={x0 + 80} y={y0 - 88}><Mono text="clero e nobreza · cerca de 2%" kk={k(T, 19.8, 0.8, LIN)} size={26} /></At>
        <At x={x0} y={y0 + rows * P_ + 26}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Etiqueta T={T} t0={18.0} text="TERCEIRO ESTADO" size={58} bg={F.lar} color={F.paper} />
            <div style={{fontFamily: GROT, fontSize: 58, color: F.ink, letterSpacing: '-0.02em', opacity: k(T, 18.5, 0.3)}}>~98%</div>
          </div>
        </At>
      </Stage>
      <Titulo T={T} ruleAt={15.15} items={[{t: 15.2, title: 'A França em 1789', src: 'cada bloco é 1% da população (estimativa)', srcT: 16.2}]} />
    </AbsoluteFill>
  );
};

const CAM_LINHA: CamKey[] = [
  {t: 33.6, x: -480, y: 100, s: 1.08, ry: 5, rx: 3},
  {t: 35.6, x: -300, y: 110, s: 1.04, ry: 3, rx: 3},
  {t: 38.0, x: 100, y: 120, s: 0.96, ry: 0, rx: 3},
  {t: 40.2, x: 280, y: 110, s: 0.94, ry: -3, rx: 3},
  {t: 41.6, x: 40, y: 110, s: 0.86, ry: -1, rx: 2},
];
const XA = (a: number) => -820 + (a - 1789) * 165;

export const Demo: React.FC<{camada?: boolean}> = ({camada}) => {
  useFontsFiguras();
  const T = useT(0);
  return (
    <AbsoluteFill>
      <Fundo camada={camada} />
      <Filtros />
      <Whip T={T} a={0} b={3.6}>
        <Capitulo T={T} t0={0} t1={3.6} bg="img/bg_capitulo_01.jpg" num="01" titulo={['O SÉCULO', 'DAS LUZES']} tx={880} ty={270} tsize={150} esq={{src: 'img/kant_recorte.png', h: 780}} />
      </Whip>
      <Whip T={T} a={3.6} b={9.6}>
        <Serigrafia T={T} t0={3.6} recuaT={5.0} src="img/kant_serigrafia.jpg" alfa="img/kant_serigrafia_alfa.png" foco={[0.3, 0.38]}
          sobre="Immanuel" nome={['KANT']} nomeT={5.2} size={220} x={960} y={230}
          infos={[{txt: 'filósofo · Königsberg, 1724–1804', t: 6.2, cor: 'esc'}, {txt: '1784 · Resposta à pergunta: o que é o Esclarecimento?', t: 7.4, cor: 'lar'}]}
          closeInfos={[{txt: 'ousa saber', t: 3.8, cor: 'esc'}]} />
      </Whip>
      <Whip T={T} a={9.6} b={15.1}>
        <AbsoluteFill style={{overflow: 'hidden'}}>
          <Papel T={T} />
          <Mapa T={T} foco={['250']} desbota={10.6}
            cam={[{t: 9.6, lon: 8, lat: 30, z: 1.0, rx: 6}, {t: 12.0, lon: 2.4, lat: 46.5, z: 5.2, rx: 4, ry: -3}, {t: 15.1, lon: 2.4, lat: 46.5, z: 5.6, rx: 2, ry: -2}]}
            pino={{lon: 2.35, lat: 48.85, t: 12.2, rotulo: 'Paris'}} />
          <div style={{position: 'absolute', left: 110, top: 730}}><AnoBloco T={T} t0={12.9} ano="1789" cima="maio de" size={170} /></div>
        </AbsoluteFill>
      </Whip>
      <Whip T={T} a={15.1} b={21.6}><TresEstados T={T} /></Whip>
      <Whip T={T} a={21.6} b={26.6}>
        <Evento T={T} t0={21.6} t1={26.6} src="img/bastilha_houel.jpg" x={70} y={70} pan={[24, -24]} zoom={[1.05, 1.12]} sombra={0.72}
          linhas={[{txt: 'A QUEDA DA', t: 22.0, size: 110}, {txt: 'BASTILHA', t: 22.5, size: 150}]} anos={[{ano: '1789', t: 23.4}]}
          extra={<div style={{marginTop: 18}}><Etiqueta T={T} t0={24.0} text="14 de julho · Paris" size={32} bg={F.paper} color={F.ink} font="'Archivo', Arial, sans-serif" /></div>} />
      </Whip>
      <Whip T={T} a={26.6} b={33.6}>
        <CitacaoMaquina T={T} t0={26.6} t1={33.6} size={70} sobre="Declaração dos Direitos do Homem e do Cidadão, 1789"
          linhas={[P('OS@27.4 HOMENS@27.7 NASCEM@28.2 E@28.7 PERMANECEM@28.9'), P('*LIVRES@29.8 E@30.3 *IGUAIS@30.5 EM@31.0 DIREITOS@31.2')]}
          fonte="— art. 1º · tradução livre do original em francês" fonteT={32.0} />
      </Whip>
      <Whip T={T} a={33.6} b={41.6}>
        <LinhaTempo T={T} t0={33.6} cam={CAM_LINHA} x={XA} de={1788.6} ate={1800.1}
          regua={Array.from({length: 11}, (_, i) => ({v: 1789 + i, label: String(1789 + i), forte: i === 0 || i === 10}))}
          barra={{de: 1789.53, ate: 1799.85, t0: 34.0, d: 6.4, txt: 'REVOLUÇÃO FRANCESA'}}
          marcos={[
            {v: 1789.53, at: 34.2, big: 'BASTILHA', sub: '14 de julho de 1789', subAt: 34.7},
            {v: 1792.72, at: 35.8, big: 'REPÚBLICA', sub: 'setembro de 1792', subAt: 36.3, dy: 170, left: true},
            {v: 1793.05, at: 37.0, big: 'LUÍS XVI', sub: 'guilhotinado em janeiro de 1793', subAt: 37.5, dy: 170},
            {v: 1794.57, at: 38.4, big: 'ROBESPIERRE', sub: 'guilhotinado em julho de 1794', subAt: 38.9, cor: F.larEsc},
            {v: 1799.85, at: 40.0, big: 'NAPOLEÃO', sub: 'golpe de novembro de 1799', subAt: 40.5, left: true, dy: 170},
          ]} />
      </Whip>
      <Whip T={T} a={41.6} b={DEMO_DUR}><Continua T={T} t0={41.6} t1={DEMO_DUR} /></Whip>
    </AbsoluteFill>
  );
};
