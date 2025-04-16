import createMock from './index';

export const setupMockInterceptor = (axiosInstance) => {
  console.log('Setting up mock interceptor...');
  createMock(axiosInstance);
};