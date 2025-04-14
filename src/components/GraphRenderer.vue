<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick, defineProps, defineEmits } from 'vue'
import * as d3 from 'd3'
import defaultAvatar from '@/assets/images/avatar.png'

const props = defineProps({
  graphData: {
    type: Object,
    required: true
  },
  filterTypes: {
    type: Object,
    required: true
  },
  filterValues: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['node-click', 'update-filter-tags'])

/** 
 * ---------------------------
 * 常量 & 工具函数
 * ---------------------------
 */
const DEFAULT_NODE_RADIUS = 16

/** 安全数字转换，避免 NaN/undefined 影响比较 */
const safeNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && !isNaN(value) ? value : fallback

/** 获取节点关联的所有边 */
const nodeRelations = (n) => {
  return props.graphData.links.filter((l) => {
    const srcId = (l.source as any)?.id ?? l.source
    const tgtId = (l.target as any)?.id ?? l.target
    return srcId === n.id || tgtId === n.id
  })
}

/** 判断当前 node 是否为 link 的 source */
function isSourceNode(edge, node) {
  const srcId = typeof edge.source === 'object' ? edge.source.id : edge.source
  return srcId === node.id
}

function getNodeName(node) {
  if (typeof node === 'object') {
    return node.name ?? node.id
  }
  return node
}

/** 
 * ---------------------------
 * D3 图谱 - 初始化、更新、力导向模拟
 * ---------------------------
 */
let svg
let simulation
let nodeElements
let linkElements
let zoomHandler

// 右键菜单状态
const contextMenuRef = ref(null)
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  node: null,
  activeTab: 'relation',
  element: contextMenuRef
})

/** 初始化图表 */
const initGraph = () => {
  const container = document.getElementById('graph')
  if (!container) return
  
  const width = container.clientWidth
  const height = container.clientHeight

  // 清理旧图
  d3.select('#graph svg').remove()

  // 创建 SVG
  svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height] as any)

  // 缩放
  zoomHandler = d3
    .zoom()
    .scaleExtent([0.1, 8])
    .on('zoom', (event) => {
      svg.select('g').attr('transform', event.transform)
    })
  svg.call(zoomHandler as any)

  // 箭头
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'end')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 25)
    .attr('refY', 0)
    .attr('markerWidth', 10)
    .attr('markerHeight', 10)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#999')

  // 容器组
  const g = svg.append('g')
  linkElements = g.append('g').attr('class', 'links').selectAll('line')
  nodeElements = g.append('g').attr('class', 'nodes').selectAll('g.node')

  // 力导向
  simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3
        .forceLink()
        .id((d: any) => d.id ?? d.index)
        .distance(150)
    )
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2))

  updateGraph()
}

/** 更新图数据并重新渲染 */
const updateGraph = () => {
  // 过滤边 
  const filteredLinks = props.graphData.links.filter((link) => {
    for (const key in props.filterTypes) {
      const filterType = props.filterTypes[key]
      if (filterType.filterLinkFn && !filterType.filterLinkFn(link, props.filterValues[key])) {
        return false
      }
    }
    // 时间范围筛选
    const linkTime = safeNumber(link.time, 0)
    if (linkTime < props.filterValues.time[0] || linkTime > props.filterValues.time[1]) return false
    
    // 风险等级筛选（边）
    const linkRisk = safeNumber(link.risk, 0)
    if (linkRisk < props.filterValues.risk) return false
    
    return true
  })
 
  // 相关节点 
  const nodeIds = new Set()
  filteredLinks.forEach((l) => { 
    nodeIds.add((l.source as any).id ?? l.source)
    nodeIds.add((l.target as any).id ?? l.target)
  })
  
  // 过滤节点
  const filteredNodes = props.graphData.nodes.filter((node) => {
    for (const key in props.filterTypes) {
      const filterType = props.filterTypes[key]
      if (filterType.filterNodeFn && !filterType.filterNodeFn(node, props.filterValues[key])) {
        return false
      }
    }
    // 确保节点有关联的边
    return nodeIds.has(node.id)
  })
 
  // 再次过滤边，只保留两端都有有效节点连接的边 
  const validNodeIds = new Set(filteredNodes.map(n => n.id))
  const finalFilteredLinks = filteredLinks.filter((link) => { 
    const sourceId = (link.source as any).id ?? link.source
    const targetId = (link.target as any).id ?? link.target
    return validNodeIds.has(sourceId) && validNodeIds.has(targetId)
  })

  /** --- 更新连线 --- */ 
  linkElements = linkElements 
    .data(finalFilteredLinks, (d: any) => `${(d.source as any).id ?? d.source}-${(d.target as any).id ?? d.target}`)  
    .join((enter) => 
      enter 
        .append('line') 
        .attr('stroke-width', (d) => Math.max(1, safeNumber(d.interaction_count, 1))) 
        .attr('stroke', (d) => {
          const opt = props.filterTypes['relationTypes'].filterConfig?.options.find(o => o.value === d.type)
          return opt ? opt.color : '#999'
        }) 
        .attr('stroke-opacity', 1) 
        .attr('marker-end', 'url(#end)') 
    )

  /** --- 更新节点 --- */ 
  nodeElements = nodeElements 
    .data(filteredNodes, (d: any) => d.id)  
    .join((enter) => { 
      const g = enter 
        .append('g') 
        .attr('class', 'node') 
        .call( 
          d3 
            .drag() 
            .on('start', dragstarted) 
            .on('drag', dragged) 
            .on('end', dragended) 
        ) 
        .on('click', clicked)

      // 添加圆形背景
      g.append('circle')  
        .attr('r', DEFAULT_NODE_RADIUS) 
        .attr('fill', (d) => { 
          const roleOptions = [
            { label: '嫌疑人', value: 'suspect', color: '#FF4D4F' },
            { label: '受害者', value: 'victim', color: '#1890FF' },
            { label: '证人', value: 'witness', color: '#FAAD14' },
            { label: '中立人员', value: 'neutral', color: '#52C41A' },
          ]
          const role = roleOptions.find((r) => r.value === d.role)
          return role ? role.color : '#666'
        }) 
        .attr('stroke', '#333') 
        .attr('stroke-width', 1)

      // 添加头像支持
      g.append('clipPath')
        .attr('id', d => `clip-${d.id}`)
        .append('circle')
        .attr('r', DEFAULT_NODE_RADIUS - 2) // 稍微小一点，留出边框
      
      // 如果有avatar字段，添加图片，否则使用默认圆形
      g.append('image')
        .attr('xlink:href', d => d.avatar || defaultAvatar)
        .attr('x', -DEFAULT_NODE_RADIUS)
        .attr('y', -DEFAULT_NODE_RADIUS)
        .attr('width', (DEFAULT_NODE_RADIUS) * 2)
        .attr('height', (DEFAULT_NODE_RADIUS) * 2)
        .attr('clip-path', d => `url(#clip-${d.id})`)

      // 添加文本标签
      g.append('text')  
        .attr('dy', 4) 
        .attr('dx', DEFAULT_NODE_RADIUS + 5) 
        .text((d) => d.name || d.id)  
        .attr('fill', '#333') 
        .style('font-size', '16px')

      return g
    })
 
  /** --- 重新启动模拟 --- */ 
  simulation.nodes(filteredNodes).on('tick', ticked)
  simulation.force('link').links(finalFilteredLinks)
  simulation.alpha(1).restart()
  
  // 更新筛选标签
  emit('update-filter-tags')
}

/** 力导向布局回调 */
function ticked() {
  linkElements
    .attr('x1', (d: any) => (d.source as any).x)
    .attr('y1', (d: any) => (d.source as any).y)
    .attr('x2', (d: any) => (d.target as any).x)
    .attr('y2', (d: any) => (d.target as any).y)

  nodeElements.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
}

/** 
 * ---------------------------
 * 节点交互事件
 * ---------------------------
 */
function clicked(event, d) {
  emit('node-click', { event, node: d })
}

/** 拖拽开始 */
function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

/** 拖拽中 */
function dragged(event, d) {
  d.fx = event.x
  d.fy = event.y
}

/** 拖拽结束 */
function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0)
  d.fx = null
  d.fy = null
}

// 监听筛选条件变化
watch(() => props.filterValues, () => {
  svg && updateGraph()
}, { deep: true })

// 监听窗口大小变化
window.addEventListener('resize', () => svg && initGraph())

// 暴露方法给父组件
defineExpose({
  initGraph,
  updateGraph,
  nodeRelations,
  isSourceNode,
  getNodeName
})

onMounted(() => {
  nextTick(() => {
    initGraph()
  })
})
</script>

<template>
  <div id="graph" class="graph-container"></div>
</template>

<style scoped>
.graph-container {
  flex: 1;
  background-color: #fff;
  overflow: hidden;
}
</style>