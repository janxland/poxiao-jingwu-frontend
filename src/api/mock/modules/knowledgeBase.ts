import { MockAdapter } from 'axios-mock-adapter';

// 模拟知识库文件列表
const mockFiles = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  
  const fileTypes = ['开房记录', '银行流水', '聊天记录', '交通记录', '用户聊天记录', '社会活动轨迹信息', '资金流水', '犯罪案例', '法律文件'];
  const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
  
  // 随机生成嫌疑人信息
  const hasSuspect = Math.random() > 0.5;
  const suspectName = hasSuspect ? ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)] : '';
  const suspectPhone = hasSuspect ? `1${Math.floor(Math.random() * 10)}${Math.random().toString().slice(2, 11)}` : '';
  
  return {
    id: `file-${index + 1}`,
    fileName: `${randomType}-${date.toISOString().split('T')[0]}.xlsx`,
    fileType: randomType,
    fileSize: Math.floor(Math.random() * 9000 + 1000) + 'KB',
    uploadTime: date.toLocaleString(),
    status: Math.random() > 0.2 ? '已验证' : '未验证',
    uploader: '管理员',
    suspectName: suspectName,
    suspectPhone: suspectPhone,
    uploadType: hasSuspect ? 'suspect' : 'common'
  };
});

export default function(mock: MockAdapter) {
  // 获取知识库文件列表
  mock.onGet('/api/knowledge-base/files').reply((config) => {
    const { page = 1, pageSize = 10, keyword = '' } = config.params || {};
    
    // 根据关键词过滤
    const filteredData = keyword 
      ? mockFiles.filter(item => 
          item.fileName.includes(keyword) || 
          item.fileType.includes(keyword) ||
          (item.suspectName && item.suspectName.includes(keyword)) ||
          (item.suspectPhone && item.suspectPhone.includes(keyword)))
      : mockFiles;
    
    // 分页处理
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);
    
    return [200, {
      code: 200,
      data: {
        list: paginatedData,
        total: filteredData.length,
        page: Number(page),
        pageSize: Number(pageSize)
      },
      message: '获取文件列表成功'
    }];
  });
  
  // 删除知识库文件
  mock.onDelete(/\/api\/knowledge-base\/files\/\w+/).reply((config) => {
    const id = config.url?.split('/').pop();
    
    // 模拟删除操作
    return [200, {
      code: 200,
      data: null,
      message: `文件(${id})删除成功`
    }];
  });
  
  // 文件验证接口
  mock.onPost('/api/knowledge-base/verify').reply((config) => {
    const data = JSON.parse(config.data || '{}');
    const files = data.files || [];
    const suspectInfo = data.suspectInfo;
    const fileType = data.fileType;
    
    // 模拟验证结果
    const results = files.map(file => {
      const randomPass = Math.random() > 0.3;
      
      // 根据文件类型生成不同的验证问题
      let issues = [];
      if (!randomPass) {
        if (fileType === 'chat') {
          issues = ['聊天记录格式不规范', '缺少时间戳信息', '聊天内容存在敏感词'];
        } else if (fileType === 'financial') {
          issues = ['资金流水格式不符合规范', '缺少交易对手信息', '存在异常大额交易'];
        } else if (fileType === 'social') {
          issues = ['轨迹数据不完整', '位置信息精度不足', '时间序列存在断点'];
        } else if (fileType === 'crime') {
          issues = ['案例描述不完整', '缺少关键事实', '法律依据不充分'];
        } else if (fileType === 'legal') {
          issues = ['文件格式不规范', '缺少必要的法律条款', '引用法条有误'];
        } else {
          issues = ['文件格式不符合规范', '缺少必要的字段信息', '数据存在异常值'];
        }
        
        // 随机选择1-3个问题
        issues = issues.slice(0, Math.floor(Math.random() * 3) + 1);
      }
      
      return {
        fileName: file.name,
        fileType: fileType ? mapFileTypeToName(fileType) : getFileTypeFromName(file.name),
        passed: randomPass,
        issues: issues
      };
    });
    
    return [200, {
      code: 200,
      data: {
        results,
        passed: results.every(r => r.passed),
        suspectInfo
      },
      message: '文件验证完成'
    }];
  });
  
  // 上传文件接口
  mock.onPost('/api/knowledge-base/upload').reply((config) => {
    // 从FormData中提取信息
    const suspectName = config.data.get ? config.data.get('suspectName') : '';
    const suspectPhone = config.data.get ? config.data.get('suspectPhone') : '';
    const uploadType = config.data.get ? config.data.get('uploadType') : 'common';
    const fileType = config.data.get ? config.data.get('fileType') : '';
    
    return [200, {
      code: 200,
      data: {
        fileId: 'file-' + Date.now(),
        suspectName,
        suspectPhone,
        uploadType,
        fileType
      },
      message: '文件上传成功'
    }];
  });
}

// 辅助函数：根据文件类型代码获取文件类型名称
function mapFileTypeToName(typeCode) {
  const typeMap = {
    'chat': '用户聊天记录',
    'social': '社会活动轨迹信息',
    'financial': '资金流水',
    'crime': '犯罪案例',
    'legal': '法律文件',
    'hotel': '开房记录',
    'bank': '银行流水',
    'traffic': '交通记录'
  };
  
  return typeMap[typeCode] || '其他记录';
}

// 辅助函数：从文件名推断文件类型
function getFileTypeFromName(fileName) {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('hotel') || lowerName.includes('开房')) return '开房记录';
  if (lowerName.includes('bank') || lowerName.includes('流水')) return '银行流水';
  if (lowerName.includes('chat') || lowerName.includes('聊天')) return '聊天记录';
  if (lowerName.includes('traffic') || lowerName.includes('交通')) return '交通记录';
  if (lowerName.includes('social') || lowerName.includes('轨迹')) return '社会活动轨迹信息';
  if (lowerName.includes('crime') || lowerName.includes('案例')) return '犯罪案例';
  if (lowerName.includes('legal') || lowerName.includes('法律')) return '法律文件';
  return '其他记录';
}