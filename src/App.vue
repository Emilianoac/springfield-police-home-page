<template>
  <main class="page-container">
    <div class="page__header">
      <span></span>
      <div><hr><hr><hr></div>
      <p>Springfield Police Home Page</p>
      <div><hr><hr><hr></div>
      <span></span>
    </div>

    <div class="page__left"></div>

    <div class="page__body">
      <div>
        <template v-if="!showOffers">
          <h1 class="page__title">Springfield Police Department</h1>
          <img class="clancy-img" src="./assets/images/clancy.svg">
    
          <div class="page__options">
            <input type="radio" name="select" value="yes" v-model="userOption" id="yes">
            <label for="yes">Yes</label>
    
            <input type="radio" name="select" value="no" v-model="userOption" id="no">
            <label for="no">No</label>
            <img class="patrol-img" src="./assets/images/patrol.svg">
          </div>
        
        </template>
        <template v-else>
          <ClancyOffers/>
          <p class="offer-text">NOW 80% OFF</p>
        </template>
      </div>
    </div>

    <div class="page__right">
      <span>▲</span>
      <span>▼</span>
    </div>

    <div class="page_bottom">
    </div>
  </main>

  <!-- WELCOME MODAL -->
  <div class="welcome-modal" v-if="welcomeModal">
    <div class="modal__content">
      <div class="modal__header">
        <h5>Springfield Police Home Page</h5>
      </div>
      <div class="modal__body">
        <img class="modal__img" src="./assets/images/clancy.svg" >
        <p class="modal__text">Welcome to the Springfield Police Home Page. To proceed, please select your language</p>
      </div>
      <div class="modal__footer">
        <button @click.prevent="handleInit('en')" >English</button>
        <button @click.prevent="handleInit('es')" >Spanish</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {ref, watch} from 'vue'
  import ClancyOffers from './components/icons/ClancyOffers.vue';

  let welcomeModal = ref(true)
  let userOption = ref('')
  let showOffers = ref(false)

  function handleInit(lang) {
    welcomeModal.value = false

    function createAudio(id, src) {
      let audio = document.createElement('audio')
      audio.setAttribute('id', id)
      let source = document.createElement('source')
      source.setAttribute('src', src)
      audio.appendChild(source)
      document.querySelector('.page-container').appendChild(audio)
    }

    if(lang == 'en') {
      createAudio('welcome', './audio/en/welcome.mp3')
      createAudio('optionNo', './audio/en/no.mp3')
      createAudio('optionYes', './audio/en/yes.mp3')

      setTimeout(() => {
        let audio = document.querySelector('#welcome')
        audio.play()
 
      },100)

      //



    } else {
      createAudio('welcome', './audio/es/welcome.mp3')
      createAudio('optionNo', './audio/es/no.mp3')
      createAudio('optionYes', './audio/es/yes.mp3')

      setTimeout(() => {
        let audio = document.querySelector('#welcome')
        audio.play()

      },100)
    }
  }

  watch(userOption, (value) => {
    let welcome = document.querySelector('#welcome')
    let optionYes = document.querySelector('#optionYes')
    let optionNo = document.querySelector('#optionNo')
    let patrol = document.querySelector('.patrol-img')

    if(value == 'no') {
      patrol.style.display = 'none'
      welcome.pause()
      optionYes.pause()
      optionYes.currentTime = 0
      optionNo.play()
      document.querySelector('#yes').setAttribute('disabled', true)

      setTimeout(() => {
        patrol.style.display = 'block'

        setTimeout(() => {
          showOffers.value = true
          
        }, 2500)
      },5000)
    } else {
      patrol.style.display = 'none'
      welcome.pause()
      optionNo.pause()
      optionNo.currentTime = 0
      optionYes.play()
      document.querySelector('#no').setAttribute('disabled', true)

      setTimeout(() => {
        patrol.style.display = 'block'

        setTimeout(() => {
          showOffers.value = true
        }, 2500)
      },3500)
    }
  })
 
</script>

<style lang="scss">

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }

  body {
    min-height: 100vh;
    background: #948EBD;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    overflow: hidden;
  }

  .page-container {
    display: grid;
    grid-template-columns: 20px 1fr 20px;
    grid-template-rows: min-content 1fr min-content;
    height: 100vh;

    .page__header {
      grid-row: 1;
      grid-column: 1 / 4;
      display: grid;
      grid-template-columns: 26px 1fr max-content 1fr 26px;
      grid-column-gap: 20px;
      position: relative;
      font-size: 1.3em;
      font-family: Arial, Helvetica, sans-serif;
      background: #B1B4B5;
      border-bottom: 1px solid black;
      text-align: center;
      padding: 0.5em 20px;
      z-index: 1;

      hr {
        margin-bottom: 0.5em;
        border-color: #838383;
        border-style: solid;

        &:last-of-type {
          margin-bottom: 0;
        }
      }

      span {
        width: 100%;
        height: 100%;
        border: 1px solid black;
        position: relative;

        &:first-of-type {
          background: white;
        }

        &:last-of-type {
          background: #a4a2a2;

          &::before {
            width: 100%;
            height: 100%;
            border: 1px solid black;
            position: absolute;
          }
        }
      }

      p {
        margin: 0;
      }

      &::before, 
      &::after {
        content: '';
        background: #b1b4b5;
        height: 10px;
        width: 19px;
        position: absolute;
        bottom: -1px;
      }

      &::before {
        left: 0;
      }

      &::after {
        right: 0;
        content: unset;
      }
    }

    .page__body {
      grid-column: 2;
      text-align: center;
      align-self: center;

      .page__title {
        font-size: 2.4em;
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        font-style: italic;
        color: #0d0c46;
        font-weight: 700;
        margin-bottom: 0.6em;
      }

      .clancy-img {
        max-width: 300px;
        width: 100%;
        margin: auto;
        display: block;
        object-fit: cover;
        z-index: -1;
        transform-origin: center;
      }

      .page__options {
        margin-top: 3em;
        display: flex;
        align-items: center;
        justify-content: center;
    
        input {
          appearance: none;
          width: 40px;
          height: 40px;
          outline: 3px solid black  ;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          margin-right: 0.9em;
    
          &:checked {
            background: black;
            border: 3px solid white;
          }
        }
    
        label {
          font-size: 1.9em;
          cursor: pointer;
          margin-right: 1em;
    
          &:last-of-type {
            margin-right: 0;
          }
        }
      }

      .patrol-img {
        display: none;
        position: absolute;
        bottom: 25px;
        right: 25px;
        animation: show 0.9s ease-in-out infinite;
      }

      .offer-text {
        color: #f8e055;
        font-size: 5em;
        font-weight: 700;
        text-shadow: 2px 2px black;
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        animation: show   infinite;
        animation-duration: 1s;
        animation-delay: 0;
      }
    }

    .page__left {
      grid-column: 1;
      grid-row: 2 / 3;
      height: 100%;
      background: #B1B4B5;
      border-right: 1px solid black;
    }
  
    .page__right {
      grid-column: 3;
      grid-row: 2 / 3;
      height: 100%;
      background: #B1B4B5;
      border-left: 1px solid black;
  
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
  
      span {
        border: 1px solid black;
        width: 100%;
        display: flex;
        justify-content: center;
        border-top: 0;
        border-left: 0;
        border-right: 0;
  
        &:last-of-type {
          border-top: 1px solid black;
          border-bottom: 0;
        }
      }
    }
  
    .page_bottom {
      grid-column: 1 / 4;
      grid-row: 3;
      height: 20px;
      background: #B1B4B5;
      border-top: 1px solid black;
      position: relative;
  
      &::before {
        content: '';
        position: absolute;
        width: 19px;
        height: 4px;
        background: #b1b4b5;
        left: 0;
        top: -1px;
      }
    }
  }

  .welcome-modal {
    position: absolute;
    top: 0;
    left: 0;
    background: #948ebddb;
    backdrop-filter: blur(4px);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    
    .modal__content {
      padding: 1.4em;
      background: #b1b4b5;
      border: 6px solid #c6c0c0;
      box-shadow: 5px 7px black;
      max-width: 500px;
      margin: auto;
      width: 90%;

      .modal__header {
        font-size: 1.3em;
        text-transform: uppercase;
        text-align: center;
        
        h5 {
          letter-spacing: 1px;
          font-weight: 700;
        }
      }

      .modal__body {
        display: flex;
        align-items: center;
        margin: 1.5em 0;

        img {
          margin-right: 1em;
          max-width: 100px;
          user-select: none;  
        }

        p {
          margin: 0;
        }
      }

      .modal__footer {
        display: flex;

        button {
          cursor: pointer;
          border: 1px solid black;
          background: white;

          &:first-of-type {
            margin-right: 0.4em;
          }
        }
      }

      img {
        max-width: 30px;
      }

      button {
        border: 1px solid black;
        width: 100%;
        padding: 0.4em;
      }
    }
  }

  @keyframes show {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (max-width: 575px) {

    .page-container {

      .page__header {
        align-items: center;
        grid-column-gap: 10px;

        p {
          font-size: 0.7em;
        }
      }

      .page__body {
        padding: 0.5em;
  
        .page__title {
          font-size: 1.4em;
          margin-bottom: 1.3em;    
        }
  
        .page__options {

          label {
            font-size: 1.2em;
          }

          input {
            width: 30px;
            height: 30px;
          }
        }
  
        .offer-text {
          font-size: 2.8em;
          width: 85%;
          bottom: unset;
        }

        .patrol-img {
          max-width: 100px;
        }

        .clancy-products {
          height: 300px;
          max-width: 90%;
          transform: scale(1.7);
        }
      }
    }

    .welcome-modal {

      .modal__content {
        padding: 1em;

        .modal__body {
          display: block;

          img {
            margin: 0 auto;
            margin-bottom: 0.5em;
            display: block;
          }
        }
      }
    }

  }
</style>
