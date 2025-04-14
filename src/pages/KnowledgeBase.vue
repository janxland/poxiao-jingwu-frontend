<template>
  <div class="knowledge-base-container">
    <div class="page-header pl-16">
      <h1>知识库管理系统</h1>
      <p>上传指定犯罪嫌疑人的相关信息，进行合规性校验</p>
    </div>

    <div class="content-wrapper">
      <!-- 上传组件 -->
      <FileUpload @refresh-list="refreshFileList" />
      
      <!-- 历史记录组件 -->
      <FileList ref="fileListRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileUpload from '@/components/knowledge/FileUpload.vue';
import FileList from '@/components/knowledge/FileList.vue';

const fileListRef = ref(null);

// 刷新文件列表
function refreshFileList() {
  fileListRef.value?.fetchHistoryRecords();
}
</script>

<style lang="scss" scoped>
.knowledge-base-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #303133;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
  text-align: left;
  
  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #303133;
  }
  
  p {
    font-size: 16px;
    color: #606266;
  }
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>