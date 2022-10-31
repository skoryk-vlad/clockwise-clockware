<template>
  <div class="expenses">
    <div class="expenses__container container">
      <div class="expenses__body">
        <div class="expenses__column">
          <div class="expenses__text">
            Expenses reduction after implementing logistics management software!
          </div>
        </div>
        <div class="expenses__column">
          <div class="expenses__percent">49,2%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.expenses__container {
  padding: 0px 0px 271px;
}
.expenses__body {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 690px;
  margin: 0 auto;
  padding: 10px;
}
.expenses__column {
  flex: 1 1 50%;
}
.expenses__text {
  opacity: 0.75;
  @include Text-Style(25px, -0.63px);
  line-height: 1.2;
  color: $charcoal;
}
.expenses__percent {
  @include Title-Style(90px, 1);
}

@media (max-width: 1024px) {
  .expenses__container {
    padding: 0px 0px 200px;
  }
}
@media (max-width: 768px) {
  .expenses__container {
    padding: 0px 0px 165px;
  }
  .expenses__body {
    max-width: 518px;
  }
  .expenses__text {
    font-size: 18.8px;
    letter-spacing: -0.47px;
  }
  .expenses__percent {
    font-size: 75px;
  }
}
@media (max-width: 450px) {
  .expenses__body {
    flex-direction: column;
    padding: 0px 58px;
    text-align: left;
  }
  .expenses__text {
    margin: 0px 0px 30px 0px;
  }
}
</style>