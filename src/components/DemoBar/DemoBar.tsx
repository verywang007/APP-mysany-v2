import type { ReactNode } from 'react';
import styles from './DemoBar.module.css';

/* =========================================================
   原型演示控制条：显示在设备下方，不属于 APP 界面。
   用于切换角色 / 状态、重放流程、清除本机记录等。
   ========================================================= */

export function DemoBar({ children }: { children: ReactNode }) {
  return (
    <div className={styles.bar + ' proto-only'} aria-label="原型演示控制">
      {children}
    </div>
  );
}

export function DemoButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
}

export function DemoText({ children }: { children: ReactNode }) {
  return <span className={styles.label}>{children}</span>;
}

interface DemoSelectProps<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

export function DemoSelect<T extends string>({ label, value, options, onChange }: DemoSelectProps<T>) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <select className={styles.select} value={value} onChange={e => onChange(e.target.value as T)}>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
