// ═══════════════════════════════════════════════════════════════════
//  AUDIO.JS  –  Web Audio API sound design for the space sim
//  No external files — everything synthesised at runtime
// ═══════════════════════════════════════════════════════════════════

export class SpaceAudio {
  constructor() {
    this.ctx        = null;
    this.masterGain = null;
    this.started    = false;

    // Nodes we need to keep refs to for modulation
    this._ambientNodes  = [];
    this._timeWarpNode  = null;
    this._timeWarpGain  = null;
    this._lastSpeed     = 1;
  }

  // Must be called from a user gesture (click) to unlock AudioContext
  init() {
    if (this.started) return;
    this.started = true;

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this._startAmbient();
    this._buildTimeWarp();
  }

  // ── Deep space ambient drone ──────────────────────────────────────
  _startAmbient() {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Layer 1: very low sub-bass rumble
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(28, now);
    // Slow drift ±2 Hz
    sub.frequency.linearRampToValueAtTime(30, now + 8);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.0, now);
    subGain.gain.linearRampToValueAtTime(0.28, now + 3); // fade in
    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(now);
    this._ambientNodes.push(sub, subGain);

    // Layer 2: mid drone with gentle tremolo
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(55, now);
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0, now);
    droneGain.gain.linearRampToValueAtTime(0.12, now + 4);

    // Tremolo LFO
    const tremLFO = ctx.createOscillator();
    tremLFO.type = 'sine';
    tremLFO.frequency.setValueAtTime(0.18, now);
    const tremDepth = ctx.createGain();
    tremDepth.gain.setValueAtTime(0.04, now);
    tremLFO.connect(tremDepth);
    tremDepth.connect(droneGain.gain);
    tremLFO.start(now);

    drone.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone.start(now);
    this._ambientNodes.push(drone, droneGain, tremLFO, tremDepth);

    // Layer 3: high shimmer — filtered noise
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, now);
    bandpass.Q.setValueAtTime(0.3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0, now);
    noiseGain.gain.linearRampToValueAtTime(0.04, now + 5);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
    this._ambientNodes.push(noise, bandpass, noiseGain);

    // Layer 4: occasional deep pulse
    this._schedulePulses();
  }

  _schedulePulses() {
    if (!this.started) return;
    const ctx  = this.ctx;
    const now  = ctx.currentTime;
    const wait = 6 + Math.random() * 10;

    setTimeout(() => {
      if (!this.started) return;
      const osc  = ctx.createOscillator();
      osc.type   = 'sine';
      osc.frequency.setValueAtTime(38, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(22, ctx.currentTime + 2.5);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.4);
      g.gain.linearRampToValueAtTime(0.0,  ctx.currentTime + 2.5);

      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.6);

      this._schedulePulses();
    }, wait * 1000);
  }

  // ── Zoom whoosh when clicking a planet ───────────────────────────
  playZoom() {
    if (!this.started) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Filtered noise sweep — descending
    const bufSize = ctx.sampleRate * 1.5;
    const buf  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 1.2);
    filter.Q.setValueAtTime(1.5, now);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0, now);
    g.gain.linearRampToValueAtTime(0.22, now + 0.08);
    g.gain.linearRampToValueAtTime(0.0,  now + 1.2);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    src.start(now);
    src.stop(now + 1.3);
  }

  // ── Planet tone — unique note per body ────────────────────────────
  // Each planet mapped to a frequency in a pentatonic-ish scale
  playPlanetTone(name) {
    if (!this.started) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const TONES = {
      Sun:              110.0,
      Mercury:          220.0,
      Venus:            246.9,
      Earth:            261.6,
      Mars:             293.7,
      Jupiter:          196.0,
      Saturn:           174.6,
      Uranus:           164.8,
      Neptune:          146.8,
      Pluto:            130.8,
      Ceres:            277.2,
      Luna:             329.6,
      Io:               349.2,
      Europa:           392.0,
      Ganymede:         415.3,
      Callisto:         440.0,
      Titan:            466.2,
      Enceladus:        493.9,
      Triton:           523.3,
      Sirius:           587.3,
      Betelgeuse:        98.0,
      Rigel:            523.3,
      'Proxima Centauri': 311.1,
      'Comet Halley':   233.1,
    };

    const freq = TONES[name] ?? 261.6;

    // Soft bell-like tone: sine + subtle harmonics
    const makePartial = (f, amp, detune = 0) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f + detune, now);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0, now);
      g.gain.linearRampToValueAtTime(amp, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 2.6);
    };

    makePartial(freq,        0.18);
    makePartial(freq * 2,    0.07,  1.5);
    makePartial(freq * 3,    0.03,  2.0);
    makePartial(freq * 0.5,  0.08);
  }

  // ── Time warp effect ─────────────────────────────────────────────
  _buildTimeWarp() {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0, ctx.currentTime);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    osc.start();

    this._timeWarpOsc    = osc;
    this._timeWarpFilter = filter;
    this._timeWarpGain   = g;
  }

  updateTimeWarp(speedMultiplier) {
    if (!this.started) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const abs = Math.abs(speedMultiplier);
    const rev = speedMultiplier < 0;

    if (abs <= 1) {
      // Normal/paused — fade out warp sound
      this._timeWarpGain.gain.linearRampToValueAtTime(0.0, now + 0.3);
    } else {
      // Fast forward / reverse — pitch and volume scale with speed
      const targetGain  = Math.min(0.12, (abs - 1) * 0.02);
      const targetFreq  = 60 * (abs / 2);
      const targetCutoff = 150 + abs * 40;

      this._timeWarpGain.gain.linearRampToValueAtTime(targetGain, now + 0.4);
      this._timeWarpOsc.frequency.linearRampToValueAtTime(
        rev ? targetFreq * 0.6 : targetFreq, now + 0.4
      );
      this._timeWarpFilter.frequency.linearRampToValueAtTime(targetCutoff, now + 0.4);
    }
    this._lastSpeed = speedMultiplier;
  }

  // ── Master volume ─────────────────────────────────────────────────
  setVolume(v) {
    if (!this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, v)), this.ctx.currentTime + 0.1
    );
  }

  // ── Mute toggle ───────────────────────────────────────────────────
  mute(on) {
    this.setVolume(on ? 0 : 0.55);
  }
}
