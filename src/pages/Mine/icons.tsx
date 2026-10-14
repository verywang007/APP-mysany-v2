/* 「我的」页图标（按原图形态手绘，统一 24 栅格） */

export const Ico = {
  headset: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14v-2a8 8 0 0116 0v2" />
      <rect x="2.2" y="13.4" width="4" height="6.2" rx="1.6" fill="currentColor" stroke="none" />
      <rect x="17.8" y="13.4" width="4" height="6.2" rx="1.6" fill="currentColor" stroke="none" />
      <path d="M20 19.6v.6a2.4 2.4 0 01-2.4 2.4H13" />
    </svg>
  ),
  gear: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M10.6 2.6h2.8l.5 2.3 1.9 1.1 2.2-.8 1.4 2.4-1.7 1.6v2.2l1.7 1.6-1.4 2.4-2.2-.8-1.9 1.1-.5 2.3h-2.8l-.5-2.3-1.9-1.1-2.2.8-1.4-2.4 1.7-1.6V9.2L4.6 7.6 6 5.2l2.2.8 1.9-1.1z" />
      <circle cx="12" cy="11.8" r="2.9" />
    </svg>
  ),
  swap: () => (
    <svg
      viewBox="0 0 24 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h16M15.5 3.2L19.4 7l-3.9 3.8" />
      <path d="M21 14H5M8.5 10.2L4.6 14l3.9 3.8" />
    </svg>
  ),
  /* —— 三宫格 —— */
  link: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2C7BE8" strokeWidth="2" strokeLinecap="round">
      <path d="M10 14.2a3.6 3.6 0 005.4.4l2.8-2.8a3.6 3.6 0 00-5.1-5.1l-1.3 1.3" />
      <path d="M14 9.8a3.6 3.6 0 00-5.4-.4l-2.8 2.8a3.6 3.6 0 005.1 5.1l1.3-1.3" />
    </svg>
  ),
  beacon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F08019" strokeWidth="1.9" strokeLinecap="round">
      <path d="M7.4 16.2a5.6 5.6 0 019.2 0" fill="#FBB040" stroke="#F08019" />
      <path d="M5.4 19.4h13.2" strokeWidth="2.2" />
      <path d="M12 3.4v2.3M5.6 6l1.7 1.6M18.4 6l-1.7 1.6M3.2 12h2.3M18.5 12h2.3" />
    </svg>
  ),
  chart: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2C7BE8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.4" y="4" width="17.2" height="16" rx="2.4" />
      <path d="M6.8 15.2l3.4-4 2.8 2.4 4.2-5.2" stroke="#1B62C4" strokeWidth="2" />
    </svg>
  ),
  /* —— 列表 —— */
  chat: () => (
    <svg viewBox="0 0 24 24" fill="#3B82E8">
      <rect x="2" y="4" width="14.4" height="10.6" rx="3" />
      <path d="M5.6 14.6h3.2L6 17.6z" />
      <rect x="10.4" y="9.4" width="11.6" height="8.8" rx="2.8" fill="#77A9F2" />
    </svg>
  ),
  doc: () => (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4.4" y="3" width="13" height="18" rx="2.6" fill="#8B6BE8" />
      <path d="M7.8 8h6.2M7.8 11.4h6.2M7.8 14.8h3.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.4" cy="17.4" r="4" fill="#B79BFF" />
      <path
        d="M15.7 17.5l1.2 1.2 2.2-2.4"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  cog: () => (
    <svg viewBox="0 0 24 24" fill="#F0566B">
      <path d="M10 2.6h4l.4 2.1 1.6.9 2-.7 2 3.4-1.6 1.4v1.8l1.6 1.4-2 3.4-2-.7-1.6.9-.4 2.1h-4l-.4-2.1-1.6-.9-2 .7-2-3.4L5.6 11.5V9.7L4 8.3l2-3.4 2 .7 1.6-.9z" />
      <circle cx="12" cy="10.6" r="2.5" fill="#fff" />
      <circle cx="18.2" cy="18" r="3.6" fill="#F58A99" />
      <circle cx="18.2" cy="18" r="1.3" fill="#fff" />
    </svg>
  ),
  shop: () => (
    <svg viewBox="0 0 24 24" fill="#F0566B">
      <path d="M3.6 4.4h16.8l1.3 4.2a2.9 2.9 0 01-5.6.9 2.9 2.9 0 01-5.6 0 2.9 2.9 0 01-5.6-.9z" />
      <path
        d="M5 11.6v7.2c0 .8.6 1.4 1.4 1.4h11.2c.8 0 1.4-.6 1.4-1.4v-7.2"
        fill="none"
        stroke="#F0566B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  self: () => (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4.6" y="2.8" width="12.4" height="16.4" rx="2.4" fill="#3B82E8" />
      <path d="M7.8 7.6h6M7.8 10.6h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16.4" cy="16.6" r="4.6" fill="#77A9F2" />
      <path
        d="M16.4 13.8v4.6M14.4 16.6l2 2 2-2"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  star: () => (
    <svg viewBox="0 0 24 24" fill="#F0435A">
      <path d="M12 2.6l2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5L2.6 9.5l6.5-1z" />
    </svg>
  ),
  mail: () => (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="2.6" y="4.6" width="18.8" height="14.8" rx="2.6" fill="#3B82E8" />
      <path
        d="M4.6 7.4L12 13l7.4-5.6"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4.4 18.4l5.6-5M19.6 18.4l-5.6-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  pin: () => (
    <svg viewBox="0 0 24 24" fill="#3FA85F">
      <path d="M12 2.4c4 0 7.2 3.2 7.2 7.2 0 5-5.5 10.7-6.7 11.8a.8.8 0 01-1 0C10.3 20.3 4.8 14.6 4.8 9.6c0-4 3.2-7.2 7.2-7.2z" />
      <circle cx="12" cy="9.5" r="2.6" fill="#fff" />
    </svg>
  ),
  /* —— 底部 Tab（a = 是否选中）—— */
  tHome: (a: boolean) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={a ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.4 10.6L12 3.4l8.6 7.2V20a1 1 0 01-1 1h-4.2v-5.4H9.6V21H5.4a1 1 0 01-1-1z" />
    </svg>
  ),
  tDevice: (a: boolean) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={a ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.6l8.4 4.7v9.4L12 21.4 3.6 16.7V7.3z" />
      <path d="M12 12.4l-4.3-2.4M12 12.4l4.3-2.4M12 12.4v4.8" />
    </svg>
  ),
  tAudit: (a: boolean) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={a ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="6.6" r="3.6" />
      <path d="M4.6 20.4c.6-4 3.7-6.6 7.4-6.6s6.8 2.6 7.4 6.6z" />
    </svg>
  ),
  tMe: (a: boolean) =>
    a ? (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="6.6" r="3.9" />
        <path d="M12 12.6c4 0 7.2 2.9 7.8 6.8.1.6-.4 1.2-1 1.2H5.2c-.6 0-1.1-.6-1-1.2.6-3.9 3.8-6.8 7.8-6.8z" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="6.6" r="3.6" />
        <path d="M4.8 20.4c.6-4 3.7-6.8 7.2-6.8s6.6 2.8 7.2 6.8z" />
      </svg>
    ),
  /* —— 其它 —— */
  grid: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3.4" y="3.4" width="7" height="7" rx="2" />
      <rect x="13.6" y="3.4" width="7" height="7" rx="2" />
      <rect x="3.4" y="13.6" width="7" height="7" rx="2" />
      <rect x="13.6" y="13.6" width="7" height="7" rx="2" />
    </svg>
  ),
  box: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 2.8l9 5v8.4l-9 5-9-5V7.8z" />
      <path d="M3 7.8l9 5 9-5M12 12.8v8.4" />
    </svg>
  ),
  scan: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.4 8.4V5.6a2.2 2.2 0 012.2-2.2h2.8M15.6 3.4h2.8a2.2 2.2 0 012.2 2.2v2.8M20.6 15.6v2.8a2.2 2.2 0 01-2.2 2.2h-2.8M8.4 20.6H5.6a2.2 2.2 0 01-2.2-2.2v-2.8" />
      <path d="M3.4 12h17.2" />
    </svg>
  ),
  gift: () => (
    <svg viewBox="0 0 24 24" fill="#F2913E">
      <rect x="3" y="9.4" width="18" height="11.2" rx="2" />
      <rect x="2" y="6" width="20" height="4.4" rx="1.4" />
      <rect x="10.6" y="6" width="2.8" height="14.6" fill="#fff" opacity=".8" />
      <path d="M12 6c-1.6-3.6-6-3.4-5.4-.6.3 1.4 3.2 1 5.4.6zM12 6c1.6-3.6 6-3.4 5.4-.6-.3 1.4-3.2 1-5.4.6z" />
    </svg>
  ),
};
