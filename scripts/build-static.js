const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");
require('./build-chat.js');

const entries = [
  "index.html",
  "experiences.html",
  "contact",
  "admin",
  "chat",
  "faq",
  "vendor",
  "visa-services",
  "styles.css",
  "currency.js",
  "whatsapp-chooser.js",
  "navbar.js",
  "script.js",
  "package.css",
  "package.js",
  "footer-animations.css",
  "footer-animations.js",
  "favicon.svg",
  "social_icons_svg_pack",
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

if (path.dirname(outDir) !== root || path.basename(outDir) !== 'dist') throw new Error('Unsafe build output path.');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of entries) {
  copyRecursive(path.join(root, entry), path.join(outDir, entry));
}

// Environment overrides are browser-safe public configuration only. Build never
// reads or emits service credentials or the other environment variables.
const url = process.env.SUPABASE_URL;
const publicKey = process.env.SUPABASE_ANON_KEY;
if (Boolean(url) !== Boolean(publicKey)) throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY together.');
if (url && publicKey) {
  const parsed = new URL(url);
  if (!['https:','http:'].includes(parsed.protocol)) throw new Error('Invalid Supabase URL.');
  let browserKey = publicKey.startsWith('sb_publishable_');
  if (!browserKey && publicKey.split('.').length === 3) {
    try { browserKey = JSON.parse(Buffer.from(publicKey.split('.')[1], 'base64url').toString()).role === 'anon'; } catch {}
  }
  if (!browserKey) throw new Error('SUPABASE_ANON_KEY must be a publishable or anon key. Never supply a secret/service role key.');
  const file=path.join(outDir,'data/supabase-config.js');
  const source=fs.readFileSync(file,'utf8').replace(/export const SUPABASE_URL = .*?;/,`export const SUPABASE_URL = ${JSON.stringify(url)};`)
    .replace(/export const SUPABASE_ANON_KEY = .*?;/,`export const SUPABASE_ANON_KEY = ${JSON.stringify(publicKey)};`);
  fs.writeFileSync(file,source);
}

const { pathToFileURL } = require('node:url');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
import(pathToFileURL(packageDataSource).href).then(({ packages }) => {
  const template = fs.readFileSync(packageTemplate,'utf8');
  for (const item of packages) {
    const { slug } = item;
    let html = template;
    if (item.sourceBrief) {
      // These details are present in the HTML response as well as the JS render.
      html=html.replace('<title>Package | Flyo Tours &amp; Travels</title>',`<title>${escapeHtml(item.title)} | Flyo Tours &amp; Travels</title>`)
        .replace('<title>Package | Flyo Tours & Travels</title>',`<title>${escapeHtml(item.title)} | Flyo Tours &amp; Travels</title>`)
        .replace('content="Flyo Tours &amp; Travels package detail page."',`content="${escapeHtml(item.summary)}"`)
        .replace('content="Flyo Tours & Travels package detail page."',`content="${escapeHtml(item.summary)}"`)
        .replace('<h1 id="heroTitle"></h1>',`<h1 id="heroTitle">${escapeHtml(item.title)}</h1>`)
        .replace('<p id="heroSubtitle"></p>',`<p id="heroSubtitle">${escapeHtml(item.summary)}</p>`);
    }
    const directory=path.join(outDir,'packages',slug);
    fs.mkdirSync(directory,{recursive:true});
    fs.writeFileSync(path.join(directory,'index.html'),html);
    fs.writeFileSync(path.join(outDir,'packages',`${slug}.html`),html);
  }
  console.log(`Static site built to ${path.relative(root,outDir)} (${packages.length} packages)`);
}).catch(error=>{ console.error(error);process.exitCode=1; });
