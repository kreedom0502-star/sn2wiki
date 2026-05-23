# 部署准备

本站是纯静态 HTML/CSS/JS 项目，可以部署到 Cloudflare Pages、GitHub Pages、Netlify 或任意静态文件服务器。当前建议优先使用 Cloudflare Pages。

## 本地命令

```bash
node tools/static-server.mjs 4173
node tools/validate-site.mjs
node tools/build-static.mjs
```

如果 `npm run` 可用，也可以使用：

```bash
npm run preview
npm run check
npm run build
```

如果 Windows 上 `npm run` 因 Git Bash 权限报错，直接使用上面的 Node 命令即可。

## 域名命令

当前免费部署域名：

```text
https://sn2wiki.pages.dev
```

以后如果切换到正式域名，例如 `https://sn2wiki.com`：

```bash
node tools/set-site-url.mjs https://sn2wiki.com
node tools/validate-site.mjs --strict-domain
```

如果 `npm run` 可用：

```bash
npm run set-site-url -- https://sn2wiki.com
npm run check:deploy
```

## Cloudflare Pages 设置

Cloudflare Pages 不应该直接发布仓库根目录。请使用构建目录：

```text
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: /
Production branch: main
```

如果 Cloudflare 的 npm 环境异常，也可以把 Build command 改成：

```text
node tools/build-static.mjs
```

部署前确认：

- `dist/index.html` 会由构建脚本生成。
- `dist/404.html` 会由构建脚本生成。
- `dist/robots.txt` 会由构建脚本生成。
- `dist/sitemap.xml` 会由构建脚本生成。
- `dist/assets/` 和 `dist/guides/` 会由构建脚本生成。

## GitHub Pages 备选

GitHub Pages 如果直接发布根目录，不需要 `dist`。但为了和 Cloudflare 保持一致，也可以使用 GitHub Actions 构建后发布 `dist`。当前阶段优先走 Cloudflare Pages。

## 上线检查清单

1. 提交当前分支全部改动。
2. 执行 `node tools/validate-site.mjs --strict-domain`。
3. 执行 `node tools/build-static.mjs`。
4. 本地确认 `dist/` 生成。
5. 推送到 GitHub。
6. Cloudflare Pages 设置 Build command 为 `npm run build`。
7. Cloudflare Pages 设置 Build output directory 为 `dist`。
8. 部署后访问 `/robots.txt` 和 `/sitemap.xml`。
9. 部署后访问首页、地图页、攻略索引和任意攻略页。
