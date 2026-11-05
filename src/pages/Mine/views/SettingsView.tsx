import { useNavigate } from 'react-router-dom';
import { ChevronRight } from '@/components/icons';
import { settingsSummary } from '@/flows/cancellation';
import { PATHS } from '@/router/paths';
import { useMine } from '../MineContext';

const Chev = () => (
  <span className="pf-chev">
    <ChevronRight />
  </span>
);

/** 设置 */
export function SettingsView() {
  const { settings, toast, push, openSheet, confirm } = useMine();
  const navigate = useNavigate();
  const cancelSummary = settingsSummary();

  return (
    <>
      <div className="pf-list">
        <div className="pf-row" onClick={() => openSheet('lang')}>
          <span className="pf-lbl">语言</span>
          <span className="pf-val">{settings.lang}</span>
          <Chev />
        </div>

        <div className="pf-row" onClick={() => push('privacySettings')}>
          <span className="pf-lbl">隐私设置</span>
          <Chev />
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

        <div className="pf-row" onClick={() => toast('已清除缓存 32.6MB')}>
          <span className="pf-lbl">清除缓存</span>
        </div>

        <div className="pf-row" onClick={() => toast('已是最新版本 V4.9.45')}>
          <span className="pf-lbl">当前版本</span>
          <span className="pf-val">V4.9.45</span>
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
