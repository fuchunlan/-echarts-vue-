<template>
  <div id="countryLine4" style="margin:1rem auto 0">
    <div  class="lineWrap">
      <div class="swiper-wrapper" >
        <div class="lineItem" style="width: 100%;height: 100%">
          <div class="itemInner" style="height: 100%">
            <div id="mainlyCountryCharts" style="height: 100%" ref="mainlyCountryCharts"></div>
          </div>
        </div>

      </div>
    </div>
    <div class="linePageNationSevenDay swiper-pagination-customs">
      <span class="swiper-pagination-custom" :class="{'active': flag == 1}" @click="changeChart(1)">
        每百万人<br>确诊数
      </span>
      <span class="swiper-pagination-custom" :class="{'active': flag == 2}" @click="changeChart(2)">
        累计确诊<br>七日增幅
      </span>
      <span class="swiper-pagination-custom" :class="{'active': flag == 3}" @click="changeChart(3)">
        海外国家<br>治愈率排行
      </span>
      <span class="swiper-pagination-custom" :class="{'active': flag == 4}" @click="changeChart(4)">
        海外国家<br>病死率排行
      </span>
    </div>
  </div>

</template>

<script>
export default {
  name:'mainlyCountryLine',
  data(){
    return{
      flag:1, //标记是第几个图表
      confirmMill: [], //每百万人确诊数
      weekCompRank:[], //累计确诊7日增幅
      healRate:[], //海外国家治愈率排行
      deadRate:[], //海外国家病死率排行
      title:{}, //图表标题,
      yAxisData:[],
      seriesData:[],
      visualMap: {},
      formatter:''
    }
  },
  mounted() {
    this.$axios.get('/nosymapi/automation/modules/list?modules=FAutoCountryWeekCompRank,FAutoContinentConfirmStatis,FAutoConfirmMillionRankList,FAutoHealDeadRateRankList')
    .then((res) => {
      let data = res.data.data

      this.confirmMill = data.FAutoConfirmMillionRankList.filter((item,index) => {
        if (index < 10) {
          return item
        }
      })
      this.confirmMill.reverse()
      this.weekCompRank = data.FAutoCountryWeekCompRank.reverse()
      this.healRate = data.FAutoHealDeadRateRankList.healHead.reverse()
      this.deadRate = data.FAutoHealDeadRateRankList.deadHead.reverse()
      // console.log(this.deadRate)
      this.handleData()
      this.$nextTick(() => { // 将回调延长到下次dom更新循环之后执行
        this.initChart6()
      })


    })
  },
  methods:{
    initChart6() {
      let mainlyCountryCharts = this.$echarts.init(this.$refs.mainlyCountryCharts)
      let option = {
        title:this.title,
        tooltip:{
          show:true,
          formatter:this.formatter
        },
        grid:{
          left:0,
          bottom:0,
          containLabel: true
        },
        visualMap:this.visualMap,
        xAxis: {

        },
        yAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 },
          data:this.yAxisData
        },
        series: {
          type: 'bar',
          data:this.seriesData
        }


      }
      mainlyCountryCharts.setOption(option,true)
    },
    // 处理图表数据
    handleData () {
      if (this.flag == 1) { //每百万人确诊数
        this.title = {
          text:'海外主要疫情国家-每百万人确诊数',
          subtext: '本表为感染率最为严重的国家'
        }
        this.visualMap = {
          show:false,
          dimension:0,
          min:45000,
          max:100000,
          inRange:{
            color:['#D7DA8B', '#E15457']
          }
        }
        this.formatter = ''
        this.yAxisData = this.confirmMill.map((item) =>{
          return item.nation
        })
        this.seriesData = this.confirmMill.map((item) => {
          return item.rate
        })
      } else if (this.flag == 2) {
        this.title = {
          text:'海外主要疫情国家-累计确诊七日增幅',
          subtext: '本表为最近一周增长增复读最快的国家'
        }
        this.formatter = '{b}:{c}%'
        this.visualMap = {
          show:false,
          dimension:0,
          min:20,
          max:38,
          inRange:{
            color:['#FFA657', '#F06161']
          }
        }
        this.yAxisData = this.weekCompRank.map(item => {
          return item.nation
        })
        this.seriesData = this.weekCompRank.map(item => {
          return item.rate
        })
      } else if (this.flag == 3) {
        this.title = {
          text:'海外主要疫情国家-治愈率TOP10',
          subtext: '本表只对累计确诊书大于1000的国家排序'
        }
        this.visualMap = {
          show:false,
          dimension:0,
          min:97,
          max:100,
          inRange:{
            color:['#6BD318', '#278E38']
          }
        }
        this.formatter = '{b}:{c}%'
        this.yAxisData = this.healRate.map(item => {
          return item.country
        })
        this.seriesData = this.healRate.map(item => {
          return item.healRate
        })
      } else {
        this.title = {
          text:'海外主要疫情国家-病死率TOP10',
          subtext: '本表只对累计确诊书大于1000的国家排序'
        }
        this.visualMap = {
          show:false,
          dimension:0,
          min:4,
          max:28,
          inRange:{
            color:['#3075B5', '#8A8C90']
          }
        }
        this.formatter = '{b}:{c}%'
        this.yAxisData = this.deadRate.map(item => {
          return item.country
        })
        this.seriesData = this.deadRate.map(item => {
          return item.deadRate
        })
      }
    },
    // 改变图表
    changeChart(id) {
      this.flag = id
      this.handleData()
      this.initChart6()


    }
  }
}
</script>

<style>
#countryLine4 .lineWrap{
  height: 350px;

}

.linePageNationSevenDay {
  margin: 2rem 0 0 5%;
}
.linePageNationSevenDay span{
  width: 24%;
}
.linePageNationSevenDay span.active {
  background-color: #eef4ff;
  border-color: #8fb8ff;
  color: #005def;
  font-weight: 500;
}
.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
  bottom: 10px;
  left: 0;
  /*width: 100%;*/
}
</style>
