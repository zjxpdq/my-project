<template>
  <div class="vue_table">
    <Button @click="ee(1)">收起</Button>

    <Table :columns="columns" :data="data" ref="ee"></Table>
  </div>
</template>

<script>

  export default {
    name: 'vue_table',
    data() {
      return {}
    },
    props: {
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    created() {
    },
    methods: {
      ee(val) {
        this.$refs.ee.toggleExpand(val)
      }
    },
    components: {},
    computed: {},
    mounted() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  .vue_table {
  }
</style>
