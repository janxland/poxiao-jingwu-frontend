import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import knowledgeGraphMock from './modules/knowledgeGraph';
import knowledgeBaseMock from './modules/knowledgeBase';  // 添加导入

// 创建 mock 实例
const createMock = (instance) => {
  const mock = new MockAdapter(instance, { delayResponse: 1000 });
  
  // 注册各模块的 mock 数据
  knowledgeGraphMock(mock);
  knowledgeBaseMock(mock);  // 添加注册
  
  // 未匹配到的请求将被放行
  mock.onAny().passThrough();
  
  return mock;
};

export default createMock;