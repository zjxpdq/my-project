<template>
  <div class="line_map"></div>
</template>

<script>
  import echarts from 'echarts'
  import {off, on} from '../../utils'

  export default {
    name: 'line_map',
    data() {
      return {
        chart: null
      }
    },
    props: {
      resData: {
        type: Object,
        default() {
          return {
            xAxis: [],
            series: []
          }
        }
      },
      colors: {
        type: Array,
        default() {
          return ['rgba(168,132,255,1)', 'rgba(255,116,112,1)', '#118CFD', 'rgba(78,203,115,1)', 'rgba(54,203,203,1)', 'rgba(251,212,55,1)', 'rgba(255,113,222,1)', 'rgba(255,158,30,1)', 'rgba(97,171,255,1)']
        }
      }
    },
    watch: {
      resData: {
        handler() {
          this.initMap() // 刷新echarts图表
        },
        deep: true
      }
    },
    created() {
    },
    methods: {
      initMap() {
        let res = this.resData
        let legend = []
        let resSeries = [{
          name: '',
          type: 'line',
          data: []
        }]
        let xAxis = []
        if (res && res.series && res.series.length > 0) {
          xAxis = res.xAxis
          resSeries = res.series.map(item => {
            legend.push(item.name)
            let obj = {
              name: '',
              type: 'line',
              data: []
            }
            return Object.assign(obj, item)
          })
        }

        this.chart.setOption({
          color: this.colors,
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            y: '2%',
            left: '2%',
            data: legend
          },
          grid: {
            top: '15%',
            left: '2%',
            right: '2%',
            bottom: '5%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: resSeries
        })
      },
      resize() {
        this.chart.resize()
      }
    },
    components: {},
    mounted() {
      this.chart = echarts.init(this.$el)

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
  .line_map {
    height: 100%;
    width: 100%;
  }
</style>

