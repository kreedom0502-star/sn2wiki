import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, sep } from "node:path";

const root = process.cwd();
const strictDomain = process.argv.includes("--strict-domain");
const htmlFiles = [];
const ignoredDirectories = new Set([".git", "dist", "node_modules"]);
const dataFiles = [
  "assets/data/resources.json",
  "assets/data/blueprints.json",
  "assets/data/recipes.json",
  "assets/data/map-points.json",
  "assets/data/updates.json",
  "assets/data/seo.json"
];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (ignoredDirectories.has(name)) continue;
    const fullPath = join(directory, name);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
}

function toSitePath(filePath) {
  return relative(root, filePath).split(sep).join("/").replace(/^\.\//, "");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function validateDataFiles() {
  for (const filePath of dataFiles) {
    assert(existsSync(filePath), `Missing data file: ${filePath}`);
    const data = parseJson(filePath);
    if (filePath !== "assets/data/seo.json") {
      assert(Array.isArray(data.records), `${filePath} must contain records[]`);
    }
  }
}

function validateHtmlReferences() {
  const refs = [];
  const refPattern = /\b(?:href|src)="([^"]+)"/g;

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, "utf8");
    for (const match of html.matchAll(refPattern)) {
      const url = match[1];
      if (url.startsWith("http") || url.startsWith("#") || url.startsWith("mailto:")) continue;
      const targetPath = url.split("#")[0];
      if (!targetPath) continue;
      const resolved = normalize(join(dirname(filePath), targetPath));
      if (!existsSync(resolved)) {
        refs.push(`${filePath} -> ${url}`);
      }
    }
  }

  assert(refs.length === 0, `Missing local references:\n${refs.join("\n")}`);
}

function validateSeoCoverage() {
  const seo = parseJson("assets/data/seo.json");
  const pages = Object.keys(seo.pages || {});
  const sitePaths = htmlFiles
    .filter((filePath) => !filePath.endsWith(`${sep}404.html`) && filePath !== "404.html")
    .map(toSitePath);

  const missingHtml = sitePaths.filter((page) => !seo.pages[page]);
  const missingFiles = pages.filter((page) => !existsSync(page));

  assert(missingHtml.length === 0, `HTML pages missing from seo.json:\n${missingHtml.join("\n")}`);
  assert(missingFiles.length === 0, `seo.json pages missing files:\n${missingFiles.join("\n")}`);
}

function validateSitemap() {
  const seo = parseJson("assets/data/seo.json");
  const sitemap = readFileSync("sitemap.xml", "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const pageCount = Object.keys(seo.pages || {}).length;

  assert(locs.length === pageCount, `sitemap URL count ${locs.length} does not match seo.json page count ${pageCount}`);
  const hasPlaceholder =
    sitemap.includes(".example.com") ||
    readFileSync("robots.txt", "utf8").includes(".example.com") ||
    JSON.stringify(seo).includes(".example.com");

  if (strictDomain) {
    assert(!hasPlaceholder, "SEO files still contain example.com placeholder domain");
  } else if (hasPlaceholder) {
    console.warn("Warning: SEO files still contain example.com placeholder domain. Run check:deploy before publishing.");
  }
}

function validateSeoScript() {
  const missing = htmlFiles
    .filter((filePath) => !filePath.endsWith(`${sep}404.html`) && filePath !== "404.html")
    .filter((filePath) => !readFileSync(filePath, "utf8").includes("assets/js/seo.js"));

  assert(missing.length === 0, `HTML pages missing seo.js:\n${missing.join("\n")}`);
}

try {
  walk(root);
  validateDataFiles();
  validateHtmlReferences();
  validateSeoCoverage();
  validateSitemap();
  validateSeoScript();
  console.log(`Site check passed: ${htmlFiles.length} HTML files`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
