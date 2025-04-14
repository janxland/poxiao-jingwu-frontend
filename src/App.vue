<script lang="ts" setup>
import { useTimeAgo } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';
import Sidebar from '@/components/shared/Sidebar.vue';
import { useUserStore } from '@/store/user';
import ReloadPrompt from '@/pwa/ReloadPrompt.vue';
import ServiceWorker from './components/ServiceWorker.vue';

const userStore = useUserStore();
const route = useRoute();
const sidebarRef = ref(null); // 添加对侧边栏的引用

userStore.initUser();

const date = '__DATE__';
const timeAgo = useTimeAgo(date);

// 判断是否显示侧边栏（首页不显示）
const showSidebar = computed(() => {
  return route.path !== '/';
});

// 获取侧边栏折叠状态
const isCollapse = computed(() => {
  return sidebarRef.value?.isCollapse || false;
});
</script>
<template>
    <el-container>
        <!-- <el-header>
            <Header />
        </el-header> -->
        <el-container>
            <el-aside v-if="showSidebar" width="auto">
                <Sidebar ref="sidebarRef" />
            </el-aside>
            <el-main class="main">
                <RouterView />
                <!-- <br /> -->
                <!-- <ServiceWorker /> -->
                <!-- <br />
                <div>Built at: {{ date }} ({{ timeAgo }})</div> -->
            </el-main>
        </el-container>
        <!-- <el-footer>
            <Footer />
        </el-footer> -->
    </el-container>
    <ReloadPrompt />
</template>
<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: 16px;
    margin: 0;
}
#app {
    font-family: var(--globalFont), Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 150%;
    text-align: center;
}
.el-container {
  padding: 0 !important;
  height: 100vh; // 确保容器占满整个视口高度
}

.el-main {
  padding: 0 !important;
  overflow-y: auto; // 允许主内容区域滚动
  height: 100%; // 确保主内容区域占满容器高度
}

.main {
    min-height: 500px;
    color: #333;
}

.sw-msg {
    margin-top: 20px;
}

// 添加侧边栏相关样式
.el-aside {
  transition: width 0.3s;
  overflow: visible;
  background-color: #001529;
  padding: 0;
  position: fixed; // 固定侧边栏位置
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000; // 确保侧边栏在其他元素之上
  height: 100vh; // 确保侧边栏占满整个视口高度
}

// 为主内容区域添加左侧边距，以适应固定的侧边栏
.el-container .el-container {
  padding-left: v-bind('showSidebar ? (isCollapse ? "0" : "280px") : "0"') !important;
  transition: padding-left 0.5s;
}
</style>
