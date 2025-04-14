<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue'
import { ElTag, ElMessage } from 'element-plus'
import { fetchGraphData } from '@/api/modules/knowledgeBase'
import GraphRenderer from '@/components/GraphRenderer.vue'
import NodeContextMenu from '@/components/NodeContextMenu.vue'
import GraphFilters from '@/components/GraphFilters.vue'
import NodeDetailContainer from '@/components/NodeDetailContainer.vue'

const ROLES = ['suspect', 'victim', 'witness', 'neutral'] as const

function getColorForRelation(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0
  }
  const hue = Math.abs(hash) % 360
  const saturation = 40
  const lightness = 80
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

const safeNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && !isNaN(value) ? value : fallback

interface GraphNode {
  id: number | string
  name: string
  role: typeof ROLES[number]
  risk: number
  x?: number
  y?: number
  [key: string]: any
}

interface GraphLink {
  source: number | string | GraphNode
  target: number | string | GraphNode
  type: string
  time?: number
  frequency?: number
  risk?: number
  [key: string]: any
}

const defaultNode: GraphNode = {
  id: '',
  name: '',
  role: 'neutral',
  risk: 0,
}

const defaultEdge: GraphLink = {
  source: '',
  target: '',
  type: 'unknown',
  time: 0,
  frequency: 1,
  risk: 0,
}

// 右键菜单状态
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  node: null as GraphNode | null,
})

// 节点详情面板状态
const nodeDetailState = reactive({
  visible: false,
  node: null as GraphNode | null
})

// 图数据
const graphData = reactive({
  nodes: [] as GraphNode[],
  links: [] as GraphLink[],
})

interface FilterType {
  key: string;
  label: string;
  type: string;
  defaultValue: any;
  options?: any[];
  multiple?: boolean;
  range?: [number, number];
  filterConfig: any;
  filterNodeFn?: (node: GraphNode, value: any) => boolean;
  filterLinkFn?: (node: GraphLink, value: any) => boolean;
  filterValueFn?: (nodes: GraphNode[], edges: GraphLink[]) => any[];
  requestParam?: string;
  requestParamFn?: (value: any) => any;
}

// 过滤器类型定义
const filterTypes = reactive<Record<string, FilterType>>({
  relationTypes: {
    key: 'relationTypes',
    label: '关系类型',
    type: 'primary',
    defaultValue: [],
    multiple: true,
    filterValueFn: (nodes, edges) => Array.from(new Set(edges.map(e => e.type))),
    filterLinkFn: (edge, value) => value.length === 0 || value.includes(edge.type),
  },
  addresses: {
    key: 'addresses',
    label: '地址',
    type: 'primary',
    defaultValue: [],
    multiple: true,
    filterNodeFn: (node, value) => value.length === 0 || value.includes(node.permanent_address),
    filterValueFn: (nodes, edges) => Array.from(new Set(nodes.map(n => n.permanent_address).filter(Boolean)))
  },
  sensitive_keywords:{
    key: 'sensitive_keywords',
    label: '敏感词',
    type: 'danger',
    defaultValue: [],
    multiple: true,
    filterValueFn: (nodes, edges) => Array.from(new Set(nodes.map(n => n.sensitive_keywords).flat().filter(Boolean))),
    filterNodeFn: (node, value) => {
      const activePeriods = node.sensitive_keywords;
      if (!activePeriods) return true;
      return value.length === 0 || activePeriods.some(period => value.includes(period));
    }
  },
  belongNames: {
    key: 'belongNames',
    label: '所属人',
    type: 'warning',
    defaultValue: [],
    multiple: true,
    filterNodeFn: (node, value) => value.length === 0 || (node.belongName && value.includes(node.belongName)),
    filterValueFn: (nodes, edges) => Array.from(new Set(nodes
      .filter(node => node.belongName && node.belongName.trim() !== '')
      .map(node => node.belongName)))
  },
  education: {
    key: 'education',
    label: '学历',
    type: 'warning',
    defaultValue: [],
    multiple: true,
    filterNodeFn: (node, value) =>  value.length === 0 || (value.includes("未知")&&!node.education) || value.includes(node.education),
    filterValueFn: (nodes, edges) => Array.from(new Set(nodes.map(n => n.education).filter(Boolean)))
  },
  consumption_level: {
    key: 'consumption_level',
    label: '消费等级',
    type: 'success',
    defaultValue: [],
    multiple: true,
    filterNodeFn: (node, value) => value.length === 0 || value.length === 0 || value.includes(node.consumption_level),
    filterValueFn: (nodes, edges) => Array.from(new Set(nodes.map(n => n.consumption_level).filter(Boolean)))
  },
  active_periods: {
    key: 'active_periods',
    label: '活跃时段',
    type: 'warning',
    defaultValue: [],
    multiple: true,
    filterValueFn: (nodes, edges) => Array.from(new Set(nodes.map(n => n.active_periods).flat().filter(Boolean))),
    filterNodeFn: (node, value) => {
      const activePeriods = node.active_periods;
      if (!activePeriods) return true;
      return value.length === 0 || activePeriods.some(period => value.includes(period));
    }
   },
  roles: {
    key: 'roles',
    label: '角色',
    type: 'danger',
    defaultValue: [],
    multiple: true,
    filterNodeFn: (node, value) => value.length === 0 || value.includes(node.role),
    filterValueFn: (nodes, edges) => Array.from(new Set(nodes.map(n => n.role).filter(Boolean)))
  },
  time: {
    key: 'time',
    label: '时间范围',
    type: 'info',
    defaultValue: [0, 100],
  },
  risk: {
    key: 'risk',
    label: '风险等级',
    type: 'danger',
    defaultValue: 0,
    filterNodeFn: (node, value) => safeNumber(node.risk, 0) >= value
  },
  frequency: {
    key: 'frequency',
    label: '互动频率',
    type: 'success',
    defaultValue: [0, 25],
    range: [0, 25],
    filterLinkFn: (link, value) => {
      const linkFreq = safeNumber(link.interaction_count-0, 0)
      return linkFreq >= value[0] && linkFreq <= value[1]
    }
  },
})

// 过滤器值
const filterValues = reactive<Record<string, any>>({})
const filterConfigs = ref([])

// 初始化过滤器值
Object.keys(filterTypes).forEach(key => {
  filterValues[key] = filterTypes[key].defaultValue
})

// 计算属性
const timeRange = computed({
  get: () => filterValues.time,
  set: (val) => { filterValues.time = val }
})
const riskLevel = computed({
  get: () => filterValues.risk,
  set: (val) => { filterValues.risk = val }
})
const frequency = computed({
  get: () => filterValues.frequency,
  set: (val) => { filterValues.frequency = val }
})

const currentFilters = ref<any[]>([])
const graphRenderer = ref(null)

// 生成过滤器配置
const generateFilterConfigs = (nodes: GraphNode[], edges: GraphLink[]) => {
  filterConfigs.value = []
  
  Object.keys(filterTypes).forEach(key => {
    const filterType = filterTypes[key]
    
    if (!filterType.filterValueFn || filterType.requestParam) return
    
    const values = filterType.filterValueFn(nodes, edges)
    if (!values || values.length === 0) return
    
    const options = values.map(value => {
      if (key === 'relationTypes') {
        return {
          label: value,
          value: value,
          color: getColorForRelation(value),
          type: filterType.type
        }
      } else {
        return {
          label: value,
          value: value,
          type: filterType.type,
          color: getColorForRelation(value),
        }
      }
    })
    
    filterConfigs.value.push({
      key: filterType.key,
      title: filterType.label,
      options: options,
      multiple: filterType.multiple,
      type: filterType.type
    })
  })
  filterConfigs.value.forEach((config) => {
    filterTypes[config.key].filterConfig = config;
  })
}

// 查询数据
const queryData = reactive({
  belongPhone: '',
  conditions: []
})

function replaceNullWithEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === null ? '' : value
    ])
  )
}

onMounted(async () => {
  // 初始化查询条件
  queryData.conditions = [
    { type: 'belongPhone', value: queryData.belongPhone, id: Date.now() }
  ]
  
  await getGraphyDataByPhone()
})

// 获取图数据
const getGraphyDataByPhone = async () => {
  try {
    // 构建查询参数
    const queryParams = {}
    console.log("当前查询条件：", queryData);
    
    // 添加查询条件
    if (queryData.conditions && queryData.conditions.length > 0) {
      queryData.conditions.forEach(condition => {
        if (condition.value && condition.type) {
          queryParams[condition.type] = condition.value
        }
      })
    } else if (queryData.belongPhone) {
      // 兼容旧版本，如果没有条件但有手机号
      queryParams.belongPhone = queryData.belongPhone
    }
    
    const { data } = await fetchGraphData(queryParams)
    const { nodes = [], edges = [] } = (data || {}) as {
      nodes?: Partial<GraphNode>[]
      edges?: Partial<GraphLink>[]
    }
    
    if(!nodes.length || !edges.length) {
      ElMessage.warning('暂无知识图谱数据')
      return
    }
    function replaceNullWithEmpty(obj) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          value === null ? '' : value
        ])
      )
    }
    
    const filledNodes = nodes.map((n, idx) => ({
      ...defaultNode,
      ...replaceNullWithEmpty(n),
      id: n.id ?? idx
    }))

    const filledEdges = edges.map((e) => ({
      ...defaultEdge,
      ...replaceNullWithEmpty(e),
      source: e.source ?? '',
      target: e.target ?? '',
      type: e.type ?? 'unknown',
      time: safeNumber(e.time, 0),
      frequency: safeNumber(e.frequency, 1),
      risk: safeNumber(e.risk, 0),
    }))
    
    generateFilterConfigs(filledNodes, filledEdges)
    graphData.nodes.splice(0, graphData.nodes.length, ...filledNodes)
    graphData.links.splice(0, graphData.links.length, ...filledEdges)
    await nextTick()
    graphRenderer.value?.initGraph()
  } catch (err) {
    console.error('获取图数据失败', err)
  }
}

// 处理节点点击
const handleNodeClick = ({ event, node }) => {
  contextMenu.x = event.clientX
  contextMenu.y = event.clientY
  contextMenu.node = node
  contextMenu.visible = true
  event.stopPropagation()
}

// 打开节点详情
function openNodeDetail(node: GraphNode) {
  nodeDetailState.node = node
  nodeDetailState.visible = true
}

// 关闭节点详情
function closeNodeDetail() {
  nodeDetailState.visible = false
  nodeDetailState.node = null
}

// 关闭右键菜单
function closeContextMenu() {
  contextMenu.visible = false
}

// 更新过滤标签
const updateFilterTags = () => {
  currentFilters.value = []
  
  Object.keys(filterTypes).forEach(key => {
    const filterType = filterTypes[key]
    const value = filterValues[key]
    if (Array.isArray(value) && value.length > 0 && filterType.multiple) {
      currentFilters.value.push({
        type: key,
        label: `${filterType.label}: ${value.join(', ')}`
      })
    } else if (Array.isArray(value) && value.length === 2) {
      if (value[0] > 0 || value[1] < 100) {
        currentFilters.value.push({
          type: key,
          label: `${filterType.label}: ${value[0]}-${value[1]}`
        })
      }
    } else if (!Array.isArray(value) && value > 0) {
      currentFilters.value.push({
        type: key,
        label: `${filterType.label} > ${value}`
      })
    }
  })
}

// 移除过滤器
const removeFilter = (filter: any) => {
  const key = filter.type
  if (filterTypes[key]) {
    filterValues[key] = filterTypes[key].defaultValue
  }
}

// 处理过滤器变化
const handleFilterChange = (filterInfo) => {
  if (filterInfo.length === 0) {
    Object.keys(filterTypes).forEach(key => {
      if (filterTypes[key].multiple) {
        filterValues[key] = []
      }
    })
    return
  }
  
  Object.keys(filterTypes).forEach(key => {
    const filterType = filterTypes[key]
    if (filterInfo.type === filterType.label) {
      filterValues[key] = filterInfo.value
    }
  })
}

// 获取节点关系
const nodeRelations = (n) => {
  return graphData.links.filter((l) => {
    const srcId = (l.source as any)?.id ?? l.source
    const tgtId = (l.target as any)?.id ?? l.target
    return srcId === n.id || tgtId === n.id
  })
}

// 监听过滤器值变化
watch(filterValues, () => {
  graphRenderer.value?.updateGraph()
}, { deep: true })
</script>

<template>
  <div class="knowledge-graph">
    <!-- 过滤器组件 -->
    <GraphFilters
      v-model:queryData="queryData"
      v-model:timeRange="timeRange"
      v-model:riskLevel="riskLevel"
      v-model:frequency="frequency"
      :filterTypes="filterTypes"
      :filterConfigs="filterConfigs"
      :currentFilters="currentFilters"
      @search="getGraphyDataByPhone"
      @filter-change="handleFilterChange"
    />

    <div class="graph-content" :class="{ 'detail-open': nodeDetailState.visible }">
      <div class="current-filters" v-if="currentFilters.length > 0">
        <span class="filter-label">当前筛选条件:</span>
        <el-tag
          v-for="(filter, index) in currentFilters"
          :key="index"
          closable
          @close="removeFilter(filter)"
          class="filter-tag"
          type="info"
          effect="dark"
        >
          {{ filter.label }}
        </el-tag>
      </div>
      
      <!-- 图渲染组件 -->
      <GraphRenderer 
        ref="graphRenderer"
        :graph-data="graphData"
        :filter-types="filterTypes"
        :filter-values="filterValues"
        @node-click="handleNodeClick"
        @update-filter-tags="updateFilterTags"
      />
    </div>
  </div>
  
  <!-- 右键菜单 -->
  <!-- 右键菜单组件 -->
  <Teleport to="body">
    <NodeContextMenu
      :visible="contextMenu.visible"
      :node="contextMenu.node"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :relations="contextMenu.node ? nodeRelations(contextMenu.node) : []"
      :filterTypes="filterTypes"
      @close="closeContextMenu"
      @view-details="openNodeDetail"
    />
  </Teleport>
  
  <!-- 节点详情面板容器 -->
  <NodeDetailContainer
    :node="nodeDetailState.node"
    :visible="nodeDetailState.visible"
    @close="closeNodeDetail"
    @back-to-graph="closeNodeDetail"
  />
</template>

<style scoped>
.knowledge-graph {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
  color: #333;
}

.graph-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.current-filters {
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.filter-label {
  margin-right: 10px;
  font-weight: 500;
  color: #666;
}

.filter-tag {
  margin-right: 8px;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .knowledge-graph {
    flex-direction: column;
  }
}
</style>