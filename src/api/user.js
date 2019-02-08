const AV = require('../lib/av-weapp-min');

function login() {
  return AV.User.loginWithWeapp();
}

function setUserData(data) {
  const user = AV.User.current();
  user.set(data);
  return user.save();
}

module.exports = {
  login,
  setUserData,
};
