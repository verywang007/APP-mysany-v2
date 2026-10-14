import { useState } from 'react';
import { useToast } from '@/components/Toast/useToast';
import { useResendTimer } from '@/hooks/useResendTimer';
import { useRetrigger } from '@/hooks/useRetrigger';
import { VERIFY_DEMO_CODE } from '../data';
import { FlowStep } from '../parts';

/** 第 3 步：短信验证本人身份 */
export function VerifyScreen({ onNext }: { onNext: () => void }) {
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [seconds, startTimer] = useResendTimer(60);
  const [shaking, shake] = useRetrigger(380);

  const send = () => {
    if (seconds) return;
    startTimer();
    toast('验证码已发送至\n+86 133****2180');
  };
  const verify = () => {
    if (code !== VERIFY_DEMO_CODE) {
      setError('验证码不正确，请输入原型验证码 ' + VERIFY_DEMO_CODE);
      shake();
      return;
    }
    setError('');
    onNext();
  };

  return (
    <>
      <div className="cancel-scroll fade-in">
        <FlowStep step={3} />
        <div className={'verify-card' + (shaking ? ' shake' : '')}>
          <h2>验证账号身份</h2>
          <p>
            为确保是您本人操作，我们将向账号绑定手机号 <b>+86 133****2180</b> 发送验证码。
          </p>
          <div className="code-line">
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={e => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              placeholder="请输入 6 位验证码"
            />
            <button className="code-send" disabled={seconds > 0} onClick={send}>
              {seconds ? seconds + 's 后重发' : '获取验证码'}
            </button>
          </div>
          {error && <div className="verify-error">{error}</div>}
          <div className="verify-tip">
            <span>•</span>
            <span>
              原型验证码为 <b>{VERIFY_DEMO_CODE}</b>，验证码仅用于本次注销身份验证。
            </span>
          </div>
        </div>
        <p className="sub-note" style={{ marginLeft: 4, marginRight: 4 }}>
          无法接收验证码？请确认手机号仍在使用，或联系 MySANY 客服协助核验身份。
        </p>
      </div>
      <div className="cancel-foot">
        <button className="cancel-btn" disabled={code.length !== 6} onClick={verify}>
          验证并继续
        </button>
      </div>
    </>
  );
}
