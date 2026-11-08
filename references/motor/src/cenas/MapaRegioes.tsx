import React from 'react';
import {geoCentroid, geoMercator, geoPath} from 'd3-geo';
import {F, S, lerp} from '../kit';

// MAPA DE REGIÕES (províncias, estados, colônias): terra escura, fronteiras finas claras, nomes de época.
// A câmera começa colada numa região e recua até o conjunto inteiro sobre o creme.
// `dados` = {prov: Feature[] com properties.nome, borda: MultiLineString, contorno: Feature}.
// Monte esse JSON com references/ferramentas/regioes.mjs a partir de um GeoJSON de divisões atuais.
const W = 1920, H = 1080;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DadosRegioes = {prov: any[]; borda: any; contorno: any};

export const criaProjecao = (dados: DadosRegioes, area: [[number, number], [number, number]] = [[560, 90], [1360, 990]]) => geoMercator().fitExtent(area, dados.contorno);

export type RegCam = {t: number; x: number; y: number; z: number}; // x,y = ponto do mapa (px da projeção) no centro da tela
const camAt = (T: number, keys: RegCam[]) => {
  if (T <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    if (T <= keys[i + 1].t) {
      const a = keys[i], b = keys[i + 1];
      const q = S((T - a.t) / (b.t - a.t));
      return {t: T, x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q), z: a.z * Math.pow(b.z / a.z, q)};
    }
  }
  return keys[keys.length - 1];
};

export const MapaRegioes: React.FC<{T: number; dados: DadosRegioes; cam: RegCam[]; destaque?: string; destaqueT?: number; rotulos?: number; ajustes?: Record<string, [number, number]>; children?: (c: RegCam) => React.ReactNode}> = ({T, dados, cam, destaque, destaqueT = 0, rotulos = 1, ajustes = {}, children}) => {
  const proj = React.useMemo(() => criaProjecao(dados), [dados]);
  const path = React.useMemo(() => geoPath(proj), [proj]);
  const PROV = React.useMemo(() => dados.prov.map((p) => ({nome: p.properties.nome as string, d: path(p) ?? '', c: proj(geoCentroid(p)) as [number, number]})), [dados, path, proj]);
  const BORDA = React.useMemo(() => path(dados.borda) ?? '', [dados, path]);
  const CONT = React.useMemo(() => path(dados.contorno) ?? '', [dados, path]);
  const c = camAt(T, cam);
  const tr = `translate(${W / 2}px, ${H / 2}px) scale(${c.z}) translate(${-c.x}px, ${-c.y}px)`;
  const qd = destaque ? Math.min(1, Math.max(0, (T - destaqueT) / 0.5)) : 0;
  // rótulos: tamanho fixo na tela, somem quando o mapa fica pequeno demais
  const fs = 15 / c.z;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g style={{transform: tr, transformOrigin: '0 0'}}>
          {PROV.map((p) => (
            <path key={p.nome} d={p.d} fill={p.nome === destaque ? `rgb(${Math.round(lerp(46, 224, qd))},${Math.round(lerp(42, 102, qd))},${Math.round(lerp(36, 42, qd))})` : '#2E2A24'} />
          ))}
          <path d={BORDA} fill="none" stroke={F.paper} strokeWidth={1.1} vectorEffect="non-scaling-stroke" opacity={0.9} />
          <path d={CONT} fill="none" stroke="#2E2A24" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          {PROV.map((p) => {
            const [dx, dy] = ajustes[p.nome] ?? [0, 0];
            return (
              <text key={'t' + p.nome} x={p.c[0] + dx} y={p.c[1] + dy} fontSize={fs * (p.nome.length > 14 ? 0.85 : 1)} fill={F.paper} textAnchor="middle"
                fontFamily="'Archivo', Arial, sans-serif" fontWeight={500} opacity={rotulos} style={{letterSpacing: '-0.01em'}}>{p.nome}</text>
            );
          })}
        </g>
      </svg>
      {children ? children(c) : null}
    </div>
  );
};

// converte um ponto do mapa (projeção) para a tela, dado o estado da câmera
export const naTela = (c: RegCam, p: [number, number]) => [W / 2 + (p[0] - c.x) * c.z, H / 2 + (p[1] - c.y) * c.z] as [number, number];
