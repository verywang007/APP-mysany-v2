import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DemoBar, DemoButton, DemoSelect, DemoText } from '@/components/DemoBar/DemoBar';
import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { TickIcon } from '@/components/icons';
import { LegalDocBody } from '@/components/LegalDocBody';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { useToast } from '@/components/Toast/useToast';
import { PRIVACY_V32, SERVICE_TERMS_V32, SHARE_LIST_V32 } from '@/data/legal';
import { usePresence } from '@/hooks/usePresence';
import { useRetrigger } from '@/hooks/useRetrigger';
import { POLICY_DATE, POLICY_VERSION } from '@/mock/policy';
import { PATHS } from '@/router/paths';
import { FakeHome } from '../PrivacyUpdate/FakeHome';
import '../PrivacyUpdate/PrivacyUpdate.css';
import './PolicyConsent.css';

/* =========================================================
   协议同意 · 分场景（独立场景）
   ---------------------------------------------------------
   同意记录分两层：
     本机记录：登录前使用，决定首次启动是否弹「个人信息保护指引」；
     账号记录：登录后由服务端判断，决定是否弹「更新提示」（换设备不重复弹）。
   场景：
     first       初次使用 → 指引弹窗；拒绝 → 可进入仅浏览模式
     loggedIn    老用户已登录、账号同意的是旧版 → 更新提示；拒绝 → 退出 APP，保留登录态
     otherDevice 老用户已登录、已在其他设备同意新版 → 直接进入
     expired     老用户登录失效 → 不弹窗，登录页勾选即同意新版；不勾选只是无法登录
   ========================================================= */

type Scenario = 'first' | 'loggedIn' | 'otherDevice' | 'expired';
type Screen = 'splash' | 'login' | 'home' | 'browse';
type SheetKind = 'guide' | 'update' | 'changes';
type ExitKind = 'first' | 'loggedIn';

const SCENARIOS: ReadonlyArray<{ value: Scenario; label: string }> = [
  { value: 'first', label: '初次使用（新安装）' },
  { value: 'loggedIn', label: '老用户 · 已登录' },
  { value: 'otherDevice', label: '老用户 · 已登录（其他设备已同意）' },
  { value: 'expired', label: '老用户 · 登录失效需重新登录' },
];

const isScenario = (v: string | null): v is Scenario => SCENARIOS.some(s => s.value === v);

const DOCS = { service: SERVICE_TERMS_V32, privacy: PRIVACY_V32, share: SHARE_LIST_V32 } as const;
type DocKey = keyof typeof DOCS;

const OLD_VERSION = '3.1';
const SHEET_MS = 320;
const ALERT_MS = 200;

/** 拒绝二次确认文案：两种弹窗的后果不同，分别说明 */
const REJECT_ALERT: Record<ExitKind, { title: string; text: string }> = {
  first: {
    title: '确认不同意？',
    text: '不同意将无法登录和使用设备管理、服务工单等功能。您可以进入仅浏览模式（不收集个人信息），或随时重新查看并同意。',
  },
  loggedIn: {
    title: '确认拒绝？',
    text: '拒绝后 APP 将退出。您的账号与数据不会被删除，登录状态会保留，下次进入时可重新选择。',
  },
};

interface Props {
  scenario: Scenario;
  /** 每次变化都重新执行一次「进入 APP」（演示控制条使用） */
  launchKey: number;
  /** 本机 / 账号同意记录，展示在演示控制条 */
  setDeviceVer: (v: string | null) => void;
  setAccountVer: (v: string | null) => void;
}

function PolicyConsent({ scenario, launchKey, setDeviceVer, setAccountVer }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('splash');
  const [sheetKind, setSheetKind] = useState<SheetKind>('guide');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [exited, setExited] = useState<ExitKind | null>(null);
  const [exitKind, setExitKind] = useState<ExitKind>('first');
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
  const forced = sheetKind !== 'changes'; // 指引 / 更新提示不可关闭；变更说明可关闭

  const openSheet = useCallback((kind: SheetKind) => {
    setSheetKind(kind);
    if (kind !== 'changes') {
      setAgreeService(false);
      setAgreePrivacy(false);
    }
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    setSheetOpen(true);
  }, []);

  /* ── 进入 APP：按场景比对本机 / 账号同意记录 ── */
  const launch = useCallback(() => {
    setExited(null);
    setAlertOpen(false);
    setDocKey(null);
    setSheetOpen(false);
    setAgreeService(false);
    setAgreePrivacy(false);
    if (scenario === 'first') {
      setDeviceVer(null);
      setAccountVer(null);
      setScreen('splash');
      openSheet('guide');
    } else if (scenario === 'loggedIn') {
      setDeviceVer(OLD_VERSION);
      setAccountVer(OLD_VERSION);
      setScreen('home');
      openSheet('update');
    } else if (scenario === 'otherDevice') {
      setDeviceVer(OLD_VERSION);
      setAccountVer(POLICY_VERSION);
      setScreen('home');
      toast(`该账号已在其他设备同意 v${POLICY_VERSION}\n直接进入，不再弹出更新提示`, 2200);
    } else {
      setDeviceVer(OLD_VERSION);
      setAccountVer(OLD_VERSION);
      setScreen('login');
    }
  }, [scenario, openSheet, toast, setDeviceVer, setAccountVer]);

  useEffect(() => {
    launch();
  }, [launch, launchKey]);

  /* ── 强制弹窗：Esc 无效（协议全文、变更说明除外） ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (docKey) setDocKey(null);
      else if (sheetOpen && !forced) setSheetOpen(false);
      else if (sheetOpen) toast('请先阅读并选择同意或拒绝');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [docKey, sheetOpen, forced, toast]);

  const openDoc = (e: React.MouseEvent, key: DocKey) => {
    e.preventDefault();
    e.stopPropagation(); // 协议链接点击不应切换勾选框状态
    setLastDoc(key);
    setDocKey(key);
  };

  /** 未同时勾选两个协议：抖动 + 提示，返回是否通过 */
  const checkAgreed = () => {
    if (bothAgreed) return true;
    shake();
    const miss =
      !agreeService && !agreePrivacy ? '用户服务协议和隐私协议' : !agreeService ? '用户服务协议' : '隐私协议';
    toast('请先阅读并同意' + miss);
    return false;
  };

  const agree = () => {
    if (!checkAgreed()) return;
    setSheetOpen(false);
    if (sheetKind === 'guide') {
      // 首次同意只写本机记录；登录页的勾选默认带上，避免让用户再同意一次
      setDeviceVer(POLICY_VERSION);
      setTimeout(() => {
        setScreen('login');
        setAgreeService(true);
        setAgreePrivacy(true);
        toast('已同意协议，请登录', 1600);
      }, SHEET_MS);
    } else {
      setDeviceVer(POLICY_VERSION);
      setAccountVer(POLICY_VERSION);
      setTimeout(() => toast('已同意更新后的协议，可继续使用 APP', 2000), SHEET_MS);
    }
  };

  const reject = () => {
    setExitKind(sheetKind === 'guide' ? 'first' : 'loggedIn');
    setAlertOpen(true);
  };

  const confirmReject = () => {
    setAlertOpen(false);
    setSheetOpen(false);
    setTimeout(() => setExited(exitKind), 340);
  };

  const login = () => {
    if (!checkAgreed()) return;
    // 登录时把登录页勾选的版本写入账号记录，进入首页后不再弹更新提示
    setDeviceVer(POLICY_VERSION);
    setAccountVer(POLICY_VERSION);
    setScreen('home');
    toast(
      scenario === 'expired'
        ? `登录成功\n已按登录页勾选记录同意 v${POLICY_VERSION}，不再弹出更新提示`
        : '登录成功',
      2200,
    );
  };

  const enterBrowse = () => {
    setExited(null);
    setScreen('browse');
    toast('已进入仅浏览模式', 1600);
  };

  const homeBlocked = screen === 'home' && sheetOpen && forced;
  const rejectAlert = REJECT_ALERT[exitKind];

  return (
    <>
      <StatusBar signal="dots" network="5g" battery={81} />

      {/* ── 背景屏 ── */}
      {screen === 'splash' && (
        <div className="pc-splash">
          <div className="pc-logo">MySANY</div>
          <div className="pc-slogan">让设备管理更简单</div>
        </div>
      )}

      {(screen === 'home' || screen === 'browse') && <FakeHome blocked={homeBlocked} />}

      {screen === 'browse' && (
        <div className="pc-browse">
          <span>仅浏览模式 · 登录及个性化服务不可用</span>
          <button type="button" onClick={() => openSheet('guide')}>
            去同意
          </button>
        </div>
      )}

      {screen === 'login' && (
        <div className="pc-login">
          {scenario === 'expired' && (
            <button className="pc-notice" type="button" onClick={() => openSheet('changes')}>
              <span>
                《用户服务协议》《隐私政策》已于 {POLICY_DATE} 更新
              </span>
              <b>查看变更 ›</b>
            </button>
          )}
          <div className="pc-title">{scenario === 'expired' ? '登录已失效，请重新登录' : '欢迎登录 MySANY'}</div>
          <div className="pc-field">
            <span className="pc-cc">+86</span>
            <span className="pc-ph">请输入手机号</span>
          </div>
          <div className="pc-field">
            <span className="pc-ph">请输入验证码</span>
            <span className="pc-code">获取验证码</span>
          </div>
          <button className="btn btn-primary pc-submit" type="button" onClick={login}>
            登录
          </button>

          {/* 登录页勾选的就是最新版协议 */}
          <div className={'agreements pc-agree' + (shaking && !sheetOpen ? ' shake' : '')}>
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
        </div>
      )}

      {/* 遮罩：强制弹窗点击无效；变更说明点击关闭 */}
      {sheet.mounted && (
        <div
          className={'scrim' + (sheet.shown ? ' is-open' : '')}
          onClick={() => {
            if (docKey) return;
            if (forced) toast('请先阅读并选择同意或拒绝');
            else setSheetOpen(false);
          }}
        />
      )}

      {sheet.mounted && (
        <section
          className={'sheet' + (sheet.shown ? ' is-open' : '')}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pcTitle"
        >
          <div className="up-head">
            <div className="up-title" id="pcTitle">
              {sheetKind === 'guide' ? '个人信息保护指引' : sheetKind === 'update' ? '更新提示' : '协议变更说明'}
            </div>
            <div className="up-sub">
              版本 v{POLICY_VERSION} · {POLICY_DATE} 生效
            </div>
          </div>

          <div className="up-body" ref={bodyRef}>
            {sheetKind === 'guide' ? (
              <>
                <p>
                  欢迎使用 MySANY APP！我们非常重视您的个人信息和隐私保护。在您使用前，请仔细阅读
                  <a href="#" className="doc-link" onClick={e => openDoc(e, 'service')}>
                    《用户服务协议》
                  </a>
                  与
                  <a href="#" className="doc-link" onClick={e => openDoc(e, 'privacy')}>
                    《隐私政策》
                  </a>
                  ，重点了解：
                </p>
                <ol>
                  <li>
                    我们收集的个人信息类型、用途，以及接入的第三方 SDK（见
                    <a href="#" className="doc-link" onClick={e => openDoc(e, 'share')}>
                      《个人信息共享清单》
                    </a>
                    ）；
                  </li>
                  <li>设备定位、工况数据等权限仅在您使用相关功能时申请，您可随时关闭；</li>
                  <li>您可以查询、更正、删除个人信息，撤回授权或注销账号。</li>
                </ol>
                <p>在您同意前，我们不会收集您的个人信息。</p>
              </>
            ) : (
              <>
                <p>
                  {sheetKind === 'update'
                    ? '尊敬的用户，感谢您使用 MySANY APP。为了更好地保障您的用户权益，我们对《用户服务协议》与《隐私政策》进行了优化更新。本次更新主要涉及以下内容：'
                    : '本次《用户服务协议》与《隐私政策》更新主要涉及以下内容，登录即表示您同意更新后的协议：'}
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
              </>
            )}
            <p>如果您有任何疑问或需要任何帮助，欢迎随时联系我们（400-887-8318），我们将竭诚为您解答。</p>
          </div>
          <div className="up-fade" aria-hidden="true" />

          {forced ? (
            <>
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
                <button className="btn btn-ghost" type="button" onClick={reject}>
                  {sheetKind === 'guide' ? '不同意' : '拒绝'}
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
            </>
          ) : (
            <div className="up-foot">
              <button className="btn btn-primary" type="button" onClick={() => setSheetOpen(false)}>
                我知道了
              </button>
            </div>
          )}
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
          <div className="alert" role="alertdialog" aria-modal="true" aria-labelledby="pcAlertTitle">
            <div className="alert-body">
              <div className="alert-title" id="pcAlertTitle">
                {rejectAlert.title}
              </div>
              <div className="alert-text">{rejectAlert.text}</div>
            </div>
            <div className="alert-foot">
              <button className="a-cancel" type="button" onClick={() => setAlertOpen(false)}>
                再看看
              </button>
              <button className="a-ok" type="button" onClick={confirmReject}>
                {exitKind === 'first' ? '仍不同意' : '仍然拒绝'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 拒绝后：初次使用 → 可选仅浏览；老用户 → 退出 APP，保留登录态 */}
      <div className={'exited' + (exited ? ' is-open' : '')}>
        <div className="ex-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" strokeLinecap="round" />
            <path d="M9 8l-4 4 4 4M5 12h11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {exited === 'first' ? (
          <>
            <div className="ex-title">暂未同意协议</div>
            <div className="ex-text">
              未同意《用户服务协议》与《隐私政策》前，无法登录及使用设备管理、服务工单等功能。您可以先以仅浏览模式了解
              MySANY，该模式不收集个人信息。
            </div>
            <button className="btn btn-primary" type="button" onClick={enterBrowse}>
              进入仅浏览模式
            </button>
            <button className="btn btn-ghost" type="button" onClick={launch}>
              重新查看协议
            </button>
          </>
        ) : (
          <>
            <div className="ex-title">已退出 MySANY</div>
            <div className="ex-text">
              您未同意更新后的《用户服务协议》与《隐私政策》，暂时无法使用 APP。账号与数据不会被删除，登录状态已保留，下次进入时仍可同意。
            </div>
            <button className="btn btn-primary" type="button" onClick={launch}>
              重新进入 APP
            </button>
            <div className="pc-ex-links">
              <button type="button" onClick={() => toast('客服电话 400-887-8318')}>
                联系客服
              </button>
              <i />
              <button type="button" onClick={() => navigate(PATHS.cancellation)}>
                申请注销账号
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function PolicyConsentPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('scenario');
  const scenario: Scenario = isScenario(q) ? q : 'first';
  const [launchKey, setLaunchKey] = useState(0);
  const [deviceVer, setDeviceVer] = useState<string | null>(null);
  const [accountVer, setAccountVer] = useState<string | null>(null);

  const fmt = (v: string | null) => (v ? 'v' + v : '无');

  return (
    <DeviceFrame
      className="pg-privacy pg-consent"
      demo={
        <DemoBar>
          <DemoSelect
            label="场景"
            value={scenario}
            options={SCENARIOS}
            onChange={v => setParams({ scenario: v }, { replace: true })}
          />
          <DemoText>
            线上 v{POLICY_VERSION} ／ 本机 {fmt(deviceVer)} ／ 账号 {accountVer ? 'v' + accountVer : '未登录'}
          </DemoText>
          <DemoButton onClick={() => setLaunchKey(k => k + 1)}>重放当前场景</DemoButton>
        </DemoBar>
      }
    >
      <PolicyConsent
        scenario={scenario}
        launchKey={launchKey}
        setDeviceVer={setDeviceVer}
        setAccountVer={setAccountVer}
      />
    </DeviceFrame>
  );
}
