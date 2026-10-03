# Client compatibility

Checked on 2026-10-03. A build label is not a substitute for resource hash checks.

| Entry | Framework build | Validation |
| --- | --- | --- |
| `https://game.maj-soul.com/1/` | `chs_t-WebGL-release-4.0.47(47)` | User-confirmed replay playback; previously verified isolated Edge startup |
| `https://game.mahjongsoul.com/` | `jp-WebGL-release-4.0.12(13)` | Framework and ASTC/DXT cores verified; isolated Edge startup verified; regional replay playback pending |
| `https://mahjongsoul.game.yo-star.com/` | `en-WebGL-release-4.0.10(11)` | Framework and ASTC/DXT cores verified; isolated Edge startup verified; regional replay playback pending |

All three entries are enabled in v0.2.11. Only the listed resource fingerprints are accepted. Unknown framework or core revisions remain unpatched.

## Framework SHA-256

Hashes are computed over decoded JavaScript, after HTTP/gzip decoding.

- Chinese-language entry: `530b2b17ca7f66da6dec10d1962aa7268cdc91c0af875dcf843b091d55595e63`
- Japanese and English entries: `bf65dd34bad115b425dd76f2f55d0e98e6b22c4191bccd6366f2516362c87086`

## Presentation cores

| Target | Core name | Size | CRC-32 | SHA-256 |
| --- | --- | --- | --- | --- |
| Chinese DXT | `2_tsh_968b365ae80de8cf9918.majset` | 415815 | 3345361315 | `c2701ab11392d7fdf17e51e073640a459e3cb686d611220cc151249f4494bf19` |
| Japanese/English ASTC | `2_tsh_0aec8665b6c784771e9b` | 417329 | 1329260922 | `fa3ea2627b9eb05cb6ead717f251230f39bb1ec2a423fef75043fbb9a63f6972` |
| Japanese/English DXT | `2_tsh_e964bddc38878189e200` | 415436 | 1057105834 | `c84379a3d917ad9da3ff167e378e3f876e3b42d8ebf5db09ee307c13fd40a723` |

The regional cores are obtained from the official CDN under `/v4/jp/resources/ab/WebGL/` or `/v4/en/resources/ab/WebGL/`, followed by `ASTC/` or `DXT/`. Both regions' matching texture-format cores were downloaded and independently found byte-identical.

Independent Unity parsing confirmed that each regional replacement changes only Tools.lua, LoadMgr.lua, and AudioMgr.lua: three changed TextAssets out of 68, with all original script lengths preserved. Browser runtime validation and actual animation/audio playback are separate checks.

Live matches and broader yakuman coverage remain unvalidated.

