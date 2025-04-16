<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import WebView from '@/components/shared/WebView.vue';
import { aiPoliceAssistants } from '@/config/aiAssistants';

const route = useRoute();
const currentPath = route.path;

// 根据当前路径获取助手配置
const currentAssistant = computed(() => {
  return aiPoliceAssistants.find(assistant => 
    currentPath === `/ai-police/${assistant.path}`
  ) || aiPoliceAssistants[0]; // 默认使用第一个助手
});

const apiKey = '';
</script>

<template>
  <WebView 
    :src="currentAssistant.chatUrl" 
    :apiKey="apiKey"
    :title="currentAssistant.title"
    :description="currentAssistant.description"
  />
</template>