<template>
  <div class="zj_login_module">
    <div class="zj_login" :class="['zj_transition', {pitchOn: value === 'login'}]">
      <div class="title login_title">
        <h2 :class="[{['pitchOn']: type === '0'}]" @click="type = '0'">账号登录</h2>
        <span></span>
        <h2 :class="[{['pitchOn']: type === '1'}]" @click="type = '1'">验证码登录</h2>
      </div>
      <div :class="['zj_transition', {pitchOn: type === '0'}]">
        <Form ref="login" :model="formInline">
          <FormItem
            prop="username"
            :rules="{required: true, message: '公司名称不能为空', trigger: 'blur'}"
          >
            <Input type="text" size="large" v-model="formInline.username" placeholder="请输入公司名称（营业执照上的全称）"/>
          </FormItem>
          <FormItem
            prop="password"
            :rules="{required: true, message: '密码不能为空', trigger: 'blur'}"
          >
            <Input type="text" size="large" v-model="formInline.password" placeholder="请输入密码"/>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" type="primary" @click="handleSubmit('login')">登录</Button>
          </FormItem>
          <FormItem>
            <div class="zj_automatic">
              <Checkbox v-model="formInline.keepLogin" :true-value="1" :false-value="0">下次自动登录</Checkbox>
              <span class="zj_click" @click="newValue = 'forget'">忘记密码</span>
            </div>
          </FormItem>
        </Form>
      </div>
      <div :class="['zj_transition', {pitchOn: type === '1'}]">
        <Form ref="loginCode" :model="formInline">
          <FormItem
            prop="mobile"
            :rules="{ validator: mobile, trigger: 'blur' }"
          >
            <Input type="text" size="large" v-model="formInline.mobile" placeholder="请输入手机号码">
              <Select v-model="formInline.areaCode" slot="prepend" style="width: 80px">
                <Option
                  v-for="item of areaCode"
                  :key="item.value"
                  :value="item.value"
                  :label="item.value"
                  style="width: 200px; display:flex; justify-content: space-between;"
                >
                  <span>{{item.label}}</span>
                  <span>{{item.value}}</span>
                </Option>
              </Select>
            </Input>
          </FormItem>
          <FormItem>
            {{ss}}
            <slider :disabled="false" v-model="ss"></slider>
          </FormItem>
          <FormItem
            prop="mobileCode"
            :rules="{required: true, message: '验证码不能为空', trigger: 'blur'}"
          >
            <Input
              type="text"
              size="large"
              v-model="formInline.mobileCode"
              placeholder="验证码"
              :class="['zj_get_code', {['zj_not_click']: codeTimer}]"
            >
              <Button slot="append" @click="timer" :disabled="codeTimer !== null">
                {{codeTimer ? `已发送${codeTime}s` : '发送验证码'}}
              </Button>
            </Input>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" type="primary" @click="handleSubmit('loginCode')">登录</Button>
          </FormItem>
          <FormItem>
            <div class="zj_automatic">
              <Checkbox v-model="formInline.keepLogin" :true-value="1" :false-value="0">下次自动登录</Checkbox>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="zj_sign-in" :class="['zj_transition', {pitchOn: value === 'signIn'}]">

    </div>
    <div class="zj_forget" :class="['zj_transition', {pitchOn: value === 'forget'}]">

    </div>
  </div>
</template>

<script>
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
  const mobile = (rule, value, callback) => {
    if (!value) {
      callback(new Error('手机号码不能为空'))
    } else if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号码'))
    } else {
      callback()
    }
  }

  import slider from "./slider"

  export default {
    name: 'login',
    data() {
      return {
        areaCode: [
          {
            value: '+86',
            label: '中国'
          },
          {
            value: '+852',
            label: '中国香港'
          },
          {
            value: '+853',
            label: '中国澳门'
          },
          {
            value: '+886',
            label: '中国台湾'
          }
        ], // 地区区号
        formInline: {
          keepLogin: 0, // (integer, optional): 保存登录状态 0不保存 1保存 ,
          password: '', // (string): 密码 ,
          username: '', // (string): 用户昵称
          mobile: '', //  (string): 手机号码 ,
          mobileCode: '', // (string): 验证码
          areaCode: '+86' // 区号
        },
        type: '1', // 0: 账号登入；1：验证码登入
        codeTime: 60, // 验证码倒计时
        codeTimer: null, // 验证码计时器
        verificationCode: '',
        ss: true
      }
    },
    props: {
      value: {
        type: String,
        default: 'login'
      }
    },
    watch: {
      value(to) {
        switch (to) {
          case 'login':
            this.type = '0'
            break
          case 'signIn':
            this.type = '3'
            break
          case 'forget':
            this.type = '4'
            break
        }
      }
    },
    created() {
    },
    methods: {
      mobile, // 验证手机号码
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!')
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      timer() {
        this.clearTime()
        this.codeTime = 60
        this.codeTimer = setInterval(() => {
          this.codeTime -= 1
          if (this.codeTime === 0) {
            this.clearTime()
          }
        }, 1000)
      }, // 获取验证码计时器
      clearTime() {
        clearInterval(this.codeTimer)
        this.codeTimer = null
      } // 清除定时器
    },
    components: {
      slider
    },
    computed: {
      newValue: {
        get: function () {
          return this.initial
        },
        set: function (val) {
          this.$emit('input', val)
        }
      }
    },
    mounted() {
    },
    beforeDestroy() {
      this.clearTime()
    }
  }
</script>

<style scoped lang="scss">
  .zj_login_module {
    max-width: 416px;
    padding: 20px;

    .title {
      margin-bottom: 20px;

      h2 {
        font-size: 24px;
        color: #333;
      }

      &.login_title {
        display: flex;
        align-items: center;

        h2 {
          color: #999;
          transition: color .3s;
          cursor: pointer;

          &.pitchOn {
            color: #333;
          }
        }

        span {
          display: inline-block;
          width: 1px;
          height: 24px;
          background: rgba(232, 232, 232, 1);
          margin: 0 20px;
        }
      }
    }

    .zj_click {
      cursor: pointer;
    }

    // 动画
    .zj_transition {
      opacity: 0;
      height: 0;
      overflow: hidden;
      transition: all .6s;

      &.pitchOn {
        height: auto;
        opacity: 1;
      }
    }

    .ivu-form .ivu-form-item .ivu-form-item-content {
      // 自动登录
      .zj_automatic {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      // 获取验证码
      .zj_get_code {
        .ivu-input-group-append {

        }
      }

      .ivu-input-wrapper {

      }
    }
  }
</style>

<style lang="scss">
  // 获取验证码
  .zj_get_code {
    .ivu-input-group-append {
      color: #fff;
      background: rgb(47, 141, 240);
      border-color: transparent;

      .ivu-btn:hover {
        background: transparent;
        border-color: transparent;
        color: #fff;
      }
    }

    &.zj_not_click .ivu-input-group-append {
      background: rgba(171, 215, 255, 1);
    }
  }
</style>
