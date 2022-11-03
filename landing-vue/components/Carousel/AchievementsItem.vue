<template>
  <div class="achievements-item">
    <div class="achievements-item__column">
      <div class="achievements-item__image">
        <img :src="slide.imageSrc" :alt="slide.imageTitle" />
      </div>
      <div class="achievements-item__image-title">
        {{ slide.imageTitle }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slide: {
      type: Object,
      default: {
        title: "Title",
        imageSrc: "imageSrc",
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.achievements-item {
  width: 915px;
  max-height: 520px;
  display: flex;
}
.achievements-item__image {
  max-height: 498px;
  margin: 0px 0px 1px 0px;
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    object-fit: contain;
  }
}
.achievements-item__image-title {
  @include Title-Style(15px, -0.38px);
  line-height: normal;
  text-align: center;
}
</style>