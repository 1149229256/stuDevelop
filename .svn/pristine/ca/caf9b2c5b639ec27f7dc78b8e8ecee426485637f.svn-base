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
import {Select} from "antd";
import echarts from "echarts/lib/echarts";
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
let { BasicProxy } = ipConfig;
const {Option} = Select;
//   import { resizeForEcharts } from "../../../util/public";
function MyLive(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
        reflash
      } = props;
    const [liveData, setLiveData] = useState({});
    const [liveList, setLiveList] = useState([]);
    const [currentDataType, setCurrentDataType] = useState("1");
    useLayoutEffect(() => {
        //作息
        if(userIdentity == "student" && !UserID){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        if(!currentTerm.value){
            return;
        }
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let url = BasicProxy + "/api/campusLife/rest/average?studentId=" + (
          userIdentity == "student"?
          UserID:
          ""
        ) +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
              setLiveData(result.data);
            }
        })
  
        url = BasicProxy + "/api/campusLife/rest/distribution?id=" + (
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
        // "&gradeId=" + currentGrade +
        // "&schoolId=" + SchoolID +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
              setLiveList(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, currentDataType, reflash]);
    useEffect(() => {
        if(liveList.length == 0){
            return;
        }
        let xList = [], inList = [], outList = [], homeList = [], courseList = [];
        liveList.forEach((item)=>{
            xList.push(item.month);
            inList.push(item.classAverageInCampusTime);
            outList.push(item.classAverageOutCampusTime);
            homeList.push(item.classAverageDormitoryTime);
            courseList.push(item.classLengthOfClassTime);
        })
        let myEchart = echarts.init(document.getElementById("kinds-time-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: (
                    userIdentity == "student"?
                    "个人":
                    userIdentity == "teacher"?
                    "班级":
                    currentClass?
                    "班级":
                    currentGrade?
                    "年级":
                    "全校"
                ) + '各项时长',
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
                top: '50px',
                left: 'center',
                // data:['上课时长','宿舍时长','校内时长', '校外时长'],
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
            dataZoom: {
                show: xList.length > 6? true: false,
                maxValueSpan: 5,
                height: 2,
                showDetail: false,
                moveHandSize: 6,
                bottom: 10
            },
            series: [
                {
                    name:'上课时长',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#2d3047'
                        },{
                            offset: 1,
                            color: '#363d72'
                        }])
                    },
                    data:courseList
                },
                {
                    name:'宿舍时长',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ffb709'
                        },{
                            offset: 1,
                            color: '#ffe88a'
                        }])
                    },
                    data:homeList
                },
                {
                    name:'校内时长',
                    type:'bar',
                    barWidth : 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#80c35c'
                        },{
                            offset: 1,
                            color: '#b3f093'
                        }])
                    },
                    data:inList
                },
                {
                    name:'校外时长',
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
                    data:outList
                },
                
            ]
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [currentDataType, liveList]);  

    return (
      <div className="my-live">
            <div className="show-top">
                <div className="course-time">
                    <i className="livelogo"></i>
                    <p className="live-name">上课时长: <span>
                    {
                    userIdentity == "student"?
                    liveData.studentLengthOfClassTime:
                    userIdentity == "teacher"?
                    liveData.classLengthOfClassTime:
                    userIdentity == "manager"?
                    liveData.gradeLengthOfClassTime:
                    "--"
                    }
                    h</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:
                            {liveData.gradeLengthOfClassTime?liveData.gradeLengthOfClassTime: "--"}
                        </p>:
                        <p>
                            班级平均:{liveData.classLengthOfClassTime?liveData.classLengthOfClassTime: "--"}; 
                            年级平均:{liveData.gradeLengthOfClassTime?liveData.gradeLengthOfClassTime: "--"}
                        </p>
                    }
                </div>
                <div className="schoolhome-time">
                    <i className="livelogo"></i>
                    <p className="live-name">宿舍时长: <span>
                    {
                    userIdentity == "student"?
                    liveData.studentAverageDormitoryTime	:
                    userIdentity == "teacher"?
                    liveData.classAverageDormitoryTime:
                    userIdentity == "manager"?
                    liveData.gradeAverageDormitoryTime:
                    "--"
                    }h</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:{liveData.gradeAverageDormitoryTime? liveData.gradeAverageDormitoryTime: "--"}</p>:
                        <p>班级平均:{liveData.classAverageDormitoryTime? liveData.classAverageDormitoryTime: "--"}; 
                            年级平均:{liveData.gradeAverageDormitoryTime? liveData.gradeAverageDormitoryTime: "--"}</p>
                    }
                </div>
                <div className="school-in-time">
                    <i className="livelogo"></i>
                    <p className="live-name">校内时长: <span>{
                    userIdentity == "student"?
                    liveData.studentAverageInCampusTime:
                    userIdentity == "teacher"?
                    liveData.classAverageInCampusTime:
                    userIdentity == "manager"?
                    liveData.gradeAverageInCampusTime:
                    "--"
                    }h</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:{liveData.gradeAverageInCampusTime? liveData.gradeAverageInCampusTime: "--"}</p>:
                        <p>班级平均:{liveData.classAverageInCampusTime? liveData.classAverageInCampusTime: "--"}; 
                            年级平均:{liveData.gradeAverageInCampusTime? liveData.gradeAverageInCampusTime: "--"}</p>
                    }
                </div>
                <div className="school-out-time">
                    <i className="livelogo"></i>
                    <p className="live-name">校外时长: <span>{
                    userIdentity == "student"?
                    liveData.studentAverageOutCampusTime:
                    userIdentity == "teacher"?
                    liveData.classAverageOutCampusTime:
                    userIdentity == "manager"?
                    liveData.gradeAverageOutCampusTime:
                    "--"
                    }h</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:{liveData.gradeAverageOutCampusTime? liveData.gradeAverageOutCampusTime: "--"}</p>:
                        <p>班级平均:{liveData.classAverageOutCampusTime? liveData.classAverageOutCampusTime: "--"}; 
                        年级平均:{liveData.gradeAverageOutCampusTime? liveData.gradeAverageOutCampusTime: "--"}</p>
                    }
                </div>
            </div>
            <div className="select-container">
                <span>时间:</span>
                <Select value={currentDataType} className="select" onChange={(value)=>setCurrentDataType(value)}>
                    <Option value="3">按天数</Option>
                    <Option value="2">按周次</Option>
                    <Option value="1">按月份</Option>
                </Select>
            </div>
            <div className="show-bottom">
                {
                    liveList.length > 0?
                    <div className="kinds-time-echart" id="kinds-time-echart"></div>:
                    <Empty
                    // className={"bar-empty"}
                    style={{margin: "20px 0"}}
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
export default connect(mapStateToProps)(memo(forwardRef(MyLive)));
  