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
import { Progress, Select } from "antd";
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
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
const {Option} = Select;

function DetailExercise(props, ref) {
    let {
        userIdentity,
        testAvg,
        projectList,
        currentTerm,
        currentClass,
        currentGrade,
        userInfo: {UserID, SchoolID}
    } = props;
    //日常运动基本信息
    const [detailInfo, setDetailInfo] = useState({});
    const [currentDateType, setCurrentDateType] = useState('month');
    useLayoutEffect(() => {
        //获取体测成绩数据
        if(!currentTerm){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        if(userIdentity == "student" && !UserID){
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
        //获取日常体育运动基本信息
        let url = BasicProxy + "/api/healthy/sports/dallySportsResults?studentId=" +
       (userIdentity == "student"?
        UserID:
        "") +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        "&schoolId=" + SchoolID +
        "&startDate=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setDetailInfo(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, userIdentity, UserID, SchoolID]);
    useEffect(() => {
        let myEchart = echarts.init(document.getElementById("time-position-echart"));
        myEchart.resize();
        let option = {
            tooltip: {
                trigger: 'item',
            },
            grid: {
                top: 10,
                right: 0,
                bottom: 0,
                left: 0
            },
            title: {
                text: '运动时间分布图',
                left: 'center',
                top: 'bottom',
                textStyle: {
                    padding: [0, 0, 30, 0],
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            backgroundColor: {
                type: 'radial',  //radial为镜像渐变， line为线性渐变
                x: 0.5,  //x，y控制渐变的圆心
                y: 0.5, 
                r: 0.35, //半径
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
                    name: '访问来源',
                    type: 'pie',
                    radius: ['25%', '60%'],
                    minAngle: 25,
                    avoidLabelOverlap: false,
                    label: {
                        show: true
                    },
                    emphasis: {
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: 'rgba(0, 0, 0, 0.05)'
                        },
                    },
                    
                    data: [1, 2, 3, 4, 5]
                }
            ]
        }; 
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, []);
    useEffect(() => {
        let myEchart = echarts.init(document.getElementById("place-position-echart"));
        myEchart.resize();
        let option = {
            tooltip: {
                trigger: 'item',
            },
            grid: {
                top: 10,
                right: 0,
                bottom: 0,
                left: 0
            },
            title: {
                text: '运动时间分布图',
                left: 'center',
                top: 'bottom',
                textStyle: {
                    padding: [0, 0, 30, 0],
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            backgroundColor: {
                type: 'radial',  //radial为镜像渐变， line为线性渐变
                x: 0.5,  //x，y控制渐变的圆心
                y: 0.5, 
                r: 0.35, //半径
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
                    name: '访问来源',
                    type: 'pie',
                    radius: ['25%', '60%'],
                    minAngle: 25,
                    avoidLabelOverlap: false,
                    label: {
                        show: true
                    },
                    emphasis: {
                        itemStyle: {
                            borderWidth: 10,
                            borderColor: 'rgba(0, 0, 0, 0.05)'
                        },
                    },
                    
                    data: [1, 2, 3, 4, 5]
                }
            ]
        }; 
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, []);
    useEffect(() => {
        let myEchart = echarts.init(document.getElementById("exercise-count-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '运动次数',
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
                left: '58%',
                data:['个人','班级','年级'],
                textStyle: {
                    color: '#999999',
                }
            },
            xAxis: {
                type: 'category',
                name: '月份',
                nameTextStyle: {
                    color: '#999999',
                    
                },
                data: ['一月份','二月份','三月份','四月份','五月份'],
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
            series: [
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
                    data:[1, 1, 1, 0, 3]
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
                    data:[1, 2, 0, 1, 5]
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
                    data:[1, 2, 0, 1, 5]
                },
                
            ]
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, []);
    useEffect(() => {
        let myEchart = echarts.init(document.getElementById("exercise-time-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '运动时长',
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
                left: '58%',
                data:['个人','班级','年级'],
                textStyle: {
                    color: '#999999',
                }
            },
            xAxis: {
                type: 'category',
                name: '月份',
                nameTextStyle: {
                    color: '#999999',
                    
                },
                data: ['一月份','二月份','三月份','四月份','五月份'],
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
            series: [
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
                    data:[1, 1, 1, 0, 3]
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
                    data:[1, 2, 0, 1, 5]
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
                    data:[1, 2, 0, 1, 5]
                },
                
            ]
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, []);
    return (
        <div className="detail-exercise">
            <span className="exercise-info">
                体育课程:
                <span>
                {
                   typeof detailInfo.classPerWeek == "number"?
                   parseInt(detailInfo.classPerWeek) + "次/周":
                   "--"
                }
                </span>
            </span>
            {/* <span className="exercise-info">
                早操:
                <span>平均2次/d，共48次</span>
            </span>
            <span className="exercise-info">
                课间操:
                <span>平均2次/d，共48次</span>
            </span> */}
            <span className="exercise-info">
                体育运动会:
                <span>
                {
                   typeof detailInfo.schoolSportsMettingTimes == "number"?
                   detailInfo.schoolSportsMettingTimes + "次":
                   "--" 
                }
                </span>
            </span>
            <div className="exercise-card-container">
                <div className="exercise-card time">
                    <i className="exerciselogo"></i>
                    <p>
                        运动时长:
                        <span>
                        <span className="number-font">
                        {
                            typeof detailInfo.sportTimeDayAVG == 'number' &&
                            detailInfo.sportTimeDayAVG / 60 > 60?
                            parseInt(detailInfo.sportTimeDayAVG / 60 / 60):
                            ""
                        }
                        </span>
                        <span>
                        {
                            typeof detailInfo.sportTimeDayAVG == 'number' &&
                            detailInfo.sportTimeDayAVG / 60 > 60?
                            'h':
                            ''
                        }
                        </span>
                        <span className="number-font">
                        {
                            typeof detailInfo.sportTimeDayAVG == 'number'?
                            detailInfo.sportTimeDayAVG / 60 > 60?
                            parseInt(detailInfo.sportTimeDayAVG % 60 / 60):
                            detailInfo.sportTimeDayAVG / 60 > 1?
                            parseInt(detailInfo.sportTimeDayAVG / 60):
                            "":
                            ""
                        }
                        </span>
                        <span>
                        {
                            typeof detailInfo.sportTimeDayAVG == 'number' &&
                            detailInfo.sportTimeDayAVG / 60 > 1?
                            'min':
                            ''
                        }
                        </span>
                        <span className="number-font">
                        {
                            typeof detailInfo.sportTimeDayAVG == 'number'?
                            detailInfo.sportTimeDayAVG / 3600 > 1?
                            detailInfo.sportTimeDayAVG % 3600 > 60?
                            parseInt(detailInfo.sportTimeDayAVG % 3600 / 60):
                            parseInt(detailInfo.sportTimeDayAVG % 3600):
                            detailInfo.sportTimeDayAVG / 60 > 1?
                            parseInt(detailInfo.sportTimeDayAVG / 60):
                            parseInt(detailInfo.sportTimeDayAVG):
                            "--"
                        }
                        </span>
                        s
                        </span>
                    </p>
                    <p className="exercise-avg">班级平均:10h; 年级平均:9h</p>
                </div>
                <div className="exercise-card count">
                    <i className="exerciselogo"></i>
                    <p>
                        运动次数:
                        <span>10h</span>
                    </p>
                    <p className="exercise-avg">班级平均:10h; 年级平均:9h</p>
                </div>
                <div className="exercise-card frequency">
                    <i className="exerciselogo"></i>
                    <p>
                        运动频率:
                        <span>10h</span>
                    </p>
                    <p className="exercise-avg">班级平均:10h; 年级平均:9h</p>
                </div>
            </div>
            <div className="exercise-pie-echart">
                <div className="time-position-echart" id="time-position-echart"></div>
                <div className="slice-line"></div>
                <div className="place-position-echart" id="place-position-echart"></div>
            </div>
            <div className="select-container">
                <span>时间:</span>
                <Select defaultValue="month" className="select" onChange={(value)=>setCurrentDateType(value)}>
                    <Option value="day">按天数</Option>
                    <Option value="week">按周次</Option>
                    <Option value="month">按月份</Option>
                </Select>
            </div>
            <div className="exercise-bar-container">
                <div className="exercise-count-echart" id="exercise-count-echart"></div>
                <div className="slice-line"></div>
                <div className="exercise-time-echart" id="exercise-time-echart"></div>
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
export default connect(mapStateToProps)(memo(forwardRef(DetailExercise)));
  