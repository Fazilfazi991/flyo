import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { packages } from '../data/packages.js';
import { groupPackages } from '../data/group-packages.js';

test('four unique new packages retain the nineteen existing packages',()=>{
  assert.equal(groupPackages.length,4);assert.equal(packages.length,23);
  assert.equal(new Set(packages.map(p=>p.slug)).size,packages.length);
  assert.equal(packages.filter(p=>p.slug==='japan-tokyo-osaka').length,1);
  assert.equal(packages.find(p=>p.slug==='thai-wonders').price,'AED 999');
  assert.deepEqual(groupPackages.map(p=>p.itinerary.length),[5,8,10,5]);
});
test('commercial uncertainties are visible, without inferred prices or years',()=>{
  const [thailand,japan,scandinavia,finland]=groupPackages;
  assert.match(thailand.availability,/02 December 2026/);
  assert.match(thailand.schedule[1].label,/03 Dec 2026/);
  assert.equal(thailand.price,'AED 3699');assert.equal(thailand.pricingOptions[1].price,'AED 3899');
  assert.match(thailand.importantInfo.join(' '),/return flights on 03 December/);
  assert.match(japan.exclusions.join(' '),/Airfare/);assert.match(japan.policySections[0].items[0],/Details to be confirmed/);
  assert.match(scandinavia.schedule[0].label,/TBA/);
  assert.equal(finland.price,'Price on request');assert.equal(finland.availability,'28 Nov – 02 Dec');
  assert.match(finland.importantInfo.join(' '),/deposit is not the package price/);
  assert.match(finland.policySections[1].items.join(' '),/Northern Lights not guaranteed/);
});
test('all new package images exist locally and are optimized WebP assets',()=>{
  for(const p of groupPackages){
    assert.ok(p.heroAlt?.length>20);
    const sources=[p.heroImage,p.cardImage,...p.galleryImages.map(i=>i.src),...p.itinerary.flatMap(d=>d.images)];
    for(const src of sources){
      const file=path.join(process.cwd(),src);assert.ok(fs.existsSync(file),`Missing ${src}`);
      assert.ok(fs.statSync(file).size<600_000,`Oversized asset ${src}`);
      const bytes=fs.readFileSync(file);assert.equal(bytes.subarray(8,12).toString(),'WEBP');
    }
  }
});
test('production build includes all new routes with source-specific SEO text',()=>{
  for(const p of groupPackages){
    const html=fs.readFileSync(`dist/packages/${p.slug}/index.html`,'utf8');
    assert.ok(html.includes(p.title.replaceAll('&','&amp;')));
    assert.ok(!html.includes('<title>Package |'));
    assert.ok(html.includes(p.summary.replaceAll('&','&amp;')));
    assert.ok(fs.existsSync(`dist/packages/${p.slug}.html`));
  }
  assert.ok(fs.existsSync('dist/chat/widget.js'));
  assert.ok(fs.existsSync('dist/admin/live-chat/index.html'));
});
