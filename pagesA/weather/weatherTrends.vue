<template>
	<view>
		<view class="row">
			<view class="head">
				<view class="text">15天趋势预报</view>
				<view class="weather-info">
					<view>
						<u-image src="../static/weather/sun.png" mode="widthFix" style="width: 100rpx;"></u-image>
					</view>
					<view>晴转小雨</view>
					<view>26°~32°</view>
				</view>
			</view>
			<view class="body">
				<scroll-view class="scroll" scroll-x>
						<view class="content ">
			
							<view class="background u-f-ac">
				
								<view class="item u-f-ajs" v-for="(item,index) in list" :key="item">
									
									<view class="top">
										<view class="day">
											<view>今天</view>
											<view>7月20日</view>
										</view>
										<view class="icon">
											<u-image src="../static/weather/sun-1.png" mode="widthFix" style="width: 80rpx;"></u-image>
										</view>
										<view class="weather">晴</view>
									</view>
									
									<view class="bottom">
										<view class="icon">
											<u-image src="../static/weather/sun-1.png" mode="widthFix" style="width: 80rpx;"></u-image>
										</view>
										<view class="weather">小雨</view>
										<view>东北风</view>
										<view>＜2级</view>
										<u-tag type="error" text="良" mode="light" shape="circle"  size="mini" style="transform: scale(0.7);" />
									</view>
									
								</view>
								
							</view>
							<!--折线图-->
				 			<view class="qiun-charts" >
								<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" ></canvas>
								<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" ></canvas>
							</view> 
						</view>
					</scroll-view>	
			</view>
		</view>
		
		
	
	</view>
</template>

<script>
	import uCharts from '@/utils/u-charts.js';
	var _self;
	var canvaLineA=null;
	var canvaLineB=null;
	export default {
		data() {
			return {
				//数据列表
				list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
				cWidth:'',
				cHeight:'',
				//图表缩放
				pixelRatio:1,
			}
		},
		onLoad() {
			_self = this;
			//#ifdef MP-ALIPAY
 			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			this.cWidth=uni.upx2px(2100);
			this.cHeight=uni.upx2px(200);
			this.getServerData();
		},
		methods:{
			getServerData(){
/* 				uni.request({
					url: 'https://www.ucharts.cn/data.json',
					data:{
					},
					success: function(res) {
						console.log(res.data.data)
						let LineA={categories:[],series:[]};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						LineA.categories=res.data.data.LineA.categories;
						LineA.series=res.data.data.LineA.series;
						_self.showLineA("canvasLineA",LineA);
					},
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				}); */
				let chartDataA = {
					//
					categories: ['2012', '2013', '2014', '2015', '2016', '2017','2016', '2017','2016', '2017','2016', '2017','2016', '2017','2016', ],
					series: [{
						/* name: '成交量A', */
						data: [35,32,33, 34,36,28,  36,28,32,27,35, 32, 33, 34, 36,],
						color: '#d7d7d7',
						//自定义显示的数据 可以通过data 实现
						format:(val)=>{return val.toFixed(0)+'℃'}
					}]
				}
				let chartDataB = {
					//
					categories: ['2012', '2013', '2014', '2015', '2016', '2017','2016', '2017','2016', '2017','2016', '2017','2016', '2017','2016', ],
					series: [{
					/* name: '成交量A', */
					data: [35,32,33, 34,36,28,36,28,32,27,35, 32, 33, 34, 36,],
					color: '#d7d7d7',
					//自定义显示的数据 可以通过data 实现
					format:(val)=>{return val.toFixed(0)+'℃'}
					}],
				}
				_self.showLineA("canvasLineA",chartDataA);
			},
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					//图表类型
					type: 'line',
					//图标所有字体大小
					fontSize:11,
					//转折据点辨识是否开启
					dataPointShape:true,
					//转折点空心
					dataPointShapeType:'hollow',
					//是否开启转折点数据显示
					dataLabel:true,
					//canvas 背景颜色
					background:'#FFFFFF',
					//图表缩放
					pixelRatio:_self.pixelRatio,
					//
					categories: chartData.categories,
					//
					series: chartData.series,
					//是否开启动画
					animation: false,
					//隐藏 X 轴下方图列
					legend:{show:false},
					xAxis: {
						//是否不绘制表格 默认开启
						disableGrid:true,
						//默认开启后下面的参数生效		
						//隐藏 X 轴标题
						/* disabled:true, */
						dataPointShape:false,
					},
					yAxis: {
						//是否不绘制表格 默认开启
 						disableGrid:true,
						splitNumber:1, 
						min:20,
						max:40,
						//隐藏 Y 轴标题
						disabled:true,
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					/* padding:'20', */
					//扩展配置
					extra: {
						//扩展类型
						line:{
							type: 'straight',
							//线宽度
							/* width:3 */
							//选择曲线
							/* type: 'curve' */
						},
					}
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.row{
		width: 750rpx;
		height: 100vh;
		background-color: #f8f8f8;
	}
	.head{
		display: flex;
		padding: 20rpx;
		.text{
			flex: 3;
			font-size: 50rpx;
		}
		.weather-info{
			flex: 1;
		}
	}
	.body{
		width: 710rpx;
		margin: 20rpx;
		.scroll{
		width: 710rpx;
			//主容器
			.content{
				width: 2100rpx;
				height: 700rpx;
				position: relative;
				//背景内容
				.background{
					position: absolute;
					top: 0;
					bottom: 0;
					width: 2100rpx;
					z-index: 1;
					.item{
						width: 138rpx;
						height: 700rpx;
						flex-flow: column;
						font-size: 24rpx;
						text-align: center;
						.top{
							flex: 3;			
						}
						.bottom{
							flex: 1;
						}
					}
				}
				//折线
				.qiun-charts {
					height: 200rpx;
					position: relative;
					top: 30%;
					left: -20rpx;
					.charts {
						width: 2100upx;
						height: 120upx;
					}
				}
			}
		}
	}
</style>
