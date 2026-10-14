# MySANY APP 原型 · Claude 工作指南

产品经理的**交互原型**，不是生产代码。Vite + React 18 + TS + Hash 路由，设备尺寸 414×896。
目标：改得准、改得少。能直接定位到文件就不要全局搜索，不要通读整个项目。

## 工作原则（省 token）

- **按下方索引直接打开目标文件**；只在索引找不到时才搜索，用 `grep` 定位行号后按段读取，不整份读大文件（>300 行的 CSS / TSX 尤其如此）。
- **只改需求涉及的那一处**：不顺手重构、不重排格式、不改无关样式和文案，不跑 `npm run format`。
- **默认不同步 README / docs**；只有用户明确要求才改。新增页面时需要登记路由（见下方步骤），场景目录按用户要求决定。
- 改完跑一次 `npm run build`（含类型检查）确认能编译即可；视觉效果由用户在浏览器里验收。
- 需求有歧义时，先用一句话确认，不要猜测后大范围改动。

## 页面索引

| 页面 | 路由 | 主要文件 | 说明 |
|---|---|---|---|
| 场景目录 | `#/` | `pages/Directory/index.tsx` | 列出路由表 + `router/scenarios.ts` 中的分支直达链接 |
| 登录 | `#/login` | `pages/Login/Login.tsx`（531 行）、`Login.css`（648 行） | 入口 `index.tsx`：无 Cookie 授权时 `Login locked` + 弹出 `CookieSheet`；国家选择 `CountrySheet.tsx`；图标 `icons.tsx` |
| 首页 | `#/home` | `pages/Home/HomeScreen.tsx`（399 行）、`Home.css`（1133 行） | 入口 `index.tsx`（`?from=login`、`?cancelState=`）；应用宫格 `AppGrid.tsx`；图表数据 `data.ts`；注销状态弹窗 `CancelLoginPrompt.tsx` |
| 我的 | `#/mine?view=` | `pages/Mine/Mine.tsx`（视图栈）、`MineHome.tsx`（主页） | 二级页分发 `SubPage.tsx`；视图在 `views/`：`SettingsView`（设置）、`CookieViews`（Cookie 设置）、`ProfileView`（个人信息）、`ServiceViews`（帮助 / FAQ 等）；静态数据 `data.ts`；共享状态 `MineContext.tsx`；样式全部在 `styles/kit.css` |
| 注销申请 | `#/account-cancellation` | `pages/AccountCancellation/AccountCancellation.tsx`（步骤编排） | 各步骤在 `screens/`：`NoticeScreen` 须知 → `CheckScreens` 检查 → `VerifyScreen` 验证 → `ConfirmScreen` 确认 → `ResultScreens` 结果 / 详情；弹层 `sheets.tsx`；演示参数 `index.tsx`（`?reset=1`、`?state=`、`?tenant=`、`?scenario=`） |
| 协议更新提示 | `#/privacy-update` | `pages/PrivacyUpdate/index.tsx`（340 行） | 背景 `FakeHome.tsx`；独立场景 |
| 个性化广告授权 | `#/ads` | `pages/Ads/index.tsx` | 背景 `Skyline.tsx`；独立场景 |

## 跨页面共用

| 内容 | 文件 | 被谁用 |
|---|---|---|
| Cookie 授权弹层（登录前） | `components/CookieSheet/CookieSheet.tsx` + `.css` | 登录页 |
| Cookie 授权记录（读写 / 摘要文案） | `mock/cookieConsent.ts` | 登录页、我的 - Cookie 设置 |
| Cookie 目录（各类 Cookie 明细） | `data/cookieCatalog.ts` | CookieSheet、我的 - Cookie 设置 |
| 注销状态 → 界面 / 按钮 / 首页弹窗规则 | `flows/cancellation.ts`（377 行） | 注销申请、首页、设置页 |
| 注销申请记录 | `mock/cancellation.ts` | 同上 |
| 登录成功后去向 | `flows/login.ts` | 登录页 |
| 协议版本 | `mock/policy.ts` | 协议更新提示 |
| 协议 / 政策正文 | `data/legal.ts` | 登录页、协议更新提示 |
| 国家区号 | `data/countries.ts` | 登录页 |
| localStorage 键名 | `services/storage.ts` → `STORAGE_KEYS` | 所有读写本地记录的地方 |
| 设备外框 + Toast | `components/DeviceFrame`、`components/Toast`（`useToast()`） | 所有页面 |
| 底部弹层 / 状态栏 / 演示控制条 | `components/BottomSheet`、`StatusBar`、`DemoBar` | 多页 |
| iOS 组件库样式（列表、卡片、开关、系统弹窗） | `styles/kit.css`（1888 行，用 grep 定位） | 我的、注销申请、广告授权 |
| 设计变量（颜色、尺寸） | `styles/tokens.css` | 全局 |

路由：`router/paths.ts`（路径常量）→ `router/routes.tsx`（标题、分组、入口说明）→ `router/scenarios.ts`（场景目录直达链接）。

## 常见改动对应的文件

- **改某页文案 / 交互**：只动页面索引里对应的 `.tsx`。
- **改某页样式**：页面 `.css`（整份包在 `:where(.pg-xxx)` 里）；我的、注销、广告授权页先看 `styles/kit.css`。
- **改“什么状态显示什么、点了去哪”**：`flows/` 下的规则或配置表（如 `STATUS_META`、`DETAIL_BUTTONS`、`homePrompt()`）。
- **改 Cookie 分类或明细**：`data/cookieCatalog.ts`；分类卡片文案在 `CookieSheet.tsx` 和 `Mine/views/CookieViews.tsx` 各有一份，改文案时两处都要改。
- **加演示切换项**：页面 `index.tsx` 里的 `<DemoBar>`。

## 新增页面

1. 新建 `src/pages/NewPage/index.tsx`（默认导出，外层 `<DeviceFrame className="pg-new">`）和 `NewPage.css`（包在 `:where(.pg-new) { … }` 里）。
2. `router/paths.ts` 的 `PATHS` 加路径。
3. `router/routes.tsx` 登记标题、分组、入口说明、地址栏颜色。

## 代码约定（只列容易踩的）

- 跳转用 `useNavigate()` + `PATHS`，不手写路径字符串；提示用 `useToast()`。
- localStorage 只通过 `services/storage.ts`，新键名登记在 `STORAGE_KEYS`。
- 新样式用 `tokens.css` 变量；`@keyframes` 写在作用域块外面。
- 函数组件 + TypeScript，不用 `any`。

## 给用户的提需求模板（用户问起时可提供）

```
页面：#/login
位置：底部协议勾选区
现状：……
改为：……
参考：（可选）样式参考 #/xxx 的某弹窗
范围：只改这一处，不动样式，不更新 README
```

提需求的小技巧：用路由路径指明页面；写明“不要动什么”；有参考就直接点名；多件事放在同一条消息里分条列出；不需要同步文档时直接说明。
