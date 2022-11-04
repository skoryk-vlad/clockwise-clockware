<template>
  <div class="left-block">
    <div class="left-block__text" @click="$emit('scrollToNext', $event)">
      <button class="left-block__button">
        <img
          src="@/assets/scroll-down-arrow.svg"
          alt="Scroll for more information"
        />
      </button>

      <div>Scroll for more information</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.left-block {
  position: fixed;
  top: 50%;
  left: -25px;
  display: flex;
  align-items: center;
  transform: rotate(-90deg);
  z-index: 6;
}
.left-block__text {
  cursor: pointer;
  opacity: 0.5;
  @include Text-Style(13px, 0.16px);
  font-weight: 300;
  text-align: center;
  color: $charcoal;
  display: flex;
}
.left-block__button {
  transform: rotate(90deg);
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  margin: 2px 30px 0px 0px;
}

@media (max-width: 1024px) {
  .left-block {
    left: -70px;
  }
}
@media (max-width: 576px) {
  .left-block {
    display: none;
  }
}
</style>