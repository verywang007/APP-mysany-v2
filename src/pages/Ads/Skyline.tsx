/** 启动页背景：城市天际线 + 黄色 SANY 挖掘机（手绘 SVG） */
export const Skyline = () => (
  <div className="splash">
    <svg viewBox="0 0 414 896" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A7AFBE" />
          <stop offset=".62" stopColor="#BCC2CD" />
          <stop offset="1" stopColor="#C6CAD3" />
        </linearGradient>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9CCD4" stopOpacity="0" />
          <stop offset="1" stopColor="#C9CCD4" stopOpacity=".92" />
        </linearGradient>
      </defs>

      {/* 地面 / 下半屏底色 */}
      <rect width="414" height="896" fill="#C9CCD4" />
      {/* 天空 */}
      <rect width="414" height="422" fill="url(#sky)" />

      {/* 远层楼群 */}
      <g fill="#B0B7C5" opacity=".7">
        <rect x="-6" y="288" width="44" height="134" />
        <rect x="120" y="254" width="22" height="168" />
        <rect x="150" y="302" width="34" height="120" />
        <rect x="246" y="270" width="24" height="152" />
        <rect x="288" y="242" width="26" height="180" />
        <rect x="358" y="274" width="30" height="148" />
        <rect x="394" y="302" width="30" height="120" />
      </g>

      {/* 主层楼群 */}
      <g fill="#99A1B0">
        <rect x="-10" y="318" width="46" height="104" />
        <rect x="30" y="350" width="24" height="72" />
        <rect x="56" y="254" width="30" height="168" rx="15" />
        <rect x="90" y="294" width="16" height="128" />
        <rect x="110" y="232" width="10" height="190" />
        <rect x="124" y="324" width="28" height="98" />
        <rect x="156" y="370" width="34" height="52" />
      </g>

      {/* 中央塔尖（哈利法塔形） */}
      <path
        d="M190 422 L198 264 L202 198 L206 132 L209 68 L212 -24 L216 -24 L219 68
               L222 132 L226 198 L230 264 L238 422 Z"
        fill="#A4ACBA"
      />

      {/* 右侧楼群 + 帆形塔 */}
      <g fill="#99A1B0">
        <rect x="252" y="308" width="28" height="114" />
        <rect x="278" y="234" width="18" height="188" />
        <rect x="296" y="274" width="30" height="148" />
        <path d="M330 422 V240 c0-13 42-13 42 0 V422 Z" />
        <rect x="378" y="294" width="18" height="128" />
        <rect x="396" y="326" width="26" height="96" />
      </g>

      {/* 楼群根部雾化，与下半屏接续 */}
      <rect x="0" y="360" width="414" height="62" fill="url(#fog)" />

      {/* ── SANY 挖掘机 ── */}
      <g>
        {/* 履带 */}
        <rect x="178" y="396" width="98" height="22" rx="11" fill="#24262B" />
        <rect x="184" y="402" width="86" height="10" rx="5" fill="#34373D" />
        <circle cx="187" cy="407" r="7" fill="#3A3D43" />
        <circle cx="199" cy="407" r="6.4" fill="#4A4E55" />
        <circle cx="226" cy="407" r="6.4" fill="#4A4E55" />
        <circle cx="253" cy="407" r="6.4" fill="#4A4E55" />
        <circle cx="270" cy="407" r="6.4" fill="#4A4E55" />

        {/* 上部车身 */}
        <rect x="178" y="358" width="94" height="40" rx="5" fill="#F2C21B" />
        <rect x="176" y="362" width="14" height="32" rx="3" fill="#DFAF13" />
        <rect x="196" y="380" width="38" height="5" rx="2.5" fill="#2A2D33" opacity=".75" />
        <rect x="196" y="366" width="26" height="4" rx="2" fill="#D9AB12" opacity=".9" />

        {/* 驾驶室 */}
        <rect x="238" y="348" width="36" height="50" rx="4" fill="#F2C21B" />
        <path d="M245 354 H265 L273 371 V394 H245 Z" fill="#2B2E34" />
        <path d="M248 357 H262 L268 370 V391 H248 Z" fill="#3E444C" opacity=".55" />

        {/* 大臂 + 油缸 */}
        <path d="M242 374 L292 300 L308 314 L258 388 Z" fill="#F2C21B" />
        <path d="M242 374 L292 300 L298 307 L248 381 Z" fill="#FFD84A" opacity=".55" />
        <line x1="252" y1="374" x2="286" y2="341" stroke="#4E5259" strokeWidth="4.5" strokeLinecap="round" />

        {/* 小臂 + 油缸 */}
        <path d="M288 292 L304 284 L332 346 L316 354 Z" fill="#E6B512" />
        <line x1="296" y1="310" x2="322" y2="350" stroke="#4E5259" strokeWidth="4.5" strokeLinecap="round" />

        {/* 铲斗 */}
        <path d="M313 340 L338 334 L349 370 L330 385 L314 364 Z" fill="#2A2D33" />
        <path d="M330 385 L332 392 L337 386 Z M322 381 L323 388 L328 382 Z" fill="#2A2D33" />

        {/* 大臂上的 SANY 字样 */}
        <text
          x="265"
          y="352"
          fill="#E23B2E"
          fontSize="13.5"
          fontWeight="800"
          letterSpacing="1"
          transform="rotate(-40 265 352)"
        >
          SANY
        </text>
      </g>
    </svg>
    <div className="veil" />
  </div>
);
