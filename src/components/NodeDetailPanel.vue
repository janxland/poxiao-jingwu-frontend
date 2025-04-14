<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElTabs, ElTabPane, ElTag, ElDivider, ElEmpty } from 'element-plus'

// 定义属性
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

// 定义事件
const emit = defineEmits(['close', 'back-to-graph'])

// 当前活动的标签页
const activeTab = ref('basic')

// 字段翻译映射
const fieldTranslations = {
  // 基本信息
  name: '姓名',
  gender: '性别',
  age: '年龄',
  zodiac: '星座',
  education: '教育程度',
  id_number: '身份证号',
  phone: '电话号码',
  phone2: '第二电话号码',
  network_account_id: '网络账号',
  network_account_name: '网络昵称',
  nicknames: '昵称',
  id: '唯一ID',
  cardNumber: '银行卡号',
  document_type: '证件类型',
  document_number: '证件号码',
  marital_status: '婚姻状态',
  has_children: '是否有子女',
  family_structure: '家庭结构',
  family_criminal_records: '家庭成员犯罪记录',
  
  // 地址信息
  permanent_address: '户籍地址',
  temporary_address: '临时住址',
  place_of_origin: '籍贯',
  
  // 资产信息
  has_car: '是否有车',
  has_house: '是否有房',
  has_loan: '是否有贷款',
  loan_types: '贷款类型',
  consumption_level: '消费水平',
  payment_method: '支付方式',
  
  // 行为特征
  mobility: '流动性',
  travel_frequency: '出行频率',
  lodging_frequency: '住宿频率',
  common_transport: '常用交通方式',
  common_lodging: '常用住宿类型',
  sleep_pattern: '作息规律',
  shopping_habits: '购物习惯',
  entertainment_preferences: '娱乐偏好',
  
  // 通讯信息
  belongName: '所属人姓名',
  belongPhone: '所属人电话',
  communication_frequency: '通信频次',
  total_duration: '总通话时长',
  average_duration: '平均通话时长',
  active_duration: '活跃时长',
  active_periods: '活跃时段',
  channels_usage: '通信渠道使用情况',
  interaction_topics: '交流话题',
  interaction_count: '总互动次数',
  
  // 交易信息
  transaction_count: '总交易次数',
  transaction_categories: '交易类型分类',
  expenditure_frequency: '消费频率',
  abnormal_transaction_count: '异常交易次数',
  overdue_record_count: '逾期记录次数',
  
  // 风险信息
  illegal_risks: '涉嫌违规行为记录',
  sensitive_keywords: '敏感关键词',
  label: '关联身份标识',
  
  // 设备信息
  holder_number: '设备持有人编号',
  device_type: '设备类型',
  phone_brand: '手机品牌',
  device_model: '设备型号',
  imeiMeid: 'IMEI/MEID',
  imsi: 'IMSI',
  iccid: 'ICCID',
  mac: 'MAC地址',
  ip: 'IP地址',
  network_info: '网络信息'
}

// 将字段分组
const fieldGroups = {
  basic: ['id', 'name', 'gender', 'age', 'zodiac', 'education', 'id_number', 'document_type', 'document_number', 'marital_status', 'has_children', 'family_structure', 'family_criminal_records'],
  address: ['permanent_address', 'temporary_address', 'place_of_origin'],
  assets: ['has_car', 'has_house', 'has_loan', 'loan_types', 'consumption_level', 'payment_method'],
  behavior: ['mobility', 'travel_frequency', 'lodging_frequency', 'common_transport', 'common_lodging', 'sleep_pattern', 'shopping_habits', 'entertainment_preferences'],
  communication: ['belongName', 'belongPhone', 'phone', 'phone2', 'network_account_id', 'network_account_name', 'nicknames', 'communication_frequency', 'total_duration', 'average_duration', 'active_duration', 'active_periods', 'channels_usage', 'interaction_topics', 'interaction_count'],
  transaction: ['transaction_count', 'transaction_categories', 'expenditure_frequency', 'abnormal_transaction_count', 'overdue_record_count', 'cardNumber'],
  risk: ['illegal_risks', 'sensitive_keywords', 'label'],
  device: ['holder_number', 'device_type', 'phone_brand', 'device_model', 'imeiMeid', 'imsi', 'iccid', 'mac', 'ip', 'network_info']
}

// 标签页配置
const tabConfig = [
  { name: 'basic', label: '基本信息' },
  { name: 'address', label: '地址信息' },
  { name: 'assets', label: '资产信息' },
  { name: 'behavior', label: '行为特征' },
  { name: 'communication', label: '通讯信息' },
  { name: 'transaction', label: '交易信息' },
  { name: 'risk', label: '风险信息' },
  { name: 'device', label: '设备信息' }
]

// 为标签生成颜色
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

// 格式化字段值
const formatValue = (key, value) => {
  if (value == "" || value === null || value === undefined) return '无'
  
  // 处理布尔值
  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }
  
  // 处理数组 - 不再在这里处理，而是在模板中使用标签显示
  if (Array.isArray(value)) {
    if (value.length === 0) return '无'
    return value // 直接返回数组，在模板中处理
  }
  
  // 处理对象（JSON字符串）- 不再在这里处理，而是在模板中使用标签显示
  if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
    try {
      const obj = JSON.parse(value)
      return obj // 直接返回解析后的对象，在模板中处理
    } catch (e) {
      return value
    }
  }
  
  // 处理数字
  if (key.includes('frequency') || (key.includes('count') && key!='network_account_id')) {
    return value.toString() + ' 次'
  }
  
  if (key.includes('duration')) {
    return value.toString() + ' 分钟'
  }
  
  return value.toString()
}

// 判断节点是否有数据
const hasNodeData = computed(() => {
  return props.node && Object.keys(props.node).length > 0
})

// 判断值是否为数组
const isArray = (value) => Array.isArray(value)

// 判断值是否为对象
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

// 判断值是否为简单类型（字符串、数字、布尔值）
const isSimpleValue = (value) => {
  return typeof value !== 'object' || value === null
}

// 判断值是否为JSON字符串
const isJsonString = (value) => {
  if (typeof value !== 'string') return false
  try {
    const obj = JSON.parse(value)
    return typeof obj === 'object' && obj !== null
  } catch (e) {
    return false
  }
}

// 解析JSON字符串
const parseJsonString = (value) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return {}
  }
}
</script>

<template>
  <div class="node-detail-panel" v-if="visible">
    <div class="panel-header">
      <h3 class="panel-title">{{ node?.name || '节点详情' }}</h3>
      <div class="panel-actions">
        <el-button type="primary" size="small" @click="$emit('back-to-graph')">
          返回图谱
        </el-button>
        <el-button type="text" icon="Close" @click="$emit('close')" />
      </div>
    </div>
    
    <div class="panel-content">
      <el-empty v-if="!hasNodeData" description="暂无节点数据" />
      
      <template v-else>
        <el-tabs v-model="activeTab" stretch>
          <!-- 使用循环生成所有标签页，避免重复代码 -->
          <el-tab-pane 
            v-for="tab in tabConfig" 
            :key="tab.name" 
            :label="tab.label" 
            :name="tab.name"
          >
            <div class="info-section">
              <div v-for="field in fieldGroups[tab.name]" :key="field" class="info-item">
                <span class="info-label">{{ fieldTranslations[field] || field }}:</span>
                
                <!-- 数组类型值 -->
                <div v-if="isArray(node[field])" class="info-value tag-container">
                  <el-tag 
                    v-for="(item, index) in node[field]" 
                    :key="index"
                    :color="getColorForRelation(item.toString())"
                    class="tag-item"
                  >
                    {{ item }}
                  </el-tag>
                  <span v-if="node[field].length === 0">无</span>
                </div>
                
                <!-- 对象类型值 -->
                <div v-else-if="isObject(node[field])" class="info-value tag-container">
                  <el-tag 
                    v-for="(val, key) in node[field]" 
                    :key="key"
                    :color="getColorForRelation(key)"
                    class="tag-item"
                  >
                    {{ key }}: {{ isSimpleValue(val) ? val : '复杂对象' }}
                  </el-tag>
                </div>
                
                <!-- JSON字符串值 -->
                <div v-else-if="isJsonString(node[field])" class="info-value tag-container">
                  <el-tag 
                    v-for="(val, key) in parseJsonString(node[field])" 
                    :key="key"
                    :color="getColorForRelation(key)"
                    class="tag-item"
                  >
                    {{ key }}: {{ isSimpleValue(val) ? val : '复杂对象' }}
                  </el-tag>
                </div>
                
                <!-- 简单类型值 -->
                <span v-else class="info-value">{{ formatValue(field, node[field]) }}</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<style scoped>
.node-detail-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: all 0.3s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-content {
  padding: 16px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: flex-start;
}

.info-label {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  color: #606266;
  flex-shrink: 0;
  padding-top: 4px;
}

.info-value {
  flex: 1;
  color: #303133;
  word-break: break-all;
  display: flex;
  align-items: center;
}

/* 新增样式 */
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.tag-item {
  margin-bottom: 4px;
  color: #333 !important;
  white-space: nowrap;
}
</style>