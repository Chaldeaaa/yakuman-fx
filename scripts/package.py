"""Build a deterministic, explicitly scoped extension ZIP using the standard library."""
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
FILES = (
    'manifest.json background.js bundle.js clients.js profiles.js resource-cache.js '
    'stream-hook.js main.js bridge.js popup.html popup.css popup.js dropdown.js '
    'i18n.js theme.js troubleshooting.html troubleshooting.js LICENSE NOTICE '
    'icons/icon-16.png icons/icon-32.png icons/icon-48.png icons/icon-128.png'
).split()

def build():
    manifest = json.loads((ROOT / 'extension/manifest.json').read_text(encoding='utf-8'))
    package = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
    version = manifest['version']
    if version != package['version']:
        raise ValueError('Manifest/package version mismatch')
    if manifest['permissions'] != ['storage']:
        raise ValueError('Unexpected permission set')
    for group in manifest['content_scripts']:
        if not set(group['js']).issubset(FILES):
            raise ValueError('Content script missing from package list')
    output = ROOT / 'dist' / f'yakuman-fx-v{version}.zip'
    output.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name in sorted(FILES):
            entry = zipfile.ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o644 << 16
            data = (ROOT / 'extension' / name).read_bytes()
            if not name.endswith('.png'):
                data = data.decode('utf-8').replace('\r\n', '\n').encode('utf-8')
            archive.writestr(entry, data)
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() or set(archive.namelist()) != set(FILES):
            raise ValueError('Archive verification failed')
    print(output)

if __name__ == '__main__':
    build()
