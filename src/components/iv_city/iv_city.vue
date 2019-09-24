<template>
  <Row :class="['iv_city', {is_text: isText}]" :gutter="gutterNum">
    <Col :span="span" v-if="show(0)">
      <Select
        v-model="provVal"
        :placeholder="phHandled(0)"
        :filterable="filterable"
        :size="size"
        :clearable="clearable"
        :not-found-text="FoundText[0]"
        :disabled="disabled === undefined ? false : disHandled(0)"
        @on-change="returnVal('prov', provVal)"
      >
        <Option v-for="item in provList" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <span class="iv_em" v-if="isText">省</span>
    </Col>
    <Col :span="span" v-if="show(1)">
      <Select
        v-model="cityVal"
        :placeholder="phHandled(1)"
        :filterable="filterable"
        :size="size"
        :clearable="clearable"
        :not-found-text="FoundText[1]"
        :disabled="disabled === undefined ? false : disHandled(1)"
        @on-change="returnVal('city', cityVal)"
      >
        <Option v-for="item in getCityList" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <span class="iv_em" v-if="isText">市</span>
    </Col>
    <Col :span="span" v-if="show(2)">
      <Select
        v-model="areaVal"
        :placeholder="phHandled(2)"
        :filterable="filterable"
        :size="size"
        :clearable="clearable"
        :not-found-text="FoundText[2]"
        :disabled="disabled === undefined ? false : disHandled(2)"
        @on-change="returnVal('area', areaVal)"
      >
        <Option v-for="item in getAreaList" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <span class="iv_em" v-if="isText">区</span>
    </Col>
  </Row>
</template>

<script>
  import data from 'area-data'

  const AreaData = data.pcaa
  const util = {
    levelArr: [0, 1, 2],
    oneOf: (item, arr) => {
      return arr.some(i => {
        return i === item
      })
    },
    getIndex: (list, name) => {
      for (const i in list) {
        if (list[i] === name) {
          return i
        }
      }
    },
    dataType: ['all', 'code', 'name']
  }

  export default {
    name: 'iv_city',
    data() {
      return {
        provList: AreaData[86],
        provVal: '',
        cityVal: '',
        areaVal: '',
        rowVal: '',
        defaultPlaceholder: ['请选择省', '请选择市', '请选择县区', '请选择乡镇街'],
        FoundText: ['无匹配省', '无匹配市', '无匹配县区', '无匹配乡镇街'],
        val: []
      }
    },
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      }, // 默认值实现双向数据绑定可传[''] [{}]
      gutter: {
        type: [String, Number],
        default: 10
      }, // 选择框之间的间距
      level: { // 需要的层级 0：表示只要省；1：省市；2：省市区;
        type: [String, Number],
        default: 3,
        validator: val => {
          return util.oneOf(parseInt(val), util.levelArr)
        }
      }, // 需要选择几个级别 0：省；1：市; 2: 区
      filterable: {
        type: Boolean,
        default: true
      }, // 是否可搜索 默认可以收缩
      clearable: {
        type: Boolean,
        default: true
      }, // 是否可清除 默认可清除
      size: {
        type: String,
        default: 'default'
      }, // 输入框大小 参数参照 iview
      disabled: {
        type: [Boolean, Array, Number],
        default: false
      }, // 是否禁止选择 接受布尔值 数组布尔值如 [1,2] 则是禁止市、区选择
      returnType: {
        type: String,
        default: 'text'
      }, // 返回格式 text 则是 ['广东省'] 否则就是 [{value: '广东省', code: 'xxxx'}]
      isText: {
        type: Boolean,
        default: true
      } // 是否显示省市区文字
    },
    watch: {
      value: {
        handler(to) {
          this.defaultVal(to)
        },
        deep: true
      }
    },
    created() {
      this.defaultVal(this.value)
    },
    methods: {
      show(level) {
        return level <= this.showLevel
      },
      phHandled(level) {
        if (typeof this.placeholder === 'string' && this.placeholder !== '') {
          return this.placeholder
        } else {
          if (this.placeholder && this.placeholder[level]) {
            return this.placeholder[level]
          } else {
            return this.defaultPlaceholder[level]
          }
        }
      },
      disHandled(level) {
        if (typeof this.disabled === 'number') {
          if (util.oneOf(this.disabled, util.levelArr)) {
            return level >= this.disabled
          }
        } else if (Array.isArray(this.disabled)) {
          let i = 0
          let isDis = false
          while (this.disabled[i]) {
            if (this.disabled[i] === level) {
              isDis = true
              break
            }
            i++
          }
          return isDis
        } else {
          return this.disabled
        }
      },
      returnVal(type, data, n) {
        let emit = {
          prov: [],
          city: this.val.filter((item, index) => index < 1),
          area: this.val.filter((item, index) => index < 2),
          row: ''
        }
        let obj = {
          prov: () => {
            this.cityVal = ''
            this.areaVal = ''
            this.rowVal = ''
            this.val = []
            this.val.push({
              value: this.provVal,
              code: util.getIndex(AreaData[86], this.provVal)
            })
          },
          city: () => {
            this.areaVal = ''
            this.rowVal = ''
            this.val = emit[type]
            this.val.push({
              value: this.cityVal,
              code: util.getIndex(this.getCityList, this.cityVal)
            })
          },
          area: () => {
            this.rowVal = ''
            this.val = emit[type]
            this.val.push({
              value: this.areaVal,
              code: util.getIndex(this.getAreaList, this.areaVal)
            })
          },
          row: () => {
          }
        }
        if (data) {
          obj[type]()
          let data = this.returnType === 'text' ? this.val.map(item => item.value) : this.val
          if (!n) this.$emit('input', data)
        } else {
          let data = this.returnType === 'text' ? emit[type].map(item => item.value) : emit[type]
          this.val = data
          this.$emit('input', data)
        }
      },
      defaultVal(val) {
        if (val.length > 0) {
          val.forEach((item, i) => {
            let val = typeof item === 'string' ? item : item['value']
            switch (i) {
              case 0:
                this.provVal = val
                this.returnVal('prov', val, 'not')
                break
              case 1:
                this.cityVal = val
                this.returnVal('city', val, 'not')
                break
              case 2:
                this.areaVal = val
                this.returnVal('area', val, 'not')
                break
              case 3:
                this.rowVal = val
                this.returnVal('row', val, 'not')
                break
            }
          })
        } else {
          this.provVal = ''
          this.cityVal = ''
          this.areaVal = ''
          this.rowVal = ''
        }
      }
    },
    components: {},
    computed: {
      gutterNum() {
        if (typeof this.gutter === 'number') {
          return this.gutter
        } else {
          return parseInt(this.gutter)
        }
      },
      showLevel() {
        return parseInt(this.level)
      },
      span() {
        if (util.oneOf(this.showLevel, util.levelArr)) {
          return 24 / (this.showLevel + 1)
        }
      },
      getCityList() {
        let prov = this.provVal
        return prov ? AreaData[util.getIndex(AreaData[86], prov)] : []
      },
      getAreaList() {
        let prov = this.cityVal
        return prov ? AreaData[util.getIndex(this.getCityList, prov)] : []
      }
    },
    mounted() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  .iv_city {
    &.is_text {
      .ivu-col {
        display: flex;
        align-items: center;

        .iv_em {
          padding: 10px;
        }
      }
    }
  }
</style>
