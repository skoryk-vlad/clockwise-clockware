<template>
  <header class="header" id="header">
    <div class="header__container container">
      <nuxt-link to="#top">
        <div class="header__logo">
          <img
            class="header__1440"
            src="@/assets/logo-top-text.svg"
            alt="Clockwise Software"
          />
          <img
            class="header__768"
            src="@/assets/logo-top.svg"
            alt="Clockwise Software"
          />
        </div>
      </nuxt-link>

      <div
        class="header__burger"
        @click="this.$emit('setIsMenuOpened', !isMenuOpened)"
      >
        <img
          src="@/assets/menu.svg"
          alt="Menu"
          :class="{ header__burger_disabled: isMenuOpened }"
        />
        <img
          src="@/assets/menu-close.svg"
          alt="Menu"
          :class="{ header__burger_disabled: !isMenuOpened }"
        />
      </div>
      <nav class="header__navbar navbar">
        <ul class="navbar__list">
          <li class="navbar__item">
            <nuxt-link to="#benefits" class="navbar__link"
              >Benefits</nuxt-link
            >
          </li>
          <li class="navbar__item">
            <nuxt-link to="#advantages" class="navbar__link"
              >Advantages</nuxt-link
            >
          </li>
          <li class="navbar__item">
            <nuxt-link to="#achievements" class="navbar__link"
              >Achievements</nuxt-link
            >
          </li>
        </ul>
      </nav>
      <div class="header__lang lang">
        <div
          class="lang__item"
          :class="{ lang__item_active: currentLanguage === 'DE' }"
        >
          <button @click="$emit('callback', 'DE')">DE</button>
        </div>
        <div
          class="lang__item"
          :class="{ lang__item_active: currentLanguage === 'EN' }"
        >
          <button @click="$emit('callback', 'EN')">EN</button>
        </div>
      </div>
    </div>
    <div
      class="header__mobile-menu mobile-menu"
      :class="{ 'header__mobile-menu_opened': isMenuOpened }"
    >
      <nav class="mobile-menu__navbar mobile-navbar">
        <ul class="mobile-navbar__list">
          <li class="mobile-navbar__item">
            <nuxt-link to="#benefits" class="navbar__link"
              >Benefits</nuxt-link
            >
          </li>
          <li class="mobile-navbar__item">
            <nuxt-link to="#advantages" class="navbar__link"
              >Advantages</nuxt-link
            >
          </li>
          <li class="mobile-navbar__item">
            <nuxt-link to="#achievements" class="navbar__link"
              >Achievements</nuxt-link
            >
          </li>
          <li class="mobile-navbar__item">
            <nuxt-link to="#footer" class="navbar__link"
              >Imprint and Data protection</nuxt-link
            >
          </li>
        </ul>
      </nav>
      <div class="mobile-menu__lang mobile-lang">
        <div class="mobile-lang__text">Language</div>
        <div class="mobile-lang__buttons">
          <div
            class="mobile-lang__item"
            :class="{ 'mobile-lang__item_active': currentLanguage === 'DE' }"
          >
            <button @click="$emit('callback', 'DE')">DE</button>
          </div>
          <div
            class="mobile-lang__item"
            :class="{ 'mobile-lang__item_active': currentLanguage === 'EN' }"
          >
            <button @click="$emit('callback', 'EN')">EN</button>
          </div>
        </div>
      </div>
      <div class="mobile-menu__button">
        <blue-button @click="this.$emit('setIsModalOpened', true)"
          >Request a free consultation</blue-button
        >
      </div>
    </div>
  </header>
</template>
  
<script>
import BlueButton from "./BlueButton.vue";
export default {
  components: { BlueButton },
  props: {
    currentLanguage: {
      type: String,
      default: "EN",
    },
    isMenuOpened: {
      type: Boolean,
      default: false,
    },
    isModalOpened: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
  
<style lang="scss" scoped>
.header {
  position: -webkit-sticky;
  position: sticky;
  top: -1px;
  z-index: 10;
  background: #fff;
  margin: 0px 0px 38px 0px;
}
.header__container {
  padding: 40px 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
  background: #fff;
}
.header > div {
  flex: 0 1 33.333%;
}
.header__logo {
  height: 64px;
  cursor: pointer;
  margin: 0px 25px 0px 0px;
  position: relative;
  z-index: 6;
}
.header__logo img {
  height: 100%;
  object-fit: contain;
}
.header__1440 {
  display: block;
}
.header__768 {
  display: none;
}
.header__navbar {
  width: 432px;
}
.header__burger {
  display: none;
}
.header__burger_disabled {
  display: none;
}
.header__mobile-menu {
  top: -100%;
}

.navbar__list {
  display: flex;
  justify-content: space-between;
}
.navbar__item:not(:last-child) {
  margin: 0px 20px 0px 0px;
}
.navbar__link {
  font-weight: 600;
  text-align: center;
  @include Text-Style(17px, 0.13px);
}

.lang {
  display: flex;
  align-items: center;
  justify-content: center;
}
.lang__item {
  width: 56px;
  height: 24px;
  opacity: 0.25;
  text-align: center;
}
.lang__item button {
  @include Text-Style(17px, 0.13px);
  font-weight: 600;
  text-align: center;
}
.lang__item_active {
  opacity: 1;
}

.mobile-menu {
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 160px;
  flex: 1 1 100%;
  transition: 0.3s ease;
  background: #fff;
  display: flex;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 5;
}
.mobile-menu__button {
  display: flex;
  justify-content: center;
}

.mobile-navbar__list {
  display: flex;
  flex-direction: column;
}
.mobile-navbar__item {
  height: 56px;
  width: 100vw;
  display: flex;
  align-items: center;
  padding: 11px 40px;
  border: solid 1px #f3f3f3;
  border-left: 0;
  border-right: 0;
}
.mobile-navbar__item:not(:first-child) {
  border-top: 0;
}
.mobile-navbar__item a {
  font-family: $Catamaran;
  @include Text-Style(21px, -0.53px);
  font-weight: bold;
}

.mobile-lang {
  padding: 0px 40px;
  height: 56px;
  display: flex;
  align-items: center;
  margin: 50px 0px;
  border: solid 1px #f3f3f3;
  border-left: 0;
  border-right: 0;
  font-family: $Catamaran;
  @include Text-Style(21px, -0.53px);
  font-weight: bold;
}
.mobile-lang__text {
  margin-right: auto;
}
.mobile-lang__buttons {
  display: flex;
}
.mobile-lang__item {
  width: 56px;
  opacity: 0.25;
  text-align: center;
}
.mobile-lang__item button {
  @include Text-Style(17px, 0.13px);
  font-weight: 600;
  text-align: center;
}
.mobile-lang__item_active {
  opacity: 1;
}

@media (max-width: 1024px) {
  .header__container {
    padding: 40px 25px 40px 40px;
  }
}
@media (max-width: 768px) {
  .header__container {
    padding: 40px 20px 40px 50px;
  }
  .header__1440 {
    display: none;
  }
  .header__768 {
    display: block;
  }
}
@media (max-width: 576px) {
  .header__container {
    padding: 0px;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .header__logo {
    margin: 40px 0px 40px 35px;
  }
  .header__1440 {
    display: block;
  }
  .header__768 {
    display: none;
  }
  .header__burger {
    margin: 40px 35px 40px 0px;
  }
  .header_opened {
    position: fixed;
    width: 100%;
    height: 100%;
  }
  .header__burger {
    display: block;
  }
  .header__mobile-menu_opened {
    top: 140px;
  }

  .navbar {
    display: none;
  }

  .lang {
    display: none;
  }
}
@media (max-width: 350px) {
  .mobile-navbar__item {
    height: 48px;
  }
  .mobile-navbar__item a {
    font-size: 19px;
  }
}
</style>