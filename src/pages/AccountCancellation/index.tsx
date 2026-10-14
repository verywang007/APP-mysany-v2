import { useNavigate, useSearchParams } from 'react-router-dom';
import { DemoBar, DemoSelect } from '@/components/DemoBar/DemoBar';
import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { statusLabel } from '@/flows/cancellation';
import { CANCEL_STATUSES } from '@/mock/cancellation';
import { PATHS, withQuery } from '@/router/paths';
import { AccountCancellation } from './AccountCancellation';
import './AccountCancellation.css';

/* =========================================================
   注销申请页入口 + 原型演示控制
   ---------------------------------------------------------
   ?reset=1                 清空本机记录，从新申请开始
   ?state=COOLING …         直接预览某个申请状态（不写入本机记录）
   ?tenant=enterprise       新申请默认选「含企业 / 代理商租户」
   ?scenario=device_admin|locked   账号检查结果默认值
   ========================================================= */

const STATE_OPTIONS = [
  { value: '', label: '读取本机记录' },
  ...CANCEL_STATUSES.map(s => ({ value: s, label: statusLabel(s) + (s === 'NORMAL' ? '（新申请）' : '') })),
];
const TENANT_OPTIONS = [
  { value: 'individual', label: '个体户' },
  { value: 'enterprise', label: '含企业 / 代理商' },
];
const SCENARIO_OPTIONS = [
  { value: 'passed', label: '通过' },
  { value: 'device_admin', label: '有关联设备（仅个体户）' },
  { value: 'locked', label: '账号锁定' },
];

export default function AccountCancellationPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const state = params.get('reset') === '1' ? 'NORMAL' : String(params.get('state') || '').toUpperCase();
  const tenant = params.get('tenant') === 'enterprise' ? 'enterprise' : 'individual';
  const scenario = params.get('scenario') || 'passed';

  const go = (next: { state?: string; tenant?: string; scenario?: string }) => {
    const s = next.state ?? state;
    navigate(
      withQuery(PATHS.cancellation, {
        reset: s === 'NORMAL' ? '1' : undefined,
        state: s && s !== 'NORMAL' ? s : undefined,
        tenant: (next.tenant ?? tenant) === 'enterprise' ? 'enterprise' : undefined,
        scenario: (next.scenario ?? scenario) !== 'passed' ? (next.scenario ?? scenario) : undefined,
      }),
      { replace: true },
    );
  };

  return (
    <DeviceFrame
      className="pg-cancel kit"
      demo={
        <DemoBar>
          <DemoSelect
            label="申请状态"
            value={state}
            options={STATE_OPTIONS}
            onChange={v => go({ state: v })}
          />
          <DemoSelect
            label="租户类型"
            value={tenant}
            options={TENANT_OPTIONS}
            onChange={v => go({ tenant: v })}
          />
          <DemoSelect
            label="账号检查"
            value={scenario}
            options={SCENARIO_OPTIONS}
            onChange={v => go({ scenario: v })}
          />
        </DemoBar>
      }
    >
      <AccountCancellation />
    </DeviceFrame>
  );
}
