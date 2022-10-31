<template>
  <div class="achievements-item">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
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
}
.achievements-item__image img {
  width: 100%;
  object-fit: contain;
}
.achievements-item__image-title {
  @include Title-Style(15px, -0.38px);
  line-height: normal;
  text-align: center;
}
</style>