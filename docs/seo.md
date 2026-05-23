# SEO 基础设施

当前 SEO 配置以 `assets/data/seo.json` 为中心，配合 `assets/js/seo.js` 注入 canonical、Open Graph、Twitter Card 和 JSON-LD。

## 当前站点域名

当前免费部署域名：

```text
https://sn2wiki.pages.dev
```

如果以后购买正式域名，例如：

```text
https://sn2wiki.com
```

需要同时替换：

- `assets/data/seo.json` 里的 `siteUrl`
- `robots.txt` 里的 `Sitemap`
- `sitemap.xml` 里的所有 `<loc>`

可以使用项目脚本统一替换：

```bash
node tools/set-site-url.mjs https://sn2wiki.com
node tools/validate-site.mjs --strict-domain
```

## 页面元信息规则

- 首页标题：品牌名 + 核心卖点。
- 工具页标题：功能名 + 品牌名。
- 攻略页标题：`Subnautica 2 + 搜索问题 + 具体价值`。
- 描述控制在 60-120 个中文字符，先写搜索意图，再写页面内容。
- 每个新增 HTML 页面都要补进 `assets/data/seo.json` 和 `sitemap.xml`。

## 结构化数据

`assets/js/seo.js` 会根据页面路径注入：

- `WebSite` / `WebPage` / `CollectionPage` / `Article`
- `BreadcrumbList`
- canonical
- Open Graph
- Twitter Card

## 收录准备

上线后建议按顺序做：

1. 替换正式域名。
2. 检查 `sitemap.xml` 可以访问。
3. 检查 `robots.txt` 指向正式 sitemap。
4. 提交到 Google Search Console。
5. 提交到 Bing Webmaster Tools。
6. 百度站长平台手动提交首页和高价值页面。
