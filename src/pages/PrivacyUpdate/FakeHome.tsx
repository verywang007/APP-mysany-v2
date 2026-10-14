/** 背景：APP 首页示意（弹窗未处理前不可操作） */
export function FakeHome({ blocked }: { blocked: boolean }) {
  return (
    <div className={'home' + (blocked ? ' is-blocked' : '')}>
      <div className="home-scroll" aria-hidden="true">
        <div className="h-search">
          <svg viewBox="0 0 16 16">
            <circle cx="7" cy="7" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.9 10.9L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>搜索设备型号 / 配件 / 服务</span>
        </div>

        <div className="h-tabs">
          {['关注', '推荐', '挖掘机', '起重机', '泵车', '装载机'].map(t => (
            <span key={t} className={t === '推荐' ? 'on' : ''}>
              {t}
            </span>
          ))}
        </div>

        <div className="h-banner">
          <div className="bn-title">
            三一智能装备
            <br />
            2026 新品发布
          </div>
        </div>

        <div className="h-cards">
          <div className="h-card">
            <b>我的设备</b>
            <i>3 台在线 · 1 台待保养</i>
          </div>
          <div className="h-card">
            <b>服务工单</b>
            <i>2 单进行中</i>
          </div>
        </div>

        <div className="h-rows">
          {[
            ['SY215C 液压挖掘机保养提醒：距下次保养还剩 40 工作小时', '服务中心 · 2 小时前'],
            ['2026 款泵车上市，全系标配智能臂架控制系统', '三一重工 · 昨天'],
          ].map(([title, meta]) => (
            <div className="h-row" key={title}>
              <div className="r-thumb" />
              <div className="r-main">
                <div className="r-title">{title}</div>
                <div className="r-meta">{meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabbar" aria-hidden="true">
        {['首页', '设备', '服务', '我的'].map((t, i) => (
          <div key={t} className={i === 0 ? 'on' : ''}>
            <span className="tb-dot" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
