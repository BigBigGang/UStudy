const app = getApp();
const api = require('../../utils/api.js');
Page({
    data: {
        first: true,
        haveMsg: false,
        pid:'',
    },

    onLoad: function () {
        this.getUserinfo();
    },

    onShow: function () {
        console.log('onShow')
        const that = this;
        if (that.data.first) {
            that.setData({
                first: false,
            })
        } else {
            that.setData({
                 haveMsg: false,
            })
            this.getUserinfo();
        }
    },
    getUserinfo() {
        const that = this;
        // wx.showToast({
        //     title: '加载中...',
        //     icon: 'loading',
        //     duration: 2000
        // });
        // wx.showNavigationBarLoading();
        api.userInfo({
            data: {
                openId: app.globalData.userInfo.openId,
            },
            success(res) {
                console.log(res);
                that.setData({
                    userInfo: res.data,
                    pid:res.data.pid
                })
                app.globalData.userInfo = res.data;
                if (that.data.userInfo.isProfessor == '1') {
                    that.getUnSeeMsg(that.data.userInfo.pid);
                }
            },
            complete() {
                // wx.hideToast();
                wx.hideNavigationBarLoading();
            }
        })
    },
    //用户信息
    userinfo(event) {
        wx.navigateTo({
            url: 'userinfo/userinfo',
        })
    },
    //已购买
    buyed(event) {
        wx.navigateTo({
            url: '../index/buyedart/buyedart',
        })
    },
    //收藏
    collected(event) {
        wx.navigateTo({
            url: '../index/buyedart/buyedart?collect=1',
        })
    },
    //发布文章
    releaseArt(event) {
        wx.navigateTo({
            url: '../pro/release/release',
        })
    },
    //我是分析师
    myPro(event) {
        wx.navigateTo({
            url: '../pro/mypro/mypro',
        })
    },
//消息中心
msgCenter(event){
      wx.navigateTo({
            url: 'msg/msg',
        })
},
    //获取未读消息
    getUnSeeMsg(pid) {
        const that = this;
        api.msgList({
            data: {
                toId: pid,
                limit: 1,
                offset:0,
                status:0
            },
            success(res) {
                that.setData({
                    haveMsg: true,
                })
            },
            complete() {

            }
        })
    }
})