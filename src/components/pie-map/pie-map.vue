<template>
  <div class="pie_map"></div>
</template>

<script>
  import echarts from 'echarts'
  import {forEachs, formatFloat, off, on, typeOf} from '../../utils'

  export default {
    name: 'pie_map',
    data() {
      return {
        chart: null
      }
    },
    props: {
      resData: {
        type: [Object, Array],
        default() {
          return {}
        }
      },
      colors: {
        type: Array,
        default() {
          return ['rgba(168,132,255,1)', 'rgba(255,116,112,1)', '#118CFD', 'rgba(78,203,115,1)', 'rgba(54,203,203,1)', 'rgba(251,212,55,1)', 'rgba(255,113,222,1)', 'rgba(255,158,30,1)', 'rgba(97,171,255,1)']
        }
      },
      title: String,
      legend: {
        type: Object,
        default() {
          return {
            itemGap: 50, // 图例的间距
            height: '70%' // 图列的高度
          }
        }
      }
    },
    watch: {
      resData: {
        handler() {
          this.initMap()
        },
        deep: true
      }
    },
    created() {
    },
    methods: {
      initMap() {
        this.chart = echarts.init(this.$el)
        let richStyle = {}
        let formatter = {}
        let textWidth = 0
        let vLen = 0
        let le = this.legend

        if (this.resData && typeOf(this.resData) === 'array') {
          forEachs(this.resData, (item, index) => {
            formatter[item.name] = {value: item.value, index}
            richStyle['style' + index] = {}
            richStyle['style' + index]['align'] = 'right'
            let w = item.name
            let v = item.value
            w = w.toString().length
            v = v.toString().length
            if (w > textWidth) textWidth = w
            if (v > vLen) vLen = v
          })

          let addWidth = textWidth < 5 || vLen < 5 ? 30 : 10

          textWidth = formatFloat(textWidth * 12 + vLen * 10) + addWidth
        }

        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: this.colors,
          grid: {
            containLabel: true
          },
          legend: {
            orient: 'vertical',
            icon: 'circle',
            itemGap: le.itemGap || 50,
            height: le.height || '70%',
            y: 'center',
            left: '46%',
            textStyle: {
              fontSize: 12,
              width: textWidth,
              rich: richStyle // 设置样式对象
            },
            formatter: function (name) {
              return `${name}{style${formatter[name]['index']}|${formatter[name]['value']} }`
            }
          },
          series: [
            {
              name: this.title || '',
              type: 'pie',
              radius: '55%',
              center: ['22%', '50%'],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: this.resData
            }
          ]
        })
      },
      resize() {
        this.chart.resize()
      }
    },
    components: {},
    mounted() {
      this.initMap()

      this.$nextTick(() => {
        on(window, 'resize', this.resize) // 注册 echarts 自适应事件
      })
    },
    computed: {},
    beforeDestroy() {
      off(window, 'resize', this.resize) // 销毁 echarts 自适应事件
    }
  }
</script>

<style scoped lang="scss">
  .pie_map {
    width: 100%;
    height: 100%;
  }
</style>
