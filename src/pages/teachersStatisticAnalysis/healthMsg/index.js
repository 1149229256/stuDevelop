import {
    connect,
    // useSelector,
    useDispatch,
    useStore,
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
import XLSX from "xlsx";
import Bar from "../../../component/bar";
import HealthBaseMsg from "./healthBaseMsg";
import Scrollbars from "react-custom-scrollbars";
import BodyHealth from "./bodyHealth";
import MindHealth from "./mindHealth";
import { Empty, Modal } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
import Table from "../../../component/tableList";
let { BasicProxy } = ipConfig;
  function HealthMsg(props, ref) {
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
      currentClass,
      currentGrade,
      userIdentity,
      userInfo: {SchoolID, UserID},
      reflash
    } = props;
    const [baseMsgInfo, setBaseMsgInfo] = useState({});
    const [heightWeightVisible, setHeightWeightVisible] = useState(false);
    const [mindVisible, setMindVisible] = useState(false);
    const [studentVisible, setStudentVisible] = useState(false);
    const [heightWeightList, setHeightWeightList] = useState([]);
    const [mindList, setMindList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [selectStudentList, setSelectStudentList] = useState([]);
    const [keyword, setKeyWord] = useState("");
    //控制模态框显示内容
    const [modalShowType, setModalShowType] = useState(userIdentity == "student"? "detail": "list");
    const baseTableHeader = [
      // {
      //   key: "index",
      //   name: "序号"
      // },
      {
        key: "userName",
        name: "姓名"
      },
      {
        key: "height",
        name: "身高(cm)"
      },
      {
        key: "weight",
        name: "体重(kg)"
      },
      {
        key: "bmiIndex",
        name: "BMI"
      },
      {
        key: "recordTime",
        name: "记录时间"
      }
    ]
    const mindTableHeader = [
      {
        key: "testDate",
        name: "测试日期"
      },
      {
        key: "projectName",
        name: "测试项目名称"
      },
      {
        key: "normal",
        name: "是否正常"
      },
      {
        key: "conclusion",
        name: "结论"
      }
    ]
    const baseMsg = useRef(null);
    const bodyHealth = useRef(null);
    const mindHealth = useRef(null);
    useLayoutEffect(() => {
      // setAnchorList();
      typeof onAnchorComplete === "function" &&
        onAnchorComplete([
          { ref: baseMsg.current, name: "基本情况" },
          { ref: bodyHealth.current, name: "身体健康" },
        //   { ref: schoolAttendance.current, name: "学校考勤" },
          { ref: mindHealth.current, name: "心理健康" },
        ]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 初始请求
    useLayoutEffect(() => {
      // if(!currentClass && !currentGrade && userIdentity != "student"){
      //   return;
      // }
      if(userIdentity == "teacher" && !currentClass){
        return;
      }
      if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
        return;
      }
      if(!term){
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
        let currentTermInfo = term.value && JSON.parse(term.value);
        if(userIdentity != "student" && (currentClass || currentGrade)){
          //获取目前平均身高体重信息
          let url = BasicProxy + "/api/healthy/overview?classId=" + currentClass +
          "&gradeId=" + (
            userIdentity == "teacher"?
            classGradeId:
            currentGrade
          ) +
          "&studentId=" + (
            userIdentity == "student"?
            UserID:
            "") +
          // "&termId=" + currentTermInfo.termId +
          "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
          "&endDate=" + currentTermInfo.endDate.substr(0, 10) ;
          fetch
          .get({url, securityLevel: 2})
          .then((res)=>res.json())
          .then((result)=>{
              if(result.status == 200 && result.data){
                let obj = {
                  ...baseMsg,
                  baseInfo: result.data,
                  avgInfo: result.data
                }
                setBaseMsgInfo(obj);
              }
          })
       }
        
        if(userIdentity == "student"){
           //获取目前平均身高体重信息
          let url = BasicProxy + "/api/healthy/overview?classId=" + currentClass +
          "&gradeId=" + currentGrade +
          "&studentId=" + (
            userIdentity == "student"?
            UserID:
            "") +
          // "&termId=" + currentTermInfo.termId +
          "&startDate=" + currentTermInfo.startDate.substr(0, 10) +
          "&endDate=" + currentTermInfo.endDate.substr(0, 10);
          fetch
          .get({url, securityLevel: 2})
          .then((res)=>res.json())
          .then((result)=>{
              if(result.status == 200 && result.data){
                let obj = {
                  avgInfo: result.data
                }
                //获取本人或班级身高体重信息
                url = BasicProxy + "/api/healthy/studentHealthInfo?studentId=" + UserID;
                fetch
                .get({url, securityLevel: 2})
                .then((res)=>res.json())
                .then((result)=>{
                    if(result.status == 200 && result.data){
                      obj.baseInfo = result.data;
                      setBaseMsgInfo(obj);
                    }
                })
                }
            })
          
        }
        
    }, [term, currentClass, currentGrade, userIdentity, reflash]);

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
        //查询身高体重和BMI图表数据
        if(userIdentity != "student" || !UserID || !term){
          return;
        }
        let termInfo = term && term.value && JSON.parse(term.value);
        //获取目前平均身高体重信息
        let url = BasicProxy + "/api/healthy/studentHealthInfoLogs?studentId=" + UserID +
        // "&termId=" + termInfo.termId +
        "&startDate=" + termInfo.startDate.substr(0, 10) +
        "&endDate=" + termInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
              Array.isArray(result.data) &&
              result.data.forEach((item)=>{
                item.bmiIndex = item.bmiIndex.toFixed(1);
              })
              setHeightWeightList(result.data);
            }
        })
        url = BasicProxy + "/api/healthy/mentalHealthy/student/testResult?studentId=" + UserID +
        "&schoolId=" + SchoolID +
        // "&termId=" + termInfo.termId +
        "&startDate=" + termInfo.startDate.substr(0, 10) +
        "&endDate=" + termInfo.endDate.substr(0, 10) ;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setMindList(result.data.testResults);
            }
        })
    }, [term, currentClass, currentGrade, userIdentity, reflash]);
    //点击学生查看学生详细信息
    const setStudentInfo = (data, type) => {
        let termInfo = term && term.value && JSON.parse(term.value);
        if(type == "base"){
          //获取目前平均身高体重信息
          let url = BasicProxy + "/api/healthy/studentHealthInfoLogs?studentId=" + data.userId +
          // "&termId=" + termInfo.termId +
          "&startDate=" + termInfo.startDate.substr(0, 10) +
          "&endDate=" + termInfo.endDate.substr(0, 10) ;
          fetch
          .get({url, securityLevel: 2})
          .then((res)=>res.json())
          .then((result)=>{
              if(result.status == 200 && result.data){
                Array.isArray(result.data) &&
                result.data.forEach((item)=>{
                  item.bmiIndex = item.bmiIndex.toFixed(1);
                })
                setHeightWeightList(result.data);
                setModalShowType("detail");
              }
          })
        }
        if(type == "mind"){
          //获取心理评测信息
          let url = BasicProxy + "/api/healthy/mentalHealthy/student/testResult?studentId=" + data.userId +
          "&schoolId=" + SchoolID +
          // "&termId=" + termInfo.termId +
          "&startDate=" + termInfo.startDate.substr(0, 10) +
          "&endDate=" + termInfo.endDate.substr(0, 10) ;
          fetch
          .get({url, securityLevel: 2})
          .then((res)=>res.json())
          .then((result)=>{
              if(result.status == 200 && result.data){
                  setMindList(result.data.testResults);
                  setModalShowType("detail");
              }
          })
        }
    }
    // csv转sheet对象
    function csv2sheet(csv) {
      var sheet = {}; // 将要生成的sheet
      csv = csv.split('\n');
      csv.forEach(function(row, i) {
        row = row.split(',');
        if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
        row.forEach(function(col, j) {
          sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
        });
      });
      return sheet;
    }
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    function sheet2blob(sheet, sheetName) {
      sheetName = sheetName || 'sheet1';
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      return blob;
    }
    function openDownloadDialog(url, saveName) {
      if(typeof url == 'object' && url instanceof Blob)
      {
        url = URL.createObjectURL(url); // 创建blob地址
      }
      var aLink = document.createElement('a');
      aLink.href = url;
      aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if(window.MouseEvent) event = new MouseEvent('click');
      else
      {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      }
      aLink.dispatchEvent(event);
    }
    const importFile = () => {
      let arr = [
        {
          name: 'pzw',
          age: '12',
          gender: "男"
        },
        {
          name: 'pzw',
          age: '12',
          gender: "男"
        },
        {
          name: 'pzw',
          age: '12',
          gender: "男"
        },
      ]
      var sheet = XLSX.utils.json_to_sheet(arr);
      
      openDownloadDialog(sheet2blob(sheet), '导出.xlsx')
    }
    //搜索框根据学生姓名搜索
    const searchStudent = (e) => {
      let keyword = e.target.value;
      setKeyWord(keyword);
      let arr = [];
      studentList.forEach((item)=>{
        if(item.userName.indexOf(keyword) != -1){
          arr.push(item);
        }
      })
      setSelectStudentList(arr);
    }
    const cancelSearch = () => {
      setSelectStudentList(studentList);
    }
    return (
      <div className="stu-condition" id="healthMsg">
        <Bar
          barName={"基本情况"}
          ref={baseMsg}
          topContext={
            userIdentity == "student" || userIdentity == "teacher"?
            <div className="module-link-group">
              <span 
              className="status" 
              onClick={()=>{
                // if(userIdentity == "teacher"){
                  // setStudentVisible(true)
                // } else {
                  setHeightWeightVisible(true)
                // }
                }}>
                查看身高体重详情信息
              </span>
            </div>
            :false}
          loading={false}
        >
            <HealthBaseMsg 
            userIdentity={userIdentity} 
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            reflash={reflash}
            data={baseMsgInfo} />
        </Bar>
        <Bar loading={false} barName={"身体健康"} ref={bodyHealth}>
            <BodyHealth 
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            reflash={reflash}
            userIdentity={userIdentity} />
        </Bar>
        <Bar 
        loading={false} 
        barName={"心理健康"} 
        ref={mindHealth}
        topContext={
        userIdentity == "student" || userIdentity == "teacher"?
        <div className="module-link-group">
          <span 
          className="status" 
          onClick={()=>{
            // if(userIdentity == "teacher"){
              // setStudentVisible(true)
            // } else {
              setMindVisible(true)
            // }
            }}>
            查看评测详情信息
          </span>
        </div>
        :false}>
            <MindHealth  
            currentClass={currentClass}
            currentGrade={currentGrade}
            currentTerm={term}
            reflash={reflash}
            userIdentity={userIdentity} />
        </Bar>
        <Modal
            type="1"
            title="基本情况详情"
            visible={heightWeightVisible}
            onOk={()=>setHeightWeightVisible(true)}
            onCancel={()=>{
              if(userIdentity != "student"){
                setModalShowType("list")
              }
              setHeightWeightVisible(false)}}
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
                        <li key={index} onClick={()=>setStudentInfo(item, "base")}>
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
                {/* <span onClick={importFile}>导出</span> */}
                <Table
                style={{marginTop: 20}}
                tableHeader={baseTableHeader}
                data={heightWeightList}
                ></Table>
              </div>
            }
            
        </Modal>
        <Modal
            type="1"
            title="基本情况详情"
            visible={mindVisible}
            onOk={()=>setMindVisible(true)}
            onCancel={()=>{
              if(userIdentity != "student"){
                setModalShowType("list")
              }
              setMindVisible(false)}}
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
                        <li key={index} onClick={()=>setStudentInfo(item, "mind")}>
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
                {/* <span onClick={importFile}>导出</span> */}
                <Table
                style={{marginTop: 20}}
                tableHeader={mindTableHeader}
                data={mindList}
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
  export default connect(mapStateToProps)(memo(forwardRef(HealthMsg)));
  