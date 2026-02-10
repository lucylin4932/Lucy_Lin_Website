# Vercel 部署快速修复指南

## 🚨 如果部署显示404错误

### 方法1：最简单的修复（推荐）

1. **删除所有Vercel配置重新开始**
   ```bash
   rm vercel.json .vercelignore
   ```

2. **创建最简单的vercel.json**
   ```bash
   echo '{
     "version": 2,
     "cleanUrls": true,
     "redirects": [
       {
         "source": "/",
         "destination": "/loading.html"
       }
     ]
   }' > vercel.json
   ```

3. **推送到Git**
   ```bash
   git add vercel.json
   git commit -m "fix: simplify vercel config"
   git push
   ```

### 方法2：在Vercel Dashboard中设置

1. 登录 [Vercel Dashboard](https://vercel.com)
2. 选择你的项目
3. 进入 **Settings** → **General**
4. 设置：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (留空)
   - **Output Directory**: `./`
   - **Install Command**: (留空)
5. 点击 **Save**
6. 进入 **Deployments** → 点击最新部署旁的 `...` → **Redeploy**

### 方法3：使用Vercel CLI本地测试

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 本地测试
vercel dev

# 部署
vercel --prod
```

## 📋 检查清单

在重新部署前，确认：

- [x] `index.html` 在项目根目录
- [x] `loading.html` 在项目根目录
- [x] `src/` 目录包含所有CSS/JS文件
- [x] `public/` 目录包含所有图片
- [x] `vercel.json` 配置正确
- [x] Git已推送最新代码

## 🔍 诊断工具

### 检查文件是否可访问

部署后，测试这些URL（替换your-domain）：

```
✅ https://your-domain.vercel.app/
✅ https://your-domain.vercel.app/loading.html
✅ https://your-domain.vercel.app/index.html
✅ https://your-domain.vercel.app/src/styles/main.css
✅ https://your-domain.vercel.app/src/scripts/main.js
```

### 查看构建日志

1. Vercel Dashboard → 项目 → Deployments
2. 点击最新部署
3. 查看 **Build Logs**
4. 检查是否有红色错误信息

## 💡 最可能的原因和解决方案

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 404 Not Found | 路由配置错误 | 简化vercel.json配置 |
| CSS不加载 | MIME类型错误 | Vercel自动处理，无需配置 |
| JS不执行 | 模块类型错误 | 检查script标签type属性 |
| 图片404 | 路径错误 | 使用相对路径 |

## ⚡ 快速测试命令

```bash
# 测试本地文件结构
ls -la
ls -la src/
ls -la public/

# 验证HTML文件存在
cat index.html | head -20
cat loading.html | head -20

# 检查vercel.json
cat vercel.json
```

## 📞 如果仍有问题

1. 复制部署URL
2. 复制错误信息
3. 提供给技术支持

---

**记住**: Vercel最擅长部署静态网站，保持配置简单即可！
