# -*- coding: utf-8 -*-
"""Замена галереи «Наши работы» на 24 новых фото: works.html (24) + превью index.html (4)."""
import json, re, os

rep = json.load(open('/home/user/scripts/works_report.json'))
by_slug = {r['slug']: r for r in rep}
order = [r['slug'] for r in rep]                      # порядок = порядок обработки

PREVIEW = ['ustanovka-konditsionera-na-traktor', 'konditsioner-na-kombayn',
           'remont-konditsionera-kamaz', 'remont-konditsionera-ekskavatora']

ALT = '{} — работы АгроКлимат23, Краснодарский край'
TTL = '{} — АгроКлимат23'


def card_works(slug):
    t = by_slug[slug]['title']
    return (
        '      <div class="wcard" id="w-{s}" role="button" tabindex="0" '
        'data-src="images/works/{s}.jpg" data-title="{t}" aria-label="Открыть фото: {t}">\n'
        '        <div class="wpic"><img src="images/works/{s}.jpg" alt="{a}" title="{tt}" '
        'width="1024" height="768" loading="lazy"></div>\n'
        '      </div>'
    ).format(s=slug, t=t, a=ALT.format(t), tt=TTL.format(t))


def card_index(slug):
    t = by_slug[slug]['title']
    return (
        '      <a class="wcard" href="works.html#w-{s}" aria-label="{t} — открыть в каталоге работ">\n'
        '        <div class="wpic"><img src="images/works/{s}.jpg" alt="{a}" title="{tt}" '
        'width="1024" height="768" loading="lazy"></div>\n'
        '      </a>'
    ).format(s=slug, t=t, a=ALT.format(t), tt=TTL.format(t))


# ---------- works.html ----------
p = '/home/user/agroklimat23/works.html'
h = open(p, encoding='utf-8').read()
start = h.index('<div class="wgrid" id="wGrid">')
open_tag_end = h.index('>', start) + 1
end = h.index('\n  </div>', open_tag_end)
new_grid = '<div class="wgrid" id="wGrid">\n' + '\n'.join(card_works(s) for s in order) + '\n  </div>'
h2 = h[:start] + new_grid + h[end + len('\n  </div>'):]

# мёртвый CSS: подписи и теги под фото больше не используются
dead_css = [
    '  .wcap{padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px;align-items:flex-start}\n',
    '  .wcap b{font-size:14.5px;color:var(--green);line-height:1.35}\n',
    '  .wtag{font-size:11.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;border-radius:6px;padding:3px 9px}\n',
    '  .wtag.t-install{background:#e7f4ec;color:var(--green3)}\n',
    '  .wtag.t-repair{background:#fdeed3;color:var(--amber2)}\n',
    '  .wtag.t-refuel{background:#e9eef5;color:#3b5b7a}\n',
]
removed = [c for c in dead_css if c in h2]
h2 = h2.replace(''.join(dead_css), '')
open(p, 'w', encoding='utf-8').write(h2)
print('works.html: карточек', len(order), '; удалено CSS-строк:', len(removed))

# ---------- index.html ----------
p = '/home/user/agroklimat23/index.html'
x = open(p, encoding='utf-8').read()
s = x.index('<div class="wgrid">')
oe = x.index('>', s) + 1
e = x.index('\n    </div>', oe)
new_prev = '<div class="wgrid">\n' + '\n'.join(card_index(sl) for sl in PREVIEW) + '\n    </div>'
x2 = x[:s] + new_prev + x[e + len('\n    </div>'):]

removed2 = [c for c in dead_css if c in x2]
x2 = x2.replace(''.join(dead_css), '')
x2 = x2.replace('Смотреть все работы (16) →', 'Смотреть все работы (24) →')
open(p, 'w', encoding='utf-8').write(x2)
print('index.html: превью', len(PREVIEW), '; удалено CSS-строк:', len(removed2))
print('счётчик 24:', 'Смотреть все работы (24)' in x2)
print('карточек в works.html:', x2.count('wcard') if False else h2.count('class="wcard"'))
