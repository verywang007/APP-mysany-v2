import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { BottomSheet, SheetBody } from '@/components/BottomSheet/BottomSheet';
import { useToast } from '@/components/Toast/useToast';
import { PATHS, withQuery } from '@/router/paths';
import { readJSON, writeJSON, STORAGE_KEYS } from '@/services/storage';
import { WARNING_TYPES, WARNING_SETTINGS, WARNING_CATEGORY_SWITCHES, WARNING_EVENTS, PARAMETER_CONFIGS } from './data';
import './Warnings.css';

function WarningScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = params.get('page') || 'list';
  const type = params.get('type') || '超速';
  const toast = useToast();
  const [notificationsAllowed, setNotificationsAllowed] = useState(() => readJSON<boolean>(STORAGE_KEYS.notificationPermission) ?? false);
  const [riskLevels, setRiskLevels] = useState<string[]>(() => readJSON<string[]>(STORAGE_KEYS.warningRiskLevels) ?? []);
  const [riskDraft, setRiskDraft] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('全部');
  const [sheet, setSheet] = useState<'type' | 'date' | 'parameter' | 'notifications' | 'risk' | null>(null);
  const [start, setStart] = useState('2026-11-06');
  const [end, setEnd] = useState('2026-11-12');
  const [draftStart, setDraftStart] = useState(start);
  const [draftEnd, setDraftEnd] = useState(end);
  const [selected, setSelected] = useState<string[]>([]);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => readJSON(STORAGE_KEYS.warningSettings) ?? {});
  const [values, setValues] = useState<Record<string, string>>(() => readJSON(STORAGE_KEYS.warningParameters) ?? {});
  const [draftValue, setDraftValue] = useState('30');
  const go = (next: string, warningType?: string) => {
    setQuery('');
    setSelected([]);
    navigate(withQuery(PATHS.deviceWarnings, { page: next, type: warningType }));
  };
  const config = PARAMETER_CONFIGS[type] ?? { devices: [], prefix: '', unit: '', initial: '', options: [] };
  const devices = config.devices.filter(device => `${device.code} ${device.name}`.toLowerCase().includes(query.trim().toLowerCase()));
  const events = WARNING_EVENTS.filter(event => (filter === '全部' || event.type === filter) && event.code.toLowerCase().includes(query.trim().toLowerCase()) && event.time.slice(0, 10) >= start && event.time.slice(0, 10) <= end);
  const title = page === 'settings' ? '设置' : page === 'parameters' ? `${type}参数` : '设备预警';
  const toggle = (code: string) => setSelected(previous => previous.includes(code) ? previous.filter(item => item !== code) : [...previous, code]);
  return <>
    <StatusBar signal="dots" network="5g" battery={63} />
    <header className="warning-header">
      <button aria-label="返回" onClick={() => page === 'list' ? navigate(PATHS.mine) : go(page === 'parameters' ? 'settings' : 'list')}>‹</button>
      <h1>{title}</h1>
      {page === 'list' && <button aria-label="预警设置" onClick={() => go('settings')}>⚙</button>}
    </header>
    {page !== 'settings' && <div className="warning-search"><span>⌕</span><input aria-label="搜索设备" placeholder={page === 'list' ? '请输入设备昵称或编号' : '设备昵称或序列号'} value={query} onChange={event => setQuery(event.target.value)} />{query && <button aria-label="清空搜索" onClick={() => setQuery('')}>×</button>}</div>}
    {page === 'list' && <>
      <div className="warning-filters"><button onClick={() => { setDraftStart(start); setDraftEnd(end); setSheet('date'); }}>{start.slice(5)} 至 {end.slice(5)}⌄</button><button onClick={() => setSheet('type')}>{filter}⌄</button></div>
      <main className="warning-scroll">{events.map(event => <article className="warning-event" key={event.time}><h2>{event.code}</h2><span>{event.type}</span><p>{event.text}</p><small>{event.time}</small></article>)}{!events.length && <Empty />}</main>
    </>}
    {page === 'settings' && <main className="warning-scroll warning-config"><button className="warning-notifications" onClick={() => setSheet('notifications')}><span><b>允许推送通知</b><small>{notificationsAllowed ? '已开启' : '你可能错过重要通知，请点击开启'}</small></span>{!notificationsAllowed && <span aria-hidden="true">›</span>}</button><button className="warning-risk-row" onClick={() => { setRiskDraft(riskLevels); setSheet('risk'); }}><span>接收风险预警等级</span><span className="warning-risk-selected">{['高风险', '中风险', '低风险'].filter(level => riskLevels.includes(level)).map(level => <span key={level} className={'risk-badge risk-' + ['高风险', '中风险', '低风险'].indexOf(level)} aria-label={level} title={level}>{level[0]}</span>)}<span aria-hidden="true">›</span></span></button>{[...WARNING_SETTINGS, ...WARNING_CATEGORY_SWITCHES].map((name, index) => <section key={name}>
      <div className="warning-setting-row"><span>{name}</span><button role="switch" aria-label={name} aria-checked={enabled[name] ?? index !== 0} className={'warning-switch ' + ((enabled[name] ?? index !== 0) ? 'on' : '')} onClick={() => { const next = { ...enabled, [name]: !(enabled[name] ?? index !== 0) }; setEnabled(next); writeJSON(STORAGE_KEYS.warningSettings, next); }}><i /></button></div>
      {index < 2 && <p>{index === 0 ? '对设备的油位到达临界点进行预警提醒，提高设备工作效率。' : '对设备的冷却水温进行实时监控，过高预警提醒，防治设备因水温过高发生故障。'}</p>}
      {name === '发动机转速' && <p>对设备的发动机转速进行实时监控，过高预警提醒，防治设备因发动机长期转速过高发生故障</p>}
      {name !== '故障码' && !WARNING_CATEGORY_SWITCHES.includes(name) && <button className="warning-parameter-link" onClick={() => go('parameters', name)}>预警参数设置</button>}
    </section>)}</main>}
    {page === 'parameters' && <>
      <main className="warning-scroll">{devices.map(({ code, name }) => <label className="warning-device" key={code}><span className="warning-thumb">SANY</span><div><b>{name}</b><small>{code}</small><small>{config.prefix}<em>{values[`${type}:${code}`] || config.initial}{config.unit}</em>{config.suffix}</small></div><input type="checkbox" checked={selected.includes(code)} onChange={() => toggle(code)} /></label>)}{!devices.length && <Empty />}</main>
      {config.devices.length > 0 && <footer className="warning-footer"><label><input type="checkbox" checked={devices.length > 0 && devices.every(device => selected.includes(device.code))} onChange={event => setSelected(event.target.checked ? devices.map(device => device.code) : [])}/>全选（{selected.length}）</label><button disabled={!selected.length} onClick={() => { setDraftValue(config.options[0] || config.initial); setSheet('parameter'); }}>更改参数</button></footer>}
    </>}
    <BottomSheet open={sheet !== null} onClose={() => setSheet(null)} title={sheet === 'risk' ? '选择类型' : sheet === 'notifications' ? '通知设置' : sheet === 'type' ? '预警类型' : sheet === 'date' ? '时间段' : '参数设置'}>
      <SheetBody>
        {sheet === 'notifications' && <div className="notification-preview"><p>系统设置 · 通知 · MySANY</p><label>允许通知<button className={'warning-switch ' + (notificationsAllowed ? 'on' : '')} role="switch" aria-label="系统设置允许通知" aria-checked={notificationsAllowed} onClick={() => { const next = !notificationsAllowed; setNotificationsAllowed(next); writeJSON(STORAGE_KEYS.notificationPermission, next); }}><i /></button></label><p className="notification-demo-note">系统通知设置模拟</p><div className="warning-actions"><button onClick={() => setSheet(null)}>返回预警设置</button></div></div>}
        {sheet === 'risk' && <>{['高风险', '中风险', '低风险'].map((level, index) => <label className="warning-risk-option" key={level}><span className={'risk-badge risk-' + index} aria-hidden="true">{level[0]}</span><span>{level}</span><input type="checkbox" checked={riskDraft.includes(level)} onChange={event => setRiskDraft(previous => event.target.checked ? [...previous, level] : previous.filter(item => item !== level))}/></label>)}<div className="warning-actions"><button onClick={() => setSheet(null)}>取消</button><button onClick={() => { setRiskLevels(riskDraft); writeJSON(STORAGE_KEYS.warningRiskLevels, riskDraft); setSheet(null); }}>确认</button></div></>}
        {sheet === 'type' && WARNING_TYPES.map(name => <button className="warning-option" key={name} onClick={() => { setFilter(name); setSheet(null); }}>{name}<span>{filter === name ? '●' : ''}</span></button>)}
        {sheet === 'date' && <><div className="warning-dates"><label>开始时间<input type="date" value={draftStart} onChange={event => setDraftStart(event.target.value)} /></label><label>结束时间<input type="date" value={draftEnd} onChange={event => setDraftEnd(event.target.value)} /></label></div><div className="warning-actions"><button onClick={() => setSheet(null)}>取消</button><button onClick={() => { if (!draftStart || !draftEnd || draftStart > draftEnd) { toast('请选择有效的起止时间'); return; } setStart(draftStart); setEnd(draftEnd); setSheet(null); }}>确认</button></div></>}
        {sheet === 'parameter' && <><select className="warning-value" aria-label="预警阈值" value={draftValue} onChange={event => setDraftValue(event.target.value)}>{config.options.map(value => <option key={value} value={value}>{value}{config.unit}</option>)}</select><div className="warning-actions"><button onClick={() => setSheet(null)}>取消</button><button onClick={() => { const next = { ...values }; selected.forEach(code => { next[`${type}:${code}`] = draftValue; }); setValues(next); writeJSON(STORAGE_KEYS.warningParameters, next); setSheet(null); toast('参数设置成功'); }}>确认</button></div></>}
      </SheetBody>
    </BottomSheet>
  </>;
}
function Empty() {
  return <div className="warning-empty"><svg viewBox="0 0 120 100" aria-hidden="true"><path d="M25 50 60 30l35 20v40H25z" fill="#b8bdc7"/><path d="m25 50 35 15 35-15M60 65v25" fill="none" stroke="#eef0f4" strokeWidth="3"/><path d="M10 12h100M60 12v15" stroke="#969caa" strokeWidth="3"/></svg><p>没有数据</p></div>;
}
export default function DeviceWarningsPage() {
  return <DeviceFrame className="pg-device-warnings kit"><WarningScreen /></DeviceFrame>;
}
