/* =========================================================
   本地存储
   ---------------------------------------------------------
   所有 localStorage 键名集中在这里，页面不要直接读写 localStorage。
   读写失败（隐私模式、配额满）时静默降级，原型照常可用。
   ========================================================= */

export const STORAGE_KEYS = {
  /** Cookie 授权记录（Cookie 授权页、我的 - Cookie 设置共用） */
  cookieConsent: 'mysany.cookieConsent.v1',
  /** 注销申请记录（注销申请页、首页重新登录提示、设置页状态摘要共用） */
  cancellation: 'mysany.cancelPrototype.v1',
  /** 本机已同意的协议版本（协议更新提示页） */
  policyAgreedVersion: 'mysany.policy.agreedVersion',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export function readJSON<T>(key: StorageKey): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(key: StorageKey, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 忽略：原型不依赖持久化成功 */
  }
}

export function readText(key: StorageKey): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeText(key: StorageKey, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 忽略 */
  }
}

export function removeItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* 忽略 */
  }
}
