import { createContext, useContext } from 'react';

export type ToastFn = (message: string, durationMs?: number) => void;

export const ToastContext = createContext<ToastFn>(() => {});

/** 在设备屏幕内弹出轻提示；需在 DeviceFrame（ToastProvider）内使用 */
export function useToast(): ToastFn {
  return useContext(ToastContext);
}
