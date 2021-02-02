<template>
	<view>
		<!-- 自定义导航栏 -->
		<u-navbar :border-bottom="false" back-text="取消" back-icon-color="#0077FF" :back-text-style="backTextStyle">
			<view slot="right" class="flex align-center flex-1 px-3 py-2" hover-class="bg-light"
				@click="next()">
				<text class="font text-dark main-text-color">下一步</text>
			</view>
		</u-navbar>
		<!-- 输入内容区域开始 -->
		<view class="p-2">
			<view class="flex align-center" style="height: 96rpx;border-bottom: 2rpx solid #f0f0f0;">
				<input v-model="title" style="width: 100%;" type="text" placeholder="请输入文章标题(2-20字)" />
			</view>
			<view class="flex align-center" style="height: 96rpx;border-bottom: 2rpx solid #f0f0f0;">
				<input v-model="deputyTitle" style="width: 100%;" type="text" placeholder="请输入文章副标题" />
			</view>
		</view>
		<!-- 富文本编辑器 -->
		<view style="padding: 0;" class="h5">
			<view class="h5">
				<view class='wrapper h5'>
					<view class='toolbar' @tap="format">
						<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"></view>
						<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic"></view>
						<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian" data-name="underline"></view>
						<view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian" data-name="strike"></view>
						<view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi" data-name="align"
						 data-value="left"></view>
						<view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi" data-name="align"
						 data-value="center"></view>
						<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi" data-name="align"
						 data-value="right"></view>
						<view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi" data-name="align"
						 data-value="justify"></view>
						<view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height" data-name="lineHeight"
						 data-value="2"></view>
						<view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing" data-name="letterSpacing"
						 data-value="2em"></view>
						<view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju" data-name="marginTop"
						 data-value="20px"></view>
						<view :class="formats.previewarginBottom ? 'ql-active' : ''" class="iconfont icon-723bianjiqi_duanhouju"
						 data-name="marginBottom" data-value="20px"></view>
						<view class="iconfont icon-clearedformat" @tap="removeFormat"></view>
						<view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font" data-name="fontFamily" data-value="Pacifico"></view>
						<view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize" data-name="fontSize"
						 data-value="24px"></view>
			
						<view :class="formats.color === '#0000ff' ? 'ql-active' : ''" class="iconfont icon-text_color" data-name="color"
						 data-value="#0000ff"></view>
						<view :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''" class="iconfont icon-fontbgcolor"
						 data-name="backgroundColor" data-value="#00ff00"></view>
			
						<view class="iconfont icon-date" @tap="insertDate"></view>
						<view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
						<view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie" data-name="list"
						 data-value="ordered"></view>
						<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie" data-name="list"
						 data-value="bullet"></view>
						<view class="iconfont icon-undo" @tap="undo"></view>
						<view class="iconfont icon-redo" @tap="redo"></view>
			
						<view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
						<view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>
						<view class="iconfont icon-fengexian" @tap="insertDivider"></view>
						<view class="iconfont icon-charutupian" @tap="insertImage"></view>
						<view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-format-header-1" data-name="header"
						 :data-value="1"></view>
						<view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao" data-name="script"
						 data-value="sub"></view>
						<view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao" data-name="script"
						 data-value="super"></view>
						<view class="iconfont icon-shanchu" @tap="clear"></view>
						<view :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont icon-direction-rtl" data-name="direction"
						 data-value="rtl"></view>
			
					</view>
			
					<editor id="editor" class="ql-container" placeholder="请输入文章内容" showImgSize showImgToolbar showImgResize
					 @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
					</editor>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/utils/config.js';
	export default {
		data() {
			return {
				readOnly: false,
				formats: {},
				backTextStyle:{
					color: '#0077FF'
				},
				token: '',
				// 标题
				title: '',
				// 副标题
				deputyTitle: ''
			}
		},
		onLoad() {
			uni.loadFontFace({
				family: 'Pacifico',
				source: 'url("https://sungd.github.io/Pacifico.ttf")'
			})
			// 获取token
			let token = uni.getStorageSync('localToken')
			this.token = token
		},
		methods: {
			// 下一步
			next(){
				if(this.title === ''){
					return uni.showToast({
						title: '请输入文章标题',
						icon: 'none'
					})
				}
				var editorHtml = ''
				uni.navigateTo({
					url: '/pages/news/addNews/addNewsNext'
				})
				this.editorCtx.getContents({
					success:function(data){
						editorHtml = data.html
					}
				})
				setTimeout(() => {
					uni.$emit("newsObj",{
						title: this.title,
						deputyTitle: this.deputyTitle,
						editorHtml: editorHtml,
						messVidio: '',
						type: 1
					})
				},1000)
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				// console.log('format', name, value)
				this.editorCtx.format(name, value)
		
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success")
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						console.log(res)
						uni.uploadFile({
							url: config.baseUrl + '/base/upload',
							filePath: res.tempFilePaths[0],
							name: 'file',
							header: {
								Authorization: this.token
							},
							success: (uploadFileRes) => {
								var fileRes = JSON.parse(uploadFileRes.data)
								console.log(fileRes)
								this.editorCtx.insertImage({
									src: `${this.baseUrl}`+fileRes.data,
									alt: '图像',
									success: function() {
										console.log('insert image success')
									}
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	@import "./editor-icon.css";
	.wrapper {
		padding: 10rpx;
	}
	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}
	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
	}
	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 30vh;
		height: auto;
		background: #fff;
		margin-top: 20px;
		font-size: 16px;
		line-height: 1.5;
	}
	.ql-active {
		color: #06c;
	}
</style>
