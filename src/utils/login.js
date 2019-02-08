const userApi = require('../api/user');

// 用户登录，将用户信息注入到 app.store
module.exports = function(app) {
  wx.showLoading({ title: '正在登录' });
  return userApi.login()
    .then(data => {
      const userData = data.toJSON();
      app.store.userData = userData;
    })
    .catch(e => console.error(e))
    .then(wx.hideLoading);
};
