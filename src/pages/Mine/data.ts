import type { CookieCategory, CookieChoices } from '@/mock/cookieConsent';

/* =========================================================
   「我的」页：类型与静态数据
   ========================================================= */

export interface Account {
  id: string;
  name: string;
  tag: string;
  note: string;
}

export interface Profile {
  /** 是否已设置头像 */
  avatar: boolean;
  country: string;
  role: string;
  phone: string;
  email: string;
}

export interface Settings {
  lang: string;
  push: boolean;
  ads: boolean;
  force: boolean;
  cookies: CookieChoices;
}

export interface WeekDay {
  d: string;
  n: number;
  on?: boolean;
  today?: boolean;
  /** 领取时的弹跳动画 */
  pop?: boolean;
}

/** 系统弹窗：权限授权 / 二次确认 */
export interface DialogSpec {
  t: string;
  m: string;
  cancel?: string;
  ok: string;
  onOk?: () => void;
  onCancel?: () => void;
  /** 系统权限样式（带应用图标、左对齐） */
  perm?: boolean;
  /** 相机取景黑底 */
  dark?: boolean;
  icon?: 'cam' | 'photo';
}

export type SheetKey = 'account' | 'service' | 'lang' | 'star' | 'avatar' | 'nickname' | 'role';

/* ── 二级页 ─────────────────────────────────────────── */

export type ViewKind =
  | 'setting'
  | 'cookies'
  | 'cookie-detail'
  | 'help'
  | 'privacy'
  | 'terms'
  | 'profile'
  | 'bind'
  | 'warn'
  | 'report'
  | 'mall'
  | 'addr'
  | 'feedback'
  | 'self'
  | 'empty';

export interface SubView {
  k: ViewKind;
  /** 标题 */
  t: string;
  /** 标题栏右侧文字 */
  right?: string;
  /** 空状态文案 */
  empty?: string;
  sub?: string;
  /** 标题左对齐（设置类页面） */
  left?: boolean;
  /** 白底 */
  white?: boolean;
  category?: CookieCategory;
}

export const SUBS = {
  bind: { k: 'bind', t: '绑定设备' },
  warn: { k: 'warn', t: '设备预警', right: '3 条' },
  report: { k: 'report', t: '机群报表' },
  maint: { k: 'empty', t: '待保养设备', empty: '暂无待保养设备', sub: '保养到期前 7 天会自动提醒' },
  ticket: { k: 'empty', t: '服务工单', empty: '暂无服务工单', sub: '设备故障可在此发起报修' },
  inquiry: { k: 'empty', t: '主机询价', empty: '暂无询价单', sub: '可在「设备」页选型后发起询价' },
  delivery: { k: 'empty', t: '主机交付', empty: '暂无交付单', sub: '订单发货后可在此查看物流' },
  parts: { k: 'empty', t: '配件交付', empty: '暂无配件订单', sub: '配件订单发货后自动同步' },
  profile: { k: 'profile', t: '个人信息', left: true, white: true },
  setting: { k: 'setting', t: '设置', left: true, white: true },
  cookies: { k: 'cookies', t: 'Cookie 设置', left: true, white: true },
  cookieNecessary: {
    k: 'cookie-detail',
    category: 'necessary',
    t: '严格必要 Cookie',
    left: true,
    white: true,
  },
  cookieFunctional: {
    k: 'cookie-detail',
    category: 'functional',
    t: '功能体验 Cookie',
    left: true,
    white: true,
  },
  cookieAnalytics: {
    k: 'cookie-detail',
    category: 'analytics',
    t: '分析统计 Cookie',
    left: true,
    white: true,
  },
  cookieMarketing: {
    k: 'cookie-detail',
    category: 'marketing',
    t: '广告营销 Cookie',
    left: true,
    white: true,
  },
  help: { k: 'help', t: '使用帮助' },
  privacy: { k: 'privacy', t: '隐私协议' },
  terms: { k: 'terms', t: '用户服务协议' },
  mall: { k: 'mall', t: '积分商城' },
  self: { k: 'self', t: '自助服务' },
  fav: { k: 'empty', t: '收藏中心', empty: '还没有收藏内容', sub: '长按机型或资讯即可收藏' },
  feedback: { k: 'feedback', t: 'APP反馈' },
  addr: { k: 'addr', t: '地址管理' },
} satisfies Record<string, SubView>;

export type SubKey = keyof typeof SUBS;

export function isSubKey(k: string | null): k is SubKey {
  return !!k && k in SUBS;
}

/* ── 静态数据 ───────────────────────────────────────── */

export const ACCOUNTS: Account[] = [
  { id: 'a1', name: '旺是旺旺的旺', tag: '个体户', note: '138****6621 · 默认身份' },
  { id: 'a2', name: '三一重工股份有限公司', tag: '企业', note: '统一信用代码 91430***XA' },
  { id: 'a3', name: '长沙旺旺工程机械租赁', tag: '车队', note: '在管设备 12 台' },
];

export const PROFILE_INIT: Profile = {
  avatar: false,
  country: '中国',
  role: '设备操作手',
  phone: '133****2180',
  email: '8*********@qq.com',
};

export const WEEK_INIT: WeekDay[] = [
  { d: '9.16', n: 3, on: true },
  { d: '9.17', n: 5, on: true },
  { d: '9.18', n: 0 },
  { d: '9.19', n: 0 },
  { d: '9.20', n: 0 },
  { d: '9.21', n: 0 },
  { d: '今天', n: 0, today: true },
];

export const ROLES = ['设备操作手', '机主', '车队管理员', '服务工程师'];
export const LANGS = ['跟随系统', '简体中文', 'English', 'Bahasa Indonesia'];

export const WARNINGS = [
  {
    t: 'SY215C · 液压油温偏高',
    d: '当前 96℃，持续 12 分钟 · 长沙星沙工地',
    lv: '严重',
    c: '#E2231A',
    bg: '#FFECEC',
  },
  { t: 'SY75C · 保养里程临近', d: '距下次保养剩余 38 小时', lv: '提醒', c: '#EE9B14', bg: '#FFF4E2' },
  {
    t: 'SY335H · 离线超过 24 小时',
    d: '最后上报 9.21 08:12 · 岳阳临港',
    lv: '一般',
    c: '#3B82E8',
    bg: '#EAF2FF',
  },
];

export const FLEET = [
  { n: 'SY215C-10', v: 86, c: '#FF7A18' },
  { n: 'SY75C', v: 64, c: '#FF9A21' },
  { n: 'SY335H', v: 41, c: '#3B82E8' },
  { n: 'SY485H', v: 18, c: '#C6C9D0' },
];

/** 可用积分 */
export const POINTS = 2860;

export const GOODS = [
  { n: '原厂机油滤芯', p: 1200 },
  { n: '定制工装外套', p: 3800 },
  { n: '保养代金券 ¥200', p: 5000 },
  { n: '三一模型车', p: 9800 },
];

export const ADDRS = [
  { n: '王师傅', p: '138****6621', a: '湖南省长沙市长沙县星沙街道三一工业城 1 号门', def: true },
  { n: '李工', p: '150****0987', a: '湖南省岳阳市云溪区临港新区工地临时仓库' },
];

export const FAQS: [string, string][] = [
  [
    '如何绑定我的设备？',
    '「我的 — 绑定设备」输入设备出厂编号或扫描铭牌二维码，提交后由机主确认，通常 10 分钟内生效。',
  ],
  [
    '为什么看不到设备工况？',
    '请确认设备已安装智能终端且处于在线状态。离线超过 24 小时会在「设备预警」中提示。',
  ],
  [
    '星星和积分有什么区别？',
    '星星来自每日签到与任务，可按比例折算为积分；积分用于「积分商城」兑换配件与代金券。',
  ],
  ['如何申请保养或报修？', '「自助服务 — 保养预约 / 服务工单」提交需求，工程师将在 2 小时内响应。'],
];

/** 印尼盾千分位：12000 → 12.000 */
export const fmtRp = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
