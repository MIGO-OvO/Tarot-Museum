# 以教皇牌为黄金样板统一所有塔罗牌网页

Updated: 2026-07-03T03:15:55.084Z
Workspace: D:\Dev\GitHub\Tarot-Museum
Target agent: Codex (codex)

## Plan

# 以教皇牌为黄金样板统一所有塔罗牌网页

## 1. 背景与目标

当前项目 `Tarot-Museum` 是一个静态塔罗牌网页站点，页面主要分为：

- `docs/major/*.md`：大阿尔卡那内容源。
- `cards/major/*.html`：大阿尔卡那最终网页。
- `docs/minor/*/*.md`：小阿尔卡那内容源。
- `cards/minor/*/*.html`：小阿尔卡那最终网页。
- `assets/css/card-reading.css`、`assets/js/card-reading.js`：已经抽出的部分正逆位阅读模块样式与逻辑。
- `scripts/build-minor-arcana.mjs`：小阿尔卡那 Markdown 到 HTML 的生成器。

用户认为 `cards/major/05-the-hierophant.html`（教皇牌）是目前所有牌页中完成度最高、效果最好的页面。目标是让其他所有牌快速参考教皇牌的样式构建网页，但不能继续手工复制 22 份 HTML，而应将教皇页沉淀成可复用的页面系统。

最终目标：

1. 将教皇页的视觉、交互、章节结构抽象为大阿尔卡那统一模板。
2. 新建大阿尔卡那生成器，让 `docs/major/*.md` 自动生成 `cards/major/*.html`。
3. 保留每张牌独特内容、关键词、象征要素和图片，但统一页面版式与交互体验。
4. 降低后续维护成本：以后改样式只改共享 CSS/JS，改内容只改 Markdown。

## 2. 当前问题诊断

### 2.1 大阿尔卡那页面存在重复与漂移

当前大阿尔卡那页面多为独立 HTML，每张页面内联大量 CSS 与 JS。教皇页视觉完成度最高，但其他页面与它存在不同程度差异：

- 正逆位模块样式不完全一致。
- 有些页面没有 `reading-intro` 的装帧效果。
- 有些页面没有关键词胶囊 `keyword-strip`。
- 大部分大牌没有 `details.guidance` 情境指引折叠区。
- 只有教皇页具有更完整的 `fact-notes` 补充要素卡片。
- 图片尺寸策略、配图章节、图版编号、figcaption 规则不完全统一。
- 每页重复大量 CSS，后续维护会非常困难。

### 2.2 小阿尔卡那已经有生成器，大阿尔卡那反而缺失

项目中已有 `scripts/build-minor-arcana.mjs`，说明小阿尔卡那已经进入 “Markdown 内容源 → HTML 生成结果” 的架构。

但大阿尔卡那旧的 `tools/build-major-pages.mjs` 当前已删除，导致大牌无法通过统一模板重建。

### 2.3 教皇页的优势并非单纯视觉，而是结构完整

教皇页值得复用的点包括：

- 完整的章节导航：卷首、牌面叙事、牌面要素、象征图谱、塔罗灵数、正逆位解读、牌阵示意。
- 强叙事 hero：牌图、编号、英文名、四个关键词、长引导文本。
- 图版系统：主图、象征图、要素图、正位图、逆位图、牌阵图。
- 象征图谱：左侧 sticky 图片，右侧 symbol list 可点击高亮。
- 正逆位切换：按钮切换、面板淡入、aria 属性。
- 关键词胶囊：增强扫描性。
- 牌意提要 `reading-intro`：文本装帧更精致。
- 四维度解读：爱情/婚姻、事业/学业、人际/财富、健康/生活。
- 情境指引：使用 `details.guidance` 承载过去、现在、未来、挑战、障碍、环境、支持、建议、优势、弱点、关系状态、结果等细分解读。
- 三牌阵示意：过去/现在/未来三张翻牌卡，有互动记忆点。

## 3. 推荐总体架构

建议重构为以下结构：

```txt
assets/
  css/
    major-card.css          # 从教皇页抽出的所有大牌通用视觉样式
    card-reading.css        # 正逆位阅读模块的跨大/小牌共用样式，可保留并扩展
    minor-card.css          # 小牌样式，暂不大改
  js/
    major-card.js           # 大牌通用交互逻辑
    card-reading.js         # 阅读模块兼容/增强逻辑，可保留
    minor-card.js           # 小牌交互，暂不大改

scripts/
  build-major-arcana.mjs    # 新增：大阿尔卡那生成器
  build-minor-arcana.mjs    # 现有：小阿尔卡那生成器

docs/
  major/
    00-the-fool.md
    ...
    21-the-world.md

cards/
  major/
    00-the-fool.html
    ...
    21-the-world.html
```

核心原则：

- `docs/major` 是唯一内容源。
- `cards/major` 是生成结果，不应长期手工维护。
- 教皇页的设计语言迁移到 `major-card.css` 与 `major-card.js`。
- 生成器负责把每张牌 Markdown 内容渲染成统一结构。

## 4. 需要新增或改造的文件

### 4.1 新增 `assets/css/major-card.css`

从 `cards/major/05-the-hierophant.html` 中抽取通用 CSS，包括但不限于：

- CSS variables：`--bg`、`--paper`、`--surface`、`--fg`、`--muted`、`--faint`、`--border`、`--rule`、`--gold`、`--gold-deep`、`--wine`、`--wine-soft`、字体变量。
- base reset：`*`、`html`、`body`、`::selection`、scrollbar。
- layout：`.wrap`、`.chapter`、`.chapter-head`。
- topbar：`.topbar`、`.topbar-inner`、`.tnav`。
- hero：`.hero`、`.hero-grid`、`.hero-figure`、`.plate`、`.plate-cap`、`.hero-text`、`.hero-num`、`.hero-keywords`、`.hero-lede`。
- prose：`.prose`、`.drop`、`.pullquote`。
- facts：`.facts`、`.fact-notes`。
- image plates：`.element-figure`、`.symbol-figure`、`.pos-figure`、`.spread-figure`。
- symbol map：`.symbol-layout`、`.symbol-list`、`.symbol-item`、`.sym-no`、`.sym-body`、`.swatch`。
- numerology：`.numero`、`.bignum`、`.numero-keys`、`.numero-notes`、`.lesson`。
- reading：`.pos-switch`、`.pos-panel`、`.keyword-strip`、`.reading-intro`、`.pos-summary`、`.dim-grid`、`.dim`、`.dim-head`、`.dim-extra`、`.guidance`、`.guidance-grid`。
- spread：`.spread`、`.spread-card-wrapper`、`.spread-card-front`、`.spread-card-back`。
- footer。
- responsive media queries。

注意事项：

1. 不要把某张牌专属文本写入 CSS。
2. 可以保留统一色调，后续如要牌别主题色，可通过 `body data-card` 或 `data-element` 扩展。
3. 避免和 `minor-card.css` 的类名冲突。大牌页面使用 `.dim-grid/.dim`，小牌使用 `.dimension-grid/.dimension`，可以暂时保持区分。

### 4.2 新增 `assets/js/major-card.js`

从教皇页底部脚本抽出通用交互：

- `.reveal` IntersectionObserver 滚动显现。
- 正逆位切换：按钮 `[data-pos]` 控制 `#panel-up` / `#panel-rev`。
- `.symbol-item` 点击高亮。
- `.tnav a` 根据滚动位置高亮。
- 顶栏向下滚动隐藏、向上滚动显示。
- `.spread-card-wrapper` 翻牌。

建议去掉 HTML 内联 `onclick="this.classList.toggle('flipped')"`，改成 JS 统一绑定：

```js
for (const card of document.querySelectorAll('.spread-card-wrapper')) {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
}
```

同时照顾无障碍：

- 翻牌元素可加 `tabindex="0"` 和 `role="button"`。
- 支持 Enter / Space 触发翻牌。
- 正逆位切换时同步 `aria-selected`。

### 4.3 新增 `scripts/build-major-arcana.mjs`

参考 `scripts/build-minor-arcana.mjs`，实现大阿尔卡那生成器。

建议复用/改写以下函数：

- `escapeHtml(value)`
- `inline(value)`
- `extractSection(markdown, heading)`
- `paragraphs(value)`
- `parseFacts(value)`
- `parseTable(value)`
- `parseSubsections(value)`
- `parsePosition(value)`
- `renderBlocks(value)`
- `renderGuidance(value, positionLabel)`

大牌生成器需要额外支持：

- 22 张大牌固定顺序。
- 罗马数字编号。
- 英文牌名。
- 图片 slug 推导。
- hero 四关键词。
- fact-notes 补充要素。
- 正逆位四维度解读。
- 三牌阵示意。
- 上一张/下一张导航可选。

## 5. 大牌内容 Schema 设计

建议将所有 `docs/major/*.md` 统一为以下结构。

```md
# 教皇

卷首介绍第一段。

卷首介绍第二段。

卷首介绍第三段。

![塔罗牌教皇](../../assets/images/major/05-the-hierophant/the-hierophant.png)

牌面叙事第一段。

牌面叙事第二段。

## 基础要素

1. 牌名：教皇 (The Hierophant)
2. 数字编号：V / 5 号牌
3. 核心主题：传统、教导、信仰、制度与传承
4. 元素：土
5. 星座或行星：金牛座
6. 希伯来字母：Vav（瓦夫）
7. 象征符号：钉子或连接器
8. 代表意义：通过传统、规则和师承获得稳定的精神与现实支持
9. 脉轮：Yeli 轮（Causal），也就是第四眼脉轮，代表灵性连结
10. 方向：东南方

## 牌面要素

| 要素 | 含义 |
|------|------|
| 双柱 | 传统体系中的门槛与秩序。 |

## 塔罗灵数

数字说明段落。

- **金钱**：说明。
- **感情**：说明。
- **人物**：说明。
- **能量倾向**：说明。

## 牌面解读重点

该牌正逆位共同关注的核心解读重点。

## 正位牌意

**关键词**：值得信赖，得到援助，传统，教育，指引，导师，婚姻，共同价值

正位牌意提要段落。

### 爱情/婚姻

段落。

- **现况**：说明。
- **桃花**：说明。
- **看法**：说明。
- **复合**：说明。

### 事业学业

段落。

- **现况**：说明。
- **建议**：说明。
- **人际**：说明。
- **发展**：说明。

### 人际财富

段落。

- **现况**：说明。
- **建议**：说明。
- **财运**：说明。

### 健康生活

段落。

### 其它牌意

段落。

### 情境指引

- **爱情运势**：说明。
- **财富运势**：说明。
- **当前情况**：说明。
- **过去**：说明。
- **现在**：说明。
- **未来**：说明。
- **挑战**：说明。
- **障碍**：说明。
- **环境**：说明。
- **支持**：说明。
- **建议**：说明。
- **优势**：说明。
- **弱点**：说明。
- **正面影响**：说明。
- **负面影响**：说明。
- **希望发生**：说明。
- **害怕发生**：说明。
- **你如何看对方**：说明。
- **对方如何看待你**：说明。
- **关系当前状态**：说明。
- **关系未来发展**：说明。
- **结果**：说明。

## 逆位牌意

同正位结构。

## 三牌阵示意

### 过去
标题：承袭传统
说明：过去如何体现该牌能量。

### 现在
标题：寻求指引
说明：现在如何体现该牌能量。

### 未来
标题：精神开示
说明：未来如何体现该牌能量。

## 总结

页面底部总结段落。
```

### 5.1 Schema 的兼容策略

为了快速迁移，生成器不应要求所有牌第一轮都完整。建议缺失字段使用默认值或占位：

- 缺少 `脉轮` / `方向`：不渲染 `fact-notes` 对应块，或显示“未记录”。
- 缺少 `三牌阵示意`：自动生成通用过去/现在/未来文案。
- 缺少某个解读维度：渲染空白占位或跳过该卡片。
- 缺少图片：仍输出图版位置，并用 `onerror` fallback 展示“图片待上传”。

## 6. 图片命名规范

所有大牌统一使用教皇页命名模式：

```txt
assets/images/major/<card-slug>/<image-slug>.png
assets/images/major/<card-slug>/<image-slug>-symbols.png
assets/images/major/<card-slug>/<image-slug>-elements.png
assets/images/major/<card-slug>/<image-slug>-upright.png
assets/images/major/<card-slug>/<image-slug>-reversed.png
assets/images/major/<card-slug>/<image-slug>-spread.png
```

示例：

```txt
assets/images/major/05-the-hierophant/the-hierophant.png
assets/images/major/05-the-hierophant/the-hierophant-symbols.png
assets/images/major/05-the-hierophant/the-hierophant-elements.png
assets/images/major/05-the-hierophant/the-hierophant-upright.png
assets/images/major/05-the-hierophant/the-hierophant-reversed.png
assets/images/major/05-the-hierophant/the-hierophant-spread.png
```

生成器从文件名推导：

- 文档：`docs/major/05-the-hierophant.md`
- 页面：`cards/major/05-the-hierophant.html`
- 图片目录：`assets/images/major/05-the-hierophant/`
- 图片基础名：去掉编号前缀后的 slug，即 `the-hierophant`

## 7. 生成器渲染结构

生成出的每个大牌 HTML 应采用以下结构：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="..." />
  <title>教皇 · THE HIEROPHANT — 塔罗牌深度专题</title>
  <link rel="stylesheet" href="../../assets/css/major-card.css">
  <link rel="stylesheet" href="../../assets/css/card-reading.css">
  <script src="../../assets/js/major-card.js" defer></script>
  <script src="../../assets/js/card-reading.js" defer></script>
</head>
<body data-card="05-the-hierophant" data-element="earth">
  <div class="topbar">...</div>
  <header class="hero" id="hero">...</header>
  <section class="chapter reveal" id="narrative">...</section>
  <section class="chapter reveal" id="facts">...</section>
  <section class="chapter reveal" id="symbols">...</section>
  <section class="chapter reveal" id="numerology">...</section>
  <section class="chapter reveal" id="reading">...</section>
  <section class="chapter reveal" id="spread">...</section>
  <footer>...</footer>
</body>
</html>
```

## 8. 分阶段实施计划

### 阶段 1：冻结教皇页为黄金样板

目标：明确教皇页当前为视觉参考，不在第一轮随意改动设计。

任务：

1. 阅读 `cards/major/05-the-hierophant.html`，标记可复用样式与逻辑。
2. 保留当前教皇页作为视觉对照。
3. 截图或人工检查记录关键视觉点：hero、facts、symbols、reading、spread。

验收：

- 明确哪些模块必须在其他牌上统一。
- 不破坏当前教皇页展示。

### 阶段 2：抽出共享 CSS 与 JS

目标：把教皇页内联 CSS/JS 迁移到共享资源。

任务：

1. 新建 `assets/css/major-card.css`。
2. 新建 `assets/js/major-card.js`。
3. 先只改 `cards/major/05-the-hierophant.html` 做试点：删除内联 CSS/JS，引用共享文件。
4. 保持页面视觉与交互不变。

验收：

- 教皇页加载正常。
- 正逆位切换正常。
- 目录高亮正常。
- reveal 动画正常。
- 象征图谱点击高亮正常。
- 三牌阵翻牌正常。
- 控制台无明显报错。

### 阶段 3：实现 `build-major-arcana.mjs`

目标：从 Markdown 自动生成大阿尔卡那页面。

任务：

1. 复制并精简 `scripts/build-minor-arcana.mjs` 的通用解析函数。
2. 加入大牌专用元数据：编号、罗马数字、英文名、slug、元素。
3. 实现 `renderPage(card, previous, next)`。
4. 实现 `renderHero()`、`renderNarrative()`、`renderFacts()`、`renderSymbols()`、`renderNumerology()`、`renderReading()`、`renderSpread()`、`renderFooter()`。
5. 对缺失字段使用 fallback。
6. 首先只生成教皇页到临时路径或直接对比输出。

验收：

- 生成器可执行。
- 至少能成功生成教皇页。
- 生成出的教皇页结构完整，视觉接近手写版本。

### 阶段 4：统一 `docs/major/*.md`

目标：让所有大牌内容源满足生成器需要。

任务：

1. 以 `docs/major/05-the-hierophant.md` 为样板。
2. 检查 22 个 Markdown 文件是否都有以下章节：
   - `## 基础要素`
   - `## 牌面要素`
   - `## 塔罗灵数`
   - `## 牌面解读重点`
   - `## 正位牌意`
   - `## 逆位牌意`
3. 对缺少的章节先补最小内容。
4. 后续逐步补足 `情境指引` 与 `三牌阵示意`。

验收：

- 22 个大牌 Markdown 都能被解析。
- 生成器不会因缺字段中断。

### 阶段 5：批量生成 22 张大牌

目标：让所有大牌获得教皇页同等级页面结构。

任务：

1. 运行 `node scripts/build-major-arcana.mjs`。
2. 生成 `cards/major/*.html`。
3. 检查每张页面的：
   - title。
   - 图片路径。
   - hero 关键词。
   - facts 卡片。
   - symbols 列表。
   - numerology。
   - 正逆位切换。
   - spread。
4. 对缺失图片保留 fallback。

验收：

- 22 张大牌页面均生成成功。
- 页面引用共享 CSS/JS。
- 不再依赖每页巨量内联 CSS。

### 阶段 6：质量检查与视觉 QA

目标：避免批量生成后出现布局破损。

任务：

1. 随机检查至少 5 张牌：愚者、女祭司、教皇、高塔、世界。
2. 检查桌面宽度和移动宽度。
3. 检查长文本是否溢出。
4. 检查图片缺失 fallback 是否美观。
5. 检查正逆位面板高度切换是否正常。
6. 检查顶部导航是否定位正确。

验收：

- 页面无明显横向滚动。
- 正逆位面板不会互相覆盖。
- 移动端导航隐藏或折叠合理。
- 缺图时仍有清晰占位。

## 9. 优先级建议

### P0：必须先做

1. `major-card.css`
2. `major-card.js`
3. `build-major-arcana.mjs`
4. 让教皇页可由生成器复现。

### P1：紧接着做

1. 批量生成 22 张大牌。
2. 补齐 Markdown 最小字段。
3. 统一图片命名和 fallback。

### P2：后续增强

1. 每张牌按元素设置细微主题色。
2. 增加上一张/下一张大牌导航。
3. 让大牌与小牌共享更多 reading 组件。
4. 增加构建脚本，例如 `npm run build:major`。
5. 增加静态检查脚本，验证所有 Markdown schema。

## 10. 不建议的方案

不要把 `05-the-hierophant.html` 直接复制 21 次再替换文字。

原因：

- 会产生 22 份重复 CSS/JS。
- 后续每次改样式都要改 22 个文件。
- 极易出现页面之间细节不一致。
- 生成器与 Markdown 内容源会被架空。
- 长期维护成本越来越高。

也不要只靠 `card-reading.js` 在运行时修补旧页面结构。

原因：

- 运行时修补适合兼容旧页面，不适合长期作为架构。
- 正确结构应该在生成阶段输出。
- JS 修补过多会让页面难以调试。

## 11. 验收清单

完成后应满足：

- [ ] 新增 `.ai-bridge/current-plan.md` 记录本方案。
- [ ] 新增 `assets/css/major-card.css`。
- [ ] 新增 `assets/js/major-card.js`。
- [ ] 新增 `scripts/build-major-arcana.mjs`。
- [ ] 教皇页可以通过生成器生成，视觉接近现有版本。
- [ ] 22 张大牌均能生成。
- [ ] 所有大牌引用共享 CSS/JS。
- [ ] 正逆位切换正常。
- [ ] 象征图谱点击高亮正常。
- [ ] 牌阵翻牌正常。
- [ ] 缺图 fallback 正常。
- [ ] 移动端布局无明显破损。
- [ ] 后续改样式只需改共享 CSS。

## 12. 推荐执行命令

若实现完成，可使用：

```bash
node scripts/build-major-arcana.mjs
```

如果后续加入 npm scripts，可增加：

```json
{
  "scripts": {
    "build:major": "node scripts/build-major-arcana.mjs",
    "build:minor": "node scripts/build-minor-arcana.mjs",
    "build": "node scripts/build-major-arcana.mjs && node scripts/build-minor-arcana.mjs"
  }
}
```

## 13. 给后续实现 Agent 的关键提醒

1. 先不要一次性重写全部页面，先让教皇页模板化成功。
2. 不要删除用户现有内容，Markdown 是内容源，应尽量保留并结构化。
3. 生成器必须容错，避免某张牌字段缺失导致整个构建失败。
4. 图片缺失是正常情况，必须输出美观 fallback。
5. 不要把大牌 CSS 和小牌 CSS 强行混在一起，第一轮保持边界清楚。
6. 如果批量生成导致大量 diff，先确认是否符合预期，再继续做视觉 QA。

## 14. 最终判断

最佳路线是：以教皇牌作为黄金样板，抽象为大阿尔卡那页面系统，而不是复制单页。这样可以最快让所有牌拥有接近教皇牌的完成度，同时为后续内容扩写、配图替换、视觉统一和交互增强打好基础。

## Implementation contract

- Work from this plan in small, reviewable steps.
- Keep edits scoped to the requested task and existing project conventions.
- Run focused verification before handing work back.
- Update .ai-bridge/agent-status.md with files touched, checks run, results, blockers, and review notes.
- Save the final review diff to .ai-bridge/implementation-diff.patch when practical.
- Append notable execution events to .ai-bridge/execution-log.jsonl when the implementation agent supports logging.
