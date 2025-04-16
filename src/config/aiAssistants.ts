/**
 * AI助手统一配置
 * 集中管理所有AI助手的路由、名称、描述和URL
 */

// 基础URL
const host = import.meta.env.VITE_DIFY_HOST || `${window.location.protocol}//${window.location.hostname}:8080`;
console.log('host', host);

export interface AIAssistant {
  // 路由路径（不含前缀）
  path: string;
  // 路由名称
  name: string;
  // 显示名称
  title: string;
  // 描述文本
  description: string;
  // 聊天URL
  chatUrl: string;
  // 是否为文件上传版本
  isFileUpload?: boolean;
}

// AI警察系统下的所有助手配置
export const aiPoliceAssistants: AIAssistant[] = [
  {
    path: 'xinghanzhicheng',
    name: 'xinghanzhicheng',
    title: '星汉智策',
    description: '输入案情内容，AI将提炼重点和矛盾点',
    chatUrl: `${host}/chat/LUSWOVQqsMFvDVkh`
  },
  {
    path: 'case-review',
    name: 'CaseReview',
    title: '案情审查助手',
    description: '输入案情内容，AI将提炼重点和矛盾点',
    chatUrl: `${host}/chat/ccGu0xdHJjsHh88z`
  },
  {
    path: 'legal-consultant',
    name: 'LegalConsultant',
    title: '法律咨询助手',
    description: '输入法律问题，AI将提供专业解答',
    chatUrl: `${host}/chat/FsHm55Spifx3UN40`
  },
  {
    path: 'text-review',
    name: 'TextReview',
    title: '文件检察官',
    description: '上传文件，AI将进行内容审查和分析',
    chatUrl: `${host}/chat/gUO76lx6jUTo0HTr`
  },
  {
    path: 'financial-analysis',
    name: 'FinancialAnalysis',
    title: '案件异常资金分析',
    description: '输入资金流水，AI将分析异常交易',
    chatUrl: `${host}/chat/t2gcGxMh3IvTbCaF`
  },
  {
    path: 'social-activity',
    name: 'SocialActivity',
    title: '案件社会活动轨迹',
    description: '输入活动数据，AI将分析社会关系网络',
    chatUrl: `${host}/chat/Z4elfT8FJXTuxckb`
  },
  {
    path: 'chat-review',
    name: 'ChatReview',
    title: '通信记录挖掘助手',
    description: '输入通信记录，AI将挖掘关键信息',
    chatUrl: `${host}/chat/h0Nx7ewMoPscgw2I`
  },
  {
    path: 'social-activity-assistant',
    name: 'SocialActivityAssistant',
    title: '案件社会活动轨迹分析助手-文件上传版本',
    description: '上传活动数据文件，AI将分析社会关系网络',
    chatUrl: `${host}/chat/jePj9p80QgSyXL05`,
    isFileUpload: true
  },
  {
    path: 'chat-review-file',
    name: 'ChatReviewFile',
    title: '通信记录挖掘助手-文件上传版',
    description: '上传通信记录文件，AI将挖掘关键信息',
    chatUrl: `${host}/chat/ofpbpNpaEN1DAzqr`,
    isFileUpload: true
  },
  {
    path: 'financial-analysis-tool',
    name: 'FinancialAnalysisTool',
    title: '案件异常资金分析助手-文件上传版',
    description: '上传资金流水文件，AI将分析异常交易',
    chatUrl: `${host}/chat/jSH45bvArUJcYSPM`,
    isFileUpload: true
  }
];

// 获取完整路由路径
export const getFullPath = (path: string) => `/ai-police/${path}`;

// 生成路由到URL的映射
export const generateRouteToChatUrlMap = () => {
  const map: Record<string, string> = {};
  
  aiPoliceAssistants.forEach(assistant => {
    map[getFullPath(assistant.path)] = assistant.chatUrl;
  });
  
  return map;
};

// 路由路径到聊天URL的映射
export const routeToChatUrlMap = generateRouteToChatUrlMap();

// 导出聊天URL映射，供其他模块使用
export const chatUrls = {
  // 案件社会活动轨迹分析
  socialActivityUpload: aiPoliceAssistants.find(a => a.path === 'social-activity-assistant')?.chatUrl || '',
  socialActivity: aiPoliceAssistants.find(a => a.path === 'social-activity')?.chatUrl || '',
  
  // 案件异常资金分析
  financialAnalysis: aiPoliceAssistants.find(a => a.path === 'financial-analysis')?.chatUrl || '',
  financialAnalysisUpload: aiPoliceAssistants.find(a => a.path === 'financial-analysis-tool')?.chatUrl || '',
  
  // 案情审查
  caseReview: aiPoliceAssistants.find(a => a.path === 'case-review')?.chatUrl || '',
  
  // 法律咨询
  legalConsultant: aiPoliceAssistants.find(a => a.path === 'legal-consultant')?.chatUrl || '',
  
  // 通信记录挖掘
  chatReview: aiPoliceAssistants.find(a => a.path === 'chat-review')?.chatUrl || '',
  chatReviewUpload: aiPoliceAssistants.find(a => a.path === 'chat-review-file')?.chatUrl || '',
  
  // 文件审查
  textReview: aiPoliceAssistants.find(a => a.path === 'text-review')?.chatUrl || ''
};

export default {
  aiPoliceAssistants,
  getFullPath,
  generateRouteToChatUrlMap,
  routeToChatUrlMap,
  chatUrls
};