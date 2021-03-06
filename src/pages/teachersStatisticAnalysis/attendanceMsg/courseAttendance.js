import {
    connect,
    // useSelector,
    useDispatch,
} from "react-redux";
import React, {
    memo,
    useEffect,
    useState,
    useImperativeHandle,
    useRef,
    useLayoutEffect,
    forwardRef,
} from "react";
import {Progress} from "antd";
import "./index.scss";

import * as echarts from "echarts/lib/echarts";
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
function CourseAttendance(props){
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
        reflash
      } = props;
    //统计类型(1：按日 2：按周 3：按月)
    const [currentKind, setCurrentKind] = useState("1");
    const [rateInfo, setRateInfo] = useState({});
    const [rateList, setRateList] = useState({});
    const [classRateList, setClassRateList] = useState({});
    const [gradeRateList, setGradeRateList] = useState({});
    //控制图表加载动画显示
    const [echartLoading, setEchartLoading] = useState(true);
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
    //获取班级与年级的数据
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
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let classList = sessionStorage.getItem("classList") ?
        JSON.parse(sessionStorage.getItem("classList")):
        [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let url = BasicProxy + "/api/attendance/attendance/times?type=2" +
        "&studentId=" + 
        (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        "&schoolId=" + SchoolID +
        "&statisticalType=" + currentKind +
        // "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setClassRateList(result.data);
            }
        })
        url = BasicProxy + "/api/attendance/attendance/times?type=3" +
        "&studentId=" + 
        (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        "&schoolId=" + SchoolID +
        "&statisticalType=" + currentKind +
        // "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setGradeRateList(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, currentKind, reflash]);
    useLayoutEffect(() => {
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        setEchartLoading(true);
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let classList = sessionStorage.getItem("classList") ?
        JSON.parse(sessionStorage.getItem("classList")):
        [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let url = BasicProxy + "/api/attendance/attendance/times?type=" + (
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
        "&studentId=" + 
        (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        "&schoolId=" + SchoolID +
        "&statisticalType=" + currentKind +
        // "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setRateList(result.data); 
            }
            setEchartLoading(false);
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, currentKind, reflash]);
    useEffect(() => {
        if(!rateList.absentRateDetailList || rateList.absentRateDetailList.length == 0){
            return;
        }
        let myEchart = echarts.init(document.getElementById("attendance-rate-echart"));
        myEchart.resize();
        let seriesList = [], xList = [];
        if(userIdentity == "manager" && !currentClass && !currentGrade){
            let myList = [], classList = [], gradeList = [];
            rateList.absentRateDetailList && rateList.absentRateDetailList.forEach((item)=>{
                xList.push(item.times);
                myList.push(parseInt(item.absentRateResult));
            })
            seriesList = [
                {
                    name:'全校',
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
                },
                
            ]
        } else if(userIdentity == 'student'){
            let myList = [], classList = [], gradeList = [];
            rateList.absentRateDetailList && rateList.absentRateDetailList.forEach((item)=>{
                xList.push(item.times);
                myList.push(parseInt(item.absentRateResult));
            })
            classRateList.absentRateDetailList && classRateList.absentRateDetailList.forEach((item)=>{
                classList.push(parseInt(item.absentRateResult));
            })
            gradeRateList.absentRateDetailList && gradeRateList.absentRateDetailList.forEach((item)=>{
                gradeList.push(parseInt(item.absentRateResult));
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
        } else if(userIdentity == 'teacher' || currentClass){
            let myList = [], classList = [], gradeList = [];
            rateList.absentRateDetailList && rateList.absentRateDetailList.forEach((item)=>{
                xList.push(item.times);
                myList.push(parseInt(item.absentRateResult));
            })
            classRateList.absentRateDetailList && classRateList.absentRateDetailList.forEach((item)=>{
                classList.push(parseInt(item.absentRateResult));
            })
            gradeRateList.absentRateDetailList && gradeRateList.absentRateDetailList.forEach((item)=>{
                gradeList.push(parseInt(item.absentRateResult));
            })
            seriesList = [
                // {
                //     name:'个人',
                //     type:'line',
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
                //     data:myList
                // },
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
        } else {
            let myList = [], classList = [], gradeList = [];
            rateList.absentRateDetailList && rateList.absentRateDetailList.forEach((item)=>{
                xList.push(item.times);
                myList.push(parseInt(item.absentRateResult));
            })
            classRateList.absentRateDetailList && classRateList.absentRateDetailList.forEach((item)=>{
                classList.push(parseInt(item.absentRateResult));
            })
            gradeRateList.absentRateDetailList && gradeRateList.absentRateDetailList.forEach((item)=>{
                gradeList.push(parseInt(item.absentRateResult));
            })
            seriesList = [
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
                    data:myList
                },
                
            ]
        }
        
        let option = {
            title: {
                text: '各' + (userIdentity == 'teacher'? '学科': '年级') + 
                (currentKind == 'attendance'? '出勤': '缺勤')+ '率对比',
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
                bottom: xList.length > 8? 55: 45
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
                        <span style="color: #cccccc;">${item.seriesName}缺勤率:</span>
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}%</span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '50px',
                left: 'center',
                // data:['个人','班级','年级'],
                textStyle: {
                    color: '#999999',
                }
            },
            dataZoom: {
                show: xList.length > 8? true: false,
                maxValueSpan: 7,
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
    }, [userIdentity, rateList, currentKind]);
    return (
        <div className="course-attendance">
            <div className="course-attendance-top">
                <div className="attendance-rate-container">
                    <div className="attendance-rate">
                        <Progress
                        type="circle" 
                        percent={
                        rateList.avgAttendanceRateResult?
                        parseInt(rateList.avgAttendanceRateResult):
                        "--"}
                        width={92}
                        format={(percent)=>percent}
                        className="progress"
                        strokeColor="#49aaea" />
                        <p>出勤率</p>
                    </div>
                </div>
                <div className="slice-line"></div>
                <div className="attendance-status">
                    <div className="askleave-count">
                        <p className="count-num blue">
                            {typeof rateList.vacateTimes == "number"? rateList.vacateTimes: "--"}</p>
                        <p>请假次数</p>
                    </div>
                    <div className="askleave-count">
                        <p className="count-num red">
                            {typeof rateList.lateTimes == "number"? rateList.lateTimes: "--"}</p>
                        <p>迟到次数</p>
                    </div>
                    <div className="askleave-count">
                        <p className="count-num green">
                            {typeof rateList.leaveEarlyTimes == "number"? rateList.leaveEarlyTimes: "--"}</p>
                        <p>早退次数</p>
                    </div>
                    <div className="askleave-count">
                        <p className="count-num violet">
                            {typeof rateList.absentTimes == "number"? rateList.absentTimes: "--"}</p>
                        <p>缺勤次数</p>
                    </div>
                </div> 
            </div>
            <div className="select-container">
                <span>时间:</span>
                <Select value={currentKind} className="select" onChange={(value)=>setCurrentKind(value)}>
                    <Option value="1">按天数</Option>
                    <Option value="2">按周次</Option>
                    <Option value="3">按月份</Option>
                </Select>
            </div>
            {/* <div className="kind-list">
                <span>类型:</span>
                <span 
                className={"list-one " + (currentKind == "attendance"? "active": "")} 
                onClick={()=>setCurrentKind("attendance")}>出勤率</span>
                <span className="list-slice-line"></span>
                <span 
                className={"list-one " + (currentKind == "absence"? "active": "")}
                onClick={()=>setCurrentKind("absence")}>缺勤率</span>
            </div> */}
            <Loading
            opacity={false}
            tip={"加载中..."}
            spinning={echartLoading}
            >
            {
                rateList && Array.isArray(rateList.absentRateDetailList) &&
                rateList.absentRateDetailList.length > 0?
                <div className="attendance-rate-echart" id="attendance-rate-echart"></div>:
                <Empty
                // className={"list-empty"}
                style={{margin: "20px 0"}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>
            }
            </Loading>
            
            
        </div>
    )
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
export default connect(mapStateToProps)(memo(forwardRef(CourseAttendance)));