# Installation guide

[English README](../README.md) · [简体中文教程](INSTALL.zh-CN.md)

## Before you start

Use Chrome or Edge desktop with Chromium 118 or later. Check the [compatibility table](../README.md#compatibility) for supported game entries and builds. This unofficial client modification may result in account restrictions or bans; use at your own risk.

No Steam installation, administrator privileges, Node.js, Python, or command-line setup is required.

## 1. Download and extract

Open [Releases](https://github.com/Chaldeaaa/yakuman-fx/releases) and download the `yakuman-fx-v<version>.zip` attachment under **Assets**. This is the installable extension package; GitHub's automatic **Source code** downloads are the entire source repository.

Extract the ZIP to a folder you plan to keep, such as `Documents/Yakuman FX`. Do not load it directly from inside the ZIP or leave it in a temporary folder. If a Release is not available yet, use **Code → Download ZIP**, extract it, and find `extension/` inside the source folder.

The folder you select in the next step must contain:

```text
Yakuman FX/
├── manifest.json
├── background.js
├── popup.html
├── icons/
└── ...
```

If the source download contains an `extension/` subfolder, select that subfolder instead of the repository root.

## 2. Load into your browser

| Browser | Address to enter |
| --- | --- |
| Chrome | `chrome://extensions` |
| Edge | `edge://extensions` |

Turn on **Developer mode**, click **Load unpacked**, and select the folder containing `manifest.json`. Confirm that **Yakuman FX** appears and is enabled. Use the browser's extensions menu to pin its icon if desired.

Keep the installed folder after loading. The browser reads the extension files from that location. Installation is separate for each browser/profile.

## 3. Enable in the lobby

Open the [supported game entry](../README.md#compatibility) and wait until you are in the lobby. Open the Yakuman FX popup and click **Enable & Reload**. Confirm that you are in the lobby; the game reloads automatically.

The browser briefly displays a debugging notice. Wait until the extension reports:

```text
Native effects loaded. Debugging disconnected.
```

The toolbar badge should show **ON**. A “Temporary hook installed” message is only an intermediate state.

The preference is saved: future game loads activate automatically. Switch the popup's appearance with the sun-and-moon button in the upper-right corner. **Never enable/reload during a live match.**

## 4. Disable or remove

Click **Restore Default** to disable future activation. Then reload the game in the lobby to remove the modification already loaded in the page.

To uninstall, remove Yakuman FX from the browser's extension manager and reload the game. Once the extension is removed, its folder can be deleted.

## 5. Update

Close the game. Extract the new release and replace the extension files in the same installed folder. Return to the browser's extension manager, click Yakuman FX's **Reload** button, and reopen the game.

Use the same folder so the browser keeps referring to the same installation. Do not uninstall and reinstall just to update. There is no automatic release updater.

## If something goes wrong

Open the extension's **Details**, then **Extension options** / **Options** in the browser extension manager to read saved diagnostics. Viewing this page does not attach a debugger. Consult the [troubleshooting table](../README.md#troubleshooting).

For a report, include extension version, browser version, game entry/build, reproduction steps, and relevant saved diagnostics. Share a replay only if you are comfortable making its contents public. Never upload credentials, authentication tokens, or browser profiles.
