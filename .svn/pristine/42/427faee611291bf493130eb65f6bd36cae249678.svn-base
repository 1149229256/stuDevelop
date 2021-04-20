
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
function GradeRank(props){
    let {
        className,
        userIdentity,
        data,
        currentTerm,
        currentClass,
        userInfo: {UserID, SchoolID},
        setLoadVisible
    } = props;
    const [gradeInfoList, setGradeInfoList] = useState([]);
    // const [loadVisible, setLoadVisible] = useState(true);
      useLayoutEffect(()=>{
        //获取班级排名信息
        ///api/status/student
        if(!UserID || !currentTerm.term){
          return;
        }
        setLoadVisible(true);
        let url = BasicProxy + "/api/learning2/exam/scoreRank/batch?type=3" +
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
              setGradeInfoList(result.data);
            }
            setLoadVisible(false);
        })

      }, [currentClass, UserID, currentTerm]);

    return (
        <div className={`card-content card-grade-rank ${className ? className : ""}`}>
            <Scrollbars
            autoHeight
            autoHeightMax={360}
            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}>
                {
                    gradeInfoList.map((item, index)=>{
                        let sumAvg = 0;
                        item.examScoreAndRankList.forEach((child)=>{
                            if(child.subject == "总分" && child.examName == "期末"){
                                sumAvg = child.score;
                            }
                            if(!sumAvg && child.subject == "总分" && child.examName == "期中"){
                                sumAvg = child.score;
                            }
                        })
                        return (
                        <div className="grade-info-one" key={index}>
                            <p className="grade-title">{item.gradeName}:</p>
                            <div className="grade-detail">
                                <div className="detail-left">
                                    {/* <ul className="rate-list">
                                        <li>优秀率:<span>23%</span></li>
                                        <li>及格率:<span>23%</span></li>
                                        <li>最高分:<span>23</span></li>
                                        <li>最低分:<span>23</span></li>
                                    </ul> */}
                                    <p className="sum-avg">{sumAvg}</p>
                                    <p>总分平均分</p>
                                </div>
                                <div className="slice-line"></div>
                                <div className="detail-right">
                                    <ul className="grade-class-list">
                                    <Scrollbars
                                    autoHeight
                                    autoHeightMax={128}
                                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}>
                                        {
                                            item.examScoreAndRankList.map((child, index1)=>{
                                                if(child.subject == "总分"){
                                                    return;
                                                }
                                                return (
                                                    <li key={index1}>
                                                        <i className="ranklogo"></i>
                                                        <span className="class-name">{child.subject}</span>
                                                        <span className="rank-score">平均分:{child.score}</span>
                                                    </li> 
                                                )
                                            })
                                        }
                                        {/* <li>
                                            <i className="ranklogo"></i>
                                            <span className="class-name">一年级(13)班</span>
                                            <span className="rank-score">平均分:451</span>
                                        </li>
                                        <li>
                                            <i className="ranklogo"></i>
                                            <span className="class-name">一年级(13)班</span>
                                            <span className="rank-score">平均分:451</span>
                                        </li>
                                        <li>
                                            <i className="ranklogo"></i>
                                            <span className="class-name">一年级(13)班</span>
                                            <span className="rank-score">平均分:451</span>
                                        </li> */}
                                        </Scrollbars>
                                    </ul>
                                    
                                </div>
                            </div>
                        </div> 
                        )
                    })
                }
            {/* <div className="grade-info-one">
                <p className="grade-title">一年级:</p>
                <div className="grade-detail">
                    <div className="detail-left">
                        <ul className="rate-list">
                            <li>优秀率:<span>23%</span></li>
                            <li>及格率:<span>23%</span></li>
                            <li>最高分:<span>23</span></li>
                            <li>最低分:<span>23</span></li>
                        </ul>
                    </div>
                    <div className="slice-line"></div>
                    <div className="detail-right">
                        <ul className="grade-class-list">
                            <li>
                                <i className="ranklogo"></i>
                                <span className="class-name">一年级(13)班</span>
                                <span className="rank-score">平均分:451</span>
                            </li>
                            <li>
                                <i className="ranklogo"></i>
                                <span className="class-name">一年级(13)班</span>
                                <span className="rank-score">平均分:451</span>
                            </li>
                            <li>
                                <i className="ranklogo"></i>
                                <span className="class-name">一年级(13)班</span>
                                <span className="rank-score">平均分:451</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> */}
            </Scrollbars>        
        </div>
    )
}
const mapStateToProps = (state) => {
    let { commonData } = state;
    return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(GradeRank)));