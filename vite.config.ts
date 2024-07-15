import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import mkcert from 'vite-plugin-mkcert';
import checker from 'vite-plugin-checker';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Unocss from 'unocss/vite';
import dayjs from 'dayjs';
import pkg from './package.json';
import type { UserConfig, ConfigEnv } from 'vite';

const CWD = process.cwd();

const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE } = loadEnv(mode, CWD);

  const isDev = command === 'serve';
  // const isBuild = command === 'build';

  return {
    /** 打包时根据实际情况修改 base */
    base: VITE_BASE_URL,
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 端口号 */
      port: 3333,
      /** 是否自动打开浏览器 */
      open: true,
      /** 跨域设置允许 */
      cors: true,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 接口代理 */
      proxy: {
        '/api/v1': {
          target: 'https://mock.mengxuegu.com/mock/63218b5fb4c53348ed2bc212',
          ws: true,
          /** 是否允许跨域 */
          changeOrigin: true,
        },
      },
      /** 预热常用文件，提高初始页面加载速度 */
      warmup: {
        // 请注意，只应该预热频繁使用的文件，以免在启动时过载 Vite 开发服务器
        // 可以通过运行 npx vite --debug transform 并检查日志来找到频繁使用的文件
        clientFiles: ['./index.html', './src/layouts/**/*.vue'],
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
          // additionalData: `
          //   @import '@/styles/variables.less';
          // `,
        },
      },
    },
    plugins: [
      vue(),
      Unocss(),
      vueJsx(),
      // 开启https 指定 mkcert 的下载源为 coding，从 coding.net 镜像下载证书
      mkcert({ source: 'coding' }),
      Components({
        // 配置文件生成位置
        dts: 'types/components.d.ts',
        // 全局注册组件的类型
        types: [
          {
            from: 'vue-router',
            names: ['RouterLink', 'RouterView'],
          },
        ],
        // ui库解析器
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
            exclude: ['Button'],
          }),
        ],
      }),
      // 配置vite将ts报错输出到控制台
      isDev &&
        checker({
          typescript: true,
          // vueTsc: true,
          eslint: {
            useFlatConfig: true,
            lintCommand: 'eslint "./src/**/*.{.vue,ts,tsx}"', // for example, lint .ts & .tsx
          },
          overlay: {
            initialIsOpen: false,
          },
        }),
    ],
    optimizeDeps: {
      include: ['lodash-es', 'ant-design-vue/es/locale/zh_CN', 'ant-design-vue/es/locale/en_US'],
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE === 'true' ? ['console.log', 'debugger'] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        'top-level-await': true,
      },
    },
    build: {
      minify: 'esbuild',
      cssTarget: 'chrome89',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // minifyInternalExports: false,
          manualChunks(id) {
            //TODO fix circular imports
            if (id.includes('/src/locales/helper.ts')) {
              return 'antdv';
            } else if (id.includes('node_modules/ant-design-vue/')) {
              return 'antdv';
            } else if (/node_modules\/(vue|vue-router|pinia)\//.test(id)) {
              return 'vue';
            }
          },
        },
        onwarn(warning, rollupWarn) {
          // ignore circular dependency warning
          if (
            warning.code === 'CYCLIC_CROSS_CHUNK_REEXPORT' &&
            warning.exporter?.includes('src/api/')
          ) {
            return;
          }
          rollupWarn(warning);
        },
      },
    },
  };
};
