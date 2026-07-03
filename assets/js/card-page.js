(function () {
  var dataNode = document.getElementById("card-data");
  if (!dataNode) {
    document.body.innerHTML = '<main class="wrap" style="padding:80px 0"><p>缺少牌面数据。</p></main>';
    return;
  }

  var card = JSON.parse(dataNode.textContent);
  document.title = card.title + " · " + card.enTitle.toUpperCase() + " — 塔罗牌深度专题";
  document.body.innerHTML = renderPage(card);
  initPage();

  function renderPage(c) {
    return [
      renderTopbar(c),
      renderHero(c),
      renderNarrative(c),
      renderFacts(c),
      renderSymbols(c),
      renderNumerology(c),
      renderReading(c),
      renderSpread(c),
      renderFooter(c)
    ].join("");
  }

  function renderTopbar(c) {
    return '<div class="topbar"><div class="topbar-inner">' +
      '<div class="mark"><b>' + esc(c.roman) + '</b> &nbsp;' + esc(c.title) + " · " + esc(c.enTitle.toUpperCase()) + "</div>" +
      '<nav class="tnav">' +
      '<a href="#hero">卷首</a><a href="#narrative">牌面叙事</a><a href="#facts">牌面要素</a>' +
      '<a href="#symbols">象征图谱</a><a href="#numerology">塔罗灵数</a><a href="#reading">正逆位解读</a><a href="#spread">牌阵示意</a>' +
      "</nav></div></div>";
  }

  function renderHero(c) {
    return '<header class="hero" id="hero"><div class="wrap hero-grid">' +
      '<figure class="hero-figure">' + plate(c.images.main) +
      '<figcaption class="plate-cap">PLATE I · ' + esc(c.enTitle.toUpperCase()) + " · 大阿尔卡那第" + esc(c.roman) + "号</figcaption></figure>" +
      '<div class="hero-text"><div class="hero-num">' + esc(c.roman) + "<small>" + esc(c.arcanum) + "</small></div>" +
      "<h1>" + esc(c.title) + '<span class="en">' + esc(c.enTitle) + "</span></h1>" +
      '<div class="hero-keywords">' + c.heroKeywords.map(function (k) {
        return "<div>" + esc(k.zh) + "<span>" + esc(k.en || "KEYNOTE") + "</span></div>";
      }).join("") + "</div>" +
      '<p class="hero-lede">' + esc(c.heroLede) + "</p>" +
      '<a href="../../index.html" class="back-btn">← 返回大厅 / 选择其它卡牌</a>' +
      "</div></div></header>";
  }

  function renderNarrative(c) {
    return chapter("narrative", "— 壹 · NARRATIVE", '牌面叙事<span class="en">The Image Speaks</span>',
      '<div class="prose drop">' + c.narrativeHtml + "</div>");
  }

  function renderFacts(c) {
    var facts = c.facts.map(function (f) {
      return "<dl><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "<small>" + esc(f.detail) + "</small></dd></dl>";
    }).join("");
    return chapter("facts", "— 貳 · CORRESPONDENCES", '对应要素<span class="en">Esoteric Correspondences</span>',
      '<div class="facts">' + facts + "</div>" +
      '<figure class="element-figure" style="margin:48px auto 0;max-width:min(860px,100%)">' + plate(c.images.elements) +
      '<figcaption class="plate-cap">PLATE III · 对应要素 · ' + esc(c.title) + "的神秘学要素汇览</figcaption></figure>");
  }

  function renderSymbols(c) {
    var symbols = c.symbols.map(function (s, index) {
      var n = String(index + 1).padStart(2, "0");
      return '<div class="symbol-item" data-id="' + n + '"><div class="sym-no">' + n + '</div><div class="sym-body">' +
        "<h4>" + esc(s.name) + "</h4><p>" + esc(s.meaning) + "</p></div></div>";
    }).join("");
    return chapter("symbols", "— 叁 · ICONOGRAPHY", '象征要素图谱<span class="en">A Glossary of Symbols</span>',
      '<div class="symbol-layout"><figure class="symbol-figure">' + plate(c.images.symbols) +
      '<figcaption class="plate-cap">PLATE II · 象征细节 · ' + esc(c.title) + "牌面图像注解</figcaption></figure>" +
      '<div class="symbol-list">' + symbols + "</div></div>");
  }

  function renderNumerology(c) {
    return chapter("numerology", "— 肆 · NUMEROLOGY", '塔罗灵数<span class="en">The Number ' + esc(c.roman) + "</span>",
      '<div class="numero"><div class="bignum">' + esc(c.roman) + "<small>" + esc(c.enTitle) + "</small></div>" +
      '<div class="numero-text"><div class="numero-keys">' + c.coreThemes.map(function (k) {
        return "<span>" + esc(k) + "</span>";
      }).join("") + "</div>" + c.numerologyHtml + "</div></div>");
  }

  function renderReading(c) {
    return chapter("reading", "— 伍 · DIVINATORY MEANING", '正逆位解读<span class="en">Upright &amp; Reversed</span>',
      (c.readingFocusHtml ? '<div class="reading-intro">' + c.readingFocusHtml + "</div>" : "") +
      '<div class="pos-switch-wrapper"><div class="pos-switch" role="tablist">' +
      '<button class="on" data-pos="up" role="tab" aria-selected="true">正位<span class="en">Upright</span></button>' +
      '<button data-pos="rev" role="tab" aria-selected="false">逆位<span class="en">Reversed</span></button>' +
      "</div></div>" +
      '<div class="pos-panel-container">' +
      renderPanel(c, c.upright, "up", false) +
      renderPanel(c, c.reversed, "rev", true) +
      "</div>");
  }

  function renderPanel(cardData, pos, id, reversed) {
    var classes = "pos-panel" + (id === "up" ? " show" : "");
    var dimClasses = "dim" + (reversed ? " reversed" : "");
    var image = id === "up" ? cardData.images.upright : cardData.images.reversed;
    return '<div class="' + classes + '" id="panel-' + id + '">' +
      '<figure class="pos-figure" style="margin:0 auto 46px;max-width:min(860px,100%)">' + plate(image) +
      '<figcaption class="plate-cap">PLATE ' + (id === "up" ? "V" : "VI") + " · " + (id === "up" ? "正位" : "逆位") + "意象 · " + esc(cardData.title) + "能量" + (id === "up" ? "顺势显现" : "失衡显影") + "</figcaption></figure>" +
      '<div class="keyword-strip" aria-label="' + esc(cardData.title) + (id === "up" ? "正位" : "逆位") + '关键词">' +
      pos.keywords.slice(0, 14).map(function (k) { return "<span>" + esc(k) + "</span>"; }).join("") + "</div>" +
      '<div class="reading-intro">' + pos.introHtml + "</div>" +
      '<div class="pos-summary"><div class="kw"><span class="lab">核心关键词</span><p>' + esc(pos.keywords.join("，")) + "</p></div>" +
      '<div class="kw"><span class="lab">能量基调</span><p>' + esc(cardData.energy) + "</p></div></div>" +
      '<div class="dim-grid">' + pos.dimensions.map(function (d) {
        return '<div class="' + dimClasses + '"><div class="dim-head"><span class="ic">' + esc(d.icon) + "</span><h4>" + esc(d.title) +
          '</h4><span class="en">' + esc(d.en) + "</span></div>" + d.html + "</div>";
      }).join("") + "</div>" +
      (pos.otherHtml ? '<div class="dim-extra"><span class="lab">其它牌意 · Other</span>' + pos.otherHtml + "</div>" : "") +
      "</div>";
  }

  function renderSpread(c) {
    var labels = [
      ["I", "Past · 过去"],
      ["II", "Present · 现在"],
      ["III", "Future · 未来"]
    ];
    var cards = c.spread.map(function (s, index) {
      var label = labels[index];
      return '<div class="spread-card-wrapper" role="button" tabindex="0" aria-pressed="false">' +
        '<div class="spread-card-back"><div class="back-pattern"><span>' + label[0] + '</span>' +
        '<span style="font-size:16px; font-family:var(--sans); letter-spacing:0.1em;">' + label[1].split(" · ")[1] + " · " + label[1].split(" · ")[0].toUpperCase() + "</span></div>" +
        '<div class="click-to-reveal">点击翻牌</div></div>' +
        '<div class="spread-card-front"><div class="pos-no">' + label[0] + '</div><span class="en">' + label[1] + "</span>" +
        "<h4>" + esc(s.title) + "</h4><p>" + esc(s.text) + "</p></div></div>";
    }).join("");
    return chapter("spread", "— 陆 · THE SPREAD", '三牌阵示意<span class="en">Past · Present · Future</span>',
      '<figure class="spread-figure" style="margin:0 auto 46px;max-width:min(960px,100%)">' + plate(c.images.spread) +
      '<figcaption class="plate-cap">PLATE VII · 三牌阵 · 观察' + esc(c.title) + "如何在时间中展开</figcaption></figure>" +
      '<div class="prose" style="max-width:60ch;margin-bottom:38px"><p>当' + esc(c.title) + "出现在三牌阵中，过去、现在与未来会显示这股能量如何被孕育、显现并走向结果。点击下方卡牌揭示隐秘启示。</p></div>" +
      '<div class="spread">' + cards + "</div>");
  }

  function renderFooter(c) {
    return '<footer><div class="wrap"><hr class="rule-gold" style="margin-bottom:40px">' +
      '<p class="ornament">✦ ❖ ✦</p><p>ARCANUM ' + esc(c.roman) + " · " + esc(c.enTitle.toUpperCase()) + " · " + esc(c.footerMeta) +
      '</p><p class="zh">「观牌如观画，读意如读经。」</p></div></footer>';
  }

  function chapter(id, idx, title, body) {
    return '<section class="chapter reveal" id="' + id + '"><div class="wrap"><div class="chapter-head">' +
      '<div class="idx">' + idx + "</div><h2>" + title + "</h2></div>" + body + "</div></section>";
  }

  function plate(image) {
    return '<div class="plate"><img src="' + attr(image.src) + '" alt="' + attr(image.alt) + '" data-fallback="' + attr(image.fallback) + '"></div>';
  }

  function initPage() {
    initImageFallbacks();
    initReveal();
    initTabs();
    initSymbols();
    initSpreadCards();
    initTopbar();
  }

  function initImageFallbacks() {
    document.querySelectorAll("img[data-fallback]").forEach(function (img) {
      img.addEventListener("error", function () { showImageFallback(img); });
      if (img.complete && img.naturalWidth === 0) showImageFallback(img);
    });
  }

  function showImageFallback(img) {
    var fallback = document.createElement("div");
    fallback.className = "imgfallback";
    fallback.textContent = img.dataset.fallback || "PLATE · 图像待上传";
    fallback.style.whiteSpace = "pre-line";
    img.replaceWith(fallback);
  }

  function initReveal() {
    var revealElems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealElems.forEach(function (el) { observer.observe(el); });
    } else {
      revealElems.forEach(function (el) { el.classList.add("active"); });
    }
  }

  function initTabs() {
    var btns = document.querySelectorAll(".pos-switch button");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pos = btn.dataset.pos;
        btns.forEach(function (b) {
          b.classList.toggle("on", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        document.querySelectorAll(".pos-panel").forEach(function (panel) {
          panel.classList.toggle("show", panel.id === "panel-" + pos);
        });
      });
    });
  }

  function initSymbols() {
    var items = document.querySelectorAll(".symbol-item");
    items.forEach(function (item) {
      item.addEventListener("click", function () {
        items.forEach(function (x) { x.classList.remove("highlight"); });
        item.classList.add("highlight");
      });
    });
  }

  function initSpreadCards() {
    document.querySelectorAll(".spread-card-wrapper").forEach(function (cardNode) {
      function flip() {
        cardNode.classList.toggle("flipped");
        cardNode.setAttribute("aria-pressed", String(cardNode.classList.contains("flipped")));
      }
      cardNode.addEventListener("click", flip);
      cardNode.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          flip();
        }
      });
    });
  }

  function initTopbar() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".tnav a"));
    var secs = links.map(function (l) { return document.querySelector(l.getAttribute("href")); });
    var topbar = document.querySelector(".topbar");
    var lastScrollY = window.scrollY;

    function onScroll() {
      var y = window.scrollY + 120;
      var active = -1;
      secs.forEach(function (section, index) {
        if (section && section.offsetTop <= y) active = index;
      });
      links.forEach(function (link, index) {
        link.classList.toggle("active", index === active);
      });
    }

    window.addEventListener("scroll", function () {
      var currentScrollY = window.scrollY;
      topbar.style.transform = currentScrollY > lastScrollY && currentScrollY > 150 ? "translateY(-100%)" : "translateY(0)";
      lastScrollY = currentScrollY;
      onScroll();
    }, { passive: true });
    onScroll();
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function attr(value) {
    return esc(value).replace(/`/g, "&#96;");
  }
})();
