<script setup lang="ts">
import { ref } from 'vue';
import WebView from '@/components/shared/WebView.vue';
import { chatUrls } from '@/config/chatUrls';

const chatUrl = chatUrls.chatReview;
const apiKey = '';

const caseContent = ref('');
const analysisResult = ref(null);

const analyzeCaseContent = async () => {
  // 实现案情分析逻辑
};
</script>

<template>
  <WebView 
    :src="chatUrl" 
    :apiKey="apiKey"
    title="通信记录挖掘助手"
    description="输入案情内容，AI将提炼重点和矛盾点"
  />
</template>