<script setup lang="ts">
import { ref } from 'vue';
import WebView from '@/components/shared/WebView.vue';
import { chatUrls } from '@/config/chatUrls';

const chatUrl = chatUrls.legalConsultant;
const apiKey = '';

const legalQuery = ref('');
const queryResult = ref(null);

const searchLegalInfo = async () => {
  // 实现法律查询逻辑
};
</script>

<template>
  <WebView 
    :src="chatUrl" 
    :apiKey="apiKey"
    title="法律咨询助手"
    description="输入法律问题，获取专业解答"
  />
</template>