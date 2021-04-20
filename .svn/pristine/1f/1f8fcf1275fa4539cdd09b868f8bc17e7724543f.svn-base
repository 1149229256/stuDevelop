import {
  connect
} from "react-redux";
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
import "./index.scss";
import {Progress} from "antd";
import { Dropdown } from "@/component/common";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
import { setRole } from "../../util/public";
import {Empty, Loading} from "../../component/common";
let { BasicProxy } = ipConfig;
/**
 * @description: 暂无数据表明是没有这个系统id或返回错误，加锁是没有权限看,前者权重大于后者
 * @param {*} props
 * @param {*} ref
 * @return {*}
 */
function Work(props, ref) {
  let {
    className,
    userIdentity,
    data,
    currentTerm,
    currentClass,
    userInfo: {UserID, SchoolID},
    setLoadVisible
  } = props;
  const [countInfo, setCountInfo] = useState({});
  const [rateInfo, setRateInfo] = useState({});
  // const [loadVisible, setLoadVisible] = useState(true);
  useLayoutEffect(()=>{
    if(userIdentity != "manager" && !currentClass.classId){
      return;
    }
    if(!currentTerm.termStartDate || !currentTerm.termEndDate){
      return;
    }
    setLoadVisible(true);
    //获取缺勤率
    let url = BasicProxy + "/api/attendance/attendance/times?type=" + 
    (
      userIdentity == "student"? 1:
      userIdentity == "teacher"? 2:
      4
    ) +
    "&studentId=" + UserID +
    "&classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&schoolId=" + SchoolID +
    "&statisticalType=1" +
    // "&termId=" + currentTermInfo.termId +
    "&start=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
    "&end=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
            setRateInfo(result.data);
        }
        setLoadVisible(false);
    })
  }, [currentClass, currentTerm, UserID]);
  return (
    <div className={`card-content card-attendance ${className ? className : ""}`}>
      {
        !rateInfo.avgAbsentRate && typeof countInfo.vacateTimes != "number"? 
        <Empty
          title={"暂无数据"}
          className="pc-empty"
          type={"3"}
        ></Empty>:
        <div>
        <div className="card-attendance-left">
        <div className="out-circle">
          <Progress
            type="circle"
            strokeWidth="8"
            strokeColor={{
              '0%': '#0A8EF6',
              '50%': '#00FFF6',
              '100%': '#0A8EF6',
            }}
            trailColor="#08474F"
            percent={parseInt(Number(rateInfo.avgAttendanceRateResult.replace("%", "")))}
            width={97}
            format={(percent)=>{return percent}}
            className="progress"
          />
          <p>{userIdentity == "manager"? "全校": ""}出勤率</p>
        </div>
      </div>
      <div className="slice-line"></div>
      <div className="card-attendance-right">
        <div className="askleave-info">
          <p className="count"><span>{typeof rateInfo.vacateTimes == "number"? rateInfo.vacateTimes: "--"}</span>次</p>
          <p>请假次数</p>
        </div>
        <div className="late-info">
          <p className="count"><span>{typeof rateInfo.lateTimes == "number"? rateInfo.lateTimes: "--"}</span>次</p>
          <p>迟到次数</p>
        </div>
        <div className="badback-info">
          <p className="count"><span>{typeof rateInfo.leaveEarlyTimes == "number"? rateInfo.leaveEarlyTimes: "--"}</span>次</p>
          <p>早退次数</p>
        </div>
      </div>
      {/* <p className="card-attendance-tip">
          <i className="tiplogo"></i>
          统计数据为最近50天
      </p> */}
        </div>
      }
    </div>
  );
}
const mapStateToProps = (state) => {
  let { commonData } = state;
  return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(Work)));
