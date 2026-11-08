import React from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-50m.json';
import {F, S, k, lerp} from '../kit';

// Mapa creme/preto: terra preta, fronteiras em fio creme.
// Câmera = transform no grupo SVG (projeção fixa, traço sem escalar).
const W = 1920, H = 1080;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countries = (feature(world as any, (world as any).objects.countries) as any).features as any[];
const proj = geoMercator().scale(300).translate([W / 2, H / 2 + 120]).precision(0.2);
const path = geoPath(proj);
const D = countries.map((c) => ({id: String(c.id), name: c.properties?.name as string, d: path(c) ?? ''}));

export const projeta = (lon: number, lat: number) => proj([lon, lat]) as [number, number];

export type MapaCam = {t: number; lon: number; lat: number; z: number; rx?: number; ry?: number};
const camAt = (T: number, keys: MapaCam[]) => {
  if (T <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    if (T <= keys[i + 1].t) {
      const a = keys[i], b = keys[i + 1];
      const q = S((T - a.t) / (b.t - a.t));
      return {t: T, lon: lerp(a.lon, b.lon, q), lat: lerp(a.lat, b.lat, q), z: a.z * Math.pow(b.z / a.z, q), rx: lerp(a.rx ?? 0, b.rx ?? 0, q), ry: lerp(a.ry ?? 0, b.ry ?? 0, q)};
    }
  }
  return keys[keys.length - 1];
};

// ids ISO numéricos (world-atlas): Brasil 076, França 250, Itália 380, EUA 840, Vaticano 336
export const Mapa: React.FC<{
  T: number;
  cam: MapaCam[];
  foco?: string[]; // países que ficam pretos; os outros desbotam
  desbota?: number; // instante em que os outros desbotam
  pino?: {lon: number; lat: number; t: number; rotulo?: string};
  nome?: {texto: string; t: number; size: number; dx?: number; dy?: number}; // nome atrás do contorno
  arcos?: {de: [number, number]; para: [number, number]; t: number; d?: number; alto?: number; cor?: string}[]; // fio curvo que se desenha (lon, lat)
  children?: React.ReactNode;
}> = ({T, cam, foco = [], desbota, pino, nome, arcos = [], children}) => {
  const c = camAt(T, cam);
  const [cx, cy] = projeta(c.lon, c.lat);
  const tr = `translate(${W / 2}px, ${H / 2}px) scale(${c.z}) translate(${-cx}px, ${-cy}px)`;
  const fade = desbota !== undefined ? k(T, desbota, 0.9) : 0;
  const pin = pino ? projeta(pino.lon, pino.lat) : null;
  const qPin = pino ? k(T, pino.t, 0.8) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', perspective: 1900, perspectiveOrigin: '50% 45%'}}>
     <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${(c.rx ?? 0) + Math.sin(T * 0.21) * 0.8}deg) rotateY(${(c.ry ?? 0) + Math.cos(T * 0.25) * 1.1}deg) scale(${1 + (c.rx ?? 0) * 0.006})`}}>
      {/* nome do lugar ATRÁS da terra */}
      {nome ? (
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: tr, transformOrigin: '0 0'}}>
          <div style={{position: 'absolute', left: (pin?.[0] ?? cx) + (nome.dx ?? 0) / c.z, top: (pin?.[1] ?? cy) + (nome.dy ?? 0) / c.z, transform: 'translate(-50%,-50%)',
            fontFamily: "'Archivo Black', Arial", fontSize: nome.size / c.z, color: F.lar, letterSpacing: '-0.04em', whiteSpace: 'nowrap',
            opacity: k(T, nome.t, 0.4)}}>{nome.texto}</div>
        </div>
      ) : null}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g style={{transform: tr, transformOrigin: '0 0'}}>
          {D.map((p) => {
            const isFoco = foco.includes(p.id);
            const fill = isFoco ? F.ink : `rgba(22,17,14,${lerp(0.92, 0.12, fade)})`;
            return <path key={p.id + p.name} d={p.d} fill={fill} stroke={F.paper} strokeWidth={isFoco ? 1.1 : 0.8} vectorEffect="non-scaling-stroke" />;
          })}
          {arcos.map((a, i) => {
            const [x1, y1] = projeta(a.de[0], a.de[1]);
            const [x2, y2] = projeta(a.para[0], a.para[1]);
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - (a.alto ?? 0.35) * Math.hypot(x2 - x1, y2 - y1);
            const q = k(T, a.t, a.d ?? 1.4, S);
            if (q <= 0) return null;
            const len = 1.25 * Math.hypot(x2 - x1, y2 - y1);
            return (
              <g key={'a' + i}>
                <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={a.cor ?? F.lar} strokeWidth={4 / c.z} strokeDasharray={`${len * q} ${len}`} strokeLinecap="round" />
                <circle cx={x1} cy={y1} r={7 / c.z} fill={a.cor ?? F.lar} />
                {q > 0.97 ? <circle cx={x2} cy={y2} r={7 / c.z} fill={a.cor ?? F.lar} /> : null}
              </g>
            );
          })}
        </g>
      </svg>
      {/* pino: fio tracejado laranja que cai do alto até o ponto */}
      {pin && qPin > 0 ? (() => {
        const sx = W / 2 + (pin[0] - cx) * c.z, sy = H / 2 + (pin[1] - cy) * c.z;
        const top = sy - 520;
        const len = (sy - top) * qPin;
        return (
          <>
            <div style={{position: 'absolute', left: sx + 140 * (1 - qPin) - 1.5, top, width: 3, height: len,
              background: `repeating-linear-gradient(180deg, ${F.lar} 0 10px, transparent 10px 18px)`, transformOrigin: 'top', transform: `rotate(${-14 * (1 - qPin)}deg)`}} />
            <div style={{position: 'absolute', left: sx - 9, top: sy - 9, width: 18, height: 18, borderRadius: 9, background: F.lar, opacity: k(qPin, 0.85, 0.15),
              boxShadow: `0 0 0 ${6 + 10 * k(T, pino!.t + 0.8, 0.8)}px rgba(224,102,42,${0.35 * (1 - k(T, pino!.t + 0.8, 1.2))})`}} />
            {pino!.rotulo ? (
              <div style={{position: 'absolute', left: sx + 22, top: sy - 14, fontFamily: "'Roboto Mono', monospace", fontSize: 24, color: F.ink, background: F.paper, padding: '2px 8px', opacity: k(T, pino!.t + 0.6, 0.4)}}>{pino!.rotulo}</div>
            ) : null}
          </>
        );
      })() : null}
      {children}
     </div>
    </div>
  );
};
