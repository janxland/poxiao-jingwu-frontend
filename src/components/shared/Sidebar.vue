<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// 导入需要使用的图标组件
import { House, Monitor, Folder, Connection } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

const isCollapse = ref(false);
const isHidden = ref(false);

// 将isCollapse和isHidden暴露给父组件
defineExpose({ isCollapse, isHidden });

// 添加判断文本是否溢出的方法
const isTextOverflow = (text: string) => {
  // 简单判断：如果文本长度超过15个字符，认为可能溢出
  return text.length > 15;
};

const menuItems = [
  {
    title: '首页',
    icon: House,  // 直接使用导入的组件对象，而不是字符串
    index: '/',
    children: []
  },
  {
    title: 'AI警察',
    icon: Monitor,  // 直接使用导入的组件对象
    index: '/ai-police',
    children: [
      { title: '案情审查助手', index: '/ai-police/case-review' },
      { title: '法律咨询助手', index: '/ai-police/legal-consultant' },
      { title: '文件检察官', index: '/ai-police/text-review' },
      { title: '案件异常资金分析', index: '/ai-police/financial-analysis' },
      { title: '案件社会活动轨迹', index: '/ai-police/social-activity' },
      { title: '通信记录挖掘助手', index: '/ai-police/chat-review' },
      { title: '案件社会活动轨迹分析助手-文件上传版本', index: '/ai-police/social-activity-assistant' },
      { title: '通信记录挖掘助手-文件上传版', index: '/ai-police/chat-review-file' },
      { title: '案件异常资金分析助手-文件上传版', index: '/ai-police/financial-analysis-tool' },
    ]
  },
  {
    title: '知识库管理',
    icon: Folder,  // 直接使用导入的组件对象
    index: '/knowledge-base',
    children: []
  },
  {
    title: '知识图谱',
    icon: Connection,  // 直接使用导入的组件对象
    index: '/knowledge-graph',
    children: []
  }
];

const activeIndex = computed(() => {
  const path = route.path;
  
  // 精确匹配当前路径
  if (path === '/ai-police') return '/ai-police';
  
  // 查找子路由匹配
  for (const item of menuItems) {
    if (item.children) {
      for (const child of item.children) {
        if (path === child.index) {
          return path; // 返回子路由路径
        }
      }
    }
  }
  
  // 查找父路由匹配
  for (const item of menuItems) {
    if (path.startsWith(item.index) && item.index !== '/') {
      return item.index;
    }
  }
  
  return path;
});

const handleSelect = (index: string) => {
  router.push(index);
};

const toggleCollapse = () => {
  if (isCollapse.value) {
    // 如果当前是折叠状态，则展开
    isCollapse.value = false;
    isHidden.value = false;
  } else {
    // 如果当前是展开状态，则先折叠再隐藏
    isCollapse.value = true;
    setTimeout(() => {
      isHidden.value = true;
    }, 300); // 等待折叠动画完成后再隐藏
  }
};
</script>

<template>
  <div class="sidebar-container" :class="{ 'is-collapsed': isCollapse, 'is-hidden': isHidden }">
    <div class="sidebar-header">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
      <span v-if="!isCollapse" class="title">智慧侦探</span>
    </div>
    
    <el-menu
      :default-active="activeIndex"
      class="sidebar-menu"
      :collapse="isCollapse"
      @select="handleSelect"
      background-color="#f8f9fa"
      text-color="#333"
      active-text-color="#1890ff"
    >
      <template v-for="item in menuItems" :key="item.index">
        <el-sub-menu v-if="item.children && item.children.length" :index="item.index">
          <template #title>
            <el-icon style="margin-left:20px">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item 
            v-for="child in item.children" 
            :key="child.index" 
            :index="child.index"
            class="submenu-item"
          >
            <div class="submenu-content">
              <div class="submenu-indicator"></div>
              <el-tooltip 
                :content="child.title" 
                placement="right" 
                :disabled="!isTextOverflow(child.title)"
              >
                <div class="menu-text-ellipsis">{{ child.title }}</div>
              </el-tooltip>
            </div>
          </el-menu-item>
        </el-sub-menu>
        
        <el-menu-item v-else :index="item.index" class="menu-item">
          <el-icon style="margin-left:20px">
            <component :is="item.icon" />
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
  
  <!-- 将折叠按钮移到外部，这样在侧边栏隐藏时仍然可见 -->
  <div class="collapse-btn" :class="{ 'sidebar-hidden': isHidden }" @click="toggleCollapse">
    <el-icon v-if="isHidden"><el-icon-arrow-right /></el-icon>
    <el-icon v-else><el-icon-arrow-left /></el-icon>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-container {
  height: 100vh;
  transition: all 0.3s ease;
  width: 280px;
  background-color: #f8f9fa;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  
  &.is-collapsed {
    width: 80px;
  }
  
  &.is-hidden {
    left: -80px; // 完全隐藏侧边栏
  }
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  
  .logo {
    width: 36px;
    height: 36px;
    margin-right: 14px;
  }
  
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #1890ff;
    white-space: nowrap;
    overflow: hidden;
    letter-spacing: 1px;
  }
}

.sidebar-menu {
  height: calc(100vh - 70px); // 使用视口高度计算
  border-right: none;
  padding-top: 16px;
  overflow-y: auto; // 允许菜单滚动
}

.collapse-btn {
  height: 40px;
  width: 40px;
  position: fixed; // 改为fixed定位
  top: 10px;
  left: 260px; // 默认位置
  cursor: pointer;
  text-align: center;
  line-height: 40px;
  color: #1890ff;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001; // 确保在侧边栏之上
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background-color: #1890ff;
    color: #fff;
  }
  
  &.sidebar-hidden {
    left: 0px; // 侧边栏隐藏时按钮位置
  }
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  height: 60px;
  line-height: 60px;
  font-size: 17px;
  letter-spacing: 0.8px;
  padding: 0 !important;
  .el-icon {
    font-size: 22px;
    margin-right: 12px;
  }
  
  &:hover {
    background-color: #e6f7ff !important;
    color: #1890ff !important;
  }
}

:deep(.el-menu-item.is-active) {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: #1890ff;
  }
}

:deep(.el-sub-menu.is-active) {
  .el-sub-menu__title {
    color: #1890ff !important;
    background-color: #e6f7ff !important;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #1890ff;
    }
  }
}

:deep(.el-sub-menu__title) {
  cursor: pointer !important;
  
  &:hover {
    background-color: #e6f7ff !important;
    color: #1890ff !important;
  }
}.submenu-content {
  display: flex;
  align-items: center;
  font-size: 16px;
  width: 100%;
}

.submenu-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #bbb;
  margin-right: 10px;
  margin-left: 8px;
  flex-shrink: 0;
}

.menu-text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

:deep(.submenu-item) {
  padding-left: 40px !important;
  height: 50px !important;
  line-height: 50px !important;
  
  &.is-active {
    .submenu-indicator {
      background-color: #1890ff;
    }
  }
}

/* 添加过渡动画 */
:deep(.el-menu--collapse) {
  .el-sub-menu__title {
    span, .el-sub-menu__icon-arrow {
      transition: opacity 0.3s cubic-bezier(.55, 0, .1, 1);
      opacity: 0;
    }
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar-container {
    width: 240px;
    
    &.is-collapsed {
      width: 64px;
    }
  }
  
  .collapse-btn {
    left: 220px;
    
    &.sidebar-hidden {
      left: 0px;
    }
  }
}
</style>