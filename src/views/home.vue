<template>
  <section class="container-home">
    <tree-component />
  </section>
</template>

<script>
import TreeComponent from '../components/tree.vue'

export default {
  components: {
    TreeComponent
  }
}
</script>

<style lang="scss">
section.container-home { display: block; width: 100%; height: 100%; overflow: hidden; }
</style>
