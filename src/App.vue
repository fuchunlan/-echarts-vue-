<template>
  <div id="app" v-loading="loading" element-loading-text="积极防护，保护自己，戴口罩，勤洗手">
    <!--navWraper-->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
             @click.native="closeArea">
      <el-submenu index="1" @click.native="changeTab('1')">
        <template slot="title" >国内疫情</template>
        <el-menu-item @click.native="toScroll(1)">国内疫情数据统计</el-menu-item>
        <el-menu-item @click.native="toScroll(2)">中国疫情地图</el-menu-item>
        <el-menu-item @click.native="toScroll(3)">无症状感染</el-menu-item>
        <el-menu-item @click.native="toScroll(4)">境外输入疫情趋势</el-menu-item>
        <el-menu-item @click.native="toScroll(5)">国内疫情趋势</el-menu-item>
        <el-menu-item @click.native="toScroll(6)">中国疫情表格</el-menu-item>
      </el-submenu>

      <el-submenu index="2" @click.native="changeTab('2')">
        <template slot="title" index="/globalWraper">海外疫情</template>
        <el-menu-item @click.native="toScroll(7)" >海外疫情数据统计</el-menu-item>
        <el-menu-item @click.native="toScroll(8)" >海外疫情地图</el-menu-item>
        <el-menu-item @click.native="toScroll(9)">海外多国趋势</el-menu-item>
        <el-menu-item @click.native="toScroll(10)">海外主要疫情国家疫情分析</el-menu-item>
        <el-menu-item @click.native="toScroll(11)">海外疫情表格</el-menu-item>
      </el-submenu>

    </el-menu>
    <!--navWraper-->
    <div class="content">
      <!--headView-->
      <div id="head">
        <p class="head-logo">Fcl</p>
        <div class="head-title">
          <p>新型冠状病毒肺炎</p>
          <p>疫情实时追踪</p>
        </div>
        <p class="notice" @click="isShowNotice = true">防疫须知</p>

        <p class="dataSource">
          数据来源:腾讯API接口
          <!--          <img src="https://mat1.gtimg.com/yslp/feiyanjared/icon_qs2.png" width="14px" height="14px">-->
        </p>
      </div>
      <!--headView-->

      <!--pageTab-->
      <div class='pageTab'>
        <el-tabs v-model="activeName" type="card" >
          <el-tab-pane label="国内疫情" name="first" >
            <chinaWraper :loading="loading" :closeLoading="closeLoading"/>
          </el-tab-pane>
          <el-tab-pane label="海外疫情" name="second" lazy>
            <globalWraper/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--pageTab-->
    </div>
    <!--<router-view/>-->
    <div class="noticeBox" v-if="isShowNotice">
      <div class="fanghu_card">
        <div class="icon_close" @click="isShowNotice = false"></div>
        <p class="notice-title">新冠肺炎预防须知</p>
        <div class="fanghu_title_warp">
          <img src="https://puui.qpic.cn/vupload/0/1580113954413_67dj6qw9r34.png/0" class="fanghu_icon">
          <div class="fanghu_title">个人清洁</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text">经常保持双手清洁，尤其在触摸口、鼻或眼之前。</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text">经常用洗手液和清水清洗双手，搓手最少20秒，并用纸巾擦干。</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text"> 打喷嚏或咳嗽时应用纸巾掩盖口鼻，把用过的纸巾弃置于有盖垃圾箱内，然后彻底清洁双手。 </div>
        </div>
        <div class="fanghu_title_warp">
          <img src="https://puui.qpic.cn/vupload/0/1580113954413_b3dr1w759hr.png/0" class="fanghu_icon">
          <div class="fanghu_title">尽量避免</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text">减少前往人流密集的场所。如不可避免，应戴上外科口罩。</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text">避免到访医院。如有必要到访医院，应佩戴外科口罩及时刻注重个人和手部卫生。</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text">避免接触动物（包括野味）、禽鸟或其粪便；避免到海鲜、活禽市场或农场。</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text">切勿进食野味及切勿光顾有提供野味的餐馆。</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text"> 注意食物安全和卫生，避免进食或饮用生或未熟透的动物产品，包括奶类、蛋类和肉类。 </div>
        </div>
        <div class="fanghu_title_warp">
          <img src="https://puui.qpic.cn/vupload/0/1580113954413_qs8jz3v8m7.png/0" class="fanghu_icon">
          <div class="fanghu_title">尽快就诊</div>
        </div>
        <div class="fanghu_item">
          <div class="fanghu_item_point"></div>
          <div class="fanghu_item_text">如有身体不适，特别是有发烧或咳嗽，应戴上外科口罩并尽快就诊。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chinaWraper from './components/pages/chinaWraper'
import globalWraper from "./components/pages/globalWraper";
export default {
  name: 'App',
  data(){
    return {
      activeIndex: '1',
      activeName: 'first',
      isShowForeign: false,
      isShowNotice: false,
      loading: true
    }
  },
  mounted(){

  },

  methods:{
    handleSelect(key, keyPath) {
    },

    closeArea() {
      if(this.isShowArea) {
        console.log('2222')
        this.isShowArea = false
      }
    },
    // 切换标签
    changeTab(id){
      if (id == 1) {
        this.activeName = 'first'
      }else {
        this.activeName = 'second'
      }
      this.activeIndex = id
      this.isShowArea = false
      // console.log('111')
    },
    toScroll(id) {
      if (id < 7){
        this.changeTab(1)
      } else {
        this.changeTab(2)
      }
      // 根据id获取跳转元素的滚动条高度
      let box //定义box
      let box1 = document.querySelector('#head'),
        box2 = document.querySelector('#chmap'),
        box3 = document.querySelector('#chartNoSymptom'),
        box4 = document.querySelector('#chartImport'),
        box5 = document.querySelector('#chinaTrend'),
        box6 = document.querySelector('#chinaListWraper'),
        box7 = document.querySelector('.content'),
        box8 = document.querySelector('#foreignMap'),
        box9 = document.querySelector('#haiwaiChartLine1'),
        box10 = document.querySelector('#countryLine4'),
        box11 = document.querySelector('#foreignWraper')
      let boxTop
      if(id === 1) {
        boxTop = box1.scrollHeight + 50
      } else if (id === 2){
        boxTop = box2.scrollHeight + 100
      } else if (id === 3){
        // 2的高度加上2的滚动条距离
        boxTop = box2.clientHeight + box2.scrollHeight + 120
      } else if (id === 4){
        boxTop = box2.scrollHeight + box2.clientHeight + box3.clientHeight + 150
      } else if (id === 5){
        boxTop = box2.scrollHeight + box2.clientHeight +box3.clientHeight + box4.clientHeight + 180
      } else if (id === 6){
        boxTop = box2.scrollHeight + box2.clientHeight +box3.clientHeight + box4.clientHeight + box5.clientHeight +220
      } else if (id === 7){
        boxTop = box7.clientHeight
      } else if (id === 8){
        boxTop = box8.scrollHeight
      } else if (id === 9){
        boxTop = box8.scrollHeight + box8.clientHeight
      } else if (id === 10){
        boxTop = box8.scrollHeight + box8.clientHeight + box9.clientHeight
      } else {
        boxTop = box8.scrollHeight + box8.clientHeight + box9.clientHeight + box10.clientHeight + 50
      }
      this.isShowArea = false
      // 改变滚动条高度
      this.$nextTick(() => {
        document.documentElement.scrollTop = boxTop - 20
      })

    },
    // 关闭加载动画
    closeLoading() {
      this.loading = false
    }
  },
  components:{
    globalWraper,
    chinaWraper,
  }
}
</script>

<style>
.head-logo{
  z-index: 999;
  font-size: 20px;
  color: #fff;
  position: absolute;
  top: 1rem;
  left: 1rem;
}
html::-webkit-scrollbar {
  width: 4px;
}
html::-webkit-scrollbar-thumb {
  border-radius: 1rem;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
html::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
#app{
  max-width:752px;
  margin:0 auto;
}
.el-menu-demo{
  position:fixed;
  top:0;
  z-index:4;
  width:100%;
  max-width: 752px;
  margin: 0 auto;
  border: 1px solid #E2E9F3;
  box-shadow: 1px 0px 16px #e2e9f3;
  box-sizing: border-box;
}
.el-menu--horizontal .el-menu .el-menu-item, .el-menu--horizontal .el-menu .el-submenu__title{
  height: 3rem;
  line-height: 3rem;
}
.el-menu-item{
  font-size: 1.5rem;
}
.el-menu-item a{
  color: #909399;
}
.el-menu--horizontal>.el-submenu{
  width:50%;
  text-align: center;
}
.el-menu--horizontal>.el-submenu .el-submenu__title{
  font-size:1.5rem;
  line-height: 4rem;
  height: 4rem;
}
.el-menu--horizontal>.el-menu-item{
  width: 20%;
  text-align: center;
}
#app .content{
  margin-top: 4rem;
}

#head{
  height: 10rem;
  background-size: cover;
  position: relative;
  margin-top:4rem
}
#head:before{
  content: ".";
  font-size: 0;
  line-height: 0;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 10rem;
  background: url("https://mat1.gtimg.com/news/feiyanarea/head_bg_new.png") top;
  background-size: cover;
  box-shadow: 1px 0px 16px #e2e9f3;
}
.head-title{
  position: relative;
  top: 3rem;
  margin: 0 auto;
  height: 5rem;
  width: 100%;
}
.head-title p:nth-child(1){
  color: #FCE9A7;
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
}
.head-title p:nth-child(2){
  color: #ffffff;
  font-size: 2rem;
  text-align: center;
}
.notice{
  position: absolute;
  right: 0rem;
  text-align: center;
  top: 1rem;
  font-size: 1rem;
  color: #fff;
  height: 2rem;
  line-height: 2rem;
  width: 6rem;
  border: 1px solid #8fb8ff;
  border-radius: 4rem 0 0 4rem;
  background-color: #005dff;
}
.dataSource{
  text-align: center;
  position: relative;
  top: 3rem;
  font-size: 1rem;
  color: #ffffff;
}


.pageTab{
  height: 3rem;
  background-color: #ddecff;
  border-radius: 3.2rem 3.2rem 0 0;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.el-tabs{
  width:100%;
}
.pageTab .el-tabs__nav{
  width:100%
}
.el-tabs__content{
  border: 1px solid #E2E9F3;
  box-shadow: 1px 0px 16px #e2e9f3;
}
.el-tabs--card>.el-tabs__header{
  margin: 0 ;
  height: 100%;
}
.el-tabs--card>.el-tabs__header .el-tabs__nav{
  border-radius:0 ;
  background:#DDECFF
}
.pageTab .el-tabs__item {
  width:50%;
  height: 3rem;
  text-align:center;
  border-radius: 10px 10px 0 0;
  background: #DDECFF;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 3rem;
}
.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  background:#ffffff;
}
.noticeBox{
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.75);
  z-index: 5;
  height: 100%;
  width: 100%;
  max-width: 752px;
  margin: 0 auto;
}
.notice-title{
  color: #222;
  font-size: 1.3rem;
  text-align: center;
  font-weight: 600;
}
.fanghu_card{
  margin: 5rem 1.5rem 0;
  border-radius: .6rem;
  background: #f8f8f8;
  padding: 1.333rem 0rem 1.333rem 0.533rem;
  height: 77%;
}
.fanghu_card .icon_close{
  width: 2rem;
  height: 2rem;
  background: url(https://mat1.gtimg.com/news/feiyannews/icon_pop_close.png);
  background-size: 100% 100%;
  position: absolute;
  top: 2rem;
  right: 8%;
}
.fanghu_title_warp{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 1rem;

}
.fanghu_icon{
  width: 1rem;
  height: 1rem;
}
.fanghu_title{
  font-size: 1.2rem;
  font-weight: 500;
  margin-left: 2.667vw;
}
.fanghu_item{
  margin-top: 2.133vw;
  position: relative;
}
.fanghu_item_point{
  width: .25rem;
  height: .25rem;
  background: #005dff;
  border-radius: .533rem;
  margin-top: .5rem;
  margin-left: .1rem;
  position: absolute;
}
.fanghu_item_text{
  font-weight: 400;
  font-size: .7rem;
  line-height: 1rem;
  color: #222;
  margin-left: 3.2vw;
}
</style>
