// Synthesized sound effects using the Web Audio API — no external files needed.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function play(fn: (ac: AudioContext) => void) {
  try {
    const ac = getCtx();
    if (ac.state === "suspended") ac.resume();
    fn(ac);
  } catch {
    // Silently ignore — audio is non-critical
  }
}

/** Short rising tone — card added, vote cast */
export function sfxPop() {
  play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(600, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(900, ac.currentTime + 0.1);
    g.gain.setValueAtTime(0.15, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.15);
  });
}

/** Soft click — minor actions (delete, unvote) */
export function sfxClick() {
  play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(800, ac.currentTime);
    g.gain.setValueAtTime(0.1, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.06);
  });
}

/** Whoosh — phase change */
export function sfxPhaseChange() {
  play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(400, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(800, ac.currentTime + 0.15);
    o.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.3);
    g.gain.setValueAtTime(0.18, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.35);
  });
}

/** Bell — timer finished */
export function sfxTimerDone() {
  play((ac) => {
    [523, 659, 784].forEach((freq, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      const t = ac.currentTime + i * 0.15;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.4);
    });
  });
}

/** Soft descending tone — participant left */
export function sfxLeave() {
  play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(500, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(250, ac.currentTime + 0.25);
    g.gain.setValueAtTime(0.1, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.3);
  });
}

/** Tick — last seconds countdown */
export function sfxTick() {
  play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(1000, ac.currentTime);
    g.gain.setValueAtTime(0.05, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.04);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.04);
  });
}

/** Drop — card dropped into column */
export function sfxDrop() {
  play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(500, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.12);
    g.gain.setValueAtTime(0.12, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.15);
  });
}

/** Attention knock — someone is requesting to join */
export function sfxJoinRequest() {
  play((ac) => {
    [880, 0, 880].forEach((freq, i) => {
      if (freq === 0) return;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      const t = ac.currentTime + i * 0.15;
      o.frequency.setValueAtTime(freq, t);
      o.frequency.exponentialRampToValueAtTime(660, t + 0.12);
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.18);
    });
  });
}

/** Friendly chime — someone joined the board */
export function sfxJoin() {
  play((ac) => {
    [440, 554, 659].forEach((freq, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      const t = ac.currentTime + i * 0.1;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.3);
    });
  });
}
