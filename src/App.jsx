import React from 'react';
import ArchitectureFlow from './components/ArchitectureFlow';
import CallerSimulator from './components/CallerSimulator';
import VoicePlayer from './components/VoicePlayer';
import { HERO_METRICS } from './data/scenarios';

export default function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name">AI Voice Desk</span>
            <span className="brand-by">by Mohammed KM</span>
          </div>
          <nav className="topbar-nav" aria-label="Page sections">
            <a href="#simulator">Caller Simulator</a>
            <a href="#architecture">How It Works</a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <span className="hero-pill">Two-Lane Privacy Voice Assistant</span>
            <h1 id="hero-heading" className="hero-title">
              Answers every call in Mohammed’s voice—while keeping private memory completely sealed.
            </h1>
            <p className="hero-subtitle">
              A calm personal voice desk that helps real callers, filters spam, and delivers a
              clean Telegram summary the moment the call ends.
            </p>
          </div>

          <VoicePlayer />

          <div className="metrics-grid" aria-label="Key performance highlights">
            {HERO_METRICS.map((metric) => (
              <div key={metric.label} className="metric-card">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
                <p className="metric-detail">{metric.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <CallerSimulator />

        <ArchitectureFlow />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-title">AI Voice Desk by Mohammed KM</p>
          <p className="footer-note">
            Built for calm availability, strict two-lane privacy, and zero extra server overhead.
          </p>
        </div>
      </footer>
    </div>
  );
}
