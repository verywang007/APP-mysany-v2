import { useId, type ReactNode } from 'react';
import { useClock } from '@/hooks/useClock';

/* =========================================================
   iOS 状态栏
   ---------------------------------------------------------
   只统一结构和图标；尺寸、颜色由各页面样式里的
   .statusbar / .sb-time / .sb-right / .sb-signal / .sb-battery 等类决定。
   ========================================================= */

/** 信号：dots = 运营商圆点 + 竖条（配 5G），bars = 五格信号（配 Wi-Fi） */
export function SignalIcon({ variant }: { variant: 'dots' | 'bars' }) {
  return variant === 'dots' ? (
    <svg className="sb-signal" viewBox="0 0 17 11" aria-hidden="true">
      <circle cx="1.5" cy="9.5" r="1.5" />
      <circle cx="5.5" cy="9.5" r="1.5" />
      <circle cx="5.5" cy="5.8" r="1.5" />
      <circle cx="9.5" cy="9.5" r="1.5" />
      <circle cx="9.5" cy="5.8" r="1.5" />
      <circle cx="9.5" cy="2.1" r="1.5" />
      <rect x="12" y="0" width="3" height="11" rx="1.5" />
    </svg>
  ) : (
    <svg className="sb-signal" viewBox="0 0 17 11" aria-hidden="true">
      <rect x="0" y="7.5" width="2.6" height="3.5" rx="1.3" />
      <rect x="3.6" y="5.5" width="2.6" height="5.5" rx="1.3" />
      <rect x="7.2" y="3.4" width="2.6" height="7.6" rx="1.3" />
      <rect x="10.8" y="1.4" width="2.6" height="9.6" rx="1.3" />
      <rect x="14.4" y="0" width="2.6" height="11" rx="1.3" />
    </svg>
  );
}

export function WifiIcon() {
  return (
    <svg className="sb-wifi" viewBox="0 0 16 12" aria-hidden="true">
      <path d="M8 11.2l2.2-2.7a3.4 3.4 0 00-4.4 0z" />
      <path d="M8 5.6c1.5 0 2.9.5 4 1.4l1.4-1.7A8.6 8.6 0 008 3.3a8.6 8.6 0 00-5.4 2l1.4 1.7A6.3 6.3 0 018 5.6z" />
      <path d="M8 1.2c2.4 0 4.6.8 6.4 2.2L15.8 1.7A12 12 0 008 -.9 12 12 0 00.2 1.7l1.4 1.7A10 10 0 018 1.2z" />
    </svg>
  );
}

/** 电池：level 为电量百分比；light 用于深色背景（如首页红色顶栏） */
export function BatteryIcon({ level, light = false }: { level: number; light?: boolean }) {
  const clipId = useId();
  const track = light ? 'rgba(255,255,255,.45)' : '#D4D4D9';
  const fill = light ? '#fff' : '#0B0B0F';
  return (
    <svg className="sb-battery" viewBox="0 0 27 13" aria-hidden="true">
      <clipPath id={clipId}>
        <rect x="0" y="0" width="25" height="13" rx="4.2" />
      </clipPath>
      <rect x="0" y="0" width="25" height="13" rx="4.2" fill={track} />
      <rect x="0" y="0" width={(level * 25) / 100} height="13" fill={fill} clipPath={`url(#${clipId})`} />
      <path d="M25.9 4.3c.9.3 1.1 1 1.1 2.2s-.2 1.9-1.1 2.2z" fill={track} />
      <text x={light ? 12.5 : 10.4} y="9.9" textAnchor="middle" fontSize="9.2" fontWeight="700" fill="#fff">
        {level}
      </text>
    </svg>
  );
}

function LiveTime({ padHour }: { padHour: boolean }) {
  return <>{useClock(padHour)}</>;
}

interface StatusBarProps {
  /** 固定时间（截图还原用）；不传则显示本机实时时间 */
  time?: string;
  /** 实时时间的小时是否补零 */
  padHour?: boolean;
  signal: 'dots' | 'bars';
  network: '5g' | 'wifi';
  battery: number;
  /** 深色背景上的白色电池 */
  light?: boolean;
  /** 插在时间和右侧图标之间的内容（如灵动岛） */
  children?: ReactNode;
}

export function StatusBar({
  time,
  padHour = true,
  signal,
  network,
  battery,
  light,
  children,
}: StatusBarProps) {
  return (
    <div className="statusbar">
      <span className="sb-time">{time ?? <LiveTime padHour={padHour} />}</span>
      {children}
      <span className="sb-right">
        <SignalIcon variant={signal} />
        {network === '5g' ? <span className="sb-5g">5G</span> : <WifiIcon />}
        <BatteryIcon level={battery} light={light} />
      </span>
    </div>
  );
}
