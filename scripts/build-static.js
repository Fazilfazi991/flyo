const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");

const entries = [
  "index.html",
  "experiences.html",
  "styles.css",
  "script.js",
  "package.css",
  "package.js",
  "footer-animations.css",
  "footer-animations.js",
  "favicon.svg",
  "data",
  "flights",
  "packages",
  "public"
];

const packageDataSource = path.join(root, "data", "packages.js");
const packageTemplate = path.join(root, "packages", "detail.html");

function copyRecursive(source, target) {
  if (!fs.existsSync(source)) {
    return;
  }
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const child of fs.readdirSync(source)) {
      copyRecursive(path.join(source, child), path.join(target, child));
    }
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of entries) {
  copyRecursive(path.join(root, entry), path.join(outDir, entry));
}

const packageSource = fs.readFileSync(packageDataSource, "utf8");
const slugs = [...packageSource.matchAll(/slug:\s*"([^"]+)"/g)].map(match => match[1]);

for (const slug of slugs) {
  copyRecursive(packageTemplate, path.join(outDir, "packages", slug, "index.html"));
  copyRecursive(packageTemplate, path.join(outDir, "packages", `${slug}.html`));
}

console.log(`Static site built to ${path.relative(root, outDir)}`);
