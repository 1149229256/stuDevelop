import {
    connect,
    // useSelector,
    useDispatch,
    useStore,
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
import { Progress, Select, Popover, Carousel } from "antd";

import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import * as graphic from 'echarts/lib/util/graphic';
//   import { resizeForEcharts } from "../../../util/public";
import { Empty, Loading } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
const { Option } = Select;

function DetailWork(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
    } = props;
    //年级的数据
    const [gradeCompleteRateList, setGradeCompleteRateList] = useState([]);
    const [gradePassRateList, setGradePassRateList] = useState([]);
    const [gradeAvgScoreList, setGradeAvgScoreList] = useState([]);
    const [gradeDetailScoreList, setGradeDetailScoreList] = useState([]);
    //班级的数据
    const [classCompleteRateList, setClassCompleteRateList] = useState([]);
    const [classPassRateList, setClassPassRateList] = useState([]);
    const [classAvgScoreList, setClassAvgScoreList] = useState([]);
    const [classDetailScoreList, setClassDetailScoreList] = useState([]);
    //根据身份取得数据
    const [rankInfo, setRankInfo] = useState({});
    const [classRankInfo, setClassRankInfo] = useState({});
    const [gradeRankInfo, setGradeRankInfo] = useState({});
    const [completeRateList, setCompleteRateList] = useState([]);
    const [passRateList, setPassRateList] = useState([]);
    const [avgScoreList, setAvgScoreList] = useState([]);
    const [completeVisible, setCompleteVisible] = useState(true);
    const [passVisible, setPassVisible] = useState(true);
    const [avgVisible, setAvgVisible] = useState(true);
    const [subjectVisible, setSubjectVisible] = useState(true);
    //day是按日，week按周，month按月
    const [completeRateType, setCompleteRateType] = useState("day");
    const [passRateType, setPassRateType] = useState("day");
    const [detailScoreList, setDetailScoreList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
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
    //获取年级数据用于比较
    useLayoutEffect(() => {
        if(!currentTerm){
            return;
        }
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //获取全年级各科作业平均分
        let url = BasicProxy + "/api/learning2/homework/avgScore?type=3" +
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
                setGradeAvgScoreList(result.data);
            }
        })

        //获取全年级日常作业分数
        url = BasicProxy + "/api/learning2/homework/score?type=3" +
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
                setGradeDetailScoreList(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    //获取年级作业完成率
    useLayoutEffect(() => {
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);

        // SchoolID = "S27-511-AF57";
        // currentTermInfo.termId = "2020-202101";
        // currentClass = "d8ed1a21-39bc-4403-8330-5f9bd578f721";
        // currentGrade = "7C11E555-AE69-41DA-8E8B-624BB21B456E"; 
        let url = BasicProxy + "/api/learning2/homework/rate/date?type=3" +
        "&statisticalType=" + (
            completeRateType == "day"?
            1:
            completeRateType == "week"?
            2:
            completeRateType == "month"?
            3:
            1
        ) +
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
                setGradeCompleteRateList(result.data);
            }
        })
    }, [completeRateType, currentTerm, currentGrade, currentClass])
    //获取年级作业及格率
    useLayoutEffect(() => {
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);

        // SchoolID = "S27-511-AF57";
        // currentTermInfo.termId = "2020-202101";
        // currentClass = "d8ed1a21-39bc-4403-8330-5f9bd578f721";
        // currentGrade = "7C11E555-AE69-41DA-8E8B-624BB21B456E"; 
        let url = BasicProxy + "/api/learning2/homework/rate/date?type=3" +
        "&statisticalType=" + (
            passRateType == "day"?
            1:
            passRateType == "week"?
            2:
            passRateType == "month"?
            3:
            1
        ) +
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
                setGradePassRateList(result.data);
            }
        })
    }, [passRateType, currentTerm, currentGrade, currentClass])
    //学生获取班级数据用于比较
    useLayoutEffect(() => {
        if(!currentTerm){
            return;
        }
        if(userIdentity != "student"){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //获取班级各科作业平均分
        let url = BasicProxy + "/api/learning2/homework/avgScore?type=2" +
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
                setClassAvgScoreList(result.data);
            }
        })

        //获取班级日常作业分数
        url = BasicProxy + "/api/learning2/homework/score?type=2" +
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
                setClassDetailScoreList(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    //获取班级作业完成率
    useLayoutEffect(() => {
        if(userIdentity != "student"){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);

        // SchoolID = "S27-511-AF57";
        // currentTermInfo.termId = "2020-202101";
        // currentClass = "d8ed1a21-39bc-4403-8330-5f9bd578f721";
        // currentGrade = "7C11E555-AE69-41DA-8E8B-624BB21B456E"; 
        let url = BasicProxy + "/api/learning2/homework/rate/date?type=2" +
        "&statisticalType=" + (
            completeRateType == "day"?
            1:
            completeRateType == "week"?
            2:
            completeRateType == "month"?
            3:
            1
        ) +
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
                setClassCompleteRateList(result.data);
            }
        })
    }, [completeRateType, currentTerm, currentGrade, currentClass])
    //获取班级作业及格率
    useLayoutEffect(() => {
        if(userIdentity != "student"){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);

        // SchoolID = "S27-511-AF57";
        // currentTermInfo.termId = "2020-202101";
        // currentClass = "d8ed1a21-39bc-4403-8330-5f9bd578f721";
        // currentGrade = "7C11E555-AE69-41DA-8E8B-624BB21B456E"; 
        let url = BasicProxy + "/api/learning2/homework/rate/date?type=2" +
        "&statisticalType=" + (
            passRateType == "day"?
            1:
            passRateType == "week"?
            2:
            passRateType == "month"?
            3:
            1
        ) +
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
                setClassPassRateList(result.data);
            }
        })
    }, [passRateType, currentTerm, currentGrade, currentClass])
    //获取数据
    useLayoutEffect(() => {
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        //领导端查学校是另一个接口
        if(userIdentity == "manager" && !currentGrade && !currentClass){
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
        //获取个人及格率和完成率
        let url = BasicProxy + "/api/learning2/homework/rate?type=" +
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
                setRankInfo(result.data);
            }
        })
        //获取年级及格率和完成率用于悬浮框显示
        url = BasicProxy + "/api/learning2/homework/rate?type=3" +
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
                setGradeRankInfo(result.data);
            }
        })
        setAvgVisible(true);
        //获取各科作业平均分
        url = BasicProxy + "/api/learning2/homework/avgScore?type=" +
        (userIdentity == "manager"? 
        currentClass? 
        2: 
        currentGrade? 
        3:
        4:
        userIdentity == "teacher"? 2:
        1) +
        "&studentId=" + UserID +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setAvgScoreList(result.data);
            }
            setAvgVisible(false);
        })
        setSubjectVisible(true);
        //获取日常作业分数
        url = BasicProxy + "/api/learning2/homework/score?type=" +
        (userIdentity == "manager"? 
        currentClass? 
        2: 
        currentGrade? 
        3:
        4:
        userIdentity == "teacher"? 2:
        1) +
        "&studentId=" + UserID +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setDetailScoreList(result.data);
            }
            setSubjectVisible(false);
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    useLayoutEffect(() => {
        //领导端查学校是另一个接口
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        setCompleteVisible(true);
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        let url = BasicProxy + "/api/learning2/homework/rate/date?type=" +
        (userIdentity == "student"?
        1:
        userIdentity == "teacher"?
        2:
        currentClass?
        2:
        currentGrade?
        3:
        4) +
        "&statisticalType=" + (
            completeRateType == "day"?
            1:
            completeRateType == "week"?
            2:
            completeRateType == "month"?
            3:
            1
        ) +
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
                setCompleteRateList(result.data);
            }
            setCompleteVisible(false);
        })
    }, [completeRateType, currentTerm, currentGrade, currentClass])
    useLayoutEffect(() => {
        //领导端查学校是另一个接口
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            return;
        }
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        setPassVisible(true);
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        let url = BasicProxy + "/api/learning2/homework/rate/date?type=" +
        (userIdentity == "student"?
        1:
        userIdentity == "teacher"?
        2:
        currentClass?
        2:
        currentGrade?
        3:
        4) +
        "&statisticalType=" + (
            passRateType == "day"?
            1:
            passRateType == "week"?
            2:
            passRateType == "month"?
            3:
            1
        ) +
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
                setPassRateList(result.data);
            }
            setPassVisible(false);
        })
    }, [passRateType, currentTerm, currentGrade, currentClass])
    //领导端获取数据
    useLayoutEffect(() => {
        if(userIdentity != "manager" || currentGrade || currentClass){
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
        //获取及格率和完成率
        let url = BasicProxy + "/api/learning2/homework/rate?type=4" +
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
                setRankInfo(result.data);
            }
        })
        setAvgVisible(true);
        //获取各科作业平均分
        url = BasicProxy + "/api/learning2/homework/avgScore/batch?type=3" +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setAvgScoreList(result.data);
            }
            setAvgVisible(false);
        })
        setSubjectVisible(true);
        //获取日常作业分数
        url = BasicProxy + "/api/learning2/homework/score/batch?type=3" +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setDetailScoreList(result.data);
            }
            setSubjectVisible(false);
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    //获取各学科作业完成率和及格率
    useLayoutEffect(() => {
        setCompleteVisible(true);
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);

        // SchoolID = "S27-511-AF57";
        // currentTermInfo.termId = "2020-202101";
        // currentClass = "d8ed1a21-39bc-4403-8330-5f9bd578f721";
        // currentGrade = "7C11E555-AE69-41DA-8E8B-624BB21B456E"; 
        let url = BasicProxy + "/api/learning2/homework/rate/date/batch?type=3" +
        "&statisticalType=" + (
            completeRateType == "day"?
            1:
            completeRateType == "week"?
            2:
            completeRateType == "month"?
            3:
            1
        ) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setCompleteRateList(result.data);
            }
            setCompleteVisible(false);
        })
    }, [completeRateType, currentTerm, currentGrade, currentClass, userIdentity, SchoolID])
    useLayoutEffect(() => {
        setPassVisible(true);
        if(userIdentity != "manager" || currentGrade || currentClass){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);

        // SchoolID = "S27-511-AF57";
        // currentTermInfo.termId = "2020-202101";
        // currentClass = "d8ed1a21-39bc-4403-8330-5f9bd578f721";
        // currentGrade = "7C11E555-AE69-41DA-8E8B-624BB21B456E"; 
        let url = BasicProxy + "/api/learning2/homework/rate/date/batch?type=3" +
        "&statisticalType=" + (
            passRateType == "day"?
            1:
            passRateType == "week"?
            2:
            passRateType == "month"?
            3:
            1
        ) +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setPassRateList(result.data);
            }
            setPassVisible(false);
        })
    }, [passRateType, currentTerm, currentGrade, currentClass, userIdentity, SchoolID])
    //作业完成率图表
    useEffect(() => {
        if(completeRateList.length == 0){
            return;
        }
        let xList = [], myList = [], classDataList = [], gradeDataList = [], seriesList = [];
        
        if(userIdentity == "manager" && !currentClass && !currentGrade){
            completeRateList.forEach((item, index)=>{
                item.homeworkRateList &&
                item.homeworkRateList.forEach((child)=>{
                    xList.push(child.time && child.time.substr(5, 5));
                })
            })
            xList = [...new Set(xList)];
            completeRateList.forEach((item, index)=>{
                let arr = [];
                xList.forEach((child)=>{
                    item.homeworkRateList &&
                    item.homeworkRateList.forEach((child2)=>{
                        if(child2.time.substr(5, 5) == child){
                            arr.push(parseFloat(child2.finishRate*100).toFixed(1));
                        }
                    })
                })
                seriesList.push({
                    type: 'bar',
                    name: item.gradeName,
                    itemStyle: {
                        color: colorList[index%6]
                    }, 
                    data: arr
                },)
            })
        } else if(userIdentity == "student"){
            completeRateList.forEach((item)=>{
                xList.push(item.time && item.time.substr(5, 5));
                myList.push(parseFloat(item.finishRate*100).toFixed(1));
            })
            classCompleteRateList.forEach((item)=>{
                xList.push(item.time && item.time.substr(5, 5));
                classDataList.push(parseFloat(item.finishRate*100).toFixed(1));
            })
            gradeCompleteRateList.forEach((item)=> {
                gradeDataList.push(parseFloat(item.finishRate*100).toFixed(1));
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
                    type: 'bar',
                    name: '班级',
                    barWidth: 16,
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
                    type: 'bar',
                    name: '年级',
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
                    data: gradeDataList
                },
            ]
        } else if(currentClass){
            completeRateList.forEach((item)=>{
                xList.push(item.time && item.time.substr(5, 5));
                classDataList.push(parseFloat(item.finishRate*100).toFixed(1));
            })
            gradeCompleteRateList.forEach((item)=> {
                gradeDataList.push(parseFloat(item.finishRate*100).toFixed(1));
            })
            seriesList = [
                {
                    type: 'bar',
                    name: '班级',
                    barWidth: 16,
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
                    type: 'bar',
                    name: '年级',
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
                    data: gradeDataList
                },
            ]
        } else if(currentGrade){
            completeRateList.forEach((item)=>{
                xList.push(item.time && item.time.substr(5, 5));
                myList.push(parseFloat(item.finishRate*100).toFixed(1));
            })
            seriesList = [
                // {
                //     type: 'bar',
                //     name: '班级',
                //     barWidth: 16,
                //     itemStyle: {
                //         color: new graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: '#1da4fe'
                //         },{
                //             offset: 1,
                //             color: '#7ecbff'
                //         }])
                //     }, 
                //     data: classDataList
                // },
                {
                    type: 'bar',
                    // name: '年级',
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
                    data: myList
                },
            ]
        }
        let myEchart = echarts.init(document.getElementById("complete-rate-echart"));
        myEchart.resize();
        let option = {
            legend: (
                userIdentity != "manager" || currentGrade || currentClass?
                {
                right: '10%',
                top: 5
                }:
                {
                    type: 'scroll',
                    width: '62%',
                    left: 'center',
                    top: 5
                }
            ),
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
            grid: {
                top: 40,
                bottom: xList.length > 6? 40: 20
            },
            dataZoom: {
                show:  xList.length > 6? true: false,
                maxValueSpan: 5,
                minValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 10
            },
            xAxis: {
                type: 'category',
                name:"日期",
                nameTextStyle: {
                    color: '#999999'
                },
                axisLabel: {
                    color: '#999999'
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                   lineStyle: {
                        color: '#e6e6e6'
                    } 
                },
                data: xList
            },
            yAxis: {
                name: '百分比',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 40]
                },
                axisLabel: {
                    color: '#999999'
                },
                axisTick: {
                    show: false
                },
                min: 0,
                max: 100,
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                   lineStyle: {
                        color: '#e6e6e6'
                    } 
                },
            },
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [completeRateList, completeRateType]);
    //作业及格率图表
    useEffect(() => {
        if(passRateList.length == 0){
            return;
        }
        let xList = [], classDataList = [], gradeDataList = [], seriesList = [], myList = [];
        if(userIdentity == "manager" && !currentGrade && !currentClass){
           passRateList.forEach((item, index)=>{
                item.homeworkRateList &&
                item.homeworkRateList.forEach((child)=>{
                    xList.push(child.time && child.time.substr(5, 5));
                })
            })
            xList = [...new Set(xList)];
           passRateList.forEach((item, index)=>{
                let arr = [];
                xList.forEach((child)=>{
                    item.homeworkRateList &&
                    item.homeworkRateList.forEach((child2)=>{
                        if(child2.time.substr(5, 5) == child){
                            arr.push((parseFloat(child2.passRate)*100).toFixed(1));
                        }
                    })
                })
                seriesList.push({
                    type: 'bar',
                    name: item.gradeName,
                    itemStyle: {
                        color: colorList[index%6]
                    }, 
                    data: arr
                },)
            })
        } else if(userIdentity == "student"){
            passRateList.forEach((item)=>{
                xList.push(item.time && item.time.substr(5, 5));
                myList.push(parseFloat(item.passRate*100).toFixed(1));
            })
            classPassRateList.forEach((item)=>{
                classDataList.push(parseFloat(item.passRate*100).toFixed(1));
            })
            gradePassRateList.forEach((item)=>{
                gradeDataList.push(parseFloat(item.passRate*100).toFixed(1));
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
                    type: 'bar',
                    name: '班级',
                    barWidth: 16,
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
                    type: 'bar',
                    name: '年级',
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
                    data: gradeDataList
                },
            ]
        } else if(currentClass){
            passRateList.forEach((item)=>{
                xList.push(item.time && item.time.substr(5, 5));
                classDataList.push(parseFloat(item.passRate*100).toFixed(1));
            })
            gradePassRateList.forEach((item)=>{
                gradeDataList.push(parseFloat(item.passRate*100).toFixed(1));
            })
            seriesList = [
                
                {
                    type: 'bar',
                    name: '班级',
                    barWidth: 16,
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
                    type: 'bar',
                    name: '年级',
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
                    data: gradeDataList
                },
            ]
        } else {
            passRateList.forEach((item)=>{
                xList.push(item.time && item.time.substr(5, 5));
                myList.push(parseFloat(item.passRate*100).toFixed(1));
            })
            seriesList = [
                {
                    type: 'bar',
                    // name: '年级',
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
                    data: myList
                },
            ]
        }
        let myEchart = echarts.init(document.getElementById("pass-rate-echart"));
        myEchart.resize();
        let option = {
            legend: (
                userIdentity != "manager" || currentGrade || currentClass?
                {
                right: '10%',
                top: 5
                }:
                {
                    type: 'scroll',
                    width: '62%',
                    left: 'center',
                    top: 5
                }
            ),
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
            grid: {
                top: 40,
                bottom: xList.length > 6? 40: 20
            },
            dataZoom: {
                show:  xList.length > 6? true: false,
                maxValueSpan: 5,
                minValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 10
            },
            xAxis: {
                type: 'category',
                name:"日期",
                nameTextStyle: {
                    color: '#999999'
                },
                axisLabel: {
                    color: '#999999'
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                   lineStyle: {
                        color: '#e6e6e6'
                    } 
                },
                data: xList
            },
            yAxis: {
                name: '百分比',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 40]
                },
                axisLabel: {
                    color: '#999999'
                },
                axisTick: {
                    show: false
                },
                min: 0,
                max: 100,
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                   lineStyle: {
                        color: '#e6e6e6'
                    } 
                },
            },
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [passRateList, passRateType]);
    //各学科日常作业平均分
    useEffect(() => {
        //获取学科列表
        if(avgScoreList.length == 0){
            return;
        }
        let subjectList = [], classDataList = [], gradeDataList = [], seriesList = [], myList = [];
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            avgScoreList.forEach((item, index)=>{
                item.homeworkScore2List &&
                item.homeworkScore2List.forEach((child)=>{
                    subjectList.push(child.subject);
                })
            })
            subjectList = [...new Set(subjectList)];
           avgScoreList.forEach((item, index)=>{
                let arr = [];
                subjectList.forEach((child)=>{
                    item.homeworkScore2List &&
                    item.homeworkScore2List.forEach((child2)=>{
                        if(child2.subject == child){
                            arr.push(child2.score.toFixed(1));
                        }
                    })
                })
                seriesList.push({
                    type: 'bar',
                    name: item.gradeName,
                    itemStyle: {
                        color: colorList[index%6]
                    }, 
                    data: arr
                },)
            })
        } else if(userIdentity == "student"){
            avgScoreList.forEach((item)=>{
                subjectList.push(item.subjectName);
                myList.push(item.score.toFixed(1));
            })
            classAvgScoreList.forEach((item)=>{
                classDataList.push(item.score.toFixed(1));
            })
            gradeAvgScoreList.forEach((item)=>{
                gradeDataList.push(item.score.toFixed(1));
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
                    type: 'bar',
                    name: '班级',
                    barWidth: 16,
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
                    type: 'bar',
                    name: '年级',
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
                    data: gradeDataList
                },
            ]
        } else if(currentClass){
            avgScoreList.forEach((item)=>{
                subjectList.push(item.subjectName);
                myList.push(item.score.toFixed(1));
            })
            gradeAvgScoreList.forEach((item)=>{
                gradeDataList.push(item.score.toFixed(1));
            })
            seriesList = [
                {
                    type: 'bar',
                    name: '班级',
                    barWidth: 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1da4fe'
                        },{
                            offset: 1,
                            color: '#7ecbff'
                        }])
                    }, 
                    data: myList
                },
                {
                    type: 'bar',
                    name: '年级',
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
                    data: gradeDataList
                },
            ]
        } else {
            avgScoreList.forEach((item)=>{
                subjectList.push(item.subjectName);
                myList.push(item.score.toFixed(1));
            })
            seriesList = [
                {
                    type: 'bar',
                    // name: '年级',
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
                    data: myList
                },
            ]
        }
        
        let myEchart = echarts.init(document.getElementById("work-avg-echart"));
        myEchart.resize();
        let option = {
            legend: (
                userIdentity != "manager" || currentGrade || currentClass?
                {
                right: '10%',
                top: 5
                }:
                {
                    type: 'scroll',
                    width: '62%',
                    left: 'center',
                    top: 5
                }
            ),
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
            grid: {
                top: 40,
                bottom: subjectList.length > 5? 40: 20
            },
            dataZoom: {
                show: subjectList.length > 5? true: false,
                maxValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 10
            },
            xAxis: {
                type: 'category',
                name: '学科',
                nameTextStyle: {
                    color: '#999999'
                },
                axisLabel: {
                    interval: 0,
                    color: '#999999'
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                   lineStyle: {
                        color: '#e6e6e6'
                    } 
                },
                data: subjectList
            },
            yAxis: {
                name: '得分',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 40]
                },
                axisLabel: {
                    color: '#999999'
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                   lineStyle: {
                        color: '#e6e6e6'
                    } 
                },
            },
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [avgScoreList]);
    //学科日常分数
    useEffect(() => { 
        //获取学科列表
        if(detailScoreList.length == 0){
            return;
        }
        let xList = [], myList = [], classDataList = [], subjectList = [], gradeDataList = [], seriesList = [];
        if(userIdentity == "manager" && !currentGrade && !currentClass){
            detailScoreList.forEach((item, index)=>{
                item.everydayLessonScoreDataList &&
                item.everydayLessonScoreDataList.forEach((child)=>{
                    subjectList.push(child.subject);
                    xList.push(child.homeworkName);
                })
            })
            subjectList = [...new Set(subjectList)];
           detailScoreList.forEach((item, index)=>{
                let arr = [];
                xList.forEach((child)=>{
                    item.everydayLessonScoreDataList &&
                    item.everydayLessonScoreDataList.forEach((child2)=>{
                        if((currentSubject && child2.homeworkName == child && child2.subject == currentSubject) ||
                        (!currentSubject && child2.homeworkName == child && child2.subject == item.everydayLessonScoreDataList[0].subject)){
                            arr.push(child2.score.toFixed(1));
                        }
                    })
                })
                seriesList.push({
                    type: 'bar',
                    name: item.gradeName,
                    itemStyle: {
                        color: colorList[index%6]
                    }, 
                    data: arr
                },)
            })
            subjectList = [...new Set(subjectList)];
            setSubjectList(subjectList);
            !currentSubject && setCurrentSubject(subjectList[0]);
        } else if(userIdentity == "student"){
            detailScoreList.forEach((item)=>{
                if((currentSubject && item.subject == currentSubject) ||
                (!currentSubject && item.subject == detailScoreList[0].subject)){
                    xList.push(item.homeworkName);
                    myList.push(item.score);
                }
                subjectList.push(item.subject);
            })
            classDetailScoreList.forEach((item)=>{
                if((currentSubject && item.subject == currentSubject) ||
                (!currentSubject && item.subject == classDetailScoreList[0].subject)){
                    classDataList.push(item.score);
                }
            })
            gradeDetailScoreList.forEach((item)=>{
                if((currentSubject && item.subject == currentSubject) ||
                (!currentSubject && item.subject == gradeDetailScoreList[0].subject)){
                    gradeDataList.push(item.score);
                }
            })
            subjectList = [...new Set(subjectList)];
            setSubjectList(subjectList);
            !currentSubject && setCurrentSubject(subjectList[0]);
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
                    type: 'bar',
                    name: '班级',
                    barWidth: 16,
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
                    type: 'bar',
                    name: '年级',
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
                    data: gradeDataList
                },
            ]
        } else if(currentClass){
            detailScoreList.forEach((item)=>{
                if((currentSubject && item.subject == currentSubject) ||
                (!currentSubject && item.subject == detailScoreList[0].subject)){
                    xList.push(item.homeworkName);
                    myList.push(item.score);
                }
                subjectList.push(item.subject);
            })
            gradeDetailScoreList.forEach((item)=>{
                if((currentSubject && item.subject == currentSubject) ||
                (!currentSubject && item.subject == gradeDetailScoreList[0].subject)){
                    gradeDataList.push(item.score);
                }
            })
            subjectList = [...new Set(subjectList)];
            setSubjectList(subjectList);
            !currentSubject && setCurrentSubject(subjectList[0]);
            seriesList = [
                {
                    type: 'bar',
                    name: '班级',
                    barWidth: 16,
                    itemStyle: {
                        color: new graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1da4fe'
                        },{
                            offset: 1,
                            color: '#7ecbff'
                        }])
                    }, 
                    data: myList
                },
                {
                    type: 'bar',
                    name: '年级',
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
                    data: gradeDataList
                },
            ]
        } else {
            detailScoreList.forEach((item)=>{ 
                if((currentSubject && item.subject == currentSubject) ||
                (!currentSubject && item.subject == detailScoreList[0].subject)){
                    xList.push(item.homeworkName);
                    myList.push(item.score);
                }
                subjectList.push(item.subject);
            })
            subjectList = [...new Set(subjectList)];
            setSubjectList(subjectList);
            !currentSubject && setCurrentSubject(subjectList[0]);
            seriesList = [
                {
                    type: 'bar',
                    // name: '年级',
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
                    data: myList
                },
            ]
        }
        console.log(xList);
        let myEchart = echarts.init(document.getElementById("detail-grade-echart"));
        myEchart.resize();
        let option = {
            legend: (
                userIdentity != "manager" || currentGrade || currentClass?
                {
                right: '10%',
                top: 5
                }:
                {
                    type: 'scroll',
                    width: '62%',
                    left: 'center',
                    top: 5
                }
            ),
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
            grid: {
                top: 40,
                bottom: xList.length > 5? 40: 20
            },
            dataZoom: {
                show:  xList.length > 5? true: false,
                maxValueSpan: 5,
                height: 2,
                // start: 0,
                // end: 40,
                showDetail: false,
                moveHandSize: 6,
                bottom: 10
            },
            xAxis: {
                type: 'category',
                name: '作业',
                nameTextStyle: {
                    color: '#999999'
                },
                axisLabel: {
                    interval: 0,
                    color: '#999999',
                    formatter: function(value){
                        return value && value.length > 5? value.substr(0, 5) + "...": value
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                   lineStyle: {
                        color: '#e6e6e6'
                    } 
                },
                data: xList
            },
            yAxis: {
                name: '百分比',
                nameTextStyle: {
                    color: '#999999',
                    padding: [0, 0, 0, 40]
                },
                axisLabel: {
                    color: '#999999'
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                },
                splitLine: {
                   lineStyle: {
                        color: '#e6e6e6'
                    } 
                },
            },
            series: seriesList
        };
        myEchart.setOption(option, true);
        window.addEventListener("resize", function(){
            myEchart.resize();
        })
    }, [detailScoreList, currentSubject]);
    //每5个化为一页，进行轮播
    let updateAvgList = [];
    let arr = [];
    Array.isArray(avgScoreList) && avgScoreList.forEach((item, index)=>{
        arr.push(item);
        if(((index + 1) % 5 == 0) || index == avgScoreList.length - 1){
            updateAvgList.push(arr);
            arr = [];
        }
    })

    //学科每7个化为一页，进行轮播
    let updateSubjectList = [];
    let arr2 = [];
    Array.isArray(subjectList) && subjectList.forEach((item, index)=>{
        arr2.push(item);
        if(((index + 1) % 7 == 0) || index == subjectList.length - 1){
            updateSubjectList.push(arr2);
            arr2 = [];
        }
    })
    return (
        <div className="detail-work">
            <div className="detail-work-top">
                <div className="rate-echart-container">
                    <div className="complete-rate">
                    <Popover
                    placement="bottomLeft"
                    content={
                        <div className="circle-tootip">
                            {/* <p className="tooltip-title">活跃人数</p>
                            <ul className="tooltip-list">
                                <li>一年级平均活跃人数 <span>3人/课</span><i className="downlogo"></i></li>
                                <li>一年级平均活跃人数 <span>3人/课</span><i className="uplogo"></i></li>
                                <li>一年级平均活跃人数 <span>3人/课</span></li>
                                <li>一年级平均活跃人数 <span>3人/课</span></li>
                            </ul> */}
                        </div>
                    }>
                        <Progress 
                        type="circle" 
                        percent={
                            rankInfo.finishRate? 
                            parseInt(rankInfo.finishRate*100):
                            "--"
                        }
                        format={(percent)=> percent}
                        width={92}
                        showInfo
                        className="progress work-complete"
                        strokeColor="#8fdb66" />
                    </Popover>
                    <p>完成率</p>
                    </div>
                    <div className="pass-rate">
                    <Popover
                    placement="bottomLeft"
                    content={
                        <div className="circle-tootip">
                            {/* <p className="tooltip-title">活跃人数</p>
                            <ul className="tooltip-list">
                                <li>一年级平均活跃人数 <span>3人/课</span><i className="downlogo"></i></li>
                                <li>一年级平均活跃人数 <span>3人/课</span><i className="uplogo"></i></li>
                                <li>一年级平均活跃人数 <span>3人/课</span></li>
                                <li>一年级平均活跃人数 <span>3人/课</span></li>
                            </ul> */}
                        </div>
                    }>
                        <Progress 
                        type="circle" 
                        percent={
                            rankInfo.passRate? 
                                parseInt(rankInfo.passRate*100):
                            "--"
                        }
                        format={(percent)=> percent}
                        width={92}
                        className="progress work-pass"
                        strokeColor="#49aaea" />
                    </Popover>
                    <p>及格率</p>
                    </div>
                </div>
                <div className="slice-line"></div>
                {
                    avgScoreList.length > 0?
                    <Carousel
                    dots={{
                        className: 'award-dot'
                    }}>
                    {
                        updateAvgList.map((item, index)=>{
                            return (
                                <div className="subject-grade-list" key={index}>
                                {
                                    item.map((child, index1)=>{
                                        return (
                                            <div className="grade-list-one" key={index1}>
                                                <p className={"grade-num " + (
                                                child.score >= 90?
                                                    "orange":
                                                child.score >= 80 && child.score < 90?
                                                    "violet":
                                                child.score >= 75 && child.score < 80?
                                                    "blue":
                                                    child.score >= 70 && child.score < 75?
                                                    "green":
                                                    "red"
                                                )}>{typeof child.score == "number"? child.score: "--"}</p>
                                                <p>{child.subjectName}作业</p>
                                                <p>平均分</p>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            )
                        })
                    }
                    </Carousel>:
                    <Empty
                    className={"bar-empty"}
                    style={{margin: "20px 0"}}
                    title={"暂无数据"}
                    type={"4"}
                    ></Empty>
                }
                
            </div>
            <div className="work-echart-container">
                <div className="x-line"></div>
                <div className="y-line"></div>
                <div className="work-complete-rate">
                    <div className="echart-title">
                        <span>作业完成率</span>
                        <Select defaultValue="day" className="select" onChange={(value)=>setCompleteRateType(value)}>
                            <Option value="day">按天数</Option>
                            <Option value="week">按周次</Option>
                            <Option value="month">按月份</Option>
                        </Select>
                    </div>
                    <Loading
                    opacity={false}
                    tip="加载中..."
                    spinning={completeVisible}>
                    <div className="complete-rate-echart" id="complete-rate-echart"></div>
                    </Loading>
                </div>
                <div className="work-pass-rate">
                    <div className="echart-title">
                        <span>作业及格率</span>
                        <Select defaultValue="day" className="select" onChange={(value)=>{setPassRateType(value)}}>
                            <Option value="day">按天数</Option>
                            <Option value="week">按周次</Option>
                            <Option value="month">按月份</Option>
                        </Select>
                    </div>
                    <Loading
                    opacity={false}
                    tip="加载中..."
                    spinning={passVisible}>
                    <div className="pass-rate-echart" id="pass-rate-echart"></div>
                    </Loading> 
                </div>
                <div className="allsubject-work-avg">
                    <div className="echart-title">
                        <span>各学科日常作业平均分</span>
                        {/* <Select defaultValue="month" className="select">
                            <Option value="month">按学科</Option>
                        </Select> */}
                    </div>
                    <Loading
                    opacity={false}
                    tip="加载中..."
                    spinning={avgVisible}>
                    {
                        avgScoreList.length > 0?
                        <div className="work-avg-echart" id="work-avg-echart"></div>:
                        <Empty
                        className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                    </Loading>
                </div>
                <div className="subject-detail-grade">
                    {
                        subjectList.length > 0?
                        <div className="kind-list">
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
                                                            className={"list-one " + 
                                                            (currentSubject == child? "active": "")}
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
                                    })
                                }
                            </Carousel>
                        </div>:
                        ""
                    }
                    
                    <div className="echart-title">
                        <span>{currentSubject}日常作业分数</span>
                        {/* <Select defaultValue="month" className="select">
                            <Option value="month">按月份</Option>
                        </Select> */}
                    </div>
                    <Loading
                    opacity={false}
                    tip="加载中..."
                    spinning={subjectVisible}>
                    {
                        detailScoreList.length > 0?
                        <div className="detail-grade-echart" id="detail-grade-echart"></div>:
                        <Empty
                        className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                    </Loading>
                    
                    
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
export default connect(mapStateToProps)(memo(forwardRef(DetailWork)));
  