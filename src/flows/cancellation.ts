import {
  createRecord,
  formatDateTime,
  isCancelStatus,
  readRecord,
  readStoredRecord,
  saveRecord,
  type ApplyStatus,
  type CancelRecord,
  type CancelStatus,
  type TenantType,
} from '@/mock/cancellation';

/* =========================================================
   注销申请：状态 → 界面 的全部分支规则
   ---------------------------------------------------------
   业务规则（与《用户注销申请-方案》一致）：
   1. 个体户：校验通过后系统自动审核 → 直接进入冷静期 COOLING
   2. 含企业 / 代理商租户：进入待审核 PENDING，由后管人工审核
   3. 待审核、冷静期内可撤销；进入注销中后不可撤销
   页面里不写状态判断，统一查这里的配置表。
   ========================================================= */

/* ── 入口：进入注销页时展示哪个画面 ───────────────────── */

export type CancelScreen =
  | 'notice'
  | 'checking'
  | 'check'
  | 'verify'
  | 'confirm'
  | 'success'
  | 'detail'
  | 'agreement';

/** 未申请 → 注销须知（开始新申请）；已有申请 → 申请详情 */
export function entryScreen(record: CancelRecord): CancelScreen {
  return record.status === 'NORMAL' ? 'notice' : 'detail';
}

/** 提交后进入的状态：个体户自动审核通过 */
export function statusAfterSubmit(tenant: TenantType): ApplyStatus {
  return tenant === 'individual' ? 'COOLING' : 'PENDING';
}

/* ── 原型演示参数（URL 查询参数）─────────────────────── */

export type CheckScenario = 'passed' | 'device_admin' | 'locked';

export interface CancelDemoParams {
  /** ?state=COOLING 直接预览某个状态（不写入本机记录） */
  state?: string | null;
  /** ?reset=1 清空本机记录，从新申请开始 */
  reset?: boolean;
  /** ?tenant=enterprise */
  tenant?: string | null;
  /** ?scenario=passed|device_admin|locked|blocked */
  scenario?: string | null;
}

export function resolveInitialRecord({ state, reset }: CancelDemoParams): CancelRecord {
  if (reset) {
    const r = createRecord('NORMAL');
    saveRecord(r);
    return r;
  }
  const requested = String(state || '').toUpperCase();
  if (isCancelStatus(requested) && requested !== 'NORMAL') return createRecord(requested);
  return readRecord();
}

export function resolveTenant(tenant?: string | null): TenantType {
  return String(tenant || '').toLowerCase() === 'enterprise' ? 'enterprise' : 'individual';
}

export function resolveScenario(scenario?: string | null): CheckScenario {
  const s = String(scenario || '').toLowerCase();
  if (s === 'blocked') return 'device_admin';
  return s === 'device_admin' || s === 'locked' ? s : 'passed';
}

/* ── 申请详情页：状态卡 ──────────────────────────────── */

export interface StatusMeta {
  name: string;
  /** 状态卡配色类名 */
  cls: string;
  title: string;
  desc: string;
  /** 进度：1 审核 · 2 冷静期 · 3 处理 · 4 完成 */
  progress: 1 | 2 | 3 | 4;
}

export const STATUS_META: Record<ApplyStatus, StatusMeta> = {
  PENDING: {
    name: '待审核',
    cls: '',
    title: '申请已提交，等待审核',
    desc: '平台正在核对您的申请和账号检查结果，审核结果将及时通知您。',
    progress: 1,
  },
  COOLING: {
    name: '冷静期',
    cls: 'cooling',
    title: '注销申请已通过',
    desc: '冷静期内账号仍可登录，您可以随时撤销本次申请。',
    progress: 2,
  },
  REJECTED: {
    name: '已驳回',
    cls: 'rejected',
    title: '本次申请未通过',
    desc: '请根据驳回原因处理相关事项，完成后可重新提交申请。',
    progress: 1,
  },
  REVOKED: {
    name: '已撤销',
    cls: 'revoked',
    title: '注销申请已撤销',
    desc: '本次注销流程已经终止，您的账号可以继续正常使用。',
    progress: 1,
  },
  PROCESSING: {
    name: '注销中',
    cls: 'processing',
    title: '正在处理账号数据',
    desc: '注销处理已经开始，当前不可撤销。完成后将通过绑定联系方式通知您。',
    progress: 3,
  },
  FAILED: {
    name: '处理异常',
    cls: 'failed',
    title: '注销处理暂未完成',
    desc: '平台正在处理本次异常，请勿重复提交申请。如有疑问可联系客服。',
    progress: 3,
  },
  CANCELLED: {
    name: '已注销',
    cls: 'cancelled',
    title: '账号已完成注销',
    desc: '该账号已停止登录，个人信息已按适用规则删除或匿名化。',
    progress: 4,
  },
};

/** 状态中文名（含未申请），用于演示控制条、场景目录 */
export function statusLabel(status: CancelStatus): string {
  return status === 'NORMAL' ? '未申请' : STATUS_META[status].name;
}

export function statusMeta(status: CancelStatus): StatusMeta {
  return status === 'NORMAL' ? STATUS_META.PENDING : STATUS_META[status];
}

/* ── 申请详情页：底部按钮 ────────────────────────────── */

export type DetailAction = 'withdraw' | 'reapply' | 'contact' | 'login';
export interface DetailButton {
  action: DetailAction;
  label: string;
  /** 按钮样式：主按钮 / 描边 / 文字链接 */
  variant: 'primary' | 'outline' | 'link';
}

export const DETAIL_BUTTONS: Record<ApplyStatus, DetailButton[]> = {
  PENDING: [
    { action: 'withdraw', label: '撤销申请', variant: 'outline' },
    { action: 'contact', label: '联系客服', variant: 'link' },
  ],
  COOLING: [
    { action: 'withdraw', label: '撤销申请', variant: 'outline' },
    { action: 'contact', label: '联系客服', variant: 'link' },
  ],
  REJECTED: [
    { action: 'reapply', label: '重新申请', variant: 'primary' },
    { action: 'contact', label: '联系客服', variant: 'link' },
  ],
  REVOKED: [{ action: 'reapply', label: '重新申请', variant: 'primary' }],
  PROCESSING: [{ action: 'contact', label: '联系客服', variant: 'outline' }],
  FAILED: [{ action: 'contact', label: '联系客服', variant: 'outline' }],
  CANCELLED: [{ action: 'login', label: '返回登录', variant: 'primary' }],
};

/** 详情页标题栏右侧是否显示「客服」 */
export const SHOW_SERVICE_IN_HEADER: ReadonlySet<CancelStatus> = new Set([
  'REJECTED',
  'PROCESSING',
  'FAILED',
]);

/* ── 申请详情页：进度时间线 ──────────────────────────── */

export interface TimelineItem {
  title: string;
  note: string;
  time: string;
  done: boolean;
  current?: boolean;
  /** 流程在此结束或出现异常（红点） */
  branch?: boolean;
}

export function buildTimeline(record: CancelRecord): TimelineItem[] {
  const status = record.status;
  const { progress } = statusMeta(status);
  const rejected = status === 'REJECTED';
  const revoked = status === 'REVOKED';
  const failed = status === 'FAILED';
  const ended = rejected || revoked;

  const auditNote = rejected
    ? '请查看下方驳回原因'
    : revoked
      ? '账号恢复正常状态'
      : status === 'PENDING'
        ? '正在等待处理'
        : record.tenantType === 'individual'
          ? '个体户申请，系统自动审核通过'
          : '审核已通过';

  const items: TimelineItem[] = [
    {
      title: '提交注销申请',
      note: 'APP 自助申请 · 账号检查完成',
      time: formatDateTime(record.applyTime),
      done: true,
    },
    {
      title: rejected ? '审核未通过' : revoked ? '申请已撤销' : '平台审核',
      note: auditNote,
      time: ended ? '已结束' : status === 'PENDING' ? '待处理' : '已完成',
      done: progress > 1,
      branch: ended,
      current: status === 'PENDING',
    },
    {
      title: '注销冷静期',
      note: status === 'COOLING' ? '截止 ' + formatDateTime(record.coolingEnd) : '期间可主动撤销申请',
      time: status === 'COOLING' ? '进行中' : progress > 2 ? '已结束' : '待开始',
      done: progress > 2,
      current: status === 'COOLING',
    },
    {
      title: failed ? '注销处理异常' : '注销处理',
      note: failed ? '平台正在处理，请勿重复申请' : '删除、匿名化及关系解绑',
      time: failed ? '需处理' : status === 'PROCESSING' ? '进行中' : progress > 3 ? '已完成' : '待开始',
      done: progress > 3,
      branch: failed,
      current: status === 'PROCESSING',
    },
    {
      title: '注销完成',
      note: '账号停止登录',
      time: status === 'CANCELLED' ? formatDateTime(record.finishTime || new Date()) : '待完成',
      done: status === 'CANCELLED',
    },
  ];
  // 驳回 / 撤销：流程在审核环节结束，后续节点不再展示
  return ended ? items.slice(0, 2) : items;
}

/* ── 我的 - 设置：注销申请一行右侧的状态摘要 ─────────── */

const SETTINGS_SUMMARY: Partial<Record<CancelStatus, string>> = {
  PENDING: '待审核',
  COOLING: '冷静期',
  PROCESSING: '注销中',
  FAILED: '处理异常',
  REJECTED: '上次申请已驳回',
  REVOKED: '上次申请已撤销',
  CANCELLED: '已注销',
};

export function settingsSummary(): string {
  const r = readStoredRecord();
  return (r && SETTINGS_SUMMARY[r.status]) || '';
}

/* ── 首页：重新登录后的注销状态提示 ──────────────────── */

export type PromptAction = 'close' | 'detail' | 'withdraw' | 'login' | 'service';

export interface HomePrompt {
  tag: string;
  title: string;
  message: string;
  secondary?: { label: string; action: PromptAction };
  primary: { label: string; action: PromptAction; danger?: boolean };
}

function promptTime(value?: string): string {
  return value ? formatDateTime(value) : '—';
}

/** 未申请（NORMAL）或无记录时返回 null，不弹提示 */
export function homePrompt(record: CancelRecord): HomePrompt | null {
  const applyTime = promptTime(record.applyTime);
  const coolingEnd = promptTime(record.coolingEnd);
  const opinion = record.auditOpinion || '请进入申请详情查看处理说明。';
  const prompts: Record<ApplyStatus, HomePrompt> = {
    PENDING: {
      tag: '待审核',
      title: '注销申请正在审核',
      message:
        '您于 ' + applyTime + ' 提交了注销申请。审核期间账号仍可正常使用，您也可以在申请详情中主动撤销。',
      secondary: { label: '继续使用', action: 'close' },
      primary: { label: '查看进度', action: 'detail' },
    },
    COOLING: {
      tag: '冷静期',
      title: '注销申请冷静期中',
      message:
        '申请已通过审核，将于 ' + coolingEnd + ' 后开始注销。重新登录不会自动撤销，请确认是否继续保留申请。',
      secondary: { label: '继续保留申请', action: 'close' },
      primary: { label: '撤销申请', action: 'withdraw', danger: true },
    },
    REJECTED: {
      tag: '已驳回',
      title: '注销申请未通过',
      message: '本次申请未通过。\n原因：' + opinion,
      secondary: { label: '知道了', action: 'close' },
      primary: { label: '查看原因', action: 'detail' },
    },
    REVOKED: {
      tag: '已撤销',
      title: '注销申请已撤销',
      message: '本次注销流程已经终止，您的账号可以继续正常使用。如仍需注销，可重新提交申请。',
      secondary: { label: '知道了', action: 'close' },
      primary: { label: '查看记录', action: 'detail' },
    },
    PROCESSING: {
      tag: '注销中',
      title: '账号正在注销',
      message: '注销处理已经开始，当前账号暂时无法使用且不可撤销。完成后将通过绑定联系方式通知您。',
      secondary: { label: '返回登录', action: 'login' },
      primary: { label: '联系客服', action: 'service' },
    },
    FAILED: {
      tag: '处理异常',
      title: '注销处理暂未完成',
      message: '平台正在处理本次注销异常，当前账号暂时无法登录。请勿重复提交申请。',
      secondary: { label: '返回登录', action: 'login' },
      primary: { label: '联系客服', action: 'service' },
    },
    CANCELLED: {
      tag: '已注销',
      title: '账号已完成注销',
      message: '该账号已停止登录，个人信息已按适用规则删除或匿名化。如需再次使用，请重新注册账号。',
      primary: { label: '返回登录', action: 'login' },
    },
  };
  return record.status === 'NORMAL' ? null : prompts[record.status];
}

/** 首页提示中「撤销申请」的二次确认 */
export const WITHDRAW_CONFIRM_PROMPT = {
  tag: '操作确认',
  title: '确认撤销注销申请？',
  message: '撤销后本次注销流程将立即终止，账号继续正常使用。如仍需注销，需要重新提交申请。',
};

/** 撤销申请：写入本机记录 */
export function withdrawRecord(record: CancelRecord): CancelRecord {
  const now = new Date().toISOString();
  const next: CancelRecord = { ...record, status: 'REVOKED', revokeTime: now, updatedTime: now };
  saveRecord(next);
  return next;
}

/** 首页预览用：无本机记录时的示例申请 */
export function samplePromptRecord(): CancelRecord {
  return {
    ...createRecord('NORMAL'),
    no: 'CAN-20261008-0018',
    auditOpinion: '您仍是设备管理员，请先完成权限移交后重新提交。',
  };
}
