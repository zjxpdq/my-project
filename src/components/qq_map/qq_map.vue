<template>
  <div class="lv_qq_map">
    <div class="lv_map_input">
      <div class="lv_map_input_btn">
        <AutoComplete
          @on-search="getOption"
          v-model="queryList.keyword"
          transfer
          class="lv_qq_map_auto_complete"
        >
          <Option v-for="item in cityOption" :value="item.title" :key="item.id" class="lv_qq_map_auto_complete_li">
            <div @click="changeOption(item.id)" class="lv_qq_map_auto_complete_li_box">
              {{item.title}}
              <span class="lv_map_option_text">{{item.address}}</span>
            </div>
          </Option>
        </AutoComplete>

        <Button type="primary" @click="clickBtn(queryList.keyword)">
          <Icon type="ios-search" size="16"/>
        </Button>
      </div>
    </div>
    <div id="qqMap" ref="qqMap"></div>
  </div>
</template>

<script>
  import {deepCopy, forEachs, typeOf} from "../../utils"

  const MapKey = 'MXNBZ-P6M6Q-HRT57-GTJRI-7PW5V-5FBBC'

  export default {
    name: 'qqMaps',
    data() {
      return {
        qqMap: null,
        queryList: {
          keyword: '',
          region: '', // 限制城市范围
          region_fix: 1, // 0：[默认]当前城市无结果时，自动扩大范围到全国匹配 1：固定在当前城市
          key: MapKey,
          output: 'jsonp',
          page_index: '1',
          page_size: '10'
        }, // 获取智能联想参数
        cityOption: [],
        marker: null, // 标记点
        InfoWin: null, // 弹出框内容
        geoCoder: null, // 地理位置解析器
        keysVal: '',
        markers: []
      }
    },
    props: {
      value: [Object, String],
      province: String, // 省
      city: String, // 市
      area: String, // 区
      backKey: {
        type: Object,
        default() {
          return {
            province: false, // 需要返回省的 key 双向数据绑定的值的 key
            city: false, // 需要返回市的 key 双向数据绑定的值的 key
            district: false, // 需要返回区的 key 双向数据绑定的值的 key
            location: false, // 需要返回经纬度的 key 双向数据绑定的值的 key
            lat: false, // 需要返回经度的 key 双向数据绑定的值的 key
            lng: false // 需要返回纬度的 key 双向数据绑定的值的 key
          }
        }
      }, // 需要返回数据到指定的 key 值
      isRegion: {
        type: Boolean,
        default: false
      } // 是否开启限制搜索范围
    },
    watch: {
      city: {
        handler(t, f) {
          if (t && t !== f) this.getPosition()
        },
        deep: true
      },
      area: {
        handler(t, f) {
          if (t && t !== f) this.getPosition()
        },
        deep: true
      }
    },
    created() {
    },
    methods: {
      initMap() {
        let map = this.qqMap = new qq.maps.Map(this.$refs.qqMap, {
          center: new qq.maps.LatLng(39.916527, 116.397128),
          zoom: 13
        }) // 默认给一个经纬度

        let citylocation = new qq.maps.CityService({
          complete: function (result) {
            map.setCenter(result.detail.latLng)
          }
        })
        citylocation.searchLocalCity() // 调用searchLocalCity()方法 根据用户IP查询城市信息。

        this.geoCoder = new qq.maps.Geocoder()

        // 添加监听事件 获取鼠标单击事件
        qq.maps.event.addListener(map, 'click', this.clickMap)
      },
      clickMap(e) {
        if (Object.keys(e) && Object.keys(e).length < 1) return false
        console.log(e)
        let latLng = e.latLng || e.location
        this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1/', {
          key: MapKey,
          output: 'jsonp',
          location: `${latLng.lat},${latLng.lng}`
        }).then(res => {
          if (res.status === 0) {
            let dz = res.result.ad_info
            if (this.isRegion && (this.province !== dz.province || this.city !== dz.city)) {
              this.$Modal.error({
                title: '定位失败',
                content: '您搜索或定位超过设置的市级范围。<br/><br/>解决方法1：重新设置省/市/区或修改详细地址。<br/>解决方法2：拖动下方定位图标进行手动定位。'
              })
            } else {
              this.getSite(res.result)
            }
          } else {
            let msg = ''
            switch (res.status) {
              case 310:
                msg = '请求参数信息有误'
                break
              case 311:
                msg = 'Key格式错误'
                break
              case 306:
                msg = '请求有护持信息请检查字符串'
                break
              case 110:
                msg = '请求来源未被授权'
                break
              case 120:
                this.$Modal.warning({
                  title: '警告',
                  content: '您的操作过于频繁了，请稍后再进行操作！'
                })
                break
            }
            if (msg) {
              this.$Modal.error({
                title: `错误 ${res.status}`,
                content: msg
              })
            }
          }
        }).catch(() => {
          this.$Modal.error({
            title: '错误',
            content: '地址解析失败，请联系管理员'
          })
        })
      }, // 点击地图
      getSite(e) {
        if (this.marker && this.InfoWin) {
          this.marker.setMap(null)
          this.InfoWin.setMap(null)
        }
        let map = this.qqMap
        let latLng = e.latLng || e.location
        let position = new qq.maps.LatLng(latLng.lat, latLng.lng)

        let marker = this.marker = new qq.maps.Marker({
          position,
          animation: qq.maps.MarkerAnimation.DROP,
          map
        }) // 获取点地图的位置击的位置并标记

        let InfoWin = this.InfoWin = new qq.maps.InfoWindow({map}) // 初始化地图提示框
        InfoWin.open() // 开启
        InfoWin.setContent(`
          <div id='descConten' style='width:200px;'>
            <h3 style="height: 30px;">已将坐标定位为</h3>
            <hr/>
            <p style='color: #858585; line-height: 1.2; padding: 10px;'>
              地址：${e.address}
            </p>
            <br/>
            <input type='button' value='确定' id='saveLngLat' style='background: rgb(135,205,208);border: none;color: white;height: 30px;width: 60px;border-radius: 4px;'/>
          </div>
        `) // 设置弹窗内容
        InfoWin.setPosition(position) // 渲染弹窗到指定经纬度

        let _this = this
        qq.maps.event.addListener(InfoWin, 'domready', function () {
          if (document.getElementById("saveLngLat") != null) { // 判断是否有按钮元素
            qq.maps.event.addListener(document.getElementById("saveLngLat"), 'click', function (evt) {
              if (evt.target.id === "saveLngLat") {
                InfoWin.setContent(`
                  <div id='descConten' style='width:200px;'>
                    <h3 style="display: flex; align-items: center; height: 30px;">
                      <img style='width:20px;'  src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURQAAAILN0ILN0YLN0IHN0Yjb24HO0oLO0ILO0YLN0IPR1IHO0oLN0ILN0IHN0ILN0D5RSKkAAAAPdFJOUwD6keppBjhfTcYXJa582y6RH1EAAAT3SURBVHja7Zvdi1VVGIeXo3vUc0axQJCM2QOBUBjjVV+Qe6A/YCaLCaFA7aa6UfIDCWTswq6CvAm0lDMWKCKiNnciNPhBeKGjRkSQFIkKhRzOnCk9NXNeaSxmz9l7v+9vvWttr9bvUmZ85tnrc6/1bmNCQkJCQkJCQh5TohPv7bi5+5OzQ6URju65nNCj9F7ZVQrn2AWal97vTvtGDD9LmTQvbvLK2BJTXppr/CGqz1BR7o16YrxZo+K0tnlhnEyIS3unB8Y3MVHZlHMkpu36xDbEMoRabl15SUJIJl36WLVGWF50gFwnNF+oGW/DDGrs1T6sOg6hSeWs/DHZ5I6u91oxqKEZLdGEHYQmFZDjZJtL1oxK3RrSsm77d8k+v1syumMFpGm56m8mKl2lmqggdq3yNelyqdyuZT9WNpI213BIvxryF74eqhnUhNfII3oIfY5OjTUHCNr0y8gl4BK51QnyCva06k6Q6cfwtIignd4ZR8htBFJzhMwAjMWODGqMljcBz2VchvziDJHnryh2hrRK78BQJ37DA0RslBHlf3z4Zg1uFO2c8pwxlX50ZlGuV1Pzm1PYf/XoIAOzvzwBrvSn9CKpFXVdGUNxoOMxCC1fdxAxi7A1uNtFZG5ubbDb1S4XkTkTfqFf6CKS+hPHfe8hpnKmpBUcZNBFJLW7ZbvXhIvIInAJjl1EBrElpduTCNuHl3kSYftwjycRor5iyHIHkRF0cXxdL9KxXfu1GPKtLxFaWQz5zJcI/eNvNSkUoQfe3nqLRbghX/Mlwi1bdV8i3K4o8SXCTV6xLxEGEnkToXbx4ZA3EWr6gbAi1ACXk/bzNxKtCBEGae015q1EKUI0BEFmj3vGtCLFkGrmRbmSKEUIavgZ9oVbFGlC4+Qp9ux2QFodiseJSf3U/v/+aYwXWRJbQ+IsJFdlQLzIaUET5P+QPBVZhIPUcxbpHBVZhJvqU1vh+6ZQBRDhFq3U8tseKlQBRFJ/I3scMV6kgohw7w5bc4U7VBAR+hN8i+/LV4FEuDf5BSSrQCJzIyCbpSSqYCLcrr6LRBVMJPVj0hlRjgoowp0TRSSpgCJNi4PnjAoqMm1xSJRRAUW4AZ89kehQQUW415Ps+1yHCirCn6r1EKcCi3DDJOecc54KLMIfP0cJo4KLtC2vMVMq22CRGdtLs5zHK4nQ3zxkIbKQirUm+60vHfqsRUioLqnEsooo0pTu/vtFFbl8Qrw6OyJub+TyiZUSpEcav0AdiHjzX5V2arIIcAc4wasAIsBt+Rn+14CCltUypIudVZHKHKAYI0o4FUCkjVTIjDAqiAhU8LGUaUykxGgcgVTjQhWkRAMsKsk9JJytDkSq1+67FPkcYE9BLJ9W7kz8b14+iDDgEhzb42HrvqW+PkM2Q57qfCxq1cbUkNUwQ1c7ODvL29RAa5t+lU1hn7Z4xa4IVlcQN2VXbKm7/L9mB4kU15pQFZHrgFSUJQ+W27XQHW/n1Kj5TsC2YvgPBcNU7GawaV3N+ztldl/VA3tBybB5YC39dxuL0Zu0xg9Gn69AyJfGJe9DjJeMW7YDjCddv6OLvpcZ7h+ERa8JjFd9fHQmUO76+eYw+rR4rvT4id6xolH59D7jL5Wf8mQaF0eN1wz/nMH8ts94T/eHV1OE3vMfmXIyvGft5VtPrD90/scPTEhISEhISEhISEiIlIeljoGZTuDP4AAAAABJRU5ErkJggg==' />
                      <span>标记成功定位地址为</span>
                    </h3>
                    <hr/>
                    <p style='color: #858585;line-height: 1.2; padding: 10px;'>
                      地址：${e.address}
                    </p>
                    <br/>
                    <br/>
                  </div>
                `) // 确认后更改弹窗内容
                _this.exportValue(e)
              }
            }) // 给指定元素注册点击事件
          }
        }) // 给弹窗注册事件

        map.setCenter(position) // 获取当前经纬度
        map.setZoom(17) // 扩大当前选中的地图缩放值

        qq.maps.event.addListener(map, 'click', function () {
          marker.setMap(null) // 清除旧的标记点
          InfoWin.setMap(null) // 清除旧的弹窗
        }) // 清除上次标记点
      }, // 获取详细地址
      getOption() {
        let params = deepCopy(this.queryList)
        this.$jsonp('https://apis.map.qq.com/ws/place/v1/suggestion/', params).then(res => {
          if (res.status === 0) {
            this.cityOption = res.data
          }
        }).catch(err => {
          console.log(err)
        })
      }, // 获取智能联想列表
      changeOption(e) {
        if (!e) return false
        let val = this.cityOption.filter(item => item.id === e)[0] || {}
        this.clickMap(val)
      }, // 点击下拉选中
      clickBtn(v) {
        if (!v) return false
        let city = `${this.province || ''}${this.city || ''}${this.area || ''}${v}`
        this.geoCoder.setComplete(res => {
          this.clickMap(res.detail)
        })
        this.geoCoder.setError(() => {
          this.$Modal.error({
            title: '错误',
            content: '出错了，请输入正确的地址！！！'
          })
        })
        this.geoCoder.getLocation(city)
      }, // 点击按钮
      getPosition() {
        if (!this.province && !this.city && !this.area) return false
        let city = `${this.province || ''}${this.city || ''}${this.area || ''}`
        this.geoCoder.setComplete(res => {
          this.qqMap.setCenter(res.detail.location)
        })
        this.geoCoder.getLocation(city)
      }, // 获取地址缩放区域
      exportValue(val) {
        let v = this.value
        let backKey = this.backKey
        let flag = false
        let keys = []
        forEachs(Object.keys(backKey), item => {
          if (backKey[item]) {
            flag = true
            let obj = {}
            obj[item] = typeOf(backKey[item]) === 'boolean' ? item : backKey[item]
            keys.push(obj)
          }
        }) // 剔除未指定返回的 key
        if (typeOf(v) === 'object' && flag) {
          let valueKeys = Object.keys(v) // 双向数据绑定的 key
          let getVal = val.ad_info // 当前选中的详细地址
          forEachs(keys, item => {
            let elk = Object.keys(item)[0]
            let k = Object.values(item)[0]
            if (elk === 'lat' || elk === 'lng') {
              if (valueKeys.includes(elk)) {
                v[elk] = getVal.location[elk]
              } else {
                v[k] = getVal.location[elk]
              }
            } else {
              if (elk === 'location') {
                if (valueKeys.includes(elk)) {
                  v[elk] = Object.values(getVal.location).join(',')
                } else {
                  v[k] = Object.values(getVal.location).join(',')
                }
              } else {
                if (valueKeys.includes(elk)) {
                  v[elk] = getVal[elk]
                } else {
                  v[k] = getVal[elk]
                }
              }
            }
          })
          this.putValue = v
        } else {
          this.putValue = val
          this.$emit('on-value', val)
        }
      } // 返回数据
    },
    mounted() {
      this.initMap()
      this.$nextTick(() => {
        this.getPosition()
      })
    },
    computed: {
      putValue: {
        get: function () {
          return this.value
        },
        set: function (val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .lv_qq_map {
    width: 100%;
    height: 100%;
    position: relative;

    .lv_map_input {
      width: 100%;
      position: absolute;
      top: 20px;
      z-index: 99;
      left: 0;

      .lv_map_input_btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .ivu-auto-complete {
          width: 40%;
        }

        .ivu-btn {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }

    }

    #qqMap {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
</style>

<style lang="scss">
  .lv_qq_map_auto_complete .ivu-input-wrapper .ivu-input {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .lv_qq_map_auto_complete_li {
    padding: 0;

    .lv_qq_map_auto_complete_li_box {
      padding: 7px 16px;

      .lv_map_option_text {
        margin-left: 5px;
        color: #ccc;
      }
    }
  }
</style>

