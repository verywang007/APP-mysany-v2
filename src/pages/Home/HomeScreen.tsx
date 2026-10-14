import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { useToast } from '@/components/Toast/useToast';
import { PATHS } from '@/router/paths';
import { AppGrid } from './AppGrid';
import { BOOT_BARS, BOOT_X_AXIS, COMMUNITY_TABS, TIMELINE_HOURS, TIMELINE_SLICES } from './data';

/* =========================================================
   首页主体：顶栏 + 内容 + 底部 Tab
   单独导出，Cookie 授权页用它作背景。
   ========================================================= */

const Chev = () => (
  <svg className="chev" viewBox="0 0 7 12">
    <path d="M1 1l5 5-5 5" />
  </svg>
);

const EyeSvg = () => (
  <svg viewBox="0 0 16 16">
    <path d="M1.3 8S3.8 3.6 8 3.6 14.7 8 14.7 8 12.2 12.4 8 12.4 1.3 8 1.3 8z" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);

const HeartSvg = () => (
  <svg viewBox="0 0 16 16">
    <path d="M8 13.8S2 10.2 2 6.4a3.2 3.2 0 016-1.5 3.2 3.2 0 016 1.5c0 3.8-6 7.4-6 7.4z" />
  </svg>
);

/** 点击即弹出提示的元素（原型未实现的入口） */
function Tap({
  as: Tag = 'div',
  className,
  msg,
  children,
}: {
  as?: 'div' | 'span' | 'article';
  className: string;
  msg: string;
  children: ReactNode;
}) {
  const toast = useToast();
  return (
    <Tag className={className} onClick={() => toast(msg)}>
      {children}
    </Tag>
  );
}

function TopBar() {
  return (
    <header className="topbar">
      <StatusBar signal="dots" network="5g" battery={29} light>
        <span className="island" aria-hidden="true">
          <span className="live">
            <svg viewBox="0 0 24 24">
              <path d="M4 7h10a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2zm14 3l4-2.5v9L18 14z" />
            </svg>
          </span>
        </span>
      </StatusBar>

      <div className="navbar">
        <div className="brand">SANY</div>
        <Tap className="search" msg="搜索（原型暂未实现）">
          <svg className="s-ico" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M10.9 10.9L14.2 14.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <span className="s-txt">搜索</span>
          <svg
            className="s-scan"
            viewBox="0 0 20 20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M2.6 6.6V4.2a1.6 1.6 0 011.6-1.6h2.4M13.4 2.6h2.4a1.6 1.6 0 011.6 1.6v2.4M17.4 13.4v2.4a1.6 1.6 0 01-1.6 1.6h-2.4M6.6 17.4H4.2a1.6 1.6 0 01-1.6-1.6v-2.4" />
            <path d="M2.6 10h14.8" />
          </svg>
        </Tap>
        <Tap className="nav-btn" msg="消息中心（原型暂未实现）">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18.5 15.5V10a6.5 6.5 0 10-13 0v5.5L4 17.8h16z" />
            <path d="M9.8 20.4a2.4 2.4 0 004.4 0" />
          </svg>
          <span className="badge">4</span>
        </Tap>
        <Tap className="nav-btn" msg="快捷发布（原型暂未实现）">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9.2" />
            <path d="M12 7.6v8.8M7.6 12h8.8" />
          </svg>
        </Tap>
      </div>
    </header>
  );
}

function SecHead({ title, more, msg }: { title: string; more: string; msg: string }) {
  return (
    <div className="sec-head">
      <span className="sec-title">{title}</span>
      <Tap as="span" className="sec-more" msg={msg}>
        {more}
        <Chev />
      </Tap>
    </div>
  );
}

function BootPanel() {
  return (
    <section className="panel">
      <div className="chart">
        <div className="chart-grid">
          {[
            ['0', '10'],
            ['50%', '5'],
            ['100%', '0'],
          ].map(([top, label]) => (
            <div key={label} className="gl" style={{ top }}>
              <span>{label}</span>
            </div>
          ))}
          <div className="bars">
            {BOOT_BARS.map((v, i) => (
              <i key={i} style={{ height: ((v / 10) * 100).toFixed(1) + '%' }} />
            ))}
          </div>
        </div>
        <div className="x-axis">
          {BOOT_X_AXIS.map(d => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>

      <Tap className="dev-row" msg="EV4256CF0041 设备详情">
        <span className="dev-logo">SANY</span>
        <span className="d-code">EV4256CF0041</span>
        <Chev />
      </Tap>

      <div className="stats">
        <div className="stat">
          <b>12.52h</b>
          <i>当日总工时</i>
        </div>
        <div className="stat right">
          <b>106kWh</b>
          <i>当日总电耗</i>
        </div>
      </div>

      <div className="tl-axis">
        {TIMELINE_HOURS.map(h => (
          <span key={h}>{h}</span>
        ))}
        <span>(h)</span>
      </div>
      <div className="tl-bar">
        {TIMELINE_SLICES.map((c, i) => (
          <i key={i} style={{ width: 100 / TIMELINE_SLICES.length + '%', background: c }} />
        ))}
      </div>

      <div className="loc">
        <div className="loc-line">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M8 14.5s5-4.3 5-8a5 5 0 10-10 0c0 3.7 5 8 5 8z" />
            <circle cx="8" cy="6.4" r="1.9" />
          </svg>
          <span className="txt">01, Đường Cảng Phước An, Đồng Nai, Đồng Nai, 越…</span>
        </div>
        <div className="loc-line">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="8" cy="8" r="6.3" />
            <path d="M8 4.4V8l2.6 1.6" strokeLinecap="round" />
          </svg>
          <span className="txt">2026-09-22 04:02:32 UTC+7</span>
        </div>
        <Tap className="nav-go" msg="导航到设备位置">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M17.6 2.4L2.6 8.5c-.8.3-.7 1.4.1 1.6l6 1.7 1.7 6c.2.8 1.3.9 1.6.1l6.1-15c.3-.6-.3-1.2-.9-.9z" />
          </svg>
        </Tap>
      </div>
    </section>
  );
}

const AUDIT_ROWS: { name: string; unread?: string; count?: number; sub?: boolean; msg: string }[] = [
  { name: '设备异常', unread: '11 未读', count: 13, msg: '设备异常 · 13 条' },
  { name: '维保事项', unread: '59 未读', count: 60, sub: true, msg: '维保事项 · 60 条' },
  { name: '燃油异常', msg: '燃油异常' },
  { name: '位置预警', msg: '位置预警' },
  { name: '检查异常', msg: '检查异常' },
];

function AuditList() {
  return (
    <section className="audit">
      <div className="audit-card">
        {AUDIT_ROWS.map(r => (
          <Tap key={r.name} className="a-row" msg={r.msg}>
            <div className="a-main">
              <div className="a-top">
                <span className="a-name">{r.name}</span>
                {r.unread && <span className="chip">{r.unread}</span>}
              </div>
              {r.sub && (
                <div className="a-sub">
                  <span className="dot red" />
                  已超时：60
                  <span className="sep">|</span>
                  <span className="dot amber" />
                  临期：0
                </div>
              )}
            </div>
            {r.count !== undefined && <span className="count">{r.count}</span>}
            <Chev />
          </Tap>
        ))}
      </div>
    </section>
  );
}

function Community() {
  const [on, setOn] = useState(1);
  return (
    <>
      <div className="com-tabs">
        {COMMUNITY_TABS.map((t, i) => (
          <span key={t} className={'com-tab' + (on === i ? ' on' : '')} onClick={() => setOn(i)}>
            {t}
            {t === '我的' && <i className="rd" />}
          </span>
        ))}
      </div>

      <div className="feed">
        {[
          ['a', 59],
          ['b', 45],
        ].map(([img, views]) => (
          <Tap as="article" key={img} className="post" msg="打开经验分享详情">
            <div className={'p-img ' + img}>
              <span className="views">
                <EyeSvg />
                {views}
              </span>
            </div>
            <div className="p-body">
              <div className="p-emoji">🙂</div>
              <div className="p-user">
                <span className="p-avatar">s</span>
                <span className="p-name">sany1420821</span>
              </div>
              <div className="p-foot">
                <span>2026-09-16</span>
                <span className="p-like">
                  <HeartSvg />5
                </span>
              </div>
            </div>
          </Tap>
        ))}
      </div>
    </>
  );
}

function TabBar() {
  const toast = useToast();
  const navigate = useNavigate();
  return (
    <nav className="tabbar">
      <div className="tab on">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3.1l8.4 7.1c.3.3.1.8-.3.8H19v8.4c0 .8-.6 1.4-1.4 1.4h-3.1v-5.2h-5V20.8H6.4c-.8 0-1.4-.6-1.4-1.4V11H3.9c-.4 0-.6-.5-.3-.8L12 3.1z" />
        </svg>
        首页
      </div>
      <div className="tab" onClick={() => toast('设备（原型暂未实现）')}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z" />
          <path d="M8.4 8.6L12 11.6l3.6-3M12 11.6v4.6" strokeLinecap="round" />
        </svg>
        设备
      </div>
      <div className="tab" onClick={() => toast('审核（原型暂未实现）')}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="6.8" r="3.2" />
          <path d="M6.6 20.2v-2.6c0-2 2.4-3.6 5.4-3.6s5.4 1.6 5.4 3.6v2.6z" strokeLinecap="round" />
        </svg>
        审核
      </div>
      <div
        className="tab"
        role="button"
        tabIndex={0}
        aria-label="进入我的页面"
        onClick={() => navigate(PATHS.mine)}
        onKeyDown={e => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          navigate(PATHS.mine);
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="7.4" r="3.6" />
          <path d="M4.6 20.4c0-3.6 3.3-6 7.4-6s7.4 2.4 7.4 6" strokeLinecap="round" />
        </svg>
        我
      </div>
    </nav>
  );
}

export function HomeScreen() {
  return (
    <div className="home-screen">
      <TopBar />
      <main className="content">
        <AppGrid />

        <SecHead title="最近查看" more="详情" msg="查看全部最近设备" />
        <div className="recent">
          {[
            ['纯电动牵引车', 'EV4256CF0040'],
            ['电动装载机', 'SW956E9CFB678'],
          ].map(([name, code]) => (
            <Tap key={code} className="r-card" msg={name + ' ' + code}>
              <div className="r-thumb">
                <b>SANY</b>
              </div>
              <div className="r-name">{name}</div>
              <div className="r-code">{code}</div>
            </Tap>
          ))}
        </div>

        <SecHead title="设备开机动态" more="开机曲线" msg="开机曲线（原型暂未实现）" />
        <BootPanel />

        <div className="sec-head">
          <span className="sec-title">审核事件</span>
          <Tap as="span" className="filter" msg="切换统计周期">
            过去30天
            <svg viewBox="0 0 11 7">
              <path d="M1 1l4.5 4.5L10 1" />
            </svg>
          </Tap>
        </div>
        <AuditList />

        <Community />
      </main>
      <TabBar />
    </div>
  );
}
