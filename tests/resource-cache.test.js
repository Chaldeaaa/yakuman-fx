import test from 'node:test';
import assert from 'node:assert/strict';
import {createResourceCache} from '../extension/resource-cache.js';
import {sha256} from '../extension/bundle.js';
test('deduplicates downloads, reuses verified disk cache after restart, repairs corrupt entries', async () => {
  const data={},bytes=new Uint8Array([1,2,3]),hash=await sha256(bytes);let downloads=0,builds=0;
  const storage={get:async key=>({[key]:data[key]}),set:async values=>Object.assign(data,values)};
  const options={storage,download:async()=>{downloads++;return{ok:true,arrayBuffer:async()=>bytes.buffer};},build:async()=>{builds++;return bytes;}};
  const core={coreHash:'source',coreUrl:'https://example.invalid/resource'};
  const prepare=createResourceCache(options);
  await Promise.all([prepare(core,hash),prepare(core,hash)]);assert.equal(downloads,1);assert.equal(builds,1);
  await createResourceCache(options)(core,hash);assert.equal(downloads,1);assert.equal(builds,1);
  data['presentation-v1:source'].base64=btoa('corrupt');
  await createResourceCache(options)(core,hash);assert.equal(downloads,2);
});
test('a failed request can be retried and unavailable storage does not prevent verified loading',async()=>{
  const bytes=new Uint8Array([4]),hash=await sha256(bytes);let calls=0;
  const prepare=createResourceCache({storage:{get:async()=>{throw Error('unavailable');},set:async()=>{throw Error('quota');}},
    download:async()=>({ok:++calls>1,status:503,arrayBuffer:async()=>bytes.buffer}),build:async()=>bytes});
  const core={coreHash:'source',coreUrl:'https://example.invalid/resource'};
  await assert.rejects(prepare(core,hash),/503/);assert.equal((await prepare(core,hash)).base64,btoa(String.fromCharCode(4)));
});
