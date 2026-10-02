# Client compatibility

Checked on 2026-10-02. A build label is not a substitute for the extension's resource hash checks.

| Entry | Framework build | Status |
| --- | --- | --- |
| `https://game.maj-soul.com/1/` | `chs_t-WebGL-release-4.0.47(47)` | Enabled in v0.2.9; verified startup and user-confirmed replay playback |
| `https://mahjongsoul.game.yo-star.com/` | `en-WebGL-release-4.0.10(11)` | Public entry/bootstrap inspected; not enabled |
| `https://game.mahjongsoul.com/` | Not established | Local connection timed out; not enabled |

## Verified Chinese-language build

- Framework SHA-256 (decoded JavaScript): `530b2b17ca7f66da6dec10d1962aa7268cdc91c0af875dcf843b091d55595e63`
- Presentation core: `2_tsh_968b365ae80de8cf9918.majset`
- Core SHA-256: `c2701ab11392d7fdf17e51e073640a459e3cb686d611220cc151249f4494bf19`
- Core size: 415815 bytes; CRC-32: 3345361315.

These are public resource identifiers, not game assets distributed by this project.

## Regional adaptation findings

The international entry's framework contains the expected filesystem insertion anchor, but its decoded SHA-256 differs: `bf65dd34bad115b425dd76f2f55d0e98e6b22c4191bccd6366f2516362c87086`.

Its Unity bootstrap points to a separate official resource catalog:

```text
https://appstatic.mahjongsoul.com/v4/en/clientbundlesettings/WebGL-en-release-4.0.10-wsvwra.json
https://appstaticbk.mahjongsoul.com/v4/en/clientbundlesettings/WebGL-en-release-4.0.10-wsvwra.json
```

Both CDN endpoints were unreachable from the validation environment. The Chinese entry's asset URL is not interchangeable with the international origin: trying the same path returned HTTP 403. No international core hash, script-layout validation, runtime substitution, or animation playback has been established.

Adding a region requires its own verified resource configuration, successful local bundle transformation, verified runtime reads, and playback testing. Broadening host permissions alone does not provide compatibility. Until those checks pass, regional support remains pending.
