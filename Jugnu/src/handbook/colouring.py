#!/usr/bin/env python3
"""Colouring edition. Same geometry as the handbook, fills dropped."""
import math
from draw import *
from common import wrap, GY
from parts import ghost, wall, snowflake

def _g(*a, **k):
    k["outline_only"] = True
    return ghost(*a, **k)

def omoon(cx, cy, r):
    o=[f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{PAPER}" stroke="{INK}" stroke-width="{SW}"/>']
    for dx,dy,cr in [(-0.38,-0.28,0.20),(0.22,0.16,0.27),(0.42,-0.44,0.13),(-0.09,0.50,0.15)]:
        o.append(f'<circle cx="{cx+dx*r:.1f}" cy="{cy+dy*r:.1f}" r="{cr*r:.1f}" '
                 f'fill="{PAPER}" stroke="{INK}" stroke-width="3"/>')
    return "".join(o)

def head(s):
    return title(M, 104, s, INK, 30)

def p1():
    o=[open_svg(), head("This is Bartholomew.")]
    o.append(_g(306, 400, 2.9, face="plain", arms="out"))
    o.append(ground(GY, hatch=False))
    o.append(caption(W/2, 726, "He has one eye and no feet.", INK, 16, anchor="middle"))
    o.append('</svg>'); return "".join(o)

def p2():
    o=[open_svg(), head("The terrible moan.")]
    o.append(omoon(452, 232, 66))
    o.append(starfield(21, 12, (60, 150, 560, 330), avoid=[(452,232,104)]))
    o.append(_g(232, 452, 2.3, face="moan", arms="up"))
    for i, r in enumerate((60, 84, 108)):
        o.append(f'<path d="M {392 + i*30} {400 - r*0.5} a {r} {r} 0 0 1 0 {r}" '
                 f'fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>')
    o.append(ground(GY, hatch=False))
    o.append('</svg>'); return "".join(o)

def p3():
    o=[open_svg(), head("Stuck in the wall until Thursday.")]
    o.append(_g(216, 400, 2.1, face="surprised", arms="one"))
    o.append(wall(312, 210, 600, 62))
    o.append(ground(GY, hatch=False))
    o.append(caption(W/2, 734, "Colour the bricks. Leave the ghost white — he is a sheet.",
                     INK, 15, anchor="middle"))
    o.append('</svg>'); return "".join(o)

def p4():
    o=[open_svg(), head("All four at once.")]
    o.append(_g(306, 400, 2.6, face="surprised", arms="up"))
    g=__import__("random").Random(5)
    for _ in range(22):
        fx, fy = g.uniform(70, 545), g.uniform(190, 600)
        if 140 < fx < 474 and 232 < fy < 600: continue
        o.append(f'<path d="M {fx-11:.1f} {fy:.1f} h 22 M {fx:.1f} {fy-11:.1f} v 22 '
                 f'M {fx-8:.1f} {fy-8:.1f} l 16 16 M {fx-8:.1f} {fy+8:.1f} l 16 -16" '
                 f'stroke="{INK}" stroke-width="3" stroke-linecap="round" fill="none"/>')
    o.append(ground(GY, hatch=False))
    o.append(caption(W/2, 716, "The moan, the wall, the cold, and all of a sudden.",
                     INK, 16, anchor="middle"))
    o.append('</svg>'); return "".join(o)

PAGES=[p1,p2,p3,p4]
