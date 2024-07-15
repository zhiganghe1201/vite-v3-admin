import { createApp } from 'vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupAssets } from '@/plugins';

const app = createApp(App);

function setupPlugins() {
  // 引入静态资源
  setupAssets();
}

async function setupApp(app) {
  // 挂载 pinia 状态管理
  setupStore(app);

  // 挂载路由
  await setupRouter(app);

  app.mount('#app');
}

setupPlugins();
setupApp(app);
