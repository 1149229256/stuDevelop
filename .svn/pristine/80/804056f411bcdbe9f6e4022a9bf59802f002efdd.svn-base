import React, {
    useState,
    useEffect,
    useLayoutEffect,
    memo,
    forwardRef
} from 'react';
import {connect} from "react-redux";
import fetch from "../../util/fetch";
import {Empty, Loading} from "../../component/common";
import ipConfig from "../../util/ipConfig";
let { BasicProxy } = ipConfig;
function ClassAttainment(props){
    let {
        className,
        userIdentity,
        data,
        currentTerm,
        currentClass,
        currentGrade,
        userInfo: {UserID, SchoolID},
        setLoadVisible
    } = props;
    // const [loadVisible, setLoadVisible] = useState(true);
    const [commentList, setCommentList] = useState({});
    useLayoutEffect(()=>{
    //获取排名信息
    ///api/status/student
    if(!UserID || !currentTerm.term){
      return;
    }
    setLoadVisible(true);
    let url = BasicProxy + "/api/learning2/comprehensive?type=" + (
        userIdentity == "teacher"?
        2:
        userIdentity == "student"?
        1:
        4
    ) +
    "&studentId=" + UserID + 
    "&classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&schoolId=" + SchoolID +
    "&termId=" + currentTerm.term;
    // "&start=" + (currentTerm.termStartDate? 
    // new Date(currentTerm.termStartDate).toLocaleDateString().replaceAll("/", "-"): "2021-01-01") + 
    // "&end=" + (currentTerm.termEndDate?
    // new Date(currentTerm.termEndDate).toLocaleDateString().replaceAll("/", "-"): "2021-03-01");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>{
        return res.json();
    })
    .then((result)=>{
        if(result.status == 200 && result.data){
          setCommentList(result.data);
        }
        setLoadVisible(false)
    })
  }, [currentClass, UserID, currentTerm]);
    return (
        <div className={`card-content card-class-attainment ${className ? className : ""}`} >
                <p className="card-title">{ Array.isArray(commentList.qualityItemList) &&
               commentList.qualityItemList.length > 0? currentTerm.term: ""}</p>
           {
               Array.isArray(commentList.qualityItemList) &&
               commentList.qualityItemList.length > 0?
               commentList.qualityItemList.map((item, index)=>{
                   return (
                    <div className="circle-container" key={index}>
                        <div className=
                        {"circle " + 
                        (item.rank == "A"? 
                        "green": 
                        item.rank == "B"? 
                        "blue": 
                        item.rank == "C"? 
                        "violet": 
                        "brown")}>
                            {item.rank? item.rank: "--"}</div>
                        <p title={item.itemName}>{item.itemName}</p>
                    </div>
                   )
               }):
               <Empty
                title={"暂无数据"}
                className="pc-empty"
                type={"3"}
                ></Empty>
           }     
        </div>
    )
}
const mapStateToProps = (state) => {
    let { commonData } = state;
    return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(ClassAttainment)));