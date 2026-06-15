# 魔術師专题页 · 生图提示词清单

> 视觉总基调：**古典手稿 / 博物馆藏品感**。统一参考 Rider–Waite–Smith 牌面体系 + 中世纪泥金手抄本 + 18 世纪铜版蚀刻插画。
> 配色锚点：羊皮纸米黄底（oklch 90% .02 80）、朱红、群青、土金黄、墨黑描线。
> 全套图片建议在**同一风格预设、同一光源、同一描边粗细**下出图，保证图版排在一起时质感统一。

通用负向提示（每张都可附加）：

```
negative: modern flat vector, neon, 3D render, glossy plastic, photographic skin pores,
watermark, signature, text artifacts, low-res jpeg blur, oversaturated, cartoon chibi,
fantasy game splash art
```

---

## PLATE I · 魔术师主图（已上传，下为重出/替换备用 prompt）

**用途**：卷首 hero 主视觉，竖构图 3:5。
**文件名**：`assets/images/major/01-the-magician/the-magician.png`

```
A classical tarot card illustration of "The Magician" (Major Arcana I), in the style of an
aged Rider-Waite-Smith plate reproduced as an 18th-century hand-colored copper engraving.
A standing magician in a flowing red cloak over a white robe, right hand raising a wand
toward the sky, left index finger pointing to the earth. Above his head a horizontal
lemniscate (infinity symbol) glowing softly. Around his waist an ouroboros serpent belt.
On the altar table before him: a cup, a sword, a wand, and a pentacle coin, neatly arranged.
Foreground of red roses and white lilies, climbing vines arching overhead. Warm golden-yellow
sky background. Fine cross-hatched engraving lines, muted parchment palette, gold-leaf
highlights, museum-archival texture, subtle aged paper grain.
aspect ratio 3:5, centered full-figure composition, ornate thin border frame.
```

---

## PLATE II · 象征要素标注图

**用途**：象征图谱章节左侧，正方形 1:1，需留出可叠加数字标号的空间。
**文件名**：`assets/images/major/01-the-magician/the-magician-symbols.png`

```
A scholarly diagram plate of the Magician tarot figure, drawn as a museum exhibition
annotation sheet on aged parchment. The same red-cloaked magician rendered in clean
engraving lines, surrounded by empty thin leader-lines and small numbered circles (1–13)
pointing to key symbols: the infinity halo, the wand, the four altar tools, the serpent belt,
the roses and lilies, the white inner garment. Keep the figure slightly desaturated and the
background plain parchment so callout numbers and labels can be overlaid. Antique botanical-
plate aesthetic, fine ink hatching, faint sepia wash, archival catalogue look.
aspect ratio 1:1, generous margin around the figure, no existing text labels.
```

---

## PLATE III · 桌上四元素静物

**用途**：图版索引缩略，正方形 1:1。
**文件名**：`assets/images/major/01-the-magician/the-magician-elements.png`

```
A still-life engraving of four tarot suit emblems arranged on a dark wooden altar:
a golden chalice (Cups/Water), an upright sword (Swords/Air), a budding wooden wand
(Wands/Fire), and a golden pentacle coin (Pentacles/Earth). Rendered as an 18th-century
hand-colored copper plate, fine cross-hatching, muted parchment background, soft directional
candlelight, gold-leaf accents on the metal objects. Each object distinct and clearly readable,
symmetrical balanced arrangement. Museum-archival texture, aged paper grain.
aspect ratio 1:1.
```

---

## PLATE IV · 正位意象

**用途**：正逆位章节配图（正位），正方形 1:1。
**文件名**：`assets/images/major/01-the-magician/the-magician-upright.png`

```
An allegorical emblem representing the UPRIGHT Magician energy: ascending, luminous, ordered.
A single hand raising a glowing wand upward, rays of golden light radiating, a clear
lemniscate above, fresh roses and lilies blooming. Bright golden-yellow parchment sky,
upward visual flow, confident and harmonious composition. 18th-century hand-colored
engraving style, fine hatching, gold-leaf highlights, archival museum texture.
aspect ratio 1:1, vertical upward movement in the composition.
```

---

## PLATE V · 逆位意象

**用途**：正逆位章节配图（逆位），正方形 1:1。需与 PLATE IV 成镜像/倒置对照。
**文件名**：`assets/images/major/01-the-magician/the-magician-reversed.png`

```
An allegorical emblem representing the REVERSED Magician energy: inverted, blocked, dimmed.
The same magician motif but turned upside-down and shadowed — a downward-pointing wand losing
its light, the infinity symbol fractured or faint, wilting roses, tangled vines, muted and
desaturated palette with cool grey-blue shadows creeping over the parchment. A sense of
manipulation, hesitation and unrealized potential. Same 18th-century engraving style and
hatching as the upright plate so the two read as a matched pair, archival museum texture.
aspect ratio 1:1, downward/inverted visual flow, deliberately darker tone.
```

---

## PLATE VI · 三牌阵示意（过去 · 现在 · 未来）

**用途**：牌阵示意章节，横构图 16:9 或 3:2。
**文件名**：`assets/images/major/01-the-magician/the-magician-spread.png`

```
A diagram of a three-card tarot spread laid on a dark velvet cloth, viewed slightly from above.
Three identical tarot card backs (ornate engraved patterned backs, antique gold-on-deep-blue
filigree) placed side by side in a row, evenly spaced. Soft candlelight, subtle shadows under
each card. Empty space below each card for labels (Past / Present / Future). 18th-century
hand-colored engraving aesthetic, parchment-and-velvet palette, gold-leaf filigree on the
card backs, archival museum texture.
aspect ratio 3:2 (horizontal), three cards centered in a clean row, no printed labels.
```

---

## 出图小贴士

- **统一性优先**：先用 PLATE I 的 prompt 跑出满意主图，记下所用模型 / 风格预设 / 种子，其余各张沿用相同设置，仅替换主体描述，色调与描线才会一致。
- **标注图（PLATE II）**：刻意让画面留白、不带文字，方便页面用 CSS/SVG 叠加 01–13 的标号引线。
- **正逆位（PLATE IV / V）**：建议同一构图出两版，第二版做倒置 + 降饱和处理，对照效果最强。
- 出图完成后按上表**文件名**命名并保存到对应的子目录中，页面会自动引用它们。
