// Packaged MAIN-world code. No generated code or downloaded JavaScript execution.
(() => {
  'use strict';
  const crcTable = Uint32Array.from({length:256}, (_, value) => {
    for (let bit=0;bit<8;bit++) value=(value>>>1)^((value&1)?0xedb88320:0);
    return value>>>0;
  });
  function crc32(bytes, length) {
    let crc = 0xffffffff;
    for (let i = 0; i < length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 255];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function install(module, variants, report, changed = () => {}) {
    const lookup = new Map();
    for (const variant of variants) {
      lookup.set(variant.basename, variant);
      if (!variant.basename.endsWith('.majset')) lookup.set(variant.basename + '.majset', variant);
    }
    if (typeof module.FS_createDataFile !== 'function') throw Error('filesystem-export-missing');
    // A null payload creates an empty, transient MEMFS node without writing bytes.
    const probe = module.FS_createDataFile('/tmp', 'yakuman-stream-entry', null, true, true);
    const table = probe.mount?.type?.ops_table?.file?.stream;
    if (!table || typeof table.read !== 'function' || typeof table.llseek !== 'function' || probe.stream_ops !== table) {
      throw Error('filesystem-layout-unsupported');
    }
    if (table.open?.yakumanStreamHook) throw Error('filesystem-hook-already-installed');
    const previousOpen = table.open;
    let active = true;
    function open(stream) {
      if (previousOpen) previousOpen.call(this, stream);
      if (!active || (stream.flags & 3) !== 0) return;
      const node = stream.node;
      const variant = lookup.get(node.name);
      if (!variant) return;
      try {
        if (!node.contents || node.usedBytes !== variant.size) throw Error('cache-size');
        if (crc32(node.contents, node.usedBytes) !== variant.crc) throw Error('cache-checksum');
        if (!(variant.bytes instanceof Uint8Array) || !variant.bytes.length) throw Error('replacement-missing');
        // Only this file descriptor sees the replacement. The cached node stays intact.
        const shadow = Object.assign(Object.create(Object.getPrototypeOf(node)), node, {
          contents: variant.bytes, usedBytes: variant.bytes.length, isModified: false,
        });
        stream.node = shadow;
        // Keep IDBFS close/write wrappers away from a read-only shadow descriptor.
        stream.stream_ops = {...table};
        delete stream.stream_ops.open;
        delete stream.stream_ops.close;
        report.bundleReads++;
        report.failure = null;
      } catch (error) {
        report.failure = {reason: error.message};
      }
      changed();
    }
    open.yakumanStreamHook = true;
    table.open = open;
    report.installed = true;
    return () => {
      active = false;
      if (table.open === open) {
        if (previousOpen) table.open = previousOpen;
        else delete table.open;
      }
    };
  }
  globalThis.YakumanStreamHook = Object.freeze({install, crc32});
})();
