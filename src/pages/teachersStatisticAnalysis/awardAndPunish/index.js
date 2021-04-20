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
import AwardPunishRank from "./awardPunishRank";
import AwardMsg from "./awardMsg";
import PunishMsg from "./punishMsg";
import Track from "../../../component/Track";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
  function AwardAndPunish(props, ref) {
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
    const [awardVisible, setAwardVisible] = useState(false);
    const [punishVisible, setPunishVisible] = useState(false);
    const [trackInfo, setTrackInfo] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [selectStudentList, setSelectStudentList] = useState([]);
    const [keyword, setKeyWord] = useState("");
    //单个学生详情数据
    const [awardList, setAwardList] = useState([]);
    const [punishList, setPunishList] = useState([]);
    //控制模态框显示内容
    const [modalShowType, setModalShowType] = useState(userIdentity == "student"? "detail": "list");
    // const [myGrade, setCurrentGrade] = useState("");
    // const [myClass, setCurrentClass] = useState("");
    const awardPunishMsg = useRef(null);
    const awardMsg = useRef(null);
    const punishMsg = useRef(null);
    const trackRef = useRef(null);
    // useEffect(() => {
    //   setCurrentClass(currentClass);
    // }, [currentClass])
    // useEffect(() => {
    //   setCurrentGrade(currentGrade);
    // }, [currentGrade])
    const awardClassList = {
      "1": '一等奖',
      "2": '二等奖',
      "3": '三等奖',
      "-1": '其他'
    };
    const punishmentTypeList = {
      "1": '班级',
      "2": '年级',
      "3": '校级',
      "-1": '其他'
    };
    const awardTableHeader = [
      {
        key: "awardName",
        name: "奖励名称"
      },
      {
        key: "awardDetail",
        name: "获奖原因"
      },
      {
        key: "awardLevelName",
        name: "奖励级别"
      },
      {
        key: "awardClassName",
        name: "奖励等级"
      },
      {
        key: "awardDate",
        name: "获奖日期"
      },
      {
        key: "issuedBy",
        name: "颁奖单位"
      }
    ]
    const punishTableHeader = [
      {
        key: "punishmentName",
        name: "惩戒类型"
      },
      {
        key: "punishmentReason",
        name: "惩戒原因"
      },
      {
        key: "punishmentTypeName",
        name: "惩戒级别"
      },
      {
        key: "punishmentDate",
        name: "惩戒日期"
      },
    ]
    useLayoutEffect(() => {
      // setAnchorList();
      typeof onAnchorComplete === "function" &&
        onAnchorComplete([
          { ref: awardPunishMsg.current, name: "奖惩排行" },
          { ref: awardMsg.current, name: "获奖情况" },
          { ref: punishMsg.current, name: "处罚情况" },
        //   { ref: schoolAttendance.current, name: "学校考勤" },
          { ref: trackRef.current, name: "奖惩轨迹" },
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
      let url = BasicProxy + "/api/punishAndReward/route?id=" + (
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
        userIdentity == "manager"?
        4:
        1
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
    }, [term, currentClass, reflash])

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
      let termInfo = term && term.value && JSON.parse(term.value);
      let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
      let classGradeId = "";
      classList.forEach((item)=>{
          if(item.classId == currentClass){
              classGradeId = item.gradeId;
          }
      })
      //奖励详情
      let url = BasicProxy + "/api/punishAndReward/rewards/list?studentId=" + UserID +
      "&classId=" + currentClass +
      "&gradeId=" + classGradeId +
      "&startDate=" + termInfo.startDate.substr(0, 10) +
      "&endDate=" + termInfo.endDate.substr(0, 10) ;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && Array.isArray(result.data)){
            result.data.forEach((item)=>{
              item.awardClassName = awardClassList[item.awardClass];
            })
            setAwardList(result.data);
          }
      })     
      //处罚详情
      url = BasicProxy + "/api/punishAndReward/punishment/list?studentId=" + UserID +
      "&classId=" + currentClass +
      "&gradeId=" + classGradeId +
      "&startDate=" + termInfo.startDate.substr(0, 10) +
      "&endDate=" + termInfo.endDate.substr(0, 10) ;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && Array.isArray(result.data)){
            result.data.forEach((item)=>{
              item.punishmentTypeName = punishmentTypeList[item.punishmentType];
            })
            setPunishList(result.data);
          }
      })     
    }, [term, currentClass, currentGrade, userIdentity, UserID, reflash]);
    //点击学生查看学生奖励详细信息
    const setStudentAwardInfo = (data) => {
      let termInfo = term && term.value && JSON.parse(term.value);
      let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
      let classGradeId = "";
      classList.forEach((item)=>{
          if(item.classId == currentClass){
              classGradeId = item.gradeId;
          }
      })
      let url = BasicProxy + "/api/punishAndReward/rewards/list?studentId=" + data.userId +
      "&classId=" + currentClass +
      "&gradeId=" + classGradeId +
      "&startDate=" + termInfo.startDate.substr(0, 10) +
      "&endDate=" + termInfo.endDate.substr(0, 10) ;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && result.data){
            result.data.forEach((item)=>{
              item.awardClassName = awardClassList[item.awardClass];
            })
            setAwardList(result.data);
            setModalShowType("detail");
          }
      }) 
    }
    //点击学生查看学生处罚详细信息
    const setStudentPunishInfo = (data) => {
      let termInfo = term && term.value && JSON.parse(term.value);
      let classList = sessionStorage.getItem("classList")? JSON.parse(sessionStorage.getItem("classList")): [];
      let classGradeId = "";
      classList.forEach((item)=>{
          if(item.classId == currentClass){
              classGradeId = item.gradeId;
          }
      })
      let url = BasicProxy + "/api/punishAndReward/punishment/list?studentId=" + data.userId +
      "&classId=" + currentClass +
      "&gradeId=" + classGradeId +
      "&startDate=" + termInfo.startDate.substr(0, 10) +
      "&endDate=" + termInfo.endDate.substr(0, 10) ;
      fetch
      .get({url, securityLevel: 2})
      .then((res)=>res.json())
      .then((result)=>{
          if(result.status == 200 && Array.isArray(result.data)){
            result.data.forEach((item)=>{
              item.punishmentTypeName = punishmentTypeList[item.punishmentType];
            })
            setPunishList(result.data);
            setModalShowType("detail");
          }
      })   
    }
    return (
      <div className="award-and-punish" id="awardAndPunish">
          {
            userIdentity == 'teacher' || userIdentity == 'manager'?
            <Bar loading={false} barName={"奖惩排行"} ref={awardPunishMsg}>
                <AwardPunishRank 
                userIdentity={userIdentity} 
                currentTerm={term}
                currentClass={currentClass}
                currentGrade={currentGrade}
                reflash={reflash} />
            </Bar>:
            ""
          }
        
        <Bar
          barName={"获奖情况"}
          ref={awardMsg}
          topContext={
            userIdentity != "manager"?
            <div className="module-link-group">
              <span 
              className="status" 
              onClick={()=>setAwardVisible(true)}>
                查看获奖详情信息
              </span>
            </div>
            :false}
          loading={false}
        >
            <AwardMsg
            userIdentity={userIdentity} 
            currentTerm={term}
            currentClass={currentClass}
            currentGrade={currentGrade}
            reflash={reflash} />
        </Bar>
        <Bar 
        loading={false} 
        barName={"处罚情况"} 
        ref={punishMsg}
        topContext={
          userIdentity != "manager"?
        <div className="module-link-group">
            <span 
            className="status" 
            onClick={()=>setPunishVisible(true)}>
            查看处罚详情信息
            </span>
        </div>
        :false}
        >
            <PunishMsg
            userIdentity={userIdentity}
            currentTerm={term}
            currentClass={currentClass}
            currentGrade={currentGrade}
            reflash={reflash} />
        </Bar>
        <Bar loading={false} barName={"奖惩轨迹"} ref={trackRef}>
            <Track 
            userIdentity={userIdentity}
            type="awardAndPunish"
            data={trackInfo}
            />
        </Bar>
        <Modal
            type="1"
            title="奖励详情"
            visible={awardVisible}
            onOk={()=>setAwardVisible(true)}
            onCancel={()=>{
              if(userIdentity != "student"){
                setModalShowType("list")
              }
              setAwardVisible(false)}}
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
                        <li key={index} onClick={()=>setStudentAwardInfo(item)}>
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
                tableHeader={awardTableHeader}
                data={awardList}
                ></Table>
              </div>
              
            }
            
        </Modal>
        <Modal
            type="1"
            title="处罚详情"
            visible={punishVisible}
            onOk={()=>setPunishVisible(true)}
            onCancel={()=>{
              if(userIdentity != "student"){
                setModalShowType("list")
              }
              setPunishVisible(false)}}
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
                  autoHeightMax={550}>
                    {
                      selectStudentList.length > 0?
                      selectStudentList.map((item, index)=>{
                        return (
                        <li key={index} onClick={()=>setStudentPunishInfo(item)}>
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
                tableHeader={punishTableHeader}
                data={punishList}
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
  export default connect(mapStateToProps)(memo(forwardRef(AwardAndPunish)));
  