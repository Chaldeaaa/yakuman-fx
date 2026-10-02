export function filesystemHook(base64, basename, expectedSize, expectedCrc32, presentationMode='replay-and-live') {
  // Only a read of this exact cached presentation bundle is redirected.
  // No persistent cache file is replaced or removed.
  return `;(function(){
    var originalOpen=FS.open;
    var replacementPath='/tmp/yakuman-native-core.majset';
    var installed=false;
    window.__yakumanNative={bundleReads:0,candidates:[],mode:${JSON.stringify(presentationMode)}};
    FS.open=function(path,flags,mode){
      if(typeof path==='string'&&path.indexOf('2_tsh_')!==-1&&window.__yakumanNative.candidates.length<20)window.__yakumanNative.candidates.push({name:path.split('/').pop(),flags:flags});
      if(typeof path==='string' && path.split('/').pop()===${JSON.stringify(basename)} && (flags==='r'||flags==='rb'||(typeof flags==='number'&&(flags&3)===0))){
        if(!installed){
          try{
            var node=FS.lookupPath(path).node;
            var source=node.contents;
            if(!source||node.usedBytes!==${expectedSize})return originalOpen.call(FS,path,flags,mode);
            var crc=0xffffffff;
            for(var index=0;index<node.usedBytes;index++){
              crc^=source[index];
              for(var bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
            }
            if(((crc^0xffffffff)>>>0)!==${expectedCrc32})return originalOpen.call(FS,path,flags,mode);
          }catch(error){return originalOpen.call(FS,path,flags,mode);}
          var binary=atob(${JSON.stringify(base64)});
          var bytes=new Uint8Array(binary.length);
          for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
          FS.createDataFile('/tmp','yakuman-native-core.majset',bytes,true,false);
          installed=true;
        }
        console.info('[Yakuman] Reading the temporary presentation bundle.');
        window.__yakumanNative.bundleReads++;
        return originalOpen.call(FS,replacementPath,flags,mode);
      }
      return originalOpen.call(FS,path,flags,mode);
    };
  })();`;
}
