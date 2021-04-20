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
import $ from "jquery";
import { Loading, Empty } from "@/component/common";
/**
 * @description: 暂无数据表明是没有这个系统id或返回错误，加锁是没有权限看,前者权重大于后者
 * @param {*} props
 * @param {*} ref
 * @return {*}
 */
function Card(props, ref) {
  let {
    className,
    width,
    height,
    title,
    cardid,
    btn,
    select,
    loading, //控制loading
    lock, //控制锁显示
    data, //主要控制空数据显示问题
    component: Component,
    userIdentity,
    identityCode,
    currentTerm,
    currentClass,
    componentProps, //组件的props
  } = props;
  //获取token
  let token = sessionStorage.getItem("token");
  const [loadVisible, setLoadVisible] = useState(true);
  //各个模块跳转地址
  const addrList = [
    {
      key: 'archives',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#stuStatusMsg'
    },
    {
      key: 'classStatus',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#stuStatusMsg'
    },
    {
      key: 'schoolStatus',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#stuStatusMsg'
    },
    {
      key: 'accout',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#stuConditionMsg'
    },
    {
      key: 'gradeRank',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#stuConditionMsg'
    },
    {
      key: 'gradeStatistic',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#stuConditionMsg'
    },
    {
      key: 'teach',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#healthMsg'
    },
    {
      key: 'stuHealth',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#healthMsg'
    },
    {
      key: 'stu-attendance',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#attendanceMsg'
    },
    {
      key: 'information',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#awardAndPunish'
    },
    {
      key: 'work',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#attendanceMsg'
    },
    {
      key: 'history',
      addr: '/student-growth/index.html?lg_tk=' + token + '&lg_ic=' + identityCode + '#schoolLiveMsg'
    },
  ]
  useLayoutEffect(()=>{
    data && setLoadVisible(false);
  }, [data]);
  let url = "";
  addrList.forEach((item)=>{
    // if(identityCode != "IC0012" && identityCode != "IC0014" && identityCode != "IC0015" && (cardid == "stuHealth" ||
    // cardid == "information" || cardid == "history")){
    //   url = "";
    //   return;
    // }
    if(item.key == cardid){
      url = item.addr;
    }
  })
  // console.log("首页", identityCode, url);
  // console.log(url, cardid);
  // return;
  const goDetail = (e) => {
    if(e.target.nodeName == 'BUTTON'){
      return;
    }
    if(!url){
      return;
    }
    window.open(url);
  }
  return (
    <div
      className={`personal-card ${className ? className : ""} ${loadVisible ? "load" : ""} ${
        select === cardid ? "card-select" : ""
      }`}
      style={{
        width: width ? width : "100%",
        cursor: (url? "pointer": "default"),
      }}
      onClick={goDetail}
    >
      <span className={`pc-title pc-title-bg ${"pc-title-" + cardid}`}>
        {/* {title} */}
        <i></i>
      </span>
      <Loading
        spinning={loadVisible}
        opacity={false}
        tip={"加载中..."}
      >
        <div
          className="pc-content"
          style={{
            height: height ? height : "100%",
          }}
        >
          {!loading ? (
            data ? (
              lock ? (
                <Empty
                  className="pc-lock"
                  title={"暂不开放该模块"}
                  type={"3"}
                ></Empty>
              ) : Component ? (<>
                {btn}
                <Component 
                data={data} 
                setLoadVisible={setLoadVisible}
                userIdentity={userIdentity} 
                currentTerm={currentTerm}
                currentClass={currentClass}
                {...componentProps}></Component>
                </>) : (
                ""
              )
            ) : (
                <Empty
                  title={"暂无数据"}
                  className="pc-empty"
                  type={"3"}
                ></Empty>
              
            )
          ) : (
            ""
          )}
        </div>
      </Loading>
    </div>
  );
}

export default memo(forwardRef(Card));
