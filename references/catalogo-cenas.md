# Catálogo de cenas

Use a tabela para decidir a cena de cada fala. Se nenhuma servir, invente uma com as mesmas primitivas. Para ver cada cena em uso: `motor/src/Demo.tsx` tem capítulo, serigrafia, mapa, blocos, evento, citação, linha do tempo e continua; `motor/src/Exemplos.tsx` tem as outras, com textos de mentira. As props de cada componente estão no próprio `.tsx` e na seção [Props principais](#props-principais).

| A fala traz | Cena | Componente | Como é |
| :--- | :--- | :--- | :--- |
| Troca de assunto | Card de capítulo | `cenas/Capitulo` | Cartaz laranja com fios creme, "capítulo 0X", título grande, figura P&B em primeiro plano, zoom contínuo |
| Pessoa que a fala desenvolve | Retrato pintado | `cenas/Pessoa` → `RetratoPintado` | Pintura em tela cheia, push lento, nome em letras espalhadas ao lado do rosto, etiquetas com cargo e data |
| Pessoa que a fala desenvolve | Serigrafia | `cenas/Pessoa` → `Serigrafia` | Close no rosto em duotone, recua, nome grande atrás da figura. Precisa da imagem e do alfa no mesmo enquadramento |
| Retrato vertical real sem recriação | Recorte sobre creme | `cenas/Retratos` → `RecorteCreme` | Figura recortada embaixo, título gigante atrás, linha digitada em cima |
| Retrato pequeno ou antigo | Medalhão | `cenas/Retratos` → `Medalhao` | Oval com borda sobre o papel com faixa de pintura |
| Vários retratos em sequência | Medalhões em fila | composição com `Medalhao` ou ovais em `Stage` | Close no primeiro, depois a fila, com os anos |
| Citado + novo sem aprofundar | Painel de grupo | `cenas/PainelGrupo` | Figuras P&B embaixo, painel laranja sobe por trás e termina rente aos ombros |
| Lugar | Mapa do mundo | `cenas/Mapa` | Terra preta sobre creme, câmera desce, resto desbota, fio tracejado cai no ponto. `arcos` desenha viagens |
| Lugar dentro de um país, com nomes de época | Mapa de regiões | `cenas/MapaRegioes` | Regiões escuras, nomes antigos, câmera colada que recua. Dados em `ferramentas/regioes.mjs` |
| Data ou acontecimento | Evento | `cenas/Evento` | Pintura de época em tela cheia, título branco empilhado, anos em blocos ligados por pontilhado |
| Lei, livro, documento físico | Documento | `cenas/Documento` → `Documento` | Papel real inclinado, título à esquerda, ano em bloco |
| Trecho lido de um texto | Página com destaque | `cenas/Documento` → `PaginaDestaque` + `Marca` | Página recomposta, marca-texto correndo na palavra falada, fonte embaixo |
| Citação curta e forte | Citação | `cenas/CitacaoMaquina` | Fundo laranja, máquina de escrever no tempo da fala, destaque em preto, fonte em mono |
| Fatos encadeados no tempo | Linha do tempo | `cenas/LinhaTempo` | Régua, barra que cresce, marcos com fio e cruz, câmera percorre |
| Fotos reais em série | Sequência de fotos | `cenas/Retratos` → `SequenciaFotos` | P&B em tela cheia, cerca de 2 s cada, corte seco, push lento |
| Conceito abstrato, dado, comparação | Explicação no palco | `colagem` + `palco` (`Stage`, `Bloco`, `Fio`, `Cruz`, `Mono`, `Titulo`, `Caixa`) | Papel, blocos contáveis, fios que se desenham, título fixo em cima à esquerda |
| Início do vídeo | Aviso inicial | `cenas/Aviso` | Fundo quase preto, AVISO em vermelho, texto digitado, assinatura em laranja |
| Fim, se a história continua | Continua | `cenas/Continua` | Cartaz laranja, "CONTINUA..." |

## Explicações: como pensar

Transforme a ideia em objeto que dá para contar ou seguir com o olho:

- **Proporção:** blocos em grade, um deles aceso ou saindo (`TresEstados`, em `Demo.tsx`).
- **Oposição:** duas colunas ou dois rótulos num fio, com um deles riscado.
- **Hierarquia:** faixas empilhadas que sobem na fala, a maior embaixo.
- **Camadas:** dois planos que se separam na palavra em que a fala os distingue.
- **Consequência:** itens que se somam num palco, o último em laranja escuro.

Cada bloco entra na palavra falada. A câmera tem um trajeto simples, de 3 a 6 poses (`CamKey`), sempre em movimento.

## Primitivas

| Peça | Arquivo | Para quê |
| :--- | :--- | :--- |
| `F`, `GROT`, `SANS`, `MONO` | `kit.tsx` | Paleta e fontes |
| `k`, `lerp`, `S`, `EOUT`, `EIN` | `kit.tsx` | Tempo e curvas |
| `useT`, `Whip`, `Fundo`, `Filtros`, `Papel`, `Quadro` | `kit.tsx` | Tempo da timeline, cena em corte seco, transparência, filtros `#pb` e `#duo`, papel, imagem com push |
| `NomeLetras`, `Apoio`, `Etiqueta`, `AnoBloco`, `Painel` | `kit.tsx` | Tipografia e blocos |
| `Digita` | `cenas/Retratos.tsx` | Linha pequena que se digita |
| `P` | `cenas/CitacaoMaquina.tsx` | Atalho para escrever as palavras de uma citação com seus tempos |
| `Stage`, `CamKey` | `palco.tsx` | Câmera 3D contínua com leve desfoque de movimento |
| `At`, `Bloco`, `Fio`, `Cruz`, `Caixa`, `Mono`, `Palavras`, `Titulo`, `Foto`, `Milimetrado` | `colagem.tsx` | Peças das explicações |

## Tamanhos que funcionaram

- Nome em retrato pintado: 150 a 200 px, em até 3 linhas.
- Serigrafia: 170 a 240 px.
- Título de capítulo: 150 a 170 px.
- Citação: 47 a 90 px, conforme o tamanho. Confira a linha mais longa: a largura máxima é 1500 px.
- Etiqueta: 26 a 40 px com fonte Archivo, 52 a 58 px com Archivo Black.
- Marco de linha do tempo: 40 a 56 px, mais mono de 24 px.

## Linha do tempo: como evitar colisão

Os marcos têm dois níveis (`dy: 0` e `dy: 170`) e podem abrir para a esquerda (`left: true`). Antes de renderizar, confira duas coisas: se um rótulo encosta no vizinho do mesmo nível e se o fio de um marco cruza o texto de outro. Quando as datas estão próximas, abra uma para a esquerda.

## Props principais

Todos recebem `T` (tempo atual) e os tempos em segundos da timeline.

| Componente | Props |
| :--- | :--- |
| `Capitulo` | `t0`, `t1`, `bg`, `num`, `titulo[]`, `tx`, `ty`, `tsize`, `esq`/`dir` `{src, h}` |
| `RetratoPintado` | `t0`, `t1`, `src`, `nome[]`, `nomeT`, `x`, `y`, `size`, `infos[]` `{txt, t, cor}`, `pos`, `origin`, `z` |
| `Serigrafia` | `t0`, `recuaT`, `src`, `alfa`, `foco [x, y]` (0 a 1), `sobre`, `sobreT`, `nome[]`, `nomeT`, `size`, `x`, `y`, `infos[]`, `closeInfos[]` |
| `RecorteCreme` | `t0`, `t1`, `bg`, `recorte`, `h`, `x`, `titulo[]`, `tituloT`, `tx`, `ty`, `size`, `apoio`, `apoioT` |
| `Medalhao` | `t0`, `t1`, `bg`, `src`, `pos`, `linhas[]` `{pre, txt, t}`, `apoio`, `apoioT`, `size` |
| `SequenciaFotos` | `fotos[]` `{src, t, pos}`, `fim`, `titulo[]`, `tituloT`, `apoio`, `apoioT` |
| `CenaPainelGrupo` | `t0`, `figuras[]` `{src, ar, nome, nomeT, hf}`, `linhas[]` `{txt, t, size, cor}`, `h`, `sobrepoe` |
| `Evento` | `t0`, `t1`, `src`, `linhas[]` `{txt, t, size}`, `anos[]` `{ano, t}`, `x`, `y`, `pan`, `zoom`, `pos`, `sombra`, `dur`, `anoSize`, `extra` |
| `Documento` | `t0`, `t1`, `src`, `w`, `titulo[]`, `tituloT`, `size`, `ano`, `anoCima`, `anoT`, `apoio`, `apoioT`, `apoio2`, `apoio2T` |
| `PaginaDestaque` + `Marca` | `t0`, `t1`, `tipo`, `titulo`, `subtitulo`, `detalhe`, `fonte`, `children`; `Marca`: `t`, `d` |
| `CitacaoMaquina` | `t0`, `t1`, `linhas` (use `P`), `fonte`, `fonteT`, `size`, `bg`, `sobre` |
| `LinhaTempo` | `t0`, `cam`, `x(v)`, `regua[]`, `de`, `ate`, `barra`, `marcos[]` `{v, at, big, sub, subAt, dy, left, cor, size}` |
| `Mapa` | `cam[]` `{t, lon, lat, z, rx, ry}`, `foco[]` (ISO numérico: Brasil 076, França 250), `desbota`, `pino`, `nome`, `arcos[]` |
| `MapaRegioes` | `dados`, `cam[]` `{t, x, y, z}`, `destaque`, `destaqueT`, `rotulos`, `ajustes` |
| `Continua` | `t0`, `t1`, `apoio`, `bg` |
| `Aviso` | `linhas[]`, `produtora`, `fantasmas` |

No título de `Evento`, confira o contraste: com imagem clara, suba `sombra` até o branco ficar legível.
