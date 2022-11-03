<template>
  <div>
    <benefits-section />
  </div>
</template>

<script>
definePageMeta({
  layout: "navigation",
});

import BenefitsSection from '~~/components/Sections/BenefitsSection.vue';
export default {
  components: { BenefitsSection },
};
</script>

<style>
</style>