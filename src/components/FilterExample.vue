<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import FilterDropdown from './FilterDropdown.vue'

// 定义筛选器配置类型
interface FilterOption {
  label: string
  value: string | number
  type?: string
}

interface FilterConfig {
  key: string
  title: string
  options: FilterOption[]
  multiple: boolean
  type: string
}

// 定义props和emits
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  configs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:configs', 'filter-change'])

// 筛选条件 - 使用动态对象存储
const currentFilters = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 筛选器配置
const filterConfigs = computed({
  get: () => {
    // 如果父组件没有提供配置，则使用默认配置
    if (props.configs && props.configs.length > 0) {
      return props.configs
    }
    
    return [
      {
        key: 'relationTypes',
        title: '关系类型',
        options: [
          "家庭关系",
          "同事关系",
        ],
        multiple: true,
        type: 'primary'
      },
      {
        key: 'locations',
        title: '地点',
        options: [
          { label: '飞机', value: 'plane', type: 'primary' },
          { label: '火车', value: 'train', type: 'success' },
          { label: '网吧', value: 'netbar', type: 'warning' },
          { label: '服务处所', value: 'service', type: 'info' },
          { label: '住所', value: 'home', type: 'danger' }
        ],
        multiple: true,
        type: 'success'
      },
      {
        key: 'timeRange',
        title: '时间范围',
        options: [
          { label: '今天', value: 'today', type: 'danger' },
          { label: '昨天', value: 'yesterday', type: 'warning' },
          { label: '本周', value: 'week', type: 'primary' },
          { label: '本月', value: 'month', type: 'info' },
          { label: '全部', value: 'all', type: 'success' }
        ],
        multiple: false,
        type: 'warning'
      },
      {
        key: 'personType',
        title: '人物类型',
        options: [
          { label: '嫌疑人', value: 'suspect', type: 'danger' },
          { label: '受害者', value: 'victim', type: 'primary' },
          { label: '证人', value: 'witness', type: 'warning' },
          { label: '中立人员', value: 'neutral', type: 'info' }
        ],
        multiple: false,
        type: 'danger'
      }
    ]
  },
  set: (value) => emit('update:configs', value)
})

// 本地存储筛选条件
const localFilters = reactive({})

// 初始化筛选条件
const initFilters = () => {
  filterConfigs.value.forEach(config => {
    if (!(config.key in localFilters)) {
      localFilters[config.key] = config.multiple ? [] : null
    }
  })
  
  // 将初始值同步到父组件
  if (Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', { ...localFilters })
  } else {
    // 将父组件的值同步到本地
    Object.keys(props.modelValue).forEach(key => {
      localFilters[key] = props.modelValue[key]
    })
  }
}

// 初始化
initFilters()

// 监听配置变化重新初始化
watch(() => props.configs, () => {
  initFilters()
}, { deep: true })

// 监听筛选条件变化
watch(localFilters, (newFilters) => {
  // console.log('筛选条件变化:', newFilters)
  // 同步到父组件
  emit('update:modelValue', { ...newFilters })
  // 更新数据
  // updateFilteredData()
}, { deep: true })

// 筛选结果
const filteredData = ref([])

// 处理筛选变化
const handleFilterChange = (filterInfo) => {
  console.log('Example筛选变化:', filterInfo.value)
  emit('filter-change', filterInfo)
  
  // 示例联动逻辑
  if (filterInfo.type === '关系类型' && filterInfo.value.includes('family')) {
    if (!localFilters['locations'].includes('home')) {
      localFilters['locations'].push('home')
    }
  }
}

// 更新筛选后的数据
const updateFilteredData = () => {
  // 模拟数据更新
  // 实际应用中，这里可能是调用API或者过滤本地数据
  filteredData.value = [
    { id: 1, name: '根据当前筛选条件生成的结果1' },
    { id: 2, name: '根据当前筛选条件生成的结果2' }
  ]
}

// 清空所有筛选
const clearAllFilters = () => {
  filterConfigs.value.forEach(config => {
    localFilters[config.key] = config.multiple ? [] : null
  })
  emit('filter-change', []);
}

// 删除单个筛选条件
const removeFilter = (key, value) => {
  if (Array.isArray(localFilters[key])) {
    // 如果是多选，从数组中移除该值
    const index = localFilters[key].indexOf(value)
    if (index !== -1) {
      localFilters[key].splice(index, 1)
    }
  } else {
    // 如果是单选，直接设为null
    localFilters[key] = null
  }
}

// 获取指定筛选器的选项
const getOptionsForKey = (key) => {
  const config = filterConfigs.value.find(c => c.key === key)
  return config ? config.options : []
}

// 判断是否有任何筛选条件
const hasAnyFilter = computed(() => {
  return Object.entries(localFilters).some(([key, value]) => {
    return value && (Array.isArray(value) ? value.length > 0 : true)
  })
})
</script>

<template>
  <div class="filter-example">
    <div class="filter-container">
      <FilterDropdown
        v-for="config in filterConfigs"
        :key="config.key"
        :title="config.title"
        :options="config.options"
        v-model="localFilters[config.key]"
        :multiple="config.multiple"
        :type="config.type"
        @filter="handleFilterChange"
      />
      
      <el-button type="info" @click="clearAllFilters">清空所有筛选</el-button>
    </div>
    
    <div class="filter-summary">
      <h3>当前筛选条件</h3>
      <div v-if="hasAnyFilter" class="text-left">
        <div v-for="config in filterConfigs" :key="config.key">
          <template v-if="config.multiple && localFilters[config.key]?.length">
            <strong>{{ config.title }}:</strong> 
            <el-tag 
              v-for="value in localFilters[config.key]" 
              :key="value"
              :type="config.options.find(o => o.value === value)?.type || ''"
              class="filter-tag !text-white"
              :color="config.options.find(o => o.value === value)?.color || 'var(--el-color-primary)'"
              @click="removeFilter(config.key, value)"
              style="cursor: pointer;"
            >
              {{ config.options.find(o => o.value === value)?.label || value }}
            </el-tag>
          </template>
          
          <template v-else-if="!config.multiple && localFilters[config.key]">
            <strong>{{ config.title }}:</strong> 
            <el-tag 
              :type="config.options.find(o => o.value === localFilters[config.key])?.type || ''"
              class="filter-tag"
              @click="removeFilter(config.key, localFilters[config.key])"
              style="cursor: pointer;"
            >
              {{ config.options.find(o => o.value === localFilters[config.key])?.label || localFilters[config.key] }}
            </el-tag>
          </template>
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无筛选条件" />
      </div>
    </div>
    
    <div class="filter-results" v-if="false">
      <h3>筛选结果</h3>
      <el-card v-for="item in filteredData" :key="item.id" class="result-card">
        {{ item.name }}
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.filter-example {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.filter-summary {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.filter-tag {
  margin-right: 8px;
  margin-bottom: 5px;
}

.filter-results {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.result-card {
  margin-bottom: 10px;
}
</style>