"""Gera PNG com alfa no MESMO enquadramento da imagem (para nome passar atrás da figura). uso: alfa_cheio.py entrada saida"""
import sys, cv2, numpy as np
from PIL import Image
from rembg import remove, new_session
im = Image.open(sys.argv[1]).convert('RGB')
a = np.array(remove(im, session=new_session('isnet-general-use')).getchannel('A'))
m = (a > 40).astype(np.uint8) * 255
cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
full = np.zeros_like(m); cv2.drawContours(full, [max(cs, key=cv2.contourArea)], -1, 255, -1)
full = cv2.GaussianBlur(full, (5, 5), 0)
out = im.copy(); out.putalpha(Image.fromarray(full)); out.save(sys.argv[2]); print(sys.argv[2], (full > 128).mean())
