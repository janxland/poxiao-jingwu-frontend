<template>
  <div class="fileupload-container p-0">

    <div class="content-wrapper">
      <!-- 上传类型选择 -->
      <div class="upload-type-tabs">
        <div
          class="tab-item"
          :class="{ active: currentUploadType === 'json' }"
          @click="switchUploadType('json')"
        >
        案例相关信息
        </div>
        <!-- <div
          class="tab-item"
          :class="{ active: currentUploadType === 'suspect' }"
          @click="switchUploadType('suspect')"
        >
          文件上传
        </div> -->
        <div
          class="tab-item"
          :class="{ active: currentUploadType === 'common' }"
          @click="switchUploadType('common')"
        >
        法律公文及案例
        </div>
      </div>

      <!-- ======================= 结构化文件上传（JSON/TXT） ======================= -->
      <div class="common-doc-section" v-if="currentUploadType === 'json'">
        <h2>结构化文件上传</h2>
        <div class="suspect-form">
          <div class="form-item">
            <label>姓名：</label>
            <el-input v-model="suspectInfo.name" placeholder="请输入嫌疑人姓名" />
            <label class="role-label">人员角色：</label>
            <el-select v-model="suspectInfo.role" placeholder="请选择角色" class="role-select">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="form-item">
            <label>电话：</label>
            <el-input v-model="suspectInfo.phone" placeholder="请输入嫌疑人电话" />
          </div>

          <div class="form-item">
            <label>身份证：</label>
            <el-input v-model="suspectInfo.cardNumber" placeholder="请输入身份证号（选填）" />
          </div>
          <div class="form-item file-type-selector">
            <label>文件类型：</label>
            <div class="file-type-options">
              <div 
                v-for="fileType in suspectFileTypes" 
                :key="fileType.type"
                class="file-type-option"
                :class="{ active: suspectInfo.fileType === fileType.type }"
                @click="selectFileType(fileType.type)"
              >
                <div class="file-type-icon" :style="{ backgroundColor: fileType.color + '20' }">
                  <el-icon :color="fileType.color"><component :is="fileType.icon" /></el-icon>
                </div>
                <div class="file-type-name">{{ fileType.name }}</div>
              </div>
            </div>
          </div>
          <div class="form-tip">请先填入犯罪嫌疑人信息，再进行文件上传</div>
        </div>

        <!-- 这里直接使用 <el-upload>  -->
        <div class="common-doc-card">
          <div class="icon-wrapper">
            <el-icon color="#409EFF"><Document /></el-icon>
          </div>
          <div class="type-name">结构化文件(JSON、TXT、Excel、Word)</div>

          <el-upload
            class="upload-area"
            drag
            action="#"
            :auto-upload="false"
            :file-list="fileListJson"
            :on-change="handleChangeJson"
            :on-remove="handleRemoveJson"
            :before-upload="beforeUploadJson"
            multiple
          >
            <el-icon><Upload /></el-icon>
            <div class="upload-text">
              <span class="main-text">拖拽文件到此处或点击上传</span>
              <span class="sub-text">支持上传 JSON、TXT、Excel、Word 文件</span>
            </div>
          </el-upload>
        </div>

        <div class="action-buttons" style="margin-top: 20px;">
          <el-button
            type="primary"
            @click="startVerification('json')"
            :disabled="fileListJson.length === 0 || verificationStatus.inProgress"
            :loading="verificationStatus.inProgress"
          >
            <el-icon><Document /></el-icon>
            开始验证
          </el-button>

          <el-button
            type="success"
            @click="submitFiles('json')"
            :disabled="fileListJson.length === 0 || isUploading"
            :loading="isUploading"
          >
            <el-icon><Upload /></el-icon>
            提交文件
          </el-button>
        </div>
      </div>

      <!-- ======================= 嫌疑人文件上传（Word/Excel） ======================= -->
      <div class="suspect-info-section" v-if="currentUploadType === 'suspect'">
        <h2>犯罪嫌疑人信息上传</h2>

        <div class="suspect-form">
          <div class="form-item">
            <label>姓名：</label>
            <el-input v-model="suspectInfo.name" placeholder="请输入嫌疑人姓名" />
            <label class="role-label">人员角色：</label>
            <el-select v-model="suspectInfo.role" placeholder="请选择角色" class="role-select">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="form-item">
            <label>电话：</label>
            <el-input v-model="suspectInfo.phone" placeholder="请输入嫌疑人电话" />
          </div>

          <div class="form-item">
            <label>身份证：</label>
            <el-input v-model="suspectInfo.cardNumber" placeholder="请输入身份证号（选填）" />
          </div>

          <!-- 新增文件类型选择 -->
          <div class="form-item file-type-selector">
            <label>文件类型：</label>
            <div class="file-type-options">
              <div 
                v-for="fileType in suspectFileTypes" 
                :key="fileType.type"
                class="file-type-option"
                :class="{ active: suspectInfo.fileType === fileType.type }"
                @click="selectFileType(fileType.type)"
              >
                <div class="file-type-icon" :style="{ backgroundColor: fileType.color + '20' }">
                  <el-icon :color="fileType.color"><component :is="fileType.icon" /></el-icon>
                </div>
                <div class="file-type-name">{{ fileType.name }}</div>
              </div>
            </div>
          </div>

          <div class="form-tip">请先填入犯罪嫌疑人信息，再进行文件上传</div>
        </div>

        <!-- 这里直接使用 <el-upload>  -->
        <div class="common-doc-card" style="600px;">
          <div class="icon-wrapper">
            <el-icon color="#409EFF"><Document /></el-icon>
          </div>
          <div class="type-name">嫌疑人相关文件(Word/Excel)</div>

          <el-upload
            class="upload-area"
            drag
            action="#"
            :auto-upload="false"
            :file-list="fileListSuspect"
            :on-change="handleChangeSuspect"
            :on-remove="handleRemoveSuspect"
            :before-upload="beforeUploadSuspect"
            multiple
          >
            <el-icon><Upload /></el-icon>
            <div class="upload-text">
              <span class="main-text">拖拽文件到此处或点击上传</span>
              <span class="sub-text">支持上传 Word、Excel 格式文件</span>
            </div>
          </el-upload>
        </div>

        <div class="action-buttons" style="margin-top: 20px;">
          <el-button
            type="primary"
            @click="startVerification('suspect')"
            :disabled="fileListSuspect.length === 0 || verificationStatus.inProgress"
            :loading="verificationStatus.inProgress"
          >
            <el-icon><Document /></el-icon>
            开始验证
          </el-button>

          <el-button
            type="success"
            @click="submitFiles('suspect')"
            :disabled="fileListSuspect.length === 0 || isUploading"
            :loading="isUploading"
          >
            <el-icon><Upload /></el-icon>
            提交文件
          </el-button>
        </div>
      </div>

      <!-- ======================= 通用公文上传（Word/Excel） ======================= -->
      <div class="common-doc-section" v-if="currentUploadType === 'common'">
        <h2>法律公文及案例</h2>

        <!-- 同样直接使用 <el-upload> -->
        <div class="common-doc-card" style="max-width: 600px;">
          <div class="icon-wrapper">
            <el-icon color="#409EFF"><Document /></el-icon>
          </div>
          <div class="type-name">法律文件及案例(Word/Excel)</div>

          <el-upload
            class="upload-area"
            drag
            action="#"
            :auto-upload="false"
            :file-list="fileListCommon"
            :on-change="handleChangeCommon"
            :on-remove="handleRemoveCommon"
            :before-upload="beforeUploadCommon"
            multiple
          >
            <el-icon><Upload /></el-icon>
            <div class="upload-text">
              <span class="main-text">拖拽文件到此处或点击上传</span>
              <span class="sub-text">支持上传 Word、Excel 格式文件</span>
            </div>
          </el-upload>
        </div>

        <div class="action-buttons" style="margin-top: 20px;">
          <el-button
            type="primary"
            @click="startVerification('common')"
            :disabled="fileListCommon.length === 0 || verificationStatus.inProgress"
            :loading="verificationStatus.inProgress"
          >
            <el-icon><Document /></el-icon>
            开始验证
          </el-button>

          <el-button
            type="success"
            @click="submitFiles('common')"
            :disabled="fileListCommon.length === 0 || isUploading"
            :loading="isUploading"
          >
            <el-icon><Upload /></el-icon>
            提交文件
          </el-button>
        </div>
      </div>

      <!-- 上传进度 -->
      <el-progress
        v-if="verificationStatus.inProgress || isUploading"
        :percentage="uploadProgress"
        :status="uploadProgress < 100 ? '' : 'success'"
        :stroke-width="10"
        class="upload-progress"
      />

      <!-- 验证结果 -->
      <div class="verification-section" v-if="verificationStatus.completed">
        <div class="verification-header">
          <h2>验证结果</h2>
          <div
            class="verification-status"
            :class="{ 'status-passed': verificationStatus.passed, 'status-failed': !verificationStatus.passed }"
          >
            <el-icon v-if="verificationStatus.passed"><Check /></el-icon>
            <el-icon v-else><Warning /></el-icon>
            <span>{{ verificationStatus.passed ? '全部通过' : '部分未通过' }}</span>
          </div>
        </div>

        <div class="verification-results">
          <div
            v-for="(result, index) in verificationStatus.results"
            :key="index"
            class="result-item"
            :class="{ 'result-passed': result.passed, 'result-failed': !result.passed }"
          >
            <div class="result-header">
              <div class="file-info">
                <el-icon><Document /></el-icon>
                <span class="file-name">{{ result.fileName }}</span>
                <span class="file-type">{{ result.fileType }}</span>
              </div>
              <div class="result-status">
                <el-tag :type="result.passed ? 'success' : 'danger'">
                  {{ result.passed ? '通过' : '未通过' }}
                </el-tag>
              </div>
            </div>

            <div class="result-issues" v-if="!result.passed">
              <div class="issues-header">
                <el-icon><InfoFilled /></el-icon>
                <span>发现以下问题：</span>
              </div>
              <ul class="issues-list">
                <li v-for="(issue, i) in result.issues" :key="i">{{ issue }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import {
  Upload,
  Document,
  Check,
  Warning,
  InfoFilled,
  ChatDotRound,
  Location,
  Money,
  Warning as WarningIcon
} from '@element-plus/icons-vue';
import { service } from '@/api'; // 导入axios实例

// ========== 上传相关的状态 ==========
const fileListJson = ref([]);     // 结构化文件(JSON/TXT)
const fileListSuspect = ref([]);  // 嫌疑人文件(Word/Excel)
const fileListCommon = ref([]);   // 通用公文(Word/Excel)

const isUploading = ref(false);
const uploadProgress = ref(0);

// ========== 嫌疑人信息 ==========
const suspectInfo = reactive({
  name: '',
  phone: '',
  cardNumber: '',
  role: '嫌疑人', // 默认角色
  fileType: 'chat' // 默认文件类型
});

// 用户角色选项
const roleOptions = [
  { value: '嫌疑人', label: '嫌疑人（嫌疑人）' },
  { value: '同伙/共犯', label: '同伙/共犯' },
  { value: '被害人', label: '被害人' },
  { value: '证人', label: '证人' },
  { value: '普通联系人', label: '普通联系人' }
];

function selectFileType(type) {
  suspectInfo.fileType = type;
}

// 文件类型选项
const suspectFileTypes = [
  { name: '案件资金活动信息', type: 'chat', icon: 'ChatDotRound', color: '#E6A23C', apiType: 2 }, // 通信文件
  { name: '案件通信信息', type: 'social', icon: 'Location', color: '#409EFF', apiType: 4 }, // 社会文件
  { name: '法律知识库', type: 'financial', icon: 'Money', color: '#67C23A', apiType: 1 }, // 资金文件
  { name: '案件社会活动信息', type: 'crime', icon: 'WarningIcon', color: '#F56C6C', apiType: 3 } // 法律文件
];

// 获取当前选择的文件类型对应的API类型值
function getSelectedFileTypeApiValue() {
  const selectedType = suspectFileTypes.find(item => item.type === suspectInfo.fileType);
  return selectedType ? selectedType.apiType : 1; // 默认返回1
}

// ========== 当前激活的 Tab ==========
const currentUploadType = ref<'json' | 'suspect' | 'common'>('json');

// ========== 验证状态 ==========
const verificationStatus = reactive({
  inProgress: false,
  completed: false,
  passed: false,
  results: [] as {
    fileName: string;
    fileType: string;
    passed: boolean;
    issues: string[];
  }[]
});

// ========================================================================
// 切换上传类型
function switchUploadType(type: 'json' | 'suspect' | 'common') {
  currentUploadType.value = type;
  // 切换时清空验证结果
  verificationStatus.completed = false;
  verificationStatus.inProgress = false;
  verificationStatus.results = [];
  verificationStatus.passed = false;
}

// ========================================================================
// 上传前文件校验
// 1) JSON/TXT
function beforeUploadJson(file: File) {
  const isJsonOrTxt =
    file.type === 'application/json' ||
    file.name.endsWith('.json') ||
    file.type === 'text/plain' ||
    file.name.endsWith('.txt');

  if (!isJsonOrTxt) {
    ElMessage.error('只能上传 JSON 或 TXT 文件!');
    return false;
  }

  // 检查文件大小 (限制为10MB)
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB!');
    return false;
  }

  return true;
}

// 2) Word/Excel (嫌疑人 & 通用公文)
function beforeUploadSuspect(file: File) {
  return checkWordExcel(file);
}

function beforeUploadCommon(file: File) {
  return checkWordExcel(file);
}

function checkWordExcel(file: File) {
  const fileName = file.name.toLowerCase();
  const isWord = fileName.endsWith('.doc') || fileName.endsWith('.docx');
  const isExcel =
    fileName.endsWith('.xls') ||
    fileName.endsWith('.xlsx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel';

  if (!isWord && !isExcel) {
    ElMessage.error('只能上传 Word 或 Excel 文件!');
    return false;
  }

  // 检查文件大小 (限制为10MB)
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB!');
    return false;
  }

  return true;
}

// ========================================================================
// 文件列表变动
function handleChangeJson(file, list) {
  fileListJson.value = list;
}

function handleRemoveJson(file, list) {
  fileListJson.value = list;
  resetVerification();
}

function handleChangeSuspect(file, list) {
  fileListSuspect.value = list;
}

function handleRemoveSuspect(file, list) {
  fileListSuspect.value = list;
  resetVerification();
}

function handleChangeCommon(file, list) {
  fileListCommon.value = list;
}

function handleRemoveCommon(file, list) {
  fileListCommon.value = list;
  resetVerification();
}

// 只要移除文件或重新上传，都重置验证状态
function resetVerification() {
  verificationStatus.inProgress = false;
  verificationStatus.completed = false;
  verificationStatus.passed = false;
  verificationStatus.results = [];
}

// ========================================================================
// 开始验证 (仅在本地进行验证)
async function startVerification(type: 'json' | 'suspect' | 'common') {
  const filesToVerify =
    type === 'json'
      ? fileListJson.value
      : type === 'suspect'
      ? fileListSuspect.value
      : fileListCommon.value;

  if (filesToVerify.length === 0) {
    ElMessage.warning('请先上传文件');
    return;
  }

  // 对嫌疑人上传的场景，要求必填姓名和电话
  if ((type === 'suspect' || type === 'json') && (!suspectInfo.name || !suspectInfo.phone)) {
    ElMessage.warning('请先填写嫌疑人姓名和电话');
    return;
  }

  verificationStatus.inProgress = true;
  verificationStatus.completed = false;
  verificationStatus.results = [];

  // 这里完全本地校验
  const tasks: Promise<void>[] = [];

  filesToVerify.forEach((uploadFile) => {
    tasks.push(
      new Promise((resolve) => {
        const resultItem = {
          fileName: uploadFile.name,
          fileType: '', // 可根据后缀分类
          passed: true,
          issues: [] as string[]
        };

        // 判断后缀
        const lowerName = uploadFile.name.toLowerCase();
        if (lowerName.endsWith('.json')) {
          resultItem.fileType = 'JSON';
        } else if (lowerName.endsWith('.txt')) {
          resultItem.fileType = 'TXT';
        } else if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) {
          resultItem.fileType = 'Word文档';
        } else if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx')) {
          resultItem.fileType = 'Excel文档';
        } else {
          resultItem.passed = false; // 不支持的文件类型
          resultItem.issues.push('不支持的文件类型');
        }

        // 直接将结果添加到状态中
        verificationStatus.results.push(resultItem);
        resolve();
      })
    );
  });

  // 等待所有文件处理完毕
  await Promise.all(tasks);

  // 统计是否全部通过
  verificationStatus.passed = verificationStatus.results.every((r) => r.passed);
  verificationStatus.completed = true;
  verificationStatus.inProgress = false;

  if (verificationStatus.passed) {
    ElMessage.success('所有文件验证通过！');
  } else {
    ElMessage.error('部分文件验证未通过，请查看详情');
  }
}

// ========================================================================
// 提交文件
function submitFiles(type: 'json' | 'suspect' | 'common') {
  const filesToSubmit =
    type === 'json'
      ? fileListJson.value
      : type === 'suspect'
      ? fileListSuspect.value
      : fileListCommon.value;

  // 检查信息
  if ((type === 'suspect' || type === 'json') && (!suspectInfo.name || !suspectInfo.phone)) {
    ElMessage.warning('请先填写嫌疑人姓名和电话');
    return;
  }
  if (!verificationStatus.completed) {
    ElMessage.warning('请先完成文件验证');
    return;
  }

  if (!verificationStatus.passed) {
    // 有文件未通过时给出提示
    ElMessageBox.confirm('有文件未通过验证，确定要提交吗?', '警告', {
      confirmButtonText: '确定提交',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        performSubmit(type, filesToSubmit);
      })
      .catch(() => {});
  } else {
    // 全部通过
    performSubmit(type, filesToSubmit);
  }
}

async function uploadMinio(files, type) {
  try {
    // 创建文件上传任务数组，但不立即执行
    const uploadTasks = files.map(file => {
      return {
        fileName: file.name,
        file: file.raw,
        type: getSelectedFileTypeApiValue()
      };
    });

    const results = [];
    // 按顺序一个个上传文件
    for (const task of uploadTasks) {
      try {
        const formData = new FormData();
        formData.append('file', task.file);
        formData.append('type', task.type);
        
        // 执行单个文件上传
        const response = await service.post('/uploadfile/api/upload', formData);
        
        results.push({
          status: 'fulfilled',
          value: {
            fileName: task.fileName,
            response
          }
        });
        
        // 每个文件上传成功后显示进度提示
        ElMessage.info(`文件 ${task.fileName} 上传完成`);
        
      } catch (error) {
        results.push({
          status: 'rejected',
          reason: {
            fileName: task.fileName,
            error: error.message || '上传失败'
          }
        });
        
        // 显示单个文件上传失败的提示
        ElMessage.warning(`文件 ${task.fileName} 上传失败`);
      }
    }

    // 分析上传结果
    const successUploads = results.filter(r => r.status === 'fulfilled');
    const failedUploads = results.filter(r => r.status === 'rejected');

    // 生成详细的上传报告
    if (failedUploads.length > 0) {
      const failureDetails = failedUploads.map(f => f.reason.fileName).join(', ');
      ElMessage.warning(`上传结果: ${successUploads.length}个成功, ${failedUploads.length}个失败`);
    } else {
      ElMessage.success(`所有${files.length}个文件上传成功`);
    }

    // 如果有文件上传成功，更新状态
    if (successUploads.length > 0) {
      clearUploadState(type);
      emit('refresh-list');
    }

    return successUploads.length > 0;
  } catch (error) {
    console.error('文件上传过程发生错误:', error);
    ElMessage.error('文件上传过程发生错误');
    return false;
  }
}

// 清理上传状态的辅助函数
function clearUploadState(type) {
  // 清空对应类型的文件列表
  if (type === 'json') {
    fileListJson.value = [];
  } else if (type === 'suspect') {
    fileListSuspect.value = [];
  } else {
    fileListCommon.value = [];
  }

  // 重置验证状态
  verificationStatus.completed = false;
  verificationStatus.results = [];

  // 清空嫌疑人信息(仅针对嫌疑人和json类型)
  if (type === 'suspect' || type === 'json') {
    Object.assign(suspectInfo, {
      name: '',
      phone: '',
      cardNumber: '',
      fileType: 'chat'
    });
  }
}
// 修改提交文件函数
async function performSubmit(type: 'json' | 'suspect' | 'common', files) {
  isUploading.value = true;
  uploadProgress.value = 0;

  // 模拟上传进度
  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 5;
    }
  }, 200);

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file.raw);
    });

    // 添加嫌疑人信息
    if (type === 'suspect' || type === 'json') {
      formData.append('phone', suspectInfo.phone);
      formData.append('realName', suspectInfo.name);
      if (suspectInfo.cardNumber) {
        formData.append('cardNumber', suspectInfo.cardNumber);
      }
      formData.append('type', 'custom'); // 添加文件类型
    }

    formData.append('uploadType', type);

    // 发送请求
    const response = await service.post('/test/api/file', formData);
    if (response.code === 200 || response.status === 200) {
      uploadProgress.value = 100;
      ElMessage.success('文件上传成功！');
      ElMessage.success(response.msg || '上传成功，等待知识图谱生成');
      uploadMinio(files, getSelectedFileTypeApiValue());
    } else {
      ElMessage.error(response.message || '上传失败');
    }
  } catch (error) {
    ElMessage.error('生成知识图谱失败');
    console.error(error);
  } finally {
    clearInterval(progressInterval);
    isUploading.value = false;
  }
}

// 定义emit
const emit = defineEmits(['refresh-list']);

// 页面加载
onMounted(() => {
  // 初始化操作
});
</script>

<style lang="scss" scoped>
.fileupload-container {
  background-color: #f5f7fa;
  color: #303133;
  padding: 0px !important;
}

// 上传类型选择标签
.upload-type-tabs {
  display: flex;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 20px;
  
  .tab-item {
    padding: 12px 24px;
    cursor: pointer;
    font-size: 16px;
    color: #606266;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
    
    &:hover {
      color: #409EFF;
    }
    
    &.active {
      color: #409EFF;
      border-bottom-color: #409EFF;
    }
  }
}

// 嫌疑人信息区域
.suspect-info-section, .common-doc-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    font-size: 20px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 24px;
  }
}

.suspect-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin-bottom: 24px;
  margin: auto;
  
  .form-item {
    display: flex;
    align-items: center;
    
    label {
      width: 120px;
      text-align: right;
      padding-right: 12px;
      color: #606266;
    }
    
    .role-label {
      width: auto;
      margin-left: 20px;
    }
    
    .el-input {
      flex: 1;
    }
    
    .role-select {
      width: 200px;
    }
  }
  
  .form-tip {
    color: #909399;
    font-size: 14px;
    margin-top: 8px;
    margin-left: 10px;
  }
}

// 文件类型选择
.file-type-selector {
  margin-top: 16px;
  align-items: flex-start;
}

.file-type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-left: 10px;
}

.file-type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409EFF;
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #409EFF;
    background-color: #ecf5ff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.file-type-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  .el-icon {
    font-size: 24px;
  }
}

.file-type-name {
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.common-doc-card {
  background-color: #f8f9fb;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
  margin: 0 auto;
  max-width: 600px;
  
  .icon-wrapper {
    width: 60px;
    height: 60px;
    background-color: #f0f7ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    
    .el-icon {
      font-size: 30px;
    }
  }
  
  .type-name {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
  }
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  background-color: #f8f9fb;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409EFF;
    background-color: #f0f7ff;
  }
}

:deep(.el-upload-dragger) {
  background-color: transparent;
  border: none;
  padding: 40px 0;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .main-text {
    font-size: 18px;
    color: #303133;
  }
  
  .sub-text {
    font-size: 14px;
    color: #909399;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.upload-progress {
  margin-top: 24px;
}

.verification-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
}

.verification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 20px;
    font-weight: 500;
    color: #303133;
  }
}

.verification-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  
  &.status-passed {
    background-color: rgba(103, 194, 58, 0.1);
    color: #67C23A;
  }
  
  &.status-failed {
    background-color: rgba(245, 108, 108, 0.1);
    color: #F56C6C;
  }
  
  .el-icon {
    font-size: 18px;
  }
}

.verification-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  background-color: #f8f9fb;
  border-radius: 6px;
  padding: 16px;
  
  &.result-passed {
    border-left: 4px solid #67C23A;
  }
  
  &.result-failed {
    border-left: 4px solid #F56C6C;
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .el-icon {
    font-size: 20px;
    color: #909399;
  }
  
  .file-name {
    font-size: 16px;
    color: #303133;
  }
  
  .file-type {
    font-size: 14px;
    color: #606266;
    margin-left: 8px;
  }
}

.result-issues {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.issues-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  
  .el-icon {
    color: #F56C6C;
  }
  
  span {
    color: #606266;
  }
}

.issues-list {
  list-style-type: disc;
  padding-left: 24px;
  
  li {
    color: #606266;
    margin-bottom: 6px;
    font-size: 14px;
  }
}

:deep(.el-upload-list) {
  background-color: #f8f9fb;
  border-radius: 6px;
  padding: 8px;
  margin-top: 16px;
  
  .el-upload-list__item {
    color: #303133;
    background-color: #ffffff;
    border-radius: 4px;
    margin-bottom: 8px;
    padding: 8px 12px;
    border: 1px solid #ebeef5;
    
    &:hover {
      background-color: #f5f7fa;
    }
    
    .el-icon {
      color: #909399;
    }
  }
}
</style>