import { chmodSync, copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const outDir = join(root, "dist");

const rootFiles = [
  "index.html",
  "map.html",
  "resources.html",
  "blueprints.html",
  "recipes.html",
  "updates.html",
  "404.html",
  "robots.txt",
  "sitemap.xml"
];

const directories = ["assets", "guides"];

function copyFile(source, destination) {
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
}

function copyDirectory(source, destination) {
  mkdirSync(destination, { recursive: true });
  for (const name of readdirSync(source)) {
    const sourcePath = join(source, name);
    const destinationPath = join(destination, name);
    const stats = statSync(sourcePath);
    if (stats.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      copyFile(sourcePath, destinationPath);
    }
  }
}

function removePath(target) {
  try {
    chmodSync(target, 0o777);
  } catch {
    // Ignore permission normalization failures; rmSync still handles most cases.
  }

  try {
    rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  } catch (error) {
    console.warn(`Could not remove ${target}; continuing with overwrite build.`);
    console.warn(error.message);
  }
}

function cleanOutputDirectory() {
  mkdirSync(outDir, { recursive: true });

  if (!existsSync(outDir)) {
    return;
  }

  for (const name of readdirSync(outDir)) {
    removePath(join(outDir, name));
  }
}

cleanOutputDirectory();

for (const file of rootFiles) {
  copyFile(join(root, file), join(outDir, file));
}

for (const directory of directories) {
  copyDirectory(join(root, directory), join(outDir, directory));
}

console.log(`Static site built in ${outDir}`);
