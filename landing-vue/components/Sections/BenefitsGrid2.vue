<template>
  <section class="benefits" id="benefits">
    <div class="benefits__container container">
      <section-title class="benefits__title">
        HOW CAN YOU BENEFIT FROM CUSTOM LOGISTICS SOFTWARE?
      </section-title>
      <div class="benefits__body body">
        <div class="body__item item">
          <div class="item__number">1</div>
          <div class="item__title">Customized to your needs</div>
          <div class="item__text">
            A software is developed exclusively with your needs and plans in
            mind. This enables to solve unique problems efficiently
          </div>
        </div>
        <div class="body__item item">
          <div class="item__number">2</div>
          <div class="item__title">Short-term ROI</div>
          <div class="item__text">
            You will experience the first returns right in the first month after
            integrating the system in your current processes
          </div>
        </div>
        <div class="body__item item">
          <div class="item__number">3</div>
          <div class="item__title">Predictable scalability</div>
          <div class="item__text">
            A custom system grows along with your business since your company
            goals are taken into account in the development process
          </div>
        </div>
        <div class="body__item item">
          <div class="item__number">4</div>
          <div class="item__title">Improve, not rebuild</div>
          <div class="item__text">
            Custom software supports and improves your running processes
            step-by-step. Your current system keeps working
          </div>
        </div>
      </div>
      <div class="benefits__different different">
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
  </section>
</template>

<script>
import BlueButton from "../BlueButton.vue";
import LeftBlock from "../LeftBlock.vue";
import DifferentSection from "./DifferentSection.vue";
import SectionTitle from "./SectionTitle.vue";
export default {
  components: { BlueButton, LeftBlock, SectionTitle, DifferentSection },
};
</script>

<style lang="scss" scoped>
.benefits__container {
  display: grid;
  grid-template-rows: 210px 1fr 1fr;
  grid-template-areas:
    "title"
    "body"
    "different";
  margin: 44px auto 150px;
}
.benefits__title {
  grid-area: title;
  max-width: 600px;
  margin-left: 300px;
}
.benefits__body {
  grid-area: body;
  margin-left: 245px;
  margin-right: 150px;
}
.benefits__different {
  grid-area: different;
  margin: 118px 0px 0px 0px;
}

.body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 45px;
  grid-column-gap: 65px;
}
.body__item {
}
.item {
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 35px;
  grid-template-areas:
    "number title"
    "number text";
  grid-template-columns: 80px 1fr;
  grid-template-rows: 1fr 2fr;
}
.item__number-wrapper {
}
.item__number {
  grid-area: number;
  margin: 10px 0px 0px 0px;
  width: 80px;
  height: 80px;
  background: $pale-orange;
  border-radius: 50%;
  display: grid;
  align-content: center;
  justify-content: center;
  @include Title-Style(19.6px, -0.49px);
  color: #fff;
  box-shadow: 0px 5px 20px -5px $pale-orange;
}
.item__title {
  grid-area: title;
  @include Title-Style(25px, -0.63px);
  text-transform: none;
}
.item__text {
  grid-area: text;
  max-width: 345px;
  opacity: 0.75;
  @include Text-Style(17px, -0.43px);
}

.different {
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

@media (max-width: 1300px) {
  .benefits__title {
    margin-left: 120px;
  }
  .benefits__body {
    margin: 0px 20px;
  }
}
@media (max-width: 768px) {
  .benefits__container {
    margin: 44px auto 0px;
  }
  .benefits__title {
    font-size: 25px;
    max-width: 400px;
    margin-left: 90px;
  }
  .body {
  grid-template-columns: 1fr;
    grid-row-gap: 60px;
  }
  .item__title {
    font-size: 21px;
  }
  .item {
    grid-row-gap: 5px;
  }
}
@media (max-width: 576px) {
  .benefits__title {
    margin-left: 15px;
  }
  .body {
    grid-row-gap: 25px;
  }
  .item__title {
    font-size: 21px;
  }
  .item {
    grid-row-gap: 5px;
    grid-column-gap: 30px;
  }
  .different__text {
    font-size: 15px;
  }
}
</style>