<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import NodeDetailPanel from '@/components/NodeDetailPanel.vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => null
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'back-to-graph'])

// 关闭节点详情
function closeNodeDetail() {
  emit('close')
}

// 返回图谱
function backToGraph() {
  emit('back-to-graph')
}
</script>

<template>
  <Teleport to="body">
    <NodeDetailPanel 
      :node="node" 
      :visible="visible"
      @close="closeNodeDetail"
      @back-to-graph="backToGraph"
    />
  </Teleport>
</template>