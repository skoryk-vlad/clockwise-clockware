<template>
  <button
    class="carousel-button"
    :class="{ 'carousel-button_disabled': isDisabled }"
    :disabled="isDisabled"
  >
    <slot></slot>
    <img
      v-if="direction === 'left'"
      src="@/assets/prev-button.svg"
      alt="Previous"
    />
    <img
      v-else-if="direction === 'right'"
      src="@/assets/next-button.svg"
      alt="Next"
    />
  </button>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: "left",
    },
    isDisabled: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  position: relative;
  z-index: 3;
  height: 70px;
  width: 70px;
}
.carousel-button img {
  width: 100%;
}
.carousel-button::before {
  content: "";
  position: absolute;
  bottom: -0.5px;
  left: 50%;
  transform: translateX(-50%);
  filter: blur(5px);
  background-color: $brownish-orange-50;
  width: 60px;
  height: 60px;
  transition: opacity 0.3s ease;
  z-index: -1;
}
.carousel-button:hover {
  opacity: 0.8;
}
.carousel-button:hover::before {
  opacity: 0.25;
}
.carousel-button_disabled {
  opacity: 0.25;
  cursor: default;
}
.carousel-button_disabled::before {
  opacity: 0;
}
.carousel-button_disabled:hover {
  opacity: 0.25;
}
</style>