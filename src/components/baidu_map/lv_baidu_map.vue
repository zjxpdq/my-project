<template>
  <div class="lv_bai_du_map">
    <bai-du-map
      ak="N9cpgNGM2ZqVKlR5dDAC9GXnm0ENQ5WR"
      class="lv_bai_du"
      :center="center"
      :zoom="zoom"
      @ready="handler"
      @click="mapClick"
      scroll-wheel-zoom
      @zoomstart="mapZoomStart"
      @zoomend="mapZoomEnd"
    ></bai-du-map>
  </div>
</template>

<script>
  import BaiDuMap from 'vue-baidu-map/components/map/Map'

  export default {
    name: 'IvBaiDuMap',
    data() {
      return {
        center: {
          lng: 116.404,
          lat: 39.915
        },
        zoom: 13
      }
    },
    created() {
    },
    methods: {
      handler({BMap, map}) {
        console.log(BMap, map)
      },
      mapClick({type, target, point, pixel, overlay}) {
        console.log(type)
        console.log(target)
        console.log(point)
        console.log(pixel)
        console.log(overlay)
      },
      mapZoomStart({type, target}) {
        // console.log(type)
        // console.log(target)
      },
      mapZoomEnd(e) {
        console.log(e)
        this.zoom = e.target.getZoom()
      }
    },
    components: {
      BaiDuMap
    },
    computed: {},
    mounted() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  .lv_bai_du_map {
    width: 100%;
    height: 100%;

    .lv_bai_du {
      width: 100%;
      height: 100%;
    }
  }
</style>
