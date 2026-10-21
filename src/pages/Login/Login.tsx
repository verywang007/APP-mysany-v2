import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/BottomSheet/BottomSheet';
import { ChevronRight, TickIcon } from '@/components/icons';
import { LegalDocBody } from '@/components/LegalDocBody';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { useToast } from '@/components/Toast/useToast';
import { COUNTRIES, type Country } from '@/data/countries';
import { PRIVACY_LOGIN, SERVICE_TERMS } from '@/data/legal';
import { nextAfterLogin } from '@/flows/login';
import { useResendTimer } from '@/hooks/useResendTimer';
import { useRetrigger } from '@/hooks/useRetrigger';
import logoUrl from '@/assets/sany-logo.svg';
import { CountrySheet } from './CountrySheet';
import { ClearIcon, EyeIcon, FlagIcon, LockIcon, PhoneIcon, ShieldIcon, SocialIcon, UserIcon } from './icons';

/* =========================================================
   登录页
   ---------------------------------------------------------
   核心规则：用户服务协议 + 隐私协议 两个复选框 **都勾选**
            登录按钮才会高亮（品牌红），否则保持未激活的浅红。
   ========================================================= */

type LoginTab = 'phone' | 'account';
type DocKey = 'service' | 'privacy';

interface LoginProps {
  /** 锁定模式：开启后所有交互禁用，仅作背景展示（Cookie 授权未完成时使用） */
  locked?: boolean;
}

const DOCS = { service: SERVICE_TERMS, privacy: PRIVACY_LOGIN } as const;
const SOCIALS = ['微信', 'Facebook', 'Google', 'Apple'];

const digits = (v: string) => v.replace(/\D/g, '');

export function Login({ locked = false }: LoginProps = {}) {
  const toast = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<LoginTab>('phone');
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [seconds, startTimer, resetTimer] = useResendTimer(60);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, shake] = useRetrigger(420);

  const [sheet, setSheet] = useState<'country' | 'doc' | null>(null);
  const [countrySheetKey, setCountrySheetKey] = useState(0);
  const [docKey, setDocKey] = useState<DocKey>('service');

  const phoneInput = useRef<HTMLInputElement>(null);
  const bothAgreed = agreeService && agreePrivacy;
  const phoneOk = (() => {
    const v = digits(phone);
    return country.dial === '86' ? v.length === 11 && /^1/.test(v) : v.length >= 5;
  })();

  /* 锁定模式下：账号/密码 Tab 禁用，强制停留在手机号 Tab。
     原因：cookie 未完成前不允许账号密码登录（需求约束）。 */
  useEffect(() => {
    if (locked && tab !== 'phone') setTab('phone');
  }, [locked, tab]);

  const lockToast = () => toast('请先完成 Cookie 授权');

  /* ── 顶部 Tab 下划线：宽度固定 24px，居中于当前 tab 文字 ── */
  const tabRefs = useRef<Record<LoginTab, HTMLButtonElement | null>>({ phone: null, account: null });
  const [ink, setInk] = useState({ x: 5, w: 24 });
  const moveInk = useCallback(() => {
    const el = tabRefs.current[tab];
    if (!el) return;
    setInk({ x: el.offsetLeft + (el.offsetWidth - 24) / 2, w: 24 });
  }, [tab]);
  useLayoutEffect(() => {
    // 字号变化后再定位下划线
    const raf = requestAnimationFrame(moveInk);
    window.addEventListener('resize', moveInk);
    document.fonts?.ready.then(moveInk);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', moveInk);
    };
  }, [moveInk]);

  /* ── 验证码 ─────────────────────────────────────────── */
  const resetCode = () => {
    resetTimer();
    setCode('');
    setSentCode(null);
  };

  const sendCode = () => {
    if (seconds) return;
    if (!phoneOk) {
      toast(country.dial === '86' ? '请输入 11 位手机号码' : '请输入正确的手机号码');
      phoneInput.current?.focus();
      return;
    }
    const c = '123456';
    setSentCode(c);
    toast('验证码已发送\n演示验证码：' + c, 2600);
    startTimer();
  };

  /* ── 协议 ───────────────────────────────────────────── */
  const openDoc = (e: React.MouseEvent, key: DocKey) => {
    e.preventDefault();
    e.stopPropagation(); // 避免点链接时连带切换 label 的复选框
    setDocKey(key);
    setSheet('doc');
  };

  const agreeDoc = () => {
    if (docKey === 'service') setAgreeService(true);
    if (docKey === 'privacy') setAgreePrivacy(true);
    setSheet(null);
  };

  /** 未同时勾选两个协议：抖动提示，返回 false */
  const requireAgreed = (msg?: string) => {
    if (bothAgreed) return true;
    shake();
    const miss =
      !agreeService && !agreePrivacy ? '用户服务协议和隐私协议' : !agreeService ? '用户服务协议' : '隐私协议';
    toast(msg ?? '请先阅读并同意' + miss);
    return false;
  };

  /* ── 提交 ───────────────────────────────────────────── */
  const fieldError = (): string | null => {
    if (tab === 'phone') {
      if (!phoneOk) return '请输入正确的手机号码';
      if (code.length < 4) return '请输入验证码';
      if (sentCode && code !== sentCode) return '验证码不正确';
      return null;
    }
    if (!account.trim()) return '请输入账号';
    if (!password) return '请输入密码';
    return null;
  };

  const submit = () => {
    if (loading || locked) return;
    if (!requireAgreed()) return;
    const err = fieldError();
    if (err) {
      toast(err);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast('登录成功，欢迎回来 👋', 2200);
      setTimeout(() => navigate(nextAfterLogin()), 600);
    }, 1200);
  };

  /** 回车提交 */
  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const doc = DOCS[docKey];

  return (
    <>
      <StatusBar padHour={false} signal="dots" network="5g" battery={83} />

      <main className={'page' + (locked ? ' is-locked' : '')} aria-hidden={locked}>
        <img className="logo" src={logoUrl} alt="SANY" width="73" height="15" />

        {/* 登录方式切换 */}
        <div className="tabs" role="tablist">
          {(
            [
              ['phone', '手机'],
              ['account', '账号'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              ref={el => {
                tabRefs.current[k] = el;
              }}
              className={
                'tab' +
                (tab === k ? ' is-active' : '') +
                (locked ? ' is-locked' : '')
              }
              role="tab"
              aria-selected={tab === k}
              aria-disabled={locked}
              onClick={() => {
                if (locked) {
                  lockToast();
                  return;
                }
                setTab(k);
              }}
            >
              {label}
            </button>
          ))}
          <span
            className="tab-ink"
            aria-hidden="true"
            style={{ '--ink-x': ink.x + 'px', '--ink-w': ink.w + 'px' } as CSSProperties}
          />
        </div>

        {/* 手机号登录 */}
        <section
          className={'panel' + (tab === 'phone' ? ' is-active' : '')}
          role="tabpanel"
          hidden={tab !== 'phone'}
        >
          <button
            className="field field-tap"
            type="button"
            disabled={locked}
            aria-disabled={locked}
            onClick={() => {
              if (locked) {
                lockToast();
                return;
              }
              setCountrySheetKey(k => k + 1);
              setSheet('country');
            }}
          >
            <FlagIcon />
            <span className="f-value">{country.name}</span>
            <ChevronRight className="chev" />
          </button>

          <label className="field">
            <PhoneIcon />
            <span className="f-dial">+{country.dial}</span>
            <input
              ref={phoneInput}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={11}
              placeholder="手机号码"
              value={phone}
              readOnly={locked}
              onChange={e => setPhone(digits(e.target.value))}
              onKeyDown={onEnter}
              onFocus={() => locked && lockToast()}
            />
            <button
              className="f-clear"
              type="button"
              aria-label="清空"
              hidden={!phone || locked}
              onClick={e => {
                e.preventDefault();
                setPhone('');
                phoneInput.current?.focus();
              }}
            >
              <ClearIcon />
            </button>
          </label>

          <label className="field">
            <ShieldIcon />
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="验证码"
              value={code}
              readOnly={locked}
              onChange={e => setCode(digits(e.target.value))}
              onKeyDown={onEnter}
              onFocus={() => locked && lockToast()}
            />
            <button
              className={'f-action' + (seconds ? ' is-counting' : phoneOk ? ' is-ready' : '')}
              type="button"
              disabled={locked}
              aria-disabled={locked}
              onClick={() => (locked ? lockToast() : sendCode())}
            >
              {seconds ? seconds + 's 后重发' : '获取验证码'}
            </button>
          </label>
        </section>

        {/* 账号登录 */}
        <section
          className={'panel' + (tab === 'account' ? ' is-active' : '')}
          role="tabpanel"
          hidden={tab !== 'account'}
        >
          <label className="field">
            <UserIcon />
            <input
              type="text"
              autoComplete="username"
              placeholder="账号 / 邮箱"
              value={account}
              readOnly={locked}
              onChange={e => setAccount(e.target.value)}
              onKeyDown={onEnter}
              onFocus={() => locked && lockToast()}
            />
          </label>

          <label className="field">
            <LockIcon />
            <input
              type={showPwd ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="密码"
              value={password}
              readOnly={locked}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={onEnter}
              onFocus={() => locked && lockToast()}
            />
            <button
              className="f-icon"
              type="button"
              aria-label="显示密码"
              aria-pressed={showPwd}
              disabled={locked}
              aria-disabled={locked}
              onClick={() => (locked ? lockToast() : setShowPwd(v => !v))}
            >
              <EyeIcon off={showPwd} />
            </button>
          </label>

          <div className="row-forgot">
            <a
              href="#"
              aria-disabled={locked}
              onClick={e => {
                e.preventDefault();
                if (locked) {
                  lockToast();
                  return;
                }
                toast('请通过手机号验证码找回密码');
              }}
            >
              忘记密码?
            </a>
          </div>
        </section>

        {/* 协议勾选：两行，各自独立复选框 */}
        <div className={'agreements' + (shaking ? ' shake' : '')}>
          <label className={'agree' + (locked ? ' is-locked' : '')}>
            <input
              className="cb-input"
              type="checkbox"
              checked={agreePrivacy}
              disabled={locked}
              onChange={e => setAgreePrivacy(e.target.checked)}
            />
            <span className="cb" aria-hidden="true">
              <TickIcon />
            </span>
            <span className="agree-txt">
              已阅读并知悉《
              <a
                href="#"
                className="doc-link"
                aria-disabled={locked}
                onClick={e => {
                  if (locked) {
                    e.preventDefault();
                    lockToast();
                    return;
                  }
                  openDoc(e, 'privacy');
                }}
              >
                隐私政策
              </a>
              》
            </span>
          </label>
          <label className={'agree' + (locked ? ' is-locked' : '')}>
            <input
              className="cb-input"
              type="checkbox"
              checked={agreeService}
              disabled={locked}
              onChange={e => setAgreeService(e.target.checked)}
            />
            <span className="cb" aria-hidden="true">
              <TickIcon />
            </span>
            <span className="agree-txt">
              已阅读并同意《
              <a
                href="#"
                className="doc-link"
                aria-disabled={locked}
                onClick={e => {
                  if (locked) {
                    e.preventDefault();
                    lockToast();
                    return;
                  }
                  openDoc(e, 'service');
                }}
              >
                用户协议
              </a>
              》
            </span>
          </label>
        </div>

        <button
          className={
            'btn-login' +
            (bothAgreed ? '' : ' is-disabled') +
            (loading ? ' is-loading' : '') +
            (locked ? ' is-locked' : '')
          }
          type="button"
          aria-disabled={!bothAgreed || locked}
          onClick={() => (locked ? lockToast() : submit())}
        >
          <span className="btn-label">{loading ? '登录中' : '登录'}</span>
          <span className="spinner" aria-hidden="true" />
        </button>

        {/* 第三方登录 */}
        <div className="socials">
          {SOCIALS.map(name => (
            <button
              key={name}
              className={'social' + (locked ? ' is-locked' : '')}
              type="button"
              disabled={locked}
              aria-disabled={locked}
              onClick={() => {
                if (locked) {
                  lockToast();
                  return;
                }
                if (requireAgreed('请先阅读并同意用户服务协议和隐私协议')) {
                  toast('正在唤起 ' + name + ' 授权…');
                }
              }}
            >
              <SocialIcon name={name} />
            </button>
          ))}
        </div>

        <div className="foot">
          还没有账号?
          <a
            href="#"
            aria-disabled={locked}
            onClick={e => {
              e.preventDefault();
              if (locked) {
                lockToast();
                return;
              }
              toast('跳转注册页（原型暂未实现）');
            }}
          >
            注册
          </a>
        </div>
      </main>

      <CountrySheet
        key={countrySheetKey}
        open={sheet === 'country'}
        current={country}
        onClose={() => setSheet(null)}
        onPick={c => {
          setCountry(c);
          setPhone('');
          resetCode();
          setSheet(null);
        }}
      />

      <BottomSheet
        open={sheet === 'doc'}
        onClose={() => setSheet(null)}
        title={doc.title}
        cancelText="关闭"
        className="sheet-doc"
      >
        <div className="doc-body" key={docKey}>
          <LegalDocBody
            doc={doc}
            tail={<p style={{ marginTop: 14, color: '#9A9AA0' }}>（原型演示文本，不构成正式法律文件。）</p>}
          />
        </div>
        <div className="doc-foot">
          <button className="btn-login" type="button" onClick={agreeDoc}>
            <span className="btn-label">同意并继续</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
