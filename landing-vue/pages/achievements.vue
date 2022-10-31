<template>
  <div>
    <achievements-section />
  </div>
</template>

<script>
definePageMeta({
  layout: "navigation",
});

import AchievementsSection from '~~/components/Sections/AchievementsSection.vue';
export default {
  components: { AchievementsSection },
};
</script>

<style>
</style>