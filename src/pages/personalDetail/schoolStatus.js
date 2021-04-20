import React, {
    useState,
    useEffect,
    useLayoutEffect,
    memo,
    forwardRef
} from 'react';
import {connect} from "react-redux";
import DefaultImage from "./images/school-default.png";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
import { Loading } from "../../component/common";
let { BasicProxy } = ipConfig;
function SchoolStatus(props){
    let {
        className,
        userIdentity,
        data,
        currentTerm,
        currentClass,
        userInfo: {UserID, SchoolID, UserName},
        setLoadVisible
    } = props;
    const [schoolInfo, setSchoolInfo] = useState({});
    const [leaderInfo, setLeaderInfo] = useState({});
    useLayoutEffect(()=>{
        //获取学籍信息
        ///api/status/student
        if(!SchoolID){
        return;
        }
        setLoadVisible(true);
        let url = BasicProxy + "/api/status/school?schoolId=" + SchoolID;
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && result.data){
                setSchoolInfo(result.data);
            }
        })
        url = BasicProxy + "/api/base/getSchoolLeader?schoolId=" + SchoolID +
        "&position=0";
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && result.data){
                setLeaderInfo(result.data);
            }
            setLoadVisible(false);
        })
    }, [SchoolID]);
    return (
        <div className={`card-content card-class-status ${className ? className : ""}`}>
            <div className="img-container">
                <div className="school-bg"></div>
                {/* <img src={DefaultImage} /> */}
            </div>
            <p style={{marginTop: 5}}>总人数:<span>
                {typeof schoolInfo.schoolSize == "number"? schoolInfo.schoolSize: "--"}人</span></p>
            <p>校长:<span>{leaderInfo[0]? leaderInfo[0].userName: "--"}</span></p>
            <p style={{marginTop: 13}}>
                男生人数:
                <span>
                {typeof schoolInfo.maleNum == "number"? schoolInfo.maleNum: "--"}人.
                </span>
                {schoolInfo.schoolSize? 
                ((schoolInfo.maleNum/schoolInfo.schoolSize)*100).toFixed(1) + "%": "--"}</p>
            <p>女生人数:<span>
                {typeof schoolInfo.femaleNum == "number"? schoolInfo.femaleNum: "--"}人.</span>
                {schoolInfo.schoolSize? 
                ((schoolInfo.femaleNum/schoolInfo.schoolSize)*100).toFixed(1) + "%": "--"}</p>
            <p className="class-remark">
                <span className="remark-name">学校标语:</span>
                <span className="remark-content">--</span>
            </p>
        </div>
    )
}

const mapStateToProps = (state) => {
    let { commonData } = state;
    return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(SchoolStatus)));