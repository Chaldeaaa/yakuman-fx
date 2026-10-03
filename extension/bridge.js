(() => {
  const entries = ['https://game.maj-soul.com/1/', 'https://game.mahjongsoul.com/', 'https://mahjongsoul.game.yo-star.com/'];
  if (!entries.includes(location.origin + location.pathname)) return;
  let config, last = '', pending, timer, failed = false;
  const flush = () => {
    timer = undefined;
    const report = pending; pending = undefined;
    if (report) void chrome.runtime.sendMessage({action: 'report', report}).catch(() => {});
  };
  const sendConfig = () => { if (config) window.postMessage({type: 'yakuman-stream-config', config}, location.origin); };
  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin) return;
    if (event.data?.type === 'yakuman-stream-ready') sendConfig();
    if (event.data?.type !== 'yakuman-stream-report') return;
    const source = event.data.report;
    if (!source || source.transport !== 'module-stream') return;
    const report = {installed: source.installed === true, runtimeReady: source.runtimeReady === true,
      bundleReads: Number.isSafeInteger(source.bundleReads) ? Math.max(0, Math.min(source.bundleReads, 100000)) : 0,
      failure: typeof source.failure === 'string' ? source.failure.slice(0, 100) : null};
    const key = JSON.stringify(report);
    if (key === last || failed) return;
    if (report.failure) failed = true;
    last = key;
    pending = report;
    // Trailing delivery preserves the final state without polling or per-message writes.
    if (!timer) timer = setTimeout(flush, 250);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled?.newValue === false) {
      window.postMessage({type: 'yakuman-stream-disable'}, location.origin);
    }
  });
  chrome.runtime.sendMessage({action: 'prepare'}).then(result => {
    config = result.ok ? result.config : {enabled: false, error: result.error}; sendConfig();
  }).catch(() => { config = {enabled: false, error: 'extension-unavailable'}; sendConfig(); });
})();
