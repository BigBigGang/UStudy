// pages/mine/admin/admin.js
const app = getApp();
const api = require('../../../utils/api.js');
Page({
  data: {

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    const that = this;
    wx.showNavigationBarLoading();
    api.getUnCheckPro({
      success(res) {
        that.setData({
          pros: res.data
        })

      },
      complete() {
        wx.hideNavigationBarLoading();
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

  agree(event) {
    const that = this;
    const dataset = event.currentTarget.dataset;
    const index = dataset.index;
 let datas = {
        pid: dataset.pid,
        openId: dataset.openid,
        stats: dataset.stats,
      };
    console.log(datas);
    wx.showNavigationBarLoading();
    api.checkPro({
      data: datas,
      success(res) {
        let temps = that.data.pros;
         temps.splice(index,1);
        that.setData({
          pros: temps
        })

      },
      complete() {
        wx.hideNavigationBarLoading();
      }
    })
  }
})