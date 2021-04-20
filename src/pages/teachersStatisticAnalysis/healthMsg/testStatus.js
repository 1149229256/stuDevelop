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
import { Progress } from "antd";
// import echarts from "echarts";
import { Empty } from "../../../component/common";
import { Scrollbars } from "react-custom-scrollbars";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import * as graphic from 'echarts/lib/util/graphic';
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
//   import { resizeForEcharts } from "../../../util/public";
function TestStatus(props, ref) {
    let {
        userIdentity,
        testAvg,
        projectList,
        currentTerm,
        currentClass,
        currentGrade,
        reflash,
        userInfo: {UserID, SchoolID}
    } = props;
    const [subjectList, setSubjectList] = useState([]);
    const [currentSubject, setCurrentSubject] = useState({});
    const [echartList, setEchartList] = useState([]);
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
    ]
    useLayoutEffect(() => {
        //获取体测成绩数据
        if(!currentTerm){
            return;
        }
        if(userIdentity == "student" && !UserID){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let classList = sessionStorage.getItem("classList") ?
        JSON.parse(sessionStorage.getItem("classList")):
        [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let currentTermInfo = currentTerm && currentTerm.value && JSON.parse(currentTerm.value);
        //获取体测项目列表
        let url = BasicProxy + "/api/healthy/physicalTest/project/list";
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setSubjectList(result.data);
                result.data[0] && setCurrentSubject(result.data[0])
            }
        })
    }, [currentTerm, currentClass, currentGrade, userIdentity, UserID, reflash]);
    useLayoutEffect(() => {
        //获取体测图表数据
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        if(!currentTerm){
            return;
        }
        if(userIdentity == "student" && !UserID){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let classList = sessionStorage.getItem("classList") ?
        JSON.parse(sessionStorage.getItem("classList")):
        [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let currentTermInfo = currentTerm && currentTerm.value? JSON.parse(currentTerm.value): {};
        //获取体测项目列表
        let url = BasicProxy + "/api/healthy/physicalTest/score/distribution?id=" + (
            userIdentity == "student"?
            UserID:
            userIdentity == "teacher"?
            currentClass:
            userIdentity == "manager"?
            currentGrade:
            currentGrade
        ) +
        "&queryType=" + (
            userIdentity == "student"?
            1:
            userIdentity == "teacher"?
            2:
            userIdentity == "manager"?
            3:
            3
        ) +
        "&projectId=" +( currentSubject.subjectId? currentSubject.subjectId: "") +
        "&periodType=1" + 
        "&startDate=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setEchartList(result.data);
            }
        })
    }, [currentSubject, userIdentity, currentTerm, currentClass, currentGrade, UserID, reflash]);
    useLayoutEffect(() => {
        //领导端获取体测图表数据
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        if(!currentTerm){
            return;
        }
        let currentTermInfo = currentTerm && currentTerm.value && JSON.parse(currentTerm.value);
        //获取体测项目列表
        let url = BasicProxy + "/api/healthy/physicalTest/leader/score/totalScore?schoolId=" + SchoolID +
        "&classId=&gradeId=" +
        "&subjectId=" +( currentSubject.subjectId? currentSubject.subjectId: "") +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setEchartList(result.data);
            }
        })
    }, [currentSubject, userIdentity, currentTerm, currentClass, currentGrade, reflash]);
    useEffect(() => { 
        if(echartList.length == 0 || subjectList.length == 0){
            return;
        }
        let xList = [];
        let myEchart = echarts.init(document.getElementById("test-kind-echart"));
        myEchart.resize();
        let seriesList = [], legendList = [];
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            echartList.forEach((item, index)=>{
                xList.push(item.subject? item.subject.subjectName: "");
                let arr = [];
                Array.isArray(item.gradeSubjectScoreList) &&
                item.gradeSubjectScoreList.forEach((child)=>{
                    legendList.push(child.gradeInfo? child.gradeInfo.gradeName: "");
                    arr.push(child.average);
                })
                seriesList = [
                    {
                        // name:'一年级',
                        type:'bar',
                        // barWidth: 16,
                        itemStyle: {
                            color: colorList[index%6]
                        },
                        data:arr
                    },
                ]
            })
        } else {
            let classList = [], gradeList = [], myList = [];
            echartList.forEach((item)=>{
                xList.push(item.date);
                classList.push(item.classAverage.toFixed(1));
                gradeList.push(item.gradeAverage.toFixed(1));
                myList.push(item.studentScore.toFixed(1));
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
                // {
                //     name:'最高分',
                //     type:'line',
                //     lineStyle: {
                //         color: '#f18a1a',
                //         width: 1,
                //         borderColor: '#f18a1a',
                //         emphasis: {
                //             width: 1
                //         }
                //     },
                //     itemStyle: {
                //         color: '#f18a1a'
                //     },
                //     data:[1, 1, 1, 0, 3]
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
        }
        let option = {
            title: {
                text: '体测项目对比',
                left: 'center',
                top: '35px',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            grid: {
                top: 110,
                bottom: xList.length > 8? 55: 45
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
                top: '65px',
                left: 'center',
                data: userIdentity == "manager" && !currentGrade && !currentClass? legendList: [],
                // data:['个人', '最高分', '班级','年级'],
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
                    }
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
    }, [currentSubject, currentTerm, currentClass, currentGrade, userIdentity, echartList]);

    return (
        <div className="test-status">
            <div className="show-top">
                <div className="test-avg">
                    <Progress 
                    type="circle" 
                    percent={
                        userIdentity == "student"?
                        testAvg.averageScore:
                        userIdentity == "teacher"?
                        testAvg.classAverageScore:
                        currentClass?
                        testAvg.classAverageScore:
                        currentGrade?
                        testAvg.gradeAverageScore:
                        testAvg.schoolAverageScore
                    }
                    format={(percent)=>percent}
                    width={92}
                    className="progress"
                    strokeColor="#8fdb66" />
                    <p>体测平均分</p>
                </div>
                <div className="slice-line"></div>
                <div className="test-kind-list">
                    <Scrollbars>
                        {
                            Array.isArray(projectList) && projectList.map((item, index)=>{
                                let score = userIdentity == "student"?
                                item.studentAverageScore:
                                userIdentity == "teacher"?
                                item.classAverageScore:
                                currentClass?
                                item.classAverageScore:
                                currentGrade?
                                item.gradeAverageScore:
                                item.schoolAverageScore;
                                return (
                                    <div className={
                                        score >= 90 ? "good":
                                        score >= 80 && score < 90? "common":
                                        score >= 70 && score < 80? "pass":
                                        "bad"
                                    } key={index}>
                                        <i className="test-kind-rank"></i>
                                        <p>评分: {score.toFixed(1)}</p>
                                        <p className="test-kind-name" title={item.testProject.subjectName}>
                                            {item.testProject.subjectName}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </Scrollbars>
                    
                </div>
            </div>
            {
                subjectList.length > 0?
                <div className="show-bottom">
                    <div className="kind-list">
                        <span>项目:</span>
                        {
                            subjectList.map((item, index)=>{
                                return (
                                    <span key={index} onClick={()=>setCurrentSubject(item.subjectId)}>
                                        <span 
                                        className={"list-one " + (currentSubject == item.subjectId? "active": "")}>
                                            {item.subjectName}
                                        </span>
                                        {
                                            index != subjectList.length - 1?
                                            <span className="list-slice-line"></span>:
                                            ""
                                        }
                                    </span>
                                    
                                )
                            })
                        }
                    </div>
                    <div className="test-kind-echart" id="test-kind-echart"></div>
                </div>:
                <Empty
                // className={"list-empty"}
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
        commonData: { levelHash, userInfo },
    } = state;
    return { levelHash, userInfo };
};
export default connect(mapStateToProps)(memo(forwardRef(TestStatus)));
  