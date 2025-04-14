import { service } from "@/api";

/**
 * 获取知识图谱数据
 */
export function fetchGraphData(params) {
  // 参数是form-data格式
  
  return service.request({
    url: '/test/api/list',
    params,
    method: 'post'
  });

}

/**
 * 获取知识库文件列表
 */
export function fetchKnowledgeFiles(params) {
  return service.request({
    url: '/api/knowledge-base/files',
    method: 'get',
    params
  });
}

/**
 * 删除知识库文件
 */
export function deleteKnowledgeFile(fileId) {
  return service.request({
    url: `/api/knowledge-base/files/${fileId}`,
    method: 'delete'
  });
}

/**
 * 验证知识库文件
 */
export function verifyKnowledgeFiles(data) {
  return service.request({
    url: '/api/knowledge-base/verify',
    method: 'post',
    data
  });
}

/**
 * 上传知识库文件
 */
export function uploadKnowledgeFile(data) {
  return service.request({
    url: '/api/knowledge-base/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}