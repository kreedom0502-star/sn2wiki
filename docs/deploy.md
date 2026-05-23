# 部署准备

本站是纯静态 HTML/CSS/JS 项目，可以部署到 Cloudflare Pages、GitHub Pages、Netlify 或任意静态文件服务器。当前建议优先使用 Cloudflare Pages。

## 本地命令

```bash
npm run preview
npm run check
```

如果 Windows 上 `npm run` 因 Git Bash 权限报错，可以直接运行底层 Node 命令：

```bash
node tools/static-server.mjs 4173
node tools/validate-site.mjs
```

上线前替换真实域名：

```bash
npm run set-site-url -- https://your-domain.com
npm run check:deploy
```

对应的直接 Node 命令是：

```bash
node tools/set-site-url.mjs https://your-domain.com
node tools/validate-site.mjs --strict-domain
```

`check:deploy` 会严格检查 `assets/data/seo.json`、`robots.txt`、`sitemap.xml` 里是否还残留 `.example.com` 占位域名。

## Cloudflare Pages 建议

- Framework preset：None / Static HTML
- Build command：留空，或仅在需要校验时使用 `npm run check:deploy`
- Build output directory：项目根目录
- Node version：使用平台默认即可，本项目无安装依赖

部署前确认：

- `index.html` 在项目根目录。
- `404.html` 在项目根目录。
- `robots.txt` 可以访问。
- `sitemap.xml` 可以访问。
- 所有页面已挂 `assets/js/seo.js`。

## GitHub Pages 建议

- Source：当前分支或发布分支。
- Folder：项目根目录。
- 不需要构建步骤。
- 自定义域名时，部署后再把真实域名同步到 SEO 文件。

## 上线检查清单

1. 提交当前分支全部改动。
2. 确定正式域名。
3. 执行 `npm run set-site-url -- https://your-domain.com`。
4. 执行 `npm run check:deploy`。
5. 本地打开首页、地图页、攻略索引和任意攻略页。
6. 部署到静态托管平台。
7. 访问线上 `/robots.txt` 和 `/sitemap.xml`。
8. 提交 sitemap 到 Google Search Console 和 Bing Webmaster Tools。

## 回滚提醒

如果正式域名填错，可以重新执行：

```bash
npm run set-site-url -- https://correct-domain.com
```

脚本会根据 `assets/data/seo.json` 里的旧域名替换 `robots.txt` 和 `sitemap.xml`。
