# Imagens: de onde vêm e como recriar

A regra é simples: **a fonte é real e a recriação é fiel.** O gerador de imagens muda a composição e o acabamento, não o que aconteceu nem quem é a pessoa.

## 1. Buscar a fonte

Procure a obra, a foto ou o documento do próprio fato ou pessoa, na maior resolução disponível. O Wikimedia Commons costuma ser o melhor ponto de partida para história. Se a skill `get-brolls` estiver instalada, use-a para buscar, aprovar e registrar a origem.

Para cada imagem, guarde em `CREDITOS.md`: item, arquivo, autor, licença e página. Domínio público dispensa autorização, mas o crédito ajuda a conferir depois. CC BY exige atribuição. Material com copyright: avise item a item e só use depois de a pessoa assumir, no chat.

## 2. Escolher o tratamento

| Imagem real | Tratamento | Cena |
| :--- | :--- | :--- |
| Horizontal, com espaço vazio | Crop 16:9, texto no vazio da própria imagem | `Evento` |
| Horizontal, sem espaço | Recriação 16:9 com um lado livre | `Evento` |
| Retrato vertical | Recriação 16:9 da mesma pintura, figura deslocada para um terço | `RetratoPintado` |
| Retrato, para abrir com impacto | Serigrafia duotone laranja sobre creme, mais alfa no mesmo enquadramento | `Serigrafia` |
| Retrato antigo ou fraco | Recorte P&B, medalhão | `RecorteCreme`, `Medalhao` |
| Duas ou mais pessoas | Recortes P&B com a mesma base de ombros | `PainelGrupo` |
| Documento ou lei | Scan real, sem recriar | `Documento` |
| Foto documental | P&B em tela cheia | `SequenciaFotos` |

## 3. Recriar no gerador

O doc original usou o ChatGPT no navegador, porque ele recebe a imagem de referência e devolve em 16:9. Anexe a imagem real e peça a recriação, descrevendo o que deve ser preservado. Modelos de pedido:

**Pintura em tela cheia**
> Recrie esta mesma pintura de forma fiel: mesmas pessoas, roupas, rosto, gestos e paleta de época. Formato 16:9. Coloque a figura no terço direito, com o corpo começando em cerca de 55% da largura, e estenda o cenário da própria pintura para a esquerda, para ficar livre para texto. Não adicione texto, moldura, assinatura ou marca d'água.

**Serigrafia em duotone**
> Recrie este retrato como serigrafia em duas tintas: traço e hachura em laranja queimado #E0662A sobre papel creme #F6E6C8. Mesmo rosto, mesma pose e mesma roupa. Formato 16:9, figura no terço direito e da cintura para cima, resto do papel limpo. Sem texto.

**Recorte em gravura**
> Recrie esta figura como gravura P&B sobre fundo creme liso, sem nenhum outro elemento. Mesmo rosto, pose e roupa. Figura inteira no quadro, com margem em volta.

**Fundo** (única imagem que pode nascer do zero)
> Fundo de cartaz em laranja queimado #E0662A com textura de papel impresso, fios duplos e ornamentos gráficos antigos em creme, sem texto, formato 16:9.

### O que costuma dar errado

- **O gerador centraliza a figura.** Peça de novo na mesma conversa: "desloque para o terço direito, corpo começando em cerca de 55% da largura".
- **Ele inventa cena em vez de recriar.** Este é o erro mais grave, porque a imagem fica bonita e passa despercebida. No doc original, a "recriação" da aquarela da Bastilha virou outra cena, com outra composição e uma bandeira tricolor que a obra não tem. E a gravura de Kant, de perfil, voltou de três quartos, com outro rosto. Se a imagem não sobreviver à comparação, descarte e peça de novo, ou use o original.
- **Texto inventado na imagem.** Em pintura de documento, o gerador costuma escrever letras falsas em áreas legíveis. Documento vai pelo scan real.
- **Resolução.** A saída costuma ter cerca de 1670×940. Dá conta em 1080p, mas pense nisso antes de um zoom forte. Serigrafia aguenta close maior que pintura.

## 4. Recortar

Com `rembg`, `opencv-python` e `pillow` instalados:

```bash
pip install "rembg[cpu]" opencv-python pillow
python references/ferramentas/recorta.py entrada.png saida_recorte.png --sem-matting --modelo u2net_human_seg
python references/ferramentas/preenche.py saida_recorte.png
python references/ferramentas/alfa_cheio.py serigrafia.png serigrafia_alfa.png
```

- `--modelo u2net_human_seg`: para pessoa. Separou o Kant do fundo escuro da gravura, onde o modelo padrão falhou. Em objeto, deixe o padrão.
- `--sem-matting`: em gravura grande, o refinamento de bordas travou por mais de 12 minutos.
- `preenche.py`: fecha buracos no alfa, comuns em partes claras da figura.
- `alfa_cheio.py`: gera o alfa no mesmo enquadramento da imagem, para o nome passar atrás da figura em `Serigrafia`.
- Se o fundo for difícil, como oval ou gravura densa, peça ao gerador a figura sobre creme liso e recorte essa versão.

## 5. Conferir antes de animar

Ponha a original e a recriada **lado a lado** e olhe. Essa etapa é obrigatória para cada imagem, e a resposta precisa ser sim em todas:

- A composição é a mesma, tirando o que foi pedido para deslocar?
- A pose e a direção do rosto são as da obra? Perfil continua perfil.
- O rosto ainda é o da pessoa?
- Tudo o que aparece está na obra? Bandeira, objeto, pessoa ou arquitetura a mais reprovam a imagem, ainda mais quando é anacrônico.
- A foto é de quem o nome diz? Numa busca por "Francisco", veio um general americano no lugar do papa.
- A época bate? Se a foto é posterior ao fato citado, identifique isso na tela.
- Há espaço para o texto sem passar por cima do rosto?

Se o gerador não acertar depois de duas tentativas, use a obra real: recorte, duotone ou crop 16:9. As imagens de `motor/public/img` foram feitas assim, sem gerador, e dão conta do estilo. Só os fundos foram gerados.
