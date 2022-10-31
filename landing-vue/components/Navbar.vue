<template>
  <nav class="navbar">
    <nuxt-link to="/main" class="navbar__link">Main</nuxt-link>
    <nuxt-link to="/top" class="navbar__link">Top</nuxt-link>
    <nuxt-link to="/issues" class="navbar__link">Issues</nuxt-link>
    <nuxt-link to="/benefits" class="navbar__link">Benefits</nuxt-link>
    <nuxt-link to="/advantages" class="navbar__link">Advantages</nuxt-link>
    <nuxt-link to="/achievements" class="navbar__link">Achievements</nuxt-link>
    <nuxt-link to="/benefits-grid-1" class="navbar__link">Grid1</nuxt-link>
    <nuxt-link to="/benefits-grid-2" class="navbar__link">Grid2</nuxt-link>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
.navbar {
  overflow: auto;
  border-bottom: 1px solid #000;
  padding: 5px;
  display: flex;
  align-items: center;
}
.navbar__link {
  font-size: 20px;
  border: 1px solid #000;
  margin: 0px 5px 0px 0px;
  padding: 5px;
  transition: 0.3s ease;
}
.navbar__link:hover {
  background: gainsboro;
}
</style>