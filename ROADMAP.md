# Roadmap

Priority order agreed on 2026-10-03. Store submission follows the development tasks below.

## Current priority: reduce debugger dependence

- [ ] Validate an early MAIN-world integration with Unity that does not rewrite the framework response.
- [ ] Preserve resource fingerprint checks, temporary read substitution, original cache contents, restore behavior and synchronized audio.
- [ ] Verify cold startup and cached startup before replacing the current implementation.
- [ ] Remove the debugger permission only after the replacement works end to end. Do not claim that shorter attachment time removes the permission.

Chrome does not permit `debugger` as an optional permission. See [permissions documentation](https://developer.chrome.com/docs/extensions/reference/api/permissions). Existing release artifacts remain unchanged during this investigation.

## Three development todos

1. **Clear status and recovery guidance** — distinguish unsupported game builds, resource download failures, startup progress and ready status; provide bilingual, actionable messages.
2. **Sanitized diagnostic export** — copy extension version, supported game build and failure stage; exclude credentials, account identifiers, replay content and unrelated browsing information.
3. **Automated build and release packaging** — run tests, check version consistency, package only extension files and associate artifacts with the matching source revision.

All three are pending and take priority over store submission. User-interface work follows the debugger investigation.

## Chrome Web Store submission

- [ ] Refresh the submission kit after the implementation stabilizes.
- [ ] Complete real Chrome playback checks and screenshots.
- [ ] Finalize publisher details and accurate permission / remote-code declarations.
- [ ] Submit for review.
