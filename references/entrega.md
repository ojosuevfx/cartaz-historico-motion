# Entrega: render, Premiere e After Effects

Entrega em camadas, nunca um vídeo único: quem edita precisa continuar cortando a montagem.

## 1. Listar os trechos

Só os trechos com cena são renderizados. Os do apresentador ficam de fora: "n é pra gravar os trechos". `segmentos.py` lê os `<Whip>` de cada composição, junta os colados e gera a lista:

```bash
python tools/segmentos.py --total 2140.3 src/Cap01.tsx:Cap01:C1 src/Cap02.tsx:Cap02:C2
```

Cada argumento é `arquivo:composição:prefixo`, em que o prefixo aponta para as constantes `C1_T0` e `C1_T1` do arquivo. Sem constantes, o início vale 0. O script mostra o percentual coberto e grava `tools/segmentos.json`.

## 2. Renderizar

```bash
npx remotion bundle src/index.ts --out-dir=out/bundle
CONC=4 bash tools/render_camadas.sh
```

Sai em `out/final_1080/`, um `.mov` por trecho, com o tempo no nome (`03-00_50_Cap01.mov`). O script pula o que já terminou, então pode ser interrompido e retomado.

Decisões que valeram no doc original:

- **1080p ProRes 4444 XQ com alfa.** 4K foi cerca de 5 vezes mais lento e 3 vezes mais pesado, sem ganho numa sequência 1080.
- **`--gl=angle` liga a GPU.** Num teste de 180 quadros levou 34 s, contra 103 s de `swangle`, com saída visualmente igual. ProRes continua codificado na CPU: placas NVIDIA não codificam ProRes.
- **Concorrência:** 10 funcionou com o resto do sistema livre; com Premiere e After abertos, o navegador do render travou e 4 resolveu. Se aparecer `Target closed`, baixe a concorrência.
- **Espaço:** calcule cerca de 5 GB por minuto animado em ProRes 4444 XQ, e avise antes.
- Confira o resultado com `ffprobe`: a duração de cada arquivo tem que bater com a esperada.

## 3. Colocar no Premiere

Antes de mudar qualquer coisa, inspecione sequências e trilhas. Depois:

1. Crie uma trilha de vídeo acima do apresentador e uma pasta para as camadas.
2. Importe cada `.mov` e coloque no tempo do `segmentos.json`, sem áudio. Pelo MCP do Premiere, `add_to_timeline` com `linkAudio: false`.
3. Audite as emendas (próxima seção).
4. Compare as trilhas antes e depois: as do apresentador não podem mudar.
5. Exporte alguns quadros com `export_frame` e olhe.

### Armadilhas conhecidas

- **Buraco de 1 quadro nas emendas.** Sequência a 29,97 com arquivos a 30 faz dois trechos colados ficarem separados por 1 quadro, e o apresentador pisca. Liste as emendas com intervalo menor que 0,2 s e puxe o segundo trecho 1 quadro para trás.
- **`import_folder` com pasta de destino falhou** (`targetBin.importFiles is not a function`). Importe arquivo a arquivo com `import_media`, que respeita `binName`. Tire logs e outros arquivos da pasta antes.
- **Resposta grande.** `list_sequence_tracks` passa do limite numa sequência com centenas de clipes. Leia o arquivo salvo com um script, sem carregar tudo.
- **Quem edita pode estar mexendo ao mesmo tempo.** Releia as trilhas antes de cada lote, em vez de confiar em tempos antigos. Se os clipes andaram junto com um corte dele, está certo: não "conserte".

## 4. Ligar ao After Effects (opcional)

Para aplicar acabamento nas camadas mantendo tudo conectado por Dynamic Link:

1. No Premiere, substitua **um** clipe por uma composição do After (*Substituir por composição do After Effects*) e monte nela as camadas de ajuste. No doc original: `Posterizar tempo` e `S_HalfTone` (Sapphire, plugin pago). Essa é a comp-base.
2. Edite o topo de `tools/linked_comps.jsx` (`BASE`, `PASTA`, `PREFIXO`, `INICIO`) e rode no After aberto, com *Permitir que scripts gravem arquivos* ligado:
   ```bash
   "C:/Program Files/Adobe/Adobe After Effects 2026/Support Files/AfterFX.exe" -r "C:\\caminho\\tools\\linked_comps.jsx"
   ```
   O script duplica a comp-base para cada `.mov` da pasta, troca o vídeo, ajusta as durações e salva o projeto.
3. No Premiere, importe as comps. Pelo MCP, com `execute_extendscript` (o corpo do script usa `return`):
   ```js
   var bin = app.project.rootItem.createBin('LINKED COMPS AE');
   var ok = app.project.importAEComps('C:\\caminho\\projeto.aep', ['nome da comp 1', 'nome da comp 2'], bin);
   ```
4. Troque cada clipe pela comp correspondente com `replace_clip`. Teste em um antes do resto.

### Armadilhas do `replace_clip` com comp do After

- **Encurta o clipe.** Um trecho de 19 s ficou com 14 s. Depois da troca, ajuste `clip.end` para `clip.start + projectItem.getOutPoint()`. O `outPoint` pode continuar mostrando o valor antigo; confira pela duração e por um quadro exportado.
- **Muda o modo de mesclagem.** O clipe trocado ficou misturado com o apresentador. Leia o valor no clipe que você trocou à mão e aplique nos outros. Na versão testada, o valor certo era 18:
   ```js
   // componente "Opacidade", propriedade de índice 1 = modo de mesclagem
   prop.setValue(18, true);
   ```
- **Move ou corta 1 ou 2 quadros.** Compare os inícios antes e depois. Esticar um clipe até a duração cheia pode comer o primeiro quadro do seguinte, se forem colados.
- O script do After roda pelo `AfterFX.exe -r`. O painel MCP do After só aceita scripts predefinidos.

## 5. Conferência final

- Trilhas do apresentador iguais às de antes, clipe a clipe.
- Nenhum buraco nas emendas.
- Um quadro exportado de cada capítulo, com o visual certo.
- Projetos do Premiere e do After salvos.
- Diga o que foi conferido e o que não foi. Olhar quadros não é assistir à timeline.
