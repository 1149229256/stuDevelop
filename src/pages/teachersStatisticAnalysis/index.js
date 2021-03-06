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
  // useImperativeHandle,
  useMemo,
  useRef,
  forwardRef,
  useLayoutEffect,
} from "react";
import {
  withRouter,
  // , Route, Switch, NavLink
} from "react-router-dom";
import $ from 'jquery';
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
// import canvg from "canvg";
import "./index.scss";
import ImportPage from "./importPage";
import ErrorCheck from "./errorCheck";
import BaseMsg from "./baseMsg";
import StuConditionMsg from "./StuConditionMsg";
import AttendanceMsg from "./attendanceMsg";
import HealthMsg from "./healthMsg";
import AwardAndPunish from "./awardAndPunish";
import SchoolLive from "./schoolLive";
import InformationizeAbility from "./informationizeAbility";
import AnalysisTop from "./analysisTop";
import { handleRoute, getQueryVariable } from "../../util/public";
import { Scrollbars } from "react-custom-scrollbars";
import Anchor from "../../component/anchor";
let { BasicProxy } = ipConfig;
function Analysis(props, ref) {
  let {
    tabid,
    tabname,
    children,
    param,
    termInfo: { TermInfo, HasHistory },
    roleMsg, //当前最高级用户信息，决定学校信息
    location,
    type,
    roleData, //多学校的用户信息，决定学校
    schoolMsg, //多学校的学校信息，由外部传
    levelHash,
    roleMsg: {identityCode},
    basePlatFormMsg: { ProVersion },
    contentHW: { height },
    userInfo: { UserType, SchoolID, UserID },
    isReflash
  } = props;
  console.log("档案", props)
  //用于强制刷新组件
  const [reflash, setReFlash] = useState(false);
  // 设置头部的类型
  const [topType, setTopType] = useState("default");
  // 设置路由路径，初始就设置
  const [Path, setPath] = useState([]);
  // 底部version高度
  const [bottomHeight, setBottomHeight] = useState(66);
  // 学期选择
  const [TermSelect, setTermSelect] = useState("");
  // 统计类型
  const [TypeSelect, setTypeSelect] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  // 获取头部高度,默认54
  const [topHeight, setTopHeight] = useState(54);
  // 获取锚点结构
  const [anchorList, setAnchorList] = useState([]);
  // 当是schoolDetail，设置当前的module
  const [ModuleID, setModuleID] = useState();
  
  //显示信息界面detail还是导入数据界面import还是纠错界面error,默认显示信息界面
  const [showType, setShowType] = useState("detail");

  //所有年级信息
  const [gradeList, setGradeList] = useState([]);
  //所有班级信息
  const [classList, setClassList] = useState([]);
  //老师管理的班级列表
  const [teacherClassList, setTeacherClassList] = useState([]);
  //学籍纠错列表
  const [checkList, setCheckList] = useState([]);
  //当前年级
  const [currentGrade, setCurrentGrade] = useState("");
  //当前班级
  const [currentClass, setCurrentClass] = useState("");
  //刷新纠错信息
  const [reflashError, setReflashError] = useState(false);
  //判断当前身份类型
  // const [userIdentity, setUserIdentity] = useState("student");
  //manager：管理员; student：学生；teacher：教师
  //能进来的都默认为管理员
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
  //测试身份
  // userIdentity = 'student';
  // userIdentity = 'teacher';
  // userIdentity = 'manager';
  useLayoutEffect(()=>{
    //获取全部年级信息
    // if(userIdentity != "manager"){
    //   return;
    // }
    let url = BasicProxy + "/api/base/GetGradeInfoList_Univ?schoolId=" + SchoolID;
    fetch
    .get({ url, securityLevel: 2 })
    .then((res) => res.json())
    .then((json) => {
      if(json.status == 200){
        setGradeList(json.data);
        // json.data[0] && setCurrentGrade(json.data[0].gradeId)
      }
    })
    //获取全部班级信息
    url = BasicProxy + "/api/base/getClassInfoList?schoolId=" + SchoolID;
    fetch
    .get({ url, securityLevel: 2 })
    .then((res) => res.json())
    .then((json) => {
      if(json.status == 200){
        setClassList(json.data);
        // json.data[0] && setCurrentClass(json.data[0].classId)
      }
    })
  }, [userIdentity])
  useLayoutEffect(()=>{
    //获取老师管理的所有班级信息
    if(userIdentity != "teacher"){
      return;
    }
    let url = BasicProxy + "/api/base/getClassByMasterId?teacherId=" + UserID;
    fetch
    .get({ url, securityLevel: 2 })
    .then((res) => res.json())
    .then((json) => {
      if(json.status == 200){
        setTeacherClassList(json.data);
        sessionStorage.setItem("classList", JSON.stringify(json.data));
        json.data[0] && setCurrentGrade(json.data[0].gradeId);
        if(!currentClass && json.data[0]){
          setCurrentClass(json.data[0].classId);
        } 
      }
    })
  }, [userIdentity, UserID, currentClass])
  //将svg转化为canvas，便于html2canvas识别
  // useEffect(()=>{
  //   //以下是对svg的处理
  //   var svgElem = $("#Frame").find('svg');
  //   console.log(svgElem);
  //   svgElem.each((index, node) => {
  //       //获取svg的父节点
  //       var parentNode = node.parentNode;
  //       //获取svg的html代码
  //       var svg = node.outerHTML.trim();
  //       //创建一个<canvas>，用于放置转换后的元素
  //       var canvas = document.createElement('canvas');
  //       //将svg元素转换为canvas元素
  //       canvg(canvas, svg);
  //       //设置新canvas元素的位置
  //       if (node.style.position) {
  //           canvas.style.position += node.style.position;
  //           canvas.style.left += node.style.left;
  //           canvas.style.top += node.style.top;
  //       }
    
  //       //删除svg元素
  //       parentNode.removeChild(node);
  //       //增加canvas元素
  //       parentNode.appendChild(canvas);
  //   });
  // }, [currentClass, currentGrade, currentTerm, userIdentity]);
  //用于导入数据成功后刷新组件
  useEffect(()=>{
    reflash && setReFlash(false);
  }, [reflash]);
  //用于主动刷新后刷新组件
  useEffect(()=>{
    isReflash && setReFlash(!reflash);
  }, [isReflash]);
  const { schoolID, collegeID, selectLevel, productLevel } = useMemo(() => {
    let role = roleMsg;
    // module为使用roleData，不然就使用roleMsg
    if (type === "school") {
      role = roleData;
      setTopType("school");
    }
    return role;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  // console.log({ schoolID, collegeID, selectLevel, productLevel });
  // 头部ref
  const topRef = useRef({});
  // contentref
  const anchorRef = useRef(null);
  const scrollRef = useRef(null);
  useEffect(() => {
    tabid && setModuleID(tabid);
  }, [tabid, showType]);
  // useEffect(() => {
  //   // 挂载的时候观察路由
  //   let Path = handleRoute(location.pathname);
  //   setPath(Path);
  //   if (Path[0] === "schoolResource" && Path[1]) {
  //     //学校详情
  //     // 需要获取学校详情请求
  //     setTopType("school");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  let updateTermList = TermInfo.map((child) => ({
    value: JSON.stringify({
      termId: child.termInfo,
      schoolId: child.schoolId,
      startDate: child.startDate,
      endDate: child.endDate,
      termName: child.termName
    }),
    title: child.termName,
  }));
  console.log("顶部信息", topRef.current);
  console.log(currentClass);
  
  return (
    <div className="Analysis">
      {
        showType == 'detail'?
        <div>
          <AnalysisTop
          // type={Path[0] === "schoolDetail" ? "module" : "tab"}
          getHeight={(height) => {
            // console.log(height);
            setTopHeight(height);
          }}
          setShowType={setShowType}
          className={"AnalysisTop"}
          onTermChange={(e) => {
            setTermSelect(e);
          }}
          onTypeChange={(e) => {
            setTypeSelect(e);
            setModuleID(e.value)
          }}
          onGradeChange={(e) => {
            setCurrentGrade(e);
          }}
          onClassChange={(e) => {
            setCurrentClass(e);
          }}
          termlist={TermInfo.map((child) => ({
            value:JSON.stringify({
              termId: child.termInfo,
              schoolId: child.schoolId,
              startDate: child.startDate,
              endDate: child.endDate,
              termName: child.termName
            }),
            title: child.termName,
          }))}
          ref={topRef}
          type={topType}
          setReFlash={setReFlash}
          schoolMsg={schoolMsg}
          gradeList={gradeList}
          classList={classList}
          ModuleID={ModuleID}
          teacherClassList={teacherClassList}
          userIdentity={userIdentity}
        ></AnalysisTop>

        <div
          className="analysis-content"
          style={{ height: height - topHeight + "px" }}
        >
          <Scrollbars
            className="analysis-scroll"
            ref={scrollRef}
            onUpdate={(value) => {
              anchorRef.current && anchorRef.current.onScroll();
            }}
          >
            <div
              className="content-box"
              style={{ minHeight: height - topHeight - bottomHeight + "px" }}
            >
              {ModuleID === "stuStatusMsg" ? (
                <BaseMsg
                  onAnchorComplete={(anchor) => {
                    // console.log(anchor);
                    setAnchorList(anchor);
                  }}
                  currentGrade={topRef.current? topRef.current.currentGrade: currentGrade}
                  currentClass={topRef.current? topRef.current.currentClass: currentClass}
                  schoolID={schoolID}
                  collegeID={collegeID}
                  productLevel={productLevel}
                  selectLevel={selectLevel}
                  productMsg={levelHash[productLevel]}
                  setShowType={setShowType}
                  setCheckList={setCheckList}
                  gradeList={gradeList}
                  reflashError={reflashError}
                  term={topRef.current? topRef.current.TermSelect: updateTermList[0]}
                  userIdentity={userIdentity}
                  reflash={reflash}
                ></BaseMsg>
              ) : (
                ""
              )}
              {ModuleID === "stuConditionMsg" ? (
                <StuConditionMsg
                  onAnchorComplete={(anchor) => {
                    // console.log(anchor);
                    setAnchorList(anchor);
                  }}
                  schoolID={schoolID}
                  collegeID={collegeID}
                  productLevel={productLevel}
                  selectLevel={selectLevel}
                  productMsg={levelHash[productLevel]}
                  term={topRef.current? topRef.current.TermSelect: updateTermList[0]}
                  userIdentity={userIdentity}
                  currentGrade={topRef.current? topRef.current.currentGrade: currentGrade}
                  currentClass={topRef.current? topRef.current.currentClass: currentClass}
                  reflash={reflash}
                ></StuConditionMsg>
              ) : (
                ""
              )}
              {ModuleID === "attendanceMsg" ? (
                <AttendanceMsg
                  onAnchorComplete={(anchor) => {
                    // console.log(anchor);
                    setAnchorList(anchor);
                  }}
                  schoolID={schoolID}
                  collegeID={collegeID}
                  productLevel={productLevel}
                  selectLevel={selectLevel}
                  productMsg={levelHash[productLevel]}
                  term={topRef.current? topRef.current.TermSelect: updateTermList[0]}
                  userIdentity={userIdentity}
                  currentGrade={topRef.current? topRef.current.currentGrade: currentGrade}
                  currentClass={topRef.current? topRef.current.currentClass: currentClass}
                  reflash={reflash}
                ></AttendanceMsg>
              ) : (
                ""
              )}
              {ModuleID === "healthMsg" ? (
                <HealthMsg
                  onAnchorComplete={(anchor) => {
                    // console.log(anchor);
                    setAnchorList(anchor);
                  }}
                  schoolID={schoolID}
                  collegeID={collegeID}
                  productLevel={productLevel}
                  selectLevel={selectLevel}
                  productMsg={levelHash[productLevel]}
                  term={topRef.current? topRef.current.TermSelect: updateTermList[0]}
                  userIdentity={userIdentity}
                  currentGrade={topRef.current? topRef.current.currentGrade: currentGrade}
                  currentClass={topRef.current? topRef.current.currentClass: currentClass}
                  reflash={reflash}
                ></HealthMsg>
              ) : (
                ""
              )}
              {ModuleID === "awardAndPunish" ? (
                <AwardAndPunish
                  onAnchorComplete={(anchor) => {
                    // console.log(anchor);
                    setAnchorList(anchor);
                  }}
                  currentGrade={topRef.current? topRef.current.currentGrade: currentGrade}
                  currentClass={topRef.current? topRef.current.currentClass: currentClass}
                  schoolID={schoolID}
                  collegeID={collegeID}
                  productLevel={productLevel}
                  selectLevel={selectLevel}
                  productMsg={levelHash[productLevel]}
                  term={topRef.current? topRef.current.TermSelect: updateTermList[0]}
                  userIdentity={userIdentity}
                  reflash={reflash}
                ></AwardAndPunish>
              ) : (
                ""
              )}
              {ModuleID === "schoolLiveMsg" ? (
                <SchoolLive
                  onAnchorComplete={(anchor) => {
                    // console.log(anchor);
                    setAnchorList(anchor);
                  }}
                  schoolID={schoolID}
                  collegeID={collegeID}
                  productLevel={productLevel}
                  selectLevel={selectLevel}
                  productMsg={levelHash[productLevel]}
                  term={topRef.current? topRef.current.TermSelect: updateTermList[0]}
                  userIdentity={userIdentity}
                  currentGrade={topRef.current? topRef.current.currentGrade: currentGrade}
                  currentClass={topRef.current? topRef.current.currentClass: currentClass}
                  reflash={reflash}
                ></SchoolLive>
              ) : (
                ""
              )}
            </div>
            <p className="ProVersion">{ProVersion}</p>
          </Scrollbars>
        </div>
        <Anchor
          ref={anchorRef}
          bottomheight={bottomHeight}
          list={anchorList}
          scrollref={scrollRef}
        ></Anchor>
        </div>
        :
        showType == 'import'?
        <ImportPage 
        currentGrade={topRef.current? topRef.current.currentGrade: currentGrade}
        currentClass={topRef.current? topRef.current.currentClass: currentClass}
        setShowType={setShowType}
        ModuleID={ModuleID}
        />:
        showType == 'error'?
        <ErrorCheck
        checkList={checkList}
        currentGrade={topRef.current? topRef.current.currentGrade: currentGrade}
        currentClass={topRef.current? topRef.current.currentClass: currentClass}
        setShowType={setShowType}
        reflashError={reflashError}
        setReflashError={setReflashError}
        ModuleID={ModuleID}
        />:
        ""
      }
      
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: { roleMsg, basePlatFormMsg, contentHW, termInfo, levelHash, userInfo, isReflash },
  } = state;
  return { roleMsg, basePlatFormMsg, contentHW, termInfo, levelHash, userInfo, isReflash };
};
export default connect(mapStateToProps)(withRouter(memo(forwardRef(Analysis))));
