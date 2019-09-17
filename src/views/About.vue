<template>
  <div class="About">
<!--    <slide-verify-->
<!--      :l="42"-->
<!--      :r="10"-->
<!--      :w="310"-->
<!--      :h="155"-->
<!--      @success="onSuccess"-->
<!--      @fail="onFail"-->
<!--      @refresh="onRefresh"-->
<!--      :slider-text="text"-->
<!--    ></slide-verify>-->
<!--    <div>{{msg}}</div>-->
  </div>
</template>

<script>

  export default {
    name: 'About',
    data() {
      return {
        msg: '',
        text: '向右滑动'
      }
    },
    created() {
    },
    methods: {
      onSuccess() {
        this.msg = 'login success'
      },
      onFail() {
        this.msg = ''
      },
      onRefresh() {
        this.msg = ''
      }
    },
    components: {},
    computed: {},
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  .About {
  }
</style>
