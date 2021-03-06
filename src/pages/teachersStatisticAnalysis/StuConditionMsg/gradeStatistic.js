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
import Scrollbars from "react-custom-scrollbars";
import { Empty } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
function GradeStatistic(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
    } = props;
    // 初始请求
    const [gradeInfo, setGradeInfo] = useState({});
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
        //查身份对应数据
        let url = BasicProxy + "/api/learning2/overall/score?type=" +
        (userIdentity == "manager"? 
        currentClass?
        2:
        currentGrade?
        3:
        4:
        userIdentity == "teacher"? 2:
        1) +
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
                setGradeInfo(result.data);
            }
        })
        //查班级平均数据用于学生显示
        url = BasicProxy + "/api/learning2/overall/score?type=2" +
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
                setGradeInfo(result.data);
            }
        })
        //查年级平均数据用于学生和老师显示
        url = BasicProxy + "/api/learning2/overall/score?type=3" +
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
                setGradeInfo(result.data);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);

    useLayoutEffect(() => {
        if(userIdentity != "manager" || currentClass || currentGrade){
            return;
        }
        let currentTermInfo = currentTerm.value && JSON.parse(currentTerm.value);
        let url = BasicProxy + "/api/learning2/overall/score/batch?type=3" +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                //领导端需要额外处理一下数据类型
                let subjectList = [];
                result.data.forEach((item)=>{
                    Array.isArray(item.overallScore2) &&
                    item.overallScore2.overallSubjectList.forEach((child)=>{
                        subjectList.push(child.subject);
                    })
                })
                subjectList = [...new Set(subjectList)];
                let dataList = [];
                subjectList.forEach((item)=>{
                    let arr = [];
                    result.data.forEach((child)=>{
                        Array.isArray(child.overallScore2) &&
                        child.overallScore2.overallSubjectList.forEach((child2)=>{
                            if(child2.subject == item){
                                let obj = {
                                    grade: child.gradeName,
                                    score: child2.score
                                }
                                arr.push(obj);
                            }
                        })
                    })
                    dataList.push({
                        subject: item,
                        gradeList: arr
                    })
                })
                setGradeInfo(dataList);
            }
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm]);
    return (
        <div className="grade-statistic">
            {
                userIdentity == "student"?
                <p className="course-count">
                    共选修
                    <span>{
                    typeof gradeInfo.courseCount == "number"? 
                    gradeInfo.courseCount: 
                    "--"}</span>
                    门课程，平均分
                    <span>{
                    typeof gradeInfo.avgScore == "number"? 
                    gradeInfo.avgScore.toFixed(1):
                    "--"}</span>
                    分
                </p>:
                <p className="course-count">
                共有
                <span>{
                userIdentity == "manager" && !currentClass && !currentGrade?
                gradeInfo.length:
                Array.isArray(gradeInfo.overallSubjectList)? 
                gradeInfo.overallSubjectList.length:
                "--"}</span>
                门课程
            </p>
            }
            
            <Scrollbars
            autoHeight
            autoHeightMax={450}>
                {
                userIdentity == 'manager' && !currentGrade && !currentClass?
                <div>
                    {
                        Array.isArray(gradeInfo) && gradeInfo.length > 0?
                        gradeInfo.forEach((item, index)=>{
                            let arr = ["A", "B", "C", "D"]
                            return (
                                <div className={"course-grade-one " + (arr[parseInt(Math.random()*4)])} key={index}>
                                <p className="course-name">{item.subject}</p>
                                <div className="course-grade-statistic leader-statistic">
                                    {
                                        item.gradeList.map((child, index1)=>{
                                            return (
                                                <p className="grade-avg-one" key={index1}>
                                                    <span>
                                                    {child.grade}均分: 
                                                    <span>
                                                        {typeof child.score == "number"? child.score.toFixed(1): "--"}
                                                        分
                                                    </span>
                                                    </span>
                                                </p>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            )
                        }):
                        <Empty
                        // className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                </div>:
                userIdentity == 'teacher'?
                <div>
                    {
                        Array.isArray(gradeInfo.overallSubjectList) &&
                        gradeInfo.overallSubjectList.length > 0?
                        gradeInfo.overallSubjectList.map((item, index)=>{
                            return (
                                <div 
                                className={"course-grade-one " + (
                                    item.classAvgScore >= 90?
                                    "A":
                                    item.classAvgScore >= 80 && item.classAvgScore < 90?
                                    "B":
                                    item.classAvgScore >= 70 && item.classAvgScore < 80?
                                    "C":
                                    "D"
                                )} 
                                key={index}>
                                    <p className="course-name"><span>{item.subject}</span></p>
                                    <div className="course-grade-statistic">
                                        <div className="grade-sum">
                                            <p 
                                            className="grade-num"
                                            title={
                                                typeof item.classAvgScore == "number"? 
                                                item.classAvgScore.toFixed(1): "--"}
                                            ><span>{typeof item.classAvgScore == "number"? 
                                            item.classAvgScore.toFixed(1): "--"}</span></p>
                                            <p><span>班级平均分</span></p>
                                        </div>
                                        <div className="grade-avg" style={{paddingTop: 32}}>
                                            <p>
                                                <span>
                                                年级均分: 
                                                <span 
                                                className="compare-score"
                                                title={
                                                    typeof item.gradeAvgScore == "number"? 
                                                    item.gradeAvgScore.toFixed(1):
                                                    "--"
                                                }>
                                                    {typeof item.gradeAvgScore == "number"? 
                                                    item.gradeAvgScore.toFixed(1):
                                                    "--"}分
                                                </span>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }):
                        <Empty
                        // className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                </div>:
                <div>
                    {
                        Array.isArray(gradeInfo.overallSubjectList) &&
                        gradeInfo.overallSubjectList.length > 0?
                        gradeInfo.overallSubjectList.map((item, index)=>{
                            return (
                                <div 
                                className={"course-grade-one " + (
                                    userIdentity == "student"?
                                    item.score >= 90?
                                    "A":
                                    item.score >= 80 && item.score < 90?
                                    "B":
                                    item.score >= 70 && item.score < 80?
                                    "C":
                                    "D":
                                    currentClass?
                                    item.classAvgScore >= 90?
                                    "A":
                                    item.classAvgScore >= 80 && item.classAvgScore < 90?
                                    "B":
                                    item.classAvgScore >= 70 && item.classAvgScore < 80?
                                    "C":
                                    "D":
                                    currentGrade?
                                    item.gradeAvgScore >= 90?
                                    "A":
                                    item.gradeAvgScore >= 80 && item.gradeAvgScore < 90?
                                    "B":
                                    item.gradeAvgScore >= 70 && item.gradeAvgScore < 80?
                                    "C":
                                    "D":
                                    item.schoolAvgScore >= 90?
                                    "A":
                                    item.schoolAvgScore >= 80 && item.schoolAvgScore < 90?
                                    "B":
                                    item.schoolAvgScore >= 70 && item.schoolAvgScore < 80?
                                    "C":
                                    "D"
                                )} 
                                key={index}>
                                    <p className="course-name"><span>{item.subject}</span></p>
                                    <div className="course-grade-statistic">
                                        <div className="grade-sum">
                                            <p className="grade-num">
                                                <span>
                                                {
                                                    userIdentity == "student"?
                                                    item.score ? item.score.toFixed(1) : "--":
                                                    userIdentity == "teacher"?
                                                    item.classAvgScore ? item.classAvgScore.toFixed(1) : "--":
                                                    currentClass?
                                                    item.classAvgScore ? item.classAvgScore.toFixed(1) : "--":
                                                    currentGrade?
                                                    item.gradeAvgScore ? item.gradeAvgScore.toFixed(1) : "--":
                                                    item.schoolAvgScore ? item.schoolAvgScore.toFixed(1) : "--"
                                                }
                                                </span>
                                                </p>
                                            <p>总评分</p>
                                        </div>
                                        <div className="grade-avg">
                                            <p>班级均分: 
                                                <span>
                                                {
                                                typeof item.classAvgScore == "number"?
                                                item.classAvgScore.toFixed(1): "--"}分
                                                </span>
                                            </p>
                                            <p>年级均分: 
                                                <span>
                                                {
                                                typeof item.classAvgScore == "number"?
                                                item.gradeAvgScore.toFixed(1): "--"}分
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }):
                        <Empty
                        // className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                </div>
            }
            </Scrollbars>
            
            {
                userIdentity == 'student'?
                <div className="teacher-remark">
                    <span className="remark-name">班主任评语:</span>
                    <span className="remark-content">
                        {gradeInfo.comment? gradeInfo.comment: "暂无评语~"}
                    </span>
                </div>:
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
export default connect(mapStateToProps)(memo(forwardRef(GradeStatistic)));
  