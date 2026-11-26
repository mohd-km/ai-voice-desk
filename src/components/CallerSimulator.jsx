import React, { useState } from 'react';
import { CALLER_PRESETS } from '../data/scenarios';
import { LockIcon, ShieldIcon, UnlockIcon } from './Icons';

export default function CallerSimulator() {
  const [selectedId, setSelectedId] = useState(CALLER_PRESETS[0].id);
  const active = CALLER_PRESETS.find((item) => item.id === selectedId) || CALLER_PRESETS[0];

  return (
    <section className="section" id="simulator" aria-labelledby="simulator-heading">
      <div className="section-head">
        <span className="eyebrow">Interactive Caller Simulator</span>
        <h2 id="simulator-heading" className="section-title">
          Two-lane caller isolation in plain English
        </h2>
        <p className="section-subtitle">
          Tap a caller below to see how Mohammed gets full personal memory while every other caller
          stays in a helpful, sealed guest lane.
        </p>
      </div>

      <div className="preset-grid" role="tablist" aria-label="Choose a caller scenario">
        {CALLER_PRESETS.map((preset) => {
          const isSelected = preset.id === active.id;
          return (
            <button
              key={preset.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`preset-btn tone-${preset.laneTone} ${isSelected ? 'is-selected' : ''}`}
              onClick={() => setSelectedId(preset.id)}
            >
              <span className="preset-label">{preset.label}</span>
              <span className="preset-meta">{preset.shortRole}</span>
            </button>
          );
        })}
      </div>

      <div className="sim-panel" role="tabpanel" aria-label={`${active.label} simulation`}>
        <div className="sim-status-bar">
          <div className="sim-badges">
            <span className={`lane-pill tone-${active.laneTone}`}>
              <ShieldIcon size={15} />
              {active.laneTitle}
            </span>
            <span className={`memory-pill tone-${active.laneTone}`}>
              {active.laneTone === 'private' ? <UnlockIcon size={15} /> : <LockIcon size={15} />}
              {active.memoryState}
            </span>
          </div>
          <p className="sim-summary-line">{active.summaryLine}</p>
        </div>

        <div className="sim-grid">
          <div className="sim-dialogue-col">
            <h3 className="sim-col-title">How the call sounds</h3>
            <div className="dialogue-list">
              {active.dialogue.map((turn, index) => (
                <div key={index} className={`dialogue-bubble role-${turn.role}`}>
                  <div className="dialogue-speaker">{turn.speaker}</div>
                  <p className="dialogue-text">{turn.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sim-details-col">
            <div className="detail-card">
              <h3 className="sim-col-title">What the desk can see</h3>
              <ul className="visibility-list">
                {active.visibility.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <div className={`boundary-note tone-${active.laneTone}`}>
                <span className="boundary-label">Privacy boundary</span>
                <p>{active.blocked}</p>
              </div>
            </div>

            <div className="telegram-card">
              <div className="telegram-head">
                <span className="telegram-channel">Telegram summary</span>
                <span className="telegram-tag">Sent after call</span>
              </div>
              <div className="telegram-body">
                <div className="telegram-heading">{active.telegram.heading}</div>
                <ul className="telegram-lines">
                  {active.telegram.lines.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
