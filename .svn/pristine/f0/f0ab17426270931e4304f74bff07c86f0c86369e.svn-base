import {
  connect,
  // useSelector,
  //   useDispatch,
} from "react-redux";
import React, {
  useCallback,
  memo,
  useEffect,
  useState,
  // useImperativeHandle,
  useMemo,
  // useReducer,
  // createContext,
  // useContext,
  useRef,
  forwardRef,
  useLayoutEffect,
} from "react";
import "./index.scss";
//   import { Search, Empty } from "../common";
import { handleRoute } from "@/util/public";
import listenAppDurationTime from "../../component/common/listen_app_duration_time";
import {Popover} from "antd";
import $ from "jquery";
import { withRouter } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";
import { debounce, BrowserMsg, Browser, removeSlashUrl, getQueryVariable } from "@/util/public";
import {
  GetSubSystemsMainServerBySubjectID,
  getTeacherDetailIntroduction,
  GetTermAndPeriodAndWeekNOInfo,
  GetTeacherResView,
  GetTeachPlanStatistics,
  GetTeacherpercentage,
  GetAllTerm,
  GetTeacherWork,
  GetResearchByUserID,
  GetDevelopmentHistory,
  GetLogInfoByUserID,
} from "@/api/personal";
import Card from "./card";
import Archives from "./archives";  //左上
import Accout from "./accout"; //左中
import Teach from "./teach";  //左下
import Work from "./work"; //右中
import HistoryDom from "./history";  //中下
import Information from "./information"; //右上
import Linkbtn from "./linkbtn";
import Data from "./data"; //右下

import ClassStatus from "./classStatus";
import SchoolStatus from "./schoolStatus";
import ClassAttainment from "./classAttainment";
import ClassRank from "./classRank";
import GradeRank from "./gradeRank";
import StuHealth from "./stuHealth";

import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
import { Loading } from "../../component/common";
let { BasicProxy } = ipConfig;

function PersonalDetail(props, ref) {
  let {
    className,
    history,
    location,
    basePlatFormMsg,
    teachermsg,
    teacherid,
    token,
    roleMsg: { identityCode, userType },
    userInfo: { UserID, UserType, SchoolID, Gender, UserName, Sign },
    ...reset
  } = props;
  console.log("首页", props)
  let storageUserInfo = sessionStorage.getItem("UserInfo")? JSON.parse(sessionStorage.getItem("UserInfo")): {};
  if(!UserID){
    UserID = storageUserInfo.UserID;
  }
  if(!SchoolID){
    SchoolID = storageUserInfo.SchoolID;
  }
  //根据identityCode判断当前身份
  let userIdentity = "manager";
  if(identityCode == "IC0010"){
    userIdentity = "manager";
  }
  if(identityCode == "IC0013" || identityCode == "IC0011" || identityCode == "IC0012"){
    userIdentity = "teacher";
  }
  if(identityCode == "IC0014" || identityCode == "IC0015"){
    userIdentity = "student";
  }
  useLayoutEffect(() => {
    if(sessionStorage.getItem(("isReload"))){
      return;
    }
    let url = BasicProxy + "/api/base/getServerInfo?sysIds=850";
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        let baseUrl = result.data.webSvrAddr;
        if(identityCode == "IC0014") {
          listenAppDurationTime(baseUrl,"270", "270001", UserID);
        } else if(identityCode == "IC0015") {
          listenAppDurationTime(baseUrl,"270", "270002", UserID);
        } else {
          listenAppDurationTime(baseUrl,"270", "270003", UserID);
        }
        sessionStorage.setItem("isReload", true);
      }
    })
  }, [])
  const [allVisible, setAllVisible] = useState(false);
  const [rate, setRate] = useState(null);
  const [classListVisible, setClassListVisible] = useState(false);
  // 缩放模式，*ratio:等比，以宽的比例为准，*full:全屏，宽高各自比例
  const [zoomType, setZoomType] = useState("full");
  // 宽高
  const [content, setContent] = useState(null);
  const personalRef = useRef(null);
  // 动画状态修改
  const [animationType, setAnimationType] = useState(true);
  // 设置暂停
  const [paused, setPaused] = useState(false);
  // 设置选中
  const [SelectCard, setSelectCard] = useState(false);

  // 存系统url
  const [SysUrl, setSysUrl] = useState(null);
  // 档案
  const [archives, setArchives] = useState(null);
  // 账号
  const [accout, setAccout] = useState(null);
  // 信息化
  const [information, setInformation] = useState(null);
  // 教研
  const [teach, setTeach] = useState(null);
  // 教学资料
  const [data, setData] = useState(null);
  const [TeachPlan, setTeachPlan] = useState(null); //教学方案
  const [Percentage, setPercentage] = useState(null); //精品课程
  const [ResView, setResView] = useState(null); //电子资源
  const [SubjectList, setSubjectList] = useState(null); //学科列表
  // 工作量
  const [work, setWork] = useState(null);
  const [WorkTerm, setWorkTerm] = useState(null);
  const [WorkTermList, setWorkTermList] = useState(null);
  // 档案
  const [History, setHistory] = useState(null);

  // 存周次列表
  const [WeekList, setWeekList] = useState(null);
  const [WeekData, setWeekData] = useState(null);
  // 存教学资料的参数
  const [DataParams, setDataParams] = useState({});

  //存储当前学期
  const [currentTerm, setCurrentTerm] = useState({});
  //存储班级列表和当前班级
  const [classList, setClassList] = useState([]);
  const [currentClass, setCurrentClass] = useState({});
  const [currentGrade, setCurrentGrade] = useState({});
  //存储轨迹数据
  const [awardPunishTrack, setAwardPunishTrack] = useState([]);
  const [attendanceTrack, setAttendanceTrack] = useState([]);
  // 存卡
  let cardList = [
    "grade-statistic",
    "information",
    "teach",
    "data",
    "work",
    "archives",
    "history",
  ];
  if(userIdentity == "teacher"){
    cardList = [
      "classStatus",
      "stuHealth",
      "gradeRank",
      "stu-all",
      "stu-attendance",
      "information",
      "history",
    ];
  }
  if(userIdentity == "manager"){
    cardList = [
      "schoolStatus",
      "stuHealth",
      "gradeRank",
      "stu-all",
      "stu-attendance",
      "information",
      "history",
    ];
  }
  useLayoutEffect(() => {
    if(userIdentity != "student"){
      return;
    }
    let url = BasicProxy + "/api/base/getSchoolStudent?schoolId=" + SchoolID +
    "&studentId=" + UserID;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        setCurrentClass(result.data);
        setCurrentGrade(result.data.gradeId);
      }
    })
  }, [userIdentity, UserID, SchoolID])
  // 保存浏览器版本，如果是ie不要动画
  const isIE = useMemo(() => {
    let {
      client: { isIE, isWebkit, ieVersion },
    } = Browser;
    let {
      versions: { trident },
    } = BrowserMsg;
    // console.log(isIE, ieVersion(), isWebkit);
    return isIE || trident;
  }, []);
  // 获取各平台地址
  useEffect(() => {
    let sysIDs = [
      310, //教学方案
      // 300, //教学方案
      "D21", //精品课程
      "E34", //档案
      "C10", //电子资源
      // 'D21', //课程精品
    ];
    // console.log(basePlatFormMsg)
    if (!SysUrl && basePlatFormMsg.BasicWebRootUrl) {
      GetSubSystemsMainServerBySubjectID({
        sysIDs,
        baseIP: basePlatFormMsg.BasicWebRootUrl,
      }).then((res) => {
        // console.log(res);
        if (res.StatusCode === 200) {
          setSysUrl(res.data);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePlatFormMsg]);

  // 获取当前学期接口
  useEffect(() => {
    let url = BasicProxy + "/api/base/getCurrentTermInfo?schoolId=" + SchoolID;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        setCurrentTerm(result.data);
      }
    })
  }, []) 
  //如果当前身份是老师，则显示切换班级按钮，获取班级列表，如果sessionStorage上带了currentClass参数则使用该classId
  useLayoutEffect(()=>{
    if(userIdentity == "teacher"){
      let url = BasicProxy + "/api/base/getClassByMasterId?teacherId=" + UserID;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
        if(result.status == 200 && Array.isArray(result.data)){
          setClassList(result.data);
          let classId = sessionStorage.getItem("currentClass");
          let classOne = {};
          result.data.forEach((item)=>{
            if(item.classId == classId){
              classOne = item;
            }
          })
          setCurrentClass(classOne.classId? classOne: result.data[0]? result.data[0]: {});
        }
      })
    } else {
      // let classInfo = {
      //   classId: JSON.parse(sessionStorage.getItem("UserInfo")).GroupID,
      //   gradeId: JSON.parse(sessionStorage.getItem("UserInfo")).GradeID
      // };
      let classInfo = {
        classId: "",
        gradeId: ""
      };
      setCurrentClass(classInfo);
    }
  }, [UserID, userIdentity]);
  // 不需要系统url的接口
  useEffect(() => {
    let userID = teacherid;
    if (basePlatFormMsg) {
      if (teachermsg) {
        setDataParams({
          ...DataParams,
          schoolID: teachermsg.SchoolID || "S-666",
          subjectIDs: teachermsg.SubjectIDs,
          subjectNames: teachermsg.SubjectNames,
          baseIP: basePlatFormMsg.BasicWebRootUrl,
        });
        if (typeof teachermsg.SubjectNames === "string") {
          let SubjectList = [];
          let SubjectIDList =
            typeof teachermsg.SubjectIDs === "string"
              ? teachermsg.SubjectIDs.split(",")
              : [];
          teachermsg.SubjectNames.split(",").forEach((child, index) => {
            SubjectList.push({
              key: SubjectIDList[index] || index,
              value: child,
            });
          });
          setSubjectList(SubjectList);
        }

        // setSubjectList([
        //   // { key: "same", value: "同学科" },
        //   { key: "1", value: "英语" },
        //   { key: "2", value: "语文" },
        //   { key: "3", value: "数学" },
        // ]);
        //获取学期周次
        GetTermAndPeriodAndWeekNOInfo({
          userID,
          baseIP: basePlatFormMsg.BasicWebRootUrl,
          schoolID: teachermsg.SchoolID || "S-666",
        }).then((res) => {
          if (res.StatusCode === 200) {
            setWeekList(res.Data.WeekList);
            setWeekData(res.Data.NowWeekSelect);
          } else {
            setWeekData(false);
          }
        });

        setArchives(teachermsg);
        setAccout(teachermsg);
        // 教研统计
        GetResearchByUserID({ userID }).then((res) => {
          if (res.StatusCode === 200) {
            setTeach(res.Data);
          } else {
            setTeach(false);
          }
        });
        // 历史发展
        GetDevelopmentHistory({ userID }).then((res) => {
          if (res.StatusCode === 200) {
            setHistory(res.Data);
          } else {
            setHistory(false);
          }
        });
        // 上机信息
        GetLogInfoByUserID({ userID }).then((res) => {
          if (res.StatusCode === 200) {
            setInformation(res.Data);
          } else {
            setInformation(false);
          }
        });
        // setInformation({
        //   TimeSpan: 48, //累计上机时长
        //   DayAvgTimeSpan: 1.2, //累计上机时长
        //   LoginCount: 485, //上机总次数
        //   AvgLoginTimeSpan: 48, //平均每次上机时长
        //   DayTimeList: [
        //     {
        //       Time: "06:00~09:00",
        //       Count: 10,
        //     },
        //     {
        //       Time: "09:00~12:00",
        //       Count: 70,
        //     },
        //     {
        //       Time: "12:00~15:00",
        //       Count: 20,
        //     },
        //     {
        //       Time: "15:00~18:00",
        //       Count: 80,
        //     },
        //     {
        //       Time: "18:00~21:00",
        //       Count: 10,
        //     },
        //     {
        //       Time: "21:00~23:59",
        //       Count: 50,
        //     },
        //   ], //平均每日上机时间段分布
        //   DayOnlineList: [
        //     //平均每日在线办公/
        //     //教学时长占比
        //     {
        //       NodeName: "在线办公",
        //       Time: 20,
        //     },
        //     {
        //       NodeName: "在线教学",
        //       Time: 20,
        //     },
        //   ],
        // });
      }

      // GetUserDetailForHX({userID:}).then((res) => {
      //   if (res.StatusCode === 200) {
      //     setSysUrl(res.data);
      //   }
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherid]);
  // 工作量，依赖学期和sysurl
  useEffect(() => {
    if (!SysUrl || !WorkTerm) {
      return;
    }
    let userID = teacherid;
    let userName = teachermsg.UserName;

    if (SysUrl["E34"] && SysUrl["E34"].WebSvrAddr && WeekData) {
      GetTeacherWork({
        userName: userID,
        baseIP: DataParams.baseIP,
        proxy: SysUrl["E34"].WebSvrAddr,
        token,
        semester: WorkTerm.value,
      }).then((res) => {
        if (res.StatusCode === 200) {
          setWork(res.Data);
          // changeData({ ResView: res.Data });
        } else {
          setWork(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SysUrl, WorkTerm]);
  // 教学资料需要依赖周次和sysURl
  useEffect(() => {
    let userID = teacherid;
    if (!SysUrl) {
      return;
    }
    // 电子资源
    if (SysUrl["C10"] && SysUrl["C10"].WebSvrAddr && WeekData) {
      GetTeacherResView({
        userID,
        baseIP: DataParams.baseIP,
        proxy: SysUrl["C10"].WebSvrAddr,
        token,
        schoolID: DataParams.schoolID,
        subjectIDs: DataParams.subjectIDs,
        subjectNames: DataParams.subjectNames,
        startTime: WeekData.startTime,
        endTime: WeekData.endTime,
      }).then((res) => {
        if (res.StatusCode === 200) {
          setResView(res.Data);
          // changeData({ ResView: res.Data });
        }
      });
    }
    // 教学方案
    if (SysUrl["310"] && SysUrl["310"].WebSvrAddr && WeekData) {
      GetTeachPlanStatistics({
        userID,
        baseIP: DataParams.baseIP,
        proxy: SysUrl["310"].WebSvrAddr,
        token,
        // schoolID: DataParams.schoolID,
        // subjectIDs: DataParams.subjectIDs,
        // subjectNames: DataParams.subjectNames,
        startTime: WeekData.startTime,
        endTime: WeekData.endTime,
      }).then((res) => {
        if (res.StatusCode === 200) {
          // console.log(res.Data);
          setTeachPlan(res.Data);
          // changeData({ TeachPlan: res.Data });
        }
      });
    }
    // 精品课程
    if (SysUrl["D21"] && SysUrl["D21"].WsSvrAddr && WeekData) {
      GetTeacherpercentage({
        userID,
        baseIP: DataParams.baseIP,
        proxy: SysUrl["D21"].WsSvrAddr,
        token,
        schoolID: DataParams.schoolID,
        subjectIDs: DataParams.subjectIDs,
        subjectNames: DataParams.subjectNames,
        startTime: WeekData.startTime,
        endTime: WeekData.endTime,
      }).then((res) => {
        if (res.StatusCode === 200) {
          console.log(res.Data);
          setPercentage(res.Data);
          // changeData({ ResView: res.Data });
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SysUrl, WeekData]);
  // 控制初始进来的时候是什么模式
  useLayoutEffect(() => {
    let page = $(personalRef.current);
    let height = page.height();
    let width = page.width();
    if (height > width) {
      setZoomType("ratio");
    }
    // body去掉overflow
    // $('body').css('overflow-x','hidden')
  }, []);
  //获取成长历程
  useLayoutEffect(() => {
    if(!currentTerm.termStartDate || !currentTerm.termEndDate){
      return;
    }
    if(userIdentity == "teacher" && !currentClass.classId){
      return;
    }
    if(userIdentity == "student" && (!UserID || !currentClass.classId)){
      return;
    }
    if(userIdentity == "manager" && !SchoolID){
      return;
    }
    let url = BasicProxy + "/api/punishAndReward/route?id=" + (
      userIdentity == "student"?
      UserID:
      userIdentity == "teacher"?
      currentClass.classId:
      userIdentity == "manager"?
      SchoolID:
      UserID
    ) +
    "&queryType=" + (
      userIdentity == "student"?
      1:
      userIdentity == "teacher"?
      2:
      userIdentity == "manager"?
      4:
      1
    ) +
    "&startTime=" + currentTerm.termStartDate + 
    "&endTime=" + currentTerm.termEndDate +
    "&eventType=0";
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && Array.isArray(result.data)){
        setAwardPunishTrack(result.data);
      }
    })
    //获取考勤轨迹数据
    url = BasicProxy + "/api/attendance/attendance/path?type=" + (
      userIdentity == "student"?
      1:
      userIdentity == "teacher"?
      2:
      userIdentity == "manager"?
      4:
      1
    ) +
    "&studentId=" + (
      userIdentity == "student"?
      UserID:
      "") +
    "&classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&schoolId=" + SchoolID +
    "&start=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
    "&end=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && Array.isArray(result.data)){
        setAttendanceTrack(result.data);
      }
    })
  }, [currentTerm, userIdentity, currentClass, SchoolID, UserID])
  useLayoutEffect(() => {
    let page = $(personalRef.current);
    let InitWidth = 1920;
    let InitHeight = 1080;

    const resize = () => {
      let height = page.height();
      let width = page.width();

      setContent([width, height]);
      // console.log(width, height)
      setRate([
        width / InitWidth,
        zoomType === "ratio" ? width / InitWidth : height / InitHeight,
      ]);
    };
    resize();
    window.addEventListener("resize", debounce(resize, 500), false);

    return () => {
      window.removeEventListener("resize", debounce(resize, 500));
    };
  }, [zoomType]);
  // 获取长度
  const getPX = useCallback(
    (old = [1920, 1080]) => {
      // rate[0] = rate[0] || 1;
      // rate[1] = rate[1] || 1;
      return {
        width: old[0]
          ? old[0] * 1
          : // rate[0]
            "100%",
        height: old[1]
          ? old[1] * 1
          : // rate[1]
            "100%",
      };
    },
    [rate]
  );
  // useEffect(() => {
  //   console.log(props);
  // }, [location]);
  // 点击card 高亮模块
  const onCardClick = useCallback((id) => {}, []);
  const archivesBtn = useMemo(() => {
    // 先只有超级管理员进
    if (
      userType === 0 &&
       SysUrl && SysUrl["E34"] && SysUrl["E34"].WsSvrAddr) {
      let { UserID, UserName } = archives;
      const onBtnClick = () => {
        let toUrl =
          removeSlashUrl(SysUrl["E34"].WsSvrAddr) +
          `/index_user.html?lg_tk=${token}&tName=${UserName}&tId=${UserID}&lg_ic=${identityCode}#1|4|0`;
        window.open(toUrl);
      };

      return (
        <Linkbtn type={"archives"} onClick={onBtnClick}>
          档案信息管理
        </Linkbtn>
      );
    } else {
      return null;
    }
  }, [SysUrl, token, identityCode, archives]);
  return (
      <div
      ref={personalRef}
      className={`lg-PersonalDetail ${className ? className : ""}`}
    >
      <Loading
      opacity={false}
      spinning={allVisible}>
      {/* 切换全屏模式功能暂时隐藏 */}
      <div className={`control-rate control-rate-${zoomType}`}>
        <i
          className={`ct-box ct-full ${zoomType === "full" ? "ct-select" : ""}`}
          onClick={() => {
            setZoomType("full");
          }}
        ></i>
        <i
          className={`ct-box ct-ratio ${
            zoomType === "ratio" ? "ct-select" : ""
          }`}
          onClick={() => {
            setZoomType("ratio");
          }}
        ></i>
      </div>
      {rate ? (
        <div
          className="pd-content"
          style={
            rate
              ? {
                  ...getPX([1920, 1080]),
                  transform: `scale(${rate[0]},${rate[1]})`,
                  left: (-(1 - rate[0]) / 2) * 1920 + "px",
                  top: (-(1 - rate[1]) / 2) * 1080 + "px",
                  position: "absolute",
                }
              : {}
          }
        >
          <div className="pd-top" style={{ ...getPX([1920, 85]) }}>
            <div className="pd-top-bg" style={{ ...getPX([1920, 343]) }}></div>
          </div>
          <div className="pd-center" style={{ ...getPX([1920, 995]) }}>
            <div
              className="pd-center-bg"
              style={{ ...getPX([1874, 930]) }}
            ></div>
            <div
              className="pd-center-content"
              style={{
                ...getPX([1920, 937]),
                padding: `0 ${getPX([18]).width}px`,
              }}
            >
              <div
                className="pd-center-content-left"
                style={{ ...getPX([480]), margin: `0 ${getPX([18]).width}px` }}
              >
                <Card
                  cardid={userIdentity == 'teacher'? "classStatus": userIdentity == 'manager'? "schoolStatus": "archives"}
                  select={SelectCard}
                  height={userIdentity == 'teacher'? 214: userIdentity == 'student'? 280: 214}
                  btn={archivesBtn}
                  loading={false}
                  data={true}
                  currentTerm={currentTerm}
                  currentClass={currentClass}
                  currentGrade={currentGrade}
                  component={
                    userIdentity == 'teacher'? ClassStatus: 
                    userIdentity == 'student'? Archives: 
                    SchoolStatus}
                  userIdentity={userIdentity}
                  identityCode={identityCode}
                ></Card>
                <Card
                  select={SelectCard}
                  cardid={userIdentity == 'teacher' || userIdentity == 'manager'? "stuHealth": "gradeStatistic"}
                  currentTerm={currentTerm}
                  currentClass={currentClass}
                  currentGrade={currentGrade}
                  height={userIdentity == 'teacher' || userIdentity == 'manager'? 247: 217}
                  loading={false}
                  userIdentity={userIdentity}
                  identityCode={identityCode}
                  component={
                    userIdentity == 'teacher' || userIdentity == 'manager'? Teach: 
                    Accout}
                  data={userIdentity == "manager"? false: true}
                ></Card>
                <Card
                  select={SelectCard}
                  cardid={userIdentity == 'teacher' || userIdentity == 'manager'? "gradeRank": "teach"}
                  currentTerm={currentTerm}
                  currentGrade={currentGrade}
                  currentClass={currentClass}
                  component={
                    userIdentity == 'teacher'? ClassRank:
                    userIdentity == 'manager'? GradeRank:
                    Teach
                  }
                  height={userIdentity == 'teacher' || userIdentity == 'manager'? 369: 335}
                  loading={false}
                  data={true}
                  userIdentity={userIdentity}
                  identityCode={identityCode}
                ></Card>
              </div>
              <div
                className="pd-center-content-center"
                style={{ ...getPX([816]), margin: `0 ${getPX([18]).width}px` }}
              >
                <div
                  className="pd-center-content-center-top"
                  style={{
                    ...getPX(["", 94]),
                  }}
                >
                  {userIdentity == "student" || userIdentity == "manager" ? (
                    <>
                      <p
                        className="pd-teacher-name"
                        title={UserName}
                      >
                        {UserName ? UserName: "--"}
                      </p>
                      {Sign ? (
                        <p className="pd-teacher-sign" title={Sign}>
                          {Sign ? Sign : "--"}
                        </p>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    userIdentity == "teacher"?
                    <span className="class-name">
                      {currentClass.className? currentClass.className: "暂无班级"}
                      {
                        classList.length > 1?
                        <Popover
                        content={
                          <ul className="class-list">
                            <Scrollbars
                            autoHeight
                            autoHeightMax={118}>
                            {
                              classList.map((item, index)=>{
                                return (
                                  <li 
                                  key={index} 
                                  onClick={()=>{
                                    sessionStorage.setItem("currentClass", item.classId);
                                    setCurrentClass(item);
                                    setClassListVisible(false);
                                    }}>
                                  {item.className}</li>
                                )
                              })
                            }
                            </Scrollbars>
                          
                          </ul>
                        }
                        visible={classListVisible}
                        onVisibleChange={(v)=>setClassListVisible(v)}
                        trigger="click"
                        placement="bottom">
                        <span className="change-class">切换</span>
                        </Popover>:
                        ""
                      }
                      
                      
                    </span>:
                    ""
                  )}
                  {/* {teachermsg ? (
                    <>
                      <p
                        className="pd-teacher-name"
                        title={teachermsg.UserName}
                      >
                        {teachermsg.UserName ? teachermsg.UserName : "--"}
                      </p>
                      {teachermsg.Sign ? (
                        <p className="pd-teacher-sign" title={teachermsg.Sign}>
                          {teachermsg.Sign ? teachermsg.Sign : "--"}
                        </p>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )} */}
                </div>
                <div
                  className="pd-drag-container"
                  style={{
                    ...getPX(["", 483]),
                    // margin: `0 ${getPX([18]).width}px`,
                    backgroundSize: `${getPX([558]).width}px ${
                      getPX(["", 468]).height
                    }px`,
                  }}
                  // onMouseDown={(e) => {
                  //   captureMouse((mouse) => {
                  //     console.log(e, mouse);
                  //   });
                  // }}
                  // onMouseUp={(e) => {
                  //   console.log(e);
                  // }}
                >
                  {!isIE && (
                    <div
                      className={`drag-control  `}
                      style={{
                        transform: `rotateX(${-10}deg) rotateY(${100}deg) `,
                        WebkitTransform: `rotateX(${-10}deg) rotateY(${100}deg) `,
                        MozTransform: `rotateX(${-10}deg) rotateY(${100}deg) `,
                        OTransform: `rotateX(${-10}deg) rotateY(${100}deg) `,
                        MsTransform: `rotateX(${-10}deg) rotateY(${100}deg) `,
                      }}
                    >
                      <div
                        className={`card-container 
                    `}
                      >
                        {cardList.map((child, index) => {
                          let len = cardList.length;
                          let width = 550;
                          let reg = 360 / len;
                          let rotateY = reg * index;
                          let translateZ =
                            (Math.cos(reg / 2) * width) /
                            (1 + Math.cos(reg / 2));
                          if (animationType && index === len - 1) {
                            setTimeout(() => {
                              setAnimationType(false);
                            }, 100);
                          }
                          // if (animationType) {
                          //   setTimeout(() => {
                          //     isChange = true;
                          //   },0);
                          // }
                          let transform = !animationType
                            ? `rotateY(${rotateY}deg) translateZ(${translateZ}px)`
                            : `rotateY(${0}deg) translateZ(${0}px)`;
                          return (
                            <i
                              key={index}
                              style={{
                                // background: `url(./images/image-${child}.png) no-repeat center center / 100% 100%`,
                                transform: transform,
                                // transition: 'transform 1s ease 0s',
                                WebkitTransform: transform,
                                MozTransform: transform,
                                OTransform: transform,
                                MsTransform: transform,
                              }}
                              className={"img-" + child}
                              onClick={onCardClick.bind(this, child)}
                              onMouseEnter={(e) => {
                                setSelectCard(child);
                              }}
                              onMouseLeave={(e) => {
                                setSelectCard(false);
                              }}
                            ></i>
                          );
                        })}
                      </div>
                    </div>
                  )}{" "}
                  <div className={
                    userIdentity == "student"?
                    Gender == 0?
                    "stu-girl":
                    "drag-bg":
                    "group-bg"
                    }></div>
                </div>
                <div
                  className="pd-center-content-center-bottom"
                  style={{
                    ...getPX([816, 346]),
                    margin: `${getPX(["", 10]).height}px 0 0`,
                  }}
                >
                  <Card
                    select={SelectCard}
                    cardid={"history"}
                    height={315}
                    userIdentity={userIdentity}
                    identityCode={identityCode}
                    currentTerm={currentTerm}
                    currentGrade={currentGrade}
                    currentClass={currentClass}
                    component={HistoryDom}
                    loading={false}
                    data={
                      awardPunishTrack.concat(attendanceTrack)
                    }
                  ></Card>
                </div>
              </div>
              <div
                className="pd-center-content-right"
                style={{ ...getPX([480]), margin: `0 ${getPX([18]).width}px` }}
              >
                <Card
                  select={SelectCard}
                  cardid={"information"}
                  height={userIdentity == 'teacher'? 353: userIdentity == 'manager'? 353: 340}
                  component={Information}
                  currentTerm={currentTerm}
                  currentGrade={currentGrade}
                  currentClass={currentClass}
                  loading={false}
                  data={userIdentity == "manager"? false: true}
                  userIdentity={userIdentity}
                  identityCode={identityCode}
                ></Card>
                <Card
                  select={SelectCard}
                  cardid={userIdentity == 'teacher' || userIdentity == 'manager'? "stu-attendance": "work"}
                  height={userIdentity == 'teacher' || userIdentity == 'manager'? 227: 217}
                  component={Work}
                  loading={false}
                  currentTerm={currentTerm}
                  currentGrade={currentGrade}
                  currentClass={currentClass}
                  data={true}
                  userIdentity={userIdentity}
                  identityCode={identityCode}
                  componentProps={{
                    onTermSelect: (e) => {
                      setWorkTerm(e);
                    },
                    termSelect: WorkTerm,
                    termList: WorkTermList,
                  }}
                ></Card>
                <Card
                  select={SelectCard}
                  cardid={userIdentity == 'teacher' || userIdentity == 'manager'? "stu-all": "data"}
                  currentTerm={currentTerm}
                  currentClass={currentClass}
                  currentGrade={currentGrade}
                  height={userIdentity == 'teacher' || userIdentity == 'manager'? 250: 275}
                  component={userIdentity == 'teacher' || userIdentity == 'manager'? ClassAttainment: Data}
                  userIdentity={userIdentity}
                  identityCode={identityCode}
                  componentProps={{
                    onWeekSelect: (e) => {
                      setWeekData(e);
                    },
                    weekSelect: WeekData,
                    weekList: WeekList,
                    SubjectList: SubjectList,
                    Percentage: Percentage,
                    TeachPlan: TeachPlan,
                    ResView: ResView,
                  }}
                  loading={false}
                  // lock={
                  //   !(SubjectList instanceof Array && SubjectList.length > 0)
                  // }
                  data={true}
                ></Card>
              </div>
            </div>
            <div className="pd-provesion" style={{ ...getPX([1920, 58]) }}>
              {basePlatFormMsg && basePlatFormMsg.ProVersion}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      </Loading>
    </div>
  
    
    );
}

const mapStateToProps = (state) => {
  let { commonData } = state;
  return { ...commonData };
};
export default connect(mapStateToProps)(
  withRouter(memo(forwardRef(PersonalDetail)))
);
