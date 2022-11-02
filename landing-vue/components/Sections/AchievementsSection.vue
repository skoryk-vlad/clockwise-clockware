<template>
  <section class="achievements" id="achievements">
    <div class="achievements__container container">
      <div class="achievements__column">
        <h2 class="achievements__title">
          WHAT OUR PARTNERS HAVE ACHIEVED WITH CUSTOM TRANSPORT MANAGEMENT
          SOFTWARE
        </h2>
        <div class="achievements__body">
          <div class="achievements__carousel">
            <carousel-achievements />
          </div>
          <div class="achievements__info info">
            <div class="info__title">
              ERP system for construction materials factory
            </div>
            <div class="info__text">
              <p>
                Custom logistics software includes several modules that enabled
                to fully digitalize a factory <br />
                – Order and stock management optimization <br />
                – Automatic invoicing and accounting <br />
                – Delivery scheduling and route planning <br />
                – Automatic contractors selection <br />
              </p>
              <p>
                Eliminating manual work enabled the factory to double truck day
                load capacity (an increase from 45 to 92 trucks per day) and
                save over 60.000 EUR in the first year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="achievements__discuss discuss">
      <div class="discuss__title">
        Discuss your project with the professionals
      </div>
      <blue-button
        class="discuss__button"
        @click="this.$emit('setIsModalOpened', true)"
        >Let's discuss</blue-button
      >
    </div>
    <div class="achievements__image image-achievements">
      <img src="@/assets/achievements-image.svg" alt="Achievements" />
    </div>
  </section>
</template>

<script>
import BlueButton from "../BlueButton.vue";
import AchievementsItem from "../Carousel/AchievementsItem.vue";
import CarouselAchievements from "../Carousel/CarouselAchievements.vue";
import Modal from "../Modal.vue";
export default {
  components: { BlueButton, AchievementsItem, CarouselAchievements, Modal },
};
</script>

<style lang="scss" scoped>
.achievements {
  position: relative;
}
.achievements__container {
  padding: 0px 20px 0px 252px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.achievements__column {
  max-width: 100%;
}
.achievements__body {
  display: flex;
  margin: 0px 0px 170px 0px;
  position: relative;
  z-index: 3;
}
.achievements__title {
  @include Title-Style(35px, -0.88px);
  text-align: right;
  margin: 0px 20px 100px 200px;
  max-width: 710px;
}
.achievements__button {
  display: flex;
  justify-content: center;
}
.achievements__carousel {
  max-width: 50%;
  max-height: 595px;
  overflow: hidden;
}
.achievements__info {
  margin: 0px 0px 0px 35px;
  max-width: 345px;
}
.achievements__discuss {
  flex: 1 1 100%;
}
.achievements__image {
  bottom: 290px;
  left: 0;
}
.image-achievements {
  position: absolute;
  width: 256px;
  height: 512px;
  z-index: 1;
  transform: rotate(-180deg);
  overflow: hidden;
}
.image-achievements {
  img {
    height: 100%;
  }
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info__title {
  @include Title-Style(25px, -0.63px);
  text-transform: none;
  margin: 0px 0px 10px 0px;
}
.info__text {
  @include Text-Style(17px, -0.43px);
  margin: 0px 20px 0px 0px;
}
.info__text {
  > p {
    margin: 0px 0px 10px 0px;
  }
}
.discuss {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px 230px 0px;
}
.discuss__title {
  @include Title-Style(17px, -0.43px);
  line-height: 1.24;
  text-align: center;
  max-width: 345px;
  margin: 0px 0px 45px 0px;
}

@media (max-width: 1220px) {
  .achievements__container {
    padding: 0px 0px 230px 130px;
  }
}
@media (max-width: 1024px) {
  .achievements__container {
    padding: 0px;
    display: flex;
    justify-content: center;
  }
  .image-achievements {
    width: 180px;
    height: 363px;
  }
}
@media (max-width: 768px) {
  .achievements__title {
    @include Title-Style(25px, -0.63px);
  }
  .achievements__body {
    margin: 0px 0px 255px 0px;
  }
  .discuss {
    padding: 0px 0px 100px 0px;
  }
}
@media (max-width: 730px) {
  .achievements__title {
    margin: 0px 20px 50px;
  }
  .achievements__body {
    flex-direction: column-reverse;
    align-items: center;
    margin: 0px 0px 290px 0px;
  }
  .achievements__carousel {
    max-width: 100%;
  }
  .achievements__info {
    margin: 0px 0px 0px 25px;
  }
  .achievements__image {
    bottom: 360px;
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .info__title {
    font-size: 21px;
    letter-spacing: -0.53px;
    margin: 0px 0px 24px 0px;
  }
  .info__text {
    font-size: 15px;
    letter-spacing: -0.38px;
    margin: 0px 20px 46px 0px;
  }

  .discuss {
    padding: 0px 0px 60px 0px;
  }
}
</style>