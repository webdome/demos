var Util = {
  log: function(log) {
    console.log(log);
  },
  writeOut: function(query, res) {
    res.write(JSON.stringify(query));
    res.end();
  }
};

module.exports = Util;