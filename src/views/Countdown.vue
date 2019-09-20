<template>
  <span class="Countdown">
    {{initTime ? `${timeText < 10 ? '0' + timeText : timeText} ${text}` : initText}}
  </span>
</template>

<script>

  export default {
    name: 'Countdown',
    data() {
      return {
        initTime: null,
        timeText: 0
      }
    },
    props: {
      text: {
        type: [String],
        default: '秒后重试'
      }, // 提示文件
      time: {
        type: [Number, String],
        default: 60
      },
      initText: {
        type: String,
        default: '获取验证码'
      },
      init: {
        type: [Boolean],
        default: null
      }
    },
    watch: {
      time(to) {
        this.timeText = !isNaN(parseInt(to)) ? parseInt(to) : 60
      },
      init(to) {
        if (to) {
          this.timeText = !isNaN(parseInt(this.time)) ? parseInt(this.time) : 60
          this.getTime()
        } else {
          this.clearTime()
        }
      }
    },
    created() {
      this.timeText = !isNaN(parseInt(this.time)) ? parseInt(this.time) : 60
    },
    methods: {
      getTime() {
        this.clearTime()
        this.initTime = setInterval(() => {
          this.timeText -= 1
          if (this.timeText === 0) {
            this.clearTime()
            this.$emit('on-ok')
          }
        }, 1000)
      },
      clearTime() {
        clearInterval(this.initTime)
        this.initTime = null
      }
    },
    components: {},
    computed: {},
    beforeDestroy() {
      this.clearTime()
    }
  }
</script>

<style scoped lang="scss">
  .Countdown {
  }
</style>
