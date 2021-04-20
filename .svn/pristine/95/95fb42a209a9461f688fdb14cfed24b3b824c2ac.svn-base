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
import { Progress } from "antd";
import { Empty } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
function AwardPunishRank(props, ref) {
    let {
        currentTerm,
        currentGrade,
        currentClass,
        reflash,
        userIdentity,
        userInfo: {SchoolID}
    } = props;
    const [awardList, setAwardList] = useState([]);
    const [punishList, setPunishList] = useState([]);
    useLayoutEffect(() => {
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};
        if(userIdentity == "manager" && !currentClass){
            return;
        }
        if(userIdentity == "teacher" && !currentClass){
            return;
        }
        //获取奖励排行信息
        let url = BasicProxy + "/api/punishAndReward/rewards/rank?classId=" + 
        currentClass +
        "&startDate=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") + 
        "&endDate=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                let arr = result.data.splice(0, 5);
                setAwardList(arr);
            }
        })
        //获取处罚排行信息
        url = BasicProxy + "/api/punishAndReward/punishment/rank?classId=" + currentClass +
        "&startDate=" + currentTermInfo.startDate.substr(0, 10) + "&endDate=" + currentTermInfo.endDate.substr(0, 10);
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                let arr = result.data.splice(0, 5);
                setPunishList(arr);
            }
        })
    }, [currentTerm,currentGrade, currentClass, reflash])
    useLayoutEffect(() => {
        //领导端调用接口
        let currentTermInfo = currentTerm.value? JSON.parse(currentTerm.value): {};
        if(userIdentity != "manager" || currentClass){
            return;
        }
        //获取奖励排行信息
        let url = BasicProxy + "/api/punishAndReward/rewards/leader/classRank?classId=&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&startDate=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") + 
        "&endDate=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                let arr = [];
                result.data.forEach((item)=>{
                    let obj = {
                        ...item.classInfo,
                        rewardsCount: item.rewardsCount
                    }
                    arr.push(obj);
                })
                let arr1 = arr.splice(0, 5);
                setAwardList(arr1);
            }
        })
        //获取处罚排行信息
        url = BasicProxy + "/api/punishAndReward/punishment/leader/classRank?classId=&gradeId=" + currentGrade +
        "&schoolId=" + SchoolID +
        "&startDate=" + (currentTermInfo.startDate?currentTermInfo.startDate.substr(0, 10): "") + 
        "&endDate=" + (currentTermInfo.endDate?currentTermInfo.endDate.substr(0, 10): "");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && Array.isArray(result.data)){
                let arr = [];
                result.data.forEach((item)=>{
                    let obj = {
                        ...item.classInfo,
                        punishCount: item.punishCount
                    }
                    arr.push(obj);
                })
                let arr1 = arr.splice(0, 5);
                setPunishList(arr1);
            }
        })
    }, [currentTerm, currentGrade, currentClass, reflash])
    return (
        <div className="award-punish-rank">
            <div className="award-rank">
                <i className="award-logo"></i>
                <ul className="rank-list">
                    {
                        awardList.length > 0?
                        awardList.map((item, index)=>{
                            return (
                                <li key={index}>
                                    <i className={"ranklogo " + 
                                    (index == 0? "one": 
                                    index == 1? "two": 
                                    index == 2? "three": 
                                    "")}></i>
                                    {
                                        item.userImageUrl?
                                        <img src={item.userImageUrl}/>:
                                        ""
                                    }
                                    <span 
                                    className="rank-name"
                                    title={item.username || item.className}
                                    >{item.username || item.className}</span>
                                    <span 
                                    className={"rank-grade " + 
                                    (index == 0? "one": 
                                    index == 1? "two": 
                                    index == 2? "three": 
                                    "")}
                                    title={item.rewardsCount}
                                    >获得{item.rewardsCount}个奖项</span>
                                </li>
                            )
                        }):
                        <Empty
                        className={"bar-empty"}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                </ul>   
            </div>
            <div className="slice-line"></div>
            <div className="punish-rank">
                <i className="punish-logo"></i>
                <ul className="rank-list">
                    {
                        punishList.length > 0?
                        punishList.map((item, index)=>{
                            return (
                                <li key={index}>
                                    <i className="ranklogo"></i>
                                    {
                                        item.userImageUrl?
                                        <img src={item.userImageUrl}/>:
                                        ""
                                    }
                                    <span 
                                    className="rank-name"
                                    title={item.username || item.className}
                                    >{item.username || item.className}</span>
                                    <span 
                                    className={"rank-grade " + 
                                    (index == 0? "one": 
                                    index == 1? "two": 
                                    index == 2? "three": 
                                    "")}
                                    title={item.punishCount}
                                    >受到{item.punishCount}个处罚</span>
                                </li>
                            )
                        }):
                        <Empty
                        className={"bar-empty"}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                </ul>   
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
export default connect(mapStateToProps)(memo(forwardRef(AwardPunishRank)));
  