import { useState, type ReactNode } from 'react';
import { BottomSheet, SheetBody } from '@/components/BottomSheet/BottomSheet';
import { CheckIcon, ChevronRight as ChevSvg } from '@/components/icons';
import { Ico } from './icons';

/* 「我的」页内部复用的小组件 */

/** 头像：未设置时为浅灰圆，授权换图后为渐变底 + 昵称首字 */
export const Avatar = ({ size, set, name }: { size: number; set: boolean; name: string }) => (
  <span
    className={'av' + (set ? ' is-set' : '')}
    style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
  >
    {set ? (name || '旺').slice(0, 1) : ''}
  </span>
);

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
