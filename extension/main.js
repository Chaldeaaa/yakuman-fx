(() => {
  'use strict';
  const profile = globalThis.YakumanProfiles?.find(item => item.entry === location.origin + location.pathname);
  if (!profile) return;
  const hook = globalThis.YakumanStreamHook;
  const digest = bytes => crypto.subtle.digest('SHA-256', bytes).then(value =>
    Array.from(new Uint8Array(value), byte => byte.toString(16).padStart(2, '0')).join(''));
  const report = {transport: 'module-stream', installed: false, runtimeReady: false, bundleReads: 0, failure: null};
  window.__yakumanNative = report;
  let resolveConfig, stop, disabled = false;
  let settled = false;
  const configuration = new Promise(resolve => { resolveConfig = resolve; });
  function settle(value) { if (!settled) { settled = true; resolveConfig(value); } }
  const timeout = setTimeout(() => settle({enabled: false, error: 'configuration-timeout'}), 25000);
  let queued = false, last = '';
  function emit() {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      const snapshot = {
      transport: report.transport, installed: report.installed, runtimeReady: report.runtimeReady, bundleReads: report.bundleReads,
      failure: report.failure?.reason || null,
      };
      const key = JSON.stringify(snapshot);
      if (key === last) return;
      last = key;
      window.postMessage({type: 'yakuman-stream-report', report: snapshot}, location.origin);
    });
  }
  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin) return;
    if (event.data?.type === 'yakuman-stream-config' && !settled) {
      clearTimeout(timeout); settle(event.data.config);
    }
    if (event.data?.type === 'yakuman-stream-disable') { disabled = true; stop?.(); }
  });
  const descriptor = Object.getOwnPropertyDescriptor(window, 'unityFramework');
  if (descriptor && !descriptor.configurable) {
    report.failure = {reason: 'framework-entry-too-late'}; emit(); return;
  }
  let factory = window.unityFramework;
  function wrap(value) {
    if (typeof value !== 'function') return value;
    return new Proxy(value, {
      async apply(target, receiver, args) {
        const config = await configuration;
        if (!config?.enabled || disabled) {
          if (config?.error) report.failure = {reason: config.error};
          emit(); return Reflect.apply(target, receiver, args);
        }
        let variants;
        try {
          const actualHash = await digest(new TextEncoder().encode(Function.prototype.toString.call(target)));
          if (actualHash !== profile.factoryHash) throw Error('framework-factory-checksum');
          if (!Array.isArray(args[0]?.preRun)) throw Error('framework-preRun-layout');
          if (!Array.isArray(config.variants) || config.variants.length !== profile.cores.length) throw Error('replacement-layout');
          variants = await Promise.all(profile.cores.map(async (core, index) => {
            const input = config.variants[index];
            if (typeof input?.base64 !== 'string' || input.base64.length > 8 * 1024 * 1024) throw Error('replacement-size');
            const bytes = Uint8Array.from(atob(input.base64), char => char.charCodeAt(0));
            if (await digest(bytes) !== core.patchHash) throw Error('replacement-checksum');
            return {...core, bytes};
          }));
        } catch (error) {
          report.failure = {reason: error.message}; emit();
          return Reflect.apply(target, receiver, args);
        }
        let installed = false;
        const install = () => {
          if (installed || disabled) return;
          installed = true;
          try { stop = hook.install(args[0], variants, report, emit); }
          catch (error) { report.failure = {reason: error.message}; }
          emit();
        };
        args[0].preRun.push(install);
        const result = Reflect.apply(target, receiver, args);
        // Normally runs before asynchronous wasm initialization and IDBFS hydration.
        if (typeof args[0].FS_createDataFile === 'function') install();
        Promise.resolve(result).then(() => { report.runtimeReady = true; emit(); }, () => {});
        return result;
      },
    });
  }
  factory = wrap(factory);
  Object.defineProperty(window, 'unityFramework', {
    configurable: true, enumerable: true,
    get() { return factory; }, set(value) { factory = wrap(value); },
  });
  window.postMessage({type: 'yakuman-stream-ready'}, location.origin);
})();
