import {test} from 'node:test';
import assert from 'node:assert/strict';
import {versionReferences} from '../scripts/asset-versions.mjs';

test('the deployed loader versions multi-dot bundles as well as entry points and styles',()=>{
 const source=`await import('./game.bundle.js'); import '../course/scene3d.js'; const css="console.css";`;
 const result=versionReferences(source,'new-build');
 assert.ok(result.includes("import('./game.bundle.js?v=new-build')"));
 assert.ok(result.includes("'../course/scene3d.js?v=new-build'"));
 assert.ok(result.includes('"console.css?v=new-build"'));
 assert.equal(versionReferences(result,'new-build'),result);
 assert.equal(versionReferences("'https://example.com/app.js'",'new-build'),"'https://example.com/app.js'");
});
