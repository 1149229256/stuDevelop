import React, {
  useCallback,
  memo,
  useEffect,
  useState,
  // useImperativeHandle,
  // useMemo,
  // useReducer,
  // createContext,
  // useContext,
  useRef,
  forwardRef,
  useLayoutEffect,
} from "react";
import {connect} from "react-redux";
import "./index.scss";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
import Scrollbars from "react-custom-scrollbars";
let { BasicProxy } = ipConfig;
/**
 * @description: 暂无数据表明是没有这个系统id或返回错误，加锁是没有权限看,前者权重大于后者
 * @param {*} props
 * @param {*} ref
 * @return {*}
 */
function GradeRank(props, ref) {
  let {
    className,
    userIdentity,
    data,
    currentTerm,
    currentClass,
    userInfo: {UserID, SchoolID},
    setLoadVisible
  } = props;
  const [rankInfo, setRankInfo] = useState({});
  const [subjectList, setSubjectList] = useState([]);
  useLayoutEffect(()=>{
    //获取排名信息
    ///api/status/student
    if(!UserID || !currentTerm.term){
      return;
    }
    setLoadVisible(true);
    let url = BasicProxy + "/api/learning2/exam/scoreRank?type=2" +
    "&studentId=&classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&schoolId=" + SchoolID +
    "&termId=" + currentTerm.term +
    "&examType=2" +
    "&start=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
    "&end=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>{
        return res.json();
    })
    .then((result)=>{
        if(result.status == 200 && result.data){
          setRankInfo(result.data);
        }
    })
    //
    url = BasicProxy + "/api/learning2/homework/avgScore?type=2" +
    "&studentId=&classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&schoolId=" + SchoolID +
    "&termId=" + currentTerm.term +
    "&examType=2" +
    "&start=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
    "&end=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>{
        return res.json();
    })
    .then((result)=>{
        if(result.status == 200 && result.data){
          setSubjectList(result.data);
        }
        setLoadVisible(false);
    })
  }, [currentClass, UserID, currentTerm]);
  return (
    <div className={`card-content card-grade ${className ? className : ""}`}>
        <div className="card-grade-left">
          <p className="card-grade-title">最近一次考试情况:</p>
          <div className="circle-container">
            <div className="circle green">
              {
              typeof rankInfo.score == "number"? 
              rankInfo.score.toFixed(1): "--"
              }
            </div>
            <p>我的成绩</p>
          </div>
          <div className="circle-container">
            <div className="circle blue"> 
              {
              typeof rankInfo.classRank == "number"? 
              rankInfo.classRank: "--"
              }
            </div>
            <p>班级排名</p>
          </div>
        </div>
        <div className="slice-line"></div>
        <div className="card-grade-right">
          <p className="card-grade-title">成绩总评:</p>
          <ul className="subject-grade-list">
            <Scrollbars
            autoHeight
            autoHeightMax={140}>
            {
              subjectList.map((item, index)=>{
                return (
                  <li key={index}>{item.subjectName}: <span>{item.score}</span></li>
                )
              })
            }
            </Scrollbars>
            
          </ul>
        </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  let { commonData } = state;
  return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(GradeRank)));
