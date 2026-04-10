import { ref, onBeforeUnmount } from "vue";

export default function useLipSync() {
  const talkLevel = ref(0);

  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let audioSource: MediaElementAudioSourceNode | null = null;
  let rafId: number | null = null;
  let activeAudio: HTMLAudioElement | null = null;
  const mediaSources = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();

  function stopLipSync() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    if (audioSource && analyser) {
      audioSource.disconnect(analyser);
    }

    if (analyser) {
      analyser.disconnect();
    }

    analyser = null;
    audioSource = null;
    talkLevel.value = 0;
  }

  function startLipSync(audio: HTMLAudioElement) {
    const BrowserAudioContext = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!BrowserAudioContext) {
      return;
    }

    if (!audioContext) {
      audioContext = new BrowserAudioContext();
    }

    stopLipSync();
    audioContext.resume();

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.78;

    audioSource = mediaSources.get(audio) ?? null;

    if (!audioSource) {
      audioSource = audioContext.createMediaElementSource(audio);
      mediaSources.set(audio, audioSource);
    }

    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    const frequencies = new Uint8Array(analyser.frequencyBinCount);

    const animate = () => {
      if (!analyser) {
        return;
      }

      analyser.getByteFrequencyData(frequencies);

      let sum = 0;
      for (let i = 0; i < frequencies.length; i++) {
        sum += frequencies[i];
      }

      talkLevel.value = Math.min(1, Math.max(0, sum / frequencies.length / 95));
      rafId = requestAnimationFrame(animate);
    };

    animate();
  }

  function playVoice(audio: HTMLAudioElement | null) {
    if (!audio) {
      return;
    }

    activeAudio = audio;
    startLipSync(audio);

    audio.play().catch(() => {
      stopLipSync();
    });
  }

  function pauseVoice(audio: HTMLAudioElement | null) {
    if (!audio) {
      return;
    }

    audio.pause();

    if (audio === activeAudio) {
      stopLipSync();
      activeAudio = null;
    }
  }

  onBeforeUnmount(() => {
    stopLipSync();

    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  });

  return { talkLevel, playVoice, pauseVoice, stopLipSync };
}
