// Runs every real-browser probe in tests/fixtures against a fresh local build.
// npm run probes   (PLAYWRIGHT_MODULE=/abs/path/playwright/index.mjs if playwright is not installed here)
import {createServer} from 'node:http';
import {readFile,stat,readdir} from 'node:fs/promises';
import {extname,join,normalize} from 'node:path';
import {spawn} from 'node:child_process';
const OUT='out',TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.glb':'model/gltf-binary','.mp3':'audio/mpeg','.txt':'text/plain'};
const server=createServer(async(req,res)=>{
 try{const p=normalize(decodeURIComponent(new URL(req.url,'http://x').pathname)).replace(/^(\.\.[/\\])+/,'');let f=join(OUT,p);if((await stat(f)).isDirectory())f=join(f,'index.html');res.writeHead(200,{'content-type':TYPES[extname(f)]??'application/octet-stream','cache-control':'no-store'});res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}`;
const stamp=await readFile(join(OUT,'build.json'),'utf8');
const served=await fetch(BASE+'/build.json').then(res=>res.text());
if(served!==stamp)throw new Error('Probe server is not serving the built tree');
console.log('Testing build '+JSON.parse(stamp).build);
const only=process.argv.slice(2),probes=(await readdir('tests/fixtures')).filter(f=>f.endsWith('-probe.mjs')&&(!only.length||only.some(o=>f.includes(o))));
if(!probes.length){console.error('no probes matched');process.exit(1);}
let failed=0;
for(const f of probes){const t=Date.now();const code=await new Promise(r=>{const c=spawn(process.execPath,['tests/fixtures/'+f],{env:{...process.env,BASE},stdio:['ignore',process.env.VERBOSE?'inherit':'ignore','pipe']});let err='';c.stderr.on('data',d=>err+=d);const kill=setTimeout(()=>c.kill('SIGKILL'),180000);c.on('error',()=>r(1));c.on('close',(exit,sig)=>{clearTimeout(kill);const code=exit??(sig?128:1);if(code)console.error(err.split('\n').filter(l=>!/ExperimentalWarning|trace-warnings/.test(l)).slice(0,12).join('\n'));r(code);});});
 if(await readFile(join(OUT,'build.json'),'utf8')!==stamp)throw new Error('Build changed during browser probes');
 console.log(`${code?'✖':'✔'} ${f} (${Date.now()-t} ms)`);if(code)failed++;}
server.close();console.log(`${probes.length-failed} of ${probes.length} probes pass`);process.exit(failed?1:0);
