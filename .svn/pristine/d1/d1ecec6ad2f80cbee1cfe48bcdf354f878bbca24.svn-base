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
let { BasicProxy } = ipConfig;
const {Option} = Select;
//   import { resizeForEcharts } from "../../../util/public";
function MyInternet(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
        reflash
      } = props;
    const [currentDataType, setCurrentDataType] = useState("1");
    const [internetList, setInternetList] = useState([]);
    const [internetGradeList, setInternetGradeList] = useState([]);
    const [internetClassList, setInternetClassList] = useState([]);
    const [internetStatisticList, setInternetStatisticList] = useState([]);
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
        let url = BasicProxy + "/api/campusLife/networkLog/list?studentId=" + (
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
                let date = new Date(item.startTime).getHours();
                if(date >= 0 && date <= 6){
                    item.startTime = "凌晨";
                }
                if(date > 6 && date <= 12){
                    item.startTime = "上午";
                }
                if(date > 12 && date <= 14){
                    item.startTime = "中午";
                }
                if(date > 14 && date <= 18){
                    item.startTime = "下午";
                }
                if(date > 18 && date <= 24){
                    item.startTime = "晚上";
                }
            })
              setInternetList(result.data);
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
        let  url = BasicProxy + "/api/campusLife/networkLog/distribution?id=" + (
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
                setInternetStatisticList(result.data);
              }
          })
    }, [userIdentity, currentGrade, currentClass, currentTerm, currentDataType, reflash]);
     //获取班级数据
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
        let url = BasicProxy + "/api/campusLife/networkLog/list?studentId=" +
        "&gradeId=&classId=" + currentClass +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
            setInternetClassList(result.data);
            }
        }) 
    }, [userIdentity, currentGrade, currentClass, currentTerm, currentDataType, reflash]);
    //获取年级数据
    useLayoutEffect(() => {
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let url = BasicProxy + "/api/campusLife/networkLog/list?studentId=" +
        "&classId=&gradeId=" + currentGrade +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
              setInternetGradeList(result.data);
            }
        }) 
    }, [userIdentity, currentGrade, currentClass, currentTerm, currentDataType, reflash]);
    const colorList = ['#89df89', '#e84855', '#36afd2', '#2d3047', '#ffb782', 'pink'];
    useEffect(() => {
        if(internetList.length == 0){
            return;
        }
        let sumCount = internetList.length;
        let xList = [], dataList = [];
        internetList.forEach((item)=>{
            xList.push(item.type);
        })
        xList = [...new Set(xList)];
        xList.forEach((item)=>{
            let sum = 0;
            internetList.forEach((child)=>{
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
        let myEchart = echarts.init(document.getElementById("kind-position-echart"));
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
                text: '上网类别分布图',
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
                    // name: '访问来源',
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
    }, [internetList]);
    useEffect(() => {
        if(internetList.length == 0){
            return;
        }
        let xList = [], dataList = [];
        internetList.forEach((item)=>{
            xList.push(item.place);
        })
        xList = [...new Set(xList)];
        xList.forEach((item)=>{
            let sum = 0;
            internetList.forEach((child)=>{
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
        let myEchart = echarts.init(document.getElementById("place-position-echart"));
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
                text: '上网地点分布图',
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
                    // name: '访问来源',
                    type: 'pie',
                    radius: ['25%', '55%'],
                    center: ['50%', '45%'],
                    minAngle: 25,
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        // textStyle: {
                        //     color: function(params) {
                        //         console.log(params)
                        //         return colorList[params.dataIndex]
                        //     },
                        // },
                        formatter: `{b} {d}%`
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
    }, [internetList]);
    useEffect(() => {
        if(internetList.length == 0){
            return;
        }
        let xList = [], dataList = [];
        internetList.forEach((item)=>{
            xList.push(item.startTime && item.startTime.substr(0, 10));
        })
        xList = [...new Set(xList)];
        xList.forEach((item)=>{
            let sum = 0;
            internetList.forEach((child)=>{
                if(child.startTime == item){
                    sum += 1;
                }
            })
            let obj = {
                name: item,
                value: sum
            }
            dataList.push(obj);
        })
        let myEchart = echarts.init(document.getElementById("time-position-echart"));
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
                text: '上网时间分布图',
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
                    // name: '访问来源',
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
    }, [internetList]);
    useEffect(() => {
        if(internetStatisticList.length == 0){
            return;
        }
        let xList = [], myList = [], classList = [], gradeList = [], seriesList = [];
        internetStatisticList.forEach((item)=>{
            xList.push(item.month);
            myList.push(parseInt(item.personalCount/1000/60/60));
            classList.push(parseInt(item.classCount/1000/60/60));
            gradeList.push(parseInt(item.gradeCount/1000/60/60));
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
        let myEchart = echarts.init(document.getElementById("internet-time-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '上网时长',
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
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '50px',
                right: '10%',
                // data:['个人','班级','年级'],
                textStyle: {
                    color: '#999999',
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
            yAxis: {
                type: 'value',
                name: '时长/h',
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
    }, [currentDataType, internetStatisticList]);
    useEffect(() => {
        if(internetStatisticList.length == 0){
            return;
        }
        let xList = [], myList = [], classList = [], gradeList = [], seriesList = [];
        internetStatisticList.forEach((item)=>{
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
        let myEchart = echarts.init(document.getElementById("internet-count-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '上网次数',
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
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '50px',
                right: '10%',
                // data:['个人','班级','年级'],
                textStyle: {
                    color: '#999999',
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
    }, [currentDataType, internetStatisticList]);
    let gradeSum = 0, 
    gradeCount = internetGradeList.length, sum = 0, classSum = 0, count = internetList.length, 
    classCount = internetClassList.length;
    internetList.forEach((item)=>{
        sum += item.duration;
    })
    internetClassList.forEach((item)=>{
        classSum += item.duration;
    })
    internetGradeList.forEach((item)=>{
        gradeSum += item.duration;
    })
    return (
        <div className="my-internet">
            <div className="show-top">
                <div className="internet-time">
                    <i className="livelogo"></i>
                    <p className="live-name">上网时长: <span>
                        {(sum/1000/60/60).toFixed(1)}h</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p title={`年级平均:${(gradeSum/1000/60/60).toFixed(1)}`}>年级平均:{(gradeSum/1000/60/60).toFixed(1)}</p>:
                        <p title={`班级平均:${(classSum/1000/60/60).toFixed(1)}; 年级平均:${(gradeSum/1000/60/60).toFixed(1)}`}>
                            班级平均:{(classSum/1000/60/60).toFixed(1)}; 年级平均:{(gradeSum/1000/60/60).toFixed(1)}
                        </p>
                    }
                </div>
                <div className="internet-count">
                    <i className="livelogo"></i>
                    <p className="live-name">上网次数: <span>{count}</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p title={`年级平均:${gradeCount}`}>年级平均:{gradeCount}</p>:
                        <p title={`班级平均:${classCount}; 年级平均:${gradeCount}`}>
                            班级平均:{classCount}; 年级平均:{gradeCount}
                        </p>
                    }
                </div>
                {/* <div className="internet-frequency">
                    <i className="livelogo"></i>
                    <p className="live-name">上网频率: <span>2次/天</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:982</p>:
                        <p>班级平均:1010; 年级平均:982</p>
                    }
                </div> */}
            </div>
            {
                internetList.length > 0?
                <div className="show-center">
                    <div className="kind-position-echart" id="kind-position-echart"></div>
                    <div className="slice-line"></div>
                    <div className="place-position-echart" id="place-position-echart"></div>
                    <div className="slice-line"></div>
                    <div className="time-position-echart" id="time-position-echart"></div>
                </div>:
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
                internetStatisticList.length > 0?
                <div className="show-bottom">
                    <div className="internet-time-echart" id="internet-time-echart"></div>
                    <div className="slice-line"></div>
                    <div className="internet-count-echart" id="internet-count-echart"></div>
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
export default connect(mapStateToProps)(memo(forwardRef(MyInternet)));
  