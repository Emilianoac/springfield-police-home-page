import { ref, watch } from "vue";

export default function useWelcomeFlow() {
  let welcomeModal = ref(true);
  let userOption = ref("");
  let showOffers = ref(false);

  function handleInit(lang) {
    welcomeModal.value = false;

    function createAudio(id, src) {
      let audio = document.createElement("audio");
      audio.setAttribute("id", id);
      let source = document.createElement("source");
      source.setAttribute("src", src);
      audio.appendChild(source);
      document.querySelector(".page-container").appendChild(audio);
    }

    if (lang == "en") {
      createAudio("welcome", "./audio/en/welcome.mp3");
      createAudio("optionNo", "./audio/en/no.mp3");
      createAudio("optionYes", "./audio/en/yes.mp3");

      setTimeout(() => {
        let audio = document.querySelector("#welcome");
        audio.play();
      }, 100);
    } else {
      createAudio("welcome", "./audio/es/welcome.mp3");
      createAudio("optionNo", "./audio/es/no.mp3");
      createAudio("optionYes", "./audio/es/yes.mp3");

      setTimeout(() => {
        let audio = document.querySelector("#welcome");
        audio.play();
      }, 100);
    }
  }

  watch(userOption, (value) => {
    let welcome = document.querySelector("#welcome");
    let optionYes = document.querySelector("#optionYes");
    let optionNo = document.querySelector("#optionNo");
    let patrol = document.querySelector(".patrol-img");

    if (value == "no") {
      patrol.style.display = "none";
      welcome.pause();
      optionYes.pause();
      optionYes.currentTime = 0;
      optionNo.play();
      document.querySelector("#yes").setAttribute("disabled", true);

      setTimeout(() => {
        patrol.style.display = "block";

        setTimeout(() => {
          showOffers.value = true;
        }, 2500);
      }, 5000);
    } else {
      patrol.style.display = "none";
      welcome.pause();
      optionNo.pause();
      optionNo.currentTime = 0;
      optionYes.play();
      document.querySelector("#no").setAttribute("disabled", true);

      setTimeout(() => {
        patrol.style.display = "block";

        setTimeout(() => {
          showOffers.value = true;
        }, 2500);
      }, 3500);
    }
  });

  return {
    welcomeModal,
    userOption,
    showOffers,

    handleInit,
  };
}
