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
import { Empty, Modal } from '@/component/common';
import Table from '@/component/tableList';
import $ from 'jquery';
import "./index.scss";
import Bar from "../../../component/bar";
import {
  getTeacherCount,
  getHonorTeacher,
  getTeacherAge,
  getTeacherEduAndTitle,
} from "../../../api/baseMsg";
import Scrollbars from "react-custom-scrollbars";
import MyInput from '@/component/input';
import StuStatusCount from "./stuStatusCount";
import TeaStatusCount from "./teaStatusCount";
import Track from "../../../component/Track";
import StuStatistic from "./stuStatiscModal";
import HistoryModal from "../historyModal";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
import { message } from "antd";

let { BasicProxy } = ipConfig;
function BaseMsg(props, ref) {
  // *selectLevel:这里的selectLevel与用户的没关系，与看的级别有关，例如教育局的看学校的，selectLevel===2
  // *productLevel:产品类型，给用户看的界面类型，用来控制界面的一些属性：1教育局，2大学学校，3教育局学校，4大学学院，
  // *product:包含该productLevel的所有信息,有使用组件者使用productLevel和commonData的levelHash匹配使用，必须传，不传将出问题
  let {
    term,
    HasHistory,
    onAnchorComplete,
    schoolID,
    collegeID,
    productMsg,
    userIdentity,
    userInfo: {UserID, SchoolID},
    currentClass,
    currentGrade,
    reflash,
    setShowType,
    setCheckList,
    checkList,
    reflashError
  } = props;
  const selectLevel = 2;
  // const { selectLevel } = productMsg;
  // 教师人数
  const [teacherCount, setTeacherCount] = useState(false);
  const [teacherFamous, setTeacherFamous] = useState(false);
  const [teacherAge, setTeacherAge] = useState(false);
  const [teacherEduAndTitle, setTeacherEduAndTitle] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectStudentList, setSelectStudentList] = useState([]);
  //单个学生详情数据
  const [stuStatistic, setStuStatistic] = useState([]);
  //控制模态框显示内容
  const [modalShowType, setModalShowType] = useState(userIdentity == "student"? "detail": "list");
  // 弹框
  const [visible, setVisible] = useState(false);
  const [courseVisible, setCourseVisible] = useState(false);
  const [recordVisible, setRecordVisible] = useState(false);
  //学生学籍信息
  const [userStatus, setUserStatus] = useState({});
  //学习经历
  const [studyList, setStudyList] = useState([]);
  //家庭成员信息
  const [familyList, setFamilyList] = useState([]);
  //轨迹信息
  const [trackInfo, setTrackInfo] = useState([]);
  const [trackVisible, setTrackVisible] = useState(true);

  //纠错审核信息
  const [statisticCheckList, setStatisticCheckList] = useState([]);

  const tableHeader = [
    {
      key: "studentName",
      name: "姓名"
    },
    {
      key: "gender",
      name: "性别"
    },
    {
      key: "nativePlace",
      name: "籍贯"
    },
    {
      key: "dateOfBirth",
      name: "出生日期"
    },
    {
      key: "studyingWay",
      name: "就读方式"
    },
    {
      key: "isPoor",
      name: "是否贫困生"
    },
    {
      key: "isLeftbehindchild",
      name: "是否留守儿童"
    },
    {
      key: "identityNum",
      name: "身份证号码"
    }
  ]
  //学籍所有字段ref
  const stuNameRef = useRef(null);
  const censusPlaceRef = useRef(null);
  const classIdRef = useRef(null);
  const classNameRef = useRef(null);
  const dateOfBirthRef = useRef(null);
  const errorCorrectionRef = useRef(null);
  //额外信息
  const extraInfoRef = useRef(null);

  const formerNameRef = useRef(null);
  const genderRef = useRef(null);
  const gradeIdRef = useRef(null);
  const gradeNameRef = useRef(null);
  //监护人信息
  const guardianListRef = useRef(null);

  const homeAddressRef = useRef(null);
  const identityNumRef = useRef(null);
  const isAcceptpreschoolRef = useRef(null);
  const isLeftbehindchildRef = useRef(null);
  const isOnlychildRef = useRef(null);
  const isPoorRef = useRef(null);
  const nationRef = useRef(null);
  const nationalityRef = useRef(null);
  const overseaPeopleRef = useRef(null);
  const studentIdRef = useRef(null);
  const studentNameRef = useRef(null);
  const studyingWayRef = useRef(null);
  const schoolIdRef = useRef(null);
  const martyrChildRef = useRef(null);
  const lowProtectRef = useRef(null);
  const postalCodeRef = useRef(null);
  const nativePlaceRef = useRef(null);
  const isParentWorkRef = useRef(null);
  const takeCareRef = useRef(null);
  const isLowBadRef = useRef(null);
  const isFiveRef = useRef(null);
  const classNumRef = useRef(null);

  const hobbitRef = useRef(null);
  const bitrhPlaceRef = useRef(null);
  const studyLowProtectRef = useRef(null);
  const disasterStatusRef = useRef(null);
  const inSchoolWayRef = useRef(null);
  const politicRef = useRef(null);

  const indexAddrRef = useRef(null);
  const moneyFromRef = useRef(null);
  const identityTypeRef = useRef(null);
  const nowLiveRef = useRef(null);
  const connectAddrRef = useRef(null);
  const faimlyNumRef = useRef(null);
  const nameRef = useRef(null);
  const relationshipRef = useRef(null);
  const serviceUnitRef = useRef(null);
  const telRef = useRef(null);
  const changeItemRef = useRef(null);
  const userIdRef = useRef(null);

  const semesterStartTimeRef = useRef(null);
  const semesterEndTimeRef = useRef(null);
  const schoolRef = useRef(null);
  const learningContentRef = useRef(null);
  const dutyRef = useRef(null);
  const certifierRef = useRef(null);
  const birthPlaceRef = useRef(null);

  const identityTimeRef = useRef(null);
  const badManRef = useRef(null);
  const trafficWayRef = useRef(null);
  const notWorkRef = useRef(null);
  const badTypeRef = useRef(null);
  const readTypeRef = useRef(null);
  const onlyOneRef = useRef(null);

  const isbadestRef = useRef(null);
  const healthTypeRef = useRef(null);
  const nameChineseRef = useRef(null);
  const cityWorkRef = useRef(null);
  const emailRef = useRef(null);
  const isHelpRef = useRef(null);
  const isTakeBusRef = useRef(null);
  const followClassRef = useRef(null);
  const isSoldierRef= useRef(null);
  const isDisasterRef = useRef(null);
  const isHaveOneRef = useRef(null);
  const isHavePatientRef = useRef(null);
  const debtReasonRef = useRef(null);
  const stuFromRef = useRef(null);
  const faimlyMoneyRef = useRef(null);
  const telphoneRef = useRef(null);
  const ableManRef = useRef(null);
  const debtNumRef = useRef(null);
  const inSchoolRef = useRef(null);
  const schoolDistanceRef = useRef(null);
  const nationPlaceRef = useRef(null);
  // const isLeftbehindchildRef = useRef(null);
  // const isOnlychildRef = useRef(null);
  // const isPoorRef = useRef(null);
  //向上传bar的信息
  // const [anchorList, setAnchorList] = useState([]);
  // 获取每一块的ref，实现锚点功能
  const countRef = useRef(null);
  const myStatusRef = useRef(null);
  const statusTrackRef = useRef(null);
  const attendanceTrack = useRef(null);
  const search = () => {
    //搜索
    let keyowrd = $('.search-input').val();
    
  }
  useLayoutEffect(() => {
    // setAnchorList();
    let arr = [];
    if(userIdentity == "student"){
      arr = [
        { ref: myStatusRef.current, name: "我的学籍" },
        { ref: statusTrackRef.current, name: "学籍轨迹" },
      ]
    } else {
      arr = [
        { ref: countRef.current, name: "学籍统计" },
        { ref: statusTrackRef.current, name: "学籍轨迹" },
      ]
    }
    typeof onAnchorComplete === "function" &&
      onAnchorComplete(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 初始请求
  //获取轨迹信息
  useLayoutEffect(() => {
    if(userIdentity == "teacher" && !currentClass){
      return;
    }
    setTrackVisible(true);
    let url = BasicProxy + "/api/status/record?type=" +
    (
      userIdentity == "student"?
      1:
      userIdentity == "manager"?
      currentClass?
      2:
      currentGrade?
      3:
      4:
      2
    ) +
    "&studentId=" + (userIdentity == "student"?UserID: "") +
    "&classId=" + currentClass +
    "&gradeId=" + currentGrade +
    "&schoolId=" + SchoolID;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        setTrackInfo(result.data);
      }
      setTrackVisible(false);
    })
  }, [userIdentity, currentGrade, currentClass, UserID, SchoolID, reflash])
  //获取学生自身学籍信息
  useLayoutEffect(()=>{
    if(userIdentity != "student"){
      return;
    }
    let url = BasicProxy + "/api/status/student?studentId=" + UserID;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
            result.data.resumeJson = JSON.parse(result.data.resume);
            result.data.guardianJson = JSON.parse(result.data.guardian);
            result.data.extraInfoJson = JSON.parse(result.data.extraInfo);
            if(Array.isArray(result.data.resumeJson)){
              setStudyList(result.data.resumeJson);
            }
            if(Array.isArray(result.data.guardianJson)){
              setFamilyList(result.data.guardianJson);
            }
            
            setUserStatus(result.data);
        }
    })
  }, [UserID, userIdentity, reflash])
  //如果是老师则先获取学生列表
  useLayoutEffect(() => {
    if(userIdentity == "teacher" && currentClass){
      let url = BasicProxy + "/api/base/getStudentInfo?schoolId=" +
      SchoolID +
      "&gradeId=" + currentGrade +
      "&classId=" + currentClass;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
              setStudentList(result.data);
              setSelectStudentList(result.data);
          }
      })
      
      //如果是老师就查询是否有学籍审核
      url = BasicProxy + "/api/status/student/correction?classId=" + currentClass;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
        if(result.status == 200 && Array.isArray(result.data)){
          setStatisticCheckList(result.data);
          setCheckList(result.data);
        }
      })
    }
  }, [userIdentity, UserID, currentClass, currentGrade, term, reflash, reflashError])
  //获取弹出框详细信息
  useLayoutEffect(() => {
    if(userIdentity != "student"){
      return;
    }
    let termInfo = term && term.value? JSON.parse(term.value): {};
    let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
    let classGradeId = "";
    classList.forEach((item)=>{
        if(item.classId == currentClass){
            classGradeId = item.gradeId;
        }
    })
    let url = BasicProxy + "/api/learning2/exam/scoreRank?type=1" + 
    "&studentId=" + UserID +
    "&classId=" + currentClass +
    "&gradeId=" + classGradeId +
    "&schoolId=" + SchoolID +
    "&termId=" + termInfo.termId +
    "&examType=3" +
    "&start=" + (termInfo.startDate? termInfo.startDate.substr(0, 10): "") +
    "&end=" + (termInfo.endDate? termInfo.endDate.substr(0, 10): "");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
            setStuStatistic(result.data);
        }
    })     
  }, [term, currentClass, currentGrade, userIdentity, UserID, reflash]);
  //增删学习经历
  const operateStudyList = (type, index) => {
    let arr = [];
    studyList.forEach((item)=>{
      arr.push(item);
    })
    if(type == "add"){
      arr.push({
        changeItem: 1
      });
    }
    if(type == "delete"){
      arr.splice(index, 1);
    }
    setStudyList(arr);
  }
  //增删家庭成员
  const operateFamilyList = (type, index) => {
    let arr = [];
    familyList.forEach((item)=>{
      arr.push(item);
    })
    if(type == "add"){
      arr.push({
        changeItem: 1
      });
    }
    if(type == "delete"){
      arr.splice(index, 1);
    }
    setFamilyList(arr);
  }
  //发起纠错申请
  const sendStatus = () => {
    let stuName = stuNameRef.current.isUpdate? stuNameRef.current.value: undefined;
    let censusPlace = censusPlaceRef.current.isUpdate? censusPlaceRef.current.value: undefined;
    let className = classNameRef.current.isUpdate? classNameRef.current.value: undefined;
    let dateOfBirth = dateOfBirthRef.current.isUpdate? dateOfBirthRef.current.value: undefined;
    let extraInfo = {
      "身份证件有效期": identityTimeRef.current.isUpdate? identityTimeRef.current.value: undefined,
      "残疾人类型": badManRef.current.isUpdate? badManRef.current.value: undefined,
      "上下学交通方式": trafficWayRef.current.isUpdate? trafficWayRef.current.value: undefined,
      "家庭失业人数": notWorkRef.current.isUpdate? notWorkRef.current.value: undefined,
      "困难程度": badTypeRef.current.isUpdate? badTypeRef.current.value: undefined,
      "是否随班就读": followClassRef.current.isUpdate? followClassRef.current.value: undefined,
      "是否孤儿": onlyOneRef.current.isUpdate? onlyOneRef.current.value: undefined,
      "是否经民政部门确认的农村特困救助范围的家庭子女": isbadestRef.current.isUpdate? isbadestRef.current.value: undefined,
      "健康状况": healthTypeRef.current.isUpdate? healthTypeRef.current.value: undefined,
      "姓名拼音": nameChineseRef.current.isUpdate? nameChineseRef.current.value: undefined,
      "是否进城务工人员随迁子女": cityWorkRef.current.isUpdate? cityWorkRef.current.value: undefined,
      "电子邮箱": emailRef.current.isUpdate? emailRef.current.value: undefined,
      "是否需要申请资助": isHelpRef.current.isUpdate? isHelpRef.current.value: undefined,
      "是否需要乘坐校车": isTakeBusRef.current.isUpdate? isTakeBusRef.current.value: undefined,
      "是否军烈属": isSoldierRef.current.isUpdate? isSoldierRef.current.value: undefined,
      "家庭是否遭受自然灾害": isDisasterRef.current.isUpdate? isDisasterRef.current.value: undefined,
      "是否享受一补": isHaveOneRef.current.isUpdate? isHaveOneRef.current.value: undefined,
      "家中是否有大病患者": isHavePatientRef.current.isUpdate? isHavePatientRef.current.value: undefined,
      "欠债原因": debtReasonRef.current.isUpdate? debtReasonRef.current.value: undefined,
      "学生来源": stuFromRef.current.isUpdate? stuFromRef.current.value: undefined,
      "家庭年收入": faimlyMoneyRef.current.isUpdate? faimlyMoneyRef.current.value: undefined,
      "联系电话": telphoneRef.current.isUpdate? telphoneRef.current.value: undefined,
      "具备劳动力人数": ableManRef.current.isUpdate? ableManRef.current.value: undefined,
      "家庭欠债金额": debtNumRef.current.isUpdate? debtNumRef.current.value: undefined,
      "入学年月": inSchoolRef.current.isUpdate? inSchoolRef.current.value: undefined,
      "上下学距离（千米）": schoolDistanceRef.current.isUpdate? schoolDistanceRef.current.value: undefined,
      "是否烈士或优抚子女": martyrChildRef.current.isUpdate? martyrChildRef.current.value: undefined,
      "是否低保":  lowProtectRef.current.isUpdate? lowProtectRef.current.value: undefined,
      "邮政编号":  postalCodeRef.current.isUpdate? postalCodeRef.current.value: undefined,
      "是否父母丧失劳动能力": isParentWorkRef.current.isUpdate? isParentWorkRef.current.value: undefined,
      "赡养人口": takeCareRef.current.isUpdate? takeCareRef.current.value: undefined,
      "是否农村绝对贫困家庭": isLowBadRef.current.isUpdate? isLowBadRef.current.value: undefined,
      "家庭是否五保户": isFiveRef.current.isUpdate? isFiveRef.current.value: undefined,
      "班内学号": classNumRef.current.isUpdate? classNumRef.current.value: undefined,
      "特长": hobbitRef.current.isUpdate? hobbitRef.current.value: undefined,
      "出生地": birthPlaceRef.current.isUpdate? birthPlaceRef.current.value: undefined,
      "就学地低保线": studyLowProtectRef.current.isUpdate? studyLowProtectRef.current.value: undefined,
      "自然灾害具体情况描述": disasterStatusRef.current.isUpdate? disasterStatusRef.current.value: undefined,
      "入学方式": inSchoolWayRef.current.isUpdate? inSchoolWayRef.current.value: undefined,
      "政治面貌": politicRef.current.isUpdate? politicRef.current.value: undefined,
      "主页地址": indexAddrRef.current.isUpdate? indexAddrRef.current.value: undefined,
      "主要收入来源": moneyFromRef.current.isUpdate? moneyFromRef.current.value: undefined,
      "身份证件类型": identityTypeRef.current.isUpdate? identityTypeRef.current.value: undefined,
      "现住址": nowLiveRef.current.isUpdate? nowLiveRef.current.value: undefined,
      "通讯地址": connectAddrRef.current.isUpdate? connectAddrRef.current.value: undefined,
      "家庭人口":  faimlyNumRef.current.isUpdate? faimlyNumRef.current.value: undefined
    };
    //曾用名
    let formerName = formerNameRef.current.isUpdate? formerNameRef.current.value: undefined;
    let gender = genderRef.current.isUpdate? genderRef.current.value: undefined;
    let gradeName = gradeNameRef.current.isUpdate? gradeNameRef.current.value: undefined;
    let homeAddress = homeAddressRef.current.isUpdate? homeAddressRef.current.value: undefined;
    let identityNum = identityNumRef.current.isUpdate? identityNumRef.current.value: undefined;
    let isAcceptpreschool = isAcceptpreschoolRef.current.isUpdate? isAcceptpreschoolRef.current.value: undefined;
    let isLeftbehindchild = isLeftbehindchildRef.current.isUpdate? isLeftbehindchildRef.current.value: undefined;
    let isOnlychild = isOnlychildRef.current.isUpdate? isOnlychildRef.current.value: undefined;
    // let isPoor = isPoorRef.current.value: undefined;
    let nation = nationRef.current.isUpdate? nationRef.current.value: undefined;
    let nationality = nationalityRef.current.isUpdate? nationalityRef.current.value: undefined;
    let nativePlace = nativePlaceRef.current.isUpdate? nativePlaceRef.current.value: undefined;
    let overseaPeople = overseaPeopleRef.current.isUpdate? overseaPeopleRef.current.value: undefined;
    // let schoolId = schoolIdRef.current.value: undefined;
    let studentId = studentIdRef.current.isUpdate? studentIdRef.current.value: undefined;
    let studyingWay = studyingWayRef.current.isUpdate? studyingWayRef.current.value: undefined;
    let guardianList = [];
    let resumeList = [];
    //学习经历和家庭成员信息数据需要额外处理，通过遍历dom获取数据
    $(".studyList>div").each((index, item)=>{
      let obj = {};
      obj.certifier = $(item).find('.certifier').text();
      obj.duty = $(item).find('.duty').text();
      obj.learningContent = $(item).find('.learningContent').text();
      obj.semesterEndTime = $(item).find('.semesterEndTime').text();
      obj.semesterStartTime = $(item).find('.semesterStartTime').text();
      obj.school = $(item).find('.school').text();
      resumeList.push(obj);
    })
    $(".familyList>div").each((index, item)=>{
      let obj = {};
      obj.address = $(item).find('.address').text();
      obj.censusPlace = $(item).find('.censusPlace').text();
      obj.idCardNum = $(item).find('.idCardNum').text();
      obj.idCardType = $(item).find('.idCardType').text();
      obj.isGuardian = $(item).find('.isGuardian').text();
      obj.name = $(item).find('.name').text();
      obj.nation = $(item).find('.nation').text();
      obj.position = $(item).find('.position').text();
      obj.relationship = $(item).find('.relationship').text();
      obj.serviceUnit = $(item).find('.serviceUnit').text();
      obj.tel = $(item).find('.tel').text();
      guardianList.push(obj);
    })
    let params = {
      censusPlace,
      dateOfBirth,
      // errorCorrection,
      gender,
      gradeName,
      className,
      extraInfo,
      formerName,
      guardianList: JSON.stringify(guardianList),
      // guardianList,
      homeAddress,
      identityNum,
      isAcceptpreschool,
      isLeftbehindchild,
      isOnlychild,
      // isPoor,
      nation,
      nationality,
      nativePlace,
      overseaPeople,
      resumeList: JSON.stringify(resumeList),
      // resumeList,
      studentId,
      studentName: stuName,
      studyingWay,
    }
    let extraInfocount = 0, paramsCount = 0;
    for(let x in extraInfo){
      if(typeof extraInfo[x] == "undefined"){
        delete extraInfo[x];
      } else {
        extraInfocount++;
      }
    }
    if(extraInfocount < 1){
      params.extraInfo = undefined;
    }
    for(let x in params){
      if(typeof params[x] == "undefined"){
        delete params[x];
      } else {
        paramsCount++;
      }
    }
    // console.log(paramsCount, guardianList.length, resumeList.length)
    if(paramsCount < 3 && guardianList.length == 0 && resumeList.length == 0){
      message.destroy();
      message.config({
        rtl: false,
        getContainer: ()=>$(".body-container")[0]
      });
      message.warn("发起纠错申请失败，并未修改数据~");
      return;
    }
    console.log(params);
    let url = BasicProxy + "/api/status/student/correction";
    fetch
    .put({url, body: {
      studentId: UserID,
      jsonString: JSON.stringify(params)
    },  securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200){
        message.destroy();
        message.config({
          rtl: false,
          getContainer: ()=>document.body
        });
        message.success("纠错申请发起成功~");
        setRecordVisible(false);
      }
    })
  }
  //点击学生查看学生详细信息
  const setStudentInfo = (data) => {
    let url = BasicProxy + "/api/status/student?type=1" + 
    "&studentId=" + data.userId;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
            result.data.resumeJson = JSON.parse(result.data.resume);
            result.data.guardianJson = JSON.parse(result.data.guardian);
            result.data.extraInfoJson = JSON.parse(result.data.extraInfo);
            setStuStatistic(result.data);
            setModalShowType("detail");
        }
    })
  }
  return (
    <div className="BaseMsg" id="stuStatusMsg">
      {
        userIdentity == 'teacher' || userIdentity == 'manager'?
        <div>
          <Bar
          barName={"学籍统计"}
          ref={countRef}
          topContext={
            userIdentity != "manager"
              ?
                <div className="module-link-group">
                  <span onClick={()=>{
                    if(statisticCheckList.length > 0){
                      setShowType("error")
                    } else {
                      message.warn("暂无学籍纠错审核~");
                    }
                    
                  }}>
                    {
                      statisticCheckList.length > 0?
                      <i className="red-dot"></i>:
                      ""
                    }
                    
                    学籍纠错审核
                  </span>
                  {/* <span className="download">
                    下载模板
                  </span> */}
                  <span 
                  className="status"
                  onClick={()=>setVisible(true)}
                  >
                    查看学籍详情信息
                  </span>

                </div>
              : false
          }
          loading={false}
        >
          <TeaStatusCount
            data={teacherCount} 
            userIdentity={userIdentity}
            productMsg={productMsg}
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            reflash={reflash}
            statisticCheckList={statisticCheckList}
          ></TeaStatusCount>
        </Bar>
        <Bar 
        loading={trackVisible} 
        barName={"学籍轨迹"}
        ref={statusTrackRef}
        >
          <Track
          type="baseMsg"
          userIdentity={userIdentity}
          data={trackInfo}>
          </Track>
        </Bar>
        </div>:
        <div>
          <Bar
          barName={"我的学籍"}
          ref={myStatusRef}
          topContext={
            <div className="module-link-group">
              <span onClick={()=>setRecordVisible(true)}>
                <i className="errorlogo"></i>
                学籍纠错
              </span>
            </div>
          }
          loading={false}>
            <StuStatusCount
            userStatus={userStatus}
          ></StuStatusCount>
          </Bar>
          <Bar loading={trackVisible} barName={"学籍轨迹"} ref={statusTrackRef}>
            <Track
            type="baseMsg"
            userIdentity={userIdentity}
            data={trackInfo}>
            </Track>
          </Bar>
        </div>
      }
      <Modal
        type="1"
        title="变更档案信息"
        visible={recordVisible}
        onCancel={()=>setRecordVisible(false)}
        footer={null}
        width={1180}
        className="change-status"
        bodyStyle={{height: 650 + 'px', padding: 0}}
      >
        <Scrollbars
        autoHeight
        autoHeightMax={640}>
        <div className="body-container">
          <div>
            <MyInput 
            title="学生姓名"
            type="text"
            data={userStatus.studentName}
            width="25%"
            inputRef={stuNameRef}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="性别"
            type="list"
            inputRef={genderRef}
            data={userStatus.gender}
            list={["男", "女"]}
            width="25%"
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="出生日期"
            type="input"
            width="25%"
            inputRef={dateOfBirthRef}
            data={userStatus.dateOfBirth}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="出生地"
            type="input"
            width="25%"
            inputRef={birthPlaceRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["出生地"]}
            inputWidth={140}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="籍贯"
            type="input"
            width="25%"
            inputRef={nativePlaceRef}
            data={userStatus.nativePlace}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="民族"
            type="list"
            width="25%"
            list={["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族",
            "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
            "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族",
            "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族", "其它国外民族"]}
            inputRef={nationRef}
            data={userStatus.nation}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="国家/地区"
            type="list"
            width="25%"
            list={["中国", "美国", "俄罗斯", "日本", "英国", "韩国", "法国", "德国", "其它国家"]}
            inputRef={nationalityRef}
            data={userStatus.nationality}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="身份证件类型"
            type="input"
            width="25%"
            inputRef={identityTypeRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["身份证件类型"]}
            inputWidth={140}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="身份证件号码"
            type="input"
            width="50%"
            inputRef={identityNumRef}
            data={userStatus.identityNum}
            inputWidth={421}
            ></MyInput>
            <MyInput 
            title="港澳台侨胞"
            type="select"
            width="25%"
            inputRef={overseaPeopleRef}
            data={userStatus.overseaPeople}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="政治面貌"
            type="input"
            width="25%"
            inputRef={politicRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["政治面貌"]}
            inputWidth={140}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="健康状况"
            type="input"
            width="25%"
            inputRef={healthTypeRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["健康状况"]}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="姓名拼音"
            type="input"
            width="25%"
            inputRef={nameChineseRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["姓名拼音"]}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="曾用名"
            type="input"
            width="25%"
            inputRef={formerNameRef}
            data={userStatus.formerName}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="身份证件有效期"
            type="input"
            width="25%"
            inputRef={identityTimeRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["身份证件有效期"]}
            inputWidth={140}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="户口所在地"
            type="input"
            width="25%"
            inputRef={censusPlaceRef}
            data={userStatus.censusPlace}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="特长"
            type="input"
            width="75%"
            inputRef={hobbitRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["特长"]}
            inputWidth={702}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="学籍编号"
            type="text"
            width="25%"
            inputRef={studentIdRef}
            data={userStatus.studentId? userStatus.studentId: "--"}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="班内学号"
            type="input"
            width="25%"
            inputRef={classNumRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["班内学号"]}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="年级"
            type="text"
            width="25%"
            inputRef={gradeNameRef}
            data={userStatus.gradeName}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="班级"
            type="text"
            width="25%"
            inputRef={classNameRef}
            data={userStatus.className}
            inputWidth={140}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="入学年月"
            type="input"
            width="25%"
            inputRef={inSchoolRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["入学年月"]}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="入学方式"
            type="input"
            width="25%"
            inputRef={inSchoolWayRef}
            // list={["就近入学", "其他"]}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["入学方式"]}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="就读方式"
            type="list"
            width="25%"
            list={["寄宿", "走读"]}
            inputRef={studyingWayRef}
            data={userStatus.studyingWay}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="学生来源"
            type="input"
            width="25%"
            // list={["学区内", "本市学区外", "外地借读"]}
            inputRef={stuFromRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["学生来源"]}
            inputWidth={140}
            ></MyInput>
          </div>
          <div className="slice-line"></div>

          <div style={{marginTop: 16}}>
            <MyInput 
            title="现住址"
            type="input"
            width="50%"
            inputRef={nowLiveRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["现住址"]}
            inputWidth={421}
            ></MyInput>
            <MyInput 
            title="通信地址"
            type="input"
            width="50%"
            inputRef={connectAddrRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["通讯地址"]}
            inputWidth={421}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="家庭地址"
            type="input"
            width="50%"
            inputRef={homeAddressRef}
            data={userStatus.homeAddress}
            inputWidth={421}
            ></MyInput>
            <MyInput 
            title="联系电话"
            type="input"
            width="25%"
            inputRef={telphoneRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["联系电话"]}
            inputWidth={140}
            ></MyInput>
            <MyInput 
            title="邮政编码"
            type="input"
            width="25%"
            inputRef={postalCodeRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["邮政编号"]}
            inputWidth={140}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="电子邮箱"
            type="input"
            width="50%"
            inputRef={emailRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["电子邮箱"]}
            inputWidth={421}
            ></MyInput>
            <MyInput 
            title="主页地址"
            type="input"
            width="50%"
            inputRef={indexAddrRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["主页地址"]}
            inputWidth={421}
            ></MyInput>
          </div>
          <div className="slice-line"></div>
        
          <div style={{marginTop: 16}}>
            <MyInput 
            title="是否独生子女"
            type="select"
            inputRef={isOnlychildRef}
            data={userStatus.isOnlychild}
            width="22%"
            titleWidth={169}
            inputWidth={70}
            ></MyInput>
            <MyInput 
            title="是否受过学前教育"
            type="select"
            inputRef={isAcceptpreschoolRef}
            data={userStatus.isAcceptpreschool}
            width="25%"
            titleWidth={203}
            inputWidth={70}
            ></MyInput>
            <MyInput 
            title="是否留守儿童"
            type="select"
            inputRef={isLeftbehindchildRef}
            data={userStatus.isLeftbehindchild}
            width="25%"
            titleWidth={203}
            inputWidth={70}
            ></MyInput>
            <MyInput 
            title="是否进城务工人员随迁子女"
            type="select"
            inputRef={cityWorkRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否进城务工人员随迁子女"]}
            width="25%"
            titleWidth={203}
            inputWidth={70}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="是否孤儿"
            type="select"
            inputRef={onlyOneRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否孤儿"]}
            width="22%"
            titleWidth={169}
            inputWidth={70}
            ></MyInput>
            <MyInput 
            title="是否烈士或优抚子女"
            type="select"
            inputRef={martyrChildRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否烈士或优抚子女"]}
            width="25%"
            titleWidth={203}
            inputWidth={70}
            ></MyInput>
            <MyInput 
            title="是否随班就读"
            type="select"
            data="张三"
            width="25%"
            inputRef={followClassRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否随班就读"]}
            titleWidth={203}
            inputWidth={70}
            ></MyInput>
            <MyInput 
            title="是否需要申请资助"
            type="select"
            data="张三"
            width="25%"
            inputRef={isHelpRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否需要申请资助"]}
            titleWidth={203}
            inputWidth={70}
            ></MyInput>
          </div>
          <div style={{marginTop: 16}}>
            <MyInput 
            title="是否享受一补"
            type="select"
            data="张三"
            width="22%"
            inputRef={isHaveOneRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否享受一补"]}
            titleWidth={169}
            inputWidth={70}
            ></MyInput>
            <MyInput 
            title="残疾人类型"
            type="input"
            data="张三"
            width="78%"
            inputRef={badManRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["残疾人类型"]}
            titleWidth={203}
            inputWidth={632}
            ></MyInput>
          </div>
          <div className="slice-line"></div>
          
          <div className="study-record">
            <div className="record-title">
              学习经历:
            </div>
            <div className="list-container studyList" style={{width: (studyList.length == 0? "0": "")}}>
              {
                studyList.map((item, index)=>{
                  return (
                    <div className="record-list" key={index}>
                      <i className="deletelogo" onClick={()=>operateStudyList("delete", index)}></i>
                      <div>
                        <MyInput
                        title="学习起始时间"
                        type="input"
                        width="28%"
                        className="semesterEndTime"
                        data={item.semesterEndTime}
                        inputWidth={140} />
                        <MyInput
                        title="学习结束时间"
                        type="input"
                        width="28%"
                        className="semesterStartTime"
                        data={item.semesterStartTime}
                        inputWidth={140} />
                        <MyInput
                        title="学习单位"
                        type="input"
                        width="44%"
                        className="school"
                        data={item.school}
                        inputWidth={240} />
                      </div>
                      <div style={{marginTop: 16}}>
                        <MyInput
                        title="学习内容"
                        type="input"
                        width="28%"
                        className="learningContent"
                        data={item.learningContent}
                        inputWidth={140} />
                        <MyInput
                        title="担任职务"
                        type="input"
                        width="28%"
                        className="duty"
                        data={item.duty}
                        inputWidth={140} />
                        <MyInput
                        title="学习证明人"
                        type="input"
                        width="44%"
                        className="certifier"
                        data={item.certifier}
                        inputWidth={140} />
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div 
            className="add-record" 
            onClick={()=>operateStudyList("add")}
            style={{margin: (studyList.length == 0? "0": "")}}>
              新增学习经历
            </div>
          </div>
          <div className="slice-line"></div>

          <div>
            <MyInput
            title="上下学距离(千米)"
            type="input"
            titleWidth={155}
            inputRef={schoolDistanceRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["上下学距离（千米）"]}
            inputWidth={140} />
            <MyInput
            title="上下学交通方式"
            type="input"
            titleWidth={155}
            inputRef={trafficWayRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["上下学交通方式"]}
            inputWidth={140} />
            <MyInput
            title="是否需要乘坐校车"
            type="input"
            titleWidth={155}
            inputRef={isTakeBusRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否需要乘坐校车"]}
            inputWidth={140} />
          </div>
          <div className="slice-line"></div>

          <div className="family-info">
            <div className="family-title">
              家庭成员或监护人信息:
            </div>
            <div className="info-list-container familyList" style={{width: (familyList.length == 0? "0": "")}}>
              {
                familyList.map((item, index)=>{
                  return (
                    <div className="family-list" key={index}>
                      <i className="deletelogo" onClick={()=>operateFamilyList("delete", index)}></i>
                      <div>
                        <MyInput
                        title="姓名"
                        type="input"
                        className="name"
                        data={item.name}
                        titleWidth={110}
                        inputWidth={140} /> 
                        <MyInput
                        title="关系"
                        type="input"
                        className="relationship"
                        data={item.relationship}
                        titleWidth={118}
                        inputWidth={140} />
                        <MyInput
                        title="身份证件类型"
                        type="input"
                        className="idCardType"
                        data={item.idCardType}
                        titleWidth={118}
                        inputWidth={240} />
                      </div>
                      <div style={{marginTop: 16}}>
                        <MyInput
                        title="身份证件号码"
                        type="input"
                        className="idCardNum"
                        data={item.idCardNum}
                        titleWidth={110}
                        inputWidth={406} />
                        <MyInput
                        title="民族"
                        type="list"
                        className="nation"
                        list={["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族",
                        "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
                        "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族",
                        "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族", "其它国外民族"]}
                        data={item.nation}
                        titleWidth={118}
                        inputWidth={140} />
                      </div>
                      <div style={{marginTop: 16}}>
                        <MyInput
                        title="是否监护人"
                        type="select"
                        className="isGuardian"
                        data={item.isGuardian}
                        titleWidth={110}
                        inputWidth={140} />
                        <MyInput
                        title="户口所在地"
                        type="input"
                        className="censusPlace"
                        data={item.censusPlace}
                        titleWidth={118}
                        inputWidth={140} />
                        <MyInput
                        title="联系方式"
                        type="input"
                        className="tel"
                        data={item.tel}
                        titleWidth={118}
                        inputWidth={240} />
                      </div>
                      <div style={{marginTop: 16}}>
                        <MyInput
                        title="现住址"
                        type="input"
                        className="address"
                        data={item.address}
                        titleWidth={110}
                        inputWidth={773} />
                      </div>
                      <div style={{marginTop: 16}}>
                        <MyInput
                        title="工作单位"
                        type="input"
                        className="serviceUnit"
                        data={item.serviceUnit}
                        titleWidth={110}
                        inputWidth={406} />
                        <MyInput
                        title="职务"
                        type="input"
                        className="position"
                        data={item.position}
                        titleWidth={118}
                        inputWidth={240} />
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div 
            className="add-family-info" 
            onClick={()=>operateFamilyList("add")}
            style={{margin: (familyList.length == 0? "0": "")}}
            >
              新增家庭成员或监护人信息
            </div>
          </div>
          <div className="slice-line"></div>
          <div>
            <MyInput
            title="家庭人口"
            type="input"
            inputRef={faimlyNumRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["家庭人口"]}
            titleWidth={137}
            inputWidth={120} />
            <MyInput
            title="赡养人口"
            type="input"
            inputRef={takeCareRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["赡养人口"]}
            titleWidth={123}
            inputWidth={120} />
            <MyInput
            title="家庭年收入"
            type="input"
            inputRef={faimlyMoneyRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["家庭年收入"]}
            titleWidth={123}
            inputWidth={120} />
            <MyInput
            title="主要收入来源"
            type="input"
            inputRef={moneyFromRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["主要收入来源"]}
            titleWidth={123}
            inputWidth={120} />
          </div>
          <div style={{marginTop: 16}}>
            <MyInput
            title="具备劳动力人数"
            type="input"
            inputRef={ableManRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["具备劳动力人数"]}
            titleWidth={137}
            inputWidth={120} />
            <MyInput
            title="是否低保"
            type="select"
            inputRef={lowProtectRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否低保"]}
            titleWidth={123}
            inputWidth={120} />
            <MyInput
            title="就学地低保线"
            type="input"
            inputRef={studyLowProtectRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["就学地低保线"]}
            titleWidth={123}
            inputWidth={120} />
            <MyInput
            title="困难程度"
            type="input"
            inputRef={badTypeRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["困难程度"]}
            titleWidth={123}
            inputWidth={120} />
          </div>
          <div style={{marginTop: 16}}>
            <MyInput
            title="是否父母丧失劳动能力"
            type="select"
            inputRef={isParentWorkRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否父母丧失劳动能力"]}
            titleWidth={179}
            inputWidth={90} />
            <MyInput
            title="是否农村绝对贫困家庭"
            type="select"
            inputRef={isLowBadRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否农村绝对贫困家庭"]}
            titleWidth={175}
            inputWidth={90} />
            <MyInput
            title="是否经民政部门确认的农村特困救助范围的家庭子女"
            type="select"
            inputRef={isbadestRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]}
            titleWidth={357}
            inputWidth={90} />
          </div>
          <div style={{marginTop: 16}}>
            <MyInput
            title="是否军烈属"
            type="select"
            inputRef={isSoldierRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["是否军烈属"]}
            titleWidth={179}
            inputWidth={90} />
            <MyInput
            title="家庭是否五保户"
            type="select"
            inputRef={isFiveRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["家庭是否五保户"]}
            titleWidth={175}
            inputWidth={90} />
            <MyInput
            title="家中是否有重大病患者"
            type="select"
            inputRef={isHavePatientRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["家中是否有重大病患者"]}
            titleWidth={357}
            inputWidth={90} />
          </div>
          <div style={{marginTop: 16}}>
            <MyInput
            title="家庭是否遭受自然灾害"
            type="select"
            inputRef={isDisasterRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["家庭是否遭受自然灾害"]}
            titleWidth={179}
            inputWidth={90} />
            <MyInput
            title="自然灾害具体情况描述"
            type="input"
            inputRef={disasterStatusRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["自然灾害具体情况描述"]}
            titleWidth={175}
            inputWidth={545} />
          </div>
          <div style={{marginTop: 16}}>
            <MyInput
            title="家庭失业人数"
            type="input"
            inputRef={notWorkRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["家庭失业人数"]}
            titleWidth={179}
            inputWidth={90} />
            <MyInput
            title="家庭欠债金额"
            type="input"
            inputRef={debtNumRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["家庭欠债金额"]}
            titleWidth={175}
            inputWidth={90} />
            <MyInput
            title="家庭欠债原因"
            type="input"
            inputRef={debtReasonRef}
            data={userStatus.extraInfoJson && userStatus.extraInfoJson["欠债原因"]}
            titleWidth={175}
            inputWidth={272} />
          </div>
          
        </div>
        </Scrollbars>
        <div className="modal-footer">
          <div className="cancel-btn" onClick={()=>setRecordVisible(false)}>取消</div>
          <div className="confirm-btn" onClick={sendStatus}>确定</div>
        </div>
        
        
      </Modal>
      <Modal
        type="1"
        title="课堂详情信息"
        visible={courseVisible}
        onOk={()=>setCourseVisible(true)}
        onCancel={()=>setCourseVisible(false)}
        footer={null}
        width={1000}
        className="course-status"
        bodyStyle={{height: 617 + 'px', padding: 0}}
      >
        <div className="search-container">
          <span className="list-count">
            共<span>30位</span>学生
          </span>
          <div className="input-container">
            <input 
            className="search-input" 
            type="text" 
            placeholder="请输入学生姓名进行搜索..." />
            <i className="searchlogo" onClick={search}></i>
          </div>
          
        </div>
        <Table></Table>
      </Modal>
      <Modal
            type="1"
            title="学籍详情"
            visible={visible}
            onOk={()=>setVisible(true)}
            onCancel={()=>{
              if(userIdentity != "student"){
                setModalShowType("list")
              }
              setVisible(false)}}
            footer={null}
            width={1300}
            className="height-weight-modal"
            bodyStyle={{height: 632 + 'px', padding: "20px 0 20px 20px"}}
        >
          <Scrollbars
          autoHeight
          autoHeightMax={590}>
            {
              modalShowType == "list"?
              <div>
                <p className="stu-count">共<span>{
                studentList.length
                }</span>人</p>
                <ul className="member-list">
                  <Scrollbars 
                  autoHeight
                  autoHeightMax={550}>
                    {
                      selectStudentList.length > 0?
                      selectStudentList.map((item, index)=>{
                        return (
                        <li key={index} onClick={()=>setStudentInfo(item)}>
                          <i className="user-header" style={{
                            backgroundImage:
                            (
                              item.photoPath?
                              item.photoPath:
                              ""
                            )
                          }}></i>
                          <p title={item.userName}>{item.userName}</p>
                        </li>
                        )
                      }):
                      <Empty
                      className={"bar-empty"}
                      style={{margin: "150px 0 0"}}
                      title={"暂无数据"}
                      type={"4"}
                      ></Empty>
                    }
                  
                  </Scrollbars>
                  
                </ul>  
              </div>:
              <div>
                {
                  userIdentity != "student"?
                  <span className="reback-prev" onClick={()=>setModalShowType("list")}>返回学生列表</span>:
                  ""
                }
                <StuStatistic data={stuStatistic}/>
                {/* <Table
                style={{marginTop: 20}}
                tableHeader={tableHeader}
                data={stuStatistic}
                ></Table> */}
              </div>
              
            }
          </Scrollbars>
            {/* <div className="search-container">
              <span className="list-count">
                  共<span>{studentList.length}位</span>学生
              </span>
              <div className="input-container">
                  <input 
                  className="search-input" 
                  type="text" 
                  placeholder="请输入学生姓名进行搜索..."
                  value={keyword}
                  onChange={searchStudent} />
                  {
                    keyword.length != 0?
                    <i className="cancellogo" onClick={cancelSearch}></i>:
                    ""
                  }
                  <i className="searchlogo"></i>
              </div>
            
            </div> */}
            
            
        </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: {
      termInfo: { HasHistory },
      userInfo
    },
  } = state;
  // console.log(state)
  return { HasHistory, userInfo };
};
export default connect(mapStateToProps)(memo(forwardRef(BaseMsg)));
