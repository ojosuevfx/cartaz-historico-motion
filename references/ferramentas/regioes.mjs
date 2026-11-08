// Agrupa divisões atuais em regiões de época e gera o JSON de <MapaRegioes dados={...} />.
// Copie este arquivo para a pasta do motor e rode lá:
//   npm install --no-save --legacy-peer-deps topojson-server
//   node regioes.mjs entrada.geojson src/regioes.json
// Edite CAMPO e GRUPOS para o seu mapa. O exemplo agrupa estados do Brasil em províncias de 1874.
// Os polígonos do GeoJSON precisam estar no sentido horário: o d3-geo trata o anti-horário como o mundo menos o polígono.
// Confira as fronteiras de época com uma fonte histórica: isto é uma aproximação por agrupamento.
import fs from 'node:fs';
import {topology} from 'topojson-server';
import {merge, mesh} from 'topojson-client';

const [, , entrada, saida] = process.argv;
if (!entrada || !saida) {
  console.error('uso: node regioes.mjs entrada.geojson saida.json');
  process.exit(1);
}

const CAMPO = 'sigla';
const GRUPOS = {
  AM: 'Amazonas', RR: 'Amazonas', RO: 'Matto-Grosso', PA: 'Grão-Pará', AP: 'Grão-Pará', MA: 'Maranhão', PI: 'Piauhy', CE: 'Ceará',
  RN: 'Rio Grande do Norte', PB: 'Parahyba', PE: 'Pernambuco', AL: 'Alagôas', SE: 'Sergipe', BA: 'Bahia', MG: 'Minas Geraes', ES: 'Espírito Santo',
  RJ: 'Rio de Janeiro', SP: 'São Paulo', PR: 'Paraná', SC: 'Santa Catharina', RS: 'Rio Grande do Sul', GO: 'Goyaz', TO: 'Goyaz', DF: 'Goyaz',
  MT: 'Matto-Grosso', MS: 'Matto-Grosso',
};

const g = JSON.parse(fs.readFileSync(entrada, 'utf-8'));
g.features = g.features.filter((f) => GRUPOS[f.properties[CAMPO]]);
const topo = topology({e: g}, 1e5);
const geoms = topo.objects.e.geometries;
const nomes = [...new Set(g.features.map((f) => GRUPOS[f.properties[CAMPO]]))];
const prov = nomes.map((n) => ({
  type: 'Feature',
  properties: {nome: n},
  geometry: merge(topo, geoms.filter((x) => GRUPOS[x.properties[CAMPO]] === n)),
}));
const borda = mesh(topo, topo.objects.e, (a, b) => a !== b && GRUPOS[a.properties[CAMPO]] !== GRUPOS[b.properties[CAMPO]]);
const contorno = merge(topo, geoms);
fs.writeFileSync(saida, JSON.stringify({prov, borda, contorno}));
console.log(nomes.length, 'regiões');
