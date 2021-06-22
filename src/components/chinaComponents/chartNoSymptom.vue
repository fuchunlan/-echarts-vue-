<template>
    <div id="chartNoSymptom">
        <div  class="lineWrap">
            <p class="swiper_b_l" :class="{'hide': isShowConfirm}" @click="changeChart"></p>
            <p class="swiper_b_r" :class="{'hide': !isShowConfirm}" @click="changeChart"></p>
            <div class="swiper-wrapper" >
              <div class="lineItem swiper-slide swiper-slide-active" style="width:100%;">
                <div class="itemInner">
                  <div id="chartNoSymptom-chart9-toImg" ref="chartNoSymptom"></div>
                </div>
              </div>
            </div>
        </div>
        <div class="syText " :class="{'current':isOpen}" v-if="isShowConfirm">
          <div class="inner">
            其他现有无症状感染者分布:
            <span v-for="(item,index) in noSymptomProv.confirm" v-if="index>=10">{{item.province+item.confirm+'例'}}
              <i v-if="index<noSymptomProv.confirm.length-1">,</i>
            </span>
            <span class="b_close" v-if="isOpen" @click="changeOpenorClose">收起</span>
          </div>
          <p class="b_open" v-if="!isOpen" @click="changeOpenorClose">展开</p>
        </div>
        <div class="line-pageniation-nosymptom line-pageniation-chartNoSymptom
        swiper-pageniation-custom">
            <span class="span-pageniation-customs" :class="{'active':isShowConfirm}"
                  @click="changeChart">
                现有<br>无症状感染者
            </span>
            <span class="span-pageniation-customs" :class="{'active':!isShowConfirm}"
                  @click="changeChart">
                新增<br>无症状感染者
            </span>
        </div>
    </div>
</template>

<script>
import bar from 'echarts/lib/chart/bar'
export default{
    name:'chartNoSymptom',
    data(){
        return {
          isShowConfirm: true, //是否展示新增无症状感染者
          noSymptomProv:{},//无症状感染省
          xData:[], // 柱状图x轴数组
          yDate:[], // 柱状图y轴数组
          title:'现有无症状感染者', // 图表title,
          isOpen:false, //其他无症状感染者分布,默认收起
          visualMap: {}

        }
    },
    methods:{
      //改变展示图表
      changeChart(){ //点击之后改变
        this.isShowConfirm = !this.isShowConfirm //先改变
        if(this.isShowConfirm) { // 现有
          this.getConfirm()
          this.title = '现有无症状感染者'
        }else { //新增
          this.getIncrease()
          this.title = '新增无症状感染者'
        }
        this.initChart()

      },
      // 获得现有无症状感染者对应x,y轴数组
      getConfirm(){
        this.xData = []
        this.yDate = []
        for (let i = 0; i < 10; i++) {
          let newxItem = this.noSymptomProv.confirm[i].province
          let newyItem = this.noSymptomProv.confirm[i].confirm
          this.xData.push(newxItem)
          this.yDate.push(newyItem)
        }
        this.visualMap = {
          show:false,
          min:10,
          max:60,
          inRange:{
            color:['#FF8C72', '#BD1416']
          }
        }

        //console.log(this.xData,this.yDate)
      },
      // 获得新增无症状感染者对应x,y轴数组
      getIncrease() {
        this.xData = []
        this.yDate = []
        // 处理数据，只展示每日新增无症状大于0的省份（展示数量是动态的）
        let newnosym = this.noSymptomProv.increase.filter((item) => {
          if (item.increase> 0) {
            return item
          }
        })
        for (let item of newnosym) {
          this.xData.push(item.province)
          this.yDate.push(item.increase)
        }
        this.visualMap = {
          show:false,
          min:0,
          max:5,
          inRange:{
            color:['#FF8C72', '#BD1416']
          }
        }
      },
      // 初始化无症状感染者柱状图
      initChart(){
        let chartNoSymptom = this.$echarts.init(this.$refs.chartNoSymptom)
        window.addEventListener('resize',function (){
          chartNoSymptom.resize() //监视屏幕变动,自动重绘
        })
        let option = {
          title: { // 标题
            text: this.title, textStyle:{fontWeight:600,}
          },
          tooltip:{show:true},
          grid:{ // canvas的布局
            left:'12%', right:0,
          },
          xAxis: { // x轴
            type: 'category', nameRotate:'180deg', axisTick:{show:false},
            axisLabel:{rotate:45, margin:20,}, data: this.xData //x轴数据
          },
          yAxis: { // 直角坐标系 grid 中的 y 轴
            axisLine:{show:false}, axisTick:{show:false}, type: 'value'
          },
          visualMap:this.visualMap,
          series: [{
            data: this.yDate, type: 'bar',
            barWidth:'10', //柱的宽度
            itemStyle:{ // 柱状体的样式
              emphasis:{ //悬停时的颜色
                color:'#FFD664'
              }
            },
          }]
        }
        chartNoSymptom.setOption(option)
      },
      // 改变展开或收起状态
      changeOpenorClose(){
        this.isOpen = !this.isOpen
      }
    },
    mounted() {
      this.$axios({
        method:'get',
        url:'/nosymapi/query/inner/publish/modules/list?modules=asymptomaticProvince'
      }).then((response)=>{
          this.noSymptomProv = response.data.data.asymptomaticProvince
          console.log(this.noSymptomProv)
          this.getConfirm()
          this.$nextTick(() => {
            this.initChart()
          })
      }).catch(err=> {
        alert('接口或处理逻辑错误')
      })
    }
}
</script>

<style>

.swiper_b_l,
.swiper_b_r {
    width: 4rem;
    height: 4rem;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    background-size: 100% 100%;
    z-index: 2;
}
.swiper_b_l {
    background-image: url(//mat1.gtimg.com/news/signin/v6/zhexian_left.png);
    left: -2rem;
}
.swiper_b_r {
    background-image: url(//mat1.gtimg.com/news/signin/v6/zhelian_right.png);
    right: -2rem;
}
.hide { /*是否展示.swiper_b_r和.swiper_b_l*/
    display: none;
}

.swiper-slide {
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform;
  transition-property: transform,-webkit-transform;
}
.swiper-container-android .swiper-slide, .swiper-wrapper {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
}
.lineItem{
  -ms-flex-negative: 0;
  flex-shrink: 0;
  position: relative;
  left: 0;
  right: 0;
  margin: auto;
}
.lineItem .itemInner{
  border: 1px solid #efefef;
  border-radius: .3rem;
  padding: 1rem 0 0;
}
#chartNoSymptom-chart9-toImg{
  height:60vw;
  max-height: 350px;
  width: calc(100% - 6.4vw)
}
.syText{
  margin: .5rem 5%;
  font-size: .3rem;
  line-height: 1rem;
  color: #a6a6a6;
  position: relative;
}
.syText.current .inner {
  overflow: auto;
  height: auto;
  word-wrap: break-word;
  white-space: normal;
  margin-right: 0;
}
.syText .inner{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 4.267vw;
  margin-right: 8vw;
}
.syText .b_close {
  color: #005def;
}
.syText .b_open{
  position: absolute;
  height: 1rem;
  line-height: 1rem;
  right: 0;
  top: 0;
  color: #005def;
}
.line-pageniation-nosymptom {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin: .5rem 0 0 5%;
    width: 90%;
}
.line-pageniation-nosymptom span {
    display: block;
    width: 49%;
    border: 1px solid #e9ebed;
    border-radius: .2rem;
    font-size: .5rem;
    line-height: 1rem;
    text-align: center;
    background-color: #f3f6f8;
    height: 2.5rem;
    padding-top: .3rem;
}
.line-pageniation-nosymptom span.active {
    background-color: #eef4ff;
    border-color: #8fb8ff;
    color: #005def;
    font-weight: 500;
}
</style>
