<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// 定义AI警察功能列表
const aiPoliceModules = [
  {
    title: '案情审查助手',
    desc: '智能分析案情要点，提炼关键信息',
    icon: 'el-icon-document',
    path: '/ai-police/case-review',
    color: '#1890ff'
  },
  {
    title: '法律咨询助手',
    desc: '快速查询相关法律条文和解释',
    icon: 'el-icon-reading',
    path: '/ai-police/legal-consultant',
    color: '#52c41a'
  },
  {
    title: '文件检察官',
    desc: '文档合规性智能检查',
    icon: 'el-icon-document-checked',
    path: '/ai-police/text-review',
    color: '#722ed1'
  },
  {
    title: '通信记录挖掘助手',
    desc: '智能分析通讯记录中的异常',
    icon: 'el-icon-money',
    path: '/ai-police/chat-review',
    color: '#13c2c2'
  },
  {
    title: '案件异常资金分析',
    desc: '智能分析资金流向和异常',
    icon: 'el-icon-money',
    path: '/ai-police/financial-analysis',
    color: '#13c2c2'
  },
  {
    title: '案件社会活动轨迹',
    desc: '分析社会活动轨迹特征',
    icon: 'el-icon-map-location',
    path: '/ai-police/social-activity',
    color: '#eb2f96'
  }
];

// 判断是否显示模块列表
const showModuleList = computed(() => {
  return route.path === '/ai-police';
});
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="module-list" v-if="showModuleList">
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
              <el-icon :style="{ color: module.color }">
                <component :is="module.icon" />
              </el-icon>
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

}
.module-list {
  padding: 24px;
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
  
  &:hover {
    transform: translateY(-5px);
  }
}

.module-content {
  padding: 24px;
  text-align: center;
  border-top: 3px solid;
  
  .el-icon {
    font-size: 48px;
    margin-bottom: 16px;
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
  }
}
</style>