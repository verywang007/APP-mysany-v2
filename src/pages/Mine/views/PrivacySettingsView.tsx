import { ChevronRight } from '@/components/icons';
import { saveConsent } from '@/mock/cookieConsent';
import { useMine } from '../MineContext';
import { Switch } from '../parts';

const Chev = () => <span className="pf-chev"><ChevronRight /></span>;

export function PrivacySettingsView() {
  const { settings, setSettings, toast, push } = useMine();
  const setFlag = (k: 'push' | 'force', v: boolean, on: string, off: string) => {
    setSettings(s => ({ ...s, [k]: v }));
    toast(v ? on : off);
  };

  /** 个性化推荐与 Cookie「广告营销」类别联动 */
  const setMarketingConsent = (value: boolean) => {
    setSettings(s => {
      const next = { ...s.cookies, marketing: value };
      saveConsent(next, value ? 'marketing_enable' : 'marketing_disable');
      return { ...s, ads: value, cookies: next };
    });
    toast(value ? '已开启个性化推荐' : '已关闭个性化推荐');
  };

  return (
    <div className="pf-list">
        <div className="pf-row">
          <span className="pf-lbl">消息推送</span>
          <Switch on={settings.push} onChange={v => setFlag('push', v, '已开启消息推送', '已关闭消息推送')} />
        </div>

        <div className="pf-row is-col">
          <div className="pf-line">
            <span className="pf-lbl">个性化推荐</span>
            <Switch
              on={settings.ads}
              onChange={setMarketingConsent}
            />
          </div>
          <p className="pf-desc">
            根据您的浏览记录，为您推荐相关产品及资讯信息
          </p>
        </div>

        <div className="pf-row">
          <span className="pf-lbl">强制解除提醒</span>
          <Switch
            on={settings.force}
            onChange={v => setFlag('force', v, '已开启强制解除提醒', '已关闭强制解除提醒')}
          />
        </div>

        <div className="pf-row" onClick={() => push('privacy')}>
          <span className="pf-lbl">隐私协议</span>
          <Chev />
        </div>

        <div className="pf-row" onClick={() => push('terms')}>
          <span className="pf-lbl">用户服务协议</span>
          <Chev />
        </div>

    </div>
  );
}
