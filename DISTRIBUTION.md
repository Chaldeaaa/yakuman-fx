# Distribution

Yakuman FX is distributed through source downloads and manually installed extension ZIPs. Browser-store submission is not planned.

## Release contents

The installable ZIP contains the `extension/` directory's contents at the ZIP root, including `manifest.json`, original extension scripts, PNG icons, LICENSE, and NOTICE. End users do not need development runtimes or private launchers.

Keep the matching source revision available in this repository with each release, in accordance with GPL-3.0-only. The source archive is separate from the installable extension asset. No automatic updater is included.

Only original public project files may be published. Exclude extracted game scripts, proprietary bundles, Steam assets, credentials, browser profiles, research exports, and private desktop integrations. Required game resources are fetched from official origins and verified locally at runtime.

## Public release checklist

- English and Chinese README and installation guides.
- Accurate supported client build and validation limits.
- Account-risk disclaimer, privacy explanation, GPL license, and attribution notice.
- Matching source and installable extension ZIP attached to a versioned GitHub Release.
- A short demonstration recording or screenshots, with personal/account details removed.
- Playback and audio regression check for the supported replay before a release is labeled stable.

Source downloads are usable before a Release exists: extract the repository and load `extension/` using Developer mode. Keep the installed directory in place.
