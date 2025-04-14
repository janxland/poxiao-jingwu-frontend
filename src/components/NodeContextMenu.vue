<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { ElTabs, ElTabPane, ElTag, ElButton } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  node: {
    type: Object,
    default: () => null
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  relations: {
    type: Array,
    default: () => []
  },
  filterTypes: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'view-details'])

const contextMenuRef = ref(null)

watch(() => props.x, (newVal) => {
  if(contextMenuRef.value) {
    contextMenuRef.value.style.transform = 'translate(0,0)'
  }
})

const activeTab = ref('relation')

const getNodeName = (node) => {
  if (typeof node === 'object') {
    return node.name ?? node.id
  }
  return node
}

const isSourceNode = (edge, node) => {
  const srcId = typeof edge.source === 'object' ? edge.source.id : edge.source
  return srcId === node.id
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      v-drag
      ref="contextMenuRef"
      class="fixed z-50 bg-white rounded-md shadow-lg border p-3 w-100 text-left"
      :style="{ left: x + 'px', top: y + 'px' }"
      @click.stop
    >
      <div class="flex justify-between items-center mb-4 [line-height:150%]">
        <span class="font-semibold truncate">
          {{ node?.name || node?.id || '无' }}
        </span>
        <el-icon
          class="cursor-pointer"
          @click="$emit('close')"
          style="color: #999"
          size="16"
        >
          <Close />
        </el-icon>
      </div>
      
      <el-button 
        type="primary" 
        size="small" 
        style="width: 100%; margin-bottom: 10px;"
        @click="$emit('view-details', node)"
      >
        查看详细信息
      </el-button>

      <el-tabs v-model="activeTab" stretch>
        <el-tab-pane label="关系列表" name="relation">
          <ul class="space-y-1 max-h-80 overflow-auto" @mousedown.stop>
            <li
              v-for="edge in relations"
              :key="`${getNodeName(edge.source)}-${getNodeName(edge.target)}-${edge.type}`"
              class="text-sm"
            >
              <div>
                <el-tag class="!text-white mr-1" :type="'info'" size="small" 
                :color="filterTypes['relationTypes']?.filterConfig?.options?.find((oo)=> oo.value == edge.type)?.color">
                  {{ edge.type }}
                </el-tag>
                {{ isSourceNode(edge, node) ? '→' : '←' }}
                {{ getNodeName(
                    isSourceNode(edge, node) ? edge.target : edge.source
                ) }}
              </div>

              <ul v-if="edge.relation_detail && edge.relation_detail.length" class="ml-4 mt-1 text-gray-600">
                <li 
                  v-for="(detail, idx) in edge.relation_detail" 
                  :key="idx"
                  style="list-style-type: circle; margin-left: 20px;"
                >
                  {{ detail }}
                </li>
              </ul>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="基本属性" name="basic">
          <p>ID：{{ node?.id }}</p>
          <p>角色：{{ node?.role }}</p>
          <p>风险：{{ node?.risk }}</p>
        </el-tab-pane>
        <el-tab-pane label="用户画像" name="profile">
          <p class="text-gray-400">待补充画像信息…</p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>