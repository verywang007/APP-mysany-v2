import { useEffect, useState } from 'react';

function format(d: Date, padHour: boolean): string {
  const h = String(d.getHours());
  const m = String(d.getMinutes()).padStart(2, '0');
  return (padHour ? h.padStart(2, '0') : h) + ':' + m;
}

/**
 * 状态栏时钟：取本机时间，按整分边界续下一次定时，
 * 既不用 1s 轮询也不会走时漂移；标签页切回前台时立即补一次。
 * @param padHour 小时是否补前导零（登录页对齐 iOS 写法不补零）
 */
export function useClock(padHour = true): string {
  const [text, setText] = useState(() => format(new Date(), padHour));

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      clearTimeout(timer);
      const now = new Date();
      setText(format(now, padHour));
      timer = window.setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
    };
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [padHour]);

  return text;
}
