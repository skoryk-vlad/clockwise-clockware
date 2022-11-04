<template>
  <section class="benefits" id="benefits">
    <div class="benefits__container container">
      <div class="benefits__image image-benefits">
        <img src="@/assets/benefits-image.svg" alt="Benefits" />
      </div>
      <div class="benefits__column">
        <div class="benefits__body">
          <section-title class="benefits__title">
            HOW CAN YOU BENEFIT FROM CUSTOM LOGISTICS SOFTWARE?
          </section-title>
          <div class="benefits__list list">
            <div class="list__column">
              <div class="list__item item-list">
                <div class="item-list__number-wrapper">
                  <div class="item-list__number">1</div>
                </div>
                <div class="item-list__body">
                  <div class="item-list__title">Customized to your needs</div>
                  <div class="item-list__text">
                    A software is developed exclusively with your needs and
                    plans in mind. This enables to solve unique problems
                    efficiently
                  </div>
                </div>
              </div>
            </div>
            <div class="list__column">
              <div class="list__item item-list">
                <div class="item-list__number-wrapper">
                  <div class="item-list__number">2</div>
                </div>
                <div class="item-list__body">
                  <div class="item-list__title">Short-term ROI</div>
                  <div class="item-list__text">
                    You will experience the first returns right in the first
                    month after integrating the system in your current processes
                  </div>
                </div>
              </div>
            </div>
            <div class="list__column">
              <div class="list__item item-list">
                <div class="item-list__number-wrapper">
                  <div class="item-list__number">3</div>
                </div>
                <div class="item-list__body">
                  <div class="item-list__title">Predictable scalability</div>
                  <div class="item-list__text">
                    A custom system grows along with your business since your
                    company goals are taken into account in the development
                    process
                  </div>
                </div>
              </div>
            </div>
            <div class="list__column">
              <div class="list__item item-list">
                <div class="item-list__number-wrapper">
                  <div class="item-list__number">4</div>
                </div>
                <div class="item-list__body">
                  <div class="item-list__title">Improve, not rebuild</div>
                  <div class="item-list__text">
                    Custom software supports and improves your running processes
                    step-by-step. Your current system keeps working
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <different-section
        class="benefits__different"
        @set-is-modal-opened="this.$emit('setIsModalOpened', $event)"
      />
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
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 0px 0px 0px 252px;
}
.benefits__column {
  max-width: 100%;
}
.benefits__different {
  flex: 1 1 100%;
  position: relative;
  z-index: 3;
}
.benefits__left-block {
  position: relative;
  left: -25px;
  width: 252px;
  height: 100%;
}
.benefits__body {
  position: relative;
  z-index: 3;
  margin: 0px 0px 0px -95px;
  padding: 44px 0px 0px 0px;
}
.benefits__image {
  top: 0;
  left: 155px;
}
.benefits__title {
  margin: 0px 0px 140px 140px;
  max-width: 600px;
}
.benefits__list {
  margin: 0px 0px 0px 88px;
}

.image-benefits {
  position: absolute;
  width: 960px;
  height: 608px;
  z-index: 1;
}
.image-benefits {
  img {
    width: 100%;
    height: 100%;
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  width: 1056px;
}
.list__column {
  flex: 1 1 50%;
}
.item-list {
  display: flex;
  margin: 0px 73px 61px -2px;
}
.item-list__number {
  margin: 10px 0px 0px 0px;
  width: 80px;
  height: 80px;
  background: $pale-orange;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  @include Title-Style(19.6px, -0.49px);
  color: #fff;
  box-shadow: 0px 5px 20px -5px $pale-orange;
}
.item-list__number-wrapper {
  width: 80px;
  height: 80px;
  display: block;
}
.item-list__body {
  max-width: 345px;
  margin: 0px 0px 0px 30px;
}
.item-list__title {
  @include Title-Style(25px, -0.63px);
  text-transform: none;
  margin: 0px 0px 20px 0px;
}
.item-list__text {
  opacity: 0.75;
  @include Text-Style(17px, -0.43px);
}

@media (max-width: 1300px) {
  .benefits__container {
    padding: 0px;
  }
  .benefits__left-block {
    display: none;
  }
  .benefits__body {
    margin: 0px 0px 0px 15px;
    background-size: 900px 608px;
  }
  .benefits__list {
    margin: 0px 0px 0px 80px;
  }
  .benefits__image {
    left: 15px;
    width: 900px;
  }
  .list {
    width: 990px;
  }
  .item-list {
    margin: 0px 0px 50px 0px;
  }
  .item-list__body {
    margin: 0px 0px 0px 15px;
  }
}
@media (max-width: 1024px) {
  .benefits__title {
    margin: 0px 0px 120px 92px;
    max-width: 400px;
    font-size: 25px;
  }
  .benefits__list {
    margin: 0px 0px 0px 58px;
  }
  .benefits__image {
    top: 312px;
    left: -192px;
    width: 960px;
    transform: rotate(-270deg);
  }
  .benefits__image {
    img {
      object-fit: contain;
    }
  }
  .list {
    width: 100%;
  }
  .list__column {
    flex: 1 1 100%;
  }
  .item-list {
    margin: 0px 10px 75px 0px;
    max-width: 100%;
  }
  .item-list__body {
    margin: 0px 0px 0px 35px;
  }
  .item-list__title {
    font-size: 21px;
    letter-spacing: -0.53px;
    margin: 0px 0px 10px 0px;
  }
}
@media (max-width: 576px) {
  .benefits__title {
    margin: 15px 0px 180px;
    max-width: 375px;
    font-size: 21px;
  }
  .benefits__list {
    margin: 0px;
  }
  .benefits__body {
    margin: 0px 0px 0px 15px;
  }
  .benefits__image {
    top: 240px;
    left: -602px;
    height: 890px;
  }
  .list {
    margin: 0px 0px 80px 0px;
  }
  .item-list {
    margin: 0px 10px 45px 0px;
  }
  .item-list__body {
    margin: 0px 0px 0px 30px;
    max-width: 240px;
  }
  .item-list__title {
    text-transform: uppercase;
    height: 42px;
    display: flex;
    align-items: center;
  }
  .item-list__text {
    font-size: 15px;
    letter-spacing: -0.38px;
  }
}
</style>