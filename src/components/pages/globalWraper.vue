<template>

    <div id="foreignList" class="foreignListWraper" >
      <div class="pending" v-loading="loading" element-loading-text="积极防护，保护自己，戴口罩，勤洗手"/>
      <div id="topdataWrap" >
        <div class="timeNum">
          <p class="d">统计截至
            <span class="ml">{{globalStatic.lastUpdateTime}}</span>
          </p>
        </div>
        <div class="recentNumber add">
          <div class="icbar nowConfirm">
            <p class="add">
              较上日
              <span class="addnum"> {{ globalStatic.nowConfirmAdd > 0 ? '+'+ globalStatic.nowConfirmAdd : globalStatic.nowConfirmAdd}} </span>
            </p>
            <div class="number">{{ globalStatic.nowConfirm }}</div>
            <div class="text">现有确诊</div>
          </div>
          <div class="icbar confirm">
            <p class="add">
              较上日
              <span class="addnum">{{ globalStatic.confirmAdd > 0 ? '+'+ globalStatic.confirmAdd : globalStatic.confirmAdd }}</span>
            </p>
            <div class="number">{{ globalStatic.confirm }}</div>
            <div class="text">累计确诊</div>
          </div>
          <div class="icbar heal">
            <p class="add">
              较上日
              <span class="addnum">{{ globalStatic.healAdd > 0 ? '+'+ globalStatic.healAdd : globalStatic.healAdd }}</span>
            </p>
            <div class="number">{{ globalStatic.heal }}</div>
            <div class="text">累计治愈</div>
          </div>
          <div class="icbar dead">
            <p class="add">
              较上日
              <span class="addnum">{{ globalStatic.deadAdd > 0 ? '+'+ globalStatic.deadAdd : globalStatic.deadAdd }}</span>
            </p>
            <div class="number">{{ globalStatic.heal}}</div>
            <div class="text">累计死亡</div>
          </div>
        </div>
      </div>
      <div id="foreignMap" >
        <div class="foreignMapChart" ref="foreignMapChart">

        </div>
      </div>
      <haiwai-counrty-line/>
      <mainly-country-line/>
      <div id="foreignWraper" class="listWraper">
        <div class="listNav hide">
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

              </div>

            </div>
          </div>
        </div>
        <div class="up-tips tips-yiqing">
          <p>
            <span class="title">海外疫情</span>
          </p>
        </div>
        <div class="table">
          <div class="thead">
            <div class="tr opened">
              <div class="th area">
                <span>地区</span>
              </div>
              <div class="th">新增确诊</div>
              <div class="th">累计确诊</div>
              <div class="th">治愈</div>
              <div class="th">死亡</div>

            </div>
          </div>
          <div class="tbody" v-for="(country,index) in foreignList" :key="index">
            <div class="tr areaBox opened">
              <div class="th area">
                <span>{{ country.name }}</span>
              </div>
              <div class="td">{{ country.confirmAdd }}</div>
              <div class="td">{{ country.confirm }}</div>
              <div class="td">{{ country.heal }}</div>
              <div class="td">{{ country.dead }}</div>

            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
import mainlyCountryLine from "../globalComponents/mainlyCountryLine";
import haiwaiCounrtyLine from "../globalComponents/haiwaiCounrtyLine";
import nameMap from '../../../static/nameMap.json'
import 'echarts/map/js/world'
export default {
  name:'globalWraper',
  data(){
    return{
      globalStatic: {}, //全球的疫情数据统计数据,topdataWrap
      nowConList:[], //全球现有疫情数据
      healList:[], // 全球治愈疫情数据
      deadList:[], //全球死亡疫情数据
      confirmList:[], // 全球累计疫情数据
      dateList:[],
      foreignList: [],// 海外国家疫情数据
      loading:true
    }
  },
  mounted() {
    this.$axios.get('/nosymapi/automation/modules/list?modules=FAutoGlobalStatis,FAutoContinentStatis,FAutoGlobalDailyList,FAutoCountryConfirmAdd')
      .then((response) => {
        this.globalStatic = response.data.data.FAutoGlobalStatis
        this.loading = false
        // console.log('全球现状',this.globalStatic)
      })
    this.$axios.get('/nosymapi/automation/foreign/country/ranklist')
      .then(res => {
        this.foreignList = res.data.data

      })
    this.$axios.get('/wyapi/wuhan/app/data/list-total')
      .then(res => {
        let foreignList2 = res.data.data.areaTree
        this.dataList = []
        this.nowConList = []
        this.healList = []
        this.deadList = []
        this.confirmList = []
        for (let item of foreignList2) {
          let name = item.name
          let newNowCon = {
            name,
            value:item.today.confirm
          }
          let newHeal = {
            name,
            value:item.total.heal
          }
          let newConfirm = {
            name,
            value:item.total.confirm
          }
          let newDead = {
            name,
            value:item.total.dead
          }
          this.nowConList.push(newNowCon)
          this.healList.push(newHeal)
          this.deadList.push(newDead)
          this.confirmList.push(newConfirm)
        }

        this.$nextTick(() => {
          this.initChartForMap()
        })
      })


  },
  methods:{
    initChartForMap() {
      let foreignMap = this.$echarts.init(this.$refs.foreignMapChart)
      window.addEventListener('resize',function (){
        foreignMap.resize()
      })
      let option = {
        title: {
          text:'海外疫情地图',
          left:'center',
        },
        toolbox:{
          show:true,
          feature:{
            restore:{},
          }
        },
        tooltip: {
          trigger: 'item',
          formatter:function(params){
            //定义一个res变量来保存最终返回的字符结果,并且先把地区名称放到里面
            var res=params.name+'<br />';
            //定义一个变量来保存series数据系列
            var myseries=option.series;
            //循环遍历series数据系列
            for(var i=0;i<myseries.length;i++){
              //在内部继续循环series[i],从data中判断：当地区名称等于params.name的时候就将当前数据和名称添加到res中供显示
              for(var k=0;k<myseries[i].data.length;k++){

                //如果data数据中的name和地区名称一样
                if(myseries[i].data[k].name==params.name){
                  let value = 0
                  if (myseries[i].data[k].value) {
                    value = myseries[i].data[k].value
                  }
                  //将series数据系列每一项中的name和数据系列中当前地区的数据添加到res中
                  // res+=myseries[i].name+':'+myseries[i].data[k].value+'<br />';
                  res+=myseries[i].name+':'+value+'<br />';
                }
              }
            }
            return res;
          }
        },
        visualMap: {
          type: 'piecewise',
          // seriesIndex:0,
          show:false,
          pieces: [
            {min: 1000000, label: '≥100w', color: '#7F1100'},
            {min: 100000, max: 999999, label: '100000-999999', color: '#BD1316'},
            {min: 10000, max: 99999, label: '10000-99999', color: '#E64B45'},
            {min: 1000, max: 9999, label: '1000-9999', color: '#FF8C71'},
            {min: 100, max: 999, label: '100-999', color: '#FDD2A0'},
            {min: 1, max: 99, label: '1-99', color: '#FFF2CF'},
            {min: 0, max: 0, label: '0人', color: '#FFFFFF'},
          ],
          textStyle:{
            fontSize:10
          },
          itemGap:1,
        },
        grid:{
          bottom:0,
          top:0,
          containLabel: true // 包含
        },
        series: [
          {
            name: '现有确诊',
            type: 'map',
            map: 'world',
            roam:true,
            zoom:1.3,
            label: {
              show: false,
              fontSize: '14',
            },
            data: this.nowConList,
            nameMap
          },
          {
            name: '累计确诊',
            type: 'map',
            map: 'world',
            roam:true,
            label: {
              show: false,
              fontSize: '14',
            },
            data: this.confirmList,
            nameMap
          },
          {
            name: '治愈',
            type: 'map',
            map: 'world',
            roam:true,
            label: {
              show: false,
              fontSize: '14',
            },
            data: this.healList,
            nameMap
          },
          {
            name: '死亡',
            type: 'map',
            map: 'world',
            roam:true,
            label: {
              show: false,
              fontSize: '14',
            },
            data: this.deadList,
            nameMap
          }

        ]
      }
      foreignMap.setOption(option)
    }
  },
  components:{

    haiwaiCounrtyLine,
    mainlyCountryLine
  }
}
</script>

<style >
.pending {
  position: absolute;
  top: -69vw;
  height: 178vw;
  width: 100%;
}
#foreignList .recentNumber .icbar{
  width: 24%;
  position: relative;
  text-align: center;
  padding: .3rem 0 .6rem;
  margin-right: .1rem;
}
#foreignList .recentNumber.add .icbar .add{
  display: block;
  white-space: nowrap;
}
 #foreignList .recentNumber .icbar:first-child {
  border-radius: .3rem 0 0 .3rem;
}
#foreignList .recentNumber .icbar:nth-child(3) {
   border-radius: 0;
   margin-right: .1rem;
 }
#foreignList .recentNumber .icbar:last-child {
  border-radius: 0 .3rem .3rem 0;
  margin-right: 0;
}
#foreignList .recentNumber .number{
  font-size: 1.1rem;
  line-height: 1.3rem;
  height: 1.3rem;
  font-weight: 600;
  padding-top: .3rem;
}
 #foreignList .recentNumber .addnum,
 #foreignList .recentNumber .addnum
 {
   margin-left: -7px;
 }
#foreignList #foreignMap{
  height: 350px;
  padding: 1rem 5%;
}
#foreignMap .foreignMapChart {
  height: 100%;
  width: 100%;
}
.foreignListWraper .listWraper{
  margin: 1rem 5% 0;
}
.foreignListWraper .up-tips{
  margin: 0;
}

.tips-yiqing {
  position: relative;
  margin: 0 5.333vw;
  padding: 0;
}
.up-tips .title {
  display: inline-block;
  position: relative;
  font-size: 1.2rem;
}
.foreignListWraper .table{
  border: 0;
  padding: 0;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 1rem;
}
.foreignListWraper .thead{
  border-collapse: collapse;
  border-spacing: 0;
}
.foreignListWraper .tbody{
  line-height: 3rem;
  height: 3rem;
  font-size: 3.467vw;
}
.foreignListWraper .table .thead .th:first-child {
  background-color: #f5f5f5;
}
.foreignListWraper .table .td:first-child,
.foreignListWraper .table .th:first-child {
  width: 22.4vw;
}
.foreignListWraper .table .td.area,
.foreignListWraper .table .th.area {
  text-align: left;
}
.foreignListWraper .thead .th{
  height: 3rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  padding: 0;
  margin: 0;
  border: 0;
  border-right: 1px solid #fff;
}
.foreignListWraper .table .td,
.foreignListWraper .table .th{
  border: 0;
  border-spacing: 0;
  padding: 0;
  line-height: 3rem;
  height: 3rem;
}
.foreignListWraper .table .tr.opened th:first-child span{
  display: block;
  padding-left: 3.2vw;
}
.foreignListWraper .table .th:first-child span{
  display: block;
  padding-left: 4.533vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.foreignListWraper .table .th:nth-child(2) {
  background-color: #e8effc;
  color: #005dff;
}
.foreignListWraper .table .td:nth-child(2),
.foreignListWraper .table .td:nth-child(3),
.foreignListWraper .table .th:nth-child(2),
.foreignListWraper .table .th:nth-child(3) {
  width: 17vw;
}
.foreignListWraper .table .th:nth-child(3) {
  background-color: #fdeeee;
  color: #f55253;
}
.foreignListWraper .tbody {
  background-color: #ffffff;
}
.foreignListWraper .table .th:nth-child(4) {
  background-color: #e9f7ec;
  color: #178b50;
}
.foreignListWraper .table .td:nth-child(4),
.foreignListWraper .table .td:nth-child(5),
.foreignListWraper .table .th:nth-child(4),
.foreignListWraper .table .th:nth-child(5) {
  width: 16.2vw;
}
.foreignListWraper .table .th:nth-child(5) {
  background-color: #f3f6f8;
  color: #4e5a65;
}
.foreignListWraper .table .th:nth-child(6) {
  background-color: #f5f5f5;
}
.foreignListWraper .table .td:last-child,
.foreignListWraper .table .th:last-child {
  border-right: 0;
}
.foreignListWraper .tbody .areaBox.opened th:first-child {
  border-top: 0;
  font-weight: 400;
}
.foreignListWraper .tbody .areaBox {
  font-size: .5rem;
  background-color: #ffffff;
}
</style>
