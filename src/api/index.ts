import axios from 'axios';
import { ElMessage } from 'element-plus';
import * as login from './modules/login';
import * as index from './modules/index';
import { setupMockInterceptor } from './mock/mockInterceptor';
import { getToken, removeToken } from '@/utils/auth';
// import router from '@/router';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
});

// 请求队列管理
const pendingRequests = new Map();

// 生成请求的唯一key
const generateRequestKey = (config) => {
  const { url, method, params, data } = config;
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
};

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    // 请求标识
    const requestKey = generateRequestKey(config);
    
    // 如果请求正在进行中，取消重复请求
    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey);
      controller.abort();
      pendingRequests.delete(requestKey);
    }
    
    // 创建新的AbortController
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller);
    
    // 添加token到请求头
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  response => {
    // 请求完成后，从队列中移除
    const requestKey = generateRequestKey(response.config);
    pendingRequests.delete(requestKey);
    
    const res = response.data;
    
    // 根据业务状态码处理
    if (res.code == undefined) {
      return response;
    }
    if (res.code !== 200 && res.code !== 0) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      });
      
      // 处理特定错误码
      if (res.code === 401) {
        // token过期或未授权
        removeToken();
        // router.push('/login');
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    } else {
      return res;
    }
  },
  error => {
    // 如果是取消请求，不显示错误
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return Promise.reject(error);
    }
    
    // 请求失败后，从队列中移除
    if (error.config) {
      const requestKey = generateRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }
    
    ElMessage({
      message: error.message || '请求失败',
      type: 'error',
      duration: 5 * 1000
    });
    
    return Promise.reject(error);
  }
);

// 设置Mock拦截器（仅在开发环境启用）
if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCK === 'true') {
  setupMockInterceptor(service);
}

// 导出API模块
const api = Object.assign({}, login, index);

// 导出axios实例和API
export { service };
export default api;
