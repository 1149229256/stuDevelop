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
  import Bar from "../../../component/bar";
  import MyLive from "./myLive";
  import MyConsume from "./myConsume";
  import MyInternet from "./myInternet";
  import MyContact from "./MyContact";
  import Track from "../../../component/Track";
  import { Empty } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;

  function SchoolLive(props, ref) {
    let {
      term,
      HasHistory,
      onAnchorComplete,
      schoolID,
      collegeID,
      productMsg,
      userIdentity,
      currentClass,
      currentGrade,
      userInfo: {UserID, SchoolID},
      reflash
    } = props;
    const [trackInfo, setTrackInfo] = useState([]);
    const myLive = useRef(null);
    const myConsume = useRef(null);
    const myInternet = useRef(null);
    const myContact = useRef(null);
    const liveTrack = useRef(null);
    useLayoutEffect(() => {
      // setAnchorList();
      typeof onAnchorComplete === "function" &&
        onAnchorComplete([
          { ref: myLive.current, name:(userIdentity == "student"? "我的作息": "学生作息") },
          { ref: myConsume.current, name: (userIdentity == "student"? "我的消费": "学生消费") },
          { ref: myInternet.current, name: (userIdentity == "student"? "我的上网": "学生上网") },
          // { ref: myContact.current, name: (userIdentity == "student"? "我的社交": "学生社交") },
          { ref: liveTrack.current, name: "生活轨迹" },
        ]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 初始请求
    useLayoutEffect(() => {
      //获取成长历程
      if(userIdentity == "student" && !UserID){
        return;
      }
      if(userIdentity == "teacher" && !currentClass){
        return;
      }
      let currentTermInfo = term.value && JSON.parse(term.value);
      let url = BasicProxy + "/api/campusLife/route?id=" + (
        userIdentity == "student"?
        UserID:
        userIdentity == "teacher"?
        currentClass:
        userIdentity == "manager"?
        currentClass?
        currentClass:
        currentGrade?
        currentGrade:
        SchoolID:
        UserID
      ) +
      "&queryType=" + (
        userIdentity == "student"?
        1:
        userIdentity == "teacher"?
        2:
        currentClass?
        2:
        currentGrade?
        3:
        4
      ) +
    "&startDate=" + currentTermInfo.startDate.substr(0, 10) + 
    "&endDate=" + currentTermInfo.endDate.substr(0, 10);
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && Array.isArray(result.data)){
        setTrackInfo(result.data);
      }
    })
    }, [term, currentClass, currentGrade, userIdentity, reflash])
    return (
      <div className="award-and-punish" id="schoolLiveMsg">
        <Bar loading={false} barName={userIdentity == "student"? "我的作息": "学生作息"} ref={myLive}>
            <MyLive 
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            userIdentity={userIdentity}
            reflash={reflash} />
        </Bar>
        <Bar loading={false} barName={userIdentity == "student"? "我的消费": "学生消费"} ref={myConsume}>
            <MyConsume 
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            userIdentity={userIdentity}
            reflash={reflash} />
        </Bar>
        <Bar loading={false} barName={userIdentity == "student"? "我的上网": "学生上网"} ref={myInternet}>
            <MyInternet 
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            userIdentity={userIdentity}
            reflash={reflash} />
        </Bar>
        {/* <Bar loading={false} barName={"我的社交"} ref={myContact}>
            <MyContact 
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            userIdentity={userIdentity} />
        </Bar> */}
        <Bar loading={false} barName={"生活轨迹"} ref={liveTrack}>
            <Track 
            userIdentity={userIdentity}
            type="schoolLiveMsg"
            data={trackInfo}
            />
        </Bar>
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
  export default connect(mapStateToProps)(memo(forwardRef(SchoolLive)));
  