<template>
  <div>
      <bread col1="数据统计" col2="数据报表"></bread>
      <!-- 外面包裹的盒子用来填充背景色 -->
     <div class="wrapper">
         <!-- echarts表 -->
          <div class="main" style="width:800px;height:500px" ref="main"></div>
     </div>
  </div>
</template>

<script>
//引入echarts
import echarts from "echarts";
import _ from 'lodash';

export default {
  name:'reports',
  data(){
      return {
          //图标的配置项
    options:{
        title: {
        text: '用户来源'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:[] //图例--获取的数据
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {  //离容器上下左右的距离
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false, //距离两边边界的距离
            data : [] //x轴上的数据类型
        }
    ],
    yAxis : [
        {
            type : 'value' 
        }
    ],
    series : []
          }
      }
  },
  methods:{
     async loadData(){
         const res=await this.$axios.get('reports/type/1')
          console.log(res)
          if(res.data.meta.status==200){
              this.options=_.merge(this.options,res.data.data)
              let myChart = echarts.init(this.$refs.main);
               myChart.showLoading();
               myChart.setOption(this.options);
               myChart.hideLoading();
          }
     }
     
  },
  mounted(){
    //   //最早获取dom元素
    //   let myChart = echarts.init(this.$refs.main);
    //   //发请求获取数据
    //   this.$axios.get('reports/type/1').then(res=>{
    //       console.log(res)
    //       if(res.data.meta.status==200){
    //           //成功获取数据
    //           //赋值
    //           this.options.legend=res.data.data.legend;
    //           this.options.series=res.data.data.series;
    //           this.options.xAxis[0].data=res.data.data.xAxis[0].data;
    //           this.options.yAxis=res.data.data.yAxis;

    //               myChart.setOption(this.options);
    //       }else {
    //           this.$message.error(res.data.meta.msg)
    //       }
    //   })
    this.loadData()
    
  }
}
</script>

<style lang="less" scoped>
.wrapper {
    background-color: #fff;
    padding:20px;
}
</style>