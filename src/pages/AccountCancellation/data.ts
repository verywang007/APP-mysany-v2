import type { CheckScenario } from '@/flows/cancellation';
import type { TenantType } from '@/mock/cancellation';

/* 注销申请页静态数据 */

export const REASONS = [
  { code: 'NO_LONGER_USE', label: '不再使用 MySANY' },
  { code: 'CHANGE_PLATFORM', label: '更换服务平台' },
  { code: 'PRIVACY', label: '隐私或个人信息原因' },
  { code: 'EXPERIENCE', label: '使用体验问题' },
  { code: 'PERSONAL', label: '个人原因' },
  { code: 'OTHER', label: '其他' },
];

export const TENANT_TYPES: { code: TenantType; label: string; desc: string }[] = [
  { code: 'individual', label: '仅为个体租户', desc: '当前账户仅关联个人租户，保持现有申请信息不变。' },
  {
    code: 'enterprise',
    label: '含企业租户或代理商租户',
    desc: '需补充租户负责人联系电话与短信验证码，确保由授权人发起。',
  },
];

export const tenantInfo = (t?: TenantType) => TENANT_TYPES.find(x => x.code === t) ?? TENANT_TYPES[0];

/** 账号检查结果（原型演示用，正式产品由系统自动检查） */
export const CHECK_SCENARIOS: {
  code: CheckScenario;
  label: string;
  desc: string;
  individualOnly?: boolean;
}[] = [
  { code: 'passed', label: '检查通过', desc: '无硬拦截，展示账号权益软提醒' },
  {
    code: 'device_admin',
    label: '当前账号在企业账号中有关联设备',
    desc: '需先联系企业租户管理员删除您的账户',
    individualOnly: true,
  },
  { code: 'locked', label: '账号处于锁定状态', desc: '账号异常，需联系客服' },
];

/** 检查通过：账号权益软提醒 [标题, 说明] */
export const SOFT_ITEMS: Record<TenantType, [string, string][]> = {
  individual: [
    ['120 积分将清零', '注销完成后积分不可恢复，也无法转移至其他账号。'],
    ['3 台普通绑定设备将解除关系', '解除后设备将转为普通设备，您当前不是设备管理员，不影响设备正常运行。'],
    ['6 条维护记录将匿名化保留', '为保障设备服务连续性，记录会去除个人标识后保留。'],
  ],
  enterprise: [
    ['120 积分将清零', '注销完成后积分不可恢复，也无法转移至其他账号。'],
    ['企业员工账户将解除关联', '解除后员工账户将被清除，无法继续登录。'],
    ['3 台普通绑定设备将解除关系', '解除后设备将转为普通设备，您当前不是设备管理员，不影响设备正常运行。'],
    ['6 条维护记录将匿名化保留', '为保障设备服务连续性，记录会去除个人标识后保留。'],
  ],
};

/** 检查不通过：硬拦截 [标题, 说明, 操作] */
export const HARD_BLOCK_RESULTS: Record<Exclude<CheckScenario, 'passed'>, [string, string, string][]> = {
  device_admin: [
    [
      '企业租户中删除个人账号',
      '您关联了 2 台设备。请先联系企业租户管理员将自己的账户进行删除，完成后重新检查。',
      '去联系',
    ],
  ],
  locked: [['当前账号处于锁定状态', '为保障账号安全，锁定期间不能申请注销，请联系客服核验。', '联系客服']],
};

/** 原型验证码 */
export const TENANT_DEMO_CODE = '654321';
export const VERIFY_DEMO_CODE = '123456';
export const SERVICE_PHONE = '0086-4006098318';

export interface ApplyForm {
  reason: string;
  desc: string;
  contentMode: 'ANONYMIZE' | 'DELETE_REQUESTED';
  agreed: boolean;
  /** 企业租户负责人电话 */
  phone: string;
  tenantCode: string;
  tenantCodeError: string;
}

export const EMPTY_FORM: ApplyForm = {
  reason: '',
  desc: '',
  contentMode: 'ANONYMIZE',
  agreed: false,
  phone: '',
  tenantCode: '',
  tenantCodeError: '',
};
