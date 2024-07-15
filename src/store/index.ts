import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import type { App } from 'vue';

export const pinia = createPinia();

pinia.use(
  createPersistedState({
    key: (id) => `__persisted__${id}`,
    auto: false,
  }),
);

export function setupStore(app: App<Element>) {
  app.use(pinia);
}
