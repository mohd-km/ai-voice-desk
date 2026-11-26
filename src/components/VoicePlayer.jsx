import React, { useEffect, useRef, useState } from 'react';
import { TRANSCRIPT_SEGMENTS } from '../data/scenarios';
import { PauseIcon, PlayIcon, ReplayIcon } from './Icons';

const WAVE_BARS = [
  24, 42, 30, 58, 76, 48, 66, 88, 52, 36, 70, 92, 62, 44, 78, 54, 40, 82, 68, 46, 34, 64, 86, 56,
  42, 74, 60, 48, 32, 52, 68, 38
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VoicePlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(9.1);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onPlay = () => {
      setIsPlaying(true);
      setHasError(false);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || duration);
    };
    const onError = () => {
      setIsPlaying(false);
      setHasError(true);
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
  }, [duration]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    if (audio.ended || (duration > 0 && currentTime >= duration - 0.1)) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }

    try {
      await audio.play();
    } catch {
      setHasError(true);
    }
  };

  const handleReplay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    try {
      await audio.play();
    } catch {
      setHasError(true);
    }
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const nextTime = ratio * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleRangeChange = (event) => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);
    if (audio) {
      audio.currentTime = nextTime;
    }
    setCurrentTime(nextTime);
  };

  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className="player-card" aria-label="Cloned Voice Desk audio demo">
      <audio ref={audioRef} src="./audio/voice-desk-demo.mp3" preload="metadata" />

      <div className="player-header">
        <div>
          <span className="eyebrow">Real Voice Sample</span>
          <h2 className="player-title">Listen to the Cloned Voice Desk</h2>
        </div>
        <span className="player-badge" aria-live="polite">
          <span className={`live-dot ${isPlaying ? 'is-active' : ''}`} />
          {isPlaying ? 'Playing sample' : 'Ready to play'}
        </span>
      </div>

      <div className="player-controls">
        <button
          type="button"
          className="play-button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause voice desk demo' : 'Play voice desk demo'}
        >
          {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
        </button>

        <div className="waveform-wrap">
          <div
            className="waveform-bars"
            onClick={handleSeek}
            role="presentation"
            title="Click anywhere to seek"
          >
            {WAVE_BARS.map((height, index) => {
              const barRatio = (index + 1) / WAVE_BARS.length;
              const isFilled = barRatio <= progressRatio;
              return (
                <span
                  key={index}
                  className={`wave-bar ${isFilled ? 'is-filled' : ''} ${
                    isPlaying && isFilled ? 'is-live' : ''
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <input
            type="range"
            className="sr-range"
            min={0}
            max={duration || 9.1}
            step={0.1}
            value={Math.min(currentTime, duration || 9.1)}
            onChange={handleRangeChange}
            aria-label="Audio playback position"
          />
          <div className="time-row">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          className="replay-button"
          onClick={handleReplay}
          aria-label="Replay audio from start"
          title="Replay"
        >
          <ReplayIcon size={18} />
        </button>
      </div>

      {hasError ? (
        <p className="player-error" role="alert">
          Audio could not start automatically. Tap the play button again to hear the sample.
        </p>
      ) : null}

      <div className="transcript-box">
        <div className="transcript-label">Transcript</div>
        <p className="transcript-text">
          {TRANSCRIPT_SEGMENTS.map((seg, idx) => {
            const isActive =
              isPlaying && currentTime >= seg.start && currentTime < seg.end;
            const isPassed = currentTime >= seg.end;
            return (
              <span
                key={seg.id}
                className={`transcript-phrase ${isActive ? 'is-active' : ''} ${
                  isPassed ? 'is-passed' : ''
                }`}
              >
                {seg.text}
                {idx < TRANSCRIPT_SEGMENTS.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
