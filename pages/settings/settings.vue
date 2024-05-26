<script setup lang="ts">
	import { useUserStore } from "@/store/user"
	import { toLogin } from '@/utils/login'
	import { ref } from "vue";
	import { req } from "@/utils/http"
	import { onLoad, onShow } from '@dcloudio/uni-app'
	onShow(() => {
		if (!userStore.authToken)
			return uni.showToast({
				title: "当前未登录",
				icon: "error"
			})
		// syncDataGetSettings()
		dynamicSettings.value = userStore.globalStaticSettings
	})
	// 上传全局设置
	const syncDataPostSettings = async () => {
		if (!userStore.authToken) return
		const res = await req({
			url: '/sync-data/post/settings',
			method: "POST",
			data: userStore.globalStaticSettings
		})
		console.log(res);
	}
	// 拉取获得全局设置
	const syncDataGetSettings = async () => {
		if (!userStore.authToken) return
		console.log(userStore.globalStaticSettings);
		const res = await req({
			url: '/sync-data/get/settings',
		})
		console.log(res)
		userStore.updateGlobalStaticSettings(res.data)
		dynamicSettings.value = userStore.globalStaticSettings
	}
	const userStore = useUserStore()
	const dealBindSwitch = e => (dynamicSettings.value.autoMuYu = e.detail.value)
	// 设置的内容（表单数据）
	const dynamicSettings = ref<any>(userStore.globalStaticSettings || {
		gongdePerCount: 1,
		autoMuYu: false,
		autoMuYuFrequency: 1
	})
	let timeouter1 : any = null
	const dealSettingsChange = () => {
		if (timeouter1) clearTimeout(timeouter1)
		timeouter1 = setTimeout(() => {
			userStore.updateGlobalStaticSettings(dynamicSettings.value)
			timeouter1 = null
			syncDataPostSettings()
		}, 1111)
	}
	const logCurSettings = () => {
		console.log(userStore.globalStaticSettings);
	}
	const logCurDynamicSettings = () => {
		console.log(dynamicSettings.value);
	}
</script>
<template>
	<view class="info-box-settings">
		<view class="info-box-title">
			单次功德数
		</view>
		<view v-if="userStore.authToken">
			<uni-number-box @change="dealSettingsChange" v-model="dynamicSettings.gongdePerCount" background="#ddb05c"
				:disabled="false" :min="1" :max="999" color="#fff" />
		</view>
		<view v-else style="font-size: 4vw;color: lightslategray;" @click="toLogin">
			未登录（点击去登录）
		</view>
	</view>
	<view class="info-box">
		<view class="info-box-title">
			自动木鱼
		</view>
		<view v-if="userStore.authToken">
			<view class="info-box-content">
				<view>
					开启
				</view>
				<switch @change="e => {dealBindSwitch(e);dealSettingsChange()}" color="#ddb05c" :disabled="false"
					:checked="dynamicSettings.autoMuYu" />
			</view>
			<view class="info-box-content">
				<view>
					自动木鱼时间间隔(秒)
				</view>
				<uni-number-box @change="dealSettingsChange" background="#ddb05c" :disabled="false" :min="0.1" :max="3"
					:step="0.1" color="#fff" v-model="dynamicSettings.autoMuYuFrequency" />
			</view>
		</view>
		<view v-else style="font-size: 4vw;color: lightslategray;" @click="toLogin">
			未登录（点击去登录）
		</view>
	</view>
	<!-- 	<button @click="syncDataPostSettings">INDEV!!!:syncDataPostSettings</button>
	<button @click="syncDataGetSettings">INDEV!!!:syncDataGetSettings</button>
	<button @click="logCurSettings">INDEV!!!:logCurSettings</button>
	<button @click="logCurDynamicSettings">INDEV!!!:logCurDynamicSettings</button> -->
</template>


<style lang="scss">
	.info-box-settings {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 4vw;
		padding: 2vw;
		color: #fff;
		background-color: #2f2f2f;
		border: 1px solid #fff;
		border-radius: 8px;
		box-shadow: 1vw 1vw 2vw 0.2vw gray;

		.info-box-title {
			font-size: 6vw;
			// border-bottom: 1px dotted gainsboro;
			padding-bottom: 1vw;
		}

		.info-box-content {
			font-size: 5vw;
			padding-top: 1vw;
			color: #f6c667;
		}

	}

	.info-box {
		margin: 4vw;
		padding: 2vw;
		color: #fff;
		background-color: #2f2f2f;
		min-height: 14vw;
		border: 1px solid #fff;
		border-radius: 8px;
		box-shadow: 1vw 1vw 2vw 0.2vw gray;

		.info-box-title {
			font-size: 6vw;
			border-bottom: 1px dotted gainsboro;
			padding-bottom: 1vw;
		}

		.info-box-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 4vw;
			padding: 2vw 0;
			padding-left: 5vw;
			border-bottom: 1px dotted darkslategrey;

			&:last-child {
				border-bottom: none;
			}
		}
	}
</style>