<template>
  <div class="page" :class="{ page_disabled: isModalOpened || isMenuOpened }">
    <header-block
      @set-language="setLanguage"
      :current-language="currentLanguage"
      :is-menu-opened="isMenuOpened"
      @set-is-menu-opened="setIsMenuOpened"
      :is-modal-opened="isModalOpened"
      @set-is-modal-opened="setIsModalOpened"
    />
    <main-block @set-is-modal-opened="setIsModalOpened" />
    <footer-block />
    <modal v-model:show="isModalOpened"
      ><popup-form @set-is-modal-opened="setIsModalOpened"
    /></modal>
    <left-block @scroll-to-next="scrollToNext" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentLanguage: "EN",
      isMenuOpened: false,
      isModalOpened: false,
      y: 0,
    };
  },
  methods: {
    setLanguage(language) {
      this.currentLanguage = language;
    },
    setIsMenuOpened(isMenuOpened) {
      this.isMenuOpened = isMenuOpened;
    },
    setIsModalOpened(isModalOpened) {
      this.isModalOpened = isModalOpened;
    },
    scrollToNext() {
      const ids = ["top", "issues", "benefits", "advantages", "achievements"];
      const currentEl = document
        .elementFromPoint(window.screen.width / 2, window.screen.height / 2)
        .closest(".container");
      if (currentEl) {
        const id = currentEl.classList[0].split("__")[0];

        const nextId = ids[ids.indexOf(id) + 1];
        if (nextId) {
          const el = document.querySelector(`#${nextId}`);
          const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    },
  },
  watch: {
    isModalOpened: {
      handler() {
        if (this.isModalOpened === true) {
          this.y = window.pageYOffset;
        } else {
          setTimeout(() => window.scrollTo({ top: this.y }));
        }
      },
    },
    isMenuOpened: {
      handler() {
        if (this.isMenuOpened === true) {
          this.y = window.pageYOffset;
        } else {
          setTimeout(() => window.scrollTo({ top: this.y }));
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.page_disabled {
  position: relative;
  overflow: hidden;
  height: 100vh;
}
</style>