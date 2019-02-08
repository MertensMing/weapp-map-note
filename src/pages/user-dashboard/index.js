const app = getApp();
const userApi = require('../../api/user');

Page({
  data: {
    current: 'tab1',
    current_scroll: 'tab1',
    userInfo: null,
  },
  onShow() {
    app.login().then(() => {
      this.setData({
        userInfo: app.store.userData,
      });
    });
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  handleGetUserInfo(e) {
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '正在登录',
        mask: true,
      });
      userApi.setUserData(e.detail.userInfo)
        .then((res) => {
          this.setData({
            userInfo: res.toJSON(),
          });
          app.store.userData = res.toJSON();
        })
        .catch(e => console.error(e))
        .then(wx.hideLoading);
    }
  },
});