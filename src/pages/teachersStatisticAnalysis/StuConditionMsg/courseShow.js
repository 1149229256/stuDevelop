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
import { Popover, Carousel } from "antd";
// import echarts from "echarts";
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
let { BasicProxy } = ipConfig;
//   import { resizeForEcharts } from "../../../util/public";
function CourseShow(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
        reflash
    } = props;
    const [courseShowInfo, setCourseShowInfo] = useState({});
    //领导端数据结构不一样，需要另外存储
    const [leaderCourseShowInfo, setLeaderCourseShowInfo] = useState([]);
    const [leaderCourseGradeInfo, setLeaderCourseGradeInfo] = useState([]);
    const [visible, setVisible] = useState(true);

    const [courseGradeInfo, setCourseGradeInfo] = useState([]);
    const [classRateInfo, setClassRateInfo] = useState({});
    const [allRateInfo, setAllRateInfo] = useState({});
    const [allSubjectList, setAllSubjectList] = useState([]);
    const [currentSubject, setCurrentSubject] = useState("");
    const switchMonth = (value) => {
        //根据日期化为月份展示
        let str = "";
        switch(value){
            case "01":
                str = "一月份";
                break;
            case "02":
                str = "二月份";
                break;
            case "03":
                str = "三月份";
                break;
            case "04":
                str = "四月份";
                break;
            case "05":
                str = "五月份";
                break;
            case "06":
                str = "六月份";
                break;
            case "07":
                str = "七月份";
                break;
            case "08":
                str = "八月份";
                break;
            case "09":
                str = "九月份";
                break;
            case "10":
                str = "十月份";
                break;
            case "11":
                str = "十一月份";
                break;
            case "12":
                str = "十二月份";
                break;
            default:
                str = "";
                break;
        }
        return str;
    }
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
    //获取全年级课堂表现数据
    useLayoutEffect(() => {
        if(userIdentity == "manager"){
            return;
        }
        if(!currentGrade){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //课堂活跃表现
        let url = BasicProxy + "/api/learning2/performance/statistics?type=3" +
        "&studentId=" + (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setAllRateInfo(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    //获取班级课堂表现数据
    useLayoutEffect(() => {
        if(userIdentity != "student" || !UserID || !currentClass || !currentGrade){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //课堂活跃表现
        let url = BasicProxy + "/api/learning2/performance/statistics?type=2" +
        "&studentId=" + (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setClassRateInfo(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    //获取对应身份展示的表现数据
    useLayoutEffect(() => {
        setVisible(true);
        if(userIdentity == "manager" && !currentClass && !currentGrade){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        // SchoolID = "S27-511-AF57";
        // currentTermInfo.termId = "2020-202101";
        // currentClass = "d8ed1a21-39bc-4403-8330-5f9bd578f721";
        // currentGrade = "7C11E555-AE69-41DA-8E8B-624BB21B456E"; 
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        //课堂活跃表现
        let url = BasicProxy + "/api/learning2/performance/statistics?type=" +
        (userIdentity == "student"?
        1:
        userIdentity == "teacher"?
        2:
        currentClass?
        2:
        currentGrade?
        3:
        4) +
        "&studentId=" + (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setCourseShowInfo(result.data);
            }
            setVisible(false);
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    //获取各学科课堂表现分数
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
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        //课堂活跃表现
        let url = BasicProxy + "/api/learning2/performance/subject?type=" +
        (userIdentity == "student"?
        1:
        userIdentity == "teacher"?
        2:
        currentClass?
        2:
        currentGrade?
        3:
        4) +
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
                setCourseGradeInfo(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    //获取领导端对应身份展示的表现数据
    useLayoutEffect(() => {
        setVisible(true);
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //课堂活跃表现
        let url = BasicProxy + "/api/learning2/performance/statistics/batch?type=3" +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setLeaderCourseShowInfo(result.data);
            }
        })
        //查学校时需要请求原接口
        url = BasicProxy + "/api/learning2/performance/statistics?type=4" +
        "&studentId=" + (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setCourseShowInfo(result.data);
            }
            setVisible(false);
        })
    }, [userIdentity, currentGrade, currentClass, SchoolID, currentTerm, reflash]);
    //获取领导端各学科课堂表现分数
    useLayoutEffect(() => {
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //课堂活跃表现
        let url = BasicProxy + "/api/learning2/performance/subject/batch?type=3" +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setLeaderCourseGradeInfo(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, SchoolID, reflash]);
    useEffect(() => { 
        if(userIdentity == "manager" && !currentClass && !currentGrade){
            return;
        }
        if(
            !courseShowInfo.lessonBonusRateDataList || 
            courseShowInfo.lessonBonusRateDataList.length == 0){
            return;
        }
        let seriesList = [];
        let xList = [], myDataList = [], classDataList = [], gradeDataList = [];
        //获取所有学科列表并将数据按学科分类
        courseShowInfo.lessonBonusRateDataList && 
        courseShowInfo.lessonBonusRateDataList.forEach((item)=>{
            xList.push(item.subjectName);
            myDataList.push(parseInt(item.rate*100).toFixed(1));
        })
        //将年级,班级数据分类
        xList.forEach((item)=>{
            allRateInfo.lessonBonusRateDataList && 
            allRateInfo.lessonBonusRateDataList.forEach((child)=>{
                if(child.subjectName == item){
                    gradeDataList.push((child.rate*100).toFixed(1));
                }
            })
            classRateInfo.lessonBonusRateDataList && 
            classRateInfo.lessonBonusRateDataList.forEach((child)=>{
                if(child.subjectName == item){
                    classDataList.push((child.rate*100).toFixed(1));
                }
            })
        })
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
                },
                
            ];
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
                    data:myDataList
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
                    data:classDataList
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
                    data:gradeDataList
                },
                
            ];
        }
        let myEchart = echarts.init(document.getElementById("grade-compare-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '各学科加分率百分比',
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
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}%</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '40px',
                right: '10%',
                textStyle: {
                    color: '#999999',
                }
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
                    },
                    formatter: function(value){
                        return value.length > 4? value.substr(0, 4) + "...": value;
                    }
                }
            },
            dataZoom: {
                show: xList.length > 6? true: false,
                maxValueSpan: 6,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 70
            },
            yAxis: {
                type: 'value',
                name: '百分比',
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
    }, [courseShowInfo, leaderCourseShowInfo, userIdentity]);
    useEffect(() => {
        if(userIdentity == "manager" && !currentClass && !currentGrade){
            return;
        }
        if(courseGradeInfo.length == 0){
            return;
        }
        let seriesList = [];
        let xList = [], sumList = [], addList = [], reduceList = [], sujbectList = [], dataList = [];
        //获取学科列表
        courseGradeInfo.forEach((item)=>{
            sujbectList.push(item.subjectName);
            
        })
        sujbectList = [...new Set(sujbectList)];
        
        allSubjectList.length == 0 && setAllSubjectList(sujbectList);
        !currentSubject && setCurrentSubject(sujbectList[0]);

        //获取当前学科数据
        courseGradeInfo.forEach((item)=>{
            if(item.subjectName == currentSubject){
                dataList.push(item);
                xList.push(switchMonth(item.date.substr(5, 2)));
            }
        })
        //将各数据按日期分类
        xList = [...new Set(xList)];
        xList.forEach((item)=>{
            let sum = 0;
            dataList.forEach((child)=>{
                if(switchMonth(child.date.substr(5, 2)) == item){
                    sum += child.score;
                }
            })
            addList.push(sum);
        })
        if(userIdentity == 'teacher'){
            seriesList = [
                // {
                //     name: '总分',
                //     type: 'line',
                //     // stack: '总量', //数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置。
                //     lineStyle: {
                //         color: '#ff0000',
                //         width: 1,
                //         borderColor: '#ff0000',
                //         emphasis: {
                //             width: 1
                //         }
                //     },
                //     itemStyle: {
                //         color: '#ff0000'
                //     },
                //     data: [320, 302, 342, 374, 390, 450, 420]
                // },
                {
                    name: '加分',
                    type: 'bar',
                    barWidth: 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#51ca51'
                        },{
                            offset: 1,
                            color: '#a0dea0'
                        }])
                    },
                    data: addList
                },
                // {
                //     name: '扣分',
                //     type: 'bar',
                //     barWidth: 16,
                //     itemStyle: {
                //         color: new graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: '#ffe88a'
                //         },{
                //             offset: 1,
                //             color: '#ffb709'
                //         }])
                //     }, 
                //     data: [-120, -132, -102, -134, -190, -230, -210]
                // }
            ]
        }
        if(userIdentity == 'student'){
            seriesList = [
                {
                    name: '个人',
                    type: 'line',
                    // stack: '总量', //数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置。
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
                    data: addList
                },
                {
                    name: '加分',
                    type: 'bar',
                    barWidth: 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#51ca51'
                        },{
                            offset: 1,
                            color: '#a0dea0'
                        }])
                    },
                    data: addList
                },
                // {
                //     name: '扣分',
                //     type: 'bar',
                //     barWidth: 16,
                //     itemStyle: {
                //         color: new graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: '#ffe88a'
                //         },{
                //             offset: 1,
                //             color: '#ffb709'
                //         }])
                //     }, 
                //     data: [-120, -132, -102, -134, -190, -230, -210]
                // }
            ]
        }
        let myEchart = echarts.init(document.getElementById("grade-statistic-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '课堂分数统计信息',
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
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}分</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '40px',
                right: '10%',
                // data:['个人','加分','扣分'],
                textStyle: {
                    color: '#999999',
                }
            },
            dataZoom: {
                show: xList.length > 6? true: false,
                maxValueSpan: 6,
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
                    padding: [10000, 0, 0, 0]
                    
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
            yAxis: [{
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
                minInterval: 1,
                axisLabel: {
                    textStyle: {
                        color: '#999999'
                    },
                    formatter: '{value} '
                }
            }],
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [currentSubject, userIdentity, courseGradeInfo, leaderCourseGradeInfo, allSubjectList]);
    //领导端查学校调用的图表数据处理方式
    useEffect(() => { 
        if(userIdentity != "manager" || currentClass || currentGrade){
            return;
        }
        if(leaderCourseShowInfo.length == 0){
            return;
        }
        let xList = [], seriesList = [];
        //获取所有学科列表并将数据按学科分类
        leaderCourseShowInfo.forEach((item)=>{
            item.performanceStatistics &&
            Array.isArray(item.performanceStatistics.lessonBonusRateDataList) &&
            item.performanceStatistics.lessonBonusRateDataList.forEach((child)=>{
                xList.push(child.subjectName);
            })
        })
        xList = [...new Set(xList)];

        //每个年级的数据按学科顺序排列
        leaderCourseShowInfo.forEach((item, index)=>{
            let arr = [];
            xList.forEach((child)=>{
                let sign = false; //用于判断当前年级是否有该科目，若无则添加空数据进去
                item.performanceStatistics &&
                Array.isArray(item.performanceStatistics.lessonBonusRateDataList) &&
                item.performanceStatistics.lessonBonusRateDataList.forEach((child2)=>{
                    if(child2.subjectName == child){
                        arr.push((child2.rate*100).toFixed(1));
                        sign = true;
                    }
                })
                if(!sign){
                    arr.push("");
                }
            })
            seriesList.push({
                name: item.gradeName,
                type: 'bar',
                // barWidth : 16,
                itemStyle: {
                    color: colorList[index%6]
                },
                data: arr
            })
        })
        let myEchart = echarts.init(document.getElementById("grade-compare-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '各学科加分率百分比',
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
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}%</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                width: "62%",
                type: "scroll",
                top: '40px',
                right: 'center',
                textStyle: {
                    color: '#999999',
                }
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
                    },
                    formatter: function(value){
                        return value.length > 4? value.substr(0, 4) + "...": value;
                    }
                }
            },
            dataZoom: {
                show: xList.length > 6? true: false,
                maxValueSpan: 6,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 70
            },
            yAxis: {
                type: 'value',
                name: '百分比',
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
    }, [courseShowInfo, leaderCourseShowInfo, userIdentity]);
    useEffect(() => {
        if(userIdentity != "manager" || currentClass || currentGrade){
            return;
        }
        if(leaderCourseGradeInfo.length == 0){
            return;
        }
        let seriesList = [];
        let xList = [], sumList = [], addList = [], reduceList = [], sujbectList = [], dataList = [];
        //获取学科列表
        leaderCourseGradeInfo.forEach((item)=>{
            item.everydayLessonScoreDataList.forEach((child)=>{
                sujbectList.push(child.subjectName);
            }) 
        })
        sujbectList = [...new Set(sujbectList)];
        if(sujbectList.length == 0){
            return;
        }
        allSubjectList.length == 0 && setAllSubjectList(sujbectList);
        !currentSubject && setCurrentSubject(sujbectList[0]);

        //获取当前学科数据
        leaderCourseGradeInfo.forEach((item)=>{
            item.everydayLessonScoreDataList.forEach((child)=>{
                if(child.subjectName == currentSubject){
                    dataList.push(child);
                    xList.push(child.date);
                    // xList.push(switchMonth(item.date.substr(5, 2)));
                }
            })
        })
        //将各数据按日期分类
        xList = [...new Set(xList)];
        xList.forEach((item)=>{
            let sum = 0;
            dataList.forEach((child)=>{
                if(child.date == item){
                    sum += child.score;
                }
            })
            addList.push(sum);
        })
            seriesList = [
                // {
                //     name: '总分',
                //     type: 'line',
                //     // stack: '总量', //数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置。
                //     lineStyle: {
                //         color: '#ff0000',
                //         width: 1,
                //         borderColor: '#ff0000',
                //         emphasis: {
                //             width: 1
                //         }
                //     },
                //     itemStyle: {
                //         color: '#ff0000'
                //     },
                //     data: [320, 302, 342, 374, 390, 450, 420]
                // },
                {
                    name: '加分',
                    type: 'bar',
                    barWidth: 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#51ca51'
                        },{
                            offset: 1,
                            color: '#a0dea0'
                        }])
                    },
                    data: addList
                },
                // {
                //     name: '扣分',
                //     type: 'bar',
                //     barWidth: 16,
                //     itemStyle: {
                //         color: new graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: '#ffe88a'
                //         },{
                //             offset: 1,
                //             color: '#ffb709'
                //         }])
                //     }, 
                //     data: [-120, -132, -102, -134, -190, -230, -210]
                // }
            ]
        let myEchart = echarts.init(document.getElementById("grade-statistic-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '课堂分数统计信息',
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
                        <span style="color: #cccccc;">${item.seriesName}:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}分</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '40px',
                right: '10%',
                // data:['个人','加分','扣分'],
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
                name: '日期',
                nameTextStyle: {
                    color: '#999999',
                    padding: [10000, 0, 0, 0]
                    
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
            yAxis: [{
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
                minInterval: 1,
                axisLabel: {
                    textStyle: {
                        color: '#999999'
                    },
                    formatter: '{value} '
                }
            }],
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [currentSubject, userIdentity, courseGradeInfo, leaderCourseGradeInfo, allSubjectList]);
    let updateSubjectList = [];
    let arr = [];
    //每7个化为一页，进行轮播
    Array.isArray(allSubjectList) && allSubjectList.forEach((item, index)=>{
        arr.push(item);
        if(((index + 1) % 7 == 0) || index == allSubjectList.length - 1){
            updateSubjectList.push(arr);
            arr = [];
        }
    })
    return (
      <div className="course-show">
          <Loading
          opacity={false}
          tip="加载中..."
          spinning={visible}>
            {
                userIdentity == 'teacher' || userIdentity == "manager"?
                <div className="show-top">
                    {/* <div className="course-liveness" style={{marginRight: 107}}>
                        <Popover
                        content={
                            <div className="circle-tootip">
                                <p className="tooltip-title">活跃人数</p>
                                <ul className="tooltip-list">
                                    <li>一年级平均活跃人数 3人/课</li>
                                    <li>一年级平均活跃人数 3人/课</li>
                                    <li>一年级平均活跃人数 3人/课</li>
                                    <li>一年级平均活跃人数 3人/课</li>
                                </ul>
                            </div>
                        }>
                            <div className="circle-blue">
                                {"--"}
                            </div>
                        </Popover>
                        
                        <p>课堂平均活跃人数</p>
                    </div> */}
                    <div className="course-add" style={{marginRight: 107}}>
                        <div className="circle-violet">
                            {typeof courseShowInfo.addAll == 'number' && 
                            typeof courseShowInfo.subtractAll == 'number'?
                            (courseShowInfo.addAll - courseShowInfo.subtractAll).toFixed(1):
                            "--"}
                        </div>
                        <p>课堂平均分</p>
                    </div>
                    <div className="course-reduce" style={{marginRight: 107}}>
                        <div className="circle-orange">
                            {typeof courseShowInfo.addAll == "number"?
                            courseShowInfo.addAll.toFixed(1):
                            "--"}
                        </div>
                        <p>课堂平均加分</p>
                    </div>
                    {/* <div className="raise-hand" style={{marginRight: 107}}>
                        <div className="circle-red">
                            {typeof courseShowInfo.subtractAll == "number"?
                            courseShowInfo.subtractAll.toFixed(1):
                            "--"}
                        </div>
                        <p>课堂平均扣分</p>
                    </div> */}
                    <div className="raise-hand">
                        <div className="circle-green">
                            {typeof courseShowInfo.raiseAll == "number"?
                            courseShowInfo.raiseAll.toFixed(1):
                            "--"}
                        </div>
                        <p>平均举手次数</p>
                    </div>
                </div>:
                <div className="show-top"> 
                    {/* <div className="course-liveness">
                        <Popover
                        placement="bottomLeft"
                        content={
                            <div className="circle-tootip">
                                <p className="tooltip-title">活跃人数</p>
                                <ul className="tooltip-list">
                                    <li>一年级平均活跃人数 <span>3人/课</span><i className="downlogo"></i></li>
                                    <li>一年级平均活跃人数 <span>3人/课</span><i className="uplogo"></i></li>
                                    <li>一年级平均活跃人数 <span>3人/课</span></li>
                                    <li>一年级平均活跃人数 <span>3人/课</span></li>
                                </ul>
                            </div>
                        }>
                            <div className="circle-blue">
                                50
                            </div>
                        </Popover>
                        <p>课堂活跃度</p>
                    </div> */}
                    <div className="course-add">
                        <div className="circle-orange">
                            {courseShowInfo.addAll}
                        </div>
                        <p>课堂加分</p>
                    </div>
                    {/* <div className="course-reduce">
                        <div className="circle-red">
                            {courseShowInfo.subtractAll}
                        </div>
                        <p>课堂扣分</p>
                    </div> */}
                    <div className="raise-hand">
                        <div className="circle-green">
                            {courseShowInfo.raiseAll}
                        </div>
                        <p>举手次数</p>
                    </div>
                </div>
          }
          
          <div className="show-bottom">
                <div className="grade-compare-status">
                    {/* 暂时没有扣分率 */}
                    {/* <div className="kind-list" style={{margin: "24px 0 0 67px"}}>
                        <span>类型:</span>
                        <span className="list-one">加分率</span>
                        <span className="list-slice-line"></span>
                        <span className="list-one">扣分率</span>
                    </div> */}
                    {
                        userIdentity == "manager" && !currentClass && !currentGrade?
                        leaderCourseShowInfo.length == 0?
                        <Empty
                        className={"bar-empty"}
                        style={{margin: "80px 0 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>:
                        <div className="grade-compare-echart" style={{marginTop: 24}} id="grade-compare-echart"></div>:
                        !courseShowInfo.lessonBonusRateDataList || courseShowInfo.lessonBonusRateDataList.length == 0?
                        <Empty
                        className={"bar-empty"}
                        style={{margin: "80px 0 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>:
                        <div className="grade-compare-echart" style={{marginTop: 24}} id="grade-compare-echart"></div> 
                    }
                </div>
                <div className="slice-line"></div>
                <div className="subject-grade-statistic">
                    {
                        allSubjectList.length > 0?
                        <div className="kind-list" style={{margin: "24px 0 0 67px"}}>
                            <span>学科:</span>
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
                            {/* <span className="list-one">数学</span>
                            <span className="list-slice-line"></span>
                            <span className="list-one">英语</span> */}
                        </div>:
                        ""
                    }
                    {
                        userIdentity == "manager" && !currentClass && !currentGrade?
                        leaderCourseGradeInfo.length > 0?
                        <div className="grade-statistic-echart" id="grade-statistic-echart"></div>:
                        <Empty
                        className={"bar-empty"}
                        style={{margin: "80px 0 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>:
                        courseGradeInfo.length > 0?
                        <div className="grade-statistic-echart" id="grade-statistic-echart"></div>:
                        <Empty
                        className={"bar-empty"}
                        style={{margin: "80px 0 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                    
                </div>
          </div>
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
export default connect(mapStateToProps)(memo(forwardRef(CourseShow)));
  