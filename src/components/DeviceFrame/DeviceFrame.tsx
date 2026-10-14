import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ToastProvider } from '@/components/Toast/Toast';
import styles from './DeviceFrame.module.css';

interface DeviceFrameProps {
  /** 页面作用域类名，如 "pg-login"；使用 kit.css 组件库的页面再加 "kit" */
  className: string;
  /** 设备下方的原型演示控制条（真机全屏时自动隐藏） */
  demo?: ReactNode;
  /** 本页 Toast 默认停留时长 */
  toastDuration?: number;
  children: ReactNode;
}

/** 舞台 + 414×896 设备外框。每个页面最外层都用它包裹。 */
export function DeviceFrame({ className, demo, toastDuration, children }: DeviceFrameProps) {
  return (
    <div className={'stage ' + className}>
      <Link to="/" className={styles.dirLink + ' proto-only'}>
        ‹ 场景目录
      </Link>
      <div className="device">
        <ToastProvider duration={toastDuration}>{children}</ToastProvider>
      </div>
      {demo}
    </div>
  );
}
