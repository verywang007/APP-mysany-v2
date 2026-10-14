import { useCallback, useEffect, useState } from 'react';

/**
 * 验证码重发倒计时。
 * @returns [剩余秒数（0 表示可发送）, 开始倒计时, 立即重置]
 */
export function useResendTimer(total = 60): [number, () => void, () => void] {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!seconds) return;
    const id = window.setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds > 0]); // eslint-disable-line react-hooks/exhaustive-deps -- 只在开始/结束时重建定时器

  const start = useCallback(() => setSeconds(total), [total]);
  const reset = useCallback(() => setSeconds(0), []);
  return [seconds, start, reset];
}
