# Privacy

Yakuman FX has no analytics, advertising, telemetry service, or developer-operated server.

The extension requests the pinned official presentation bundle from `game.maj-soul.com` without credentials, builds a temporary replacement locally, and validates the game framework. These requests go to the game operator and remain subject to its network logging and policies.

Local storage holds the automatic-enable preference. Session storage holds per-tab status messages. The generated presentation bundle is kept in extension memory and then in the game's temporary virtual filesystem; it is not uploaded to a third party.

Debugger access is used on supported game tabs to intercept the Unity framework response and read the extension's own diagnostic flag. The implementation does not intercept game WebSocket messages or intentionally read account credentials, hand histories, chat, or other gameplay messages.

Navigation events are checked to attach on the supported game URL and detach when leaving it. Browsing history is not saved or transmitted. The debugger permission is broad; the implementation limits its use to the supported game page. Chrome/Edge displays a debugging notice during attachment. The extension disconnects after verified loading. Saved diagnostics remain available in Extension options without reconnecting.

Restore Default disables future automatic attachment and detaches active sessions. Reload the game in the lobby to remove a patch already loaded in the page. Uninstalling the extension and reloading also removes the temporary patch.

