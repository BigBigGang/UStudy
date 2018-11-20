const app = getApp();
const api = require('../../../utils/api.js');
var picker = require('../../../utils/picker_datetime.js');
Page({
  data: {
    fee: [
      { name: '否', value: 0, checked: 'true' },
      { name: '是', value: 1 },
    ],
    ballType: [
      { name: '足彩', value: 1, checked: 'true' },
      { name: '篮彩', value: 2 },
      // { name: '其他', value: 3 }
    ],
    gameType: [
      { name: '亚盘', value: 1, checked: 'true' },
      { name: '竞彩', value: 2 },
      { name: '专栏', value: 3 },
      // { name: '其他', value: 4 }
    ],
    isFree: true,
    haveGames: 1,
    pictures: [],
    showPictures: false,
    showAddPicture: true,
    price: 0,
    gameOne: '',
    oneTime: '',
    gameTwo: '',
    twoTime: '',
    freeContent: '',
    content: '',
    odds: 0,
    inputnotice: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      openId: app.globalData.userInfo.openId,
      pid: app.globalData.userInfo.pid,
    })
    this.datetimePicker = new picker.pickerDatetime({
      page: this,
      animation: 'slide',
      duration: 500
    });
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
  //切换选择
  changeRadio(event) {
    console.log('change')
    const that = this;
    const dataModel = event.currentTarget.dataset;
    if (dataModel.kind == 'fee') {
      let temps = that.changeItem(that.data.fee, dataModel.value);
      let isFree = false;
      for (let i = 0; i < temps.length; i++) {
        if (temps[i].value == 0 && temps[i].checked == 'true') {
          isFree = true;
        }
      }
      that.setData({
        isFree: isFree,
        fee: temps
      })
    } else if (dataModel.kind == 'ballType') {
      let temps = that.changeItem(that.data.ballType, dataModel.value);
      that.setData({
        ballType: temps
      })
    } else if (dataModel.kind == 'gameType') {
      let temps = that.changeItem(that.data.gameType, dataModel.value);
      let haveGames = 1;
      for (let i = 0; i < temps.length; i++) {
        if (temps[i].checked == 'true') {
          haveGames = i + 1;
        }
      }
      if (haveGames == 3) {
        let fee = that.data.fee;
        haveGames = 0;
        let isFree = true;
        fee[0].checked = 'true';
        fee[1].checked = '';
        that.setData({
          fee: fee,
          isFree: isFree,
        })
      }
      that.setData({
        gameType: temps,
        haveGames: haveGames
      })

    }
  },

  //添加图片
  addpicture(event) {
    const that = this;
    let count = 4 - that.data.pictures.length;
    wx.chooseImage({
      count: count, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res);
        let temps = that.data.pictures.concat(res.tempFilePaths);
        let showAddPicture = true;
        if (temps.length >= 4) {
          showAddPicture = false;
        };
        that.setData({
          pictures: temps,
          showAddPicture: showAddPicture,
        })
      },

    })
  },
  //显示图片
  showpictures(event) {
    const that = this;
    that.setData({
      showPictures: !that.data.showPictures
    })
  },
  //删除图片
  deletePicture(event) {
    const that = this;
    const id = event.currentTarget.dataset.id;
    let temps = that.data.pictures;
    temps.splice(id, 1);
    let showAddPicture = true;
    if (temps.length >= 4) {
      showAddPicture = false;
    };
    that.setData({
      pictures: temps,
      showAddPicture: showAddPicture
    })
  },
  //价格
  priceInput(event) {
    this.setData({
      price: event.detail.value
    })
  },
  //赛一
  gameOneInput(event) {
    this.setData({
      gameOne: event.detail.value
    })
  },
  //比赛一时间
  oneTime(event) {
    this.datetimePicker.setPicker('oneTime');
  },
  //赛二
  gameTwoInput(event) {
    this.setData({
      gameTwo: event.detail.value
    })
  },
  //比赛二时间
  twoTime(event) {
    this.datetimePicker.setPicker('twoTime');
  },
  //竞彩赔率
  oddsInput(event) {
    this.setData({
      odds: event.detail.value
    })
  },
  //概要
  freeContentInput(event) {
    this.setData({
      freeContent: event.detail.value
    })
  },
  //内容
  contentInput(event) {
    this.setData({
      content: event.detail.value
    })
  },
  //提交数据判断合规
  submit: function (event) {
    const that = this;
    const model = event.currentTarget.dataset;
    that.setData({
      inputnotice: '',
    })
    var datas = {
      openId: that.data.openId,
      pid: that.data.pid
    };
    let fee = that.data.fee;
    for (let i = 0; i < fee.length; i++) {
      if (fee[i].checked == 'true') {
        datas.needMoney = fee[i].value;
        if (fee[i].value == 1) {
          let price = parseFloat(that.data.price);
          if (price >= 8 && price <= 99) {
            datas.price = price;
          } else {
            that.setData({
              inputnotice: '填写金额不对',
            })
            return;
          }
        }
      }
    }
    let ballType = that.data.ballType;
    for (let i = 0; i < ballType.length; i++) {
      if (ballType[i].checked == 'true') {
        datas.ballType = ballType[i].value;
      }
    }
    let gameType = that.data.gameType;
    for (let i = 0; i < gameType.length; i++) {
      if (gameType[i].checked == 'true') {
        datas.gameType = gameType[i].value;
      }
    }
    if (that.data.haveGames > 0) {
      if (that.data.gameOne.length < 4) {
        that.setData({
          inputnotice: '赛事信息必须大于4个字',
        })
        return;
      } else {
        datas.gameOne = that.data.gameOne;
      }
      if (that.data.oneTime != '') {
        datas.oneTime = that.data.oneTime;
      } else {
        that.setData({
          inputnotice: '请选择比赛时间',
        })
        return;
      }
      if (that.data.haveGames == 2) {
        if (that.data.odds < 1.8) {
          that.setData({
            inputnotice: '竞彩赔率必须大于1.8',
          })
          return;
        } else {
          datas.odds = that.data.odds;
        }
        if (that.data.gameTwo.length < 4) {
          that.setData({
            inputnotice: '赛事信息必须大于4个字',
          })
          return;
        } else {
          datas.gameTwo = that.data.gameTwo;
        }
        if (that.data.twoTime != '') {
          datas.twoTime = that.data.twoTime;
        } else {
          that.setData({
            inputnotice: '请选择比赛时间',
          })
          return;
        }
      }
    }
    if (!that.data.isFree) {
      if (that.data.freeContent.length < 10) {
        that.setData({
          inputnotice: '文章摘要必须大于10个字',
        })
        return;
      } else {
        datas.freeContent = that.data.freeContent;
      }
    }
    if (that.data.content.length < 10) {
      that.setData({
        inputnotice: '文章摘要必须大于10个字',
      })
      return;
    } else {
      datas.content = that.data.content;
    }
    wx.showToast({
      title: '上传数据...',
      icon: 'loading',
      duration: 6000,
    })
    if (that.data.pictures.length == 0) {
      that.addArt(datas);
    } else {
      datas.picture = '';
      that.uploadPic(datas, that.data.pictures, 0);
    }
  },
  //上传图片
  uploadPic(datas, pictures, index) {
    const that = this;
    api.upload({
      filePath: pictures[index],
      name: 'picture',
      success(res) {

        if (index < (pictures.length - 1)) {
          datas.picture += res + ',';
          that.uploadPic(datas, pictures, ++index);
        } else {
          datas.picture += res;
          that.addArt(datas);
        }
      },
      fail() {
        that.addArt(datas);
      },
    })
  },

  //发布
  addArt(datas) {
    const that = this;
    api.addart({
      data: datas,
      success(res) {
        wx.hideToast();
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000,
        });
        setTimeout(function () {
          wx.hideToast();
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        }, 1000)
      },
      fail(status,msg) {
        wx.hideToast();
        that.setData({
          inputnotice: '发布失败：'+msg,
        })
      },
      complete() {

      }
    })
  },
  //改变单选按钮状态
  changeItem(temps, value) {
    temps.map((temp) => {
      const item = temp;
      if (item.value == value) {
        item.checked = 'true';
      } else {
        item.checked = '';
      }
      return item;
    });
    return temps;
  }
})