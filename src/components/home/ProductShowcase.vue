<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

// 产品数据
const products = [
  {
    id: 1,
    title: '智能警务队',
    subtitle: '为安全保驾护航',
    description: '采用先进AI技术，提供智能执法系统，实时分析案件数据，辅助警务人员快速做出决策。',
    image: '/src/assets/images/police-ai.jpg',
    color: '#1E40AF'
  },
  {
    id: 2,
    title: '知识库管理',
    subtitle: '智能知识管理系统',
    description: '集中管理法律法规、案例库和执法指南，支持智能搜索和个性化推荐，让知识触手可及。',
    image: '/src/assets/images/knowledge-base.jpg',
    color: '#047857'
  },
  {
    id: 3,
    title: '知识图谱',
    subtitle: '可视化知识连接',
    description: '构建案件关联网络，智能分析案件之间的隐藏联系，提供直观的可视化界面，辅助复杂案件侦破。',
    image: '/src/assets/images/knowledge-graph.jpg',
    color: '#7E22CE'
  }
];

// 滚动相关状态
const currentSection = ref(0);
const sections = ref<HTMLElement[]>([]);
const container = ref<HTMLElement | null>(null);
const isScrolling = ref(false);

// 初始化滚动动画
onMounted(() => {
  // 获取所有section元素
  sections.value = Array.from(document.querySelectorAll('.product-section'));
  
  // 设置初始状态
  gsap.set(sections.value, { 
    opacity: 0,
    y: 100
  });
  
  gsap.set(sections.value[0], { 
    opacity: 1,
    y: 0
  });
  
  // 为每个section创建滚动触发器
  sections.value.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => updateCurrentSection(index),
      onEnterBack: () => updateCurrentSection(index),
      markers: false,
    });
    
    // 为每个section内的元素创建动画
    const title = section.querySelector('.product-title');
    const subtitle = section.querySelector('.product-subtitle');
    const description = section.querySelector('.product-description');
    const image = section.querySelector('.product-image');
    
    gsap.fromTo(title, 
      { opacity: 0, y: 50 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    gsap.fromTo(subtitle, 
      { opacity: 0, y: 30 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    gsap.fromTo(description, 
      { opacity: 0, y: 30 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay: 0.4,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    gsap.fromTo(image, 
      { opacity: 0, scale: 0.8 }, 
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
  
  // 添加滚轮事件监听
  window.addEventListener('wheel', handleWheel);
  // 添加触摸事件监听（移动端）
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
  
  // 清理ScrollTrigger
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});

// 更新当前section
const updateCurrentSection = (index: number) => {
  currentSection.value = index;
};

// 滚动到指定section
const scrollToSection = (index: number) => {
  if (isScrolling.value) return;
  
  isScrolling.value = true;
  
  const targetSection = sections.value[index];
  if (targetSection) {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: targetSection,
        offsetY: 0
      },
      ease: 'power2.inOut',
      onComplete: () => {
        isScrolling.value = false;
      }
    });
  }
};

// 处理滚轮事件
const handleWheel = (e: WheelEvent) => {
  if (isScrolling.value) {
    e.preventDefault();
    return;
  }
  
  const direction = e.deltaY > 0 ? 1 : -1;
  const nextSection = Math.min(Math.max(currentSection.value + direction, 0), sections.value.length - 1);
  
  if (nextSection !== currentSection.value) {
    scrollToSection(nextSection);
  }
};

// 触摸相关变量
let touchStartY = 0;
let touchEndY = 0;

// 处理触摸开始事件
const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY;
};

// 处理触摸移动事件
const handleTouchMove = (e: TouchEvent) => {
  if (isScrolling.value) {
    e.preventDefault();
  }
};

// 处理触摸结束事件
const handleTouchEnd = (e: TouchEvent) => {
  if (isScrolling.value) return;
  
  touchEndY = e.changedTouches[0].clientY;
  const direction = touchStartY > touchEndY ? 1 : -1;
  
  // 确保滑动距离足够大
  if (Math.abs(touchStartY - touchEndY) > 50) {
    const nextSection = Math.min(Math.max(currentSection.value + direction, 0), sections.value.length - 1);
    
    if (nextSection !== currentSection.value) {
      scrollToSection(nextSection);
    }
  }
};

// 导航到指定section
const navigateToSection = (index: number) => {
  scrollToSection(index);
};
</script>

<template>
  <div class="product-showcase" ref="container">
    <!-- 导航指示器 -->
    <div class="navigation-indicators">
      <div 
        v-for="(product, index) in products" 
        :key="product.id"
        class="indicator"
        :class="{ active: currentSection === index }"
        @click="navigateToSection(index)"
      ></div>
    </div>
    
    <!-- 产品展示部分 -->
    <div 
      v-for="(product, index) in products" 
      :key="product.id"
      class="product-section"
      :style="{ '--accent-color': product.color }"
    >
      <div class="product-content">
        <h2 class="product-title">{{ product.title }}</h2>
        <h3 class="product-subtitle">{{ product.subtitle }}</h3>
        <p class="product-description">{{ product.description }}</p>
      </div>
      <div class="product-visual">
        <img :src="product.image" :alt="product.title" class="product-image" />
      </div>
    </div>
    
    <!-- 滚动提示 -->
    <div class="scroll-indicator" v-if="currentSection === 0">
      <span class="scroll-text">向下滚动</span>
      <div class="scroll-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-showcase {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.product-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  --accent-color: #1E40AF;
  
  @media (min-width: 768px) {
    flex-direction: row;
    padding: 4rem;
  }
  
  &:nth-child(even) {
    .product-content {
      order: 2;
    }
    
    .product-visual {
      order: 1;
    }
  }
}

.product-content {
  flex: 1;
  max-width: 600px;
  text-align: left;
  padding: 2rem;
  
  @media (max-width: 767px) {
    order: 1 !important;
    text-align: center;
  }
}

.product-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 767px) {
    order: 2 !important;
  }
}

.product-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--accent-color);
  
  @media (max-width: 767px) {
    font-size: 2.5rem;
  }
}

.product-subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: #333;
  
  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
}

.product-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #555;
  
  @media (max-width: 767px) {
    font-size: 1rem;
  }
}

.product-image {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform-origin: center;
}

.navigation-indicators {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
  
  @media (max-width: 767px) {
    right: 1rem;
  }
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.active {
    background-color: var(--accent-color, #1E40AF);
    transform: scale(1.3);
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 2s infinite;
  
  .scroll-text {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #666;
  }
  
  .scroll-arrow {
    color: #666;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>