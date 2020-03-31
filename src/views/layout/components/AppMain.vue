<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view />
      <!-- <keep-alive>
        <router-view />
      </keep-alive> -->
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {}
};
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - 100px);
  position: relative;
}
</style>
