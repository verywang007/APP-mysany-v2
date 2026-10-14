import { CANCEL_STATUSES } from '@/mock/cancellation';
import { statusLabel } from '@/flows/cancellation';
import { PATHS, withQuery } from './paths';

/* =========================================================
   场景目录：同一页面因角色 / 状态不同而出现的分支，逐条列出直达链接。
   新增分支时在这里补一条，评审时打开目录即可逐个查看。
   ========================================================= */

export interface Scenario {
  title: string;
  to: string;
  note?: string;
}

export interface ScenarioGroup {
  title: string;
  desc: string;
  items: Scenario[];
}

const applyStatuses = CANCEL_STATUSES.filter(s => s !== 'NORMAL');

export const SCENARIO_GROUPS: ScenarioGroup[] = [
  {
    title: '登录前 · Cookie 设置',
    desc: '登录页在无有效授权时先弹出 Cookie 授权；必须完成授权后才能登录',
    items: [
      {
        title: '登录页（无授权时自动弹出 Cookie 授权）',
        to: PATHS.login,
        note: '授权完成前账号 / 密码入口锁定',
      },
      {
        title: '已授权 → 首页',
        to: withQuery(PATHS.home, { from: 'login' }),
        note: '若有注销申请，按状态弹出提示',
      },
    ],
  },
  {
    title: '首页 · 重新登录时的注销状态提示',
    desc: '不同注销状态弹出不同提示与按钮（flows/cancellation.ts → homePrompt）',
    items: applyStatuses.map(s => ({ title: statusLabel(s), to: withQuery(PATHS.home, { cancelState: s }) })),
  },
  {
    title: '注销申请 · 新申请',
    desc: '个体户自动审核进入冷静期；含企业 / 代理商租户需人工审核',
    items: [
      { title: '个体户', to: withQuery(PATHS.cancellation, { reset: '1' }) },
      {
        title: '含企业 / 代理商租户',
        to: withQuery(PATHS.cancellation, { reset: '1', tenant: 'enterprise' }),
        note: '需负责人电话 + 验证码 654321',
      },
      {
        title: '账号检查不通过：有关联设备',
        to: withQuery(PATHS.cancellation, { reset: '1', scenario: 'device_admin' }),
      },
      {
        title: '账号检查不通过：账号锁定',
        to: withQuery(PATHS.cancellation, { reset: '1', scenario: 'locked' }),
      },
    ],
  },
  {
    title: '注销申请 · 申请详情',
    desc: '状态卡、进度和底部按钮随状态变化（flows/cancellation.ts → DETAIL_BUTTONS）',
    items: applyStatuses.map(s => ({
      title: statusLabel(s),
      to: withQuery(PATHS.cancellation, { state: s }),
    })),
  },
  {
    title: '我的 · 二级页直达',
    desc: '?view= 直接打开某个二级页',
    items: [
      { title: '设置', to: withQuery(PATHS.mine, { view: 'setting' }) },
      { title: 'Cookie 设置', to: withQuery(PATHS.mine, { view: 'cookies' }) },
      { title: '个人信息', to: withQuery(PATHS.mine, { view: 'profile' }) },
    ],
  },
];
