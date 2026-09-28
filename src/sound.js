/**
 * Sound Service using Web Audio API
 * - Preloads SFX into memory buffers once at startup
 * - 0 network requests during gameplay
 * - 0ms latency, supports simultaneous overlapping sounds
 */

const baseUrl = import.meta.env.BASE_URL || '/';
const getAssetUrl = (path) => `${baseUrl}${path.replace(/^\//, '')}`;

class SoundService {
  constructor() {
    this.ctx = null;
    this.buffers = new Map();
    this.bgMusic = null;
    this.preloaded = false;
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  async preload() {
    if (this.preloaded) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Unlock AudioContext on first user interaction if suspended
    if (ctx.state === 'suspended') {
      const unlock = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
      };
      window.addEventListener('click', unlock);
      window.addEventListener('keydown', unlock);
      window.addEventListener('touchstart', unlock);
    }

    const soundMap = {
      hit: 'assets/hit.mp3',
      boost: 'assets/boost.mp3',
      loss1: 'assets/life-loss/1-life-loss.mp3',
      loss2: 'assets/life-loss/2-life-loss.mp3',
      loss3: 'assets/life-loss/3-life-loss.mp3',
      newLife: 'assets/new-life.mp3',
      fullLife: 'assets/full-life.mp3',
      noMoney: 'assets/no-money.mp3',
    };

    const loadSound = async (name, path) => {
      try {
        const fullUrl = getAssetUrl(path);
        const res = await fetch(fullUrl);
        const arrayBuffer = await res.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
      } catch (err) {
        console.warn(`[SoundService] Failed to preload sound "${name}":`, err);
      }
    };

    await Promise.all(
      Object.entries(soundMap).map(([name, path]) => loadSound(name, path))
    );

    this.preloaded = true;
  }

  play(name, { volume = 1.0, pitch = 1.0 } = {}) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const buffer = this.buffers.get(name);
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitch;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
  }

  playMusic(volume = 0.6) {
    if (!this.bgMusic) {
      this.bgMusic = new Audio(getAssetUrl('assets/music.mp3'));
      this.bgMusic.loop = true;
    }
    this.bgMusic.volume = volume;
    this.bgMusic.playbackRate = 1.0;

    const playPromise = this.bgMusic.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // Autoplay policy: will start on first user gesture
        const onFirstGesture = () => {
          if (this.bgMusic) this.bgMusic.play();
          window.removeEventListener('click', onFirstGesture);
          window.removeEventListener('keydown', onFirstGesture);
          window.removeEventListener('touchstart', onFirstGesture);
        };
        window.addEventListener('click', onFirstGesture);
        window.addEventListener('keydown', onFirstGesture);
        window.addEventListener('touchstart', onFirstGesture);
      });
    }
  }

  stopMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  setMusicPlaybackRate(rate) {
    if (this.bgMusic) {
      this.bgMusic.playbackRate = rate;
    }
  }
}

export const soundService = new SoundService();
