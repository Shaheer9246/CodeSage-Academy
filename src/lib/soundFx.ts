/**
 * ==============================================================================
 * CodeSage Web Audio Synthesizer & Micro-Feedback Engine
 * 100% Procedural synthesis using standard browser AudioContext.
 * Zero external audio files · Zero download bandwidth · Pure 60fps audio.
 * ==============================================================================
 */

const STORAGE_KEY = 'codesage_sound_enabled';

// Shared singleton AudioContext initialized lazily on first user interaction
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/** Check if Sound FX is enabled (defaults to true) */
export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
}

/** Set Sound FX enabled/disabled */
export function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('codesage:sound-changed', { detail: { enabled } }));
  } catch {
    // Ignore storage quota/permission errors
  }
}

/** Toggle Sound FX and return the new state */
export function toggleSound(): boolean {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  if (next) {
    playClick();
  }
  return next;
}

/** Haptic feedback on supported mobile devices */
export function triggerHaptic(durationMs = 15): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(durationMs);
    }
  } catch {
    // Ignore haptic errors on restricted browsers
  }
}

/**
 * Play Test Passed Chime:
 * Smooth rising 440Hz -> 880Hz gentle sine wave with exponential decay.
 */
export function playTestPassed(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency ramps gracefully from 440Hz (A4) to 880Hz (A5)
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    // Soft volume curve (attack -> decay)
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);

    triggerHaptic(25);
  } catch {
    // Graceful fallback if AudioContext fails
  }
}

/**
 * Play Streak / Triumph Fanfare:
 * Triumphant 4-note major chord arpeggio (C5 -> E5 -> G5 -> C6).
 */
export function playStreakFanfare(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // C5, E5, G5, C6 (Major celebratory arpeggio)
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.085;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const noteDuration = idx === notes.length - 1 ? 0.45 : 0.22;
      const peakVol = idx === notes.length - 1 ? 0.14 : 0.09;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(peakVol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.05);
    });

    triggerHaptic([30, 40, 50]);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play Level Up / Milestone celebration:
 * Sparkling uplifting harmonic sweep.
 */
export function playLevelUp(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.25);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);

    triggerHaptic(35);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play subtle UI tick:
 * Soft 15ms click sound.
 */
export function playClick(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Graceful fallback
  }
}
