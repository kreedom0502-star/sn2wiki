import { readFileSync, writeFileSync } from "node:fs";

const nextUrl = process.argv[2]?.replace(/\/$/, "");
const placeholder = "https://subnautica2-cn.example.com";

if (!nextUrl || !/^https:\/\/[^/]+/.test(nextUrl)) {
  console.error("Usage: npm run set-site-url -- https://your-domain.com");
  process.exit(1);
}

const seoPath = "assets/data/seo.json";
const seo = JSON.parse(readFileSync(seoPath, "utf8"));
const previousUrl = seo.siteUrl || placeholder;
seo.siteUrl = nextUrl;
writeFileSync(seoPath, `${JSON.stringify(seo, null, 2)}\n`, "utf8");

function replacePreviousInFile(filePath) {
  const original = readFileSync(filePath, "utf8");
  const next = original.replaceAll(previousUrl, nextUrl).replaceAll(placeholder, nextUrl);
  writeFileSync(filePath, next, "utf8");
}

replacePreviousInFile("robots.txt");
replacePreviousInFile("sitemap.xml");

console.log(`Site URL updated to ${nextUrl}`);
