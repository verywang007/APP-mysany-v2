# MySANY APP 原型

由原 `APP-mysany`（7 个独立 HTML）整改而来的前端工程。界面与交互保持不变，统一为 **Vite + React 18 + TypeScript + React Router** 单页应用。

## 常用命令

```bash
npm install        # 首次安装依赖
npm run dev        # 本地开发（热更新），打开终端里提示的地址
npm run build      # 类型检查 + 打包到 dist/
npm run preview    # 本地预览打包结果
npm run lint       # ESLint 检查
npm run format     # Prettier 统一格式
```

> 打包产物需要通过 http 服务访问（`npm run preview` 或任意静态服务器），不能直接双击 `dist/index.html`。

打开后首页是**场景目录**，列出所有页面和分支场景，点击直达。

## 页面与路由

使用 Hash 路由（`#/xxx`），放在任意子目录下都不会 404。

| 页面 | 路径 | 原文件 |
|---|---|---|
| 场景目录 | `#/` | 新增 |
| 登录 | `#/login` | index.html |
| 首页 | `#/home` | home.html |
| 我的 | `#/mine?view=setting` | mine.html |
| 注销申请 | `#/account-cancellation` | account-cancellation.html |
| Cookie 授权 | `#/cookie-consent?flow=login` | cookie-consent.html |
| 协议更新提示 | `#/privacy-update` | privacy-update.html |
| 个性化广告授权 | `#/ads` | ads.html |

原来各页面支持的 URL 参数（`?view=`、`?state=`、`?tenant=`、`?scenario=`、`?reset=1`、`?cancelState=`、`?from=login`、`?flow=login`、`?panel=preferences`）全部保留。

## 目录结构

```
src/
├── main.tsx / App.tsx        入口；App 负责路由、页面标题
├── router/
│   ├── paths.ts              所有页面路径常量 + withQuery()
│   ├── routes.tsx            路由表（标题、分组、真实 APP 中的入口说明）
│   └── scenarios.ts          场景目录里的分支场景清单
├── pages/<Page>/             每个页面一个目录
│   ├── index.tsx             页面入口：DeviceFrame + 演示控制条
│   ├── <Page>.tsx            页面主体
│   ├── <Page>.css            页面样式（作用域隔离，见下）
│   └── icons.tsx / data.ts / screens/ / views/ …   页面私有的拆分文件
├── components/               跨页面公共组件
│   ├── DeviceFrame           舞台 + 414×896 设备外框（自带 Toast）
│   ├── StatusBar             iOS 状态栏（信号 / Wi-Fi / 电池 / 实时时钟）
│   ├── Toast                 轻提示：页面里 useToast()
│   ├── BottomSheet           底部弹层（带进出场过渡）
│   ├── DemoBar               设备下方的原型演示控制条
│   ├── LegalDocBody          协议正文渲染
│   └── icons.tsx             通用图标
├── hooks/                    useClock / usePresence / useRetrigger / useResendTimer
├── flows/                    分支规则：登录后去向、注销状态 → 界面
├── mock/                     本地数据：Cookie 授权、注销申请、协议版本
├── services/storage.ts       localStorage 键名与读写（唯一入口）
├── data/                     静态数据：协议文本、Cookie 目录、国家区号
└── styles/
    ├── tokens.css            设计变量（颜色、尺寸、动效）
    ├── global.css            重置 + 设备外框 + 真机全屏
    └── kit.css               iOS 风格组件库（卡片、列表、二级页、系统弹窗），原 mine.css
docs/                         需求方案文档
```

## 开发规范

### 命名
- 组件、页面目录用大驼峰：`StatusBar.tsx`、`pages/AccountCancellation/`
- hooks 以 `use` 开头；常量全大写下划线：`COOKIE_DEFAULTS`
- 页面作用域类名：`pg-` + 页面短名，如 `pg-login`、`pg-cancel`

### 样式
- **页面样式**写在 `pages/<Page>/<Page>.css`，整份包在 `:where(.pg-xxx) { … }` 里：只在本页生效，且不增加选择器优先级。
- **公共组件**用 CSS Modules（`X.module.css`），类名自动隔离。
- 使用组件库的页面，在 `DeviceFrame` 上加 `kit` 类：`<DeviceFrame className="pg-mine kit">`。
- 新写的样式统一用 `tokens.css` 里的变量，不要直接写色值。从原文件迁移过来的样式暂时保留了原有色值。
- `@keyframes` 写在作用域块外面。

### 组件
- 只用函数组件 + TypeScript 类型，不用 `any`。
- 单个文件超过约 300 行就拆分：页面私有的放在页面目录（`screens/`、`views/`），被多个页面用到的放到 `components/`。
- 页面根组件用 `DeviceFrame` 包裹，提示一律用 `useToast()`。

### 跳转与数据
- 跳转用 `useNavigate()` 加 `PATHS` 常量，不写 `location.href`，也不手写路径字符串。
- localStorage 只通过 `services/storage.ts` 读写，新的键名统一登记在 `STORAGE_KEYS`。
- 业务数据的读写放在 `mock/`；“什么状态显示什么、点了去哪里”这类规则放在 `flows/`。

## 分支场景怎么处理

**1. 与其他页面没有关联的页面**（如协议更新提示、个性化广告授权）
照常注册路由，在 `routes.tsx` 里设 `group: '独立场景'`，并在 `entry` 写明真实 APP 中由什么事件触发。场景目录会自动列出这些页面。

**2. 同一按钮因角色 / 状态不同进入不同结果**
- 判断写在 `flows/`，页面只调用：
  - `nextAfterLogin()`：有 Cookie 授权就去首页，否则先去 Cookie 授权
  - `entryScreen(record)`：未申请时显示须知，已有申请时显示详情
  - `statusAfterSubmit(tenant)`：个体户提交后进入冷静期，企业租户进入待审核
- 同一页面内按状态展示不同内容时，用**配置表**，例如 `STATUS_META`、`DETAIL_BUTTONS`、`homePrompt()`。新增状态时如果漏配，TypeScript 会直接报错。
- 演示时用三种方式切换：
  1. 设备下方的演示控制条（下拉选择状态、租户等）
  2. URL 参数
  3. 场景目录里的直达链接（`router/scenarios.ts`）

**新增一个分支**：先在 `flows/` 写规则或配置，再到 `scenarios.ts` 加一条直达链接；需要现场切换的，在页面 `index.tsx` 的 `DemoBar` 里加一个选项。

## 新增页面步骤

1. 新建 `src/pages/NewPage/`，包含 `index.tsx`（默认导出，外层用 `DeviceFrame className="pg-new"`）和 `NewPage.css`（内容包在 `:where(.pg-new) { … }` 里）。
2. 在 `router/paths.ts` 的 `PATHS` 里加路径。
3. 在 `router/routes.tsx` 里登记标题、分组、入口说明、地址栏颜色。

## 与原版的差异

- 页面视觉：桌面和手机两种尺寸下，34 个页面状态与原版逐像素对比，结果一致。只有登录页的“国家 / 地区”和“协议全文”弹层不同：原版内容过长时，弹层顶部的拖拽条和标题栏会被压缩，现已修正。
- 底部弹层统一为进出场都有过渡动画。原「我的」「注销申请」页的弹层关闭时没有动画。
- Cookie 目录合并为一份（`data/cookieCatalog.ts`）。原来两处有两条用途说明的措辞不一致，统一采用「我的 - Cookie 设置」中更完整的版本。
- Cookie 授权页的背景原来用 iframe 嵌入首页，现在直接渲染首页组件。
- 新增场景目录页；每个页面左上角新增「场景目录」返回入口；注销申请页和首页新增演示控制条。这些在真机全屏时会自动隐藏。
