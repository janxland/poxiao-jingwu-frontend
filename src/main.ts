import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 添加这行引入样式

import App from './App.vue';
import { store } from './store';
import { router } from './router';
import { i18n } from './i18n';
import { updateTheme } from './utils/theme';

import 'virtual:uno.css';
import '@/assets/styles/index.scss';
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss';

// 加载字体函数
function loadFont() {
    const fontUrl = import.meta.env.VITE_FONT_CDN_URL;

    if (fontUrl) {
        const fontLink = document.createElement('link');
        fontLink.setAttribute('rel', 'stylesheet');
        fontLink.setAttribute('href', fontUrl);

        // 添加加载失败的处理
        fontLink.onerror = () => {
            console.warn('CDN字体加载失败，使用本地字体');
            loadLocalFont();
        };

        document.head.appendChild(fontLink);

        // 设置默认字体为思源黑体
        document.documentElement.style.setProperty(
            '--globalFont',
            'Source Han Sans CN VF, sans-serif',
        );

        console.log('字体加载成功:', fontUrl);
    } else {
        console.warn('未配置字体CDN地址，使用本地字体');
        loadLocalFont();
    }
}

// 加载本地字体
function loadLocalFont() {
    // 动态导入字体文件
    import('@/assets/fonts/MiSans-Regular.woff')
        .then((fontModule) => {
            // 创建字体样式
            const style = document.createElement('style');
            style.textContent = `
      @font-face {
        font-family: 'MiSans';
        src: url('${fontModule.default}') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
            document.head.appendChild(style);

            // 设置默认字体为本地MiSans
            document.documentElement.style.setProperty(
                '--globalFont',
                'MiSans, sans-serif',
            );
            console.log('本地字体加载成功');
        })
        .catch((err) => {
            console.error('本地字体加载失败:', err);
            // 使用系统默认字体作为最终回退
            document.documentElement.style.setProperty(
                '--globalFont',
                'sans-serif',
            );
        });
}

// 在其他导入之后添加
import { setupMockInterceptor } from './api/mock/mockInterceptor';
import axios from 'axios';

// 在创建应用之前设置 mock 拦截器
if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
    console.log('启用模拟数据');
    setupMockInterceptor(axios);
}

async function main() {
    // 加载字体
    loadFont();

    // Start mock server
    if (import.meta.env.DEV || import.meta.env.VITE_IS_VERCEL) {
        const { worker } = await import('./mocks/index');
        worker.start({ onUnhandledRequest: 'bypass' });
    }

    const app = createApp(App);

    // 注册全局拖拽组件
    app.directive('drag', {
        mounted(el: HTMLElement) {
            const position = { x: 0, y: 0 };
            const lastPos = { x: 0, y: 0 };

            function updatePosition(clientX: number, clientY: number): void {
                const dx = clientX - lastPos.x;
                const dy = clientY - lastPos.y;
                position.x += dx;
                position.y += dy;
                el.style.transform = `translate(${position.x}px, ${position.y}px)`;
                lastPos.x = clientX;
                lastPos.y = clientY;
            }

            function handleMove(e: MouseEvent | TouchEvent): void {
                const coords = 'touches' in e ? e.touches[0] : e;
                updatePosition(coords.clientX, coords.clientY);
                if (e.cancelable) e.preventDefault(); // 防止手机端滚动
            }

            function handleEnd(e: MouseEvent | TouchEvent): void {
                const coords = 'changedTouches' in e ? e.changedTouches[0] : e;
                updatePosition(coords.clientX, coords.clientY);
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('mouseup', handleEnd);
                document.removeEventListener('touchend', handleEnd);
            }

            function startDrag(e: MouseEvent | TouchEvent): void {
                e.stopPropagation();
                document.body.style.userSelect = 'none';
                const initEvent = 'touches' in e ? e.touches[0] : e;
                lastPos.x = initEvent.clientX;
                lastPos.y = initEvent.clientY;

                document.addEventListener('mousemove', handleMove);
                document.addEventListener('touchmove', handleMove, {
                    passive: false,
                });
                document.addEventListener('mouseup', handleEnd);
                document.addEventListener('touchend', handleEnd);
            }

            el.addEventListener('mousedown', startDrag);
            el.addEventListener('touchstart', startDrag, { passive: true });
        },

        // 在组件卸载时移除事件监听器
        unmounted(el: HTMLElement): void {
            el.removeEventListener('mousedown', el.__dragStartHandler);
            el.removeEventListener('touchstart', el.__dragStartHandler);
        },
    });

    // load plugins
    app.use(store);
    app.use(router);
    app.use(ElementPlus);
    app.use(i18n);

    app.mount('#app');

    updateTheme();
}

main();
