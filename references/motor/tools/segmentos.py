"""Lista os trechos animados (<Whip a b>) de cada composição e junta os colados.
Os intervalos sem cena ficam com o apresentador na câmera e não são renderizados.

uso: python tools/segmentos.py [--total SEGUNDOS] arquivo.tsx:Composicao[:PREFIXO] ...
ex.: python tools/segmentos.py --total 2140.3 src/Cap01.tsx:Cap01:C1 src/Cap02.tsx:Cap02:C2

PREFIXO aponta para as constantes C1_T0 e C1_T1 do arquivo. Sem elas, o início vale 0.
Saída: tools/segmentos.json [{comp, t0, t1, f0, f1, nome}], com frames relativos à composição.
"""
import json, os, re, sys

FPS = 30
args = sys.argv[1:]
total = None
if '--total' in args:
    i = args.index('--total')
    total = float(args[i + 1])
    del args[i:i + 2]
if not args:
    sys.exit(__doc__)

out = []
for item in args:
    arq, comp, *resto = item.split(':')
    pre = resto[0] if resto else ''
    s = open(arq, encoding='utf-8').read()
    cs = {m.group(1): float(m.group(2)) for m in re.finditer(r'(?:export )?const (\w+) = (-?[\d.]+);', s)}
    T0 = cs.get(f'{pre}_T0', 0.0)
    T1 = cs.get(f'{pre}_T1', float('inf'))
    ev = lambda e: eval(e, {}, cs)
    rs = sorted((ev(a), ev(b)) for a, b in re.findall(r'<Whip T=\{T\} a=\{([^}]+)\} b=\{([^}]+)\}>', s))
    rs = [(max(a, T0), min(b, T1)) for a, b in rs if min(b, T1) > max(a, T0)]
    seg = []
    for a, b in rs:
        if seg and a - seg[-1][1] < 1.0 / FPS + 1e-6:
            seg[-1][1] = max(seg[-1][1], b)
        else:
            seg.append([a, b])
    for a, b in seg:
        f0, f1 = round((a - T0) * FPS), round((b - T0) * FPS) - 1
        mm = lambda t: f"{int(t // 60):02d}-{t % 60:05.2f}".replace('.', '_')
        out.append({'comp': comp, 't0': round(a, 3), 't1': round(b, 3), 'f0': f0, 'f1': f1, 'nome': f'{mm(a)}_{comp}'})

os.makedirs('tools', exist_ok=True)
json.dump(out, open('tools/segmentos.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
soma = sum(o['t1'] - o['t0'] for o in out)
for o in out:
    print(f"{o['nome']:24s} {o['t0']:8.2f}-{o['t1']:8.2f}  ({o['t1'] - o['t0']:6.2f} s)  frames {o['f0']}-{o['f1']}")
print(len(out), 'trechos;', round(soma, 1), 's de animação', f'de {total} s = {round(100 * soma / total)}%' if total else '')
