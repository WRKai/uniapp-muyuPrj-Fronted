"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const utils_login = require("../../utils/login.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  _easycom_uni_number_box2();
}
const _easycom_uni_number_box = () => "../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
if (!Math) {
  _easycom_uni_number_box();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "settings",
  setup(__props) {
    common_vendor.onShow(() => {
      if (!userStore.authToken)
        return common_vendor.index.showToast({
          title: "当前未登录",
          icon: "error"
        });
      dynamicSettings.value = userStore.globalStaticSettings;
    });
    const syncDataPostSettings = async () => {
      if (!userStore.authToken)
        return;
      const res = await utils_http.req({
        url: "/sync-data/post/settings",
        method: "POST",
        data: userStore.globalStaticSettings
      });
      console.log(res);
    };
    const userStore = store_user.useUserStore();
    const dealBindSwitch = (e) => dynamicSettings.value.autoMuYu = e.detail.value;
    const dynamicSettings = common_vendor.ref(userStore.globalStaticSettings || {
      gongdePerCount: 1,
      autoMuYu: false,
      autoMuYuFrequency: 1
    });
    let timeouter1 = null;
    const dealSettingsChange = () => {
      if (timeouter1)
        clearTimeout(timeouter1);
      timeouter1 = setTimeout(() => {
        userStore.updateGlobalStaticSettings(dynamicSettings.value);
        timeouter1 = null;
        syncDataPostSettings();
      }, 1111);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userStore).authToken
      }, common_vendor.unref(userStore).authToken ? {
        b: common_vendor.o(dealSettingsChange),
        c: common_vendor.o(($event) => dynamicSettings.value.gongdePerCount = $event),
        d: common_vendor.p({
          background: "#ddb05c",
          disabled: false,
          min: 1,
          max: 999,
          color: "#fff",
          modelValue: dynamicSettings.value.gongdePerCount
        })
      } : {
        e: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(utils_login.toLogin) && common_vendor.unref(utils_login.toLogin)(...args)
        )
      }, {
        f: common_vendor.unref(userStore).authToken
      }, common_vendor.unref(userStore).authToken ? {
        g: common_vendor.o((e) => {
          dealBindSwitch(e);
          dealSettingsChange();
        }),
        h: dynamicSettings.value.autoMuYu,
        i: common_vendor.o(dealSettingsChange),
        j: common_vendor.o(($event) => dynamicSettings.value.autoMuYuFrequency = $event),
        k: common_vendor.p({
          background: "#ddb05c",
          disabled: false,
          min: 0.1,
          max: 3,
          step: 0.1,
          color: "#fff",
          modelValue: dynamicSettings.value.autoMuYuFrequency
        })
      } : {
        l: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(utils_login.toLogin) && common_vendor.unref(utils_login.toLogin)(...args)
        )
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/HXPrj/muyuPrj/pages/settings/settings.vue"]]);
wx.createPage(MiniProgramPage);
