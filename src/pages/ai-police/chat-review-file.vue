<script setup lang="ts">
import { ref } from 'vue';
import WebView from '@/components/shared/WebView.vue';

import { chatUrls } from '@/config/chatUrls';

const chatUrl = chatUrls.chatReviewUpload;
const apiKey = '';

const searchQuery = ref('');
const loading = ref(false);
const searchResults = ref([]);

const handleSearch = () => {
  loading.value = true;
};
</script>

<template>
  <WebView 
    :src="chatUrl" 
    :apiKey="apiKey"
    title="通信记录挖掘助手-文件上传版"
    description="点击智能体可进行实时交互"
  />
</template>

<style lang="scss" scoped>
// 样式保持不变
</style>