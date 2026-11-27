import React from 'react';

export default function RoutingCanvas({
  lane = 'guest',
  stage = 'gate',
  eventLabel = 'Caller ID unverified -> Guest Lane',
  isPlaying = false,
  compact = false
}) {
  const isPrivate = lane === 'private';
  const isBlocked = lane === 'blocked';
  const isGuest = lane === 'guest';

  const activeColor = isPrivate ? '#0f6b5e' : isBlocked ? '#b42334' : '#8a5a18';
  const activeBg = isPrivate ? '#eef6f4' : isBlocked ? '#fdf2f3' : '#fbf6ee';

  const stageIndex = {
    ring: 0,
    gate: 1,
    firewall: 2,
    telegram: 3
  }[stage] ?? 1;

  return (
    <div className={`routing-figure ${compact ? 'is-compact' : ''}`} aria-label="Two-lane caller routing animation">
      <div className="routing-figure-head">
        <div className="routing-status-group">
          <span className={`status-dot tone-${lane} ${isPlaying ? 'is-pulsing' : ''}`} />
          <span className="routing-lane-name">
            {isPrivate ? 'Private lane: Mohammed only' : isBlocked ? 'Guest lane: risky request blocked' : 'Guest lane: everyone else'}
          </span>
        </div>
        <span className="routing-event-mono">{eventLabel}</span>
      </div>

      <div className="routing-svg-wrap">
        <svg
          viewBox="0 0 760 220"
          className="routing-svg"
          role="img"
          aria-label={`Routing diagram currently active on ${lane} lane at stage ${stage}`}
        >
          <defs>
            <pattern id="editorial-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0ee" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Subtle paper grid */}
          <rect x="0" y="0" width="760" height="220" fill="url(#editorial-grid)" rx="8" />

          {/* Isolation divider */}
          <line
            x1="230"
            y1="110"
            x2="585"
            y2="110"
            stroke="#d6d6d2"
            strokeWidth="1.2"
            strokeDasharray="5 5"
          />
          <rect x="355" y="99" width="108" height="22" rx="11" fill="#ffffff" stroke="#e5e5e3" />
          <text
            x="409"
            y="113"
            textAnchor="middle"
            className="svg-mono-micro"
            fill="#666666"
          >
            KEPT APART
          </text>

          {/* Path: Incoming -> Gate */}
          <path
            d="M 118 110 L 182 110"
            fill="none"
            stroke={activeColor}
            strokeWidth="2.2"
          />

          {/* Path: Gate -> Private Lane (Upper) */}
          <path
            id="path-private"
            d="M 258 96 C 285 96, 285 52, 316 52 L 560 52 C 588 52, 594 96, 616 96"
            fill="none"
            stroke={isPrivate ? '#0f6b5e' : '#e5e5e3'}
            strokeWidth={isPrivate ? '2.4' : '1.6'}
            className={isPrivate ? 'svg-flow-active' : ''}
          />

          {/* Path: Gate -> Guest / Firewall Lane (Lower) */}
          <path
            id="path-guest"
            d="M 258 124 C 285 124, 285 168, 316 168 L 560 168 C 588 168, 594 124, 616 124"
            fill="none"
            stroke={!isPrivate ? activeColor : '#e5e5e3'}
            strokeWidth={!isPrivate ? '2.4' : '1.6'}
            className={!isPrivate ? 'svg-flow-active' : ''}
          />

          {/* Animated packet pulse */}
          <circle r="4.5" fill={activeColor}>
            <animateMotion
              dur={isPlaying ? '2.2s' : '3.6s'}
              repeatCount="indefinite"
              path={
                isPrivate
                  ? 'M 118 110 L 182 110 M 258 96 C 285 96, 285 52, 316 52 L 560 52 C 588 52, 594 96, 616 96'
                  : 'M 118 110 L 182 110 M 258 124 C 285 124, 285 168, 316 168 L 560 168 C 588 168, 594 124, 616 124'
              }
            />
          </circle>

          {/* Node 1: Incoming Call */}
          <g transform="translate(18, 76)">
            <rect
              width="100"
              height="68"
              rx="10"
              fill={stageIndex === 0 ? activeBg : '#ffffff'}
              stroke={stageIndex === 0 ? activeColor : '#d8d8d4'}
              strokeWidth={stageIndex === 0 ? '1.8' : '1.2'}
            />
            <text x="50" y="29" textAnchor="middle" className="svg-node-title">
              Call in
            </text>
            <text x="50" y="47" textAnchor="middle" className="svg-mono-micro" fill="#555555">
              Answered
            </text>
          </g>

          {/* Node 2: Identity Gate */}
          <g transform="translate(182, 76)">
            <rect
              width="76"
              height="68"
              rx="10"
              fill={stageIndex === 1 ? activeBg : '#ffffff'}
              stroke={stageIndex === 1 ? activeColor : '#d8d8d4'}
              strokeWidth={stageIndex === 1 ? '1.8' : '1.2'}
            />
            <text x="38" y="29" textAnchor="middle" className="svg-node-title">
              ID check
            </text>
            <text x="38" y="47" textAnchor="middle" className="svg-mono-micro" fill={activeColor}>
              {isPrivate ? 'OWNER' : 'GUEST'}
            </text>
          </g>

          {/* Node 3A: Private Owner Lane (Upper) */}
          <g transform="translate(316, 20)">
            <rect
              width="244"
              height="64"
              rx="10"
              fill={isPrivate ? '#eef6f4' : '#fafaf9'}
              stroke={isPrivate ? '#0f6b5e' : '#e5e5e3'}
              strokeWidth={isPrivate ? '1.8' : '1.2'}
            />
            <text
              x="16"
              y="26"
              className="svg-node-title"
              fill={isPrivate ? '#111111' : '#888888'}
            >
              Private lane (owner)
            </text>
            <text
              x="16"
              y="46"
              className="svg-mono-micro"
              fill={isPrivate ? '#0f6b5e' : '#999999'}
            >
              {isPrivate ? 'OPEN · memory + calendar' : 'LOCKED · no guest access'}
            </text>
          </g>

          {/* Node 3B: Isolated Guest Lane + Firewall (Lower) */}
          <g transform="translate(316, 136)">
            <rect
              width="244"
              height="64"
              rx="10"
              fill={!isPrivate ? activeBg : '#fafaf9'}
              stroke={!isPrivate ? activeColor : '#e5e5e3'}
              strokeWidth={!isPrivate ? '1.8' : '1.2'}
            />
            <text
              x="16"
              y="26"
              className="svg-node-title"
              fill={!isPrivate ? '#111111' : '#888888'}
            >
              {isBlocked ? 'Guest lane + block list' : 'Guest lane'}
            </text>
            <text
              x="16"
              y="46"
              className="svg-mono-micro"
              fill={!isPrivate ? activeColor : '#999999'}
            >
              {isBlocked
                ? 'BLOCKED · codes, address, notes'
                : isGuest
                  ? 'ACTIVE · takes a message only'
                  : 'SKIPPED · owner confirmed'}
            </text>
          </g>

          {/* Node 4: Telegram Desk */}
          <g transform="translate(616, 76)">
            <rect
              width="126"
              height="68"
              rx="10"
              fill={stageIndex === 3 ? activeBg : '#ffffff'}
              stroke={stageIndex === 3 ? activeColor : '#d8d8d4'}
              strokeWidth={stageIndex === 3 ? '1.8' : '1.2'}
            />
            <text x="63" y="29" textAnchor="middle" className="svg-node-title">
              Telegram
            </text>
            <text x="63" y="47" textAnchor="middle" className="svg-mono-micro" fill={activeColor}>
              Summary sent
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
