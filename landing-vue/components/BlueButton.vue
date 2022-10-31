<template>
  <div class="button__wrapper">
    <button class="button" type="button">
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.button__wrapper {
  position: relative;
  z-index: 3;
  width: 345px;
  height: 77px;
}
.button__wrapper::before {
  content: "";
  position: absolute;
  bottom: 10px;
  border-radius: 72px;
  box-shadow: 0px 8px 10px $twilight-blue;
  opacity: 0.6;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  height: 20px;
  background: transparent;
  z-index: -1;
  transition: 0.3s ease;
}
.button__wrapper .button {
  position: relative;
  width: 100%;
  height: 72px;
  border-radius: 72px;
  @include Title-Style(21px, -0.53px);
  text-transform: none;
  text-align: center;
  color: $white;
  background-color: $twilight-blue;
  cursor: pointer;
  transition: 0.3s ease;
}
.button__wrapper .button:hover {
  background-color: $twilight-blue-hover;
}

@media (max-width: 576px) {
  .button__wrapper::before {
    bottom: 26px;
  }
  .button__wrapper .button {
    height: 56px;
  }
}
</style>