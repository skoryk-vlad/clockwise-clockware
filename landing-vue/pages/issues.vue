<template>
  <div>
    <issues-section />
    <expenses-section />
  </div>
</template>

<script>
definePageMeta({
  layout: "navigation",
});

import ExpensesSection from "~~/components/Sections/ExpensesSection.vue";
import IssuesSection from "~~/components/Sections/IssuesSection.vue";
export default {
  components: { IssuesSection, ExpensesSection },
};
</script>

<style>
</style>