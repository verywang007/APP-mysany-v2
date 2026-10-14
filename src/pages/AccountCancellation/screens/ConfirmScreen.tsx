import type { TenantType } from '@/mock/cancellation';
import { tenantInfo, type ApplyForm } from '../data';
import { FlowStep } from '../parts';

interface Props {
  form: ApplyForm;
  reasonLabel: string;
  tenantType: TenantType;
  /** 脱敏后的负责人电话（仅企业租户） */
  tenantContact: string;
  onSubmit: () => void;
}

/** 第 4 步：确认申请信息 */
export function ConfirmScreen({ form, reasonLabel, tenantType, tenantContact, onSubmit }: Props) {
  const isEnterprise = tenantType === 'enterprise';
  const benefits = isEnterprise
    ? '120 积分清零，企业员工账户解除关联，3 台设备解绑'
    : '120 积分清零，3 台设备解绑';
  const verifyHint = isEnterprise && tenantContact ? ' · 租户负责人电话已核验' : '';
  const rows: [string, string][] = [
    ['租户类型', tenantInfo(tenantType).label],
    ...(isEnterprise ? ([['负责人电话', tenantContact || '+86 ****']] as [string, string][]) : []),
    ['注销原因', reasonLabel + (form.desc ? ' · ' + form.desc : '')],
    ['圈子内容', form.contentMode === 'ANONYMIZE' ? '保留并匿名化' : '申请删除'],
    ['账号权益', benefits],
    ['申请流程', '提交审核 → 15 天冷静期 → 注销处理'],
  ];

  return (
    <>
      <div className="cancel-scroll fade-in">
        <FlowStep step={4} />
        <div className="review-user">
          <span className="review-avatar">旺</span>
          <div>
            <strong>旺是旺旺的旺</strong>
            <span>+86 133****2180 · 身份验证已通过{verifyHint}</span>
          </div>
        </div>
        <div className="cancel-section-title" style={{ marginTop: 14 }}>
          确认申请信息
        </div>
        <dl className="review-card">
          {rows.map(([k, v]) => (
            <div className="review-row" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="review-notice">
          提交后平台将审核本次申请。待审核和冷静期内可随时撤销；进入注销处理后将无法恢复账号。
        </div>
        <p className="prototype-note">点击提交即表示您再次确认已阅读并理解《账号注销须知》。</p>
      </div>
      <div className="cancel-foot">
        <button className="cancel-btn" onClick={onSubmit}>
          确认提交
        </button>
      </div>
    </>
  );
}
