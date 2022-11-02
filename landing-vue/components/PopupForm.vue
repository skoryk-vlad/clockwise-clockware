<template>
  <div class="popup">
    <button class="popup__close" @click="$emit('setIsModalOpened', false)">
      <img src="@/assets/close-form-button.svg" alt="Close form" />
    </button>
    <div class="popup__title">
      LET'S DISCUSS <br />
      YOUR BUSINESS CASE!
    </div>
    <div class="popup__text">
      Everything is possible! We will analyze your existing situation, discover
      the bottlenecks and offer a solution that exactly matches your business
      case!
    </div>
    <form class="popup__form">
      <div class="popup__inputs">
        <div class="popup__input">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" placeholder="Klaus" />
        </div>
        <div class="popup__input">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" placeholder="Voormann" />
        </div>
      </div>
      <div class="popup__input">
        <label for="email">E–Mail</label>
        <input type="email" id="email" placeholder="klaus.voormann@email.de" />
      </div>
      <div class="popup__textarea">
        <label for="description">Some brief description or comments</label>
        <textarea
          type="email"
          id="description"
          placeholder="My business case is completely different, so I want to discuss it with you."
        ></textarea>
      </div>
    </form>
    <div class="popup__text">
      By pressing the “request a consultation” button you <br />
      agree with <span class="popup__link">data protection</span> policy
    </div>
    <div class="popup__button">
      <blue-button>Request a Consultation</blue-button>
    </div>
  </div>
</template>

<script>
import BlueButton from "./BlueButton.vue";
export default {
  components: { BlueButton },
};
</script>

<style lang="scss" scoped>
.popup {
  padding: 50px 50px 30px;
  max-width: 633px;
  position: relative;
}
.popup__close {
  position: absolute;
  top: 0;
  right: 0;
  transition: 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}
.popup__title {
  @include Title-Style(25px, -0.63px);
  line-height: 1.2;
  margin: 0px 0px 20px 0px;
}
.popup__text {
  opacity: 0.75;
  @include Text-Style(15px, -0.38px);
  margin: 0px 0px 50px 0px;
}
.popup__link {
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
.popup__form {
  padding: 0px 12px;
}
.popup__inputs {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -12px;

  > div {
    flex: 1 1 50%;
    padding: 0 12px;
  }
}
.popup__input {
  margin: 0px 0px 25px 0px;
  display: flex;
  flex-direction: column;

  label {
    @include Text-Style(13px, -0.33px);
    margin: 0px 0px 0px 24px;
  }
  input {
    padding: 10px 24px;
    border: solid 1px rgba(30, 30, 30, 0.25);
    border-radius: 72px;
    background: transparent;

    &::placeholder {
      opacity: 0.25;
      @include Text-Style(17px, -0.43px);
    }
  }
}
.popup__textarea {
  width: 100%;
  margin: 0px 0px 25px 0px;
  display: flex;
  flex-direction: column;

  label {
    @include Text-Style(13px, -0.33px);
    margin: 0px 0px 0px 24px;
  }
  textarea {
    padding: 10px 24px;
    border: solid 1px rgba(30, 30, 30, 0.25);
    border-radius: 22px;
    height: 132px;
    resize: none;
    background: transparent;

    &::placeholder {
      opacity: 0.25;
      @include Text-Style(17px, -0.43px);
    }
  }
}
.popup__button {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 576px) {
  .popup {
    max-width: 85vw;
    padding: 45px 25px 40px;
  }
}
</style>