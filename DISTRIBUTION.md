# Distribution

Yakuman FX is distributed through source downloads and manually installed extension ZIPs.

## Release contents

The installable ZIP contains the `extension/` directory's contents at the ZIP root, including `manifest.json`, original extension scripts, PNG icons, LICENSE, and NOTICE.

Keep the matching source revision available in this repository with each release, in accordance with GPL-3.0-only. The source archive is separate from the installable extension asset. No automatic updater is included.

Required game resources are fetched from official origins and verified locally at runtime.

## Public release checklist

- English and Chinese README and installation guides.
- Accurate supported client build and validation limits.
- Account-risk disclaimer, privacy explanation, GPL license, and attribution notice.
- Matching source and installable extension ZIP attached to a versioned GitHub Release.
- A short demonstration recording or screenshots, with personal/account details removed.
- Playback and audio regression check for the supported replay before a release is labeled stable.

Source downloads are usable before a Release exists: extract the repository and load `extension/` using Developer mode. Keep the installed directory in place.

## Automated releases

Update `package.json`, `extension/manifest.json`, both README version references and `docs/releases/vVERSION.md` together. A version change merged into `main` runs the release workflow: tests, deterministic ZIP packaging, then a versioned preview release. The workflow also supports `v*` tag pushes and manual runs. Existing releases are left unchanged. A tag must match the package version.

Run `npm test` and `python scripts/package.py` locally before publishing. GitHub automatically supplies the matching source archives; the workflow attaches the installable ZIP.
