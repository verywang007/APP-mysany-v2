import { useState } from 'react';
import {
  homePrompt,
  withdrawRecord,
  WITHDRAW_CONFIRM_PROMPT,
  type HomePrompt,
  type PromptAction,
} from '@/flows/cancellation';
import type { CancelRecord } from '@/mock/cancellation';

/* =========================================================
   重新登录后的注销状态提示
   各状态的文案和按钮见 flows/cancellation.ts → homePrompt
   ========================================================= */

const ClockSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.2v5.2l3.4 2" />
  </svg>
);

interface Props {
  record: CancelRecord;
  onClose: () => void;
  onDetail: () => void;
  onLogin: () => void;
  onService: () => void;
  onWithdrawn: () => void;
}

/** 撤销前的二次确认：在同一个弹窗里切换内容 */
const confirmPrompt: HomePrompt = {
  ...WITHDRAW_CONFIRM_PROMPT,
  secondary: { label: '返回', action: 'close' },
  primary: { label: '确认撤销', action: 'withdraw', danger: true },
};

export function CancelLoginPrompt({ record, onClose, onDetail, onLogin, onService, onWithdrawn }: Props) {
  const [confirming, setConfirming] = useState(false);
  const base = homePrompt(record);
  if (!base) return null;
  const prompt = confirming ? confirmPrompt : base;
  // 确认态沿用冷静期配色
  const tone = confirming ? 'cooling' : record.status.toLowerCase();

  const run = (action: PromptAction) => {
    if (confirming) {
      if (action === 'close') setConfirming(false);
      else {
        withdrawRecord(record);
        onWithdrawn();
      }
      return;
    }
    const handlers: Record<PromptAction, () => void> = {
      close: onClose,
      detail: onDetail,
      withdraw: () => setConfirming(true),
      login: onLogin,
      service: onService,
    };
    handlers[action]();
  };

  return (
    <div className="cancel-login-mask">
      <section
        className={'cancel-login-dialog ' + tone}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancelLoginTitle"
      >
        <span className="cancel-login-icon" aria-hidden="true">
          <ClockSvg />
        </span>
        <span className="cancel-login-status">{prompt.tag}</span>
        <div className="cancel-login-title" id="cancelLoginTitle">
          {prompt.title}
        </div>
        <p className="cancel-login-message">{prompt.message}</p>
        <div className="cancel-login-no">{record.no ? '申请单号 ' + record.no : ''}</div>
        <div className={'cancel-login-actions' + (prompt.secondary ? '' : ' is-single')}>
          {prompt.secondary && (
            <button type="button" onClick={() => run(prompt.secondary!.action)}>
              {prompt.secondary.label}
            </button>
          )}
          <button
            type="button"
            className={'primary' + (prompt.primary.danger ? ' danger' : '')}
            onClick={() => run(prompt.primary.action)}
          >
            {prompt.primary.label}
          </button>
        </div>
      </section>
    </div>
  );
}
