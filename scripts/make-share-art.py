#!/usr/bin/env python3
"""The picture a link carries: the preview WhatsApp, LINE, Telegram and X show when someone
pastes life.nonarkara.org, plus the app icons. Flat, house colours, no gradient and no shadow.
Usage: python3 scripts/make-share-art.py   (writes into dist/start, which the build publishes at the site root)"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path("dist/start")
PAPER, INK, MUTED, AMBER, DECK = "#f4f0e6", "#192e2c", "#52635b", "#f59e0b", "#0a0e14"
AVENIR, MENLO = "/System/Library/Fonts/Avenir Next.ttc", "/System/Library/Fonts/Menlo.ttc"

def font(path, size, index=0):
    return ImageFont.truetype(path, size, index=index)

def route(d, x0, y0, step, scale=1.0):
    """A subway-style life line: home, school, abroad, work, back home, the end. Turns are 45 degrees only."""
    pts = [(0, 0), (3, 0), (6, 3), (6, 5), (8, 7), (11, 7), (13, 5)]
    xy = [(x0 + px * step, y0 + py * step) for px, py in pts]
    d.line(xy, fill=AMBER, width=int(14 * scale), joint="curve")
    for i, (px, py) in enumerate(xy[:-1]):
        r = 15 * scale
        d.ellipse((px - r, py - r, px + r, py + r), fill=PAPER, outline=INK, width=int(5 * scale))
    ex, ey = xy[-1]
    r = 22 * scale
    d.ellipse((ex - r, ey - r, ex + r, ey + r), fill=INK)

def og():
    im = Image.new("RGB", (1200, 630), PAPER)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 560, 1200, 630), fill=DECK)
    d.text((56, 585), "LIFE.NONARKARA.ORG", font=font(MENLO, 26), fill="#e6edf3")
    d.text((1144, 585), "SCREEN EDITION 2026", font=font(MENLO, 26), fill="#9aa5ae", anchor="ra")
    d.text((56, 70), "Life2.0", font=font(AVENIR, 120, 5), fill=INK)
    d.text((60, 215), "What if you could live", font=font(AVENIR, 50, 0), fill=INK)
    d.text((60, 275), "your life all over again?", font=font(AVENIR, 50, 0), fill=INK)
    d.text((60, 370), "A whole life, from the womb to old age, in one sitting.", font=font(AVENIR, 30, 0), fill=MUTED)
    d.text((60, 414), "Choose, and see what it costs. Free, in your browser.", font=font(AVENIR, 30, 0), fill=MUTED)
    route(d, 690, 150, 32)
    im.save(OUT / "og.png", optimize=True)

def icon(size, name, pad=0.14):
    im = Image.new("RGB", (size, size), INK)
    d = ImageDraw.Draw(im)
    p = size * pad
    d.line([(p, size * 0.66), (size * 0.38, size * 0.66), (size * 0.5, size * 0.54), (size * 0.5, size * 0.34), (size * 0.62, size * 0.22), (size - p, size * 0.22)], fill=AMBER, width=max(4, int(size * 0.09)), joint="curve")
    r = size * 0.075
    for cx, cy in ((p, size * 0.66), (size - p, size * 0.22)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=PAPER)
    im.save(OUT / name, optimize=True)

if __name__ == "__main__":
    og()
    icon(180, "apple-touch-icon.png")
    icon(192, "icon-192.png")
    icon(512, "icon-512.png")
    (OUT / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#192e2c"/>'
        '<path d="M9 42h15l7-7V21l7-7h18" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linejoin="round"/>'
        '<circle cx="9" cy="42" r="5" fill="#f4f0e6"/><circle cx="56" cy="14" r="5" fill="#f4f0e6"/></svg>\n')
    (OUT / "manifest.webmanifest").write_text(
        '{\n "name": "Life2.0",\n "short_name": "Life2.0",\n "description": "Live a whole life in one sitting, then see its shape and live it again.",\n'
        ' "start_url": "/",\n "scope": "/",\n "display": "standalone",\n "background_color": "#f4f0e6",\n "theme_color": "#f4f0e6",\n'
        ' "icons": [\n  {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},\n  {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"}\n ]\n}\n')
    print("wrote", sorted(p.name for p in OUT.iterdir() if p.suffix in (".png", ".svg", ".webmanifest")))
