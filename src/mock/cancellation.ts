import { readJSON, STORAGE_KEYS, writeJSON } from '@/services/storage';

/* =========================================================
   注销申请记录
   注销申请页、首页重新登录提示、设置页状态摘要共用这一条记录。
   状态口径与后管「客户管理 - 注销申请管理」一致。
   ========================================================= */

export const CANCEL_STATUSES = [
  'NORMAL',
  'PENDING',
  'COOLING',
  'REJECTED',
  'REVOKED',
  'PROCESSING',
  'FAILED',
  'CANCELLED',
] as const;

export type CancelStatus = (typeof CANCEL_STATUSES)[number];
/** 有申请单的状态（NORMAL 表示未申请） */
export type ApplyStatus = Exclude<CancelStatus, 'NORMAL'>;

/** 账户租户类型：个体户自动审核；含企业/代理商租户需人工审核 */
export type TenantType = 'individual' | 'enterprise';

export interface CancelRecord {
  status: CancelStatus;
  no: string;
  applyTime: string;
  coolingEnd: string;
  finishTime: string;
  reason: string;
  reasonDesc?: string;
  contentMode: string;
  tenantType?: TenantType;
  tenantTypeLabel?: string;
  tenantContact?: string;
  tenantCodeVerified?: boolean;
  auditTime?: string;
  auditOpinion?: string;
  revokeTime?: string;
  updatedTime?: string;
}

export const COOLING_DAYS = 15;

export function isCancelStatus(v: unknown): v is CancelStatus {
  return typeof v === 'string' && (CANCEL_STATUSES as readonly string[]).includes(v);
}

function dateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
}

export function createRecord(status: CancelStatus = 'NORMAL'): CancelRecord {
  const now = new Date();
  const coolingEnd = new Date(now.getTime() + COOLING_DAYS * 24 * 60 * 60 * 1000);
  return {
    status,
    no: 'CAN-' + dateKey(now) + '-0018',
    applyTime: now.toISOString(),
    coolingEnd: coolingEnd.toISOString(),
    finishTime: status === 'CANCELLED' ? now.toISOString() : '',
    reason: '不再使用 MySANY',
    contentMode: '保留并匿名化',
  };
}

/** 读取本机记录（可能不存在或已损坏） */
export function readStoredRecord(): CancelRecord | null {
  const v = readJSON<CancelRecord>(STORAGE_KEYS.cancellation);
  return v && isCancelStatus(v.status) ? v : null;
}

/** 读取记录，没有则视为未申请 */
export function readRecord(): CancelRecord {
  return readStoredRecord() ?? createRecord('NORMAL');
}

export function saveRecord(record: CancelRecord): void {
  writeJSON(STORAGE_KEYS.cancellation, record);
}

export function formatDateTime(value?: string | Date | null): string {
  const d = value ? new Date(value) : new Date();
  if (isNaN(d.getTime())) return String(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes())
  );
}

/** "+86 138****1234" 形式的脱敏手机号 */
export function maskPhone(phone: string): string {
  return '+86 ' + phone.slice(0, 3) + '****' + phone.slice(-4);
}
