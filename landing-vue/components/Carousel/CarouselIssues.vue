<template>
  <div>
    <carousel :items-to-show="1" v-model="currentSlide">
      <slide v-for="slide in slides" :key="slide">
        <issue-item v-if="slide" :slide="slide" />
      </slide>
    </carousel>

    <div>
      <div class="carousel__bottom">
        <div class="carousel__buttons buttons">
          <carousel-button
            @click="prev"
            :direction="CarouselButtonDirections.LEFT"
            :is-disabled="currentSlide === 0"
          >
          </carousel-button>
          <carousel-button
            @click="next"
            :direction="CarouselButtonDirections.RIGHT"
            :is-disabled="currentSlide === slides.length - 1"
          >
          </carousel-button>
        </div>
        <div class="carousel__slide-points slide-points">
          <button
            v-for="(slide, index) in slides"
            :key="slide"
            class="slide-points__item"
            :class="{ 'slide-points__item_active': index === currentSlide }"
            @click="setSlide(index)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";
import CarouselButton, { CarouselButtonDirections } from "./CarouselButton.vue";

import IssueItem from "./IssueItem.vue";

export default {
  name: "WrapAround",
  components: {
    Carousel,
    Slide,
    Navigation,
    IssueItem,
    Pagination,
    CarouselButton,
  },
  data() {
    return {
      currentSlide: 0,
      slides: [
        {
          title: "Overwhelming and inaccurate paperwork",
          text: "Most documents, such as orders, invoices, contracts, etc. are stored in folders on endless shelves. They are never easy to find. Moreover, due to human factor, crucial mistakes take place that cost your company much time to solve, but also drain your budget.",
        },
        {
          title: "Manual order management based on phone calls and emails",
          text: "Do your clients call you just to find out that the necessary product is currently out of stock? You waste resources by not providing them with actual information about your available inventory online",
        },
        {
          title: "Inefficient truck load",
          text: "Without dynamic truck load scheduling, your company misses up to 50% of the potential loading capability",
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
.carousel__bottom {
  display: flex;
  height: 70px;
}
.carousel__slide-points {
  margin: 0px 0px 0px 290px;
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

  &:hover {
    opacity: 0.4;
  }
  &:not(:last-child) {
    margin: 0px 16px 0px 0px;
  }
}
.slide-points__item_active {
  opacity: 1;

  &:hover {
    opacity: 1;
  }
}

.buttons {
  display: flex;
}

@media (max-width: 1024px) {
  .carousel__slide-points {
    margin: 0px 0px 0px 150px;
  }
}
@media (max-width: 768px) {
  .carousel__slide-points {
    margin: 0px 0px 0px 57px;
  }
}
@media (max-width: 568px) {
  .carousel__bottom {
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 0px 15px 0px 0px;
  }
}
@media (max-width: 375px) {
  .carousel__bottom {
    margin: 0px;
  }
}
</style>