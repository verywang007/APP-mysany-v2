import { readJSON, removeItem, STORAGE_KEYS, writeJSON } from '@/services/storage';

/* =========================================================
   Cookie 授权记录
   Cookie 授权页与「我的 - 设置 - Cookie 设置」读写同一条记录。
   ========================================================= */

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';
export type CookieChoices = Record<CookieCategory, boolean>;

export type ConsentAction =
  | 'accept_all'
  | 'reject_all'
  | 'save_preferences'
  | 'settings_update'
  | 'marketing_enable'
  | 'marketing_disable';

export interface ConsentRecord {
  schemaVersion: string;
  policyVersion: string;
  vendorListVersion: string;
  region: string;
  action: ConsentAction;
  choices: CookieChoices;
  timestamp: string;
}

export const CONSENT_SCHEMA_VERSION = '1.0';

/** 默认：仅严格必要，其余关闭 */
export const COOKIE_DEFAULTS: CookieChoices = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};
export const COOKIE_ALL_ON: CookieChoices = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

const OPTIONAL: CookieCategory[] = ['functional', 'analytics', 'marketing'];

export function readConsent(): ConsentRecord | null {
  const v = readJSON<ConsentRecord>(STORAGE_KEYS.cookieConsent);
  return v && v.choices ? v : null;
}

export function readConsentChoices(): CookieChoices {
  const v = readConsent();
  return v ? { ...COOKIE_DEFAULTS, ...v.choices } : { ...COOKIE_DEFAULTS };
}

/** 登录后是否已有有效授权（无效则需先弹 Cookie 授权） */
export function hasValidConsent(): boolean {
  const v = readConsent();
  return !!(v && v.schemaVersion === CONSENT_SCHEMA_VERSION && v.choices);
}

export function saveConsent(choices: Partial<CookieChoices>, action: ConsentAction): CookieChoices {
  const record: ConsentRecord = {
    schemaVersion: CONSENT_SCHEMA_VERSION,
    policyVersion: '2026.09',
    vendorListVersion: '1.0',
    region: 'EEA',
    action,
    choices: { ...COOKIE_DEFAULTS, ...choices },
    timestamp: new Date().toISOString(),
  };
  writeJSON(STORAGE_KEYS.cookieConsent, record);
  return record.choices;
}

export function clearConsent(): void {
  removeItem(STORAGE_KEYS.cookieConsent);
}

function optionalCount(choices: CookieChoices | null | undefined): number {
  return OPTIONAL.filter(k => choices && choices[k]).length;
}

/** 设置页列表右侧的简短摘要 */
export function consentShortSummary(choices: CookieChoices | null | undefined): string {
  const n = optionalCount(choices);
  if (n === 0) return '仅必要';
  if (n === 3) return '全部允许';
  return '已允许 ' + n + ' 类';
}

/** 授权完成后的 Toast 文案 */
export function consentResultSummary(choices: CookieChoices): string {
  const n = optionalCount(choices);
  if (n === 0) return '已拒绝全部非必要 Cookie';
  if (n === 3) return '已接受全部 Cookie';
  return '已允许 ' + n + ' 类非必要 Cookie';
}
