import { BottomSheet, SheetBody } from '@/components/BottomSheet/BottomSheet';
import { CheckIcon, ChevronRight } from '@/components/icons';
import type { CheckScenario } from '@/flows/cancellation';
import type { TenantType } from '@/mock/cancellation';
import { CHECK_SCENARIOS, REASONS, TENANT_TYPES } from './data';

/* 注销申请页的底部弹层 */

interface SheetProps<T> {
  open: boolean;
  value: T;
  onPick: (v: T) => void;
  onClose: () => void;
}

export function ReasonSheet({ open, value, onPick, onClose }: SheetProps<string>) {
  return (
    <BottomSheet open={open} title="选择注销原因" onClose={onClose}>
      <SheetBody>
        {REASONS.map(item => (
          <button
            className={'reason-sheet-item' + (value === item.code ? ' is-on' : '')}
            key={item.code}
            onClick={() => onPick(item.code)}
          >
            {item.label}
            {value === item.code && (
              <span className="pick-check">
                <CheckIcon />
              </span>
            )}
          </button>
        ))}
      </SheetBody>
    </BottomSheet>
  );
}

/** 选项行：左侧圆形标记（通过 = 绿色对勾，否则红色感叹号） */
function ScenarioItem({
  on,
  pass,
  label,
  desc,
  onClick,
}: {
  on: boolean;
  pass: boolean;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button className={'scenario-sheet-item' + (on ? ' is-on' : '')} onClick={onClick}>
      <span className={'scenario-sheet-mark' + (pass ? ' pass' : '')}>{pass ? <CheckIcon /> : '!'}</span>
      <span className="scenario-sheet-copy">
        <strong>{label}</strong>
        <small>{desc}</small>
      </span>
      <span className="form-chev">
        <ChevronRight />
      </span>
    </button>
  );
}

/** 账号检查结果（原型演示专用） */
export function CheckScenarioSheet({
  open,
  value,
  onPick,
  onClose,
  tenantType,
}: SheetProps<CheckScenario> & { tenantType: TenantType }) {
  const items = CHECK_SCENARIOS.filter(item => !item.individualOnly || tenantType === 'individual');
  return (
    <BottomSheet open={open} title="选择账号检查结果" onClose={onClose} className="check-scenario-sheet">
      <p className="scenario-sheet-note">原型演示专用；正式产品将由系统自动检查，无需用户选择。</p>
      <SheetBody>
        {items.map(item => (
          <ScenarioItem
            key={item.code}
            on={value === item.code}
            pass={item.code === 'passed'}
            label={item.label}
            desc={item.desc}
            onClick={() => onPick(item.code)}
          />
        ))}
      </SheetBody>
    </BottomSheet>
  );
}

export function TenantTypeSheet({ open, value, onPick, onClose }: SheetProps<TenantType>) {
  return (
    <BottomSheet open={open} title="选择账户租户类型" onClose={onClose} className="tenant-type-sheet">
      <p className="scenario-sheet-note">
        不同租户类型将展示不同的申请信息与注销影响，请按当前账户实际情况选择。
      </p>
      <SheetBody>
        {TENANT_TYPES.map(item => (
          <ScenarioItem
            key={item.code}
            on={value === item.code}
            pass={item.code === 'individual'}
            label={item.label}
            desc={item.desc}
            onClick={() => onPick(item.code)}
          />
        ))}
      </SheetBody>
    </BottomSheet>
  );
}
