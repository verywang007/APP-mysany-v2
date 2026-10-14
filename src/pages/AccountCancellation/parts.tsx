import type { CSSProperties } from 'react';
import { ChevronLeft } from '@/components/icons';

/* 注销申请页内复用的小组件 */

export const Header = ({
  title,
  onBack,
  right,
  onRight,
}: {
  title: string;
  onBack: () => void;
  right?: string;
  onRight: () => void;
}) => (
  <div className="sub-hd">
    <button className="sub-back" type="button" aria-label="返回" onClick={onBack}>
      <ChevronLeft />
    </button>
    <div className="sub-title">{title}</div>
    <button className="sub-right" type="button" onClick={onRight}>
      {right || ''}
    </button>
  </div>
);

/** 申请步骤进度（共 4 步） */
export const FlowStep = ({ step }: { step: 1 | 2 | 3 | 4 }) => (
  <div className="flow-step">
    <span>{step}/4</span>
    <i style={{ '--step': step * 25 + '%' } as CSSProperties} />
    <span>提交申请</span>
  </div>
);

export interface AlertSpec {
  title: string;
  message: string;
  cancel?: string;
  ok?: string;
  /** 确认按钮用红字 */
  danger?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

/** 系统确认弹窗（kit.css 的 .alert 样式） */
export const Alert = ({ data, onClose }: { data: AlertSpec | null; onClose: () => void }) =>
  !data ? null : (
    <div className="alert-wrap">
      <div className="alert">
        <div className="alert-t">{data.title}</div>
        <p className="alert-m">{data.message}</p>
        <div className="alert-btns">
          <button
            className="alert-btn"
            onClick={() => {
              onClose();
              data.onCancel?.();
            }}
          >
            {data.cancel || '取消'}
          </button>
          <button
            className={'alert-btn ' + (data.danger ? 'danger-text' : 'primary')}
            onClick={() => {
              onClose();
              data.onOk?.();
            }}
          >
            {data.ok || '确认'}
          </button>
        </div>
      </div>
    </div>
  );
