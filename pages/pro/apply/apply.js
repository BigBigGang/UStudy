const app = getApp();
const api = require('../../../utils/api.js');
Page({
  data: {
    name: '',
    phone: '',
    wechat: '',
    brief: '',
    notice: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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

  bindNameInput(event) {
    this.setData({
      name: event.detail.value
    })
  },

  bindPhoneInput(event) {
    this.setData({
      phone: event.detail.value
    })
  },

  bindWechatInput(event) {
    this.setData({
      wechat: event.detail.value
    })
  },
  bindBriefInput(event) {
    this.setData({
      brief: event.detail.value
    })
  },
  saveInfo(event) {
    console.log('save');
    const that = this;
    if (that.data.name == '') {
      that.setData({
        notice: '*请输入名字'
      })
      return;
    }
    if (that.data.phone == '') {
      that.setData({
        notice: '*请输入手机号'
      })
      return;
    }
    if (that.data.phone.length != 11) {
      that.setData({
        notice: '*手机号不对'
      })
      return;
    }
    if (that.data.brief == '') {
      that.setData({
        notice: '*请输入简介'
      })
      return;
    }
    if (that.data.brief.length < 10) {
      that.setData({
        notice: '*简介必须在10-140字内'
      })
      return;
    }
    that.setData({
      notice: ''
    })
    wx.showToast({
      title: '提交中...',
      icon: 'loading',
      duration: 1500,
    })
    api.applyPro({
      data: {
        openId: app.globalData.userInfo.openId,
        name: that.data.name,
        phone: that.data.phone,
        brief: that.data.brief,
        wechat: that.data.wechat
      },
      success(res) {
        app.globalData.userInfo.isProfessor = '2';
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 3000,
          complete() {
            wx.navigateBack({
              delta: 2, // 回退前 delta(默认为1) 页面
            })
          }
        })
      },
      fail() {
        wx.showToast({
          title: '提交失败',
          icon: 'success',
          duration: 3000,
          complete() {
            wx.navigateBack({
              delta: 2, // 回退前 delta(默认为1) 页面
            })
          }
        })
      },
      complete() {

      }
    })
  },

})