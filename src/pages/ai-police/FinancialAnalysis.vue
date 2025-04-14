<script setup lang="ts">
import { ref } from 'vue';
import WebView from '@/components/shared/WebView.vue';
import { chatUrls } from '@/config/chatUrls';

const chatUrl = chatUrls.financialAnalysis;
const apiKey = '';

const financialData = ref(null);
const analysisResult = ref(null);

const analyzeFinancialData = async () => {
  // 实现资金分析逻辑
};
</script>

<template>
  <WebView 
    :src="chatUrl" 
    :apiKey="apiKey"
    title="案件异常资金分析助手"
    description="分析转账流水、征信报告等金融信息"
  />
</template>