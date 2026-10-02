# Yakuman FX

Native yakuman animations for Mahjong Soul in your browser.

## Status

The browser extension is in development. There is no installable browser release yet, and Chrome Web Store / Microsoft Edge Add-ons approval has not been obtained.

A private WebView2 prototype demonstrated native flying-tile animation in a Suuankou replay. Its flight audio was corrected and confirmed during replay playback. The live-match animation entry has been enabled in that prototype, but live-match playback and other yakuman remain untested. The private integration is not distributed in this repository.

## Planned experience

- Install the Chrome/Edge extension once and explicitly enable it.
- Apply native effects automatically when a supported game page starts.
- Show supported-version status and fail safely on unknown client builds.
- Offer Restore Default without automatically reloading an active match.
- Require no Steam client, desktop launcher, Node.js, or Python for end users.

The initial supported target is `https://game.maj-soul.com/1/`. Other regions, browsers, mobile clients, and future client builds are not established as supported.

## Technical direction

The inspected WebGL client retains its native Unity yakuman controller but disables it and omits its resource group. The prototype restores resource loading and the native animation entry. The game controller supplies the real completed hand; the effect is not a recorded video. A narrowly scoped audio-channel correction prevents the flight lead-in from being stopped by ordinary sound cleanup.

The public extension still needs browser-local patch generation and ordinary-browser validation. Chrome's Debugger API is a candidate transport; its permission and visible browser debugging notice must be disclosed if used. The final execution path must satisfy each store's policies. Store acceptance cannot be guaranteed.

## Distribution boundary

Distribute original extension code only. Do not include extracted game scripts, repacked proprietary bundles, Steam assets, account data, browser profiles, or private desktop integrations. Any required official resources should be obtained and verified locally through a documented supported process.

## Limitations

This is an unofficial presentation modification. It does not guarantee protection from account sanctions. Claims about gameplay messages, data collection, permissions, and restoration must be verified against the finished extension before release.

Mahjong Soul and its assets belong to their respective owners. This project is not affiliated with or endorsed by them. A source-code license has not yet been selected.

