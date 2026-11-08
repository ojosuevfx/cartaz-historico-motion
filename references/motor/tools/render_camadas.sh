#!/usr/bin/env bash
# Render final: 1080p ProRes 4444 XQ com alfa, GPU (angle), só os trechos de tools/segmentos.json.
# Rode na pasta do motor, depois de: npx remotion bundle src/index.ts --out-dir=out/bundle
# Variáveis: CONC (concorrência, padrão 4), OUT (pasta de saída), GL (padrão angle).
# Pode ser interrompido: o que já terminou fica em feitos.txt e é pulado.
CONC="${CONC:-4}"; OUT="${OUT:-out/final_1080}"; GL="${GL:-angle}"
[ -f tools/segmentos.json ] || { echo "Falta tools/segmentos.json: rode tools/segmentos.py"; exit 1; }
[ -d out/bundle ] || { echo "Falta out/bundle: rode npx remotion bundle src/index.ts --out-dir=out/bundle"; exit 1; }
LOGS="$OUT/logs"; mkdir -p "$LOGS"
LISTA="$LOGS/lista.txt"; FEITOS="$LOGS/feitos.txt"; LOG="$LOGS/render.log"
touch "$FEITOS"
python -I -c "import json;[print(o['comp'],o['f0'],o['f1'],o['nome']) for o in json.load(open('tools/segmentos.json',encoding='utf-8'))]" | tr -d '\r' > "$LISTA"
ERROS=0
while read -r C F0 F1 N; do
  grep -qx "$N" "$FEITOS" && continue
  t0=$(date +%s)
  if npx remotion render out/bundle "$C" "$OUT/$N.mov" --frames="$F0-$F1" --codec=prores --prores-profile=4444-xq \
      --pixel-format=yuva444p10le --image-format=png --concurrency="$CONC" --gl="$GL" --timeout=120000 \
      --props='{"camada":true}' > "$LOGS/log_$N.txt" 2>&1 < /dev/null; then
    echo "$N" >> "$FEITOS"
    echo "$(date +%H:%M) $N ok ($(( $(date +%s) - t0 )) s, $(du -h "$OUT/$N.mov" | cut -f1))" | tee -a "$LOG"
  else
    ERROS=$((ERROS + 1))
    echo "$(date +%H:%M) $N ERRO: veja $LOGS/log_$N.txt" | tee -a "$LOG"
  fi
done < "$LISTA"
echo "$(date +%H:%M) FIM, $ERROS erro(s)" | tee -a "$LOG"
[ "$ERROS" -eq 0 ]
