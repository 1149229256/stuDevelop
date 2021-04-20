import React, {
    useState,
    useEffect,
    useLayoutEffect,
    memo,
    forwardRef
} from 'react';
import {connect} from "react-redux";
import DefaultImage from "./images/class-default.png";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
import { Loading } from "../../component/common";
let { BasicProxy } = ipConfig;
function ClassStatus(props){
    let {
        className,
        userIdentity,
        data,
        currentTerm,
        currentClass,
        userInfo: {UserID, SchoolID, UserName},
        setLoadVisible
    } = props;
    const [classInfo, setClassInfo] = useState({});
    useLayoutEffect(()=>{
        //获取学籍信息
        ///api/status/student
        setLoadVisible(true);
        if(!UserID){
        return;
        }
        if(!currentClass.classId){
            return;
        }
        let url = BasicProxy + "/api/status/class?classId=" + currentClass.classId;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && result.data){
                setClassInfo(result.data);
            }
            setLoadVisible(false);
        })
    }, [currentClass]);
    return (
        <div
        className={`card-content card-class-status ${className ? className : ""}`}
        >
        <div className="img-container">
        <div className="class-bg"></div>
        {/* <img src={DefaultImage} /> */}
        </div>
        <p style={{marginTop: 5}}>总人数:<span title={typeof classInfo.classSize == "number"? classInfo.classSize: "--"}>
            {typeof classInfo.classSize == "number"? classInfo.classSize: "--"}人</span></p>
        <p>班主任:<span title={UserName}>{UserName}</span></p>
        <p style={{marginTop: 13}}>男生人数:
        <span title={typeof classInfo.maleNum == "number"? classInfo.maleNum: "--"}>
            {typeof classInfo.maleNum == "number"? classInfo.maleNum: "--"}人
        </span>
        </p>
        <p>女生人数:
            <span title={typeof classInfo.femaleNum == "number"? classInfo.femaleNum: "--"}>
                {typeof classInfo.femaleNum == "number"? classInfo.femaleNum: "--"}人
            </span>
        </p>
        {/* <p className="class-remark">
            <span className="remark-name">班级寄语:</span>
            <span className="remark-content">愿望是进取的起点，习惯是成才的基础，努力是成功的阶梯，选
                择行动塑造最优秀的自己</span>
        </p> */}
            
        </div>
    )
}
const mapStateToProps = (state) => {
    let { commonData } = state;
    return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(ClassStatus)));