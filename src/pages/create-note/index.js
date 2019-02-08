const app = getApp();
const collectionApi = require('../../api/collection');
const chooseLocation = require('../../utils/choose-location');
const _ = require('../../lib/underscore-min');
const { $Toast } = require('../../lib/iview/base/index');

Page({
  data: {
    userInfo: null,
    model: null,
  },
  onLoad(query) {
    this.setData({
      id: '',
    });
    if (query.id) {
      wx.setNavigationBarTitle({
        title: '编辑收藏点',
      });
      this.setData({
        id: query.id,
      });
      collectionApi.getCollection({ id: query.id })
        .then(data => {
          this.setModel(data);
        });
    }
  },
  onShow() {
    app.login().then(() => {
      this.setData({
        userInfo: app.store.userData,
      });
    });
  },
  setModel(data) {
    this.setData({
      model: _.extend({}, this.data.model || {}, data),
    });
  },
  handleChooseLocation() {
    chooseLocation().then(res => {
      const {
        address,
        latitude,
        longitude,
        name,
      } = res;
      const locationName = name;
      this.setModel({
        address,
        latitude,
        longitude,
        locationName,
      });
    });
  },
  handleFieldChange(e) {
    const { name } = e.target.dataset;
    const { value } = e.detail;
    this.setModel({ [name]: value });
  },
  handleRemarkChange(e) {
    const { name } = e.target.dataset;
    const { value } = e.detail.detail;
    this.setModel({ [name]: value });
  },
  handleConfirm() {
    const { model } = this.data;
    if (!model) {
      return;
    }
    if (!model.locationName) {
      $Toast({ content: '请填写收藏点名称' });
      return;
    }
    if (!model.latitude) {
      $Toast({ content: '请选择地址' });
      return;
    }
    this.setData({
      submiting: true,
    });
    if (this.data.id) {
      this.updateCollection();
    } else {
      this.createCollection();
    }
  },
  updateCollection() {
    collectionApi.updateCollection({
      id: this.data.id,
      data: this.data.model,
    })
      .then(() => {
        wx.navigateBack({
          delta: 1
        });
      })
      .catch(e => console.error(e))
      .then(() => {
        this.setData({
          submiting: false,
        });
      });
  },
  createCollection() {
    collectionApi.createCollection(this.data.model)
      .then(() => {
        wx.navigateBack({
          delta: 1
        });
      })
      .catch(e => console.error(e))
      .then(() => {
        this.setData({
          submiting: false,
        });
      });
  }
});