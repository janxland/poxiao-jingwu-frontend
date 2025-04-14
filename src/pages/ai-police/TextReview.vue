<script setup lang="ts">
import { ref } from 'vue';
import WebView from '@/components/shared/WebView.vue';
import { chatUrls } from '@/config/chatUrls';

const chatUrl = chatUrls.textReview;
const apiKey = '';

const documentContent = ref('');
const reviewResult = ref(null);

const reviewDocument = async () => {
  // 实现文档审查逻辑
};
</script>

<template>
  <WebView 
    :src="chatUrl" 
    :apiKey="apiKey"
    title="文件检察官"
    description="上传文档进行合规性检查"
  />
</template>