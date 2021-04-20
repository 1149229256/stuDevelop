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
import { Scrollbars } from "react-custom-scrollbars";
import { Empty, Modal } from "../../../component/common";
import Table from "../../../component/tableList";
import Bar from "../../../component/bar";
import AttendanceStatus from "./attendanceStatus";
import CourseAttendance from "./courseAttendance";
import HomeAttendance from "./homeAttendance";
import SchoolAttendance from "./schoolAttendance";
import Track from "../../../component/Track";
// import { Empty } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
  function AttendanceMsg(props, ref) {
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
      currentClass,
      currentGrade,
      userInfo: {SchoolID, UserID},
      reflash
    } = props;
    const [courseVisible, setCourseVisible] = useState(false);
    const [trackInfo, setTrackInfo] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [selectStudentList, setSelectStudentList] = useState([]);
    const [keyword, setKeyWord] = useState("");
    //单个学生详情数据
    const [courseAttendanceList, setCourseAttendanceList] = useState([]);
    //控制模态框显示内容
    const [modalShowType, setModalShowType] = useState(userIdentity == "student"? "detail": "list");
    const attendanceStatus = useRef(null);
    const courseAttendance = useRef(null);
    const homeAttendance = useRef(null);
    const schoolAttendance = useRef(null);
    const attendanceTrack = useRef(null);
    const tableHeader = [
      {
        key: "subject",
        name: "学科"
      },
      {
        key: "courseNum",
        name: "节数"
      },
      {
        key: "isAbsent",
        name: "是否缺勤"
      },
      {
        key: "isLate",
        name: "是否迟到"
      },
      {
        key: "isLeaveEarly",
        name: "是否早退"
      },
      {
        key: "isVacate",
        name: "是否请假"
      },
      {
        key: "courseDate",
        name: "上课日期"
      }
    ]
    useLayoutEffect(() => {
      // setAnchorList();
      typeof onAnchorComplete === "function" &&
        onAnchorComplete([
          { ref: attendanceStatus.current, name: "考勤情况" },
          { ref: courseAttendance.current, name: "课堂出勤" },
          { ref: homeAttendance.current, name: "宿舍考勤" },
          { ref: schoolAttendance.current, name: "学校考勤" },
          { ref: attendanceTrack.current, name: "考勤轨迹" },
        ]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 初始请求
    //获取轨迹数据
    useLayoutEffect(() => {
      let currentTermInfo = term.value? JSON.parse(term.value): {};  
      let classList = sessionStorage.getItem("classList") ?
      JSON.parse(sessionStorage.getItem("classList")):
      [];
      let classGradeId = "";
      classList.forEach((item)=>{
          if(item.classId == currentClass){
              classGradeId = item.gradeId;
          }
      })
      let url = BasicProxy + "/api/attendance/attendance/path?type=" + (
          userIdentity == "manager"?
          currentClass?
          2:
          currentGrade?
          3:
          4:
          userIdentity == "teacher"?
          2:
          1
      ) +
      "&studentId=" + UserID +
      "&classId=" + currentClass +
      "&gradeId=" + (
          userIdentity == "teacher" && !currentGrade?
          classGradeId:
          currentGrade) +
      "&schoolId=" + SchoolID +
      // "&termId=" + currentTermInfo.termId +
      "&start=" + currentTermInfo.startDate.substr(0, 10) +
      "&end=" + currentTermInfo.endDate.substr(0, 10);
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
              setTrackInfo(result.data);
          }
      })
    }, [currentClass, currentGrade, userIdentity, reflash]);

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
      }
    }, [userIdentity, UserID, currentClass, currentGrade, term])

    //获取弹出框详细信息
    useLayoutEffect(() => {
      if(userIdentity != "student"){
        return;
      }

      let termInfo = term && term.value && JSON.parse(term.value);
      let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
      let classGradeId = "";
      classList.forEach((item)=>{
          if(item.classId == currentClass){
              classGradeId = item.gradeId;
          }
      })
      let url = BasicProxy + "/api/attendance/attendance/details?studentId=" + 
      (userIdentity == "student"? UserID: "") +
      "&classId=" + (userIdentity == "teacher" || userIdentity == "manager" && currentClass? currentClass: "") +
      "&gradeId=" + (userIdentity == "manager" && !currentClass? currentGrade: "") +
      "&schoolId=" + (!currentClass && !currentGrade? SchoolID: "") +
      // "&termId=" + currentTermInfo.termId +
      "&start=" + termInfo.startDate.substr(0, 10) +
      "&end=" + termInfo.endDate.substr(0, 10);
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
              setCourseAttendanceList(result.data);
          }
      })     
    }, [term, currentClass, currentGrade, userIdentity, UserID, reflash]);
    //点击学生查看学生详细信息
    const setStudentInfo = (data) => {
      let termInfo = term && term.value && JSON.parse(term.value);
      let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
      let classGradeId = "";
      classList.forEach((item)=>{
          if(item.classId == currentClass){
              classGradeId = item.gradeId;
          }
      })
      let url = BasicProxy + "/api/attendance/attendance/details?studentId=" + 
      data.userId +
      "&classId=" +
      "&gradeId=" +
      "&schoolId=" +
      // "&termId=" + currentTermInfo.termId +
      "&start=" + termInfo.startDate.substr(0, 10) +
      "&end=" + termInfo.endDate.substr(0, 10);
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
              setCourseAttendanceList(result.data);
              setModalShowType("detail");
          }
      }) 
    }
    return (
      <div className="stu-condition" id="attendanceMsg">
        {
            userIdentity == 'manager' && !currentClass && !currentGrade?
            <Bar loading={false} barName={"考勤情况"} ref={attendanceStatus}>
                <AttendanceStatus 
                currentClass={currentClass}
                currentGrade={currentGrade}
                currentTerm={term}
                userIdentity={userIdentity}
                reflash={reflash} />
            </Bar>:
            ""
        }
        <Bar
          barName={"课堂出勤"}
          ref={courseAttendance}
          topContext={
            userIdentity != "manager"?
            <div className="module-link-group">
              <span 
              className="status" 
              onClick={()=>setCourseVisible(true)}>
                查看课堂详情信息
              </span>
            </div>
            :false}
          loading={false}
        >
            <CourseAttendance 
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            userIdentity={userIdentity}
            reflash={reflash} />
        </Bar>
        <Bar loading={false} barName={"宿舍考勤"} ref={homeAttendance}>
            <HomeAttendance 
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            userIdentity={userIdentity}
            reflash={reflash} />
        </Bar>
        {
            userIdentity != "student"?
            <Bar loading={false} barName={"学校考勤"} ref={schoolAttendance}>
                <SchoolAttendance 
                currentClass={currentClass}
                currentGrade={currentGrade}
                currentTerm={term}
                userIdentity={userIdentity}
                reflash={reflash} />
            </Bar>:
            ""
        }
        <Bar loading={false} barName={"考勤轨迹"} ref={attendanceTrack}>
          <Track
          type="attendanceMsg"
          userIdentity={userIdentity}
          data={trackInfo}
          />
        </Bar>
        <Modal
            type="1"
            title="课堂出勤详情"
            visible={courseVisible}
            onOk={()=>setCourseVisible(true)}
            onCancel={()=>{
              if(userIdentity != "student"){
                setModalShowType("list")
              }
              setCourseVisible(false)}}
            footer={null}
            width={1000}
            className="height-weight-modal"
            bodyStyle={{height: 632 + 'px', padding: 20}}
        >
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
            {
              modalShowType == "list"?
              <div>
                <p className="stu-count">共<span>{
                studentList.length
                }</span>人</p>
                <ul className="member-list">
                  <Scrollbars 
                  autoHeight
                  autoHeightMax={580}>
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
                        style={{margin: "80px 0 0"}}
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
                
                <Table
                style={{marginTop: 20}}
                tableHeader={tableHeader}
                data={courseAttendanceList}
                ></Table>
              </div>
            }
            
        </Modal>
      </div>
    );
  }
  
  const mapStateToProps = (state) => {
    let { commonData:{termInfo:{HasHistory}, userInfo} } = state;
    // console.log(state)
    return {HasHistory, userInfo};
  };
  export default connect(mapStateToProps)(memo(forwardRef(AttendanceMsg)));
  