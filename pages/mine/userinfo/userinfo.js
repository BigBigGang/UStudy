const app = getApp();
const api = require('../../../utils/api.js');
Page({
  data: {
    loading: false,
    canApply: true,
    notice: '',
    admin: '',
  },

  onLoad: function () {
    const that = this;
    that.setData({
      userInfo: app.globalData.userInfo,
      nickName: app.globalData.userInfo.nickName,
      phone: app.globalData.userInfo.phone,
      avatarUrl: app.globalData.userInfo.avatarUrl,
    });
    if (app.globalData.userInfo.uid == 1000) {
      that.setData({
        admin: '1000'
      })

    }
    if (app.globalData.userInfo.isProfessor == 1 || app.globalData.userInfo.isProfessor == 2) {
      that.setData({
        canApply: false
      })
    }
    // console.log(that.data.userInfo);
  },

  //修改头像
  getAvatar(event) {
    const that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        // console.log(res.tempFilePaths);
        var files = res.tempFilePaths;
        api.upload({
          filePath: files[0],
          name: 'avatar',
          success(res) {
            if (res) {
              let img = `${app.baseUrl}/uploads/avatar/${res}`;
              that.setData({
                avatarUrl: img,
              })
            }
          },
          fail() {

          },
          complete() {

          }
        })
      },
    })

  },
  //修改昵称
  bindNameInput(event) {
    this.setData({
      nickName: event.detail.value
    })
  },
  //修改手机号
  bindPhoneInput(event) {
    this.setData({
      phone: event.detail.value
    })
  },
  //保存
  saveInfo(event) {
    // console.log('save');
    const that = this;
    if (that.data.nickName == '') {
      that.setData({
        notice: '*请输入昵称'
      })
      return;
    }
    let user = {
      nickName: that.data.nickName,
    }
    if (that.data.avatarUrl) {
      user.avatarUrl = that.data.avatarUrl;
    }
    if (that.data.phone) {
      if (that.data.phone.length != 11) {
        that.setData({
          notice: '*手机号格式不对'
        })
        return;
      }
      user.phone = that.data.phone;
    }
    // console.log(user);
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1000
    })
    api.updateUserinfo({
      data: {
        openId: app.globalData.userInfo.openId,
        user: user
      },
      success(res) {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      },
      complete() {
        wx.hideToast();
      }
    })
  },
  //申请成为分析师
  applypro(event) {
    // console.log('apply');
    wx.navigateTo({
      url: '../../pro/apply/apply',
    })
  },
  admin(event){
     wx.navigateTo({
      url: '../admin/admin',
    })
  }
})