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
test('signed MEMFS bytes verify identically to unsigned bytes without accepting changed data',()=>{
  const bytes=Uint8Array.of(0,127,128,255,42);
  const checksum=content=>{let crc=0xffffffff;for(const value of content){crc^=value;for(let n=0;n<8;n++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return(crc^0xffffffff)>>>0;};
  const expected=checksum(bytes);
  for(const contents of [bytes,new Int8Array(bytes)]){
    const FS={open(path){return path;},lookupPath(){return{node:{contents,usedBytes:contents.length}};},createDataFile(){}};
    const window={};
    vm.runInNewContext(filesystemHook(btoa('replacement'),'core.majset',bytes.length,expected),{FS,window,atob,Uint8Array,console:{info(){}}});
    assert.equal(FS.open('/cache/core.majset',32768),'/tmp/yakuman-native-core.majset');
    assert.equal(window.__yakumanNative.bundleReads,1);
  }
  const contents=new Int8Array(bytes);contents[3]=-2;
  const FS={open(path){return path;},lookupPath(){return{node:{contents,usedBytes:contents.length}};},createDataFile(){throw Error('Must not install');}};
  const window={};
  vm.runInNewContext(filesystemHook(btoa('replacement'),'core.majset',bytes.length,expected),{FS,window,atob,Uint8Array,console:{info(){}}});
  assert.equal(FS.open('/cache/core.majset',32768),'/cache/core.majset');
  assert.equal(window.__yakumanNative.failure.reason,'cache-checksum');
});
