import { useNavigate } from 'react-router-dom';
import { ChevronRight } from '@/components/icons';
import { settingsSummary } from '@/flows/cancellation';
import { consentShortSummary, saveConsent } from '@/mock/cookieConsent';
import { PATHS } from '@/router/paths';
import { useMine } from '../MineContext';
import { Switch } from '../parts';

const Chev = () => (
  <span className="pf-chev">
    <ChevronRight />
  </span>
);

/** 设置 */
export function SettingsView() {
  const { settings, setSettings, toast, push, openSheet, confirm } = useMine();
  const navigate = useNavigate();
  const cancelSummary = settingsSummary();

  const setFlag = (k: 'push' | 'force', v: boolean, on: string, off: string) => {
    setSettings(s => ({ ...s, [k]: v }));
    toast(v ? on : off);
  };

  /** 个性化广告与 Cookie「广告营销」类别联动 */
  const setMarketingConsent = (value: boolean) => {
    setSettings(s => {
      const next = { ...s.cookies, marketing: value };
      saveConsent(next, value ? 'marketing_enable' : 'marketing_disable');
      return { ...s, ads: value, cookies: next };
    });
    toast(value ? '已开启个性化广告' : '已关闭个性化广告');
  };

  return (
    <>
      <div className="pf-list">
        <div className="pf-row" onClick={() => openSheet('lang')}>
          <span className="pf-lbl">语言</span>
          <span className="pf-val">{settings.lang}</span>
          <Chev />
        </div>

        <div className="pf-row">
          <span className="pf-lbl">消息推送</span>
          <Switch on={settings.push} onChange={v => setFlag('push', v, '已开启消息推送', '已关闭消息推送')} />
        </div>

        <div className="pf-row is-col">
          <div className="pf-line">
            <span className="pf-lbl">个性化广告</span>
            <Switch
              on={settings.ads}
              onChange={() =>
                confirm({
                  t: '“MySANY”个性化广告',
                  m: '关闭个性化广告将限制sanvist向你推送相关广告的能力，但不会减少你收到的广告数量。',
                  cancel: '不允许',
                  ok: '允许',
                  onCancel: () => setMarketingConsent(false),
                  onOk: () => setMarketingConsent(true),
                })
              }
            />
          </div>
          <p className="pf-desc">
            关闭个性化广告将限制sanvist向你推送相关广告的能力，但不会减少你收到的广告数量。
          </p>
        </div>

        <div className="pf-row" onClick={() => push('cookies')}>
          <span className="pf-lbl">Cookie 设置</span>
          <span className="pf-val cookie-summary">{consentShortSummary(settings.cookies)}</span>
          <Chev />
        </div>

        <div className="pf-row">
          <span className="pf-lbl">强制解除提醒</span>
          <Switch
            on={settings.force}
            onChange={v => setFlag('force', v, '已开启强制解除提醒', '已关闭强制解除提醒')}
          />
        </div>

        <div className="pf-row" onClick={() => toast('已是最新版本 V4.9.45')}>
          <span className="pf-lbl">当前版本</span>
          <span className="pf-val">V4.9.45</span>
        </div>

        <div className="pf-row" onClick={() => push('help')}>
          <span className="pf-lbl">使用帮助</span>
          <Chev />
        </div>

        <div className="pf-row is-tall" onClick={() => toast('拨打 0086-4006098318')}>
          <span className="pf-lbl">服务电话</span>
          <div className="pf-vals">
            <div className="pf-val">0086-4006098318</div>
            <div className="pf-val2">Beijing Time 9:00-18:00(GMT+8)</div>
          </div>
        </div>

        <div className="pf-row" onClick={() => navigate(PATHS.cancellation)}>
          <span className="pf-lbl">注销申请</span>
          {cancelSummary && <span className="pf-val cookie-summary">{cancelSummary}</span>}
          <Chev />
        </div>

        <div className="pf-row" onClick={() => push('privacy')}>
          <span className="pf-lbl">隐私协议</span>
          <Chev />
        </div>

        <div className="pf-row" onClick={() => push('terms')}>
          <span className="pf-lbl">用户服务协议</span>
          <Chev />
        </div>

        <div className="pf-row" onClick={() => toast('已清除缓存 32.6MB')}>
          <span className="pf-lbl">清除缓存</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div className="st-foot">
        <button className="btn-tenant" onClick={() => openSheet('account')}>
          切换租户
        </button>
        <button
          className="btn-exit"
          onClick={() =>
            confirm({
              t: '确认退出登录？',
              m: '退出后将不再接收设备告警推送。',
              ok: '退出',
              onOk: () => {
                toast('已退出登录', 900);
                setTimeout(() => navigate(PATHS.login), 800);
              },
            })
          }
        >
          退出
        </button>
      </div>
    </>
  );
}
