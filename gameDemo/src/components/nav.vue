<template>
  <mt-tabbar v-model="selected" fixed>
    <mt-tab-item id="nearby">
      <img slot="icon" src="../assets/dingwei.png" v-if="selected!='nearby'">
      <img slot="icon" src="../assets/dingwei2.png" v-if="selected=='nearby'">
      附近
    </mt-tab-item>
    <mt-tab-item id="ranking">
      <img slot="icon" src="../assets/bangdan.png" v-if="selected!='ranking'">
      <img slot="icon" src="../assets/bangdan2.png" v-if="selected=='ranking'">
      榜单
    </mt-tab-item>
    <mt-tab-item id="award">
      <img slot="icon" src="../assets/jiangpin.png" v-if="selected!='award'">
      <img slot="icon" src="../assets/jiangpin2.png" v-if="selected=='award'">
      奖品
    </mt-tab-item>
    <mt-tab-item id="history">
      <img slot="icon" src="../assets/lishi.png" v-if="selected!='history'">
      <img slot="icon" src="../assets/lishi2.png" v-if="selected=='history'">
      历史
    </mt-tab-item>
  </mt-tabbar>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      selected: 'nearby',
    }
  }
}
</script>

<style scoped>
  .mint-tabbar > .mint-tab-item.is-selected{
    color: #64c850;
  }
</style>
