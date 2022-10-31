<template>
  <section class="top" id="top">
    <div class="top__container container">
      <div class="top__column">
        <div class="top__body">
          <h1 class="top__title">LOGISTICS MANAGEMENT SOFTWARE DEVELOPMENT</h1>
          <div class="top__text">
            We solve transportation and stock management problems for Factories,
            Manufacturers, Carriers, Resellers, E-commerce and even more. Any
            issue can be solved with smart digitalization.
          </div>
        </div>
        <div class="top__button">
          <blue-button @click="this.$emit('setIsModalOpened', true)"
            >Request a free consultation</blue-button
          >
        </div>
      </div>
    </div>
    <div class="top__image image-top">
      <img src="@/assets/top-image.svg" alt="Clockwise Software" />
    </div>
  </section>
</template>

<script>
import BlueButton from "../BlueButton.vue";
import LeftBlock from "../LeftBlock.vue";
import Modal from "../Modal.vue";
export default {
  components: { BlueButton, LeftBlock, Modal },
};
</script>

<style lang="scss" scoped>
.top {
  position: relative;
}
.top__container {
  position: relative;
  width: 100%;
  padding: 170px 0px 225px 252px;
  display: flex;
}
.top__column {
  position: relative;
  z-index: 3;
  max-width: 100%;
  width: 100%;
}
.top__left-block {
  position: relative;
  left: -25px;
  width: 252px;
  height: 100%;
}
.top__title {
  @include Title-Style(55px, -1.38px);
  margin: 0px 0px 50px 0px;
  max-width: 710px;
}
.top__image {
  top: 100px;
  right: 0;
}
.top__text {
  @include Text-Style(21px, -0.53px);
  color: $charcoal;
  margin: 0px 0px 60px 0px;
  max-width: 570px;
}
.top__button {
  margin: 0px 0px 0px 295px;
}

.image-top {
  position: absolute;
  width: 415px;
  height: 522px;
  z-index: 1;
  overflow: hidden;
}
.image-top img {
  height: 100%;
}

@media (max-width: 1024px) {
  .top__container {
    padding: 170px 0px 225px 130px;
  }
  .top__left-block {
    left: -60px;
    width: 252px;
  }
  .top__title {
    font-size: 45px;
    margin: 0px 50px 50px 0px;
    max-width: 600px;
  }
  .top__text {
    font-size: 17px;
    margin: 0px 50px 60px 0px;
    max-width: 600px;
  }
  .top__image {
    top: 0px;
    padding-left: 200px;
  }
  .top__button {
    margin: 0px 0px 0px 150px;
  }
}
@media (max-width: 768px) {
  .top__container {
    padding: 170px 0px 144px 130px;
    background-position: right top;
  }
  .top__title {
    font-size: 35px;
    margin: 0px 20px 50px 0px;
    max-width: 452px;
  }
  .top__text {
    margin: 0px 20px 87px 0px;
    max-width: 440px;
  }
  .top__button {
    margin: 0px 0px 0px 82px;
  }
}
@media (max-width: 576px) {
  .top__container {
    padding: 90px 0px 350px;
  }
  .top__title {
    font-size: 30px;
    margin: 0px 25px 50px;
    max-width: 452px;
  }
  .top__text {
    margin: 0px 25px 87px;
    max-width: 440px;
  }
  .top__image {
    top: 400px;
    padding-left: 240px;
  }
  .top__button {
    margin: 0px 15px;
  }
  .image-top {
    height: 363px;
  }
}
</style>