import test from 'node:test';
import assert from 'node:assert/strict';
import {lz4,pack,unpack,buildPatch,patchData} from '../extension/bundle.js';

test('LZ4 supports overlapping matches and rejects invalid offsets',()=>{
  assert.deepEqual(lz4(Uint8Array.of(0x11,65,1,0),6),new Uint8Array(6).fill(65));
  assert.throws(()=>lz4(Uint8Array.of(0,0,0),4),/Invalid LZ4 match/);
  assert.throws(()=>lz4(Uint8Array.of(0xf0),20),/Truncated/);
});
test('UnityFS packing preserves directory and serialized data at alignment boundaries',()=>{
  const prefix=new Uint8Array([...new TextEncoder().encode('UnityFS\0'),0,0,0,8,...new TextEncoder().encode('5.x.x\u00000.0.0\0')]);
  for(const length of [1,15,16,17,1000]){
    const data=Uint8Array.from({length},(_,i)=>i%251),nodes=Uint8Array.of(0,0,0,0);
    const result=unpack(pack({data,nodes,prefix}));
    assert.deepEqual(result.data,data);assert.deepEqual(result.nodes,nodes);
  }
});
test('unrecognized official resources are rejected before rewriting',async()=>{
  await assert.rejects(buildPatch(new Uint8Array(8)),/Unsupported official/);
  assert.throws(()=>patchData(new Uint8Array(100)),/Unsupported script layout/);
});
