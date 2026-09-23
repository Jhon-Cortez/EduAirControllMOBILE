import { registerRootComponent } from 'expo';

import storage from './src/shared/storage/storage';
import { applySavedLanguage } from './src/shared/i18n/i18n';
import App from './App';

// Hydrate the storage adapter (AsyncStorage → cache síncrono) antes de montar la app.
async function bootstrap() {
  await storage.init();
  applySavedLanguage();
  registerRootComponent(App);
}

bootstrap();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately