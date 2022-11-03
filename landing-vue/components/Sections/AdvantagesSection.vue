<template>
  <section class="advantages" id="advantages">
    <div class="advantages__container container">
      <div class="advantages__column">
        <div class="advantages__body body-advantages">
          <div class="body-advantages__column">
            <h2 class="body-advantages__title">OUR ADVANTAGES</h2>
            <ul class="body-advantages__list list-advantages">
              <li class="list-advantages__item">
                <div class="list-advantages__title">System Integration</div>
                <div class="list-advantages__text">
                  We help you with educating employees and integrating software
                  in your running processes
                </div>
              </li>
              <li class="list-advantages__item">
                <div class="list-advantages__title">Technical support</div>
                <div class="list-advantages__text">
                  We guarantee support and product maintenance after release and
                  keep improving the system in cooperation with your team
                </div>
              </li>
              <li class="list-advantages__item">
                <div class="list-advantages__title">Data security</div>
                <div class="list-advantages__text">
                  Your data is stored on secure servers based in Germany (or any
                  other country on your request)
                </div>
              </li>
              <li class="list-advantages__item">
                <div class="list-advantages__title">We speak your language</div>
                <div class="list-advantages__text">
                  Our managers are German- and English-speaking, so the business
                  communication is clear and easy
                </div>
              </li>
              <li class="list-advantages__item">
                <div class="list-advantages__title">
                  Representative in Germany
                </div>
                <div class="list-advantages__text">
                  Our business analyst is based in Frankfurt am Main. Discussing
                  all the business issues in person is much more efficient
                </div>
              </li>
              <li class="list-advantages__item">
                <div class="list-advantages__title">
                  5 years experience in logistics
                </div>
                <div class="list-advantages__text">
                  We've successfully implemented custom logistics/
                  transportation/stock and order management systems
                </div>
              </li>
            </ul>
          </div>
          <div class="body-advantages__column">
            <div class="body-advantages__reviews reviews-advantages">
              <div class="reviews-advantages__review review">
                <div class="review__text">
                  Flawless communication with the Clockwise Software team
                  resulted in a fleet management system that exactly met the
                  needs of the municipal waste transportation company. The
                  software runs on Android smartphones, so there was no need for
                  expensive equipment, and the learning curve was low. We've
                  implemented multi-tenancy to use this software in other
                  projects connected with logistics.
                </div>
                <div class="review__reviewer reviewer">
                  <div class="reviewer__title">
                    <span class="reviewer__title_bold">Dan Weber</span>
                    CEO/CTO at Marketsoup
                  </div>
                  <div class="reviewer__image">
                    <img src="@/assets/reviewer-2.png" alt="Dan Weber" />
                  </div>
                </div>
              </div>
              <div class="reviews-advantages__review review">
                <div class="review__text">
                  With the automatic load scheduling and proper route planning,
                  we are finally able to use 100% of our truck load capacity.
                  Also, order management and delivery have become much more
                  efficient due to custom modules. In the first year, we have
                  covered our investment in custom ERP system development
                </div>
                <div class="review__reviewer reviewer">
                  <div class="reviewer__title">
                    <span class="reviewer__title_bold">Vadim Chabanenko</span>
                    Director at UDK Gazbeton
                  </div>
                  <div class="reviewer__image">
                    <img src="@/assets/reviewer-1.png" alt="Vadim Chabanenko" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BlueButton from "../BlueButton.vue";
import LeftBlock from "../LeftBlock.vue";
export default {
  components: { BlueButton, LeftBlock },
};
</script>

<style lang="scss" scoped>
.advantages__container {
  padding: 0px 0px 247px 276px;
  display: flex;
}
.body-advantages {
  display: flex;
}
.body-advantages__column {
  width: 46.46%;

  &:nth-child(2) {
    width: 53.28%;
  }
}
.body-advantages__title {
  @include Title-Style(44px, -0.88px);
  margin: 0px 0px 52px 0px;
}
.body-advantages__reviews {
  padding: 96px 178px 40px 40px;
}
.list-advantages {
  max-width: 420px;
}
.list-advantages__item {
  position: relative;
  margin: 0px 0px 26px 0px;
  padding: 0px 0px 0px 75px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: $watermelon;
  }
}
.list-advantages__title {
  @include Title-Style(21px, -0.53px);
  text-transform: none;
  height: 34px;
  display: flex;
  align-items: center;
}
.list-advantages__text {
  opacity: 0.75;
  @include Text-Style(15px, -0.38px);
}
.reviews-advantages {
  object-fit: contain;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(140deg, #fff, $white);
  height: 100%;
}
.reviews-advantages__review {
  &:not(:last-child) {
    padding: 0px 0px 70px;
  }
}
.review__text {
  @include Text-Style(17px, -0.43px);
  font-weight: 600;
  margin: 0px 0px 15px 0px;
}
.reviewer {
  display: flex;
  justify-content: flex-end;
}
.reviewer__title {
  text-align: end;
}
.reviewer__title_bold {
  font-size: 17px;
  font-weight: bold;
  display: block;
}

.reviewer__image {
  width: 44px;
  height: 44px;
  margin: 0px 0px 0px 15px;
  filter: grayscale(100%);

  img {
    width: 100%;
  }
}
@media (max-width: 1220px) {
  .advantages__container {
    padding: 0px 0px 247px 154px;
  }
}
@media (max-width: 1024px) {
  .advantages__container {
    padding: 0px 67px 160px 67px;
  }
  .body-advantages {
    flex-direction: column;
  }
  .body-advantages__column {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;

    &:nth-child(2) {
      width: 100%;
    }
  }
  .body-advantages__reviews {
    padding: 90px 100px;
  }
  .body-advantages__list {
    margin: 0px 0px 95px 0px;
  }
}
@media (max-width: 768px) {
  .advantages__container {
    padding: 0px 67px 95px 67px;
  }
  .body-advantages__title {
    font-size: 25px;
    margin: 0px 0px 50px 0px;
  }
}
@media (max-width: 576px) {
  .advantages__container {
    padding: 0px 25px 95px;
  }
  .body-advantages__reviews {
    padding: 25px;
  }
  .review__text {
    font-size: 15px;
    letter-spacing: -0.38px;
  }
  .reviews-advantages__review {
    &:not(:last-child) {
      padding: 0px 0px 50px;
    }
  }
}
</style>