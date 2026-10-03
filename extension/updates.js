export const releasesUrl = 'https://github.com/Chaldeaaa/yakuman-fx/releases';
export function compareVersions(a, b) {
  const parse = value => /^v?\d+\.\d+\.\d+$/.test(value) ? value.replace(/^v/, '').split('.').map(Number) : null;
  const left = parse(a), right = parse(b);
  if (!left || !right) return null;
  for (let i = 0; i < 3; i++) if (left[i] !== right[i]) return Math.sign(left[i] - right[i]);
  return 0;
}
export async function checkForUpdates(current, request = fetch) {
  // Include preview releases, which are the project's current distribution channel.
  const response = await request('https://api.github.com/repos/Chaldeaaa/yakuman-fx/releases?per_page=100', {
    credentials: 'omit', headers: {Accept: 'application/vnd.github+json'}, signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw Error('Update check failed');
  const releases = await response.json();
  if (!Array.isArray(releases)) throw Error('Invalid release response');
  const candidates = releases.filter(item => !item.draft && compareVersions(item.tag_name, current) !== null);
  candidates.sort((a, b) => compareVersions(b.tag_name, a.tag_name));
  const latest = candidates[0];
  if (!latest) throw Error('No release available');
  return {version: latest.tag_name, available: compareVersions(latest.tag_name, current) > 0,
    url: releasesUrl + '/tag/' + encodeURIComponent(latest.tag_name)};
}
