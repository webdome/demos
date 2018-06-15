// 创建地图实例
var map = new BMap.Map("map");
// 创建中心点
var point = new BMap.Point(117.28, 31.86);
map.centerAndZoom(point, 12);
//启用滚轮放大缩小 启用地图惯性拖拽
map.enableScrollWheelZoom();
map.enableContinuousZoom();
// 定位 PC定位会不准确
var currentPosition = {};
var targetPosition = {};
$('#location').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  // 浏览器定位
  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition(function(res) {
    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      console.log(res);
      var marker = new BMap.Marker(res.point);
      map.addOverlay(marker);
      map.panTo(res.point);
      marker.enableDragging();
      console.log('您的位置：' + res.point.lng + ',' + res.point.lat);
      currentPosition.lng = res.point.lng;
      currentPosition.lat = res.point.lat;
    } else {
      console.log('failed:' + this.getStatus());
    }
  }, {
    enableHighAccuracy: true // 启用高精度
  });
  // ip定位
  /*function myFun(res){
    var marker = new BMap.Marker(res.point);
    map.addOverlay(marker);
    map.panTo(res.point);
    marker.enableDragging();
    console.log('您的位置：' + res.point.lng + ',' + res.point.lat);
    currentPosition.lng = res.point.lng;
    currentPosition.lat = res.point.lat;
  }
  var myCity = new BMap.LocalCity();
  myCity.get(myFun);*/
  // 经纬度定位
  /*if (document.getElementById("longitude").value != "" && document.getElementById("latitude").value != "") {
    map.clearOverlays();
    var new_point = new BMap.Point(document.getElementById("longitude").value, document.getElementById("latitude").value);
    var marker = new BMap.Marker(new_point); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    map.panTo(new_point);
  }*/
});
// 搜索
$('#searchbtn').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  var msg = $('#search').val();
  var options = {
    renderOptions: {
      map: map,
      panel: "results"
    },
    onSearchComplete: function(results) {
      // 判断状态是否正确
      if (local.getStatus() == BMAP_STATUS_SUCCESS) {
        for (var i = 0; i < results.getCurrentNumPois(); i++) {
          var marker = results.getPoi(i);
          console.log(marker);
          // marker.addEventListener("click",function(e){
          //   e.stopPropagation();
          // });
        }
      }
    }
  };
  var local = new BMap.LocalSearch(map, options);
  local.search(msg);
});
// 获取所有标注点
// var allOverlay = map.getOverlays();
// 点击选点
var clickPoint;
map.addEventListener("click", function(e) {
  // $('#msg').html("点击的位置是" + "<hr>" + e.point.lng + "<hr>" + e.point.lat);
  targetPosition.lng = e.point.lng;
  targetPosition.lat = e.point.lat;
  if (clickPoint) {
    clickPoint.remove();
  }
  clickPoint = new BMap.Marker(e.point);
  map.addOverlay(clickPoint);
});

// 公交换乘
$('#bus').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  var p1 = new BMap.Point(currentPosition.lng, currentPosition.lat);
  var p2 = new BMap.Point(targetPosition.lng, targetPosition.lat);
  map.clearOverlays();
  var transit = new BMap.TransitRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: true,
      panel: "results"
    }
  });
  transit.search(p1, p2);
});
// 驾车导航
//三种驾车策略：最少时间，最短距离，避开高速
var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
$('#car').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  map.clearOverlays();
  var p1 = new BMap.Point(currentPosition.lng, currentPosition.lat);
  var p2 = new BMap.Point(targetPosition.lng, targetPosition.lat);
  var driving = new BMap.DrivingRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: true,
      panel: "results",
      policy: routePolicy[0]
    }
  });
  driving.search(p1, p2);
});
// 步行导航
$('#walk').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  map.clearOverlays();
  var p1 = new BMap.Point(currentPosition.lng, currentPosition.lat);
  var p2 = new BMap.Point(targetPosition.lng, targetPosition.lat);
  var walking = new BMap.WalkingRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: true,
      panel: "results",
    }
  });
  walking.search(p1, p2);
});
// 路况信息
$('#traffic').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  var ctrl = new BMapLib.TrafficControl({
    showPanel: false //是否显示路况提示面板
  });
  map.addControl(ctrl);
  ctrl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);
});
// 地址解析
$('#geocoder').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  // 创建地址解析器实例
  var myGeo = new BMap.Geocoder();
  // 获取输入的地址
  var address = $('#address').val();
  // 将地址解析结果显示在地图上,并调整地图视野
  myGeo.getPoint(address, function(point) {
    if (point) {
      map.clearOverlays();
      map.centerAndZoom(point, 16);
      map.addOverlay(new BMap.Marker(point));
    } else {
      alert("您选择地址没有解析到结果!");
    }
  });
});
// 关键字提示输入
function G(id) {
  return document.getElementById(id);
}

var ac = new BMap.Autocomplete( //建立一个自动完成的对象
  {
    "input": "suggestId",
    "location": map
  });

ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
  var str = "";
  var _value = e.fromitem.value;
  var value = "";
  if (e.fromitem.index > -1) {
    value = _value.province + _value.city + _value.district + _value.street + _value.business;
  }
  str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

  value = "";
  if (e.toitem.index > -1) {
    _value = e.toitem.value;
    value = _value.province + _value.city + _value.district + _value.street + _value.business;
  }
  str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
  G("searchResultPanel").innerHTML = str;
});

var myValue;
ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
  var _value = e.item.value;
  myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
  G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

  setPlace();
});

function setPlace() {
  map.clearOverlays(); //清除地图上所有覆盖物
  function myFun() {
    var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
    map.centerAndZoom(pp, 18);
    map.addOverlay(new BMap.Marker(pp)); //添加标注
  }
  var local = new BMap.LocalSearch(map, { //智能搜索
    onSearchComplete: myFun
  });
  local.search(myValue);
}
// 坐标转换
$('#transform').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  //谷歌坐标
  var googlelongitude = $('#googlelongitude').val();
  var googlelatitude = $('#googlelatitude').val();
  var ggPoint = new BMap.Point(googlelongitude, googlelatitude);
  var convertor = new BMap.Convertor();
  var pointArr = [];
  pointArr.push(ggPoint);
  convertor.translate(pointArr, 3, 5, translateCallback)
});
//坐标转换完之后的回调函数
function translateCallback(res) {
  if (res.status === 0) {
    map.clearOverlays();
    var marker = new BMap.Marker(res.points[0]);
    map.addOverlay(marker);
    var label = new BMap.Label("转换后的百度标注（正确）", {
      offset: new BMap.Size(20, -10)
    });
    marker.setLabel(label); //添加百度label
    map.setCenter(res.points[0]);
  }
}
// 鼠标测距
$('#mouse').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  var myDis = new BMapLib.DistanceTool(map);
  myDis.open(); //开启鼠标测距
  //myDis.close();  //关闭鼠标测距大
});