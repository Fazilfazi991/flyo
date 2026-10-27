const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
fs.mkdirSync(path.join(root,'vendor'),{recursive:true});
esbuild.buildSync({ stdin:{contents:'export { createClient } from "@supabase/supabase-js";',resolveDir:root},bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:path.join(root,'vendor/supabase.js'),minify:true,legalComments:'eof' });
