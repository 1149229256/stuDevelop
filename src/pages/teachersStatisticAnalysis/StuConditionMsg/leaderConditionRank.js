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
import {Empty, Loading} from "../../../component/common";
import "./index.scss";
import { Progress } from "antd";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
function LeaderConditionRank(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID},
        reflash
      } = props;
    // 初始请求
    const [rankInfo, setRankInfo] = useState({});
    const [schoolStatisticInfo, setSchoolStatisticInfo] = useState({});
    const [schoolWorkRate, setSchoolWorkRate] = useState({});
    const [visible, setVisible] = useState(true);
    //获取排行数据
    useLayoutEffect(() => {
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        setVisible(true);
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let url = BasicProxy + "/api/learning2/rank?type=" +
        (userIdentity == "manager"? 
        currentClass?
        2:
        currentGrade?
        3:
        4:
        userIdentity == "teacher"? 2:
        "") +
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
                setRankInfo(result.data);
            }
            setVisible(false);
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    //获取全校统计数据
    useLayoutEffect(() => {
        if(!SchoolID || !currentTerm.value){
            return;
        }
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
        let url = BasicProxy + "/api/learning2/school/sum?schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setSchoolStatisticInfo(result.data);
            }
        })

        //获取全校作业完成率
        url = BasicProxy + "/api/learning2/homework/rate?type=4&studentId=&classId=&gradeId=" +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setSchoolWorkRate(result.data);
            }
        })
    }, [userIdentity, SchoolID, currentTerm, reflash])
    let courseShowInfo = [], detailWorkInfo = [], personalStudyInfo = [], testGradeInfo = [];
    Array.isArray(rankInfo) && rankInfo.forEach((item)=>{
        if(item.rankType.indexOf("课堂") != -1){
            courseShowInfo = item.learningRankListList.slice(0, 5);
        }
        if(item.rankType.indexOf("日常") != -1){
            detailWorkInfo = item.learningRankListList.slice(0, 5);
        }
        if(item.rankType.indexOf("自学") != -1){
            personalStudyInfo = item.learningRankListList.slice(0, 5);
        }
        if(item.rankType.indexOf("考试") != -1){
            testGradeInfo = item.learningRankListList.slice(0, 5);
        }
    })
    let courseShowScore = "--", personalStudyTime = "--";
    Array.isArray(schoolStatisticInfo) && schoolStatisticInfo.forEach((item)=>{
        if(item.type.indexOf("课堂") != -1 && typeof item.socre == "number"){
            courseShowScore = item.socre.toFixed(1);
        }
        // if(item.type.indexOf("作业") != -1 && typeof item.socre == "number"){
        //     detailWorkRate = item.score;
        // }
        if(item.type.indexOf("自学") != -1 && item.times){
            personalStudyTime = item.times;
        }
    })
    return (
        <div className="leader-condition-rank">
            <Loading
            opacity={false}
            tip="加载中..."
            spinning={visible}>
                <div className="condition-rank-top">
                <div className="circle-container">
                    <div className="circle-violet" title={ courseShowScore }>
                        { courseShowScore }
                    </div>
                    <p>全校班级课堂平均分</p>
                </div>
                <div className="circle-container">
                    <div className="circle-orange" title={ 
                            schoolWorkRate.finishRate?
                            Number(schoolWorkRate.finishRate*100).toFixed(1) + "%":
                            ""
                        }>
                        { 
                            schoolWorkRate.finishRate?
                            Number(schoolWorkRate.finishRate*100).toFixed(1) + "%":
                            ""
                        }
                    </div>
                    <p>全校日常作业完成率</p>
                </div>
                <div className="circle-container">
                    <div className="circle-red" title={ personalStudyTime }>
                        { personalStudyTime }
                    </div>
                    <p>全校班级平均自学时长</p>
                </div>
            </div>
            <div className="condition-rank-bottom">
                <div className="course-show-rank">
                    <i className="course-show-logo"></i>
                    <ul className="rank-list">
                    {
                        courseShowInfo.length > 0?
                        courseShowInfo.map((item, index)=>{
                            return (
                                <li key={index}>
                                    <i className={"ranklogo " + 
                                    (index == 0? "one":
                                    index == 1? "two": 
                                    index == 2? "three":
                                    "")}></i>
                                    {
                                        item.name?
                                        <img src={item.photo}/>:
                                        ""
                                    }
                                    <span 
                                    className="rank-name" 
                                    title={item.name || item.className}>
                                        {item.name || item.className}
                                    </span>
                                    <span className={"rank-grade " + 
                                    (index == 0? "one":
                                    index == 1? "two": 
                                    index == 2? "three":
                                    "")} title={typeof item.score == "number"? item.score + "h": "--"}>
                                        {typeof item.score == "number"? item.score: "--"}分
                                    </span>
                                </li>
                            )
                        }):
                        <Empty
                        // className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                    </ul>   
                </div>
                <div className="slice-line"></div>
                <div className="detail-work-rank">
                    <i className="detail-work-logo"></i>
                    <ul className="rank-list">
                    {
                        detailWorkInfo.length > 0?
                        detailWorkInfo.map((item, index)=>{
                            return (
                                <li key={index}>
                                    <i className={"ranklogo " + 
                                    (index == 0? "one":
                                    index == 1? "two": 
                                    index == 2? "three":
                                    "")}></i>
                                    {
                                        item.name?
                                        <img src={item.photo}/>:
                                        ""
                                    }
                                    <span 
                                    className="rank-name" 
                                    title={item.name || item.className}>
                                        {item.name || item.className}
                                    </span>
                                    <span className={"rank-grade " + 
                                    (index == 0? "one":
                                    index == 1? "two": 
                                    index == 2? "three":
                                    "")} title={typeof item.score == "number"? item.score + "分": "--"}>
                                        {typeof item.score == "number"? item.score: "--"}分
                                    </span>
                                </li>
                            )
                        }):
                        <Empty
                        // className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                    </ul>   
                </div>
                <div className="slice-line"></div>
                <div className="person-study-rank">
                    <i className="person-study-logo"></i>
                    <ul className="rank-list">
                    {
                        personalStudyInfo.length > 0?
                        personalStudyInfo.map((item, index)=>{
                            return (
                                <li key={index}>
                                    <i className={"ranklogo " + 
                                    (index == 0? "one":
                                    index == 1? "two": 
                                    index == 2? "three":
                                    "")}></i>
                                    {
                                        item.name?
                                        <img src={item.photo}/>:
                                        ""
                                    }
                                    <span 
                                    className="rank-name" 
                                    title={item.name || item.className}>
                                        {item.name || item.className}
                                    </span>
                                    <span className={"rank-grade " + 
                                    (index == 0? "one":
                                    index == 1? "two": 
                                    index == 2? "three":
                                    "")} title={typeof item.score == "number"? item.score + "h": "--"}>
                                        {typeof item.score == "number"? item.score: "--"}h
                                    </span>
                                </li>
                            )
                        }):
                        <Empty
                        // className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                    </ul>   
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
export default connect(mapStateToProps)(memo(forwardRef(LeaderConditionRank)));
  