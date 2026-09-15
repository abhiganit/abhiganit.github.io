#!/usr/bin/env python3
"""BARTHOLOMEW'S HANDBOOK FOR NEW GHOSTS.

Eight Letter pages in the Jugnu flat-ink system, so the printable belongs to
the site rather than to the illustrated book it accompanies.

Every drawn thing takes outline_only=True, which is what makes the colouring
edition free: same geometry, fills dropped.
"""
import math
from draw import *
from common import wrap, arrow, GY

# --------------------------------------------------------------- the ghost
def ghost(x, y, s=1.0, face="plain", arms="out", stuck=False, outline_only=False):
    """Bartholomew. One oval eye, scalloped hem, two flipper arms, no feet.

    face: plain | moan | cross | pleased | sad | surprised
    arms: out | up | down | one
    """
    fill = PAPER
    def S(v): return v * s
    o = [f'<g stroke="{INK}" stroke-width="{SW*s if s<1 else SW:.1f}" '
         f'stroke-linejoin="round" stroke-linecap="round">']

    # arms first so the body overlaps their roots
    def arm(sgn, lift):
        x0 = x + sgn*S(42)
        return (f'<path d="M {x0:.1f} {y+S(26)-lift:.1f} '
                f'C {x0 + sgn*S(28):.1f} {y+S(16)-lift:.1f} '
                f'{x0 + sgn*S(33):.1f} {y+S(42)-lift:.1f} '
                f'{x0 + sgn*S(13):.1f} {y+S(48)-lift:.1f} '
                f'C {x0 + sgn*S(4):.1f} {y+S(49)-lift:.1f} {x0:.1f} {y+S(45)-lift:.1f} '
                f'{x0:.1f} {y+S(38)-lift:.1f} Z" fill="{fill}"/>')
    if arms == "up":
        o.append(arm(-1, S(26))); o.append(arm(1, S(26)))
    elif arms == "down":
        o.append(arm(-1, -S(8))); o.append(arm(1, -S(8)))
    elif arms == "one":
        o.append(arm(1, S(14)))
    else:
        o.append(arm(-1, 0)); o.append(arm(1, 0))

    # body: dome shoulders down to a scalloped hem
    d = (f"M {x-S(44):.1f} {y+S(54):.1f} L {x-S(44):.1f} {y-S(4):.1f} "
         f"A {S(44):.1f} {S(52):.1f} 0 0 1 {x+S(44):.1f} {y-S(4):.1f} "
         f"L {x+S(44):.1f} {y+S(54):.1f} ")
    n = 6
    for i in range(n):
        x1 = x + S(44) - S(88)*(i+0.5)/n
        x2 = x + S(44) - S(88)*(i+1)/n
        d += f"L {x1:.1f} {y+S(40):.1f} L {x2:.1f} {y+S(54):.1f} "
    o.append(f'<path d="{d} Z" fill="{fill}"/>')

    if stuck:   # the wall crops him vertically; caller draws the wall over the top
        pass

    # eye
    ey = y - S(6)
    if face == "surprised":
        o.append(f'<ellipse cx="{x:.1f}" cy="{ey:.1f}" rx="{S(13):.1f}" ry="{S(17):.1f}" '
                 f'fill="{"none" if outline_only else INK}"/>')
    elif face == "pleased":
        o.append(f'<path d="M {x-S(12):.1f} {ey+S(4):.1f} q {S(12):.1f} {-S(16):.1f} '
                 f'{S(24):.1f} 0" fill="none" stroke-width="{SW*0.85:.1f}"/>')
    else:
        o.append(f'<ellipse cx="{x:.1f}" cy="{ey:.1f}" rx="{S(10):.1f}" ry="{S(14):.1f}" '
                 f'fill="{"none" if outline_only else INK}"/>')
    if face == "cross":
        o.append(f'<path d="M {x-S(19):.1f} {ey-S(20):.1f} l {S(15):.1f} {S(7):.1f} '
                 f'M {x+S(19):.1f} {ey-S(20):.1f} l {-S(15):.1f} {S(7):.1f}" '
                 f'fill="none" stroke-width="{SW*0.7:.1f}"/>')

    # mouth
    my = y + S(22)
    if face == "moan":
        o.append(f'<ellipse cx="{x:.1f}" cy="{my:.1f}" rx="{S(8):.1f}" ry="{S(12):.1f}" '
                 f'fill="{"none" if outline_only else INK}"/>')
    elif face == "sad":
        o.append(f'<path d="M {x-S(13):.1f} {my+S(5):.1f} q {S(13):.1f} {-S(10):.1f} '
                 f'{S(26):.1f} 0" fill="none" stroke-width="{SW*0.7:.1f}"/>')
    elif face == "pleased":
        o.append(f'<path d="M {x-S(14):.1f} {my-S(3):.1f} q {S(14):.1f} {S(13):.1f} '
                 f'{S(28):.1f} 0" fill="none" stroke-width="{SW*0.7:.1f}"/>')
    else:
        o.append(f'<path d="M {x-S(14):.1f} {my:.1f} q {S(7):.1f} {S(7):.1f} {S(14):.1f} 0 '
                 f'q {S(7):.1f} {-S(7):.1f} {S(14):.1f} 0" fill="none" '
                 f'stroke-width="{SW*0.7:.1f}"/>')
    o.append('</g>')
    return "".join(o)


# --------------------------------------------------------------- furniture
def wall(x, y0, y1, w=44, outline_only=False):
    o = [f'<g stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round">',
         f'<rect x="{x:.1f}" y="{y0:.1f}" width="{w:.1f}" height="{y1-y0:.1f}" fill="{PAPER}"/>']
    k = y0 + 26
    row = 0
    while k < y1:
        o.append(f'<line x1="{x}" y1="{k:.1f}" x2="{x+w}" y2="{k:.1f}" stroke-width="2"/>')
        o.append(f'<line x1="{x+w/2 if row%2 else x+w/4:.1f}" y1="{k:.1f}" '
                 f'x2="{x+w/2 if row%2 else x+w/4:.1f}" y2="{min(k+26,y1):.1f}" stroke-width="2"/>')
        k += 26; row += 1
    o.append('</g>')
    return "".join(o)


def bed(x, gy, s=1.0, outline_only=False):
    def S(v): return v*s
    quilt = PAPER if outline_only else BLU
    return (f'<g stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round">'
            f'<rect x="{x-S(90):.1f}" y="{gy-S(54):.1f}" width="{S(180):.1f}" '
            f'height="{S(34):.1f}" fill="{quilt}"/>'
            f'<rect x="{x-S(84):.1f}" y="{gy-S(72):.1f}" width="{S(46):.1f}" '
            f'height="{S(20):.1f}" rx="{S(8):.1f}" fill="{PAPER}"/>'
            f'<path d="M {x-S(96):.1f} {gy-S(78):.1f} L {x-S(96):.1f} {gy:.1f} '
            f'M {x+S(96):.1f} {gy-S(60):.1f} L {x+S(96):.1f} {gy:.1f}" fill="none"/>'
            f'<line x1="{x-S(96):.1f}" y1="{gy-S(20):.1f}" x2="{x+S(96):.1f}" '
            f'y2="{gy-S(20):.1f}"/></g>')


def snowflake(x, y, r, w=3.0):
    o = []
    for i in range(3):
        a = i * math.pi / 3
        o.append(f'<line x1="{x-math.cos(a)*r:.1f}" y1="{y-math.sin(a)*r:.1f}" '
                 f'x2="{x+math.cos(a)*r:.1f}" y2="{y+math.sin(a)*r:.1f}" '
                 f'stroke="{BLU}" stroke-width="{w}" stroke-linecap="round"/>')
    return "".join(o)


def box(x, y, w, h, fill=PAPER, sw=SW):
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
            f'fill="{fill}" stroke="{INK}" stroke-width="{sw}"/>')


def tickbox(x, y, s=20):
    return box(x, y, s, s, PAPER, 3.2)


def rule_line(x1, x2, y):
    return (f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="{INK}" '
            f'stroke-width="2" stroke-dasharray="1 0" opacity="0.45"/>')


# --------------------------------------------------------------- page parts
def lesson_head(num, name, n_of=4):
    o = [caption(M, 92, f"LESSON {num}", RED, 15)]
    o.append(title(M, 132, name, INK, 34))
    return "".join(o)


def result(y, text):
    """The small deadpan note that closes every lesson."""
    o = [f'<line x1="{M}" y1="{y-26:.0f}" x2="{W-M}" y2="{y-26:.0f}" stroke="{INK}" '
         f'stroke-width="2" opacity="0.35"/>',
         caption(M, y, "RESULT", RED, 12)]
    o.append(wrap(M, y + 22, text, 15, 21, INK, "Lora", width=62))
    return "".join(o)


def difficulty(x, y, filled, of=5):
    o = []
    for i in range(of):
        o.append(f'<rect x="{x + i*17:.1f}" y="{y:.1f}" width="12" height="12" '
                 f'fill="{INK if i < filled else PAPER}" stroke="{INK}" stroke-width="2.4"/>')
    return "".join(o)
