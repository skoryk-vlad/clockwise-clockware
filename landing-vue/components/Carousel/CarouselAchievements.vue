<template>
  <div>
    <div>
      <div class="carousel__top">
        <div class="carousel__buttons buttons">
          <carousel-button
            @click="prev"
            :direction="CarouselButtonDirections.LEFT"
            :is-disabled="currentSlide === 0"
          >
          </carousel-button>
          <div class="carousel__slide-points slide-points">
            <button
              v-for="(slide, index) in slides"
              :key="slide"
              class="slide-points__item"
              :class="{ 'slide-points__item_active': index === currentSlide }"
              @click="setSlide(index)"
            ></button>
          </div>
          <carousel-button
            @click="next"
            :direction="CarouselButtonDirections.RIGHT"
            :is-disabled="currentSlide === slides.length - 1"
          >
          </carousel-button>
        </div>
      </div>
    </div>

    <carousel :items-to-show="1" v-model="currentSlide">
      <slide v-for="slide in slides" :key="slide">
        <achievements-item v-if="slide" :slide="slide" />
      </slide>
    </carousel>
  </div>
</template>
  
<script>
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";
import AchievementsItem from "./AchievementsItem.vue";

import CarouselButton, { CarouselButtonDirections } from "./CarouselButton.vue";
import IssueItem from "./IssueItem.vue";

export default {
  components: {
    Carousel,
    Slide,
    Navigation,
    IssueItem,
    Pagination,
    CarouselButton,
    AchievementsItem,
  },
  data() {
    return {
      currentSlide: 0,
      slides: [
        {
          imageSrc: "./images/achievements-carousel-1.png",
          imageTitle: "Double truck day load capacity increase",
        },
        {
          imageSrc: "./images/achievements-carousel-2.png",
          imageTitle: "Double truck day load capacity increase",
        },
        {
          imageSrc: "./images/achievements-carousel-3.png",
          imageTitle: "Double truck day load capacity increase",
        },
      ],
      CarouselButtonDirections,
    };
  },
  methods: {
    next() {
      this.currentSlide += 1;
    },
    prev() {
      this.currentSlide -= 1;
    },
    setSlide(index) {
      this.currentSlide = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel__top {
  display: flex;
  height: 70px;
  margin: 0px 0px 5px 190px;
}
.carousel__slide-points {
  margin: 0px 60px;
}
.slide-points {
  display: flex;
  align-items: center;
}
.slide-points__item {
  background: $charcoal;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  opacity: 0.25;
  transition: 0.3s ease;

  &:not(:last-child) {
    margin: 0px 16px 0px 0px;
  }
  &:hover {
    background: #000000;
  }
}
.slide-points__item_active {
  opacity: 1;
}

.buttons {
  display: flex;
}

@media (max-width: 1330px) {
  .carousel__top {
    display: flex;
    justify-content: center;
    height: 70px;
    margin: 0px 0px 5px;
  }
}
</style>