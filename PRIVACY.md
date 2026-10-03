# Privacy

Yakuman FX has no analytics, advertising, telemetry service, or developer-operated server.

Clicking Check for updates sends a credential-free request to GitHub's public releases API. It does not send game data or diagnostics. GitHub receives ordinary connection metadata. No update check runs during game startup, and updates are downloaded and installed by the user.

The extension requests pinned official presentation resources from the selected region's official resource origin (`game.maj-soul.com` or `appstatic.mahjongsoul.com`) without credentials. These requests go to the game operator and remain subject to its network logging and policies.

Local extension storage holds enable, appearance and language preferences, together with verified presentation-resource replacements. Cached replacements are checked before reuse and avoid repeating downloads and reconstruction on subsequent launches. They remain in the browser and are removed when the extension is uninstalled. Session storage holds per-tab status and a limited startup diagnostic summary.

Packaged page scripts run on the supported Chinese, Japanese and English game entries. They verify the Unity factory fingerprint and cached resource checksum, then provide temporary replacement data for the matching read-only file descriptor. Original game-cache contents and writes remain unchanged. The extension does not intercept game WebSocket messages or intentionally read account credentials, hand histories or chat.

The extension uses the storage permission for preferences and verified resource caching. Game-origin access is used for the page integration and official resource downloads. Browsing history is not saved or transmitted. Page diagnostic messages are treated as advisory and cannot enable the extension or initiate navigation.

Restore Default disables future activation and substitutions. Reload the game in the lobby to remove animation state already loaded in the page. Uninstalling the extension and reloading also removes the temporary patch.
