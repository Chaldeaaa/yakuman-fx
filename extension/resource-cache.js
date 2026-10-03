import {base64, buildPatch, sha256} from './bundle.js';

// Cache verified presentation results across page loads and worker restarts.
export function createResourceCache({storage, download = fetch, build = buildPatch, digest = sha256}) {
  const pending = new Map();
  return async function prepare(core, patchHash) {
    const key = 'presentation-v1:' + core.coreHash;
    if (!pending.has(key)) pending.set(key, (async () => {
      try {
        const entry = (await storage.get(key))[key];
        if (entry?.hash === patchHash && typeof entry.base64 === 'string' && entry.base64.length <= 4 * 1024 * 1024) {
          const bytes = Uint8Array.from(atob(entry.base64), character => character.charCodeAt(0));
          if (await digest(bytes) === patchHash) return {base64: entry.base64};
        }
      } catch { /* A corrupt or unavailable cache falls back to a verified download. */ }
      const response = await download(core.coreUrl, {credentials: 'omit', cache: 'default', signal: AbortSignal.timeout(15000)});
      if (!response.ok) throw Error('Official resource download failed: ' + response.status);
      const bytes = await build(new Uint8Array(await response.arrayBuffer()), core);
      if (await digest(bytes) !== patchHash) throw Error('Prepared resource checksum mismatch');
      const result = {base64: base64(bytes)};
      await storage.set({[key]: {...result, hash: patchHash}}).catch(() => {});
      return result;
    })().catch(error => { pending.delete(key); throw error; }));
    return pending.get(key);
  };
}
