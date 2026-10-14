import { CheckIcon } from '@/components/icons';
import { buildTimeline, DETAIL_BUTTONS, statusMeta, type DetailAction } from '@/flows/cancellation';
import { formatDateTime, type CancelRecord } from '@/mock/cancellation';
import { tenantInfo } from '../data';

/** 提交成功 */
export function SuccessScreen({
  record,
  onDetail,
  onBack,
}: {
  record: CancelRecord;
  onDetail: () => void;
  onBack: () => void;
}) {
  const autoApproved = record.status === 'COOLING';
  return (
    <>
      <div className="cancel-main is-white fade-in">
        <div className="success-wrap">
          <span className="success-ico">
            <CheckIcon />
          </span>
          <h2>申请已提交</h2>
          <p>
            {autoApproved
              ? '个体户申请免人工审核，系统已自动审核通过，当前处于 15 天冷静期，期间您可随时撤销本次申请。'
              : '您的注销申请正在等待审核。审核结果将通过 APP 消息及账号绑定的联系方式通知您。'}
          </p>
          <div className="success-ticket">
            <div className="ticket-row">
              <span>当前状态</span>
              <strong style={{ color: autoApproved ? '#2f80c4' : '#C47A0B' }}>
                {autoApproved ? '冷静期' : '待审核'}
              </strong>
            </div>
            <div className="ticket-row">
              <span>申请单号</span>
              <strong>{record.no}</strong>
            </div>
            <div className="ticket-row">
              <span>提交时间</span>
              <strong>{formatDateTime(record.applyTime)}</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="cancel-foot">
        <button className="cancel-btn" onClick={onDetail}>
          查看申请进度
        </button>
        <button className="cancel-btn secondary" onClick={onBack}>
          返回设置
        </button>
      </div>
    </>
  );
}

function Timeline({ record }: { record: CancelRecord }) {
  return (
    <div className="timeline-card">
      <div className="timeline-title">申请进度</div>
      {buildTimeline(record).map((item, i) => (
        <div
          className={
            'timeline-item' +
            (item.done ? ' done' : '') +
            (item.current ? ' current' : '') +
            (item.branch ? ' branch' : '')
          }
          key={i}
        >
          <span className="timeline-dot" />
          <div className="timeline-copy">
            <strong>{item.title}</strong>
            <p>{item.note}</p>
          </div>
          <span className="timeline-time">{item.time}</span>
        </div>
      ))}
    </div>
  );
}

const DEFAULT_REJECT_REASON = '您当前账号在企业账号中关联了设备，请先联系企业租户管理员删除后再提交。';

/** 申请详情：状态卡 + 时间线 + 申请信息；底部按钮按状态取自 DETAIL_BUTTONS */
export function DetailScreen({
  record,
  countdown,
  onAction,
}: {
  record: CancelRecord;
  countdown: string;
  onAction: (a: DetailAction) => void;
}) {
  const { status } = record;
  const meta = statusMeta(status);
  const reason = status === 'REJECTED' ? record.auditOpinion || DEFAULT_REJECT_REASON : '';
  const isEnterprise = record.tenantType === 'enterprise';
  const buttons = status === 'NORMAL' ? [] : DETAIL_BUTTONS[status];

  return (
    <>
      <div className="cancel-scroll fade-in">
        <div className={'status-card ' + meta.cls}>
          <span className="status-pill">
            <i />
            {meta.name}
          </span>
          <h2>{meta.title}</h2>
          <p>{meta.desc}</p>
          {status === 'COOLING' && (
            <div className="countdown">
              {countdown}
              <small>后开始处理</small>
            </div>
          )}
        </div>
        <Timeline record={record} />
        {reason && (
          <div className="detail-card">
            <div className="detail-head">驳回原因</div>
            <div className="detail-row">
              <strong style={{ textAlign: 'left', color: '#B83B35' }}>{reason}</strong>
            </div>
          </div>
        )}
        <div className="detail-card">
          <div className="detail-head">申请信息</div>
          <div className="detail-row">
            <span>申请单号</span>
            <strong>{record.no}</strong>
          </div>
          <div className="detail-row">
            <span>申请时间</span>
            <strong>{formatDateTime(record.applyTime)}</strong>
          </div>
          {record.tenantType && (
            <div className="detail-row">
              <span>租户类型</span>
              <strong>{tenantInfo(record.tenantType).label}</strong>
            </div>
          )}
          {isEnterprise && record.tenantContact && (
            <div className="detail-row">
              <span>负责人电话</span>
              <strong>{record.tenantContact}</strong>
            </div>
          )}
          <div className="detail-row">
            <span>注销原因</span>
            <strong>{record.reason}</strong>
          </div>
          <div className="detail-row">
            <span>圈子内容</span>
            <strong>{record.contentMode}</strong>
          </div>
          {status === 'COOLING' && (
            <div className="detail-row">
              <span>冷静期截止</span>
              <strong>{formatDateTime(record.coolingEnd)}</strong>
            </div>
          )}
        </div>
        <div className="detail-card">
          <div className="detail-head">账号处理摘要</div>
          <div className="detail-row">
            <span>账号权益</span>
            <strong>{isEnterprise ? '120 积分清零，企业员工账户解除关联' : '120 积分清零'}</strong>
          </div>
          <div className="detail-row">
            <span>绑定关系</span>
            <strong>{isEnterprise ? '企业员工账户已解除关联，3 台设备解绑' : '3 台设备解绑'}</strong>
          </div>
          <div className="detail-row">
            <span>业务记录</span>
            <strong>6 条维护记录匿名化保留</strong>
          </div>
        </div>
        {(status === 'FAILED' || status === 'PROCESSING') && (
          <p className="prototype-note">用户侧不展示内部任务错误和处理人信息，执行与重试由后管完成。</p>
        )}
      </div>
      <div className="cancel-foot">
        {buttons.map(b => (
          <button
            key={b.action}
            className={'cancel-btn' + (b.variant === 'primary' ? '' : ' ' + b.variant)}
            onClick={() => onAction(b.action)}
          >
            {b.label}
          </button>
        ))}
      </div>
    </>
  );
}

/** 账号注销须知 */
export const AgreementScreen = () => (
  <div className="cancel-scroll fade-in">
    <div className="agreement-doc">
      <div className="doc-lead">
        请在申请注销前完整阅读。本须知用于说明账号注销的条件、流程及数据处理方式。
      </div>
      <h3>一、注销条件</h3>
      <p>账号不存在未完结订单、未处理申诉，且您已完成设备管理员及组织主账号等责任身份的移交。</p>
      <h3>二、注销流程</h3>
      <p>
        提交申请后由平台审核。审核通过后进入 15
        天冷静期，具体时长以所在国家或地区配置为准。待审核和冷静期内可以撤销。
      </p>
      <h3>三、注销影响</h3>
      <p>
        注销完成后账号永久停止登录，积分与未使用权益清零，设备、客户和企业子账户关系解除，认证信息按规则清除。
      </p>
      <h3>四、个人信息处理</h3>
      <p>
        个人资料将依据适用规则删除或匿名化。为履行法定义务、解决争议或保障交易安全所必需的记录，将在限定期限内去标识化保存。
      </p>
      <h3>五、重新注册</h3>
      <p>使用原手机号或邮箱重新注册将视为新账号，原账号的历史数据、认证及权益不会恢复。</p>
      <div className="agreement-version">账号注销须知 · 版本 2026.10</div>
    </div>
  </div>
);
