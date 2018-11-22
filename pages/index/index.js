//index.js
//获取应用实例
const app = getApp();
const api = require('../../utils/api.js');
Page({
  data: {
    width: app.systemInfo.windowWidth,
    height: app.systemInfo.windowHeight,
    pixelRatio: app.systemInfo.pixelRatio,
    gameType: '',
    ballType: '',
    arts: [],
    tops: [],
    showMore: false,
    motto: 'Hello World',
    userInfo: {},
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log('user:' + userInfo.nickName)
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      that.goLogin();
      that.getList(true);
    });
  },
  onPullDownRefresh: function () {
    // this.getList(true);
  },

  //gameType切换
  navbtn(event) {
    const that = this;
    const id = event.currentTarget.dataset.id;
    if (id == that.data.gameType) {
      return;
    }
    let ballType = '1';
    if (id == '') {
      ballType = '';
    }
    that.setData({
      gameType: id,
      ballType: ballType,
    })
    that.getList(true);
  },
  //ballType切换
  ballBtn(event) {
    const that = this;
    const id = event.currentTarget.dataset.id;
    if (id == that.data.ballType) {
      return;
    }
    that.setData({
      ballType: id,
    })
    that.getList(true);
  },
  //加载更多
  loadMoreList() {
    // console.log('more');
    // const that = this;
    // if (that.data.showMore) {
    //   return;
    // }
    // that.setData({
    //   showMore: true,
    // })
    // that.getList(false);
  },
  //文章详情
  artinfo(event){
const that = this;
const aid = event.currentTarget.dataset.id;
wx.navigateTo({
  url: 'artinfo/artinfo?aid='+aid,
})
  },
  goLogin() {
    const that = this;
    api.login({
      data: {
        // openId: 10001,
        // avatarUrl: that.data.userInfo.avatarUrl,
        // city: that.data.userInfo.city,
        // gender: that.data.userInfo.gender,
        // nickName: that.data.userInfo.nickName,
        // province: that.data.userInfo.province,
        openId: app.globalData.userInfo.openId,
        avatarUrl: that.data.userInfo.avatarUrl,
        nickName: that.data.userInfo.nickName,
      },
      success(res) {
        console.log(res);
      },
      complete() {

      }
    })
  },

  //加载数据
  getList(refresh) {
    const that = this;
    var offset = 0;
    if (refresh) {
      offset = 0;
      if(that.data.gameType == ''){
        that.getTops();
      }
    } else {
      offset = that.data.arts.length;
    }
    var datas = {
      limit: 10,
      offset: offset,
    }
    if (that.data.gameType != '') {
      datas.gameType = that.data.gameType;
    }
    if (that.data.ballType != '') {
      datas.ballType = that.data.ballType;
    }
    // wx.showNavigationBarLoading();
    api.artList({
      data: datas,
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
          return art;
        })
        if (!refresh) {
          temps = that.data.arts.concat(temps);
        }
        that.setData({
          arts: temps,
        })
      },
      complete() {
        wx.hideNavigationBarLoading();
        that.setData({
          showMore: false,
        })
      }
    })
  },

//获取置顶文章
  getTops() {
    const that = this;
    api.artList({
      data: {
        top: 1,
      },
      success(res) {
        that.setData({
          tops: res.data,
        })
      },
      complete() {
      }
    })
  }
})
