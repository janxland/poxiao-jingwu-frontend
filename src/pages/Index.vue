<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const { t } = useI18n();
const router = useRouter();

// 导航菜单项
const navItems = [
  { title: '首页', route: '/' },
  { title: 'AI警察', route: '/ai-police' },
  { title: '知识库管理', route: '/knowledge-base' },
  { title: '知识图谱', route: '/knowledge-graph' }
];

// AI警务队数据 - 更新为侧边栏中的实际路由
const policeTeams = [
  {
    id: 1,
    title: '案情审查助手',
    description: '智能分析案情要点，提供审查建议',
    icon: '🔍',
    route: '/ai-police/case-review',
  },
  {
    id: 2,
    title: '法律咨询助手',
    description: '提供法律法规查询和咨询服务',
    icon: '⚖️',
    route: '/ai-police/legal-consultant',
  },
  {
    id: 3,
    title: '文件检察官',
    description: '智能审核文书，提高文书质量',
    icon: '📝',
    route: '/ai-police/text-review',
  },
  {
    id: 4,
    title: '案件异常资金分析',
    description: '识别可疑交易，追踪资金流向',
    icon: '💰',
    route: '/ai-police/financial-analysis',
  },
  {
    id: 5,
    title: '案件社会活动轨迹',
    description: '分析社会关系网络，还原活动轨迹',
    icon: '🗺️',
    route: '/ai-police/social-activity',
  },
  {
    id: 6,
    title: '通信记录挖掘助手',
    description: '深度分析通信数据，发现隐藏线索',
    icon: '📱',
    route: '/ai-police/chat-review',
  }
];

// 知识库管理数据
const knowledgeItems = [
  {
    title: '知识库管理',
    icon: '📚',
    description: '管理本地知识库',
    route: '/knowledge-base',
  },
  {
    title: '知识图谱',
    icon: '🌐',
    description: '可视化知识连接，智能分析推理',
    route: '/knowledge-graph',
  }
];

// 导航栏滚动控制
const lastScrollTop = ref(0);
const isNavVisible = ref(true);
const isScrollingUp = ref(false);

// 监听滚动事件
const handleScroll = () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // 判断滚动方向
  isScrollingUp.value = currentScrollTop < lastScrollTop.value;
  
  // 如果向下滚动超过100px且导航栏可见，则隐藏导航栏
  if (!isScrollingUp.value && currentScrollTop > 100 && isNavVisible.value) {
    isNavVisible.value = false;
  }
  
  // 如果向上滚动且导航栏隐藏，则显示导航栏
  if (isScrollingUp.value && !isNavVisible.value) {
    isNavVisible.value = true;
  }
  
  lastScrollTop.value = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleNavigation = async (route: string) => {
  try {
    await router.push(route);
  } catch (error) {
    console.error('路由跳转失败:', error);
  }
};
</script>

<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <nav class="top-nav" :class="{ 'nav-hidden': !isNavVisible, 'nav-visible': isNavVisible }">
      <div class="nav-content">
        <div class="nav-brand">荥盾智脑</div>
        <div class="nav-links">
          <a 
            v-for="item in navItems" 
            :key="item.title" 
            :class="{ active: $route.path === item.route }"
            @click="handleNavigation(item.route)"
          >
            {{ item.title }}
          </a>
        </div>
      </div>
    </nav>
    
    <!-- 主视觉区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>智能警务平台</h1>
        <p>智能辅助执法，提升办案效率</p>
      </div>
      <div class="hero-image">
        <!-- 这里可以放置一个科技感的SVG或图片 -->
      </div>
    </div>
    
    <!-- 功能区域 -->
    <div class="features-section">
      <!-- 知识图谱区域 -->
      <div class="knowledge-graph-section">
        <h2>知识图谱</h2>
        <div class="graph-visualization">
          <!-- 这里可以放置知识图谱的可视化组件或图片 -->
          <img src="@/assets/images/knowledge-graph-placeholder.png" alt="知识图谱" class="graph-image" />
        </div>
      </div>
      
      <!-- AI警务队区域 -->
      <div class="police-teams-section">
        <h2>AI警务队</h2>
        <div class="teams-grid">
          <div 
            v-for="team in policeTeams" 
            :key="team.id" 
            class="team-card"
            @click="handleNavigation(team.route)"
          >
            <div class="team-icon">
              <span class="icon">{{ team.icon }}</span>
            </div>
            <h3>{{ team.title }}</h3>
            <p>{{ team.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

// 顶部导航栏样式
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: transform 0.3s ease, background-color 0.3s ease;
  
  &.nav-hidden {
    transform: translateY(-100%);
  }
  
  &.nav-visible {
    transform: translateY(0);
  }
  
  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 3rem;
    background-color: rgba(68, 129, 235, 0.5);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    color: white;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
    
    a {
      color: white;
      text-decoration: none;
      font-size: 1rem;
      cursor: pointer;
      position: relative;
      padding: 0.5rem 0;
      
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: white;
        transition: width 0.3s ease;
      }
      
      &:hover:after, &.active:after {
        width: 100%;
      }
    }
  }
}

// 主视觉区域样式
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 3rem 2rem 3rem; // 增加顶部内边距，为固定导航栏留出空间
  background: linear-gradient(135deg, #0061ff 0%, #60efff 100%);
  background-image: url('@/assets/images/hero-image.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  
  .hero-content {
    max-width: 600px;
    text-align: left;
    
    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }
  
  .hero-image {
    width: 40%;
    height: 300px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}

// 功能区域样式
.features-section {
  display: flex;
  flex-direction: row;
  padding: 2rem 0;
  gap: 2rem;
  width: 90%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
    padding: 1rem 0;
  }
  
  h2 {
    font-size: 1.8rem;
    font-weight: bold;
    color: white; // 修改为白色
    margin-bottom: 1.5rem;
    text-align: left;
  }
}

// 知识图谱区域样式
.knowledge-graph-section {
  background: linear-gradient(135deg, #0061ff 0%, #60efff 100%);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  flex: 1;
  color: white;
  min-height: 300px;
  position: relative;
  .graph-visualization {
    background-image: url('@/assets/images/knowledge-section.png');
    background-size: cover;
    background-position: center;
    border-radius: 0.5rem;
    overflow: hidden;
    position: absolute;
    left:50%;
    bottom:0;
    transform: translate(-50%,0);
    width:100%;
    height:75%;
    min-height: 200px;
    .graph-image {
      display: none; // 隐藏原来的图片，使用背景图片代替
    }
  }
}

// AI警务队区域样式
.police-teams-section {
  background: linear-gradient(135deg, #0061ff 0%, #60efff 100%);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  flex: 1;
  color: white;
  
  .teams-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    
    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .team-card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.8rem;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .team-icon {
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      
      .icon {
        font-size: 2rem;
      }
    }
    
    h3 {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: white;
    }
    
    p {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.4;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 10rem 2rem 0rem; // 调整顶部内边距
    
    .hero-content {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .hero-image {
      width: 80%;
    }
  }
  
  .top-nav {
    .nav-content {
      padding: 0.6rem 1rem;
      justify-content: center;
    }
    .nav-brand {
      width: 0 !important;
      display: none !important;
    }
  }
  
  .nav-links {
    gap: 1rem;
    
    a {
      font-size: 0.9rem;
    }
  }
}
</style>