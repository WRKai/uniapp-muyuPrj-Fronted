import { defineStore } from "pinia"
import { ref } from "vue"
export const useUserStore = defineStore('user', () => {
	// 个人信息
	const persistUserinfo = (val ?: typeof userinfo.value) => {
		if (val)
			uni.setStorageSync('userinfo', JSON.stringify(val))
		else {
			const unTransformedData = uni.getStorageSync('userinfo')
			return unTransformedData ? JSON.parse(unTransformedData) : {}
		}
	}
	const userinfo = ref<any>(persistUserinfo())
	const updateUserinfo = (nVal : typeof userinfo.value) => {
		userinfo.value = nVal
		persistUserinfo(nVal)
	}
	// token
	const persistToken = (val ?: string) => {
		if (typeof val === 'string')
			uni.setStorageSync('authToken', val)
		else
			return uni.getStorageSync('authToken') || ''
	}
	const authToken = ref<string>(persistToken())
	const updateToken = (nVal : string) => {
		authToken.value = nVal
		persistToken(nVal)
	}
	// 全局设置
	const persistGlobalStaticSettings = (val ?: any) => {
		if (val)
			uni.setStorageSync('globalStaticSettings', JSON.stringify(val))
		else {
			const unTransformedData = uni.getStorageSync('globalStaticSettings')
			return unTransformedData ? JSON.parse(unTransformedData) : {}
		}
	}
	const globalStaticSettings = ref<any>(persistGlobalStaticSettings())
	const updateGlobalStaticSettings = (nVal : typeof globalStaticSettings.value) => {
		globalStaticSettings.value = nVal
		persistGlobalStaticSettings(nVal)
	}
	// 当次功德：临时存储
	const curGongde = ref(0)
	const curGongdeAdd1 = () => (curGongde.value++)
	const curGongdeAdd = () => {
		curGongde.value += (globalStaticSettings.value?.gongdePerCount || 1)
		if (typeof userinfo?.value?.total_gongde === 'number')
			userinfo.value!.total_gongde += (globalStaticSettings.value.gongdePerCount || 1)
	}
	const clearTotalGongde = () => {
		if (typeof userinfo?.value?.total_gongde === 'number')
			userinfo.value!.total_gongde = 0
	}
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
	}
},
)