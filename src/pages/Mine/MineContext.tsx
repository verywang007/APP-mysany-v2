import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import type { ToastFn } from '@/components/Toast/useToast';
import type { Account, DialogSpec, Profile, Settings, SheetKey, SubKey } from './data';

/** 「我的」页各视图共享的状态与操作，避免层层传参 */
export interface MineContextValue {
  toast: ToastFn;
  acc: Account;
  profile: Profile;
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  /** 推入二级页 */
  push: (k: SubKey | string) => void;
  /** 返回上一级 */
  back: () => void;
  openSheet: (k: SheetKey) => void;
  /** 二次确认弹窗（默认取消文案「取消」） */
  confirm: (d: DialogSpec) => void;
}

export const MineContext = createContext<MineContextValue | null>(null);

export function useMine(): MineContextValue {
  const v = useContext(MineContext);
  if (!v) throw new Error('useMine 必须在 MineContext 内使用');
  return v;
}
