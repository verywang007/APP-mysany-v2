import { useState, type ReactNode } from 'react';
import { BottomSheet, SheetBody } from '@/components/BottomSheet/BottomSheet';
import { CheckIcon, ChevronRight as ChevSvg } from '@/components/icons';
import { Ico } from './icons';

/* 「我的」页内部复用的小组件 */

const ROLE_AVATARS: Record<string, { background: string; color: string; badge: ReactNode }> = {
  设备所有者: { background: '#FFF0D5', color: '#AD741D', badge: <path d="m40 42 3 4 5-7 5 7 3-4-2 11H42z" /> },
  设备管理员: { background: '#E3EDFF', color: '#3D67B2', badge: <><rect x="40" y="40" width="16" height="15" rx="3" /><path d="M44 44h8m-8 4h8m-8 4h5" stroke="white" strokeWidth="1.5" /></> },
  设备操作手: { background: '#FFF0E1', color: '#D57B27', badge: <><circle cx="48" cy="48" r="8" /><path d="M42 47h12m-6 0v8m-5-13 5 5 5-5" stroke="white" strokeWidth="1.5" fill="none" /></> },
  三一代理商: { background: '#EEE7FA', color: '#8055AE', badge: <><rect x="39" y="43" width="18" height="12" rx="2" /><path d="M44 43v-4h8v4m-13 5h18" fill="none" stroke="white" strokeWidth="1.5" /></> },
  设备维修员: { background: '#DDF3F0', color: '#288D80', badge: <path d="M51 39a6 6 0 0 0-7 8l-6 6 4 4 6-6a6 6 0 0 0 8-7l-4 4-4-4z" /> },
  三一员工: { background: '#FCE5E8', color: '#C34B60', badge: <><rect x="41" y="39" width="15" height="18" rx="3" /><circle cx="48.5" cy="45" r="2" fill="white" /><path d="M45 52h7m-3.5-15v5" stroke="white" strokeWidth="1.5" /></> },
};

/** 默认头像按身份展示角色插画，自定义头像沿用昵称预览。 */
export const Avatar = ({ size, set, name, role }: { size: number; set: boolean; name: string; role: string }) => {
  const avatar = ROLE_AVATARS[role] ?? ROLE_AVATARS['设备操作手'];
  return (
  <span
    className={'av' + (set ? ' is-set' : '')}
    style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    role="img"
    aria-label={set ? `${name}的头像` : `${role}默认头像`}
  >
    {set ? (name || '旺').slice(0, 1) : (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill={avatar.background} />
        <path d="M12 64V53c0-11 9-18 20-18s20 7 20 18v11" fill={avatar.color} />
        <circle cx="32" cy="25" r="12" fill="#F4CFAD" />
        <path d="M20 25v-5c0-8 5-12 12-12s12 4 12 12v5l-5-8c-5 4-10 5-19 5" fill={avatar.color} />
        <path d="m26 39 6 8 6-8" fill="white" opacity=".9" />
        <circle cx="48" cy="48" r="12" fill={avatar.background} />
        <g fill={avatar.color}>{avatar.badge}</g>
      </svg>
    )}
  </span>
);
};

/** 签到星星（圆底 + 白星） */
export const DayStar = ({ on }: { on?: boolean }) => (
  <svg className="day-star" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={on ? '#FFA51F' : '#C6C9D0'} />
    <path d="M12 5.8l1.9 3.9 4.3.6-3.1 3 .7 4.2-3.8-2-3.8 2 .7-4.2-3.1-3 4.3-.6z" fill="#fff" />
  </svg>
);

/** 系统权限弹窗里的应用图标 + 蓝色隐私手势角标 */
export const PermIcon = ({ kind }: { kind: 'cam' | 'photo' }) => (
  <span className="alert-ico">
    {kind === 'cam' ? (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="6.6" width="13.4" height="10.8" rx="3.2" />
        <path d="M17 11.4l4.2-2.8c.6-.4 1.4 0 1.4.7v5.4c0 .7-.8 1.1-1.4.7L17 12.6z" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24">
        <rect x="2.2" y="4.6" width="19.6" height="14.8" rx="3.2" />
        <circle cx="8" cy="9.6" r="1.9" fill="#8E8E93" />
        <path d="M4 17.6l5-5.4 3.4 3.2 3.2-3.4 4.4 5.6z" fill="#8E8E93" />
      </svg>
    )}
    <i>
      <svg viewBox="0 0 24 24">
        <path d="M6.4 20.6c-2.2-1.8-3.4-4.1-3.4-6.9v-3.4c0-.8.6-1.4 1.3-1.4s1.3.6 1.3 1.4v1.8h.5V5.3c0-.8.6-1.4 1.3-1.4s1.3.6 1.3 1.4v6.3h.5V3.8c0-.8.6-1.4 1.3-1.4s1.3.6 1.3 1.4v7.8h.5V5.6c0-.8.6-1.4 1.3-1.4s1.3.6 1.3 1.4v8.6c0 3.3-1.5 5.3-3.7 6.4z" />
      </svg>
    </i>
  </span>
);

/** 开关 */
export const Switch = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <span
    className={'switch' + (on ? ' is-on' : '')}
    role="switch"
    aria-checked={on}
    tabIndex={0}
    onKeyDown={e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      onChange(!on);
    }}
    onClick={e => {
      e.stopPropagation();
      onChange(!on);
    }}
  >
    <i />
  </span>
);

export const Empty = ({ txt, sub }: { txt: string; sub?: string }) => (
  <div className="empty">
    <Ico.box />
    <p>{txt}</p>
    {sub && <p className="empty-sub">{sub}</p>}
  </div>
);

/** 单选弹层：性别 / 身份 / 语言 */
export function PickSheet({
  open,
  title,
  options,
  value,
  onPick,
  onClose,
}: {
  open: boolean;
  title: string;
  options: string[];
  value: string;
  onPick: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <BottomSheet open={open} title={title} onClose={onClose}>
      <SheetBody>
        {options.map(o => (
          <div
            key={o}
            className={'acc' + (o === value ? ' is-on' : '')}
            style={{ height: 52 }}
            onClick={() => onPick(o)}
          >
            <div className="acc-b">
              <div className="acc-n">{o}</div>
            </div>
            {o === value && (
              <span className="acc-ck">
                <CheckIcon />
              </span>
            )}
          </div>
        ))}
      </SheetBody>
    </BottomSheet>
  );
}

/** 昵称编辑弹层 */
export function NameSheet({
  open,
  name,
  onClose,
  onSave,
}: {
  open: boolean;
  name: string;
  onClose: () => void;
  onSave: (n: string) => void;
}) {
  const [v, setV] = useState(name);
  return (
    <BottomSheet open={open} title="修改昵称" onClose={onClose}>
      <SheetBody>
        <div className="input-line" style={{ marginTop: 2 }}>
          <input value={v} maxLength={20} onChange={e => setV(e.target.value)} placeholder="请输入昵称" />
        </div>
        <button
          className="btn-primary"
          style={{ margin: '14px 0 6px' }}
          onClick={() => v.trim() && onSave(v.trim())}
        >
          保存
        </button>
      </SheetBody>
    </BottomSheet>
  );
}

/** 列表行：图标 + 文字 + 箭头 */
export function ListRow({
  ico,
  bg,
  text,
  badge,
  onClick,
}: {
  ico: ReactNode;
  bg: string;
  text: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <div className="row" onClick={onClick}>
      <span className="row-ico" style={{ background: bg }}>
        {ico}
      </span>
      <span className="row-txt">{text}</span>
      {badge && <span className="row-badge">{badge}</span>}
      <span className="row-chev">
        <ChevSvg />
      </span>
    </div>
  );
}
