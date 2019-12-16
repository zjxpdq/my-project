<template>
  <div class="template_ive">
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">Job: </span>
        <span class="expand-value">{{ row.job }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Interest: </span>
        <span class="expand-value">{{ row.interest }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Birthday: </span>
        <span class="expand-value">{{ row.birthday }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span class="expand-key">Favorite book: </span>
        <span class="expand-value">《{{ row.book }}》</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Favorite movie: </span>
        <span class="expand-value">{{ row.movie }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Favorite music: </span>
        <span class="expand-value">{{ row.music }}</span>
      </Col>
    </Row>
  </div>
</template>

<script>

  export default {
    name: 'template_ive',
    data() {
      return {}
    },
    props: {
      row: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    created() {
    },
    methods: {},
    components: {},
    computed: {},
    mounted() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  .template_ive {
  }
</style>
