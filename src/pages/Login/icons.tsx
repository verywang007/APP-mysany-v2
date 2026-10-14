/* 登录页专用图标：输入框前缀图标、密码可见、第三方登录 */

export const FlagIcon = () => (
  <svg className="fi" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.1 1.2c.5 0 .9.4.9.9v.3c2.3-.9 4-.1 5.4.5 1.2.5 2.1.9 3.2.4l1.1-.5c.6-.3 1.3.2 1.3.8v6.2c0 .3-.2.6-.5.8l-1.3.6c-1.8.8-3.4.1-4.7-.4-1.3-.6-2.5-1.1-4.5-.2v4.3c0 .5-.4.9-.9.9s-.9-.4-.9-.9V2.1c0-.5.4-.9.9-.9z" />
  </svg>
);

export const PhoneIcon = () => (
  <svg className="fi" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5.2 1.6c.5-.2 1.1 0 1.4.5l1.3 2.4c.3.5.1 1.2-.4 1.5l-1 .6c-.2.1-.3.4-.2.6.5 1.2 1.5 2.2 2.7 2.9.2.1.5 0 .6-.2l.6-1c.3-.5 1-.7 1.5-.4l2.4 1.3c.5.3.7.9.5 1.4l-.5 1.2c-.3.7-1 1.2-1.8 1.1-2.2-.1-4.3-1.2-6-2.9S3 6.6 2.9 4.4c0-.8.4-1.5 1.1-1.8z" />
  </svg>
);

export const ShieldIcon = () => (
  <svg className="fi" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 .9l5.6 2.1c.3.1.5.4.5.7v4c0 3.2-2.3 6.1-5.8 7.3-.2.1-.4.1-.6 0C4.2 13.8 1.9 10.9 1.9 7.7v-4c0-.3.2-.6.5-.7L8 .9z" />
    <path
      d="M5.3 7.9l1.9 1.9 3.6-3.6"
      fill="none"
      stroke="#F3F4F8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserIcon = () => (
  <svg className="fi" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="4.6" r="3.3" />
    <path d="M8 9.3c3 0 5.5 1.8 6 4.2.1.5-.3 1-.8 1H2.8c-.5 0-.9-.5-.8-1 .5-2.4 3-4.2 6-4.2z" />
  </svg>
);

export const LockIcon = () => (
  <svg className="fi" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 .9c2.1 0 3.8 1.7 3.8 3.8v1.5h-1.9V4.7c0-1-.9-1.9-1.9-1.9s-1.9.9-1.9 1.9v1.5H4.2V4.7C4.2 2.6 5.9.9 8 .9z" />
    <rect x="2.6" y="6.2" width="10.8" height="8.9" rx="2.4" />
    <circle cx="8" cy="10.1" r="1.3" fill="#F3F4F8" />
    <rect x="7.2" y="10.1" width="1.6" height="2.6" rx=".8" fill="#F3F4F8" />
  </svg>
);

export const ClearIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="8" />
    <path
      d="M5.4 5.4l5.2 5.2M10.6 5.4l-5.2 5.2"
      stroke="#F3F4F8"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const EyeIcon = ({ off }: { off?: boolean }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M10 4.2c3.7 0 6.8 2.2 8.3 5.3.1.3.1.6 0 .9-1.5 3.1-4.6 5.3-8.3 5.3s-6.8-2.2-8.3-5.3a1 1 0 010-.9C3.2 6.4 6.3 4.2 10 4.2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="10" cy="10" r="2.6" fill="currentColor" />
    {off && <path d="M3.4 3.4l13.2 13.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}
  </svg>
);

export const SearchIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="7" cy="7" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10.9 10.9L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  微信: (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#09BB07" />
      <path
        d="M16.1 10.4c-4 0-7.3 2.7-7.3 6.1 0 1.9 1.1 3.6 2.8 4.7l-.7 2.1 2.5-1.3c.9.2 1.8.4 2.7.4h.6a5.6 5.6 0 01-.2-1.5c0-3.3 3.2-5.9 7.2-5.9h.6c-.6-2.7-3.5-4.6-8.2-4.6zm-2.4 3.4a.9.9 0 110 1.9.9.9 0 010-1.9zm4.9 0a.9.9 0 110 1.9.9.9 0 010-1.9z"
        fill="#fff"
      />
      <path
        d="M31.2 21.2c0-2.9-2.8-5.2-6.2-5.2s-6.2 2.3-6.2 5.2 2.8 5.2 6.2 5.2c.7 0 1.4-.1 2.1-.3l2.1 1.1-.6-1.8c1.6-.9 2.6-2.4 2.6-4.2zm-8.3-1.6a.8.8 0 110 1.6.8.8 0 010-1.6zm4.2 0a.8.8 0 110 1.6.8.8 0 010-1.6z"
        fill="#fff"
      />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#1877F2" />
      <path
        d="M23.4 21.4l.6-3.9h-3.7v-2.5c0-1.1.5-2.1 2.2-2.1h1.7V9.6s-1.5-.3-3-.3c-3.1 0-5.1 1.9-5.1 5.2v3h-3.4v3.9h3.4V34a13.6 13.6 0 004.2 0v-8.6h3.1z"
        fill="#fff"
      />
    </svg>
  ),
  Google: (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19.4" fill="#fff" stroke="#D3D3D6" strokeWidth="1.2" />
      <path
        d="M29.6 20.2c0-.7-.1-1.4-.2-2H20v3.9h5.4c-.2 1.3-.9 2.4-2 3.1v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.6z"
        fill="#4285F4"
      />
      <path
        d="M20 30c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1h-3.4v2.7A10 10 0 0020 30z"
        fill="#34A853"
      />
      <path d="M14.4 21.9a6 6 0 010-3.8v-2.7H11a10 10 0 000 9l3.4-2.5z" fill="#FBBC05" />
      <path
        d="M20 13.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0011 15.4l3.4 2.7c.8-2.4 3-4.2 5.6-4.2z"
        fill="#EA4335"
      />
    </svg>
  ),
  Apple: (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#313131" />
      <path
        d="M25.9 20.9c0-2.4 1.9-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.1-2.8.9-3.6.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.8 3.1-.8s1.9.8 3.1.7c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.6-3.9zM23.5 13.8c.7-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.1 1.9-1 3 1 .1 2.1-.5 2.8-1.4z"
        fill="#fff"
      />
    </svg>
  ),
};

/** 第三方登录图标：微信 / Facebook / Google / Apple */
export const SocialIcon = ({ name }: { name: string }) => SOCIAL_ICONS[name] ?? null;
