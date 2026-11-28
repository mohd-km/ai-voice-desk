import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  DELIVERY_CHOICES,
  formatClock,
  MAX_CALL_SECONDS,
  OWNER_SCENARIOS
} from '../engine/ownerLine';

const KIND_LABEL = {
  work: 'Working',
  held: 'Held back',
  fallback: 'Moved to laptop',
  doc: 'Document',
  routine: 'Routine saved'
};

const TICK_MS = 110; // one second of call time per tick

export default function OwnerLine() {
  const [scenarioId, setScenarioId] = useState(OWNER_SCENARIOS[0].id);
  const [phase, setPhase] = useState('idle'); // idle | live | ended
  const [clock, setClock] = useState(0);
  const [answers, setAnswers] = useState({});
  const [delivery, setDelivery] = useState(null);
  const timerRef = useRef(null);

  const scenario = useMemo(
    () => OWNER_SCENARIOS.find((s) => s.id === scenarioId) || OWNER_SCENARIOS[0],
    [scenarioId]
  );

  const shown = scenario.steps.filter((s) => s.at <= clock);
  const pending = shown.find((s, i) => s.kind === 'question' && !answers[i]);
  const allShown = shown.length === scenario.steps.length;
  const lastAnswered = !scenario.steps.some((s, i) => s.kind === 'question' && !answers[i]);
  const canHangUp = phase === 'live' && allShown && lastAnswered;
  const onLaptop = shown.some((s) => s.kind === 'fallback');
  const heldCount = shown.filter((s) => s.kind === 'held').length;

  useEffect(() => {
    if (phase !== 'live' || pending || allShown) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return undefined;
    }
    timerRef.current = window.setInterval(() => {
      setClock((c) => Math.min(MAX_CALL_SECONDS, c + 1));
    }, TICK_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [phase, pending, allShown]);

  const reset = (id = scenarioId) => {
    setScenarioId(id);
    setPhase('idle');
    setClock(0);
    setAnswers({});
    setDelivery(null);
  };

  const startCall = () => {
    setClock(0);
    setAnswers({});
    setDelivery(null);
    setPhase('live');
  };

  const answer = (stepIdx, option) => {
    setAnswers((a) => ({ ...a, [stepIdx]: option }));
  };

  const summaryLine = (() => {
    if (phase !== 'ended') return null;
    if (!delivery) return 'Choose how the result should reach him.';
    const heldNote =
      heldCount > 0
        ? ` The notice held during the call arrives with it in one "while you were on the call" message.`
        : '';
    if (delivery === 'telegram') return `The result goes to Telegram as one message.${heldNote}`;
    if (delivery === 'callback') return `The line calls him back with the result.${heldNote}`;
    return `Nothing is sent now. He hears it at the start of his next call.${heldNote}`;
  })();

  return (
    <div className="owner-shell" aria-label="Private owner lane walkthrough">
      <div className="preset-strip" role="group" aria-label="Owner call examples">
        {OWNER_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`preset-chip tone-private ${s.id === scenarioId ? 'is-selected' : ''}`}
            onClick={() => reset(s.id)}
          >
            <span className="preset-chip-title">{s.label}</span>
            <span className="preset-chip-tag">{s.tag}</span>
          </button>
        ))}
      </div>

      <div className="owner-workbench">
        <div className="editorial-card owner-transcript" aria-live="polite">
          <div className="card-label-row">
            <span className="mono-label">The call</span>
            <span className="mono-hint">Sped up: one second of call per tick</span>
          </div>

          {phase === 'idle' && (
            <div className="owner-empty">
              <p>Mohammed rings his own line from his phone. His number is trusted, so the call opens in the private lane.</p>
              <button type="button" className="owner-btn is-primary" onClick={startCall}>
                Start the call
              </button>
            </div>
          )}

          {phase !== 'idle' && (
            <ol className="owner-lines">
              {shown.map((step, i) => {
                if (!step.kind || step.kind === 'question') {
                  const chosen = answers[i];
                  return (
                    <li key={i} className={`owner-line who-${step.who}`}>
                      <span className="owner-who">{step.who === 'owner' ? 'Mohammed' : 'Voice line'}</span>
                      <span className="owner-text">{step.text}</span>
                      {step.kind === 'question' && !chosen && phase === 'live' && (
                        <span className="owner-options" role="group" aria-label="Answer the question">
                          {step.options.map((o) => (
                            <button key={o.label} type="button" className="owner-btn" onClick={() => answer(i, o)}>
                              {o.label}
                            </button>
                          ))}
                        </span>
                      )}
                      {chosen && (
                        <>
                          <span className="owner-line who-owner owner-reply">
                            <span className="owner-who">Mohammed</span>
                            <span className="owner-text">{chosen.reply}</span>
                          </span>
                          <span className="owner-line who-desk owner-reply">
                            <span className="owner-who">Voice line</span>
                            <span className="owner-text">{chosen.after}</span>
                          </span>
                        </>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={i} className={`owner-event kind-${step.kind}`}>
                    <span className="owner-event-tag">{KIND_LABEL[step.kind]}</span>
                    <span>{step.text}</span>
                  </li>
                );
              })}
            </ol>
          )}

          {pending && phase === 'live' && (
            <p className="owner-hint">The task is paused on this question. Pick an answer and it carries on from what he said.</p>
          )}

          {canHangUp && (
            <button type="button" className="owner-btn is-primary" onClick={() => setPhase('ended')}>
              Hang up
            </button>
          )}

          {phase === 'ended' && (
            <div className="owner-delivery">
              <span className="mono-label">How should the result reach him?</span>
              <div className="owner-options" role="radiogroup" aria-label="Delivery choice">
                {DELIVERY_CHOICES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    role="radio"
                    aria-checked={delivery === d.id}
                    className={`owner-btn ${delivery === d.id ? 'is-primary' : ''}`}
                    onClick={() => setDelivery(d.id)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {delivery && <p className="card-explain">{DELIVERY_CHOICES.find((d) => d.id === delivery)?.note}</p>}
              <button type="button" className="owner-btn" onClick={() => reset()}>
                Run it again
              </button>
            </div>
          )}
        </div>

        <div className="owner-side">
          <div className="editorial-card owner-stats">
            <div className="owner-stat">
              <span className="mono-label">Call length</span>
              <strong className="owner-stat-val">{formatClock(clock)}</strong>
              <span className="owner-stat-note">of {formatClock(MAX_CALL_SECONDS)} allowed per call</span>
            </div>
            <div className="owner-stat">
              <span className="mono-label">Where the task runs</span>
              <strong className={`owner-stat-val ${onLaptop ? 'is-warn' : 'is-ok'}`}>{onLaptop ? 'Laptop' : 'Cloud'}</strong>
              <span className="owner-stat-note">
                {onLaptop ? 'Only because the site blocked the cloud. Back to the cloud for the next task.' : 'Cloud first, always. The laptop is the fallback.'}
              </span>
            </div>
            <div className="owner-stat">
              <span className="mono-label">Telegram during the call</span>
              <strong className="owner-stat-val is-ok">{phase === 'ended' ? 'Call over' : 'Quiet'}</strong>
              <span className="owner-stat-note">
                {heldCount > 0 ? `${heldCount} notice held, sent together after the call.` : 'No pings while he is talking.'}
              </span>
            </div>
          </div>

          <div className="editorial-card">
            <span className="mono-label">After the call</span>
            <p className="card-explain owner-summary">
              {summaryLine || 'Results are spoken on the call. Telegram only hears about it if he asks, or once the call is over.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
