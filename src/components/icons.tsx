/* =========================================================
   跨页面复用的通用图标（24 栅格，颜色跟随 currentColor）
   只在单个页面出现的图标放在各自页面目录的 icons.tsx 里。
   ========================================================= */

interface IconProps {
  className?: string;
}

export const ChevronRight = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 12 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 2l8 8-8 8" />
  </svg>
);

export const ChevronLeft = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 12 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 2L2 10l8 8" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 10.6l4 4 8-9" />
  </svg>
);

/** 圆形复选框里的白色对勾（登录页、协议更新页） */
export const TickIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3.6 8.4l3 3 5.8-6"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
