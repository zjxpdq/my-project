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
            <Input
              :type="lookPassword ? 'text' : 'password'"
              size="large"
              v-model="formInline.password"
              placeholder="请输入密码"
            >
              <span slot="suffix" style="border-left: 1px solid #dcdee2;padding-left: 5px;">
                <Icon @click="lookPassword = !lookPassword" :type="lookPassword ? 'ios-eye-outline' : 'ios-eye-off'"/>
              </span>
            </Input>
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
            <slider :disabled="!reg.test(formInline.mobile)" v-model="formInline.sliderStatus"></slider>
          </FormItem>
          <FormItem
            prop="mobileCode"
            :class="['show_item', {'pitchOn': !formInline.sliderStatus}]"
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
      <div class="title">
        <h2>账号注册</h2>
      </div>
      <Form ref="signIn" :model="formInline">
        <FormItem
          prop="username"
          :rules="[{required: true, message: '公司名称不能为空', trigger: 'blur'}, {min: 6, message: '公司名称不能小于6为字符'}]"
        >
          <Input type="text" size="large" v-model="formInline.username" placeholder="请输入公司名称（营业执照上的全称）"/>
        </FormItem>
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
          <slider :disabled="!reg.test(formInline.mobile)" v-model="formInline.sliderStatus"></slider>
        </FormItem>
        <FormItem
          prop="mobileCode"
          :class="['show_item', {'pitchOn': !formInline.sliderStatus}]"
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
        <FormItem
          prop="password"
          :class="['show_item', {'pitchOn': !formInline.sliderStatus}]"
          :rules="{validator: password, trigger: 'blur'}"
        >
          <Input
            :type="lookPassword ? 'text' : 'password'"
            size="large"
            v-model="formInline.password"
            placeholder="8-20位密码，字母/数字/符号至少两种"
          >
              <span slot="suffix" style="border-left: 1px solid #dcdee2;padding-left: 5px;">
                <Icon @click="lookPassword = !lookPassword" :type="lookPassword ? 'ios-eye-outline' : 'ios-eye-off'"/>
              </span>
          </Input>
        </FormItem>
        <FormItem>
          <div>
            <Checkbox v-model="formInline.keepLogin" :true-value="1" :false-value="0">已阅读并同意</Checkbox>
            <a style="color: #118CFD;">《注册协议》</a>
          </div>
        </FormItem>
        <FormItem>
          <Button
            style="width: 100%;"
            type="primary"
            :disabled="formInline.keepLogin !== 1"
            @click="handleSubmit('signIn')"
          >
            入驻咨询
          </Button>
        </FormItem>
      </Form>
    </div>
    <div class="zj_forget" :class="['zj_transition', {pitchOn: value === 'forget'}]">
      <div class="title">
        <h2>忘记密码</h2>
      </div>
      <Form ref="forget" :model="formInline" :class="['zj_transition', {pitchOn: type === '3'}]">
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
          <slider :disabled="!reg.test(formInline.mobile)" v-model="formInline.sliderStatus"></slider>
        </FormItem>
        <FormItem
          prop="mobileCode"
          :class="['show_item', {'pitchOn': !formInline.sliderStatus}]"
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
        <FormItem
          prop="password"
          :class="['show_item', {'pitchOn': !formInline.sliderStatus}]"
          :rules="{validator: password, trigger: 'blur'}"
        >
          <Input
            :type="lookPassword ? 'text' : 'password'"
            size="large"
            v-model="formInline.password"
            placeholder="8-20位密码，字母/数字/符号至少两种"
          >
              <span slot="suffix" style="border-left: 1px solid #dcdee2;padding-left: 5px;">
                <Icon @click="lookPassword = !lookPassword" :type="lookPassword ? 'ios-eye-outline' : 'ios-eye-off'"/>
              </span>
          </Input>
        </FormItem>
        <FormItem>
          <Button
            style="width: 100%;"
            type="primary"
            @click="type = '4'"
          >
            <!--            handleSubmit('forget')-->
            下一步
          </Button>
        </FormItem>
      </Form>
      <Form ref="forgetOk" :model="formInline" :class="['zj_transition', {pitchOn: type === '4'}]">
        <FormItem
          prop="password"
          :rules="{validator: password, trigger: 'blur'}"
        >
          <Input
            :type="lookPassword ? 'text' : 'password'"
            size="large"
            v-model="formInline.password"
            placeholder="8-20位密码，字母/数字/符号至少两种"
          >
              <span slot="suffix" style="border-left: 1px solid #dcdee2;padding-left: 5px;">
                <Icon @click="lookPassword = !lookPassword" :type="lookPassword ? 'ios-eye-outline' : 'ios-eye-off'"/>
              </span>
          </Input>
        </FormItem>
        <FormItem>
          <Button
            style="width: 100%;"
            type="primary"
            @click="handleSubmit('forgetOk')"
          >
            确认修改
          </Button>
        </FormItem>
      </Form>
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
  const password = (rule, value, callback) => {
    const regs = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,20}$/
    if (!value) {
      callback(new Error('密码不能为空'))
    } else if (value.length < 8) {
      callback(new Error('密码不能小于8位字符'))
    } else if (value.length > 20) {
      callback(new Error('密码不能大于20位字符'))
    } else if (!regs.test(value)) {
      callback(new Error('字母/数字/符号至少两种'))
    } else {
      callback()
    }
  }

  import slider from "../slider/slider"

  export default {
    name: 'login',
    data() {
      return {
        reg, // 正则匹配手机号码
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
          areaCode: '+86', // 区号
          sliderStatus: true
        },
        lookPassword: false,
        type: '0', // 0: 账号登入；1：验证码登入; 2：账号注册
        codeTime: 60, // 验证码倒计时
        codeTimer: null, // 验证码计时器
        verificationCode: ''
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
            this.type = '2'
            break
          case 'forget':
            this.type = '3'
            break
        }
      },
      type(to) {
        this.lookPassword = false
        this.clearTime()
        switch (to) {
          case '0':
            this.formInline.keepLogin = 0
            this.formInline.username = ''
            this.formInline.password = ''
            this.formInline.mobileCode = ''
            this.formInline.mobile = ''
            break
          case '1':
            break
          case '2':
            this.formInline.keepLogin = 0
            this.formInline.username = ''
            this.formInline.password = ''
            this.formInline.mobileCode = ''
            this.formInline.mobile = ''
            break
          case '3':
            this.formInline.mobileCode = ''
            this.formInline.mobile = ''
            break
        }
      }
    },
    created() {
    },
    methods: {
      mobile, // 验证手机号码
      password, // 匹配密码
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
      switch (this.value) {
        case 'login':
          this.type = '0'
          break
        case 'signIn':
          this.type = '2'
          break
        case 'forget':
          this.type = '3'
          break
      }
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

    .ivu-form .ivu-form-item {
      &.show_item {
        transition: all .3s;
        overflow: hidden;
        height: 0;
        margin-bottom: 0;

        &.pitchOn {
          height: auto;
          overflow: visible;
          margin-bottom: 20px;
        }
      }

      .ivu-form-item-content {
        // 自动登录
        .zj_automatic {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
</style>

<style lang="scss">
  .zj_login_module {
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

    .ivu-btn.ivu-btn-primary[disabled] {
      background: #ABD7FF;
      border-color: #ABD7FF;
      color: #FFF;
    }
  }
</style>
