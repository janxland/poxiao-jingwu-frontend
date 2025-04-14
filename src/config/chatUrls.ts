/**
 * 聊天助手URL配置
 */
//去除原有端口，端口固定为8080
const host = `${window.location.protocol}//${window.location.hostname}:8080`
console.log('host', host);

// const host = `${window.location.protocol}//${window.location.host}/dify`
export const chatUrls = {
  // 案件社会活动轨迹分析
  socialActivityUpload: `${host}/chat/jePj9p80QgSyXL05`, // 文件上传版本
  socialActivity: `${host}/chat/Z4elfT8FJXTuxckb`,
  
  // 案件异常资金分析
  financialAnalysis: `${host}/chat/t2gcGxMh3IvTbCaF`,
  financialAnalysisUpload: `${host}/chat/jSH45bvArUJcYSPM`, // 文件上传版
  
  // 案情审查
  caseReview: `${host}/chat/ccGu0xdHJjsHh88z`,
  
  // 法律咨询
  legalConsultant: `${host}/chat/FsHm55Spifx3UN40`,
  
  // 通信记录挖掘
  chatReview: `${host}/chat/h0Nx7ewMoPscgw2I`,
  chatReviewUpload: `${host}/chat/ofpbpNpaEN1DAzqr`, // 文件上传版
  
  // 文件审查
  textReview: `${host}/chat/gUO76lx6jUTo0HTr`
};

// 路由路径到聊天URL的映射
export const routeToChatUrlMap = {
  '/ai-police/case-review': chatUrls.caseReview,
  '/ai-police/legal-consultant': chatUrls.legalConsultant,
  '/ai-police/text-review': chatUrls.textReview,
  '/ai-police/financial-analysis': chatUrls.financialAnalysis,
  '/ai-police/social-activity': chatUrls.socialActivity,
  '/ai-police/chat-review': chatUrls.chatReview,
  '/ai-police/social-activity-assistant': chatUrls.socialActivityUpload,
  '/ai-police/chat-review-file': chatUrls.chatReviewUpload,
  '/ai-police/financial-analysis-tool': chatUrls.financialAnalysisUpload
};

export default {
  chatUrls,
  routeToChatUrlMap
};