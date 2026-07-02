(() => {
  const KEYWORD_LIMIT = 15;
  const panels = document.querySelectorAll("#reading .pos-panel");

  panels.forEach((panel) => {
    const summary = panel.querySelector(":scope > .pos-summary");
    if (!summary) return;

    let intro = panel.querySelector(":scope > .reading-intro");
    if (!intro) {
      intro = Array.from(panel.children).find((element) =>
        element.classList.contains("prose") && element.nextElementSibling === summary
      );
    }

    let keywordSource = "";
    if (intro) {
      const firstParagraph = intro.querySelector(":scope > p");
      const keywordMatch = firstParagraph?.textContent.trim().match(/^\*{0,2}关键词\*{0,2}\s*[：:]\s*(.+)$/u);

      if (keywordMatch) {
        keywordSource = keywordMatch[1];
        firstParagraph.remove();
      }

      intro.classList.remove("prose");
      intro.classList.add("reading-intro");
      intro.style.removeProperty("max-width");
      intro.style.removeProperty("margin-bottom");
      if (!intro.getAttribute("style")) intro.removeAttribute("style");
    }

    if (panel.querySelector(":scope > .keyword-strip")) return;

    if (!keywordSource) {
      keywordSource = summary.querySelector(":scope > .kw:first-child p")?.textContent.trim() || "";
    }

    const keywords = [...new Set(
      keywordSource
        .split(/\s*[，,·]\s*/u)
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    )].slice(0, KEYWORD_LIMIT);

    if (!keywords.length) return;

    const strip = document.createElement("div");
    strip.className = "keyword-strip";
    strip.setAttribute("aria-label", panel.id === "panel-rev" ? "逆位关键词" : "正位关键词");

    keywords.forEach((keyword) => {
      const capsule = document.createElement("span");
      capsule.textContent = keyword;
      strip.append(capsule);
    });

    panel.insertBefore(strip, intro || summary);
  });
})();
