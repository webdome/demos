var sql = {
  getUserMsg: function(id) {
    return 'select * from user where id=' + id;
  },
  register: function(username, sex, age, email) {
    return 'insert into user(username,sex,age,email) values("' + username + '","' + sex + '","' + age + '","' + email + '")';
  }
};
module.exports = sql;