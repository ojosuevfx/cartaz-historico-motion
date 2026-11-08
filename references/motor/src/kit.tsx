import React from 'react';
import {AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame} from 'remotion';

// ======================================================================
// KIT CARTAZ HISTÓRICO — pessoas, nomes, datas, mapas e documentos.
// Creme + laranja queimado + preto; pintura/gravura real recriada fielmente;
// nome em grotesca que entra letra a letra; ano em bloco que rola.
// ======================================================================
export const F = {
  paper: '#EFEBD8',
  paper2: '#E6E0C8',
  ink: '#16110E',
  inkSoft: 'rgba(22,17,14,0.6)',
  lar: '#E0662A',
  larClaro: '#F2A46B',
  larFundo: '#F6D9BF',
  larEsc: '#B9501D',
  vinho: '#7E2328',
  branco: '#FBF8EE',
  cinzaMapa: '#CFC8B2',
};
export const GROT = "'Archivo Black', 'Archivo', Arial, sans-serif";
export const SANS = "'Archivo', Arial, sans-serif";
export const MONO = "'Roboto Mono', Consolas, monospace";
export const FPS = 30;

export const useFontsFiguras = () => {
  const [h] = React.useState(() => delayRender('fonts-figuras'));
  React.useEffect(() => {
    const defs: [string, string, string][] = [
      ['Archivo Black', 'fonts/ArchivoBlack.ttf', '400'],
      ['Archivo', 'fonts/Archivo.ttf', '100 900'],
      ['Roboto Mono', 'fonts/RobotoMono-Regular.ttf', '400'],
      ['Roboto Mono', 'fonts/RobotoMono-Medium.ttf', '500'],
      ['Merriweather', 'fonts/Merriweather.ttf', '300 900'],
    ];
    Promise.all(defs.map(async ([fam, file, weight]) => {
      const ff = new FontFace(fam, `url(${staticFile(file)})`, {weight});
      await ff.load();
      document.fonts.add(ff);
    })).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const EOUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EIN = Easing.bezier(0.7, 0, 0.84, 0);
export const S = Easing.bezier(0.65, 0, 0.35, 1);
export const k = (T: number, a: number, d = 0.5, e = EOUT) => interpolate(T, [a, a + d], [0, 1], {...clamp, easing: e});
export const lerp = (a: number, b: number, q: number) => a + (b - a) * q;
// tempo da timeline (segundos) a partir do frame
export const useT = (T0: number) => T0 + useCurrentFrame() / FPS;

// ---------- papel ----------
export const Papel: React.FC<{T: number; tom?: string}> = ({T, tom = F.paper}) => (
  <AbsoluteFill style={{background: tom, overflow: 'hidden'}}>
    <Img src={staticFile('tex/papel.jpg')} style={{position: 'absolute', left: -200 + Math.sin(T * 0.1) * 30, top: -150, width: 2400, height: 1400, mixBlendMode: 'multiply', opacity: 0.55}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 45%, transparent 55%, rgba(60,40,20,0.18) 100%)'}} />
  </AbsoluteFill>
);

// ---------- filtros SVG (duotone e P&B quente) ----------
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
export const Filtros: React.FC = () => {
  const d = hex(F.ink), l = hex(F.paper), o = hex(F.lar), oc = hex(F.larFundo);
  const tv = (a: number[], b: number[], i: number) => `${a[i]} ${b[i]}`;
  return (
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        {/* gravura: P&B quente, preto-tinta → creme */}
        <filter id="pb" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={tv(d, l, 0)} />
            <feFuncG type="table" tableValues={tv(d, l, 1)} />
            <feFuncB type="table" tableValues={tv(d, l, 2)} />
          </feComponentTransfer>
        </filter>
        {/* duotone laranja: sombra laranja queimado → claro creme-laranja */}
        <filter id="duo" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={tv(o, oc, 0)} />
            <feFuncG type="table" tableValues={tv(o, oc, 1)} />
            <feFuncB type="table" tableValues={tv(o, oc, 2)} />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
};

// ---------- imagem que respira (push-in contínuo) ----------
export const Quadro: React.FC<{src: string; T: number; t0: number; t1: number; z0?: number; z1?: number; x0?: number; x1?: number; y0?: number; y1?: number; filtro?: 'pb' | 'duo' | 'none'; escurece?: number; blur?: number; fit?: 'cover' | 'contain'; origin?: string}> = ({src, T, t0, t1, z0 = 1.04, z1 = 1.14, x0 = 0, x1 = 0, y0 = 0, y1 = 0, filtro = 'none', escurece = 0, blur = 0, fit = 'cover', origin = '50% 40%'}) => {
  const q = interpolate(T, [t0, t1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: fit, transformOrigin: origin,
        transform: `translate(${lerp(x0, x1, q)}px, ${lerp(y0, y1, q)}px) scale(${lerp(z0, z1, q)})`,
        filter: `${filtro === 'none' ? '' : `url(#${filtro})`} brightness(${1 - escurece}) blur(${blur}px)`}} />
    </AbsoluteFill>
  );
};

// ---------- nome com letras espalhadas (entram fora de ordem) ----------
export const NomeLetras: React.FC<{T: number; t0: number; linhas: string[]; size: number; color?: string; seed?: string; dur?: number; lh?: number; align?: 'left' | 'center' | 'right'; sai?: number}> = ({T, t0, linhas, size, color = F.lar, seed = 'n', dur = 0.9, lh = 0.86, align = 'left', sai}) => {
  const all = linhas.join('').replace(/ /g, '').length;
  let n = 0;
  const out = sai ? k(T, sai, 0.35, EIN) : 0;
  return (
    <div style={{fontFamily: GROT, fontSize: size, lineHeight: lh, color, letterSpacing: '-0.035em', textAlign: align, whiteSpace: 'pre', opacity: 1 - out, filter: out > 0 ? `blur(${out * 14}px)` : undefined}}>
      {linhas.map((l, li) => (
        <div key={li}>
          {l.split('').map((ch, ci) => {
            if (ch === ' ') return <span key={ci}> </span>;
            const order = random(`${seed}-${n++}`);
            const a = t0 + order * dur * 0.75;
            const q = k(T, a, 0.22, EOUT);
            return (
              <span key={ci} style={{display: 'inline-block', opacity: q, transform: `translateY(${(1 - q) * size * 0.12}px) scale(${lerp(1.25, 1, q)})`, filter: q < 1 ? `blur(${(1 - q) * 6}px)` : undefined}}>{ch}</span>
            );
          })}
        </div>
      ))}
      <span style={{display: 'none'}}>{all}</span>
    </div>
  );
};

// ---------- linha pequena de apoio (minúscula regular) ----------
export const Apoio: React.FC<{T: number; t0: number; text: string; size?: number; color?: string; bg?: string}> = ({T, t0, text, size = 30, color = F.ink, bg}) => {
  const q = k(T, t0, 0.45);
  return (
    <div style={{display: 'inline-block', fontFamily: SANS, fontWeight: 500, fontSize: size, color, background: bg, padding: bg ? '4px 12px 6px' : 0,
      clipPath: `inset(-10px ${(1 - q) * 100}% -10px 0)`, whiteSpace: 'nowrap', letterSpacing: '-0.01em'}}>{text}</div>
  );
};

// ---------- etiqueta: texto em bloco com textura de impressão ----------
export const Etiqueta: React.FC<{T: number; t0: number; text: React.ReactNode; size?: number; bg?: string; color?: string; font?: string}> = ({T, t0, text, size = 36, bg = F.larEsc, color = F.paper, font = GROT}) => {
  const q = k(T, t0, 0.4, S);
  return (
    <div style={{position: 'relative', display: 'inline-block', padding: `${size * 0.14}px ${size * 0.28}px ${size * 0.2}px`, clipPath: `inset(-4px ${(1 - q) * 100}% -4px 0)`}}>
      <div style={{position: 'absolute', inset: 0, background: bg}} />
      <Img src={staticFile('tex/impressao.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: 0.5}} />
      <div style={{position: 'relative', fontFamily: font, fontSize: size, lineHeight: 1.02, color, whiteSpace: 'nowrap', letterSpacing: font === GROT ? '-0.02em' : '-0.01em', fontWeight: font === SANS ? 600 : undefined}}>{text}</div>
      <Img src={staticFile('tex/impressao.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'screen', opacity: 0.16, transform: 'scaleX(-1)'}} />
    </div>
  );
};

// ---------- bloco do ano: abre e os dígitos rolam ----------
export const AnoBloco: React.FC<{T: number; t0: number; ano: string; cima?: string; size?: number; sai?: number; cor?: string}> = ({T, t0, ano, cima, size = 150, sai, cor = F.lar}) => {
  const abre = k(T, t0, 0.35, S);
  const out = sai ? k(T, sai, 0.3, EIN) : 0;
  const digits = ano.split('');
  const dw = size * 0.7; // largura de cada dígito: em 0.6 o "4" saía cortado
  return (
    <div style={{position: 'relative', opacity: 1 - out, transform: `translateY(${out * 20}px)`}}>
      {cima ? <div style={{fontFamily: SANS, fontWeight: 500, fontSize: size * 0.2, color: F.ink, marginBottom: 4, opacity: k(T, t0 + 0.15, 0.3)}}>{cima}</div> : null}
      <div style={{position: 'relative', height: size * 0.92, width: dw * digits.length + size * 0.24, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: cor, transformOrigin: 'left', transform: `scaleX(${abre})`}} />
        <div style={{position: 'absolute', left: size * 0.12, top: 0, display: 'flex'}}>
          {digits.map((d, i) => {
            // entram um a um, da esquerda para a direita, subindo de baixo
            const q = k(T, t0 + 0.18 + i * 0.13, 0.32, EOUT);
            return (
              <div key={i} style={{position: 'relative', width: dw, height: size * 0.92, overflow: 'hidden'}}>
                <div style={{height: size * 0.92, fontFamily: GROT, fontSize: size, lineHeight: `${size * 0.92}px`, color: F.branco, textAlign: 'center', letterSpacing: '-0.04em',
                  transform: `translateY(${(1 - q) * size * 0.95}px)`}}>{d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---------- painel de cor que cresce, com linhas que empilham ----------
export const Painel: React.FC<{T: number; t0: number; w: number; h: number; cor?: string; op?: number; de?: 'baixo' | 'esq'}> = ({T, t0, w, h, cor = F.lar, op = 0.92, de = 'baixo'}) => {
  const q = k(T, t0, 0.5, S);
  return <div style={{width: w, height: h, background: cor, opacity: op, transformOrigin: de === 'baixo' ? '50% 100%' : '0 50%', transform: de === 'baixo' ? `scaleY(${q})` : `scaleX(${q})`}} />;
};

// ---------- chicote (transição com desfoque + escala) ----------
export const chicote = (T: number, t: number, d = 0.35) => {
  const a = k(T, t - d, d, EIN);
  const b = 1 - k(T, t, d, EOUT);
  const w = T < t ? a : b;
  return {blur: w * 28, scale: 1 + w * 0.18, op: 1};
};

// ---------- posição absoluta ----------
export const At: React.FC<{x: number; y: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);

// ---------- cena: intervalo [a, b) na timeline ----------
// CORTE_SECO: sem animação de entrada nem de saída nas cenas — a cena aparece e some no corte.
// Dentro da cena, letras, blocos e fios continuam animando.
export const CORTE_SECO = true;
export const Whip: React.FC<{T: number; a: number; b: number; children: React.ReactNode}> = ({T, a, b, children}) => {
  if (CORTE_SECO) return T >= a && T < b ? <AbsoluteFill>{children}</AbsoluteFill> : null;
  if (T < a - 0.3 || T > b + 0.3) return null;
  const inn = k(T, a - 0.05, 0.3, EOUT);
  const out = k(T, b - 0.25, 0.3, EIN);
  const blur = (1 - inn) * 26 + out * 26;
  const sc = lerp(1.12, 1, inn) * lerp(1, 1.16, out);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, inn * 1.6) * (1 - out * 0.9), filter: blur > 0.3 ? `blur(${blur}px)` : undefined, transform: `scale(${sc})`}}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- fundo da composição: transparente na camada final; no rascunho, marca os trechos de câmera ----------
export const Fundo: React.FC<{camada?: boolean}> = ({camada}) => (
  camada ? null : (
    <AbsoluteFill style={{background: '#2a2622', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: "'Roboto Mono', monospace", fontSize: 34, color: 'rgba(239,235,216,0.45)'}}>[ apresentador na câmera ]</div>
    </AbsoluteFill>
  )
);
