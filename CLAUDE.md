# DOAI 官网 · 协作约定

- 做任何 UI 改动前先读 `docs/DESIGN_SYSTEM.md`（色彩 token、`doa-*` 组件类、动效原则、首页 Hero / Glass Globe 规范）。
- UI 改动完成后同步更新该文档的相关章节，并在「变更记录」追加一行；发现的不一致记到「已知问题与待办」。
- 所有可见文案走 `tr('中文', 'English')`。
- 新代码颜色用 `@theme` token（`doa-*` / `ink-*` / `line` / `surface`），不要新增硬编码色值。
- 校验：`npx tsc --noEmit`、`npx vite build`；首页地球可在 `/lab/globe.html`（开发模式）单独调试。
