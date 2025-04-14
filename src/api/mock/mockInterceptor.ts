import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import userMocks from './modules/user';
import knowledgeBaseMocks from './modules/knowledgeBase';
import knowledgeGraphMocks from './modules/knowledgeGraph';

// 配置Mock拦截器
export const setupMockInterceptor = (axiosInstance: AxiosInstance) => {
  // 根据环境变量决定是否启用Mock
  const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true';
  
  if (!enableMock) {
    console.log('Mock服务已禁用');
    return null;
  }
  
  // 创建mock适配器
  const mock = new MockAdapter(axiosInstance, { 
    delayResponse: 1000,  // 模拟网络延迟
    onNoMatch: 'passthrough'  // 未匹配的请求将通过
  });
  
  // 注册各模块的mock数据
  registerMocks(mock);
  
  console.log('Mock服务已启动');
  
  return mock;
};

// 注册所有模块的mock
const registerMocks = (mock: MockAdapter) => {
  // 用户相关接口
  userMocks(mock);
  
  // 知识库相关接口
  knowledgeBaseMocks(mock);

  knowledgeGraphMocks(mock)
};