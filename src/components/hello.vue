<template>
  <div id="app1">
    {{hello}}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        hello: "hello .vue"
      }
    }
  }
</script>

<style lang="scss" scoped>
  div {
    color: green;
    font-weight: bold;
  }
</style>