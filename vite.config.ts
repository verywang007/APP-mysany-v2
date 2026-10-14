import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

// 页面样式用 CSS 嵌套做作用域隔离（:where(.pg-xxx) { ... }），
// 由 lightningcss 按 browserslist 目标展开成普通选择器，兼容旧版 iOS Safari。
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.5%, last 2 versions, iOS >= 14, not dead')),
    },
  },
  build: {
    cssMinify: 'lightningcss',
  },
});
