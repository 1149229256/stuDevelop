import {
  connect,
  // useSelector,
  useDispatch,
} from "react-redux";
import React, {
  // useCallback,
  memo,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  forwardRef,
} from "react";
import $, { get } from "jquery";
// import { Select } from "antd";
import html2canvas from "html2canvas";
import {Modal, Progress, Select, Popover, Upload, message} from "antd";
import { handleRoute, getQueryVariable } from "../../util/public";
import { Dropdown, Modal as MyModal } from "../../component/common";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
import Scrollbars from "react-custom-scrollbars";
let { BasicProxy } = ipConfig;
const {Option} = Select;

function AnalysisTop(props, ref) {
  let {
    type,
    termselect,
    termlist,
    onTermChange,
    className,
    schoolMsg,
    getHeight,
    onTypeChange,
    setShowType,
    userIdentity,
    gradeList,
    classList,
    onClassChange,
    onGradeChange,
    teacherClassList,
    ModuleID,
    setReFlash,
    // userInfo: {UserID, SchoolID}
  } = props;

  // 下拉菜单
  const [TermList, setTermList] = useState(
    termlist
    // [
    // { value: "00", title: "2019~2020学年第1学期" },
    // { value: "0", title: "2019~2020学年第2学期" },
    // { value: "1", title: "2020~2021学年第1学期" },
    // { value: "2", title: "2020~2021学年第2学期" },
    // { value: "3", title: "2020~2021学年第2学期" },
    // { value: "4", title: "2020~2021学年第2学期2021学年第2学期" },
    // { value: "5", title: "2020~2021学年第2021学年第2学期2学期" },
    // { value: "6", title: "2020~2021学2021学年第2学期年第2学期" },
    // { value: "7", title: "2020~2021学年第2学期2021学年第2学期" },
    // ]
  );
  // 统计类型
  const [TypeList, setTypeList] = useState([
    { value: "stuStatusMsg", title: "学籍档案" },
    { value: "stuConditionMsg", title: "学情档案" },
    { value: "attendanceMsg", title: "考勤档案" },
    { value: "healthMsg", title: "健康档案" },
    { value: "awardAndPunish", title: "奖惩档案" },
    { value: "schoolLive", title: "校园生活档案" },
  ]);
  // 选择下拉
  const [TermSelect, setTermSelect] = useState(TermList[0] ? TermList[0] : {});
  const [TypeSelect, setTypeSelect] = useState(TypeList[0] ? TypeList[0] : {});

  //老师教学班
  const [courseClassList, setCourseClassList] = useState([]);

  //模板下载列表
  const [templateList, setTemplateList] = useState([]);
  //当前年级
  const [currentGrade, setCurrentGrade] = useState("");
  //当前班级
  const [currentClass, setCurrentClass] = useState("");
  const [currentClassName, setCurrentClassName] = useState("");
  //班级pkmodal
  const [classPKVisible, setClassPKVisible] = useState(false);
  const [myClass, setMyClass] = useState({});
  const [compareClass, setCompareClass] = useState({});
  const [myClassData, setMyClassData] = useState({});
  const [compareClassData, setCompareClassData] = useState({});
  const [changeVisible, setChangeVisible] = useState(false);
  const [chooseVisible, setChooseVisible] = useState(false);
  //比较的维度
  const [compareList, setCompareList] = useState([]);
  const [myWinCount, setMyWinCount] = useState(0);
  const [compareWinCount, setCompareWinCount] = useState(0);
  //选择班级列表
  const [gradeClassList, setGradeClassList] = useState([]);
  
  // 获取整个结构的都没节点
  const boxRef = useRef({});
  // 下拉初始化
  useEffect(() => {
    // termselect存在，表明选择有使用者决定
    termselect !== undefined && setTermSelect(termselect);
  }, [termselect]);
  useEffect(() => {
    if(!currentGrade && userIdentity != "manager"){
      // setCurrentGrade(gradeList[0] ? gradeList[0].gradeId : "");
    }
    
  }, [gradeList]);
  useEffect(() => {
    // if(currentClass){
    //   return;
    // }
    let classId = sessionStorage.getItem("currentClass");
    let updateClassList = [];
    
    if(userIdentity == "manager" && classList.length > 0){
      updateClassList = classList.filter((item)=>{
        return item.gradeId == currentGrade;
      })
    }
    if(teacherClassList.length > 0){
      teacherClassList.forEach((item)=>{
        updateClassList.push(item);
      })
    }
    if(!currentGrade && userIdentity == "manager"){
      return;
    }
    if(!currentClass && userIdentity == "manager"){
      setCurrentClass("");
      return;
    }
    if(classId){
      setCurrentClass(classId);
    } else if(updateClassList[0]){
      setCurrentClass(updateClassList[0].classId);
    }
  }, [classList, currentGrade, teacherClassList]);
  useEffect(()=>{
    classList.forEach((item)=>{
      if(item.classId == currentClass && currentClass){
        setCurrentClassName(item.className);
        setMyClass(item);
      }
    })
  
}, [currentClass, teacherClassList]);
  //将班级按年级分类用于切换对手时进行展览
  useLayoutEffect(()=>{
    let updateClassList = [], gradeList = [];
    classList.forEach((item)=>{
      gradeList.push(item.gradeName);
    })
    gradeList = [...new Set(gradeList)];
    gradeList.forEach((item)=>{
      let arr = [];
      classList.forEach((child)=>{
        if(child.gradeName == item){
          arr.push(child);
        }
      })
      updateClassList.push({
        gradeName: item,
        classList: arr
      })
    })
    setGradeClassList(updateClassList);
  }, [classList]);
  // 下拉列表再次修改
  useEffect(() => {
    if (termlist === undefined) return;
    setTermList(termlist);
    termselect === undefined &&
      TermSelect === undefined &&
      setTermSelect(termlist[0] ? termlist[0] : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termlist]);
  const topType = useMemo(() => {
    // 头部类型：*default:默认，*school:带有学校信息
    return type ? type : "default";
  }, [type]);
  // 学校信息
  const { isSchool, NodeName, LogoUrl } = useMemo(() => {
    let data = { isSchool: false };
    if (schoolMsg && topType === "school") {
      data = { isSchool: true, ...schoolMsg };
    }
    return data;
  }, [schoolMsg, topType]);
  //如果是学生则需要获取所在班级的id
  useLayoutEffect(()=>{
    if(userIdentity != "student"){
      return;
    }
    let UserID = sessionStorage.getItem("UserInfo")?JSON.parse(sessionStorage.getItem("UserInfo")).UserID: "";
    let SchoolID = sessionStorage.getItem("UserInfo")?JSON.parse(sessionStorage.getItem("UserInfo")).SchoolID: "";
    let url = BasicProxy + "/api/base/getSchoolStudent?schoolId=" + SchoolID +
    "&studentId=" + UserID;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        setCurrentClass(result.data.classId);
        setCurrentGrade(result.data.gradeId);
      }
    })
  }, [userIdentity]);
  // 监听变化，修改回调
  useEffect(() => {
    typeof onTermChange === "function" && onTermChange(TermSelect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
  }, [TermSelect]);
  // 监听变化，修改回调
  useEffect(() => {
    typeof onTypeChange === "function" && onTypeChange(TypeSelect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TypeSelect]);
  useEffect(() => {
    typeof onClassChange === "function" && onClassChange(currentClass);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentClass]);
  //获取教师教学班
  useLayoutEffect(() => {
    let UserID = JSON.parse(sessionStorage.getItem("UserInfo")).UserID;
    let url = BasicProxy + "/api/base/getCourseClassById?teacherId=" + UserID;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        // /api/base/getCourseClassById
        
        setCourseClassList(result.data);
      }
    });
  }, [])
 
  useEffect(() => {
    //切换年级时班级列表随之改变，但是当选择年级为全部时，则将所有班级列表展现出来
    typeof onGradeChange === "function" && onGradeChange(currentGrade);
    if(userIdentity != "manager"){
      return;
    }
    let updateClassList = [];
    if(!currentGrade){
      return;
    }
    if(classList.length > 0){
      updateClassList = classList.filter((item)=>{
        return item.gradeId == currentGrade;
      })
    }
    if(teacherClassList.length > 0){
      teacherClassList.forEach((item)=>{
        updateClassList.push(item);
      })
    }
    if(userIdentity == "manager" && !currentClass){
      return;
    }
    if(updateClassList[0]){
      setCurrentClass(updateClassList[0].classId);
    }
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGrade]);
  //比较两个班级展示的几个维度，统计获胜次数
  useLayoutEffect(()=>{
    let arr = [], compareList = [];
    if(JSON.stringify(myClassData) == "{}" || JSON.stringify(compareClassData) == "{}"){
      return;
    }
    if(ModuleID == "stuStatusMsg"){
      compareList = ["acceptPreSchoolNum", "boardNum", "leftChildNum", "onlyChildNum", "poorNum"];
    }
    if(ModuleID == "stuConditionMsg"){
      compareList = ["avgScore", "examScore", "finishRate", "score", "total"];
    }
    if(ModuleID == "attendanceMsg"){
      compareList = ["avgAttendanceRateResult", "lateTimes", "leaveEarlyTimes", "vacateTimes"];
    }
    let myCount = 0, compareCount = 0;
    if(compareList.length > 0){
      for(let value in myClassData){
        if(compareList.includes(value) && myClassData[value] > compareClassData[value]){
          myCount++;
        }
        if(compareList.includes(value) && myClassData[value] < compareClassData[value]){
          compareCount++;
        }
      }
    } else {
      Array.isArray(myClassData.pkProjects) &&
      myClassData.pkProjects.forEach((item)=>{
        Array.isArray(compareClassData.pkProjects) &&
        compareClassData.pkProjects.forEach((child)=>{
          if(child.projectName == item.projectName && child.score > item.score){
            compareCount++;
          }
          if(child.projectName == item.projectName && child.score < item.score){
            myCount++;
          }
        });
      })
    }
    console.log(compareList, myCount, compareCount, "pk");
    setMyWinCount(myCount);
    setCompareWinCount(compareCount);
  }, [myClassData, compareClassData]);
  //下载模板
  const downloadTemplate = (value) => {
    // TEMPERATURE(0, "体温信息录入模板.xlsx"),
    //     REWARDS_LOGS(2, "奖励信息导入模板.xlsx"),
    //     NETWORK_LOGS(3, "学生上网记录导入模板.xlsx"),
    //     CONSUMPTION_LOGS(4, "学生消费记录导入模板.xlsx"),
    //     LEAVE_RECORD_LOGS(5, "学生请假记录录入模板.xlsx"),
    //     MENTAL_HEALTHY_LOGS(6, "心理健康导入模板.xlsx"),
    //     PUNISHMENT_LOGS(7, "惩戒信息导入模板.xlsx"),
    //     PHYSICS_HEALTHY_LOGS(8, "身体健康档案录入模板.xlsx"),
    //     STATUS_LOGS(9, "学籍导入模板.xlsx"),
    //     ATTENDANCE_LOGS(10, "课堂出勤导入模板.xlsx");
    // let templateType = "STATUS_LOGS";
    if(ModuleID == "stuStatusMsg"){
      value = "STATUS_LOGS";
    }
    let SchoolID = sessionStorage.getItem("UserInfo")? JSON.parse(sessionStorage.getItem("UserInfo")).SchoolID: "";
    let url = BasicProxy + "/api/base/template?schoolId=" + SchoolID +
    "&gradeId=" + currentGrade +
    "&classId=" + currentClass +
    "&templateType=" + value +
    "&blankSheet=" + (value == "ATTENDANCE_LOGS"? 0: 1);
    //导出excel文档
    window.location.href = url;
  }
  const openImportPage = (key, data) => {
    let type = (
      key == "courseShow"? 2:
      key == "commonWork"? 4:
      key == "commonTest"? 5:
      2
    );
    let className = "";
    classList.forEach((item)=>{
      if(item.classId == currentClass){
        className = item.className;
      }
    })
    let token = sessionStorage.getItem("token") || getQueryVariable("lg_tk");
    let url = BasicProxy + "/api/base/getServerInfo?sysIds=810";
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){   
        let url = result.data.webSvrAddr + "cjzp/TeacherImport?lg_tk=" + token;
        window.open(url);
       }
    })
    return;
  }
  //导出页面
  const outputPage = () => {
    let node = $(`#${ModuleID}`);
    html2canvas(node[0], {
      width: node.width() - 10,
      height: node.height() + 10,
      scale: (0.75, 0.75),
      // ignoreElements: function($(".analysis-content")[0]){
      //   return false
      // },
      // useCORS: true,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
    }).then(canvas => {
      const imgUrl = canvas.toDataURL();
      // 获取截图base64 
      // let img = document.createElement("img");
      // img.src = imgUrl;
      // console.log(node[0])
      // node[0].appendChild(img);
      let a = document.createElement("a");
      a.href = imgUrl;
      let imgName = "";
      if(ModuleID == "stuStatusMsg"){
        imgName += "学籍档案_";
      }
      if(ModuleID == "stuConditionMsg"){
        imgName += "学情档案_";
      }
      if(ModuleID == "attendanceMsg"){
        imgName += "考勤档案_";
      }
      if(ModuleID == "awardAndPunish"){
        imgName += "奖惩档案_";
      }
      if(ModuleID == "healthMsg"){
        imgName += "健康档案_";
      }
      if(ModuleID == "schoolLiveMsg"){
        imgName += "校园生活档案_";
      }
      let userName = sessionStorage.getItem("UserInfo")? JSON.parse(sessionStorage.getItem("UserInfo")).UserName: "";
      let termName = TermSelect.value? JSON.parse(TermSelect.value).termName: "";
      let gradeName = "";
      Array.isArray(gradeList) && gradeList.map((item, index)=>{
        if(item.gradeId == currentGrade){
          gradeName = item.gradeName;
        }
      });
      a.download = imgName + termName + (gradeName?"_" + gradeName: "") + (
        userIdentity == "student"?
        "_" + userName:
        currentClassName?"_" + currentClassName: "");
      let event = new MouseEvent("click");
      a.dispatchEvent(event);
    });
  }
  //导入模板信息
  const importMethod = (data, key) => {
    let url = "";
    var formData = new FormData();
     // TEMPERATURE(0, "体温信息录入模板.xlsx"),
    //     REWARDS_LOGS(2, "奖励信息导入模板.xlsx"),
    //     NETWORK_LOGS(3, "学生上网记录导入模板.xlsx"),
    //     CONSUMPTION_LOGS(4, "学生消费记录导入模板.xlsx"),
    //     LEAVE_RECORD_LOGS(5, "学生请假记录录入模板.xlsx"),
    //     MENTAL_HEALTHY_LOGS(6, "心理健康导入模板.xlsx"),
    //     PUNISHMENT_LOGS(7, "惩戒信息导入模板.xlsx"),
    //     PHYSICS_HEALTHY_LOGS(8, "身体健康档案录入模板.xlsx"),
    //     STATUS_LOGS(9, "学籍导入模板.xlsx"),
    //     ATTENDANCE_LOGS(10, "课堂出勤导入模板.xlsx");
    // let templateType = "STATUS_LOGS";
    if(ModuleID == "stuStatusMsg"){
      setShowType("import");
      return;
    }
    if(ModuleID == "stuConditionMsg"){
      return;
    }
    if(ModuleID == "attendanceMsg"){
      formData.append("multipartFile", data.file);
      // 多文件上传需要给参数名称后面加上[]
      // formData.append("testfile[]", files[1]);
      let SchoolID = JSON.parse(sessionStorage.getItem("UserInfo")).SchoolID;
      if(key == "ATTENDANCE_LOGS"){
        url = BasicProxy + "/api/attendance/check/attendance?classId=" + currentClass + 
        "&schoolId=" + SchoolID;
      }
      if(key == "ATTENDANCE_DORMITORY_LOGS"){
        url = BasicProxy + "/api/attendance/check/attendanceDormitory?classId=" + currentClass + 
        "&schoolId=" + SchoolID;
      }
      if(key == "ATTENDANCE_GATE_LOGS"){
        url = BasicProxy + "/api/attendance/check/attendanceGate?classId=" + currentClass + 
        "&schoolId=" + SchoolID;
      }
    }
    if(ModuleID == "awardAndPunish"){
      formData.append("file", data.file);
      // 多文件上传需要给参数名称后面加上[]
      // formData.append("testfile[]", files[1]);
      if(key == "REWARDS_LOGS") {
        url = BasicProxy + "/api/punishAndReward/rewards/import";
      }
      if(key == "PUNISHMENT_LOGS") {
        url = BasicProxy + "/api/punishAndReward/punishment/import";
      }
       
    }
    if(ModuleID == "healthMsg"){
      formData.append("file", data.file);
      // 多文件上传需要给参数名称后面加上[]
      // formData.append("testfile[]", files[1]);
      if(key == "LEAVE_RECORD_LOGS") {
        url = BasicProxy + "/api/healthy/leave/import";
      }
      if(key == "MENTAL_HEALTHY_LOGS") {
        url = BasicProxy + "/api/healthy/mentalHealthy/import";
      }
      if(key == "TEMPERATURE") {
        url = BasicProxy + "/api/healthy/temperature/import";
      }
      if(key == "PHYSICS_HEALTHY_LOGS") {
        url = BasicProxy + "/api/healthy/studentHealthInfo/import";
      }
    }
    
    if(ModuleID == "schoolLiveMsg"){
      formData.append("file", data.file);
      // 多文件上传需要给参数名称后面加上[]
      // formData.append("testfile[]", files[1]);
      if(key == "CONSUMPTION_LOGS") {
        url = BasicProxy + "/api/campusLife/consumption/import";
      }
      if(key == "NETWORK_LOGS") {
        url = BasicProxy + "/api/campusLife/networkLog/import";
      }
    }
    $.ajax({
      url: url,
      type: 'post',
      async: true,
      data: formData,
      dataType:'json',
      cache: false, // 上传文件无需缓存
      processData : false, // 使数据不做处理
      contentType: false,
      headers: {
        "Authorization": "X-Token=" + sessionStorage.getItem("token"),
      },
      success: function(data){
        if(data.status == 200){
          let node = $(".link-child-box a");
          let currentIndex = 1;
          node.each((index, item)=>{
            if($(item).attr("class") && $(item).attr("class").indexOf("link-select") != -1){
              currentIndex = index + 1;
            }
          })
          let url = BasicProxy + "/cache/delete?moduleIds=" + currentIndex;
          fetch
          .get({url, securityLevel: 2})
          .then((res)=>res.json())
          .then((result)=>{
          })
          if(ModuleID == "attendanceMsg"){
            if(key == "ATTENDANCE_LOGS"){
              let url = BasicProxy + "/api/attendance/import/attendance";
              $.ajax({
                url: url,
                type: 'post',
                async: true,
                data: formData,
                dataType:'json',
                cache: false, // 上传文件无需缓存
                processData : false, // 使数据不做处理
                contentType: false,
                headers: {
                  "Authorization": "X-Token=" + sessionStorage.getItem("token"),
                },
                success: function(data){
                  message.success("导入成功~");
                  setReFlash(true);
                },
                error: function(){
                  message.success("导入失败~");
                }
              });
              return;
            }
            if(key == "ATTENDANCE_DORMITORY_LOGS"){
              let url = BasicProxy + "/api/attendance/import/attendanceDormitory";
              $.ajax({
                url: url,
                type: 'post',
                async: true,
                data: formData,
                dataType:'json',
                cache: false, // 上传文件无需缓存
                processData : false, // 使数据不做处理
                contentType: false,
                headers: {
                  "Authorization": "X-Token=" + sessionStorage.getItem("token"),
                },
                success: function(data){
                  message.success("导入成功~");
                  setReFlash(true);
                },
                error: function(){
                  message.success("导入失败~");
                }
              });
              return;
            }
            if(key == "ATTENDANCE_GATE_LOGS"){
                let url = BasicProxy + "/api/attendance/import/attendanceGate";
                $.ajax({
                  url: url,
                  type: 'post',
                  async: true,
                  data: formData,
                  dataType:'json',
                  cache: false, // 上传文件无需缓存
                  processData : false, // 使数据不做处理
                  contentType: false,
                  headers: {
                    "Authorization": "X-Token=" + sessionStorage.getItem("token"),
                  },
                  success: function(data){
                    message.success("导入成功~");
                    setReFlash(true);
                  },
                  error: function(){
                    message.success("导入失败~");
                  }
                });
                return;
            }
          }
          
          message.success("导入成功~");
        } else {
          
          if(data.status != "404" && data.msg && data.msg.indexOf(".xls") != -1){
            message.success("文档内数据错误，请下载文件并修改标红行的数据！", 3);
            window.location.href = BasicProxy + "/api/base/fileDownload?filePath=" + data.msg;
            return;
          }
          message.error("导入失败！请点击下载模板链接下载正确的模板文件~");
        }
        
         
      },
      error:function(response){
        
        message.error("导入失败！请点击下载模板链接下载正确的模板文件~");
        // let url = BasicProxy + "/api/base/fileDownload?filePath";
        // $.ajax({
        //   url: url,
        //   type: 'get',
        //   async: true,
        //   dataType:'json',
        //   headers: {
        //     "Authorization": "X-Token=" + sessionStorage.getItem("token"),
        //   },
        //   success: function(data){
        //     message.success("导入成功~");
        //   }
        // });
      }
    })
    // fetch.post({url, securityLevel: 2})
    // .then((res)=>{res.json()})
    // .then((result)=>{
    //   if(result.status == 200){
    //     message.success("导入成功~");
    //   } else {
    //     message.success("导入失败~");
    //   }
    // })
  }
  //班级PK判断调用哪个档案的接口,获取当前班级的比较信息
  const pkClick = () => {
    getClassInfo("myClass");
    setClassPKVisible(true);
  }
  //获取班级的信息
  const getClassInfo = (type, data) => {
    let url = "", classId = "";
    // if(type == "myClass"){
    //   classId = currentClass;
    // }
    // if(type == "compareClass"){
      
      classId = data? data.classId? data.classId: "": currentClass;
    // }
    if(!classId){
      return;
    }
    let SchoolID = sessionStorage.getItem("UserInfo")? 
    JSON.parse(sessionStorage.getItem("UserInfo")).SchoolID: 
    "";
    let currentTermInfo = TermSelect.value? JSON.parse(TermSelect.value): {};  
    let classList = sessionStorage.getItem("classList") ?
    JSON.parse(sessionStorage.getItem("classList")):
    [];
    let classGradeId = "";
    classList.forEach((item)=>{
        if(item.classId == currentClass){
            classGradeId = item.gradeId;
        }
    })
    if(ModuleID == "stuStatusMsg"){
      url = BasicProxy + "/api/status/class?classId=" + classId;
    }
    if(ModuleID == "stuConditionMsg"){
      url = BasicProxy + "/api/learning2/PkContent?type=2" + 
      "&classId=" + classId +
      "&termId=" + currentTermInfo.termId +
      "&start=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") +
      "&end=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");;
    }
    if(ModuleID == "attendanceMsg"){
      url = BasicProxy + "/api/attendance/attendance/times?type=2&studentId=&classId=" + classId + 
      "&gradeId=" + classGradeId +
      "&schoolId=" + SchoolID +
      "&statisticalType=3&start=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") +
      "&end=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
    }
    if(ModuleID == "awardAndPunish"){
      url = BasicProxy + "/api/punishAndReward/pk/class?schoolId=" + SchoolID +
      "&classId=" + classId;
    }
    if(ModuleID == "healthMsg"){
      url = BasicProxy + "/api/healthy/pk/class?schoolId=" + SchoolID +
      "&classId=" + classId;
    }
    if(ModuleID == "schoolLiveMsg"){
      url = BasicProxy + "/api/campusLife/pk/class?schoolId=" + SchoolID +
      "&classId=" + classId;
    }
    // console.log(url)
    // return;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        if(type == "myClass"){
          setMyClassData(result.data);
        }
        if(type == "compareClass"){
          setCompareClassData(result.data);
        }
      }
    })
  }
  useLayoutEffect(()=>{
    //有些模块有多个模板，需要设置列表供用户选择下载
    switch(ModuleID){
      case "stuConditionMsg":
          setTemplateList([
            {
              name: "课堂表现数据导入",
              value: "courseShow"
            },
            {
              name: "平时作业数据导入",
              value: "commonWork"
            },
            {
              name: "平时考试数据导入",
              value: "commonTest"
            },
          ]);
          break;
      case "attendanceMsg":
        setTemplateList([
          {
            name: "课堂考勤录入模板",
            value: "ATTENDANCE_LOGS"
          },
          {
            name: "宿舍考勤录入模板",
            value: "ATTENDANCE_DORMITORY_LOGS"
          },
          {
            name: "学校考勤录入模板",
            value: "ATTENDANCE_GATE_LOGS"
          },
        ]);
          break;
      case "healthMsg":
          setTemplateList([
            {
              name: "体温信息录入模板",
              value: "TEMPERATURE"
            },
            {
              name: "学生请假记录录入模板",
              value: "LEAVE_RECORD_LOGS"
            },
            {
              name: "心理健康导入模板",
              value: "MENTAL_HEALTHY_LOGS"
            },
            {
              name: "身体健康档案录入模板",
              value: "PHYSICS_HEALTHY_LOGS"
            },
          ]);
          break;
      case "awardAndPunish":
          setTemplateList([
            {
              name: "奖励信息导入模板",
              value: "REWARDS_LOGS"
            },
            {
              name: "惩戒信息导入模板",
              value: "PUNISHMENT_LOGS"
            },
          ]);
          break;
      case "schoolLiveMsg":
          setTemplateList([
            {
              name: "学生上网记录导入模板",
              value: "NETWORK_LOGS"
            },
            {
              name: "学生消费记录导入模板",
              value: "CONSUMPTION_LOGS"
            },
          ]);
          break;
      default:
          break;
    }
  }, [ModuleID]);
  useImperativeHandle(
    ref,
    () => ({
      TermSelect,
      boxRef,
      TypeSelect,
      currentClass,
      currentGrade
    }),
    [TermSelect, TypeSelect, currentClass, currentGrade]
  );
  // console.log($(boxRef.current).height())
  useLayoutEffect(() => {
    typeof getHeight === "function" && getHeight($(boxRef.current).height());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(myClass, "我的班级");
  return (
    <div ref={boxRef} className={`Analysis-Top ${className ? className : ""}`}>
      {isSchool ? (
        <div className="top-msg">
          <p className="s-msg">
            <i style={{ backgroundImage: LogoUrl ?LogoUrl: "#fff" }}></i>
            {NodeName ? NodeName : "测试"}
          </p>
        </div>
      ) : (
        ""
      )}
      <div className="top-default">
        {
          userIdentity == 'teacher'?
          <div className="select-container" style={{marginLeft: 0}}>
            <span>当前班级:</span>
            <Select 
              value={currentClassName} 
              className="select class-select"
              onChange={(value)=>{
                sessionStorage.setItem("currentClass", value);
                setCurrentClass(value)
              }}
            >
              {
                Array.isArray(teacherClassList) && teacherClassList.map((item, index)=>{
                  return (
                    <Option 
                    key={index}
                    value={item.classId}
                    >{item.className}</Option>
                  )
                })
              }
            </Select>
          </div>:
          ""
        }
        <Dropdown
          width={200}
          height={240}
          dropList={TermList}
          title={"所统计学期"}
          value={TermSelect.value}
          className={`term-dropdown ${isSchool ? "dropdown-school" : ""}`}
          onChange={(e) => {}}
          onSelect={(e, option) => {
            // console.log(option);
            setTermSelect(option);
          }}
        ></Dropdown>
        {
          userIdentity == "manager"?
          <div style={{display: 'inline-block'}}>
            <div className="select-container">
              <span>年级:</span>
              <Select 
              value={currentGrade} 
              className="select grade-select"
              onChange={(value)=>setCurrentGrade(value)}
              >
                <Option value="">全部</Option>
                  {
                    Array.isArray(gradeList) && gradeList.map((item, index)=>{
                      return (
                        <Option 
                        key={index}
                        value={item.gradeId}
                        >{item.gradeName}</Option>
                      )
                    })
                  }
              </Select>
            </div>
            <div className="select-container">
              <span>班级:</span>
              <Select 
              value={currentClass} 
              className="select class-select"
              onChange={(value)=>{
                sessionStorage.setItem("currentClass", value);
                setCurrentClass(value)}}
              >
                <Option value="">全部</Option>
                  {
                    Array.isArray(classList) && classList.map((item, index)=>{
                      if(item.gradeId == currentGrade || !currentGrade){
                        return (
                          <Option 
                          key={index}
                          value={item.classId}
                          >{item.className}</Option>
                        )
                      }
                      
                    })
                  }
              </Select>
            </div>
          </div>:
          ""
        }
        {/* {isSchool && (
          <Dropdown
            width={200}
            height={240}
            dropList={TypeList}
            title={"所统计类型"}
            value={TypeSelect.value}
            className={`term-dropdown dropdown-school`}
            onChange={(e) => {}}
            onSelect={(e, option) => {
              // console.log(option);
              setTypeSelect(option);
            }}
          ></Dropdown>
        )} */}
        {
          userIdentity == 'teacher'?
          <div className="top-right">
            {
              ModuleID == "stuStatusMsg" || ModuleID == "stuConditionMsg"?
              "":
              templateList.length > 0?
              <Popover
              placement="bottom"
              trigger="click" 
              id="template-list-container"
              content={
                <ul className="template-list">
                  {
                    templateList.map((item)=>{
                      return (
                        <li onClick={()=>downloadTemplate(item.value)}>{item.name}</li>
                      )
                    })
                  }
                </ul>
              }>
              <div className="top-download">
                  {/* <i className="importlogo"></i> */}
                  下载模板
              </div>
              </Popover>:
              <div className="top-download" onClick={downloadTemplate}>
                  {/* <i className="importlogo"></i> */}
                  下载模板
              </div>
            }
            {
              ModuleID == "stuStatusMsg"?
              <div className="top-import" onClick={importMethod}>
                <i className="importlogo"></i>
                导入
              </div>:
              templateList.length > 0?
              ModuleID == "stuConditionMsg"?
              // <Popover
              // placement="bottom"
              // trigger="click" 
              // className="template-list-container"
              // content={
              //   <ul className="template-list">
              //     {
              //       templateList.map((item, index)=>{
              //         return (
              //           <Popover
              //             placement="left"
              //             // trigger="click" 
              //             className="template-list-container"
              //             content={
              //               <ul className="course-class-list">
              //                 {
              //                   courseClassList.length > 0?
              //                   courseClassList.map((child, index1)=>{
              //                     return (
              //                       <li key={index1} onClick={()=>openImportPage(item.value, child)}>
              //                         {child.courseClassName}
              //                       </li>
              //                     )
              //                   }):
              //                   <p style={{lineHeight: '60px', padding: "0 10px"}}>{"暂无教学班~"}</p>
              //                 }
              //               </ul>
              //             }>
              //             <li key={index}>
              //               {item.name.replace("模板", "")}
              //             </li>
              //           </Popover>
              //         )
              //       })
              //     }
              //   </ul>
              // }>
              <div className="top-import" onClick={openImportPage}>
                <i className="importlogo"></i>
                导入
              </div>
                
              // </Popover>
              :
              <Popover
              placement="bottom"
              trigger="click" 
              className="template-list-container"
              content={
                <ul className="template-list">
                  {
                    templateList.map((item, index)=>{
                      return (
                        <Upload
                        customRequest={(file)=>importMethod(file, item.value)}
                        showUploadList={false}
                        onChange = {({ file, fileList }) => {
                          // if(!file){
                          //   return;
                          // }
                          // importMethod(file);
                        }}>
                            <li key={index}>
                              {item.name.replace("模板", "")}
                            </li>
                        </Upload>
                        
                      )
                    })
                  }
                </ul>
              }>
              <div className="top-import">
                <i className="importlogo"></i>
                导入
              </div>
                
              </Popover>
              :
              <Upload
                customRequest={importMethod}
                showUploadList={false}
              >
                <div className="top-import">
                  <i className="importlogo"></i>
                  导入
                </div>
              </Upload>
            }
            
            <div className="top-output" onClick={outputPage}>
              <i className="outputlogo"></i>
              导出
            </div>
            <div className="class-PK" onClick={pkClick}>
              <i className="pklogo"></i>
              班级PK
            </div>
          </div>:
          userIdentity == 'manager'?
          <div className="top-right">
            <div className="top-import-tea" onClick={outputPage}>
              <i className="importlogo"></i>
              导出
            </div>
            {/* <div className="grade-PK">
              <i className="pklogo"></i>
              年级PK
            </div> */}
            <div className="class-PK" onClick={pkClick}>
              <i className="pklogo"></i>
              班级PK
            </div>
          </div>:
          <div className="top-right">
          <div className="top-import-tea" onClick={outputPage}>
            <i className="importlogo"></i>
            导出
          </div>
        </div>
        }
        
      </div>
      <Modal
      title=""
      wrapClassName="classPK-modal"
      visible={classPKVisible}
      width={720}
      closable={false}
      bodyStyle={{height: 636}}
      footer={null}
      >
        <div className="classPK-top">
          <div className="my-class">
            
            <div className="class-info">
              <i className="class-image" />
              <span className="class-name">{myClass.className? myClass.className: "暂未选择"}</span>
              {
                userIdentity == "manager"?
                <span className="change-class-btn" onClick={()=>setChooseVisible(true)}>切换</span>:
                ""
              }
              
            </div>
            <div className="num-show">{myWinCount}</div>
          </div>
          <div className="vslogo"></div>
          <div className="compare-class">
            <div className="class-info">
              {/* <span className="change-class-btn">切换</span> */}
              <span className="class-name">{compareClass.className? compareClass.className: "暂未选择"}</span>
              <i className="class-image" />
            </div>
            <div className="num-show">{compareWinCount}</div>
          </div>
        </div>
        <div className="classPK-bottom">
          {
            ModuleID == "stuStatusMsg"?
            <div>
              <div className="compare-one">
              {/* <i className="resultlogo"></i> */}
              <p>接受过学前教育人数</p>
              <div>
                <span className="my-grade">
                  {typeof myClassData.acceptPreSchoolNum == "number"? myClassData.acceptPreSchoolNum + "人": "--"}
                  </span>
                <Progress
                className="my-class-progress"
                showInfo={false}
                trailColor="#e6e6e6"
                status="active"
                percent={
                  typeof myClassData.acceptPreSchoolNum == "number"? 
                  parseInt((myClassData.acceptPreSchoolNum/myClassData.classSize)*100):0
                }
                strokeWidth={12}
                strokeColor={{
                  from: '#ff6a66',
                  to: '#ff9b63'
                }} />
                
                <Progress
                className="compare-class-progress"
                showInfo={false}
                trailColor="#e6e6e6"
                status="active"
                percent={
                  typeof compareClassData.acceptPreSchoolNum == "number"? 
                  parseInt((compareClassData.acceptPreSchoolNum/compareClassData.classSize)*100):0
                }
                strokeWidth={12}
                strokeColor={{
                  from: '#376dff',
                  to: '#2ea0ff'
                }} />
                <span className="compare-grade">
                {typeof compareClassData.acceptPreSchoolNum == "number"? compareClassData.acceptPreSchoolNum + "人": "--"}
                </span>
              </div>
            </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>寄宿生人数</p>
                <div>
                  <span className="my-grade">
                    {typeof myClassData.boardNum == "number"?myClassData.boardNum + "人":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={
                    typeof myClassData.boardNum == "number"?
                    parseInt((myClassData.boardNum/myClassData.classSize)*100):0
                  }
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={
                    typeof compareClassData.boardNum == "number"?
                    parseInt((compareClassData.boardNum/compareClassData.classSize)*100):0
                  }
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span className="compare-grade">
                  {typeof compareClassData.boardNum == "number"?compareClassData.boardNum + "人":"--"}
                  </span>
                </div>
              </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>独生子女人数</p>
                <div>
                  <span className="my-grade">
                    {typeof myClassData.onlyChildNum == "number"?myClassData.onlyChildNum + "人":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={
                    typeof myClassData.onlyChildNum == "number"?
                    parseInt((myClassData.onlyChildNum/myClassData.classSize)*100):0
                  }
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={
                    typeof compareClassData.onlyChildNum == "number"?
                    parseInt((compareClassData.onlyChildNum/compareClassData.classSize)*100):0
                  }
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span className="compare-grade">
                    {typeof compareClassData.onlyChildNum == "number"?compareClassData.onlyChildNum + "人":"--"}
                  </span>
                </div>
              </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>贫困生人数</p>
                <div>
                  <span className="my-grade">
                    {typeof myClassData.poorNum == "number"?myClassData.poorNum + "人":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={
                    typeof myClassData.poorNum == "number"?
                    parseInt((myClassData.poorNum/myClassData.classSize)*100):0
                  }
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={
                    typeof compareClassData.poorNum == "number"?
                    parseInt((compareClassData.poorNum/compareClassData.classSize)*100):0
                  }
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span className="compare-grade">
                    {typeof compareClassData.poorNum == "number"?compareClassData.poorNum + "人":"--"}
                  </span>
                </div>
              </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>留守儿童人数</p>
                <div>
                  <span className="my-grade">
                    {typeof myClassData.leftChildNum == "number"?myClassData.leftChildNum + "人":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={
                    typeof myClassData.leftChildNum == "number"?
                    parseInt((myClassData.leftChildNum/myClassData.classSize)*100):0
                  }
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={
                    typeof compareClassData.leftChildNum == "number"?
                    parseInt((compareClassData.leftChildNum/compareClassData.classSize)*100):0
                  }
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span className="compare-grade">
                    {typeof compareClassData.leftChildNum == "number"?compareClassData.leftChildNum + "人":"--"}
                  </span>
                </div>
              </div>
            </div>:
            ModuleID == "stuConditionMsg"?
            <div>
              <div className="compare-one">
              {/* <i className="resultlogo"></i> */}
              <p>课堂表现分</p>
              <div>
                <span className="my-grade">
                  {typeof myClassData.score == "number"? myClassData.score + "分": "--"}
                  </span>
                <Progress
                className="my-class-progress"
                showInfo={false}
                trailColor="#e6e6e6"
                status="active"
                percent={typeof myClassData.score == "number"? myClassData.score: 0}
                strokeWidth={12}
                strokeColor={{
                  from: '#ff6a66',
                  to: '#ff9b63'
                }} />
                
                <Progress
                className="compare-class-progress"
                showInfo={false}
                trailColor="#e6e6e6"
                status="active"
                percent={typeof compareClassData.score == "number"? compareClassData.score: 0}
                strokeWidth={12}
                strokeColor={{
                  from: '#376dff',
                  to: '#2ea0ff'
                }} />
                <span className="compare-grade">
                {typeof compareClassData.score == "number"? compareClassData.score + "分": "--"}
                </span>
              </div>
            </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>作业完成率</p>
                <div>
                  <span className="my-grade">
                    {myClassData.finishRate?(Number(myClassData.finishRate)*100).toFixed(1) + "%":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={myClassData.finishRate?(Number(myClassData.finishRate)*100).toFixed(1):0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={compareClassData.finishRate?(Number(compareClassData.finishRate)*100).toFixed(1):0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span className="compare-grade">
                    {compareClassData.finishRate?(Number(compareClassData.finishRate)*100).toFixed(1) + "%":"--"}
                  </span>
                </div>
              </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>自学时长</p>
                <div>
                  <span className="my-grade">
                    {typeof myClassData.total == "number"?myClassData.total + "h":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={myClassData.total?myClassData.tota:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={compareClassData.total?compareClassData.total:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span className="compare-grade">
                    {typeof compareClassData.total == "number"?compareClassData.total + "h":"--"}
                  </span>
                </div>
              </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>考试平均分(最近)</p>
                <div>
                  <span 
                  className="my-grade" 
                  title={typeof myClassData.examScore == "number"?(myClassData.examScore).toFixed(1) + "分":"--"}>
                  {typeof myClassData.examScore == "number"?(myClassData.examScore).toFixed(1) + "分":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={myClassData.examScore?myClassData.examScore:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={compareClassData.examScore?compareClassData.examScore:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span className="compare-grade">
                  {typeof compareClassData.examScore == "number"?(compareClassData.examScore).toFixed(1) + "分":"--"}
                  </span>
                </div>
              </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>总评平均分(最近)</p>
                <div>
                  <span className="my-grade">
                    {typeof myClassData.avgScore == "number"?myClassData.avgScore + "分":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={typeof myClassData.avgScore == "number"?myClassData.avgScore:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={typeof compareClassData.avgScore == "number"?compareClassData.avgScore:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span className="compare-grade">
                  {typeof compareClassData.avgScore == "number"?compareClassData.avgScore + "分":"--"}
                  </span>
                </div>
              </div>
            </div>:
            ModuleID == "attendanceMsg"?
            <div>
              <div className="compare-one">
              {/* <i className="resultlogo"></i> */}
              <p>出勤率</p>
              <div>
                <span 
                className="my-grade" 
                title={myClassData.avgAttendanceRateResult? parseInt(myClassData.avgAttendanceRateResult): "--"}>
                  {myClassData.avgAttendanceRateResult? parseInt(myClassData.avgAttendanceRateResult): "--"}
                  </span>
                <Progress
                className="my-class-progress"
                showInfo={false}
                trailColor="#e6e6e6"
                status="active"
                percent={typeof myClassData.avgAttendanceRate == "number"? parseInt(myClassData.avgAttendanceRateResult): 0}
                strokeWidth={12}
                strokeColor={{
                  from: '#ff6a66',
                  to: '#ff9b63'
                }} />
                
                <Progress
                className="compare-class-progress"
                showInfo={false}
                trailColor="#e6e6e6"
                status="active"
                percent={typeof compareClassData.avgAttendanceRate == "number"? parseInt(compareClassData.avgAttendanceRateResult): 0}
                strokeWidth={12}
                strokeColor={{
                  from: '#376dff',
                  to: '#2ea0ff'
                }} />
                <span 
                className="compare-grade"
                title={compareClassData.avgAttendanceRateResult? parseInt(compareClassData.avgAttendanceRateResult): "--"}>
                {compareClassData.avgAttendanceRateResult? parseInt(compareClassData.avgAttendanceRateResult): "--"}
                </span>
              </div>
            </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>迟到次数</p>
                <div>
                  <span 
                  className="my-grade"
                  title={typeof myClassData.lateTimes == "number"?myClassData.lateTimes + "次":"--"}>
                    {typeof myClassData.lateTimes == "number"?myClassData.lateTimes + "次":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={typeof myClassData.lateTimes == "number"?myClassData.lateTimes:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={typeof compareClassData.lateTimes == "number"?compareClassData.lateTimes:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span 
                  className="compare-grade"
                  title={typeof compareClassData.lateTimes == "number"?compareClassData.lateTimes + "次":"--"}>
                    {typeof compareClassData.lateTimes == "number"?compareClassData.lateTimes + "次":"--"}
                  </span>
                </div>
              </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>早退次数</p>
                <div>
                  <span 
                  className="my-grade"
                  title={typeof myClassData.leaveEarlyTimes == "number"?myClassData.leaveEarlyTimes + "次":"--"}>
                    {typeof myClassData.leaveEarlyTimes == "number"?myClassData.leaveEarlyTimes + "次":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={typeof myClassData.leaveEarlyTimes == "number"?myClassData.leaveEarlyTimes:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={typeof compareClassData.leaveEarlyTimes == "number"?compareClassData.leaveEarlyTimes:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span 
                  className="compare-grade"
                  title={typeof compareClassData.leaveEarlyTimes == "number"?compareClassData.leaveEarlyTimes + "次":"--"}>
                    {typeof compareClassData.leaveEarlyTimes == "number"?compareClassData.leaveEarlyTimes + "次":"--"}
                  </span>
                </div>
              </div>
              <div className="compare-one">
                {/* <i className="resultlogo"></i> */}
                <p>请假次数</p>
                <div>
                  <span 
                  className="my-grade"
                  title={typeof myClassData.vacateTimes == "number"?myClassData.vacateTimes + "次":"--"}>
                  {typeof myClassData.vacateTimes == "number"?myClassData.vacateTimes + "次":"--"}
                  </span>
                  <Progress
                  className="my-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={typeof myClassData.vacateTimes == "number"?myClassData.vacateTimes:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#ff6a66',
                    to: '#ff9b63'
                  }} />
                  
                  <Progress
                  className="compare-class-progress"
                  showInfo={false}
                  trailColor="#e6e6e6"
                  status="active"
                  percent={typeof compareClassData.vacateTimes == "number"?compareClassData.vacateTimes:0}
                  strokeWidth={12}
                  strokeColor={{
                    from: '#376dff',
                    to: '#2ea0ff'
                  }} />
                  <span 
                  className="compare-grade"
                  title={typeof compareClassData.vacateTimes == "number"?compareClassData.vacateTimes + "次":"--"}>
                  {typeof compareClassData.vacateTimes == "number"?compareClassData.vacateTimes + "次":"--"}
                  </span>
                </div>
              </div>
            </div>:
            ModuleID == "awardAndPunish" || ModuleID == "healthMsg" || ModuleID == "schoolLiveMsg"?
            <Scrollbars
            autoHeight
            autoHeightMax={320}>
              {
                Array.isArray(myClassData.pkProjects) &&
                myClassData.pkProjects.map((item, index)=>{
                  let compareClassInfo = {};
                  Array.isArray(compareClassData.pkProjects) &&
                  compareClassData.pkProjects.forEach((child)=>{
                    if(child.projectName == item.projectName){
                      compareClassInfo = child;
                    }
                  });
                  return (
                    <div className="compare-one" key={index}>
                    {/* <i className="resultlogo"></i> */}
                    <p>{item.projectName? item.projectName: "--"}</p>
                    <div>
                      <span 
                      className="my-grade" 
                      title={
                        typeof item.score == "number"? 
                        (item.score).toFixed(1) + item.unit:
                        "--"
                      }
                      >
                        {typeof item.score == "number"? (item.score).toFixed(1) + item.unit: "--"}
                        </span>
                      <Progress
                      className="my-class-progress"
                      showInfo={false}
                      trailColor="#e6e6e6"
                      status="active"
                      percent={typeof item.score == "number"? (item.score).toFixed(1): 0}
                      strokeWidth={12}
                      strokeColor={{
                        from: '#ff6a66',
                        to: '#ff9b63'
                      }} />
                      <Progress
                      className="compare-class-progress"
                      showInfo={false}
                      trailColor="#e6e6e6"
                      status="active"
                      percent={typeof compareClassInfo.score == "number"? (compareClassInfo.score).toFixed(1): 0}
                      strokeWidth={12}
                      strokeColor={{
                        from: '#376dff',
                        to: '#2ea0ff'
                      }} />
                      <span 
                      className="compare-grade" 
                      title={
                      typeof compareClassInfo.score == "number"? 
                      (compareClassInfo.score).toFixed(1) + compareClassInfo.unit:
                      "--"}>
                      {typeof compareClassInfo.score == "number"? 
                      (compareClassInfo.score).toFixed(1) + compareClassInfo.unit: "--"}
                      </span>
                    </div>
                    </div>
                  )
                })
              }
            </Scrollbars>
            :
            ""
          }
          
        </div>
        <div className="classPK-footer">
            <div className="cancel-btn" onClick={()=>setClassPKVisible(false)}>关闭</div>
            <div className="change-btn" onClick={()=>setChangeVisible(true)}>切换对手</div>
        </div>
      </Modal>
      <MyModal
      title="切换对手"
      className="change-compareClass-modal"
      visible={changeVisible}
      width={880}
      onCancel={()=>setChangeVisible(false)}
      bodyStyle={{height: 472, padding: "15px 0 24px 24px"}}
      footer={null}
      >
         <Scrollbars
         autoHeight
         autoHeightMax={445}>
           {
             gradeClassList.map((item, index)=>{
               return (
                 <div className="grade-group" key={index}>
                  <p className="grade-name">
                    {item.gradeName}
                    <span>(共<span style={{color: "#ff0000"}}>{item.classList.length}</span>个班)</span>
                  </p>
                  <ul className="grade-class-list">
                    {
                      item.classList.map((child, index1)=>{
                        return (
                          <li key={index1} onClick={()=>{
                            if((myClassData.classInfo && child.classId == myClassData.classInfo.classId) || 
                            (compareClassData.classInfo && child.classId == compareClassData.classInfo.classId)){
                              return;
                            }
                            console.log(myClassData);
                            setCompareClass(child);
                            getClassInfo("compareClass", child);
                            setChangeVisible(false);
                          }} style={{
                            cursor: (
                              (myClassData.classInfo && child.classId == myClassData.classInfo.classId) || 
                            (compareClassData.classInfo && child.classId == compareClassData.classInfo.classId)?
                              "not-allowed":
                              ""
                            )
                          }}>
                            <i className="classlogo"></i>
                            <p title={child.className}>{child.className}</p>
                          </li>
                        )
                      })
                    }
                  </ul>
                 </div>
               )
             })
           }
         </Scrollbars>
      </MyModal>
      <MyModal
      title="选择班级"
      className="change-compareClass-modal"
      visible={chooseVisible}
      width={880}
      onCancel={()=>setChooseVisible(false)}
      bodyStyle={{height: 472, padding: "15px 0 24px 24px"}}
      footer={null}
      >
         <Scrollbars
         autoHeight
         autoHeightMax={445}>
           {
             gradeClassList.map((item, index)=>{
               return (
                 <div className="grade-group" key={index}>
                  <p className="grade-name">
                    {item.gradeName}
                    <span>(共<span style={{color: "#ff0000"}}>{item.classList.length}</span>个班)</span>
                  </p>
                  <ul className="grade-class-list">
                    {
                      item.classList.map((child, index1)=>{
                        return (
                          <li key={index1} onClick={()=>{
                            setMyClass(child);
                            getClassInfo("myClass", child);
                            setChooseVisible(false);
                          }}>
                            <i className="classlogo"></i>
                            <p title={child.className}>{child.className}</p>
                          </li>
                        )
                      })
                    }
                  </ul>
                 </div>
               )
             })
           }
         </Scrollbars>
      </MyModal>
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: { userInfo },
  } = state;
  return { userInfo };
};
connect(mapStateToProps)
export default memo(forwardRef(AnalysisTop));
