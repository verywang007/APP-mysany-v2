import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/Toast/useToast';
import { COOKIE_CATALOG, type OptionalCategory } from '@/data/cookieCatalog';
import {
  COOKIE_DEFAULTS,
  consentResultSummary,
  readConsent,
  saveConsent,
  type ConsentAction,
  type CookieCategory,
  type CookieChoices,
} from '@/mock/cookieConsent';
import './CookieSheet.css';

/* =========================================================
   Cookie 授权弹层（EU 合规）
   ---------------------------------------------------------
   只负责遮罩 + 底部面板，不渲染背景。
   登录页在授权完成前用它：弹层不可关闭，必须选择
   「全部接受 / 全部拒绝」或进入 Cookies 管理；
   完成后通过 onDone 通知父级继续下一步。
   ========================================================= */

export type Panel = 'main' | 'preferences' | 'policy';

const OPTIONAL_CARDS: { key: OptionalCategory; title: string; desc: string; vendor: string }[] = [
  {
    key: 'functional',
    title: '功能体验',
    desc: '记住语言、地区和界面偏好，并提供地图等增强功能。',
    vendor: '示例：语言偏好、地图服务 · 2 个合作方',
  },
  {
    key: 'analytics',
    title: '分析统计',
    desc: '帮助了解功能使用情况、崩溃和性能问题，以改进产品。',
    vendor: '示例：使用分析、崩溃分析 · 2 个合作方',
  },
  {
    key: 'marketing',
    title: '广告营销',
    desc: '用于营销归因、个性化广告及广告效果衡量。',
    vendor: '示例：广告 ID、营销归因 · 2 个合作方',
  },
];

const CLOSE_MS = 280;

export interface CookieSheetProps {
  /** 授权完成回调：父级据此解锁登录页 / 进入下一步 */
  onDone: (choices: CookieChoices) => void;
}

export function CookieSheet({ onDone }: CookieSheetProps) {
  const toast = useToast();

  const [choices, setChoices] = useState<CookieChoices>(() => ({
    ...COOKIE_DEFAULTS,
    ...readConsent()?.choices,
  }));
  const [panel, setPanel] = useState<Panel>('main');
  const [lastPanel, setLastPanel] = useState<Exclude<Panel, 'policy'>>('main');
  const [detail, setDetail] = useState<CookieCategory>('necessary');
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  /** 切换面板后是否把焦点移到面板首个按钮（首次打开不移动） */
  const moveFocus = useRef(false);
  const focusTargets = {
    main: useRef<HTMLButtonElement>(null),
    preferences: useRef<HTMLButtonElement>(null),
    policy: useRef<HTMLButtonElement>(null),
  };

  const showPanel = useCallback((name: Panel, focus = true) => {
    setPanel(name);
    if (name !== 'policy') setLastPanel(name);
    moveFocus.current = focus;
  }, []);

  useEffect(() => {
    if (moveFocus.current) focusTargets[panel].current?.focus();
  }, [panel]); // eslint-disable-line react-hooks/exhaustive-deps -- refs 稳定

  const closeSheet = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), CLOSE_MS);
  };

  const finish = (next: CookieChoices, action: ConsentAction) => {
    setChoices(next);
    saveConsent(next, action);
    closeSheet();
    toast(consentResultSummary(next) + '\n核心功能可正常使用', 2200);
    setTimeout(() => onDone(next), CLOSE_MS + 120);
  };

  const setAll = (value: boolean): CookieChoices => ({
    necessary: true,
    functional: value,
    analytics: value,
    marketing: value,
  });
  const blockedHint = () => toast('请选择“全部接受”“全部拒绝”或 Cookies 管理');

  const openDetail = (key: CookieCategory) => {
    setDetail(key);
    showPanel('policy');
  };

  /* Esc：详情 → 返回上一面板；管理 → 返回主面板；主面板 → 提示必须选择 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !visible) return;
      e.preventDefault();
      if (panel === 'policy') showPanel(lastPanel);
      else if (panel === 'preferences') showPanel('main');
      else toast('请选择“全部接受”“全部拒绝”或 Cookies 管理');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, panel, lastPanel, showPanel, toast]);

  const group = COOKIE_CATALOG[detail];

  if (!visible) return null;

  return (
    <div className="cookie-sheet">
      <div className={'scrim' + (closing ? ' is-closing' : '')} onClick={blockedHint} />
      <section
        className={'sheet' + (closing ? ' is-closing' : '')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogTitle"
      >
        <div className="grabber" aria-hidden="true" />

        {/* 主面板 */}
        <div className="sheet-panel" hidden={panel !== 'main'}>
          <div className="intro">
            <div className="cookie-mark" aria-hidden="true">
              ◔
            </div>
            <h2 id="dialogTitle">您的隐私，由您决定</h2>
            <p>
              我们使用必要技术保障登录、安全和核心功能。经您允许，我们还会使用功能、分析和营销技术来改善体验。拒绝非必要
              Cookie 不影响 APP 的核心功能。
            </p>
            <div className="intro-links">
              <button className="text-link" type="button" onClick={() => showPanel('preferences')}>
                Cookies 管理
              </button>
            </div>
          </div>
          <div className="required-note">
            严格必要 Cookie 始终启用；其他类别默认关闭，只有在您主动同意后才会运行。
          </div>
          <div className="actions">
            <div className="decision-row">
              <button
                ref={focusTargets.main}
                className="btn btn-manage"
                type="button"
                onClick={() => finish(setAll(false), 'reject_all')}
              >
                全部拒绝
              </button>
              <button
                className="btn btn-manage"
                type="button"
                onClick={() => finish(setAll(true), 'accept_all')}
              >
                全部接受
              </button>
            </div>
          </div>
        </div>

        {/* Cookies 管理 */}
        <div className="sheet-panel" hidden={panel !== 'preferences'}>
          <div className="sheet-head">
            <button
              ref={focusTargets.preferences}
              className="back"
              type="button"
              onClick={() => showPanel('main')}
            >
              返回
            </button>
            <span className="sheet-title">Cookies 管理</span>
            <span className="head-spacer" />
          </div>
          <div className="preference-scroll">
            <p className="pref-lead">
              您可以按用途控制非必要技术。选择会保存在本设备，并可随时在“我—设置—Cookie 设置”中修改。
            </p>
            <article className="pref-card">
              <div className="pref-line">
                <div className="pref-copy">
                  <strong>严格必要</strong>
                  <p>用于登录会话、安全认证、网络负载及保存隐私选择。</p>
                </div>
                <span className="always">始终启用</span>
              </div>
              <div className="vendor">保存期限：会话期至 12 个月 · 不用于广告</div>
              <button className="detail-link" type="button" onClick={() => openDetail('necessary')}>
                查看 Cookie 详情
              </button>
            </article>
            {OPTIONAL_CARDS.map(c => (
              <article className="pref-card" key={c.key}>
                <div className="pref-line">
                  <div className="pref-copy">
                    <strong>{c.title}</strong>
                    <p>{c.desc}</p>
                  </div>
                  <button
                    className="switch"
                    type="button"
                    role="switch"
                    aria-checked={choices[c.key]}
                    aria-label={c.title}
                    onClick={() => setChoices(s => ({ ...s, [c.key]: !s[c.key] }))}
                  />
                </div>
                <div className="vendor">{c.vendor}</div>
                <button className="detail-link" type="button" onClick={() => openDetail(c.key)}>
                  查看 Cookie 详情
                </button>
              </article>
            ))}
          </div>
          <div className="preference-actions">
            <button
              className="btn btn-save"
              type="button"
              onClick={() => finish(choices, 'save_preferences')}
            >
              保存我的选择
            </button>
            <div className="quick-actions">
              <button
                className="btn btn-small"
                type="button"
                onClick={() => finish(setAll(false), 'reject_all')}
              >
                全部拒绝
              </button>
              <button
                className="btn btn-small"
                type="button"
                onClick={() => finish(setAll(true), 'accept_all')}
              >
                全部接受
              </button>
            </div>
          </div>
        </div>

        {/* Cookie 详情 */}
        <div className="sheet-panel" hidden={panel !== 'policy'}>
          <div className="sheet-head">
            <button
              ref={focusTargets.policy}
              className="back"
              type="button"
              onClick={() => showPanel(lastPanel)}
            >
              返回
            </button>
            <span className="sheet-title">{group.title}</span>
            <span className="head-spacer" />
          </div>
          <div className="policy-scroll">
            <p className="detail-note">
              {group.brief} 共 {group.items.length} 项。
            </p>
            {group.items.map(item => (
              <article className="cookie-record" key={item.name}>
                <div className="cookie-record-head">
                  <code>{item.name}</code>
                  <span>{item.duration}</span>
                </div>
                <dl>
                  <div>
                    <dt>提供方</dt>
                    <dd>{item.provider}</dd>
                  </div>
                  <div>
                    <dt>类型</dt>
                    <dd>{item.type}</dd>
                  </div>
                  <div>
                    <dt>作用</dt>
                    <dd>{item.purpose}</dd>
                  </div>
                </dl>
              </article>
            ))}
            <p>本页为原型示例，正式上线前应替换为实际 Cookie、SDK 标识和供应商信息。</p>
          </div>
          <div className="policy-foot">
            <button className="btn btn-manage" type="button" onClick={() => showPanel(lastPanel)}>
              完成
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
