import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BottomSheet, SheetBody } from '@/components/BottomSheet/BottomSheet';
import { CheckIcon } from '@/components/icons';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { useToast } from '@/components/Toast/useToast';
import { readConsentChoices } from '@/mock/cookieConsent';
import { PATHS } from '@/router/paths';
import {
  ACCOUNTS,
  fmtRp,
  isSubKey,
  LANGS,
  PROFILE_INIT,
  ROLES,
  SUBS,
  WEEK_INIT,
  type DialogSpec,
  type Profile,
  type Settings,
  type SheetKey,
  type SubView,
} from './data';
import { Ico } from './icons';
import { MineContext, type MineContextValue } from './MineContext';
import { MineHome } from './MineHome';
import { Empty, NameSheet, PermIcon, PickSheet } from './parts';
import { SubPage } from './SubPage';
import { KfGrid } from './views/ServiceViews';

/* =========================================================
   「我的」页
   ---------------------------------------------------------
   ?view=setting / cookies / profile …  原型直达某个二级页
   ========================================================= */

type TabKey = 'home' | 'device' | 'audit' | 'me';

const TABS: { k: TabKey; t: string; i: (active: boolean) => JSX.Element }[] = [
  { k: 'home', t: '首页', i: Ico.tHome },
  { k: 'device', t: '设备', i: Ico.tDevice },
  { k: 'audit', t: '审核', i: Ico.tAudit },
  { k: 'me', t: '我', i: Ico.tMe },
];

const PlainPage = ({ title, txt, sub }: { title: string; txt: string; sub: string }) => (
  <>
    <div className="plain-hd">{title}</div>
    <div className="scroll fade-in">
      <Empty txt={txt} sub={sub} />
    </div>
  </>
);

const STAR_LOGS = (claimed: boolean) => [
  { l: '一键领取签到星星', d: '今天 15:19', n: claimed ? '+8' : '—' },
  { l: '9.17 每日签到', d: '9.17 09:02', n: '+5' },
  { l: '9.16 完善企业资料', d: '9.16 14:30', n: '+3' },
  { l: '积分商城兑换', d: '9.12 10:44', n: '-20', minus: true },
];

export function Mine() {
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [tab, setTab] = useState<TabKey>('me');
  const [accs, setAccs] = useState(ACCOUNTS);
  const [accId, setAccId] = useState('a1');
  const [profile, setProfile] = useState<Profile>(PROFILE_INIT);
  const [settings, setSettings] = useState<Settings>(() => {
    const cookies = readConsentChoices();
    return { lang: '跟随系统', push: true, ads: cookies.marketing, force: true, cookies };
  });
  const [week, setWeek] = useState(WEEK_INIT);
  const [stars, setStars] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [sheet, setSheet] = useState<SheetKey | null>(null);
  /** 每次打开昵称弹层都用当前昵称重新初始化输入框 */
  const [nameSheetKey, setNameSheetKey] = useState(0);
  const [dialog, setDialog] = useState<DialogSpec | null>(null);
  /** 二级页导航栈 */
  const [stack, setStack] = useState<SubView[]>(() => {
    const direct = params.get('view');
    return isSubKey(direct) ? [SUBS[direct]] : [];
  });

  const acc = accs.find(a => a.id === accId) ?? accs[0];
  const sub = stack[stack.length - 1];
  const closeSheet = () => setSheet(null);

  /* 一键领取：数字滚动 + 星星弹跳 */
  const claim = (n: number) => {
    setClaimed(true);
    setWeek(w => w.map(d => (d.on ? { ...d, pop: true } : d)));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setStars(i);
      if (i >= n) {
        clearInterval(id);
        toast('领取成功，获得 ' + n + ' 颗星星');
      }
    }, 70);
    setTimeout(() => setWeek(w => w.map(d => ({ ...d, pop: false }))), 600);
  };

  /* 更换头像：第 2 步 — 头像隐私确认 */
  const askAvatarPrivacy = (from: string) =>
    setDialog({
      t: '头像使用说明',
      m: '仅用于账号身份识别、内部同事识别。',
      cancel: '取消',
      ok: '同意',
      onCancel: () => toast('已取消更换头像'),
      onOk: () => {
        setProfile(p => ({ ...p, avatar: true }));
        toast(from === '相机' ? '拍照完成，头像已更新' : '已选择图片，头像已更新');
      },
    });

  /* 更换头像：相机先走系统权限授权，相册直接进隐私确认 */
  const askPhoto = (from: '相机' | '相册') => {
    if (from !== '相机') return askAvatarPrivacy(from);
    setDialog({
      perm: true,
      dark: true, // 相机场景弹窗浮在取景黑屏上
      icon: 'cam',
      t: '允许“MySANY”访问相机？',
      m: '“MySANY”想访问您的相机,为了帮您实现扫描二维码,设置头像等功能',
      cancel: '不允许',
      ok: '允许',
      onCancel: () => toast('已拒绝授权\n无法使用相机更换头像'),
      onOk: () => askAvatarPrivacy(from),
    });
  };

  const push = useCallback(
    (k: string) => (isSubKey(k) ? setStack(s => [...s, SUBS[k]]) : toast('功能开发中')),
    [toast],
  );

  const ctx = useMemo<MineContextValue>(
    () => ({
      toast,
      acc,
      profile,
      settings,
      setSettings,
      push,
      back: () => setStack(s => s.slice(0, -1)),
      openSheet: k => {
        if (k === 'nickname') setNameSheetKey(n => n + 1);
        setSheet(k);
      },
      confirm: d => setDialog({ cancel: '取消', ...d }),
    }),
    [toast, acc, profile, settings, push],
  );

  return (
    <MineContext.Provider value={ctx}>
      <StatusBar time="15:19" signal="bars" network="wifi" battery={49} />

      <div className="screen">
        {tab === 'me' && <MineHome stars={stars} week={week} claimed={claimed} onClaim={claim} />}
        {tab === 'home' && (
          <PlainPage title="首页" txt="首页内容仅在完整版中展示" sub="本原型聚焦「我的」页交互" />
        )}
        {tab === 'device' && (
          <PlainPage title="设备" txt="还没有绑定任何设备" sub="回到「我的」页点击绑定设备" />
        )}
        {tab === 'audit' && (
          <PlainPage title="审核" txt="暂无待审核事项" sub="成员申请、用车审批会在此汇总" />
        )}

        {/* 右侧悬浮球 */}
        {tab === 'me' && (
          <button
            className="fab"
            onClick={() => toast('快捷工具箱\n扫一扫 / 报修 / 找配件')}
            aria-label="快捷入口"
          >
            <Ico.grid />
          </button>
        )}
      </div>

      {/* 底部 Tab */}
      <div className="tabbar">
        {TABS.map(t => (
          <button
            key={t.k}
            className={'tabitem' + (tab === t.k ? ' is-active' : '')}
            onClick={() => {
              if (t.k === 'home') return navigate(PATHS.home);
              setStack([]);
              setTab(t.k);
            }}
          >
            {t.i(tab === t.k)}
            <span>{t.t}</span>
          </button>
        ))}
      </div>

      {/* 二级页：覆盖底部 Tab，支持多级返回 */}
      {sub && <SubPage key={stack.length} view={sub} onBack={ctx.back} />}

      {/* ── 头像来源：相机 / 相册 / 取消 ── */}
      {sheet === 'avatar' && (
        <>
          <div className="scrim" onClick={closeSheet} />
          <div className="as">
            <div className="as-group">
              <button
                className="as-item"
                onClick={() => {
                  closeSheet();
                  askPhoto('相机');
                }}
              >
                相机
              </button>
              <button
                className="as-item"
                onClick={() => {
                  closeSheet();
                  askPhoto('相册');
                }}
              >
                相册
              </button>
            </div>
            <div className="as-group as-cancel">
              <button className="as-item" onClick={closeSheet}>
                取消
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── 系统弹窗：授权 / 二次确认 ── */}
      {dialog && (
        <div className={'alert-wrap' + (dialog.dark ? ' is-dark' : '')}>
          <div
            key={dialog.t}
            className={'alert' + (dialog.perm ? ' is-perm' : '') + (dialog.dark ? ' is-dark' : '')}
          >
            {dialog.icon && <PermIcon kind={dialog.icon} />}
            <div className="alert-t">{dialog.t}</div>
            <p className="alert-m">{dialog.m}</p>
            <div className="alert-btns">
              <button
                className="alert-btn"
                onClick={() => {
                  setDialog(null);
                  dialog.onCancel?.();
                }}
              >
                {dialog.cancel}
              </button>
              <button
                className="alert-btn primary"
                onClick={() => {
                  setDialog(null);
                  dialog.onOk?.();
                }}
              >
                {dialog.ok}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 个人信息编辑 ── */}
      <NameSheet
        key={nameSheetKey}
        open={sheet === 'nickname'}
        name={acc.name}
        onClose={closeSheet}
        onSave={n => {
          setAccs(as => as.map(a => (a.id === accId ? { ...a, name: n } : a)));
          closeSheet();
          toast('昵称已更新');
        }}
      />
      <PickSheet
        open={sheet === 'role'}
        title="选择身份"
        options={ROLES}
        value={profile.role}
        onClose={closeSheet}
        onPick={v => {
          setProfile(p => ({ ...p, role: v }));
          closeSheet();
          toast('身份已提交审核\n当前显示为' + v);
        }}
      />

      {/* ── 弹层 ── */}
      <BottomSheet open={sheet === 'account'} title="切换身份" onClose={closeSheet}>
        <SheetBody>
          {ACCOUNTS.map(a => (
            <div
              key={a.id}
              className={'acc' + (a.id === accId ? ' is-on' : '')}
              onClick={() => {
                setAccId(a.id);
                closeSheet();
                toast('已切换至\n' + a.name);
              }}
            >
              <span className="acc-av" />
              <div className="acc-b">
                <div className="acc-n">{a.name}</div>
                <div className="acc-t">
                  {a.tag} · {a.note}
                </div>
              </div>
              {a.id === accId && (
                <span className="acc-ck">
                  <CheckIcon />
                </span>
              )}
            </div>
          ))}
        </SheetBody>
      </BottomSheet>

      <BottomSheet open={sheet === 'service'} title="在线客服" cancelText="关闭" onClose={closeSheet}>
        <SheetBody>
          <KfGrid
            items={[
              ['在线咨询', <Ico.chat />],
              ['电话客服', <Ico.headset />],
              ['服务网点', <Ico.pin />],
            ]}
            onTap={t => {
              closeSheet();
              toast(t === '电话客服' ? '拨打 400-887-8318' : t);
            }}
          />
          <p className="sub-note" style={{ margin: '4px 0 10px' }}>
            服务时间 7×24 小时。涉及设备故障请优先提交「服务工单」，工程师将在 2 小时内响应。
          </p>
        </SheetBody>
      </BottomSheet>

      <PickSheet
        open={sheet === 'lang'}
        title="语言"
        options={LANGS}
        value={settings.lang}
        onClose={closeSheet}
        onPick={v => {
          setSettings(s => ({ ...s, lang: v }));
          closeSheet();
          toast('语言已切换为 ' + v);
        }}
      />

      <BottomSheet open={sheet === 'star'} title="星星明细" cancelText="关闭" onClose={closeSheet}>
        <SheetBody>
          <div style={{ padding: '2px 0 10px', fontSize: 13, color: '#8A8C93' }}>
            当前 <b style={{ color: '#FF7A18', fontSize: 16 }}>{stars}</b> 颗 ≈ Rp {fmtRp(stars * 100)},-（1
            颗星星 ≈ Rp 100）
          </div>
          {STAR_LOGS(claimed).map(r => (
            <div className="star-log" key={r.l}>
              <div className="l">
                {r.l}
                <div className="d">{r.d}</div>
              </div>
              <span className={'n' + (r.minus ? ' minus' : '')}>{r.n}</span>
            </div>
          ))}
        </SheetBody>
      </BottomSheet>
    </MineContext.Provider>
  );
}
