const zh={
  'Native yakuman animations':'原生役满动画',
  'Checking this tab…':'正在检查当前标签页…',
  'Enable & Reload':'启用并刷新',
  'Restore Default':'恢复默认',
  'Reload Game in Lobby':'在大厅刷新游戏',
  'Settings':'设置',
  'Language':'界面语言',
  'Theme:':'主题：',
  'Light':'浅色',
  'Dark':'深色',
  'System':'跟随系统',
  'Troubleshooting':'问题排查',
  'Refresh Saved Diagnostics':'刷新已保存的诊断',
  'Last captured startup diagnostics. Viewing this page does not reconnect the debugger.':'以下是最近保存的启动诊断。查看此页面不会重新连接调试器。',
  'No startup diagnostics have been captured in this browser session.':'本次浏览器会话尚未保存启动诊断。',
  'Reload only in the lobby. The debugging notice disappears after verified loading. Replay effects have been observed; live matches remain untested.':'仅在大厅刷新。验证加载完成后，调试提示会消失。牌谱特效已验证，实战播放尚未测试。',
  'Supported: game.maj-soul.com/1/. No account-safety guarantee.':'支持：game.maj-soul.com/1/。不保证账号安全。',
  'Supported: Chinese, Japanese, and English web entries. No account-safety guarantee.':'支持中文、日文及英文网页入口。不保证账号安全。',
  'Open a supported Mahjong Soul game page to use Yakuman FX.':'请打开支持的雀魂游戏页面使用 Yakuman FX。',
  'Open https://game.maj-soul.com/1/ to use Yakuman FX.':'请打开 https://game.maj-soul.com/1/ 使用 Yakuman FX。',
  'Automatic effects enabled. Reload in the lobby to attach.':'自动特效已启用。请在大厅刷新以加载。',
  'Automatic effects are disabled.':'自动特效已关闭。',
  'Enable native effects and reload the game now? Continue only when you are in the lobby.':'现在启用原生特效并刷新游戏吗？仅在大厅时继续。',
  'Reload the game now? Continue only when you are in the lobby.':'现在刷新游戏吗？仅在大厅时继续。',
  'Working…':'正在处理…',
  'Ready for the next game load. Reload only in the lobby.':'已准备好在下次加载游戏时启用。仅在大厅刷新。',
  'Native effects loaded. Debugging disconnected.':'原生特效已加载，调试连接已断开。',
  'Temporary hook installed. Waiting for verified resource reads.':'临时钩子已安装，正在等待验证资源读取。',
  'Still loading game resources. Reload only in the lobby if loading stalls.':'仍在加载游戏资源。若加载停滞，请仅在大厅刷新。',
  'Disconnected. Reload in the lobby after enabling to apply changes.':'连接已断开。启用后请在大厅刷新以应用修改。',
  'Automatic effects enabled. Reloading the game…':'自动特效已启用，正在刷新游戏…',
  'Automatic effects disabled. Reload in the lobby to remove the current temporary patch.':'自动特效已关闭。请在大厅刷新以移除当前临时修改。',
  'Wait until the supported game page has finished navigating.':'请等待支持的游戏页面完成导航。',
  'Open the supported Mahjong Soul game page first.':'请先打开支持的雀魂游戏页面。',
  'Unsupported client framework. No modification applied.':'不支持此客户端框架，未应用修改。',
  'Missing framework entry point.':'未找到框架入口。',
  'Unsupported official core bundle':'不支持此官方核心资源包',
  'Hook loaded, but the expected core has not been read. See Extension options.':'钩子已加载，但尚未读取预期的核心资源。请查看扩展设置。',
  'Hook not found in the main game context. See Extension options.':'游戏主页面中未找到钩子。请查看扩展设置。',
  'Runtime verification failed. See Extension options for the browser error.':'运行时验证失败。请在扩展设置中查看浏览器错误。',
  'Browser refused debugger access. Another extension may have embedded a page in this tab. Reload in the lobby to retry; if it persists, use a profile without page-injecting extensions.':'浏览器拒绝调试访问，其他扩展可能在此标签页中嵌入了页面。请在大厅刷新重试；若仍失败，请使用没有页面注入扩展的浏览器配置。',
};
let language='en';
export function translate(text,locale=language){
  if(locale!=='zh-CN')return text;
  if(zh[text])return zh[text];
  if(text.startsWith('Resource substitution blocked: '))return '资源替换被阻止：'+text.slice(31).replace('. See Extension options for details.','。请在扩展设置中查看详情。');
  if(text.startsWith('Official resource download failed: '))return '官方资源下载失败：'+text.slice(35);
  return text;
}
export async function setupLanguage(){
  const originals=new Map();
  for(const node of document.querySelectorAll('[data-i18n]'))originals.set(node,node.textContent);
  const select=document.getElementById('language');
  function apply(value){
    language=value==='zh-CN'?'zh-CN':'en';
    document.documentElement.lang=language;
    for(const [node,text]of originals)node.textContent=translate(text);
    const settings=document.getElementById('settings');
    if(settings){settings.title=translate('Settings');settings.setAttribute('aria-label',translate('Settings'));}
    if(select)select.value=language;
    document.title='Yakuman FX'+(document.body.classList.contains('settings')?' — '+translate('Settings'):'');
    document.dispatchEvent(new Event('languagechange'));
  }
  apply((await chrome.storage.local.get('language')).language);
  select?.addEventListener('change',async()=>{apply(select.value);await chrome.storage.local.set({language});});
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.language)apply(changes.language.newValue);});
}
