# -*- coding: utf-8 -*-
"""Обработка 24 фото для блока «Наши работы»: обрезка под 4:3, сжатие, SEO-имена."""
import os, json
from PIL import Image, ImageFilter
import numpy as np

UP = '/home/user/uploads'
OUT = '/home/user/agroklimat23/images/works'

# (файл источника, slug, видимое название, группа)
ITEMS = [
 ('masters/установка кондиционера на трактор.jpg',        'ustanovka-konditsionera-na-traktor',    'Установка кондиционера на трактор', 'Установка'),
 ('masters/кондиционер на трактор мтз.jpg',               'konditsioner-na-traktor-mtz',           'Кондиционер на трактор МТЗ', 'Установка'),
 ('masters/кондиционер на трактор т 150 установка ремонт.jpg','konditsioner-na-traktor-t-150',      'Кондиционер на трактор Т-150: установка и ремонт', 'Установка'),
 ('masters/кондиционер на комбайн.jpg',                   'konditsioner-na-kombayn',               'Кондиционер на комбайн', 'Установка'),
 ('masters/Заправка кондиционера комбайна.jpg',           'zapravka-konditsionera-kombayna',       'Заправка кондиционера комбайна', 'Заправка'),
 ('masters/Заправка кондиционера погрузчика.jpg',         'zapravka-konditsionera-pogruzchika',    'Заправка кондиционера погрузчика', 'Заправка'),
 ('masters/Заправка кондиционера газ.jpg',                'zapravka-konditsionera-freonom',        'Заправка кондиционера фреоном', 'Заправка'),
 ('masters/Сервисное обслуживание Versatile 550.jpg',     'servisnoe-obsluzhivanie-versatile-550', 'Сервисное обслуживание Versatile 550', 'Сервис'),
 ('masters/ремонт кондиционера на тракторе Claas.jpg',    'remont-konditsionera-claas',            'Ремонт кондиционера на тракторе Claas', 'Ремонт'),
 ('masters/ремонт кондиционера на комбайне.jpg',          'remont-konditsionera-na-kombayne',      'Ремонт кондиционера на комбайне', 'Ремонт'),
 ('masters/ремонт кондиционера беларус 1221.jpg',        'remont-konditsionera-belarus-1221',     'Ремонт кондиционера Беларус 1221', 'Ремонт'),
 ('masters/Ремонт кондиционера на беларус 1523.3.jpg',    'remont-konditsionera-belarus-1523',     'Ремонт кондиционера на Беларус 1523.3', 'Ремонт'),
 ('masters/ремонт кондиционера к 744.jpg',               'remont-konditsionera-k-744',            'Ремонт кондиционера К-744', 'Ремонт'),
 ('masters/ремонт кондиционера трактора Т 150.jpg',      'remont-konditsionera-traktora-t-150',   'Ремонт кондиционера трактора Т-150', 'Ремонт'),
 ('masters/Ремонт кондиционера торум 740.jpg',            'remont-konditsionera-torum-740',        'Ремонт кондиционера Торум 740', 'Ремонт'),
 ('masters/Ремонт кондиционера Versatile 2375.jpg',       'remont-konditsionera-versatile-2375',   'Ремонт кондиционера Versatile 2375', 'Ремонт'),
 ('masters/Ремонт кондиционера на CASE 340.jpg',          'remont-konditsionera-case-340',         'Ремонт кондиционера на Case 340', 'Ремонт'),
 ('masters/Ремонт кондиционера CAT 3004 A1.jpg',          'remont-konditsionera-cat-3004-a1',      'Ремонт кондиционера CAT 3004 A1', 'Ремонт'),
 ('masters/Ремонт кондиционера JCB.jpg',                 'remont-konditsionera-jcb',              'Ремонт кондиционера JCB', 'Ремонт'),
 ('masters/ремонт кондиционера камаз.jpg',                'remont-konditsionera-kamaz',            'Ремонт кондиционера КАМАЗ', 'Ремонт'),
 ('masters/Ремонт кондиционера на грузовике DAF.jpg',     'remont-konditsionera-daf',              'Ремонт кондиционера на грузовике DAF', 'Ремонт'),
 ('masters/Ремонт кондиционера эксковатора.jpg',          'remont-konditsionera-ekskavatora',      'Ремонт кондиционера экскаватора', 'Ремонт'),
 ('masters/ремонт кондиционера оприскиватель туман.jpg', 'remont-konditsionera-opryskivatelya-tuman','Ремонт кондиционера на опрыскивателе «Туман»', 'Ремонт'),
 ('masters/вастонавление кондиционера на тракторе.jpg',   'vosstanovlenie-konditsionera-na-traktore','Восстановление кондиционера на тракторе', 'Ремонт'),
]

TARGET = 4 / 3
W_OUT, H_OUT = 1024, 768


def smart_window(gray_len, edge_profile, size):
    """Лучшее окно по плотности краёв; возвращает (x0, gain) против центра."""
    k = np.ones(max(9, gray_len // 60) | 1) / (max(9, gray_len // 60) | 1)
    sm = np.convolve(edge_profile, k, mode='same')
    best, centre = None, (len(sm) - size) // 2
    for x0 in range(0, len(sm) - size + 1, 2):
        s = sm[x0:x0 + size].sum()
        if best is None or s > best[1]:
            best = (x0, s)
    csum = sm[centre:centre + size].sum()
    gain = 100 * (best[1] / max(csum, 1e-9) - 1)
    return (best[0] if gain > 8 else centre), gain, centre


report = []
for src, slug, title, group in ITEMS:
    p = os.path.join(UP, src)
    im = Image.open(p)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im).convert('RGB')
    else:
        im = im.convert('RGB')

    W, H = im.size
    g = np.asarray(im.convert('L')).astype(float)
    brightness = g.mean()

    # --- обрезка под 4:3 ---
    if abs(W / H - TARGET) > 0.01:
        if W / H > TARGET:                      # слишком широкое -> режем по ширине
            tw = round(H * TARGET)
            e = np.asarray(im.convert('L').filter(ImageFilter.FIND_EDGES)).astype(float).mean(axis=0)
            x0, gain, c0 = smart_window(W, e, tw)
            box = (x0, 0, x0 + tw, H)
        else:                                   # слишком высокое -> режем по высоте
            th = round(W / TARGET)
            e = np.asarray(im.convert('L').filter(ImageFilter.FIND_EDGES)).astype(float).mean(axis=1)
            y0, gain, c0 = smart_window(H, e, th)
            box = (0, y0, W, y0 + th)
    else:
        box, gain, c0 = (0, 0, W, H), 0.0, 0
    crop = im.crop(box)
    keep = round(100 * (crop.size[0] * crop.size[1]) / (W * H))

    crop = crop.resize((W_OUT, H_OUT), Image.LANCZOS)
    out = os.path.join(OUT, slug + '.jpg')
    q = 84
    while True:
        crop.save(out, quality=q, optimize=True, progressive=True, subsampling=2)
        kb = os.path.getsize(out) / 1024
        if kb <= 210 or q <= 72:
            break
        q -= 4

    report.append(dict(slug=slug, title=title, group=group, src=src,
                       src_size=[W, H], crop=list(box), keep=keep, gain=round(gain, 1),
                       bright=round(brightness), kb=round(kb), q=q))
    print(f'{slug:42s} {W}x{H} -> box{box} keep {keep}%  q{q}  {kb:.0f} KB  gain {gain:.1f}%  bright {brightness:.0f}')

json.dump(report, open('/home/user/scripts/works_report.json', 'w'), ensure_ascii=False, indent=1)
print('\nитого:', len(report), 'файлов')
