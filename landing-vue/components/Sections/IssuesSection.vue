<template>
  <section class="issues" id="issues">
    <div class="issues__container container">
      <div class="issues__column">
        <div class="issues__body">
          <section-title class="issues__title"
            >Have you experienced any of these issues?</section-title
          >
          <div class="issues__carousel carousel">
            <div class="carousel__container">
              <carousel-issues />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CarouselIssues from "../Carousel/CarouselIssues.vue";
import SectionTitle from "./SectionTitle.vue";
export default {
  components: { SectionTitle, CarouselIssues },
};
</script>

<style lang="scss" scoped>
.issues {
  overflow: hidden;
}
.issues__container {
  padding: 0px 0px 175px;
  display: flex;
  overflow: visible;
}
.issues__title {
  margin: 0px 0px 170px;
  text-align: center;
  width: 100%;
  padding: 0 20px;
}
.carousel {
  width: 1440px;
  height: 448px;
}
.carousel__container {
  width: 430px;
  margin: 0px 0px 0px 252px;
}

@media (max-width: 1440px) {
  .issues__title {
    width: 100vw;
  }
}
@media (max-width: 1024px) {
  .issues__container {
    padding: 0px 0px 160px;
  }
  .issues__title {
    margin: 0px 0px 165px 0px;
  }
  .carousel__container {
    margin: 0px 0px 0px 150px;
  }
}
@media (max-width: 768px) {
  .issues__container {
    padding: 0px 0px 165px;
  }
  .carousel {
    width: 768px;
  }
  .carousel__container {
    width: 390px;
    margin: 0px 0px 0px 65px;
  }
}
@media (max-width: 576px) {
  .issues__title {
    margin: 0px 0px 80px 0px;
  }
  .carousel {
    overflow: visible;
  }
  .carousel__container {
    margin: 0px;
  }
}
@media (max-width: 375px) {
  .issues__title {
    text-align: right;
    margin: 0px 0px 30px 0px;
  }
  .carousel {
    width: 100vw;
  }
  .carousel__container {
    width: 100vw;
  }
}
</style>