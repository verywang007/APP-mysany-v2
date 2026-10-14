import { readText, removeItem, STORAGE_KEYS, writeText } from '@/services/storage';

/* =========================================================
   协议版本
   线上版本由后端下发，本机留存已同意的版本；
   再次进入 APP 时比对，不一致即触发强制重新同意。
   ========================================================= */

export const POLICY_VERSION = '3.2';
export const POLICY_DATE = '2026-09-29';

export function readAgreedVersion(): string | null {
  return readText(STORAGE_KEYS.policyAgreedVersion);
}

export function saveAgreedVersion(version: string): void {
  writeText(STORAGE_KEYS.policyAgreedVersion, version);
}

export function clearAgreedVersion(): void {
  removeItem(STORAGE_KEYS.policyAgreedVersion);
}
