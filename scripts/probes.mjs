// Runs every real-browser probe against the local build or a matching hosted preview.
// npm run probes   (PLAYWRIGHT_MODULE=/abs/path/playwright/index.mjs if playwright is not installed here)
import {createServer} from 'node:http';
import {readFile,stat,readdir,mkdir,writeFile} from 'node:fs/promises';
import {extname,join,normalize} from 'node:path';
import {spawn} from 'node:child_process';
const OUT='out',TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.glb':'model/gltf-binary','.mp3':'audio/mpeg','.txt':'text/plain'};
const server=createServer(async(req,res)=>{
 try{const p=normalize(decodeURIComponent(new URL(req.url,'http://x').pathname)).replace(/^(\.\.[/\\])+/,'');let f=join(OUT,p);if((await stat(f)).isDirectory())f=join(f,'index.html');res.writeHead(200,{'content-type':TYPES[extname(f)]??'application/octet-stream','cache-control':'no-store'});res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
const hosted=process.env.LIFE_PROBE_BASE;
if(!hosted)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=hosted?new URL(hosted).origin:`http://127.0.0.1:${server.address().port}`;
const stamp=await readFile(join(OUT,'build.json'),'utf8');
async function verifyStamp(){
 const response=await fetch(BASE+'/build.json',{signal:AbortSignal.timeout(10_000)});
 if(!response.ok||JSON.parse(await response.text()).build!==JSON.parse(stamp).build){
  throw new Error('Probe server is not serving the expected build');
 }
}
await verifyStamp();
console.log('Testing build '+JSON.parse(stamp).build);
const only=process.argv.slice(2),probes=(await readdir('tests/fixtures')).filter(f=>f.endsWith('-probe.mjs')&&(!only.length||only.some(o=>f.includes(o))));
if(!probes.length){console.error('no probes matched');process.exit(1);}
const failureDir=process.env.LIFE_PROBE_FAILURE_DIR;
let failed=0;
for(const file of probes){
 const start=Date.now();
 const result=await new Promise(resolve=>{
  const child=spawn(process.execPath,['tests/fixtures/'+file],{
   env:{...process.env,BASE},stdio:['ignore',process.env.VERBOSE?'inherit':'pipe','pipe']
  });
  let stdout='',stderr='';
  child.stdout?.on('data',data=>stdout+=data);
  child.stderr.on('data',data=>stderr+=data);
  const timeout=setTimeout(()=>child.kill('SIGKILL'),180000);
  child.on('error',error=>{stderr+=error.stack??String(error);});
  child.on('close',(code,signal)=>{
   clearTimeout(timeout);
   resolve({code:code??1,signal,stdout,stderr});
  });
 });
 if(result.code){
  failed++;
  const details=result.stderr||'Probe closed with '+(result.signal??'exit code '+result.code);
  console.error(details.split('\n').filter(line=>!/ExperimentalWarning|trace-warnings/.test(line)).slice(0,12).join('\n'));
  if(failureDir){
   await mkdir(failureDir,{recursive:true});
   await writeFile(join(failureDir,file+'.log'),[
    'Build '+JSON.parse(stamp).build,
    'Exit '+result.code+(result.signal?' ('+result.signal+')':''),
    result.stdout,result.stderr
   ].join('\n'));
  }
 }
 if(await readFile(join(OUT,'build.json'),'utf8')!==stamp)throw new Error('Build changed during browser probes');
 if(hosted)await verifyStamp();
 console.log(`${result.code?'✖':'✔'} ${file} (${Date.now()-start} ms)`);
}
if(!hosted)server.close();
console.log(`${probes.length-failed} of ${probes.length} probes pass`);process.exit(failed?1:0);
