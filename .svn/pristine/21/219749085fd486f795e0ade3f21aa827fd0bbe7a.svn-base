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
import { Progress } from "antd";
import { Empty, Loading } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
function ConditionRank(props, ref) {
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
    const [visible, setVisible] = useState(true);
    useLayoutEffect(() => {
        if(userIdentity == "student"){
            return;
        }
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
    return (
        <div className="condition-rank">
            <Loading
            opacity={false}
            tip="加载中..."
            spinning={visible}>
            {
                courseShowInfo.length == 0 &&
                detailWorkInfo.length == 0 &&
                personalStudyInfo.length == 0 &&
                testGradeInfo.length == 0?
                <Empty
                // className={"bar-empty"}
                style={{margin: "20px 0"}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>:
                <div>
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
                                        <img src={item.photo}/>
                                        <span className="rank-name" title={item.name}>{item.name}</span>
                                        <span className={"rank-grade " + 
                                        (index == 0? "one":
                                        index == 1? "two": 
                                        index == 2? "three":
                                        "")} title={typeof item.score == "number"? parseInt(item.score) + "分": "--"}>
                                            {typeof item.score == "number"? parseInt(item.score): "--"}分
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
                                            <img src={item.photo}/>
                                            <span className="rank-name" title={item.name}>{item.name}</span>
                                            <span className={"rank-grade " + 
                                            (index == 0? "one":
                                            index == 1? "two": 
                                            index == 2? "three":
                                            "")} title={typeof item.score == "number"? parseInt(item.score) + "分": "--"}>
                                                {typeof item.score == "number"? parseInt(item.score): "--"}分
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
                                            <img src={item.photo}/>
                                            <span className="rank-name" title={item.name}>{item.name}</span>
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
                    <div className="slice-line"></div>
                    <div className="test-grade-rank">
                        <i className="test-grade-logo"></i>
                        <ul className="rank-list">
                            {
                                testGradeInfo.length > 0?
                                testGradeInfo.map((item, index)=>{
                                    return (
                                        <li key={index}>
                                            <i className={"ranklogo " + 
                                            (index == 0? "one":
                                            index == 1? "two":  
                                            index == 2? "three":
                                            "")}></i>
                                            <img src={item.photo}/>
                                            <span className="rank-name" title={item.name}>{item.name}</span>
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
                    <p className="tip">
                        <i className="tiplogo"></i>
                        课堂表现为本本学期课堂表现总分排行；日常作业为最近一次作业成绩排行；
                        课外自学为本学期累计时长排行；考试成绩为本学期最近一次考试成绩排行
                    </p>
                </div>
            } 
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
export default connect(mapStateToProps)(memo(forwardRef(ConditionRank)));
  