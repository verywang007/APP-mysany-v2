import { useState } from 'react';
import { LegalDocBody } from './LegalDocBody';
import { PRIVACY_SETTINGS, SERVICE_TERMS, SHARE_LIST_V32, type LegalDoc } from '@/data/legal';
import './LegalPage.css';

export function LegalPage({ kind, onBack, onAgree, doc }: {
  kind: 'privacy' | 'service' | 'share';
  onBack: () => void;
  onAgree?: () => void;
  doc?: LegalDoc;
}) {
  const [sdkOpen, setSdkOpen] = useState(false);
  const sdk = kind === 'share' || sdkOpen;
  const content = sdk
    ? { ...SHARE_LIST_V32, title: '第三方SDK列表', sections: SHARE_LIST_V32.sections.slice(0, 4) }
    : doc ?? (kind === 'privacy' ? PRIVACY_SETTINGS : SERVICE_TERMS);
  return (
    <section className="legal-page" role="dialog" aria-modal="true" aria-label={sdk ? '第三方SDK列表' : kind === 'privacy' ? '隐私政策' : content.title}>
      <header>
        <button type="button" onClick={sdkOpen ? () => setSdkOpen(false) : onBack}>返回</button>
        <strong>{sdk ? '第三方SDK列表' : kind === 'privacy' ? '隐私政策' : content.title}</strong>
        <span />
      </header>
      <div className="legal-page-body" key={sdk ? 'sdk' : kind}>
        <LegalDocBody doc={content} />
        {!sdk && kind === 'privacy' && (
          <p>第三方 SDK 的服务用途及信息处理情况详见
            <button type="button" className="legal-page-link" onClick={() => setSdkOpen(true)}>《第三方SDK列表》</button>。
          </p>
        )}
        <p>（原型演示文本，不构成正式法律文件。）</p>
      </div>
      {!sdk && onAgree && <footer><button type="button" onClick={onAgree}>同意并继续</button></footer>}
    </section>
  );
}
