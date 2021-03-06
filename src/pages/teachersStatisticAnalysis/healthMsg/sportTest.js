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
import { Progress } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;

function SportTest(props, ref) {
    let {
        userIdentity,
        testAvg,
        projectList,
        currentTerm,
        currentClass,
        currentGrade,
        reflash,
        userInfo: {UserID, SchoolID}
    } = props;
    const colorList = ['#ffb487', '#879bff', '#67d4d8', '#ff8787', '#51c2fd'];
    const [sportTestList, setSportTestList] = useState([]);
    const [testSum, setTestSum] = useState(0);
    useLayoutEffect(() => {
        //获取体测成绩数据
        if(!currentTerm){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        if(userIdentity == "student" && !UserID){
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
        let currentTermInfo = currentTerm && currentTerm.value? JSON.parse(currentTerm.value): {};
        //获取体测中考项目列表及成绩
        let url = BasicProxy + "/api/healthy/hee/highSchoolEntranceExaminationSportsResults?studentId=" +
       (userIdentity == "student"?
        UserID:
        "") +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        "&schoolId=" + SchoolID +
        "&startDate=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                setSportTestList(result.data);
            }
        })
        //获取中考成绩总分
        url = BasicProxy + "/api/healthy/hee/totalScoreAverage?studentId=" +
       (userIdentity == "student"?
        UserID:
        "") +
        "&classId=" + currentClass +
        "&gradeId=" + (
            userIdentity == "teacher" && !currentGrade?
            classGradeId:
            currentGrade) +
        "&schoolId=" + SchoolID +
        "&startDate=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setTestSum(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, userIdentity, UserID, SchoolID, reflash]);
    return (
        <div className="sport-test">
            <div className="test-sum">
                <Progress 
                type="circle" 
                percent={testSum? testSum: 0}
                width={92}
                format={(percent) => percent}
                className="progress"
                strokeColor="#8fdb66" />
                <p>体育考试总分</p>
            </div>
            <div className="slice-line"></div>
            <div className="sport-project-list">
                <Scrollbars>
                {
                    sportTestList.map((item, index)=>{
                        return (
                        <div className="project-list-one" key={index}>
                            <span className="sport-project-name">
                                {
                                    item.testName?
                                    item.testName:
                                    "--"
                                }
                            </span>
                            <Progress
                            status="active"
                            percent={
                                typeof item.totalScore == "number"?
                                parseInt((item.averageScore / item.totalScore)*100):
                                0
                            }
                            strokeWidth={12}
                            showInfo={false}
                            className="sport-project-progress"
                            strokeColor="#49aaea" />
                            <span className="sport-project-grade" style={{color: '#eb7833'}}>
                                {typeof item.averageScore == "number"? item.averageScore.toFixed(1): "--"}{item.unit}</span>
                            {/* <span className="avg-grade">
                                班级平均<span>17</span>分/
                            </span>
                            <span className="avg-grade">
                                年级平均<span>17</span>分
                            </span> */}
                        </div>
                        )
                    })
                }
                </Scrollbars>
            </div>
        </div>
    );
}
  
const mapStateToProps = (state) => {
    let {
        commonData: { levelHash, userInfo },
    } = state;
    return { levelHash, userInfo };
};
export default connect(mapStateToProps)(memo(forwardRef(SportTest)));
  