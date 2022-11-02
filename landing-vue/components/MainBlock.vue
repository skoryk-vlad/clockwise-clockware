<template>
  <main id="main">
    <top-section @set-is-modal-opened="this.$emit('setIsModalOpened', $event)" />
    <issues-section />
    <expenses-section />
    <benefits-section @set-is-modal-opened="this.$emit('setIsModalOpened', $event)" />
    <advantages-section />
    <achievements-section @set-is-modal-opened="this.$emit('setIsModalOpened', $event)" />
  </main>
</template>

<script>
import LeftBlock from './LeftBlock.vue';
import AchievementsSection from './Sections/AchievementsSection.vue';
import AdvantagesSection from './Sections/AdvantagesSection.vue';
import BenefitsSection from "./Sections/BenefitsSection.vue";
import ExpensesSection from './Sections/ExpensesSection.vue';
import IssuesSection from "./Sections/IssuesSection.vue";
import TopSection from "./Sections/TopSection.vue";
export default {
  components: { TopSection, IssuesSection, BenefitsSection, AdvantagesSection, AchievementsSection, ExpensesSection, LeftBlock },
};
</script>

<style>
</style>