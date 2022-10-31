<template>
  <div>
    <advantages-section />
  </div>
</template>

<script>
definePageMeta({
  layout: "navigation",
});

import AdvantagesSection from '~~/components/Sections/AdvantagesSection.vue';
export default {
  components: { AdvantagesSection },
};
</script>

<style>
</style>