// This file is for crap not relevant to this discussion
 // var findRequestAnimationFrame = function() {
 //    return window.requestAnimationFrame        || 
 //      window.webkitRequestAnimationFrame  || 
 //      window.mozRequestAnimationFrame     || 
 //      window.oRequestAnimationFrame       || 
 //      window.msRequestAnimationFrame      ||
 //      function(callback, element){
 //        window.setTimeout(callback, 1000 / 30);
 //      };
 // };
 //墙对象
 // var Wall = function(x, y, width, height) {
 //   this.x = x;
 //   this.y = y;
 //   this.width = width;
 //   this.height = height;
 // };
 //绘制墙
 /*Wall.prototype = {
  draw: function(context) {
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + this.width, this.y);
    context.lineTo(this.x + this.width, this.y + this.height);
    context.lineTo(this.x, this.y + this.height);
    context.lineTo(this.x, this.y);
    context.stroke();
  }
 };*/
 //矩形精灵
 var Sprite = function(x, y, width, height, colour) {
   this.x = x;
   this.y = y;
   this.velx = Math.random() * 2.0 - 1.0;//随机的水平速度
   this.vely = Math.random() * 2.0 - 1.0;//随机垂直速度
   this.width = width;
   this.height = height;
   this.colour = colour;
 };
 Sprite.prototype = {
   tick: function() {//更新坐标
     this.x += this.velx;
     this.y += this.vely;
   },
   draw: function(context) {//绘矩形
     context.fillStyle = this.colour;
     context.fillRect(this.x, this.y, this.width, this.height);
   }
 };
 //对象池
 var ObjectPool = function(wall, numObjects) {
  this.objects = [];
  this.wall = wall;
  this.numObjects = numObjects;//池中对象的数目
  this.createObjects();//创建池中的对象
 };
 ObjectPool.prototype = {//对象池的原型
   createObjects: function() {
    for(var i = 0; i < this.numObjects; i++) {
      var width = Math.random() * 50.0 + 10.0;
      var height = Math.random() * 50.0 + 10.0;
      var x = this.wall.x + (Math.random() * (this.wall.width - width));
      var y = this.wall.y + (Math.random() * (this.wall.height - height));
      this.objects.push(new Sprite(x, y, width, height, '#000'));
    }
  },
  tick: function() {//更新池中对象并检查碰撞
    this.objects.forEach(function(item) {
      item.tick();
    });
    this.collide();
  },
  draw: function(context) {//绘制池中每一个对象
    this.objects.forEach(function(item) {
      item.draw(context);
    });
  },
  collide: function() {//碰撞检测
    for(var i =0; i < this.objects.length; i++){
      this.collideWalls(this.objects[i]);//是否与墙碰撞
      for(var j = i ; j < this.objects.length; j++) {
        var obj1 = this.objects[i];
        var obj2 = this.objects[j];
        this.collideObjects(obj1, obj2);//矩形精灵是否碰撞
      }
    }
  },
  collideObjects: function(one, two) {//两个矩形是否碰撞
    if(one.x + one.width < two.x)
      return;
    if(two.x + two.width < one.x)
      return;
    if(one.y + one.height < two.y)
      return;
    if(two.y + two.height < one.y)
      return;
    var tx = one.velx;//交换两者的速度
    var ty = one.vely;
    one.velx = two.velx;
    one.vely = two.vely;
    two.velx = tx;
    two.vely = ty;
  },
  collideWalls: function(obj) {//矩形精灵与墙是否碰撞
    if(obj.x < this.wall.x || obj.x + obj.width > this.wall.x + this.wall.width)
      obj.velx = -obj.velx;
    if(obj.y < this.wall.y || obj.y + obj.height > this.wall.y + this.wall.height)
      obj.vely = -obj.vely;
  }
};