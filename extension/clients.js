const frameworkHash='bf65dd34bad115b425dd76f2f55d0e98e6b22c4191bccd6366f2516362c87086';
function regionalCores(region){return [
  {coreUrl:`https://appstatic.mahjongsoul.com/v4/${region}/resources/ab/WebGL/ASTC/2_tsh_0aec8665b6c784771e9b`,coreHash:'fa3ea2627b9eb05cb6ead717f251230f39bb1ec2a423fef75043fbb9a63f6972',coreSize:417329,coreCrc:1329260922},
  {coreUrl:`https://appstatic.mahjongsoul.com/v4/${region}/resources/ab/WebGL/DXT/2_tsh_e964bddc38878189e200`,coreHash:'c84379a3d917ad9da3ff167e378e3f876e3b42d8ebf5db09ee307c13fd40a723',coreSize:415436,coreCrc:1057105834},
];}
export const clients=[
  {id:'cn',entry:'https://game.maj-soul.com/1/',frameworkName:'chs_t-WebGL-release-4.0.47(47).framework.js.gz',frameworkHash:'530b2b17ca7f66da6dec10d1962aa7268cdc91c0af875dcf843b091d55595e63',cores:[{coreUrl:'https://game.maj-soul.com/assetbundles/DXT/2_tsh_968b365ae80de8cf9918.majset',coreHash:'c2701ab11392d7fdf17e51e073640a459e3cb686d611220cc151249f4494bf19',coreSize:415815,coreCrc:3345361315}]},
  {id:'jp',entry:'https://game.mahjongsoul.com/',frameworkName:'jp-WebGL-release-4.0.12(13).framework.js.gz',frameworkHash,cores:regionalCores('jp')},
  {id:'en',entry:'https://mahjongsoul.game.yo-star.com/',frameworkName:'en-WebGL-release-4.0.10(11).framework.js.gz',frameworkHash,cores:regionalCores('en')},
];
export function clientForUrl(value){
  try{const url=new URL(value);return clients.find(client=>{const entry=new URL(client.entry);return url.origin===entry.origin&&url.pathname===entry.pathname;});}catch{return undefined;}
}
