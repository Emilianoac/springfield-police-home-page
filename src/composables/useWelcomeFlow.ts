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
  let isChoiceLocked = ref(false);

  let revealTimer: ReturnType<typeof setTimeout> | null = null;
  let offersTimer: ReturnType<typeof setTimeout> | null = null;

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

  async function handleInit(lang: string) {
    clearPendingTimers();
    welcomeModal.value = false;
    userOption.value = "";
    showOffers.value = false;
    showPatrol.value = false;
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
    isChoiceLocked.value = true;
    showPatrol.value = false;

    if (value == "no") {
      pauseVoice(welcomeAudio.value);
      pauseVoice(optionYesAudio.value);

      if (optionYesAudio.value) {
        optionYesAudio.value.currentTime = 0;
      }

      playVoice(optionNoAudio.value);

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
  });

  return {
    welcomeModal,
    userOption,
    showOffers,
    showPatrol,
    isChoiceLocked,
    talkLevel,

    handleInit,
  };
}
