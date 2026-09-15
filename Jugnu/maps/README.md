# Maps and the world

Drops into Jugnu the same way `space/` does. No build step, no dependencies.

    maps/index.html      the page — Jugnu chrome, the atlas, the grown-up notes
    maps/atlas.js        the whole engine, ~700 lines, plain ES5
    maps/curated.js      the hand-written lists — edit this one
    maps/data/*.js       the real data, loaded only when a layer is first opened

`index.html` at the repo root gains one `.coll` block pointing here. Nothing else
on the site changes, and `assets/style.css` is untouched — the map-specific CSS
sits in a `<style>` block on the page and uses the same five colours.

## The one file worth editing

`curated.js`. Everything in it is a list of `["Name", latitude, longitude, "one
sentence"]`, and a few lists of names that decide what shows at the first zoom
level. Add a rocket site, an animal, a landmark, a mountain you want visible
straight away — one line each, no other change needed.

`JG_FACTS` is a lookup by name. Any entry there replaces the generated sentence,
so it works for anything on the map, including the data-driven layers: add
`"Nanda Devi": "..."` and that peak gets your sentence instead of its height.

## How the zoom levels work

Six levels, at zoom 1, 1.9, 3.2, 5.5, 9 and 15. Rather than ranking things by
size, `spreadTiers()` walks the list from most important down and only lets
something appear at a level if nothing already showing there is too close. That
is why the world view gives you Everest, Denali, Aconcagua and Kilimanjaro
instead of eleven Himalayan peaks in a heap. The spacing per level is `GAPS` in
`atlas.js`, in degrees.

Names in `JG_PEAKS_TOP`, `JG_VOLC_FAMOUS` and `JG_RIVERS_TOP` are forced to the
first level, subject to the same spacing so they can't pile up either.

## Data

| file | what | size |
|---|---|---|
| `base.js` | countries, US states | 141 KB, loaded up front |
| `peaks.js` | 632 named peaks with elevations and Hindi names | 73 KB |
| `volcanoes.js` | 1,558 volcanoes | 142 KB |
| `rivers.js` | ~1,000 named rivers | 320 KB |
| `cities.js` | 3,291 towns and cities, for the search box | 280 KB |

Sources: Natural Earth for everything except the volcanoes, which are the
Smithsonian Global Volcanism Program's Holocene list by way of NOAA. All public
domain or public data.

Two known gaps. The volcano list is a mid-2000s snapshot, so "last erupted"
bands are right but anything recent is missing. And Natural Earth's town list
skips a lot of Indian cities of a few hundred thousand — Bokaro Steel City is
not in it, for instance. The **My places** layer covers that: tap the map, name
the pin, and it is saved in that browser.

## Regenerating the data

The data files were built from Natural Earth GeoJSON and a GVP CSV with a small
Python script (Douglas–Peucker simplification, coordinate rounding, and a fix for
polygons that cross the date line). You do not need it to run the site. If you
want to rebuild with more detail, the knobs are the simplification epsilon
(0.22 degrees for countries, 0.05 for states, 0.07 for rivers) and the
population floor for cities (90,000).

## Still to do

The collection has no printable pieces yet. The obvious ones: a fold-out world
map in the book style, continent tracing pages, and a find-it card deck that
pairs with the game on the page.
