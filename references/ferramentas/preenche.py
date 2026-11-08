"""Preenche buracos do alfa de um recorte (partes claras da figura que o rembg deixou transparentes). uso: preenche.py recorte.png"""
import sys, cv2, numpy as np
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGBA')
a = np.array(im.getchannel('A'))
m = (a > 40).astype(np.uint8) * 255
cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
full = np.zeros_like(m); cv2.drawContours(full, cs, -1, 255, -1)
na = np.maximum(a, cv2.GaussianBlur(full, (3, 3), 0))
im.putalpha(Image.fromarray(na)); im.save(sys.argv[1]); print(sys.argv[1], 'ok')
