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
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import {Select} from "antd";
import { Empty } from "../../../component/common";
import * as graphic from 'echarts/lib/util/graphic';
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
const {
    Option
} = Select;
//   import { resizeForEcharts } from "../../../util/public";
function DetailHealth(props, ref) {
    let {
        sickInfo,
        userIdentity,
        currentClass,
        currentGrade,
        currentTerm,
        userInfo: {UserID, SchoolID},
        temperatureInfo,
        reflash
    } = props;
    const [currentDataType, setCurrentDataType] = useState("3");
    const [temType, setTemType] = useState(1);
    const [sickList, setSickList] = useState([]);
    const [temperatureList, setTemperatureList] = useState([]);
    useLayoutEffect(()=>{
        //获取体温数据
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
        //获取体温的统计信息
        let url = BasicProxy + "/api/healthy/temperature/abnormalCountWithPeriod?id=" + (
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
            currentClass?
            2:
            currentGrade?
            3:
            4
        ) +
        "&periodType=" + temType +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setTemperatureList(result.data);
            }
        })
    }, [currentGrade, currentClass, currentTerm, userIdentity, reflash, temType]);
    useLayoutEffect(()=>{
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
        //获取次数和时长的统计信息
        let url = BasicProxy + "/api/healthy/leave/distribution?id=" + (
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
            currentClass?
            2:
            currentGrade?
            3:
            4
        ) +
        "&periodType=1" +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setSickList(result.data);
            }
        })
    }, [currentGrade, currentClass, currentTerm, userIdentity, reflash]);
    useEffect(() => { 
        if(temperatureList.length == 0){
            return;
        }
        let xList = [], myList = [];
        temperatureList.forEach((item)=>{
            xList.push(item.date);
            myList.push(item.averageTemperature.toFixed(1));
        })
        let myEchart = echarts.init(document.getElementById("temperature-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '体温记录',
                left: 'center',
                top: '20px',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            grid: {
                top: 80,
                bottom: xList.length > 6? 55: 45
            },
            tooltip: {
                trigger: 'axis',
                // axisPointer: {
                //     type: 'shadow'
                // }
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
                name: '体温/℃',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 40]
                },
                min: 35,
                max: 42,
                splitLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#999999'
                    },
                }
            },{
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#999999'
                    },
                    formatter: '{value} '
                }
            }],
            series: [
                {
                    name:'体温',
                    type:'line',
                    lineStyle: {
                        color: '#358bff',
                        width: 1
                    },
                    itemStyle: {
                        normal: {
                            color: '#358bff',
                            opacity: 0
                        },
                        emphasis:{ // 鼠标经过时：
                            color: 'white',
                            borderWidth: 3,
                            borderColor: '#358bff',
                            opacity: 1
                        }
                    },
                    symbolSize: 8,
                    symbol: 'circle',
                    // smooth: true,
                    data:myList
                }
            ]
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [temperatureList, userIdentity]);
    //病假时长和次数图表
    useEffect(() => { 
        if(sickList.length == 0){
            return;
        }
        let xList = [], countList = [], timesList = [];
        sickList.forEach((item)=>{
            xList.push(item.date);
            if(userIdentity == "student"){
                countList.push(item.studentAverageDuration);
                timesList.push(item.studentAverageCount);
            }
            if(userIdentity == "teacher"){
                countList.push(item.classAverageDuration);
                timesList.push(item.classAverageCount);
            }
            if(userIdentity == "manager"){
                countList.push(item.gradeAverageDuration);
                timesList.push(item.gradeAverageCount);
            }
        })
        let myEchart = echarts.init(document.getElementById("askleave-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '病假次数与时长',
                left: 'center',
                top: '20px',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            grid: {
                top: 115,
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
                        <span style="color: rgba(255, 255, 255, 0.8);">
                        ${item.value}${item.seriesName == "次数"? "次": "h"}
                        </span><br/>`;
                    })
                    return str;
                }
            },
            legend: {
                top: '50px',
                left: 'center',
                data:['次数','时长'],
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
            },{
                type: 'value',
                name: '时长/h',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 40, 0, 0]
                },
                axisLabel: {
                    textStyle: {
                        color: '#999999'
                    },
                    formatter: '{value} '
                }
            }],
            series: [
                {
                    name:'时长',
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
                    data:countList
                },
                {
                    name:'次数',
                    type:'bar',
                    barWidth : 24,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1da4fe'
                        },{
                            offset: 1,
                            color: '#7ecbff'
                        }])
                    },
                    data:timesList
                }       
            ]
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [userIdentity, sickList]);

    return (
        <div className="detail-health">
            <div className="show-top">
                <div className="temperature-info">
                    <div className="temperature-avg">
                        <div className="circle blue" title={typeof temperatureInfo.averageTemperature == "number"? 
                             temperatureInfo.averageTemperature.toFixed(1) + "℃":
                             "--"
                            }>
                            {typeof temperatureInfo.averageTemperature == "number"? 
                             temperatureInfo.averageTemperature.toFixed(1) + "℃":
                             "--"
                            }
                        </div>
                        <p>平均体温</p>
                    </div>
                    <div className="temperature-warn-count">
                        <div className="circle orange" title={typeof temperatureInfo.abNormalCount == "number"? 
                             temperatureInfo.abNormalCount:
                             "--"
                        }>
                        {typeof temperatureInfo.abNormalCount == "number"? 
                             temperatureInfo.abNormalCount:
                             "--"
                        }
                        </div>
                        <p>异常体温次数</p>
                    </div>
                    <div className="temperature-warn-rate">
                        <div className="circle red" title={typeof temperatureInfo.abNormalRate == "number"? 
                             parseInt(temperatureInfo.abNormalRate*100) + "%":
                             "--"
                        }>
                        {typeof temperatureInfo.abNormalRate == "number"? 
                             parseInt(temperatureInfo.abNormalRate*100) + "%":
                             "--"
                        }
                        
                        </div>
                        <p>异常体温率</p>
                    </div>
                </div>
                <div className="slice-line"></div>
                <div className="askleave-info">
                    <div className="askleave-count">
                        <div className="circle violet" title={typeof sickInfo.sickRecordCount == "number"?
                             sickInfo.sickRecordCount: "--"}>
                            {typeof sickInfo.sickRecordCount == "number"?
                             sickInfo.sickRecordCount: "--"}
                        </div>
                        <p>病假次数</p>
                    </div>
                    <div className="askleave-time">
                        <div className="circle pink" title={typeof sickInfo.sickRecordDuration == "number"?
                             sickInfo.sickRecordDuration + "h": "--"}>
                            {typeof sickInfo.sickRecordDuration == "number"?
                             sickInfo.sickRecordDuration + "h": "--"}
                        </div>
                        <p>病假时长</p>
                    </div>
                    <div className="askleave-rate">
                        <div className="circle green" title={typeof sickInfo.sickRecordCount == "number"? sickInfo.totalCount?
                             (parseInt(sickInfo.sickRecordCount / sickInfo.totalCount)*100) + "%": 0: "--"}>
                            {typeof sickInfo.sickRecordCount == "number"? sickInfo.totalCount?
                             (parseInt(sickInfo.sickRecordCount / sickInfo.totalCount)*100) + "%": 0: "--"}
                        </div>
                        <p>病假率</p>
                    </div>
                </div>
            </div>
            <div className="show-bottom">
                    {
                        temperatureList.length > 0?
                        <div className="echart-container">
                            <Select defaultValue="1" className="select" onChange={(value)=>{setTemType(value)}}>
                                <Option value="3">按天数</Option>
                                <Option value="2">按周次</Option>
                                <Option value="1">按月份</Option>
                            </Select>
                            <div className="temperature-echart" id="temperature-echart"></div>
                        </div>:
                        <Empty
                        className={"bar-empty"}
                        style={{margin: "20px 0", width: "calc(50% - 1px)", display: "inline-block"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                    
                    <div className="slice-line"></div>
                    {
                        sickList.length > 0?
                        <div className="askleave-echart" id="askleave-echart"></div>:
                        <Empty
                        className={"bar-empty"}
                        style={{margin: "20px 0", width: "calc(50% - 1px)", display: "inline-block"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                    
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
export default connect(mapStateToProps)(memo(forwardRef(DetailHealth)));
  