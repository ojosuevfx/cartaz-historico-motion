"""Recorta o fundo (rembg) e salva PNG com alfa, aparado, para o Remotion.
uso: python recorta.py entrada saida.png [--max 2400] [--sem-recorte] [--sem-matting] [--modelo u2net_human_seg]
Para pessoa, u2net_human_seg costuma recortar melhor; para objeto, isnet-general-use (padrão)."""
import sys
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
mx = int(sys.argv[sys.argv.index('--max') + 1]) if '--max' in sys.argv else 2400
im = Image.open(src).convert('RGB')
if max(im.size) > mx:
    im.thumbnail((mx, mx), Image.LANCZOS)
if '--sem-recorte' in sys.argv:
    im.save(dst); print(dst, im.size); sys.exit()
from rembg import remove, new_session
sess = new_session(sys.argv[sys.argv.index('--modelo') + 1] if '--modelo' in sys.argv else 'isnet-general-use')
am = '--sem-matting' not in sys.argv
out = remove(im, session=sess, alpha_matting=am, alpha_matting_foreground_threshold=235, alpha_matting_background_threshold=20, alpha_matting_erode_size=8)
bbox = out.getchannel('A').point(lambda a: 255 if a > 12 else 0).getbbox()
if bbox:
    out = out.crop(bbox)
out.save(dst, optimize=True)
print(dst, out.size)
