<template>
  <div>
    <baidu-map class="bm-view" ak="t17g26C4EiBlMAhmobqCF6yLUhLqHTUG" :scroll-wheel-zoom="true" :center="center" :zoom="zoom" @ready="handler" @click="choose" :autoLocation="true">
      <bm-marker :position="position">
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import {BaiduMap,BmMarker} from 'vue-baidu-map'
export default {
  components: {
    BaiduMap,
    BmMarker
  },
  data () {
    return {
      center: {lng: 0, lat: 0},
      position: {lng: 0, lat: 0},
      zoom: 15,
    }
  },
  methods: {
    handler ({BMap, map}) {
      // console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
    },
    choose(e){
      console.log(e.point);
      this.position = e.point;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bm-view {
  width: 100%;
  height: 600px;
}
</style>
