import React, { useCallback, useState } from 'react';
import CallerSimulator from './components/CallerSimulator';
import { ChevronDownIcon } from './components/Icons';
import RoutingCanvas from './components/RoutingCanvas';
import VoicePlayer from './components/VoicePlayer';
import { ARCHITECTURE_STEPS, HERO_METRICS } from './engine/guardrailEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'simulator'
  const [routingState, setRoutingState] = useState({
    lane: 'guest',
    stage: 'ring',
    eventLabel: 'Press play to trace two-lane routing',
    isPlaying: false
  });

  const handleRoutingUpdate = useCallback((next) => {
    setRoutingState(next);
  }, []);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-dot" aria-hidden="true" />
            <span className="brand-name">AI Voice Desk</span>
            <span className="brand-by">Mohammed KM</span>
          </div>

          <div className="metric-strip" aria-label="Verified system metrics">
            {HERO_METRICS.map((m) => (
              <span key={m.label} className="metric-chip">
                <strong className="metric-val">{m.value}</strong>
                <span className="metric-lbl">{m.label}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-row">
            <div className="hero-text">
              <h1 id="hero-heading" className="hero-title">
                Two-Lane Cloned Voice Desk
              </h1>
              <p className="hero-subtitle">
                Answers calls in Mohammed’s voice, isolates private memory from guests, and dispatches structured Telegram alerts.
              </p>
            </div>

            <div className="view-tabs" role="tablist" aria-label="Interactive workspace views">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'player'}
                className={`view-tab ${activeTab === 'player' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('player')}
              >
                Routing &amp; Call Player
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'simulator'}
                className={`view-tab ${activeTab === 'simulator' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('simulator')}
              >
                Guardrail &amp; JSON Simulator
              </button>
            </div>
          </div>
        </section>

        <section className="workspace" aria-live="polite">
          {activeTab === 'player' ? (
            <div className="player-workspace">
              <RoutingCanvas
                lane={routingState.lane}
                stage={routingState.stage}
                eventLabel={routingState.eventLabel}
                isPlaying={routingState.isPlaying}
              />
              <VoicePlayer onRoutingStateChange={handleRoutingUpdate} />
            </div>
          ) : (
            <CallerSimulator />
          )}
        </section>

        <section className="spec-drawers" aria-label="Architecture and guardrail reference">
          <details className="editorial-drawer">
            <summary className="drawer-summary">
              <span>Read more: Four-Step Architecture &amp; Privacy Boundaries</span>
              <ChevronDownIcon size={16} />
            </summary>
            <div className="drawer-body">
              <ol className="arch-grid">
                {ARCHITECTURE_STEPS.map((step) => (
                  <li key={step.number} className="arch-item">
                    <div className="arch-head">
                      <span className="arch-num">{step.number}</span>
                      <span className="arch-cap">{step.caption}</span>
                    </div>
                    <h3 className="arch-title">{step.title}</h3>
                    <p className="arch-desc">{step.description}</p>
                  </li>
                ))}
              </ol>

              <div className="spec-notes">
                <p>
                  <strong>Verified benchmarks:</strong> 2.0s personal memory recall in the Private Owner Lane, 5 supported languages, and $0 extra server spend by reusing existing infrastructure.
                </p>
                <p>
                  <strong>Hard security invariants:</strong> OTPs and verification codes are permanently disabled on the voice desk; home address and calendar lookups are strictly blocked outside verified owner sessions.
                </p>
              </div>
            </div>
          </details>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">AI Voice Desk — Mohammed KM</span>
          <span className="footer-meta">100% client-side simulation · Zero external APIs</span>
        </div>
      </footer>
    </div>
  );
}
