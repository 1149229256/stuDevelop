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
import "./index.scss";
// import echarts from "echarts";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import * as graphic from 'echarts/lib/util/graphic';
import {Carousel} from "antd";
import { Empty } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
//   import { resizeForEcharts } from "../../../util/public";
function PersonStudy(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        reflash,
        userInfo: {SchoolID, UserID},
    } = props;
    //自学详情
    const [studyInfo, setStudyInfo] = useState({});
    const [classStudyInfo, setClassStudyInfo] = useState({});
    const [gradeStudyInfo, setGradeStudyInfo] = useState({});
    //自学统计
    const [studyStatistic, setStudyStatistic] = useState({});
    const [classStudyStatistic, setClassStudyStatistic] = useState({});
    const [gradeStudyStatistic, setGradeStudyStatistic] = useState({});
    const [studyStatisticList, setStudyStatisticList] = useState([]);
    //自学学科
    const [studySubjectList, setStudySubjectList] = useState([]);
    const [currentSubject, setCurrentSubject] = useState("");
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
    //学生获取班级年级数据用于图表显示对比
    useLayoutEffect(() => {
        if(userIdentity != "student"){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        //获取班级信息
        //自学详情
        let url = BasicProxy + "/api/learning2/selfStudy/detail?type=2" +
        "&studentId=" +
        "&classId=" + currentClass +
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setClassStudyInfo(result.data);
            }
        })
        //自学统计
        url = BasicProxy + "/api/learning2/selfStudy/statistics?type=2" +
        "&studentId=" +
        "&classId=" + currentClass +
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setClassStudyStatistic(result.data);
            }
        })
        //获取年级信息
        url = BasicProxy + "/api/learning2/selfStudy/detail?type=3" +
        "&studentId=" +
        "&classId=" +
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setGradeStudyInfo(result.data);
            }
        })
        //自学统计
        url = BasicProxy + "/api/learning2/selfStudy/statistics?type=3" +
        "&studentId=" +
        "&classId=" +
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setGradeStudyStatistic(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    //老师获取年级数据用于图表显示对比
    useLayoutEffect(() => {
        if(userIdentity != "teacher"){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        //获取年级信息
        let url = BasicProxy + "/api/learning2/selfStudy/detail?type=3" +
        "&studentId=" +
        "&classId=" +
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setGradeStudyInfo(result.data);
            }
        })
        //自学统计
        url = BasicProxy + "/api/learning2/selfStudy/statistics?type=3" +
        "&studentId=" +
        "&classId=" +
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setGradeStudyStatistic(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    //获取数据
    useLayoutEffect(() => {
        if(!currentTerm.value){
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
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        //自学详情
        let url = BasicProxy + "/api/learning2/selfStudy/detail?type=" +
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
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setStudyInfo(result.data);
                let arr = [];
                result.data.selfStudyDaysList.forEach((item)=>{
                    item.selfStudySubjectList.forEach((child)=>{
                        arr.push(child.subjectName);
                    })
                })
                arr = [...new Set(arr)];
                setStudySubjectList(arr);
                setCurrentSubject(arr[0]);
            }
        })
        //自学统计
        url = BasicProxy + "/api/learning2/selfStudy/statistics?type=" +
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
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setStudyStatistic(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    //领导端获取数据
    useLayoutEffect(() => {
        if(!currentTerm.value){
            return;
        }
        if(userIdentity != "manager" || currentClass || currentGrade){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //自学详情
        let url = BasicProxy + "/api/learning2/selfStudy/detail/batch?type=3" +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setStudyInfo(result.data);
                let arr = [];
                Array.isArray(result.data) &&
                result.data.forEach((item)=>{
                    item.selfStudyDetails &&
                    Array.isArray(item.selfStudyDetails.selfStudyDaysList) &&
                    item.selfStudyDetails.selfStudyDaysList.forEach((child2)=>{
                        Array.isArray(child2.selfStudySubjectList) &&
                        child2.selfStudySubjectList.forEach((child3)=>{
                            arr.push(child3.subjectName);
                        })
                    }) 
                })
                arr = [...new Set(arr)];
                setStudySubjectList(arr);
                setCurrentSubject(arr[0]);
            }
        })
        //自学统计
        url = BasicProxy + "/api/learning2/selfStudy/statistics/batch?type=3" +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setStudyStatisticList(result.data);
            }
        })
        //自学统计
        url = BasicProxy + "/api/learning2/selfStudy/statistics?type=4" +
        "&studentId=" +
        "&classId=" +
        "&gradeId="+
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setStudyStatistic(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    //自学总时长图表
    useEffect(() => {
        let xList = [], myList = [], classList = [], gradeList = [], seriesList = [];
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            if(!Array.isArray(studyStatisticList)){
                return;
            }
            studyStatisticList.forEach((item, index)=>{
                let arr = [];
                item.selfStudy &&
                Array.isArray(item.selfStudy.selfStudySubjectList) &&
                item.selfStudy.selfStudySubjectList.forEach((child)=>{
                    xList.push(child.subjectName);
                    arr.push(child.useTime);
                })
                seriesList.push({
                    name:item.gradeName,
                    type:'bar',
                    itemStyle: {
                        color: colorList[index%6]
                    },
                    data:arr
                })
            })
            xList = [...new Set(xList)];
        } else if(userIdentity == "student"){
            if(!Array.isArray(studyStatistic.selfStudySubjectList)){
                return;
            }
            studyStatistic.selfStudySubjectList.forEach((item)=>{
                xList.push(item.subjectName);
                myList.push(item.useTime);
            })
            Array.isArray(classStudyStatistic.selfStudySubjectList) &&
            classStudyStatistic.selfStudySubjectList.forEach((item)=>{
                classList.push(item.useTime);
            })
            Array.isArray(gradeStudyStatistic.selfStudySubjectList) &&
            gradeStudyStatistic.selfStudySubjectList.forEach((item)=>{
                gradeList.push(item.useTime);
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
        } else if(currentClass){
            if(!Array.isArray(studyStatistic.selfStudySubjectList)){
                return;
            }
            studyStatistic.selfStudySubjectList.forEach((item)=>{
                xList.push(item.subjectName);
                myList.push(item.useTime);
            })
            Array.isArray(gradeStudyStatistic.selfStudySubjectList) &&
            gradeStudyStatistic.selfStudySubjectList.forEach((item)=>{
                gradeList.push(item.useTime);
            })
            seriesList = [  
                {
                    name:'班级总时长',
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
                    name:'年级平均总时长',
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
                }
            ]
        } else if(currentGrade){
            if(!Array.isArray(studyStatistic.selfStudySubjectList)){
                return;
            }
            studyStatistic.selfStudySubjectList.forEach((item)=>{
                xList.push(item.subjectName);
                myList.push(item.useTime);
            })
            seriesList = [  
                {
                    // name:'年级平均总时长',
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
                    data:myList
                }
            ]
        }
        let myEchart = echarts.init(document.getElementById("time-sum-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '累计自学时长',
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
                extraCssText: "border: 0; background-color: rgba(0, 0, 0, 0.6); padding: 10px;",
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
                        <span style="color: #cccccc;">
                        ${item.seriesName && item.seriesName.indexOf("series") == -1? item.seriesName + ":": ""}</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}h</span><br/>`;
                    })
                    return str;
                }
            },
            legend: (
                userIdentity != "manager" || currentGrade || currentClass?
                {
                    top: '50px',
                    right: '10%',
                    // data:['个人','班级','年级'],
                    textStyle: {
                        color: '#999999',
                    }
                }:
                {
                    type: 'scroll',
                    width: '62%',
                    left: 'center',
                    top: 50
                }
            ),
            dataZoom: {
                show:  xList.length > 6? true: false,
                maxValueSpan: 5,
                minValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 30
            },
            xAxis: {
                type: 'category',
                name: '学科',
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
                min: 0,
                max: 100,
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
    }, [studyStatistic, studyStatisticList, userIdentity]);
    //每日自学时长图表
    useEffect(() => {
        let xList = [], myList = [], classList = [], gradeList = [], seriesList = [];
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            if(!Array.isArray(studyStatistic)){
                return;
            }
            studyStatistic.forEach((item, index)=>{
                let arr = [];
                item.selfStudy &&
                Array.isArray(item.selfStudy.selfStudySubjectList) &&
                item.selfStudy.selfStudySubjectList.forEach((child)=>{
                    xList.push(child.subjectName);
                    arr.push(child.useTime);
                })
                seriesList.push({
                    name:item.gradeName,
                    type:'bar',
                    itemStyle: {
                        color: colorList[index%6]
                    },
                    data:arr
                })
            })
            xList = [...new Set(xList)];
        } else if(userIdentity == "student"){
            if(!Array.isArray(studyInfo.selfStudyDaysList)){
                return;
            }
            studyInfo.selfStudyDaysList.forEach((item)=>{
                xList.push(item.date);
                item.selfStudySubjectList.forEach((child)=>{
                    if(child.subjectName == currentSubject){
                        myList.push(child.useTime);
                    } 
                })
            })
            Array.isArray(classStudyInfo.selfStudyDaysList) &&
            classStudyInfo.selfStudyDaysList.forEach((item)=>{
                item.selfStudySubjectList.forEach((child)=>{
                    if(child.subjectName == currentSubject){
                        classList.push(child.useTime);
                    } 
                })
            })
            Array.isArray(gradeStudyInfo.selfStudyDaysList) &&
            gradeStudyInfo.selfStudyDaysList.forEach((item)=>{
                item.selfStudySubjectList.forEach((child)=>{
                    if(child.subjectName == currentSubject){
                        gradeList.push(child.useTime);
                    } 
                })
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
                }
            ]
        } else if(currentClass){
            if(!Array.isArray(studyInfo.selfStudyDaysList)){
                return;
            }
            studyInfo.selfStudyDaysList.forEach((item)=>{
                xList.push(item.date);
                item.selfStudySubjectList.forEach((child)=>{
                    if(child.subjectName == currentSubject){
                        myList.push(child.useTime);
                    } 
                })
            })
            Array.isArray(gradeStudyInfo.selfStudyDaysList) &&
            gradeStudyInfo.selfStudyDaysList.forEach((item)=>{
                item.selfStudySubjectList.forEach((child)=>{
                    if(child.subjectName == currentSubject){
                        gradeList.push(child.useTime);
                    } 
                })
            })
            seriesList = [  
                {
                    name:'班级总时长',
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
                    name:'年级平均总时长',
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
                }
            ]
        } else if(currentGrade){
            if(!Array.isArray(studyInfo.selfStudyDaysList)){
                return;
            }
            studyInfo.selfStudyDaysList.forEach((item)=>{
                xList.push(item.date);
                item.selfStudySubjectList.forEach((child)=>{
                    if(child.subjectName == currentSubject){
                        myList.push(child.useTime);
                    } 
                })
            })
            seriesList = [  
                {
                    // name:'年级平均总时长',
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
                    data:myList
                }
            ]
        }
        let myEchart = echarts.init(document.getElementById("detail-study-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '每日自学时长',
                left: 'center',
                top: '10px',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            grid: {
                top: 75,
                bottom: xList.length > 6? 100: 90
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                extraCssText: "border: 0; background-color: rgba(0, 0, 0, 0.6); padding: 10px;",
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
                        <span style="color: #cccccc;">
                        ${item.seriesName && item.seriesName.indexOf("series") == -1? item.seriesName + ":": ""}</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}h</span><br/>`;
                    })
                    return str;
                }
            },
            legend: (
                userIdentity != "manager" || currentGrade || currentClass?
                {
                    top: '40px',
                    right: '10%',
                    // data:['个人','班级','年级'],
                    textStyle: {
                        color: '#999999',
                    }
                }:
                {
                    type: 'scroll',
                    width: '62%',
                    left: 'center',
                    top: 40
                }
            ),
            dataZoom: {
                show:  xList.length > 6? true: false,
                maxValueSpan: 5,
                minValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 70
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
                min: 0,
                max: 100,
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
    }, [studyInfo, userIdentity, currentSubject]);
    let updateSubjectList = [];
    let arr = [];
    //每7个化为一页，进行轮播
    Array.isArray(studySubjectList) && studySubjectList.forEach((item, index)=>{
        arr.push(item);
        if(((index + 1) % 7 == 0) || index == studySubjectList.length - 1){
            updateSubjectList.push(arr);
            arr = [];
        }
    })
    return (
      <div className="course-show">
          {
                userIdentity == 'student'?
                <div className="show-top">
                    <div className="course-liveness">
                        <div className="circle-blue">
                        {
                        typeof studyStatistic.total == "number"?
                        parseInt(studyStatistic.total):
                        "--"
                        }
                        </div>
                        <p>自学总时长</p>
                    </div>
                    <div className="course-add">
                        <div className="circle-orange">
                        {
                        studyStatistic.maxSubject?
                        studyStatistic.maxSubject:
                        "--"
                        }
                        </div>
                        <p>最多自学学科</p>
                    </div>
                    <div className="course-reduce">
                        <div className="circle-red">
                        {
                        typeof studyStatistic.maxTime == "number"?
                        parseInt(studyStatistic.maxTime):
                        "--"
                        }
                        </div>
                        <p>最大连续自学时长</p>
                    </div>
                    <div className="raise-hand">
                        <div className="circle-green">
                        {
                        typeof studyStatistic.avgTime == "number"?
                        parseInt(studyStatistic.avgTime):
                        "--"
                        }
                        </div>
                        <p>平均自学时长</p>
                    </div>
                </div>:
                userIdentity == 'teacher'?
                <div className="show-top">
                    <div className="course-liveness">
                        <div className="circle-blue">
                        {
                        typeof studyStatistic.total == "number"?
                        parseInt(studyStatistic.total):
                        "--"
                        }
                        </div>
                        <p>班级总自学时长</p>
                    </div>
                    <div className="course-add">
                        <div className="circle-orange">
                        {
                        studyStatistic.maxSubject?
                        studyStatistic.maxSubject:
                        "--"
                        }
                        </div>
                        <p>最多自学学科</p>
                    </div>
                    <div className="course-reduce">
                        <div className="circle-red">
                        {
                        typeof studyStatistic.maxTime == "number"?
                        parseInt(studyStatistic.maxTime):
                        "--"
                        }
                        </div>
                        <p>班级内最大连续<br/>自学时长</p>
                    </div>
                    <div className="raise-hand">
                        <div className="circle-green">
                        {
                        typeof studyStatistic.avgTime == "number"?
                        parseInt(studyStatistic.avgTime):
                        "--"
                        }
                        </div>
                        <p>班级内个人平均<br/>自学时长</p>
                    </div>
                </div>:
                userIdentity == 'manager' && !currentClass && !currentGrade?
                <div className="show-top">
                    <div className="course-liveness">
                        <div className="circle-blue">
                        {
                        typeof studyStatistic.total == "number"?
                        parseInt(studyStatistic.total):
                        "--"
                        }
                        </div>
                        <p>自学总时长</p>
                    </div>
                    <div className="course-add">
                        <div className="circle-orange">
                        {
                        studyStatistic.maxSubject?
                        studyStatistic.maxSubject:
                        "--"
                        }
                        </div>
                        <p>最多自学学科</p>
                    </div>
                    <div className="course-reduce">
                        <div className="circle-red">
                        {
                        typeof studyStatistic.maxTime == "number"?
                        parseInt(studyStatistic.maxTime):
                        "--"
                        }
                        </div>
                        <p>最大连续自学时长</p>
                    </div>
                    <div className="raise-hand">
                        <div className="circle-green">
                        {
                        typeof studyStatistic.avgTime == "number"?
                        parseInt(studyStatistic.avgTime):
                        "--"
                        }
                        </div>
                        <p>平均自学时长</p>
                    </div>
                </div>:
                ""
          }
          <div className="show-bottom">
                <div className="grade-compare-status">
                    {/* <div className="kind-list" style={{margin: "24px 0 0 67px"}}>
                        <span>类型:</span>
                        <span className="list-one">加分率</span>
                        <span className="list-slice-line"></span>
                        <span className="list-one">扣分率</span>
                    </div> */}
                    <div className="grade-compare-echart" id="time-sum-echart"></div>
                </div>
                <div className="subject-grade-statistic">
                    <div className="kind-list" style={{margin: "24px 0 0 67px"}}>
                        <span>类型:</span>
                        <Carousel
                            dots={{
                                className: 'award-dot'
                            }}>
                                {
                                    updateSubjectList.map((item, index)=>{
                                        return (
                                            <span className="span-container" key={index}>
                                                {
                                                    item.map((child, index1)=>{
                                                        return (
                                                            <span className="span-container" key={index1}>
                                                            <span 
                                                            className={"list-one " + (currentSubject == child? "active": "")}
                                                            onClick={()=>setCurrentSubject(child)}
                                                            >
                                                                {child}
                                                            </span>
                                                            {
                                                                index1 != item.length - 1?
                                                                <span className="list-slice-line"></span>:
                                                                ""
                                                            }
                                                            </span>
                                                        )
                                                    })
                                                }
                                            
                                            </span>
                                        )
                                        item.forEach((child, index1)=>{
                                            return 
                                        })
                                    })
                                }
                            {/* {
                                allSubjectList.map((item, index)=>{
                                    return (
                                        <div key={index} className="span-container">
                                            <span 
                                            className={"list-one " + (currentSubject == item? "active": "")}
                                            onClick={()=>setCurrentSubject(item)}
                                            >
                                                {item}
                                            </span>
                                            {
                                                index != allSubjectList.length - 1?
                                                <span className="list-slice-line"></span>:
                                                ""
                                            }
                                            
                                        </div>
                                    )
                                })
                            } */}
                            </Carousel>
                    </div>
                    <div className="grade-statistic-echart" id="detail-study-echart"></div>
                </div>
          </div>
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
export default connect(mapStateToProps)(memo(forwardRef(PersonStudy)));
  