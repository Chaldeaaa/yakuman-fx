import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {filesystemHook} from '../extension/filesystem-hook.js';
test('hook substitutes verified reads, keeps writes intact, and fails safely on changed cache',()=>{
  const source=new Uint8Array(Buffer.from('123456789')),calls=[],files=[];
  const FS={open(path){calls.push(path);return path;},lookupPath(){return{node:{contents:source,usedBytes:9}};},createDataFile(...args){files.push(args);}};
  vm.runInNewContext(filesystemHook(btoa('replacement'),'core.majset',9,0xcbf43926),{FS,window:{},atob,Uint8Array,console:{info(){}}});
  assert.equal(FS.open('/cache/core.majset',577),'/cache/core.majset');
  assert.equal(FS.open('/cache/other',32768),'/cache/other');
  source[0]=0;
  assert.equal(FS.open('/cache/core.majset',32768),'/cache/core.majset');
  source[0]=49;
  assert.equal(FS.open('/cache/core.majset',32768),'/tmp/yakuman-native-core.majset');
  assert.equal(files.length,1);assert.equal(Buffer.from(source).toString(),'123456789');
});
