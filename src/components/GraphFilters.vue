<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted, computed } from 'vue';
import {
    ElSlider,
    ElInput,
    ElButton,
    ElSelect,
    ElOption,
    ElForm,
    ElFormItem,
    ElTabs,
    ElTabPane,
    ElIcon,
    ElTooltip,
} from 'element-plus';
import { Plus, Delete, Search } from '@element-plus/icons-vue';
import FilterExample from '@/components/FilterExample.vue';
import { all } from 'axios';

// 查询条件类型定义
interface QueryCondition {
    type: string;
    value: string;
    id: number;
}

// 查询条件类型选项
const allQueryTypes = [
    { label: '主键', value: 'id' },
    { label: '名字', value: 'name' },
    { label: '标签', value: 'label' },
    { label: '归属人', value: 'belongName' },
    { label: '归属人手机', value: 'belongPhone' },
    { label: '性别', value: 'gender' },
    { label: '年龄', value: 'age' },
    { label: '籍贯', value: 'place_of_origin' },
    { label: '星座', value: 'zodiac' },
    { label: '文化程度', value: 'education' },
    { label: '身份证号', value: 'id_number' },
    { label: '手机号码', value: 'phone' },
    { label: '第二手机号', value: 'phone2' },
    { label: '网络账号ID', value: 'network_account_id' },
    { label: '网络昵称', value: 'network_account_name' },
    // { label: '外号或昵称', value: 'nicknames' },
    { label: '常住地址', value: 'permanent_address' },
    { label: '暂住地址', value: 'temporary_address' },
    // { label: '违法风险', value: 'illegal_risks' },
    { label: '消费水平', value: 'consumption_level' },
    { label: '是否有车', value: 'has_car' },
    { label: '是否有房', value: 'has_house' },
    { label: '是否有贷款', value: 'has_loan' },
    { label: '是否有子女', value: 'has_children' },
    // { label: '贷款类型', value: 'loan_types' },
    { label: '交易流水记录总数', value: 'transaction_count' },
    { label: '消费频次', value: 'expenditure_frequency' },
    // { label: '交易分类', value: 'transaction_categories' },
    { label: '逾期记录次数', value: 'overdue_record_count' },
    { label: '异常交易次数', value: 'abnormal_transaction_count' },
    { label: '作息规律', value: 'sleep_pattern' },
    { label: '常用交通工具', value: 'common_transport' },
    { label: '出行频率', value: 'travel_frequency' },
    { label: '活动状态', value: 'mobility' },
    { label: '入住次数', value: 'lodging_frequency' },
    { label: '常用住宿类型', value: 'common_lodging' },
    { label: '购物习惯', value: 'shopping_habits' },
    { label: '常用支付方式', value: 'payment_method' },
    { label: '娱乐方式', value: 'entertainment_preferences' },
    { label: '总沟通次数', value: 'communication_frequency' },
    { label: '各渠道使用次数', value: 'channels_usage' },
    { label: '总通话时长', value: 'total_duration' },
    { label: '平均通话时长', value: 'average_duration' },
    { label: '敏感关键词', value: 'sensitive_keywords' },
    { label: '每日在线时长', value: 'active_duration' },
    { label: '活跃时段', value: 'active_periods' },
    { label: '互动主题', value: 'interaction_topics' },
    { label: '总互动次数', value: 'interaction_count' },
    { label: 'MAC地址', value: 'mac' },
    { label: 'IP地址', value: 'ip' },
    { label: '银行卡号', value: 'bankCard' },
    { label: '设备持有人编号', value: 'holder_number' },
    { label: '证件类型', value: 'document_type' },
    { label: '证件号码', value: 'document_number' },
    { label: '设备类型', value: 'device_type' },
    { label: '手机品牌', value: 'phone_brand' },
    { label: '设备型号', value: 'device_model' },
    { label: 'IMEI/MEID', value: 'imeiMeid' },
    { label: 'IMSI', value: 'imsi' },
    { label: 'ICCID', value: 'iccid' },
    { label: '婚姻状态', value: 'marital_status' },
    { label: '家庭结构', value: 'family_structure' },
    // 添加复杂类型字段，但标记为禁用
    {
        label: '家庭成员犯罪记录',
        value: 'family_criminal_records',
        disabled: true,
        complexType: 'array',
    },
    {
        label: '网络信息',
        value: 'network_info',
        disabled: true,
        complexType: 'array',
    },
];

// 查询条件搜索关键词
const queryTypeSearchKeyword = ref('');

// 过滤后的查询类型选项
const queryTypes = computed(() => {
    if (!queryTypeSearchKeyword.value) {
        // 如果没有搜索关键词，返回常用字段
        return [
            ...allQueryTypes.filter((item) =>
                item.label.includes(queryTypeSearchKeyword.value),
            ),
        ];
    }

    // 根据关键词过滤
    return allQueryTypes.filter(
        (type) =>
            type.label.includes(queryTypeSearchKeyword.value) ||
            type.value.includes(queryTypeSearchKeyword.value),
    );
});

// 是否显示字段选择弹窗
const showFieldSelector = ref(false);

const props = defineProps({
    // 查询参数对象
    queryParams: {
        type: Object,
        default: () => ({}),
    },
    timeRange: {
        type: Array,
        default: () => [0, 100],
    },
    riskLevel: {
        type: Number,
        default: 0,
    },
    frequency: {
        type: Array,
        default: () => [0, 25],
    },
    filterTypes: {
        type: Object,
        default: () => ({}),
    },
    filterConfigs: {
        type: Array,
        default: () => [],
    },
    currentFilters: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits([
    'update:queryParams',
    'update:timeRange',
    'update:riskLevel',
    'update:frequency',
    'search',
    'filter-change',
]);

// 当前活动的标签页
const activeTab = ref('basic');

// 查询条件列表
const queryConditions = ref<QueryCondition[]>([]);

// 初始化查询条件
onMounted(() => {
    initQueryConditions();
});

// 初始化查询条件
const initQueryConditions = () => {
    const conditions = [];

    // 从 queryParams 创建查询条件
    Object.entries(props.queryParams).forEach(([key, value]) => {
        if (value) {
            conditions.push({
                type: key,
                value: value as string,
                id: Date.now() + Math.random(),
            });
        }
    });

    // 如果没有条件，添加一个默认的手机号条件
    if (conditions.length === 0) {
        conditions.push({
            type: 'belongPhone',
            value: '',
            id: Date.now(),
        });
    }

    queryConditions.value = conditions;
};

// 添加查询条件
const addQueryCondition = () => {
    queryConditions.value.push({
        type: 'belongPhone',
        value: '',
        id: Date.now(),
    });
};

// 删除查询条件
const removeQueryCondition = (index: number) => {
    queryConditions.value.splice(index, 1);
    // 确保至少有一个查询条件
    if (queryConditions.value.length === 0) {
        addQueryCondition();
    }

    // 更新查询参数
    updateQueryParams();
};

// 处理字段选择
const handleFieldSelect = (condition, value) => {
    if (value === 'more') {
        // 显示字段选择弹窗
        showFieldSelector.value = true;
        // 重置搜索关键词
        queryTypeSearchKeyword.value = '';
    } else {
        condition.type = value;
        // 如果是从弹窗选择的，关闭弹窗
        showFieldSelector.value = false;
        // 重置搜索关键词
        queryTypeSearchKeyword.value = '';
    }
};

// 更新查询参数
const updateQueryParams = () => {
    const params = {};

    // 将查询条件转换为查询参数
    queryConditions.value.forEach((condition) => {
        if (condition.value && condition.type) {
            params[condition.type] = condition.value;
        }
    });
    console.log('传递', { ...params });

    // 使用新对象替换原有对象，确保触发响应式更新
    emit('update:queryParams', { ...params });
};

// 监听查询条件变化
watch(
    queryConditions,
    () => {
        updateQueryParams();
    },
    { deep: true },
);

// 监听 props.queryParams 变化
watch(
    () => props.queryParams,
    (newVal) => {
        // 只有当 queryParams 发生实质性变化时才重新初始化
        const currentParams = {};
        queryConditions.value.forEach((condition) => {
            if (condition.value) {
                currentParams[condition.type] = condition.value;
            }
        });

        // 检查是否有变化
        const hasChanges =
            Object.keys(newVal).some(
                (key) => newVal[key] !== currentParams[key],
            ) ||
            Object.keys(currentParams).some(
                (key) => newVal[key] !== currentParams[key],
            );

        if (hasChanges) {
            initQueryConditions();
        }
    },
    { deep: true },
);

// 执行查询
const executeSearch = () => {
    // 先更新查询参数
    updateQueryParams();

    // 确保参数更新后再触发查询
    nextTick(() => {
        emit('search');
    });
};

// 获取查询条件的占位符
const getPlaceholder = (type: string) => {
    const placeholders = {
        id: '请输入主键',
        name: '请输入名字',
        label: '请输入标签',
        belongName: '请输入归属人',
        belongPhone: '请输入手机号',
        gender: '请输入性别',
        age: '请输入年龄',
        place_of_origin: '请输入籍贯',
        zodiac: '请输入星座',
        education: '请输入文化程度',
        id_number: '请输入身份证号',
        phone: '请输入手机号码',
        phone2: '请输入第二手机号',
        network_account_id: '请输入网络账号ID',
        network_account_name: '请输入网络昵称',
        nicknames: '请输入外号或昵称',
        permanent_address: '请输入常住地址',
        temporary_address: '请输入暂住地址',
        illegal_risks: '请输入违法风险',
        consumption_level: '请输入消费水平',
        has_car: '是否有车(true/false)',
        has_house: '是否有房(true/false)',
        has_loan: '是否有贷款(true/false)',
        has_children: '是否有子女(true/false)',
        loan_types: '请输入贷款类型',
        transaction_count: '请输入交易流水记录总数',
        expenditure_frequency: '请输入消费频次',
        transaction_categories: '请输入交易分类',
        overdue_record_count: '请输入逾期记录次数',
        abnormal_transaction_count: '请输入异常交易次数',
        sleep_pattern: '请输入作息规律',
        common_transport: '请输入常用交通工具',
        travel_frequency: '请输入出行频率',
        mobility: '请输入活动状态',
        lodging_frequency: '请输入入住次数',
        common_lodging: '请输入常用住宿类型',
        shopping_habits: '请输入购物习惯',
        payment_method: '请输入常用支付方式',
        entertainment_preferences: '请输入娱乐方式',
        communication_frequency: '请输入总沟通次数',
        channels_usage: '请输入各渠道使用次数',
        total_duration: '请输入总通话时长',
        average_duration: '请输入平均通话时长',
        sensitive_keywords: '请输入敏感关键词',
        active_duration: '请输入每日在线时长',
        active_periods: '请输入活跃时段',
        interaction_topics: '请输入互动主题',
        interaction_count: '请输入总互动次数',
        mac: '请输入MAC地址',
        ip: '请输入IP地址',
        bankCard: '请输入银行卡号',
        holder_number: '请输入设备持有人编号',
        document_type: '请输入证件类型',
        document_number: '请输入证件号码',
        device_type: '请输入设备类型',
        phone_brand: '请输入手机品牌',
        device_model: '请输入设备型号',
        imeiMeid: '请输入IMEI/MEID',
        imsi: '请输入IMSI',
        iccid: '请输入ICCID',
        marital_status: '请输入婚姻状态',
        family_structure: '请输入家庭结构',
    };
    return placeholders[type] || '请输入查询内容';
};
</script>

<template>
    <div class="filters">
        <div class="graph-container">
            <h5 class="text-2xl font-bold mb-4">AI证据分析系统</h5>
        </div>

        <el-tabs v-model="activeTab" class="filter-tabs">
            <el-tab-pane label="基础查询" name="basic">
                <div class="filter-section">
                    <h3>查询条件</h3>
                    <div class="query-conditions">
                        <div
                            v-for="(condition, index) in queryConditions"
                            :key="condition.id"
                            class="query-condition-item"
                        >
                            <el-select
                                v-model="condition.type"
                                class="condition-type-select"
                                size="default"
                                filterable
                                @change="
                                    (value) =>
                                        handleFieldSelect(condition, value)
                                "
                            >
                                <el-option
                                    v-for="type in queryTypes"
                                    :key="type.value"
                                    :label="type.label"
                                    :value="type.value"
                                    :disabled="type.disabled"
                                />
                            </el-select>

                            <el-input
                                v-model="condition.value"
                                :placeholder="getPlaceholder(condition.type)"
                                class="condition-value-input"
                                size="default"
                            />

                            <el-tooltip
                                content="删除此条件"
                                placement="top"
                                :disabled="queryConditions.length <= 1"
                            >
                                <el-button
                                    type="danger"
                                    :icon="Delete"
                                    circle
                                    size="small"
                                    :disabled="queryConditions.length <= 1"
                                    @click="removeQueryCondition(index)"
                                    class="condition-delete-btn"
                                />
                            </el-tooltip>
                        </div>

                        <div class="query-actions">
                            <div class="button-group">
                                <el-button
                                    type="primary"
                                    :icon="Plus"
                                    @click="addQueryCondition"
                                    class="add-condition-btn"
                                >
                                    添加条件
                                </el-button>

                                <el-button
                                    type="success"
                                    :icon="Search"
                                    @click="executeSearch"
                                    class="search-btn"
                                >
                                    查询图谱
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <FilterExample
                    :modelValue="currentFilters"
                    :configs="filterConfigs"
                    @update:modelValue="$emit('update:currentFilters', $event)"
                    @filter-change="emit('filter-change', $event)"
                />
            </el-tab-pane>

            <!-- 高级筛选标签页 -->
            <el-tab-pane label="高级筛选" name="advanced">
                <div class="filter-section">
                    <h3>时间范围</h3>
                    <el-slider
                        :model-value="timeRange"
                        @update:modelValue="emit('update:timeRange', $event)"
                        range
                        :min="0"
                        :max="100"
                        :format-tooltip="(val) => `${val}小时`"
                        class="time-slider"
                    />
                </div>

                <div class="filter-section">
                    <h3>风险等级</h3>
                    <el-slider
                        :model-value="riskLevel"
                        @update:modelValue="emit('update:riskLevel', $event)"
                        :min="0"
                        :max="100"
                        :format-tooltip="(val) => `${val}%`"
                        class="risk-slider"
                    />
                </div>

                <div class="filter-section">
                    <h3>互动频率阈值</h3>
                    <el-slider
                        :model-value="frequency"
                        @update:modelValue="emit('update:frequency', $event)"
                        range
                        :min="filterTypes.frequency?.range?.[0] || 0"
                        :max="filterTypes.frequency?.range?.[1] || 25"
                        :format-tooltip="(val) => `${val} 次`"
                        class="time-slider"
                    />
                </div>
            </el-tab-pane>
        </el-tabs>

        <!-- 字段选择弹窗 -->
        <el-dialog
            v-model="showFieldSelector"
            title="选择查询字段"
            width="500px"
            destroy-on-close
        >
            <el-input
                v-model="queryTypeSearchKeyword"
                placeholder="搜索字段名称或代码"
                clearable
                prefix-icon="Search"
                class="mb-4"
            />

            <div class="field-selector-grid">
                <el-button
                    v-for="type in allQueryTypes"
                    :key="type.value"
                    :class="[
                        'field-selector-item',
                        queryTypeSearchKeyword &&
                        !(
                            type.label.includes(queryTypeSearchKeyword) ||
                            type.value.includes(queryTypeSearchKeyword)
                        )
                            ? 'hidden'
                            : '',
                        type.disabled ? 'disabled-field' : '',
                    ]"
                    :disabled="type.disabled"
                    @click="
                        () => {
                            if (type.disabled) return;
                            console.log('clicked', type.label, type.value);
                            const currentCondition = queryConditions.find(
                                (c) => c.type === 'more' || !c.type,
                            );
                            if (currentCondition) {
                                currentCondition.type = type.value;
                            }
                            showFieldSelector = false;
                            queryTypeSearchKeyword = '';
                        }
                    "
                >
                    {{ type.label }}
                    <span v-if="type.disabled" class="complex-type-tag"
                        >({{ type.complexType }})</span
                    >
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.filters {
    width: 300px;
    padding: 15px;
    background-color: #fff;
    border-right: 1px solid #e6e6e6;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow-y: auto;
}

.filter-section {
    margin-bottom: 24px;
}

.filter-section h3 {
    margin-bottom: 12px;
    color: #333;
    font-size: 16px;
    font-weight: 500;
}

.time-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 12px;
    color: #666;
}

.graph-container {
    flex: 1;
    background-color: #fff;
    overflow: hidden;
}

.filter-tabs {
    margin-top: 10px;
}

.query-conditions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.query-condition-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.condition-type-select {
    width: 110px;
    flex-shrink: 0;
}

.condition-value-input {
    flex: 1;
}

.condition-delete-btn {
    flex-shrink: 0;
}

.query-actions {
    margin-top: 16px;
}

.button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.add-condition-btn,
.search-btn {
    flex: 1;
    height: 36px; /* 确保两个按钮高度一致 */
}

.field-selector-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;
}

.field-selector-item {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.field-selector-item.hidden {
    display: none;
}

.mb-4 {
    margin-bottom: 16px;
}

.field-selector-item.disabled-field {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f7fa;
    color: #909399;
    border-color: #e4e7ed;
}

.complex-type-tag {
    font-size: 12px;
    color: #909399;
    margin-left: 4px;
}
</style>
