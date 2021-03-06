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
import {Select} from "antd";
import { Empty, Loading } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
const {Option} = Select;
//   import { resizeForEcharts } from "../../../util/public";
function TestGrade(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
    } = props;
    //common平时考试,termCenter期中考试,termEnd期末考试
    const [currentTestType, setCurrentTestType] = useState("common");
    const [subjectList, setSubjectList] = useState([]);
    const [currentSubject, setCurrentSubject] = useState("");
    const [testInfoList, setTestInfoList] = useState([]);
    const [classInfoList, setClassInfoList] = useState([]);
    const [gradeInfoList, setGradeInfoList] = useState([]);
    const [loadVisible, setLoadVisible] = useState(true);
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
    let termNameInfo = {
        "common": "平时考试",
        "termCenter": "期中考试",
        "termEnd": "期末考试"
    }  
    //身份为学生时还需调用班级接口
    useLayoutEffect(() => {
        if(userIdentity != "student"){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //获取班级
        let url = BasicProxy + "/api/learning2/exam/scoreRank?type=2" + 
        "&studentId=" + (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&examType=" + (
            currentTestType == "common"?
            1:
            2
        ) +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setClassInfoList(result.data);
            }
        })
    }, [currentTestType, userIdentity, currentGrade, currentClass, currentTerm]);
    //获取年级数据
    useLayoutEffect(() => {
        if(userIdentity == "manager"){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //获取年级
        let url = BasicProxy + "/api/learning2/exam/scoreRank?type=3" + 
        "&studentId=" + (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + (currentGrade? currentGrade: classGradeId) +
        "&schoolId=" + SchoolID +
        "&examType=" + (
            currentTestType == "common"?
            1:
            2
        ) +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setGradeInfoList(result.data);
            }
        })
    }, [currentTestType, userIdentity, currentGrade, currentClass, currentTerm]);
    //获取身份对应数据
    useLayoutEffect(() => {
        if(userIdentity == "manager" && !currentClass && !currentGrade){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        setLoadVisible(true);
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let url = BasicProxy + "/api/learning2/exam/scoreRank?type=" +
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
        "&examType=" + (
            currentTestType == "common"?
            1:
            2
        ) +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setTestInfoList(result.data);
                let subjectList = [];
                result.data.map((item)=>{
                    if(item.examType == termNameInfo[currentTestType]){
                        subjectList.push(item.subject);
                    } 
                })
                subjectList = [...new Set(subjectList)];
                setSubjectList(subjectList);
                result.data[0] && setCurrentSubject(subjectList[0]);
                
            }
            setLoadVisible(false);
        })
    }, [currentTestType, userIdentity, currentGrade, currentClass, currentTerm]);
    //身份为领导时查全部需要特殊处理
    useLayoutEffect(() => {
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        setLoadVisible(true);
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);

        let url = BasicProxy + "/api/learning2/exam/scoreRank/batch?type=3" +
        "&schoolId=" + SchoolID +
        "&examType=" + (
            currentTestType == "common"?
            1:
            2
        ) +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setTestInfoList(result.data);
                let subjectList = [];
                result.data.map((item)=>{
                    item.examScoreAndRankList.forEach((child)=>{
                        if(child.examType == termNameInfo[currentTestType]){
                            subjectList.push(child.subject);
                        } 
                    })
                })
                subjectList = [...new Set(subjectList)];
                setSubjectList(subjectList);
                result.data[0] && setCurrentSubject(subjectList[0]);
            }
            setLoadVisible(false);
        })
    }, [currentTestType, userIdentity, currentGrade, currentClass, currentTerm]);
    useEffect(() => {
        if((userIdentity == 'manager' && !currentClass && !currentGrade)|| testInfoList.length == 0){
            return;
        }
        //期末期中考试是放在一起的，需要分开
        let dataList = [];
        if(currentTestType == "common"){
            dataList = testInfoList;
        }
        if(currentTestType == "termCenter"){
            testInfoList.forEach((item)=>{
                if(item.examType == "期中考试" && item.subject == currentSubject){
                    dataList.push(item);
                }
            })
        }
        if(currentTestType == "termEnd"){
            testInfoList.forEach((item)=>{
                if(item.examType == "期末考试" && item.subject == currentSubject){
                    dataList.push(item);
                }
            })
        }
        let xList = [], classDataList = [], gradeDataList = [], myDataList = [], maxDataList = [];
        dataList.forEach((item)=>{
            xList.push(item.examName);
            myDataList.push(item.score);
            maxDataList.push(item.maxScore);
        })
        gradeInfoList.forEach((item)=>{
            gradeDataList.push(item.score);
        })
        classInfoList.forEach((item)=>{
            classDataList.push(item.score);
        })
        let seriesList = [];
        if(userIdentity == 'teacher'){
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
                    data: myDataList
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
                    data: gradeDataList
                }
            ]
        }
        if(userIdentity == 'student'){
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
                    data: myDataList
                },
                {
                    name:'最高分',
                    type:'line',
                    lineStyle: {
                        color: '#f18a1a',
                        width: 1,
                        borderColor: '#f18a1a',
                        emphasis: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        color: '#f18a1a'
                    },
                    data: maxDataList
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
                    data: classDataList
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
                    data: gradeDataList
                }
            ];
        }
        let myEchart = echarts.init(document.getElementById("common-grade-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: `${currentTestType == "common"? "平时":
                currentTestType == "termCenter"? "期中":
            currentTestType == "termEnd"? "期末":
        ""}考试成绩(${currentSubject})`,
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
                bottom: xList.length > 6? 65: 45
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
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}分</span><br/>`;
                    })
                    return str;
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
                bottom: 70
            },
            legend: {
                top: '50px',
                right: '10%',
                textStyle: {
                    color: '#999999',
                }
            },
            xAxis: {
                type: 'category',
                name: '考试',
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
                name: '分数',
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
    }, [testInfoList, userIdentity, currentSubject]);
    useEffect(() => { 
        if((userIdentity == 'manager' && !currentClass && !currentGrade)|| testInfoList.length == 0){
            return;
        }
        //期末期中考试是放在一起的，需要分开
        let dataList = [];
        if(currentTestType == "common"){
            dataList = testInfoList;
        }
        if(currentTestType == "termCenter"){
            testInfoList.forEach((item)=>{
                if(item.examType == "期中考试" && item.subject == currentSubject){
                    dataList.push(item);
                }
            })
        }
        if(currentTestType == "termEnd"){
            testInfoList.forEach((item)=>{
                if(item.examType == "期末考试" && item.subject == currentSubject){
                    dataList.push(item);
                }
            })
        }

        let xList = [], classDataList = [], gradeDataList = [];
        dataList.forEach((item)=>{
            xList.push(item.examName);
            classDataList.push(item.classRank? item.classRank: 0);
            gradeDataList.push(item.gradeRank? item.gradeRank: 0);
        })
        let seriesList = [];
        if(userIdentity == 'teacher'){
            seriesList = [
                {
                    name:'排名',
                    type:'line',
                    lineStyle: {
                        color: '#0099ff',
                        width: 1,
                        borderColor: '#0099ff',
                        emphasis: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        color: '#0099ff'
                    },
                    data: classDataList
                }
            ]
        }
        if(userIdentity == 'student'){
            seriesList = [
                {
                    name:'班级排名',
                    type:'line',
                    lineStyle: {
                        color: '#0099ff',
                        width: 1,
                        borderColor: '#0099ff',
                        emphasis: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        color: '#0099ff'
                    },
                    data: classDataList
                },
                {
                    name:'年级排名',
                    type:'line',
                    lineStyle: {
                        color: '#22a814',
                        width: 1,
                        borderColor: '#22a814',
                        emphasis: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        color: '#22a814'
                    },
                    data: gradeDataList
                },
            ]
        }
        let myEchart = echarts.init(document.getElementById("common-rank-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: `${currentTestType == "common"? "平时":
                currentTestType == "termCenter"? "期中":
            currentTestType == "termEnd"? "期末":
        ""}考试班级排名(${currentSubject})`,
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
                bottom: 45
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
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}名</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '50px',
                right: '10%',
                // data:['班级排名','年级排名'],
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
                bottom: 70
            },
            xAxis: {
                type: 'category',
                name: '考试',
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
                name: '名次',
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
    }, [testInfoList, userIdentity, currentSubject]);
    useEffect(() => {
        if(userIdentity != 'manager' || currentClass || currentGrade){
            return;
        }
        let xList = [], classDataList = [], gradeDataList = [], myDataList = [], maxDataList = [], seriesList = [];;
        if(!currentClass && !currentGrade){ //查所有年级
            //期末期中考试是放在一起的，需要分开
            let dataList = [];
            if(currentTestType == "common"){
                testInfoList.forEach((item)=>{
                    item.examScoreAndRankList.forEach((child)=>{
                        if(child.examType == "平时考试" && child.subject == currentSubject){
                            dataList.push(item);
                        }
                    })
                });
            }
            if(currentTestType == "termCenter"){
                testInfoList.forEach((item)=>{
                    item.examScoreAndRankList.forEach((child)=>{
                        if(child.examType == "期中考试" && child.subject == currentSubject){
                            dataList.push(item);
                        }
                    })
                })
            }
            if(currentTestType == "termEnd"){
                testInfoList.forEach((item)=>{
                    item.examScoreAndRankList.forEach((child)=>{
                        if(child.examType == "期末考试" && child.subject == currentSubject){
                            dataList.push(item);
                        }
                    })
                })
            }
            //得出所有考试列表
            dataList.forEach((item)=>{
                item.examScoreAndRankList.forEach((child)=>{
                    if(child.subject == currentSubject && termNameInfo[currentTestType] == child.examType){
                        xList.push(child.examName? child.examName: "");
                    }
                })
            })
            xList = [...new Set(xList)];
            //得出一个个年级在每场考试的数据列表
            testInfoList.forEach((item, index)=>{
                let list = [];
                xList.forEach((child)=>{
                    let sum = 0;
                    item.examScoreAndRankList.forEach((child2)=>{
                        if(child2.examName == child && child.subject == currentSubject){
                            sum += child2.score;
                        }
                    })
                    //平均分
                    list.push(parseInt(sum / item.examScoreAndRankList.length));
                })
                seriesList.push({
                    name: item.gradeName,
                    type:'bar',
                    // barWidth : 16,
                    itemStyle: colorList[index % 6],
                    data: list
                })
            })
            
        } else {  //某一年级或班级
            //期末期中考试是放在一起的，需要分开
            let dataList = [];
            if(currentTestType == "common"){
                dataList = testInfoList;
            }
            if(currentTestType == "termCenter"){
                testInfoList.forEach((item)=>{
                    if(item.examType == "期中考试" && item.subject == currentSubject){
                        dataList.push(item);
                    }
                })
            }
            if(currentTestType == "termEnd"){
                testInfoList.forEach((item)=>{
                    if(item.examType == "期末考试" && item.subject == currentSubject){
                        dataList.push(item);
                    }
                })
            }
            dataList.forEach((item)=>{
                xList.push(item.examName? item.examName: "");
                myDataList.push(item.score);
            })
            xList = [...new Set(xList)];
            seriesList = [
                {
                    name: currentClass? "班级": "年级",
                    type:'bar',
                    // barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1da4fe'
                        },{
                            offset: 1,
                            color: '#7ecbff'
                        }])
                    },
                    data: myDataList
                },
            ]
        }
        let myEchart = echarts.init(document.getElementById("manager-grade-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: `${currentTestType == "common"? "平时":
            currentTestType == "termCenter"? "期中":
        currentTestType == "termEnd"? "期末":
    ""}考试成绩${currentSubject? "(" + currentSubject + ")": ""}`,
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
                bottom: xList.length > 6? 40: 30
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
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value? item.value: "--"}分</span><br/>`;
                    })
                    return str;
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
                bottom: 70
            },
            legend: {
                width: "70%",
                type: "scroll",
                top: '50px',
                left: 'center',
                textStyle: {
                    color: '#999999',
                }
            },
            xAxis: {
                type: 'category',
                name: '考试',
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
                name: '分数',
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
    }, [testInfoList, userIdentity, currentSubject]);
    return (
      <div className="test-grade">
            <div className="test-grade-top">
                <div className="kind-list">
                    <span>类型:</span>
                    <span 
                    className={"list-one " + (currentTestType == "common"? "active": "")} 
                    onClick={()=>setCurrentTestType("common")}>平时考试</span>
                    <span className="list-slice-line"></span>
                    <span 
                    className={"list-one " + (currentTestType == "termCenter"? "active": "")} 
                    onClick={()=>setCurrentTestType("termCenter")}>期中考试</span>
                    <span className="list-slice-line"></span>
                    <span 
                    className={"list-one " + (currentTestType == "termEnd"? "active": "")}
                    onClick={()=>setCurrentTestType("termEnd")}>期末考试</span>
                </div>
                {
                    subjectList.length > 0?
                    <div className="select-container">
                        <span>学科:</span>
                        <Select 
                        value={currentSubject}
                        className="select" 
                        onChange={(value)=>setCurrentSubject(value)}>
                            {
                                subjectList.map((item, index)=>{
                                    return (
                                        <Option key={index} value={item}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>:
                    ""
                }
                
            </div>
            <Loading
            opacity={false}
            spinning={loadVisible}>
            {
                userIdentity == 'manager' && !currentGrade && !currentClass?
                <div className="manager-grade-bottom">
                    <div className="manager-grade-echart" id="manager-grade-echart"></div>
                </div>:
                testInfoList.length > 0?
                <div className="test-grade-bottom">
                    <div className="common-grade-echart" id="common-grade-echart"></div>
                    <div className="slice-line"></div>
                    <div className="common-rank-echart" id="common-rank-echart"></div>
                </div>:
                <Empty
                // className={"bar-empty"}
                style={{margin: "20px 0"}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>
            }
            </Loading> 
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
export default connect(mapStateToProps)(memo(forwardRef(TestGrade)));
  