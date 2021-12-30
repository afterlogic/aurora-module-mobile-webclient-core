<template>
<main-layout title="File info">
  <div>
    hello world
  </div>
</main-layout>
</template>

<script>
import MainLayout from "src/views/layouts/MainLayout";
export default {
  name: "FileInfo",
  mounted() {
    console.log(this.$route, 'rout')
  },
  components: {
    MainLayout
  }
}
</script>

<style scoped>

</style>
