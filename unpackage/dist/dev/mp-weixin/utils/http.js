"use strict";
const common_vendor = require("../common/vendor.js");
const store_user = require("../store/user.js");
const memberStore = store_user.useUserStore();
const baseURL = "http://localhost:8888";
const interceptorConfig = {
  invoke(args) {
    var _a;
    if (args.url.indexOf("http") === -1)
      args.url = baseURL + args.url;
    args.timeout = 9999;
    args.header = {
      ...args.header
    };
    const token = (_a = memberStore.userinfo) == null ? void 0 : _a.token;
    if (token)
      args.header.Authorization = token;
    return args;
  }
};
common_vendor.index.addInterceptor("request", interceptorConfig);
common_vendor.index.addInterceptor("uploadFile", interceptorConfig);
const req = (args) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      ...args,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300)
          resolve(res.data);
        else if (res.statusCode === 401) {
          memberStore.updateUserinfo({});
          memberStore.updateToken("");
          memberStore.updateGlobalStaticSettings({});
          common_vendor.index.showToast({
            title: "登录过期，请重新登录",
            icon: "error"
          });
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }, 666);
          reject(res);
        } else {
          common_vendor.index.showToast({
            title: res.data.msg || "未知错误",
            icon: "none"
          });
          reject(res);
        }
      },
      //   如果失败？
      fail(err) {
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
        reject(err);
      }
    });
  });
};
exports.req = req;
