"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore(
  "user",
  () => {
    const persistUserinfo = (val) => {
      if (val)
        common_vendor.index.setStorageSync("userinfo", JSON.stringify(val));
      else {
        const unTransformedData = common_vendor.index.getStorageSync("userinfo");
        return unTransformedData ? JSON.parse(unTransformedData) : {};
      }
    };
    const userinfo = common_vendor.ref(persistUserinfo());
    const updateUserinfo = (nVal) => {
      userinfo.value = nVal;
      persistUserinfo(nVal);
    };
    const persistToken = (val) => {
      if (typeof val === "string")
        common_vendor.index.setStorageSync("authToken", val);
      else
        return common_vendor.index.getStorageSync("authToken") || "";
    };
    const authToken = common_vendor.ref(persistToken());
    const updateToken = (nVal) => {
      authToken.value = nVal;
      persistToken(nVal);
    };
    const persistGlobalStaticSettings = (val) => {
      if (val)
        common_vendor.index.setStorageSync("globalStaticSettings", JSON.stringify(val));
      else {
        const unTransformedData = common_vendor.index.getStorageSync("globalStaticSettings");
        return unTransformedData ? JSON.parse(unTransformedData) : {};
      }
    };
    const globalStaticSettings = common_vendor.ref(persistGlobalStaticSettings());
    const updateGlobalStaticSettings = (nVal) => {
      globalStaticSettings.value = nVal;
      persistGlobalStaticSettings(nVal);
    };
    const curGongde = common_vendor.ref(0);
    const curGongdeAdd1 = () => curGongde.value++;
    const curGongdeAdd = () => {
      var _a, _b;
      curGongde.value += ((_a = globalStaticSettings.value) == null ? void 0 : _a.gongdePerCount) || 1;
      if (typeof ((_b = userinfo == null ? void 0 : userinfo.value) == null ? void 0 : _b.total_gongde) === "number")
        userinfo.value.total_gongde += globalStaticSettings.value.gongdePerCount || 1;
    };
    const clearTotalGongde = () => {
      var _a;
      if (typeof ((_a = userinfo == null ? void 0 : userinfo.value) == null ? void 0 : _a.total_gongde) === "number")
        userinfo.value.total_gongde = 0;
    };
    return {
      userinfo,
      updateUserinfo,
      authToken,
      updateToken,
      curGongde,
      curGongdeAdd1,
      curGongdeAdd,
      globalStaticSettings,
      updateGlobalStaticSettings,
      clearTotalGongde
    };
  }
);
exports.useUserStore = useUserStore;
