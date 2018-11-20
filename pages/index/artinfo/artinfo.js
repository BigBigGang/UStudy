// pages/index/artinfo/artinfo.js
const app = getApp();
const api = require('../../../utils/api.js');
Page({
    data: {
art:'',

    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        // console.log(options);
        const that = this;
        that.artinfo(options.aid);
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
    //专家详情
    proInfo(event) {
        const that = this;
        const pid = event.currentTarget.dataset.id;
wx.navigateTo({
  url: '../../pro/proinfo/proinfo?pid='+pid,
})
    },
    //改变关注
    changeAtten(event) {
        const that = this;
        const atten = event.currentTarget.dataset.atten;
        if (atten == '') {
            that.addAttention(that.data.art.pid);
        } else {
            that.cancelAttention(atten);
        }
    },
    //改变收藏
    changeCollect(event) {
        const that = this;
        const id = event.currentTarget.dataset.id;
        if (id == '') {
            that.addCollect(that.data.art.aid);
        } else {
            that.cancelcollect(id);
        }
    },
    //改变点赞
    changePraise(event) {
        const that = this;
        const id = event.currentTarget.dataset.id;
        if (id == '') {
            that.addPraise(that.data.art.aid);
        }
    },
    //浏览图片
    scanPicture(event) {
        const that = this;
        const id = event.currentTarget.dataset.id;
        wx.previewImage({
            current: that.data.art.pictures[id], // 当前显示图片的链接，不填则默认为 urls 的第一张
            urls: that.data.art.pictures,
        })
    },
    //购买文章
    goBuy(event) {
        const that = this;
        that.addOrder();
    },
    //文章
    artinfo(aid) {
        const that = this;
        // wx.showToast({
        //     title:'加载中...',
        //     icon:'loading',
        //     duration:1500,
        // })
        // wx.showNavigationBarLoading();
        api.artinfo({
            data: {
                aid: aid,
                openId: app.globalData.userInfo.openId,
            },
            success(res) {
                let art = res.data;
                if (art.gameType == '1') {
                    art.gameType = '亚盘';
                } else if (art.gameType == '2') {
                    art.gameType = '竞赛';
                } else if (art.gameType == '3') {
                    art.gameType = '专栏';
                } else {
                    art.gameType = '其他';
                }
                if (art.picture) {
                    let pictures = art.picture.split(',');
                    for (let i = 0; i < pictures.length; i++) {
                        pictures[i] = `${app.baseUrl}/uploads/picture/${pictures[i]}`;
                    }
                    art.pictures = pictures;
                }
                console.log(art);
                that.setData({
                    art: art,
                })
            },
            complete() {
                wx.hideNavigationBarLoading();
                wx.hideToast();
            }
        })
    },
    //添加订单
    addOrder() {
        const that = this;
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 1500,
        })
        api.buy({
            data: {
                aid: that.data.art.aid,
                openId: app.globalData.userInfo.openId,
                pid: that.data.art.pid,
                price: that.data.art.price,
                nickName: app.globalData.userInfo.nickName,
            },
            success(res) {
                let art = that.data.art;
                art.seeAll = '1';
                that.setData({
                    art: art,
                })
            },
            fail() {

            },
            complete() {
                wx.hideToast();
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
                let temps = that.data.art;
                temps.pro.attention = res.data;
                that.setData({
                    art: temps,
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
                let temps = that.data.art;
                temps.pro.attention = '';
                that.setData({
                    art: temps,
                })
            },
            complete() {
                wx.hideNavigationBarLoading();
            }
        })
    },

    addCollect(aid) {
        const that = this;
        wx.showNavigationBarLoading();
        api.addcollect({
            data: {
                openId: app.globalData.userInfo.openId,
                aid: aid
            },

            success(res) {
                console.log('id:' + res.data);
                let temps = that.data.art;
                temps.collectId = res.data;
                that.setData({
                    art: temps,
                })
            },
            complete() {
                wx.hideNavigationBarLoading();
            }
        })
    },

    cancelcollect(id) {
        const that = this;
        wx.showNavigationBarLoading();
        api.cancelcollect({
            data: {
                openId: app.globalData.userInfo.openId,
                collectId: id
            },

            success(res) {
                let temps = that.data.art;
                temps.collectId = '';
                that.setData({
                    art: temps,
                })
            },
            complete() {
                wx.hideNavigationBarLoading();
            }
        })
    },

    addPraise(aid) {
        const that = this;
        wx.showNavigationBarLoading();
        api.addPraise({
            data: {
                openId: app.globalData.userInfo.openId,
                aid: aid
            },

            success(res) {
                console.log('id:' + res.data);
                let temps = that.data.art;
                temps.praiseId = '11';
                temps.praiseCount = temps.praiseCount + 1;
                that.setData({
                    art: temps,
                })
            },
            complete() {
                wx.hideNavigationBarLoading();
            }
        })
    },


})