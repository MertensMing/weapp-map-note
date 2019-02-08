module.exports = function () {
  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success(res) {
        resolve(res);
      },
      fail() {
        reject();
      },
    });
  })
  .catch(() => {
    wx.showModal({
      content: '允许地图收藏夹打开微信地图',
      success(res) {
        if (res.confirm) {
          wx.openSetting();
        }
      }
    });
  });
}
