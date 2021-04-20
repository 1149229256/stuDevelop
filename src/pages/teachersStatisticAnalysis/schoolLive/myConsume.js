import {
    connect,
    // useSelector,
    useDispatch,
} from "react-redux";
import React, {
// useCallback,
memo,
useEffect,
useState,
useImperativeHandle,
useRef,
useLayoutEffect,
forwardRef,
} from "react";
// import echarts from "echarts";
import {Select} from "antd";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import * as graphic from 'echarts/lib/util/graphic';
import { Empty } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
import Item from "antd/lib/list/Item";
let { BasicProxy } = ipConfig;
const {Option} = Select;

//   import { resizeForEcharts } from "../../../util/public";
function MyConsume(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
        reflash
      } = props;
    const [currentDataType, setCurrentDataType] = useState("1");
    const [consumeList, setConsumeList] = useState([]);
    const [consumeGradeList, setConsumeGradeList] = useState([]);
    const [consumeClassList, setConsumeClassList] = useState([]);
    const [consumeStatisticList, setConsumeStatisticList] = useState([]);
    useLayoutEffect(() => {
        if(userIdentity == "student" && !UserID){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        if(!currentTerm.value){
            return;
        }
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let url = BasicProxy + "/api/campusLife/consumption/list?studentId=" + (
          userIdentity == "student"?
          UserID:
          ""
        ) +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                result.data.forEach((item)=>{
                    let date = new Date(item.orderTimestamp).getHours();
                    console.log(date);
                    if(date >= 0 && date <= 6){
                        item.orderDate = "凌晨";
                    }
                    if(date > 6 && date <= 12){
                        item.orderDate = "上午";
                    }
                    if(date > 12 && date <= 14){
                        item.orderDate = "中午";
                    }
                    if(date > 14 && date <= 18){
                        item.orderDate = "下午";
                    }
                    if(date > 18 && date <= 24){
                        item.orderDate = "晚上";
                    }
                })
              setConsumeList(result.data);
            }
        }) 
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    useLayoutEffect(() => {
        if(userIdentity == "student" && !UserID){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        if(!currentTerm.value){
            return;
        }
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let  url = BasicProxy + "/api/campusLife/consumption/distribution?id=" + (
            userIdentity == "student"?
            UserID:
            userIdentity == "teacher"?
            currentClass:
            userIdentity == "manager"?
            currentClass?
            currentClass:
            currentGrade?
            currentGrade:
            SchoolID:
            ""
          ) +
          "&queryType=" + (
              userIdentity == "student"?
              1:
              userIdentity == "teacher"?
              2:
              userIdentity == "manager"?
              currentClass?
              2:
              currentGrade?
              3:
              4:
              ""
          ) +
          "&periodType=" + currentDataType +
          // "&gradeId=" + currentGrade +
          // "&schoolId=" + SchoolID +
          "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
          "&endDate=" + currentTermInfo.endDate.substr(0, 10);
          fetch
          .get({url, securityLevel: 2})
          .then((res)=>res.json())
          .then((result)=>{
              if(result.status == 200 && result.data){
                setConsumeStatisticList(result.data);
              }
          })
    }, [userIdentity, currentGrade, currentClass, currentTerm, currentDataType, reflash]);
   //获取班级数据
   useLayoutEffect(() => {
    let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
    let url = BasicProxy + "/api/campusLife/consumption/list?studentId=" +
    "&gradeId=&classId=" + currentClass +
    "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
    "&endDate=" + currentTermInfo.endDate.substr(0, 10);
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
          setConsumeClassList(result.data);
        }
    }) 
}, [userIdentity, currentGrade, currentClass, currentTerm, currentDataType, reflash]);
    //获取年级数据
    useLayoutEffect(() => {
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let url = BasicProxy + "/api/campusLife/consumption/list?studentId=" +
        "&classId=&gradeId=" + currentGrade +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
              setConsumeGradeList(result.data);
            }
        }) 
    }, [userIdentity, currentGrade, currentClass, currentTerm, currentDataType, reflash]);
    const colorList = ['#89df89', '#e84855', '#36afd2', '#2d3047', '#ffb782', 'pink'];
    useEffect(() => {
        if(consumeList.length == 0){
            return;
        }
        let xList = [], dataList = [];
        consumeList.forEach((item)=>{
            xList.push(item.type);
        })
        xList = [...new Set(xList)];
        xList.forEach((item)=>{
            let sum = 0;
            consumeList.forEach((child)=>{
                if(child.type == item){
                    sum += 1;
                }
            })
            let obj = {
                name: item,
                value: sum
            }
            dataList.push(obj);
        })
        let myEchart = echarts.init(document.getElementById("consume-kind-echart"));
        myEchart.resize();
        let option = {
            tooltip: {
                trigger: 'item',
            },
            grid: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            title: {
                text: '消费类别分布图',
                left: 'center',
                top: '81%',
                textStyle: {
                    padding: [0, 0, 30, 0],
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            backgroundColor: {
                type: 'radial',  //radial为镜像渐变， line为线性渐变
                x: 0.5,  //x，y控制渐变的圆心
                y: 0.45, 
                r: 0.32, //半径
                //颜色配置
                colorStops: [
                  {
                    offset: 0, //必须存在不能超过1，表示这一颜色的范围
                    color: 'white', // 0% 处的颜色
                  },
                  {
                    offset: 0.65,
                    color: 'white',
                  },
                  {
                    offset: 0.66,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.91,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.91,
                    color: 'white',
                  },
                  {
                    offset: 1,
                    color: 'white', // 100% 处的颜色
                  },
                ],
            },
            color: ['#89df89', '#e84855', '#36afd2', '#2d3047', '#ffb782', 'pink'],
            series: [
                {
                    name: '消费类别',
                    type: 'pie',
                    radius: ['25%', '55%'],
                    center: ['50%', '45%'],
                    minAngle: 25,
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        // textStyle: {
                        //     color: function(params) {
                        //         console.log(params);
                        //         return colorList[(params.dataIndex)%5]
                        //     },
                        // },
                        formatter: "{b} {d}%",
                    },
                    emphasis: {
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: 'rgba(0, 0, 0, 0.05)'
                        },
                    },
                    data: dataList
                }
            ]
        }; 
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [consumeList]);
    useEffect(() => {
        if(consumeList.length == 0){
            return;
        }
        let xList = [], dataList = [];
        consumeList.forEach((item)=>{
            xList.push(item.place);
        })
        xList = [...new Set(xList)];
        xList.forEach((item)=>{
            let sum = 0;
            consumeList.forEach((child)=>{
                if(child.place == item){
                    sum += 1;
                }
            })
            let obj = {
                name: item,
                value: sum
            }
            dataList.push(obj);
        })
        let myEchart = echarts.init(document.getElementById("consume-area-echart"));
        myEchart.resize();
        let option = {
            tooltip: {
                trigger: 'item',
            },
            grid: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            title: {
                text: '消费地点分布图',
                left: 'center',
                top: '81%',
                textStyle: {
                    padding: [0, 0, 30, 0],
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            backgroundColor: {
                type: 'radial',  //radial为镜像渐变， line为线性渐变
                x: 0.5,  //x，y控制渐变的圆心
                y: 0.45, 
                r: 0.32, //半径
                //颜色配置
                colorStops: [
                  {
                    offset: 0, //必须存在不能超过1，表示这一颜色的范围
                    color: 'white', // 0% 处的颜色
                  },
                  {
                    offset: 0.65,
                    color: 'white',
                  },
                  {
                    offset: 0.66,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.91,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.91,
                    color: 'white',
                  },
                  {
                    offset: 1,
                    color: 'white', // 100% 处的颜色
                  },
                ],
            },
            color: ['#89df89', '#e84855', '#36afd2', '#2d3047', '#ffb782', 'pink'],
            series: [
                {
                    name: '消费地点',
                    type: 'pie',
                    radius: ['25%', '55%'],
                    center: ['50%', '45%'],
                    minAngle: 25,
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        // textStyle: {
                        //     color: function(params) {
                        //         return colorList[params.dataIndex]
                        //     },
                        // },
                        formatter: "{b} {d}%"
                    },
                    emphasis: {
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: 'rgba(0, 0, 0, 0.05)'
                        },
                    },
                    
                    data: dataList
                }
            ]
        }; 
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [consumeList]);
    useEffect(() => {
        if(consumeList.length == 0){
            return;
        }
        console.log(consumeList, "上网时间")
        let xList = [], dataList = [];
        consumeList.forEach((item)=>{
            xList.push(item.orderDate);
        })
        xList = [...new Set(xList)];
        xList.forEach((item)=>{
            let sum = 0;
            consumeList.forEach((child)=>{
                if(child.orderDate == item){
                    sum += 1;
                }
            })
            let obj = {
                name: item,
                value: sum
            }
            dataList.push(obj);
        })
        let myEchart = echarts.init(document.getElementById("consume-time-echart"));
        myEchart.resize();
        let option = {
            tooltip: {
                trigger: 'item',
            },
            grid: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            title: {
                text: '消费时间分布图',
                left: 'center',
                top: '81%',
                textStyle: {
                    padding: [0, 0, 30, 0],
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            backgroundColor: {
                type: 'radial',  //radial为镜像渐变， line为线性渐变
                x: 0.5,  //x，y控制渐变的圆心
                y: 0.45, 
                r: 0.32, //半径
                //颜色配置
                colorStops: [
                  {
                    offset: 0, //必须存在不能超过1，表示这一颜色的范围
                    color: 'white', // 0% 处的颜色
                  },
                  {
                    offset: 0.65,
                    color: 'white',
                  },
                  {
                    offset: 0.66,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.91,
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  {
                    offset: 0.91,
                    color: 'white',
                  },
                  {
                    offset: 1,
                    color: 'white', // 100% 处的颜色
                  },
                ],
            },
            color: ['#89df89', '#e84855', '#36afd2', '#2d3047', '#ffb782', 'pink'],
            series: [
                {
                    name: '消费时间',
                    type: 'pie',
                    radius: ['25%', '55%'],
                    center: ['50%', '45%'],
                    minAngle: 25,
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        // textStyle: {
                        //     color: function(params) {
                        //         return colorList[params.dataIndex]
                        //     },
                        // },
                        formatter: "{b} {d}%"
                    },
                    emphasis: {
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: 'rgba(0, 0, 0, 0.05)'
                        },
                    },
                    
                    data: dataList
                }
            ]
        }; 
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [consumeList]);
    useEffect(() => {
        if(consumeStatisticList.length == 0){
            return;
        }
        let xList = [], myList = [], classList = [], gradeList = [], seriesList= [];
        consumeStatisticList.forEach((item)=>{
            xList.push(item.month);
            myList.push(item.personalCount);
            classList.push(item.classCount);
            gradeList.push(item.gradeCount);
        })
        if(userIdentity == "student"){
            seriesList = [
                {
                    name:'个人',
                    type:'line',
                    lineStyle: {
                        color: '#ff0000',
                        width: 1,
                        borderColor: '#ff0000',
                        emphasis: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        color: '#ff0000'
                    },
                    data:myList
                },
                {
                    name:'班级',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1da4fe'
                        },{
                            offset: 1,
                            color: '#7ecbff'
                        }])
                    },
                    data:classList
                },
                {
                    name:'年级',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#51ca51'
                        },{
                            offset: 1,
                            color: '#a0dea0'
                        }])
                    },
                    data:gradeList
                },
                
            ]
        }
        if(userIdentity == "teacher"){
            seriesList = [
                {
                    name:'班级',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1da4fe'
                        },{
                            offset: 1,
                            color: '#7ecbff'
                        }])
                    },
                    data:classList
                },
                {
                    name:'年级',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#51ca51'
                        },{
                            offset: 1,
                            color: '#a0dea0'
                        }])
                    },
                    data:gradeList
                }, 
            ]
        }
        let myEchart = echarts.init(document.getElementById("consume-sum-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '消费总额',
                left: 'center',
                top: '20px',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            grid: {
                top: 85,
                bottom: xList.length > 6? 55: 45
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                extraCssText: "border: 0; background-color: rgba(0, 0, 0, 0.6);",
                formatter: function(params){
                    let str = `
                    <span 
                    style="
                    display: inline-block; 
                    width: 100%; 
                    color: #fffd64; 
                    text-overflow: ellipsis; 
                    overflow: hidden; 
                    white-space: nowrap;">${params[0].name}</span><br/>`;
                    params.forEach((item)=>{
                        str += `
                        <i class='tooltip-dot'></i>
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}元</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '50px',
                right: '10%',
                data:['个人','班级','年级'],
                textStyle: {
                    color: '#999999',
                }
            },
            xAxis: {
                type: 'category',
                name: '日期',
                nameTextStyle: {
                    color: '#999999',
                    
                },
                data: xList,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                axisLabel: {
                    interval: 0,
                    textStyle: {
                        color: '#7c7c7c'
                    }
                }
            },
            dataZoom: {
                show: xList.length > 6? true: false,
                maxValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 25
            },
            yAxis: {
                type: 'value',
                name: '总额(元)',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 30]
                },
                splitLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#999999'
                    },
                    formatter: '{value} '
                }
            },
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [currentDataType, consumeStatisticList]);
    useEffect(() => {
        if(consumeStatisticList.length == 0){
            return;
        }
        let xList = [], myList = [], classList = [], gradeList = [], seriesList = [];
        consumeStatisticList.forEach((item)=>{
            xList.push(item.month);
            myList.push(item.personalTimes);
            classList.push(item.classTimes);
            gradeList.push(item.gradeTimes);
        })
        if(userIdentity == "student"){
            seriesList = [
                {
                    name:'个人',
                    type:'line',
                    lineStyle: {
                        color: '#ff0000',
                        width: 1,
                        borderColor: '#ff0000',
                        emphasis: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        color: '#ff0000'
                    },
                    data:myList
                },
                {
                    name:'班级',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1da4fe'
                        },{
                            offset: 1,
                            color: '#7ecbff'
                        }])
                    },
                    data:classList
                },
                {
                    name:'年级',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#51ca51'
                        },{
                            offset: 1,
                            color: '#a0dea0'
                        }])
                    },
                    data:gradeList
                },
                
            ]
        }
        if(userIdentity == "teacher"){
            seriesList = [
                {
                    name:'班级',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1da4fe'
                        },{
                            offset: 1,
                            color: '#7ecbff'
                        }])
                    },
                    data:classList
                },
                {
                    name:'年级',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#51ca51'
                        },{
                            offset: 1,
                            color: '#a0dea0'
                        }])
                    },
                    data:gradeList
                }, 
            ]
        }
        let myEchart = echarts.init(document.getElementById("consume-count-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '消费次数',
                left: 'center',
                top: '20px',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            grid: {
                top: 85,
                bottom: xList.length > 6? 55: 45
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                extraCssText: "border: 0; background-color: rgba(0, 0, 0, 0.6);",
                formatter: function(params){
                    let str = `
                    <span 
                    style="
                    display: inline-block; 
                    width: 100%; 
                    color: #fffd64; 
                    text-overflow: ellipsis; 
                    overflow: hidden; 
                    white-space: nowrap;">${params[0].name}</span><br/>`;
                    params.forEach((item)=>{
                        str += `
                        <i class='tooltip-dot'></i>
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}次</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '50px',
                right: '10%',
                data:['个人','班级','年级'],
                textStyle: {
                    color: '#999999',
                }
            },
            xAxis: {
                type: 'category',
                name: '日期',
                nameTextStyle: {
                    color: '#999999',
                    
                },
                data: xList,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                axisLabel: {
                    interval: 0,
                    textStyle: {
                        color: '#7c7c7c'
                    }
                }
            },
            dataZoom: {
                show: xList.length > 6? true: false,
                maxValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 25
            },
            yAxis: {
                type: 'value',
                name: '次数',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 30]
                },
                splitLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#999999'
                    },
                    formatter: '{value} '
                }
            },
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [currentDataType, consumeStatisticList]);
    let gradeSum = 0, 
    gradeCount = consumeGradeList.length, sum = 0, classSum = 0, count = consumeList.length, 
    classCount = consumeClassList.length;
    consumeList.forEach((item)=>{
        sum += item.count;
    })
    consumeClassList.forEach((item)=>{
        classSum += item.count;
    })
    consumeGradeList.forEach((item)=>{
        gradeSum += item.count;
    })
    return (
        <div className="my-consume">
            <div className="show-top">
                <div className="consume-level">
                    <i className="livelogo"></i>
                    <p className="live-name">消费水平: <span>--</span></p>
                    <p>--</p>
                </div>
                <div className="consume-sum">
                    <i className="livelogo"></i>
                    <p className="live-name">消费总额: <span>{sum}</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:{gradeSum}</p>:
                        <p>班级平均:{classSum}; 年级平均:{gradeSum}</p>
                    }
                </div>
                <div className="consume-count">
                    <i className="livelogo"></i>
                    <p className="live-name">消费次数: <span>{count}</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:{gradeCount}</p>:
                        <p>班级平均:{gradeCount}; 年级平均:{gradeCount}</p>
                    }
                </div>
                <div className="consume-frequency">
                    <i className="livelogo"></i>
                    <p className="live-name">消费频率: <span>--次/天</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:--</p>:
                        <p>班级平均:--; 年级平均:--</p>
                    }
                </div>
            </div>
            {
                consumeList.length > 0?
                <div className="show-center">
                    <div className="consume-kind-echart" id="consume-kind-echart"></div>      
                    <div className="slice-line"></div>
                    <div className="consume-area-echart" id="consume-area-echart"></div>
                    <div className="slice-line"></div>
                    <div className="consume-time-echart" id="consume-time-echart"></div>
                </div>  :
                <Empty
                className={"bar-empty"}
                style={{margin: "20px 0"}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>
            }
        
            <div className="select-container">
                <span>时间:</span>
                <Select value={currentDataType} className="select" onChange={(value)=>setCurrentDataType(value)}>
                    <Option value="3">按天数</Option>
                    <Option value="2">按周次</Option>
                    <Option value="1">按月份</Option>
                </Select>
            </div>
            {
                consumeStatisticList.length > 0?
                <div className="show-bottom">
                
                    <div className="consume-sum-echart" id="consume-sum-echart"></div>
                    <div className="slice-line"></div>
                    <div className="consume-count-echart" id="consume-count-echart"></div>
                </div>:
                <Empty
                // className={"bar-empty"}
                style={{margin: "20px 0"}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>
            }   
            
        </div>
    );
}
const mapStateToProps = (state) => {
    let { 
      commonData:{
        termInfo:{
          HasHistory,
          TermInfo
        },
        userInfo
      } 
    } = state;
    // console.log(state)
    return {HasHistory, TermInfo, userInfo};
}
export default connect(mapStateToProps)(memo(forwardRef(MyConsume)));
  