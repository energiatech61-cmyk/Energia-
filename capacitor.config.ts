import type { CapacitorConfig } from '@capacitor/cli';

/**
 * ENERGIA — Capacitor Android configuration.
 *
 * The app is a TanStack Start (SSR) application, so the native shell loads the
 * deployed server build instead of a static bundle. `webDir` still points at the
 * client build output so `cap copy` has something to work with locally.
 */
const config: CapacitorConfig = {
  appId: 'app.lovable.d27d0f611bf54912ae9b16aba3a4b489',
  appName: 'ENERGIA – Solar Expert Energia',
  webDir: 'dist/client',
  android: {
    allowMixedContent: false,
  },
  server: {
    url: 'https://energia-syria-homes.lovable.app',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#F7F4E4',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
  },
};

export default config;
