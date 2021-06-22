<template>
  <div id="chinaTrend">
    <div class="lineWrap ">
      <div class="swiper-wrapper" style="transition-duration:0ms;transform:translate3d(0px,0px,0px)">
        <div class="lineItem swiper-slide" style="width: 100%;">
          <div class="itemInner">
            <div id="chart2-toImg" ref="chart2"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="line-pagination swiper-pagination-custom">
      <span class="swiper-pagination-customs" :class="{'active':chartIndex === 1}"
            @click="changeChart(1)">
        全国现有<br>确诊趋势
      </span>
      <span class="swiper-pagination-customs" :class="{'active':chartIndex === 2}"
            @click="changeChart(2)">
        全国疫情<br>新增趋势
      </span>
      <span class="swiper-pagination-customs" :class="{'active':chartIndex === 3}"
            @click="changeChart(3)">
        全国疫情<br>累计趋势
      </span>
      <span class="swiper-pagination-customs" :class="{'active':chartIndex === 4}"
            @click="changeChart(4)">
        治愈率<br>病死率
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name:'chartYiqingTrend',
  data(){
    return{
      chinaDayList:[], // 中国每日数据
      chinaDayAddList:[], // 中国每日新增数据
      chartIndex:1, // 展示的图表标记,1:现有确诊趋势,2:疫情新增趋势,3:疫情累计趋势,4:治愈率/病死率
      legendData:[], // 图例组件的data
      xAxisData:[], // x轴的data
      series:[], // series的内容
      chartTitle:'全国现有确诊趋势', //图表标题
    }
  },
  mounted(){
    this.$axios.get('/nosymapi/query/inner/publish/modules/list?modules=chinaDayList,chinaDayAddList,cityStatis,nowConfirmStatis,provinceCompare')
    .then((response)=>{
      this.chinaDayList = response.data.data.chinaDayList
      this.chinaDayAddList = response.data.data.chinaDayAddList
      this.handleDate()
      this.$nextTick(()=>{
        this.initChart2()
      })
    })

  },
  methods:{
    // 初始化折线图
    initChart2(){
      let chart2 = this.$echarts.init(this.$refs.chart2)
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function () {
        chart2.resize()
      })
      let option = {
        // Make gradient line here
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 400
        },
        title:{
          text: this.chartTitle
        },
        legend:{ //图例组件
          data:this.legend,
          left:0,
          top:'10%',
          textStyle:{
            fontSize:'12'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: this.xAxisData,
          axisLabel:{
            rotate:45,
            margin:15,
          },
        },
        yAxis: {
          axisLine:{show:false},//坐标轴轴线
          axisTick:{show:false},//坐标轴刻度
        },
        grid: {
          top:"21%",
          left:'15%',
          right: 0,
          bottom:"20%"
        },
        series: this.series
      }
      chart2.setOption(option,true)
    },
    // 处理数据
    handleDate(){
      this.series = []
      this.xAxisData = []
      this.legendData = []
      this.chartTitle= ''
      if (this.chartIndex === 1) { //全国现有确诊趋势
        this.xAxisData = this.chinaDayList.map(item => item.date)
        this.series=[
          {
            name:'现有确诊',
            type:'line',
            showSymbol: false,
            data: this.chinaDayList.map(item => item.nowConfirm)
          }
        ]
        this.legendData=['现有确诊']
        this.chartTitle= '现有确诊趋势'
      }else if (this.chartIndex === 2) { //全国疫情新增趋势
        this.xAxisData = this.chinaDayAddList.map(item => item.date)
        this.series= [
          {
            name:'新增确诊',
            type:'line',
            showSymbol: false,
            data:this.chinaDayAddList.map(item => item.confirm)
          },
          {
            name:'新增疑似',
            type:'line',
            showSymbol: false,
            data: this.chinaDayAddList.map(item => item.suspect)
          }
        ]
        this.legendData=['新增确诊','新增疑似']
        this.chartTitle= '全国疫情新增趋势'
      } else if (this.chartIndex === 3) { // 全国疫情累计趋势
        this.xAxisData = this.chinaDayList.map(item => item.date)
        this.series = [
          {
            name:'累计确诊',
            type:'line',
            showSymbol:false,
            data:this.chinaDayList.map(item => item.confirm)
          },
          {
            name:'累计治愈',
            type:'line',
            showSymbol:false,
            data:this.chinaDayList.map(item => item.heal)
          },
          {
            name:'累计死亡',
            type:'line',
            showSymbol:false,
            data:this.chinaDayList.map(item => item.dead)
          }
        ]
        this.legendData = ['累计确诊','累计治愈','累计死亡']
        this.chartTitle= '全国疫情累计趋势'
      } else { //治愈率病死率
        this.xAxisData = this.chinaDayList.map(item => item.date)
        this.series = [
          {
            name:'治愈率',
            type:'line',
            showSymbol:false,
            data:this.chinaDayList.map(item => item.healRate)
          },
          {
            name:'病死率',
            type:'line',
            showSymbol:false,
            data:this.chinaDayList.map(item => item.deadRate)
          }
        ]
        this.legendData=['治愈率','病死率']
        this.chartTitle= '全国治愈率/病死率趋势'
      }
    },
    // 根据index改变表格
    changeChart(index){
      this.chartIndex = index
      this.handleDate()
      this.initChart2()
    }
  }
}
</script>

<style>
.lineWrap{
  margin: 2rem auto 0;
  width: 90%;
  position: relative;
}
.swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform;
  transition-property: transform,-webkit-transform;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

#chart2-toImg{
  height: 60vw;
  max-height: 350px;
  width: calc(100% - 6.4vw);
}
.line-pagination {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: 1rem 0 0 5%;
  width: 90%;
}
#chinaTrend  .swiper-pagination-custom {
  bottom: 10px;
  left: 0;
  /* width: 100%; */
}
.line-pagination span.active {
  background-color: #eef4ff;
  border-color: #8fb8ff;
  color: #005def;
  font-weight: 500;
}
.line-pagination span {
  display: block;
  width: 24%;
  border: 1px solid #e9ebed;
  border-radius: .2rem;
  font-size: .5rem;
  line-height: 1rem;
  text-align: center;
  background-color: #f3f6f8;
  height: 2.5rem;
  padding-top: .5rem;
}
</style>
