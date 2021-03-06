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
import { Progress, Select, Carousel } from "antd";
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

function PunishMsg(props, ref) {
    let {
        userIdentity,
        currentTerm,
        currentGrade,
        currentClass,
        userInfo: { UserID,SchoolID },
        reflash
    } = props;
    const [punishInfo, setPunishInfo] = useState([]);
    const [punishList, setPunishList] = useState([]);
    const [leaderPubishInfo, setLeaderPunishInfo] = useState({});
    //日期类型，1按月，2按周，3按日
    const [currentDataType, setCurrentDataType] = useState("3");
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
        let url;
        // if(userIdentity == 'student'){//
            url = BasicProxy + "/api/punishAndReward/punishment/list?studentId=" + (
                userIdentity == "student"?
                UserID:
                ""
            ) +
            "&classId=" + currentClass +
            "&gradeId=" + currentGrade +
            "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
            "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        // }
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setPunishList(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, reflash]);
    useLayoutEffect(()=>{
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        if(!currentTermInfo.startDate || !currentTermInfo.endDate){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        
        let id = userIdentity == "student"?
        UserID:
        userIdentity == "teacher"?
        currentClass:
        userIdentity == "manager"?
        currentClass?
        currentClass:
        currentGrade?
        currentGrade:
        SchoolID:
        "";
        if(!id){
            return;
        }
        let url;
        // if(userIdentity == 'student'){//
            url = BasicProxy + "/api/punishAndReward/punishment/distribution?id=" + (
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
            "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
            "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        // }
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setPunishInfo(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, currentDataType, reflash]);
    //领导端调用接口
    useLayoutEffect(()=>{
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        if(!currentTermInfo.startDate || !currentTermInfo.endDate){
            return;
        }
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        let url;
        // if(userIdentity == 'student'){//
            url = BasicProxy + "/api/punishAndReward/punishment/leader/punishStatus?classId=&gradeId=" +
            "&schoolId=" + SchoolID +
            "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
            "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        // }
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && result.data){
                setLeaderPunishInfo(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, reflash, SchoolID]);
    useLayoutEffect(()=>{
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        if(!currentTermInfo.startDate || !currentTermInfo.endDate){
            return;
        }
        let url = BasicProxy + "/api/punishAndReward/punishment/leader/distribution?classId=&gradeId=" +
        "&schoolId=" + SchoolID +
        "&periodType=" + currentDataType +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setPunishInfo(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, currentDataType, reflash]);
    useEffect(() => {
        let myEchart = echarts.init(document.getElementById("punish-statistic-echart"));
        myEchart.resize();
        let myList = [], classList = [], gradeList = [], xList = [];
        
        let seriesList = [], legendList = [];
        if(userIdentity == "manager" && !currentGrade && !currentClass){ //查学校
            let sumList = [], gradeList = [];
            punishInfo.forEach((item)=>{
                sumList.push(item.totalTimes);
                xList.push(item.date);
                Array.isArray( item.classTimes) &&
                item.classTimes.forEach((child)=>{
                    gradeList.push(child.gradeInfo && child.gradeInfo.gradeName);
                })
            });
            gradeList = [...new Set(gradeList)];
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
            gradeList.forEach((item, index)=>{
                let arr = [];
                punishInfo.forEach((child, index)=>{
                    Array.isArray(child.classTimes) &&
                    child.classTimes.forEach((child2)=>{
                        if(child2.gradeInfo.gradeName == item){
                            arr.push(child2.punishCount);
                        }
                        // legendList.push(child.classInfo? child.classInfo.gradeName: "");
                    })
                })
                seriesList.push({
                    name: item,
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
        } else if(userIdentity == "student"){
            punishInfo && punishInfo.forEach((item)=>{
                myList.push(item.personalTimes);
                classList.push(item.classTimes);
                gradeList.push(item.gradeTimes);
                xList.push(item.month);
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
                
            ];
        } else if(currentClass){
            punishInfo && punishInfo.forEach((item)=>{
                myList.push(item.personalTimes);
                classList.push(item.classTimes);
                gradeList.push(item.gradeTimes);
                xList.push(item.month);
            })
            seriesList = [
                // {
                //     name:'班级奖项',
                //     type:'line',
                //     lineStyle: {
                //         color: '#2d3047',
                //         width: 1,
                //         borderColor: '#2d3047',
                //         emphasis: {
                //             width: 1
                //         }
                //     },
                //     itemStyle: {
                //         color: '#2d3047'
                //     },
                //     data:[3, 3, 3, 2, 3]
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
                    data:gradeList
                },
                
            ];
        } else if(currentGrade){
            punishInfo && punishInfo.forEach((item)=>{
                myList.push(item.personalTimes);
                classList.push(item.classTimes);
                gradeList.push(item.gradeTimes);
                xList.push(item.month);
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
                    data:classList
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
                    data:gradeList
                },
                
            ];
        }
        let option = { 
            grid: {
                top: 40,
                bottom: xList.length > 6? 55: 40,
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
            backgroundColor: '#f5f5f5',
            legend: (
                userIdentity == "manager" && !currentGrade && !currentClass?
                {
                    type: 'scroll',
                    width: '62%',
                    top: '7px',
                    left: 'center',
                    // data: legendList,
                    textStyle: {
                        color: '#999999',
                    }
                }:
                {
                    top: '7px',
                    left: (userIdentity == 'teacher'?'30%': '58%'),
                    // data:['个人','班级','年级'],
                    textStyle: {
                        color: '#999999',
                    }
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
    }, [punishInfo, userIdentity]);
    let classCount = 0, stuCount = 0, gradeCount = 0, schoolCount = 0;
    punishList.forEach((item)=>{
        if(item.punishmentType == 3){
            classCount++;
        }
        if(item.punishmentType == 2){
            gradeCount++;
        }
        if(item.punishmentType == 1){
            stuCount++;
        }
        if(item.punishmentLevel == 1){
            schoolCount++;
        }
    })
    return (
        <div className="punish-info">
            <div className="punish-left">
                {
                    // userIdentity == 'teacher'?
                    currentClass && !currentGrade?
                    <p className="punish-count">
                        班级处罚总数
                        <span style={{color: '#333333'}}>{classCount}次</span>;
                        年级平均处罚数
                        <span style={{color: '#ff0000'}}>{gradeCount}次</span>
                    </p>:
                    userIdentity == "student"?
                    <p className="punish-count">
                        个人处罚总数
                        <span style={{color: '#333333'}}>{stuCount}次</span>;
                        班级平均处罚数
                        <span style={{color: '#ff0000'}}>{classCount}次</span>;
                        年级平均处罚数
                        <span style={{color: '#ff0000'}}>{gradeCount}次</span>
                    </p>:
                    ""
                }
                <div className="circle-container">
                    <div className="punish-kind-info">
                        <div className="circle blue">
                        {
                        userIdentity == "manager" && !currentClass && !currentGrade?
                        typeof leaderPubishInfo.schoolLevelCount == "number"?
                        leaderPubishInfo.schoolLevelCount:
                        "--":
                        schoolCount
                        }</div>
                        <p>校级处罚</p>
                    </div>
                    <div className="punish-kind-info">
                        <div className="circle orange">
                        {
                        userIdentity == "manager" && !currentClass && !currentGrade?
                        typeof leaderPubishInfo.gradeLevelCount == "number"?
                        leaderPubishInfo.gradeLevelCount:
                        "--":
                        gradeCount
                        }</div>
                        <p>年级处罚</p>
                    </div>
                    <div className="punish-kind-info">
                        <div className="circle red">
                        {
                        userIdentity == "manager" && !currentClass && !currentGrade?
                        typeof leaderPubishInfo.classLevelCount == "number"?
                        leaderPubishInfo.classLevelCount:
                        "--":
                        classCount
                        }</div>
                        <p>班级处罚</p>
                    </div>
                </div>
            </div>
            <div className="punish-right">
                    <div className="echart-title">
                        <span>处罚统计</span>
                        <Select value={currentDataType} className="select" onChange={(value)=>setCurrentDataType(value)}>
                            <Option value="3">按天数</Option>
                            <Option value="2">按周次</Option>
                            <Option value="1">按月份</Option>
                        </Select>
                    </div>
                <div className="punish-statistic-echart" id="punish-statistic-echart"></div>
            </div>
        </div>
    );
}
  
const mapStateToProps = (state) => {
    let {
        commonData: { levelHash, userInfo },
    } = state;
    return { levelHash, userInfo };
};
export default connect(mapStateToProps)(memo(forwardRef(PunishMsg)));
  