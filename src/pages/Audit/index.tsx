import { riskEvents } from './riskEvents';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { PATHS, withQuery } from '@/router/paths';
import './Audit.css';
const groups = ['设备异常', '维保事项', '燃油异常', '位置预警', '检查异常'];
const deviceTypes = ['冷却水温高', '故障码', 'SOC过低', '危险力矩', '蓄电池电压低', '超速', '发动机转速', '主卷超载', '设备离线预警', '长时间停机', '危险负载', '绝缘告警', '长时间驻车', '电机温度', '高液压油温'];
const settingTypes: Record<string, string[]> = {
  设备异常: deviceTypes,
  维保事项: ['保养逾期', '保养临近'],
  燃油异常: ['燃油异常'],
  位置预警: ['位置预警'],
  检查异常: ['检查异常'],
};
const auditSettingGroups = [...groups, ...Object.keys(riskEvents).filter(name => !groups.includes(name))];
const mergedSettingTypes = Object.fromEntries(auditSettingGroups.map(name => [name, [...new Set([...(settingTypes[name] || []), ...(riskEvents[name] || [])])]]));
const newRiskEventKeys = Object.entries(riskEvents).flatMap(([name, types]) => types.filter(type => !(settingTypes[name] || []).includes(type)).map(type => `${name}:${type}`));
const codes = ['SY0245CA53708', 'LFXAH75W0R3008257', 'RC0090CF0612', 'TC4025CE0121', 'SY0758C01278'];
function AuditScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = params.get('page') || 'home';
  const [expanded, setExpanded] = useState<string[]>([]);
  const [category, setCategory] = useState(0);
  const [grouped, setGrouped] = useState(true);
  const [disabled, setDisabled] = useState<string[]>(newRiskEventKeys);
  const [query, setQuery] = useState('');
  const [batch, setBatch] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const go = (next: string, code?: string) => navigate(withQuery(PATHS.audit, { page: next, code }));
  return <><StatusBar signal="dots" network="wifi" battery={25}/>
    <header className={"audit-head" + (page === 'home' ? ' home' : '')}>{page !== 'home' && <button onClick={() => go('home')}>‹</button>}{page !== 'home' && <b>{page === 'settings' ? '审核设置' : page === 'events' ? params.get('code') || codes[0] : '审核'}</b>}{page === 'home' && <input className="audit-search" placeholder="设备编号/昵称/车牌号" value={query} onChange={event => setQuery(event.target.value)}/>} {page === 'home' && <button aria-label="审核设置" onClick={() => go('settings')}>⚙</button>}</header>
    <main className="audit-body">
      {page === 'settings' && auditSettingGroups.map(name => {
        const types = mergedSettingTypes[name];
        const open = expanded.includes(name);
        const enabledCount = types.filter(type => !disabled.includes(`${name}:${type}`)).length;
        return <section className="audit-group" key={name}>
          <button className="audit-group-title" aria-expanded={open} aria-controls={`audit-settings-${auditSettingGroups.indexOf(name)}`} onClick={() => setExpanded(previous => open ? previous.filter(group => group !== name) : [...previous, name])}>
            <b>{name}</b><small>已开启 {enabledCount}/{types.length}</small><span aria-hidden="true">{open ? '⌃' : '⌄'}</span>
          </button>
          {open && <div id={`audit-settings-${auditSettingGroups.indexOf(name)}`}>{types.map(type => {
            const key = `${name}:${type}`;
            const enabled = !disabled.includes(key);
            return <div className="audit-setting" key={key}>{type}
              <button role="switch" aria-label={`${name} ${type}`} aria-checked={enabled} className={'audit-switch ' + (enabled ? 'on' : '')} onClick={() => setDisabled(previous => enabled ? [...previous, key] : previous.filter(item => item !== key))}><i/></button>
            </div>;
          })}</div>}
        </section>;
      })}
      {page === 'home' && <><div className="audit-summary">待处理 33，今日新增 3，滞留最长 86 天<br/>有 160 条已超 30 天，请尽快处理</div><div className="audit-tabs">{groups.map((name,index) => <button key={name} className={category === index ? 'active' : ''} onClick={() => setCategory(index)}>{name}{index === 0 ? '(14)' : index === 1 ? '(19)' : ''}</button>)}</div><p>11-5 至 11-12 <label style={{float:'right'}}>按设备分组 <input type="checkbox" checked={grouped} onChange={event => setGrouped(event.target.checked)}/></label></p>{(category === 0 ? codes : category === 1 ? ['SW956E9CFB868', 'SW956E9CFB678', 'SW956E9CFD508'] : []).filter(code => code.includes(query.trim())).map((code,index) => <button className="audit-device" key={code} onClick={() => go('events',code)}><span>🏗</span><div><b>{code}</b><small>Sany · {category === 1 ? '电动装载机' : index === 0 || index === 4 ? '挖掘机' : index === 1 ? '半挂牵引车' : '汽车起重机'}</small>{category === 1 && <small className="maintenance-count">● 逾期：{[6,5,4][index]}　{index < 2 ? '● 临近：2' : ''}</small>}</div><em>{category === 1 ? ['8新　8','7新　7','4新　4'][index] : index === 0 ? '6新　6' : '2新　2'} ›</em></button>)}{category > 1 && <div className="audit-empty"><svg viewBox="0 0 120 100"><path d="M15 12h90M60 12v20M25 52l35-20 35 20v40H25z" fill="#b8bdc7" stroke="#989daa"/><path d="m25 52 35 15 35-15M60 67v25" stroke="white" fill="none"/></svg><p>暂无数据</p></div>}</>}
      {page === 'events' && Array.from({length:6},(_,index) => <article className={'audit-event '+(selected.includes(index)?'selected':'')} key={index}>{batch && <input type="checkbox" checked={selected.includes(index)} onChange={event => setSelected(previous => event.target.checked ? [...previous,index] : previous.filter(item => item!==index))}/>}<h3>故障码 <small>新</small></h3><p>曲轴传感器异常（无脉冲）(P020)</p><p className="audit-time">◷ 2026-11-{12-index} 19:44:38 (UTC+8)</p><div className="audit-event-actions"><button disabled>确认处理</button><button disabled>服务召请</button><button onClick={() => {setBatch(true);setSelected([index]);}}>•••</button></div></article>)}
    </main>
    {batch && <footer className="audit-batch"><label><input type="checkbox" checked={selected.length===6} onChange={event => setSelected(event.target.checked?[0,1,2,3,4,5]:[])}/>全选</label> 已选 {selected.length} 条/6 条<button onClick={() => {setBatch(false);setSelected([]);}}>取消</button><p>单批最多 20 条</p><button disabled>批量忽略</button><button disabled>批量确认</button></footer>}
    <nav className="audit-nav"><button onClick={() => navigate(PATHS.home)}>⌂<small>首页</small></button><button disabled>⬡<small>设备</small></button><button onClick={() => go('home')}>♟<small>审核</small></button><button onClick={() => navigate(PATHS.mine)}>♙<small>我</small></button></nav>
  </>;
}
export default function AuditPage(){return <DeviceFrame className="pg-audit kit"><AuditScreen/></DeviceFrame>;}
