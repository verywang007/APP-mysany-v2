import { useCallback, useEffect, useRef, useState } from 'react';
import { DemoBar, DemoButton, DemoText } from '@/components/DemoBar/DemoBar';
import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { TickIcon } from '@/components/icons';
import { LegalDocBody } from '@/components/LegalDocBody';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { useToast } from '@/components/Toast/useToast';
import { PRIVACY_V32, SERVICE_TERMS_V32, SHARE_LIST_V32 } from '@/data/legal';
import { usePresence } from '@/hooks/usePresence';
import { useRetrigger } from '@/hooks/useRetrigger';
import {
  clearAgreedVersion,
  POLICY_DATE,
  POLICY_VERSION,
  readAgreedVersion,
  saveAgreedVersion,
} from '@/mock/policy';
import { FakeHome } from './FakeHome';
import './PrivacyUpdate.css';

/* =========================================================
   协议更新提示（独立场景）
   ---------------------------------------------------------
   进入 APP 时比对「线上协议版本」与「本机已同意版本」：
   一致 → 正常进入；不一致（协议变更或首次安装）→ 强制弹出更新提示。
   弹窗不可关闭；两个协议都勾选才能同意；拒绝需二次确认，确认后退出 APP。
   ========================================================= */

const DOCS = { service: SERVICE_TERMS_V32, privacy: PRIVACY_V32, share: SHARE_LIST_V32 } as const;
type DocKey = keyof typeof DOCS;

const SHEET_MS = 320;
const ALERT_MS = 200;

interface Props {
  /** 每次变化都重新执行一次「进入 APP」（演示控制条使用） */
  launchKey: number;
  onAgreedChange: (v: string | null) => void;
}

function PrivacyUpdate({ launchKey, onAgreedChange: setAgreed }: Props) {
  const toast = useToast();
  const [blocked, setBlocked] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [exited, setExited] = useState(false);
  const [docKey, setDocKey] = useState<DocKey | null>(null);
  const [lastDoc, setLastDoc] = useState<DocKey>('service');
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [shaking, shake] = useRetrigger(420);
  const bodyRef = useRef<HTMLDivElement>(null);

  const sheet = usePresence(sheetOpen, SHEET_MS);
  const docSheet = usePresence(docKey !== null, SHEET_MS);
  const alert = usePresence(alertOpen, ALERT_MS);
  const bothAgreed = agreeService && agreePrivacy;

  /* ── 进入 APP：版本比对 ── */
  const launch = useCallback(() => {
    setExited(false);
    setAlertOpen(false);
    const v = readAgreedVersion();
    setAgreed(v);
    if (v === POLICY_VERSION) {
      setBlocked(false);
      toast('协议已是最新版本，正常进入 APP', 1600);
      return;
    }
    // 已同意过旧版本 → 属于"协议变更"；从未同意 → 首次安装，同样需要同意
    setBlocked(true);
    setAgreeService(false);
    setAgreePrivacy(false);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    setSheetOpen(true);
  }, [setAgreed, toast]);

  useEffect(() => {
    launch();
  }, [launch, launchKey]);

  /* ── 不可关闭：Esc 无效（协议全文抽屉除外） ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (docKey) setDocKey(null);
      else if (sheetOpen) toast('请先阅读并选择同意或拒绝');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [docKey, sheetOpen, toast]);

  const openDoc = (e: React.MouseEvent, key: DocKey) => {
    e.preventDefault();
    e.stopPropagation(); // 协议链接点击不应切换勾选框状态
    setLastDoc(key);
    setDocKey(key);
  };

  const agree = () => {
    // 未同时勾选两个协议：按钮不生效，抖动提示（同登录页）
    if (!bothAgreed) {
      shake();
      const miss =
        !agreeService && !agreePrivacy
          ? '用户服务协议和隐私协议'
          : !agreeService
            ? '用户服务协议'
            : '隐私协议';
      toast('请先阅读并同意' + miss);
      return;
    }
    saveAgreedVersion(POLICY_VERSION);
    setAgreed(POLICY_VERSION);
    setSheetOpen(false);
    setTimeout(() => {
      setBlocked(false);
      toast('已同意更新后的协议，可继续使用 APP', 2000);
    }, SHEET_MS);
  };

  const confirmReject = () => {
    setAlertOpen(false);
    setSheetOpen(false);
    setTimeout(() => setExited(true), 340);
  };

  return (
    <>
      <StatusBar signal="dots" network="5g" battery={81} />
      <FakeHome blocked={blocked} />

      {/* 遮罩：点击无效，不可关闭 */}
      {sheet.mounted && (
        <div
          className={'scrim' + (sheet.shown ? ' is-open' : '')}
          onClick={() => {
            if (!docKey) toast('请先阅读并选择同意或拒绝');
          }}
        />
      )}

      {/* 更新提示弹窗：无关闭按钮与拖拽条，强制在同意 / 拒绝之间选择 */}
      {sheet.mounted && (
        <section
          className={'sheet' + (sheet.shown ? ' is-open' : '')}
          role="dialog"
          aria-modal="true"
          aria-labelledby="upTitle"
        >
          <div className="up-head">
            <div className="up-title" id="upTitle">
              更新提示
            </div>
            <div className="up-sub">
              版本 v{POLICY_VERSION} · {POLICY_DATE} 生效
            </div>
          </div>

          <div className="up-body" ref={bodyRef}>
            <p>
              尊敬的用户，感谢您使用 MySANY
              APP。为了更好地保障您的用户权益，我们对《用户服务协议》与《隐私政策》进行了优化更新。本次更新主要涉及以下内容：
            </p>
            <ol>
              <li>
                更新了《隐私政策》与
                <a href="#" className="doc-link" onClick={e => openDoc(e, 'share')}>
                  《个人信息共享清单》
                </a>
                中，第三方 SDK 的名称、收集范围及其隐私政策地址；
              </li>
              <li>明确了设备定位信息、工况数据的收集目的、使用范围与存储期限；</li>
              <li>新增了撤回授权、注销账号与个人信息副本获取的操作指引；</li>
              <li>调整了《用户服务协议》中关于账号安全与服务变更通知的条款表述。</li>
            </ol>
            <p>
              建议您仔细阅读并充分理解上述更新内容。如果您勾选同意或继续使用 MySANY
              平台，即表示您知情并接受更新后的协议内容。若您对更新后的《用户服务协议》与《隐私政策》有异议，建议您暂停下一步操作。
            </p>
            <p>如果您有任何疑问或需要任何帮助，欢迎随时联系我们（400-887-8318），我们将竭诚为您解答。</p>
          </div>
          <div className="up-fade" aria-hidden="true" />

          {/* 协议勾选：两行，各自独立复选框（同登录页） */}
          <div className={'agreements' + (shaking ? ' shake' : '')}>
            <label className="agree">
              <input
                className="cb-input"
                type="checkbox"
                checked={agreeService}
                onChange={e => setAgreeService(e.target.checked)}
              />
              <span className="cb" aria-hidden="true">
                <TickIcon />
              </span>
              <span className="agree-txt">
                同意
                <a href="#" className="doc-link" onClick={e => openDoc(e, 'service')}>
                  用户服务协议
                </a>
              </span>
            </label>
            <label className="agree">
              <input
                className="cb-input"
                type="checkbox"
                checked={agreePrivacy}
                onChange={e => setAgreePrivacy(e.target.checked)}
              />
              <span className="cb" aria-hidden="true">
                <TickIcon />
              </span>
              <span className="agree-txt">
                同意
                <a href="#" className="doc-link" onClick={e => openDoc(e, 'privacy')}>
                  隐私协议
                </a>
              </span>
            </label>
          </div>

          <div className="up-foot">
            <button className="btn btn-ghost" type="button" onClick={() => setAlertOpen(true)}>
              拒绝
            </button>
            <button
              className={'btn btn-primary' + (bothAgreed ? '' : ' is-disabled')}
              type="button"
              aria-disabled={!bothAgreed}
              onClick={agree}
            >
              同意
            </button>
          </div>
        </section>
      )}

      {/* 协议全文（二级抽屉，可关闭） */}
      {docSheet.mounted && (
        <section
          className={'sheet sheet-doc' + (docSheet.shown ? ' is-open' : '')}
          role="dialog"
          aria-modal="true"
        >
          <div className="doc-head">
            <button className="doc-back" type="button" onClick={() => setDocKey(null)}>
              返回
            </button>
            <span className="doc-title">{DOCS[lastDoc].title}</span>
            <span className="doc-spacer" />
          </div>
          <div className="doc-body" key={lastDoc}>
            <LegalDocBody
              doc={DOCS[lastDoc]}
              tail={<p style={{ color: '#98989E' }}>（本页为原型示意文本，非正式法律文件。）</p>}
            />
          </div>
        </section>
      )}

      {/* 拒绝二次确认 */}
      {alert.mounted && (
        <div className={'alert-scrim' + (alert.shown ? ' is-open' : '')}>
          <div className="alert" role="alertdialog" aria-modal="true" aria-labelledby="alertTitle">
            <div className="alert-body">
              <div className="alert-title" id="alertTitle">
                确认拒绝？
              </div>
              <div className="alert-text">
                拒绝后我们将无法继续为您提供 MySANY 的服务，APP 将退出。您可随时重新进入并同意协议。
              </div>
            </div>
            <div className="alert-foot">
              <button className="a-cancel" type="button" onClick={() => setAlertOpen(false)}>
                再看看
              </button>
              <button className="a-ok" type="button" onClick={confirmReject}>
                仍然拒绝
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 拒绝后退出态 */}
      <div className={'exited' + (exited ? ' is-open' : '')}>
        <div className="ex-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" strokeLinecap="round" />
            <path d="M9 8l-4 4 4 4M5 12h11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="ex-title">已退出 MySANY</div>
        <div className="ex-text">
          您未同意更新后的《用户服务协议》与《隐私政策》，暂时无法使用 APP 的相关服务。
        </div>
        <button className="btn btn-primary" type="button" onClick={launch}>
          重新进入 APP
        </button>
      </div>
    </>
  );
}

export default function PrivacyUpdatePage() {
  const [agreed, setAgreed] = useState<string | null>(() => readAgreedVersion());
  const [launchKey, setLaunchKey] = useState(0);
  return (
    <DeviceFrame
      className="pg-privacy"
      demo={
        <DemoBar>
          <DemoText>
            线上协议 v{POLICY_VERSION} ／ 本机已同意 {agreed ? 'v' + agreed : '无记录'}
          </DemoText>
          <DemoButton
            onClick={() => {
              saveAgreedVersion('3.1'); // 伪造一条旧版本同意记录
              setLaunchKey(k => k + 1);
            }}
          >
            重放：模拟协议再次变更
          </DemoButton>
          <DemoButton
            onClick={() => {
              clearAgreedVersion();
              setLaunchKey(k => k + 1);
            }}
          >
            清除本机同意记录
          </DemoButton>
        </DemoBar>
      }
    >
      <PrivacyUpdate launchKey={launchKey} onAgreedChange={setAgreed} />
    </DeviceFrame>
  );
}
