import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F, Filtros, Fundo, Whip, useFontsFiguras, useT} from './kit';
import {Documento, Marca, PaginaDestaque} from './cenas/Documento';
import {MapaRegioes} from './cenas/MapaRegioes';
import {CenaPainelGrupo} from './cenas/PainelGrupo';
import {RetratoPintado} from './cenas/Pessoa';
import {Medalhao, RecorteCreme, SequenciaFotos} from './cenas/Retratos';

// EXEMPLOS: uma cena de cada componente que a Demo não usa, com textos de mentira.
// Serve para ver as props em uso. Num vídeo real, cada imagem é a da pessoa ou do fato citado.
export const EX_DUR = 24;

// sentido horário, como o d3-geo espera
const quad = (nome: string, a: number, b: number, c: number, d: number) => ({type: 'Feature', properties: {nome}, geometry: {type: 'Polygon', coordinates: [[[a, b], [a, d], [c, d], [c, b], [a, b]]]}});
const DADOS = {
  prov: [quad('Norte', -60, -5, -40, 0), quad('Sul', -60, -10, -40, -5)],
  borda: {type: 'LineString', coordinates: [[-60, -5], [-40, -5]]},
  contorno: quad('Tudo', -60, -10, -40, 0),
};

export const Exemplos: React.FC<{camada?: boolean}> = ({camada}) => {
  useFontsFiguras();
  const T = useT(0);
  const ar = 1270 / 1169;
  return (
    <AbsoluteFill>
      <Fundo camada={camada} />
      <Filtros />
      <Whip T={T} a={0} b={3}><RetratoPintado T={T} t0={0} t1={3} src="img/kant_serigrafia.jpg" nome={['NOME', 'DA PESSOA']} nomeT={0.2} x={1000} y={340} size={130} infos={[{txt: 'cargo ou data', t: 0.6, cor: 'esc'}]} /></Whip>
      <Whip T={T} a={3} b={6}><RecorteCreme T={T} t0={3} t1={6} bg="img/bg_creme_liso.jpg" recorte="img/kant_recorte.png" h={820} x={960} titulo={['TÍTULO']} tituloT={3.2} tx={110} ty={380} size={200} apoio="linha que se digita" apoioT={3.5} /></Whip>
      <Whip T={T} a={6} b={9}><Medalhao T={T} t0={6} t1={9} bg="img/bg_creme_faixa.jpg" src="img/kant_recorte.png" pos="40% 20%" linhas={[{pre: 'um', txt: 'FILÓSOFO', t: 6.3}]} apoio="linha de apoio" apoioT={6.8} /></Whip>
      <Whip T={T} a={9} b={12}><CenaPainelGrupo T={T} t0={9} figuras={[{src: 'img/kant_recorte.png', ar, nome: 'Pessoa já citada', nomeT: 9.5}, {src: 'img/kant_recorte.png', ar, nome: 'Pessoa nova', nomeT: 9.7}]} linhas={[{txt: 'A MESMA PENA', t: 9.6, size: 90}]} h={620} /></Whip>
      <Whip T={T} a={12} b={15}><Documento T={T} t0={12} t1={15} src="img/ddhc_lebarbier.jpg" w={800} titulo={['A LEI']} tituloT={12.3} ano="1789" anoT={12.8} apoio="linha de apoio" apoioT={13} /></Whip>
      <Whip T={T} a={15} b={18}><PaginaDestaque T={T} t0={15} t1={18} tipo="DOCUMENTO" titulo="TÍTULO" subtitulo="SUBTÍTULO" detalhe="data ou contexto" fonte="fonte do trecho"><b>1.</b> Texto antes <Marca T={T} t={15.5}>do trecho que a fala destaca</Marca> e texto depois.</PaginaDestaque></Whip>
      <Whip T={T} a={18} b={21}><SequenciaFotos T={T} fim={21} fotos={[{src: 'img/bastilha_houel.jpg', t: 18}, {src: 'img/kant_serigrafia.jpg', t: 19.5}]} titulo={['FOTOS']} tituloT={18.2} apoio="fotos reais em série" apoioT={18.6} /></Whip>
      <Whip T={T} a={21} b={24}><div style={{position: 'absolute', inset: 0, background: F.paper}}><MapaRegioes T={T} dados={DADOS} destaque="Norte" destaqueT={21.2} cam={[{t: 21, x: 960, y: 440, z: 2}, {t: 24, x: 960, y: 540, z: 1}]} /></div></Whip>
    </AbsoluteFill>
  );
};
