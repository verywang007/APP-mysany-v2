import { useState } from 'react';
import { CookieSheet } from '@/components/CookieSheet/CookieSheet';
import { DemoBar, DemoButton, DemoText } from '@/components/DemoBar/DemoBar';
import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { clearConsent, hasValidConsent } from '@/mock/cookieConsent';
import { POLICY_VERSION, readAgreedVersion, saveAgreedVersion } from '@/mock/policy';
import { Login } from './Login';
import './Login.css';

/* =========================================================
   登录页
   ---------------------------------------------------------
   登录前先完成 Cookie 设置（EU 合规）：
   本机无有效授权记录时，在登录页之上弹出 Cookie 授权弹层，
   此时登录入口全部锁定，授权完成才可操作账号 / 密码登录。

   演示控制条：查看协议同意状态、重放协议变更、
   清除本机同意记录（清除后重新弹出 Cookie 授权）。
   ========================================================= */
export default function LoginPage() {
  const [needConsent, setNeedConsent] = useState(() => !hasValidConsent());
  /** 递增后强制重新挂载弹层：清除同意记录时让它以默认选择重新弹出 */
  const [sheetKey, setSheetKey] = useState(0);
  const [agreed, setAgreed] = useState<string | null>(() => readAgreedVersion());

  return (
    <DeviceFrame
      className="pg-login"
      demo={
        <DemoBar>
          <DemoText>
            线上协议 v{POLICY_VERSION} ／ 本机已同意 {agreed ? 'v' + agreed : '无记录'}
          </DemoText>
          <DemoButton
            onClick={() => {
              saveAgreedVersion('3.1'); // 伪造一条旧版本同意记录
              setAgreed(readAgreedVersion());
            }}
          >
            重放：模拟协议再次变更
          </DemoButton>
          <DemoButton
            onClick={() => {
              clearConsent();
              setAgreed(readAgreedVersion());
              setSheetKey(k => k + 1);
              setNeedConsent(true);
            }}
          >
            清除本机同意记录
          </DemoButton>
        </DemoBar>
      }
    >
      <Login locked={needConsent} />
      {needConsent && <CookieSheet key={sheetKey} onDone={() => setNeedConsent(false)} />}
    </DeviceFrame>
  );
}
