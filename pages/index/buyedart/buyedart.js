const app = getApp();
const api = require('../../../utils/api.js');

Page({
  data: {
    width: app.systemInfo.windowWidth,
    height: app.systemInfo.windowHeight,
    showLoadMore: false,
    isCollect: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    const that = this;
    that.setData({
      isCollect:options.collect,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
    if(that.data.isCollect == '1'){
  that.getCollectList(false);
  wx.setNavigationBarTitle({
    title: '已收藏',
  })
}else{
  that.getBuyed(false);
    wx.setNavigationBarTitle({
    title: '已购买',
  })
}
   
  },
  loadMore(event) {
    const that = this;
    that.setData({
      showLoadMore: true,
    })
if(that.data.isCollect == '1'){
  that.getCollectList(true);
}else{
  that.getBuyed(true);
}
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

  //文章详情
  artinfo(event){
const that = this;
const aid = event.currentTarget.dataset.id;
wx.navigateTo({
  url: '../artinfo/artinfo?aid='+aid,
})
  },

//收藏列表
  getCollectList(loadmore) {
    const that = this;
    wx.showNavigationBarLoading();
    let offset = 0;
    if (loadmore) {
      offset = that.data.arts.length;
    }
    api.collectlist({
      data: {
        limit: 10,
        offset: offset,
        openId: app.globalData.userInfo.openId,
      },
      success(res) {
        let temps = res.data;
        temps.map((temp) => {
          const model = temp;
          let art = model.art;
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
          let ballMsg = '';
          if (art.ballType == '1') {
            ballMsg = '足球';
          } else if (art.ballType == '2') {
            ballMsg = '篮球';
          } else {
            ballMsg = '其他';
          }
          art.gameMsg = gameMsg;
          art.ballMsg = ballMsg;
          model.art = art;
          return model;
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


//已购买
  getBuyed(loadmore) {
    const that = this;
    wx.showNavigationBarLoading();
    let offset = 0;
    if (loadmore) {
      offset = that.data.arts.length;
    }
    api.buyed({
      data: {
        limit: 10,
        offset: offset,
        openId: app.globalData.userInfo.openId,
      },
      success(res) {
        let temps = res.data;
        temps.map((temp) => {
          const model = temp;
          let art = model.art;
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
          let ballMsg = '';
          if (art.ballType == '1') {
            ballMsg = '足球';
          } else if (art.ballType == '2') {
            ballMsg = '篮球';
          } else {
            ballMsg = '其他';
          }
          art.gameMsg = gameMsg;
          art.ballMsg = ballMsg;
          model.art = art;
          return model;
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
})