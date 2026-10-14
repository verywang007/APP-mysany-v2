import { useState, type ReactNode } from 'react';
import { ChevronRight } from '@/components/icons';
import { LegalDocBody } from '@/components/LegalDocBody';
import { PRIVACY_SETTINGS, SERVICE_TERMS } from '@/data/legal';
import { ADDRS, FAQS, FLEET, fmtRp, GOODS, POINTS, WARNINGS } from '../data';
import { Ico } from '../icons';
import { useMine } from '../MineContext';

/* 「我的」页里的业务 / 服务类二级页 */

const Spacer = () => <div style={{ flex: 1 }} />;

export function HelpView() {
  const [openQ, setOpenQ] = useState(-1);
  return (
    <div className="list" style={{ marginTop: 12 }}>
      {FAQS.map(([q, a], i) => (
        <div
          className={'faq' + (openQ === i ? ' is-open' : '')}
          key={i}
          onClick={() => setOpenQ(openQ === i ? -1 : i)}
        >
          <div className="faq-q">
            {q}
            <span className="row-chev">
              <ChevronRight />
            </span>
          </div>
          {openQ === i && <p className="faq-a">{a}</p>}
        </div>
      ))}
    </div>
  );
}

export function DocView({ kind }: { kind: 'privacy' | 'terms' }) {
  return (
    <div className="doc">
      <LegalDocBody
        doc={kind === 'privacy' ? PRIVACY_SETTINGS : SERVICE_TERMS}
        tail={<p className="tail">（原型演示文本，不构成正式法律文件。）</p>}
      />
    </div>
  );
}

export function BindView() {
  const { toast, back } = useMine();
  const [sn, setSn] = useState('');
  return (
    <>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-title">输入设备出厂编号</div>
        <div className="input-line">
          <input
            value={sn}
            onChange={e => setSn(e.target.value.toUpperCase())}
            placeholder="例：SY215C10-0012345"
          />
          <button className="ico-btn" onClick={() => toast('调起相机\n扫描设备铭牌二维码')}>
            <Ico.scan />
          </button>
        </div>
      </div>
      <p className="sub-note">
        绑定后可查看设备工况、油耗、保养计划与告警推送。一台设备可被多个账号绑定，机主拥有最高权限。
      </p>
      <Spacer />
      <div className="sub-foot">
        <button
          className="btn-primary"
          onClick={() => {
            if (sn.trim().length < 6) return toast('请输入完整的设备出厂编号');
            toast('已提交绑定申请\n等待机主确认');
            back();
          }}
        >
          提交绑定
        </button>
      </div>
    </>
  );
}

export function WarnView() {
  const { toast } = useMine();
  return (
    <>
      <div className="list" style={{ marginTop: 12 }}>
        {WARNINGS.map(w => (
          <div className="warn" key={w.t} onClick={() => toast('查看告警详情：\n' + w.t)}>
            <span className="warn-dot" style={{ background: w.c }} />
            <div className="warn-b">
              <div className="warn-t">{w.t}</div>
              <div className="warn-d">{w.d}</div>
            </div>
            <span className="warn-lv" style={{ color: w.c, background: w.bg }}>
              {w.lv}
            </span>
          </div>
        ))}
      </div>
      <p className="sub-note">共 3 条未处理告警，超过 48 小时未处理将自动升级为服务工单。</p>
    </>
  );
}

export function ReportView() {
  return (
    <>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-title">本月机群概览</div>
        <div className="stats">
          {[
            ['4', '在管设备'],
            ['312', '作业小时'],
            ['52%', '平均利用率'],
          ].map(([n, l]) => (
            <div className="stat" key={l}>
              <span className="stat-num">{n}</span>
              <span className="stat-lbl">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="list bars" style={{ marginTop: 10 }}>
        {FLEET.map(f => (
          <div className="bar-row" key={f.n}>
            <div className="bar-top">
              <span>{f.n}</span>
              <b>{f.v}%</b>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: f.v + '%', background: f.c }} />
            </div>
          </div>
        ))}
      </div>
      <p className="sub-note">利用率 = 当月实际作业小时 / 可作业小时，数据每日 06:00 更新。</p>
    </>
  );
}

export function MallView() {
  const { toast } = useMine();
  return (
    <>
      <div className="card" style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, color: '#8A8C93' }}>可用积分</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#FF7A18', marginTop: 2 }}>2,860</div>
        </div>
        <button className="star-view" style={{ marginLeft: 'auto' }} onClick={() => toast('积分明细')}>
          积分明细 <ChevronRight />
        </button>
      </div>
      <div className="goods">
        {GOODS.map(g => (
          <div
            className="good"
            key={g.n}
            onClick={() =>
              toast(g.p > POINTS ? '积分不足，还差 ' + (g.p - POINTS) + ' 分' : '已加入兑换单：\n' + g.n)
            }
          >
            <div className="good-img">
              <Ico.gift />
            </div>
            <div className="good-n">{g.n}</div>
            <div className="good-p">
              {fmtRp(g.p)}
              <span>积分</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function AddrView() {
  const { toast } = useMine();
  return (
    <>
      <div className="list" style={{ marginTop: 12 }}>
        {ADDRS.map(a => (
          <div className="addr" key={a.n} onClick={() => toast('编辑收货地址')}>
            <div className="addr-h">
              <span>{a.n}</span>
              <span style={{ color: '#8A8C93', fontSize: 13 }}>{a.p}</span>
              {a.def && <span className="tag">默认</span>}
            </div>
            <p className="addr-p">{a.a}</p>
          </div>
        ))}
      </div>
      <Spacer />
      <div className="sub-foot">
        <button className="btn-primary" onClick={() => toast('新增收货地址')}>
          + 新增地址
        </button>
      </div>
    </>
  );
}

export function FeedbackView() {
  const { toast, back } = useMine();
  const [fb, setFb] = useState('');
  return (
    <>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-title">问题描述</div>
        <textarea
          className="ta"
          value={fb}
          onChange={e => setFb(e.target.value)}
          maxLength={200}
          placeholder="请描述你遇到的问题或建议，我们会在 1 个工作日内回复"
        />
        <div style={{ textAlign: 'right', fontSize: 12, color: '#B4B7BE' }}>{fb.length}/200</div>
      </div>
      <Spacer />
      <div className="sub-foot">
        <button
          className="btn-primary"
          onClick={() => {
            if (!fb.trim()) return toast('请先填写问题描述');
            toast('反馈已提交，感谢你的建议');
            back();
          }}
        >
          提交反馈
        </button>
      </div>
    </>
  );
}

/** 客服 / 自助服务里的三格入口 */
export function KfGrid({ items, onTap }: { items: [string, ReactNode][]; onTap: (t: string) => void }) {
  return (
    <div className="kf">
      {items.map(([t, ic]) => (
        <div className="kf-item" key={t} onClick={() => onTap(t)}>
          {ic}
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}

export function SelfServiceView() {
  const { toast } = useMine();
  return (
    <>
      <div className="card" style={{ marginTop: 12 }}>
        <KfGrid
          items={[
            ['保养预约', <Ico.cog />],
            ['配件查询', <Ico.box />],
            ['电子保单', <Ico.doc />],
          ]}
          onTap={toast}
        />
        <KfGrid
          items={[
            ['发票申请', <Ico.mail />],
            ['进度查询', <Ico.chart />],
            ['服务网点', <Ico.pin />],
          ]}
          onTap={toast}
        />
      </div>
      <p className="sub-note">自助服务 7×24 小时可用，复杂问题可转人工客服 400-887-8318。</p>
    </>
  );
}
