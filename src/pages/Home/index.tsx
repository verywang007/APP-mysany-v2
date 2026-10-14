import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DemoBar, DemoSelect } from '@/components/DemoBar/DemoBar';
import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { useToast } from '@/components/Toast/useToast';
import { samplePromptRecord, statusLabel } from '@/flows/cancellation';
import { CANCEL_STATUSES, isCancelStatus, readStoredRecord, type CancelRecord } from '@/mock/cancellation';
import { PATHS, withQuery } from '@/router/paths';
import { CancelLoginPrompt } from './CancelLoginPrompt';
import { HomeScreen } from './HomeScreen';
import './Home.css';

/* =========================================================
   首页
   ---------------------------------------------------------
   ?from=login        登录后进入：若有注销申请，按状态弹出提示
   ?cancelState=XXX   原型预览：直接以某个注销状态弹出提示
   ========================================================= */

/** 根据 URL 决定是否弹出注销状态提示 */
function usePromptRecord(): CancelRecord | null {
  const [params] = useSearchParams();
  const [record] = useState<CancelRecord | null>(() => {
    const preview = String(params.get('cancelState') || '').toUpperCase();
    if (params.get('from') !== 'login' && !preview) return null;
    const r = readStoredRecord() ?? samplePromptRecord();
    return isCancelStatus(preview) ? { ...r, status: preview } : r;
  });
  return record;
}

function Home() {
  const toast = useToast();
  const navigate = useNavigate();
  const record = usePromptRecord();
  const [promptOpen, setPromptOpen] = useState(true);

  const close = () => {
    setPromptOpen(false);
    navigate(PATHS.home, { replace: true });
  };

  return (
    <>
      <HomeScreen />
      {record && promptOpen && (
        <CancelLoginPrompt
          record={record}
          onClose={close}
          onDetail={() => navigate(PATHS.cancellation)}
          onLogin={() => navigate(PATHS.login)}
          onService={() => toast('拨打 0086-4006098318', 2200)}
          onWithdrawn={() => {
            close();
            toast('注销申请已撤销', 2200);
          }}
        />
      )}
    </>
  );
}

const PREVIEW_OPTIONS = [
  { value: '', label: '不弹出' },
  ...CANCEL_STATUSES.filter(s => s !== 'NORMAL').map(s => ({ value: s, label: statusLabel(s) })),
];

export default function HomePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preview = String(params.get('cancelState') || '').toUpperCase();
  return (
    <DeviceFrame
      className="pg-home"
      toastDuration={1600}
      demo={
        <DemoBar>
          <DemoSelect
            label="重新登录时的注销状态"
            value={preview}
            options={PREVIEW_OPTIONS}
            onChange={v =>
              navigate(withQuery(PATHS.home, { cancelState: v || undefined }), { replace: true })
            }
          />
        </DemoBar>
      }
    >
      <Home />
    </DeviceFrame>
  );
}
