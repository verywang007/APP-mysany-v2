import type { CookieCategory } from '@/mock/cookieConsent';

/* =========================================================
   Cookie 目录
   正式上线时由服务端配置中心下发，并与实际网络请求保持一致。
   Cookie 授权页与「我的 - Cookie 设置」共用此目录。
   ========================================================= */

export interface CookieItem {
  name: string;
  provider: string;
  type: string;
  duration: string;
  purpose: string;
}

export interface CookieGroup {
  title: string;
  /** 设置页详情说明 */
  note: string;
  /** 授权弹层详情说明（较短） */
  brief: string;
  items: CookieItem[];
}

export type OptionalCategory = Exclude<CookieCategory, 'necessary'>;

export const COOKIE_CATALOG: Record<CookieCategory, CookieGroup> = {
  necessary: {
    title: '严格必要 Cookie',
    note: '这些 Cookie 用于提供登录、安全和隐私选择等核心功能，无法关闭。',
    brief: '用于提供登录、安全和隐私选择等核心功能，无法关闭。',
    items: [
      {
        name: 'mysany_session',
        provider: 'MySANY',
        type: 'HTTP Cookie',
        duration: '会话期间',
        purpose: '维持登录状态，并将页面请求关联到当前会话。',
      },
      {
        name: 'mysany_csrf',
        provider: 'MySANY',
        type: 'HTTP Cookie',
        duration: '会话期间',
        purpose: '防止跨站请求伪造，保护账号和操作安全。',
      },
      {
        name: 'mysany_consent',
        provider: 'MySANY',
        type: '本地存储',
        duration: '12 个月',
        purpose: '保存您的 Cookie 分类选择及对应政策版本。',
      },
      {
        name: 'route_hint',
        provider: 'MySANY',
        type: 'HTTP Cookie',
        duration: '会话期间',
        purpose: '将请求分配至稳定的服务节点，保障页面正常访问。',
      },
    ],
  },
  functional: {
    title: '功能体验 Cookie',
    note: '这些 Cookie 用于记住您的选择并启用地图等增强功能；关闭后部分体验可能受限。',
    brief: '用于记住您的选择并启用地图等增强功能。',
    items: [
      {
        name: 'mysany_locale',
        provider: 'MySANY',
        type: '本地存储',
        duration: '12 个月',
        purpose: '记住语言和地区设置。',
      },
      {
        name: 'map_provider_pref',
        provider: '地图服务商',
        type: '本地存储',
        duration: '6 个月',
        purpose: '记住地图图层、缩放级别和地图服务偏好。',
      },
      {
        name: 'recently_viewed',
        provider: 'MySANY',
        type: '本地存储',
        duration: '30 天',
        purpose: '展示最近查看的设备和服务入口。',
      },
      {
        name: 'ui_density',
        provider: 'MySANY',
        type: '本地存储',
        duration: '12 个月',
        purpose: '保存字体大小与界面密度偏好。',
      },
    ],
  },
  analytics: {
    title: '分析统计 Cookie',
    note: '这些 Cookie 帮助我们了解产品使用、崩溃和性能情况，不用于直接识别您的真实身份。',
    brief: '用于了解产品使用、崩溃和性能情况。',
    items: [
      {
        name: 'analytics_instance_id',
        provider: '产品分析服务商',
        type: 'SDK 标识',
        duration: '13 个月',
        purpose: '区分匿名应用实例并统计功能使用情况。',
      },
      {
        name: 'analytics_session',
        provider: '产品分析服务商',
        type: 'HTTP Cookie',
        duration: '30 分钟',
        purpose: '将连续访问归入同一次匿名使用会话。',
      },
      {
        name: 'crash_instance_id',
        provider: '崩溃分析服务商',
        type: 'SDK 标识',
        duration: '90 天',
        purpose: '关联崩溃日志，定位稳定性问题。',
      },
      {
        name: 'performance_sample',
        provider: 'MySANY',
        type: '本地存储',
        duration: '24 小时',
        purpose: '控制性能抽样频率，避免重复采集。',
      },
    ],
  },
  marketing: {
    title: '广告营销 Cookie',
    note: '这些 Cookie 用于营销归因、个性化广告及广告效果衡量；关闭不影响核心功能。',
    brief: '用于营销归因、个性化广告及广告效果衡量。',
    items: [
      {
        name: 'marketing_attribution_id',
        provider: '营销归因服务商',
        type: 'SDK 标识',
        duration: '90 天',
        purpose: '判断安装或活动参与来自哪个推广渠道。',
      },
      {
        name: 'ad_personalization',
        provider: '广告服务商',
        type: '本地存储',
        duration: '6 个月',
        purpose: '保存个性化广告偏好及授权状态。',
      },
      {
        name: 'campaign_source',
        provider: 'MySANY',
        type: 'HTTP Cookie',
        duration: '30 天',
        purpose: '记录推广活动来源并衡量活动效果。',
      },
      {
        name: 'ad_frequency',
        provider: '广告服务商',
        type: 'HTTP Cookie',
        duration: '7 天',
        purpose: '限制同一广告的展示频率。',
      },
    ],
  },
};
