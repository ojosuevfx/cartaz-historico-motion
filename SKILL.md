---
name: cartaz-historico-motion
description: Estilo CARTAZ HISTÓRICO — mini-doc narrado com cerca de 80% da timeline coberta por animação editorial em Remotion, sincronizada palavra a palavra com a fala. Colagem de papel creme, laranja queimado e preto, pinturas e gravuras de época de fontes reais recriadas com fidelidade, nomes em grotesca que entram letra a letra, anos em blocos de cor, mapas, linhas do tempo, citações em máquina de escrever e cards de capítulo, entregue em camadas ProRes com alfa no Premiere e ligada ao After Effects por Dynamic Link. Use quando pedirem "estilo CARTAZ", "cartaz histórico", "o estilo do doc do liberalismo", "animar as falas do mini doc", "mini-doc animado", "documentário com colagem", "cobrir 80% com animação", "card de capítulo", "aviso inicial estilo documentário", ou quiserem animar um documentário histórico já decupado no Premiere, mesmo sem citar a skill. Also for English requests - animated history documentary, editorial collage motion graphics, voice-synced Remotion overlays for Premiere.
---

# CARTAZ HISTÓRICO — mini-doc animado em colagem editorial

Nasceu de um mini-doc real de 35 minutos, com 87% da timeline animada. Cada regra abaixo veio de uma correção feita durante esse trabalho. Antes de começar, olhe [`assets/`](assets/): `cenas-pessoas.jpg`, `cenas-fatos.jpg`, `aviso-e-continua.jpg`, `demo.mp4`. A demo é sobre a Revolução Francesa só para mostrar os tipos de cena, com as obras originais em vez de recriações.

- Quando usar cada cena e o componente de cada uma: [`references/catalogo-cenas.md`](references/catalogo-cenas.md)
- Como conseguir e recriar as imagens: [`references/imagens.md`](references/imagens.md)
- Render, Premiere, After Effects e as armadilhas de cada um: [`references/entrega.md`](references/entrega.md)
- Motor Remotion: [`references/motor/`](references/motor/) (`src/kit.tsx` e `src/colagem.tsx` primitivas; `src/palco.tsx` câmera; `src/cenas/` cenas prontas; `src/Molde.tsx` ponto de partida; `src/Demo.tsx` e `src/Exemplos.tsx` exemplos; `tools/` segmentos, render e folha de contato)
- Ferramentas de imagem: [`references/ferramentas/`](references/ferramentas/) (`recorta.py`, `preenche.py`, `alfa_cheio.py`, `regioes.mjs`)

Ao começar, diga (sem pedir confirmação): *"Vou aplicar o estilo CARTAZ HISTÓRICO: animação sincronizada com a fala em cerca de 80% da timeline, imagens de fontes reais recriadas com fidelidade, papel creme, laranja e preto, entregue em camadas no Premiere."*

## Autonomia criativa

Invente cenas novas a partir do que a fala diz. O catálogo ensina uma gramática, não é uma lista fechada: "tenha a mesma iniciativa" foi a instrução original. Pergunte só o que mude o sentido (nome, data, trecho da fala) ou o que só a pessoa pode decidir (o nome da assinatura, o texto do aviso, uma imagem com direitos).

## O que fica fixo

- **Paleta** (`F` no kit): papel `#EFEBD8`, tinta `#16110E`, laranja `#E0662A`, laranja claro `#F2A46B`, laranja escuro `#B9501D`, branco `#FBF8EE`. Vinho `#7E2328` só para condenação e documento solene. Se pedirem outro acento, troque nas constantes e mantenha um único: o estilo nasceu em azul e virou laranja com uma frase ("ao invés daquele azul, vamos para um laranja").
- **Tipografia:** Archivo Black em caixa alta para nomes e títulos, Archivo para apoio, Roboto Mono para rótulos e fontes. Merriweather só no aviso inicial e em página de texto.
- **Como o texto entra:** nome e título com letras espalhadas fora de ordem (`NomeLetras`); apoio pequeno digitando (`Digita`, `Mono`); ano em bloco de cor com dígitos subindo (`AnoBloco`); citação em máquina de escrever.
- **Nada parado:** toda imagem tem push-in ou pan lento; explicação vive em `Stage`, com câmera que anda e respira.
- **Corte seco:** cena entra e sai no corte (`CORTE_SECO = true`), sem chicote, fade ou desfoque de transição. Dentro da cena, letras, blocos e fios continuam animando. Só o aviso inicial usa fade.
- **Sincronia:** cada texto entra na palavra falada, com o tempo do Whisper. Os tempos no código são os da timeline, em segundos, para dar para ler a decupagem no próprio código.
- **Uma ideia por quadro.** Sem moldura, sem ícone, sem cartunização: só pintura, foto ou gravura, tipografia e blocos de cor.

## As regras (todas vieram de correções)

**Cobertura**

1. **Cerca de 80% da timeline em animação.** O apresentador aparece nos respiros: argumento pessoal, pergunta direta a quem assiste, frase de impacto. Marque esses trechos na decupagem e deixe sem `<Whip>`.
2. **Quem ganha animação:** se a pessoa é citada e a fala passa a tratar dela, ganha cena de apresentação. Citação de relance fica sem animação.
3. **B-roll de vídeo real só na contextualização**, numa trilha separada acima, para quem edita escolher no Premiere entre ele e a animação.

**Imagens**

4. **Fonte sempre real.** Pintura, foto, documento ou gravura do próprio fato ou pessoa, em alta resolução.
5. **Recriada com fidelidade** no gerador de imagens, a partir da imagem real, em 16:9 e com um lado livre para o texto. O gerador recompõe e estiliza a obra; não inventa cena. Compare **lado a lado com a original** antes de usar: uma "recriação" já voltou com uma bandeira que a obra não tem, e outra virou de perfil para três quartos. Se não passar, use a obra real com recorte, duotone ou crop.
6. **Nada de imagem genérica de IA.** Frasco de veneno ou livro gerados do nada foram rejeitados. Fundo pode ser gerado (papel, cartaz laranja, faixa em duotone). Pessoa e fato, não.
7. **Sem desfoque para abrir espaço** ("n quero imagens com esses desfoques") e **sem foto crua colada como retângulo**. Se não há espaço, recrie a imagem com o lado livre.
8. **Direitos item a item.** Prefira domínio público e registre os créditos. Material com copyright: avise e só use depois de a pessoa assumir, no chat.

**Texto na tela**

9. **Nunca em cima de rosto. Nunca um texto sobre o outro.** Na troca, um texto só entra quando o anterior já saiu; depois da edição, confira também os quadros de transição.
10. **Sem carimbo seco.** Um "NÃO" solto e girado "entra seco e sem sentido". Se os fatos se encadeiam no tempo, use a linha do tempo.
11. **Nomes, datas e citações conferidos** antes de irem para a tela. Se a fala errar (um número de papa, por exemplo), mantenha o áudio, mostre o certo e avise. Se as fontes divergirem, mostre só o que é seguro ("setembro de 1875" em vez do dia).
12. **Citação com fonte na tela.** Paráfrase é marcada como paráfrase. Tradução própria leva nota dizendo de onde veio o original.

**Pessoas**

13. **Pessoa sozinha que a fala desenvolve** ganha cena própria: pintura em tela cheia (`RetratoPintado`) ou serigrafia que recua com o nome atrás (`Serigrafia`).
14. **Painel de grupo só com mais de uma pessoa**, quando a fala junta alguém já citado com alguém novo que não será aprofundado. O painel termina rente aos ombros das figuras. "Nada de genérico."
15. **Sem ninguém no cantinho** e sem adesivo com contorno mais nome gigante ("tosco", "brega"). A imagem ocupa a tela.

**Estrutura**

16. **Troca de assunto pede card de capítulo.**
17. **Data e acontecimento:** pintura de época em tela cheia, com título em grotesca branca e anos em blocos ligados por pontilhado.
18. **Fim com gancho:** se a história continua, feche com o card `Continua`.
19. **Aviso inicial** só quando pedirem, com texto verdadeiro sobre o vídeo.

## Fluxo

1. **Inspecione o Premiere sem mexer:** sequência, trilhas, frame rate. A montagem já vem decupada.
2. **Transcreva a timeline por palavra** com Whisper, no tempo da sequência, não no do bruto.
3. **Decupe** num CSV: `id;inicio;fim;tipo;fala;na_tela`. Cada fala recebe um tipo do catálogo ou "câmera". Some a cobertura e chegue perto de 80%. Separe por capítulos.
4. **Confira os fatos** de tudo o que vai para a tela e anote o que a fala errou.
5. **Reúna e recrie as imagens** ([`references/imagens.md`](references/imagens.md)). Mostre as principais antes de animar em cima delas.
6. **Crie o projeto:** na pasta do vídeo, copie o motor e instale. Se a skill estiver em outro lugar, ajuste o caminho:
   ```bash
   cp -R ~/.claude/skills/cartaz-historico-motion/references/motor ./MOTION
   cd MOTION
   npm install --legacy-peer-deps
   ```
7. **Anime capítulo por capítulo.** Duplique o `Molde` e renomeie o componente e as constantes (`Cap01`, `C1_T0`, `C1_T1`). Escreva os tempos da timeline e registre no `Root`. Para ver as props em uso, abra `Demo.tsx` e `Exemplos.tsx`.
8. **Confira cada capítulo** com folha de contato antes de mostrar. Olhe texto cortado, texto sobre rosto, texto sobre texto e etiqueta estourando a tela.
   ```bash
   npx remotion render src/index.ts Cap01 out/Cap01_mudo.mp4 --crf=20 --concurrency=4 --gl=angle
   bash tools/folha.sh out/Cap01_mudo.mp4 out/Cap01_folha.png 6 5
   ```
9. **Mande o rascunho com a voz** e espere o "segue". Juntar o áudio da montagem ajuda quem aprova a julgar o tempo:
   ```bash
   ffmpeg -i out/Cap01_mudo.mp4 -ss INICIO -t DURACAO -i audio_montagem.wav -map 0:v -map 1:a -c:v copy -c:a aac -shortest out/Cap01_rascunho.mp4
   ```
10. **Render final e Premiere** só depois de aprovado ([`references/entrega.md`](references/entrega.md)): só os trechos animados, em ProRes 4444 XQ com alfa, cada um no seu tempo, numa trilha acima do apresentador.
11. **Entregue** dizendo o que foi conferido, o que a fala errou, o que ficou de fora e os créditos. Diga também o que não foi assistido: conferir quadros não é assistir à timeline inteira.

## Limites conhecidos

- Só foi usado em 1920×1080 a 30 fps. Formato vertical não foi testado.
- O acabamento final (posterização e halftone) foi feito no After Effects com Sapphire, um plugin pago. Ele é opcional e não está no render do Remotion.
- Render pesado: um doc de 35 minutos levou cerca de 3 h e 156 GB com GPU, em ProRes 4444 XQ a 1080p.
- A geração de imagens depende de um gerador externo operado no navegador, e o resultado varia. Confira a fidelidade de cada imagem.
- Os componentes têm posições pensadas para 1920×1080; textos muito longos pedem ajuste de tamanho.
