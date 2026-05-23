# Subnautica 2 中文资料库

第一阶段目标：先搭出可维护的静态资料库骨架，再逐步填充实测内容。

## 本地预览

```bash
node tools/static-server.mjs 4173
```

打开：

```text
http://127.0.0.1:4173/
```

## 目录

```text
index.html                首页与全站搜索入口
map.html                  互动地图
resources.html            资源位置
blueprints.html           蓝图位置
recipes.html              合成配方
updates.html              EA 更新日志中文整理
guides/                   攻略文章
assets/data/              资源、蓝图、配方、地图点位 JSON
assets/css/style.css      全站样式
assets/js/main.js         搜索、筛选、地图点位渲染
docs/data-schema.md       数据结构规范
docs/guide-template.md    攻略文章模板
```

## 内容原则

- 每篇攻略标注适用版本、最后验证时间和资料状态。
- 资源、蓝图、配方和地图点位优先写成结构化数据。
- 新增或修改资料时，优先遵循 `docs/data-schema.md`。
- 新增攻略文章时，优先遵循 `docs/guide-template.md`。
- 未实测内容只保留为样例或待验证，不写成确定坐标。
- 官方 EA 更新后，先更新 `updates.html`，再标记受影响页面。
