const {spawnSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
function check(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name.startsWith('.')||['node_modules','vendor','dist','public','flyo_svg_icon_pack','social_icons_svg_pack'].includes(entry.name))continue;
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())check(file);
    else if(/\.(js|mjs)$/.test(file)){const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status){console.error(r.stderr);process.exitCode=1;}}
  }
}
check(process.cwd());
if(!process.exitCode)console.log('JavaScript syntax checks passed.');
