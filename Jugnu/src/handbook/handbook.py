#!/usr/bin/env python3
"""The eight pages of Bartholomew's Handbook for New Ghosts."""
import math
from draw import *
from common import wrap, arrow, GY
from parts import (ghost, wall, bed, snowflake, box, tickbox, rule_line,
                   lesson_head, result, difficulty)

OUTLINE = False        # flipped by build_handbook.py for the colouring edition


def _g(*a, **k):
    k.setdefault("outline_only", OUTLINE)
    return ghost(*a, **k)


# ---------------------------------------------------------------- 1. cover
def cover():
    o = [open_svg()]
    o.append(starfield(11, 9, (318, 56, W-44, 168)))
    o.append(moon(508, 120, 40))
    o.append(caption(M, 150, "A HANDBOOK FOR NEW GHOSTS", RED, 15))
    o.append(title(M, 206, "How to Scare", INK, 52))
    o.append(title(M, 262, "People", INK, 52))
    o.append(wrap(M, 310, "Four lessons, in order, by Bartholomew — who has haunted "
                          "the same house for two hundred years.", 17, 25, INK,
                  "Lora", width=46))
    o.append(_g(306, 500, 1.9, face="plain", arms="out"))
    o.append(ground(GY))
    o.append(caption(W/2, 726, "Print it. Read it. Then go and practise.", INK, 15,
                     anchor="middle"))
    o.append('</svg>')
    return "".join(o)


# ------------------------------------------------------------ 2. lesson one
def lesson_one():
    o = [open_svg(), lesson_head("ONE", "The Terrible Moan.")]
    o.append(wrap(M, 176, "Open your mouth. Make it round, not wide. Then let out the "
                          "longest, saddest sound you have.", 17, 24, INK, "Lora", width=58))
    o.append(_g(200, 340, 1.5, face="moan", arms="up"))
    # the sound, drawn as a widening ripple
    for i, r in enumerate((44, 62, 80)):
        o.append(f'<path d="M {320 + i*24} {300 - r*0.5} a {r} {r} 0 0 1 0 {r}" '
                 f'fill="none" stroke="{BLU}" stroke-width="4" stroke-linecap="round"/>')
    o.append(caption(430, 318, "ooooOOOoooo", RED, 22))
    o.append(caption(430, 348, "not  eep", INK, 16))
    o.append(caption(M, 470, "DIFFICULTY", RED, 12))
    o.append(difficulty(M, 482, 2))
    o.append(wrap(M, 540, "Practise where nobody can hear you. The landing is good. "
                          "Behind a door is better.", 15.5, 22, INK, "Lora", width=62))
    o.append(result(626, "The father said it was the pipes. It was not the pipes."))
    o.append(folio(2)); o.append('</svg>')
    return "".join(o)


# ------------------------------------------------------------ 3. lesson two
def lesson_two():
    o = [open_svg(), lesson_head("TWO", "Passing Through Walls.")]
    o.append(wrap(M, 176, "Walk at the wall as though it were not there. Do not slow "
                          "down. Slowing down is how you get stuck.", 17, 24, INK,
                  "Lora", width=58))
    o.append(_g(214, 352, 1.35, face="surprised", arms="one"))
    o.append(wall(276, 250, 460, 46))
    o.append(arrow(150, 250, 250, 250, BLU, 5, 13))
    o.append(caption(150, 238, "keep going", BLU, 14))
    o.append(caption(340, 246, "this bit is the wall", INK, 14))
    o.append(caption(M, 502, "DIFFICULTY", RED, 12))
    o.append(difficulty(M, 514, 4))
    o.append(wrap(M, 572, "If you stop halfway you will be an elbow on one side and "
                          "a ghost on the other. This is not frightening. It is just "
                          "awkward.", 15.5, 22, INK, "Lora", width=62))
    o.append(result(666, "I got as far as my elbow. I stayed there until Thursday."))
    o.append(folio(3)); o.append('</svg>')
    return "".join(o)


# ---------------------------------------------------------- 4. lesson three
def lesson_three():
    o = [open_svg(), lesson_head("THREE", "The Dreadful Cold.")]
    o.append(wrap(M, 176, "Think of the coldest thing you know. Then think it harder, "
                          "at the whole room, all at once.", 17, 24, INK, "Lora", width=58))
    o.append(_g(190, 360, 1.4, face="cross", arms="out"))
    g = __import__("random").Random(7)
    for _ in range(26):
        fx, fy = g.uniform(96, 556), g.uniform(238, 470)
        if 78 < fx < 302 and 258 < fy < 462:
            continue
        o.append(snowflake(fx, fy, g.uniform(7, 13)))
    o.append(caption(M, 512, "DIFFICULTY", RED, 12))
    o.append(difficulty(M, 524, 3))
    o.append(wrap(M, 582, "Warning. Some families enjoy this. Check for hats before "
                          "you begin. If there are mittens in the house, choose a "
                          "different lesson.", 15.5, 22, INK, "Lora", width=62))
    o.append(result(676, "The smallest one shouted SNOW, INDOORS, and put her "
                         "scarf on."))
    o.append(folio(4)); o.append('</svg>')
    return "".join(o)


# ----------------------------------------------------------- 5. lesson four
def lesson_four():
    o = [open_svg(), lesson_head("FOUR", "Appearing Suddenly.")]
    o.append(wrap(M, 176, "Be nowhere. Then be somewhere. There is no third step, "
                          "which is why everyone thinks this one is easy.", 17, 24,
                  INK, "Lora", width=58))
    # three stages: faint, fainter, there
    o.append(f'<g opacity="0.25">{_g(170, 330, 1.0, face="plain")}</g>')
    o.append(f'<g opacity="0.55">{_g(290, 330, 1.0, face="plain")}</g>')
    o.append(_g(430, 330, 1.0, face="pleased", arms="up"))
    o.append(caption(430, 254, "ta-daa.", RED, 20, anchor="middle"))
    o.append(caption(M, 452, "DIFFICULTY", RED, 12))
    o.append(difficulty(M, 464, 1))
    o.append(wrap(M, 522, "The hard part is not appearing. The hard part is that "
                          "people are allowed to be facing whichever way they like, "
                          "and usually are.", 15.5, 22, INK, "Lora", width=62))
    o.append(result(626, "I appeared five times. They faced the other way five "
                         "times. That is entirely their fault."))
    o.append(folio(5)); o.append('</svg>')
    return "".join(o)


# ------------------------------------------------------------ 6. lesson five
def lesson_five():
    o = [open_svg()]
    o.append(caption(M, 92, "LESSON FIVE", RED, 15))
    o.append(title(M, 136, "All Four At Once.", INK, 38))
    o.append(wrap(M, 184, "This is the whole trick, and it took me two hundred years, "
                          "so please read it slowly.", 17.5, 25, INK, "Lora", width=56))
    o.append(wrap(M, 244, "One at a time, each lesson is a small strange thing that a "
                          "person can explain away. The moan is the pipes. The cold "
                          "is a window. Together, at midnight, on the stairs, they "
                          "cannot explain any of it.", 17, 25, INK, "Lora", width=56))
    o.append(_g(306, 486, 1.9, face="surprised", arms="up"))
    for i, r in enumerate((104, 126)):
        o.append(f'<path d="M {480 + i*22} {430} a {r} {r} 0 0 1 0 {r*0.8}" fill="none" '
                 f'stroke="{BLU}" stroke-width="4" stroke-linecap="round"/>')
    g = __import__("random").Random(3)
    for _ in range(16):
        fx, fy = g.uniform(96, 528), g.uniform(392, 592)
        if 186 < fx < 426 and 396 < fy < 566:
            continue
        o.append(snowflake(fx, fy, g.uniform(7, 12)))
    o.append(caption(W/2, 636, "the moan  +  the wall  +  the cold  +  all of a sudden",
                     INK, 16, anchor="middle"))
    o.append(result(700, "They jumped so high. The father dropped the lamp. The "
                         "smallest one said, do it again."))
    o.append(folio(6)); o.append('</svg>')
    return "".join(o)


# ------------------------------------------------- 7. design your own ghost
def design():
    o = [open_svg()]
    o.append(caption(M, 92, "NOW YOU", RED, 15))
    o.append(title(M, 136, "Draw your own ghost.", INK, 34))
    o.append(wrap(M, 180, "Pick your parts. Then draw yours in the space.", 16, 22,
                  INK, "Lora", width=62))

    # the blank to draw in
    o.append(box(M, 206, 268, 250))
    o.append(caption(M + 134, 342, "your ghost here", "#B8B8B8", 15, anchor="middle"))

    # parts menu
    px = 350
    o.append(caption(px, 226, "HOW MANY EYES", RED, 12))
    for i, n in enumerate((1, 2, 3)):
        cx = px + 22 + i*62
        o.append(f'<circle cx="{cx}" cy="264" r="24" fill="{PAPER}" stroke="{INK}" '
                 f'stroke-width="3.4"/>')
        for k in range(n):
            o.append(f'<ellipse cx="{cx - (n-1)*7 + k*14}" cy="262" rx="4.5" ry="6" '
                     f'fill="{INK}"/>')
        o.append(tickbox(cx - 9, 294, 18))

    o.append(caption(px, 350, "WHAT SORT OF HEM", RED, 12))
    hems = ("zigzag", "wobbly", "straight")
    for i, h in enumerate(hems):
        hx = px + 6 + i*62
        d = f"M {hx} 372 L {hx} 396 "
        if h == "zigzag":
            for k in range(3):
                d += f"L {hx + 8 + k*16} 384 L {hx + 16 + k*16} 396 "
        elif h == "wobbly":
            d += f"Q {hx+12} 408 {hx+24} 396 Q {hx+36} 384 {hx+48} 396 "
        else:
            d += f"L {hx+48} 396 "
        d += f"L {hx+48} 372 Z"
        o.append(f'<path d="{d}" fill="{PAPER}" stroke="{INK}" stroke-width="3.4" '
                 f'stroke-linejoin="round"/>')
        o.append(tickbox(hx + 15, 410, 18))

    # powers
    o.append(caption(M, 500, "WHICH POWERS DOES YOUR GHOST HAVE", RED, 12))
    powers = ["Moaning", "Going through walls", "Making it cold",
              "Appearing suddenly", "Floating upstairs", "Turning the lights off",
              "Being invisible", "Something nobody has thought of yet"]
    for i, p in enumerate(powers):
        cx = M if i < 4 else W/2 - 10
        cy = 528 + (i % 4) * 40
        o.append(tickbox(cx, cy - 15))
        o.append(caption(cx + 30, cy, p, INK, 15))
    o.append(caption(M, 712, "Tick all of them if you like. That is allowed.",
                     INK, 15))
    o.append(folio(7)); o.append('</svg>')
    return "".join(o)


# ------------------------------------------------------------- 8. the licence
def licence():
    o = [open_svg()]
    o.append(box(M - 8, 78, W - 2*M + 16, 640, PAPER, 5))
    o.append(box(M + 4, 90, W - 2*M - 8, 616, PAPER, 2))
    o.append(caption(W/2, 142, "THIS IS TO CERTIFY THAT", RED, 13, anchor="middle"))
    o.append(rule_line(M + 60, W - M - 60, 200))
    o.append(caption(W/2, 224, "name", "#9A9A9A", 13, anchor="middle"))
    o.append(title(W/2, 282, "is a Ghost.", INK, 40, anchor="middle"))
    o.append(box(W/2 - 118, 312, 236, 214))
    o.append(caption(W/2, 420, "draw yourself here", "#B8B8B8", 14, anchor="middle"))
    o.append(caption(M + 40, 568, "CERTIFIED TO SCARE", RED, 12))
    o.append(caption(M + 40, 598, "the cat", INK, 16))
    o.append(rule_line(M + 40, W - M - 150, 628))
    o.append(rule_line(M + 40, W - M - 150, 658))
    o.append(_g(W - M - 76, 622, 0.58, face="pleased", arms="up"))
    o.append(caption(M + 40, 694, "Signed,  Bartholomew", INK, 15))
    o.append(folio(8)); o.append('</svg>')
    return "".join(o)


PAGES = [cover, lesson_one, lesson_two, lesson_three, lesson_four,
         lesson_five, design, licence]
