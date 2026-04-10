import { computed, onBeforeUnmount, ref, watch } from "vue";

export default function useMouthAnimation(getTalkLevel: () => number) {
  const normalizedTalk = computed(() => Math.min(1, Math.max(0, getTalkLevel())));
  const isTalking = computed(() => normalizedTalk.value > 0.08);

  const mouthPhase = ref(0);
  let phaseRaf: number | null = null;
  let lastTick = 0;
  let elapsed = 0;

  function stopMouthLoop() {
    if (phaseRaf) {
      window.cancelAnimationFrame(phaseRaf);
      phaseRaf = null;
    }

    lastTick = 0;
    elapsed = 0;
    mouthPhase.value = 0;
  }

  function startMouthLoop() {
    if (phaseRaf) {
      return;
    }

    mouthPhase.value = 1;

    const loop = (timestamp: number) => {
      if (!lastTick) {
        lastTick = timestamp;
      }

      const delta = timestamp - lastTick;
      lastTick = timestamp;
      elapsed += delta;

      const phaseDelay = 170 - normalizedTalk.value * 95;

      if (elapsed >= phaseDelay) {
        mouthPhase.value = mouthPhase.value >= 3 ? 1 : mouthPhase.value + 1;
        elapsed = 0;
      }

      phaseRaf = window.requestAnimationFrame(loop);
    };

    phaseRaf = window.requestAnimationFrame(loop);
  }

  watch(isTalking, (talking) => {
    if (talking) {
      startMouthLoop();
      return;
    }

    stopMouthLoop();
  });

  onBeforeUnmount(() => {
    stopMouthLoop();
  });

  return { mouthPhase };
}
