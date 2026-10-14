import { CheckIcon } from '@/components/icons';
import { useToast } from '@/components/Toast/useToast';
import type { CheckScenario } from '@/flows/cancellation';
import type { TenantType } from '@/mock/cancellation';
import { CHECK_SCENARIOS, HARD_BLOCK_RESULTS, SOFT_ITEMS } from '../data';
import { Ico } from '../icons';
import { FlowStep } from '../parts';

/** 检查中（过渡态） */
export const CheckingScreen = () => (
  <div className="cancel-main is-white">
    <div className="loading-wrap fade-in">
      <span className="loading-ring" />
      <strong>正在检查账号状态</strong>
      <p>正在确认账号权益、设备和待办事项…</p>
    </div>
  </div>
);

interface CheckProps {
  scenario: CheckScenario;
  tenantType: TenantType;
  onBack: () => void;
  onNext: () => void;
}

/** 第 2 步：账号检查结果。通过 → 展示权益软提醒；不通过 → 展示需先处理的事项 */
export function CheckScreen({ scenario, tenantType, onBack, onNext }: CheckProps) {
  const toast = useToast();
  const blocked = scenario !== 'passed';
  const softItems = SOFT_ITEMS[tenantType];
  const items: [string, string, string?][] = scenario === 'passed' ? softItems : HARD_BLOCK_RESULTS[scenario];
  const selected = CHECK_SCENARIOS.find(item => item.code === scenario) ?? CHECK_SCENARIOS[0];
  const summaryHint = blocked ? selected.desc : softItems.length + ' 项账号权益将在注销时处理';

  return (
    <>
      <div className="cancel-scroll fade-in">
        <FlowStep step={2} />
        <div className="result-head">
          <span className={'result-icon' + (blocked ? ' blocked' : '')}>
            {blocked ? <Ico.close /> : <CheckIcon />}
          </span>
          <h2>{blocked ? '暂时无法注销' : '账号可以申请注销'}</h2>
          <p>
            {blocked
              ? '请先处理以下事项，完成后返回重新检查。'
              : '未发现阻止注销的问题，请确认以下账号权益处理结果。'}
          </p>
        </div>
        <div className={'check-summary' + (blocked ? ' is-blocked' : '')}>
          {blocked ? <Ico.warn /> : <Ico.shield />}
          <div>
            <strong>{blocked ? selected.label : '前置检查已通过'}</strong>
            <span>{summaryHint}</span>
          </div>
        </div>
        <div className="check-list">
          {items.map(([title, desc, action], index) => (
            <div className="check-item" key={index}>
              <span className={'check-mark' + (blocked ? ' block' : '')}>{blocked ? '!' : index + 1}</span>
              <div className="check-body">
                <strong>{title}</strong>
                <p>{desc}</p>
              </div>
              {action && (
                <button className="check-action" onClick={() => toast(action + '\n原型暂未接入业务页面')}>
                  {action}
                </button>
              )}
            </div>
          ))}
        </div>
        {!blocked && <p className="prototype-note">以上为提交时的检查快照，注销正式执行前系统会再次检查。</p>}
      </div>
      <div className="cancel-foot">
        {blocked ? (
          <button className="cancel-btn outline" onClick={onBack}>
            返回重新检查
          </button>
        ) : (
          <>
            <button className="cancel-btn" onClick={onNext}>
              确认并继续
            </button>
            <button className="cancel-btn link" onClick={onBack}>
              暂不注销
            </button>
          </>
        )}
      </div>
    </>
  );
}
