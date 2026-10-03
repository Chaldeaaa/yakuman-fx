export function describeStatus({valid, enabled, state, error}) {
  const view = (title, hint) => ({title, hint});
  if (!valid) return view('Open Mahjong Soul', 'Open a supported game page, then reopen this panel.');
  if (!enabled && !error) return view('Automatic effects off', ['disabled', 'enabled', 'attached', 'pending'].includes(state?.state)
    ? 'Future launches use default effects. Return to the lobby and reload to clear effects already loaded.'
    : 'In the lobby, choose Enable & Reload. Your preference is saved for future launches.');
  const failure = error || (state?.state === 'error' ? state.message : '');
  if (failure) {
    if (/download|fetch|network|timeout|abort/i.test(failure)) return view('Resources could not load', 'Check your connection, then reload from the lobby. If this persists, view startup diagnostics in Settings.');
    if (/checksum|unsupported|layout|replacement|cache-/i.test(failure)) return view('Game resources do not match', 'Check for updates in Settings. If you have the latest version, include startup diagnostics in an issue report.');
    return view('Effects could not start', 'Return to the lobby and reload once. If this persists, view startup diagnostics in Settings.');
  }
  if (state?.state === 'enabled') return view('Native effects ready', 'Effects are loaded on this page. No further action is needed.');
  if (state?.state === 'attached') return view('Loading native effects', 'Let the game finish loading. If this persists after reaching the lobby, reload once from the lobby.');
  return view('Enabled for future launches', 'Return to the lobby and reload to apply your saved setting.');
}
