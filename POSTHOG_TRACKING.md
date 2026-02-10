# PostHog 数据埋点文档

本项目已集成 PostHog 分析系统，通过 Supabase Edge Function 代理实现数据追踪。

## 架构说明

### 数据流
```
前端页面 → Supabase Edge Function (posthog-track) → PostHog API
```

### 组件
1. **Edge Function**: `supabase/functions/posthog-track/index.ts`
   - 代理 PostHog API 调用
   - 安全存储 API Key
   - 处理 CORS

2. **前端追踪库**: `src/scripts/posthog.js`
   - 封装事件追踪逻辑
   - 自动追踪通用事件
   - 提供手动追踪接口

3. **Supabase Client**: `src/integrations/supabase/client.js`
   - 连接 Supabase
   - 调用 Edge Function

## 自动追踪的事件

### 1. 页面浏览 (`$pageview`)
- 每次页面加载自动触发
- 包含页面标题、URL、语言等信息

### 2. 链接点击 (`link_clicked`)
- 追踪所有 `<a>` 标签点击
- 属性：
  - `link_text`: 链接文本
  - `link_href`: 链接地址
  - `link_type`: 链接类型（内部锚点/外部/内部页面）

### 3. 按钮点击 (`button_clicked`)
- 追踪所有 `<button>` 标签点击
- 属性：
  - `button_text`: 按钮文本
  - `button_id`: 按钮 ID

### 4. 滚动深度 (`scroll_depth`)
- 追踪页面滚动深度（25%、50%、75%、90%、100%）
- 属性：
  - `depth_percentage`: 滚动深度百分比
  - `page_title`: 页面标题

### 5. 页面停留时间 (`time_on_page`)
- 用户离开页面时触发
- 属性：
  - `duration_seconds`: 停留时间（秒）
  - `max_scroll_depth`: 最大滚动深度

### 6. 语言切换 (`language_changed`)
- 用户切换语言时触发
- 属性：
  - `new_language`: 新语言（zh/en）

## 页面特定事件

### 7. 项目卡片点击 (`project_card_clicked`)
- 点击项目卡片时触发
- 属性：
  - `project_index`: 项目索引
  - `project_url`: 项目URL

### 8. 经历卡片展开/折叠 (`experience_card_toggled`)
- 展开或折叠教育/工作经历卡片
- 属性：
  - `card_id`: 卡片 ID
  - `action`: 操作（expanded/collapsed）

### 9. 子经历展开/折叠 (`sub_experience_toggled`)
- 展开或折叠工作经历的子项目
- 属性：
  - `title`: 子项目标题
  - `action`: 操作（expanded/collapsed）

### 10. 技能卡片轮播 (`skill_carousel_navigated`)
- 浏览技能卡片轮播
- 属性：
  - `direction`: 方向（next/previous）
  - `current_skill`: 当前技能分类
  - `skill_index`: 技能索引

### 11. 项目轮播 (`project_carousel_navigated`)
- 浏览项目卡片轮播
- 属性：
  - `direction`: 方向（next/previous）
  - `project_index`: 项目索引

## 手动追踪事件

### 基本用法
```javascript
// 追踪自定义事件
window.posthog.capture('event_name', {
  property1: 'value1',
  property2: 'value2'
});
```

### 用户识别
```javascript
// 当用户登录时识别用户
window.posthog.identify('user_id', {
  email: 'user@example.com',
  name: 'User Name',
  // 其他用户属性
});
```

### 示例：追踪表单提交
```javascript
document.querySelector('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  window.posthog.capture('contact_form_submitted', {
    form_id: 'contact-form',
    fields: ['name', 'email', 'message']
  });
  
  // 提交表单逻辑...
});
```

### 示例：追踪视频播放
```javascript
document.querySelector('#video-player').addEventListener('play', () => {
  window.posthog.capture('video_played', {
    video_title: 'Introduction Video',
    video_duration: 120
  });
});
```

## 自动收集的属性

每个事件都会自动包含以下属性：
- `session_id`: 会话 ID
- `$current_url`: 当前页面 URL
- `$pathname`: 路径名
- `$host`: 主机名
- `$referrer`: 来源页面
- `$screen_width`: 屏幕宽度
- `$screen_height`: 屏幕高度
- `$viewport_width`: 视口宽度
- `$viewport_height`: 视口高度
- `language`: 浏览器语言
- `user_agent`: 用户代理
- `timestamp`: 时间戳

## 用户识别

### Distinct ID
- 系统自动为每个用户生成唯一 ID
- 存储在 `localStorage` 中（`posthog_distinct_id`）
- 用于跨会话追踪同一用户

### Session ID
- 每次浏览器会话生成新的 Session ID
- 存储在 `sessionStorage` 中（`posthog_session_id`）
- 用于区分不同的访问会话

## PostHog Dashboard 查看数据

登录 PostHog Dashboard: https://us.i.posthog.com

### 常用查询示例

1. **查看页面浏览量**
   - Event: `$pageview`
   - Group by: `page_title`

2. **查看最受欢迎的链接**
   - Event: `link_clicked`
   - Group by: `link_text`

3. **查看用户留存率**
   - Event: `time_on_page`
   - Aggregate: Average of `duration_seconds`

4. **查看滚动深度分布**
   - Event: `scroll_depth`
   - Group by: `depth_percentage`

5. **查看语言偏好**
   - Event: `language_changed`
   - Group by: `new_language`

## 隐私说明

- 不收集任何个人身份信息（PII）
- 使用匿名 ID 追踪用户
- 用户可以通过清除浏览器数据删除追踪信息
- 符合 GDPR 和其他隐私法规

## 配置

### 更新 PostHog API Key
如需更新 PostHog API Key，使用 Supabase Secrets：
```bash
# 在 Supabase Dashboard 的 Edge Functions Secrets 中更新
# Name: VITE_PUBLIC_POSTHOG_KEY
# Value: your_new_posthog_api_key
```

### 更新 PostHog Host
如需更改 PostHog Host（如切换到自托管实例），修改 Edge Function：
```typescript
// supabase/functions/posthog-track/index.ts
const posthogHost = 'https://your-posthog-host.com'
```

## 故障排查

### 事件未显示在 PostHog
1. 检查浏览器控制台是否有错误
2. 确认 Supabase Edge Function 正常运行
3. 验证 PostHog API Key 是否正确配置
4. 检查网络请求是否成功（Network 标签）

### 本地调试
```javascript
// 在浏览器控制台手动触发事件
window.posthog.capture('test_event', { test: true });

// 查看 distinct ID
console.log(window.posthog.distinctId);

// 查看 session ID
console.log(window.posthog.sessionId);
```

## 开发建议

1. **命名规范**：使用小写和下划线命名事件（如 `button_clicked`）
2. **属性一致性**：相同类型的事件使用相同的属性名
3. **避免过度追踪**：只追踪有意义的用户行为
4. **保护隐私**：不追踪敏感信息（密码、信用卡等）
5. **测试追踪**：在 PostHog Dashboard 开启测试模式验证事件

## 联系支持

如有问题或需要帮助，请联系技术支持。
