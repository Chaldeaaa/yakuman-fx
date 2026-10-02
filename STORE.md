# Store Submission Readiness

Status: not submitted or approved.

## Product polish before stable release

- A temporary original hand-drawn 和 / Fx icon is included at 16, 32, 48, and 128 pixels. Final branding and store screenshots remain pending.
- Diagnostics have been moved out of the main popup into Extension options. This view reads saved startup diagnostics without attaching a debugger.
- Debugging now disconnects automatically after verified bundle reads and Unity initialization. The browser-controlled notice appears during startup, then the debugging session ends normally. The in-memory patch remains until reload. An integration without the Debugger API would still be needed to avoid even the startup notice. Do not suppress notices through browser flags or settings.

The extension has a single purpose: restore native yakuman presentation in a supported Mahjong Soul WebGL build. Its original logic is packaged locally and readable. Proprietary game resources are obtained from the official origin and modified locally; they are not included in the extension ZIP.

Permissions:

- `debugger`: the CDP Fetch response interception and diagnostics used for temporary integration. The browser's debugging notice remains visible.
- `storage`: enable preference and per-tab status.
- `webNavigation`: automatic attachment before a supported game load and detachment when navigating away.
- `https://game.maj-soul.com/*`: the supported game and its pinned official resources.

Chrome's Manifest V3 requirements list a limited Debugger API exception for remote execution. Confirm that this exact resource transformation and execution path qualifies; do not assume the exception guarantees acceptance. Review Microsoft Edge's requirements separately.

Before submission, verify unpacked installation in Chrome and Edge, native replay rendering and audio, repeated startup, unknown-build fallback, restoration, tab closure, and browser restart. Prepare store icons/screenshots and a reviewer walkthrough. Choose a source-code license. Publish the privacy document at an accessible URL. Live-match playback and other yakuman remain unvalidated; do not advertise them as tested.

Policy reference: https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements
