// 初始化 Lucide 图标
lucide.createIcons();

// 语言切换功能
function toggleLanguage() {
    document.body.classList.toggle('en-mode');
    // 保存语言偏好到localStorage
    const isEn = document.body.classList.contains('en-mode');
    const newLang = isEn ? 'en' : 'zh';
    localStorage.setItem('language', newLang);
    
    // 触发语言切换事件供PostHog追踪
    window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: newLang } 
    }));
}

// 页面加载时检查语言偏好
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'en') {
        document.body.classList.add('en-mode');
    }
});

// 移动端菜单功能
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.add('hidden');
}

// 教育/工作经历展开功能
function toggleExp(id) {
    const element = document.getElementById(id);
    const wasExpanded = element.classList.contains('expanded');
    element.classList.toggle('expanded');
    
    // 追踪展开/折叠事件
    if (window.posthog) {
        window.posthog.capture('experience_card_toggled', {
            card_id: id,
            action: wasExpanded ? 'collapsed' : 'expanded'
        });
    }
}
// ====== 二级下拉切换功能 ======
function toggleSubExp(event) {
    event.stopPropagation();
    const element = event.currentTarget.closest('.sub-exp-card');
    if (element) {
        const wasExpanded = element.classList.contains('expanded');
        element.classList.toggle('expanded');
        
        // 追踪子项目展开/折叠
        if (window.posthog) {
            const title = element.querySelector('h4')?.textContent || 'unknown';
            window.posthog.capture('sub_experience_toggled', {
                title: title,
                action: wasExpanded ? 'collapsed' : 'expanded'
            });
        }
    }
}

// 图片上传功能
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('portrait-preview');
            document.getElementById('upload-placeholder').style.display = 'none';
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

// 项目轮播功能
let currentProjectIndex = 0;
const totalProjects = 5;
const carousel = document.getElementById('carousel');
const indicatorsContainer = document.getElementById('indicators');

const projectUrls = [
    "/project/0", 
    "/project/1",
    "/project/2",
    "/project/3",
    "/project/4"
];

function navigateToProject(index) {
    console.log("正在跳转到项目:", index);
    
    // 追踪项目卡片点击
    if (window.posthog) {
        window.posthog.capture('project_card_clicked', {
            project_index: index,
            project_url: projectUrls[index]
        });
    }
    
    // 实际使用时取消下面这行的注释即可跳转
    // window.location.href = projectUrls[index];
    alert("即将跳转到地址: " + projectUrls[index]);
}

// 初始化项目指示器
for (let i = 0; i < totalProjects; i++) {
    const dot = document.createElement('button');
    dot.className = `h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-[#1a2e5a] w-8' : 'bg-gray-300 w-2'}`;
    dot.onclick = (e) => {
        e.stopPropagation();
        goToProjectSlide(i);
    };
    indicatorsContainer.appendChild(dot);
}

function updateProjectCarousel() {
    carousel.style.transform = `translateX(-${currentProjectIndex * 100}%)`;
    const dots = indicatorsContainer.getElementsByTagName('button');
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = i === currentProjectIndex 
            ? 'h-2 bg-[#1a2e5a] w-8 rounded-full transition-all duration-300' 
            : 'h-2 bg-gray-300 w-2 rounded-full transition-all duration-300';
    }
}

function moveNext() {
    currentProjectIndex = (currentProjectIndex + 1) % totalProjects;
    updateProjectCarousel();
    
    // 追踪项目轮播
    if (window.posthog) {
        window.posthog.capture('project_carousel_navigated', {
            direction: 'next',
            project_index: currentProjectIndex
        });
    }
}

function movePrev() {
    currentProjectIndex = (currentProjectIndex - 1 + totalProjects) % totalProjects;
    updateProjectCarousel();
    
    // 追踪项目轮播
    if (window.posthog) {
        window.posthog.capture('project_carousel_navigated', {
            direction: 'previous',
            project_index: currentProjectIndex
        });
    }
}

function goToProjectSlide(index) {
    currentProjectIndex = index;
    updateProjectCarousel();
}

// 技能轮播功能
let currentSkillIndex = 0;
const skillTrack = document.getElementById('skill-track');
const skillSlides = document.querySelectorAll('.skill-category-card');
const skillDotsContainer = document.getElementById('skill-dots');

skillSlides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSkillSlide(i);
    skillDotsContainer.appendChild(dot);
});

const skillDots = document.querySelectorAll('.dot');

function updateSkillCarousel() {
    skillTrack.style.transform = `translateX(-${currentSkillIndex * 100}%)`;
    skillDots.forEach((dot, i) => dot.classList.toggle('active', i === currentSkillIndex));
}

function moveSkillSlide(direction) {
    currentSkillIndex = (currentSkillIndex + direction + skillSlides.length) % skillSlides.length;
    updateSkillCarousel();
    
    // 追踪技能卡片轮播
    if (window.posthog) {
        const currentSkillTitle = skillSlides[currentSkillIndex]?.querySelector('.category-name')?.textContent || 'unknown';
        window.posthog.capture('skill_carousel_navigated', {
            direction: direction > 0 ? 'next' : 'previous',
            current_skill: currentSkillTitle,
            skill_index: currentSkillIndex
        });
    }
}

function goToSkillSlide(index) {
    currentSkillIndex = index;
    updateSkillCarousel();
}

// 回到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    updateProjectCarousel();
    updateSkillCarousel();
    
    // 为导航链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                closeMobileMenu(); // 点击后关闭移动菜单
            }
        });
    });
    
    // 初始化回到顶部按钮显示/隐藏
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 显示/隐藏回到顶部按钮
        if (scrollTop > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
});