import './profiles.js';
import {createResourceCache} from './resource-cache.js';
import {clientForUrl} from './clients.js';
const prepare = createResourceCache({storage: chrome.storage.local});
const lastReports = new Map();
const failedTabs = new Set();
async function status(tabId, state, message) {
  await chrome.storage.session.set({['tab:' + tabId]: {state, message}});
  await chrome.action.setBadgeText({tabId, text: state === 'enabled' ? 'ON' : state === 'error' ? '!' : ''});
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id) return;
  void (async () => {
    if (message.action === 'prepare' || message.action === 'report') {
      const client = clientForUrl(sender.url);
      if (!client || sender.tab?.id === undefined || sender.frameId !== 0) throw Error('Unsupported sender');
      if (message.action === 'prepare') {
        lastReports.delete(sender.tab.id);
        failedTabs.delete(sender.tab.id);
        if (!(await chrome.storage.local.get('enabled')).enabled) {
          await status(sender.tab.id, 'off', 'Automatic effects are disabled.');
          return {ok: true, config: {enabled: false}};
        }
        await status(sender.tab.id, 'attached', 'Preparing verified native effects.');
        const profile = globalThis.YakumanProfiles.find(item => item.entry === client.entry);
        const variants = await Promise.all(client.cores.map((core, index) => prepare(core, profile.cores[index].patchHash)));
        return {ok: true, config: {enabled: !!(await chrome.storage.local.get('enabled')).enabled, variants}};
      }
      // Page reports are advisory, never authorization for a privileged operation.
      const input = message.report || {};
      const report = {transport: 'module-stream', installed: input.installed === true, runtimeReady: input.runtimeReady === true,
        bundleReads: Number.isSafeInteger(input.bundleReads) ? Math.max(0, Math.min(input.bundleReads, 100000)) : 0,
        failure: typeof input.failure === 'string' ? input.failure.slice(0, 100) : null};
      if (failedTabs.has(sender.tab.id)) return {ok: true};
      if (report.failure) failedTabs.add(sender.tab.id);
      const key = JSON.stringify(report);
      if (lastReports.get(sender.tab.id) === key) return {ok: true};
      lastReports.set(sender.tab.id, key);
      await chrome.storage.session.set({['diagnostics:' + sender.tab.id]: {version: chrome.runtime.getManifest().version, hook: report}});
      if (!(await chrome.storage.local.get('enabled')).enabled) return {ok: true};
      await status(sender.tab.id, report.failure ? 'error' : report.bundleReads && report.runtimeReady ? 'enabled' : 'attached',
        report.failure ? 'Resource substitution blocked: ' + report.failure : report.bundleReads && report.runtimeReady ?
          'Native effects loaded.' : 'Waiting for verified resource reads.');
      return {ok: true};
    }
    if (!sender.url?.startsWith(chrome.runtime.getURL(''))) throw Error('Unsupported sender');
    const tab = await chrome.tabs.get(message.tabId);
    if (!clientForUrl(tab.url)) throw Error('Open a supported Mahjong Soul game page to use Yakuman FX.');
    if (message.action === 'enable') {
      await chrome.storage.local.set({enabled: true});
      lastReports.delete(tab.id);
      await status(tab.id, 'pending', 'Ready for the next game load. Reload only in the lobby.');
      await chrome.tabs.reload(tab.id, {bypassCache: true});
    } else if (message.action === 'restore') {
      await chrome.storage.local.set({enabled: false});
      await status(tab.id, 'disabled', 'Automatic effects disabled. Reload in the lobby to remove the current temporary patch.');
    } else if (message.action === 'reload') {
      lastReports.delete(tab.id);
      await status(tab.id, 'pending', 'Ready for the next game load. Reload only in the lobby.');
      await chrome.tabs.reload(tab.id, {bypassCache: true});
    } else throw Error('Unknown action');
    return {ok: true};
  })().then(respond, error => respond({ok: false, error: error.message}));
  return true;
});
chrome.tabs.onRemoved.addListener(tabId => {
  lastReports.delete(tabId);
  failedTabs.delete(tabId);
  void chrome.storage.session.remove(['tab:' + tabId, 'diagnostics:' + tabId]);
});
