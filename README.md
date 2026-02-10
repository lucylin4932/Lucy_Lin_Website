# Lucy Lin's Personal Portfolio Website

林宇欣的个人作品集网站

## 📋 项目说明

这是一个基于纯HTML、CSS和JavaScript构建的个人作品集网站，展示教育背景、工作经历、项目经验、技能工具和AI作品集。

## 🚀 技术栈

- **前端**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **后端**: Supabase (Edge Functions, Database)
- **图标**: Lucide Icons
- **字体**: Google Fonts (Noto Sans SC, Playfair Display, Noto Serif SC)
- **分析**: Google Analytics (GA4), PostHog

## 📂 项目结构

```
.
├── index.html              # 主页面
├── loading.html            # 加载页面
├── vercel.json            # Vercel部署配置
├── public/
│   └── images/            # 图片资源
├── src/
│   ├── data/             # JSON数据文件
│   ├── scripts/          # JavaScript文件
│   ├── styles/           # CSS样式
│   └── integrations/     # 第三方集成
└── supabase/             # Supabase配置

## 🌐 部署

### Vercel部署

1. 导入GitHub仓库到Vercel
2. Vercel会自动检测并部署静态网站
3. 配置文件：`vercel.json` 已包含所有必要配置

### 其他平台

项目是纯静态网站，可以部署到任何静态托管平台：
- Netlify
- GitHub Pages
- Cloudflare Pages
- Render
等

## 📄 主要功能

### 1. 多语言支持
- 中文/英文切换
- 所有内容支持双语显示

### 2. AI作品集
- 2x2网格布局展示AI项目
- 响应式设计（移动端单列）
- GA4和PostHog数据追踪

### 3. 数据追踪
- **Google Analytics (GA4)**
  - 页面浏览追踪
  - 事件追踪（链接点击、按钮点击等）
- **PostHog**
  - 用户行为分析
  - 会话追踪
  - 自定义事件

### 4. 后端集成
- **Supabase Edge Functions**
  - PostHog数据代理
  - 安全的API密钥管理

### 5. 响应式设计
- 桌面端优化
- 平板适配
- 移动端友好

## 🔧 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd <project-folder>
```

2. 启动本地服务器
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve
```

3. 在浏览器打开
```
http://localhost:8000/loading.html
```

## 📝 配置说明

### Google Analytics
在 `index.html` 和 `loading.html` 的 `<head>` 部分配置：
```javascript
gtag('config', 'YOUR-GA4-ID');
```

### PostHog
通过Supabase Edge Function代理，API密钥存储在Supabase Secrets中。

### Supabase
配置文件：`supabase/config.toml`

## 📊 性能优化

- 图片懒加载
- CSS/JS压缩
- 浏览器缓存策略
- CDN加速（Unsplash图片）

## 🔒 安全性

- Content Security Policy
- XSS防护
- CSRF防护
- API密钥加密存储

## 📞 联系方式

- **邮箱**: yuxin4932@163.com
- **电话**: +86 13328581768
- **LinkedIn**: [lucy-yuxin-lin](https://www.linkedin.com/in/lucy-yuxin-lin/)

## 📄 许可证

MIT License

---

**作者**: 林宇欣 (Lucy Lin)  
**最后更新**: 2026-02-10
