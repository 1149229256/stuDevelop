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
import moment from "moment";
import {Empty} from "../../component/common";
import { Scrollbars } from "react-custom-scrollbars";
/**
 * @description: 暂无数据表明是没有这个系统id或返回错误，加锁是没有权限看,前者权重大于后者
 * @param {*} props
 * @param {*} ref
 * @return {*}
 */
function History(props, ref) {
  let {
    className,
    userIdentity,
    data,
  } = props;
  // 小于5个补
  // console.log("轨迹", data);
  let sign = false;
  if(data.length == 0){
    sign = true;
  }
  if (data.length < 5) {
    let more = ["", "", "", "", ""];
    data = data.concat(more.slice(0, 5 - data.length));
  }
  data.forEach((item)=>{
    let arr = [];
    let str = "";
    if(data.eventType){
      if(userIdentity == "student"){
        let arr = [];
        let obj = {
            time: data.eventTime,
            content: (
                data.eventName?
                data.eventType == 1?
                "获得" + data.eventName:
                (data.eventReason? "因为" + data.eventReason: "") + 
                ("受到" + data.eventName):
                ""
            ),
            eventType: data.eventType
        }
        arr.push(obj);
      } else {
          let arr = [];
          let obj = {
              time: data.eventTime,
              content: (
                  data.eventName?
                  data.eventType == 1?
                  data.userName + "获得" + data.eventName:
                  data.userName + 
                  (data.eventReason? "因为" + data.eventReason: "") + 
                  ("受到" + data.eventName):
                  ""
              ),
              eventType: data.eventType
          }
          arr.push(obj);
      }
    }
    if(data.times){
      let arr = [];
      let str = "";
      if(userIdentity != "student"){
          if(data.late){
              str += "迟到人数" + data.late + "人，";
          }
          if(data.absent){
              str += "缺勤人数" + data.absent + "人，";
          }
          if(data.leaveEarly){
              str += "早退人数" + data.leaveEarly + "人，";
          }
          if(data.vacate){
              str += "请假人数" + data.vacate + "人";
          }
      }
      else {
          if(data.late){
              str += "迟到" + data.late + "次，";
          }
          if(data.absent){
              str += "缺勤" + data.absent + "次，";
          }
          if(data.leaveEarly){
              str += "早退" + data.leaveEarly + "次，";
          }
          if(data.vacate){
              str += "请假" + data.vacate + "次";
          }
      }
      if(str[str.length - 1] == "，"){
          str = str.substr(0, str.length - 1);
      }
      let obj = {
          time: data.date,
          content: str
      }
      arr.push(obj);
    }
  })
  return (
    <div className={`card-content card-history ${className ? className : ""}`}>
      {
        !sign?
        <Scrollbars className='ch-scrollbars'>
          <div className="ch-dot-box">
            {data.map((child, index) => {
              // 第一个前面要有一个球，最后加4个，旗最长7个球的长度
              let dom = [];
              if (index === 0) {
                dom.push("dot");
              }
              // 看child有没有值
              dom = dom.concat([child ? "active" : "dot", "dot", "dot", "dot"]);
              if (index === data.length - 1) {
                dom = dom.concat(["dot", "dot", "dot", "dot"]);
              }
              let str = "";
              if(child.eventType){
                if(userIdentity == "student"){
                  str = 
                      child.eventName?
                      child.eventType == 1?
                      "获得" + child.eventName:
                      (child.eventReason? "因为" + child.eventReason: "") + 
                      ("受到" + child.eventName):
                      "";
                } else {
                  str = (
                      child.eventName?
                      child.eventType == 1?
                      child.userName + "获得" + child.eventName:
                      child.userName + 
                      (child.eventReason? "因为" + child.eventReason: "") + 
                      ("受到" + child.eventName):
                      ""
                  );
                }
              }
              if(child.times){
                if(userIdentity != "student"){
                    if(child.late){
                        str += "迟到人数" + child.late + "人，";
                    }
                    if(child.absent){
                        str += "缺勤人数" + child.absent + "人，";
                    }
                    if(child.leaveEarly){
                        str += "早退人数" + child.leaveEarly + "人，";
                    }
                    if(child.vacate){
                        str += "请假人数" + child.vacate + "人";
                    }
                }
                else {
                    if(child.late){
                        str += "迟到" + child.late + "次，";
                    }
                    if(child.absent){
                        str += "缺勤" + child.absent + "次，";
                    }
                    if(child.leaveEarly){
                        str += "早退" + child.leaveEarly + "次，";
                    }
                    if(child.vacate){
                        str += "请假" + child.vacate + "次";
                    }
                }
                if(str[str.length - 1] == "，"){
                    str = str.substr(0, str.length - 1);
                }
              }
              return (
                <React.Fragment key={index}>
                  {dom.map((dot, index2) => {
                    
                    return dot === "active" ? (
                      <div key={index2} className=" ch-dot ch-dot-active">
                        <span className="ch-dot-polo">
                          <div className="ch-content">
                            <p className="ch-content-time" title={child.date|| child.eventTime}>
                              {child.date || child.eventTime}
                            </p>
                            <p className="ch-content-title" title={str}>
                              {str}
                            </p>
                          </div>
                        </span>
                      </div>
                    ) : (
                      <span key={index2} className="ch-dot"></span>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </Scrollbars>:
        <Empty
          title={"暂无数据"}
          className="pc-empty"
          type={"3"}
        ></Empty>
      }
    </div>
  );
}

export default memo(forwardRef(History));
