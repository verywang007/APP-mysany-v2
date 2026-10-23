import type { ReactElement } from 'react';
import AccountCancellationPage from '@/pages/AccountCancellation';
import AdsPage from '@/pages/Ads';
import DirectoryPage from '@/pages/Directory';
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/Login';
import MinePage from '@/pages/Mine';
import PolicyConsentPage from '@/pages/PolicyConsent';
import PrivacyUpdatePage from '@/pages/PrivacyUpdate';
import { PATHS } from './paths';

/* =========================================================
   路由表
   ---------------------------------------------------------
   新增页面：在 pages/ 下建目录 → 在 PATHS 加路径 → 在这里登记。
   group / entry 会显示在场景目录里，说明页面在真实 APP 中的位置。
   ========================================================= */

export type RouteGroup = '主流程' | '账号与隐私' | '独立场景';

export interface AppRoute {
  path: string;
  title: string;
  group: RouteGroup;
  /** 在真实 APP 中如何进入该页面 */
  entry: string;
  /** 浏览器地址栏颜色 */
  themeColor: string;
  element: ReactElement;
}

export const ROUTES: AppRoute[] = [
  {
    path: PATHS.login,
    title: '登录',
    group: '主流程',
    entry: 'APP 启动且未登录',
    themeColor: '#ffffff',
    element: <LoginPage />,
  },
  {
    path: PATHS.home,
    title: '首页',
    group: '主流程',
    entry: '登录成功 / 底部 Tab「首页」',
    themeColor: '#E2231A',
    element: <HomePage />,
  },
  {
    path: PATHS.mine,
    title: '我的',
    group: '主流程',
    entry: '底部 Tab「我」',
    themeColor: '#F1F2F4',
    element: <MinePage />,
  },
  {
    path: PATHS.cancellation,
    title: '注销申请',
    group: '账号与隐私',
    entry: '我 → 设置 → 注销申请；首页注销状态提示 → 查看进度',
    themeColor: '#FFFFFF',
    element: <AccountCancellationPage />,
  },
  {
    path: PATHS.privacyUpdate,
    title: '协议更新提示',
    group: '独立场景',
    entry: '无页面入口：APP 启动时检测到协议版本变更后强制弹出',
    themeColor: '#ffffff',
    element: <PrivacyUpdatePage />,
  },
  {
    path: PATHS.policyConsent,
    title: '协议同意（分场景）',
    group: '独立场景',
    entry: '无页面入口：初次使用 / 老用户已登录 / 老用户登录失效时，按同意记录分别处理（?scenario=）',
    themeColor: '#ffffff',
    element: <PolicyConsentPage />,
  },
  {
    path: PATHS.ads,
    title: '个性化广告授权',
    group: '独立场景',
    entry: '无页面入口：APP 首次启动时的系统授权弹窗',
    themeColor: '#C9CCD4',
    element: <AdsPage />,
  },
];

export const DIRECTORY_ROUTE: AppRoute = {
  path: PATHS.directory,
  title: '场景目录',
  group: '主流程',
  entry: '原型入口',
  themeColor: '#E9EAEE',
  element: <DirectoryPage />,
};
