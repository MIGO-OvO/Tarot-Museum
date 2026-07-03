import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docDir = path.join(root, "docs", "major");
const pageDir = path.join(root, "cards", "major");

const romans = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
const arcanum = [
  "Arcanum Nullum",
  "Arcanum Primum",
  "Arcanum Secundum",
  "Arcanum Tertium",
  "Arcanum Quartum",
  "Arcanum Quintum",
  "Arcanum Sextum",
  "Arcanum Septimum",
  "Arcanum Octavum",
  "Arcanum Nonum",
  "Arcanum Decimum",
  "Arcanum Undecimum",
  "Arcanum Duodecimum",
  "Arcanum Tertium Decimum",
  "Arcanum Quartum Decimum",
  "Arcanum Quintum Decimum",
  "Arcanum Sextum Decimum",
  "Arcanum Septimum Decimum",
  "Arcanum Duodevicesimum",
  "Arcanum Undevicesimum",
  "Arcanum Vicesimum",
  "Arcanum Vicesimum Primum"
];

for (const file of fs.readdirSync(docDir).filter((name) => name.endsWith(".md")).sort()) {
  const card = parseCard(file);
  fs.writeFileSync(path.join(pageDir, `${card.slug}.html`), renderWrapper(card));
  console.log(`built cards/major/${card.slug}.html`);
}

function parseCard(file) {
  const slug = file.replace(/\.md$/, "");
  const number = Number(slug.slice(0, 2));
  const source = fs.readFileSync(path.join(docDir, file), "utf8").replace(/\r\n?/g, "\n");
  const existing = readExistingPage(slug);
  const split = splitByH2(source.split("\n"));
  const basics = parseBasics(findSection(split.sections, /基础要素/)?.lines || []);
  const h1 = cleanHeading(split.pre.find((line) => line.startsWith("# ")) || "");
  const title = parseChineseName(basics["牌名"]) || h1;
  const enTitle = parseEnglishName(basics["牌名"]) || titleFromSlug(slug);
  const coreThemes = splitTerms(basics["核心主题"]).slice(0, 6);
  const introLines = split.pre.filter((line) => !line.startsWith("# "));
  const mainImage = findMarkdownImage(source) || `../../assets/images/major/${slug}/${slug.replace(/^\d+-/, "")}.png`;
  const upright = parsePosition(findSection(split.sections, /正位/), false);
  const reversed = parsePosition(findSection(split.sections, /逆位/), true);

  return {
    slug,
    title,
    enTitle,
    roman: romans[number],
    arcanum: arcanum[number],
    heroLede: existing.heroLede || firstParagraphText(introLines),
    heroKeywords: existing.heroKeywords.length ? existing.heroKeywords : coreThemes.slice(0, 4).map((zh) => ({ zh, en: "" })),
    coreThemes,
    facts: buildFacts(basics, coreThemes),
    footerMeta: [basics["元素"], basics["星座或行星"]].filter(Boolean).join(" · "),
    energy: [basics["元素"], coreThemes.join("、")].filter(Boolean).join(" · "),
    images: buildImages(title, slug, mainImage, existing.images),
    narrativeHtml: renderMarkdownBlocks(introLines),
    symbols: parseSymbols(findSection(split.sections, /牌面要素/)?.lines || []),
    numerologyHtml: renderMarkdownBlocks(findSection(split.sections, /塔罗灵数/)?.lines || []),
    readingFocusHtml: renderMarkdownBlocks(findSection(split.sections, /牌面解读重点/)?.lines || []),
    upright,
    reversed,
    spread: buildSpread(upright.situation)
  };
}

function splitByH2(lines) {
  const pre = [];
  const sections = [];
  let current = null;
  for (const line of lines) {
    if (/^## (?!#)/.test(line)) {
      current = { heading: cleanHeading(line), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    } else {
      pre.push(line);
    }
  }
  return { pre, sections };
}

function splitByH3(lines) {
  const pre = [];
  const sections = [];
  let current = null;
  for (const line of lines) {
    if (/^### /.test(line)) {
      current = { heading: cleanHeading(line), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    } else {
      pre.push(line);
    }
  }
  return { pre, sections };
}

function findSection(sections, pattern) {
  return sections.find((section) => pattern.test(section.heading));
}

function parseBasics(lines) {
  const basics = {};
  for (const line of lines) {
    const match = line.match(/^\s*\d+\.\s*([^：:]+)[：:]\s*(.+)$/);
    if (match) basics[match[1].trim()] = cleanText(match[2]);
  }
  return basics;
}

function parseSymbols(lines) {
  return lines
    .filter((line) => /^\s*\|/.test(line) && !/^\s*\|?\s*-+/.test(line))
    .map(splitTableRow)
    .filter((cells) => cells.length >= 2 && cells[0] !== "要素")
    .map((cells) => ({ name: cleanText(cells[0]), meaning: cleanText(cells[1]) }));
}

function parsePosition(section, reversed) {
  if (!section) return { keywords: [], introHtml: "", dimensions: [], otherHtml: "", situation: {} };
  const split = splitByH3(section.lines);
  const intro = [];
  let keywords = [];
  for (const line of split.pre) {
    const match = line.match(/^\*\*关键词\*\*[：:]\s*(.+)$/);
    if (match) keywords = splitTerms(match[1]);
    else intro.push(line);
  }

  let otherHtml = "";
  let situation = {};
  const dimensions = [];
  for (const sub of split.sections) {
    if (/情境/.test(sub.heading)) {
      situation = parseSituation(sub.lines);
    } else if (/其它|其他/.test(sub.heading)) {
      otherHtml = renderMarkdownBlocks(sub.lines);
    } else {
      const meta = dimensionMeta(sub.heading, reversed);
      dimensions.push({ ...meta, html: renderMarkdownBlocks(sub.lines) });
    }
  }

  return {
    keywords,
    introHtml: renderMarkdownBlocks(intro),
    dimensions,
    otherHtml,
    situation
  };
}

function parseSituation(lines) {
  const out = {};
  for (const line of lines) {
    const match = line.match(/^-\s*\*\*(.+?)\*\*[：:]\s*(.+)$/);
    if (match) out[cleanText(match[1])] = cleanText(match[2]);
  }
  return out;
}

function buildFacts(basics, coreThemes) {
  const rows = [
    ["元素 Element", basics["元素"]],
    ["星座 / 行星", basics["星座或行星"]],
    ["希伯来字母", basics["希伯来字母"]],
    ["核心主题", basics["核心主题"] || coreThemes.join("、")]
  ];

  return rows.map(([label, raw]) => {
    const text = cleanText(raw || "待补充");
    const value = firstFactChunk(text);
    return { label, value, detail: text === value ? "" : text };
  });
}

function buildImages(title, slug, main, existing) {
  const dir = main.replace(/\/[^/]+$/, "");
  const base = path.posix.basename(main, ".png");
  const image = (key, fallbackSuffix, label, plate) => {
    const src = existing[key] || `${dir}/${base}${fallbackSuffix}.png`;
    return {
      src,
      alt: `塔罗牌${title}${label}`,
      fallback: `${plate} — ${label || "主图"}待上传\n${src.replace(/^\.\.\//, "").replace(/^\.\.\//, "")}`
    };
  };

  return {
    main: image("main", "", "主图", "PLATE I"),
    symbols: image("symbols", "-symbols", "象征要素图", "PLATE II"),
    elements: image("elements", "-elements", "对应要素图", "PLATE III"),
    upright: image("upright", "-upright", "正位意象", "PLATE V"),
    reversed: image("reversed", "-reversed", "逆位意象", "PLATE VI"),
    spread: image("spread", "-spread", "三牌阵示意图", "PLATE VII")
  };
}

function buildSpread(situation) {
  return [
    { title: "过去", text: situation["过去"] || "过去的经验仍在影响这张牌此刻显现的方式。" },
    { title: "现在", text: situation["现在"] || "现在的处境正要求你看见这张牌的核心课题。" },
    { title: "未来", text: situation["未来"] || "未来的发展取决于你如何回应这股能量。" }
  ];
}

function renderMarkdownBlocks(lines) {
  const html = [];
  let paragraph = [];
  let list = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    html.push(`<p>${inline(paragraph.join(""))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (!list.length) return;
    html.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
    list = [];
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || /^!\[/.test(line) || /^#+ /.test(line) || /^\|/.test(line)) {
      flushParagraph();
      flushList();
      continue;
    }
    const item = line.match(/^-\s+(.+)$/);
    if (item) {
      flushParagraph();
      list.push(item[1]);
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return html.join("");
}

function renderWrapper(card) {
  const json = JSON.stringify(card, null, 2).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(card.title)} · ${escapeHtml(card.enTitle.toUpperCase())} — 塔罗牌深度专题</title>
<link rel="stylesheet" href="../../assets/css/card-page.css" />
<script type="application/json" id="card-data">${json}</script>
<script defer src="../../assets/js/card-page.js"></script>
</head>
<body>
<noscript><main class="wrap" style="padding:80px 0"><h1>${escapeHtml(card.title)}</h1><p>此页面使用共享模板渲染，请启用 JavaScript 阅读完整牌面解读。</p></main></noscript>
</body>
</html>
`;
}

function readExistingPage(slug) {
  const empty = { heroLede: "", heroKeywords: [], images: {} };
  const file = path.join(pageDir, `${slug}.html`);
  if (!fs.existsSync(file)) return empty;
  const html = fs.readFileSync(file, "utf8");
  const jsonMatch = html.match(/<script type="application\/json" id="card-data">([\s\S]*?)<\/script>/);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[1]);
    return {
      heroLede: data.heroLede || "",
      heroKeywords: data.heroKeywords || [],
      images: Object.fromEntries(Object.entries(data.images || {}).map(([key, value]) => [key, value.src]))
    };
  }

  const keywordStart = html.indexOf('class="hero-keywords"');
  const keywordHtml = keywordStart >= 0 ? html.slice(keywordStart, keywordStart + 1400) : "";
  const heroKeywords = [...keywordHtml.matchAll(/<div>([^<>]+)<span>([^<>]+)<\/span><\/div>/g)]
    .slice(0, 4)
    .map((match) => ({ zh: decodeHtml(match[1]), en: decodeHtml(match[2]) }));
  const heroLede = decodeHtml((html.match(/class="hero-lede">([\s\S]*?)<\/p>/) || [null, ""])[1].replace(/<[^>]+>/g, ""));

  return {
    heroLede,
    heroKeywords,
    images: {
      main: imageAfter(html, 'class="hero-figure"'),
      elements: imageAfter(html, 'class="element-figure"'),
      symbols: imageAfter(html, 'class="symbol-figure"'),
      upright: imageAfter(html, 'id="panel-up"'),
      reversed: imageAfter(html, 'id="panel-rev"'),
      spread: imageAfter(html, 'class="spread-figure"')
    }
  };
}

function imageAfter(html, marker) {
  const index = html.indexOf(marker);
  if (index < 0) return "";
  const match = html.slice(index, index + 3000).match(/<img[^>]+src="([^"]+)"/);
  return match ? decodeHtml(match[1]) : "";
}

function splitTableRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cleanText(cell));
}

function dimensionMeta(title) {
  if (/爱情|婚姻/.test(title)) return { title: "爱情 / 婚姻", en: "Love", icon: "❤" };
  if (/事业|学业|工作/.test(title)) return { title: "事业 / 学业", en: "Work", icon: "✦" };
  if (/人际|财富/.test(title)) return { title: "人际 / 财富", en: "Wealth", icon: "◈" };
  if (/健康|生活/.test(title)) return { title: "健康 / 生活", en: "Health", icon: "✚" };
  return { title: cleanText(title), en: "Reading", icon: "✦" };
}

function findMarkdownImage(source) {
  const match = source.match(/!\[[^\]]*]\(([^)]+)\)/);
  return match ? match[1] : "";
}

function firstParagraphText(lines) {
  const paragraph = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || /^!\[/.test(line)) {
      if (paragraph.length) break;
      continue;
    }
    paragraph.push(line);
  }
  return cleanText(paragraph.join(""));
}

function parseChineseName(raw) {
  if (!raw) return "";
  return cleanText(raw.split(/[（(]/)[0].replace(/[、/].*$/, ""));
}

function parseEnglishName(raw) {
  if (!raw) return "";
  const match = raw.match(/[（(]([A-Za-z][A-Za-z\s]+)[）)]/);
  return match ? match[1].trim() : "";
}

function titleFromSlug(slug) {
  return slug.replace(/^\d+-/, "").split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function firstFactChunk(text) {
  const cleaned = cleanText(text);
  const chunk = cleaned.split(/[（(]/)[0].split(/[、，,。；;]/)[0].trim();
  return chunk || cleaned;
}

function splitTerms(text) {
  return cleanText(text)
    .replace(/^关键词[：:]/, "")
    .split(/[、,，]/)
    .flatMap((part) => part.split(/与/))
    .map((part) => cleanText(part))
    .filter(Boolean);
}

function cleanHeading(line) {
  return cleanText(line.replace(/^#+\s*/, ""));
}

function cleanText(text) {
  return String(text || "").replace(/\u200c|\u200d|\uFEFF/g, "").replace(/\s+/g, " ").trim();
}

function inline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}
