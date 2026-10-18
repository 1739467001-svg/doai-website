# DOAI 官网设计系统（Design System）

> **活文档**：记录我们对 DOAI 官网 UI 的理解与约定，供设计、开发、AI 协作者统一风格。
> 每次 UI 改动后顺手更新对应章节，并在文末「变更记录」追加一行。
>
> 最后更新：2026-10-18 · 首页 Hero 地球重做（Glass Globe）

---

## 0. 怎么用这份文档

- **做新页面 / 新组件前**：先看 §2 调性、§3 色彩、§7 组件类，优先复用现有 token 和 `doa-*` 类，不要另起一套颜色和圆角。
- **改首页 Hero / 地球**：看 §9，里面有分层结构、布局算法、视觉参数表和调参入口（Globe Lab）。
- **发现不一致**：先记到 §11「已知问题与待办」，再决定是否顺手修。
- **给 AI 协作者的指令**：可以直接说「按 docs/DESIGN_SYSTEM.md 的规范做」。

---

## 1. 项目速览

| 项 | 说明 |
| --- | --- |
| 站点 | 2026 Dobe 外滩 AI 创客大会（DOAI）官网：原子公社 × 德必联合主办，11 月在上海黄浦外滩德必园区举办 |
| 核心任务 | ① 赛事介绍 ② 选手报名（双赛道 → 赛道详情 → 报名 → 提交作品）③ 商务对接（合作伙伴 / 展商 / 分论坛申请） |
| 技术栈 | Vite 8 + React 19 + TypeScript + Tailwind CSS 4（`@theme` token）+ lucide-react 图标；`server.js` 为 Express 简易后端，Vercel 部署 |
| 路由 | 自研字符串路由（`src/components/router/RouterView.tsx`），`parent/child` 形式深链，例如 `maker/tracks`、`detail/forum/f-1` |
| 多语言 | 所有可见文案走 `tr('中文', 'English')`（`useApp()` 提供），默认中文，语言存 `localStorage.doai_lang` |
| 目录 | `src/components/{layout,views,detail,sections,modals,common,globe,router}`，样式集中在 `src/index.css`，数据在 `src/data/` |

---

## 2. 品牌调性

**一句话**：晴空下的玻璃与纸——白纸做底、墨蓝写字、品牌蓝点睛，靠光感和留白显得高级，而不是靠堆特效。

| 关键词 | 落到界面上 |
| --- | --- |
| 晴空 Sky | 背景从纸白过渡到极浅的天蓝（`#F7FAFF` / `#EFF5FF`），Hero 是外滩晴空 + 天际线 |
| 玻璃 Glass | 半透明、高光、细边框：导航 `bg-white/95 backdrop-blur`、玻璃地球、标签胶囊 |
| 纸白 Paper | 大面积白底，卡片 = 白纸 + 1px 浅蓝描边 + 一层很淡的蓝色阴影 |
| 墨蓝 Ink | 标题与正文用墨蓝 `#0B1B3A` 系，而不是纯黑 |
| 连接 Connect | 视觉母题是「从上海连接世界」：地球上的城市弧线、两条交叉轨道（呼应原子公社的原子意象） |

**不做**：霓虹暗黑风、满屏渐变、emoji 图标（已在 `1533873` 全部移除）、AI 生成视频里那种会变形的元素。

---

## 3. 色彩

### 3.1 Token（`src/index.css` → `@theme`）

| 用途 | Token | 值 | 说明 |
| --- | --- | --- | --- |
| 品牌主色 | `--color-doa-600` | `#165DFF` | 全站 CTA、链接、强调（使用 330+ 次） |
| 主色悬停 | `--color-doa-700` | `#0F47CC` | 代码里也常见 `#1453E6` 作 hover，二者择一即可 |
| 浅蓝阶 | `--color-doa-50 … 500` | `#F2F7FF` `#E4EFFF` `#CFE2FF` `#A9CCFF` `#6FA8FF` `#2E7BF6` | 面板、chip、描边、插画 |
| 墨蓝标题 | `--color-ink-900` | `#0B1B3A` | H1–H4 与重点数字 |
| 墨蓝次级 | `--color-ink-700` | `#1A2B4D` | 副标题 |
| 正文灰蓝 | `--color-ink-500 / 400 / 300` | `#48597A` `#6B7C9B` `#98A6BE` | 正文 / 辅助 / 占位 |
| 表面 | `--color-surface*` | `#FFFFFF` `#F7FAFF` `#EFF5FF` | 白纸、下沉区、浅蓝底 |
| 描边 | `--color-line` / `-strong` | `#E3ECFA` / `#CBDDF7` | 卡片描边 / 悬停描边 |
| 语义 | `--color-success / warning / danger` | `#00B487` `#FF8A1F` `#E5484D` | 状态 |

### 3.2 现实中的「野生色」

代码里仍有不少直接写死的旧灰色，来自早期版本：`#E8EAED`（描边，150+ 次）、`#666666` / `#888888`（正文灰）、`#F7F8FA`（浅灰底）、`#111111`。
**约定**：新代码一律用 §3.1 的 token（Tailwind 里写 `text-ink-500`、`border-line` 等，或 CSS 变量）；旧代码改到哪里顺手换到哪里，不专门大扫除。

### 3.3 首页快捷入口的功能色

六个入口各有一个功能色（10% 透明度做底）：报名 `#165DFF`、组队 `#00C48C`、论坛 `#FF4D4F`、展示 `#722ED1`、直播 `#1890FF`、票务 `#FA8C16`。
这是全站唯一允许多彩的位置，其他地方保持「蓝 + 墨蓝 + 灰」三色。

### 3.4 Hero / 地球专用色

| 元素 | 值 |
| --- | --- |
| Hero 天空底（plate 没覆盖到的地方） | `#CDE4FB → #E3EEFC → #F5F9FD → #F2F7FD → #FFFFFF`（竖向） |
| 海洋：暗面 / 主色 / 亮面 | `#082BA8` / `#165DFF` / `#66A3FF` |
| 大陆磨砂底 | `#D6E8FF`（叠在海洋上 24–48%） |
| 大陆点阵 | 白色，亮面 100%、暗面约 50% |
| 边缘菲涅尔 / 左上冷色边 | `#E6F2FF` / `#C2EDFF` |
| 右下虹彩边 | `#F7BDF2`（呼应主视觉的粉紫光环） |
| 底部焦散（球内） | `#529EFF` |
| 大气光晕 | `#7AADFF` → 右下偏 `#EDB8F7` |
| 外轨道 A 渐变 | `#165DFF → #968CFF → #FF80C4` |
| 内轨道 B 渐变 | `#6FA8FF → #165DFF → #BE96FF` |
| 城市弧线 / 脉冲 | 白色线条 + `rgb(160,200,255)` 光晕 |

---

## 4. 字体与排版

| 角色 | 字体 | 备注 |
| --- | --- | --- |
| 正文 / 标题 | Plus Jakarta Sans → Inter → 系统字体 | 中文回落到系统黑体（苹方 / 微软雅黑） |
| 数字 / 数据 | JetBrains Mono（`font-mono`，开启 `tnum` 等宽数字） | 日期、计数、坐标 |
| Logo | `DoAiLogo.tsx` 代码绘制的 SVG，不要用位图 | |

**字号习惯**（Tailwind 任意值为主）：辅助信息 `11px`（最常用）、`12–13px` 正文、`15–19px` 标语、`22–38px` 中文主标题；H1 中文行 `text-[22/30/38px]` 三档响应式。
**Eyebrow**（标题上方小标签）：`doa-eyebrow`：11px、700、字距 `0.22em`、大写、品牌蓝。Hero 的 eyebrow 用更宽字距 `0.28em`，配一条 28px 细线。
**标题字距**：大标题统一 `tracking-tight` / `-0.02em`，紧凑有力。

> ⚠️ 字体通过 Google Fonts 加载，中国大陆访问 `fonts.googleapis.com` 不稳定，见 §11。

---

## 5. 布局与间距

- **单一内容宽度**：`max-w-[1200px] mx-auto px-6 md:px-10`（或 `doa-container`）。全站只有 Hero 背景是满幅出血。
- **导航**：固定顶栏高 72px（`h-[72px]`），白 95% + 毛玻璃，页面顶部统一 `pt-[72px]`。
- **断点**：沿用 Tailwind 默认；`lg`（1024px）是「桌面 / 移动」分界，Hero 布局也以它切换。
- **区块节奏**：常规 section `py-20 lg:py-24`；次级 section `py-14 sm:py-16` + 顶部 `border-t`。
- **详情页**：统一走 `DetailShell`（返回链接 → eyebrow → H1 → 副标题 → meta → actions）。

---

## 6. 形状、描边与阴影

| 用途 | 规格 |
| --- | --- |
| 按钮、chip、标签胶囊 | `rounded-full`（最常用，130+ 次） |
| 卡片 | `rounded-xl`（12px）/ `rounded-2xl`（16px），`doa-card` 为 16px |
| 大面板、快捷入口条 | `rounded-3xl`（24px） |
| 描边 | 1px 浅蓝 `--color-line`；悬停加深到 `--color-line-strong` |
| 卡片阴影 | `0 1px 2px rgba(11,27,58,.04), 0 8px 24px rgba(22,93,255,.06)`——**阴影带蓝色倾向**，不要用纯黑大阴影 |
| 主按钮阴影 | `0 8px 20px rgba(22,93,255,.26~.28)`，悬停 `0 12px 28px …32~.34` |
| 浮层 | `shadow-floating`（`0 30px 80px rgba(0,0,0,.1)`），下拉菜单、弹窗用 |

---

## 7. 组件类速查（`src/index.css`）

| 类 | 用途 |
| --- | --- |
| `doa-card` / `doa-card-hover` | 白纸卡片；hover 上浮 3px + 描边加深 + 蓝阴影 |
| `doa-panel` | 浅色渐变面板（次要信息块） |
| `doa-eyebrow` | 标题上方的小标签 |
| `doa-chip` | 浅蓝小胶囊 |
| `doa-btn` + `-primary / -secondary / -ghost` | 44px 高（满足触控最小尺寸）、全圆角、按下 `scale(.97)` |
| `doa-input / doa-textarea / doa-select / doa-label` | 表单，聚焦时蓝描边 + 3px 浅蓝光圈 |
| `doa-rule` | 两端渐隐的分割线 |
| `doa-rise doa-rise-1…5` | 入场上浮（Hero 文案依次 60–380ms 错峰） |
| `doa-hero*` / `doa-globe*` | 首页 Hero 专用，见 §9 |

React 组件：`DoAiLogo`（代码绘制 Logo）、`DetailShell`、`PeopleSection`、`GlassGlobe`（§9）、`HeroGlobeStage`（§9）。

---

## 8. 动效

**Token**：`--ease-standard: cubic-bezier(.2,0,0,1)`（默认）、`--ease-spring: cubic-bezier(.34,1.4,.64,1)`（轻微回弹，用于 hover 上浮）、`--dur-hover: 260ms`。

**原则**
1. **动效服务于信息**：入场让视线按「标语 → 标题 → CTA → 日期」走；地球的弧线讲「从上海连接世界」。
2. **慢而稳**：常驻动画周期 ≥ 6s（地球自转 72s/圈、悬浮 7s、轨道卫星 13–18s/圈），不抢文案。
3. **不循环跳帧**：不再使用首尾接不上的视频循环。
4. **尊重系统设置**：`prefers-reduced-motion: reduce` 时所有装饰动画停止；地球渲染单张静帧（弧线、上海标签仍可见）。
5. **离屏即停**：canvas / WebGL 动画在离开视口或标签页隐藏时暂停。

---

## 9. 首页 Hero 体系

### 9.1 为什么重做

旧 Hero 背景是一段 AI 生成的 15 秒视频（`hero-globe.mp4`，1.3 MB）。问题：
- 大陆轮廓逐帧**变形**，地球位置左右漂移，轨道环忽粗忽细；
- 循环首尾**接不上**，每 15 秒跳一次；
- 视频 `object-cover` 裁切后，轨道环会**横穿标题文字**（「…创客大会」被划过）；
- 地球烘焙在视频里，无法响应布局、交互或语言切换。

新方案把地球「抠」出来：背景变成一张静态底图（plate），地球改为代码实时渲染的 **Glass Globe** 组件，按布局放到基座上。

### 9.2 分层结构（由下到上）

```
<section.doa-hero>                 天空渐变底色（plate 没覆盖到的地方）
 └ HeroGlobeStage (absolute)
    ├ img.doa-hero-plate           底图：天空 + 外滩天际线 + 玻璃平台 + 空基座（边缘羽化）
    ├ div.doa-hero-veil            白色提亮层：移动端自上而下、桌面端自左向右
    ├ div.doa-globe-caustic        基座顶面上的蓝色焦散光（与悬浮同步呼吸）
    └ div.doa-globe-float          7s 上下悬浮 ±4px
       └ GlassGlobe                地球本体（3 层 canvas）
 ├ 文案 (relative z-10)            pointer-events 只在文案块上开启，地球可拖拽
 └ 底部白色渐隐 (z-10)
```

### 9.3 布局算法（`HeroGlobeStage.tsx → computeLayout`）

先决定**地球放哪、多大**，再把 plate 缩放平移到「基座正好在地球下面」——而不是让底图 `object-cover` 然后祈祷不撞字。

- **桌面（≥1024px）**：测量文案块右边界 → 右侧空白区 = 文案右侧 28px 起，到内容栏右缘 +100px（不超过视口 −20px）；
  半径 `r = clamp(120, 可用宽 / (2 × 1.42), 段高 × 0.27, 250)`，1.42 是外轨道的水平伸展；
  地球水平居中于空白区，垂直与文案中线对齐，但保证基座在底部渐隐和快捷入口卡片之上。
- **移动 / 平板（<1024px）**：文案下方放一个占位块 `.doa-hero-globe-spacer`（高 = 3r，`r = clamp(118px, 30vw, 180px)`），地球水平居中放进去。
- **Plate 对齐**：缩放比 `s = r / 245`，`left = cx − 1182·s`，`top = cy − 603·s`（数字见 `PLATE` 常量，单位是底图像素）。底图四边用 mask 羽化到天空底色，所以任何比例下都不会露出硬边。
- 时序：底图解码完成后淡入（700ms），地球随后挂载并开始入场，避免地球落在空白天空上。

### 9.4 Glass Globe 组件

位置：`src/components/globe/`

| 文件 | 职责 |
| --- | --- |
| `GlassGlobe.tsx` | React 外壳：尺寸、离屏暂停、拖拽 / 视差、减弱动效、WebGL 不可用时的静态图兜底 |
| `GlassGlobeEngine.ts` | 渲染引擎（无框架依赖）：WebGL 片元着色器画球体，2D canvas 画轨道 / 弧线 / 标记 |
| `geo.ts` | 坐标系、城市数据、投影（着色器做的是同一套变换的逆运算，保证标记与像素对齐） |
| `landTexture.ts` | 由 `src/data/earthMask.ts`（Natural Earth 50m 海岸线）生成平滑的陆地纹理 |

**三层 canvas 解决遮挡**：后层 2D（轨道后半圈）→ WebGL 球体 → 前层 2D（轨道前半圈、卫星、弧线、城市）。不需要 3D 引擎和深度缓冲，体积约 12 KB（gzip）。

**用法**

```tsx
import { GlassGlobe, globeBoxForRadius } from '@/src/components/globe/GlassGlobe';

<div style={{ width: globeBoxForRadius(220) }}>   {/* 球半径 220px，外圈留给轨道 */}
  <GlassGlobe hostLabel={tr('上海 · 外滩', 'Shanghai · The Bund')} />
</div>
```

Props：`host` / `cities`（默认上海 → 香港、新加坡、佛罗伦萨、硅谷）、`hostLabel`、`spinSeconds`（72）、`startLon`（150°E）、`tilt`（14°）、`roll`（−16°）、`rings`、`arcs`、`interactive`、`appearDelay`、`still`、`ariaLabel`。

**视觉参数**

| 项 | 取值 | 说明 |
| --- | --- | --- |
| 盒子 / 球 | 盒边长 = 2 × 1.55 × r | WebGL 画布只覆盖 ±1.22r（球 + 大气），省像素 |
| 光源 | 右上前方 `(0.6, 0.6, 0.53)` | 与底图原片里地球的高光方向一致 |
| 点阵 | 纬向每 2° 一行，每行点数按周长分配，点半径 0.5° | 极地不会挤成一团；陆地点按「点中心是否在陆地」整颗判定，不被海岸线切开 |
| 玻璃感 | 菲涅尔白边、左上天空反光弧、右下虹彩、球内对侧焦散、背面大陆透过玻璃（镜像、更淡）、细亮边 | 球体不透明度 0.93→1（边缘） |
| 自转 | 72s/圈，**自西向东**（与真实地球一致） | 入场时 6 倍速，2.8s 内缓降到巡航速度 |
| 姿态 | 北极前倾 14°、轴向右倾 16° | 像桌面地球仪，能多看到北半球 |
| 轨道 A | 半径 1.36r，张角 13°，倾 −11°，卫星 18s/圈 | 蓝 → 紫 → 粉 |
| 轨道 B | 半径 1.20r，张角 10°，倾 64°，卫星 13s/圈（反向） | 与 A 交叉，原子意象 |
| 城市弧线 | 大圆弧，越远飞得越高（抬升 0.06–0.36r） | 每条 3.6s 发一次彗星脉冲，落地涟漪 |
| 上海信标 | 白芯 + 蓝描边，两圈贴球面的涟漪（2.4s） + 跟随标签「上海 · 外滩」 | 转到背面时淡出 |

**入场时间线**（相对地球挂载）：0.12s 开始淡入（1.3s，easeOutCubic）→ 0.37s 轨道开始绘出（1.6s）→ 卫星在轨道画完后出现 → 1.2–2.3s 弧线与信标淡入 → 进入巡航。基座焦散 0.45s 后淡入。

**交互**：水平拖拽转动（拖一个半径 ≈ 转 1 弧度），松手有惯性；鼠标在页面上移动时有轻微视差（经度 ±7°、前倾 ±5°）；移动端 `touch-action: pan-y`，不影响上下滚动。

**性能与兜底**：DPR 上限 2；离屏 / 标签页隐藏时暂停；单帧 dt 上限 50ms（切回标签页不跳）；WebGL 不可用或上下文丢失时显示 `glass-globe-fallback.webp`（同一组件导出的静帧，用 Lab 的透明背景 + 静帧导出）；改 props 走 `engine.update()`，不会重建 GL 上下文；`role="img"` + `aria-label`。

### 9.5 调参：Globe Lab

开发模式下打开 `http://localhost:3000/lab/globe.html`（`npm run dev:web` 即可，不进生产构建）：
滑杆调尺寸、前倾、侧倾、自转周期、起始经度；开关轨道 / 弧线 / 静帧；切换背景（底图 / 白纸 / 墨蓝 / 透明）；「重播入场」。
当前参数会生成一条分享链接，例如 `/lab/globe.html?size=720&tilt=14&roll=-16&spin=72&lon=150&rings=1&arcs=1&bg=plate&still=0`，调好后发给开发把默认值写回 `GlassGlobe.tsx`。

更细的着色（颜色、光感）在 `GlassGlobeEngine.ts` 的 `FRAG` 着色器里，每段都有注释。

开发模式下 `window.__glassGlobe.seek(秒)` 可以逐帧定格（用于录屏、截图），生产构建里不存在。

### 9.6 底图（plate）怎么来的 / 怎么重建

`scripts/hero-plate/build_plate.py`（需要 ffmpeg、numpy、pillow、opencv-python-headless）：
1. 对旧视频所有帧取**时域中值**：轨道和卫星一直在动，中值里就消失了，只剩下始终不动的地球圆盘；
2. 用高清首帧海报做底，凡与中值差异大的像素（轨道）换成中值；
3. 地球圆盘区域：天空部分用两侧颜色平滑插值，天际线部分从左右两侧**平移**借楼（保持楼是竖直的），中间用一段雾化带过渡。

产物 `src/assets/images/hero-plate.webp`（1916×1080，约 55 KB）。旧视频与海报保留在 `scripts/hero-plate/source/` 作为素材源。
**换底图时**：同步更新 `HeroGlobeStage.tsx` 里的 `PLATE` 常量（基座中心 x、顶面 y / 半宽 / 半高、地球设计半径与中心 y）。

### 9.7 Hero 的 Do / Don't

- ✅ 文案在左、地球在右（移动端在下）；地球与文案之间保持 ≥28px 空隙，轨道不压字。
- ✅ 新增城市先想「讲什么故事」，弧线总数控制在 4–5 条以内。
- ✅ 改色只在 §3.4 的范围内调，保持「品牌蓝球 + 白色大陆 + 蓝粉轨道」。
- ❌ 不要把地球重新做回视频 / GIF；不要在地球上叠大段文字（旧版 "AI Connects the World" 已移除）。
- ❌ 不要加第三条轨道、粒子雨、扫描线之类的特效——高级感来自克制。

---

## 10. 资产清单

| 资产 | 位置 | 用在 | 备注 |
| --- | --- | --- | --- |
| Hero 底图 | `src/assets/images/hero-plate.webp` | 首页 Hero | 55 KB，由脚本生成 |
| 地球兜底图 | `src/assets/images/glass-globe-fallback.webp` | WebGL 不可用时 | 仅在需要时下载 |
| 主视觉海报 | `src/assets/images/hero_poster_doai2026.png` | 设计参考（未引用） | 地球、轨道、城市卡片的原始设定 |
| 活动亮点 / 城市图 | `src/assets/images/*_17909*.jpg` | 首页亮点卡、直播页等 | 每张 0.7–1.2 MB，偏大，见 §11 |
| Logo | `DoAiLogo.tsx`（SVG）/ `doai_logo.png` | Hero / 导航 | Hero 用代码版，导航用 PNG |
| 陆地数据 | `src/data/earthMask.ts` | Glass Globe / 旧 ASCII 地球 | `node scripts/generate-earth-mask.mjs` 重建 |

---

## 11. 已知问题与待办

| # | 问题 | 建议 |
| --- | --- | --- |
| 1 | 字体走 Google Fonts，大陆访问不稳定，回落字体会让数字、字距明显变样（尤其 `font-mono` 日期） | 自托管 Plus Jakarta Sans / Inter / JetBrains Mono 的 woff2 子集 |
| 2 | 大量硬编码旧灰色（`#E8EAED` `#666` `#888` `#F7F8FA`）与 token 并存 | 改到哪换到哪，统一到 §3.1 |
| 3 | 首页活动亮点等 JPG 每张约 1 MB | 转 WebP、按卡片尺寸导出（预计每张 ≤150 KB） |
| 4 | Hero 日期行在 390px 宽会断成「· 共 / 3 天」；英文模式下日期仍是中文「周五 / 周日」 | 日期行分段 `whitespace-nowrap`，周几走 `tr()` |
| 5 | 大会日期口径待确认（代码 TODO：11.13–11.15 vs 11.27–11.29） | 运营确认后统一改 |
| 6 | 遗留未引用组件：`common/AsciiGlobe.tsx`、`common/AiHorizonGlobe.tsx`，以及 `index.css` 里的 `doa-ascii-globe` `doa-globe-halo` `doa-city-card` `doa-card-float*` `doa-hero-grid` | 确认不再回滚后删除 |
| 7 | 1024–1180px 宽度时地球偏小（r≈120） | 可考虑该区间改为上下布局 |
| 8 | README 仍是 AI Studio 模板 | 改写为项目说明，并链接本文档 |

---

## 12. 变更记录

| 日期 | 改动 | 涉及 |
| --- | --- | --- |
| 2026-10-18 | 首页 Hero 地球重做：视频 → 静态底图 + 代码渲染 Glass Globe；新增 Globe Lab；建立本文档 | `HeroGlobeStage.tsx`、`components/globe/*`、`index.css`、`scripts/hero-plate/`、`lab/` |
| 2026-10-16 | Hero 背景换为地球循环视频，移除 ASCII 地球 | `HomeView.tsx`（commit `2939f76`） |
