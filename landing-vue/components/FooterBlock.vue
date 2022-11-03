<template>
  <footer class="footer" id="footer">
    <div class="footer__container container">
      <div class="footer__column">
        <div class="footer__protection">Data Protection / Imprint</div>
      </div>
      <div class="footer__column">
        <div class="footer__company-block company-block">
          <div class="company-block__logo">
            <img src="@/assets/logo.svg" alt="Clockwise Software" />
          </div>
          <div class="company-block__title">
            <div class="company-block__title-top">CLOCKWISE</div>
            <div class="company-block__title-bottom">Software</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
  
<script>
export default {};
</script>
  
<style lang="scss" scoped>
.footer {
  background-color: $black;
}
.footer__container {
  margin-top: auto;
  padding: 40px 50px;
  display: flex;
  align-items: center;
  color: $white;
}
.footer__column {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
}
.footer__protection {
  @include Text-Style(15px, 0.12px);
  font-weight: 600;
}
.footer .company-block {
  display: flex;
}
.footer .company-block__logo {
  width: 24px;
  height: 24px;
}
.footer .company-block__title {
  margin: 0px 0px 0px 14px;
}
.footer .company-block__title-top {
  font-family: $Catamaran;
  @include Text-Style(10px, 0.08px);
  font-weight: 900;
  margin: 0;
}
.footer .company-block__title-bottom {
  @include Text-Style(8px, 0.07px);
}

@media (max-width: 576px) {
  .footer__container {
    flex-direction: column;
  }
  .footer__protection {
    margin: 0px 0px 36px 0px;
  }
}
</style>