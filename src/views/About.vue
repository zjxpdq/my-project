<template>
  <div class="About">
    <!-- <iv-city :level="2" :is-text="true" v-model="city"></iv-city>
     {{city}}

     <IvBaiDuMap></IvBaiDuMap>-->
    <!--<Button @click="aa">bb</Button>-->

    <!--<ive-table :columns="columns" :data="data" ref="qq"></ive-table>-->

  </div>
</template>

<script>
  /* import Countdown from "./Countdown"
import LoginModule from "./login_module"
import IvCity from '../components/iv_city/iv_city'
import IvBaiDuMap from "../components/baidu_map/iv_baidu_map" */
  import IveTable from './../components/ive_table'
  import row from '../components/plug-in/template_ive'

  export default {
    name: 'About',
    data() {
      return {
        msg: '',
        text: '向右滑动',
        init: false,
        initial: 'login',
        city: ['广东省', '广州市', '天河区'],
        columns: [
          {
            title: 'Name',
            key: 'name'
          },
          {
            type: 'expand',
            width: 1,
            render: (h, params) => {
              return h(row, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'type',
            key: 'type'
          }
        ],
        data: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            job: 'Data engineer',
            interest: 'badminton',
            birthday: '1991-05-14',
            book: 'Steve Jobs',
            movie: 'The Prestige',
            music: 'I Cry'
          },
          {
            name: 'Jim Green',
            age: 25,
            address: 'London No. 1 Lake Park',
            job: 'Data Scientist',
            interest: 'volleyball',
            birthday: '1989-03-18',
            book: 'My Struggle',
            movie: 'Roman Holiday',
            music: 'My Heart Will Go On'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            job: 'Data Product Manager',
            interest: 'tennis',
            birthday: '1992-01-31',
            book: 'Win',
            movie: 'Jobs',
            music: 'Don’t Cry'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            job: 'Data Analyst',
            interest: 'snooker',
            birthday: '1988-7-25',
            book: 'A Dream in Red Mansions',
            movie: 'A Chinese Ghost Story',
            music: 'actor'
          }
        ]
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
        // alert('倒计时已完成')
        console.log(this.$refs.qq)
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!')
          } else {
            this.$Message.error('Fail!')

            setTimeout(() => {
              try {
                let dom = this.$refs[name].fields.filter(item => item.validateState === 'error')[0].$el // "error" 获取第一项错误项
                let winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 当前可视窗口的高度
                let domTop = dom.getBoundingClientRect().top // 第一项错误元素的位置
                let top = Math.abs(document.body.getBoundingClientRect().top - dom.getBoundingClientRect().top) - 200 // 获取错误元素距离顶部的像素值
                if (domTop < 0 || domTop > winH) {
                  window.scroll(0, top) // 定位到指定位置
                }
              } catch (e) {
                console.log(e)
              }
            }, 10) // 定时器！不然拿不到数据
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      }
    },
    components: {
      /* Countdown,
       LoginModule,
       IvCity,
       IvBaiDuMap */
      IveTable
    },
    computed: {},
    mounted() {
      // window.addEventListener('beforeunload', e => {
      //   e = e || window.event
      //   e.preventDefault()
      //   if (e) {
      //     e.returnValue = '关闭提示'
      //   }
      //   return '关闭提示'
      // })
      // window.addEventListener('unload', e => {
      //   console.log(e)
      // })
    },
    beforeDestroy() {
      // window.onbeforeunload = function (e) {
      //   e = e || window.event
      //   if (e) {
      //     e.returnValue = '关闭提示'
      //   }
      //   return '关闭提示'
      // }
    }
  }
</script>

<style scoped lang="scss">
  .About {
    /*padding: 1000px 0 0;*/
  }
</style>
