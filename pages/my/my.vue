<script setup lang="ts">
	import { ref } from "vue";
	import { useUserStore } from "@/store/user"
	import { req } from "@/utils/http"
	import { toLogin } from '@/utils/login'
	const userStore = useUserStore()
	// 登出业务
	const Logout = async () => {
		uni.showModal({
			title: '提示',
			content: '确定退出登录?',
			success: (res) => {
				if (res.confirm) {
					userStore.updateUserinfo({})
					userStore.updateToken('')
					userStore.updateGlobalStaticSettings({})
					uni.showToast({
						title: "退出登录成功!",
					})
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 666)
				}

			}
		})
	}
	// 清空总功德
	const clearGongde = () => {
		uni.showModal({
			title: '清空总功德操作',
			content: '确定?(不可逆!)',
			confirmColor: "red",
			success: (res) => {
				if (res.confirm)
					syncDataPostGongdeClear()
			}
		})
	}
	// 同步数据请求方法:上传
	const syncDataPostGongdeClear = async () => {
		if (!userStore.authToken) return
		const res = await req({
			url: '/sync-data/post/gongde',
			method: "POST",
			data: {
				total_gongde: 0
			}
		})
		userStore.clearTotalGongde()
		console.log(res);
	}
</script>
<template>
	<view class="info-box">
		<view class="info-box-title">
			用户名
		</view>
		<view class="info-box-content">
			<view v-if="userStore.authToken">
				{{userStore.userinfo.username}}
			</view>
			<view v-else style="font-size: 4vw;color: lightslategray;" @click="toLogin">
				未登录（点击去登录）
			</view>
		</view>
	</view>
	<view class="info-box">
		<view class="info-box-title">
			总功德
		</view>
		<view class="info-box-content">
			<view v-if="userStore.authToken">
				{{userStore.userinfo.total_gongde}}
			</view>
			<view v-else style="font-size: 4vw;color: lightslategray;" @click="toLogin">
				未登录（点击去登录）
			</view>
		</view>
	</view>
	<view class="info-box">
		<view class="info-box-title">
			本次功德
		</view>
		<view class="info-box-content">
			<view>
				{{userStore.curGongde}}
			</view>
		</view>
	</view>
	<view class="info-div"></view>
	<view class="info-box-single" v-if="userStore.authToken" @click="Logout">
		<view class="info-box-title">
			退出登录
		</view>
		<uni-icons type="right" size="20" color="#fff"></uni-icons>
	</view>
	<view class="info-box-single" v-if="userStore.authToken" @click="clearGongde">
		<view class="info-box-title">
			清空总功德
		</view>
		<uni-icons type="right" size="20" color="#fff"></uni-icons>
	</view>
	<!-- 	<view class="info-box">
		<view class="info-box-title">
			INDEV!!!:USERINFO
		</view>
		<view class="info-box-content">
			<view style="color: aliceblue;">
				{{userStore.userinfo}}
				{{userStore.authToken}}
			</view>
		</view>
	</view> -->
</template>


<style lang="scss">
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
			font-size: 5vw;
			padding-top: 1vw;
			color: #f6c667;
		}
	}

	.info-box-single {
		margin: 4vw;
		padding: 2vw;
		color: #fff;
		background-color: #2f2f2f;
		border: 1px solid #fff;
		border-radius: 8px;
		box-shadow: 1vw 1vw 2vw 0.2vw gray;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.info-box-title {
			font-size: 6vw;
		}
	}

	.info-div {
		margin: 4vw;
		padding: 2vw;
		color: #fff;
		min-height: 2vw;
		border-radius: 8px;
		// 	box-shadow: 0 0 2vw 0.2vw gray;
	}
</style>