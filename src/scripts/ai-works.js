// AI Works Gallery Management
console.log('AI Works script loaded');

class AIWorksGallery {
  constructor() {
    this.works = [];
    this.sliderIntervals = {};
    this.currentLang = document.body.classList.contains('en-mode') ? 'en' : 'zh';
    console.log('AIWorksGallery initialized');
  }

  async loadWorks() {
    console.log('Loading AI works...');
    try {
      const response = await fetch('src/data/ai-works.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.works = await response.json();
      console.log('AI works loaded:', this.works);
      this.render();
      this.initSliders();
    } catch (error) {
      console.error('Failed to load AI works:', error);
      this.renderError();
    }
  }

  renderError() {
    const container = document.getElementById('ai-works-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="col-span-2 text-center text-red-500 py-12">
        <span class="lang-zh">加载作品失败，请刷新页面重试</span>
        <span class="lang-en">Failed to load works. Please refresh the page.</span>
      </div>
    `;
  }

  render() {
    const container = document.getElementById('ai-works-container');
    if (!container) {
      console.error('Container #ai-works-container not found');
      return;
    }

    console.log('Rendering AI works...');
    const html = this.works.map(work => this.createWorkCard(work)).join('');
    container.innerHTML = html;
    
    // 重新初始化Lucide图标
    if (window.lucide) {
      lucide.createIcons();
    }
    console.log('AI works rendered successfully');
  }

  createWorkCard(work) {
    const name = work.name[this.currentLang] || work.name.zh;
    const description = work.description[this.currentLang] || work.description.zh;

    return `
      <div class="ai-work-card" data-work-id="${work.id}">
        <div class="ai-work-slider">
          <div class="ai-work-slides" data-slider="${work.id}">
            ${work.images.map(img => `
              <div class="ai-work-slide">
                <img src="${img}" alt="${name}" loading="lazy">
              </div>
            `).join('')}
          </div>
          
          ${work.images.length > 1 ? `
            <button class="ai-slider-nav prev" onclick="aiWorksGallery.prevSlide('${work.id}')" aria-label="Previous image">
              <i data-lucide="chevron-left"></i>
            </button>
            <button class="ai-slider-nav next" onclick="aiWorksGallery.nextSlide('${work.id}')" aria-label="Next image">
              <i data-lucide="chevron-right"></i>
            </button>
            
            <div class="ai-slider-dots">
              ${work.images.map((_, index) => `
                <div class="ai-slider-dot ${index === 0 ? 'active' : ''}" 
                     onclick="aiWorksGallery.goToSlide('${work.id}', ${index})"></div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="ai-work-content">
          <h3 class="ai-work-title">
            <span class="lang-zh">${work.name.zh}</span>
            <span class="lang-en">${work.name.en}</span>
          </h3>
          <p class="ai-work-description">
            <span class="lang-zh">${work.description.zh}</span>
            <span class="lang-en">${work.description.en}</span>
          </p>
          <a href="${work.detailUrl}" 
             class="ai-work-link" 
             onclick="aiWorksGallery.trackClick(event, '${work.id}', '${name}')">
            <span class="lang-zh">查看详情</span>
            <span class="lang-en">View Details</span>
            <i data-lucide="arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }

  initSliders() {
    this.works.forEach(work => {
      if (work.images.length > 1) {
        // 自动播放，每5秒切换
        this.sliderIntervals[work.id] = setInterval(() => {
          this.nextSlide(work.id);
        }, 5000);
      }
    });
  }

  getCurrentSlideIndex(workId) {
    const slider = document.querySelector(`[data-slider="${workId}"]`);
    if (!slider) return 0;
    
    const transform = slider.style.transform || 'translateX(0%)';
    const match = transform.match(/-?(\d+)/);
    return match ? parseInt(match[1]) / 100 : 0;
  }

  updateSlider(workId, index) {
    const work = this.works.find(w => w.id === workId);
    if (!work) return;

    const slider = document.querySelector(`[data-slider="${workId}"]`);
    const dots = document.querySelectorAll(`[data-work-id="${workId}"] .ai-slider-dot`);
    
    if (slider) {
      slider.style.transform = `translateX(-${index * 100}%)`;
    }
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // 重置自动播放计时器
    if (this.sliderIntervals[workId]) {
      clearInterval(this.sliderIntervals[workId]);
      this.sliderIntervals[workId] = setInterval(() => {
        this.nextSlide(workId);
      }, 5000);
    }
  }

  nextSlide(workId) {
    const work = this.works.find(w => w.id === workId);
    if (!work) return;

    const currentIndex = this.getCurrentSlideIndex(workId);
    const nextIndex = (currentIndex + 1) % work.images.length;
    this.updateSlider(workId, nextIndex);

    // 追踪轮播事件
    if (window.posthog) {
      window.posthog.capture('ai_work_slider_navigated', {
        work_id: workId,
        work_name: work.name[this.currentLang],
        direction: 'next',
        slide_index: nextIndex
      });
    }
  }

  prevSlide(workId) {
    const work = this.works.find(w => w.id === workId);
    if (!work) return;

    const currentIndex = this.getCurrentSlideIndex(workId);
    const prevIndex = (currentIndex - 1 + work.images.length) % work.images.length;
    this.updateSlider(workId, prevIndex);

    // 追踪轮播事件
    if (window.posthog) {
      window.posthog.capture('ai_work_slider_navigated', {
        work_id: workId,
        work_name: work.name[this.currentLang],
        direction: 'previous',
        slide_index: prevIndex
      });
    }
  }

  goToSlide(workId, index) {
    this.updateSlider(workId, index);

    const work = this.works.find(w => w.id === workId);
    if (work && window.posthog) {
      window.posthog.capture('ai_work_slider_dot_clicked', {
        work_id: workId,
        work_name: work.name[this.currentLang],
        slide_index: index
      });
    }
  }

  trackClick(event, workId, workName) {
    // GA4 埋点
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ai_work_click', {
        'work_name': workName,
        'work_id': workId
      });
    }

    // PostHog 埋点
    if (window.posthog) {
      window.posthog.capture('ai_work_detail_clicked', {
        work_id: workId,
        work_name: workName,
        language: this.currentLang
      });
    }

    console.log('AI Work clicked:', workName);
  }

  updateLanguage() {
    this.currentLang = document.body.classList.contains('en-mode') ? 'en' : 'zh';
  }

  destroy() {
    // 清理所有定时器
    Object.values(this.sliderIntervals).forEach(interval => {
      clearInterval(interval);
    });
    this.sliderIntervals = {};
  }
}

// 创建全局实例
window.aiWorksGallery = new AIWorksGallery();

// 立即尝试加载，如果DOM还没准备好则等待
if (document.readyState === 'loading') {
  console.log('Waiting for DOM to be ready...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, loading works...');
    window.aiWorksGallery.loadWorks();
  });
} else {
  console.log('DOM already ready, loading works immediately...');
  window.aiWorksGallery.loadWorks();
}

// 监听语言切换
window.addEventListener('languageChanged', () => {
  window.aiWorksGallery.updateLanguage();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  window.aiWorksGallery.destroy();
});
