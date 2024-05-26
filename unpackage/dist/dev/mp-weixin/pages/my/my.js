"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const utils_http = require("../../utils/http.js");
const utils_login = require("../../utils/login.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "my",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const Logout = async () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定退出登录?",
        success: (res) => {
          if (res.confirm) {
            userStore.updateUserinfo({});
            userStore.updateToken("");
            userStore.updateGlobalStaticSettings({});
            common_vendor.index.showToast({
              title: "退出登录成功!"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/index/index"
              });
            }, 666);
          }
        }
      });
    };
    const clearGongde = () => {
      common_vendor.index.showModal({
        title: "清空总功德操作",
        content: "确定?(不可逆!)",
        confirmColor: "red",
        success: (res) => {
          if (res.confirm)
            syncDataPostGongdeClear();
        }
      });
    };
    const syncDataPostGongdeClear = async () => {
      if (!userStore.authToken)
        return;
      const res = await utils_http.req({
        url: "/sync-data/post/gongde",
        method: "POST",
        data: {
          total_gongde: 0
        }
      });
      userStore.clearTotalGongde();
      console.log(res);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userStore).authToken
      }, common_vendor.unref(userStore).authToken ? {
        b: common_vendor.t(common_vendor.unref(userStore).userinfo.username)
      } : {
        c: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(utils_login.toLogin) && common_vendor.unref(utils_login.toLogin)(...args)
        )
      }, {
        d: common_vendor.unref(userStore).authToken
      }, common_vendor.unref(userStore).authToken ? {
        e: common_vendor.t(common_vendor.unref(userStore).userinfo.total_gongde)
      } : {
        f: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(utils_login.toLogin) && common_vendor.unref(utils_login.toLogin)(...args)
        )
      }, {
        g: common_vendor.t(common_vendor.unref(userStore).curGongde),
        h: common_vendor.unref(userStore).authToken
      }, common_vendor.unref(userStore).authToken ? {
        i: common_vendor.p({
          type: "right",
          size: "20",
          color: "#fff"
        }),
        j: common_vendor.o(Logout)
      } : {}, {
        k: common_vendor.unref(userStore).authToken
      }, common_vendor.unref(userStore).authToken ? {
        l: common_vendor.p({
          type: "right",
          size: "20",
          color: "#fff"
        }),
        m: common_vendor.o(clearGongde)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/HXPrj/muyuPrj/pages/my/my.vue"]]);
wx.createPage(MiniProgramPage);
