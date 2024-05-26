"use strict";
const common_vendor = require("../common/vendor.js");
const toLogin = async () => {
  common_vendor.index.navigateTo({
    url: "/pages/login/login"
  });
};
exports.toLogin = toLogin;
