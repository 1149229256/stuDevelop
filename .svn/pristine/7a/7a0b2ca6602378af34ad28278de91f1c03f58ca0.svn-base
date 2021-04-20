import {
    connect,
    // useSelector,
    useDispatch,
} from "react-redux";
import React, {
    memo,
    useEffect,
    useState,
    useImperativeHandle,
    useRef,
    useLayoutEffect,
    forwardRef,
} from "react";
import { Table, Progress } from "antd";
import "./index.scss";
import { Empty, Loading } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
function AttendanceStatus(props){
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
        reflash
    } = props;
    const [currentIndex, setCurrentIndex] = useState(1);
    const [attendanceList, setAttendanceList] = useState([]);
    const [schoolAttendanceInfo, setSchoolAttendanceInfo] = useState([]);
    const [visible, setVisible] = useState(true);
    useLayoutEffect(() => {
        if(userIdentity == "student" && (!UserID || !currentClass || !currentGrade)){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        setVisible(true);
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};  
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
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setAttendanceList(result.data);
            }
        })
        //获取全校出勤率信息
        url = BasicProxy + "/api/attendance/attendance/times?type=4&studentId=" + 
        (userIdentity == "student"? UserID: "") +
        "&classId=" + currentClass +
        "&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&statisticalType=1" +
        // "&termId=" + currentTermInfo.termId +
        "&start=" + currentTermInfo.startDate.substr(0, 10) +
        "&end=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setSchoolAttendanceInfo(result.data);
            }
            setVisible(false);
        })
    }, [userIdentity, currentGrade, currentClass, currentTerm, reflash]);
    let tableHeader = [
        {
            title: '序号',
            key: 'index',
            dataIndex: 'index',
            width: 128,
            ellipsis: true
        },
        {
            title: userIdentity == 'teacher'? '姓名': '班级',
            key: userIdentity == 'teacher'? 'studentName': 'className',
            dataIndex: userIdentity == 'teacher'? 'studentName': 'className',
            width: 309,
            ellipsis: true
        },
        {
            title: '迟到次数',
            key: 'askleave',
            dataIndex: 'askleave',
            width: 176,
            ellipsis: true
        }
        ,
        {
            title: '早退次数',
            key: 'out',
            dataIndex: 'out',
            width: 176,
            ellipsis: true
        }
        ,
        {
            title: '缺勤次数',
            key: 'absence',
            dataIndex: 'absence',
            width: 176,
            ellipsis: true
        }
        ,
        {
            title: '晚归次数',
            key: 'lateback',
            dataIndex: 'lateback',
            width: 176,
            ellipsis: true
        }
    ]
    let Total = attendanceList.length;
    
    let paginationObj = Total > 8?{
        total: Total,
        showQuickJumper: false,
        showSizeChanger: false,
        current: currentIndex,
        position: ['bottomCenter'],
        pageSize: 8,
        onChange: (pageIndex)=>setCurrentIndex(pageIndex)
    }:false;
    return (
        <div className="all-attendance-status">
            <Loading
            opacity={false}
            tip="加载中..."
            spinning={visible}>
            {
                userIdentity == "manager"?
                <div className="attendance-status-top">
                    <div className="progress-container">
                        <Progress 
                        type="circle" 
                        percent={parseInt(Number(schoolAttendanceInfo.avgAttendanceRate)*100)}
                        format={(percent)=> percent}
                        width={92}
                        className="progress attendance-rate"
                        strokeColor="#9780F8" />
                        <p>全校出勤率</p>
                    </div>
                    <div className="progress-container">
                        <Progress 
                        type="circle" 
                        percent={schoolAttendanceInfo.vacateTimes}
                        format={(percent)=> percent}
                        width={92}
                        className="progress askleave-rate"
                        strokeColor="#FFAF54" />
                        <p>请假人数</p>
                    </div>
                    <div className="progress-container">
                        <Progress 
                        type="circle" 
                        percent={schoolAttendanceInfo.lateTimes}
                        format={(percent)=> percent}
                        width={92}
                        className="progress late-rate"
                        strokeColor="#FD8276" />
                        <p>迟到人数</p>
                    </div>  
                </div>:
                ""
            }
            {
                userIdentity == "manager" && !currentGrade && !currentClass?
                "":
                <Table
                    dataSource={attendanceList}
                    columns={tableHeader}
                    rowClassName="rows"
                    pagination={paginationObj}
                    className={"attendance-table " + (Total > 8? "table-min": "")}
                ></Table>
            }
            
            </Loading>
            
        </div>
    )
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
export default connect(mapStateToProps)(memo(forwardRef(AttendanceStatus)));