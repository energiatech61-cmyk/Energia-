# ENERGIA — Android (Capacitor)

The project is now a real Capacitor Android app. The React UI, routing, and the
Lovable Cloud (Supabase) backend are unchanged.

## Build on your computer

```bash
npm install
npm run android:sync    # vite build + cap sync android
npm run android:open    # opens the real Android Studio project in ./android
```

Then in Android Studio: **Run ▶** on a physical device, or
**Build → Build Bundle(s)/APK(s) → Build APK(s)**.

Requirements: Android Studio (Ladybug+), JDK 17, Android SDK 35.

## App identity

- App name: `Solar Expert Energia`
- Application ID: `app.lovable.d27d0f611bf54912ae9b16aba3a4b489`
- Configured in `capacitor.config.ts` and `android/app/build.gradle` (unchanged from the existing PWA identity).

## Runtime model

The app is server-rendered (TanStack Start), so the native shell loads the
deployed site defined by `server.url` in `capacitor.config.ts`
(`https://energia-syria-homes.lovable.app`). Update that URL if you deploy to a
custom domain, then re-run `npm run android:sync`.

## Image upload on device

`src/lib/native-media.ts` uses `@capacitor/camera`:

- **Gallery**: `Camera.pickImages` → native Android photo picker (multi-select).
- **Camera**: `Camera.getPhoto` → native camera capture.
- The returned URI is converted into a real `File`, then handed to the existing
  Supabase Storage pipeline (compression, SHA-256 dedupe, signed-URL upload with
  SDK fallback) in `src/lib/media.ts`.
- No WebView-only `<input type="file">` is used on device; the input remains only
  as the web/PWA fallback (`isNativeApp()` decides).

Permissions declared in `android/app/src/main/AndroidManifest.xml`:
`CAMERA`, `READ_MEDIA_IMAGES` (Android 13+), `READ_EXTERNAL_STORAGE` (≤ API 32).
Permission prompts are requested at pick time; denial shows a localized message
and never navigates away from the admin screen.

## Test path

Admin → Products → Add/Edit product → **رفع صور** → native gallery → select
image(s) → progress → ✓ → **حفظ**. Reopen the product: the image URL persists in
the `products` row and renders from Supabase Storage.
