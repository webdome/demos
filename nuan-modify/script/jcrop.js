var jcrop_api, x, y, w, h;
$('#target').Jcrop({
  onChange: showCoords,
  onSelect: showCoords,
}, function() {
  jcrop_api = this;
  jcrop_api.animateTo([100, 100, 400, 300]);
});

function showCoords(c) {
  x = c.x;
  y = c.y;
  w = c.w;
  h = c.h;
};


