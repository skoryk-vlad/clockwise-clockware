<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
#app {
  width: 100%;
  min-height: 100%;
  font-family: $OpenSans;
  color: $black;
}
.wrapper {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(166deg, #fff, #f8f8f8);
}
.container {
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
}
.carousel__track {
  display: flex;
  position: relative;
}
.carousel__sr-only {
  display: none;
}
.carousel__slide {
  scroll-snap-stop: auto;
  flex-shrink: 0;
  margin: 0;
  position: relative;
  display: flex;
}
</style>