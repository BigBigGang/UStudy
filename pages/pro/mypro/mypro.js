// pages/pro/mypro/mypro.js
const app = getApp();
const api = require('../../../utils/api.js');
Page({
  data: {
    width: app.systemInfo.windowWidth,
    height: app.systemInfo.windowHeight,
    showLoadMore: false,
    pid: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    const that = this;
    that.getProinfo();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
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
  //加载更多
  loadMore() {
    const that = this;
    if (that.data.showLoadMore) {
      return;
    } else {
      that.setData({
        showLoadMore: true,
      })
      that.getArtList(that.data.pid, true);
    }
  },
  //文章详情
  artInfo(event) {
    const that = this;
    const aid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../index/artinfo/artinfo?aid=' + aid,
    })
  },
  getProinfo() {
    const that = this;
    wx.showNavigationBarLoading();
    api.myProInfo({
      data: {
        openId: app.globalData.userInfo.openId,
      },
      success(res) {
        that.setData({
          proInfo: res.data,
          pid: res.data.pid,
        })
        that.getArtList(that.data.pid, false);
      },
      complete() {
        wx.hideNavigationBarLoading();
      }
    })
  },

  getArtList(pid, loadmore) {
    const that = this;
    wx.showNavigationBarLoading();
    let offset = 0;
    if (loadmore) {
      offset = that.data.arts.length;
    }
    api.artList({
      data: {
        limit: 10,
        offset: offset,
        self: '1',
        pid: pid,
      },
      success(res) {
        let temps = res.data;
        if (loadmore) {
          temps = that.data.arts.concat(temps);
        }
        that.setData({
          arts: temps,
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