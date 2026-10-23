/** 所有页面路径。页面间跳转一律用这里的常量，不要手写字符串。 */
export const PATHS = {
  directory: '/',
  login: '/login',
  home: '/home',
  mine: '/mine',
  cancellation: '/account-cancellation',
  privacyUpdate: '/privacy-update',
  policyConsent: '/policy-consent',
  ads: '/ads',
} as const;

/** 拼接带查询参数的路径，值为 undefined 的参数会被忽略 */
export function withQuery(path: string, query: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined) qs.set(k, v);
  });
  const s = qs.toString();
  return s ? path + '?' + s : path;
}
