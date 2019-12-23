<template>
  <div class="Home">
    <!--<RadioGroup v-model="button" type="button">
      <Radio v-for="(item, index) of tab" :key="index" :label="item"></Radio>
    </RadioGroup>-->

    <l-2d-widget :model="button" v-if="false"></l-2d-widget>

    <h2>测试</h2>

    <Row :gutter="18">
      <Col :span="6">
        <Select v-model="dq.sheng" style="width:200px">
          <Option value="广东省">广东省</Option>
        </Select>
      </Col>
      <Col :span="6">
        <Select v-model="dq.shi" style="width:200px">
          <Option value="广州市">广州市</Option>
          <Option value="深圳市">深圳市</Option>
        </Select>
      </Col>
      <Col :span="6">
        <Select v-model="dq.qu" style="width:200px">
          <Option value="天河区">天河区</Option>
          <Option value="番禺区">番禺区</Option>
          <Option value="宝安区">宝安区</Option>
          <Option value="福田区">福田区</Option>
        </Select>
      </Col>
    </Row>

    <Button @click="getCity">修改地点</Button>

    <div class="qq_map">
      <!--
        :province="dq.sheng"
        :city="dq.shi"
        :area="dq.qu"
      -->

      <qq-map
        ref="qqMap"
        keyword="UVCBZ-TR7WU-3PQVU-4E5JA-EMVPH-TLFVC"
        is-region="1"
        v-model="dq"
        :back-key="{
          province: 'sheng', // 需要返回省的 key 双向数据绑定的值的 key
          city: 'shi', // 需要返回市的 key 双向数据绑定的值的 key
          district: 'qu', // 需要返回区的 key 双向数据绑定的值的 key
          location: true, // 需要返回经纬度的 key 双向数据绑定的值的 key
        }"
      />
    </div>


    {{dq}}

    <div class="map_box">
      <pie-map
        :res-data="pieMap"
      />
    </div>

    <Button @click="() => {data = btn ? lineMap : {}; btn = !btn}">点击</Button>

    <div class="line_box">
      <line-map :res-data="lineMap" :key="new Date().getTime()"></line-map>
    </div>

  </div>
</template>

<script>
  import L2dWidget from "../components/L2D"
  import PieMap from '../components/pie-map'
  import LineMap from '../components/line-map'
  import QqMap from './../components/qq_map'

  export default {
    name: 'Home',
    data() {
      return {
        button: 'unitychan',
        tab: ['chitose', 'epsilon2_1', 'gf', 'haru', 'haruto', 'hibiki', 'hijiki', 'izumi', 'koharu', 'miku', 'ni-j', 'nico', 'nietzsche', 'nipsilon', 'nito', 'shizuku', 'tororo', 'tsumiki', 'unitychan', 'wanko', 'z16'],
        pieMap: [
          {
            value: 1,
            name: '注册量0'
          },
          {
            value: 2,
            name: '注册量1'
          },
          {
            value: 3,
            name: '注册量2'
          },
          {
            value: 4,
            name: '册量22'
          },
          {
            value: 5,
            name: '注册量3'
          }
        ],
        btn: true,
        data: null,
        lineMap: {
          xAxis: [1, 2, 1, 2, 11, 111], // 底部栏的显示数据
          series: [
            {
              name: '底部栏的数据', // 名称
              data: [1, 2, 5, 2, 11, 111] // 线条数据
            },
            {
              name: '底部栏的数据1', // 名称
              data: [8, 2, 9, 2, 11, 111] // 线条数据
            }
          ] // 需要渲染的线条1个对象一条线条
        },
        dq: {
          sheng: '',
          shi: '',
          qu: '',
          location: ''
        },
        queryList: ''
      }
    },
    created() {
    },
    methods: {
      getCity() {
        this.$refs.qqMap.getAddress('22.929465,113.512888')
        /* this.dq = {
          sheng: '广东省',
          shi: '广州市',
          qu: '番禺区',
          location: '22.929465,113.512888'
        }*/
      }
    },
    components: {
      L2dWidget,
      PieMap,
      LineMap,
      QqMap
    },
    computed: {},
    mounted() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  .Home {
    padding: 20px;

    .qq_map {
      margin-top: 20px;
      border-radius: 10px;
      height: 500px;
      border: 1px solid #555;
      margin-bottom: 20px;
    }

    .map_box {
      width: 100%;
      height: 300px;
      border: 1px solid #000;
      margin-bottom: 20px;
    }

    .line_map {
      height: 303px;
      border: 1px solid #ccc;
    }
  }
</style>
