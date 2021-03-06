import React, {
    useState,
    useEffect,
    useLayoutEffect,
    memo,
    forwardRef
} from 'react';
import {connect} from "react-redux";
import {Scrollbars} from "react-custom-scrollbars";
import { Loading } from "../../component/common";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
let { BasicProxy } = ipConfig;
function ClassRank(props){
    let {
        className,
        userIdentity,
        data,
        currentTerm,
        currentClass,
        userInfo: {UserID, SchoolID},
        setLoadVisible
    } = props;
    const [rankInfo, setRankInfo] = useState({});
    const [subjectList, setSubjectList] = useState([]);
    const [rankList, setRankList] = useState([]);
      useLayoutEffect(()=>{
        //获取班级排名信息
        ///api/status/student
        if(!UserID || !currentTerm.term){
          return;
        }
        setLoadVisible(true);
        let url = BasicProxy + "/api/learning2/exam/scoreRank?type=2" +
        "&studentId=&classId=" + currentClass.classId +
        "&gradeId=" + currentClass.gradeId +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTerm.term +
        "&examType=2" +
        "&start=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
        "&end=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && result.data){
              setRankInfo(result.data);
            }
        })
        //获取平均分列表
        url = BasicProxy + "/api/learning2/homework/avgScore?type=2" +
        "&studentId=&classId=" + currentClass.classId +
        "&gradeId=" + currentClass.gradeId +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTerm.term +
        "&examType=2" +
        "&start=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
        "&end=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>{
            return res.json();
        })
        .then((result)=>{
            if(result.status == 200 && result.data){
              setSubjectList(result.data);
            }
        })
        //获取班级学生分数信息  
        url = BasicProxy + "/api/learning2/rank?type=2" +
        "&classId=" + currentClass.classId +
        "&gradeId=" + currentClass.gradeId +
        "&schoolId=" + SchoolID +
        "&termId=" + currentTerm.term +
        "&start=" + (currentTerm.termStartDate? currentTerm.termStartDate: "2021-01-01") + 
        "&end=" + (currentTerm.termEndDate? currentTerm.termEndDate: "2021-03-01");
        fetch
        .get({url, securityLevel: 2})
        .then((res)=>res.json())
        .then((result)=>{
            if(result.status == 200 && result.data){
                result.data.forEach((item)=>{
                    if(item.rankType.indexOf("考试") != -1){
                        setRankList(item.learningRankListList);
                        
                    }
                })
                setLoadVisible(false);
            }
        })
      }, [currentClass, UserID, currentTerm]);
    return (
        <div
        className={`card-content card-class-rank ${className ? className : ""}`} >
            <div className="class-rank-top">
                <div className="sum-rank">
                    <div className="rank-num">{rankInfo.gradeRank? rankInfo.gradeRank: "--"}</div>
                    <p>班级总分排名</p>
                </div>
                <div className="slice-line"></div>
                <ul className="subject-rank-list">
                    <Scrollbars
                    autoHeight
                    autoHeightMax={80}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}>
                    {
                        subjectList.map((item, index)=>{
                            return (
                            <li key={index}>
                            {item.subjectName}分数: 
                            <span className="grade-rank">{item.score}</span>
                            </li>
                            )
                        })
                    }
                    {/* <li>
                        语文排名:
                        <span className="grade-rank">3</span>
                    </li>
                    <li>
                        语文排名:
                        <span className="grade-rank">3</span>
                    </li> */}
                    </Scrollbars>
                </ul>
            </div>
            <div className="class-rank-bottom">
                <div className="table-head">
                    <div className="table-th th-name" style={{width: '50%'}}>姓名</div>
                    <div className="table-th" style={{width: '20%'}}>总分</div>
                    <div className="table-th" style={{width: '30%'}}>排名</div>
                    {/* <div className="table-th th-name" style={{width: '40%'}}>姓名</div>
                    <div className="table-th" style={{width: '18%'}}>总分</div>
                    <div className="table-th" style={{width: '21%'}}>班级排名</div>
                    <div className="table-th" style={{width: '21%'}}>年级排名</div> */}
                </div>
                <Scrollbars
                autoHeight
                autoHeightMax={160}
                // renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}>
                    {
                        rankList.map((item, index)=>{
                            return (
                                <div className="stu-rank-list" key={index}>
                                    <div className="stu-name" style={{width: '50%'}}>
                                        <img src={item.photo} />
                                        {item.name}
                                    </div>
                                    <div className="stu-sum" style={{width: '20%'}}>
                                        {item.score}
                                    </div>
                                    <div className="stu-class-rank" style={{width: '30%'}}>
                                        {item.rank}
                                        {/* <i className="uplogo"></i> */}
                                    </div>
                                </div>
                            )
                        })
                    }
                    {/* <div className="stu-rank-list">
                        <div className="stu-name" style={{width: '40%'}}>
                            <img src="" />
                            马保国
                        </div>
                        <div className="stu-sum" style={{width: '18%'}}>
                            566
                        </div>
                        <div className="stu-class-rank" style={{width: '21%'}}>
                            1
                            <i className="uplogo"></i>
                        </div>
                        <div className="stu-grade-rank" style={{width: '21%'}}>
                            3
                            <i className="uplogo"></i>
                        </div>
                    </div> */}
                </Scrollbars>
                {/* <div className="rank-info">
                    <p>
                        进步最大:
                        <span>马保国(年级进步23名)</span>
                    </p>
                    <p>
                        退步最大:
                        <span>马保国(年级退步23名)</span>
                    </p>
                </div> */}
            </div>          
        </div>
    )
}
const mapStateToProps = (state) => {
    let { commonData } = state;
    return { ...commonData };
  };
export default connect(mapStateToProps)(memo(forwardRef(ClassRank)));