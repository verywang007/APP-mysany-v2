import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastFn } from './useToast';
import styles from './Toast.module.css';

/** 在设备屏幕内提供轻提示。由 DeviceFrame 自动挂载，页面里用 useToast() 调用。 */
export function ToastProvider({ duration = 1800, children }: { duration?: number; children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const timer = useRef(0);

  const toast = useCallback<ToastFn>(
    (msg, ms) => {
      setMessage(msg);
      setOpen(true);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setOpen(false), ms ?? duration);
    },
    [duration],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={styles.toast + (open ? ' ' + styles.open : '')} role="status" aria-live="polite">
        {message}
      </div>
    </ToastContext.Provider>
  );
}
