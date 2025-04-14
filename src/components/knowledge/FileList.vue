<template>
  <div class="file-list-container">
    <div class="history-header">
      <h2>知识库文件管理</h2>
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文件名或类型"
          clearable
          @keyup.enter="searchHistory"
          @clear="resetSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="searchHistory">搜索</el-button>
          </template>
        </el-input>
        <el-button type="primary" @click="resetSearch" :icon="Refresh">刷新</el-button>
      </div>
    </div>

    <el-table
      :data="historyRecords"
      style="width: 100%"
      v-loading="historyLoading"
      border
      stripe
    >
      <el-table-column prop="fileName" label="文件名" min-width="200" show-overflow-tooltip />
      <el-table-column prop="fileType" label="文件类型" width="160">
        <template #default="scope">
          <el-tag :type="getFileTypeTagType(scope.row.fileType)">
            {{ scope.row.fileType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="文件大小" width="100" />
      <el-table-column prop="fileUpdate" label="更新时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="viewFileDetails(scope.row)">
            查看
          </el-button>
          <el-button type="danger" size="small" @click="deleteHistoryRecord(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 文件详情对话框 -->
    <el-dialog
      v-model="fileDetailVisible"
      title="文件详情"
      width="60%"
      destroy-on-close
    >
      <div v-if="currentFile" class="file-detail-content">
        <div class="file-info-section">
          <h3>基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">文件名：</span>
              <span class="value">{{ currentFile.fileName }}</span>
            </div>
            <div class="info-item">
              <span class="label">文件类型：</span>
              <span class="value">
                <el-tag :type="getFileTypeTagType(currentFile.fileType)">
                  {{ currentFile.fileType }}
                </el-tag>
              </span>
            </div>
            <div class="info-item">
              <span class="label">文件大小：</span>
              <span class="value">{{ currentFile.fileSize }}</span>
            </div>
            <div class="info-item">
              <span class="label">更新时间：</span>
              <span class="value">{{ currentFile.fileUpdate }}</span>
            </div>
          </div>
        </div>

        <div class="file-content-section">
          <h3>文件内容预览</h3>
          <div class="content-preview">
            <div v-if="fileContentLoading" class="loading-content">
              <el-skeleton :rows="10" animated />
            </div>
            <div v-else-if="fileContent" class="preview-content">
              <pre v-if="isJsonContent">{{ formatJson(fileContent) }}</pre>
              <div v-else class="text-content">{{ fileContent }}</div>
            </div>
            <div v-else class="no-preview">
              <el-empty description="无法预览此类型文件" />
              <el-button type="primary" @click="downloadFile(currentFile)">下载文件</el-button>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="fileDetailVisible = false">关闭</el-button>
          <el-button type="primary" @click="downloadFile(currentFile)">下载</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { Search, Refresh } from '@element-plus/icons-vue';
import { service } from '@/api'; // 导入axios实例

// ========== 历史记录相关 ==========
const historyRecords = ref([]);
const historyLoading = ref(false);
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 文件详情相关
const fileDetailVisible = ref(false);
const currentFile = ref(null);
const fileContent = ref('');
const fileContentLoading = ref(false);
const isJsonContent = computed(() => {
  try {
    if (typeof fileContent.value === 'string' && fileContent.value.trim().startsWith('{')) {
      JSON.parse(fileContent.value);
      return true;
    }
    return false;
  } catch {
    return false;
  }
});

// 获取文件类型对应的标签类型
function getFileTypeTagType(fileType) {
  if (!fileType) return 'info';
  
  const type = fileType.toLowerCase();
  if (type === 'json') return 'success';
  if (type === 'txt') return 'primary';
  if (type === 'csv') return 'warning';
  if (type === 'xml') return 'danger';
  return 'info';
}

// 获取历史记录
async function fetchHistoryRecords() {
  historyLoading.value = true;
  try {
    // 从后端获取数据
    const response = await service.get('/uploadfile/api/filelist', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        keyword: searchKeyword.value
      }
    });
    console.log(response.data);
    
    historyRecords.value = response.data || [];
    total.value = historyRecords.value.length;
  
  } catch (error) {
    ElMessage.error('获取文件列表失败');
    console.error(error);
  } finally {
    historyLoading.value = false;
  }
}

// 搜索
function searchHistory() {
  currentPage.value = 1;
  fetchHistoryRecords();
}

function resetSearch() {
  searchKeyword.value = '';
  currentPage.value = 1;
  fetchHistoryRecords();
}

// 分页
function handlePageChange(page) {
  currentPage.value = page;
  fetchHistoryRecords();
}

function handleSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1;
  fetchHistoryRecords();
}

// 删除记录
function deleteHistoryRecord(record) {
  ElMessageBox.confirm(`确定要删除文件 "${record.fileName}" 吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const loadingInstance = ElLoading.service({
        text: '正在删除...',
        background: 'rgba(255, 255, 255, 0.7)'
      });
      try {
        // 修改为新的删除接口
        const response = await service.delete('uploadfile/api/delMinioFile', {
          params: { fileName: record.fileName }
        });
        
        if (response.status === 200) {
          fetchHistoryRecords();
          ElMessage.success('删除成功');
        } else {
          ElMessage.error('删除失败');
        }
      } catch (error) {
        ElMessage.error('删除失败');
        console.error(error);
      } finally {
        loadingInstance.close();
      }
    })
    .catch(() => {});
}

// 查看文件详情
async function viewFileDetails(record) {
  currentFile.value = record;
  fileDetailVisible.value = true;
  fileContent.value = '';
  
  // 如果是可预览的文件类型，尝试获取内容
  if (isPreviewableFile(record.fileName)) {
    fileContentLoading.value = true;
    try {
      // 修改为新的预览接口
      const response = await service.get('/uploadfile/api/getFile', {
        params: { 
          fileName: record.fileName,
          download: false
        }
      });
      
      if (response) {
        fileContent.value = JSON.stringify(response);
      } else {
        ElMessage.warning('无法加载文件内容');
      }
    } catch (error) {
      ElMessage.warning('无法加载文件内容');
      console.error(error);
    } finally {
      fileContentLoading.value = false;
    }
  }
}

// 判断文件是否可预览
function isPreviewableFile(fileName) {
  const lowerName = fileName.toLowerCase();
  return lowerName.endsWith('.json') || 
         lowerName.endsWith('.txt') || 
         lowerName.endsWith('.csv') || 
         lowerName.endsWith('.xml');
}

// 格式化JSON显示
function formatJson(jsonString) {
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
  } catch {
    return jsonString;
  }
}

// 下载文件
async function downloadFile(file) {
  if (!file) return;
  
  const loadingInstance = ElLoading.service({
    text: '准备下载...',
    background: 'rgba(255, 255, 255, 0.7)'
  });
  
  try {
    // 修改为新的下载接口
    const response = await service.get('/uploadfile/api/getFile', {
      params: { 
        fileName: file.fileName,
        download: true 
      },
      responseType: 'blob'
    });
    
    // 创建下载链接
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    ElMessage.success('文件下载成功');
  } catch (error) {
    ElMessage.error('文件下载失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

// 页面加载
onMounted(() => {
  fetchHistoryRecords();
});

// 暴露方法给父组件调用
defineExpose({
  fetchHistoryRecords
});
</script>

<style lang="scss" scoped>
.file-list-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 20px;
    font-weight: 500;
    color: #303133;
  }
}

.search-bar {
  display: flex;
  gap: 16px;
  width: 400px;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

// 文件详情样式
.file-detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.file-info-section, .file-content-section {
  background-color: #f8f9fb;
  border-radius: 8px;
  padding: 16px;
  
  h3 {
    font-size: 18px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 8px;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  
  .label {
    width: 100px;
    color: #606266;
    text-align: right;
    padding-right: 12px;
  }
  
  .value {
    flex: 1;
    color: #303133;
  }
}

.content-preview {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 16px;
  min-height: 300px;
  max-height: 500px;
  overflow: auto;
  border: 1px solid #ebeef5;
}

.preview-content {
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #303133;
  }
}

.no-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 24px;
}

.loading-content {
  padding: 20px;
}
</style>