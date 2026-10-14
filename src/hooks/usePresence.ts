import { useEffect, useState } from 'react';

/**
 * 浮层的进出场：open 变 true 时先挂载、下一帧再加上可见态（触发 CSS 过渡）；
 * open 变 false 时先去掉可见态，等过渡结束再卸载。
 * @returns mounted 是否渲染 DOM；shown 是否处于可见态（用于加 is-open 类）
 */
export function usePresence(open: boolean, durationMs = 300): { mounted: boolean; shown: boolean } {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // 两帧：第一帧让 DOM 以初始态渲染出来，第二帧再切到可见态
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), durationMs);
    return () => clearTimeout(t);
  }, [open, durationMs]);

  return { mounted, shown };
}
