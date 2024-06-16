import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true, include: ['lib'] })],
  build: {
    minify: false,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'), // Library entry file
      name: 'ReactDatagrid',
    },
    rollupOptions: {
      input: {
        main: 'lib/index.ts',
      },
      external: [/^react(\/.*)?$/, /node_modules/, /@revolist\/revogrid/],
      output: {
        exports: 'named',
        globals: {
          'react': 'React',
          'react-dom/client': 'ReactDOMClient',
          'react/jsx-runtime': 'ReactJSXRuntime',
          '@revolist/revogrid': 'Revogrid',
          '@revolist/revogrid/loader': 'RevogridLoader',
        },
      },
    },
  },
  server: {
    open: '/demo/index.html',
  },
  resolve: {
    alias: {
      '@revolist/react-datagrid': resolve(__dirname, './lib'),
    },
  },
});
