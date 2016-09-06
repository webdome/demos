window.onload=function(){
  var h = window.innerHeight;
  var w = window.innerWidth;
  var c = document.getElementById("target");
  c.setAttribute('width', w);
  c.setAttribute('height', h);
  var canvas = document.getElementById('target');
  var context = canvas.getContext('2d');
  var renderFrame = findRequestAnimationFrame();
  var objects = [];
//更新
  var updateScene = function() {
    objects.forEach(function(item) {
      if(item.tick) item.tick();
    });
  };
//绘制
  var drawScene = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    objects.forEach(function(item) {
      if(item.draw) item.draw(context);
    });
    context.restore();
  };
  var tick = function() {
    updateScene();
    drawScene();
    renderFrame(tick);
  };
  var wall = new Wall(0,0, w, h);  
  objects.push(wall);
  objects.push(new ObjectPool(wall, 10));
  tick();
}