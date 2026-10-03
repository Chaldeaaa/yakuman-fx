<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.png">
    <img src="assets/banner-light.png" width="560" alt="Yakuman FX">
  </picture>
</p>

<p align="center"><b>Bring native yakuman animations to Mahjong Soul in your browser.</b></p>

<p align="center">
  <a href="https://github.com/Chaldeaaa/yakuman-fx/releases"><img src="https://img.shields.io/badge/version-0.3.1-fa8072?style=flat-square" alt="Version 0.3.1"></a>
  <img src="https://img.shields.io/badge/browser-Chrome%20%2F%20Edge-555860?style=flat-square" alt="Chrome and Edge desktop">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-fa8072?style=flat-square" alt="GPL-3.0-only"></a>
  <img src="https://img.shields.io/badge/status-preview-555860?style=flat-square" alt="Preview">
</p>

<p align="center"><b>English</b> · <a href="README.zh-CN.md">简体中文</a></p>

<p align="center"><a href="https://github.com/Chaldeaaa/yakuman-fx/releases"><b>Download</b></a> · <a href="docs/INSTALL.md">Installation guide</a> · <a href="https://github.com/Chaldeaaa/yakuman-fx/issues">Report an issue</a></p>

---

Yakuman FX restores the game's built-in Unity effects using the actual winning hand. Install once and enable in the lobby; effects activate automatically on future visits. No Steam client, desktop helper, or command window is required.

> [!WARNING]
> **Account risk:** This is an unofficial client modification, not affiliated with or endorsed by Mahjong Soul or its operators. Using it may violate the game's terms or trigger account restrictions, including suspension or a permanent ban. No account-safety guarantee is provided. Use at your own risk. The software is provided without warranty; see [LICENSE](LICENSE).

## Contents

- [Features](#features)
- [Compatibility](#compatibility)
- [Quick start](#quick-start)
- [Disable and update](#disable-and-update)
- [Troubleshooting](#troubleshooting)
- [How it works](#how-it-works)
- [Development](#development)
- [License](#license)

## Features

| Feature | What it does |
| --- | --- |
| Native animations | Flying tiles and yakuman effects driven by the actual winning hand, with native audio. |
| Automatic activation | Enable once in the lobby; your preference is saved for future game loads. |
| Clear status and recovery | Distinguishes enabled, loading, ready, and error states, with a next step when needed. |
| Update checks | Check GitHub releases from Settings and follow the manual update instructions. |
| Language and appearance | English / Simplified Chinese interface and Light / Dark / System themes. |
| Local resource caching | Reuses verified resources on later launches to reduce repeated downloads. |

> [!NOTE]
> Resources are verified before use. Unknown builds are left unpatched, and a verification failure stops further substitutions for that page load. These safeguards do not guarantee account safety.

---

## Compatibility

| Game entry | Client build | Validation |
| --- | --- | --- |
| [Chinese-language entry](https://game.maj-soul.com/1/) | `chs_t-WebGL-release-4.0.47(47)` | Available |
| [International entry](https://mahjongsoul.game.yo-star.com/) | `en-WebGL-release-4.0.10(11)` | Available |
| [Japanese entry](https://game.mahjongsoul.com/) | `jp-WebGL-release-4.0.12(13)` | Available |


Chrome and Edge desktop are the intended browsers, with Chromium 118 or later. Live-match animation entry is enabled, but live-match playback and broader yakuman/audio coverage remain untested. Mobile browsers, Firefox, and desktop game clients are outside this distribution.

## Quick start

**Download → Extract → Load unpacked → Enable in the lobby**

1. Download and extract `yakuman-fx-v0.3.1.zip` from [Releases](https://github.com/Chaldeaaa/yakuman-fx/releases).
2. Open `edge://extensions` or `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the folder containing `manifest.json`.
4. Open a supported game entry, stay in the lobby, and click **Enable & Reload** in the extension popup.
5. Confirm the lobby reminder and wait for **Native effects ready**

> [!IMPORTANT]
> Keep the extracted folder in place. **Never reload during a live match.**

Future game loads activate automatically. No Node.js, Python, or local server is needed. Browser developer-mode reminders may appear.

See the step-by-step [installation guide](docs/INSTALL.md) for folder selection, first activation, updates, and removal. This project is distributed outside browser extension stores.

## Disable and update

**Language:** Click the gear in the popup's upper-right corner, then choose **English** or **简体中文** in Settings. Choose Light, Dark, or System under Theme. Preferences are saved and apply to both the popup and settings page.

**Disable:** Click **Restore Default**, then reload in the lobby to remove the patch already loaded into the page. To uninstall, remove the extension in the browser's extension manager and reload the game.

**Update:** Open **Settings → Check for updates**. If an update is available, follow the release link and download the extension ZIP. Close the game, extract the new files into the same installed folder, click **Reload** in the browser extension manager, then reopen the game. Updates are installed manually; checking only runs when you click the button.

## Troubleshooting

| Status or symptom | What to do |
| --- | --- |
| Enabled for future launches | Return to the lobby and reload to apply the saved setting. |
| Loading native effects | Wait for the game to finish loading. If the status persists after reaching the lobby, reload once. |
| Resources could not load | Check your connection and retry from the lobby. |
| Game resources do not match | Check for updates in Settings. If already up to date, include startup diagnostics in an issue report. |
| Native effects ready, but no animation | Report the browser and extension versions, game entry, replay details, and startup diagnostics. |
| Update check fails | Retry after checking your connection, or use the **Open releases** link in Settings. |

Open the popup's gear button, then expand **Troubleshooting** in Settings to view saved startup diagnostics. Do not post credentials, authentication tokens, or browser profiles in issues.

## How it works

The inspected WebGL client retains its native yakuman controller but disables the animation entry and skips its resource group. Yakuman FX restores those paths and corrects the flight audio channel. The controller supplies the actual completed hand; this is not video playback.

The extension validates the official framework and presentation bundle, makes three length-preserving script edits locally, and redirects verified reads into Unity's temporary virtual filesystem. Original persistent cache writes remain unchanged. Unknown resources are rejected rather than patched speculatively.

There is no analytics, advertising, telemetry service, or developer-operated server. Official resources are downloaded from the game's origin or official resource CDN and processed locally. The extension does not intercept game WebSocket messages or intentionally read account credentials. Checking for updates contacts GitHub only when requested. This does not guarantee account safety. See [Privacy](PRIVACY.md) for permissions and data handling.

## Development

Requires Node.js 22 or later for tests:

```sh
npm test
```

Tests cover resource processing and caching, patch boundaries, failure handling, message coalescing, bilingual recovery states, and release version comparison. Automated checks do not replace animation and audio playback testing.

Build the extension ZIP with Python 3:

```sh
python scripts/package.py
```

The package is written to `dist/`. GitHub Actions runs tests and builds versioned releases automatically. See [Distribution](DISTRIBUTION.md) for the release workflow and [Roadmap](ROADMAP.md) for planned work.

## License

Original project code is licensed under [GPL-3.0-only](LICENSE). When distributing modified versions, follow the GPL's source and license requirements. The license does not grant rights to Mahjong Soul's proprietary code or assets, which belong to their respective owners.

