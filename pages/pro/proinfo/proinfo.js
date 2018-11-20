// pages/pro/proinfo/proinfo.js
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
    that.setData({
      pid: options.pid,
    })
    that.getProinfo(options.pid);
    that.getArtList(options.pid, false);
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
  changeAtten(event) {
    const that = this;
    const atten = event.currentTarget.dataset.id;
    if (atten == '') {
      that.addAttention(that.data.pid);
    } else {
      that.cancelAttention(atten);
    }
  },
  getProinfo(pid) {
    const that = this;

    api.proInfo({
      data: {
        openId: app.globalData.userInfo.openId,
        pid: pid,
      },
      success(res) {
        that.setData({
          proInfo: res.data,
        })
      },
      complete() {

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
        pid: pid,
      },
      success(res) {
        let temps = res.data;
        temps.map((temp) => {
          const art = temp;
          let gameMsg = '';
          if (art.gameType == '1') {
            gameMsg = '亚盘';
          } else if (art.gameType == '2') {
            gameMsg = '竞赛';
          } else if (art.gameType == '3') {
            gameMsg = '专栏';
          } else {
            gameMsg = '其他';
          }
          art.gameMsg = gameMsg;
          return art;
        })
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



  addAttention(pid) {
    const that = this;
    wx.showNavigationBarLoading();
    api.addAttention({
      data: {
        openId: app.globalData.userInfo.openId,
        pid: pid
      },

      success(res) {
        console.log('id:' + res.data);
        let pro = that.data.proInfo;
        pro.attention = res.data;
        that.setData({
          proInfo: pro,
        })
      },
      complete() {
        wx.hideNavigationBarLoading();
      }
    })
  },

  cancelAttention(attentionid) {
    const that = this;
    wx.showNavigationBarLoading();
    api.cancelAttention({
      data: {
        openId: app.globalData.userInfo.openId,
        attentionId: attentionid
      },

      success(res) {
        let pro = that.data.proInfo;
        pro.attention = '';
        that.setData({
          proInfo: pro,
        })
      },
      complete() {
        wx.hideNavigationBarLoading();
      }
    })
  },


})