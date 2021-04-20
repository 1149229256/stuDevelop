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
import {Carousel} from "antd";
import {Empty, Loading} from "../../component/common";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
import { setRole } from "../../util/public";

let { BasicProxy } = ipConfig;
/**
 * @description: 暂无数据表明是没有这个系统id或返回错误，加锁是没有权限看,前者权重大于后者
 * @param {*} props
 * @param {*} ref
 * @return {*}
 */
function Information(props, ref) {
  let {
    className,
    userIdentity,
    data,
    currentTerm,
    currentClass,
    userInfo: {UserID},
    setLoadVisible
  } = props;
  const [awardList, setAwardList] = useState([]);
  const [punishList, setPunishList] = useState([]);
  const awardLevelList = {
    "1": '一等奖',
    "2": '二等奖',
    "3": '三等奖',
    "-1": '其他'
  };
  const awardKind = {
    "1": '校级',
    "2": '区级',
    "3": '市级',
    "4": '省级',
    "5": '国家级',
    "-1": '其他'
  };
  useLayoutEffect(()=>{
    if(!currentTerm || !UserID){
      return;
    }
    if(userIdentity == "teacher"){
      //先获取当前班级信息
        // let url = BasicProxy + "/api/punishAndReward/rewards/list?studentId=" + 
        // "&classId=" + currentClass +
        // "&gradeId=" + currentGrade +
        // "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
        // "&endDate=" + currentTermInfo.endDate.substr(0, 10);
    }
    if(userIdentity == "teacher" && !currentClass.classId){
      return;
    }
    if(userIdentity == "manager"){
      return;
    }
    setLoadVisible(true);
      //获取奖励信息
      let url = "";
      if(userIdentity == "student"){
        url = BasicProxy + "/api/punishAndReward/rewards/list?studentId=" + UserID +
        "&startDate=" + (currentTerm.termStartDate? currentTerm.termStartDate: "") + 
        "&endDate=" + (currentTerm.termEndDate? currentTerm.termEndDate: "");
      } else {
        url = BasicProxy + "/api/punishAndReward/rewards/list?studentId=" + 
        "&classId=" + currentClass.classId +
        "&gradeId=" + currentClass.gradeId +
        "&startDate=" + (currentTerm.termStartDate? currentTerm.termStartDate: "") + 
        "&endDate=" + (currentTerm.termEndDate? currentTerm.termEndDate: "");
      }
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>{
          return res.json();
      })
      .then((result)=>{
          if(result.status == 200 && Array.isArray(result.data)){
              setAwardList(result.data);
          } else {
              setAwardList(false);
          }
          setLoadVisible(false);
      })
      //获取处罚信息
      url = BasicProxy + "/api/punishAndReward/punishment/list?studentId=" + (
        userIdentity == "student"?
        UserID:
        ""
      ) +
      "&classId=" + currentClass.classId +
      "&gradeId=" + currentClass.gradeId +
      "&startDate=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
      "&endDate=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
      // }
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>{
          return res.json();
      })
      .then((result)=>{
          if(result.status == 200 && Array.isArray(result.data)){
              setPunishList(result.data);
              
          }
          setLoadVisible(false);
      })
  }, [userIdentity, currentTerm]);
  //领导端调用接口
  useLayoutEffect(()=>{
    if(!currentTerm){
      return;
    }
    if(userIdentity != "manager"){
      return;
    }
    setLoadVisible(true);
    //获取奖励信息
    let url = BasicProxy + "/api/punishAndReward/rewards/leader/list?classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&startDate=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
    "&endDate=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");    
    fetch
      .get({url, securityLevel: 2})
      .then((res)=>{
          return res.json();
      })
      .then((result)=>{
          if(result.status == 200 && Array.isArray(result.data)){
              setAwardList(result.data);
          } else {
              setAwardList(false);
          }
      })
      //获取处罚信息
      url = BasicProxy + "/api/punishAndReward/punishment/leader/list?classId=" + currentClass.classId +
      "&gradeId=" + currentClass.gradeId +
      "&startDate=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
      "&endDate=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
      // }
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>{
          return res.json();
      })
      .then((result)=>{
          if(result.status == 200 && Array.isArray(result.data)){
              setPunishList(result.data);
             
          }
          setLoadVisible(false);
      })
  }, [userIdentity, currentTerm]);
  //奖项每5个化为一页，进行轮播
  let updateAwardList = [];
  let arr = [];
  Array.isArray(awardList) && awardList.forEach((item, index)=>{
    arr.push(item);
    if(((index + 1) % 5 == 0) || index == awardList.length - 1){
        updateAwardList.push(arr);
        arr = [];
    }
  })

  //计算获奖各个类型数量
  let awardKindList = [];
  Array.isArray(awardList) && awardList.forEach((item)=>{
    awardKindList.push(awardKind[(item.awardLevel? item.awardLevel: -1)]);
  })
  awardKindList = [...new Set(awardKindList)];
  let updateAwardKindList = [];
  awardKindList.forEach((item)=>{
    let sum = 0;
    awardList.forEach((child)=>{
      if(awardKind[(item.awardLevel? item.awardLevel: -1)] == item){
        sum++;
      }
    })
    let obj = {
      key: item,
      num: sum
    }
    updateAwardKindList.push(obj);
  })
  //计算处罚各个类型数量
  let punishKindList = [];
  Array.isArray(punishList) && punishList.forEach((item)=>{
    punishKindList.push(awardKind[(item.punishmentLevel? item.punishmentLevel: -1)]);
  })
  punishKindList = [...new Set(punishKindList)];
  let updatePunishKindList = [];
  punishKindList.forEach((item)=>{
    let sum = 0;
    punishList.forEach((child)=>{
      if(awardKind[(child.punishmentLevel? child.punishmentLevel: -1)] == item){
        sum++;
      }
    })
    let obj = {
      key: item,
      num: sum
    }
    updatePunishKindList.push(obj);
  })
  return (
    <div
      className={`card-content card-award-punish ${className ? className : ""}`}
      // style={{paddingTop: (loadVisible? 200: "")}}
    >
      {
        awardList.length == 0 && punishList == 0?
        <Empty
          title={"暂无数据"}
          className="pc-empty"
          type={"3"}
        ></Empty>:
        <div>
           <Carousel
      dots={{
          className: 'personal-award-dot'
      }}>
        {
          updateAwardList.map((item, index)=>{
              return (
                  <div className="award-list" key={index}>
                  {
                      item.map((child, index1)=>{
                          return (
                          <div className="award-one" key={index1}>
                              <i className={"awardlogo " + 
                              (
                                  child.awardLevel == 5 || child.awardClass == 1?
                                  "award-1":
                                  child.awardLevel == 4 || child.awardClass == 2?
                                  "award-2":
                                  child.awardLevel == 3 || child.awardClass == 3?
                                  "award-3":
                                  ""
                              )
                              }></i>
                              <p title={child.awardLevelName + child.awardName}>
                                  {child.awardLevelName + child.awardName}
                              </p>
                              <p title={awardLevelList[child.awardClass]}>
                                  {awardLevelList[child.awardClass]}
                              </p>
                              {
                                  userIdentity == 'manager'?
                                  <p 
                                  title={child.studentName}
                                  style={{color: '#ff6600'}}
                                  >[{child.studentName}]</p>:
                                  ""
                              }
                          </div>
                          )
                      })
                  }  
                  </div>
              )
          })
      }
      </Carousel>
      <div className="award-info">
      <p className="award-sum">目前已有奖项:<span>{awardList.length}</span></p>
        <Carousel
        dots={{
            className: 'award-info-dot'
        }}>
        <ul className="award-info-list">
          {
            updateAwardKindList.map((item, index)=>{
              return (
                <li key={index}>
                  {item.key}次数: 
                  <span>{item.num}次</span>
                </li>
              )
            })
          }
        </ul>
        </Carousel>
        
      </div>
      <div className="punish-info">
      <p className="punish-sum">目前处罚次数:<span>{punishList.length}</span></p>
      <Carousel
        dots={{
            className: 'punish-info-dot'
        }}>
        <ul className="punish-info-list">
          {
            updatePunishKindList.map((item, index)=>{
              return (
                <li key={index}>
                  {item.key}次数: 
                  <span>{item.num}次</span>
                </li>
              )
            })
          }
        </ul>
        </Carousel>
      </div>
        </div>
      }
    
    </div>
  );
}
const mapStateToProps = (state) => {
  let { commonData } = state;
  return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(Information)));
