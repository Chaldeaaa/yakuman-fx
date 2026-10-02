// Minimal UnityFS reader/writer for the explicitly pinned official bundle.
// Length-preserving edits leave serialized object sizes and offsets unchanged.
const key=new TextEncoder().encode('wrelupqezdfrqdsd');
export const supported={
  coreUrl:'https://game.maj-soul.com/assetbundles/DXT/2_tsh_968b365ae80de8cf9918.majset',
  coreHash:'c2701ab11392d7fdf17e51e073640a459e3cb686d611220cc151249f4494bf19',
  coreSize:415815,coreCrc:3345361315,
  frameworkName:'chs_t-WebGL-release-4.0.47(47).framework.js.gz',
  frameworkHash:'530b2b17ca7f66da6dec10d1962aa7268cdc91c0af875dcf843b091d55595e63',
};
export async function sha256(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');}
class Reader{
  constructor(bytes){this.bytes=bytes;this.view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);this.pos=0;}
  u16(){const value=this.view.getUint16(this.pos);this.pos+=2;return value;}
  u32(){const value=this.view.getUint32(this.pos);this.pos+=4;return value;}
  u64(){const value=Number(this.view.getBigUint64(this.pos));this.pos+=8;if(!Number.isSafeInteger(value))throw Error('Invalid bundle size');return value;}
  string(){const start=this.pos;while(this.pos<this.bytes.length&&this.bytes[this.pos]!==0)this.pos++;if(this.pos===this.bytes.length)throw Error('Invalid bundle string');return new TextDecoder().decode(this.bytes.subarray(start,this.pos++));}
  align(){this.pos=Math.ceil(this.pos/16)*16;}
}
export function lz4(input,size){
  if(size>32*1024*1024)throw Error('Bundle block too large');
  const output=new Uint8Array(size);let i=0,o=0;
  function length(base){let value=base;if(base===15){let next;do{if(i>=input.length)throw Error('Truncated LZ4 length');next=input[i++];value+=next;}while(next===255);}return value;}
  while(i<input.length){
    const token=input[i++],literal=length(token>>>4);
    if(i+literal>input.length||o+literal>size)throw Error('Invalid LZ4 literals');
    output.set(input.subarray(i,i+literal),o);i+=literal;o+=literal;
    if(i===input.length)break;
    if(i+2>input.length)throw Error('Truncated LZ4 offset');
    const offset=input[i++]|(input[i++]<<8),match=length(token&15)+4;
    if(!offset||offset>o||o+match>size)throw Error('Invalid LZ4 match');
    for(let n=0;n<match;n++)output[o]=output[o++-offset];
  }
  if(o!==size)throw Error('Incorrect decompressed size');return output;
}
function decompress(bytes,size,flags){const type=flags&63;if(type===0){if(bytes.length!==size)throw Error('Incorrect block size');return bytes;}if(type===2||type===3)return lz4(bytes,size);throw Error('Unsupported compression');}
export function unpack(bytes){
  const r=new Reader(bytes);if(r.string()!=='UnityFS')throw Error('Unsupported bundle');
  const version=r.u32();if(version!==8)throw Error('Unsupported bundle version');
  r.string();r.string();const sizePosition=r.pos;
  if(r.u64()!==bytes.length)throw Error('Invalid bundle length');
  const compressedSize=r.u32(),infoSize=r.u32(),flags=r.u32();r.align();
  const infoOffset=flags&128?bytes.length-compressedSize:r.pos;
  const info=decompress(bytes.subarray(infoOffset,infoOffset+compressedSize),infoSize,flags);
  const b=new Reader(info);b.pos=16;const count=b.u32();if(count>1024)throw Error('Too many blocks');
  const blocks=[];let total=0;
  for(let n=0;n<count;n++){const size=b.u32(),compressed=b.u32(),flags=b.u16();total+=size;blocks.push({size,compressed,flags});}
  if(total>32*1024*1024)throw Error('Bundle too large');
  const nodes=info.slice(b.pos);if(!(flags&128))r.pos+=compressedSize;if(flags&512)r.align();
  const data=new Uint8Array(total);let offset=0;
  for(const block of blocks){const end=r.pos+block.compressed;if(end>bytes.length)throw Error('Truncated block');data.set(decompress(bytes.subarray(r.pos,end),block.size,block.flags),offset);offset+=block.size;r.pos=end;}
  return {data,nodes,prefix:bytes.slice(0,sizePosition)};
}
export function pack({data,nodes,prefix}){
  const info=new Uint8Array(30+nodes.length),iv=new DataView(info.buffer);
  iv.setUint32(16,1);iv.setUint32(20,data.length);iv.setUint32(24,data.length);info.set(nodes,30);
  const headerSize=Math.ceil((prefix.length+20)/16)*16;
  const dataStart=Math.ceil((headerSize+info.length)/16)*16;
  const output=new Uint8Array(dataStart+data.length),v=new DataView(output.buffer);
  output.set(prefix);v.setBigUint64(prefix.length,BigInt(output.length));v.setUint32(prefix.length+8,info.length);v.setUint32(prefix.length+12,info.length);v.setUint32(prefix.length+16,576);
  output.set(info,headerSize);output.set(data,dataStart);return output;
}
const edits=[
  ['Tools.lua','function Tools.IsYiManEffectClosed()if Tools.IsWebGL()then return true end;return false end;','function Tools.IsYiManEffectClosed()return false end;'],
  ['LoadMgr.lua','if not Tools.IsWebGL()then table.insert(c,"yiman")end;','table.insert(c,"yiman");'],
  ['AudioMgr.lua','if ak==103 and Tools.IsWebGL()then i=d(a.Click)else i=d(a.Sound)end;','i=d(ak==262 and a.Emo or ak==103 and a.Click or a.Sound);'],
];
export function patchData(data){
  const output=data.slice();
  for(const [name,original,replacement]of edits){
    if(replacement.length>original.length)throw Error('Non-preserving edit');
    const old=new TextEncoder().encode(original),next=new TextEncoder().encode(replacement.padEnd(original.length,' '));
    let found=-1,phase=-1,count=0;
    for(let p=0;p<key.length;p++){
      const first=old[0]^key[p];
      for(let i=output.indexOf(first);i>=0;i=output.indexOf(first,i+1)){
        if(i+old.length>output.length)continue;
        let matches=true;for(let n=1;n<old.length;n++)if(output[i+n]!== (old[n]^key[(p+n)%key.length])){matches=false;break;}
        if(matches){found=i;phase=p;count++;}
      }
    }
    if(count!==1)throw Error('Unsupported script layout: '+name);
    for(let n=0;n<next.length;n++)output[found+n]=next[n]^key[(phase+n)%key.length];
  }
  return output;
}
export async function buildPatch(bytes,profile=supported){
  if(bytes.length!==profile.coreSize||await sha256(bytes)!==profile.coreHash)throw Error('Unsupported official core bundle');
  const bundle=unpack(bytes);bundle.data=patchData(bundle.data);return pack(bundle);
}
export function base64(bytes){let result='';for(let i=0;i<bytes.length;i+=8192)result+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(result);}
