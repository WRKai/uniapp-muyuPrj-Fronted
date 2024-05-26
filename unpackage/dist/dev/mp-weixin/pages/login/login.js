"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_http = require("../../utils/http.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const formRef = common_vendor.ref();
    const formData = common_vendor.ref({
      username: "",
      password: "",
      rePassword: ""
    });
    const rules = {
      username: {
        rules: [{
          required: true,
          errorMessage: "请输入用户名"
        }]
      },
      password: {
        rules: [{
          required: true,
          errorMessage: "请输入密码"
        }, {
          pattern: /^\S{6,20}$/,
          errorMessage: "请输入正确格式的密码"
        }]
      },
      rePassword: {
        rules: [{
          required: true,
          errorMessage: "请重复密码"
        }, {
          validateFunction: (rule, value, data, callback) => formData.value.rePassword === formData.value.password,
          errorMessage: "两次密码不一致"
        }]
      }
    };
    common_vendor.onReady(() => formRef.value.setRules(rules));
    const submitForm = async () => {
      try {
        if (!isRegisterMode.value) {
          formData.value.rePassword = formData.value.password;
        }
        await formRef.value.validate();
        let res = null;
        if (isRegisterMode.value) {
          res = await utils_http.req({
            url: "/api/register",
            method: "POST",
            data: formData.value
          });
          console.log(res);
          common_vendor.index.showToast({
            title: res.msg,
            icon: "success",
            mask: true
          });
          setTimeout(() => {
            isRegisterMode.value = false;
            formData.value.password = "";
          }, 666);
        } else {
          res = await utils_http.req({
            url: "/api/login",
            method: "POST",
            data: formData.value
          });
          userStore.updateUserinfo(res.data);
          userStore.updateToken(res.data.token);
          userStore.updateGlobalStaticSettings(JSON.parse(res.data.globalStaticSettings));
          console.log(res);
          common_vendor.index.showToast({
            title: res.msg,
            icon: "success",
            mask: true
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }, 666);
        }
      } catch (e) {
        console.dir(e);
        if (e instanceof Array)
          common_vendor.index.showToast({
            title: "表单内容有误",
            icon: "error"
          });
      }
    };
    const isRegisterMode = common_vendor.ref(false);
    const dealModeSwitch = () => {
      isRegisterMode.value = !isRegisterMode.value;
      formData.value.rePassword = "";
    };
    var animating = false;
    const dealQiaoMuYu = () => {
      if (!animating) {
        animating = true;
        animation1.scale(0.75, 0.75).step();
        animation1Data.value = animation1.export();
        setTimeout(() => {
          animation1.scale(1.25, 1.25).step();
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
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: animation1Data.value,
        c: common_vendor.o(dealQiaoMuYu),
        d: common_vendor.o(($event) => formData.value.username = $event),
        e: common_vendor.p({
          type: "text",
          placeholder: "请输入用户名",
          modelValue: formData.value.username
        }),
        f: common_vendor.p({
          name: "username"
        }),
        g: common_vendor.o(($event) => formData.value.password = $event),
        h: common_vendor.p({
          type: "password",
          placeholder: "请输入密码",
          modelValue: formData.value.password
        }),
        i: common_vendor.p({
          name: "password"
        }),
        j: common_vendor.o(($event) => formData.value.rePassword = $event),
        k: common_vendor.p({
          type: "password",
          placeholder: "请重复密码",
          modelValue: formData.value.rePassword
        }),
        l: common_vendor.p({
          name: "rePassword"
        }),
        m: isRegisterMode.value,
        n: common_vendor.sr(formRef, "0c693cea-0", {
          "k": "formRef"
        }),
        o: common_vendor.p({
          model: formData.value
        }),
        p: common_vendor.t(isRegisterMode.value ? "已注册? 去登录" : "尚无账号? 去注册"),
        q: common_vendor.o(dealModeSwitch),
        r: common_vendor.t(isRegisterMode.value ? "注册" : "登录"),
        s: common_vendor.o(submitForm)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/HXPrj/muyuPrj/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
