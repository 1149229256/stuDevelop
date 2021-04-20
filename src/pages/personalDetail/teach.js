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
import {Empty, Loading} from "../../component/common";
import Progress from "@/component/progress";
import "./index.scss";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
let { BasicProxy } = ipConfig;
/**
 * @description: 暂无数据表明是没有这个系统id或返回错误，加锁是没有权限看,前者权重大于后者
 * @param {*} props
 * @param {*} ref
 * @return {*}
 */
function StuHealth(props, ref) {
  let {
    className,
    userIdentity,
    data,
    currentTerm,
    currentClass,
    userInfo: {UserID, SchoolID},
    setLoadVisible
  } = props;
  const [gradeList, setGradeList] = useState([]);
  const [baseMsg, setBaseMsg] = useState({});
  const [sickRecord, setSickRecord] = useState({});
  const [healthyInfo, setHealthyInfo] = useState({});
  // const [loadVisible, setLoadVisible] = useState(true);
  useLayoutEffect(()=>{
    //获取排名信息
    ///api/status/student
    if(!UserID){
      return;
    }
    if(userIdentity == "teacher" && !currentClass.classId){
      return;
    }
    if(userIdentity == "student" && (!UserID || !currentClass.classId)){
      return;
    }
    setLoadVisible(true);
    let url = BasicProxy + "/api/healthy/leave/sickRecord?studentId=" + (
      userIdentity == "student"?
      UserID:
      ""
    ) +
    "&classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&startDate=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
    "&endDate=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>{
        return res.json();
    })
    .then((result)=>{
        if(result.status == 200 && result.data){
          setSickRecord(result.data);
        }
    })
    //
    url = BasicProxy + "/api/healthy/temperature/dallyHealthyInfo?studentId=" + (
      userIdentity == "student"?
      UserID:
      ""
    ) +
    "&classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&startDate=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
    "&endDate=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>{
        return res.json();
    })
    .then((result)=>{
        if(result.status == 200 && result.data){
          setHealthyInfo(result.data);  
        }
        setLoadVisible(false);
    })
    if(userIdentity != "student"){
      //获取目前平均身高体重信息
      let url = BasicProxy + "/api/healthy/overview?classId=" + currentClass.classId +
      "&gradeId=" + currentClass.gradeId +
      "&studentId=" + (
      userIdentity == "student"?
      UserID:
      "") +
      "&startDate=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
      "&endDate=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
            setBaseMsg(result.data);
          }
      })
   }
    
    if(userIdentity == "student"){
      //获取本人或班级身高体重信息
      let url = BasicProxy + "/api/healthy/studentHealthInfo?studentId=" + UserID;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
            setBaseMsg(result.data);
          }
      })
    }
  }, [currentClass, UserID]);
  return (
    <div className={`card-content card-health ${className ? className : ""}`}>
      {
        userIdentity == "student"?
        <div style={{paddingTop: 50}}>
          <p className="info-one">
            身高:<span>{
            userIdentity == "student"?
            baseMsg.height? baseMsg.height: "--":
            userIdentity == "teacher"?
            baseMsg.classAverageHeight:
            userIdentity == "manager"?
            baseMsg.gradeAverageHeight:
            "--"
            }</span>
          </p>
          <p className="info-one">
            体重:<span>{
            userIdentity == "student"?
            baseMsg.weight? baseMsg.weight: "--":
            userIdentity == "teacher"?
            baseMsg.classAverageWeight:
            userIdentity == "manager"?
            baseMsg.gradeAverageWeight:
            "--"
            }</span>
          </p>
          <p className="info-one">
            BMI:<span>{
            baseMsg.bmiIndex? baseMsg.bmiIndex: "--"
            }</span>
          </p>
          <p className="info-one">
            病假率:<span>{
            sickRecord.sickRate? sickRecord.sickRate.toFixed(1): "--"
            }</span>
          </p>
          <p className="info-one">
            病假次数:<span>{
            typeof sickRecord.sickRecordCount == "number"? sickRecord.sickRecordCount: "--"
            }</span>
          </p>
          <p className="info-one">
            最新体温信息:<span>{
            healthyInfo.latestAverageTemperature? healthyInfo.latestAverageTemperature: "--"
            }</span>
          </p>
        </div>:
        ""
      }
      
      {/* <div>
        <p className="info-one">
          日常运动频率:<span>15岁</span>
        </p>
        <p className="info-one">
          病假率:<span>15岁</span>
        </p>
      </div> */}
      {/* {
        userIdentity == "student"?
        <div className="slice-line"></div>:
        ""
      } */}
      {
        userIdentity != "student"?
        <div style={{marginTop: 50}}>
          <div className="circle-container">
            <div className=
            {"circle green"}>
                {typeof healthyInfo.abNormalCount == "number"? healthyInfo.abNormalCount: "--"}</div>
            <p>体温异常次数</p>
          </div>
          <div className="circle-container">
            <div className=
            {"circle blue"}>
                {healthyInfo.abNormalRate? healthyInfo.abNormalRate.toFixed(1): "--"}</div>
            <p>异常体温率</p>
          </div>
          <div className="circle-container">
            <div className=
            {"circle violet"}>
                {typeof sickRecord.sickRecordCount == "number"? sickRecord.sickRecordCount: "--"}</div>
            <p>病假次数</p>
          </div>
          <div className="circle-container">
            <div className=
            {"circle brown"}>
                {sickRecord.sickRate? parseInt(sickRecord.sickRate*100): "--"}</div>
            <p>病假率</p>
          </div>
        </div>
          :
        ""
      }
      <div style={{marginBottom: 40}}>
        {/* <p className="grade-one">
          体质分数:<span>78分</span>
        </p>
        <p className="grade-one">
          体质排名:<span>2311/2333</span>
        </p> */}
        {/* {
          gradeList.length > 0?
          gradeList.map((item, index)=>{
            return (
              <div className="progress-container" key={index}>
                <span className="grade-name">{item.testProject.subjectName}</span>
                <Progress
                  className="grade-progress"
                  percent={
                    userIdentity == "student"?
                    item.studentAverageScore:
                    userIdentity == "teacher"?
                    item.classAverageScore:
                    userIdentity == "manager"?
                    item.gradeAverageScore:
                    0
                  } 
                  step={25}
                  width={114}
                  max={item.maxScore} />
                <span className="grade-num"><span>{
                userIdentity == "student"?
                item.studentAverageScore:
                userIdentity == "teacher"?
                item.classAverageScore:
                userIdentity == "manager"?
                item.gradeAverageScore:
                0}</span>分</span>
              </div>
            )
          }):
          <Empty
            title={"暂无数据"}
            className="pc-empty"
            type={"3"}
          ></Empty>
        } */}
        {/* <div className="progress-container">
          
          <span className="grade-name">体重指数</span>
          <Progress
            className="grade-progress"
            percent={45} 
            step={25}
            width={114}
            max={100} />
          <span className="grade-num"><span>10</span>分</span>
        </div> */}
      </div>
      {/* <div>
        <p className="grade-one">
          中考体育成绩:<span>78分</span>
        </p>
        <p className="grade-one">
          成绩排名:<span>2311/2333</span>
        </p>
        <div className="progress-container">
          <span className="grade-name">体重指数</span>
          <Progress
            className="grade-progress"
            percent={45} 
            step={25}
            width={114}
            max={100} />
          <span className="grade-num"><span>10</span>分</span>
        </div>
        <div className="progress-container">
          <span className="grade-name">体重指数</span>
          <Progress
            className="grade-progress"
            percent={45} 
            step={25}
            width={114}
            max={100} />
          <span className="grade-num"><span>10</span>分</span>
        </div>
      </div> */}
    </div>
  );
}
const mapStateToProps = (state) => {
  let { commonData } = state;
  return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(StuHealth)));
