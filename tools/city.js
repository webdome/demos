/**
 * 三级联动
 */

// 获取省份列表
function getProList() {
  $.ajax({
    url: 'js/city.json',
    type: 'get',
    dataType: 'json',
    success: function(res) {
      // console.log(cityList);
      $('.map_pro,.map_cit,.map_are').empty();
      var documentFragment = "";
      $.each(res.data, function(i, pro) {
        documentFragment += '<option value="' + pro.id + '">' + pro.name + '</option>';
      });
      $('<option value="0">请选择省</option>').appendTo('.map_pro');
      $(documentFragment).appendTo('.map_pro');
      $('<option value="0">请选择市</option>').appendTo('.map_cit');
      $('<option value="0">请选择区</option>').appendTo('.map_are');
    },
    error: function(res) {
      console.log('错误数据');
    }
  });
}
// 根据省份获取对应城市列表
function findProCity(name) {
  $.ajax({
    url: 'js/city.json',
    type: 'get',
    dataType: 'json',
    success: function(res) {
      var documentFragment = "";
      $.each(res.data, function(i, pro) {
        if (pro.name == name) {
          $.each(pro.child, function(j, city) {
            documentFragment += '<option value="' + city.id + '">' + city.name + '</option>';
          });
        }
      });
      $('.map_cit').empty();
      $('<option value="0">请选择市</option>').appendTo('.map_cit');
      $(documentFragment).appendTo('.map_cit');
    },
    error: function(res) {
      console.log('错误数据');
    }
  });
}
// 根据城市获取对应区列表
function findCityArea(proname, cityname) {
  $.ajax({
    url: 'js/city.json',
    type: 'get',
    dataType: 'json',
    success: function(res) {
      var documentFragment = "";
      $.each(res.data, function(i, pro) {
        if (pro.name == proname) {
          $.each(pro.child, function(j, city) {
            if (city.name == cityname) {
              $.each(city.child, function(k, area) {
                documentFragment += '<option value="' + area.id + '">' + area.name + '</option>';
              });
            }
          });
        }
      });
      $('.map_are').empty();
      $('<option value="0">请选择区</option>').appendTo('.map_are');
      $(documentFragment).appendTo('.map_are');
    },
    error: function(res) {
      console.log('错误数据');
    }
  });
}