<template>
  <div>
    <div id="topdataWrap">
      <div class="timeNum">
        <p class="d">统计截至
          <span>{{message.lastUpdateTime}}</span>
          <em>更新于<span>{{lastTimeFromNow}}</span>前</em>
        </p>
      </div>
      <div class="recentNumber">
        <div class="icbar confirm">
          <div class="add">较上日
            <span>{{message.chinaAdd.confirm > 0 ? '+'+message.chinaAdd.confirm : message.chinaAdd.confirm}}</span>
          </div>
          <div class="number">{{message.chinaTotal.confirm}}</div>
          <div class="text">累计确诊</div>
        </div>
        <div class="icbar heal">
          <div class="add">较上日
            <span>{{message.chinaAdd.heal >0 ? '+'+message.chinaAdd.heal : message.chinaAdd.heal}}</span>
          </div>
          <div class="number">{{message.chinaTotal.heal}}</div>
          <div class="text">累计治愈</div>
        </div>
        <div class="icbar dead">
          <div class="add">较上日
            <span>{{message.chinaAdd.dead >0 ? '+'+message.chinaAdd.dead : message.chinaAdd.dead}}</span>
          </div>
          <div class="number">{{message.chinaTotal.dead}}</div>
          <div class="text">累计死亡</div>
        </div>
        <div class="icbar nowConfirm">
          <div class="add">较上日
            <span>{{message.chinaAdd.nowConfirm >0 ? '+'+message.chinaAdd.nowConfirm : message.chinaAdd.nowConfirm}}</span>
          </div>
          <div class="number">{{message.chinaTotal.nowConfirm}}</div>
          <div class="text">现有确诊</div>
        </div>
        <div class="icbar nowSevere">
          <div class="add">较上日
            <span>{{message.chinaAdd.noInfect >0 ? '+'+message.chinaAdd.noInfect : message.chinaAdd.noInfect}}</span>
          </div>
          <div class="number">{{message.chinaTotal.noInfect}}</div>
          <div class="text">无症状感染者</div>
        </div>
        <div class="icbar import">
          <div class="add">较上日
            <span>{{message.chinaAdd.importedCase >0 ? '+'+message.chinaAdd.importedCase : message.chinaAdd.importedCase}}</span>
          </div>
          <div class="number">{{message.chinaTotal.importedCase}}</div>
          <div class="text">境外输入</div>
        </div>
      </div>
    </div>
    <div id="chinaMapWrap">
      <div class="chmap">
        <div id="chmap" ref='chmap'></div>
      </div>
      <div class="chinamapbtns">
        <span :class="{'current':isCurrent}" @click="showCurrent">现有确诊</span>
        <span :class="{'current':!isCurrent}" @click="showTotal">累计确诊</span>
      </div>
    </div>
    <chartNoSymptom/>
    <import-wraper/>
    <chartYiqingTrend/>
    <div id="chinaListWraper">
      <div class="up-tips tips-yiqing">
        <span class="title">中国疫情(包括港澳台)</span>
      </div>
      <span class="tips">7:00-10:00为更新高峰,数据如有滞后请谅解.</span>
      <div class="listNav hide" >
        <div class="table">
          <div class="thead">
            <div class="tr">
              <div class="th area">
                <span>地区</span>
              </div>
              <div class="th">现有确诊</div>
              <div class="th">累计确诊</div>
              <div class="th">治愈</div>
              <div class="th">死亡</div>
              <div class="th">疫情</div>
            </div>

          </div>
        </div>
      </div>
      <div id="listWraper" class="listWraper">
        <div class="table">
          <div class="thead">
            <div class="tr">
              <div class="th area">
                <span>地区</span>
              </div>
              <div class="th">现有确诊</div>
              <div class="th">累计确诊</div>
              <div class="th">治愈</div>
              <div class="th">死亡</div>
              <div class="th">疫情</div>
            </div>
          </div>
        </div>
        <div class="table" ref="provinceTable">
          <div class="tbody" v-for="(province,index) in provinceData" :key="index" >
            <div class="tr areaBox" @click="changeDetailArea(index)" >
              <div class="th area">
                <p>
                  <span>{{ province.name }}</span>
                </p>
                <p></p>
              </div>
              <div class="td">
                <p class="bold">{{province.total.nowConfirm}}</p>
                <p></p>
              </div>
              <div class="td confirmId">
                <p class="bold">{{province.total.confirm}}</p>
                <p>{{province.today.confirm > 0 ? '较上日+'+province.today.confirm : province.today.confirm+'新增'}}</p>
              </div>
              <div class="td">
                <p class="bold">{{province.total.heal}}</p>
                <p></p>
              </div>
              <div class="td">
                <p class="bold">{{province.total.dead}}</p>
                <p></p>
              </div>
              <div class="td detail" @click="openArea(index)">
                <p v-if="province.children.length > 1">
                  详情
                </p>
                <p></p>
              </div>
            </div>
            <div class="tr city hide" v-for="(detailArea,index) in province.children" :key="index">
              <div class="th area small">
                <span>{{detailArea.name}}</span>
              </div>
              <div class="td">{{detailArea.total.nowConfirm}}</div>
              <div class="td">{{detailArea.total.confirm}}</div>
              <div class="td">{{detailArea.total.heal }}</div>
              <div class="td">{{detailArea.total.dead}}</div>
              <div class="td"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="areaDetailWraper" v-if="isShowArea"><!--省市的具体疫情信息-->
      <div class="area-head">
        <p class="back" @click="isShowArea = !isShowArea"></p>
        <p class="bg" style="background-image: url('https://mat1.gtimg.com/news/feiyanarea/area_head_bg.png')"></p>
        <p class="qs">
            <span>
              数据来源:腾讯API
            </span>
        </p>
        <el-dropdown class="btns">
            <span class="el-dropdown-link">
              切换省市<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(province,index) in provinceData" :key="index"
                              :disabled="province.children.length == 1"
                              @click.native="selectArea(index)"
            >{{ province.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="area-titles">
          <p class="h3"></p>
          <p class="h2">
            <span>{{ areaData.name }}</span>

          </p>
        </div>
      </div>
      <div class="area-topdateWrap">
        <div class="timeNum">
          <p class="d">
            统计截至 <span>{{message.lastUpdateTime}}</span>
          </p>
        </div>
        <div class="recentNumber add">
          <div class="icbar nowConfirm">
            <p class="add">
              较上日
              <span class="addnum"> {{ areaAddData[areaName].nowConfirm>= 0 ? '+'+areaAddData[areaName].nowConfirm : areaAddData[areaName].nowConfirm}} </span>
            </p>
            <div class="number">{{ areaData.total.nowConfirm }}</div>
            <div class="text">现有确诊</div>
          </div>
          <div class="icbar confirm">
            <p class="add">
              较上日
              <span class="addnum">{{ areaAddData[areaName].confirm>= 0 ? '+'+areaAddData[areaName].confirm : areaAddData[areaName].confirm}}</span>
            </p>
            <div class="number">{{ areaData.total.confirm }}</div>
            <div class="text">累计确诊</div>
          </div>
          <div class="icbar heal">
            <p class="add">
              较上日
              <span class="addnum">{{ areaAddData[areaName].heal>= 0 ? '+'+areaAddData[areaName].heal : areaAddData[areaName].heal}}</span>
            </p>
            <div class="number">{{ areaData.total.heal }}</div>
            <div class="text">累计治愈</div>
          </div>
          <div class="icbar dead">
            <p class="add">
              较上日
              <span class="addnum">{{ areaAddData[areaName].dead>= 0 ? '+'+areaAddData[areaName].dead : areaAddData[areaName].dead}} </span>
            </p>
            <div class="number">{{ areaData.total.dead }}</div>
            <div class="text">累计死亡</div>
          </div>
        </div>
      </div>
      <div class="areaMapWrapper">
        <div class="areaMap">
          <div class="mapInnerFlex">
            <div id="areaMapInner2" class="areaMapInner" ref="areaMap"></div>
          </div>
          <div class="areaMapBtns">
            <span :class="{'current' : isShowTodayinArea}" @click="changeAreaTodayOrTotal(1)">现有确诊</span>
            <span :class="{'current': !isShowTodayinArea}" @click="changeAreaTodayOrTotal(2)">累计确诊</span>
          </div>

        </div>
      </div>


    </div>
  </div>
</template>


<script>

import china from 'echarts/map/js/china' // 引入中国地图
import 'echarts/map/js/province/anhui'
import 'echarts/map/js/province/aomen'
import 'echarts/map/js/province/beijing'
import 'echarts/map/js/province/chongqing'
import 'echarts/map/js/province/fujian'
import 'echarts/map/js/province/gansu'
import 'echarts/map/js/province/guangdong'
import 'echarts/map/js/province/guangxi'
import 'echarts/map/js/province/guizhou'
import 'echarts/map/js/province/hainan'
import 'echarts/map/js/province/hebei'
import 'echarts/map/js/province/heilongjiang'
import 'echarts/map/js/province/henan'
import 'echarts/map/js/province/hubei'
import 'echarts/map/js/province/hunan'
import 'echarts/map/js/province/jiangsu'
import 'echarts/map/js/province/jiangxi'
import 'echarts/map/js/province/jilin'
import 'echarts/map/js/province/liaoning'
import 'echarts/map/js/province/neimenggu'
import 'echarts/map/js/province/ningxia'
import 'echarts/map/js/province/qinghai'
import 'echarts/map/js/province/shandong'
import 'echarts/map/js/province/shanghai'
import 'echarts/map/js/province/shanxi1'
import 'echarts/map/js/province/shanxi'
import 'echarts/map/js/province/sichuan'
import 'echarts/map/js/province/taiwan'
import 'echarts/map/js/province/tianjin'
import 'echarts/map/js/province/xianggang'
import 'echarts/map/js/province/xinjiang'
import 'echarts/map/js/province/xizang'
import 'echarts/map/js/province/yunnan'
import 'echarts/map/js/province/zhejiang'

import chartNoSymptom from '../chinaComponents/chartNoSymptom'
import importWraper from "../chinaComponents/importWraper";
import chartYiqingTrend from "../chinaComponents/chartYiqingTrend";
export default{
  name:'chinaWraper',
  data(){
    return {
      message:{},
      isCurrent: true,
      formatter: '现有确诊',
      dataList: [],
      provinceData:[], // 城市数据
      isShowArea: false, // 是否展示地区详情模块
      areaIndex:'', //地区index,
      areaName:'', //地区名
      areaData:{},// area的数据
      areaAddData: {}, //area的新增数据
      areaMapList:[], // area地图的data
      isShowTodayinArea: true, //are地图中是否显示现有确诊
      areaSeriesName :'现有确诊', // area地图的formatter
    }
  },
  props:{
    loading:{type:Boolean},
    closeLoading:{type:Function}
  },
  computed:{
    lastTimeFromNow(){
      let now = Date.now()
      let lastTime = new Date(this.message.lastUpdateTime).getTime()
      let diff = new Date(now -lastTime).getTime()
      let hour = Math.floor(diff/1000/60/60)
      let min = Math.floor((diff - hour*1000*60*60)/60/1000)
      if (hour) {
        return hour+'小时'+min+'分'
      }else{
        return min+'分'
      }
    }
  },
  methods: {
    showCurrent(){
      this.isCurrent = !this.isCurrent
      this.formatter = '现有确诊'
      // 修改dataList到现有确诊
      this.getTodayList()
      this.initChart()
    },
    showTotal(){
      this.isCurrent = !this.isCurrent
      this.formatter = '累计确诊'
      // 修改dataList到累计确诊
      this.getTotalList()
      this.initChart()
    },
    // 获取现有确诊的数组
    getTodayList(){
      this.dataList = []
      for (let province of this.message.areaTree[0].children) {
        let name = province.name
        let value = province.total.nowConfirm
        let newToday = {
          name,
          value
        }
        this.dataList.push(newToday)
      }
    },
    // 获取累计确诊的数组
    getTotalList(){
      this.dataList = []
      for (let province of this.message.areaTree[0].children) {
        let name = province.name
        let value = province.total.confirm
        let newTotal = {
          name,
          value
        }
        this.dataList.push(newTotal)
      }
    },
    // 初始化中国地图
    initChart(){
      let chmap = this.$echarts.init(this.$refs.chmap)
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function () {
        chmap.resize()
      })
      let option = {
        tooltip: { // 提示框组件
          trigger: 'item',textStyle:{fontSize:'14'},
          formatter: '{b}<br/>'+this.formatter+'{c} ',
        },
        toolbox:{ // 工具栏
          show:true, feature:{restore:{},}
        },
        visualMap: { // 视觉映射组件
          type: 'piecewise',
          pieces: [
            {min: 10000, max: 100000, label: '10000人及以上', color: '#7F1100'},
            {min: 1000, max: 9999, label: '1000-9999人', color: '#BD1316'},
            {min: 500, max: 999, label: '500-999人', color: '#E64B45'},
            {min: 100, max: 499, label: '100-499人', color: '#FF8C71'},
            {min: 10, max: 99, label: '10-99人', color: '#FDD2A0'},
            {min: 1, max: 9, label: '1-9人', color: '#FFF2CF'},
            {min: 0, max: 0, label: '0人', color: '#FFFFFF'},
          ],
          textStyle:{fontSize:10},
          itemGap:1,
        },
        grid:{ // 直角坐标系内绘图网格
          bottom:0, top:0, containLabel: true // 包含
        },
        series: [ // 系列列表
          {
            name: '确诊数',
            type: 'map',
            map: 'china',
            roam:true,
            label: {
              show: true,
              fontSize: '10px',
            },
            data: this.dataList
          }
        ]
      }
      chmap.setOption(option)
    },
    // 切换是否展示具体地区疫情
    changeDetailArea(index){
      let detailAreaBoxs = this.$refs.provinceTable.children[index].querySelectorAll('.city')
      let tbodyBox = this.$refs.provinceTable.children[index]
      //console.log(tbodyBox)
      let className = detailAreaBoxs[0].className
      //console.log(detailAreaBoxs)
      for (let detailAreaBox of detailAreaBoxs) {
        if (className.includes('hide')){
          detailAreaBox.className = 'tr city'
          tbodyBox.className = 'tbody current'
        }else{
          detailAreaBox.className = 'tr city hide'
          tbodyBox.className = 'tbody'
        }
      }
    },
    // 展示area详情
    openArea(index) {
      this.isShowArea = !this.isShowArea
      this.areaIndex = index
      this.areaData = this.provinceData[index]
      console.log('areaData',this.areaData)
      this.areaName = this.areaData.name
      console.log('areaName',this.areaName)
      console.log('areaIndex',this.areaIndex)
      this.getTodayareaMapList()
      this.$nextTick(() => {
        this.initAreaMap()
      })
    },
    // 选择area
    selectArea(index){
      this.areaIndex = index
      //console.log(this.areaIndex)
      this.areaData = this.provinceData[index]
      this.areaName = this.areaData.name
      if(this.isShowTodayinArea) { // 现有确诊
        this.getTodayareaMapList()
      }else {
        this.getTotalareaMapList()
      }
      this.initAreaMap()
    },
    // 获取现有确诊的areaMapList
    getTodayareaMapList() {
      this.areaMapList = []
      for (let area of this.areaData.children) {
        let name = area.name
        let value = area.total.nowConfirm
        let newArea = {
          name,
          value
        }
        this.areaMapList.push(newArea)
      }
      console.log('现有确诊,areaMapList',this.areaMapList)
    },
    // 获取累计确诊的areaMapList
    getTotalareaMapList(){
      this.areaMapList = []
      for (let area of this.areaData.children) {
        let name = area.name
        let value = area.total.confirm
        let newArea = {
          name,
          value
        }
        this.areaMapList.push(newArea)
      }
      console.log('累计确诊,areaMapList',this.areaMapList)
    },
    // 初始化省地图
    initAreaMap () {
      let areaMap = this.$echarts.init(this.$refs.areaMap)
      window.addEventListener('resize', function () {
        areaMap.resize()
      })
      let option = {

        tooltip: {
          trigger: 'item',
          // formatter: '{b}</br>'+ isNaN(('{c}').toString()) ? '' : this.areaFormatter + '{c}',
          formatter:{
            show: true
          },
          textStyle:{
            fontSize:'16',
          }
        },
        visualMap: {
          type: 'piecewise',
          pieces: [
            {min: 10000, max: 100000, label: '10000人及以上', color: '#7F1100'},
            {min: 1000, max: 9999, label: '1000-9999人', color: '#BD1316'},
            {min: 500, max: 999, label: '500-999人', color: '#E64B45'},
            {min: 100, max: 499, label: '100-499人', color: '#FF8C71'},
            {min: 10, max: 99, label: '10-99人', color: '#FDD2A0'},
            {min: 1, max: 9, label: '1-9人', color: '#FFF2CF'},
            {min: 0, max: 0, label: '0人', color: '#FFFFFF'},
          ],
          textStyle:{
            fontSize:10
          },
          itemGap:5,
        },

        series: [
          {
            name: this.areaSeriesName,
            type: 'map',
            map: this.areaName,
            mapType:'province',
            label: {
              show: false,
              fontSize: 13,
            },
            data: this.areaMapList
          }
        ]
      }
      areaMap.setOption(option)
    },
    // 切换省地图的现有确诊或累计确诊
    changeAreaTodayOrTotal(id) {
      this.isShowTodayinArea = !this.isShowTodayinArea // 先切换
      if (id === 2) { // 现有->累计
        this.areaSeriesName = '累计确诊' // 改变series的名称
        this.getTotalareaMapList() // 获取数组
      } else { // 累计 -> 现有
        this.areaSeriesName = '现有确诊'
        this.getTodayareaMapList()
      }
      this.initAreaMap() //重新初始化地图
    }
  },
  mounted(){
    // 获取后台接口
    this.$axios({
      method:'get',
      url:'/api/getOnsInfo?name=disease_h5'
    }).then(( response )=> {
      this.message = JSON.parse(response.data.data)
      console.log('message',this.message)
      this.getTodayList()
      this.provinceData = this.message.areaTree[0].children
      console.log('provinceData',this.provinceData);
      this.closeLoading()
      this.$nextTick(()=>{
        this.initChart()
      })
    })
    this.$axios.get('/nosymapi/query/inner/publish/modules/list?modules=chinaDayList,chinaDayAddList,cityStatis,nowConfirmStatis,provinceCompare')
      .then((response)=>{
        this.areaAddData = response.data.data.provinceCompare
        console.log(this.areaAddData)
      })
  },
  destroyed() {
    window.removeEventListener('resize',this.initChart,20)
  },
  components:{
    chartNoSymptom,
    importWraper,
    chartYiqingTrend
  }
}
</script>



<style>

#topdataWrap{
  width:100%;
}
.timeNum {
  padding: 1rem 5%;
  background-color: #fff;
  font-size: 0.3rem;
  color: #737373;
}
.timeNum .d{
  position:relative;
}
.timeNum .d span{
  font-weight: 500;
  color:#222;
}
.timeNum .d em{
  font-style:normal
}
.recentNumber{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-bottom: 1rem;
}
.recentNumber .icbar:nth-child(1){
  border-radius: 0.3rem 0 0 0;
}
.recentNumber .icbar {
  width: 30%;
  margin: 0 .2rem .2rem 0;
  padding: .3rem 0 .6rem;
  position: relative;
  text-align: center;
  background-color: #f3f6f8;
}
.recentNumber .icbar .number{
  font-size: 2rem;
  line-height: 2rem;
  height: 2rem;
  font-weight: 600;
  padding-top: .3rem;
}

.recentNumber .icbar:nth-child(3) {
  border-radius: 0 0.3rem 0 0;
}
.recentNumber .icbar:nth-child(4) {
  border-radius: 0 0 0 0.3rem;
}
.recentNumber .icbar:nth-child(6) {
  border-radius: 0 0 0.3rem 0;
}
.recentNumber .icbar:last-child,
.recentNumber .icbar:nth-child(3) {
  margin-right: 0;
}
#areaDetailWraper .recentNumber .icbar:nth-child(3){
  border-radius: 0;
  margin-right: .1rem;
}
#areaDetailWraper .recentNumber .icbar:nth-child(4){
  border-radius:  0 .3rem .3rem 0;
}
.recentNumber .add {
  padding-top: .3rem;
  color: #7c7c7c;
  font-size: .3rem;
  line-height: 1rem;
  height: 1rem;
  font-weight: 500;
}
.recentNumber .icbar .text{
  font-size: 1rem;
  height: 1rem;
  line-height: 1rem;
  color: #222;
  font-weight: 500;
  margin-top: .3rem;
}
/*.recentNumber .number{*/
/*  font-weight: 500;*/
/*  font-size: 5.333vw;*/
/*  line-height: 5.333vw;*/
/*}*/
.recentNumber .icbar.confirm .add em,
.recentNumber .icbar.confirm .add span,
.recentNumber .icbar.confirm .number{
  color: #cc1e1e;
}
.recentNumber .icbar.heal .add em,
.recentNumber .icbar.heal .add span,
.recentNumber .icbar.heal .number{
  color: #178b50;
}
.recentNumber .icbar.dead .add em,
.recentNumber .icbar.dead .add span,
.recentNumber .icbar.dead .number{
  color: #4e5a65;
}
.recentNumber .icbar.nowConfirm .add em,
.recentNumber .icbar.nowConfirm .add span,
.recentNumber .icbar.nowConfirm .number{
  color: #f23a3b;
}
.recentNumber .icbar.nowSevere .add em,
.recentNumber .icbar.nowSevere .add span,
.recentNumber .icbar.nowSevere .number{
  color: #ca3f81;
}
.recentNumber .icbar.import .add em,
.recentNumber .icbar.import .add span,
.recentNumber .icbar.import .number{
  color: #f05926;
}



#chinaMapWrap{
  position: relative;
  margin: 0 0 .5rem;
  width: 100%;
}
.chmap{
  position: relative;
  height: 23rem;
  padding: 0 5%;
}
#chmap{

  height:21rem;
  background-color:rgb(255,255,255);
  position:absolute;
  top:0;
  left:0;
  width: 90%;
  padding:1rem 5%;
}
.chinamapbtns,
.areaMapBtns{
  position: absolute;
  left: 5.333vw;
  top: 0;
  float: left;
  z-index: 2;
  height: 1.5rem;
  background-color: #ffffff;
}
.chinamapbtns span:first-child,
.areaMapBtns span:first-child{
  border-radius: .3rem 0 0 .3rem;
}
.chinamapbtns span:last-child
.areaMapBtns span:last-child{
  border-radius: 0 .3rem .3rem 0;
}
.chinamapbtns span,
.areaMapBtns span{
  display: block;
  width: 4rem;
  line-height: normal;
  text-align: center;
  font-size: .5rem;
  padding: .2rem;
  border: 1px solid #efefef;
  float: left;
  position: relative;
}
.chinamapbtns span.current,
.areaMapBtns span.current{
  background-color: #eef4ff;
  border-color: #ccdeff;
  color: #005dff;
  z-index: 2;
}

/*chinaListWraper*/
#chinaListWraper{
  margin-top: 2rem;
}
#chinaListWraper .up-tips{
  margin-bottom: 0;
}
.tips-yiqing {
  position: relative;
  margin: 0 5.333vw;
  padding: 0;
}
.up-tips {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 2rem;
  line-height: normal;
  color: #222;
  font-size: 1.05rem;
  font-weight: 700;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.up-tips .title {
  display: inline-block;
  position: relative;
  font-size: 1.05rem;
}
#chinaListWraper .tips{
  color: #737373;
  font-size: .5rem;
  line-height: 1rem;
  height: 1rem;
  font-weight: 400;
  font-style: normal;
  margin: 0 0 0 5%;
}
#chinaListWraper .listNav{
  position: fixed;
  left: 0;
  top: 11.2vw;
  right: 0;
  background-color: #f5f5f5;
  z-index: 8;
}
.hide {
  display: none;
}
#chinaListWraper .listNav .table{
  width: calc(100% - 2.5rem);
  margin: 0 auto;
}
#chinaListWraper .table{
  border: 0;
  padding: 0;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
#chinaListWraper .thead{
  border-collapse: collapse;
  border-spacing: 0;
}

.tr{
  display: flex;
  border-bottom: 1px solid #F5F5F5;
}
.table, .tbody, .td, .th, .thead, .tr {
  border-collapse: collapse;
}
#chinaListWraper .table .th:first-child {
  background-color: #f5f5f5;
}
#chinaListWraper .table .td:first-child,
#chinaListWraper .table .th:first-child {
  width: 22.4vw;
}
#chinaListWraper .table .td.area,
#chinaListWraper .table .th.area{
  text-align: left;
}
#chinaListWraper .thead .th {
  height: 2.5rem;
  text-align: center;
  font-size: .3rem;
  font-weight: 400;
  padding: 0;
  margin: 0;
  border: 0;
  border-right: 1px solid #fff;
}
#chinaListWraper .table .td,
#chinaListWraper .table .th {
  border: 0;
  border-spacing: 0;
  padding: 0;
  heigth: 2.5rem;
  line-height: 2.5rem;
}
#chinaListWraper .table .th:first-child span {
  display: block;
  padding-left: 4.533vw;
}
#chinaListWraper .table .th span{
  display: block;
}
#chinaListWraper .table .th:nth-child(2) {
  background-color: #fcf2e8;
  color: #ff5d00;
}
#chinaListWraper .table .td:nth-child(2),
#chinaListWraper .table .td:nth-child(3),
#chinaListWraper .table .th:nth-child(2),
#chinaListWraper .table .th:nth-child(3) {
  width: 15.467vw;
}
#chinaListWraper .table .th:nth-child(3) {
  background-color: #fdeeee;
  color: #f55253;
}
#chinaListWraper .table .th:nth-child(4) {
  background-color: #e9f7ec;
  color: #178b50;
}
#chinaListWraper .table .td:nth-child(4),
#chinaListWraper .table .td:nth-child(5),
#chinaListWraper .table .th:nth-child(4),
#chinaListWraper .table .th:nth-child(5) {
  width: 12vw;
}
#chinaListWraper .table .th:nth-child(5) {
  background-color: #f3f6f8;
  color: #4e5a65;
}
#chinaListWraper .table .th:last-child {
  background-color: #f5f5f5;
  width: 11.5vw;
}
#chinaListWraper .listNav .table .th:last-child {
  border-right: 0;
}
#chinaListWraper .listWraper{
  margin: 1rem 5% 0;
}
#chinaListWraper .tbody .areaBox{
  font-size: 1rem;
}
#chinaListWraper .tbody .areaBox .area{
  font-weight: 600;
}
#chinaListWraper .tbody .th:first-child {
  background-color: #fff;
}
#chinaListWraper .tbody .td p, #chinaListWraper .tbody .th p{
  line-height: 1rem;
  padding-top: 1rem;
  text-align: center;
}
.bold{
  font-weight: 600;
}
#chinaListWraper .tbody .td p:last-child, #chinaListWraper .tbody .th p:last-child {
  line-height: 1rem;
  height: 1rem;
  min-height: auto;
  font-size: .5rem;
  padding: 0 0 .5rem;
  color: #737373;
}
#chinaListWraper .tbody .areaBox .area span{
  position: relative;
}

#chinaListWraper .tbody .th span{
  max-width: 14.133vw;
  white-space: nowrap;
}
#chinaListWraper .tbody.current .areaBox .area span:before {
  background-image: url(//mat1.gtimg.com/news/images/inews/2020/feiyan/18/img/area_top.png);
}
#chinaListWraper .tbody .areaBox .area span:before {
  content: ".";
  font-size: 0;
  line-height: 0;
  display: block;
  position: absolute;
  width: 4vw;
  height: 2vw;
  max-width: 1.5rem;
  max-height: 1rem;
  left: 1.6vw;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  background: url(//mat1.gtimg.com/news/images/inews/2020/feiyan/18/img/area_down.png);
  background-size: 100% 100%;
}
#chinaListWraper .tbody .areaBox .area span:after {
  content: ".";
  font-size: 0;
  line-height: 0;
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  background: url(//mat1.gtimg.com/news/images/inews/2020/feiyan/18/img/area_top.png);
}
#chinaListWraper .tbody .th:before {
  content: ".";
  font-size: 0;
  line-height: 0;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #f5f5f5;
  bottom: 0;
}
#chinaListWraper .tbody .td:last-child {
  color: #005def;
  width: 11.5vw;
}
#chinaListWraper .table .td:last-child,
#chinaListWraper .table .th:last-child {
  border-right: 0;
}
#chinaListWraper .tbody .city{
  color: #737373;
}
#chinaListWraper .tbody .th.small span {
  font-size: .8rem;
  letter-spacing: -1px;
  position: relative;
  white-space: nowrap;
}
#chinaListWraper .tbody{
  font-size: .8rem;
}
#chinaListWraper .tbody .td {
  text-align: center;
  position: relative;
  border-right: 1px solid #fff;
}
#chinaListWraper .table:last-child .tbody .confirmId p:last-child{
  margin:  0 -1rem;
}
#chinaListWraper .table .td:first-child,
#chinaListWraper .table .th:first-child {
  width: 22.4vw;
}
#areaDetailWraper{
  height: 100%;
  overflow: auto;
  position: fixed;
  top: 4rem;
  width: 100%;
  background: #ffffff;
  z-index: 3;
  max-width: 752px;
  min-width: 320px;
}
.area-head{
  height: 8rem;
  position: relative;
  line-height: normal;
  background-size: cover;
}
.area-head .back {
  position: absolute;
  top: 2rem;
  left: 5%;
  width: 1rem;
  height: 1rem;
  background: url("../../assets/images/back.png") no-repeat;
  background-size: 1rem;
  z-index: 3;
}
.area-head .bg{
  background-size: cover;
  position: absolute;
  bottom: 0;
  left: 0;
  top: 0;
  right: 0;
  height: 10rem;
  background-position: top;
  background-repeat: no-repeat;
  background-image: url(https://mat1.gtimg.com/news/feiyanarea/area_head_bg.png);
}
.area-head .qs {
  line-height: 1rem;
  height: 1rem;
  font-size: .5rem;
  color: #fff;
  position: absolute;
  left: 5%;
  top: 6rem;
}
.area-head .btns{
  position: absolute;
  right: 5%;
  top: 2rem;
  line-height: normal;
  color: #fff;
  font-size: .7rem;
  font-weight: 400;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.area-head .area-titles{
  position: absolute;
  left: 12%;
  top: 1.5rem;
  color: #fff;
}
.area-head .h3 {
  width: 14rem;
  height: 1.5rem;
  background: url(https://mat1.gtimg.com/news/images/inews/2020/feiyan/area/area_h3_bg.png);
  background-size: 100% 100%;
}
.area-head .h2{
  line-height: normal;
  margin: .2rem 0 0;
  font-size: 2rem;
  font-weight: 600;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.area-head .h2 span {
  display: inline-block;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #0056ee;
  background-color: #fff;
  padding: 0 1.333vw;
  margin-right: 1.6vw;
  border-radius: .4rem;
  position: relative;
}
.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
  padding: 5px;
  border-radius: 15px;
  border: 1px solid;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-dropdown-menu{
  height: 80%;
  overflow: scroll;
  position: fixed;
}
.area-head .h2 span:before {
  content: ".";
  font-size: 0;
  line-height: 0;
  display: block;
  position: absolute;
  width: 7rem;
  height: 2rem;
  background: url(https://mat1.gtimg.com/news/images/inews/2020/feiyan/area/area_h2_bg.png);
  background-size: 100% 100%;
  right: -8rem;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
.area-topdateWrap .timeNum{
  position: relative;
  border-radius: 3.2vw 3.2vw 0 0;
}
.area-topdateWrap .recentNumber .icbar{
  width: 22.5%;
  margin-bottom: 0;
}
.areaView{
  margin: 4vw 5.333vw 0;
  background-color: #f8f8f8;
  border-radius: 1.6vw;
  padding: 3.2vw 0;
}
.areaView .city, .areaView .city:before {
  height: 3.733vw;
}
.areaView .city {
  line-height: 3.733vw;
  font-size: 3.733vw;
  color: #005dff;
  font-weight: 600;
  padding-left: 4.267vw;
  margin-left: 4vw;
  position: relative;
}
.areaView .city:before {
  content: ".";
  font-size: 0;
  line-height: 0;
  display: block;
  position: absolute;
  width: 3.733vw;
  left: 0;
  top: 50%;
  -webkit-transform: translateY(-56%);
  transform: translateY(-56%);
  background: url(https://mat1.gtimg.com/news/feiyanarea/icon_location.png);
  background-size: 100% 100%;
}
.areaView .list{
  margin: 3.2vw 0 0;
  line-height: 3.733vw;
  font-size: 3.733vw;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.areaView .list p {
  width: 25%;
  text-align: center;
}
.areaView .list span{
  font-weight: 700;
  margin-right: .533vw;
}
.areaMapWrapper{
 height: 28rem;
  margin:1rem auto;
  position: relative;
  z-index: 1;
}
.areaMap{
  position: relative;

}
.mapInnerFlex{
  position: relative;
  height: 25rem;
}
.areaMapInner{

  position: relative;
}
#areaMapInner2 {
  width: 90%;
  height: 370px;
  background-color: rgb(255,255,255);
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 5%;
}

</style>
