<template>
  <div class="About">
    <!--    <countdown :init="init" :time="5" @on-ok="aa"></countdown>-->
    <!--    <br>-->
    <!--    <a @click="init = true">开始</a>-->
    <!--    <br>-->
    <!--    <a @click="init = false">停止</a>-->
    <!--    <br>-->
    <!--    <a @click="init = null">清除</a>-->
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
    {{initial}}

    <login-module v-model="initial"></login-module>
    <a @click="initial = 'login'">登录</a>
    <br>
    <a @click="initial = 'signIn'">注册</a>
    <br>
    <a @click="initial = 'forget'">忘记密码</a>

  </div>
</template>

<script>
  // import Countdown from "./Countdown"
  import LoginModule from "./login_module"

  export default {
    name: 'About',
    data() {
      return {
        msg: '',
        text: '向右滑动',
        init: null,
        initial: 'login'
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
      LoginModule
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
