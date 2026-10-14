import { PATHS, withQuery } from '@/router/paths';

/* =========================================================
   登录相关的跳转分支
   ========================================================= */

/** 登录成功后：登录前已完成 Cookie 设置，直接进入首页 */
export function nextAfterLogin(): string {
  return withQuery(PATHS.home, { from: 'login' });
}
