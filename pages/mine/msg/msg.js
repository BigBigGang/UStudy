const app = getApp();
const api = require('../../../utils/api.js');

Page({
  data: {
    width: app.systemInfo.windowWidth,
    height: app.systemInfo.windowHeight,
    showLoadMore: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
  that.getMsgList(false);
  },
  loadMore(event) {
    const that = this;
    that.setData({
      showLoadMore: true,
    })
  that.getMsgList(true);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  getMsgList(loadmore) {
    const that = this;
    wx.showNavigationBarLoading();
    let offset = 0;
    if (loadmore) {
      offset = that.data.msgs.length;
    }
    api.msgList({
      data: {
        limit: 10,
        offset: offset,
        toId: app.globalData.userInfo.pid,
      },
      success(res) {
        let temps = res.data;
        if (loadmore) {
          temps = that.data.msgs.concat(temps);
        }
        that.setData({
          msgs: temps,
        })
      },
      complete() {
        wx.hideNavigationBarLoading();
        that.setData({
          showLoadMore: false,
        })
      }
    })
  },

})