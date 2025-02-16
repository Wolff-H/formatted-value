import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path"
import UnpluginAutoImport from 'unplugin-auto-import/vite'
import dts from 'vite-plugin-dts'



// https://vite.dev/config/
export default defineConfig({
    base: './',
    build:
    {
        lib:
        {
            entry: path.resolve(__dirname, 'src/formatted-value/index.ts'),
            name: 'Echartx',
            fileName: (format) => `formatted-value.${format}.js`,
        },
        rollupOptions:
        {
            external: ['vue'],
            output:
            {
                globals:
                {
                    vue: 'Vue',
                },
            },
        },
    },
    resolve:
    {
        alias:
        {
            '@': path.resolve(__dirname, "./src"),
        },
    },
    server:
    {
        host: '0.0.0.0',
        port: 8001,
    },
    plugins:
    [
        vue(),
        UnpluginAutoImport({
            dts: true,
            eslintrc: {
                enabled: true,
            },
            imports:
            [
                // presets //
                'vue',
            ],
        }),
        dts({
            outDir: 'dist',
            insertTypesEntry: true,
        })
    ],
    css:
    {
        preprocessorOptions:
        {
            stylus:
            {
                globals:
                {
                    '_colorset': path.resolve('src/assets/stylesheets/colorset/index.styl'),
                },
            },
        },
    },
})
