const AV = require('./lib/av-weapp-min');
const login = require('./utils/login');
const leancloudConfig = require('./config/leancloud');

AV.init(leancloudConfig.production);

App({
  onLaunch: function() {
    this.login();
  },
  login() {
    if (!this.loginEnd) {
      this.loginEnd = login(this);
    }
    return this.loginEnd;
  },
  store: {
    userData: null,
    userInfo: null,
    teamList: null,
    currentTeam: null,
  },
  // 临时存放变量
  tempStore: {},
});
