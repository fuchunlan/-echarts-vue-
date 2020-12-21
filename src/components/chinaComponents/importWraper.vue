<template>
  <div id="importWraper" lazy>
<!-- 境外输入趋势-->
<!--    <div id="importTrend"></div>-->
    <div id="chartImport" class="lineWrap">
      <div class="swiper-wrapper">
        <div class="lineItem swiper-slide">
          <div class="itemInner">
            <div id="importChart" ref="importChart">
            </div>
          </div>
          <p class="more" @click="openMore">more</p>
        </div>
      </div>
    </div>
    <div class="moreWraper" v-if="isShowMore" >
      <div class="cover">
        <div class="banner"></div>
        <h1>境外输入</h1>
        <h2>肺炎疫情实时播报</h2>
        <el-button class="back" @click="isShowMore = false">实时疫情地图</el-button>
        <el-card class="box-card">
          <div class="box-card-items">
            <div class="card-item">
              新增确诊
              <span>{{listTotal.chinaTotal.today.input}}</span>
            </div>
            <div class="card-item">
              累计确诊
              <span>{{listTotal.chinaTotal.total.input}}</span>
            </div>
            <div class="card-time">{{listTotal.lastUpdateTime}}</div>
          </div>
        </el-card>
        <!--境外输入来源-->
        <div id="importSource" v-loading="loading" element-loading-text="积极防护，保护自己，戴口罩，勤洗手">
          <div class="swiper-wrapper">
            <div class="lineItem swiper-slide">
              <div class="itemInner">
                <div id="sourceChart" ref="sourceChart">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 境外输入检疫措施-->
        <div id="checkMeasure">
          <div class="main_title">
            部分地区入境检疫措施
          </div>
          <div class="measure_container">
            <div class="measure_item">
              <h3>
                <span>上海</span>
                入境流程
              </h3>
              <p class="desc">所有入境来沪人员一律实施为期14天的集中隔离健康观察。对老人、未成年人、孕产妇等原因不适宜集中隔离的人员，统一在各区留验点进行核酸检测，结果为阴性且具备居家隔离条件的，经审批后可申请居家隔离。</p>
              <p class="info"></p>
            </div>
            <div class="measure_item">
              <h3>
                <span>广东</span>
                入境流程
              </h3>
              <p class="desc">境外入粤人员无论外国公民还是中国公民，均一视同仁，一律实施14天居家或集中隔离医学观察。</p>
              <p class="info">集中隔离费用自理</p>
            </div>
          </div>
        </div>
      </div>




    </div>
  </div>
</template>

<script>

export default {
  name:'importWraper',
  data(){
    return{
      listTotal:[], //总数据
      dataList:[],//每日数量
      isShowMore:false,
      loading:true,
      sourceList:[],//来源数组
      nodeList:[]
    }
  },
  mounted() {
    this.$axios.get('wyapi/wuhan/app/data/list-total?t=321633448525')
    .then(res => {
      this.listTotal = res.data.data
      this.dataList = this.listTotal.chinaDayList
      this.$nextTick(() => {
        this.initImportChart()
      })
    })

  },
  methods:{
    initImportChart() {
      let importChart = this.$echarts.init(this.$refs.importChart)
      window.addEventListener('resize',function (){
        importChart.resize()
      })
      let option = {
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 400
        },
        title:{
          text:'境外输入疫情趋势'
        },
        legend:{ //图例组件
          data:['境外输入累计确诊','境外输入新增确诊'],
          top:'10%',
          left:0,
          textStyle:{
            fontSize:'12'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: this.dataList.map(item => item.date.substring(5)),
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
          bottom:"20%",
        },
        series: [
          {
            name:'境外输入累计确诊',
            type:'line',
            showSymbol: false,
            data:this.dataList.map(item => item.total.input)
          },
          {
            name:'境外输入新增确诊',
            type:'line',
            showSymbol: false,
            data: this.dataList.map(item => item.today.input)
          }
        ]
      }
      importChart.setOption(option,true)
    },
    initsourceChart() {
      let sourceChart = this.$echarts.init(this.$refs.sourceChart)
      window.addEventListener('resize',function (){
        sourceChart.resize()
      })
      let option = {
        title: {
          text: '境外输入确诊病例来源'
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
        },

        series: [
          {
            type: 'sankey',
            data: this.nodeList,
            links: this.sourceList,
            focusNodeAdjacency: 'allEdges',
            right:0,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#aaa'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.5
            }
          }
        ]
      }
      sourceChart.setOption(option,true)
    },
    // 打开more面板之后获取数据,并初始化图表
    openMore (){
      this.isShowMore = true
      this.$axios.get('wyapi/wuhan/app/index/input-data-list?t=321633448523')
        .then(res => {
          this.loading = false
          this.sourceList = res.data.data.list
          this.handleNode()
          // console.log(this.sourceList,this.nodeList)
          this.$nextTick(() => {
            this.initsourceChart()
          })
        })
    },
    handleNode(){
      this.nodeList = []
      this.sourceList.forEach(item=> {
        if (this.nodeList.indexOf(item.source) < 0) {
          this.nodeList.push(item.source)
        }
        if (this.nodeList.indexOf(item.target) < 0) {
          this.nodeList.push(item.target)
        }
      })
      let node = []
      this.nodeList.map(item => {
        let newNode = {name:item}
        node.push(newNode)
      })
      this.nodeList = node
      // console.log(this.nodeList)
    }

  }
}
</script>

<style >
.more{
  color: #005def;
  position: absolute;
  top: 1rem;
  right: 1rem;
}
#importChart{
  height:60vw;
  max-height: 350px;
  width: calc(100% - 6.4vw)
}
.moreWraper{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  max-width: 752px;
  margin:auto;
  background: #ffffff;
  z-index: 4;
}
/*设置滚动条样式*/
.moreWraper::-webkit-scrollbar {
  width: 1px;
  /*height: 4px;*/
}
.moreWraper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
.moreWraper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
.cover {
  position: relative;
  border: 1px solid #E2E9F3
}
.banner {
  display: block;
  width: 100%;
  height: 13rem;
  background: url("../../assets/images/banner.jpg") no-repeat ;
  background-size: 100%;
}
.cover h1, .cover h2 {
  position: absolute;
  color: #fff;
}
.cover h1 {
  left: 2rem;
  top: 4rem;
  font-family: -apple-system-font,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: 700;
}
.cover h2 {
  left: 2rem;
  top: 6rem;
  font-family: -apple-system-font,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial;
  font-size: 1.5rem;
  font-weight: 700;
}
.el-card__body {
padding: 0;
}
.box-card {
  position: absolute;
  top: 11rem;
  left: 5%;
  width: 90%;
  background: #ffffff;
  border-radius:.5rem;
  box-shadow: 0 0 1rem rgba(0,0,0,.1);
}
.card-item{
  float: left;
  width: 50%;
  line-height: 3rem;
  text-align: center;
  font-family: -apple-system-font,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
}
.card-item span {
  font-family: DIN Alternate,din_alternate_bold;
  font-size: 1.5rem;
  color: #a31d13;
}
.card-time{
  font-size: .3rem;
  line-height: 1rem;
  text-align: center;
  color: #a9a9a9;
}
#importSource{
  position: relative;
  top: 3rem;
  width: 90%;
  left: 5%;
}
#sourceChart{
  height:1000px;

  width: calc(100% - 6.4vw)
}
.el-button{
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(86,112,166,.5);
  border-radius: 25px;
  color: #fff;
  line-height: .5rem;
  padding: 12px 10px;
}
.el-button:active {
  color: #3a8ee6;
  background: rgba(86,112,166,.5);
  outline: 0;
}
.el-button:hover{
  color: #3a8ee6;
  background: rgba(86,112,166,.5);
  outline: 0;
}
#checkMeasure{
  position: relative;
  padding: 4rem 0 1rem;
}
.main_title {
  position: relative;
  height: 2rem;
  padding: 0 5%;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: -apple-system-font,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial;
  color: #333;
}
.measure_container{
  width: 90%;
  margin: 0 auto;
}
.measure_item {
  margin-bottom: 1rem;
  background-color: #f4f4f4;
  border-radius: .5rem;
  padding: 1rem ;
}
.measure_item h3 {
  height: 1.5rem;
  width: auto;
  padding-left: 1rem;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAoCAMAAAAxD9EeAAAAjVBMVEUAAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAADhAAD/////9PTnNS73p6P/+vr95eX+5uTtXlj2pqE/t1RfAAAAJXRSTlMABPT6yrFb8OHbt5R7SDEq1G9lEgrt6MTAhnZqWVI6K6maURwRxOdYEQAAARBJREFUOMt9kVd2gzAQRZ9AVFMN7i1Nppr9Ly+Rk2iOjMT9kt49mmEYEPnRiwIRRN4xx5wLFwS/QCffCZ2dVsN3xCuOT7oUJkr1Wpj5q3BzLN65Sc24sLGX/izspAAKurbT0A9TSwEHMro9mrukeVCUIaHXUksaqpAgVufu/s+kshihOo/KDyoLQcP3yvf0CyAW37vYGPp3KtuCL34/x2px/nd8CKLtxn7sWm2FtSvsuBXwtuBjAOmCPwNgkVVvGX5YW30CSR1adFDhycniD/iFFUa9+YLEOkIJhWfQBSP/Gcz9lbRpxhVJU4eo1n0V6ovJ8MJV2+MaM3xzcyJR2mMwcSBt5uQ+izPYyGJnn2rJN80lfkRLfhEIAAAAAElFTkSuQmCC) no-repeat;
  background-size: 1rem;
  font: 500 1.1rem/1.1rem -apple-system-font,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial;
  color: #999;
}
.measure_item h3 span {
  color: #cf2b1e;
}
.measure_item .desc {
  margin-top: .5rem;
  color: #666;
  font: .94rem/1.3rem -apple-system-font,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial;
}
.measure_item .info {
  margin-top: 1rem;
  color: #333;
  font: 500 .9rem/1rem  -apple-system-font,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial;
}
</style>
