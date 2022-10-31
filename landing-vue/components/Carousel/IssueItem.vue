<template>
  <div class="issue-item">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.issue-item {
  margin: 0px 15px 0px 0px;
  box-shadow: 0 10px 30px 0 rgba(8, 61, 119, 0.25);
  background-color: $twilight-blue;
  padding: 67px 37px;
  width: 420px;
}
.issue-item__title {
  @include Text-Style(21px, -0.53px);
  font-weight: bold;
  line-height: 1.19;
  color: #fff;
  margin: 0px 0px 22px 0px;
}
.issue-item__text {
  @include Text-Style(17px, -0.43px);
  color: #fff;
}

@media (max-width: 768px) {
  .issue-item {
    margin: 0px 15px 0px 0px;
    padding: 87px 15px;
    width: 375px;
  }
  .issue-item__text {
    font-size: 15px;
    letter-spacing: -0.38px;
  }
}
@media (max-width: 576px) {
  .issue-item {
    margin: 0px;
  }
}
</style>