<template>
  <h2 class="section-title"><slot></slot></h2>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.section-title {
  @include Title-Style(35px, -0.88px);
}

@media (max-width: 768px) {
  .section-title {
    @include Title-Style(25px, -0.63px);
  }
}
</style>