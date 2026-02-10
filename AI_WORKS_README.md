# AI 作品集模块使用指南

## 概述

AI 作品集模块是一个全新设计的展示区域，用于展示人工智能驱动的创新项目。该模块采用响应式网格布局，每个作品卡片包含图片轮播、标题、描述和详情链接。

## 文件结构

```
src/
├── data/
│   └── ai-works.json          # AI作品数据配置文件
├── scripts/
│   └── ai-works.js            # AI作品集JavaScript逻辑
└── styles/
    └── main.css               # 包含AI作品集样式
```

## 添加/编辑作品

### 1. 编辑数据文件

打开 `src/data/ai-works.json`，按以下格式添加新作品：

```json
{
  "id": "work-5",
  "name": {
    "zh": "作品中文名称",
    "en": "Work English Name"
  },
  "description": {
    "zh": "作品的中文描述，建议控制在50-80字",
    "en": "Work description in English, recommended 50-80 characters"
  },
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  "detailUrl": "/ai-works/your-work-slug"
}
```

### 2. 字段说明

- **id** (必填): 唯一标识符，建议使用 `work-N` 格式
- **name** (必填): 作品名称，支持中英文
  - `zh`: 中文名称
  - `en`: 英文名称
- **description** (必填): 作品简介，支持中英文
  - `zh`: 中文描述
  - `en`: 英文描述
- **images** (必填): 图片URL数组
  - 支持1-5张图片
  - 推荐尺寸：800x600px
  - 支持格式：JPG, PNG, WebP
  - 建议使用高质量图片服务（如Unsplash, 自有CDN等）
- **detailUrl** (必填): 详情页链接
  - 可以是相对路径或完整URL

### 3. 图片建议

#### 推荐来源
- **Unsplash**: 高质量免费图片 (https://unsplash.com)
- **Pexels**: 免费图片和视频 (https://pexels.com)
- **自有CDN**: 上传到项目的 `public/images/ai-works/` 目录

#### 图片规格
- **宽度**: 800-1200px
- **高度**: 600-800px
- **比例**: 4:3 或 16:9
- **大小**: < 500KB (优化后)
- **格式**: WebP 优先，JPEG/PNG 备选

#### 使用Unsplash示例
```
https://images.unsplash.com/photo-{PHOTO_ID}?w=800&h=600&fit=crop
```

### 4. 示例：添加新作品

```json
{
  "id": "work-5",
  "name": {
    "zh": "智能代码助手",
    "en": "Smart Code Assistant"
  },
  "description": {
    "zh": "基于AI的代码补全和优化工具，支持20+编程语言，提升开发效率50%",
    "en": "AI-powered code completion and optimization tool supporting 20+ languages, boosting productivity by 50%"
  },
  "images": [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
  ],
  "detailUrl": "/ai-works/code-assistant"
}
```

## 布局说明

### 桌面端 (>1024px)
- 2x2 网格布局
- 每行显示2个作品
- 卡片宽度自适应

### 平板端 (768px-1024px)
- 2x2 网格布局
- 间距稍微缩小

### 移动端 (<768px)
- 单列布局
- 每个作品占满宽度

## 图片轮播功能

### 自动播放
- 默认每5秒自动切换到下一张图片
- 用户手动切换后重置计时器

### 手动控制
- **左右箭头**: 切换上一张/下一张
- **指示点**: 直接跳转到指定图片
- **触摸滑动**: 移动端支持滑动切换（未来功能）

### 单张图片
- 如果作品只有1张图片，不显示导航控件
- 节省空间，保持界面简洁

## 样式定制

### 修改主题色

在 `src/styles/main.css` 中修改以下变量：

```css
:root {
    --morandi-bg: #F2EFE9;      /* 背景色 */
    --morandi-green: #8E9775;   /* 主色调1 */
    --morandi-camel: #D4A373;   /* 主色调2 */
    --morandi-text: #4A4E69;    /* 文字颜色 */
    --primary: #1e3a5f;         /* 标题颜色 */
}
```

### 修改卡片样式

```css
.ai-work-card {
    border-radius: 1rem;        /* 圆角 */
    box-shadow: ...;            /* 阴影 */
}

.ai-work-card:hover {
    transform: translateY(-8px); /* 悬停效果 */
}
```

### 修改图片高度

```css
.ai-work-slider {
    height: 280px;  /* 调整此值改变图片区域高度 */
}
```

## 数据追踪

### PostHog 自动追踪事件

1. **ai_work_detail_clicked** - 点击"查看详情"按钮
2. **ai_work_slider_navigated** - 图片轮播导航
3. **ai_work_slider_dot_clicked** - 点击轮播指示点

### GA4 事件

- **ai_work_click** - AI作品点击事件
  - 参数: `work_name`, `work_id`

## 性能优化

### 图片懒加载
```html
<img loading="lazy" crossorigin="anonymous">
```

### 建议
1. 使用CDN托管图片
2. 启用图片压缩
3. 使用WebP格式
4. 设置合适的缓存策略

## 常见问题

### Q: 如何修改作品数量？
A: 直接在 `ai-works.json` 中添加或删除作品对象即可，系统会自动调整布局。

### Q: 支持几张图片？
A: 建议1-5张，太多会影响加载速度和用户体验。

### Q: 如何更新已有作品？
A: 修改 `ai-works.json` 中对应作品的字段，保存后刷新页面即可看到更新。

### Q: 图片加载失败怎么办？
A: 检查图片URL是否正确，确保支持跨域访问（CORS）。建议使用可靠的图片托管服务。

### Q: 如何禁用自动播放？
A: 在 `src/scripts/ai-works.js` 的 `initSliders()` 方法中注释掉 `setInterval` 相关代码。

### Q: 可以添加视频吗？
A: 当前版本仅支持图片，如需视频功能请联系开发人员扩展。

## 最佳实践

1. **图片质量**: 使用高质量图片，但要平衡文件大小
2. **描述长度**: 保持简洁，50-80字为宜
3. **语言一致**: 确保中英文描述对应且准确
4. **测试**: 添加新作品后在不同设备上测试显示效果
5. **更新频率**: 定期更新作品集，保持内容新鲜度

## 技术栈

- **HTML5**: 结构
- **CSS3**: 样式（Tailwind CSS + 自定义）
- **Vanilla JavaScript**: 交互逻辑
- **JSON**: 数据存储
- **Lucide Icons**: 图标库
- **PostHog**: 分析追踪
- **Google Analytics**: 补充追踪

## 未来功能计划

- [ ] 触摸滑动支持
- [ ] 视频展示支持
- [ ] 标签分类过滤
- [ ] 搜索功能
- [ ] 点赞/收藏功能
- [ ] 分享到社交媒体
- [ ] 动态加载（无限滚动）

## 支持

如有问题或建议，请联系开发团队。
