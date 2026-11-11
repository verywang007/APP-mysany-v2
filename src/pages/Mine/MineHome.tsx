import { useState } from 'react';
import { ChevronRight } from '@/components/icons';
import { fmtRp, type WeekDay } from './data';
import { Ico } from './icons';
import { useMine } from './MineContext';
import { Avatar, DayStar, ListRow } from './parts';

/* 「我的」Tab 首屏：账号栏 + 星星签到 + 快捷入口 + 列表 */

const QUICK = [
  { k: 'bind', t: '绑定设备', ico: <Ico.link />, bg: '#EDF3FF' },
  { k: 'warn', t: '设备预警', ico: <Ico.beacon />, bg: '#FFF2E4' },
  { k: 'report', t: '机群报表', ico: <Ico.chart />, bg: '#EDF3FF' },
];

const ROWS_1 = [
  { k: 'inquiry', t: '主机询价', ico: <Ico.chat />, bg: '#EAF2FF' },
  { k: 'delivery', t: '主机交付', ico: <Ico.doc />, bg: '#F0EAFF' },
  { k: 'parts', t: '配件交付', ico: <Ico.cog />, bg: '#FFECEE' },
];

const ROWS_2 = [
  { k: 'mall', t: '积分商城', ico: <Ico.shop />, bg: '#FFE8EA', badge: '全面升级' },
  { k: 'self', t: '自助服务', ico: <Ico.self />, bg: '#E9F1FF' },
  { k: 'fav', t: '收藏中心', ico: <Ico.star />, bg: '#FFE7EB' },
  { k: 'feedback', t: 'APP反馈', ico: <Ico.mail />, bg: '#E9F1FF' },
  { k: 'addr', t: '地址管理', ico: <Ico.pin />, bg: '#E6F6EA' },
];

interface MineHomeProps {
  stars: number;
  week: WeekDay[];
  claimed: boolean;
  onClaim: (n: number) => void;
}

export function MineHome({ stars, week, claimed, onClaim }: MineHomeProps) {
  const { acc, profile, toast, push, openSheet } = useMine();
  const [stuck, setStuck] = useState(false);
  const claimable = week.reduce((s, d) => s + (d.on && !claimed ? d.n : 0), 0);

  return (
    <>
      {/* 顶部账号栏（吸顶） */}
      <div className={'mine-hd' + (stuck ? ' is-stuck' : '')}>
        <div className="hd-avatar" onClick={() => push('profile')}>
          <Avatar size={40} set={profile.avatar} name={acc.name} />
          <span className="hd-badge">!</span>
        </div>
        <div className="hd-main">
          <div className="hd-line">
            <span className="hd-name" onClick={() => push('profile')}>
              {acc.name}
            </span>
            <button className="hd-swap" onClick={() => openSheet('account')} aria-label="切换身份">
              <Ico.swap />
            </button>
          </div>
          <span className="hd-tag">{acc.tag}</span>
        </div>
        <div className="hd-acts">
          <button onClick={() => openSheet('service')} aria-label="客服">
            <Ico.headset />
          </button>
          <button onClick={() => push('setting')} aria-label="设置">
            <Ico.gear />
          </button>
        </div>
      </div>

      <div className="scroll" onScroll={e => setStuck(e.currentTarget.scrollTop > 6)}>
        {/* 星星签到 */}
        <div className="card star-card">
          <div className="star-top">
            <button className="star-view" onClick={() => openSheet('star')}>
              立即查看 <ChevronRight />
            </button>
          </div>
          <div className="star-sum">
            我的星星 <em>{stars}</em> ≈ <span className="rp">Rp </span>
            <em>{fmtRp(stars * 100)},-</em>
          </div>

          <div className="week">
            {week.map((d, i) => (
              <div
                key={i}
                className={
                  'day' + (d.on ? ' is-on' : '') + (d.today ? ' is-today' : '') + (d.pop ? ' pop' : '')
                }
                onClick={() =>
                  toast(
                    d.today
                      ? '今日签到可得 +2 颗星星'
                      : d.d + ' ' + (d.on ? '已获得 ' + d.n + ' 颗星星' : '未获得星星'),
                  )
                }
              >
                <div className="day-date">{d.d}</div>
                <div className="day-box">
                  <DayStar on={d.on} />
                  <div className="day-add">+{d.n}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className={'btn-claim' + (claimable ? '' : ' is-done')}
            onClick={() => (claimable ? onClaim(claimable) : toast('今日已领取，明天再来'))}
          >
            {claimable ? '一键领取 ' + claimable + ' 颗星星' : '今日已领取'}
          </button>
        </div>

        {/* 三宫格 */}
        <div className="card quick">
          {QUICK.map(q => (
            <button className="qk" key={q.k} onClick={() => push(q.k)}>
              <span className="qk-ico" style={{ background: q.bg }}>
                {q.ico}
              </span>
              <span className="qk-txt">{q.t}</span>
            </button>
          ))}
        </div>

        {/* 设备管理 */}
        <div className="card">
          <div className="card-title">设备管理</div>
          <div className="stats">
            <button className="stat" onClick={() => push('maint')}>
              <span className="stat-num">0</span>
              <span className="stat-lbl">待保养</span>
            </button>
            <button className="stat" onClick={() => push('ticket')}>
              <span className="stat-num">0</span>
              <span className="stat-lbl">服务工单</span>
            </button>
          </div>
        </div>

        {/* 业务列表 */}
        <div className="list">
          {ROWS_1.map(r => (
            <ListRow key={r.k} ico={r.ico} bg={r.bg} text={r.t} onClick={() => push(r.k)} />
          ))}
        </div>

        {/* 服务列表 */}
        <div className="list">
          {ROWS_2.map(r => (
            <ListRow key={r.k} ico={r.ico} bg={r.bg} text={r.t} badge={r.badge} onClick={() => push(r.k)} />
          ))}
        </div>
      </div>
    </>
  );
}
