import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = path.join(root, "docs", "minor");
const outputRoot = path.join(root, "cards", "minor");

const suits = {
  wands: { zh: "权杖", en: "Wands", element: "火", elementEn: "Fire", seal: "杖", start: 22 },
  cups: { zh: "圣杯", en: "Cups", element: "水", elementEn: "Water", seal: "杯", start: 36 },
  swords: { zh: "宝剑", en: "Swords", element: "风", elementEn: "Air", seal: "剑", start: 50 },
  pentacles: { zh: "星币", en: "Pentacles", element: "土", elementEn: "Earth", seal: "币", start: 64 },
};

const rankDisplays = ["A", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "PAGE", "KNIGHT", "QUEEN", "KING"];

const escapeHtml = (value = "") => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const inline = (value = "") => escapeHtml(value)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/`(.+?)`/g, "<code>$1</code>");

function extractSection(markdown, heading) {
  const marker = `## ${heading}`;
  const start = markdown.indexOf(marker);
  if (start < 0) throw new Error(`Missing section: ${heading}`);
  const bodyStart = markdown.indexOf("\n", start) + 1;
  const next = markdown.slice(bodyStart).search(/^##\s+/m);
  return (next < 0 ? markdown.slice(bodyStart) : markdown.slice(bodyStart, bodyStart + next)).trim();
}

function paragraphs(value) {
  return value.trim().split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
}

function parseFacts(value) {
  const facts = new Map();
  for (const line of value.split("\n")) {
    const match = line.match(/^\d+\.\s*([^：:]+)[：:]\s*(.+)$/);
    if (match) facts.set(match[1].trim(), match[2].trim());
  }
  return facts;
}

function parseTable(value) {
  return value.split("\n").slice(2).map((line) => {
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    return cells.length >= 2 ? { term: cells[0], meaning: cells[1] } : null;
  }).filter(Boolean);
}

function parseSubsections(value) {
  const parts = value.split(/^###\s+/m);
  const intro = parts.shift().trim();
  const sections = new Map();
  for (const part of parts) {
    const newline = part.indexOf("\n");
    const title = part.slice(0, newline).trim();
    sections.set(title, part.slice(newline + 1).trim());
  }
  return { intro, sections };
}

function parsePosition(value) {
  const { intro, sections } = parseSubsections(value);
  const keywordMatch = intro.match(/^\*\*关键词\*\*[：:]\s*(.+)$/m);
  if (!keywordMatch) throw new Error("Position section has no keyword line");
  const keywords = keywordMatch[1].split(/[，,]/).map((item) => item.trim()).filter(Boolean);
  return {
    keywords,
    intro: intro.replace(keywordMatch[0], "").trim(),
    sections,
  };
}

function renderBlocks(value, className = "") {
  const blocks = paragraphs(value);
  return blocks.map((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.every((line) => line.startsWith("- "))) {
      return `<ul class="annotated-list">${lines.map((line) => {
        const match = line.match(/^-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/);
        return match
          ? `<li><strong>${inline(match[1])}</strong><span>${inline(match[2])}</span></li>`
          : `<li><span>${inline(line.replace(/^-\s+/, ""))}</span></li>`;
      }).join("")}</ul>`;
    }
    return `<p${className ? ` class="${className}"` : ""}>${inline(lines.join(" "))}</p>`;
  }).join("\n");
}

function renderGuidance(value, positionLabel) {
  const rows = value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const match = line.match(/^-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/);
    return match ? `<div><dt>${inline(match[1])}</dt><dd>${inline(match[2])}</dd></div>` : "";
  }).join("");
  return `<details class="guidance"><summary>${positionLabel}情境指引 · Context Guide</summary><dl class="guidance-grid">${rows}</dl></details>`;
}

function renderPosition(card, parsed, key) {
  const isReversed = key === "rev";
  const label = isReversed ? "逆位" : "正位";
  const english = isReversed ? "Reversed" : "Upright";
  const dimensions = ["爱情/婚姻", "事业学业", "人际财富", "健康生活"];
  const dimensionHtml = dimensions.map((name) => `
    <article class="dimension">
      <h3>${inline(name)}</h3>
      ${renderBlocks(parsed.sections.get(name) || "")}
    </article>`).join("");
  const other = parsed.sections.get("其它牌意") || "";
  const guidance = parsed.sections.get("情境指引") || "";
  const capsules = parsed.keywords.slice(0, 15).map((keyword) => `<span>${inline(keyword)}</span>`).join("");
  const energy = `${card.suit.element}元素 · ${isReversed ? "能量受阻、内化或失衡" : "能量顺势流动并进入现实"}`;

  return `
  <div class="pos-panel${isReversed ? "" : " show"}" id="panel-${key}">
    <figure class="position-placeholder" aria-label="${card.title}${label}配图预留区">
      <span class="label">PLATE ${card.globalNumber} · ${english.toUpperCase()} · IMAGE RESERVED</span>
      <span class="position-mark">${card.suit.seal}</span>
      <p>${card.title}${label}配图将在后续视觉制作阶段补入，当前页面保留完整图版位置与说明结构。</p>
    </figure>
    <div class="keyword-strip" aria-label="${card.title}${label}关键词">${capsules}</div>
    <div class="reading-intro">${renderBlocks(parsed.intro)}</div>
    <div class="pos-summary">
      <div class="kw"><span class="lab">核心关键词</span><p>${inline(parsed.keywords.join("，"))}</p></div>
      <div class="kw"><span class="lab">能量基调</span><p>${inline(energy)}</p></div>
    </div>
    <div class="dimension-grid">${dimensionHtml}
    </div>
    <section class="other-note"><h3>其它牌意 · Other</h3>${renderBlocks(other)}</section>
    ${renderGuidance(guidance, label)}
  </div>`;
}

function relativeLink(fromCard, toCard) {
  return path.relative(path.dirname(fromCard.outputPath), toCard.outputPath).replaceAll(path.sep, "/");
}

function renderPage(card, previous, next) {
  const factOrder = ["数字编号", "核心主题", "元素", "星座或行星", "希伯来字母", "代表意义"];
  const facts = factOrder.map((name) => `<div class="fact"><dt>${inline(name)}</dt><dd>${inline(card.facts.get(name) || "未记录")}</dd></div>`).join("");
  const symbols = card.symbols.map((row) => `<div class="symbol-row"><dt>${inline(row.term)}</dt><dd>${inline(row.meaning)}</dd></div>`).join("");
  const heroParagraphs = card.heroParagraphs.map((text) => `<p>${inline(text)}</p>`).join("");
  const metaDescription = escapeHtml(card.heroParagraphs[0] || `${card.title}塔罗牌深度解读`);
  const prevLink = relativeLink(card, previous);
  const nextLink = relativeLink(card, next);

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${metaDescription}">
  <title>${card.title} · ${card.enName}｜阿卡纳手稿馆</title>
  <script>document.documentElement.classList.add("js")</script>
  <link rel="stylesheet" href="../../../assets/css/minor-card.css">
  <link rel="stylesheet" href="../../../assets/css/card-reading.css">
  <script src="../../../assets/js/minor-card.js" defer></script>
</head>
<body data-suit="${card.suitKey}">
  <header class="topbar">
    <div class="topbar-inner">
      <div class="mark"><b>${String(card.globalNumber).padStart(2, "0")}</b> · ${card.suit.zh} · ${card.suit.en.toUpperCase()}</div>
      <nav class="topnav" aria-label="页内导航">
        <a href="#hero">卷首</a><a href="#facts">对应要素</a><a href="#symbols">象征图谱</a><a href="#numerology">塔罗灵数</a><a href="#reading">正逆位解读</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero" id="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy reveal active">
          <div class="eyebrow">MINOR ARCANA · ${card.suit.en.toUpperCase()} · CARD ${String(card.rank).padStart(2, "0")}</div>
          <h1>${card.title}<span class="en">${card.enName}</span></h1>
          ${heroParagraphs}
          <div class="hero-meta"><span>${card.suit.element}元素 ${card.suit.elementEn}</span><span>${inline(card.facts.get("核心主题") || "")}</span><span>全牌序号 ${card.globalNumber}</span></div>
          <a class="back-link" href="../../../index.html">← 返回手稿馆大厅</a>
        </div>
        <figure class="manuscript-placeholder reveal active" aria-label="${card.title}主图预留区">
          <div class="placeholder-field"><span class="plate-number">PLATE ${String(card.globalNumber).padStart(2, "0")}</span><span class="suit-seal">${card.suit.seal}</span></div>
          <figcaption>${inline(card.plateDescription)}</figcaption>
        </figure>
      </div>
    </section>

    <section class="chapter reveal" id="facts"><div class="wrap">
      <header class="chapter-head"><div class="chapter-index">— 壹 · CORRESPONDENCES</div><h2>基础要素<span class="en">Card Correspondences</span></h2></header>
      <dl class="facts-grid">${facts}</dl>
    </div></section>

    <section class="chapter reveal" id="symbols"><div class="wrap">
      <header class="chapter-head"><div class="chapter-index">— 贰 · ICONOGRAPHY</div><h2>牌面要素<span class="en">A Glossary of Symbols</span></h2></header>
      <dl class="symbol-table">${symbols}</dl>
    </div></section>

    <section class="chapter reveal" id="numerology"><div class="wrap">
      <header class="chapter-head"><div class="chapter-index">— 叁 · NUMEROLOGY</div><h2>塔罗灵数<span class="en">The Number ${rankDisplays[card.rank - 1]}</span></h2></header>
      <div class="numerology-layout">
        <div class="big-number" aria-hidden="true">${rankDisplays[card.rank - 1]}</div>
        <div class="numero-copy">${renderBlocks(card.numerology)}<div class="focus-note"><span class="label">解读重点 · Reading Focus</span>${renderBlocks(card.focus)}</div></div>
      </div>
    </div></section>

    <section class="chapter reveal" id="reading"><div class="wrap">
      <header class="chapter-head"><div class="chapter-index">— 肆 · DIVINATORY MEANING</div><h2>正逆位解读<span class="en">Upright &amp; Reversed</span></h2></header>
      <div class="pos-switch-wrapper"><div class="pos-switch" role="tablist" aria-label="正逆位切换">
        <button class="on" data-pos="up" role="tab" aria-selected="true" aria-controls="panel-up">正位<span class="en">Upright</span></button>
        <button data-pos="rev" role="tab" aria-selected="false" aria-controls="panel-rev">逆位<span class="en">Reversed</span></button>
      </div></div>
      <div class="pos-panel-container">${renderPosition(card, card.upright, "up")}${renderPosition(card, card.reversed, "rev")}
      </div>
    </div></section>

    <section class="chapter reveal"><div class="wrap">
      <nav class="card-pager" aria-label="相邻牌页">
        <a href="${prevLink}"><small>PREVIOUS · 上一张</small><strong>← ${previous.title}</strong></a>
        <a href="${nextLink}"><small>NEXT · 下一张</small><strong>${next.title} →</strong></a>
      </nav>
    </div></section>
  </main>

  <footer><div class="wrap"><p>✦ THE ARCANUM GALLERY ✦</p><p>MINOR ARCANA · ${card.suit.zh} · ${card.suit.element}元素</p></div></footer>
</body>
</html>
`;
}

async function loadCards() {
  const cards = [];
  for (const [suitKey, suit] of Object.entries(suits)) {
    const suitDocs = path.join(docsRoot, suitKey);
    const files = (await fs.readdir(suitDocs)).filter((file) => file.endsWith(".md")).sort();
    if (files.length !== 14) throw new Error(`${suitKey}: expected 14 documents, found ${files.length}`);

    for (const file of files) {
      const globalNumber = Number(file.slice(0, 2));
      const rank = globalNumber - suit.start + 1;
      const markdown = await fs.readFile(path.join(suitDocs, file), "utf8");
      const title = markdown.match(/^#\s+(.+)$/m)?.[1].trim();
      if (!title) throw new Error(`${file}: missing title`);

      const preambleEnd = markdown.indexOf("\n## ");
      const preamble = markdown.slice(markdown.indexOf("\n") + 1, preambleEnd).trim();
      const preambleParts = preamble.split(/^!\[.*?\]\(.*?\)\s*$/m);
      const heroParagraphs = paragraphs(preambleParts[0]);
      const plateDescription = paragraphs(preambleParts[1] || "")[0] || `${title}主图将在后续视觉制作阶段补入。`;
      const facts = parseFacts(extractSection(markdown, "基础要素"));
      const nameMatch = facts.get("牌名")?.match(/\((.+)\)$/);
      const slug = file.replace(/\.md$/, "");
      const outputPath = path.join(outputRoot, suitKey, `${slug}.html`);

      cards.push({
        suitKey, suit, globalNumber, rank, slug, outputPath, title,
        enName: nameMatch?.[1] || `${rankDisplays[rank - 1]} of ${suit.en}`,
        heroParagraphs, plateDescription, facts,
        symbols: parseTable(extractSection(markdown, "牌面要素")),
        numerology: extractSection(markdown, "塔罗灵数"),
        focus: extractSection(markdown, "牌面解读重点"),
        upright: parsePosition(extractSection(markdown, "正位牌意")),
        reversed: parsePosition(extractSection(markdown, "逆位牌意")),
      });
    }
  }
  return cards.sort((a, b) => a.globalNumber - b.globalNumber);
}

const cards = await loadCards();
if (cards.length !== 56) throw new Error(`Expected 56 cards, found ${cards.length}`);

for (let index = 0; index < cards.length; index += 1) {
  const card = cards[index];
  const previous = cards[(index - 1 + cards.length) % cards.length];
  const next = cards[(index + 1) % cards.length];
  await fs.mkdir(path.dirname(card.outputPath), { recursive: true });
  await fs.writeFile(card.outputPath, renderPage(card, previous, next), "utf8");
}

console.log(`Built ${cards.length} Minor Arcana pages in ${path.relative(root, outputRoot)}`);
