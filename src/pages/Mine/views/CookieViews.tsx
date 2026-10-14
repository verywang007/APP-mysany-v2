import { useState } from 'react';
import { ChevronRight } from '@/components/icons';
import { COOKIE_CATALOG } from '@/data/cookieCatalog';
import {
  COOKIE_ALL_ON,
  COOKIE_DEFAULTS,
  saveConsent,
  type ConsentAction,
  type CookieCategory,
  type CookieChoices,
} from '@/mock/cookieConsent';
import type { SubKey } from '../data';
import { useMine } from '../MineContext';
import { Switch } from '../parts';

const OPTIONAL_ROWS: {
  key: Exclude<CookieCategory, 'necessary'>;
  title: string;
  desc: string;
  meta: string;
  detail: SubKey;
}[] = [
  {
    key: 'functional',
    title: '功能体验',
    desc: '记住语言、地区和界面偏好，并提供地图等增强功能。',
    meta: '示例：语言偏好、地图服务 · 2 个合作方',
    detail: 'cookieFunctional',
  },
  {
    key: 'analytics',
    title: '分析统计',
    desc: '了解功能使用情况、崩溃和性能问题，以改进产品。',
    meta: '示例：使用分析、崩溃分析 · 2 个合作方',
    detail: 'cookieAnalytics',
  },
  {
    key: 'marketing',
    title: '广告营销',
    desc: '用于营销归因、个性化广告及广告效果衡量。',
    meta: '示例：广告 ID、营销归因 · 2 个合作方',
    detail: 'cookieMarketing',
  },
];

/** Cookie 设置：编辑草稿，点保存才写入 */
export function CookieSettingsView() {
  const { settings, setSettings, toast, push, back } = useMine();
  const [draft, setDraft] = useState<CookieChoices>({ ...settings.cookies });

  const commit = (next: CookieChoices, action: ConsentAction) => {
    const saved = saveConsent(next, action);
    setDraft(saved);
    setSettings(s => ({ ...s, cookies: saved, ads: saved.marketing }));
    toast('Cookie 偏好已保存');
    back();
  };

  return (
    <>
      <div className="cookie-intro">
        <strong>Cookie 与类似追踪技术</strong>
        <p>
          除严格必要技术外，其他类别只有在您主动允许后才会启用。拒绝不会影响登录、设备管理和售后服务等核心功能。
        </p>
      </div>

      <div className="cookie-pref-list">
        <div className="cookie-pref">
          <div className="cookie-pref-line">
            <div className="cookie-pref-copy">
              <strong>严格必要</strong>
              <p>用于登录会话、安全认证、网络负载和保存隐私选择。</p>
            </div>
            <span className="cookie-required">始终启用</span>
          </div>
          <div className="cookie-meta">保存期限：会话期至 12 个月 · 不用于广告</div>
          <button className="cookie-detail-link" onClick={() => push('cookieNecessary')}>
            查看 Cookie 详情 <ChevronRight />
          </button>
        </div>

        {OPTIONAL_ROWS.map(r => (
          <div className="cookie-pref" key={r.key}>
            <div className="cookie-pref-line">
              <div className="cookie-pref-copy">
                <strong>{r.title}</strong>
                <p>{r.desc}</p>
              </div>
              <Switch on={draft[r.key]} onChange={v => setDraft(s => ({ ...s, [r.key]: v }))} />
            </div>
            <div className="cookie-meta">{r.meta}</div>
            <button className="cookie-detail-link" onClick={() => push(r.detail)}>
              查看 Cookie 详情 <ChevronRight />
            </button>
          </div>
        ))}
      </div>

      <p className="cookie-legal">
        您可随时修改或撤回授权。撤回后将停止对应追踪，并清理可以清理的非必要 Cookie 与本地标识。
      </p>
      <div style={{ flex: 1 }} />
      <div className="cookie-foot">
        <button className="btn-primary" onClick={() => commit(draft, 'settings_update')}>
          保存我的选择
        </button>
        <div className="cookie-bulk">
          <button onClick={() => commit({ ...COOKIE_DEFAULTS }, 'reject_all')}>全部拒绝</button>
          <button onClick={() => commit({ ...COOKIE_ALL_ON }, 'accept_all')}>全部接受</button>
        </div>
      </div>
    </>
  );
}

/** Cookie 分类详情 */
export function CookieDetailView({ category }: { category: CookieCategory }) {
  const group = COOKIE_CATALOG[category];
  return (
    <>
      <div className="cookie-detail-intro">
        <strong>{group.title}</strong>
        <p>{group.note}</p>
        <span>共 {group.items.length} 项</span>
      </div>
      <div className="cookie-detail-list">
        {group.items.map(item => (
          <article className="cookie-item" key={item.name}>
            <div className="cookie-item-head">
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
      </div>
      <p className="cookie-detail-tail">
        本页为原型示例。正式上线时应展示实际 Cookie、SDK 标识、提供方、用途和保存期限。
      </p>
    </>
  );
}
