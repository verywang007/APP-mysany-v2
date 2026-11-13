import { Link } from 'react-router-dom';
import { ROUTES, type RouteGroup } from '@/router/routes';
import { SCENARIO_GROUPS } from '@/router/scenarios';
import './Directory.css';
import { WARNING_SETTINGS } from '@/pages/DeviceWarnings/data';
import { PATHS, withQuery } from '@/router/paths';

/* 场景目录：列出全部页面，以及因角色 / 状态不同而产生的分支场景 */

const GROUPS: RouteGroup[] = ['主流程', '账号与隐私', '设备预警', '独立场景'];

function Card({ to, title, note }: { to: string; title: string; note?: string }) {
  return (
    <Link className="dir-card" to={to}>
      <strong>{title}</strong>
      {note && <span>{note}</span>}
      <code>#{to}</code>
    </Link>
  );
}

export default function DirectoryPage() {
  return (
    <div className="pg-directory">
      <div className="dir-wrap">
        <div className="dir-head">
          <h1>MySANY APP 原型 · 场景目录</h1>
          <p>
            「页面」列出全部页面及其在真实 APP
            中的入口；「分支场景」列出同一页面因角色或状态不同而出现的不同结果。
            <br />
            各页面设备下方的演示控制条也可以切换状态。原型数据保存在本机浏览器（localStorage）。
          </p>
        </div>

        {GROUPS.map(g => (
          <section className="dir-section" key={g}>
            <h2>页面 · {g}</h2>
            <p>{g === '独立场景' ? '与其他页面没有跳转关系，由系统事件触发' : ' '}</p>
            <div className="dir-grid">
              {ROUTES.filter(r => r.group === g).map(r => (
                <Card key={r.path} to={r.path} title={r.title} note={r.entry} />
              ))}
            </div>
          </section>
        ))}

        <section className="dir-section">
          <h2>页面 · 设备预警设置与参数</h2>
          <p>按页面分类，可直接查看设置与每种预警参数列表。</p>
          <div className="dir-grid">
            <Card to={withQuery(PATHS.deviceWarnings, { page: 'settings' })} title="预警设置" note="设备预警 → 右上角设置" />
            {WARNING_SETTINGS.filter(type => type !== '故障码').map(type => <Card key={type} to={withQuery(PATHS.deviceWarnings, { page: 'parameters', type })} title={`${type}参数`} note="预警设置 → 预警参数设置" />)}
          </div>
        </section>

        {SCENARIO_GROUPS.map(g => (
          <section className="dir-section" key={g.title}>
            <h2>分支场景 · {g.title}</h2>
            <p>{g.desc || ' '}</p>
            <div className="dir-grid">
              {g.items.map(s => (
                <Card key={s.to} to={s.to} title={s.title} note={s.note} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
