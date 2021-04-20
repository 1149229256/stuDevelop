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
import Track from "../../../component/Track";
import ConditionRank from "./conditionRank";
import LeaderConditionRank from "./leaderConditionRank";
import CourseShow from "./courseShow";
import DetailWork from "./detailWork";
import PersonStudy from "./personStudy";
import GradeStatistic from "./gradeStatistic";
import TestGrade from "./testGrade";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;

function StuCondition(props, ref) {
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
    userInfo: {UserID, SchoolID},
    reflash
  } = props;
  
  const [courseVisible, setCourseVisible] = useState(false);
  const [workVisible, setWorkVisible] = useState(false);
  const [studyVisible, setStudyVisible] = useState(false);
  const [testVisible, setTestVisible] = useState(false);
  const [trackInfo, setTrackInfo] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [selectStudentList, setSelectStudentList] = useState([]);
  const [keyword, setKeyWord] = useState("");
  //单个学生详情数据
  const [subjectScoreList, setSubjectScoreList] = useState([]);
  const [workList, setWorkList] = useState([]);
  const [studyList, setStudyList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  //控制模态框显示内容
  const [modalShowType, setModalShowType] = useState(userIdentity == "student"? "course": "list");
  const conditionRank = useRef(null);
  const courseStatus = useRef(null);
  const detailWork = useRef(null);
  const personStudy = useRef(null);
  const testGrade = useRef(null);
  const gradeShow = useRef(null);
  const stuConditionTrack = useRef(null);
  const courseTableHeader = [
    {
      key: "date",
      name: "日期"
    },
    {
      key: "subjectName",
      name: "学科名称"
    },
    {
      key: "score",
      name: "课堂表现分数"
    }
  ]
  const workTableHeader = [
    {
      key: "homeworkName",
      name: "作业名称"
    },
    {
      key: "subject",
      name: "作业所属学科"
    },
    {
      key: "score",
      name: "分数"
    },
    {
      key: "startDate",
      name: "发布日期"
    },
    {
      key: "endDate",
      name: "完成日期"
    }
  ]
  const studyTableHeader = [
    {
      key: "date",
      name: "时间"
    },
    {
      key: "subjectName",
      name: "学科名称"
    },
    {
      key: "useTime",
      name: "学科自学时长"
    }
  ]
  const examTableHeader = [
    {
      key: "subject",
      name: "考试学科"
    },
    {
      key: "examName",
      name: "考试名称"
    },
    {
      key: "score",
      name: "分数"
    },
    {
      key: "maxScore",
      name: "最高分"
    },
    {
      key: "classRank",
      name: "班级排名"
    },
    {
      key: "gradeRank",
      name: "年级排名"
    }
  ]
  useEffect(() => {
    // setAnchorList();
    let {
      userIdentity
    } = props;
    typeof onAnchorComplete === "function" &&
      onAnchorComplete([
        { ref: conditionRank.current, name: "学情排行" },
        { ref: courseStatus.current, name: "课堂表现" },
        { ref: detailWork.current, name: "日常作业" },
        { ref: personStudy.current, name: "课外自学" },
        { ref: testGrade.current, name: "考试成绩" },
        { ref: gradeShow.current, name: "成绩总评" },
        { ref: stuConditionTrack.current, name: "学情轨迹" },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //获取轨迹数据
  useLayoutEffect(() => {
    if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
      return;
    }
    if(userIdentity == "teacher" && !currentClass){
        return;
    }
    let currentTermInfo = term.value && JSON.parse(term.value);
    // SchoolID = "S27-511-AF57";
    // currentTermInfo.termId = "2020-202101";
    // currentClass = "d8ed1a21-39bc-4403-8330-5f9bd578f721";
    // currentGrade = "7C11E555-AE69-41DA-8E8B-624BB21B456E"; 
    let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
    let classGradeId = "";
    classList.forEach((item)=>{
        if(item.classId == currentClass){
            classGradeId = item.gradeId;
        }
    })
    let url = BasicProxy + "/api/learning2/path?type="+ (
      userIdentity == "student"?
      1:
      userIdentity == "teacher"?
      2:
      currentGrade?
      3:
      4
    ) + 
    "&studentId=" + (
      userIdentity == "student"?
      UserID:
      ""
    ) + 
    "&classId=" + currentClass +
    "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
    "&schoolId=" + SchoolID +
    "&termId=" + currentTermInfo.termId +
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
  }, [currentGrade, currentClass, userIdentity, term, UserID, reflash]);

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
  }, [userIdentity, UserID, currentClass, currentGrade, term, reflash])

  //获取弹出框详细信息
  useLayoutEffect(() => {
    if(userIdentity != "student"){
      return;
    }
    if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
      return;
    }
    let termInfo = term && term.value && JSON.parse(term.value);
    let url = BasicProxy + "/api/learning2/exam/scoreRank?type=1" + 
    "&studentId=" + UserID +
    "&classId=" + currentClass +
    "&gradeId=" + currentGrade +
    "&schoolId=" + SchoolID +
    "&termId=" + termInfo.termId +
    "&examType=3" +
    "&start=" + termInfo.startDate.substr(0, 10) +
    "&end=" + termInfo.endDate.substr(0, 10) ;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
          let dataList = [];
          Array.isArray(result.data) &&
          result.data.forEach((item)=>{
            if(item.subject != "总分"){
              dataList.push(item);
            }
          })
          setSubjectScoreList(dataList);
        }
    })     
    url = BasicProxy + "/api/learning2/performance/subject?type=1" + 
    "&studentId=" + UserID +
    "&classId=" + currentClass +
    "&gradeId=" + currentGrade +
    "&schoolId=" + SchoolID +
    "&termId=" + termInfo.termId +
    "&start=" + termInfo.startDate.substr(0, 10) +
    "&end=" + termInfo.endDate.substr(0, 10) ;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
            setCourseList(result.data);
        }
    })
    url = BasicProxy + "/api/learning2/homework/details?type=1" + 
    "&studentId=" + UserID +
    "&classId=" + currentClass +
    "&gradeId=" + currentGrade +
    "&schoolId=" + SchoolID +
    "&termId=" + termInfo.termId +
    "&start=" + termInfo.startDate.substr(0, 10) +
    "&end=" + termInfo.endDate.substr(0, 10) ;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
            setWorkList(result.data);
        }
    })
    url = BasicProxy + "/api/learning2/selfStudy/detail?type=1" + 
    "&studentId=" + UserID +
    "&classId=" + currentClass +
    "&gradeId=" + currentGrade +
    "&schoolId=" + SchoolID +
    "&termId=" + termInfo.termId +
    "&start=" + termInfo.startDate.substr(0, 10) +
    "&end=" + termInfo.endDate.substr(0, 10) ;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
        if(result.status == 200 && result.data){
          let arr = [];
          Array.isArray(result.data.selfStudyDaysList) &&
          result.data.selfStudyDaysList.forEach((item)=>{
            item.selfStudySubjectList.forEach((child)=>{
              let obj = {
                date: item.date,
                subjectName: child.subjectName,
                useTime: child.useTime
              };
              arr.push(obj);
            })
          })
          setStudyList(arr);
        }
    })
  }, [term, currentClass, currentGrade, userIdentity, UserID, reflash]);
  //点击学生查看学生详细信息
  const setStudentInfo = (data, type) => {
    let termInfo = term && term.value && JSON.parse(term.value);
    let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
    let classGradeId = "";
    classList.forEach((item)=>{
        if(item.classId == currentClass){
            classGradeId = item.gradeId;
        }
    })
    console.log(data);
    if(type == "course"){
      let url = BasicProxy + "/api/learning2/performance/subject?type=1" + 
      "&studentId=" + data.userId +
      "&classId=" + currentClass +
      "&gradeId=" + classGradeId +
      "&schoolId=" + SchoolID +
      "&termId=" + termInfo.termId +
      "&start=" + termInfo.startDate.substr(0, 10) +
      "&end=" + termInfo.endDate.substr(0, 10) ;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
              setCourseList(result.data);
              setModalShowType("detail");
          }
      })
    }
    if(type == "work"){
      let url = BasicProxy + "/api/learning2/homework/details?type=1" + 
      "&studentId=" + data.userId +
      "&classId=" + currentClass +
      "&gradeId=" + classGradeId +
      "&schoolId=" + SchoolID +
      "&termId=" + termInfo.termId +
      "&start=" + termInfo.startDate.substr(0, 10) +
      "&end=" + termInfo.endDate.substr(0, 10) ;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
              setWorkList(result.data);
              setModalShowType("detail");
          }
      })
    }
    if(type == "study"){
      let url = BasicProxy + "/api/learning2/selfStudy/detail?type=1" + 
      "&studentId=" + data.userId +
      "&classId=" + currentClass +
      "&gradeId=" + classGradeId +
      "&schoolId=" + SchoolID +
      "&termId=" + termInfo.termId +
      "&start=" + termInfo.startDate.substr(0, 10) +
      "&end=" + termInfo.endDate.substr(0, 10) ;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
            let arr = [];
            Array.isArray(result.data.selfStudyDaysList) &&
            result.data.selfStudyDaysList.forEach((item)=>{
              item.selfStudySubjectList.forEach((child)=>{
                let obj = {
                  date: item.date,
                  subjectName: child.subjectName,
                  useTime: child.useTime
                };
                arr.push(obj);
              })
            })
            setStudyList(arr);
            setModalShowType("detail");
          }
      })
    }
    if(type == "exam"){
      let url = BasicProxy + "/api/learning2/exam/scoreRank?type=1" + 
      "&studentId=" + data.userId +
      "&classId=" + currentClass +
      "&gradeId=" + classGradeId +
      "&schoolId=" + SchoolID +
      "&termId=" + termInfo.termId +
      "&examType=3" +
      "&start=" + termInfo.startDate.substr(0, 10) +
      "&end=" + termInfo.endDate.substr(0, 10) ;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
              setSubjectScoreList(result.data);
              setModalShowType("detail");
          }
      })
    }
  }
  return (
    <div className="stu-condition" id="stuConditionMsg">
      {
        userIdentity == 'manager' && !currentClass && !currentGrade?
        <Bar loading={false} barName={"学情排行"} ref={conditionRank}>
          <LeaderConditionRank 
          userIdentity={userIdentity} 
          currentTerm={term}
          currentGrade={currentGrade}
          currentClass={currentClass}
          reflash={reflash} />
        </Bar>:
        currentClass && userIdentity != "student"?
        <Bar loading={false} barName={"学情排行"} ref={conditionRank}>
          <ConditionRank 
          userIdentity={userIdentity} 
          currentTerm={term}
          currentGrade={currentGrade}
          currentClass={currentClass}
          reflash={reflash} />
        </Bar>:
        ""
      }
      
      <Bar
        barName={"课堂表现"}
        ref={courseStatus}
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
        <CourseShow 
        userIdentity={userIdentity} 
        currentTerm={term}
        currentGrade={currentGrade}
        currentClass={currentClass}
        reflash={reflash} />
      </Bar>
      <Bar 
      loading={false} 
      barName={"日常作业"} 
      ref={detailWork}
      topContext={
        userIdentity != "manager"? 
        <div className="module-link-group">
          <span 
          className="status" 
          onClick={()=>setWorkVisible(true)}>
            查看作业详情信息
          </span>
        </div>
      :false}> 
        <DetailWork
        userIdentity={userIdentity} 
        currentTerm={term}
        currentGrade={currentGrade}
        currentClass={currentClass}
        reflash={reflash} />
      </Bar>
      <Bar 
      loading={false} 
      barName={"课外自学"}
      ref={personStudy}
      topContext={
        userIdentity != "manager"? 
        <div className="module-link-group">
          <span 
          className="status" 
          onClick={()=>setStudyVisible(true)}>
            查看自学详情信息
          </span>
        </div>
      :false}>
        <PersonStudy
        userIdentity={userIdentity} 
        currentTerm={term}
        currentGrade={currentGrade}
        currentClass={currentClass}
        reflash={reflash} />
      </Bar>
      <Bar 
      loading={false} 
      barName={"考试成绩"} 
      ref={testGrade}
      topContext={
        userIdentity != "manager"?
        <div className="module-link-group">
          <span 
          className="status"
          onClick={()=>setTestVisible(true)}>
            查看考试详情信息
          </span>
        </div>
        :false}
      >
        <TestGrade 
        userIdentity={userIdentity}
        currentTerm={term}
        currentGrade={currentGrade}
        currentClass={currentClass}
        reflash={reflash} />
      </Bar>
      <Bar loading={false} barName={"成绩总评"} ref={gradeShow}>
        <GradeStatistic 
        userIdentity={userIdentity}
        currentTerm={term}
        currentGrade={currentGrade}
        currentClass={currentClass}
        reflash={reflash} />
      </Bar>
      <Bar loading={false} barName={"学情轨迹"} ref={stuConditionTrack}>
        <Track
        type="stuConditionMsg"
        userIdentity={userIdentity}
        data={trackInfo}
        ></Track>
      </Bar>
      <Modal
            type="1"
            title="课堂表现详情"
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
                        <li key={index} onClick={()=>setStudentInfo(item, "course")}>
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
                <Table
                style={{marginTop: 20}}
                tableHeader={courseTableHeader}
                data={courseList}
                ></Table>
              </div>
            }
        </Modal>
      <Modal
          type="1"
          title="作业详情"
          visible={workVisible}
          onOk={()=>setWorkVisible(true)}
          onCancel={()=>{
            if(userIdentity != "student"){
              setModalShowType("list")
            }
            setWorkVisible(false)}}
          footer={null}
          width={1000}
          className="height-weight-modal"
          bodyStyle={{height: 632 + 'px', padding: 20}}
      >
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
                      <li key={index} onClick={()=>setStudentInfo(item, "work")}>
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
              <Table
              style={{marginTop: 20}}
              tableHeader={workTableHeader}
              data={workList}
              ></Table>
            </div>
          }
      </Modal>
      <Modal
            type="1"
            title="自学详情"
            visible={studyVisible}
            onOk={()=>setStudyVisible(true)}
            onCancel={()=>{
              if(userIdentity != "student"){
                setModalShowType("list")
              }
              setStudyVisible(false)}}
            footer={null}
            width={1000}
            className="height-weight-modal"
            bodyStyle={{height: 632 + 'px', padding: 20}}
        >
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
                        <li key={index} onClick={()=>setStudentInfo(item, "study")}>
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
                <Table
                style={{marginTop: 20}}
                tableHeader={studyTableHeader}
                data={studyList}
                ></Table>
              </div>
            }
        </Modal>
      <Modal
            type="1"
            title="考试详情"
            visible={testVisible}
            onOk={()=>setTestVisible(true)}
            onCancel={()=>{
              if(userIdentity != "student"){
                setModalShowType("list")
              }
              setTestVisible(false)}}
            footer={null}
            width={1000}
            className="height-weight-modal"
            bodyStyle={{height: 632 + 'px', padding: 20}}
        >
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
                        <li key={index} onClick={()=>setStudentInfo(item, "exam")}>
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
                <Table
                style={{marginTop: 20}}
                tableHeader={examTableHeader}
                data={subjectScoreList}
                ></Table>
              </div>
            }
        </Modal>
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
};
export default connect(mapStateToProps)(memo(forwardRef(StuCondition)));
