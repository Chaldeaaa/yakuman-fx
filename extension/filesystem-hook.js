export function filesystemHook(base64, basename, expectedSize, expectedCrc32, presentationMode='replay-and-live') {
  const variants=Array.isArray(base64)?base64:[{base64,basename,size:expectedSize,crc:expectedCrc32}];
  // Only a read of this exact cached presentation bundle is redirected.
  // No persistent cache file is replaced or removed.
  return `;(function(){
    var originalOpen=FS.open;
    var variants=${JSON.stringify(variants)};
    window.__yakumanNative={bundleReads:0,candidates:[],opens:0,mode:${JSON.stringify(presentationMode)},failure:null};
    FS.open=function(path,flags,mode){
      window.__yakumanNative.opens++;
      if(typeof path==='string'&&path.indexOf('2_tsh_')!==-1&&window.__yakumanNative.candidates.length<20)window.__yakumanNative.candidates.push({name:path.split('/').pop(),flags:flags});
      var name=typeof path==='string'?path.split('/').pop():null;
      var variant=variants.find(function(item){return name===item.basename||(!item.basename.endsWith('.majset')&&name===item.basename+'.majset');});
      if(variant && (flags==='r'||flags==='rb'||(typeof flags==='number'&&(flags&3)===0))){
        var replacementPath='/tmp/yakuman-native-core'+(variants.length>1?'-'+variants.indexOf(variant):'')+'.majset';
        if(!variant.installed){
          try{
            var node=FS.lookupPath(path).node;
            var source=node.contents;
            if(!source||node.usedBytes!==variant.size){window.__yakumanNative.failure={reason:'cache-size',actual:node.usedBytes,expected:variant.size};return originalOpen.call(FS,path,flags,mode);}
            var crc=0xffffffff;
            for(var index=0;index<node.usedBytes;index++){
              // Some Unity builds expose MEMFS contents as signed Int8Array.
              crc^=source[index]&255;
              for(var bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
            }
            if(((crc^0xffffffff)>>>0)!==variant.crc){window.__yakumanNative.failure={reason:'cache-checksum',actual:(crc^0xffffffff)>>>0};return originalOpen.call(FS,path,flags,mode);}
          }catch(error){window.__yakumanNative.failure={reason:'cache-unavailable'};return originalOpen.call(FS,path,flags,mode);}
          var binary=atob(variant.base64);
          var bytes=new Uint8Array(binary.length);
          for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
          FS.createDataFile('/tmp',replacementPath.split('/').pop(),bytes,true,false);
          variant.installed=true;
        }
        console.info('[Yakuman] Reading the temporary presentation bundle.');
        window.__yakumanNative.bundleReads++;
        return originalOpen.call(FS,replacementPath,flags,mode);
      }
      return originalOpen.call(FS,path,flags,mode);
    };
  })();`;
}
