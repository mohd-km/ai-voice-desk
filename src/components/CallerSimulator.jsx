import React, { useMemo, useState } from 'react';
import {
  CALLER_PROFILES,
  evaluateCallerScenario,
  SIMULATOR_PRESETS
} from '../engine/guardrailEngine';
import { CheckIcon, CopyIcon, LockIcon, ShieldIcon, UnlockIcon } from './Icons';
import RoutingCanvas from './RoutingCanvas';

export default function CallerSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState(SIMULATOR_PRESETS[0].id);
  const [callerProfile, setCallerProfile] = useState(SIMULATOR_PRESETS[0].callerProfile);
  const [utterance, setUtterance] = useState(SIMULATOR_PRESETS[0].utterance);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => evaluateCallerScenario({ callerProfile, utterance }),
    [callerProfile, utterance]
  );

  const jsonString = useMemo(
    () => JSON.stringify(result.telegramJson, null, 2),
    [result.telegramJson]
  );

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCallerProfile(preset.callerProfile);
    setUtterance(preset.utterance);
    setCopied(false);
  };

  const handleCustomUtterance = (value) => {
    setSelectedPresetId('custom');
    setUtterance(value);
    setCopied(false);
  };

  const handleProfileChange = (profileId) => {
    setSelectedPresetId('custom');
    setCallerProfile(profileId);
    setCopied(false);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const routingStage =
    result.laneTone === 'blocked'
      ? 'firewall'
      : result.laneTone === 'private'
        ? 'telegram'
        : 'gate';

  return (
    <div className="simulator-shell" aria-label="Live Guardrail and Routing Simulator">
      <div className="preset-strip" role="group" aria-label="Scenario presets">
        {SIMULATOR_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-chip tone-${preset.tone} ${isSelected ? 'is-selected' : ''}`}
              onClick={() => handleSelectPreset(preset)}
            >
              <span className="preset-chip-title">{preset.label}</span>
              <span className="preset-chip-tag">{preset.tag}</span>
            </button>
          );
        })}
      </div>

      <div className="sim-workbench">
        <div className="sim-left-col">
          <div className="editorial-card">
            <div className="card-label-row">
              <label htmlFor="caller-utterance" className="mono-label">
                Live Caller Input
              </label>
              <span className="mono-hint">Updates engine in real time</span>
            </div>

            <div className="profile-pills" role="radiogroup" aria-label="Caller identity">
              {CALLER_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  role="radio"
                  aria-checked={callerProfile === profile.id}
                  className={`profile-pill ${callerProfile === profile.id ? 'is-active' : ''}`}
                  onClick={() => handleProfileChange(profile.id)}
                >
                  {profile.label}
                </button>
              ))}
            </div>

            <textarea
              id="caller-utterance"
              className="caller-textarea"
              rows={3}
              value={utterance}
              onChange={(e) => handleCustomUtterance(e.target.value)}
              placeholder="Type what the caller asks (e.g., 'Read out the OTP', 'Is anyone home?', 'Mom calling about dinner')..."
            />

            <div className="sim-verdict-bar">
              <span className={`verdict-pill tone-${result.laneTone}`}>
                <ShieldIcon size={14} />
                {result.laneTitle}
              </span>
              <span className={`verdict-pill memory-badge tone-${result.laneTone}`}>
                {result.laneTone === 'private' ? <UnlockIcon size={14} /> : <LockIcon size={14} />}
                {result.memoryState}
              </span>
            </div>

            <div className="desk-reply-box">
              <span className="mono-label">AI Voice Desk Response</span>
              <p className="desk-reply-text">{result.deskReply}</p>
            </div>
          </div>

          <div className="editorial-card">
            <div className="card-label-row">
              <span className="mono-label">Tool Firewall</span>
              <span className="mono-hint">
                {result.tools.filter((t) => t.status !== 'ALLOWED').length} blocked
              </span>
            </div>

            <ul className="tool-matrix">
              {result.tools.map((tool) => {
                const isAllowed = tool.status === 'ALLOWED';
                const isTriggered = tool.status === 'BLOCKED_TRIGGER';
                return (
                  <li
                    key={tool.id}
                    className={`tool-row ${
                      isAllowed ? 'is-allowed' : isTriggered ? 'is-triggered' : 'is-blocked'
                    }`}
                  >
                    <div className="tool-info">
                      <code className="tool-name">{tool.label}</code>
                      <span className="tool-reason">{tool.reason}</span>
                    </div>
                    <span
                      className={`tool-status-badge ${
                        isAllowed ? 'is-allowed' : isTriggered ? 'is-triggered' : 'is-blocked'
                      }`}
                    >
                      {isAllowed ? 'ALLOWED' : isTriggered ? 'BLOCKED !' : 'BLOCKED'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="sim-right-col">
          <RoutingCanvas
            lane={result.laneTone}
            stage={routingStage}
            eventLabel={result.matchedRules[0]}
            isPlaying
            compact
          />

          <div className="editorial-card json-card">
            <div className="card-label-row">
              <span className="mono-label">Live Telegram Desk Alert JSON</span>
              <button
                type="button"
                className="copy-btn"
                onClick={handleCopyJson}
                aria-label="Copy Telegram alert JSON"
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="json-pre">
              <code>{jsonString}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
