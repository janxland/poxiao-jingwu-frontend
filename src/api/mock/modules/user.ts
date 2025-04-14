import { MockAdapter } from 'axios-mock-adapter';

export default function(mock: MockAdapter) {
  // 模拟登录接口
  mock.onPost('/api/user/login').reply((config) => {
    const { username, password } = JSON.parse(config.data);
    
    if (username === 'admin' && password === '123456') {
      return [200, {
        code: 200,
        data: {
          token: 'mock-token-' + Date.now(),
          userInfo: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            roles: ['admin']
          }
        },
        message: '登录成功'
      }];
    } else {
      return [200, {
        code: 400,
        message: '用户名或密码错误'
      }];
    }
  });
  
  // 模拟获取用户信息接口
  mock.onGet('/api/user/info').reply((config) => {
    // 检查是否有token
    const token = config.headers?.Authorization;
    
    if (token && token.includes('mock-token')) {
      return [200, {
        code: 200,
        data: {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          roles: ['admin'],
          permissions: ['*']
        },
        message: '获取用户信息成功'
      }];
    } else {
      return [200, {
        code: 401,
        message: '未授权，请重新登录'
      }];
    }
  });
  
  // 模拟登出接口
  mock.onPost('/api/user/logout').reply(() => {
    return [200, {
      code: 200,
      data: null,
      message: '登出成功'
    }];
  });
}