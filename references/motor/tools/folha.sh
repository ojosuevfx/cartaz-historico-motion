#!/usr/bin/env bash
# Folha de contato para conferir um render: bash tools/folha.sh video.mp4 saida.png [colunas] [linhas]
# Quadros igualmente espaçados do início ao último, com o tempo em segundos escrito em cada um. Precisa de ffmpeg e Pillow.
V="$1"; O="$2"; C="${3:-6}"; R="${4:-5}"
TMP=$(mktemp -d)
python - "$V" "$TMP" "$C" "$R" <<'PY'
import subprocess, sys
from PIL import Image, ImageDraw
v, tmp, c, r = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v], capture_output=True, text=True).stdout)
n = c * r
ts = [max(0, d - 0.15) * i / (n - 1) for i in range(n)]  # 0,15 s antes do fim: seek no último quadro pode não devolver nada
W, H = 480, 270
sh = Image.new('RGB', (W * c, H * r))
for i, t in enumerate(ts):
    p = f'{tmp}/{i}.png'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', v, '-frames:v', '1', '-vf', f'scale={W}:{H}', p], check=True)
    im = Image.open(p).convert('RGB')
    dr = ImageDraw.Draw(im); dr.rectangle((0, 0, 62, 16), fill=(0, 0, 0)); dr.text((4, 2), f'{t:.1f} s', fill=(255, 255, 255))
    sh.paste(im, ((i % c) * W, (i // c) * H))
sh.save(tmp + '/folha.png')
PY
mv "$TMP/folha.png" "$O"; rm -rf "$TMP"
