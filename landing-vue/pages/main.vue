<template>
  <div>
    <main-block @set-is-modal-opened="setIsModalOpened" />
    <modal v-model:show="isModalOpened"
      ><popup-form @set-is-modal-opened="setIsModalOpened"
    /></modal>
    <left-block @scroll-to-next="scrollToNext" />
  </div>
</template>

<script>
definePageMeta({
  layout: "navigation",
});

export default {
  data() {
    return {
      currentLanguage: "EN",
      isMenuOpened: false,
      isModalOpened: false,
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
};
</script>

<style lang="scss">
</style>