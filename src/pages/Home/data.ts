/* 首页静态数据（按真机截图还原） */

const O = '#EF7C22';
const A = '#F7A64B';

/** 应用宫格图标（32 栅格 SVG 内容，静态常量） */
export const APP_ICONS = {
  call: `<path d="M4 25h24" stroke="${A}" stroke-width="2" stroke-linecap="round"/><rect x="6" y="14" width="5" height="8" rx="1" fill="${A}"/><rect x="13" y="8" width="5" height="14" rx="1" fill="${O}"/><rect x="20" y="17" width="5" height="5" rx="1" fill="${A}"/>`,
  part: `<rect x="6" y="4" width="15" height="21" rx="2.4" fill="none" stroke="${A}" stroke-width="2"/><path d="M10 10h7M10 14h7M10 18h4" stroke="${A}" stroke-width="2" stroke-linecap="round"/><path d="M21.6 16.8a3.4 3.4 0 014.6 4.4l2.4 2.4-2 2-2.4-2.4a3.4 3.4 0 01-4.4-4.6l1.8 1.8 1.6-1.6z" fill="${O}"/>`,
  care: `<rect x="4" y="6" width="19" height="19" rx="2.4" fill="none" stroke="${A}" stroke-width="2"/><path d="M4 11h19" stroke="${A}" stroke-width="2"/><path d="M9 3.5v4M18 3.5v4" stroke="${O}" stroke-width="2" stroke-linecap="round"/><path d="M19 16h8v10l-4-2.4L19 26z" fill="${O}"/>`,
  prod: `<circle cx="9.5" cy="9.5" r="4.6" fill="none" stroke="${A}" stroke-width="2"/><rect x="17" y="5" width="9.5" height="9.5" rx="1.6" fill="none" stroke="${A}" stroke-width="2"/><circle cx="9.5" cy="22.5" r="4.6" fill="none" stroke="${A}" stroke-width="2"/><rect x="21.3" y="15.8" width="2.4" height="3" fill="${O}"/><rect x="21.3" y="26.2" width="2.4" height="3" fill="${O}"/><rect x="15.8" y="21.3" width="3" height="2.4" fill="${O}"/><rect x="26.2" y="21.3" width="3" height="2.4" fill="${O}"/><circle cx="22.5" cy="22.5" r="5" fill="${O}"/><circle cx="22.5" cy="22.5" r="1.9" fill="#fff"/>`,
  chart: `<path d="M4 24h24" stroke="${A}" stroke-width="2" stroke-linecap="round"/><path d="M5 19l6-9 5 6 4-7 6 10z" fill="${O}"/><path d="M5 9v14" stroke="${A}" stroke-width="2" stroke-linecap="round"/>`,
  check: `<rect x="5" y="3" width="17" height="22" rx="2.4" fill="none" stroke="${A}" stroke-width="2"/><path d="M9 9h9M9 13h6" stroke="${A}" stroke-width="2" stroke-linecap="round"/><circle cx="19" cy="19.5" r="5" fill="none" stroke="${O}" stroke-width="2.4"/><path d="M22.8 23.4l4 4" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>`,
  truck: `<rect x="3" y="9" width="15" height="11" rx="1.6" fill="none" stroke="${O}" stroke-width="2"/><path d="M18 12.5h5l4 4V20h-9z" fill="none" stroke="${O}" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="23" r="2.6" fill="none" stroke="${A}" stroke-width="2"/><circle cx="22" cy="23" r="2.6" fill="none" stroke="${A}" stroke-width="2"/>`,
  serve: `<path d="M5 19v-4a11 11 0 0122 0v4" fill="none" stroke="${A}" stroke-width="2" stroke-linecap="round"/><rect x="3" y="16" width="5" height="8" rx="2.4" fill="${O}"/><rect x="24" y="16" width="5" height="8" rx="2.4" fill="${O}"/><path d="M24 24v1.6a3 3 0 01-3 3h-4" fill="none" stroke="${A}" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="12" r="4.2" fill="${A}"/>`,
  phone: `<rect x="8" y="2.5" width="16" height="27" rx="3" fill="none" stroke="${A}" stroke-width="2"/><rect x="11" y="6.5" width="10" height="14" rx="1.4" fill="${O}"/><path d="M13.6 28h4.8" stroke="${A}" stroke-width="2" stroke-linecap="round"/>`,
  news: `<rect x="4" y="5" width="19" height="22" rx="2.4" fill="none" stroke="${A}" stroke-width="2"/><path d="M23 10h4v14.5a2.5 2.5 0 01-2.5 2.5H23z" fill="none" stroke="${A}" stroke-width="2"/><rect x="8" y="10" width="6" height="5" rx="1" fill="${O}"/><path d="M16.5 11h3M16.5 14.5h3M8 19.5h11M8 23h8" stroke="${O}" stroke-width="2" stroke-linecap="round"/>`,
  quiz: `<path d="M6 4.5h13l7 7v16a2 2 0 01-2 2H6a2 2 0 01-2-2v-21a2 2 0 012-2z" fill="none" stroke="${A}" stroke-width="2" stroke-linejoin="round"/><path d="M19 4.5v7h7" fill="none" stroke="${A}" stroke-width="2" stroke-linejoin="round"/><path d="M12 14.6a3.2 3.2 0 114.4 3c-.8.4-1.2 1-1.2 1.9v.6" fill="none" stroke="${O}" stroke-width="2.2" stroke-linecap="round"/><circle cx="15.2" cy="24" r="1.4" fill="${O}"/>`,
  all: `<path d="M16 3l13 6-13 6-13-6z" fill="${A}"/><path d="M3 16l13 6 13-6" fill="none" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/><path d="M3 22.5l13 6 13-6" fill="none" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/>`,
} as const;

export type AppIcon = keyof typeof APP_ICONS;

export const APPS_PAGE1: [string, AppIcon][] = [
  ['我要召请', 'call'],
  ['我要配件', 'part'],
  ['设备保养', 'care'],
  ['产品中心', 'prod'],
  ['机群报表', 'chart'],
];

export const APPS_PAGE2: [string, AppIcon][] = [
  ['机群报表', 'chart'],
  ['机群报表', 'chart'],
  ['检查', 'check'],
  ['重卡车队运营', 'truck'],
  ['服务中心', 'serve'],
  ['三一认证二维码', 'phone'],
  ['三一新闻', 'news'],
  ['三一新闻', 'news'],
  ['调研问卷', 'quiz'],
  ['全部应用', 'all'],
];

/** 开机柱状图（0–10） */
export const BOOT_BARS = [
  7, 6.2, 6.1, 5.1, 6.1, 6.2, 5.1, 5.1, 4.3, 5.1, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3, 3.3, 4.1, 3.4, 4.1, 3.4,
  5.0, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 4.0, 4.1, 3.4, 4.0, 4.0,
];
export const BOOT_X_AXIS = ['17', '19', '21', '23', '1', '3', '5', '7', '9', '11', '13', '15'];
export const TIMELINE_HOURS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

/** 当日工况时间轴：伪随机（固定种子），0–1.8h 与 13.6–24h 空闲，中间为作业段 */
export const TIMELINE_SLICES: string[] = (() => {
  let seed = 20260922;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const n = 140;
  return Array.from({ length: n }, (_, i) => {
    const h = (i / n) * 24;
    if (h < 1.8 || h > 13.6) return '#DDDEE4';
    return rnd() < 0.24 ? '#F5B33C' : '#1FBF6B';
  });
})();

export const COMMUNITY_TABS = ['故障求助', '经验分享', '话题', '关注', '我的'];
