<template>
  <div>
    <mt-swipe :auto="3000">
      <mt-swipe-item v-for="one in banner" :key="one.id" :style='"background-image:url("+one.path+")"'></mt-swipe-item>
    </mt-swipe>
    <marquee behavior="scroll" direction="left" class="information">
        <ul :style="{ width: infoWidth }">
          <li v-for="one in gameInfo" :key="one.id"><i class="i1">{{one.username}}</i>在<i class="i3">《{{one.gamename}}》</i>中获得<i class="i2">{{one.score}}</i>分</li>
        </ul>
    </marquee>
    <div class="searchBox">
      <ul>
        <li class="position"><input type="text" value="" class="drownList" id="position" /><i id="positionName">--</i></li>
        <li class="store c"><input type="text" value="" class="drownList" id="store" /><i id="storeName">-- --</i></li>
        <li class="rule"><input type="text" value="" class="drownList" id="rule" /><i id="ruleName">不限</i></li>
      </ul>
    </div>
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <div class="actListBox">
        <ul>
          <li v-for="(val,index) in gameList" :key="val.id">
            <div class="actInfo">
              <div class="logo" v-bind:style='"background-image:url("+val.gamepic+")"'></div>
              <div class="game">
                <div class="g_name">{{val.gamename}}</div>
                <div class="g_join" v-if="val.status==0">参赛人次：{{val.personnum}}</div>
                <div class="g_join" v-if="val.status==1">人气值：{{val.personnum}}</div>
                <div class="g_join" v-if="val.status==2">参与人数：{{val.personnum}}</div>
                <div class="g_time" v-bind:id="'row'+index" v-if="val.status==0">结束倒计时：<i class="i1">-</i>:<i class="i2">-</i>:<i class="i3">-</i></div>
                <div class="g_time" v-bind:id="'row'+index" v-if="val.status==1">开始倒计时：<i class="i1">-</i>:<i class="i2">-</i>:<i class="i3">-</i></div>
                <div class="g_time" v-bind:id="'row'+index" v-if="val.status==2" style="color:red;">已结束</div>
              </div>
              <div class="make">
                <div class="m_info" v-if="val.status==0"><a href="javascript:;" class="situation" v-bind:data-id="val.id">战况</a></div>
                <div class="m_info" v-if="val.status==1"><a href="javascript:;">开始时间<i class="i1" style="background-color:#999;">{{val.begintime.split(" ")[1].split(":")[0]}}</i>:<i class="i2" style="background-color:#999;">{{val.begintime.split(" ")[1].split(":")[1]}}</i></a></div>
                <div class="m_info" v-if="val.status==2"><a href="javascript:;" class="seerank">排名</a></div>
                <div class="m_join" v-bind:class="'m_join_'+val.status">
                  <a v-bind:href='val.gameurl+"?ai="+val.id+"&status="+val.status' target="_blank"></a>
                </div>
                <div class="m_score">{{val.status==0?"最高分：":val.status==1?"大奖":"大奖得主："}}{{val.maxscore}}</div>
              </div>
            </div>
            <div class="companyInfo clearfix">
              <div class="c_logo" v-bind:style='"background-image:url("+val.logo+")"'></div>
              <div class="c_name">{{val.shopname}}</div>
              <div class="c_position">{{(val.distance/1000).toFixed(2)}} Km</div>
            </div>
          </li>
        </ul>
      </div>
    </mt-loadmore>
    <div class="seat"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      infoWidth: 4.6*4+"rem",
      allLoaded: false,
      banner: [{id:1,path:'http://www.easyinto.cn/gamesIco/916c8c2b-07b8-4b22-aea1-c722b16d24f9.png'},{id:1,path:'http://www.easyinto.cn/gamesIco/43360d54-6681-4571-9ed6-f1148d68bca0.png'},{id:1,path:'http://www.easyinto.cn/gamesIco/03deccd8-e186-4bd6-9523-1fd8a94079b6.png'}],
      gameInfo: [{"username": "张一明","gamename": "消灭星星","score": "200"}, {"username": "张二明","gamename": "跳天梯","score": "100"}, {"username": "张三明","gamename": "玛雅城市","score": "300"}, {"username": "张四明","gamename": "跳跳蛙","score": "50"}],
      gameList: [{
    "activeid":"1",
    "gamename": "消灭星星",
    "personnum": "10",
    "endtime": "2018/8/10 19:00:00",
    "begintime": "2018/8/10 19:00:00",
    "status": "0",
    "maxscore": "200分",
    "distance": "1.1",
    "shopname": "庐州太太",
    "logo": "images/lztt.jpg",
    "gameurl": "http://192.168.1.111/rudian-game/mygame/games/xmxx/"
  }, {
    "activeid":"2",
    "gamename": "跳天梯",
    "personnum": "20",
    "endtime": "2018/8/10 21:59:23",
    "begintime": "2018/8/10 19:00:00",
    "status": "0",
    "maxscore": "100分",
    "distance": "2.1",
    "shopname": "同庆楼",
    "logo": "images/tql.jpg",
    "gameurl": "http://192.168.1.111/rudian-game/mygame/games/xmxx/"
  }, {
    "activeid":"3",
    "gamename": "玛雅城市",
    "personnum": "30",
    "endtime": "2018/8/10 12:59:44",
    "begintime": "2018/8/10 19:00:00",
    "status": "1",
    "maxscore": "300心币",
    "distance": "3.1",
    "shopname": "外婆家",
    "logo": "images/wpj.jpg",
    "gameurl": "http://192.168.1.111/rudian-game/mygame/games/xmxx/"
  }, {
    "activeid":"5",
    "gamename": "跳跳蛙",
    "personnum": "5",
    "endtime": "2018/8/10 15:59:56",
    "begintime": "2018/8/10 19:00:00",
    "status": "2",
    "maxscore": "张三",
    "distance": "4.1",
    "shopname": "庐州太太",
    "logo": "images/lztt.jpg",
    "gameurl": "http://192.168.1.111/rudian-game/mygame/games/xmxx/"
  }]
    }
  },
  methods:{
    loadTop() {
      var _this = this;
      // 加载更多数据
      setTimeout(function(){
        _this.$refs.loadmore.onTopLoaded();
      },2000);
    },
    loadBottom() {
      var _this = this;
      // 加载更多数据
      //this.allLoaded = true;// 若数据已全部获取完毕
      setTimeout(function(){
        _this.$refs.loadmore.onBottomLoaded();
      },2000);
    }
  },
  mounted() {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../assets/index.css";

.mint-swipe{
  height: 3.48rem;
}

.mint-swipe-item{
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

</style>
