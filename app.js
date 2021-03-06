import Request from '/core/request.js'
import Settings from '/utils/settings.js'
//app.js
App({
  request: new Request(),
  settings: new Settings(),
  sessionData: {
    sessionId: "",
  },

  onLaunch: function () {
    this.sessionData.sessionId = this._getSessionDataFromStorage();
  },
  checkLogin() {
    if (this.sessionData.sessionId) {
      return true;
    } else {
      this.loginFail();
    }
  },

  loginFail() {
    wx.reLaunch({
      url: '/pages/logs/logs'
    })
  },

  login(account, password, callback) {
    this.showLoading();
    this.request.get('/login', {
      mode: 'login',
      account,
      password
    }).then((res) => {
      this._setSessionData(res.data, callback)
    }, (err) => {
      if (err.statusCode === 402) {
        this.showToast('用户名或密码错误')
      } else {
        wx.hideLoading();
        this.showToast("登陆失败！请检查网络")
      }
    })
  },

  _setSessionData(sessionId, callback) {
    try {
      wx.setStorageSync("sessionId", sessionId);
      this.sessionData.sessionId = sessionId;
      wx.hideLoading();
      callback();
    } catch (e) {
      this.showToast('登陆失败！请重试')
    }
  },


  _getSessionDataFromStorage() {
    let sessionId = "-1";
    try {
      sessionId = wx.getStorageSync("sessionId");
    } catch (e) {
      this.showToast('请重新登陆')
    }
    return sessionId;
  },

  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },

  showLoading(title) {
    wx.showLoading({
      title: title || "",
      mask: true
    })
  }


})