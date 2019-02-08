const collectionApi = require('../../api/collection');

Page({
  data: {
    collectionList: [],
    classNames: [
      'info',
      'success',
      'warning',
      'error',
    ]
  },
  onShow() {
    this.getList();
  },
  onPullDownRefresh() {
    this.getList();
    wx.stopPullDownRefresh();
  },
  goToCreate() {
    wx.navigateTo({
      url: '/pages/create-note/index',
    });
  },
  handleChange({ detail }) {
    this.setData({
      currentTab: detail.key
    });
  },
  getList() {
    collectionApi.getCollectionList()
      .then(list => {
        this.setData({
          collectionList: list,
        });
      });
  }
});