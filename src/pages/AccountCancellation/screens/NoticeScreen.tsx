import type { Dispatch, SetStateAction } from 'react';
import { CheckIcon, ChevronRight } from '@/components/icons';
import { useToast } from '@/components/Toast/useToast';
import { useResendTimer } from '@/hooks/useResendTimer';
import { maskPhone, type TenantType } from '@/mock/cancellation';
import { REASONS, TENANT_DEMO_CODE, type ApplyForm } from '../data';
import { Ico } from '../icons';
import { FlowStep } from '../parts';

interface Props {
  form: ApplyForm;
  setForm: Dispatch<SetStateAction<ApplyForm>>;
  tenantType: TenantType;
  openReason: () => void;
  onAgreement: () => void;
  onNext: () => void;
}

/** 第 1 步：注销须知 + 申请信息 */
export function NoticeScreen({ form, setForm, tenantType, openReason, onAgreement, onNext }: Props) {
  const toast = useToast();
  const [seconds, startTimer] = useResendTimer(60);
  const selected = REASONS.find(r => r.code === form.reason);
  const isEnterprise = tenantType === 'enterprise';
  const phoneReady = form.phone.length === 11;

  const baseValid = !!form.reason && form.agreed && (form.reason !== 'OTHER' || !!form.desc.trim());
  // 含企业租户：负责人电话 + 短信验证码均通过
  const enterpriseValid = !isEnterprise || (phoneReady && form.tenantCode === TENANT_DEMO_CODE);
  const valid = baseValid && enterpriseValid;

  const sendCode = () => {
    if (seconds) return;
    if (!phoneReady) {
      toast('请先输入 11 位手机号');
      return;
    }
    startTimer();
    setForm(f => ({ ...f, tenantCode: '' }));
    toast('验证码已发送至\n租户负责人 ' + maskPhone(form.phone) + '\n原型验证码为 ' + TENANT_DEMO_CODE);
  };

  return (
    <>
      <div className="cancel-scroll fade-in">
        <FlowStep step={1} />
        <div className="cancel-hero">
          <div className="cancel-hero-top">
            <span className="cancel-hero-ico">
              <Ico.warn />
            </span>
            <strong>注销账号前，请确认以下事项</strong>
          </div>
          <p>
            账号注销完成后将无法登录，历史权益不会恢复。个人信息将依据适用规则删除或匿名化，依法必须保留的记录将在限定期限内安全保存。
          </p>
        </div>

        <section className="cancel-section">
          <div className="cancel-section-title">注销后的影响</div>
          <div className="impact-list">
            {[
              [<Ico.gift />, '积分和未使用权益将清零', '星星、积分和活动权益注销后无法找回。'],
              [
                <Ico.link />,
                '设备及客户关系将解除',
                isEnterprise
                  ? '企业员工账户、普通设备和客户绑定关系将解除。'
                  : '普通设备、企业子账户和客户绑定关系将解除。',
              ],
              [<Ico.user />, '身份与认证信息将被处理', '个人资料删除或匿名化，重新注册需重新认证。'],
              [<Ico.shield />, '必要业务记录将去标识化保留', '订单、维护、授权及审计记录按规则保存。'],
            ].map(([ico, title, desc], i) => (
              <div className="impact-row" key={i}>
                <span className="impact-dot">{ico}</span>
                <div className="impact-copy">
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {isEnterprise && (
          <section className="cancel-section">
            <div className="tenant-verify">
              <div className="tenant-verify-tip">
                <span className="tenant-verify-dot">!</span>
                <span>
                  含企业或代理商租户的账户注销需补充租户负责人联系电话与短信验证码，确保由授权人发起本次注销。
                </span>
              </div>
              <div className={'tenant-verify-card' + (form.tenantCodeError ? ' is-shake' : '')}>
                <div className="tenant-verify-row">
                  <label>负责人电话</label>
                  <input
                    className="tenant-verify-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    value={form.phone}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        phone: e.target.value.replace(/\D/g, '').slice(0, 11),
                        tenantCode: '',
                        tenantCodeError: '',
                      }))
                    }
                    placeholder="请输入 11 位手机号"
                  />
                </div>
                <div className="tenant-verify-row">
                  <label>验证码</label>
                  <input
                    className="tenant-verify-input tenant-verify-code"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.tenantCode}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        tenantCode: e.target.value.replace(/\D/g, '').slice(0, 6),
                        tenantCodeError: '',
                      }))
                    }
                    placeholder="6 位短信验证码"
                  />
                  <button
                    className="tenant-verify-send"
                    type="button"
                    disabled={seconds > 0 || !phoneReady}
                    onClick={sendCode}
                  >
                    {seconds ? seconds + 's 后重发' : '获取验证码'}
                  </button>
                </div>
                {form.tenantCodeError && <div className="tenant-verify-error">{form.tenantCodeError}</div>}
                {!form.tenantCodeError &&
                  form.tenantCode.length === 6 &&
                  form.tenantCode !== TENANT_DEMO_CODE && (
                    <div
                      className="tenant-verify-tip"
                      style={{
                        marginTop: 10,
                        color: '#B83B35',
                        background: '#FFF0EF',
                        borderColor: '#F8DAD8',
                      }}
                    >
                      验证码不正确，请输入原型验证码 {TENANT_DEMO_CODE}
                    </div>
                  )}
                <div className="tenant-verify-foot">
                  原型验证码 <b>{TENANT_DEMO_CODE}</b>，租户负责人真实电话以外渠道沟通核验。
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="cancel-section">
          <div className="cancel-section-title">
            申请信息 <em>均为必填</em>
          </div>
          <div className="form-card">
            <button className="form-row" onClick={openReason}>
              <label>注销原因</label>
              <span className={'form-value' + (selected ? '' : ' is-placeholder')}>
                {selected ? selected.label : '请选择'}
              </span>
              <span className="form-chev">
                <ChevronRight />
              </span>
            </button>
          </div>
          {form.reason && (
            <>
              <textarea
                className="reason-note"
                maxLength={200}
                value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder={form.reason === 'OTHER' ? '请填写具体原因' : '补充说明（选填）'}
              />
              <div className="text-count">{form.desc.length}/200</div>
            </>
          )}
        </section>

        <section className="cancel-section">
          <div className="cancel-section-title">我发布的圈子内容</div>
          {(
            [
              ['ANONYMIZE', '保留并匿名化', '内容继续保留，作者统一显示为“已注销用户”。'],
              ['DELETE_REQUESTED', '申请删除', '提交后按适用规则审核并处理本人发布的内容。'],
            ] as const
          ).map(([mode, title, desc]) => (
            <button
              key={mode}
              className={'choice-card' + (form.contentMode === mode ? ' is-on' : '')}
              onClick={() => setForm(f => ({ ...f, contentMode: mode }))}
            >
              <span className="choice-radio" />
              <span className="choice-text">
                <strong>{title}</strong>
                <p>{desc}</p>
              </span>
            </button>
          ))}
        </section>

        <button
          className={'cancel-agree' + (form.agreed ? ' is-on' : '')}
          onClick={() => setForm(f => ({ ...f, agreed: !f.agreed }))}
        >
          <span className="agree-box">
            <CheckIcon />
          </span>
          <span>
            我已阅读并理解{' '}
            <a
              onClick={e => {
                e.stopPropagation();
                onAgreement();
              }}
            >
              《账号注销须知》
            </a>
            ，知晓注销后的影响。
          </span>
        </button>
      </div>
      <div className="cancel-foot">
        <button className="cancel-btn" disabled={!valid} onClick={onNext}>
          检查账号并继续
        </button>
      </div>
    </>
  );
}
