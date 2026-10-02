# Yakuman FX

Native yakuman animations for Mahjong Soul in your browser.

## Status

Version 0.2.6 is an unpacked browser-extension prototype with navigation-safe attachment and runtime diagnostics. An isolated headless Edge test confirmed extension loading, automatic attachment, four verified resource reads, Unity initialization, and restoration after reload. The user confirmed replay playback after the signed-byte cache correction in v0.2.3. Broader animation and audio validation remains outstanding. Chrome Web Store / Microsoft Edge Add-ons approval has not been obtained.

A private WebView2 prototype demonstrated native flying-tile animation in a Suuankou replay. Its flight audio was corrected and confirmed during replay playback. The live-match animation entry has been enabled in that prototype, but live-match playback and other yakuman remain untested. The private integration is not distributed in this repository.

## Install for local validation

1. Download and extract the extension ZIP, or use this repository's `extension/` directory.
2. Open `chrome://extensions` or `edge://extensions`, enable Developer mode, and choose Load unpacked.
3. Select the directory containing `manifest.json`.
4. Open `https://game.maj-soul.com/1/` and stay in the lobby. Click Yakuman FX, then Enable & Reload.
5. Confirm the lobby reminder. The game reloads automatically; wait for Verified temporary patch loaded.

If the popup remains at Waiting for verified resource reads, the patch has not been confirmed. Use Extension options in the browser extension manager to inspect saved cache-validation or runtime-query failures. A hook-installed message alone does not mean native effects are active.

The first opt-in is remembered. Future navigation to the supported game page automatically attaches. If the startup interception misses a load, the popup will remain in its waiting state; reload in the lobby. No external helper or command window is required. The browser briefly shows a debugging notice during startup. After verified resource reads and Unity initialization, the extension detaches automatically; the in-memory patch remains active until the page reloads. Opening DevTools or canceling the debugging notice before startup finishes may interrupt activation.

Restore Default disables automatic attachment and detaches. It does not immediately remove code already loaded into the game: reload in the lobby to finish restoration. Never reload during a live match.

## Appearance

Night mode is the default: dark gray surfaces, bright text, and salmon accents. Choose Night, Day, or System in the popup. The preference is saved locally and shared with the troubleshooting page; System follows live changes to the operating-system color preference.

## Experience

- Install the Chrome/Edge extension once and explicitly enable it.
- Apply native effects automatically when a supported game page starts.
- Show supported-version status and fail safely on unknown client builds.
- Offer Restore Default without automatically reloading an active match.
- Require no Steam client, desktop launcher, Node.js, or Python for end users.

The initial supported target is `https://game.maj-soul.com/1/`. Other regions, browsers, mobile clients, and future client builds are not established as supported.

## Technical direction

The inspected WebGL client retains its native Unity yakuman controller but disables it and omits its resource group. The prototype restores resource loading and the native animation entry. The game controller supplies the real completed hand; the effect is not a recorded video. A narrowly scoped audio-channel correction prevents the flight lead-in from being stopped by ordinary sound cleanup.

Browser-local patch generation is implemented without third-party dependencies. It validates the official SHA-256, decompresses UnityFS LZ4 blocks, applies three length-preserving script edits, and rebuilds the container. Independent parsing confirmed that exactly three TextAssets changed and 65 remained byte-identical. Full visual/audible ordinary-browser playback validation is still required.

The extension uses Chrome's Debugger API. It checks the framework SHA-256 and redirects reads of the verified cached core into a temporary in-memory file. Original persistent writes remain unchanged. The execution path must satisfy each store's policies; acceptance cannot be guaranteed. See `PRIVACY.md` and `STORE.md`.

## Development

End users do not need Node.js. Developers can run `npm test` with Node.js 22 or later. Tests cover LZ4 overlap and malformed data, UnityFS reconstruction, unknown-resource rejection, cache substitution, navigation scope, and restoration without automatic reload.

## Distribution boundary

Distribute original extension code only. Do not include extracted game scripts, repacked proprietary bundles, Steam assets, account data, browser profiles, or private desktop integrations. Any required official resources should be obtained and verified locally through a documented supported process.

## Limitations

This is an unofficial presentation modification. It does not guarantee protection from account sanctions. Claims about gameplay messages, data collection, permissions, and restoration must be verified against the finished extension before release.

Mahjong Soul and its assets belong to their respective owners. This project is not affiliated with or endorsed by them. A source-code license has not yet been selected.






