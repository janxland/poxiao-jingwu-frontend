<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { aiPoliceAssistants, getFullPath } from '@/config/aiAssistants';
import { Document, Reading, DocumentChecked, ChatLineRound, Money, MapLocation, Upload } from '@element-plus/icons-vue';

const route = useRoute();

// 图标映射
const iconMap = {
  'case-review': Document,
  'legal-consultant': Reading,
  'text-review': DocumentChecked,
  'chat-review': ChatLineRound,
  'financial-analysis': Money,
  'social-activity': MapLocation,
  'social-activity-assistant': Upload,
  'chat-review-file': Upload,
  'financial-analysis-tool': Upload
};

// 颜色映射
const colorMap = {
  'case-review': '#1890ff',
  'legal-consultant': '#52c41a',
  'text-review': '#722ed1',
  'chat-review': '#13c2c2',
  'financial-analysis': '#fa8c16',
  'social-activity': '#eb2f96',
  'social-activity-assistant': '#eb2f96',
  'chat-review-file': '#13c2c2',
  'financial-analysis-tool': '#fa8c16'
};

// 从aiAssistants动态生成模块列表
const aiPoliceModules = computed(() => {
  return aiPoliceAssistants.map(assistant => ({
    title: assistant.title,
    desc: assistant.description,
    icon: iconMap[assistant.path] || Document,
    path: getFullPath(assistant.path),
    color: colorMap[assistant.path] || '#1890ff',
    isFileUpload: assistant.isFileUpload
  }));
});

// 判断是否显示模块列表
const showModuleList = computed(() => {
  return route.path === '/ai-police';
});
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="module-list" v-if="showModuleList">
        <h1 class="page-title">AI警察系统</h1>
        <p class="page-description">选择下方功能模块，开始智能辅助办案</p>
        
        <div class="module-grid">
          <el-card
            v-for="module in aiPoliceModules"
            :key="module.path"
            class="module-card"
            :body-style="{ padding: '0' }"
            shadow="hover"
            @click="$router.push(module.path)"
          >
            <div class="module-content" :style="{ borderTopColor: module.color }">
              <div class="icon-container" :style="{ backgroundColor: `${module.color}15` }">
                <el-icon :style="{ color: module.color }">
                  <component :is="module.icon" />
                </el-icon>
                <div v-if="module.isFileUpload" class="upload-badge">
                  <el-icon><Upload /></el-icon>
                </div>
              </div>
              <h3>{{ module.title }}</h3>
              <p>{{ module.desc }}</p>
            </div>
          </el-card>
        </div>
      </div>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
  text-align: center;
}

.page-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
}

.module-list {
  padding: 32px;
  max-width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
}

.content-wrapper {
  margin: 0 auto;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px 0;
}

.module-card {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.module-content {
  padding: 24px;
  text-align: center;
  border-top: 3px solid;
  background-color: #fff;
  
  .icon-container {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    position: relative;
    
    .el-icon {
      font-size: 36px;
    }
    
    .upload-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #1890ff;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      
      .el-icon {
        font-size: 14px;
      }
    }
  }
  
  h3 {
    font-size: 18px;
    margin-bottom: 12px;
    color: #1f1f1f;
  }
  
  p {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    height: 42px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>