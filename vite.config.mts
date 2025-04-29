/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import * as path from 'path';
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace';
import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import Unocss from 'unocss/vite';
import VueDevTools from 'vite-plugin-vue-devtools';

const pwaOptions: Partial<VitePWAOptions> = {
    mode: 'development',
    base: '/',
    includeAssets: ['favicon.svg'],
    manifest: {
        name: 'PWA Router',
        short_name: 'PWA Router',
        theme_color: '#ffffff',
        icons: [
            {
                src: 'pwa-192x192.png', // <== don't add slash, for testing
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/pwa-512x512.png', // <== don't remove slash, for testing
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: 'pwa-512x512.png', // <== don't add slash, for testing
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
    },
    devOptions: {
        enabled: process.env.SW_DEV === 'true',
        /* when using generateSW the PWA plugin will switch to classic */
        type: 'module',
        navigateFallback: 'index.html',
    },
};

const claims = process.env.CLAIMS === 'true';
const reload = process.env.RELOAD_SW === 'true';

if (process.env.SW === 'true') {
    pwaOptions.srcDir = 'src';
    pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts';
    pwaOptions.strategies = 'injectManifest';
    (pwaOptions.manifest as Partial<ManifestOptions>).name =
        'PWA Inject Manifest';
    (pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject';
}

if (claims) pwaOptions.registerType = 'autoUpdate';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    // 判断是否为生产环境构建
    const isProd = command === 'build';

    return {
        // 根据环境动态设置基础路径
        // base: isProd ? 'https://mybox-1257251314.cos.ap-chengdu.myqcloud.com/www/test/bot/' : '/',
        base: '/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        build: {
            target: 'es2020',
            cssTarget: 'chrome80',
            rollupOptions: {
                output: {
                    // 入口文件名（不能变，否则所有打包的 js hash 值全变了）
                    entryFileNames: 'index.js',
                    // 配置CDN路径前缀
                    assetFileNames: (assetInfo) => {
                        const info = assetInfo.name.split('.');
                        let extType = info[info.length - 1];
                        if (
                            /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(
                                assetInfo.name,
                            )
                        ) {
                            extType = 'media';
                        } else if (
                            /\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(
                                assetInfo.name,
                            )
                        ) {
                            extType = 'img';
                        } else if (
                            /\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(
                                assetInfo.name,
                            )
                        ) {
                            extType = 'fonts';
                        }
                        return `${extType}/[name]-[hash][extname]`;
                    },
                    chunkFileNames: 'js/[name]-[hash].js',
                    manualChunks: {
                        vue: ['vue', 'pinia', 'vue-router'],
                        elementplus: [
                            'element-plus',
                            '@element-plus/icons-vue',
                        ],
                    },
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
                },
            },
        },
        plugins: [
            vue(),
            AutoImport({
                imports: [
                    'vue',
                    'vue-router',
                    'vue-i18n',
                    'vue/macros',
                    '@vueuse/head',
                    '@vueuse/core',
                ],
                resolvers: [ElementPlusResolver()],
                dts: 'auto-imports.d.ts',
                vueTemplate: true,
            }),
            Components({
                dts: 'components.d.ts',
                resolvers: [ElementPlusResolver()],
            }),

            // https://github.com/antfu/unocss
            // see unocss.config.ts for config
            Unocss(),

            VitePWA(pwaOptions),

            // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
            VueI18n({
                runtimeOnly: true,
                compositionOnly: true,
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                strictMessage: false,
                fullInstall: true,
                // do not support ts extension
                include: [path.resolve(__dirname, 'locales/*.{yaml,yml,json}')],
            }),

            replace({
                preventAssignment: true,
                __DATE__: new Date().toISOString(),
                __RELOAD_SW__: reload ? 'true' : '',
            }),

            VueDevTools(),
        ],
        server: {
            port: 9000,
            host: '127.0.0.1',
            proxy: {
                '/api': {
                    target:
                        process.env.VITE_BACKEND_URL ||
                        'http://b18080.roginx.ink/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },

        // https://github.com/vitest-dev/vitest
        test: {
            include: ['src/tests/**/*.test.ts'],
            environment: 'jsdom',
            server: {
                deps: {
                    inline: ['@vue', '@vueuse', 'element-plus', 'pinia'],
                },
            },
        },
    };
});
