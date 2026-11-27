import React, { useEffect, useRef, useState } from 'react';
import { REAL_VOICE_TRANSCRIPT, TWO_SPEAKER_CALL } from '../engine/guardrailEngine';
import { PauseIcon, PlayIcon, ReplayIcon, VolumeIcon } from './Icons';

const WAVE_BARS = [
  22, 38, 28, 56, 74, 46, 68, 86, 50, 34, 62, 82, 44, 30, 72, 90,
  54, 40, 76, 62, 48, 32, 66, 84, 58, 36, 70, 52, 42, 78, 64, 46,
  30, 60, 88, 52, 38, 72, 58, 44, 28, 64, 80, 48, 34, 56, 68, 36
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function playSubtleCue(audioCtxRef, freq = 520, duration = 0.08) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch {
    // Ignore audio context restrictions
  }
}

export default function VoicePlayer({ onRoutingStateChange }) {
  const [mode, setMode] = useState('call'); // 'call' (52s two-speaker) | 'sample' (9s real MP3)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [realDuration, setRealDuration] = useState(9.1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(null);
  const lastSegIdRef = useRef(null);

  const duration = mode === 'call' ? TWO_SPEAKER_CALL.duration : realDuration;
  const segments = mode === 'call' ? TWO_SPEAKER_CALL.segments : REAL_VOICE_TRANSCRIPT;

  const activeSegment =
    segments.find((seg) => currentTime >= seg.start && currentTime < seg.end) ||
    (currentTime >= duration ? segments[segments.length - 1] : segments[0]);

  // Notify parent routing diagram whenever active segment or play state changes
  useEffect(() => {
    if (!onRoutingStateChange || !activeSegment) return;
    onRoutingStateChange({
      lane: activeSegment.lane || 'guest',
      stage: activeSegment.stage || 'gate',
      eventLabel: activeSegment.event || activeSegment.speaker,
      isPlaying
    });
  }, [activeSegment, isPlaying, onRoutingStateChange]);

  // Subtle cue when switching transcript turns in 52s call mode
  useEffect(() => {
    if (mode !== 'call' || !isPlaying || isMuted || !activeSegment) return;
    if (lastSegIdRef.current !== activeSegment.id) {
      lastSegIdRef.current = activeSegment.id;
      const freq =
        activeSegment.stage === 'firewall'
          ? 340
          : activeSegment.stage === 'telegram'
            ? 660
            : activeSegment.role === 'desk'
              ? 520
              : 420;
      playSubtleCue(audioCtxRef, freq, 0.07);
    }
  }, [mode, isPlaying, isMuted, activeSegment]);

  // Timer loop for 52s two-speaker call mode
  useEffect(() => {
    if (mode !== 'call' || !isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }

    const tick = (now) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = now;
      }
      const delta = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= TWO_SPEAKER_CALL.duration) {
          setIsPlaying(false);
          return TWO_SPEAKER_CALL.duration;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode, isPlaying]);

  // Native audio listeners for 9s real voice sample mode
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setRealDuration(audio.duration);
      }
    };
    const onTimeUpdate = () => {
      if (mode === 'sample') setCurrentTime(audio.currentTime);
    };
    const onPlay = () => {
      if (mode === 'sample') {
        setIsPlaying(true);
        setAudioError(false);
      }
    };
    const onPause = () => {
      if (mode === 'sample') setIsPlaying(false);
    };
    const onEnded = () => {
      if (mode === 'sample') {
        setIsPlaying(false);
        setCurrentTime(audio.duration || realDuration);
      }
    };
    const onError = () => {
      if (mode === 'sample') {
        setIsPlaying(false);
        setAudioError(true);
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [mode, realDuration]);

  const switchMode = (nextMode) => {
    if (nextMode === mode) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(false);
    lastSegIdRef.current = null;
    setMode(nextMode);
  };

  const togglePlayback = async () => {
    if (mode === 'call') {
      if (isPlaying) {
        setIsPlaying(false);
        return;
      }
      if (currentTime >= duration - 0.1) {
        setCurrentTime(0);
        lastSegIdRef.current = null;
      }
      setIsPlaying(true);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    if (isPlaying) {
      audio.pause();
      return;
    }
    if (audio.ended || currentTime >= duration - 0.1) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
    try {
      await audio.play();
    } catch {
      setAudioError(true);
    }
  };

  const handleReplay = async () => {
    setCurrentTime(0);
    lastSegIdRef.current = null;
    if (mode === 'call') {
      setIsPlaying(true);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.muted = isMuted;
    try {
      await audio.play();
    } catch {
      setAudioError(true);
    }
  };

  const seekTo = (nextTime) => {
    const clamped = Math.min(duration, Math.max(0, nextTime));
    setCurrentTime(clamped);
    if (mode === 'sample' && audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  };

  const handleWaveClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    seekTo(ratio * duration);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className="player-card" aria-label="Two-speaker call player">
      <audio ref={audioRef} src="./audio/voice-desk-demo.mp3" preload="metadata" />

      <div className="player-top">
        <div className="player-mode-switch" role="tablist" aria-label="Audio track mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'call'}
            className={`mode-pill ${mode === 'call' ? 'is-active' : ''}`}
            onClick={() => switchMode('call')}
          >
            52s scripted scam call
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sample'}
            className={`mode-pill ${mode === 'sample' ? 'is-active' : ''}`}
            onClick={() => switchMode('sample')}
          >
            9s real voice sample
          </button>
        </div>

        <div className="player-speaker-meta">
          <span className="speaker-key">
            <span className="swatch swatch-desk" />
            AI Voice Desk
          </span>
          {mode === 'call' ? (
            <span className="speaker-key">
              <span className="swatch swatch-caller" />
              Unknown Caller
            </span>
          ) : null}
        </div>
      </div>

      <div className="player-controls">
        <button
          type="button"
          className="play-button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
        >
          {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
        </button>

        <div className="waveform-wrap">
          <div
            className="waveform-bars"
            onClick={handleWaveClick}
            role="presentation"
            title="Click anywhere on waveform to seek"
          >
            {WAVE_BARS.map((height, index) => {
              const barTime = ((index + 0.5) / WAVE_BARS.length) * duration;
              const barRatio = (index + 1) / WAVE_BARS.length;
              const isFilled = barRatio <= progressRatio;
              const barSeg = segments.find((s) => barTime >= s.start && barTime < s.end);
              const isCallerBar = barSeg?.role === 'caller';
              const isNearHead =
                isPlaying && Math.abs(barRatio - progressRatio) < 0.045;
              const dynamicHeight = isNearHead
                ? Math.min(96, height + 18)
                : height;

              return (
                <span
                  key={index}
                  className={`wave-bar ${isFilled ? 'is-filled' : ''} ${
                    isCallerBar ? 'is-caller' : 'is-desk'
                  } ${isNearHead ? 'is-head' : ''}`}
                  style={{ height: `${dynamicHeight}%` }}
                />
              );
            })}
          </div>
          <input
            type="range"
            className="sr-range"
            min={0}
            max={duration}
            step={0.1}
            value={Math.min(currentTime, duration)}
            onChange={(e) => seekTo(Number(e.target.value))}
            aria-label="Call playback position"
          />
          <div className="time-row">
            <span>{formatTime(currentTime)}</span>
            <span className="time-stage-pill">
              {activeSegment?.speaker || 'AI Voice Desk'}
            </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-icon-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio cues' : 'Mute audio cues'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon size={16} muted={isMuted} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={handleReplay}
            aria-label="Replay from start"
            title="Replay"
          >
            <ReplayIcon size={16} />
          </button>
        </div>
      </div>

      {audioError ? (
        <p className="player-error" role="alert">
          Audio could not start automatically. Tap Play again to listen.
        </p>
      ) : null}

      <div className="transcript-stream" aria-label="Synchronized call transcript">
        {segments.map((seg) => {
          const isActive = activeSegment?.id === seg.id && (isPlaying || currentTime > 0);
          const isPassed = currentTime >= seg.end;
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => seekTo(seg.start + 0.05)}
              className={`transcript-turn role-${seg.role} ${isActive ? 'is-active' : ''} ${
                isPassed ? 'is-passed' : ''
              }`}
            >
              <span className="turn-meta">
                <span className="turn-speaker">{seg.speaker}</span>
                <span className="turn-time">{formatTime(seg.start)}</span>
              </span>
              <span className="turn-text">{seg.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
