<template>
  <div class="Home">
    <!--<RadioGroup v-model="button" type="button">
      <Radio v-for="(item, index) of tab" :key="index" :label="item"></Radio>
    </RadioGroup>-->

    <l-2d-widget :model="button"></l-2d-widget>

    <h2>测试</h2>

  </div>
</template>

<script>
  import L2dWidget from "../components/L2D"

  export default {
    name: 'Home',
    data() {
      return {
        button: 'unitychan',
        tab: ['chitose', 'epsilon2_1', 'gf', 'haru', 'haruto', 'hibiki', 'hijiki', 'izumi', 'koharu', 'miku', 'ni-j', 'nico', 'nietzsche', 'nipsilon', 'nito', 'shizuku', 'tororo', 'tsumiki', 'unitychan', 'wanko', 'z16']
      }
    },
    created() {
    },
    methods: {},
    components: {
      L2dWidget
    },
    computed: {},
    mounted() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  .Home {
  }
</style>
