<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

// 定义组件属性
const props = defineProps({
  // 下拉菜单标题
  title: {
    type: String,
    default: '筛选项'
  },
  // 下拉菜单选项
  options: {
    type: Array,
    default: () => []
  },
  // 当前选中的值
  modelValue: {
    type: [Array, String, Number],
    default: null
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 下拉菜单类型
  type: {
    type: String,
    default: 'primary'
  },
  // 下拉菜单宽度
  width: {
    type: [String, Number],
    default: 300
  },
  // 标签类型映射
  tagTypeMap: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'change', 'filter'])

// 内部状态
const selectedItems = ref(props.multiple ? (Array.isArray(props.modelValue) ? [...props.modelValue] : []) : props.modelValue)
const dropdownVisible = ref(false)

// 计算属性：显示的标题
const displayTitle = computed(() => {
  if (props.multiple) {
    if (selectedItems.value && selectedItems.value.length > 0) {
      return `${props.title} ${selectedItems.value.length}`
    }
    return props.title
  } else {
    if (selectedItems.value) {
      const option = props.options.find(opt => 
        typeof opt === 'object' ? opt.value === selectedItems.value : opt === selectedItems.value
      )
      return option ? (typeof option === 'object' ? option.label : option) : props.title
    }
    return props.title
  }
})

// 获取选项的显示文本
const getOptionLabel = (option) => {
  return typeof option === 'object' ? option.label : option
}

// 获取选项的值
const getOptionValue = (option) => {
  return typeof option === 'object' ? option.value : option
}

// 获取标签类型
const getTagType = (option) => {
  if (typeof option === 'object' && option.type) {
    return option.type
  }
  
  const value = getOptionValue(option)
  return props.tagTypeMap[value] || ''
}

// 获取标签效果
const getTagEffect = (option) => {
  return typeof option === 'object' && option.effect ? option.effect : 'light'
}

// 处理选项点击
const handleItemClick = (option) => {
  const value = getOptionValue(option)
  
  if (props.multiple) {
    const index = selectedItems.value.indexOf(value)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    } else {
      selectedItems.value.push(value)
    }
  } else {
    selectedItems.value = value
    dropdownVisible.value = false
  }
  
  emit('update:modelValue', selectedItems.value)
  emit('change', selectedItems.value)
  emit('filter', { type: props.title, value: selectedItems.value })
}

// 清空选择
const clearSelection = () => {
  selectedItems.value = props.multiple ? [] : null
  emit('update:modelValue', selectedItems.value)
  emit('change', selectedItems.value)
  emit('filter', { type: props.title, value: selectedItems.value })
}

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  selectedItems.value = props.multiple ? (Array.isArray(newVal) ? [...newVal] : []) : newVal
})
</script>

<template>
  <div class="filter-dropdown">
    <el-dropdown 
      trigger="click"
      placement="bottom-start" 
      :hide-on-click="false"
      v-model:visible="dropdownVisible"
    >
      <el-button :type="type" class="dropdown-trigger">
        {{ displayTitle }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      
      <template #dropdown>
        <el-scrollbar :height="options.length > 10 ? '300px' : 'auto'">
          <div class="dropdown-header">
            <span class="dropdown-title">{{ title }}</span>
            <el-button 
              v-if="selectedItems && (multiple ? selectedItems.length > 0 : selectedItems)"
              type="text" 
              size="small" 
              @click="clearSelection"
            >
              清空
            </el-button>
          </div>
          
          <div class="waterfall-container" :style="{ width: typeof width === 'number' ? `${width}px` : width }">
            <el-tag
              v-for="(option, index) in options"
              :key="index"
              class="waterfall-item !text-white"
              :class="{ 'is-selected': multiple 
                ? selectedItems.includes(getOptionValue(option)) 
                : selectedItems === getOptionValue(option) }"
              :type="getTagType(option)"
              :color="option.color || 'var(--el-color-primary)'"
              :effect="getTagEffect(option)"
              @click="handleItemClick(option)"
            >
              {{ getOptionLabel(option) }}
            </el-tag>
          </div>
        </el-scrollbar>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.el-dropdown__popper.el-popper{
  background: #ffffff5d !important;
}
.filter-dropdown {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
}

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  justify-content: space-between;
  min-width: 60px;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
}

.dropdown-title {
  font-weight: 500;
  color: #606266;
}

.waterfall-container {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  gap: 8px;
}

.waterfall-item {
  margin: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.waterfall-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.waterfall-item.is-selected {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  border-color: #606266;
  font-weight: bold;
}
</style>