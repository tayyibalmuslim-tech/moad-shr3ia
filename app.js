/* =========================================================
   app.js — تطبيق «مواد شرعية»
   متابعة خطة الكتب + الملخصات + هل أنا ماشي بوتيرة كويسة ولا متأخر
   التخزين: localStorage دايمًا، ومزامنة Firebase لو دخلت (firebase-sync-moad.js)
   ========================================================= */
(function () {
  "use strict";

  var STORE_KEY = "moad_state_v1";
  var TREE_KEY = "moad_tree_cache_v1";
  var TREE_TTL = 10 * 60 * 1000; // 10 دقايق
  var DAY = 86400000;

  var BOOKS = PLAN.books;
  var BOOK_BY_KEY = {};
  BOOKS.forEach(function (b) { BOOK_BY_KEY[b.key] = b; });
  var LEVEL_BY_ID = {};
  PLAN.levels.forEach(function (l) { LEVEL_BY_ID[l.id] = l; });

  var STATUS = {
    todo:  { label: "لم يبدأ", cls: "st-todo" },
    doing: { label: "جارٍ",    cls: "st-doing" },
    done:  { label: "تم",      cls: "st-done" }
  };

  /* ---------------- أدوات ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function dateStr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function todayStr() { return dateStr(new Date()); }
  function parseDate(s) {
    var p = String(s || "").split("-");
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  function daysBetween(a, b) { return Math.round((b - a) / DAY); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function fmtDate(d) {
    if (!d) return "—";
    if (typeof d === "string") d = parseDate(d);
    if (!d) return "—";
    return d.toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "long", year: "numeric" });
  }
  function fmtNum(n, digits) {
    var f = Math.pow(10, digits == null ? 1 : digits);
    var v = Math.round(n * f) / f;
    return String(v);
  }
  function fmtHours(h) {
    if (h == null) return "مرجع";
    if (h < 1 && h > 0) return Math.round(h * 60) + " دقيقة";
    return fmtNum(h) + " ساعة";
  }
  function fmtMinutes(m) {
    if (!m) return "0 دقيقة";
    var h = Math.floor(m / 60), r = m % 60;
    if (!h) return r + " دقيقة";
    return h + " س" + (r ? " و" + r + " د" : "");
  }
  // عدد بصيغة عامية: يوم/يومين/3 أيام، شهر/شهرين/3 شهور، سنة/سنتين/3 سنين
  function plural(n, one, two, few, many) {
    if (n === 1) return one;
    if (n === 2) return two;
    if (Number.isInteger(n) && n >= 3 && n <= 10) return n + " " + few;
    return fmtNum(n) + " " + many;
  }
  function fmtSpan(days) {
    days = Math.round(Math.abs(days));
    if (days < 31) return plural(Math.max(days, 1), "يوم", "يومين", "أيام", "يوم");
    var months = Math.round(days / 30.4);
    if (months < 12) return plural(months, "شهر", "شهرين", "شهور", "شهر");
    var years = Math.round(days / 365 * 10) / 10;
    return plural(years, "سنة", "سنتين", "سنين", "سنة");
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /* ---------------- الحالة والتخزين ---------------- */
  function freshState() {
    return {
      v: 1, ts: 0,
      settings: {
        startDate: PLAN.defaults.startDate,
        hoursPerDay: PLAN.defaults.hoursPerDay,
        realism: PLAN.defaults.realism
      },
      books: {},
      log: []
    };
  }

  function normalize(s) {
    var base = freshState();
    if (!s || typeof s !== "object") return base;
    base.ts = +s.ts || 0;
    if (s.settings) {
      if (parseDate(s.settings.startDate)) base.settings.startDate = s.settings.startDate;
      var h = parseFloat(s.settings.hoursPerDay);
      if (h > 0 && h <= 16) base.settings.hoursPerDay = h;
      var r = parseFloat(s.settings.realism);
      if (r >= 1 && r <= 3) base.settings.realism = r;
    }
    if (s.books && typeof s.books === "object") {
      Object.keys(s.books).forEach(function (k) {
        var b = s.books[k] || {};
        base.books[k] = {
          status: STATUS[b.status] ? b.status : "todo",
          pct: clamp(parseInt(b.pct, 10) || 0, 0, 100),
          start: parseDate(b.start) ? b.start : null,
          end: parseDate(b.end) ? b.end : null,
          notes: typeof b.notes === "string" ? b.notes : ""
        };
      });
    }
    if (Array.isArray(s.log)) {
      base.log = s.log.filter(function (e) {
        return e && parseDate(e.d) && +e.m > 0;
      }).map(function (e) {
        return { d: e.d, m: Math.round(+e.m), b: BOOK_BY_KEY[e.b] ? e.b : null };
      });
    }
    return base;
  }

  function loadLocal() {
    try { return normalize(JSON.parse(localStorage.getItem(STORE_KEY))); }
    catch (e) { return freshState(); }
  }

  var state = loadLocal();

  function persist(opts) {
    state.ts = Date.now();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
    if (window.MoadCloud && window.MoadCloud.user) window.MoadCloud.save(state, state.ts);
    if (!opts || opts.render !== false) render();
  }

  function bookState(key) {
    if (!state.books[key]) state.books[key] = { status: "todo", pct: 0, start: null, end: null, notes: "" };
    return state.books[key];
  }
  function peekBook(key) {
    return state.books[key] || { status: "todo", pct: 0, start: null, end: null, notes: "" };
  }

  /* ---------------- الحسابات ---------------- */
  function totals() {
    var total = 0, done = 0;
    var levels = {};
    PLAN.levels.forEach(function (l) { levels[l.id] = { total: 0, done: 0, count: 0, finished: 0 }; });
    BOOKS.forEach(function (b) {
      var st = peekBook(b.key);
      var lv = levels[b.level];
      lv.count++;
      if (st.status === "done") lv.finished++;
      if (b.hours == null) return;
      var d = b.hours * st.pct / 100;
      total += b.hours; done += d;
      lv.total += b.hours; lv.done += d;
    });
    return { total: total, done: done, levels: levels };
  }

  function bookMinutes(key) {
    var m = 0;
    state.log.forEach(function (e) { if (e.b === key) m += e.m; });
    return m;
  }

  function computePace() {
    var s = state.settings;
    var t = totals();
    var start = parseDate(s.startDate);
    var today = parseDate(todayStr());
    var eff = s.hoursPerDay / s.realism;       // ساعات «إنجاز» في اليوم
    var plannedDays = Math.ceil(t.total / eff);
    var plannedEnd = addDays(start, plannedDays);
    var out = {
      total: t.total, done: t.done, eff: eff, start: start, today: today,
      plannedEnd: plannedEnd, plannedDays: plannedDays
    };

    if (t.done >= t.total - 0.01) { out.phase = "finished"; return out; }
    if (today < start) {
      out.phase = "before";
      out.daysToStart = daysBetween(today, start);
      out.expectedBook = BOOKS[0];
      return out;
    }

    var elapsed = daysBetween(start, today) + 1;
    var expected = Math.min(t.total, elapsed * eff);
    var diff = t.done - expected;
    out.elapsed = elapsed;
    out.expected = expected;
    out.diff = diff;
    out.daysDiff = diff / eff;
    var margin = eff * 3; // سماحية 3 أيام
    out.phase = diff > margin ? "ahead" : (diff >= -margin ? "ontrack" : "behind");

    // الكتاب اللي المفروض تكون فيه حسب الترتيب
    var cum = 0;
    out.expectedBook = BOOKS[BOOKS.length - 1];
    for (var i = 0; i < BOOKS.length; i++) {
      if (BOOKS[i].hours == null) continue;
      cum += BOOKS[i].hours;
      if (cum >= expected) { out.expectedBook = BOOKS[i]; break; }
    }

    // تاريخ الانتهاء المتوقع بمعدلك الفعلي
    if (elapsed >= 7 && t.done > 0) {
      var rate = t.done / elapsed;
      out.projectedEnd = addDays(today, Math.ceil((t.total - t.done) / rate));
    }

    // المطلوب يوميًا عشان تخلص في الميعاد المخطط
    var daysLeft = daysBetween(today, plannedEnd);
    out.daysLeft = daysLeft;
    if (daysLeft > 0) out.neededPerDay = (t.total - t.done) * s.realism / daysLeft;
    return out;
  }

  function logStats() {
    var byDay = {};
    state.log.forEach(function (e) { byDay[e.d] = (byDay[e.d] || 0) + e.m; });
    var today = parseDate(todayStr());
    var week = 0, days = [];
    for (var i = 13; i >= 0; i--) {
      var d = dateStr(addDays(today, -i));
      var m = byDay[d] || 0;
      days.push({ d: d, m: m });
      if (i < 7) week += m;
    }
    var streak = 0;
    var cursor = byDay[dateStr(today)] ? today : addDays(today, -1);
    while (byDay[dateStr(cursor)]) { streak++; cursor = addDays(cursor, -1); }
    var target = Math.round(state.settings.hoursPerDay * 60 * 7);
    return { today: byDay[dateStr(today)] || 0, week: week, target: target, days: days, streak: streak };
  }

  /* ---------------- الملخصات ---------------- */
  var tree = { files: null, error: null, loading: false, at: 0 };

  function loadTreeCache() {
    try {
      var c = JSON.parse(localStorage.getItem(TREE_KEY));
      if (c && Array.isArray(c.files)) { tree.files = c.files; tree.at = c.at || 0; }
    } catch (e) {}
  }
  loadTreeCache();

  function discover(force) {
    if (tree.loading) return;
    if (!force && tree.files && Date.now() - tree.at < TREE_TTL) return;
    if (location.protocol === "file:") { tree.error = "local"; return; }
    tree.loading = true;
    var r = PLAN.repo;
    var url = "https://api.github.com/repos/" + r.owner + "/" + r.name + "/git/trees/" + r.branch + "?recursive=1";
    fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status === 403 ? "rate" : "http" + res.status);
        return res.json();
      })
      .then(function (json) {
        tree.files = (json.tree || []).filter(function (t) {
          return t.type === "blob" && t.path.indexOf("books/") === 0;
        }).map(function (t) { return t.path; });
        tree.at = Date.now();
        tree.error = null;
        try { localStorage.setItem(TREE_KEY, JSON.stringify({ files: tree.files, at: tree.at })); } catch (e) {}
      })
      .catch(function (e) { tree.error = e.message || "net"; })
      .then(function () { tree.loading = false; render(); });
  }

  var SUMMARY_EXT = /\.(html?|pdf|md|png|jpe?g|webp|txt|apkg|tsv)$/i;

  function parseSummaryName(path) {
    var name = path.split("/").pop();
    var base = name.replace(/\.[^.]+$/, "");
    var m = base.match(/^(\d+)[\s._-]*(.*)$/);
    var n = m ? parseInt(m[1], 10) : null;
    var rest = (m ? m[2] : base).replace(/[-_]+/g, " ").trim();
    var title = rest || (n != null ? "الدرس " + n : base);
    return { n: n, title: title, ext: (name.match(/\.([^.]+)$/) || [])[1] || "" };
  }

  function summariesFor(book) {
    var list = [];
    var seen = {};
    (PLAN.summaries[book.key] || []).forEach(function (s) {
      var info = parseSummaryName(s.file);
      list.push({ n: s.n != null ? s.n : info.n, title: s.title || info.title, file: s.file, ext: info.ext.toLowerCase() });
      seen[s.file] = true;
    });
    (tree.files || []).forEach(function (p) {
      if (p.indexOf(book.folder + "/") !== 0 || seen[p]) return;
      var name = p.split("/").pop();
      if (/^readme/i.test(name) || name.charAt(0) === "." || !SUMMARY_EXT.test(name)) return;
      var info = parseSummaryName(p);
      list.push({ n: info.n, title: info.title, file: p, ext: info.ext.toLowerCase() });
    });
    list.sort(function (a, b) {
      var an = a.n == null ? 9999 : a.n, bn = b.n == null ? 9999 : b.n;
      return an - bn || a.file.localeCompare(b.file, "ar");
    });
    return list;
  }

  function summaryHref(s) {
    var r = PLAN.repo;
    if (/^(html?|pdf|png|jpe?g|webp|txt)$/.test(s.ext)) {
      return s.file.split("/").map(encodeURIComponent).join("/");
    }
    return "https://github.com/" + r.owner + "/" + r.name + "/blob/" + r.branch + "/" + s.file.split("/").map(encodeURIComponent).join("/");
  }

  function uploadHref(book) {
    var r = PLAN.repo;
    return "https://github.com/" + r.owner + "/" + r.name + "/upload/" + r.branch + "/" + book.folder;
  }
  function folderHref(book) {
    var r = PLAN.repo;
    return "https://github.com/" + r.owner + "/" + r.name + "/tree/" + r.branch + "/" + book.folder;
  }

  /* ---------------- مكوّنات العرض ---------------- */
  function bar(pct, cls) {
    pct = clamp(pct, 0, 100);
    return '<div class="bar ' + (cls || "") + '"><span style="width:' + pct.toFixed(1) + '%"></span></div>';
  }

  function statusPill(st) {
    var s = STATUS[st] || STATUS.todo;
    return '<span class="pill ' + s.cls + '">' + s.label + "</span>";
  }

  function levelPill(id) {
    var l = LEVEL_BY_ID[id];
    return '<span class="pill lv-' + id + '">' + esc(l ? l.name : id) + "</span>";
  }

  function bookOptions(selected) {
    var doing = BOOKS.filter(function (b) { return peekBook(b.key).status === "doing"; });
    var html = '<option value="">بدون كتاب محدد</option>';
    if (doing.length) {
      html += '<optgroup label="الجارية">';
      doing.forEach(function (b) {
        html += '<option value="' + b.key + '"' + (b.key === selected ? " selected" : "") + ">" + b.n + ". " + esc(b.title) + "</option>";
      });
      html += "</optgroup>";
    }
    PLAN.levels.forEach(function (l) {
      html += '<optgroup label="' + esc(l.name) + '">';
      BOOKS.forEach(function (b) {
        if (b.level !== l.id || peekBook(b.key).status === "doing") return;
        html += '<option value="' + b.key + '"' + (b.key === selected ? " selected" : "") + ">" + b.n + ". " + esc(b.title) + "</option>";
      });
      html += "</optgroup>";
    });
    return html;
  }

  function defaultLogBook() {
    for (var i = 0; i < BOOKS.length; i++) if (peekBook(BOOKS[i].key).status === "doing") return BOOKS[i].key;
    for (var j = 0; j < BOOKS.length; j++) if (peekBook(BOOKS[j].key).status !== "done") return BOOKS[j].key;
    return "";
  }

  /* ---------------- الصفحة الرئيسية ---------------- */
  var ui = { filter: "all", q: "", logBook: null };

  function paceCard() {
    var p = computePace();
    var s = state.settings;
    var badge, head, cls;

    if (p.phase === "finished") {
      return '<section class="card pace pace-ahead"><div class="pace-top"><span class="badge">🎉 خلصت الخطة</span></div>' +
        "<h2>الحمد لله، خلصت كل كتب الخطة</h2><p>دلوقتي وقت التطبيق المستمر على «المجموع» والمسائل.</p></section>";
    }

    if (p.phase === "before") {
      return '<section class="card pace pace-before">' +
        '<div class="pace-top"><span class="badge">⏳ لسه ما بدأتش</span></div>' +
        "<h2>الخطة تبدأ " + (p.daysToStart === 1 ? "بكرة" : "بعد " + fmtSpan(p.daysToStart)) + " — " + esc(fmtDate(p.start)) + "</h2>" +
        "<p>أول كتاب: <a href=\"#/book/" + p.expectedBook.key + "\">" + esc(p.expectedBook.title) + "</a></p>" +
        '<div class="stats3">' +
          stat("إجمالي الخطة", fmtNum(p.total, 0) + " ساعة") +
          stat("بمعدل يومي", fmtNum(s.hoursPerDay) + " ساعة") +
          stat("الانتهاء المخطط", fmtDate(p.plannedEnd)) +
        "</div></section>";
    }

    if (p.phase === "ahead") {
      cls = "pace-ahead"; badge = "🚀 سابق الخطة";
      head = "إنت سابق الخطة بحوالي " + fmtSpan(p.daysDiff) + " — ما شاء الله، كمّل";
    } else if (p.phase === "ontrack") {
      cls = "pace-ontrack"; badge = "✅ ماشي على الوتيرة";
      head = "وتيرتك كويسة ومطابقة للخطة تقريبًا";
    } else {
      cls = "pace-behind"; badge = "⚠️ متأخر";
      head = "إنت متأخر عن الخطة بحوالي " + fmtSpan(p.daysDiff) + " (" + fmtNum(-p.diff) + " ساعة إنجاز)";
    }

    var html = '<section class="card pace ' + cls + '">' +
      '<div class="pace-top"><span class="badge">' + badge + '</span><span class="muted">اليوم ' + p.elapsed + " من الخطة</span></div>" +
      "<h2>" + esc(head) + "</h2>" +
      '<div class="stats3">' +
        stat("أنجزت", fmtNum(p.done) + " ساعة") +
        stat("المفروض لحد النهارده", fmtNum(p.expected) + " ساعة") +
        stat(p.diff >= 0 ? "الفرق (لصالحك)" : "الفرق (عليك)", fmtNum(Math.abs(p.diff)) + " ساعة", p.diff >= 0 ? "pos" : "neg") +
      "</div>" +
      '<ul class="pace-lines">' +
        "<li>المفروض تكون دلوقتي في: <a href=\"#/book/" + p.expectedBook.key + "\">" + p.expectedBook.n + ". " + esc(p.expectedBook.title) + "</a></li>" +
        "<li>الانتهاء المخطط: <strong>" + esc(fmtDate(p.plannedEnd)) + "</strong>" +
          (p.projectedEnd ? " — بمعدلك الحالي: <strong>" + esc(fmtDate(p.projectedEnd)) + "</strong>" : ' — <span class="muted">التوقع بمعدلك بيظهر بعد أسبوع من البداية</span>') + "</li>";
    if (p.phase === "behind" && p.neededPerDay) {
      html += "<li class=\"hint\">عشان تلحق ميعادك: محتاج حوالي <strong>" + fmtNum(p.neededPerDay) + " ساعة دراسة يوميًا</strong> بدل " + fmtNum(s.hoursPerDay) +
        "، أو عدّل الخطة من <a href=\"#/settings\">الإعدادات</a>.</li>";
    }
    html += "</ul></section>";
    return html;
  }

  function stat(label, value, cls) {
    return '<div class="stat ' + (cls || "") + '"><span>' + esc(label) + "</span><strong>" + esc(value) + "</strong></div>";
  }

  function logCard() {
    var L = logStats();
    var max = 0;
    L.days.forEach(function (d) { if (d.m > max) max = d.m; });
    var dayTarget = state.settings.hoursPerDay * 60;
    var scale = Math.max(max, dayTarget) || 1;
    var bars = L.days.map(function (d) {
      var h = d.m ? Math.max(6, d.m / scale * 100) : 0;
      var dd = parseDate(d.d);
      return '<div class="col' + (d.d === todayStr() ? " is-today" : "") + '" title="' + esc(fmtDate(dd) + ": " + fmtMinutes(d.m)) + '">' +
        '<span class="fill' + (d.m >= dayTarget ? " ok" : "") + '" style="height:' + h.toFixed(0) + '%"></span>' +
        "<em>" + dd.getDate() + "</em></div>";
    }).join("");
    var targetLine = (dayTarget / scale * 100).toFixed(0);
    var weekPct = L.target ? L.week / L.target * 100 : 0;
    var book = ui.logBook != null ? ui.logBook : defaultLogBook();

    return '<section class="card log">' +
      '<div class="card-head"><h3>سجل الدراسة</h3>' +
        (L.streak ? '<span class="streak">🔥 ' + L.streak + " يوم ورا بعض</span>" : "") + "</div>" +
      '<div class="log-today"><div><span class="muted">النهارده</span><strong>' + fmtMinutes(L.today) + "</strong>" +
        '<span class="muted"> من ' + fmtMinutes(dayTarget) + "</span></div>" +
        bar(L.today / dayTarget * 100, "thin") + "</div>" +
      '<label class="field-inline">ذاكرت إيه؟<select id="log-book">' + bookOptions(book) + "</select></label>" +
      '<div class="quick">' +
        '<button class="btn chip" data-log="15">+15 د</button>' +
        '<button class="btn chip" data-log="30">+30 د</button>' +
        '<button class="btn chip" data-log="60">+1 ساعة</button>' +
        '<button class="btn chip" data-log="120">+2 ساعة</button>' +
        '<button class="btn chip ghost" data-log-undo>تراجع</button>' +
      "</div>" +
      '<div class="week"><span>آخر 7 أيام: <strong>' + fmtMinutes(L.week) + "</strong> من " + fmtMinutes(L.target) + "</span>" + bar(weekPct, "thin") + "</div>" +
      '<div class="spark" aria-label="آخر 14 يوم"><i class="target" style="bottom:' + targetLine + '%"></i>' + bars + "</div>" +
      '<p class="muted small">السجل بيقيس وقتك، ونسبة الإنجاز في كل كتاب بتقيس تقدمك. الوتيرة فوق بتتحسب من نسبة الإنجاز.</p>' +
      "</section>";
  }

  function overviewCard() {
    var t = totals();
    var pct = t.total ? t.done / t.total * 100 : 0;
    var html = '<section class="card overview"><div class="card-head"><h3>الإنجاز الكلي</h3><strong class="big">' + fmtNum(pct) + "%</strong></div>" +
      bar(pct) + '<div class="levels">';
    PLAN.levels.forEach(function (l) {
      var lv = t.levels[l.id];
      var lp = lv.total ? lv.done / lv.total * 100 : 0;
      html += '<a class="lvl lv-' + l.id + '" href="#level-' + l.id + '" data-jump="level-' + l.id + '">' +
        '<div class="lvl-head"><span>' + esc(l.name) + "</span><span>" + fmtNum(lp) + "%</span></div>" +
        bar(lp, "lv") + '<small class="muted">' + lv.finished + " من " + lv.count + " كتاب · " + fmtNum(lv.total, 0) + " ساعة</small></a>";
    });
    return html + "</div></section>";
  }

  function currentCard() {
    var doing = BOOKS.filter(function (b) { return peekBook(b.key).status === "doing"; });
    if (!doing.length) return "";
    return '<section class="card current"><div class="card-head"><h3>شغال فيه دلوقتي</h3></div><div class="current-list">' +
      doing.map(function (b) {
        var st = peekBook(b.key);
        return '<a class="current-item" href="#/book/' + b.key + '"><span class="num">' + b.n + "</span>" +
          '<span class="t">' + esc(b.title) + "</span>" + bar(st.pct, "thin") + '<span class="p">' + st.pct + "%</span></a>";
      }).join("") + "</div></section>";
  }

  function bookCard(b) {
    var st = peekBook(b.key);
    var sums = summariesFor(b).length;
    return '<a class="book ' + STATUS[st.status].cls + '" href="#/book/' + b.key + '">' +
      '<span class="num">' + b.n + "</span>" +
      '<div class="book-body">' +
        '<div class="book-title">' + esc(b.title) + (b.finish ? ' <span class="finish" title="خط النهاية للعلم ده">✅</span>' : "") + "</div>" +
        '<div class="book-meta">' + esc(b.science) + " · " + fmtHours(b.hours) +
          (sums ? ' · <span class="sums">📄 ' + sums + " ملخص</span>" : "") + "</div>" +
        (st.pct > 0 && st.pct < 100 ? bar(st.pct, "thin") : "") +
      "</div>" +
      '<div class="book-side">' + statusPill(st.status) + (st.pct > 0 && st.pct < 100 ? "<small>" + st.pct + "%</small>" : "") + "</div>" +
      "</a>";
  }

  function booksSection() {
    var q = ui.q.trim();
    var html = '<section class="books-section">' +
      '<div class="filters">' +
        '<input type="search" id="q" placeholder="دوّر على كتاب أو علم…" value="' + esc(ui.q) + '">' +
        '<div class="seg" role="group">' +
          segBtn("all", "الكل") + segBtn("doing", "جارٍ") + segBtn("todo", "لم يبدأ") + segBtn("done", "تم") +
        "</div></div>";
    var any = false;
    PLAN.levels.forEach(function (l) {
      var list = BOOKS.filter(function (b) {
        if (b.level !== l.id) return false;
        var st = peekBook(b.key).status;
        if (ui.filter !== "all" && st !== ui.filter) return false;
        if (q && (b.title + " " + b.science + " " + b.track).indexOf(q) === -1) return false;
        return true;
      });
      if (!list.length) return;
      any = true;
      html += '<div class="level-block" id="level-' + l.id + '"><h3 class="level-title lv-' + l.id + '">' + esc(l.name) +
        ' <small>' + esc(l.desc) + "</small></h3>" + list.map(bookCard).join("") + "</div>";
    });
    if (!any) html += '<p class="empty">مفيش كتب بالفلتر ده.</p>';
    return html + "</section>";
  }

  function segBtn(id, label) {
    return '<button type="button" class="' + (ui.filter === id ? "active" : "") + '" data-filter="' + id + '">' + label + "</button>";
  }

  function renderHome() {
    discover(false);
    return paceCard() + '<div class="grid2">' + logCard() + overviewCard() + "</div>" + currentCard() + booksSection();
  }

  /* ---------------- صفحة الكتاب ---------------- */
  function renderBook(key) {
    var b = BOOK_BY_KEY[key];
    if (!b) return '<p class="empty">الكتاب ده مش موجود. <a href="#/">ارجع للرئيسية</a></p>';
    discover(false);
    var st = peekBook(key);
    var idx = BOOKS.indexOf(b);
    var prev = BOOKS[idx - 1], next = BOOKS[idx + 1];
    var minutes = bookMinutes(key);
    var days = b.hours != null ? Math.ceil(b.hours * state.settings.realism / state.settings.hoursPerDay) : null;
    var sums = summariesFor(b);

    var html = '<a class="back" href="#/">→ رجوع للخطة</a>' +
      '<section class="card book-head">' +
        '<div class="row">' + levelPill(b.level) + '<span class="muted">كتاب ' + b.n + " من " + BOOKS.length + "</span>" +
          (b.finish ? '<span class="pill finish-pill">✅ خط النهاية لعلم ' + esc(b.science) + "</span>" : "") + "</div>" +
        "<h1>" + esc(b.title) + "</h1>" +
        '<div class="meta-grid">' +
          meta("العلم", b.science) + meta("المسار", b.track) +
          meta("الساعات التقديرية", fmtHours(b.hours)) +
          meta("المدة بمعدلك", days != null ? "حوالي " + days + " يوم" : "مرجع مستمر") +
        "</div>" +
        (b.note ? '<p class="note">💡 ' + esc(b.note) + "</p>" : "") +
        (b.alt ? '<p class="alt"><span>البديل / المرحلة الأعلى:</span> ' + esc(b.alt) + "</p>" : "") +
      "</section>";

    // التقدم
    html += '<section class="card progress-card"><div class="card-head"><h3>تقدمك في الكتاب</h3>' + statusPill(st.status) + "</div>" +
      '<div class="seg big" role="group">' +
        ["todo", "doing", "done"].map(function (s) {
          return '<button type="button" data-status="' + s + '" class="' + (st.status === s ? "active" : "") + '">' + STATUS[s].label + "</button>";
        }).join("") + "</div>" +
      '<div class="pct-row"><input type="range" id="pct" min="0" max="100" step="5" value="' + st.pct + '" aria-label="نسبة الإنجاز">' +
        '<output id="pct-out">' + st.pct + "%</output></div>" +
      '<div class="dates"><span>البداية: <strong>' + esc(fmtDate(st.start)) + "</strong></span><span>الانتهاء: <strong>" + esc(fmtDate(st.end)) + "</strong></span></div>" +
      "</section>";

    // الوقت
    var est = b.hours != null ? b.hours * st.pct / 100 * state.settings.realism : null;
    html += '<section class="card"><div class="card-head"><h3>وقتك على الكتاب</h3><strong>' + fmtMinutes(minutes) + "</strong></div>" +
      '<div class="quick">' +
        '<button class="btn chip" data-log="15" data-book="' + key + '">+15 د</button>' +
        '<button class="btn chip" data-log="30" data-book="' + key + '">+30 د</button>' +
        '<button class="btn chip" data-log="60" data-book="' + key + '">+1 ساعة</button>' +
        '<button class="btn chip" data-log="120" data-book="' + key + '">+2 ساعة</button>' +
        '<button class="btn chip ghost" data-log-undo data-book="' + key + '">تراجع</button>' +
      "</div>" +
      (est && minutes ? '<p class="muted small">' + timeVerdict(minutes / 60, est) + "</p>" : "") +
      "</section>";

    // الملخصات
    html += '<section class="card summaries"><div class="card-head"><h3>الملخصات</h3>' +
      '<button class="btn chip ghost" data-refresh>' + (tree.loading ? "بيحدّث…" : "↻ تحديث") + "</button></div>";
    if (sums.length) {
      html += '<ol class="sum-list">' + sums.map(function (s) {
        return '<li><a href="' + esc(summaryHref(s)) + '" target="_blank" rel="noopener">' +
          '<span class="sn">' + (s.n != null ? pad(s.n) : "•") + "</span>" +
          '<span class="st">' + esc(s.title) + "</span>" +
          '<span class="se">' + esc(s.ext.toUpperCase()) + "</span></a></li>";
      }).join("") + "</ol>";
    } else {
      html += '<div class="empty-sum"><p>لسه مفيش ملخصات للكتاب ده.</p>' +
        "<p class=\"muted small\">الملخص بيتعمل بآلية عمل المحاضرات (ملف HTML لكل درس)، ويترفع في فولدر الكتاب باسم رقم الدرس، زي <code>01.html</code> أو <code>01-باب-الكلام.html</code>، وهيظهر هنا لوحده.</p></div>";
    }
    if (tree.error && tree.error !== "local") {
      html += '<p class="muted small">⚠️ ماقدرتش أقرا الفولدر من GitHub دلوقتي (' + (tree.error === "rate" ? "تخطيت حد الطلبات، جرب بعد شوية" : "مشكلة اتصال") + ").</p>";
    }
    html += '<div class="row gap">' +
      '<a class="btn" href="' + esc(uploadHref(b)) + '" target="_blank" rel="noopener">⬆️ ارفع ملخص</a>' +
      '<a class="btn ghost" href="' + esc(folderHref(b)) + '" target="_blank" rel="noopener">افتح الفولدر</a>' +
      '<code class="path">' + esc(b.folder) + "/</code></div></section>";

    // ملاحظاتي
    html += '<section class="card"><div class="card-head"><h3>ملاحظاتي</h3><span class="muted small" id="notes-saved"></span></div>' +
      '<textarea id="notes" rows="5" placeholder="الشرح اللي بتسمعه، الشيخ، صفحات وقفت عندها، أسئلة…">' + esc(st.notes) + "</textarea></section>";

    // التنقل
    html += '<nav class="pager">' +
      (prev ? '<a href="#/book/' + prev.key + '">→ ' + prev.n + ". " + esc(prev.title) + "</a>" : "<span></span>") +
      (next ? '<a href="#/book/' + next.key + '">' + next.n + ". " + esc(next.title) + " ←</a>" : "<span></span>") +
      "</nav>";
    return html;
  }

  function meta(label, value) {
    return '<div><span>' + esc(label) + "</span><strong>" + esc(value) + "</strong></div>";
  }

  function timeVerdict(spentH, estH) {
    var r = spentH / estH;
    if (r > 1.3) return "الكتاب واخد منك وقت أكتر من التقدير بحوالي " + Math.round((r - 1) * 100) + "% — طبيعي في الكتب الصعبة، بس راجع طريقة المذاكرة لو الفرق كبير.";
    if (r < 0.7) return "بتنجز الكتاب أسرع من التقدير — تأكد إن الفهم والمراجعة مش على حساب السرعة.";
    return "وقتك على الكتاب قريب من التقدير. 👌";
  }

  /* ---------------- الإعدادات ---------------- */
  function renderSettings() {
    var s = state.settings;
    var p = computePace();
    var user = window.MoadCloud && window.MoadCloud.user;
    return '<a class="back" href="#/">→ رجوع للخطة</a>' +
      '<section class="card"><h2>إعدادات الخطة</h2>' +
      '<form id="settings-form" class="form">' +
        '<label>تاريخ بداية الخطة<input type="date" name="startDate" value="' + esc(s.startDate) + '" required></label>' +
        '<label>ساعات الدراسة يوميًا<input type="number" name="hoursPerDay" min="0.25" max="16" step="0.25" value="' + s.hoursPerDay + '" required></label>' +
        '<label>معامل الواقعية<input type="number" name="realism" min="1" max="3" step="0.05" value="' + s.realism + '" required>' +
          '<small class="muted">كل ساعة دراسة بتنجز 1 ÷ المعامل من ساعات الكتاب، لأن فيه مراجعة وتوقفات. 1.3 يعني أسبوع إجازة كل حوالي 4 أسابيع.</small></label>' +
        '<button class="btn primary" type="submit">حفظ</button>' +
      "</form>" +
      '<p class="muted">بالإعدادات دي: الخطة ' + fmtNum(p.total, 0) + " ساعة، وتخلص في <strong>" + esc(fmtDate(p.plannedEnd)) + "</strong> (" + fmtSpan(p.plannedDays) + ").</p>" +
      "</section>" +
      '<section class="card"><h2>المزامنة</h2>' +
        (user ? "<p>داخل باسم <strong>" + esc(user.email) + "</strong> — تقدمك بيتزامن تلقائيًا.</p>"
              : "<p>التقدم محفوظ على الجهاز ده بس. ادخل بحسابك عشان يتزامن بين أجهزتك.</p>") +
        '<button class="btn" type="button" data-open-login>' + (user ? "إدارة الحساب" : "دخول / حساب جديد") + "</button>" +
      "</section>" +
      '<section class="card"><h2>نسخة احتياطية</h2>' +
        '<div class="row gap"><button class="btn" type="button" data-export>⬇️ تصدير JSON</button>' +
        '<label class="btn ghost file-btn">⬆️ استيراد<input type="file" accept="application/json,.json" id="import-file" hidden></label></div>' +
        '<p class="muted small">التصدير بيحفظ التقدم والسجل والملاحظات في ملف تقدر ترجعه في أي وقت.</p>' +
        '<button class="btn danger" type="button" data-reset>مسح كل التقدم</button>' +
      "</section>";
  }

  /* ---------------- الراوتر ---------------- */
  var app = document.getElementById("app");
  var lastRoute = null;

  function route() {
    var h = location.hash.replace(/^#/, "");
    if (h.indexOf("/book/") === 0) return { name: "book", key: decodeURIComponent(h.slice(6)) };
    if (h === "/settings") return { name: "settings" };
    return { name: "home" };
  }

  function render() {
    var r = route();
    var key = r.name + (r.key || "");
    var keepScroll = key === lastRoute;
    var y = window.scrollY;
    var focusId = document.activeElement && document.activeElement.id;
    var selStart = null;
    if (focusId === "q" && document.activeElement.selectionStart != null) selStart = document.activeElement.selectionStart;

    if (r.name === "book") app.innerHTML = renderBook(r.key);
    else if (r.name === "settings") app.innerHTML = renderSettings();
    else app.innerHTML = renderHome();

    document.querySelectorAll("[data-nav]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-nav") === (r.name === "settings" ? "settings" : "home"));
    });
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
    if (focusId === "q") {
      var q = document.getElementById("q");
      if (q) { q.focus(); if (selStart != null) q.setSelectionRange(selStart, selStart); }
    }
    lastRoute = key;
  }

  window.addEventListener("hashchange", render);

  /* ---------------- الأفعال ---------------- */
  function setStatus(key, s) {
    var st = bookState(key);
    st.status = s;
    if (s === "done") { st.pct = 100; st.end = st.end || todayStr(); st.start = st.start || todayStr(); }
    else if (s === "doing") { st.start = st.start || todayStr(); st.end = null; if (st.pct >= 100) st.pct = 95; }
    else { st.pct = 0; st.start = null; st.end = null; }
    persist();
  }

  function setPct(key, pct) {
    var st = bookState(key);
    st.pct = clamp(pct, 0, 100);
    if (st.pct >= 100) { st.status = "done"; st.end = st.end || todayStr(); st.start = st.start || todayStr(); }
    else if (st.pct > 0) { st.status = "doing"; st.start = st.start || todayStr(); st.end = null; }
    else if (st.status === "done") { st.status = "doing"; st.end = null; }
    persist();
  }

  function addLog(minutes, book) {
    state.log.push({ d: todayStr(), m: minutes, b: book || null });
    persist();
    toast("اتسجّل " + fmtMinutes(minutes) + (book ? " على «" + BOOK_BY_KEY[book].title + "»" : ""));
  }

  function undoLog(book) {
    var t = todayStr();
    for (var i = state.log.length - 1; i >= 0; i--) {
      var e = state.log[i];
      if (e.d === t && (!book || e.b === book)) {
        state.log.splice(i, 1);
        persist();
        toast("اتشال آخر تسجيل (" + fmtMinutes(e.m) + ")");
        return;
      }
    }
    toast("مفيش تسجيل النهارده تتراجع عنه");
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-status],[data-filter],[data-log],[data-log-undo],[data-refresh],[data-open-login],[data-export],[data-reset],[data-jump],#sync-chip,[data-close]");
    if (!el) return;
    var r = route();
    if (el.hasAttribute("data-status") && r.name === "book") setStatus(r.key, el.getAttribute("data-status"));
    else if (el.hasAttribute("data-filter")) { ui.filter = el.getAttribute("data-filter"); render(); }
    else if (el.hasAttribute("data-log")) {
      var bk = el.getAttribute("data-book");
      if (bk == null) { var sel = document.getElementById("log-book"); bk = sel ? sel.value : ""; ui.logBook = bk; }
      addLog(parseInt(el.getAttribute("data-log"), 10), bk || null);
    }
    else if (el.hasAttribute("data-log-undo")) undoLog(el.getAttribute("data-book"));
    else if (el.hasAttribute("data-refresh")) { discover(true); render(); }
    else if (el.hasAttribute("data-open-login") || el.id === "sync-chip") openLogin();
    else if (el.hasAttribute("data-close")) closeLogin();
    else if (el.hasAttribute("data-export")) exportData();
    else if (el.hasAttribute("data-reset")) {
      if (window.confirm("متأكد؟ هيتمسح كل التقدم والسجل والملاحظات (الإعدادات هتفضل).")) {
        var keep = state.settings; state = freshState(); state.settings = keep; persist(); toast("اتمسح التقدم");
      }
    }
    else if (el.hasAttribute("data-jump")) {
      e.preventDefault();
      var target = document.getElementById(el.getAttribute("data-jump"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target.id === "q") { ui.q = e.target.value; render(); }
    else if (e.target.id === "pct") { document.getElementById("pct-out").textContent = e.target.value + "%"; }
    else if (e.target.id === "notes") {
      var r = route();
      if (r.name !== "book") return;
      bookState(r.key).notes = e.target.value;
      clearTimeout(notesTimer);
      notesTimer = setTimeout(function () {
        persist({ render: false });
        var s = document.getElementById("notes-saved");
        if (s) s.textContent = "اتحفظ ✓";
      }, 600);
    }
  });
  var notesTimer;

  document.addEventListener("change", function (e) {
    var r = route();
    if (e.target.id === "pct" && r.name === "book") setPct(r.key, parseInt(e.target.value, 10));
    else if (e.target.id === "log-book") ui.logBook = e.target.value;
    else if (e.target.id === "import-file") importData(e.target.files[0]);
  });

  document.addEventListener("submit", function (e) {
    if (e.target.id === "settings-form") {
      e.preventDefault();
      var f = new FormData(e.target);
      var h = parseFloat(f.get("hoursPerDay")), rr = parseFloat(f.get("realism"));
      if (!parseDate(f.get("startDate")) || !(h > 0) || !(rr >= 1)) { toast("راجع القيم"); return; }
      state.settings = { startDate: f.get("startDate"), hoursPerDay: h, realism: rr };
      persist(); toast("اتحفظت الإعدادات");
    } else if (e.target.id === "login-form") {
      e.preventDefault();
      doLogin(new FormData(e.target));
    }
  });

  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "moad-shr3ia-" + todayStr() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function importData(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!data || !data.books) throw new Error("bad");
        state = normalize(data);
        persist(); toast("اترجعت النسخة الاحتياطية");
      } catch (err) { toast("الملف ده مش نسخة احتياطية صالحة"); }
    };
    reader.readAsText(file);
  }

  /* ---------------- المزامنة ---------------- */
  var loginMode = "in";
  var modal = document.getElementById("login-modal");

  function openLogin() {
    if (!window.MoadCloud) { toast("المزامنة لسه بتحمّل أو مفيش إنترنت"); return; }
    refreshLoginUI();
    modal.hidden = false;
  }
  function closeLogin() { modal.hidden = true; }
  modal.addEventListener("click", function (e) { if (e.target === modal) closeLogin(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeLogin(); });

  modal.querySelectorAll(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      loginMode = t.getAttribute("data-mode");
      modal.querySelectorAll(".tab").forEach(function (x) { x.classList.toggle("active", x === t); });
      document.getElementById("login-submit").textContent = loginMode === "in" ? "دخول" : "إنشاء حساب";
    });
  });
  document.getElementById("logout-btn").addEventListener("click", function () {
    window.MoadCloud.signOut().then(function () { toast("اتسجل الخروج — التقدم فاضل محفوظ على الجهاز"); refreshLoginUI(); });
  });

  function refreshLoginUI() {
    var user = window.MoadCloud && window.MoadCloud.user;
    document.getElementById("login-form").hidden = !!user;
    modal.querySelector(".tabs").hidden = !!user;
    document.getElementById("login-signed").hidden = !user;
    if (user) document.getElementById("login-email").textContent = user.email;
  }

  function doLogin(f) {
    var err = document.getElementById("login-error");
    err.hidden = true;
    var fn = loginMode === "in" ? window.MoadCloud.signIn : window.MoadCloud.signUp;
    fn(String(f.get("email")).trim(), String(f.get("password")))
      .then(function () { closeLogin(); toast("أهلًا! بيتزامن دلوقتي…"); })
      .catch(function (e2) { err.textContent = e2.message; err.hidden = false; });
  }

  function syncFromCloud() {
    if (!window.MoadCloud || !window.MoadCloud.user) return;
    window.MoadCloud.load().then(function (cloud) {
      if (!cloud || !cloud.state) { if (state.ts) window.MoadCloud.save(state, state.ts); return; }
      var cloudTs = +cloud.ts || 0;
      if (cloudTs > state.ts) {
        state = normalize(cloud.state);
        state.ts = cloudTs;
        try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
        render();
        toast("اتحدّث التقدم من السحابة");
      } else if (state.ts > cloudTs) {
        window.MoadCloud.save(state, state.ts);
      }
    }).catch(function () {});
  }

  function setChip(stateName, msg) {
    var chip = document.getElementById("sync-chip");
    var labels = { off: "محلي", ok: "متزامن", saving: "بيحفظ…", error: "خطأ مزامنة" };
    chip.className = "sync-chip is-" + stateName;
    chip.querySelector(".label").textContent = labels[stateName] || "محلي";
    chip.title = msg || (stateName === "off" ? "التقدم محفوظ على الجهاز ده بس — اضغط للدخول" : "المزامنة السحابية");
  }

  window.addEventListener("moad-auth", function (e) {
    setChip(e.detail.user ? "ok" : "off");
    if (e.detail.user) syncFromCloud();
    if (!modal.hidden) refreshLoginUI();
    if (route().name === "settings") render();
  });
  window.addEventListener("moad-cloud-status", function (e) {
    setChip(e.detail.state, e.detail.message);
    if (e.detail.state === "error" && e.detail.message) toast(e.detail.message);
  });
  window.addEventListener("focus", syncFromCloud);

  render();
})();
