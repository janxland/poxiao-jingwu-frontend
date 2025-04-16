import { getToken } from '@/utils/token';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { aiPoliceAssistants } from '@/config/aiAssistants';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Index',
        meta: {
            title: '首页',
            keepAlive: true,
            requireAuth: false,
        },
        component: () => import('@/pages/Index.vue'),
    },
    {
        path: '/ai-police',
        name: 'AIPolice',
        meta: {
            title: 'AI警察系统',
            keepAlive: true,
            requireAuth: true,
        },
        component: () => import('@/pages/AIPolice.vue'),
        children: aiPoliceAssistants.map(assistant => ({
            path: assistant.path,
            name: assistant.name,
            meta: {
                title: assistant.title,
                keepAlive: true,
                requireAuth: true,
            },
            // 所有助手都使用同一个模板组件
            component: () => import('@/pages/ai-police/AIAssistantTemplate.vue')
        })),
    },
    // 删除重复的AI警察子路由
    {
        path: '/knowledge-base',
        name: 'KnowledgeBase',
        meta: {
            title: '知识库',
            keepAlive: true,
            requireAuth: true,
        },
        component: () => import('@/pages/KnowledgeBase.vue'),
    },
    {
        path: '/knowledge-graph',
        name: 'KnowledgeGraph',
        meta: {
            title: '知识图谱',
            keepAlive: true,
            requireAuth: true,
        },
        component: () => import('@/pages/KnowledgeGraph.vue'),
    },
    {
        path: '/detail',
        name: 'Detail',
        meta: {
            title: 'Detail Page',
            keepAlive: true,
            requireAuth: true,
        },
        component: () => import('@/pages/Detail.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫
router.beforeEach(async (to) => {
    // const token = getToken();
    // if (to.meta.requireAuth && !token) {
    //     return { name: 'Index' };
    // }
    document.title = `${to.meta.title || '智能知识管理平台'}`;
    return true;
});

export { router };
