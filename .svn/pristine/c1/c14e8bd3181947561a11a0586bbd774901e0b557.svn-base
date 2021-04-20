import React, {
    useState,
    useEffect,
    memo,
    forwardRef,
    useLayoutEffect
} from "react";
import {connect} from "react-redux";
import {Progress} from "antd";
import "./index.scss";
import {Select} from "antd";
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import * as graphic from 'echarts/lib/util/graphic';
import { Empty, Loading } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
import home from "../../train/home";
let { BasicProxy } = ipConfig;
const {Option} = Select;

function SchoolAttendance(props){
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
        reflash
    } = props;
    const [visible, setVisible] = useState(true);
    const [homeAttendanceInfo, setHomeAttendanceInfo] = useState({});
    const [homeAttendanceList, setHomeAttendanceList] = useState({});
    const [currentRange, setCurrentRange] = useState("上午");
    const [gradeHomeAttendanceInfo, setGradeHomeAttendanceInfo] = useState({});
    const [classHomeAttendanceInfo, setClassHomeAttendanceInfo] = useState({});
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
    //获取年级平均数据
    useLayoutEffect(() => {
        if(userIdentity == "manager" && !currentClass && !currentGrade){
            return;
        }
        if(!currentGrade && !currentClass){
            return;
        }
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        if(currentClass){
            classList.forEach((item)=>{
                if(item.classId == currentClass){
                    classGradeId = item.gradeId;
                }
            })
        }
        
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let url = BasicProxy + "/api/attendance/gate?type=3" + 
        "&studentId=&classId=&gradeId=" + (currentGrade? currentGrade: classGradeId) +
        "&schoolId=" + SchoolID +
        // "&termId=" + currentTermInfo.termId +
        "&start=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&end=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setGradeHomeAttendanceInfo(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    //获取班级平均数据
    useLayoutEffect(() => {
        if(userIdentity == "manager" && !currentClass && !currentGrade){
            return;
        }
        if(userIdentity != "student"){
            return;
        }
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let url = BasicProxy + "/api/attendance/gate?type=2" + 
        "&studentId=&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        // "&termId=" + currentTermInfo.termId +
        "&start=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&end=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setClassHomeAttendanceInfo(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    useLayoutEffect(() => {
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        setVisible(true);
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let url = BasicProxy + "/api/attendance/gate?type=" + 
        (
            userIdentity == "student"?
            1:
            userIdentity == "teacher"?
            2:
            currentClass?
            2:
            currentGrade?
            3:
            4
        ) +
        "&studentId=" + (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        // "&termId=" + currentTermInfo.termId +
        "&start=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&end=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setHomeAttendanceInfo(result.data);
            }
            setVisible(false);
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    //领导端
    useLayoutEffect(() => {
        if(userIdentity != "manager" || currentClass || currentGrade){
            return;
        }
        setVisible(true);
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let url = BasicProxy + "/api/attendance/gate/batch?type=3" +
        "&schoolId=" + SchoolID +
        // "&termId=" + currentTermInfo.termId +
        "&start=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&end=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setHomeAttendanceList(result.data);
            }
            setVisible(false);
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    //出门时间统计
    useEffect(() => {
        let myEchart = echarts.init(document.getElementById("school-out-time-echart"));
        myEchart.resize();
        let seriesList = [], xList = [], myList = [], classList = [], gradeList = [];
        if(userIdentity == 'student'){
            Array.isArray(homeAttendanceInfo.attendanceGateDayList) &&
            homeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                       if(child.timeDetailName == currentRange){
                        avg = child.outTime;
                    } 
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                myList.push(avg);
            })
            Array.isArray(classHomeAttendanceInfo.attendanceGateDayList) &&
            classHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                       if(child.timeDetailName == currentRange){
                        avg = child.outTime;
                    } 
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                classList.push(avg);
            })
            Array.isArray(gradeHomeAttendanceInfo.attendanceGateDayList) &&
            gradeHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                       if(child.timeDetailName == currentRange){
                        avg = child.outTime;
                    } 
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                gradeList.push(avg);
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
                    data:xList
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
        } else if(currentClass){
            Array.isArray(homeAttendanceInfo.attendanceGateDayList) &&
            homeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                   if(child.timeDetailName == currentRange){
                        avg = child.outTime;
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                myList.push(avg);
            })
            Array.isArray(classHomeAttendanceInfo.attendanceGateDayList) &&
            classHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                   if(child.timeDetailName == currentRange){
                        avg = child.outTime;
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                classList.push(avg);
            })
            Array.isArray(gradeHomeAttendanceInfo.attendanceGateDayList) &&
            gradeHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                   if(child.timeDetailName == currentRange){
                        avg = child.outTime;
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                gradeList.push(avg);
            })
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
                    data:myList
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
        } else if(currentGrade){
            Array.isArray(homeAttendanceInfo.attendanceGateDayList) &&
            homeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                   if(child.timeDetailName == currentRange){
                        avg = child.outTime;
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                myList.push(avg);
            })
            Array.isArray(classHomeAttendanceInfo.attendanceGateDayList) &&
            classHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                   if(child.timeDetailName == currentRange){
                        avg = child.outTime;
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                classList.push(avg);
            })
            Array.isArray(gradeHomeAttendanceInfo.attendanceGateDayList) &&
            gradeHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                   if(child.timeDetailName == currentRange){
                       avg = child.outTime;
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                gradeList.push(avg);
            })
            seriesList = [
                {
                    name:'年级',
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
                    data:myList
                } 
            ]
        } else {
            //领导端查学校全年级
            Array.isArray(homeAttendanceList) &&
            homeAttendanceList.forEach((item, index)=>{
                let arr = [];
                item.attendanceGate &&
                Array.isArray(item.attendanceGate.attendanceGateDayList) &&
                item.attendanceGate.attendanceGateDayList.forEach((item)=>{
                    xList.push(item.dayDate && item.dayDate);
                    let sum = 0, avg = 0;
                    item.detailDataList.forEach((child)=>{
                       if(child.timeDetailName == currentRange && child.outTime){
                            avg = child.outTime;
                        } 
                    })
                    // avg = parseInt(sum / (item.detailDataList.length));
                    arr.push(avg);
                })
                seriesList.push({
                    name: item.gradeName,
                    type:'bar',
                    // barWidth : 16,
                    itemStyle: {
                        color: colorList[index%5]
                    },
                    data:arr
                })
            });
            
        }
        let option = {
            title: {
                text: '离校时间',
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
                    let str = `<span style="color: #fffd64">${params[0].name}</span><br/>`;
                    params.forEach((item)=>{
                        str += `
                        <i class='dot'></i>
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}</span><br/>`;
                    })
                    return str;
                }
            },
            legend: (
                userIdentity == "manager" && !currentGrade && !currentClass?
                {
                    type: 'scroll',
                    width: '62%',
                    top: '50px',
                    left: 'center',
                    textStyle: {
                        color: '#999999',
                    }
                }:
                {
                    top: '50px',
                    right: '10%',
                    // data:['个人','班级','年级'],
                    textStyle: {
                        color: '#999999',
                    }
                }
            ),
            dataZoom: {
                show: xList.length > 6? true: false,
                maxValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 10
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
                    textStyle: {
                        color: '#7c7c7c'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: '时间',
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
                    formatter: function(value){
                        let date = new Date(value);
                        return date.getHours() + ":" + date.getMinutes()
                    }
                }
            },
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [currentRange, homeAttendanceList, homeAttendanceInfo]);
    //归寝时间统计
    useEffect(() => {
        let myEchart = echarts.init(document.getElementById("school-in-time-echart"));
        myEchart.resize();
        let seriesList = [], xList = [], myList = [], classList = [], gradeList = [];
        if(userIdentity == 'student'){
            Array.isArray(homeAttendanceInfo.attendanceGateDayList) &&
            homeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                       if(child.timeDetailName == currentRange){
                        avg = child.inTime;
                    } 
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                myList.push(avg);
            })
            Array.isArray(classHomeAttendanceInfo.attendanceGateDayList) &&
            classHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                       if(child.timeDetailName == currentRange){
                        avg = child.inTime;
                    } 
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                classList.push(avg);
            })
            Array.isArray(gradeHomeAttendanceInfo.attendanceGateDayList) &&
            gradeHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                       if(child.timeDetailName == currentRange){
                        avg = child.inTime;
                    } 
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                gradeList.push(avg);
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
                    data:xList
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
        } else if(currentClass){
            Array.isArray(homeAttendanceInfo.attendanceGateDayList) &&
            homeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                   if(child.timeDetailName == currentRange){
                        avg = child.inTime;
                    } 
                })
                // avg = parseInt(sum / (item.detailDataList.length));
                myList.push(avg);
            })
            Array.isArray(classHomeAttendanceInfo.attendanceGateDayList) &&
            classHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                         avg = child.inTime;
                     } 
                 })
                 // avg = parseInt(sum / (item.detailDataList.length));
                classList.push(avg);
            })
            Array.isArray(gradeHomeAttendanceInfo.attendanceGateDayList) &&
            gradeHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                         avg = child.inTime;
                     } 
                 })
                 // avg = parseInt(sum / (item.detailDataList.length));
                gradeList.push(avg);
            })
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
                    data:myList
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
        } else if(!currentClass && currentGrade){
            Array.isArray(homeAttendanceInfo.attendanceGateDayList) &&
            homeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                         avg = child.inTime;
                     } 
                 })
                 // avg = parseInt(sum / (item.detailDataList.length));
                myList.push(avg);
            })
            Array.isArray(classHomeAttendanceInfo.attendanceGateDayList) &&
            classHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                         avg = child.inTime;
                     } 
                 })
                 // avg = parseInt(sum / (item.detailDataList.length));
                classList.push(avg);
            })
            Array.isArray(gradeHomeAttendanceInfo.attendanceGateDayList) &&
            gradeHomeAttendanceInfo.attendanceGateDayList.forEach((item)=>{
                xList.push(item.dayDate && item.dayDate);
                let sum = 0, avg = 0;
                item.detailDataList.forEach((child)=>{
                    if(child.timeDetailName == currentRange){
                         avg = child.inTime;
                     } 
                 })
                 // avg = parseInt(sum / (item.detailDataList.length));
                gradeList.push(avg);
            })
            seriesList = [
                {
                    // name:'年级',
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
                    data:myList
                }
            ];
        } else {
            //领导端查学校全年级
            Array.isArray(homeAttendanceList) &&
            homeAttendanceList.forEach((item, index)=>{
                let arr = [];
                
                item.attendanceGate &&
                Array.isArray(item.attendanceGate.attendanceGateDayList) &&
                item.attendanceGate.attendanceGateDayList.forEach((item)=>{
                    xList.push(item.dayDate);
                    let sum = 0, avg = 0;
                    item.detailDataList.forEach((child)=>{
                        if(child.timeDetailName == currentRange && child.inTime){
                             avg = child.inTime;
                        } 
                     })
                     // avg = parseInt(sum / (item.detailDataList.length));
                    arr.push(avg);
                });
                seriesList.push({
                    name: item.gradeName,
                    type:'bar',
                    // barWidth : 16,
                    itemStyle: {
                        color: colorList[index%5]
                    },
                    data:arr
                })
            });
        }
        let option = {
            title: {
                text: '到校时间',
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
                    let str = `<span style="color: #fffd64">${params[0].name}</span><br/>`;
                    params.forEach((item)=>{
                        str += `
                        <i class='dot'></i>
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}</span><br/>`;
                    })
                    return str;
                }
            },
            legend: (
                userIdentity == "manager" && !currentGrade && !currentClass?
                {
                    type: 'scroll',
                    width: '62%',
                    top: '50px',
                    left: 'center',
                    textStyle: {
                        color: '#999999',
                    }
                }:
                {
                    top: '50px',
                    right: '10%',
                    // data:['个人','班级','年级'],
                    textStyle: {
                        color: '#999999',
                    }
                }
            ),
            dataZoom: {
                show: xList.length > 6? true: false,
                maxValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 10
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
                    textStyle: {
                        color: '#7c7c7c'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: '时间',
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
                    formatter: function(value){
                        let date = new Date(value);
                        return date.getHours() + ":" + date.getMinutes()
                    }
                }
            },
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [currentRange, homeAttendanceInfo, homeAttendanceList]);
    return (
        <div className="school-attendance">
            <Loading
            opacity={false}
            tip="加载中..."
            spinning={visible}>
                <div className="home-attendance-top">
                <div className="mornning-card">
                    <div className="card-title">上午</div>
                    <div className="time-container" style={{
                        marginTop: (userIdentity == "manager"? "20px": "")
                    }}>
                        <div className="next-time">
                            <p className="time-num">
                            {homeAttendanceInfo.avgInTime1? homeAttendanceInfo.avgInTime1: "--"}
                            </p>
                            <p>到校时间</p>
                        </div>
                        <span>-</span>
                        <div className="pre-time">
                            <p className="time-num">
                            {homeAttendanceInfo.avgOutTime1? homeAttendanceInfo.avgOutTime1: "--"}
                            </p>
                            <p>离校时间</p>
                        </div>
                    </div>
                    {
                        userIdentity == "student"?
                        <div className="class-time-avg">
                            <p>
                                <span>到校:&nbsp;</span> 
                                <span className="class-avg">班级平均: 
                                {classHomeAttendanceInfo.avgInTime1? classHomeAttendanceInfo.avgInTime1: "--"}</span>
                                <span className="grade-avg">年级平均: 
                                {gradeHomeAttendanceInfo.avgInTime1? gradeHomeAttendanceInfo.avgInTime1: "--"}</span>
                            </p>
                            <p>
                                <span>离校:&nbsp;</span>
                                <span className="class-avg">班级平均: 
                                {classHomeAttendanceInfo.avgOutTime1? classHomeAttendanceInfo.avgOutTime1: "--"}</span>
                                <span className="grade-avg">年级平均: 
                                {gradeHomeAttendanceInfo.avgOutTime1? gradeHomeAttendanceInfo.avgOutTime1: "--"}</span>
                            </p>
                        </div>:
                        userIdentity == "teacher"?
                        <div className="class-time-avg">
                            <p style={{textAlign: "center"}}>
                                <span>年级平均:&nbsp;</span>
                                <span>{gradeHomeAttendanceInfo.avgInTime1? gradeHomeAttendanceInfo.avgInTime1: "--"}</span>
                            -
                            <span className="grade-avg">
                                {gradeHomeAttendanceInfo.avgOutTime1? gradeHomeAttendanceInfo.avgOutTime1: "--"}</span>
                            </p>
                        </div>:
                        ""
                    }
                    
                </div>
                <div className="afternoon-card">
                <div className="card-title">下午</div>
                    <div className="time-container" style={{
                        marginTop: (userIdentity == "manager"? "20px": "")
                    }}>
                        <div className="next-time">
                            <p className="time-num">
                            {homeAttendanceInfo.avgInTime2? homeAttendanceInfo.avgInTime2: "--"}
                            </p>
                            <p>到校时间</p>
                        </div>
                        <span>-</span>
                        <div className="pre-time">
                            <p className="time-num">
                            {homeAttendanceInfo.avgOutTime2? homeAttendanceInfo.avgOutTime2: "--"}
                            </p>
                            <p>离校时间</p>
                        </div>
                    </div>
                    {
                        userIdentity == "student"?
                        <div className="class-time-avg">
                            <p>
                                <span>到校:&nbsp;</span> 
                                <span className="class-avg">班级平均: 
                                {classHomeAttendanceInfo.avgInTime2? classHomeAttendanceInfo.avgInTime2: "--"}</span>
                                <span className="grade-avg">年级平均: 
                                {gradeHomeAttendanceInfo.avgInTime2? gradeHomeAttendanceInfo.avgInTime2: "--"}</span>
                            </p>
                            <p>
                                <span>离校:&nbsp;</span>
                                <span className="class-avg">班级平均: 
                                {classHomeAttendanceInfo.avgOutTime2? classHomeAttendanceInfo.avgOutTime2: "--"}</span>
                                <span className="grade-avg">年级平均: 
                                {gradeHomeAttendanceInfo.avgOutTime2? gradeHomeAttendanceInfo.avgOutTime2: "--"}</span>
                            </p>
                        </div>:
                        userIdentity == "teacher"?
                        <div className="class-time-avg">
                            <p style={{textAlign: "center"}}>
                                <span>年级平均:&nbsp;</span>
                                <span className="grade-avg">
                                {gradeHomeAttendanceInfo.avgInTime2? gradeHomeAttendanceInfo.avgInTime2: "--"}</span>
                                -
                                <span className="grade-avg">  
                                {gradeHomeAttendanceInfo.avgOutTime2? gradeHomeAttendanceInfo.avgOutTime2: "--"}</span>
                            </p>
                        </div>:
                        ""
                    }
                </div>
                <div className="night-card">
                <div className="card-title">晚上</div>
                    <div className="time-container" style={{
                        marginTop: (userIdentity == "manager"? "20px": "")
                    }}>
                        <div className="next-time">
                            <p className="time-num">
                            {homeAttendanceInfo.avgInTime3? homeAttendanceInfo.avgInTime3: "--"}
                            </p>
                            <p>到校时间</p>
                        </div>
                        <span>-</span>
                        <div className="pre-time">
                            <p className="time-num">
                            {homeAttendanceInfo.avgOutTime3? homeAttendanceInfo.avgOutTime3: "--"}
                            </p>
                            <p>离校时间</p>
                        </div>
                    </div>
                    {
                        userIdentity == "student"?
                        <div className="class-time-avg">
                            <p>
                                <span>到校:&nbsp;</span> 
                                <span className="class-avg">班级平均: 
                                {classHomeAttendanceInfo.avgInTime3? classHomeAttendanceInfo.avgInTime3: "--"}</span>
                                <span className="grade-avg">年级平均: 
                                {gradeHomeAttendanceInfo.avgInTime3? gradeHomeAttendanceInfo.avgInTime3: "--"}</span>
                            </p>
                            <p>
                                <span>离校:&nbsp;</span>
                                <span className="class-avg">班级平均: 
                                {classHomeAttendanceInfo.avgOutTime3? classHomeAttendanceInfo.avgOutTime3: "--"}</span>
                                <span className="grade-avg">年级平均: 
                                {gradeHomeAttendanceInfo.avgOutTime3? gradeHomeAttendanceInfo.avgOutTime3: "--"}</span>
                            </p>
                        </div>:
                        userIdentity == "teacher"?
                        <div className="class-time-avg">
                            <p style={{textAlign: "center"}}>
                                <span>年级平均:&nbsp;</span>
                                <span className="grade-avg">
                                {gradeHomeAttendanceInfo.avgInTime3? gradeHomeAttendanceInfo.avgInTime3: "--"}</span>
                                -
                                <span className="grade-avg">
                                {gradeHomeAttendanceInfo.avgOutTime3? gradeHomeAttendanceInfo.avgOutTime3: "--"}</span>
                            </p>
                        </div>:
                        ""
                    }
                </div>
            </div>
            {/* <div className="select-container">
                <span>时间:</span>
                <Select defaultValue="month" className="select" onChange={(value)=>setCurrentTime(value)}>
                    <Option value="month">按天数</Option>
                    <Option value="month">按周次</Option>
                    <Option value="month">按月份</Option>
                </Select>
            </div> */}
            <div className="select-container">
                <span>范围:</span>
                <Select defaultValue="上午" className="select" onChange={(value)=>setCurrentRange(value)}>
                    <Option value="上午">上午</Option>
                    <Option value="下午">下午</Option>
                    <Option value="晚上">晚上</Option>
                </Select>
            </div>
            <div className="home-attendance-bottom">
                <div className="out-school-echart" id="school-out-time-echart"></div>
                <div className="slice-line"></div>
                <div className="in-school-echart" id="school-in-time-echart"></div>
            </div>
            </Loading>
            
        </div>
    )
}
const mapStateToProps = (state) => {
    let { 
      commonData:{
        termInfo:{
          HasHistory,
        },
        userInfo
      } 
    } = state;
    // console.log(state)
    return {HasHistory, userInfo};
}
export default connect(mapStateToProps)(memo(forwardRef(SchoolAttendance)));