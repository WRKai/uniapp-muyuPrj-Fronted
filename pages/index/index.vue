<script lang="ts" setup>
	import { ref } from "vue";
	import { useUserStore } from "@/store/user"
	import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
	import { req } from "@/utils/http"

	// 初始化请求
	onLoad(async () => {
		if (!userStore.authToken)
			return uni.showToast({
				title: "当前未登录",
				icon: "error"
			})
		syncData()
	})
	var autoMuYuTimer : any = null
	onShow(() => {
		if (!userStore.globalStaticSettings.autoMuYu) return
		autoMuYuTimer = setInterval(dealQiaoMuyu, userStore.globalStaticSettings.autoMuYuFrequency * 1000)
	})
	onHide(() => {
		if (autoMuYuTimer) clearInterval(autoMuYuTimer)
		autoMuYuTimer = null
	})
	// 同步数据请求方法
	const syncData = async () => {
		if (!userStore.authToken) return
		const res = await req<{ total_gongde : number }>({
			url: '/sync-data/get/gongde',
		})
		console.log(res.data);
		userStore.updateUserinfo({
			...userStore.userinfo,
			...res.data
		})
		console.log(userStore.userinfo);
	}
	// 同步数据请求方法:上传
	const syncDataPostGongde = async () => {
		if (!userStore.authToken) return
		const res = await req({
			url: '/sync-data/post/gongde',
			method: "POST",
			data: {
				total_gongde: userStore.userinfo.total_gongde
			}
		})
		console.log(res);
	}
	const userStore = useUserStore()
	// 是否在播放动画
	var animating = false
	// 功德提示词显示？
	const tips_isVisible = ref(false)
	// 是否在等待回调动画？
	var TipsAnimating = false
	// 是否上传功德节流中？
	var postTotalGongdeTimeouter : any = null
	// 敲木鱼的回调函数
	const dealQiaoMuyu = async () => {
		userStore.curGongdeAdd()
		if (postTotalGongdeTimeouter) clearTimeout(postTotalGongdeTimeouter)
		postTotalGongdeTimeouter = setTimeout(() => {
			syncDataPostGongde()
			postTotalGongdeTimeouter = null
		}, 1111)
		if (!TipsAnimating) {
			TipsAnimating = true
			tips_isVisible.value = true
			animation2.translate(0, -75).opacity(0).step()
			animation2Data.value = animation2.export()
			setTimeout(() => {
				animation3.translate(0, 0).opacity(1).step()
				animation2Data.value = animation3.export()
				tips_isVisible.value = false
				TipsAnimating = false
			}, 401)
		}
		// 判断是否在执行提示动画？
		if (!animating) {
			animating = true
			animation1.scale(0.85, 0.85).step()
			animation1Data.value = animation1.export()
			setTimeout(() => {
				animation1.scale(1.15, 1.15).step()
				animation1Data.value = animation1.export()
			}, 60)
			setTimeout(() => {
				animation1.scale(1, 1).step()
				animation1Data.value = animation1.export()
				animating = false
			}, 120)
		}
		if (!innerAudioContext.paused)
			innerAudioContext.stop()
		innerAudioContext.play()
	}
	// 音频设置
	const innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.src = '../../static/muyu.mp3'
	// 敲木鱼的动画
	const animation1Data = ref()
	const animation1 = uni.createAnimation({
		duration: 60
	})
	// 出现功德提示词的动画
	const animation2Data = ref()
	const animation2 = uni.createAnimation({
		duration: 400
	})
	const animation3 = uni.createAnimation({
		duration: 10
	})
</script>
<template>
	<view class="total-gongde-display" v-if="userStore.authToken">
		总功德: {{userStore.userinfo?.total_gongde}}
	</view>
	<view class="gongde-display">
		本次功德: {{userStore.curGongde}}
	</view>
	<view class="container">
		<view class="img-ctr" @click="dealQiaoMuyu">
			<view class="tips-text-box" ref="tipsTextBox">
				<view class="tips-content" :animation="animation2Data" v-show="tips_isVisible">
					功德+{{userStore?.globalStaticSettings?.gongdePerCount || 1}}
				</view>
			</view>
			<image :animation="animation1Data" src="@/static/muyu.jpg" class="muyu">
			</image>
		</view>
	</view>
</template>


<style lang="scss">
	.using-floatUp {
		transform: translate(0, -10vw);
		opacity: 0;
	}

	.gongde-display {
		color: aliceblue;
		font-size: 8vw;
		text-align: center;
	}

	.total-gongde-display {
		color: aliceblue;
		font-size: 6vw;
		text-align: center;
	}

	.container {
		.img-ctr {
			height: 70vw;
			width: 70vw;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-top: -35vw;
			margin-left: -35vw;

			.muyu {
				height: 70vw;
				width: 70vw;

			}

			.tips-text-box {
				// background-color: lightskyblue;
				position: absolute;
				right: 0;
				top: 0;
				height: 36vw;
				min-width: 36vw;
				z-index: 99;
				font-size: 10vw;

				.tips-content {
					color: aliceblue;
					text-align: center;
				}
			}
		}

	}
</style>