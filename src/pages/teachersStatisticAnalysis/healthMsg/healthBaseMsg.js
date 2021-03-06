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
import {Table, Select} from "antd";
// import echarts from "echarts";
import {Empty} from "../../../component/common";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import "echarts/lib/chart/scatter";
import * as graphic from 'echarts/lib/util/graphic';
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
const {Option} = Select;
//   import { resizeForEcharts } from "../../../util/public";
function HealthBaseMsg(props, ref) {

    let {
        userIdentity,
        currentClass,
        currentGrade,
        currentTerm,
        data,
        userInfo: {UserID, SchoolID},
        reflash
    } = props;
    const [currentIndex, setCurrentIndex] = useState(1);
    const [infoList, setInfoList] = useState([]);
    const [leaderLnfoList, setLeaderInfoList] = useState([]);
    const [leaderPositionList, setLeaderPositionList] = useState([]);
    //领导端
    const [schoolInfoList, setSchoolInfoList] = useState([]);
    const [currentGender, setCurrentGender] = useState(-1);
    const [schoolStudentList, setSchoolStudentList] = useState([]);
    const [schoolStatistic, setSchoolStatistic] = useState([]);
    useLayoutEffect(() => {
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        if(!currentTerm){
            return;
        }
        let currentTermInfo = currentTerm && currentTerm.value? JSON.parse(currentTerm.value): {};
        //获取目前平均身高体重信息
        let url = BasicProxy + "/api/healthy/studentHealthInfo/distribution?id=" + 
        (
            userIdentity == "student"?
            UserID:
            userIdentity == "teacher"?
            currentClass:
            currentClass?
            currentClass:
            currentGrade?
            currentGrade:
            SchoolID
        ) +
        "&queryType=" + 
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
        // "&termId=" + currentTermInfo.termId +
        "&periodType=1" +
        "&startDate=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setInfoList(result.data);
            }
        })
        //获取学生的身高体重的变化情况和BMI波动情况
        url = BasicProxy + "/api/healthy/studentHealthInfo/leader/distribution?classId=&gradeId=" +
        "&periodType=1" +
        "&gender=" + currentGender +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setSchoolStatistic(result.data);
            }
        })
        //获取年级学生身高体重分布图
        url = BasicProxy + "/api/healthy/studentHealthInfo/leader/listLatest?classId=&gradeId=" +
        // "&termId=" + currentTermInfo.termId +
        "&gender=" + currentGender +
        "&schoolId=" + SchoolID +
        "&startDate=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setSchoolStudentList(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, userIdentity, reflash]);
    //领导端
    useLayoutEffect(() => {
        //领导端查学校查询身高体重和BMI图表数据
        if(userIdentity != "manager" || currentClass || currentGrade){
            return;
        }
        if(!currentTerm){
            return;
        }
        let currentTermInfo = currentTerm && currentTerm.value? JSON.parse(currentTerm.value): {};
        //获取目前平均身高体重信息
        let url = BasicProxy + "/api/healthy/studentHealthInfo/leader/all?classId=&gradeId=" +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                let arr = [];
                result.data.forEach((item)=>{
                    let obj = {
                        gradeName: item.gradeInfo? item.gradeInfo.gradeName: "",
                        maleHeight: item.male? item.male.height: "",
                        maleWeight: item.male? item.male.weight: "",
                        maleBMI: item.male? item.male.bmiIndex: "",
                        femaleHeight: item.female? item.female.height: "",
                        femaleWeight: item.female? item.female.weight: "",
                        femaleBMI: item.female? item.female.bmiIndex: "",
                    }
                    arr.push(obj);
                })
                setSchoolInfoList(result.data);
            }
        })
        
    }, [currentTerm, currentClass, currentGrade, userIdentity, reflash]);
    useLayoutEffect(() => {
        //领导端获取年级学生身高体重分布图
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        if(!currentTerm){
            return;
        }
        let currentTermInfo = currentTerm && currentTerm.value? JSON.parse(currentTerm.value): {};
        //获取学生的身高体重的变化情况和BMI波动情况
        let url = BasicProxy + "/api/healthy/studentHealthInfo/leader/distribution?classId=&gradeId=" +
        "&periodType=1" +
        "&gender=" + currentGender +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setLeaderInfoList(result.data);
            }
        })
        //获取目前平均身高体重信息
        url = BasicProxy + "/api/healthy/studentHealthInfo/leader/listLatest?classId=&gradeId=" +
        "&gender=" + currentGender +
        "&schoolId=" + SchoolID +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + (currentTermInfo.startDate? currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate? currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setLeaderPositionList(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, userIdentity, currentGender, SchoolID, reflash]);
    useEffect(() => {
        if(userIdentity == "student"){
            return;
        }
        if((currentClass || currentGrade) && (!data.avgInfo || !Array.isArray(data.avgInfo.healthyInfoList) ||
        data.avgInfo.healthyInfoList.length == 0)){
            return;
        }
        if(!currentGrade && !currentClass && leaderPositionList.length == 0){
            return;
        }
        let dataList = [];
        if(currentClass || currentGrade){
            data.avgInfo && Array.isArray(data.avgInfo.healthyInfoList) &&
            data.avgInfo.healthyInfoList.length > 0 &&
            data.avgInfo.healthyInfoList.forEach((item)=>{
                let arr = [item.height.toFixed(1), item.weight.toFixed(1), item.userName];
                dataList.push(arr);
            })
        } else {
            leaderPositionList.forEach((item)=>{
                let arr = [item.height.toFixed(1), item.weight.toFixed(1), item.userName];
                dataList.push(arr);
            })
        }
        
        let myEchart = echarts.init(document.getElementById("class-position-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '班级学生身高体重分布图',
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
                bottom: 40
            },
            tooltip: {
                trigger: 'axis',
                appendToBody: true,
                extraCssText: "border: 0; background-color: rgba(0, 0, 0, 0.6); padding: 10px;",
                formatter: function(params){
                    let str = "";
                    params.forEach((item)=>{
                        let userData = item.value;
                        str += `
                        <span 
                        style="
                        display: inline-block; 
                        width: 100%; 
                        color: #fffd64; 
                        margin-bottom: -5px;
                        text-overflow: ellipsis; 
                        overflow: hidden; 
                        white-space: nowrap;">${userData[2]}</span><br/>`;
                        str += `
                        <i class='tooltip-dot'></i>
                        <span style="color: #cccccc;">身高: ${userData[0]}cm, </span>
                        <span style="color: rgba(255, 255, 255, 0.8);">体重: ${userData[1]}kg</span><br/>`;
                    })
                    return str;
                }
            },
            xAxis: {
                name: '体重kg',
                nameTextStyle: {
                    color: '#999999',
                },
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
                name: '身高cm',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 40]
                },
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
            series: [{
                symbolSize: 11,
                itemStyle: {
                  color: '#04c8a1'  
                },
                data: dataList,
                type: 'scatter'
            }]
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [userIdentity, data, leaderPositionList])
    useEffect(() => { 
        if(infoList.length == 0 && leaderLnfoList.length == 0){
            return;
        }
        let xList = [], heightList = [], weightList = [];
        if(currentClass || currentGrade){
            infoList.forEach((item)=>{
                xList.push(item.recordTime && item.recordTime.substr(0, 10));
                heightList.push(typeof item.height == "number"? item.height.toFixed(1): "--");
                weightList.push(typeof item.weight == "number"? item.weight.toFixed(1): "--");
            })
        } else {
            leaderLnfoList.forEach((item)=>{
                xList.push(item.date);
                heightList.push(typeof item.averageHeight == "number"? item.averageHeight.toFixed(1): "--");
                weightList.push(typeof item.averageWeight == "number"? item.averageWeight.toFixed(1): "--");
            })
        }
        
        let myEchart = echarts.init(document.getElementById("high-weight-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: '身高体重变化',
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
                // axisPointer: {
                //     type: 'shadow'
                // },
                appendToBody: true,
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
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}</span><br/>`;
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
                bottom: 10
            },
            legend: {
                top: '50px',
                left: 'center',
                data:['身高','体重'],
                textStyle: {
                    color: '#999999',
                }
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
                name: '身高cm',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 40]
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
                }
            },{
                type: 'value',
                name: '体重kg',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 40, 0, 0]
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
            }],
            series: [
                {
                    name:'身高',
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
                    data:heightList
                },
                {
                    name:'体重',
                    type:'line',
                    lineStyle: {
                        color: '#009900',
                        width: 1
                    },
                    itemStyle: {
                        normal: {
                            color: '#009900',
                            opacity: 0
                        },
                        emphasis:{ // 鼠标经过时：
                            color: 'white',
                            borderWidth: 3,
                            borderColor: '#009900',
                            opacity: 1
                        }
                    },
                    symbolSize: 8,
                    symbol: 'circle',
                    // smooth: true,
                    data:weightList
                },
            ]
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [infoList, leaderLnfoList]);
    useEffect(() => { 
        if(infoList.length == 0 && leaderLnfoList.length == 0){
            return;
        }
        let xList = [], heightList = [], weightList = [], BMIList = [];
        if(currentClass || currentGrade){
            infoList.forEach((item)=>{
                xList.push(item.recordTime && item.recordTime.substr(0, 10));
                BMIList.push(item.bmiIndex.toFixed(1));
            })
        } else {
            leaderLnfoList.forEach((item)=>{
                xList.push(item.date);
                BMIList.push(item.bmiIndex.toFixed(1));
            })
        }
        let myEchart = echarts.init(document.getElementById("BMI-echart"));
        myEchart.resize();
        let option = {
            title: {
                text: 'BMI波动情况',
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
                appendToBody: true,
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
                        <span style="color: rgba(255, 255, 255, 0.8);">${item.value}</span><br/>`;
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
                bottom: 10
            },
            legend: {
                top: '50px',
                left: 'center',
                // data:['个人','标准下限','标准上限'],
                textStyle: {
                    color: '#999999',
                }
            },
            xAxis: {
                type: 'category',
                name: '时间',
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
                name: 'BMI值',
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
                    name: userIdentity == "student"? '个人': currentClass? '班级': '年级',
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
                    data:BMIList
                },
                // {
                //     name:'标准下限',
                //     type:'line',
                //     lineStyle: {
                //         color: '#ff0000',
                //         width: 1
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#ff0000',
                //             opacity: 0
                //         },
                //         emphasis:{ // 鼠标经过时：
                //             color: 'white',
                //             borderWidth: 3,
                //             borderColor: '#ff0000',
                //             opacity: 1
                //         }
                //     },
                //     symbolSize: 8,
                //     symbol: 'circle',
                //     // smooth: true,
                //     data:[4, 4, 4, 4, 3]
                // },
                // {
                //     name:'标准上限',
                //     type:'line',
                //     lineStyle: {
                //         color: '#009900',
                //         width: 1
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#009900',
                //             opacity: 0
                //         },
                //         emphasis:{ // 鼠标经过时：
                //             color: 'white',
                //             borderWidth: 3,
                //             borderColor: '#009900',
                //             opacity: 1
                //         }
                //     },
                //     symbolSize: 8,
                //     symbol: 'circle',
                //     // smooth: true,
                //     data:[1, 1, 1, 0, 3]
                // },
            ]
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [infoList, leaderLnfoList]);
    let tableHeader = [
        {
            title: '年级',
            key: 'gradeName',
            dataIndex: 'gradeName',
            width: '14.4%',
            ellipsis: true
        },
        {
            title: '男生平均身高(cm)',
            key: 'maleHeight',
            dataIndex: 'maleHeight',
            width: '14.4%',
            ellipsis: true
        },
        {
            title: '男生平均体重(kg)',
            key: 'maleWeight',
            dataIndex: 'maleWeight',
            width: '14.4%',
            ellipsis: true
        },
        {
            title: 'BMI(男)',
            key: 'maleBMI',
            dataIndex: 'maleBMI',
            width: '14.4%',
            ellipsis: true
        },
        {
            title: '女生平均身高(cm)',
            key: 'femaleHeight',
            dataIndex: 'femaleHeight',
            width: '14.4%',
            ellipsis: true
        },
        {
            title: '女生平均体重(kg)',
            key: 'femaleWeight',
            dataIndex: 'femaleWeight',
            width: '14.4%',
            ellipsis: true
        },
        {
            title: 'BMI(女)',
            key: 'femaleBMI',
            dataIndex: 'femaleBMI',
            width: '14.4%',
            ellipsis: true
        }
    ]
    let Total = schoolInfoList.length;
    let paginationObj = Total > 8?{
        total: Total,
        showQuickJumper: false,
        showSizeChanger: false,
        current: currentIndex,
        position: ['bottomCenter'],
        pageSize: 8,
        onChange: (pageIndex)=>setCurrentIndex(pageIndex)
    }:false;
    return (
      <div className="health-base-info">
          {
            userIdentity == 'manager' && !currentClass && !currentGrade?
            <Table
                dataSource={schoolInfoList}
                columns={tableHeader}
                rowClassName="rows"
                pagination={paginationObj}
                className={"health-table " + (Total > 8? "table-min": "")}
            ></Table>:
            <div className="show-top">
                <div className="info-show-one blue">
                    <i className="cardlogo"></i>
                    <p className="info-status">
                        身高:
                        <span>{data.baseInfo? 
                         userIdentity == "manager"?
                         currentClass?
                         data.avgInfo.classAverageHeight?
                         data.avgInfo.classAverageHeight.toFixed(1) + "cm":
                         "--":
                         data.avgInfo.gradeAverageHeight?
                         data.avgInfo.gradeAverageHeight.toFixed(1) + "cm":
                         "--":
                         userIdentity == "teacher"?
                         data.avgInfo.classAverageHeight?
                         data.avgInfo.classAverageHeight.toFixed(1) + "cm":
                         "--":
                         data.baseInfo.height?
                         data.baseInfo.height.toFixed(1) + "cm": 
                         "--":
                         "--"}</span>
                    </p>
                    {
                        userIdentity == "student"?
                        <p className="info-avg">
                            班级平均: 
                            <span>{data.avgInfo? data.avgInfo.classAverageHeight.toFixed(1) + "cm": "--"}</span>;
                            年级平均: 
                            <span>{data.avgInfo? data.avgInfo.gradeAverageHeight.toFixed(1) + "cm": "--"}</span>
                        </p>:
                        userIdentity == "teacher" || currentClass?
                        <p className="info-avg">
                            年级平均: 
                            <span>{data.avgInfo? data.avgInfo.gradeAverageHeight.toFixed(1) + "cm": "--"}</span>
                        </p>:
                        ""
                    }
                    
                </div>
                <div className="info-show-one green">
                    <i className="cardlogo"></i>
                    <p className="info-status">
                        体重:
                        <span>{data.baseInfo? 
                         userIdentity == "manager"?
                         currentClass?
                         data.avgInfo.classAverageWeight?
                         data.avgInfo.classAverageWeight.toFixed(1) + "kg":
                         "--":
                         data.avgInfo.gradeAverageWeight?
                         data.avgInfo.gradeAverageWeight.toFixed(1) + "kg":
                         "--":
                         userIdentity == "teacher"?
                         data.avgInfo.classAverageWeight?
                         data.avgInfo.classAverageWeight.toFixed(1) + "kg":
                         "--":
                         data.baseInfo.weight?
                         data.baseInfo.weight.toFixed(1) + "kg":
                         "--":
                         "--"}</span>
                    </p>
                    {
                        userIdentity == "student"?
                        <p className="info-avg">
                            班级平均: 
                            <span>{data.avgInfo? data.avgInfo.classAverageWeight.toFixed(1) + "kg": "--"}</span>;
                            年级平均: 
                            <span>{data.avgInfo? data.avgInfo.gradeAverageWeight.toFixed(1) + "kg": "--"}</span>
                        </p>:
                        userIdentity == "teacher" || currentClass?
                        <p className="info-avg">
                            年级平均: 
                            <span>{data.avgInfo? data.avgInfo.gradeAverageWeight.toFixed(1) + "kg": "--"}</span>
                        </p>:
                        ""
                    }
                    
                </div>
                <div className="info-show-one orange">
                    <i className="cardlogo"></i>
                    <p className="info-status">
                        BMI:
                        <span>{data.baseInfo?
                            userIdentity == "manager"?
                            currentClass?
                            data.avgInfo.classAverageHeight?
                            (data.avgInfo.classAverageWeight/((data.avgInfo.classAverageHeight/100)*2)).toFixed(1):
                            "0.0":
                            data.avgInfo.gradeAverageHeight?
                            (data.avgInfo.gradeAverageWeight/((data.avgInfo.gradeAverageHeight/100)*2)).toFixed(1):
                            "0.0":
                            userIdentity == "teacher"?
                            data.avgInfo.classAverageHeight?
                            (data.avgInfo.classAverageWeight/((data.avgInfo.classAverageHeight/100)*2)).toFixed(1):
                            "0.0":
                            data.baseInfo.bmiIndex.toFixed(1): "--"}</span>
                        <i className="querylogo" title="体质指数(BMI)=体重(kg)/身高*2(m)"></i>
                    </p>
                    {
                        userIdentity == "student"?
                        <p className="info-avg">
                            班级平均: 
                            <span>
                            {
                                data.avgInfo? 
                                data.avgInfo.classAverageHeight?
                                (data.avgInfo.classAverageWeight/((data.avgInfo.classAverageHeight/100)*2)).toFixed(1):
                                "0.0":
                                "--"
                            }
                            </span>;
                            年级平均: 
                            <span>
                            {
                                data.avgInfo? 
                                data.avgInfo.gradeAverageHeight?
                                (data.avgInfo.gradeAverageWeight/((data.avgInfo.gradeAverageHeight/100)*2)).toFixed(1):
                                "0.0":
                                "--"
                            }
                            </span>
                        </p>:
                        userIdentity == "teacher" || currentClass?
                        <p className="info-avg">
                            年级平均: 
                            <span>
                            {
                                data.avgInfo? 
                                data.avgInfo.gradeAverageHeight?
                                (data.avgInfo.gradeAverageWeight/((data.avgInfo.gradeAverageHeight/100)*2)).toFixed(1):
                                "0.0":
                                "--"
                            }
                            </span>
                        </p>:
                        ""
                    }
                    
                </div>
            </div>
          }
          {
            userIdentity == 'manager' && !currentClass && !currentGrade?
            <div>
                 <div className="select-container">
                    <span>性别:</span>
                    <Select defaultValue="-1" className="select" onChange={(value)=>setCurrentGender(value)}>
                        <Option value="-1">全部</Option>
                        <Option value="0">男</Option>
                        <Option value="1">女</Option>
                    </Select>
                </div>
                {/* <div className="select-container">
                    <span>年级:</span>
                    <Select defaultValue="one" className="select">
                        <Option value="one">一年级</Option>
                    </Select>
                </div> */}
            </div>:
            ""    
          }
          {
            infoList.length > 0 || leaderLnfoList.length > 0?
            <div className="show-bottom" style={{backgroundColor: (userIdentity == 'student'? "#f5f5f5": "white")}}>
        
                <div className="high-weight-echart" id="high-weight-echart"></div>
                <div className="slice-line"></div>
                <div className="BMI-echart" id="BMI-echart"></div>
            </div>:
            <Empty
            // className={"bar-empty"}
            style={{margin: "20px 0"}}
            title={"暂无数据"}
            type={"4"}
            ></Empty>
          }
          
          {
            userIdentity == 'student'?
            "":
            data.avgInfo &&
            Array.isArray(data.avgInfo.healthyInfoList) &&
            data.avgInfo.healthyInfoList.length > 0 || leaderPositionList.length > 0?
            <div className="class-position-echart" id="class-position-echart"></div>
            :
            infoList.length > 0 || leaderLnfoList.length > 0?
            <Empty
            // className={"bar-empty"}
            style={{margin: "20px 0"}}
            title={"暂无数据"}
            type={"4"}
            ></Empty>:
            ""
          }
            
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
export default connect(mapStateToProps)(memo(forwardRef(HealthBaseMsg)));
  