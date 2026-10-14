import { ChevronRight } from '@/components/icons';
import type { SheetKey } from '../data';
import { useMine } from '../MineContext';
import { Avatar } from '../parts';

interface ProfileRow {
  l: string;
  v?: string;
  avatar?: boolean;
  sheet?: SheetKey;
  /** 不可修改（无箭头） */
  flat?: boolean;
  tip?: string;
}

/** 个人信息 */
export function ProfileView() {
  const { acc, profile, toast, openSheet } = useMine();
  const rows: ProfileRow[] = [
    { l: '头像', avatar: true, sheet: 'avatar' },
    { l: '昵称', v: acc.name, sheet: 'nickname' },
    { l: '国家 / 地区', v: profile.country, flat: true },
    { l: '身份', v: profile.role, sheet: 'role' },
    { l: '手机号码', v: profile.phone, tip: '更换手机号需通过短信验证' },
    { l: '邮箱', v: profile.email, tip: '更换邮箱需重新验证' },
    { l: '密码', v: '', tip: '修改密码需先通过短信验证' },
  ];
  const tap = (r: ProfileRow) => {
    if (r.flat) toast('国家 / 地区由实名信息决定\n如需修改请联系客服');
    else if (r.sheet) openSheet(r.sheet);
    else if (r.tip) toast(r.tip);
  };
  return (
    <div className="pf-list">
      {rows.map(r => (
        <div className="pf-row" key={r.l} onClick={() => tap(r)}>
          <span className="pf-lbl">{r.l}</span>
          {r.avatar ? (
            <span className="pf-av">
              <Avatar size={28} set={profile.avatar} name={acc.name} />
            </span>
          ) : (
            <span className="pf-val">{r.v}</span>
          )}
          {!r.flat && (
            <span className="pf-chev">
              <ChevronRight />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
