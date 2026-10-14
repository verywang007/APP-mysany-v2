import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 可重复触发的一次性动画（如表单抖动）：
 * 每次调用 trigger 都会先移除再加上动画类，保证连续点击也能重新播放。
 */
export function useRetrigger(durationMs = 420): [boolean, () => void] {
  const [active, setActive] = useState(false);
  const raf = useRef(0);
  const timer = useRef(0);

  const trigger = useCallback(() => {
    setActive(false);
    cancelAnimationFrame(raf.current);
    clearTimeout(timer.current);
    raf.current = requestAnimationFrame(() => {
      setActive(true);
      timer.current = window.setTimeout(() => setActive(false), durationMs);
    });
  }, [durationMs]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(timer.current);
    },
    [],
  );

  return [active, trigger];
}
