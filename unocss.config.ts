// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetMini,
  presetUno,
  transformerVariantGroup,
  transformerDirectives,
} from 'unocss';

export default defineConfig({
  presets: [
    presetAttributify({
      prefix: 'un-',
      prefixedOnly: true,
    }),
    presetMini(),
    presetUno(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // 快捷方式
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-ac': 'flex justify-around items-center',
    'flex-bc': 'flex justify-between items-center',
  },
});
