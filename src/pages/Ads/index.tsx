import { useEffect, useRef, useState } from 'react';
import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { BatteryIcon, SignalIcon, WifiIcon } from '@/components/StatusBar/StatusBar';
import { useToast } from '@/components/Toast/useToast';
import { Skyline } from './Skyline';
import './Ads.css';

/* =========================================================
   个性化广告授权（独立场景：APP 启动时的系统授权弹窗）
   ========================================================= */

/** 弹窗文案（需求原文） */
const ADS_ALERT = {
  t: '“MySANY”个性化广告',
  m: '关闭个性化广告将限制sanvist向你推送相关广告的能力，但不会减少你收到的广告数量。',
  cancel: '不允许',
  ok: '允许',
};

function Ads() {
  const toast = useToast();
  const [open, setOpen] = useState(true);
  const reopen = useRef(0);
  useEffect(() => () => clearTimeout(reopen.current), []);

  /* 选择后关闭，稍后重新弹出，便于反复演示 */
  const choose = (ok: boolean) => {
    setOpen(false);
    toast(ok ? '已开启个性化广告' : '已关闭个性化广告\n广告数量不会因此减少');
    reopen.current = window.setTimeout(() => setOpen(true), 1400);
  };

  return (
    <>
      <Skyline />

      {/* 状态栏（含灵动岛 / 返回 App Store） */}
      <div className="sbar">
        <div className="sbar-l">
          <span className="sbar-time">11:45</span>
          <span className="sbar-back">
            <svg viewBox="0 0 8 11" aria-hidden="true">
              <path d="M7.6 0L0 5.5l7.6 5.5z" />
            </svg>
            App Store
          </span>
        </div>
        <div className="sbar-r">
          <SignalIcon variant="bars" />
          <WifiIcon />
          <BatteryIcon level={36} />
        </div>
        <div className="island">
          <span className="il-app">
            <i />
          </span>
          <span className="il-pic" />
        </div>
      </div>

      {/* 分页圆点 */}
      <div className="dots">
        <i />
        <i />
      </div>

      {/* 系统授权弹窗 */}
      {open && (
        <div className="alert-wrap">
          <div className="alert">
            <div className="alert-t">{ADS_ALERT.t}</div>
            <p className="alert-m">{ADS_ALERT.m}</p>
            <div className="alert-btns">
              <button className="alert-btn" onClick={() => choose(false)}>
                {ADS_ALERT.cancel}
              </button>
              <button className="alert-btn primary" onClick={() => choose(true)}>
                {ADS_ALERT.ok}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdsPage() {
  return (
    <DeviceFrame className="pg-ads kit" toastDuration={1600}>
      <Ads />
    </DeviceFrame>
  );
}
