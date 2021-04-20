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
import { Progress, Select, Carousel, Popover } from "antd";
import { Scrollbars } from "react-custom-scrollbars";

import * as echarts from "echarts/lib/echarts";
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
import { data } from "jquery";
let { BasicProxy } = ipConfig;
const {Option} = Select;

function AwardMsg(props, ref) {
    let {
        userIdentity,
        currentTerm,
        currentGrade,
        currentClass,
        userInfo: { UserID, SchoolID },
        reflash
    } = props;
    const [awardList, setAwardList] = useState([]);
    const [awardStatisticList, setAwardStatisticList] = useState([]);
    const [gradeAwardList, setGradeAwardList] = useState([]);
    //日期类型，1按月，2按周，3按日
    const [listType, setListType] = useState("1");
    const awardLevelList = {
        "1": '一等奖',
        "2": '二等奖',
        "3": '三等奖',
        "-1": '其他'
    };
    let colorList = [
        new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#1da4fe'
        },{
            offset: 1,
            color: '#7ecbff'
        }]),
        new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#51ca51'
        },{
            offset: 1,
            color: '#a0dea0'
        }]),
        new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#F79750'
        },{
            offset: 1,
            color: '#FFB681'
        }]),
        new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#2D3149'
        },{
            offset: 1,
            color: '#363D71'
        }]),
        new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#E84956'
        },{
            offset: 1,
            color: '#E9707A'
        }]),
        new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#6E54CC'
        },{
            offset: 1,
            color: '#7E90E9'
        }])
    ];
    //查年级平均用于图表
    useLayoutEffect(()=>{
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(!currentTermInfo.startDate || !currentTermInfo.endDate){
            return;
        }
        let url;
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        url = BasicProxy + "/api/punishAndReward/rewards/list?studentId=" + 
        "&classId=" +
        "&gradeId=" + currentGrade +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setGradeAwardList(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, reflash]);
    useLayoutEffect(()=>{
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        if(!currentTermInfo.startDate || !currentTermInfo.endDate){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let url;
        if(userIdentity == 'student'){//学生获取本人奖励信息
            if(!UserID){
                return;
            }
            url = BasicProxy + "/api/punishAndReward/rewards/list?studentId=" + 
            (userIdentity == "student"? UserID: "") +
            "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
            "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        } else {//老师、领导获取奖励信息
            if(userIdentity == "teacher" && !currentClass){
                return;
            }
            url = BasicProxy + "/api/punishAndReward/rewards/list?studentId=" + 
            "&classId=" + currentClass +
            "&gradeId=" + currentGrade +
            "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
            "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        }
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setAwardList(result.data);
            } else {
                setAwardList(false);
            }
        })
    }, [currentTerm, currentClass, currentGrade, reflash]);
    //获取奖励统计图表数据
    useLayoutEffect(()=>{
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        if(!currentTermInfo.startDate || !currentTermInfo.endDate){
            return;
        }
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let url = BasicProxy + "/api/punishAndReward/rewards/distribution?id=" + (
            userIdentity == "student"?
            UserID:
            userIdentity == "teacher"?
            currentClass:
            userIdentity == "manager"?
            currentClass?
            currentClass:
            currentGrade?
            currentGrade:
            "":
            ""
        ) +
        "&queryType=" + (
            userIdentity == "student"?
            1:
            userIdentity == "teacher"?
            2:
            currentClass?
            2:
            currentGrade?
            3:
            ""
        ) +
        "&periodType=" + listType +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setAwardStatisticList(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, UserID, userIdentity, listType, reflash]);
    //领导端调用接口
    //获取奖励列表
    useLayoutEffect(()=>{
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};
        if(!currentTermInfo.startDate || !currentTermInfo.endDate){
            return;
        }
        if(userIdentity != "manager" || currentClass || currentGrade){
            return;
        }
        let  url = BasicProxy + "/api/punishAndReward/rewards/leader/list?classId=&gradeId=" +
        "&schoolId=" + SchoolID +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
        "&endDate=" + currentTermInfo.endDate.substr(0, 10) +
        "&page=1&pageSize=100";
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && result.data){
                setAwardList(result.data.records);
            } else {
                setAwardList(false);
            }
        })
    }, [currentTerm, currentClass, currentGrade, reflash, SchoolID]);
    //获取奖励统计图表数据
    useLayoutEffect(()=>{
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};
        if(!currentTermInfo.startDate || !currentTermInfo.endDate){
            return;
        }
        if(userIdentity != "manager" || currentClass || currentGrade){
            return;
        }
        let url = BasicProxy + "/api/punishAndReward/rewards/leader/distribution?classId=&gradeId=" +
        "&schoolId=" + SchoolID +
        "&periodType=" + listType +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setAwardStatisticList(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, UserID, userIdentity, listType, reflash]);
    useEffect(() => {
        if(!awardList || awardList.length == 0){
            return;
        }
        //获取已有等级列表
        let awardLevelList = awardList.map((item)=>{
            return item.awardLevelName;
        })
        awardLevelList = [...new Set(awardLevelList)];
        let dataList = [];
        awardLevelList.forEach((item)=>{
            let arr = [];
            awardList.forEach((child)=>{
                if(child.awardLevelName == item){
                    arr.push(arr);
                }
            })
            let obj = {
                name: item,
                value: arr.length
            }
            dataList.push(obj);
        })
        let myEchart = echarts.init(document.getElementById("rank-position-echart"));
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
                text: '获奖等级分布图',
                left: 'center',
                top: '80%',
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
                    color: 'rgba(0, 0, 0, 0)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 0, 0, 0)', // 100% 处的颜色
                  },
                ],
            },
            color: ['#89df89', '#e84855', '#36afd2', '#2d3047', '#ffb782', 'pink'],
            series: [
                {
                    name: '获奖等级',
                    type: 'pie',
                    radius: ['25%', '55%'],
                    center: ['50%', '45%'],
                    minAngle: 25,
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        color: 'auto',
                        formatter: `{b}  {d}%`
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
    }, [awardList]);
    useEffect(() => {
        if(!awardList || awardList.length == 0){
            return;
        }
        //获取已有等级列表
        let awardClassList = awardList.map((item)=>{
            return awardLevelList[item.awardClass]? awardLevelList[item.awardClass]: "其他";
        })
        awardClassList = [...new Set(awardClassList)];
        let dataList = [];
        awardClassList.forEach((item)=>{
            let arr = [];
            awardList.forEach((child)=>{
                child.awardClass = child.awardClass? child.awardClass: "-1";
                if(awardLevelList[child.awardClass] == item){
                    arr.push(arr);
                }
            })
            let obj = {
                name: item,
                value: arr.length
            }
            dataList.push(obj);
        })
        let myEchart = echarts.init(document.getElementById("level-position-echart"));
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
                text: '获奖等级分布图',
                left: 'center',
                top: '80%',
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
                    color: 'rgba(0, 0, 0, 0)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 0, 0, 0)', // 100% 处的颜色
                  },
                ],
            },
            color: ['#89df89', '#e84855', '#36afd2', '#2d3047', '#ffb782', 'pink'],
            series: [
                {
                    name: '获奖等级',
                    type: 'pie',
                    radius: ['25%', '55%'],
                    center: ['50%', '45%'],
                    minAngle: 25,
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        color: 'auto',
                        formatter: `{b}  {d}%`
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
    }, [awardList]);
    useEffect(() => {
        if(!awardStatisticList || awardStatisticList.length == 0){
            return;
        }
        let xList = [], myList = [], classList = [], gradeList = [], classSumList = [], gradeSumList = [];
       
        let myEchart = echarts.init(document.getElementById("award-statistic-echart"));
        myEchart.resize();
        let seriesList = [], gradeDataList = [], legendList = [];
        if(userIdentity == 'manager' && !currentClass && !currentGrade){
            let sumList = [];
            awardStatisticList.forEach((item)=>{
                sumList.push(item.totalTimes);
            });
            seriesList.push({
                name:'总数',
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
                data: sumList
            },)
            awardStatisticList.forEach((item, index)=>{
                xList.push(item.date);
                let arr = [];
                Array.isArray(item.classTimes) &&
                item.classTimes.forEach((child)=>{
                    arr.push(child.rewardsCount);
                    legendList.push(child.classInfo? child.classInfo.gradeName: "");
                })
                seriesList.push({
                    // name:'班级',
                    type:'bar',
                    // barWidth : 16,
                    itemStyle: {
                        color: colorList[index%6]
                    },
                    data: arr
                })
            })
            legendList = [...new Set(legendList)];
            legendList.unshift("总数");
        } else if(currentClass && !currentGrade){
            awardStatisticList.forEach((item)=>{
                xList.push(item.month);
                myList.push(typeof item.personalTimes == "number"? item.personalTimes.toFixed(1): "--");
                classList.push(typeof item.classTimes == "number"? item.classTimes.toFixed(1): "--");
                gradeList.push(typeof item.gradeTimes == "number"? item.gradeTimes.toFixed(1): "--");
                classSumList.push(typeof item.classCount == "number"? item.classCount: "--");
                gradeSumList.push(typeof item.totalCount == "number"? item.totalCount: "--");
            })
            seriesList = [
                {
                    name:'班级奖项',
                    type:'line',
                    lineStyle: {
                        color: '#2d3047',
                        width: 1,
                        borderColor: '#2d3047',
                        emphasis: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        color: '#2d3047'
                    },
                    data: classList
                },
                {
                    name:'班级总数',
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
                    data: classSumList
                },
                {
                    name:'年级平均',
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
                    data: gradeList
                },
                
            ];
        } else if(!currentClass && currentGrade){
            awardStatisticList.forEach((item)=>{
                xList.push(item.month);
                myList.push(typeof item.personalTimes == "number"? item.personalTimes.toFixed(1): "--");
                classList.push(typeof item.classTimes == "number"? item.classTimes.toFixed(1): "--");
                gradeList.push(typeof item.gradeTimes == "number"? item.gradeTimes.toFixed(1): "--");
                classSumList.push(typeof item.classCount == "number"? item.classCount: "--");
                gradeSumList.push(typeof item.totalCount == "number"? item.totalCount: "--");
            })
            seriesList = [
                {
                    name:'年级平均',
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
                    data: gradeList
                },
                {
                    name:'年级总数',
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
                    data: gradeSumList
                },    
            ];
        } else if(userIdentity == "student"){
            awardStatisticList.forEach((item)=>{
                xList.push(item.month);
                myList.push(typeof item.personalTimes == "number"? item.personalTimes.toFixed(1): "--");
                classList.push(typeof item.classTimes == "number"? item.classTimes.toFixed(1): "--");
                gradeList.push(typeof item.gradeTimes == "number"? item.gradeTimes.toFixed(1): "--");
                classSumList.push(typeof item.classCount == "number"? item.classCount: "--");
                gradeSumList.push(typeof item.totalCount == "number"? item.totalCount: "--");
            })
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
                    data: myList
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
                    data: classList
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
                    data: gradeList
                },
                
            ];
        }
        let option = {
            title: {
                text: '获奖统计',
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
                type: "scroll",
                width: "80%",
                top: '50px',
                left: 'center',
                data: (userIdentity == 'manager' && !currentClass && !currentGrade? legendList: ""),
                // data:['个人','班级','年级'],
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
    }, [awardStatisticList, userIdentity]);
    let updateAwardList = [];
    let arr = [];
    //每9个化为一页，进行轮播
    Array.isArray(awardList) && awardList.forEach((item, index)=>{
        arr.push(item);
        if((index + 1) % 9 == 0 || index == awardList.length - 1){
            updateAwardList.push(arr);
            arr = [];
        }
    })
    return (
        <div className="award-info">
            {
                Array.isArray(awardList) && awardList.length > 0?
                <div>
                    <div className="award-info-top">
                    <div className="award-sum">
                        {/* <Popover
                        placement="bottomLeft"
                        content={
                            <div className="circle-tootip">
                                <p className="tooltip-title">班级获奖情况</p>
                                <ul className="tooltip-list">
                                    <li>班集体获奖次数 <span>22次</span><i className="downlogo"></i></li>
                                    <li>学生个人获奖次数 <span>22次</span><i className="uplogo"></i></li>
                                    <li>年级平均获奖次数 <span>43次</span></li>
                                </ul>
                            </div>
                        }> */}
                        <div className="circle">
                            {Array.isArray(awardList)? awardList.length: "--"}
                        </div>
                        {/* </Popover> */}
                        <p>
                            {userIdentity == 'teacher'? 
                            "班级": 
                            userIdentity == 'manager'? 
                            "全校":
                            "个人"}获奖总数
                        </p>
                    </div>
                    <div className="slice-line"></div>
                    <Carousel
                    dots={{
                        className: 'award-dot'
                    }}>
                        {
                            updateAwardList.map((item, index)=>{
                                return (
                                    <div className="award-list" key={index}>
                                    {
                                        item.map((child, index1)=>{
                                            return (
                                            <div className="award-one" key={index1}>
                                                <i className={"awardlogo " + 
                                                (
                                                    child.awardLevel == 5 || child.awardClass == 1?
                                                    "award-1":
                                                    child.awardLevel == 4 || child.awardClass == 2?
                                                    "award-2":
                                                    child.awardLevel == 3 || child.awardClass == 3?
                                                    "award-3":
                                                    ""
                                                )
                                                }></i>
                                                <p title={child.awardLevelName + child.awardName}>
                                                    {child.awardLevelName + child.awardName}
                                                </p>
                                                <p title={awardLevelList[child.awardClass]}>
                                                    {awardLevelList[child.awardClass]}
                                                </p>
                                                {
                                                    userIdentity == 'manager'?
                                                    <p 
                                                    title={child.studentName}
                                                    style={{color: '#ff6600'}}
                                                    >[{child.studentName}]</p>:
                                                    ""
                                                }
                                            </div>
                                            )
                                        })
                                    }  
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                </div>
                <div className="award-pie-echart">
                    <div className="rank-position-echart" id="rank-position-echart"></div>
                    <div className="slice-line"></div>
                    <div className="level-position-echart" id="level-position-echart"></div>
                </div>
                                
                </div>
                :
                <Empty
                // className={"list-empty"}
                style={{margin: "40px 0"}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>

            }
            {
                awardStatisticList.length > 0?
                <div className="award-bar-container">
                    <div className="select-container">
                        <span>时间:</span>
                        <Select 
                        defaultValue="1" 
                        className="select" 
                        onChange={(value)=>setListType(value)}>
                            <Option value="3">按天数</Option>
                            <Option value="2">按周次</Option>
                            <Option value="1">按月份</Option>
                        </Select>
                    </div>
                    <div className="award-statistic-echart" id="award-statistic-echart"></div>
                </div>:
                Array.isArray(awardList) && awardList.length > 0?
                <Empty
                // className={"list-empty"}
                style={{margin: "40px 0", paddingBottom: 20}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>:
                ""
            }

           
        </div>
    );
}
  
const mapStateToProps = (state) => {
    let {
        commonData: { levelHash, userInfo },
    } = state;
    return { levelHash, userInfo };
};
export default connect(mapStateToProps)(memo(forwardRef(AwardMsg)));
  