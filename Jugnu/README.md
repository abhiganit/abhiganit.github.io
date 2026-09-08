# Jugnu

A static site. No build step, no dependencies, nothing to install.

    index.html            the home page — the shelf of collections
    assets/style.css      the whole design system: palette, type, button style
    space/index.html      the space and rockets collection
    space/books/*.pdf     16 files — a reading PDF and a booklet PDF per book

## Putting it online

**GitHub Pages** — push this folder to a repo, then Settings → Pages → deploy from
branch, root.

**Cloudflare Pages** or **Netlify** — drag the folder onto the dashboard.

Internal links are written as `space/index.html` rather than `space/` so the site
also works when you just double-click `index.html` on your own machine. On a real
host both forms work; shorten them if you prefer the tidier URLs.

## Adding a book to an existing collection

1. Build it with `build.py`, which writes both PDFs.
2. Drop them into `space/books/`.
3. Add one entry to the `BOOKS` array in the script block of `space/index.html`:
   number, title, the question it answers, one line of description, and the filename
   stem. The shelf, the links, and the colour rotation follow automatically.

## Adding a new collection

1. `cp -r space/ <name>/` and empty out its PDF folder.
2. Replace the three sections: the shelf, the printing notes, the interactives.
   Delete the interactives section entirely if that collection doesn't need one.
3. Add a `.coll` block to `index.html` pointing at it.

Every page links to `assets/style.css`, so the palette and type stay in one place.
Change a value there and it moves across the whole site.

## The design system, briefly

Five colours, defined at the top of `style.css`: ink, red, yellow, blue, paper.
They are the same five used in the books, so the site and the printed pages read as
one object. Poppins for display, Lora for reading. Poppins carries Devanagari as
well as Latin, which is why जुगनू sets in the same letterforms as everything else.

Nothing has a drop shadow. Borders are 3px solid ink, matching the outline weight of
the illustrations. If you add anything, follow that rule and it will fit.
