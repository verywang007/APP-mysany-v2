import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { useToast } from '@/components/Toast/useToast';
import {
  entryScreen,
  resolveInitialRecord,
  resolveScenario,
  resolveTenant,
  SHOW_SERVICE_IN_HEADER,
  statusAfterSubmit,
  withdrawRecord,
  type CancelScreen,
  type CheckScenario,
  type DetailAction,
} from '@/flows/cancellation';
import { createRecord, maskPhone, saveRecord, type CancelRecord, type TenantType } from '@/mock/cancellation';
import { PATHS, withQuery } from '@/router/paths';
import { EMPTY_FORM, REASONS, SERVICE_PHONE, TENANT_DEMO_CODE, tenantInfo, type ApplyForm } from './data';
import { Alert, Header, type AlertSpec } from './parts';
import { CheckingScreen, CheckScreen } from './screens/CheckScreens';
import { ConfirmScreen } from './screens/ConfirmScreen';
import { NoticeScreen } from './screens/NoticeScreen';
import { AgreementScreen, DetailScreen, SuccessScreen } from './screens/ResultScreens';
import { VerifyScreen } from './screens/VerifyScreen';
import { CheckScenarioSheet, ReasonSheet, TenantTypeSheet } from './sheets';

/* =========================================================
   注销申请
   ---------------------------------------------------------
   入口：我 → 设置 → 注销申请
   流程：须知 → 账号检查 → 身份验证 → 确认 → 提交成功 → 申请详情
   分支规则（入口画面、提交后状态、详情按钮等）见 flows/cancellation.ts
   ========================================================= */

const TITLES: Partial<Record<CancelScreen, string>> = {
  agreement: '账号注销须知',
  check: '账号检查',
  verify: '验证身份',
  confirm: '确认申请',
};

/** 白底画面 */
const WHITE_SCREENS: ReadonlySet<CancelScreen> = new Set(['success', 'checking', 'agreement']);

function remainingText(end: string): string {
  const diff = Math.max(0, new Date(end).getTime() - Date.now());
  const pad = (n: number) => String(n).padStart(2, '0');
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return days + '天 ' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

export function AccountCancellation() {
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [initialTenant] = useState<TenantType>(() => resolveTenant(params.get('tenant')));
  const [record, setRecord] = useState<CancelRecord>(() =>
    resolveInitialRecord({ state: params.get('state'), reset: params.get('reset') === '1' }),
  );
  const [nav, setNav] = useState<CancelScreen[]>(() => [entryScreen(record)]);
  const [tenantType, setTenantType] = useState<TenantType>(initialTenant);
  const [form, setForm] = useState<ApplyForm>(EMPTY_FORM);
  const [checkScenario, setCheckScenario] = useState<CheckScenario>(() =>
    resolveScenario(params.get('scenario')),
  );
  const [sheet, setSheet] = useState<'reason' | 'scenario' | 'tenant' | null>(() =>
    nav[0] === 'notice' ? 'tenant' : null,
  );
  const [dialog, setDialog] = useState<AlertSpec | null>(null);
  const [countdown, setCountdown] = useState(() => remainingText(record.coolingEnd));
  const checkingTimer = useRef(0);

  const screen = nav[nav.length - 1];
  const reasonLabel = REASONS.find(r => r.code === form.reason)?.label ?? '';
  const tenantContact = tenantType === 'enterprise' && form.phone ? maskPhone(form.phone) : '';

  const push = (s: CancelScreen) => setNav(st => [...st, s]);
  const replace = (s: CancelScreen) => setNav(st => [...st.slice(0, -1), s]);
  const backToSettings = () => navigate(withQuery(PATHS.mine, { view: 'setting' }));
  const goBack = () => {
    if (nav.length <= 1) return backToSettings();
    setNav(st => {
      const next = st.slice(0, -1);
      // 「检查中」是过渡态，返回时跳过
      return next[next.length - 1] === 'checking' ? next.slice(0, -1) : next;
    });
  };
  const callService = () => toast('拨打 ' + SERVICE_PHONE);

  useEffect(() => () => clearTimeout(checkingTimer.current), []);

  /* 冷静期倒计时 */
  useEffect(() => {
    if (record.status !== 'COOLING') return;
    setCountdown(remainingText(record.coolingEnd));
    const id = setInterval(() => setCountdown(remainingText(record.coolingEnd)), 1000);
    return () => clearInterval(id);
  }, [record.status, record.coolingEnd]);

  const startCheck = (scenario: CheckScenario) => {
    setCheckScenario(scenario);
    setSheet(null);
    push('checking');
    checkingTimer.current = window.setTimeout(() => replace('check'), 850);
  };

  const submit = () => {
    const tInfo = tenantInfo(tenantType);
    setDialog({
      title: '确认提交注销申请？',
      message:
        tenantType === 'enterprise'
          ? '租户类型：含企业/代理商租户。提交后平台将进行人工审核；审核通过后进入 15 天冷静期，期间您仍可撤销申请。'
          : '租户类型：仅为个体租户。提交后系统将自动审核通过，直接进入 15 天冷静期，期间您仍可撤销申请。',
      cancel: '再想想',
      ok: '确认提交',
      danger: true,
      onOk: () => {
        const status = statusAfterSubmit(tenantType);
        const next: CancelRecord = {
          ...createRecord(status),
          reason: reasonLabel,
          reasonDesc: form.desc,
          contentMode: form.contentMode === 'ANONYMIZE' ? '保留并匿名化' : '申请删除',
          tenantType,
          tenantTypeLabel: tInfo.label,
        };
        if (status === 'COOLING') {
          next.auditTime = new Date().toISOString();
          next.auditOpinion = '个体户申请，系统自动审核通过，直接进入冷静期';
        }
        if (tenantType === 'enterprise') {
          next.tenantContact = tenantContact;
          next.tenantCodeVerified = form.tenantCode === TENANT_DEMO_CODE;
        }
        saveRecord(next);
        setRecord(next);
        setNav(['success']);
      },
    });
  };

  const withdraw = () =>
    setDialog({
      title: '确认撤销注销申请？',
      message: '撤销后本次注销流程将终止，账号继续正常使用。如仍需注销，可以重新提交申请。',
      cancel: '继续注销',
      ok: '确认撤销',
      danger: true,
      onOk: () => {
        setRecord(withdrawRecord(record));
        toast('注销申请已撤销');
      },
    });

  const reapply = () => {
    const next = createRecord('NORMAL');
    saveRecord(next);
    setRecord(next);
    setForm(EMPTY_FORM);
    setNav(['notice']);
    setTenantType(initialTenant);
    setSheet('tenant');
  };

  const onDetailAction = (a: DetailAction) => {
    const handlers: Record<DetailAction, () => void> = {
      withdraw,
      reapply,
      contact: callService,
      login: () => navigate(PATHS.login),
    };
    handlers[a]();
  };

  const title = TITLES[screen] ?? '注销申请';
  const showService = screen === 'detail' && SHOW_SERVICE_IN_HEADER.has(record.status);

  return (
    <>
      <StatusBar time="15:19" signal="bars" network="wifi" battery={49} />
      <div className="cancel-app">
        <Header
          title={title}
          onBack={screen === 'checking' ? () => {} : goBack}
          right={showService ? '客服' : ''}
          onRight={callService}
        />
        <main className={'cancel-main' + (WHITE_SCREENS.has(screen) ? ' is-white' : '')}>
          {screen === 'notice' && (
            <NoticeScreen
              form={form}
              setForm={setForm}
              tenantType={tenantType}
              openReason={() => setSheet('reason')}
              onAgreement={() => push('agreement')}
              onNext={() => setSheet('scenario')}
            />
          )}
          {screen === 'checking' && <CheckingScreen />}
          {screen === 'check' && (
            <CheckScreen
              scenario={checkScenario}
              tenantType={tenantType}
              onBack={goBack}
              onNext={() => push('verify')}
            />
          )}
          {screen === 'verify' && <VerifyScreen onNext={() => push('confirm')} />}
          {screen === 'confirm' && (
            <ConfirmScreen
              form={form}
              reasonLabel={reasonLabel}
              tenantType={tenantType}
              tenantContact={tenantContact}
              onSubmit={submit}
            />
          )}
          {screen === 'success' && (
            <SuccessScreen record={record} onDetail={() => setNav(['detail'])} onBack={backToSettings} />
          )}
          {screen === 'detail' && (
            <DetailScreen record={record} countdown={countdown} onAction={onDetailAction} />
          )}
          {screen === 'agreement' && <AgreementScreen />}
        </main>
      </div>

      <ReasonSheet
        open={sheet === 'reason'}
        value={form.reason}
        onClose={() => setSheet(null)}
        onPick={code => {
          setForm(f => ({ ...f, reason: code }));
          setSheet(null);
        }}
      />
      <CheckScenarioSheet
        open={sheet === 'scenario'}
        value={checkScenario}
        tenantType={tenantType}
        onClose={() => setSheet(null)}
        onPick={startCheck}
      />
      <TenantTypeSheet
        open={sheet === 'tenant'}
        value={tenantType}
        onClose={() => setSheet(null)}
        onPick={code => {
          setTenantType(code);
          setSheet(null);
          if (code === 'enterprise') setForm(f => ({ ...f, tenantCode: '' }));
        }}
      />
      <Alert data={dialog} onClose={() => setDialog(null)} />
    </>
  );
}
