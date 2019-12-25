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

  export default {
    name: 'qqMaps',
    data() {
      return {
        qqMap: null,
        queryList: {
          keyword: '',
          region: '', // 限制城市范围
          region_fix: 1, // 0：[默认]当前城市无结果时，自动扩大范围到全国匹配 1：固定在当前城市
          key: this.keyword,
          output: 'jsonp',
          page_index: '1',
          page_size: '10'
        }, // 获取智能联想参数
        cityOption: [],
        marker: null, // 标记点
        InfoWin: null, // 弹出框内容
        geoCoder: null, // 地理位置解析器
        eventCenter: null, // 获取的地址详情
        loadMarker: null, // 加载小飞机
        flag: true, // 用于回显定位
        mapCity: {}
      }
    },
    props: {
      keyword: {
        type: String,
        required: true
      }, // 地图的 key 是必须要传的
      value: [Object, Array], // 传入的键值或者双向数据绑定的键值 如果是数组的话传入返回的顺序为 省 => 市 => 区 => 街道 => 详细地址 => 经纬度的集合 => 经度 => 纬度
      backKey: {
        type: Object,
        default() {
          return {
            province: false, // 需要返回省的 key 双向数据绑定的值的 key
            city: false, // 需要返回市的 key 双向数据绑定的值的 key
            district: false, // 需要返回区的 key 双向数据绑定的值的 key
            street: false, // 需要返回街道的 key 双向数据绑定的值的 key
            rough: false, // 需要返回详细地址的 key 双向数据绑定的值的 key
            location: false, // 需要返回经纬度的 key 双向数据绑定的值的 key
            lat: false, // 需要返回经度的 key 双向数据绑定的值的 key
            lng: false // 需要返回纬度的 key 双向数据绑定的值的 key
          }
        }
      }, // 需要返回数据到指定的 key 值或者是指定需要返回的详细值
      isRegion: {
        type: [Boolean, Number, String],
        default: false
      } // 是否开启限制搜索范围如果是布尔值 true 的话默认开启到市的限制 数字：0 限制到省；1 限制到市；2 限制到区，如果传入字符串且非数字或大于 2 的话：制到区
    },
    watch: {
      getCity: {
        handler(to, from) { // 外部传入的数据
          let keys = ['province', 'city', 'district']
          let flag = false
          forEachs(keys, item => {
            if (to[item] !== this.mapCity[item] && to[item] !== from[item]) flag = true
          })
          if (this.flag) {
            if (to.location || to.lat || to.lng) {
              this.flag = false
              this.getAddress()
            } else {
              if (flag) this.getArea()
            }
          } else {
            if (flag) this.getArea()
          }
        },
        deep: true
      }
    },
    created() {
      this.flag = true
    },
    methods: {
      initMap() {
        let map = this.qqMap = new qq.maps.Map(this.$refs.qqMap, {
          center: new qq.maps.LatLng(39.916527, 116.397128),
          zoom: 13
        }) // 默认给一个经纬度
        let _this = this
        let citylocation = new qq.maps.CityService({
          complete: function (result) {
            _this.mapCity.city = result.detail.name
            map.setCenter(result.detail.latLng)
          }
        })
        citylocation.searchLocalCity() // 调用searchLocalCity()方法 根据用户IP查询城市信息。

        this.geoCoder = new qq.maps.Geocoder()

        // 添加监听事件 获取鼠标单击事件
        qq.maps.event.addListener(map, 'click', this.clickMap)
      },
      clickMap(e) {
        if (this.loadMarker) this.loadMarker.setMap(null)
        if (Object.keys(e) && Object.keys(e).length < 1) return false
        let latLng = e.latLng || e.location

        let anchor = new qq.maps.Point(10, 30)
        let size = new qq.maps.Size(32, 30)
        let origin = new qq.maps.Point(0, 0)
        let icon = new qq.maps.MarkerImage('https://lbs.qq.com/javascript_v2/img/plane.png', size, origin, anchor)
        size = new qq.maps.Size(52, 30)
        let originShadow = new qq.maps.Point(32, 0)
        let shadow = new qq.maps.MarkerImage('img/plane.png', size, originShadow, anchor)
        this.loadMarker = new qq.maps.Marker({
          icon: icon,
          shadow: shadow,
          map: this.qqMap,
          animation: qq.maps.MarkerAnimation.BOUNCE
        })
        this.loadMarker.setPosition(new qq.maps.LatLng(latLng.lat, latLng.lng))

        this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1/', {
          key: this.keyword,
          output: 'jsonp',
          location: `${latLng.lat},${latLng.lng}`
        }).then(res => {
          if (this.loadMarker) this.loadMarker.setMap(null)
          if (res.status === 0) {
            this.getSuccess(res)
            forEachs(['province', 'city', 'district'], item => {
              this.mapCity[item] = res.result.ad_info[item]
            })
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
                this.msgBox('warning', {
                  title: '警告',
                  content: '您的操作过于频繁了，请稍后再进行操作！'
                })
                break
            }
            if (msg) {
              this.msgBox('error', {
                title: `错误 ${res.status}`,
                content: msg
              })
            }
          }
        }).catch(() => {
          if (this.loadMarker) this.loadMarker.setMap(null)
          this.msgBox('error', {
            title: '错误',
            content: '地址解析失败，请联系管理员'
          })
        })
      }, // 点击地图
      getSuccess(res) {
        if (this.isRegion || this.isRegion === 0) {
          let isRegion = isNaN(parseInt(this.isRegion)) ? 1 : parseInt(this.isRegion) > 2 ? 1 : parseInt(this.isRegion) // 把限制的转换成数字,非数字并且大于 2 和 true 的全部转成 1 。 0: 限制省；1：限制市；2：现在区
          let judge = ['province', 'city', 'district'].map(item => res.result.ad_info[item] === this.getCity[item])
          if (!judge[isRegion]) {
            this.msgBox('error', {
              title: '定位失败',
              content: `您搜索或定位超过设置的${{
                0: '省',
                1: '市',
                2: '区'
              }[isRegion]}级范围。<br/><br/>解决方法1：重新设置省/市/区或修改详细地址。<br/>解决方法2：拖动下方定位图标进行手动定位。`
            })
          } else {
            this.getSite(res.result)
          }
        } else {
          this.getSite(res.result)
        }
      }, // 点击地图解析地址成功时调用
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
            <p style='color: #858585; line-height: 1.2; padding: 5px;'><b style="color: #333;">地址：</b>${e.address}</p>
            <p style='color: #858585; line-height: 1.2; padding: 5px;'><b style="color: #333;">详细地址：</b>${e.formatted_addresses.rough}</p>
            <br/>
            <input type='button' value='确定' id='saveLngLat' style='background: rgb(135,205,208);border: none;color: white;height: 30px;width: 60px;border-radius: 4px;'/>
          </div>
        `) // 设置弹窗内容
        InfoWin.setPosition(position) // 渲染弹窗到指定经纬度

        let _this = this
        this.eventCenter = e
        qq.maps.event.addListener(InfoWin, 'domready', function () {
          if (document.getElementById("saveLngLat") != null) { // 判断是否有按钮元素
            qq.maps.event.addListener(document.getElementById("saveLngLat"), 'click', _this.clickConfirm) // 给指定元素注册点击事件
          }
        }) // 给弹窗注册事件

        if (map.getZoom() < 17) {
          map.setCenter(position) // 获取当前经纬度
          map.setZoom(17) // 扩大当前选中的地图缩放值
        }

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
      clickConfirm(event) {
        if (event.target.id !== "saveLngLat") return false
        let e = this.eventCenter
        let obj = {
          province: e.ad_info.province,
          city: e.ad_info.city,
          district: e.ad_info.district,
          street: e.address_component.street,
          rough: e.formatted_addresses.rough,
          location: Object.values(e.location).join(','),
          lat: e.location.lat,
          lng: e.location.lng
        }

        let cityFlag = false
        let flagText = ''
        let replaceText = ''

        forEachs(['province', 'city', 'district'], item => {
          if (this.getCity[item] && this.getCity[item] !== obj[item]) {
            cityFlag = true
            flagText += item === 'province' ? '省' : item === 'city' ? '市' : '区'
            replaceText += `<strong>${this.getCity[item]}</strong> 替换为 <strong>${obj[item]}</strong> `
          }
        })

        if (cityFlag) {
          this.msgBox('confirm', {
            cancelText: '重新选择',
            okText: '确认修改',
            title: '警告',
            content: `系统检测到您选择的 <strong>${flagText}</strong> 与地图上选中的 <strong>${flagText}</strong> 不一致，是否将 ${replaceText}`,
            onOk: () => {
              this.InfoWin.setContent(`
                <div id='descConten' style='width:200px;'>
                  <h3 style="display: flex; align-items: center; height: 30px;">
                    <img style='width:20px;'  src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURQAAAILN0ILN0YLN0IHN0Yjb24HO0oLO0ILO0YLN0IPR1IHO0oLN0ILN0IHN0ILN0D5RSKkAAAAPdFJOUwD6keppBjhfTcYXJa582y6RH1EAAAT3SURBVHja7Zvdi1VVGIeXo3vUc0axQJCM2QOBUBjjVV+Qe6A/YCaLCaFA7aa6UfIDCWTswq6CvAm0lDMWKCKiNnciNPhBeKGjRkSQFIkKhRzOnCk9NXNeaSxmz9l7v+9vvWttr9bvUmZ85tnrc6/1bmNCQkJCQkJCQh5TohPv7bi5+5OzQ6URju65nNCj9F7ZVQrn2AWal97vTvtGDD9LmTQvbvLK2BJTXppr/CGqz1BR7o16YrxZo+K0tnlhnEyIS3unB8Y3MVHZlHMkpu36xDbEMoRabl15SUJIJl36WLVGWF50gFwnNF+oGW/DDGrs1T6sOg6hSeWs/DHZ5I6u91oxqKEZLdGEHYQmFZDjZJtL1oxK3RrSsm77d8k+v1syumMFpGm56m8mKl2lmqggdq3yNelyqdyuZT9WNpI213BIvxryF74eqhnUhNfII3oIfY5OjTUHCNr0y8gl4BK51QnyCva06k6Q6cfwtIignd4ZR8htBFJzhMwAjMWODGqMljcBz2VchvziDJHnryh2hrRK78BQJ37DA0RslBHlf3z4Zg1uFO2c8pwxlX50ZlGuV1Pzm1PYf/XoIAOzvzwBrvSn9CKpFXVdGUNxoOMxCC1fdxAxi7A1uNtFZG5ubbDb1S4XkTkTfqFf6CKS+hPHfe8hpnKmpBUcZNBFJLW7ZbvXhIvIInAJjl1EBrElpduTCNuHl3kSYftwjycRor5iyHIHkRF0cXxdL9KxXfu1GPKtLxFaWQz5zJcI/eNvNSkUoQfe3nqLRbghX/Mlwi1bdV8i3K4o8SXCTV6xLxEGEnkToXbx4ZA3EWr6gbAi1ACXk/bzNxKtCBEGae015q1EKUI0BEFmj3vGtCLFkGrmRbmSKEUIavgZ9oVbFGlC4+Qp9ux2QFodiseJSf3U/v/+aYwXWRJbQ+IsJFdlQLzIaUET5P+QPBVZhIPUcxbpHBVZhJvqU1vh+6ZQBRDhFq3U8tseKlQBRFJ/I3scMV6kgohw7w5bc4U7VBAR+hN8i+/LV4FEuDf5BSSrQCJzIyCbpSSqYCLcrr6LRBVMJPVj0hlRjgoowp0TRSSpgCJNi4PnjAoqMm1xSJRRAUW4AZ89kehQQUW415Ps+1yHCirCn6r1EKcCi3DDJOecc54KLMIfP0cJo4KLtC2vMVMq22CRGdtLs5zHK4nQ3zxkIbKQirUm+60vHfqsRUioLqnEsooo0pTu/vtFFbl8Qrw6OyJub+TyiZUSpEcav0AdiHjzX5V2arIIcAc4wasAIsBt+Rn+14CCltUypIudVZHKHKAYI0o4FUCkjVTIjDAqiAhU8LGUaUykxGgcgVTjQhWkRAMsKsk9JJytDkSq1+67FPkcYE9BLJ9W7kz8b14+iDDgEhzb42HrvqW+PkM2Q57qfCxq1cbUkNUwQ1c7ODvL29RAa5t+lU1hn7Z4xa4IVlcQN2VXbKm7/L9mB4kU15pQFZHrgFSUJQ+W27XQHW/n1Kj5TsC2YvgPBcNU7GawaV3N+ztldl/VA3tBybB5YC39dxuL0Zu0xg9Gn69AyJfGJe9DjJeMW7YDjCddv6OLvpcZ7h+ERa8JjFd9fHQmUO76+eYw+rR4rvT4id6xolH59D7jL5Wf8mQaF0eN1wz/nMH8ts94T/eHV1OE3vMfmXIyvGft5VtPrD90/scPTEhISEhISEhISEiIlIeljoGZTuDP4AAAAABJRU5ErkJggg==' />
                    <span>标记成功定位地址为</span>
                  </h3>
                  <hr/>
                  <p style='color: #858585; line-height: 1.2; padding: 5px;'><b style="color: #333;">地址：</b>${e.address}</p>
                  <p style='color: #858585; line-height: 1.2; padding: 5px;'><b style="color: #333;">详细地址：</b>${e.formatted_addresses.rough}</p>
                  <br/>
                  <br/>
                </div>
              `) // 确认后更改弹窗内容
              this.exportValue(obj)
            },
            onCancel: () => {
              if (this.marker && this.InfoWin) {
                this.marker.setMap(null)
                this.InfoWin.setMap(null)
              }
            }
          })
        } else {
          this.InfoWin.setContent(`
          <div id='descConten' style='width:200px;'>
            <h3 style="display: flex; align-items: center; height: 30px;">
              <img style='width:20px;'  src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURQAAAILN0ILN0YLN0IHN0Yjb24HO0oLO0ILO0YLN0IPR1IHO0oLN0ILN0IHN0ILN0D5RSKkAAAAPdFJOUwD6keppBjhfTcYXJa582y6RH1EAAAT3SURBVHja7Zvdi1VVGIeXo3vUc0axQJCM2QOBUBjjVV+Qe6A/YCaLCaFA7aa6UfIDCWTswq6CvAm0lDMWKCKiNnciNPhBeKGjRkSQFIkKhRzOnCk9NXNeaSxmz9l7v+9vvWttr9bvUmZ85tnrc6/1bmNCQkJCQkJCQh5TohPv7bi5+5OzQ6URju65nNCj9F7ZVQrn2AWal97vTvtGDD9LmTQvbvLK2BJTXppr/CGqz1BR7o16YrxZo+K0tnlhnEyIS3unB8Y3MVHZlHMkpu36xDbEMoRabl15SUJIJl36WLVGWF50gFwnNF+oGW/DDGrs1T6sOg6hSeWs/DHZ5I6u91oxqKEZLdGEHYQmFZDjZJtL1oxK3RrSsm77d8k+v1syumMFpGm56m8mKl2lmqggdq3yNelyqdyuZT9WNpI213BIvxryF74eqhnUhNfII3oIfY5OjTUHCNr0y8gl4BK51QnyCva06k6Q6cfwtIignd4ZR8htBFJzhMwAjMWODGqMljcBz2VchvziDJHnryh2hrRK78BQJ37DA0RslBHlf3z4Zg1uFO2c8pwxlX50ZlGuV1Pzm1PYf/XoIAOzvzwBrvSn9CKpFXVdGUNxoOMxCC1fdxAxi7A1uNtFZG5ubbDb1S4XkTkTfqFf6CKS+hPHfe8hpnKmpBUcZNBFJLW7ZbvXhIvIInAJjl1EBrElpduTCNuHl3kSYftwjycRor5iyHIHkRF0cXxdL9KxXfu1GPKtLxFaWQz5zJcI/eNvNSkUoQfe3nqLRbghX/Mlwi1bdV8i3K4o8SXCTV6xLxEGEnkToXbx4ZA3EWr6gbAi1ACXk/bzNxKtCBEGae015q1EKUI0BEFmj3vGtCLFkGrmRbmSKEUIavgZ9oVbFGlC4+Qp9ux2QFodiseJSf3U/v/+aYwXWRJbQ+IsJFdlQLzIaUET5P+QPBVZhIPUcxbpHBVZhJvqU1vh+6ZQBRDhFq3U8tseKlQBRFJ/I3scMV6kgohw7w5bc4U7VBAR+hN8i+/LV4FEuDf5BSSrQCJzIyCbpSSqYCLcrr6LRBVMJPVj0hlRjgoowp0TRSSpgCJNi4PnjAoqMm1xSJRRAUW4AZ89kehQQUW415Ps+1yHCirCn6r1EKcCi3DDJOecc54KLMIfP0cJo4KLtC2vMVMq22CRGdtLs5zHK4nQ3zxkIbKQirUm+60vHfqsRUioLqnEsooo0pTu/vtFFbl8Qrw6OyJub+TyiZUSpEcav0AdiHjzX5V2arIIcAc4wasAIsBt+Rn+14CCltUypIudVZHKHKAYI0o4FUCkjVTIjDAqiAhU8LGUaUykxGgcgVTjQhWkRAMsKsk9JJytDkSq1+67FPkcYE9BLJ9W7kz8b14+iDDgEhzb42HrvqW+PkM2Q57qfCxq1cbUkNUwQ1c7ODvL29RAa5t+lU1hn7Z4xa4IVlcQN2VXbKm7/L9mB4kU15pQFZHrgFSUJQ+W27XQHW/n1Kj5TsC2YvgPBcNU7GawaV3N+ztldl/VA3tBybB5YC39dxuL0Zu0xg9Gn69AyJfGJe9DjJeMW7YDjCddv6OLvpcZ7h+ERa8JjFd9fHQmUO76+eYw+rR4rvT4id6xolH59D7jL5Wf8mQaF0eN1wz/nMH8ts94T/eHV1OE3vMfmXIyvGft5VtPrD90/scPTEhISEhISEhISEiIlIeljoGZTuDP4AAAAABJRU5ErkJggg==' />
              <span>标记成功定位地址为</span>
            </h3>
            <hr/>
            <p style='color: #858585; line-height: 1.2; padding: 5px;'><b style="color: #333;">地址：</b>${e.address}</p>
            <p style='color: #858585; line-height: 1.2; padding: 5px;'><b style="color: #333;">详细地址：</b>${e.formatted_addresses.rough}</p>
            <br/>
            <br/>
          </div>
        `) // 确认后更改弹窗内容
          this.exportValue(obj)
        }
      }, // 点击确认选中地址
      changeOption(e) {
        if (!e) return false
        let val = this.cityOption.filter(item => item.id === e)[0] || {}
        this.clickMap(val)
      }, // 点击下拉选中
      clickBtn(v) {
        if (!v) return false
        let city = `${this.province || ''}${this.city || ''}${this.district || ''}${v}`
        this.geoCoder.setComplete(res => {
          this.clickMap(res.detail)
        })
        this.geoCoder.setError(() => {
          this.msgBox('error', {
            title: '错误',
            content: '出错了，请输入正确的地址！！！'
          })
        })
        this.geoCoder.getLocation(city)
      }, // 点击搜索按钮
      getArea() {
        if (!this.getCity.province && !this.getCity.city && !this.getCity.district) return false
        if (this.marker && this.InfoWin) {
          this.marker.setMap(null)
          this.InfoWin.setMap(null)
        }
        let city = `${this.getCity.province || ''}${this.getCity.city || ''}${this.getCity.district || ''}`
        this.geoCoder.setComplete(res => {
          this.qqMap.setCenter(res.detail.location)
          forEachs(['province', 'city', 'district'], item => {
            this.mapCity[item] = res.detail.addressComponents[item]
          })
        })
        console.log('按区域缩放被触发了')
        this.geoCoder.getLocation(city)
      }, // 获取地址缩放区域
      getAddress(location) {
        if (!this.getCity.location && !this.getCity.lat && !this.getCity.lng && !location) return false
        let city = location || this.getCity.location || `${this.getCity.lat},${this.getCity.lng}`
        this.geoCoder.setComplete(res => {
          this.clickMap(res.detail)
        })
        let lat = city.includes(',') ? city.split(",", 2)[0] : this.getCity.lat
        let lng = city.includes(',') ? city.split(",", 2)[1] : this.getCity.lng
        let latLng = new qq.maps.LatLng(lat, lng)
        this.geoCoder.getAddress(latLng)
      }, // 根据经纬度搜索区域
      exportValue(obj) {
        this.flag = false
        let v = deepCopy(this.value)
        let backKey = deepCopy(this.backKey)
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
          forEachs(keys, item => {
            let elk = Object.keys(item)[0] // 本组件的 key
            let k = Object.values(item)[0] // 父组件的 key
            v[k] = obj[elk]
          })
          this.putValue = v
          this.$emit('on-value', obj)
        } else if (typeOf(v) === 'array') {
          this.putValue = Object.values(obj)
          this.$emit('on-value', obj)
        } else {
          this.putValue = obj
          this.$emit('on-value', obj)
        }
      }, // 返回数据
      msgBox(type, config = {}) {
        if (!type) return false
        let obj = {
          title: config['title'] || '提示',
          content: config['content'] || '地址解析失败，请联系管理员'
        }

        Object.assign(obj, config)

        this.$Modal[type](obj)
      } // 警告提示
    },
    mounted() {
      this.initMap()
    },
    computed: {
      putValue: {
        get: function () {
          return this.value
        },
        set: function (val) {
          this.$emit('input', val)
        }
      },
      getCity() {
        let backKey = deepCopy(this.backKey)
        let keys = []
        let flag = false
        forEachs(Object.keys(backKey), item => {
          if (backKey[item]) {
            flag = true
            let obj = {}
            obj[item] = typeOf(backKey[item]) === 'boolean' ? item : backKey[item]
            keys.push(obj)
          }
        }) // 剔除未指定返回的 key
        let obj = {}
        Object.assign(obj, this.value)
        let blackObj = {
          province: null, // 省
          city: null, // 市
          district: null, // 区
          street: null, // 街道
          rough: null, // 详细地址
          location: null, // 经纬度的合计
          lat: null, // 经度
          lng: null // 纬度
        }
        let val = deepCopy(this.value)
        if (typeOf(val) === 'object' && flag) {
          forEachs(keys, item => {
            blackObj[Object.keys(item)[0]] = obj[Object.values(item)[0]] || null
          })
        } else if (typeOf(val) === 'array') {
          blackObj = {
            province: val[0] || null, // 省
            city: val[1] || null, // 市
            district: val[2] || null, // 区
            street: val[3] || null, // 街道
            rough: val[4] || null, // 详细地址
            location: val[5] || null, // 经纬度的合计
            lat: val[6] || null, // 经度
            lng: val[7] || null // 纬度
          }
        } else {
          forEachs(Object.keys(blackObj), item => {
            blackObj[item] = obj[item] || null
          })
        }
        return blackObj
      } // 获取父组件传入的地址
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

