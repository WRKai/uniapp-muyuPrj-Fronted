"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_user = require("../../store/user.js");
const utils_http = require("../../utils/http.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    common_vendor.onLoad(async () => {
      if (!userStore.authToken)
        return common_vendor.index.showToast({
          title: "当前未登录",
          icon: "error"
        });
      syncData();
    });
    var autoMuYuTimer = null;
    common_vendor.onShow(() => {
      if (!userStore.globalStaticSettings.autoMuYu)
        return;
      autoMuYuTimer = setInterval(dealQiaoMuyu, userStore.globalStaticSettings.autoMuYuFrequency * 1e3);
    });
    common_vendor.onHide(() => {
      if (autoMuYuTimer)
        clearInterval(autoMuYuTimer);
      autoMuYuTimer = null;
    });
    const syncData = async () => {
      if (!userStore.authToken)
        return;
      const res = await utils_http.req({
        url: "/sync-data/get/gongde"
      });
      console.log(res.data);
      userStore.updateUserinfo({
        ...userStore.userinfo,
        ...res.data
      });
      console.log(userStore.userinfo);
    };
    const syncDataPostGongde = async () => {
      if (!userStore.authToken)
        return;
      const res = await utils_http.req({
        url: "/sync-data/post/gongde",
        method: "POST",
        data: {
          total_gongde: userStore.userinfo.total_gongde
        }
      });
      console.log(res);
    };
    const userStore = store_user.useUserStore();
    var animating = false;
    const tips_isVisible = common_vendor.ref(false);
    var TipsAnimating = false;
    var postTotalGongdeTimeouter = null;
    const dealQiaoMuyu = async () => {
      userStore.curGongdeAdd();
      if (postTotalGongdeTimeouter)
        clearTimeout(postTotalGongdeTimeouter);
      postTotalGongdeTimeouter = setTimeout(() => {
        syncDataPostGongde();
        postTotalGongdeTimeouter = null;
      }, 1111);
      if (!TipsAnimating) {
        TipsAnimating = true;
        tips_isVisible.value = true;
        animation2.translate(0, -75).opacity(0).step();
        animation2Data.value = animation2.export();
        setTimeout(() => {
          animation3.translate(0, 0).opacity(1).step();
          animation2Data.value = animation3.export();
          tips_isVisible.value = false;
          TipsAnimating = false;
        }, 401);
      }
      if (!animating) {
        animating = true;
        animation1.scale(0.85, 0.85).step();
        animation1Data.value = animation1.export();
        setTimeout(() => {
          animation1.scale(1.15, 1.15).step();
          animation1Data.value = animation1.export();
        }, 60);
        setTimeout(() => {
          animation1.scale(1, 1).step();
          animation1Data.value = animation1.export();
          animating = false;
        }, 120);
      }
      if (!innerAudioContext.paused)
        innerAudioContext.stop();
      innerAudioContext.play();
    };
    const innerAudioContext = common_vendor.index.createInnerAudioContext();
    innerAudioContext.src = "../../static/muyu.mp3";
    const animation1Data = common_vendor.ref();
    const animation1 = common_vendor.index.createAnimation({
      duration: 60
    });
    const animation2Data = common_vendor.ref();
    const animation2 = common_vendor.index.createAnimation({
      duration: 400
    });
    const animation3 = common_vendor.index.createAnimation({
      duration: 10
    });
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.unref(userStore).authToken
      }, common_vendor.unref(userStore).authToken ? {
        b: common_vendor.t((_a = common_vendor.unref(userStore).userinfo) == null ? void 0 : _a.total_gongde)
      } : {}, {
        c: common_vendor.t(common_vendor.unref(userStore).curGongde),
        d: common_vendor.t(((_c = (_b = common_vendor.unref(userStore)) == null ? void 0 : _b.globalStaticSettings) == null ? void 0 : _c.gongdePerCount) || 1),
        e: animation2Data.value,
        f: tips_isVisible.value,
        g: animation1Data.value,
        h: common_assets._imports_0,
        i: common_vendor.o(dealQiaoMuyu)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/HXPrj/muyuPrj/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
