import { ref, watch, nextTick, onBeforeUnmount, type Ref } from "vue";
import useLipSync from "./useLipSync";

interface WelcomeFlowProps {
  welcomeAudio: Ref<HTMLAudioElement | null>;
  optionNoAudio: Ref<HTMLAudioElement | null>;
  optionYesAudio: Ref<HTMLAudioElement | null>;
}

export default function useWelcomeFlow(props: WelcomeFlowProps) {
  let welcomeModal = ref(true);
  let userOption = ref("");
  let showOffers = ref(false);
  let showPatrol = ref(false);
  let showPanel = ref(false);
  let isChoiceLocked = ref(false);

  let revealTimer: ReturnType<typeof setTimeout> | null = null;
  let offersTimer: ReturnType<typeof setTimeout> | null = null;
  let optionNoEndedHandler: (() => void) | null = null;
  let optionYesEndedHandler: (() => void) | null = null;

  const welcomeSrc = ref("");
  const optionsNoSrc = ref("");
  const optionsYesSrc = ref("");

  const { welcomeAudio, optionNoAudio, optionYesAudio } = props;
  const { talkLevel, playVoice, pauseVoice } = useLipSync();

  function clearPendingTimers() {
    if (revealTimer) {
      clearTimeout(revealTimer);
      revealTimer = null;
    }

    if (offersTimer) {
      clearTimeout(offersTimer);
      offersTimer = null;
    }
  }

  function clearOptionEndedListeners() {
    if (optionNoAudio.value && optionNoEndedHandler) {
      optionNoAudio.value.removeEventListener("ended", optionNoEndedHandler);
    }

    if (optionYesAudio.value && optionYesEndedHandler) {
      optionYesAudio.value.removeEventListener("ended", optionYesEndedHandler);
    }

    optionNoEndedHandler = null;
    optionYesEndedHandler = null;
  }

  async function handleInit(lang: string) {
    clearPendingTimers();
    clearOptionEndedListeners();
    welcomeModal.value = false;
    userOption.value = "";
    showOffers.value = false;
    showPatrol.value = false;
    showPanel.value = false;
    isChoiceLocked.value = false;

    welcomeSrc.value = lang == "en" ? "./audio/en/welcome.mp3" : "./audio/es/welcome.mp3";
    optionsNoSrc.value = lang == "en" ? "./audio/en/no.mp3" : "./audio/es/no.mp3";
    optionsYesSrc.value = lang == "en" ? "./audio/en/yes.mp3" : "./audio/es/yes.mp3";

    await nextTick();

    if (welcomeAudio.value && optionNoAudio.value && optionYesAudio.value) {
      welcomeAudio.value.src = welcomeSrc.value;
      optionNoAudio.value.src = optionsNoSrc.value;
      optionYesAudio.value.src = optionsYesSrc.value;

      playVoice(welcomeAudio.value);
    }
  }

  watch(userOption, (value) => {
    if (value !== "no" && value !== "yes") {
      return;
    }

    clearPendingTimers();
    clearOptionEndedListeners();
    isChoiceLocked.value = true;
    showPatrol.value = false;
    showPanel.value = false;

    if (value == "no") {
      pauseVoice(welcomeAudio.value);
      pauseVoice(optionYesAudio.value);

      if (optionYesAudio.value) {
        optionYesAudio.value.currentTime = 0;
      }

      playVoice(optionNoAudio.value);

      if (optionNoAudio.value) {
        optionNoEndedHandler = () => {
          showPanel.value = true;
          optionNoEndedHandler = null;
        };

        optionNoAudio.value.addEventListener("ended", optionNoEndedHandler, { once: true });
      }

      revealTimer = setTimeout(() => {
        showPatrol.value = true;

        offersTimer = setTimeout(() => {
          showOffers.value = true;
        }, 2500);
      }, 5000);
    } else {
      pauseVoice(welcomeAudio.value);
      pauseVoice(optionNoAudio.value);

      if (optionNoAudio.value) {
        optionNoAudio.value.currentTime = 0;
      }

      playVoice(optionYesAudio.value);

      if (optionYesAudio.value) {
        optionYesEndedHandler = () => {
          showPanel.value = true;
          optionYesEndedHandler = null;
        };

        optionYesAudio.value.addEventListener("ended", optionYesEndedHandler, { once: true });
      }

      revealTimer = setTimeout(() => {
        showPatrol.value = true;

        offersTimer = setTimeout(() => {
          showOffers.value = true;
        }, 2500);
      }, 3500);
    }
  });

  onBeforeUnmount(() => {
    clearPendingTimers();
    clearOptionEndedListeners();
  });

  function handleReplay() {
    clearPendingTimers();
    clearOptionEndedListeners();
    welcomeModal.value = true;
    userOption.value = "";
    showOffers.value = false;
    showPatrol.value = false;
    showPanel.value = false;
    isChoiceLocked.value = false;

    if (welcomeAudio.value) {
      pauseVoice(welcomeAudio.value);
      welcomeAudio.value.currentTime = 0;
    }
    if (optionNoAudio.value) {
      pauseVoice(optionNoAudio.value);
      optionNoAudio.value.currentTime = 0;
    }
    if (optionYesAudio.value) {
      pauseVoice(optionYesAudio.value);
      optionYesAudio.value.currentTime = 0;
    }
  }

  return {
    welcomeModal,
    userOption,
    showOffers,
    showPatrol,
    showPanel,
    isChoiceLocked,
    talkLevel,

    handleInit,
    handleReplay,
  };
}
