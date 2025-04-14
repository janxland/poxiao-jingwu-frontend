<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ElLoading } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    default: 'blwFL7AmhPoGFVap'
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
});

const iframeHeight = ref('calc(100vh - 120px)');
const isLoading = ref(true);
const iframeRef = ref(null);

onMounted(() => {
  window.addEventListener('resize', updateIframeHeight);
  updateIframeHeight();
});

const updateIframeHeight = () => {
  // 计算可用高度
  const headerHeight = 80; // 页面头部高度
  const availableHeight = window.innerHeight - headerHeight;
  iframeHeight.value = `${availableHeight}px`;
};

// 构建完整URL，包含API密钥
const fullUrl = ref('');
watch(() => props.src, (newSrc) => {
  const url = new URL(newSrc);
  if (props.apiKey && !url.pathname.includes(props.apiKey)) {
    // 如果URL中不包含apiKey，则添加
    const pathParts = url.pathname.split('/');
    if (pathParts[pathParts.length - 1] !== props.apiKey) {
      pathParts.push(props.apiKey);
      url.pathname = pathParts.join('/');
    }
  }
  fullUrl.value = url.toString();
  // 重置加载状态
  isLoading.value = true;
}, { immediate: true });

// iframe加载完成事件处理
const handleIframeLoad = () => {
  isLoading.value = false;
};
</script>

<template>
  <div class="webview-container">
    <div v-if="title || description" class="page-header">
      <h1 v-if="title">{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    
    <div class="iframe-container">
      <div v-if="isLoading" class="loading-container">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span class="loading-text">加载中，请稍候...</span>
      </div>
      
      <iframe 
        ref="iframeRef"
        :src="fullUrl" 
        :style="{ height: iframeHeight, opacity: isLoading ? 0 : 1 }"
        frameborder="0" 
        allowfullscreen
        allow="microphone; camera; geolocation"
        @load="handleIframeLoad"
      ></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.webview-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 8px 24px;
  text-align: left;
  
  h1 {
    font-size: 24px;
    color: #303133;
    margin-bottom: 8px;
  }
  
  p {
    color: #606266;
    font-size: 14px;
  }
}

.iframe-container {
  flex: 1;
  width: 100%;
  position: relative;
  
  iframe {
    width: 100%;
    border: none;
    background-color: #fff;
    transition: opacity 0.3s ease;
  }
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  z-index: 1;
  
  .loading-icon {
    font-size: 40px;
    color: #409EFF;
    animation: rotating 2s linear infinite;
  }
  
  .loading-text {
    margin-top: 16px;
    font-size: 16px;
    color: #606266;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>