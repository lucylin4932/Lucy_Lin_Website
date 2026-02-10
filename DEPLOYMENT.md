# Vercel 部署指南

## 问题诊断

如果Vercel部署失败显示404错误，请按以下步骤检查：

### 1. 检查vercel.json配置

确保 `vercel.json` 文件存在且配置正确：

```json
{
  "version": 2,
  "cleanUrls": true,
  "trailingSlash": false,
  "routes": [...]
}
```

### 2. 确认项目根目录

Vercel部署设置中，确保：
- **Framework Preset**: Other
- **Root Directory**: `./`（项目根目录）
- **Build Command**: 留空或设置为 `echo 'Static site'`
- **Output Directory**: 留空或设置为 `./`

### 3. 检查文件结构

确保以下文件在项目根目录：
- ✅ `index.html`
- ✅ `loading.html`
- ✅ `vercel.json`
- ✅ `src/` 目录
- ✅ `public/` 目录

### 4. 部署设置

#### Vercel项目设置

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **General**
4. 确认设置：

```
Framework Preset: Other
Root Directory: ./
Build Command: (留空)
Output Directory: ./
Install Command: (留空)
```

#### 环境变量

如果使用了环境变量，在 **Settings** → **Environment Variables** 中添加：

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
```

### 5. 强制重新部署

如果修改了配置文件，需要强制重新部署：

```bash
# 方法1: 通过Git推送
git add .
git commit -m "fix: update vercel config"
git push

# 方法2: Vercel CLI
vercel --prod --force
```

### 6. 查看部署日志

1. 进入Vercel项目页面
2. 点击最新的部署
3. 查看 **Build Logs** 和 **Function Logs**
4. 检查是否有错误信息

## 常见问题

### Q1: 404 Not Found

**原因**: Vercel无法找到index.html或路由配置错误

**解决方案**:
1. 确保 `vercel.json` 存在且格式正确
2. 检查 `index.html` 和 `loading.html` 在项目根目录
3. 重新部署项目

### Q2: CSS/JS文件加载失败

**原因**: 静态资源路径不正确或MIME类型错误

**解决方案**:
1. 检查 `vercel.json` 中的headers配置
2. 确保src路径正确（相对路径）
3. 验证Content-Type设置

### Q3: 环境变量未生效

**原因**: 环境变量未正确配置

**解决方案**:
1. 在Vercel Dashboard中设置环境变量
2. 重新部署项目
3. 检查变量名称是否正确

## 推荐配置

### vercel.json

```json
{
  "version": 2,
  "cleanUrls": true,
  "trailingSlash": false,
  "routes": [
    {
      "src": "^/$",
      "dest": "/loading.html"
    },
    {
      "src": "^/index(?:\\.html)?$",
      "dest": "/index.html"
    },
    {
      "src": "^/src/(.*)$",
      "dest": "/src/$1"
    },
    {
      "src": "^/public/(.*)$",
      "dest": "/public/$1"
    }
  ]
}
```

### .vercelignore

```
node_modules
.git
.env
*.log
.DS_Store
```

## 验证部署

部署成功后，访问以下URL验证：

1. **主页**: `https://your-domain.vercel.app/`（应重定向到loading.html）
2. **Loading页**: `https://your-domain.vercel.app/loading.html`
3. **Index页**: `https://your-domain.vercel.app/index.html`
4. **CSS文件**: `https://your-domain.vercel.app/src/styles/main.css`
5. **JS文件**: `https://your-domain.vercel.app/src/scripts/main.js`

## 性能优化

### 1. 启用Vercel Analytics

在项目设置中启用Analytics以监控性能。

### 2. 配置缓存

在 `vercel.json` 中添加缓存策略：

```json
{
  "headers": [
    {
      "source": "/src/**/*.css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. 优化图片

使用Vercel的图片优化功能，或使用CDN（如Unsplash）。

## 获取帮助

如果问题仍未解决：

1. 查看 [Vercel官方文档](https://vercel.com/docs)
2. 检查 [Vercel状态页面](https://vercel-status.com)
3. 联系Vercel支持团队

---

**最后更新**: 2026-02-10
