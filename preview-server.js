const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'};
if(!fs.existsSync(path.join(root,'index.html')))throw new Error('Build first: pnpm build');
const server=http.createServer((request,response)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);}catch{response.writeHead(400).end('Invalid URL');return;}
  if(pathname.split('/').some(segment=>segment.startsWith('.'))||/\.(env|sql)$/i.test(pathname)){response.writeHead(403).end('Forbidden');return;}
  const resolved=path.resolve(root,'.'+pathname);
  if(resolved!==root&&!resolved.startsWith(root+path.sep)){response.writeHead(403).end('Forbidden');return;}
  const candidates=[resolved,path.join(resolved,'index.html'),resolved+'.html'];
  const file=candidates.find(candidate=>{try{return fs.statSync(candidate).isFile();}catch{return false;}});
  if(!file){response.writeHead(404).end('Not found');return;}
  response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(response);
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log(`Flyo preview: http://127.0.0.1:${server.address().port}`));
