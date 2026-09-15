/* Jugnu — the atlas.
   No build step and no dependencies. Data files in data/ are loaded on demand.
   Layer data: window.JG_BASE (loaded up front), JG_PEAKS, JG_VOLCANOES, JG_RIVERS,
   JG_CITIES. Hand-written sets live in curated.js. */
(function () {
"use strict";

var W = 2000, H = 1000;
var INK = "#151515", RED = "#E14B31", YEL = "#F3C13A", BLU = "#3E7CB1", PAPER = "#FFFFFF";
var CONT_FILL = { AF:"#F3C13A", AS:"#E14B31", EU:"#3E7CB1", NA:"#F8DE95",
                  SA:"#F0A392", OC:"#9DC0D8", AN:"#FFFFFF" };
var CONT_NAME = { AF:"Africa", AS:"Asia", EU:"Europe", NA:"North America",
                  SA:"South America", OC:"Oceania", AN:"Antarctica" };

function px(lon) { return (lon + 180) / 360 * W; }
function py(lat) { return (90 - lat) / 180 * H; }

var NS = "http://www.w3.org/2000/svg";
function el(t, a) {
  var n = document.createElementNS(NS, t);
  for (var k in a) n.setAttribute(k, a[k]);
  return n;
}
function txt(n, s) { n.textContent = s; return n; }
function num(v) { return v.toLocaleString("en-US"); }

var svg = document.getElementById("map"), view = document.getElementById("view"),
    gLand = document.getElementById("gLand"), gStates = document.getElementById("gStates"),
    gRivers = document.getElementById("gRivers"), gLabels = document.getElementById("gLabels"),
    gPins = document.getElementById("gPins"), note = document.getElementById("note");

/* ---------------------------------------------------------------- zoom tiers */
var TIERZ = [1, 1.9, 3.2, 5.5, 9, 15];
function tierNow() {
  var t = 0;
  for (var i = 0; i < TIERZ.length; i++) if (k >= TIERZ[i]) t = i;
  return t;
}

/* ---------------------------------------------------------------- base shapes */
function pathOf(polys) {
  var d = "", i, j, r, p, s;
  for (i = 0; i < polys.length; i++) for (j = 0; j < polys[i].length; j++) {
    r = polys[i][j]; s = [];
    for (p = 0; p < r.length; p++) s.push(px(r[p][0]).toFixed(1) + "," + py(r[p][1]).toFixed(1));
    d += "M" + s.join("L") + "Z";
  }
  return d;
}
function boxOf(polys) {
  var best = null;
  for (var i = 0; i < polys.length; i++) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, r = polys[i][0];
    for (var p = 0; p < r.length; p++) {
      var x = px(r[p][0]), y = py(r[p][1]);
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    var b = { x0:x0, y0:y0, x1:x1, y1:y1, cx:(x0+x1)/2, cy:(y0+y1)/2, w:x1-x0, h:y1-y0 };
    if (!best || b.w * b.h > best.w * best.h) best = b;
  }
  return best;
}

var countries = [], states = [], labels = [];

JG_BASE.countries.forEach(function (f) {
  var b = boxOf(f.p), node = el("path", { d: pathOf(f.p), "class": "land" });
  node.setAttribute("data-name", f.n);
  gLand.appendChild(node);
  var c = { node: node, name: f.n, box: b, cont: JG_BASE.cont[f.n] || "" };
  countries.push(c);
  if (b.w > 6) addLabel(f.n, b, "country", 11);
});
JG_BASE.states.forEach(function (f) {
  var b = boxOf(f.p), node = el("path", { d: pathOf(f.p), "class": "state" });
  node.setAttribute("data-name", f.n);
  gStates.appendChild(node);
  states.push({ node: node, name: f.n, box: b });
  addLabel(f.n, b, "state", 9);
});
gStates.style.display = "none";

function addLabel(name, box, kind, size) {
  var t = txt(el("text", { "class": "glabel", "font-size": size, x: box.cx, y: box.cy }), name);
  t.style.display = "none";
  gLabels.appendChild(t);
  labels.push({ t: t, box: box, kind: kind });
}

var seaLabels = [], contLabels = [];
[["PACIFIC OCEAN",-8,-138],["PACIFIC OCEAN",24,160],["ATLANTIC OCEAN",8,-32],
 ["INDIAN OCEAN",-25,80],["SOUTHERN OCEAN",-62,60],["ARCTIC OCEAN",80,0]
].forEach(function (s) {
  var t = txt(el("text", { "class": "glabel sealabel", "font-size": 13, x: px(s[2]), y: py(s[1]) }), s[0]);
  gLabels.appendChild(t); seaLabels.push(t);
});
[["AFRICA",4,20],["ASIA",46,95],["EUROPE",55,20],["NORTH AMERICA",45,-100],
 ["SOUTH AMERICA",-14,-60],["AUSTRALIA",-25,134],["ANTARCTICA",-80,20]
].forEach(function (s) {
  var t = txt(el("text", { "class": "glabel contlabel", "font-size": 21, x: px(s[2]), y: py(s[1]) }), s[0]);
  t.style.display = "none";
  gLabels.appendChild(t); contLabels.push(t);
});

/* ---------------------------------------------------------------- pin layers */
function PinLayer(id, build, labelTier) {
  this.id = id;
  this.build = build;
  this.labelTier = labelTier === undefined ? 1 : labelTier;
  this.items = null;
  this.root = el("g", {});
  this.root.style.display = "none";
  gPins.appendChild(this.root);
  this.tiers = [];
  for (var i = 0; i < 6; i++) {
    var g = el("g", {});
    g.style.display = "none";
    this.root.appendChild(g);
    this.tiers.push({ g: g, built: false });
  }
}
PinLayer.prototype.give = function (items) {
  this.items = items;
  this.byTier = [[],[],[],[],[],[]];
  for (var i = 0; i < items.length; i++) this.byTier[items[i].tier].push(items[i]);
};
PinLayer.prototype.buildTier = function (t) {
  var slot = this.tiers[t];
  if (slot.built || !this.items) return;
  slot.built = true;
  var self = this, frag = document.createDocumentFragment();
  this.byTier[t].forEach(function (it) {
    var g = el("g", { "class": "pin" });
    g.appendChild(el("circle", { r: 17, fill: "rgba(0,0,0,0)" }));
    g.appendChild(el("circle", { "class": "ring", r: 15, fill: "none", stroke: RED, "stroke-width": 3 }));
    g.appendChild(self.build(it));
    var lab = txt(el("text", { y: -15 }), it.n);
    g.appendChild(lab);
    it.node = g; it.lab = lab; it.layer = self;
    it.sx = px(it.x); it.sy = py(it.y);
    g.__item = it;
    frag.appendChild(g);
  });
  slot.g.appendChild(frag);
};
PinLayer.prototype.refresh = function (on, t, inv, room) {
  this.root.style.display = on ? "" : "none";
  if (!on || !this.items) return;
  for (var i = 0; i < 6; i++) {
    var vis = i <= t;
    if (vis) this.buildTier(i);
    this.tiers[i].g.style.display = vis ? "" : "none";
    if (!vis) continue;
    var list = this.byTier[i];
    for (var j = 0; j < list.length; j++) {
      var it = list[j];
      if (!it.node) continue;
      it.node.setAttribute("transform", "translate(" + it.sx + "," + it.sy + ") scale(" + inv + ")");
      it.lab.style.display = (it === chosen || ((i <= this.labelTier || t >= 3) && room)) ? "" : "none";
    }
  }
};

function triangle(h, maxh, fill) {
  var s = 6 + Math.min(1, h / maxh) * 16;
  var g = el("g", {});
  g.appendChild(el("path", { d: "M0,0 L" + (-s*0.95) + "," + (s*0.9) + " L" + (s*0.95) + "," + (s*0.9) + " Z",
    fill: fill, stroke: INK, "stroke-width": 1.6, "stroke-linejoin": "round" }));
  return g;
}
var peaksLayer = new PinLayer("mountains", function (it) {
  var g = triangle(it.h, 8848, PAPER);
  var s = 6 + Math.min(1, it.h / 8848) * 16;
  g.appendChild(el("path", { d: "M0,0 L" + (-s*0.34) + "," + (s*0.32) + " L" + (-s*0.15) + "," + (s*0.2) +
    " L0," + (s*0.34) + " L" + (s*0.16) + "," + (s*0.19) + " L" + (s*0.34) + "," + (s*0.32) + " Z", fill: INK }));
  return g;
});
var volcLayer = new PinLayer("volcanoes", function (it) {
  var g = triangle(it.h, 6000, RED);
  var s = 6 + Math.min(1, it.h / 6000) * 16;
  g.appendChild(el("path", { d: "M" + (-s*0.3) + "," + (-s*0.1) + " q " + (s*0.3) + ",-" + (s*0.55) + " " +
    (s*0.62) + ",-" + (s*0.08), fill: "none", stroke: INK, "stroke-width": 2, "stroke-linecap": "round" }));
  return g;
});
function dotLayer(colour, r) {
  return function () {
    var g = el("g", {});
    g.appendChild(el("circle", { r: r, fill: colour, stroke: INK, "stroke-width": 2 }));
    return g;
  };
}
var rocketLayer = new PinLayer("rockets", function () {
  var g = el("g", {});
  g.appendChild(el("path", { d: "M0,-12 L6,0 L6,8 L-6,8 L-6,0 Z", fill: PAPER, stroke: INK, "stroke-width": 2,
    "stroke-linejoin": "round" }));
  g.appendChild(el("path", { d: "M-6,3 L-11,9 L-6,8 M6,3 L11,9 L6,8", fill: RED, stroke: INK, "stroke-width": 2,
    "stroke-linejoin": "round" }));
  g.appendChild(el("circle", { cx: 0, cy: -2, r: 2.4, fill: BLU }));
  return g;
}, 5);
var animalLayer = new PinLayer("animals", dotLayer(YEL, 8), 5);
var markLayer = new PinLayer("landmarks", dotLayer(BLU, 8), 5);
var mineLayer = new PinLayer("mine", function () {
  var g = el("g", {});
  g.appendChild(el("path", { d: "M0,10 L0,-6", stroke: INK, "stroke-width": 2.5, "stroke-linecap": "round" }));
  g.appendChild(el("path", { d: "M0,-10 L12,-6 L0,-2 Z", fill: RED, stroke: INK, "stroke-width": 2,
    "stroke-linejoin": "round" }));
  return g;
}, 5);
var cityLayer = new PinLayer("cities", dotLayer(INK, 4.5), 2);
var foundLayer = new PinLayer("found", function () {
  var g = el("g", {});
  g.appendChild(el("circle", { r: 9, fill: YEL, stroke: INK, "stroke-width": 3 }));
  return g;
}, 5);
foundLayer.give([]);

function curated(list) {
  return list.map(function (a) {
    return { n: a[0], y: a[1], x: a[2], fact: a[3], tier: 0 };
  });
}
rocketLayer.give(curated(JG_ROCKETS));
animalLayer.give(curated(JG_ANIMALS));
markLayer.give(curated(JG_LANDMARKS));

/* ---------------------------------------------------------------- lazy data */
var loaded = {}, loading = {};
function load(file, globalName) {
  if (loaded[file]) return Promise.resolve(window[globalName]);
  if (loading[file]) return loading[file];
  loading[file] = new Promise(function (res, rej) {
    var s = document.createElement("script");
    s.src = "data/" + file;
    s.onload = function () { loaded[file] = true; res(window[globalName]); };
    s.onerror = function () { rej(new Error("could not load " + file)); };
    document.head.appendChild(s);
  });
  return loading[file];
}

/* Walk the list from most important down, and only let a thing appear at a zoom
   level if nothing already showing at that level is too close to it. Keeps the
   map spread out instead of piling every tall peak into the Himalaya. */
function spreadTiers(items, forced, gaps) {
  var placed = [[], [], [], [], [], []], i, t, j, ok, p;
  for (i = 0; i < items.length; i++) {
    var it = items[i];
    var isTop = forced && forced[it.n.toLowerCase()];
    if (isTop) {
      ok = true;
      for (j = 0; j < placed[0].length; j++) {
        if (Math.abs(placed[0][j].x - it.x) < 9 && Math.abs(placed[0][j].y - it.y) < 7) { ok = false; break; }
      }
      it.tier = ok ? 0 : 1;
      placed[it.tier].push(it);
      continue;
    }
    it.tier = 5;
    for (t = 1; t < 6; t++) {
      ok = true;
      for (var u = 0; u <= t && ok; u++) {
        p = placed[u];
        for (j = 0; j < p.length; j++) {
          if (Math.abs(p[j].x - it.x) < gaps[t] && Math.abs(p[j].y - it.y) < gaps[t]) { ok = false; break; }
        }
      }
      if (ok) { it.tier = t; break; }
    }
    placed[it.tier].push(it);
  }
  return items;
}
var GAPS = [34, 20, 11, 5.5, 2.6, 0];

var ensure = {
  mountains: function () {
    return load("peaks.js", "JG_PEAKS").then(function (d) {
      if (peaksLayer.items) return;
      var forced = {};
      JG_PEAKS_TOP.forEach(function (n) { forced[n.toLowerCase()] = 1; });
      peaksLayer.give(spreadTiers(d.map(function (m) {
        return { n: JG_PEAK_RENAME[m.n] || m.n, raw: m.n, y: m.y, x: m.x, h: m.h, hi: m.hi,
                 where: m.c || m.r, kind: "mountain" };
      }), (function () {
        var f = {};
        JG_PEAKS_TOP.forEach(function (n) { f[(JG_PEAK_RENAME[n] || n).toLowerCase()] = 1; });
        return f;
      })(), GAPS));
    });
  },
  volcanoes: function () {
    return load("volcanoes.js", "JG_VOLCANOES").then(function (d) {
      if (volcLayer.items) return;
      var famous = {};
      JG_VOLC_FAMOUS.forEach(function (n) { famous[n.toLowerCase()] = 1; });
      volcLayer.give(spreadTiers(d.map(function (v) {
        return { n: v.n, y: v.y, x: v.x, h: v.h, where: v.c, type: v.t, erupt: v.e, kind: "volcano" };
      }), (function () {
        var f = {};
        d.forEach(function (v) {
          var head = v.n.split(",")[0].trim().toLowerCase();
          if (famous[v.n.toLowerCase()] || famous[head]) f[v.n.toLowerCase()] = 1;
        });
        return f;
      })(), GAPS));
    });
  },
  rivers: function () {
    return load("rivers.js", "JG_RIVERS").then(function (d) { buildRivers(d); });
  },
  cities: function () {
    return load("cities.js", "JG_CITIES").then(function (d) {
      if (cityLayer.items) return;
      cityLayer.give(spreadTiers(d.map(function (c) {
        return { n: c.n, y: c.y, x: c.x, pop: c.p, where: c.c, adm: c.a,
                 capital: !!c.k, kind: "city" };
      }), null, [40, 16, 8, 4, 1.8, 0]));
    });
  }
};

/* rivers get their own drawing: polylines, not pins */
var rivers = null, riverByName = null;
function buildRivers(d) {
  if (rivers) return;
  rivers = []; riverByName = {};
  var tiers = [];
  for (var i = 0; i < 6; i++) { var g = el("g", {}); g.style.display = "none"; gRivers.appendChild(g); tiers.push(g); }
  var labelG = el("g", {}); gRivers.appendChild(labelG);
  var top = {};
  JG_RIVERS_TOP.forEach(function (n) { top[n.toLowerCase()] = 1; });
  d.forEach(function (r) {
    if (JG_RIVER_RENAME[r.n]) r.n = JG_RIVER_RENAME[r.n];
    var t = r.k <= 2 ? 0 : r.k <= 4 ? 1 : r.k <= 6 ? 2 : r.k === 7 ? 3 : r.k === 8 ? 4 : 5;
    var pts = r.p.map(function (c) { return px(c[0]).toFixed(1) + "," + py(c[1]).toFixed(1); });
    var node = el("path", { d: "M" + pts.join("L"), "class": "riv" + (r.l ? " lake" : ""),
                            "stroke-width": [3.4,3.4,3,2.5,2.2,2,1.8,1.6,1.4,1.3,1.2][Math.min(10, r.k)] });
    node.setAttribute("data-name", r.n);
    tiers[t].appendChild(node);
    var mid = r.p[Math.floor(r.p.length / 2)];
    var rec = riverByName[r.n];
    if (!rec) {
      rec = riverByName[r.n] = { n: r.n, y: mid[1], x: mid[0], tier: t, kind: "river", nodes: [] };
      rivers.push(rec);
      if (r.k <= 8) {
        var lab = txt(el("text", { "class": "glabel", "font-size": 12,
                                   x: px(mid[0]), y: py(mid[1]) - 5 }), r.n);
        lab.style.display = "none";
        rec.lab = lab;
        rec.labK = top[r.n.toLowerCase()] ? 1 : ([2.1, 2.1, 2.1, 3, 3, 4.6, 4.6, 7, 10][r.k] || 12);
        labelG.appendChild(lab);
      }
    }
    rec.nodes.push(node);
    if (t < rec.tier) rec.tier = t;
  });
  riverTiers = tiers;
}
var riverTiers = null;

/* ---------------------------------------------------------------- layers UI */
function icon(paths) {
  return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#151515" ' +
         'stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + paths + '</svg>';
}
var IC = {
  world:  icon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c4 4 4 14 0 18M12 3c-4 4-4 14 0 18"/>'),
  flag:   icon('<path d="M5 21V4"/><path d="M5 5h13l-3 4 3 4H5" fill="#F3C13A"/>'),
  states: icon('<path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/><path d="M9 4v13M15 7v13"/>'),
  mount:  icon('<path d="M2 19h20L14 5l-4 7-2-3z" fill="#FFFFFF"/>'),
  volc:   icon('<path d="M3 20h18l-6-9h-6z" fill="#E14B31"/><path d="M11 9c0-3 3-2 3-5"/>'),
  river:  icon('<path d="M3 7c4 0 4 4 8 4s4-4 8-4M3 15c4 0 4 4 8 4s4-4 8-4"/>'),
  rocket: icon('<path d="M12 2c3 3 4 7 4 11l-4 3-4-3c0-4 1-8 4-11z" fill="#FFFFFF"/><path d="M8 12l-3 5 3-1M16 12l3 5-3-1"/>'),
  animal: icon('<circle cx="12" cy="13" r="6" fill="#F3C13A"/><path d="M7 7l1 3M17 7l-1 3"/>'),
  mark:   icon('<path d="M4 20h16M6 20V9l6-5 6 5v11" fill="#3E7CB1"/><path d="M10 20v-6h4v6"/>'),
  pin:    icon('<path d="M12 21V4"/><path d="M12 4l8 3-8 3z" fill="#E14B31"/>')
};
var LAYERS = [
  { id: "continents", label: "Continents", ic: IC.world },
  { id: "countries",  label: "Countries",  ic: IC.flag },
  { id: "states",     label: "US states",  ic: IC.states },
  { id: "mountains",  label: "Mountains",  ic: IC.mount },
  { id: "volcanoes",  label: "Volcanoes",  ic: IC.volc },
  { id: "rivers",     label: "Rivers",     ic: IC.river },
  { id: "rockets",    label: "Rockets",    ic: IC.rocket },
  { id: "animals",    label: "Animals",    ic: IC.animal },
  { id: "landmarks",  label: "Landmarks",  ic: IC.mark },
  { id: "mine",       label: "My places",  ic: IC.pin }
];
var layer = "continents";
var bar = document.getElementById("bar"), seek = bar.querySelector(".seek");
LAYERS.forEach(function (L) {
  var b = document.createElement("button");
  b.className = "mbtn";
  b.type = "button";
  b.setAttribute("aria-pressed", String(L.id === layer));
  b.setAttribute("data-id", L.id);
  b.innerHTML = L.ic + "<span>" + L.label + "</span>";
  b.onclick = function () { setLayer(L.id, true); };
  bar.insertBefore(b, seek);
});

var PINLAYERS = { mountains: peaksLayer, volcanoes: volcLayer, rockets: rocketLayer,
                  animals: animalLayer, landmarks: markLayer, mine: mineLayer };

function setLayer(id, fly) {
  layer = id;
  stopQuest();
  Array.prototype.forEach.call(bar.querySelectorAll(".mbtn"), function (b) {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-id") === id));
  });
  countries.forEach(function (c) {
    c.node.style.fill = id === "continents" ? (CONT_FILL[c.cont] || PAPER) : "";
    c.node.classList.toggle("pickable", id === "continents" || id === "countries");
    c.node.classList.toggle("faded", id !== "continents" && id !== "countries");
  });
  contLabels.forEach(function (t) { t.style.display = id === "continents" ? "" : "none"; });
  gStates.style.display = id === "states" ? "" : "none";
  gRivers.style.display = id === "rivers" ? "" : "none";
  hideCard();

  if (id === "rivers" && !rivers) { say2("Loading the rivers…"); ensure.rivers().then(draw); }
  if (id === "mountains" && !peaksLayer.items) { say2("Loading the mountains…"); ensure.mountains().then(draw); }
  if (id === "volcanoes" && !volcLayer.items) { say2("Loading the volcanoes…"); ensure.volcanoes().then(draw); }
  if (id === "countries" && !cityLayer.items) ensure.cities().then(draw);
  if (id === "mine") loadMine();

  if (fly) {
    if (id === "states") flyTo(39, -97, 3.6);
    else if (id === "mine" && mineLayer.items && mineLayer.items.length) {
      flyTo(mineLayer.items[0].y, mineLayer.items[0].x, 5);
    } else flyTo(12, 12, 1, 450);
  }
  hint();
  draw();
}
function hint() {
  var m = {
    continents: "Seven big pieces of land. Tap one to hear its name.",
    countries:  "Tap any country. Zoom in and the towns appear.",
    states:     "The fifty states. Small ones need a zoom before their name fits.",
    mountains:  "Bigger triangle, taller mountain. 632 of them once you zoom in.",
    volcanoes:  "1,558 volcanoes. Tap one to hear when it last erupted.",
    rivers:     "The biggest rivers first. More appear as you go in.",
    rockets:    "Places on Earth where rockets are built and launched.",
    animals:    "Roughly where each animal lives.",
    landmarks:  "Things people built that are worth knowing about.",
    mine:       "Tap the map to drop a pin and name it. Saved in this browser only."
  };
  note.textContent = m[layer] || "";
}
function say2(s) { note.textContent = s; }

/* ---------------------------------------------------------------- transform */
var k = 1, tx = 0, ty = 0, chosen = null;
function visible() {
  var r = svg.getBoundingClientRect();
  var sc = Math.min(r.width / W, r.height / H) || 1;
  return { w: r.width / sc, h: r.height / sc, sc: sc };
}
function clamp() {
  k = Math.max(1, Math.min(42, k));
  var v = visible(), lx = (k * W - v.w) / 2, ly = (k * H - v.h) / 2;
  tx = lx <= 0 ? 0 : Math.max(-lx, Math.min(lx, tx));
  ty = ly <= 0 ? 0 : Math.max(-ly, Math.min(ly, ty));
}
function draw() {
  clamp();
  view.setAttribute("transform",
    "translate(" + (W/2 + tx) + "," + (H/2 + ty) + ") scale(" + k + ") translate(" + (-W/2) + "," + (-H/2) + ")");
  var v0 = visible(), inv = 1 / (k * v0.sc), t = tierNow();

  var room = k * v0.sc >= 0.34;
  for (var id in PINLAYERS) PINLAYERS[id].refresh(id === layer, t, inv, room);
  cityLayer.refresh(layer === "countries" && k >= TIERZ[1], Math.max(1, t), inv, room);
  foundLayer.refresh(true, 5, inv, true);

  if (riverTiers) {
    for (var i = 0; i < 6; i++) riverTiers[i].style.display = i <= t ? "" : "none";
    rivers.forEach(function (r) {
      if (r.lab) {
        var show = k >= r.labK;
        r.lab.style.display = show ? "" : "none";
        if (show) counter(r.lab, inv);
      }
    });
  }
  var want = layer === "states" ? "state" : layer === "countries" ? "country" : "none";
  labels.forEach(function (l) {
    var on = l.kind === want && l.box.w * k * v0.sc > 42;
    l.t.style.display = on ? "" : "none";
    if (on) counterBox(l.t, l.box, inv);
  });
  seaLabels.forEach(function (t2) { counter(t2, inv); t2.style.display = (k > 3 || !room) ? "none" : ""; });
  contLabels.forEach(function (t2) { counter(t2, inv); if (layer === "continents") t2.style.display = room ? "" : "none"; });
}
function counter(t2, inv) {
  var x = +t2.getAttribute("x"), y = +t2.getAttribute("y");
  t2.setAttribute("transform", "translate(" + x + "," + y + ") scale(" + inv + ") translate(" + (-x) + "," + (-y) + ")");
}
function counterBox(t2, b, inv) {
  t2.setAttribute("transform", "translate(" + b.cx + "," + b.cy + ") scale(" + inv + ") translate(" + (-b.cx) + "," + (-b.cy) + ")");
}

function flyTo(lat, lon, zoom, ms) {
  ms = ms === undefined ? 620 : ms;
  var X = (W/2 - px(lon)) * zoom, Y = (H/2 - py(lat)) * zoom;
  var k0 = k, x0 = tx, y0 = ty, t0 = performance.now();
  if (matchMedia("(prefers-reduced-motion:reduce)").matches || ms === 0) {
    k = zoom; tx = X; ty = Y; draw(); return;
  }
  (function step(t) {
    var u = Math.min(1, (t - t0) / ms), e = u < 0.5 ? 4*u*u*u : 1 - Math.pow(-2*u + 2, 3) / 2;
    k = k0 + (zoom - k0) * e; tx = x0 + (X - x0) * e; ty = y0 + (Y - y0) * e;
    draw();
    if (u < 1) requestAnimationFrame(step);
  })(t0);
}
function flyToBox(b) {
  var v = visible();
  var z = Math.min(30, Math.max(1, Math.min(v.w / (b.w * 1.35), v.h / (b.h * 1.35))));
  flyTo(90 - b.cy / H * 180, b.cx / W * 360 - 180, z);
}

/* ---------------------------------------------------------------- input */
var pointers = new Map(), lastPt = null, moved = 0, downAt = 0, downTarget = null, pinchD = 0;
svg.addEventListener("pointerdown", function (e) {
  svg.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1) { lastPt = { x: e.clientX, y: e.clientY }; moved = 0; downAt = Date.now(); downTarget = e.target; }
});
svg.addEventListener("pointermove", function (e) {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1 && lastPt) {
    var dx = e.clientX - lastPt.x, dy = e.clientY - lastPt.y, sc = visible().sc;
    moved += Math.abs(dx) + Math.abs(dy);
    tx += dx / sc; ty += dy / sc; lastPt = { x: e.clientX, y: e.clientY };
    draw();
  } else if (pointers.size === 2) {
    var a = Array.from(pointers.values());
    var d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
    if (pinchD) zoomAt((a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2, d / pinchD);
    pinchD = d; moved += 9;
  }
});
function up(e) { pointers.delete(e.pointerId); if (pointers.size < 2) pinchD = 0; if (!pointers.size) lastPt = null; }
svg.addEventListener("pointerup", up);
svg.addEventListener("pointercancel", up);
function zoomAt(cx, cy, f) {
  var r = svg.getBoundingClientRect(), sc = visible().sc;
  var mx = (cx - r.left - r.width / 2) / sc, my = (cy - r.top - r.height / 2) / sc;
  var k1 = Math.max(1, Math.min(42, k * f)), g = k1 / k;
  tx = mx - (mx - tx) * g; ty = my - (my - ty) * g; k = k1;
  draw();
}
svg.addEventListener("wheel", function (e) {
  e.preventDefault();
  zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.16 : 1 / 1.16);
}, { passive: false });

svg.addEventListener("click", function (e) {
  if (moved > 10 || Date.now() - downAt > 600) return;
  var src = (downTarget && downTarget.closest) ? downTarget : e.target;
  var pin = src.closest ? src.closest(".pin") : null;
  if (pin && pin.__item) { choose(pin.__item); return; }
  var shape = src.closest ? src.closest(".land, .state, .riv") : null;
  if (!shape) { if (layer === "mine") addMine(e); else hideCard(); return; }
  var name = shape.getAttribute("data-name");
  if (shape.classList.contains("riv")) { choose(riverByName[name]); return; }
  if (shape.classList.contains("state")) {
    choose({ n: name, kind: "state", box: byName(states, name).box }); return;
  }
  if (layer === "continents" || layer === "countries") {
    var c = byName(countries, name);
    choose({ n: name, kind: "country", cont: c.cont, box: c.box });
  } else if (layer === "mine") addMine(e);
});
function byName(list, n) {
  for (var i = 0; i < list.length; i++) if (list[i].name === n) return list[i];
  return null;
}

/* ---------------------------------------------------------------- the card */
var card = document.getElementById("card"), cName = document.getElementById("cName"),
    cHi = document.getElementById("cHi"), cFact = document.getElementById("cFact"),
    cTags = document.getElementById("cTags"), gauge = document.getElementById("gauge");
var spoken = "", goTo = null;

var ERUPT = { D1: "It last erupted in 1964 or later.", D2: "It last erupted between 1900 and 1963.",
  D3: "It last erupted in the 1800s.", D4: "It last erupted in the 1700s.",
  D5: "It last erupted between 1500 and 1699.", D6: "It last erupted more than 500 years ago.",
  D7: "It last erupted thousands of years ago.", U: "Nobody knows when it last erupted.",
  U1: "Nobody knows when it last erupted.", Q: "Only steam and hot springs now.",
  Unknown: "Nobody knows when it last erupted.", "?": "Nobody is sure when it last erupted." };

function describe(it) {
  var extra = JG_FACTS[it.n] || JG_FACTS[it.n.split(",")[0].trim()] || "";
  var out = { name: it.n, hi: it.hi || "", fact: extra, tags: [], gauge: null };
  switch (it.kind) {
    case "mountain":
      out.tags = ["Mountain", num(it.h) + " m tall"];
      if (it.where) out.tags.push(it.where);
      out.gauge = it.h / 8848;
      if (!extra) out.fact = num(it.h) + " metres tall" + (it.where ? ", in " + it.where : "") + ".";
      break;
    case "volcano":
      out.tags = ["Volcano", num(it.h) + " m"];
      if (it.where) out.tags.push(it.where);
      out.gauge = Math.min(1, it.h / 6000);
      out.fact = (extra ? extra + " " : "") + (ERUPT[it.erupt] || "");
      if (it.type) out.tags.push(it.type);
      break;
    case "river":
      out.tags = ["River"];
      out.fact = extra || "A river. Follow it with your finger and see where it ends up.";
      break;
    case "city":
      out.tags = [it.capital ? "Capital city" : "City"];
      if (it.where) out.tags.push(it.where);
      out.fact = (it.capital ? "The capital of " + it.where + ". " : "A city in " + it.where + ". ") +
                 "About " + num(Math.round(it.pop / 1000) * 1000) + " people live here.";
      break;
    case "country":
      out.tags = it.cont ? [CONT_NAME[it.cont]] : [];
      out.fact = extra || (it.cont ? "This country is in " + CONT_NAME[it.cont] + "." : "");
      break;
    case "state":
      out.tags = ["US state"];
      out.fact = extra || "One of the fifty states of the United States.";
      break;
    default:
      out.fact = it.fact || extra || "";
  }
  return out;
}
function choose(it) {
  if (!it) return;
  if (questOn) { answer(it.n); return; }
  if (chosen && chosen.node) chosen.node.classList.remove("chosen");
  chosen = it;
  if (it.node) it.node.classList.add("chosen");
  showCard(it);
}
function showCard(it) {
  var d = describe(it);
  cName.textContent = d.name;
  cHi.textContent = d.hi;
  cHi.style.display = d.hi ? "" : "none";
  cFact.textContent = d.fact;
  cTags.innerHTML = "";
  d.tags.forEach(function (t) {
    var s = document.createElement("span");
    s.className = "tag"; s.textContent = t; cTags.appendChild(s);
  });
  if (d.gauge != null) { gauge.style.display = "block"; gauge.firstElementChild.style.width = Math.round(d.gauge * 100) + "%"; }
  else gauge.style.display = "none";
  goTo = it.box ? { box: it.box } : { lat: it.y, lon: it.x, z: it.kind === "city" ? 8 : 6 };
  card.classList.add("show");
  spoken = d.name + ". " + d.fact;
  speak(spoken);
}
function hideCard() {
  card.classList.remove("show");
  if (chosen && chosen.node) chosen.node.classList.remove("chosen");
  chosen = null;
}
document.getElementById("cX").onclick = hideCard;
document.getElementById("cSay").onclick = function () { sound = true; soundBtn(); speak(spoken); };
document.getElementById("cGo").onclick = function () {
  if (!goTo) return;
  if (goTo.box) flyToBox(goTo.box); else flyTo(goTo.lat, goTo.lon, goTo.z);
};

/* ---------------------------------------------------------------- speech */
var sound = true, tSound = document.getElementById("tSound");
function soundBtn() { tSound.setAttribute("aria-pressed", String(sound)); tSound.textContent = sound ? "♪" : "✕"; }
tSound.onclick = function () {
  sound = !sound; soundBtn();
  if (!sound && window.speechSynthesis) speechSynthesis.cancel();
};
function speak(s) {
  if (!sound || !("speechSynthesis" in window) || !s) return;
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(s);
  u.rate = 0.92; u.pitch = 1.05;
  speechSynthesis.speak(u);
}

/* ---------------------------------------------------------------- search */
var q = document.getElementById("q"), res = document.getElementById("res"), searchReady = false;
function prepSearch() {
  if (searchReady) return Promise.resolve();
  return Promise.all([ensure.mountains(), ensure.volcanoes(), ensure.rivers(), ensure.cities()])
    .then(function () { searchReady = true; draw(); });
}
var volcNames = null;
function indexVolcanoNames() {
  if (volcNames || !volcLayer.items) return;
  volcNames = {};
  volcLayer.items.forEach(function (v) {
    volcNames[v.n.toLowerCase()] = 1;
    volcNames[v.n.split(",")[0].trim().toLowerCase()] = 1;
  });
}
function hunt(term) {
  indexVolcanoNames();
  term = term.trim().toLowerCase();
  if (term.length < 2) return [];
  var out = [], seen = {};
  function push(name, sub, go, limit) {
    var key = name + "|" + sub;
    if (seen[key]) return;
    seen[key] = 1;
    out.push({ name: name, sub: sub, go: go });
  }
  function scan(list, get, cap) {
    var n = 0;
    for (var i = 0; i < list.length && n < cap; i++) {
      var it = list[i], nm = (it.n || it.name || "").toLowerCase();
      if (nm.indexOf(term) !== 0 && nm.indexOf(" " + term) < 0) continue;
      n++; get(it);
    }
  }
  scan(countries, function (c) {
    push(c.name, "Country · " + (CONT_NAME[c.cont] || ""), { layer: "countries", it: { n: c.name, kind: "country", cont: c.cont, box: c.box } });
  }, 5);
  scan(states, function (s) {
    push(s.name, "US state", { layer: "states", it: { n: s.name, kind: "state", box: s.box } });
  }, 5);
  if (cityLayer.items) scan(cityLayer.items, function (c) {
    push(c.n, (c.capital ? "Capital · " : "Town or city · ") + c.where, { layer: "countries", it: c, pin: true });
  }, 8);
  if (peaksLayer.items) scan(peaksLayer.items, function (m) {
    if (volcNames && volcNames[m.n.toLowerCase()]) return;   /* it is a volcano; that card is better */
    push(m.n, "Mountain · " + num(m.h) + " m", { layer: "mountains", it: m });
  }, 6);
  if (volcLayer.items) scan(volcLayer.items, function (v) {
    push(v.n, "Volcano · " + v.where, { layer: "volcanoes", it: v });
  }, 6);
  if (rivers) scan(rivers, function (r) {
    push(r.n, "River", { layer: "rivers", it: r });
  }, 6);
  [["rockets", rocketLayer], ["animals", animalLayer], ["landmarks", markLayer]].forEach(function (p) {
    scan(p[1].items, function (x) { push(x.n, p[0].replace(/s$/, ""), { layer: p[0], it: x }); }, 4);
  });
  return out.slice(0, 40);
}
function showResults(list) {
  res.innerHTML = "";
  if (!list.length) { res.classList.remove("show"); return; }
  list.forEach(function (r) {
    var b = document.createElement("button");
    b.type = "button";
    b.innerHTML = "<b></b><i></i>";
    b.firstChild.textContent = r.name;
    b.lastChild.textContent = r.sub;
    b.onclick = function () { goResult(r.go); };
    res.appendChild(b);
  });
  res.classList.add("show");
}
function goResult(g) {
  res.classList.remove("show");
  q.blur();
  if (layer !== g.layer) setLayer(g.layer, false);
  var it = g.it;
  if (g.pin) {
    foundLayer.give([{ n: it.n, y: it.y, x: it.x, tier: 0 }]);
    foundLayer.tiers.forEach(function (s) { while (s.g.firstChild) s.g.removeChild(s.g.firstChild); s.built = false; });
  }
  if (it.box) flyToBox(it.box); else flyTo(it.y, it.x, it.kind === "city" ? 9 : 6);
  setTimeout(function () { choose(it); }, 200);
  draw();
}
var huntTimer = null;
q.addEventListener("input", function () {
  clearTimeout(huntTimer);
  var term = q.value;
  if (term.trim().length < 2) { res.classList.remove("show"); return; }
  huntTimer = setTimeout(function () {
    if (!searchReady) {
      res.innerHTML = "<button type='button'><b>Looking…</b><i>loading the mountains, rivers and towns</i></button>";
      res.classList.add("show");
      prepSearch().then(function () { showResults(hunt(q.value)); });
    } else showResults(hunt(term));
  }, 140);
});
q.addEventListener("focus", prepSearch);
document.addEventListener("click", function (e) {
  if (!res.contains(e.target) && e.target !== q) res.classList.remove("show");
});

/* ---------------------------------------------------------------- my places */
var MINE_KEY = "jugnu.atlas.pins";
function loadMine() {
  if (mineLayer.items) return;
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(MINE_KEY) || "[]"); } catch (err) { saved = []; }
  mineLayer.give(saved.map(function (p) { return { n: p.n, y: p.y, x: p.x, fact: p.f || "", tier: 0 }; }));
}
function saveMine() {
  try {
    localStorage.setItem(MINE_KEY, JSON.stringify(mineLayer.items.map(function (p) {
      return { n: p.n, y: p.y, x: p.x, f: p.fact };
    })));
  } catch (err) { /* private browsing — the pins just won't persist */ }
}
function addMine(e) {
  var r = svg.getBoundingClientRect(), sc = visible().sc;
  var mx = (e.clientX - r.left - r.width / 2) / sc, my = (e.clientY - r.top - r.height / 2) / sc;
  var X = (mx - tx) / k + W / 2, Y = (my - ty) / k + H / 2;
  var name = prompt("What is this place called?");
  if (!name) return;
  loadMine();
  mineLayer.items.push({ n: name, y: 90 - Y / H * 180, x: X / W * 360 - 180, fact: "", tier: 0 });
  mineLayer.give(mineLayer.items);
  mineLayer.tiers.forEach(function (s) { while (s.g.firstChild) s.g.removeChild(s.g.firstChild); s.built = false; });
  saveMine();
  draw();
}

/* ---------------------------------------------------------------- find it */
var questOn = false, target = null, score = 0, tries = 0;
var qBox = document.getElementById("quest"), tFind = document.getElementById("tFind");
function pool() {
  if (layer === "states") return states.map(function (s) { return { n: s.name }; });
  if (layer === "rivers" && rivers) return rivers.filter(function (r) { return r.tier <= 1; });
  var L = PINLAYERS[layer];
  if (L && L.items) return L.items.filter(function (i) { return i.tier <= 1; });
  return countries.filter(function (c) { return c.box.w > 14; }).map(function (c) { return { n: c.name }; });
}
tFind.onclick = function () { questOn ? stopQuest() : startQuest(); };
function startQuest() {
  var p = pool();
  if (!p.length) return;
  questOn = true; score = 0;
  tFind.setAttribute("aria-pressed", "true");
  hideCard(); nextQuest();
}
function nextQuest() {
  var p = pool();
  target = p[Math.floor(Math.random() * p.length)].n;
  tries = 0;
  qBox.innerHTML = "";
  qBox.appendChild(document.createTextNode("Can you find " + target + "?"));
  var em = document.createElement("em");
  em.textContent = "Score " + score;
  qBox.appendChild(em);
  qBox.classList.add("show");
  speak("Can you find " + target + "?");
}
function answer(name) {
  if (!name) return;
  if (name === target) {
    score++;
    qBox.textContent = "Yes! That is " + name + ".";
    speak("Yes! That is " + name + ".");
    setTimeout(function () { if (questOn) nextQuest(); }, 1800);
  } else {
    tries++;
    var extra = tries >= 2 ? " Look in " + whereabouts(target) + "." : "";
    qBox.textContent = "That one is " + name + ". Try again." + extra;
    speak("That is " + name + ". Try again." + extra);
  }
}
function whereabouts(n) {
  var c = byName(countries, n);
  if (c && c.cont) return CONT_NAME[c.cont];
  var all = [].concat(peaksLayer.items || [], volcLayer.items || [], rocketLayer.items || [],
                      animalLayer.items || [], markLayer.items || []);
  for (var i = 0; i < all.length; i++) if (all[i].n === n) {
    return (all[i].where || (all[i].y > 0 ? "the top half of the map" : "the bottom half of the map"));
  }
  return "the map";
}
function stopQuest() {
  questOn = false;
  qBox.classList.remove("show");
  tFind.setAttribute("aria-pressed", "false");
}

/* ---------------------------------------------------------------- tools */
document.getElementById("tIn").onclick = function () {
  var r = svg.getBoundingClientRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.5);
};
document.getElementById("tOut").onclick = function () {
  var r = svg.getBoundingClientRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1 / 1.5);
};
document.getElementById("tHome").onclick = function () { hideCard(); flyTo(12, 12, 1); };
addEventListener("resize", draw);
svg.setAttribute("tabindex", "0");
svg.addEventListener("keydown", function (e) {
  var step = 60 / k;
  if (e.key === "Escape") { hideCard(); stopQuest(); }
  else if (e.key === "ArrowLeft") tx += step;
  else if (e.key === "ArrowRight") tx -= step;
  else if (e.key === "ArrowUp") ty += step;
  else if (e.key === "ArrowDown") ty -= step;
  else if (e.key === "+" || e.key === "=") k *= 1.3;
  else if (e.key === "-") k /= 1.3;
  else return;
  e.preventDefault(); draw();
});

soundBtn();
setLayer("continents", false);
draw();
})();
