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
import fetch from "../../../util/fetch";
import { Empty } from "../../../component/common";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;

function MindHealth(props, ref) {
    let {
        userIdentity,
        testAvg,
        projectList,
        currentTerm,
        currentClass,
        currentGrade,
        reflash,
        userInfo: {UserID, SchoolID},
    } = props;
    //评测统计信息
    const [mindTestInfo, setMindTestInfo] = useState({});
    useLayoutEffect(() => {
        if(!currentTerm){
            return;
        }
        if(userIdentity == "student" && !UserID){
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
        let currentTermInfo = currentTerm && currentTerm.value? JSON.parse(currentTerm.value): {};
        //获取体测项目列表
        let url = BasicProxy + "/api/healthy/mentalHealthy/mentalHealthyInfo?classId=" +
        currentClass +
        "&gradeId=" + (userIdentity == "teacher" && !currentGrade? classGradeId: currentGrade) +
        "&schoolId=" + SchoolID +
        "&startDate=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") +
        "&endDate=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                setMindTestInfo(result.data);
            }
        })
    }, [currentTerm, currentClass, currentGrade, userIdentity, UserID, reflash]);
    return (
        <div className="mind-health">
            <div className="show-top">
                {
                    Array.isArray(mindTestInfo.mentalHealthTestList) &&
                    mindTestInfo.mentalHealthTestList.length > 0?
                    mindTestInfo.mentalHealthTestList.map((item, index)=>{
                        return (
                            <div className={"test-info-one " + 
                            (item.testResult == "轻度抑郁"? "orange":
                            item.testResult == "正常"? "green":
                            item.testResult == "异常"? "red":
                            "green"
                            )} key={index}>
                                <i className="cardlogo"></i>
                                <p className="test-name">
                                    <i className="dotlogo"></i>
                                    {item.testName? item.testName: "--"}
                                </p>
                                {
                                    userIdentity == "manager"?
                                    <p className="test-num">
                                        <span>正常人数: 
                                            <span style={{color: 'green'}}>
                                            {item.normalNumber}
                                            </span>
                                        </span>
                                        <span>异常人数: 
                                            <span style={{color: '#ff0000'}}>
                                            {item.normalNumber}
                                            </span>
                                        </span>
                                    </p>:
                                    ""
                                }
                                <p className="test-time">
                                    测试时间: {item.testDate}
                                </p>
                            </div>
                        )
                    }):
                    <Empty
                    // className={"list-empty"}
                    style={{margin: "40px 0"}}
                    title={"暂无数据"}
                    type={"4"}
                    ></Empty>
                }
                {/* <div className="test-info-one orange">
                    <i className="cardlogo"></i>
                    <p className="test-name">
                        <i className="dotlogo"></i>
                        焦虑测试
                    </p>
                    {
                        userIdentity == "manager"?
                        <p className="test-num">
                            <span>正常人数: <span style={{color: 'green'}}>47</span></span>
                            <span>异常人数: <span style={{color: '#ff0000'}}>27</span></span>
                        </p>:
                        ""
                    }
                    <p className="test-time">
                        测试时间: 2020-12-31
                    </p>
                </div>
                <div className="test-info-one green">
                    <i className="cardlogo"></i>
                    <p className="test-name">
                        <i className="dotlogo"></i>
                        焦虑测试
                    </p>
                    {
                        userIdentity == "manager"?
                        <p className="test-num">
                            <span>正常人数: <span style={{color: 'green'}}>47</span></span>
                            <span>异常人数: <span style={{color: '#ff0000'}}>27</span></span>
                        </p>:
                        ""
                    }
                    <p className="test-time">
                        测试时间: 2020-12-31
                    </p>
                </div>
                <div className="test-info-one red">
                    <i className="cardlogo"></i>
                    <p className="test-name">
                        <i className="dotlogo"></i>
                        焦虑测试
                    </p>
                    {
                        userIdentity == "manager"?
                        <p className="test-num">
                            <span>正常人数: <span style={{color: 'green'}}>47</span></span>
                            <span>异常人数: <span style={{color: '#ff0000'}}>27</span></span>
                        </p>:
                        ""
                    }
                    <p className="test-time">
                        测试时间: 2020-12-31
                    </p>
                </div> */}
            </div>
            {/* {
                userIdentity == "manager"?
                "":
                <div className="show-bottom">
                    <span className="remark-name">建议:</span>
                    <span className="remark-content">
                    要想走出抑郁状态，要在对待疾病的态度上做出转变。抑郁状态出现初始，很多人是敌对它憎恨它，
                    经常抱怨自己为什么会得这种病，因而十分痛苦。我们应该逐渐学会
                    宽恕与接纳，感恩疾病助自己成长，感恩疾病让自己走上探索心理的道路，感恩疾病让自己明白了很多
                    关于生命的信息，包括如何深度地了解自己、思考如何完善人性的
                    弱点、提高个体的力量、丰富思考问题的角度、了解生命的意义等等。
                    </span>
                </div>
            }  */}
        </div>
    );
}
  
const mapStateToProps = (state) => {
    let {
        commonData: { levelHash, userInfo },
    } = state;
    return { levelHash, userInfo };
};
export default connect(mapStateToProps)(memo(forwardRef(MindHealth)));
  