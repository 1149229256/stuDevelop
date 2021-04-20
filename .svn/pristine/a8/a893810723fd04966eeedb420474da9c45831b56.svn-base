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
// import echarts from "echarts";
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import * as graphic from 'echarts/lib/util/graphic';
import { Scrollbars } from "react-custom-scrollbars";
import { Empty, Modal } from "../../../component/common";
import Table from "../../../component/tableList";
import DetailHealth from "./detailHealth";
import TestStatus from "./testStatus";
import SportTest from "./sportTest";
import DetailExercise from "./detailExercise";
import detailExercise from "./detailExercise";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
//   import { resizeForEcharts } from "../../../util/public";
function BodyHealth(props, ref) {
    let {
        userIdentity,
        currentClass,
        currentGrade,
        currentTerm,
        userInfo: {UserID, SchoolID},
        reflash
    } = props;
     // dom ref
    const [currentKind, setCurrentKind] = useState('test');
    //体测成绩
    const [testAvg, setTestAvg] = useState("--");
    const [projectList, setProjectList] = useState({});
    const [testStatusData, setTestStatusData] = useState({});
    const [sickInfo, setSickInfo] = useState({});
    const [temperatureInfo, setTemperatureInfo] = useState({});

    const [testVisible, setTestVisible] = useState(false);
    const [temVisible, setTemVisible] = useState(false);
    const [sickVisible, setSickVisible] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [selectStudentList, setSelectStudentList] = useState([]);
    //单个学生详情数据
    const [testList, setTestList] = useState([]);
    const [temList, setTemList] = useState([]);
    const [sickList, setSickList] = useState([]);
    //控制模态框显示内容
    const [modalShowType, setModalShowType] = useState(userIdentity == "student"? "course": "list");
    useLayoutEffect(() => {
        //获取体测成绩数据
        if(!currentTerm){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        let classList = sessionStorage.getItem("classList") ?
        JSON.parse(sessionStorage.getItem("classList")):
        [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let currentTermInfo = currentTerm && currentTerm.value && JSON.parse(currentTerm.value);
        //获取体测平均分
        let url = BasicProxy + "/api/healthy/physicalTest/averageScore?studentId=" + (
            userIdentity == "student"?
            UserID:
            ""
        ) +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setTestAvg(result.data);
            }
        })

        //获取体测成绩
        url = BasicProxy + "/api/healthy/physicalTest/score/list?studentId=" + (
            userIdentity == "student"?
            UserID:
            ""
        ) +
        "&classId=" + currentClass +
        "&gradeId=" + (
        userIdentity == "teacher" && !currentGrade?
        classGradeId:
        currentGrade) +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setProjectList(result.data);
            }
        })
        
        //获取项目列表
        url = BasicProxy + "/api/healthy/physicalTest/score/list?studentId=" + (
            userIdentity == "student"?
            UserID:
            ""
        ) +
        "&classId=" + currentClass +
        "&gradeId=" + (
        userIdentity == "teacher" && !currentGrade?
        classGradeId:
        currentGrade) +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setProjectList(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, userIdentity, reflash]);
    useLayoutEffect(() => {
        //获取日常健康数据
        if(!currentTerm){
            return;
        }
        let classList = sessionStorage.getItem("classList") ?
        JSON.parse(sessionStorage.getItem("classList")):
        [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let currentTermInfo = currentTerm && currentTerm.value && JSON.parse(currentTerm.value);
        //获取病假信息
        let url = BasicProxy + "/api/healthy/leave/sickRecord?studentId=" + (
            userIdentity == "student"?
            UserID:
            ""
        ) +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setSickInfo(result.data);
            }
        })
        //获取体温信息
        url = BasicProxy + "/api/healthy/temperature/dallyHealthyInfo?studentId=" + (
            userIdentity == "student"?
            UserID:
            ""
        ) +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        // "&termId=" + currentTermInfo.termId +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
        "&endDate=" + currentTermInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setTemperatureInfo(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, userIdentity, reflash]);
    const offworkTypeInfo = {
        1: "病假",
        2: "事假",
        0: "其他"
    }
    const testTableHeader = [
    {
        key: "subjectName",
        name: "体测项目名称"
    },
    {
        key: "subjectTotalScore",
        name: "项目总分"
    },
    {
        key: "studentAverageScore",
        name: "个人平均成绩"
    },
    {
        key: "maxScore",
        name: "最高成绩"
    }
    ]
    const temTableHeader = [
    {
        key: "createTime",
        name: "日期"
    },
    {
        key: "temperature",
        name: "平均体温温度/℃"
    },
    {
        key: "normal",
        name: "体温是否正常"
    }
    ]
    const sickTableHeader = [
    {
        key: "fromTime",
        name: "请假日期"
    },
    {
        key: "offworkType",
        name: "请假类型"
    },
    {
        key: "reason",
        name: "请假原因"
    },
    {
        key: "dayNumber",
        name: "请假时长(天)"
    },
    {
        key: "applierName",
        name: "批准人姓名"
    }
    ]
    const kindList = [
        {
            key: 'test',
            name: '体测情况'
        },
        {
            key: 'exam',
            name: '体育中考'
        },
        // {
        //     key: 'sport',
        //     name: '日常运动'
        // },
        {
            key: 'health',
            name: '日常健康'
        },
    ];
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
    }, [userIdentity, UserID, currentClass, currentGrade, currentTerm, reflash])
    //获取弹出框详细信息
    useLayoutEffect(() => {
        if(userIdentity != "student"){
        return;
        }
        let termInfo = currentTerm && currentTerm.value && JSON.parse(currentTerm.value);
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        let url = BasicProxy + "/api/healthy/physicalTest/score/list?studentId=" + UserID +
        "&classId=" + currentClass +
        "&gradeId=" + classGradeId +
        "&schoolId=" + SchoolID +
        "&termId=" + termInfo.termId +
        "&startDate=" + termInfo.startDate.substr(0, 10) +
        "&endDate=" + termInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                let arr = [];
                result.data.forEach((item)=>{
                    let obj = {
                        ...item
                    };
                    obj.subjectName = item.subjectName;
                    obj.subjectTotalScore = item.subjectTotalScore;
                    arr.push(obj);
                })
                setTestList(arr);
            }
        })
        url = BasicProxy + "/api/healthy/temperature/list?studentId=" + UserID +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&startDate=" + termInfo.startDate.substr(0, 10) +
        "&endDate=" + termInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                result.data.forEach((item)=>{
                    item.normal = item.normal? "是": "否";
                })
                setTemList(result.data);
            }
        })
        url = BasicProxy + "/api/healthy/leave/list?studentId=" + UserID +
        "&classId=" + currentClass +
        "&gradeId=" + classGradeId +
        "&schoolId=" + SchoolID +
        "&type=0" +
        "&startDate=" + termInfo.startDate.substr(0, 10) +
        "&endDate=" + termInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                result.data.forEach((item)=>{
                    item.offworkType = offworkTypeInfo[item.offworkType];
                })
                setSickList(result.data);
            }
        })   
    }, [currentTerm, currentClass, currentGrade, userIdentity, UserID, reflash]);
    //点击学生查看学生详细信息
    const setStudentInfo = (data, type) => {
        let termInfo = currentTerm && currentTerm.value && JSON.parse(currentTerm.value);
        let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
        let classGradeId = "";
        classList.forEach((item)=>{
            if(item.classId == currentClass){
                classGradeId = item.gradeId;
            }
        })
        if(type == "test"){
        let url = BasicProxy + "/api/healthy/physicalTest/score/list?studentId=" + data.userId +
        "&classId=" + currentClass +
        "&gradeId=" + classGradeId +
        "&schoolId=" + SchoolID +
        "&termId=" + termInfo.termId +
        "&startDate=" + termInfo.startDate.substr(0, 10) +
        "&endDate=" + termInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                let arr = [];
                result.data.forEach((item)=>{
                    let obj = {
                        ...item
                    };
                    obj.subjectName = item.subjectName;
                    obj.subjectTotalScore = item.subjectTotalScore;
                    arr.push(obj);
                })
                setTestList(arr);
                setModalShowType("detail");
            }
        })
        }
        if(type == "tem"){
        let url = BasicProxy + "/api/healthy/temperature/list?studentId=" + data.userId +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&startDate=" + termInfo.startDate.substr(0, 10) +
        "&endDate=" + termInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                result.data.forEach((item)=>{
                    item.normal = item.normal? "是": "否";
                })
                setTemList(result.data);
                setModalShowType("detail");
            }
        })
        }
        if(type == "sick"){
        let url = BasicProxy + "/api/healthy/leave/list?studentId=" + data.userId +
        "&classId=" + currentClass +
        "&gradeId=" + classGradeId +
        "&schoolId=" + SchoolID +
        "&type=0" +
        "&startDate=" + termInfo.startDate.substr(0, 10) +
        "&endDate=" + termInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                result.data.forEach((item)=>{
                    item.offworkType = offworkTypeInfo[item.offworkType];
                })
                setSickList(result.data);
                setModalShowType("detail");
            }
        })
        }
    }
    return (
        <div className="body-health">
            <div className="kind-list">
                <span>类型:</span>
                {
                    kindList.map((item, index)=>{
                        return (
                        <div style={{margin: 0}} key={index} onClick={()=>setCurrentKind(item.key)}>
                            <span 
                            className={"list-one " + (currentKind == item.key? "active": "")}>
                                {item.name}
                            </span>
                            {
                                index != kindList.length - 1?
                                <span className="list-slice-line"></span>:
                                ""
                            }
                        </div>
                            
                        )
                    })
                }
                {
                    userIdentity != "manager"?
                    currentKind == "test"?
                    <div className="status-btn">
                        <span 
                        className="test-status-info" 
                        onClick={()=>setTestVisible(true)}>查看体测详细信息</span>
                    </div>:
                    currentKind == "health"?
                    <div className="status-btn">
                        <span 
                        className="test-status-info" 
                        onClick={()=>setTemVisible(true)}>查看体温详细信息</span>
                        <span 
                        className="test-status-info" 
                        onClick={()=>setSickVisible(true)}>查看病假详细信息</span>
                    </div>:
                    "":
                    ""
                } 
            </div>
            {
                currentKind == "exam"?
                <SportTest 
                userIdentity={userIdentity} 
                currentKind={currentKind} 
                currentClass={currentClass}
                currentGrade={currentGrade}
                reflash={reflash}
                currentTerm={currentTerm} />:
                currentKind == "sport"?
                <DetailExercise 
                userIdentity={userIdentity} 
                currentKind={currentKind} 
                currentClass={currentClass}
                currentGrade={currentGrade}
                reflash={reflash}
                currentTerm={currentTerm} />:
                currentKind == "health"?
                <DetailHealth 
                userIdentity={userIdentity} 
                currentKind={currentKind} 
                currentClass={currentClass}
                currentGrade={currentGrade}
                reflash={reflash}
                currentTerm={currentTerm}
                sickInfo={sickInfo}
                temperatureInfo={temperatureInfo} />:
                <TestStatus 
                userIdentity={userIdentity} 
                currentClass={currentClass}
                currentGrade={currentGrade}
                currentTerm={currentTerm}
                reflash={reflash}
                currentKind={currentKind} 
                testAvg={testAvg}
                projectList={projectList} />
            }
            <Modal
          type="1"
          title="体测详情"
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
                      <li key={index} onClick={()=>setStudentInfo(item, "test")}>
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
              tableHeader={testTableHeader}
              data={testList}
              ></Table>
            </div>
          }
      </Modal>
      <Modal
          type="1"
          title="体温详情"
          visible={temVisible}
          onOk={()=>setTemVisible(true)}
          onCancel={()=>{
            if(userIdentity != "student"){
              setModalShowType("list")
            }
            setTemVisible(false)}}
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
                      <li key={index} onClick={()=>setStudentInfo(item, "tem")}>
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
              tableHeader={temTableHeader}
              data={temList}
              ></Table>
            </div>
          }
      </Modal>
      <Modal
          type="1"
          title="病假详情"
          visible={sickVisible}
          onOk={()=>setSickVisible(true)}
          onCancel={()=>{
            if(userIdentity != "student"){
              setModalShowType("list")
            }
            setSickVisible(false)}}
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
                      <li key={index} onClick={()=>setStudentInfo(item, "sick")}>
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
              tableHeader={sickTableHeader}
              data={sickList}
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
  }
export default connect(mapStateToProps)(memo(forwardRef(BodyHealth)));
  