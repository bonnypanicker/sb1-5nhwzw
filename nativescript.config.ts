import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.locationapp',
  appPath: 'app',
  appResourcesPath: '../../tools/assets/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    codeCache: true,
    package: 'org.nativescript.locationapp'
  }
} as NativeScriptConfig;