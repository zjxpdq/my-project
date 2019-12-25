<template>
  <Form ref="Region" :model="areas" inline class="lv_region">
    <FormItem
      prop="provVal"
      :rules="{required: true, message: '省是必须的', trigger: 'change'}"
    >
      <Select
        v-model="areas.provVal"
        placeholder="请选择省"
        clearable
        :disabled="disabled"
        @on-change="delVal('prov', areas.provVal)"
      >
        <Option v-for="item of provList" :value="item" :key="item" :label="item"/>
      </Select>
    </FormItem>
    <FormItem
      prop="cityVal"
      :rules="{required: true, message: '市是必须的', trigger: 'change'}"
    >
      <Select
        v-model="areas.cityVal"
        placeholder="请选择市"
        clearable
        :disabled="disabled"
        @on-change="delVal('city', areas.cityVal)"
      >
        <Option v-for="item of cityList" :value="item" :key="item" :label="item"/>
      </Select>
    </FormItem>
    <FormItem
      prop="areaVal"
      :rules="{required: true, message: '区是必须的', trigger: 'change'}"
    >
      <Select
        v-model="areas.areaVal"
        placeholder="请选择区"
        clearable
        :disabled="disabled"
        @on-change="delVal('area', areas.areaVal)"
      >
        <Option v-for="item of areaList" :value="item" :key="item" :label="item"/>
      </Select>
    </FormItem>
  </Form>
</template>

<script>

  import Area from 'area-data'

  const AreaData = Area.pcaa

  const util = {
    getIndex: (list, name) => {
      for (const i in list) {
        if (list[i] === name) {
          return i
        }
      }
    }
  }


  export default {
    name: 'region',
    data() {
      return {
        provList: Area.pcaa['86'],
        areas: {
          provVal: '',
          provId: null,
          cityVal: '',
          cityId: null,
          areaVal: '',
          areaId: null
        }
      }
    },
    props: {
      value: {
        type: Object,
        default() {
          return {}
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value: {
        handler() {
          let val = this.value
          Object.assign(this.areas, {
            provVal: val.province,
            provId: util.getIndex(AreaData[86], val.province),
            cityVal: val.city,
            cityId: util.getIndex(this.cityList, val.city),
            areaVal: val.district,
            areaId: util.getIndex(this.areaList, val.district)
          })
          setTimeout(() => {
            this.exitVal()
          }, 500)
        },
        deep: true
      },
      areas: {
        handler() {
          this.exitVal()
        },
        deep: true
      }
    },
    created() {
    },
    methods: {
      exitVal() {
        let val = this.areas
        Object.assign(this.putValue, {
          province: val.provVal,
          provinceId: util.getIndex(AreaData[86], val.provVal),
          city: val.cityVal,
          cityId: util.getIndex(this.cityList, val.cityVal),
          district: val.areaVal,
          districtId: util.getIndex(this.areaList, val.areaVal)
        })
      },
      delVal(type, val) {
        switch (type) {
          case 'prov':
            if (!val) {
              Object.assign(this.areas, {
                cityVal: '',
                cityId: null,
                areaVal: '',
                areaId: null
              })
            } else {
              this.areas.provId = util.getIndex(AreaData[86], val)
            }
            break
          case 'city':
            if (!val) {
              Object.assign(this.areas, {
                areaVal: '',
                areaId: null
              })
            } else {
              this.areas.cityId = util.getIndex(this.cityList, val)
            }
            break
          case 'area':
            if (val) this.areas.areaId = util.getIndex(this.areaList, val)
            break
        }
      }
    },
    components: {},
    computed: {
      putValue: {
        get: function () {
          return this.value
        },
        set: function (val) {
          this.$emit('input', val)
        }
      },
      cityList() {
        let key = this.areas.provVal
        return key ? AreaData[util.getIndex(AreaData[86], key)] : []
      },
      areaList() {
        let key = this.areas.cityVal
        return key ? AreaData[util.getIndex(this.cityList, key)] : []
      }
    },
    mounted() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  .lv_region.ivu-form {
    width: 100%;
    display: flex;

    .ivu-form-item {
      flex: 1;
    }
  }
</style>
