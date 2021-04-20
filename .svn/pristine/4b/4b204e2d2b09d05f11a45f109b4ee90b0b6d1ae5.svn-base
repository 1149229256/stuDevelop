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
import { Carousel } from "antd";
import { Loading, Empty } from "@/component/common";
import moment from "moment";
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
function Archives(props, ref) {
  let {
    className,
    userIdentity,
    data,
    currentTerm,
    currentClass,
    userInfo: {UserID, SchoolID},
    setLoadVisible
  } = props;
  const [myInfo, setMyInfo] = useState({});
  // const [loadVisible, setLoadVisible] = useState(true);
  useLayoutEffect(()=>{
    //获取学籍信息
    ///api/status/student
    if(!UserID){
      return;
    }
    setLoadVisible(true);
    let url = BasicProxy + "/api/status/student?studentId=" + UserID;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>{
        return res.json();
    })
    .then((result)=>{
        if(result.status == 200 && result.data){
          setMyInfo(result.data);
        }
        setLoadVisible(false);
    })
  }, [UserID]);
  return (
    <div 
    className={`card-content card-archives ${className ? className : ""}`}
    >
        <div className="cc-div-box-1">
        <div className="cc-div-box-2 ">
          <p className="cc-p-1" title={myInfo.studentName? myInfo.studentName: "--"}>
            {myInfo.studentName? myInfo.studentName: "--"}
            <span className="cc-span-1" title={myInfo.studentId ? myInfo.studentId : "--"}>
              ({myInfo.studentId ? myInfo.studentId : "--"})
            </span>
          </p>
          <div className="cc-div-box-1">
            <p className="cc-p-2">
              出生年月:
              <span className="cc-span-2" title={myInfo.dateOfBirth ? myInfo.dateOfBirth : "--"}>
                {myInfo.dateOfBirth ? myInfo.dateOfBirth : "--"}
              </span>
            </p>
            <p className="cc-p-2">
              民族:
              <span className="cc-span-2" title={myInfo.nation ? myInfo.nation : "--"}>
                {myInfo.nation ? myInfo.nation : "--"}
              </span>
            </p>
            <p className="cc-p-2">
              性别:
              <span className="cc-span-2" title={myInfo.gender ? myInfo.gender : "--"}>
                {myInfo.gender ? myInfo.gender : "--"}
              </span>
            </p>
          </div>
          <div className="cc-div-box-1">
            <p className="cc-p-2">
              籍贯:
              <span className="cc-span-2" title={myInfo.nativePlace ? myInfo.nativePlace : "--"}>
                {myInfo.nativePlace ? myInfo.nativePlace : "--"}
              </span>
            </p>
            <p className="cc-p-2">
              当前班级:
              <span className="cc-span-2" title={myInfo.className ? myInfo.className : "--"}>
                {myInfo.className ? myInfo.className : "--"}
              </span>
            </p>
          </div>
          <div className="cc-div-box-1">
            <p className="cc-p-2" style={{width: '287px'}}>
              身份证号:
              <span className="cc-span-2 IDCardNo" title={myInfo.identityNum ? myInfo.identityNum : "--"}>
                {myInfo.identityNum ? myInfo.identityNum : "--"}
              </span>
            </p>
          </div>
        </div>
        <div
          className="ca-photo"
          style={{
            background: `url(${myInfo.photoPath}) no-repeat center top/100%  `,
          }}
        ></div>
      </div>
      <div className="cc-div-box-1">
        <p className="cc-p-2" style={{width: '287px'}}>
          家庭住址:
          <span className="cc-span-2 " title={myInfo.homeAddress ? myInfo.homeAddress : "--"}>
            {myInfo.homeAddress ? myInfo.homeAddress : "--"}
          </span>
        </p>
      </div>
      {/* <div className="cc-div-box-1">
        <p className="cc-p-2 Telephone">
          走读/住宿:
          <span className="cc-span-2" title={Telephone}>
            {Telephone ? Telephone : "--"}
          </span>
        </p>
      </div> */}
      <div className="cc-div-box-1">
        <p className="cc-p-2 Telephone">
          是否独生子女:
          <span className="cc-span-2" title={myInfo.isOnlychild ? myInfo.isOnlychild : "--"}>
            {myInfo.isOnlychild ? myInfo.isOnlychild : "--"}
          </span>
        </p>
        <p className="cc-p-2 Telephone">
          是否受过学前教育:
          <span className="cc-span-2" title={myInfo.isAcceptpreschool ? myInfo.isAcceptpreschool : "--"}>
            {myInfo.isAcceptpreschool ? myInfo.isAcceptpreschool : "--"}
          </span>
        </p>
      </div>
      <p className="cc-p-2">
        是否留守儿童:
        <span className="cc-span-2" title={myInfo.isLeftbehindchild ? myInfo.isLeftbehindchild : "--"}>
          {myInfo.isLeftbehindchild ? myInfo.isLeftbehindchild : "--"}
        </span>
      </p>
      
    </div>
  );
}
const mapStateToProps = (state) => {
  let { commonData } = state;
  return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(Archives)));
