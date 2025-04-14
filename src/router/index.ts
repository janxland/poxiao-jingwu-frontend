import { getToken } from '@/utils/token';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 移除直接导入，改为懒加载方式
// import CaseReview from '@/pages/ai-police/CaseReview.vue';
// import LegalConsultant from '@/pages/ai-police/LegalConsultant.vue';
// import TextReview from '@/pages/ai-police/TextReview.vue';
// import FinancialAnalysis from '@/pages/ai-police/FinancialAnalysis.vue';
// import SocialActivity from '@/pages/ai-police/SocialActivity.vue';

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
        children: [
            { 
                path: 'case-review', 
                name: 'CaseReview',
                meta: {
                    title: '案情审查助手',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/CaseReview.vue') 
            },
            { 
                path: 'legal-consultant', 
                name: 'LegalConsultant',
                meta: {
                    title: '法律咨询助手',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/LegalConsultant.vue') 
            },
            { 
                path: 'text-review', 
                name: 'TextReview',
                meta: {
                    title: '文件检察官',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/TextReview.vue') 
            },
            { 
                path: 'financial-analysis', 
                name: 'FinancialAnalysis',
                meta: {
                    title: '案件异常资金分析',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/FinancialAnalysis.vue') 
            },
            { 
                path: 'social-activity', 
                name: 'SocialActivity',
                meta: {
                    title: '案件社会活动轨迹',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/SocialActivity.vue') 
            },
            { 
                path: 'chat-review', 
                name: 'ChatReview',
                meta: {
                    title: '通信记录挖掘助手',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/chat-review.vue') 
            },
            // 添加三个新路由
            { 
                path: 'social-activity-assistant', 
                name: 'SocialActivityAssistant',
                meta: {
                    title: '案件社会活动轨迹分析助手-文件上传版本',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/social-activity-assistant.vue') 
            },
            { 
                path: 'chat-review-file', 
                name: 'ChatReviewFile',
                meta: {
                    title: '通信记录挖掘助手-文件上传版',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/chat-review-file.vue') 
            },
            { 
                path: 'financial-analysis-tool', 
                name: 'FinancialAnalysisTool',
                meta: {
                    title: '案件异常资金分析助手-文件上传版',
                    keepAlive: true,
                    requireAuth: true,
                },
                component: () => import('@/pages/ai-police/financial-analysis-assistant.vue') 
            },
        ],
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
    // 保留详情页路由
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
    return true; // 添加返回值
});

export { router };
