<template>
  <div class="different">
    <div class="different__container container">
      <div class="different__body">
        <div class="different__title">
          YOUR BUSINESS CASE <br />
          IS COMPLETELY DIFFERENT?
          <div class="different__title_red">LET'S DISCUSS</div>
        </div>
        <blue-button
          class="different__button"
          @click="this.$emit('setIsModalOpened', true)"
          >Fill in the contact form</blue-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import BlueButton from "../BlueButton.vue";
import Modal from "../Modal.vue";
export default {
  components: { BlueButton, Modal },
};
</script>

<style lang="scss" scoped>
.different {
  padding: 60px 0px 170px;
}
.different__body {
  width: 345px;
  margin: 0 auto;
}
.different__title {
  @include Title-Style(25px, -0.63px);
  line-height: 1.2;
  text-align: center;
  margin: 0px 0px 30px 0px;
}
.different__title_red {
  color: $watermelon;
}

@media (max-width: 576px) {
  .different__title {
    font-size: 21px;
  }
}
</style>