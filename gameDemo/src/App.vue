<template>
  <div id="app">
    <div class="main">
      <router-view></router-view>
    </div>
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="nearby">
        <img slot="icon" src="./assets/dingwei.png" v-if="selected!='nearby'">
        <img slot="icon" src="./assets/dingwei2.png" v-if="selected=='nearby'">
        附近
      </mt-tab-item>
      <mt-tab-item id="ranking">
        <img slot="icon" src="./assets/bangdan.png" v-if="selected!='ranking'">
        <img slot="icon" src="./assets/bangdan2.png" v-if="selected=='ranking'">
        榜单
      </mt-tab-item>
      <mt-tab-item id="award">
        <img slot="icon" src="./assets/jiangpin.png" v-if="selected!='award'">
        <img slot="icon" src="./assets/jiangpin2.png" v-if="selected=='award'">
        奖品
      </mt-tab-item>
      <mt-tab-item id="history">
        <img slot="icon" src="./assets/lishi.png" v-if="selected!='history'">
        <img slot="icon" src="./assets/lishi2.png" v-if="selected=='history'">
        历史
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      selected: 'nearby',
    }
  },
  watch: {
    'selected': function (newval, oldval) {
      this.$router.push({ path: `/${newval}` });
    }
  },
  methods:{
    
  },
  mounted() {
    
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html,body{
  -webkit-overflow-scrolling: touch;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 0.28rem;
}
.mint-tabbar > .mint-tab-item.is-selected{
  color: #64c850;
}
.main{
  /*width: 100%;*/
  /*height: 100%;*/
}
.seat{
  width: 100%;
  height: 55px;
}
</style>
