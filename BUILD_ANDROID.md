# ENERGIA — Production Android build (APK + AAB)

App name: **ENERGIA – Solar Expert Energia**
Application ID (frozen, never change): `app.lovable.d27d0f611bf54912ae9b16aba3a4b489`

> The Lovable cloud environment has **no JDK and no Android SDK**, so the signed
> `.apk` / `.aab` binaries must be produced on your machine (or in CI). Everything
> else — the Android Studio project, signing configuration, icons, splash,
> permissions and release scripts — is already prepared here.

## 0. Requirements

- Android Studio (Ladybug or newer) with Android SDK **36** + Build Tools
- JDK **21** (bundled with recent Android Studio)
- Node 20+ and `npm install` done once

## 1. Create the production keystore (once)

There is **no keystore in this repository** (by design — secrets must never be in git).
Create one and back it up safely; losing it means you can never update the Play listing.

```bash
npm run android:keystore
# → creates ./energia-release.keystore, alias "energia"
```

Then create `android/keystore.properties` (git-ignored) from the template:

```bash
cp android/keystore.properties.example android/keystore.properties
# edit it and set storePassword / keyPassword / keyAlias / storeFile
```

CI alternative (no file needed) — set env vars:
`ENERGIA_KEYSTORE_FILE`, `ENERGIA_KEYSTORE_PASSWORD`, `ENERGIA_KEY_ALIAS`, `ENERGIA_KEY_PASSWORD`.

Where it is wired: `android/app/build.gradle` → `signingConfigs.release`
(V1+V2+V3+V4 signing enabled). If no keystore is found the release build still
runs but prints a warning and produces an **unsigned** artifact.

## 2. Build

```bash
npm install
npm run build            # web build (must pass)
npx cap sync android     # copies web assets + plugins

npm run android:apk      # → android/app/build/outputs/apk/release/ENERGIA-release.apk
npm run android:aab      # → android/app/build/outputs/bundle/release/app-release.aab
```

Rename the bundle for delivery if you like:

```bash
cp android/app/build/outputs/bundle/release/app-release.aab ENERGIA-release.aab
cp android/app/build/outputs/apk/release/ENERGIA-release.apk ENERGIA-release.apk
```

## 3. Verify the signature

```bash
$ANDROID_HOME/build-tools/36.0.0/apksigner verify --print-certs ENERGIA-release.apk
```

## 4. Install and test on a real device

```bash
adb install -r ENERGIA-release.apk
```

Test path (must pass before publishing):

1. Admin login → Products → Add/Edit product
2. **رفع صور** → native gallery (multi-select) → preview → upload → ✓
3. Save product → close → reopen → image still there
4. Repeat with **camera** capture
5. No crash, no reload, no jump back to the home page, no data loss

## 5. What is already configured

- **Icons**: full launcher set in `android/app/src/main/res/mipmap-*` incl. adaptive
  `mipmap-anydpi-v26/ic_launcher.xml`.
- **Splash**: `@drawable/splash` for all densities/orientations via
  `Theme.SplashScreen` (`AppTheme.NoActionBarLaunch`) plus `@capacitor/splash-screen`
  (1.5s, brand background `#F7F4E4`, no white flash).
- **Permissions** (`AndroidManifest.xml`, minimum needed only): `INTERNET`,
  `ACCESS_NETWORK_STATE`, `CAMERA`, `READ_MEDIA_IMAGES` (13+),
  `READ_EXTERNAL_STORAGE` (≤32), `WRITE_EXTERNAL_STORAGE` (≤29). No notifications,
  no location, no contacts.
- **Native media**: `src/lib/native-media.ts` (`Camera.pickImages` / `Camera.getPhoto`)
  feeding the existing Supabase Storage pipeline in `src/lib/media.ts`.
- **Backend**: unchanged — same Lovable Cloud (Supabase) project, same data.

## 6. Google Play

Upload `ENERGIA-release.aab`. Keep `versionCode` increasing in
`android/app/build.gradle` for every release (currently `1` / `1.0`).
