import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRendererLoader} from '../../dist/course/renderer-loader.js';
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('painted-only life starts no renderer; concurrent requests hold then invalidate paused drawing once',async()=>{
 let calls=0,changed=0,resolve;
 const loader=createRendererLoader(()=>{calls++;return new Promise(r=>resolve=r);},()=>changed++);
 await settle();assert.equal(calls,0);assert.equal(loader.pending,false);
 for(let i=0;i<20;i++)assert.equal(loader.request(),null);
 await settle();assert.equal(calls,1);assert.equal(loader.pending,true);assert.equal(changed,0);
 const renderer={drawScene3D(){return true;}};resolve(renderer);await settle();
 assert.equal(loader.pending,false);assert.equal(changed,1);assert.equal(loader.request(),renderer);assert.equal(calls,1);
});

test('failed or invalid renderer settles once, warns once and permits Canvas fallback without request storms',async()=>{
 for(const failure of [()=>Promise.reject(new Error('offline')),()=>({})]){
  let changed=0,warnings=0;const loader=createRendererLoader(failure,()=>changed++,()=>warnings++);
  loader.request();await settle();assert.equal(loader.pending,false);assert.equal(changed,1);assert.equal(warnings,1);
  for(let i=0;i<50;i++)assert.equal(loader.request(),null);
  await settle();assert.equal(changed,1);assert.equal(warnings,1);
 }
});

test('built eager game graph excludes renderer and Three, while keeping their deferred chunk',async()=>{
 const result=await build({entryPoints:['dist/course/game.js'],bundle:true,minify:true,format:'esm',splitting:true,outdir:'out/course',write:false,metafile:true});
 const outputs=result.metafile.outputs,eager=new Set();
 function visit(path){if(eager.has(path))return;eager.add(path);for(const item of outputs[path].imports)if(item.kind!=='dynamic-import'&&!item.external)visit(item.path);}
 const entry=Object.keys(outputs).find(path=>outputs[path].entryPoint==='dist/course/game.js');visit(entry);
 const inputs=[...eager].flatMap(path=>Object.keys(outputs[path].inputs));
 assert.ok(!inputs.some(path=>path.includes('node_modules/three/')||path.endsWith('/scene3d.js')),inputs.filter(path=>/three|scene3d/.test(path)).join('\n'));
 assert.ok(Object.values(outputs).some(output=>Object.keys(output.inputs).some(path=>path.endsWith('/scene3d.js'))),'detailed 3D remains reachable');
});
