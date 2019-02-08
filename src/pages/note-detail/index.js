const app = getApp();
const collectionApi = require('../../api/collection');
const AV = require('../../lib/av-weapp-min');
const _ = require('../../lib/underscore-min');
const { $Toast } = require('../../lib/iview/base/index');

Page({
  data: {
    collection: null,
    optVisible: false,
    actions: [
      {
        name: '取消收藏',
        color: '#ed3f14'
      }
    ],
    optActions: [
      {
        name: '分享',
        openType: 'share',
      },
      {
        name: '返回首页',
      },
      {
        name: '编辑',
      },
    ],
    optActions2: [
      {
        name: '分享',
        openType: 'share',
      },
      {
        name: '返回首页',
      },
    ],
  },
  onShareAppMessage() {
    if (!this.data.collection) return false;
    return {
      title: `${this.data.collection.locationName}`,
      path: `/pages/note-detail/index?id=${this.data.id}`,
    };
  },
  onLoad(query) {
    this.setData({
      id: '',
    });
    if (query.id) {
      this.setData({
        id: query.id,
      });
    }
  },
  onShow() {
    app.login().then(() => {
      this.setData({
        userInfo: app.store.userData,
      });
      this.getDetail();
    });
  },
  getDetail() {
    if (this.data.id) {
      wx.showNavigationBarLoading();
      collectionApi.getCollection({ id: this.data.id })
        .then(data => {
          const user = AV.User.current();
          const like = !!_.find(data.subscriber, item => item.objectId === user.id);
          const isCreator = user.id === data.creator.objectId;
          _.defaults(data, {
            remark: '',
          });
          data.remark = data.remark.split('\n')
          this.setData({
            collection: data,
            like,
            isCreator,
          });
        })
        .catch(e => console.error(e))
        .then(wx.hideNavigationBarLoading);
    }
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  toEdit() {
    wx.navigateTo({
      url: `/pages/create-note/index?id=${this.data.id}`
    });
  },
  openLocation() {
    const { collection } = this.data;
    if (!collection) return;
    wx.openLocation({
      latitude: collection.latitude,
      longitude: collection.longitude,
      scale: 12,
      name: collection.locationName,
      address: collection.address,
    });
  },
  openIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  showActionSheet() {
    this.setData({
      actionSheetShow: true,
    });
  },
  showOptActionSheet() {
    this.setData({
      optVisible: true,
    });
  },
  handleOptCancel() {
    this.setData({
      optVisible: false,
    });
  },
  handleCancel() {
    this.setData({
      actionSheetShow: false,
    });
  },
  handleOptCLick(e) {
    if (e.detail.index === 0) {
      this.setData({
        optVisible: false
      });
    }
    if (e.detail.index === 1) {
      this.openIndex();
    }
    if (e.detail.index === 2) {
      this.handleOptCancel();
      this.toEdit();
    }
  },
  handleClickItem() {
    const action = [...this.data.actions];
    action[0].loading = true;

    this.setData({
      actions: action
    });

    collectionApi.unsubscribe({ id: this.data.id })
      .then(() => {
        action[0].loading = false;
        this.setData({
          actionSheetShow: false,
          actions: action
        });
        $Toast({
          content: '已取消',
        });
        this.getDetail();
      });
  },
  subscribe() {
    collectionApi.subscribe({ id: this.data.id })
      .then(() => {
        $Toast({
          content: '已收藏',
          type: 'success'
        });
        this.getDetail();
      });
  },
  handleCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.collection.phone
    });
  }
});