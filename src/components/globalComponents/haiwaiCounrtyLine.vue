<template>
  <div id="haiwaiChartLine1">
    <div  class="lineWrap">
      <div class="swiper-wraper">
        <!--      <div class="lineItem swiper-slide" style="width: 335px;margin-right: 40px">-->
        <div class="lineItem swiper-slide" >
          <div class="itemInner">
            <div id="haiwaiCountryCharts" ref="haiwaiCountryCharts"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="linePageNationhw1 swiper-pagination-custom">
      <span class="swiper-pagination-customs" :class="{'active':!isShow24}" @click="changeChart">
        海外多国<br>累计趋势
      </span>
      <span class="swiper-pagination-customs" :class="{'active':isShow24}" @click="changeChart">
        24小时新增<br>确诊TOP10
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'haiwaiCountryLine',
  data() {
    return {
      haiwaiCountryConfirm: {}, //海外多国累计趋势
      message:{},
      confirmAdd: [], //24小时新增数据
      isShow24: false, // 是否显示24小时新增TOP10
      seriesData: [], //表格series的数据
      xAxisData: [], // x轴的数组
      legendData: ['俄罗斯', '巴西', '德国', '意大利', '法国', '美国', '英国', '西班牙'],
      elsVal: [],
      bxVal: [],
      dgVal: [],
      ydlVal: [],
      fgVal: [],
      mgVal: [],
      ygVal: [],
      xbyVal: [],
      title:'',
    }
  },
  mounted() {
    this.$axios.get('/nosymapi/automation/modules/list?modules=FAutoCountryMerge')
      .then((response) => {
        this.haiwaiCountryConfirm = response.data.data.FAutoCountryMerge
        this.getseriesDataVaule()
        this.handleChartData()
        this.$refs.haiwaiCountryCharts.resize
        this.$nextTick(() => {
          this.initChart5()
        })
      })
    this.$axios.get('/nosymapi/automation/modules/list?modules=FAutoGlobalStatis,FAutoContinentStatis,FAutoGlobalDailyList,FAutoCountryConfirmAdd')
      .then(res => {
        this.message= res.data.data.FAutoCountryConfirmAdd

        this.handle24Data()

      })
  },
  methods: {
    //初始化海外多国趋势折线图
    initChart5() {
      let haiwaiCountryCharts = this.$echarts.init(this.$refs.haiwaiCountryCharts)
      let option = {
        // Make gradient line here
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 10900,
          max: 170000,
          inRange:{
            color:['#FF8C72', '#BD1416']
          }
        },
        title: {
          text: this.title
        },
        legend: { //图例组件
          data: this.legendData,
          left: 10,
          top: '8%',
          textStyle: {
            fontSize: '12'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: this.xAxisData,
          axisLabel: {
            rotate: 45,
            margin: 15,
          },
        },
        yAxis: {
          axisLine: {show: false},//坐标轴轴线
          axisTick: {show: false},//坐标轴刻度
        },
        grid: {
          top: "25%",
          left: 10,
          right: 10,
          bottom: 0,
          containLabel: true // 包含
        },
        series: this.seriesData
      }
      haiwaiCountryCharts.setOption(option, true)
    },
    // 处理表格data
    handleChartData() {
      if (this.isShow24) {
        this.title = '24小时新增确诊国家TOP10'
        this.xAxisData = this.confirmAdd.map(item=> item.name)
        console.log(this.confirmAdd)
        console.log(this.xAxisData)
        this.seriesData = [{
          type:'bar',
          showSymbol: false,
          data:this.confirmAdd.map(item => item.add)
        }]

      } else {
        this.title = '海外多国累计趋势'
        this.xAxisData = []
        this.haiwaiCountryConfirm.巴西.list.forEach((item, index) => {
          if (index > 3) {
            this.xAxisData.push(item.date)
          }
        })
        this.seriesData = [
          {
            name: '俄罗斯',
            type: 'line',
            showSymbol: false,
            data: this.elsVal
          },
          {
            name: '巴西',
            type: 'line',
            showSymbol: false,
            data: this.bxVal
          },
          {
            name: '德国',
            type: 'line',
            showSymbol: false,
            data: this.dgVal
          },
          {
            name: '意大利',
            type: 'line',
            showSymbol: false,
            data: this.ydlVal
          },
          {
            name: '法国',
            type: 'line',
            showSymbol: false,
            data: this.fgVal
          },
          {
            name: '美国',
            type: 'line',
            showSymbol: false,
            data: this.mgVal
          },
          {
            name: '英国',
            type: 'line',
            showSymbol: false,
            data: this.ygVal
          },
          {
            name: '西班牙',
            type: 'line',
            showSymbol: false,
            data: this.xbyVal
          },
        ]
      }


    },
    // 获取series中的data数据
    getseriesDataVaule() {
      this.elsVal = [], this.bxVal = [], this.dgVal = [], this.ydlVal = []
      this.fgVal = [], this.mgVal = [], this.ygVal = [], this.xbyVal = []
      this.haiwaiCountryConfirm.俄罗斯.list.forEach((item, index) => {
        if (index > 29) {
          this.elsVal.push(item.confirm)
        }
      })
      this.haiwaiCountryConfirm.巴西.list.forEach((item, index) => {
        if (index > 3) {
          this.bxVal.push(item.confirm)
        }
      })
      this.haiwaiCountryConfirm.德国.list.forEach((item, index) => {
        if (index > 32) {
          this.dgVal.push(item.confirm)
        }
      })
      this.haiwaiCountryConfirm.意大利.list.forEach((item, index) => {
        if (index > 29) {
          this.ydlVal.push(item.confirm)
        }
      })
      this.haiwaiCountryConfirm.法国.list.forEach((item, index) => {
        if (index > 32) {
          this.fgVal.push(item.confirm)
        }
      })
      this.haiwaiCountryConfirm.美国.list.forEach((item, index) => {
        if (index > 32) {
          this.mgVal.push(item.confirm)
        }
      })
      this.haiwaiCountryConfirm.英国.list.forEach((item, index) => {
        if (index > 29) {
          this.ygVal.push(item.confirm)
        }
      })
      this.haiwaiCountryConfirm.西班牙.list.forEach((item, index) => {
        if (index > 28) {
          this.xbyVal.push(item.confirm)
        }
      })
    },
    // 改变表格
    changeChart() {
      this.isShow24 = !this.isShow24
      this.handleChartData()
      this.initChart5()
    },
    // 处理24小时新增数据
    handle24Data() {
      this.confirmAdd = []
      // 把对象变为数组
      for (let name in this.message) {
        let newItem = {
          name: name,
          add: this.message[name]
        }
        this.confirmAdd.push(newItem)
      }
      //对数组进行排序
      this.confirmAdd.sort(this.createComparisonFunction('add'))
      // 对数组进行过滤,只留下10个
      this. confirmAdd = this.confirmAdd.filter((item,index) => {
        if (index < 10) {
          return item
        }
      })
      console.log(this.confirmAdd)
    },
    // 比较函数
    createComparisonFunction(propertyName) {
      return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
          return 1;
        } else if (value1 > value2) {
          return -1;
        } else {
          return 0;
        }
      }
    }

  }
}

</script>

<style >
#haiwaiChartLine1 {

}
#haiwaiChartLine1 .lineWrap{
  margin-top: 0;
  margin: 1rem auto 0;
  width: 90%;
  position: relative;
}
#haiwaiChartLine1 .swiper-wraper {
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
.lineItem{
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.lineItem .itemInner{
  /*height: 100%;*/
}
#haiwaiCountryCharts{
  height: 350px;
}
.linePageNationhw1,
.linePageNationSevenDay{
  display: flex;
  justify-content: space-between;
  margin: 1rem 0 0 5%;
  width: 90%;
}
.linePageNationhw1 span,
.linePageNationSevenDay span{
  display: block;
  width: 49%;
  border: 1px solid #e9ebed;
  border-radius: .2rem;
  font-size: .5rem;
  text-align: center;
  background-color: #f3f6f8;
  height: 2.5rem;
  padding: .5rem 0;
}
.linePageNationhw1 span.active {
  background-color: #eef4ff;
  border-color: #8fb8ff;
  color: #005def;
  font-weight: 500;
}
</style>
