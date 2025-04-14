<script setup lang="ts">
import { ref } from 'vue';
import WebView from '@/components/shared/WebView.vue';
import { chatUrls } from '@/config/chatUrls';

const chatUrl = chatUrls.socialActivity;
const apiKey = '';

const activityData = ref(null);
const analysisResult = ref(null);

const analyzeActivityData = async () => {
  // 实现活动轨迹分析逻辑
};
</script>

<template>
  <WebView 
    :src="chatUrl" 
    :apiKey="apiKey"
    title="案件社会活动轨迹分析助手"
    description="分析出行记录、住院记录、开房记录等信息"
  />
</template>