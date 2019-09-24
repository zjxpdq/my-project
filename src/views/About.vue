<template>
  <div class="About">
    <iv-city :level="2" :is-text="true" v-model="city"></iv-city>
    {{city}}
  </div>
</template>

<script>
  // import Countdown from "./Countdown"
  // import LoginModule from "./login_module"
  import IvCity from '../components/iv_city/iv_city'

  export default {
    name: 'About',
    data() {
      return {
        msg: '',
        text: '向右滑动',
        init: false,
        initial: 'login',
        city: ['广东省', '广州市', '天河区']
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
      },
      aa() {
        alert('倒计时已完成')
      }
    },
    components: {
      // Countdown,
      // LoginModule,
      IvCity
    },
    computed: {},
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  .About {
  }
</style>
