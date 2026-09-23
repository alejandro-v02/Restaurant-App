import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fogonpos.meseros',
  appName: 'FogonPOS Meseros',
  webDir: 'dist/meseros/browser',
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
