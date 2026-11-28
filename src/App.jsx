import React, { useCallback, useState } from 'react';
import CallerSimulator from './components/CallerSimulator';
import { BrandMark, ChevronDownIcon } from './components/Icons';
import RoutingCanvas from './components/RoutingCanvas';
import VoicePlayer from './components/VoicePlayer';
import { ARCHITECTURE_STEPS, HERO_METRICS } from './engine/guardrailEngine';

const STORIES = {
  player: {
    problem:
      'A stranger rings pretending to be a courier and tries to get Mohammed’s flat number and a bank code.',
    how:
      'Every call goes into one of two lanes. Only Mohammed gets the private lane with his memory and calendar. Everyone else stays in the guest lane, where a block list of risky actions (the tool firewall) stops anything sensitive. When the call ends, a short summary goes to his Telegram.',
    tryThis:
      'Press the round play button. At 0:21, when the caller asks for the code, the diagram’s dot turns red and runs along the lower guest lane.'
  },
  simulator: {
    problem: 'See exactly what the desk will and will not do for different callers.',
    how:
      'Your text is checked for warning words (like “OTP”, a one-time bank code, “address” or “parcel”) and combined with who is calling. That decides the lane, the spoken reply, which actions are allowed, and the summary sent to Mohammed. Fixed rules, not guesswork, so the same call always gets the same answer.',
    tryThis:
      'Click “Owner Direct Call”, then switch the caller to “Unknown Number”: the memory and calendar rows flip from ALLOWED to BLOCKED.'
  }
};

function StoryCard({ tab }) {
  const s = STORIES[tab] || STORIES.player;
  return (
    <div className="story-card" aria-label="What this view shows">
      <p><strong>The problem.</strong> {s.problem}</p>
      <p><strong>How it works.</strong> {s.how}</p>
      <p className="story-try"><strong>Try this first.</strong> {s.tryThis}</p>
    </div>
  );
}

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
            <span className="brand-mark" aria-hidden="true">
              <BrandMark size={28} />
            </span>
            <span className="brand-name">AI Voice Desk</span>
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
                Scam callers often pose as couriers or banks to get a home address or a bank code. This desk answers the phone in a copy of Mohammed’s voice, never gives strangers anything private, and sends him a short summary after every call.
              </p>
              <div className="metric-strip" aria-label="Verified system metrics">
                {HERO_METRICS.map((m) => (
                  <span key={m.label} className="metric-chip">
                    <strong className="metric-val">{m.value}</strong>
                    <span className="metric-lbl">{m.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="view-tabs" role="tablist" aria-label="Interactive workspace views">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'player'}
                className={`view-tab ${activeTab === 'player' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('player')}
              >
                Listen to a call
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'simulator'}
                className={`view-tab ${activeTab === 'simulator' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('simulator')}
              >
                Test the safety rules
              </button>
            </div>
          </div>
        </section>

        <section className="workspace" aria-live="polite">
          <StoryCard tab={activeTab} />
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
              <span>Read more: the four steps and the privacy rules</span>
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
                  <strong>Headline numbers:</strong> about 2.0 seconds to look up a personal fact when Mohammed himself calls (memory recall time), 5 languages spoken, and $0 extra server cost because it reuses computers he already runs.
                </p>
                <p>
                  <strong>Rules that never bend:</strong> the desk can never read out one-time passwords (OTPs, the codes banks text you). It only looks up the home address or calendar when the caller is confirmed to be Mohammed.
                </p>
              </div>
            </div>
          </details>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">AI Voice Desk — Mohammed KM</span>
          <span className="footer-meta">Everything here runs in your browser. No real calls or messages are sent.</span>
        </div>
      </footer>
    </div>
  );
}
