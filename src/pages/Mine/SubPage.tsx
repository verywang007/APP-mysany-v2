import type { ReactNode } from 'react';
import { ChevronLeft } from '@/components/icons';
import type { SubView } from './data';
import { Empty } from './parts';
import { CookieDetailView, CookieSettingsView } from './views/CookieViews';
import { ProfileView } from './views/ProfileView';
import {
  AddrView,
  BindView,
  DocView,
  FeedbackView,
  HelpView,
  MallView,
  ReportView,
  SelfServiceView,
  WarnView,
} from './views/ServiceViews';
import { SettingsView } from './views/SettingsView';

function renderBody(view: SubView): ReactNode {
  switch (view.k) {
    case 'setting':
      return <SettingsView />;
    case 'cookies':
      return <CookieSettingsView />;
    case 'cookie-detail':
      return <CookieDetailView category={view.category ?? 'necessary'} />;
    case 'profile':
      return <ProfileView />;
    case 'help':
      return <HelpView />;
    case 'privacy':
    case 'terms':
      return <DocView kind={view.k} />;
    case 'bind':
      return <BindView />;
    case 'warn':
      return <WarnView />;
    case 'report':
      return <ReportView />;
    case 'mall':
      return <MallView />;
    case 'addr':
      return <AddrView />;
    case 'feedback':
      return <FeedbackView />;
    case 'self':
      return <SelfServiceView />;
    case 'empty':
      return <Empty txt={view.empty || '暂无数据'} sub={view.sub} />;
  }
}

/** 二级页：覆盖底部 Tab 的全屏页，右侧推入 */
export function SubPage({ view, onBack }: { view: SubView; onBack: () => void }) {
  return (
    <div className={'subpage' + (view.white ? ' is-white' : '')}>
      <div className={'sub-hd' + (view.left ? ' is-left' : '')}>
        <button className="sub-back" onClick={onBack} aria-label="返回">
          <ChevronLeft />
        </button>
        <span className="sub-title">{view.t}</span>
        {!view.left && <span className="sub-right">{view.right || ''}</span>}
      </div>
      <div
        className={'scroll' + (view.k === 'cookies' ? ' cookie-settings-scroll' : '')}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {renderBody(view)}
      </div>
    </div>
  );
}
