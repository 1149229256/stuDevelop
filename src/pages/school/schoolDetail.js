import {
  connect,
  // useSelector,
  //   useDispatch,
} from "react-redux";
import React, {
  // useCallback,
  memo,
  useMemo,
  useEffect,
  useState,
  useReducer,
  // useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import "./index.scss";
import { getDataStorage } from "../../util/public";
import { withRouter } from "react-router-dom";
import Analysis from "../teachersStatisticAnalysis";
//   import { Reducer, Context, initState } from "./reducer";
function SchoolDetail(props, ref) {
  let {
    id,
    BasicWebRootUrl,
    roleMsg: { identityCode, schoolID },
    levelMsg,
    contentHW: { width },
    schoolMsg,
  } = props;
  const [SelectTab, setSelectTab] = useState({
    tabid: "teacherBaseMsg",
    tabname: "教师基本信息",
  });
  const roleData = useMemo(() => {
    if(!id||!levelMsg){
      return {}
    }
    let { nextProductLevel, nextSelectLevel, nextTitle } = levelMsg;
    let data = { selectLevel: nextSelectLevel, productLevel: nextProductLevel };
    if (nextProductLevel === 3) {
      //中小学
      data.schoolID = id;
      data.collegeID = "";
    } else if (nextProductLevel === 4) {
      data.schoolID = schoolID;
      data.collegeID = id;
    } else {
      //错误
      data.productLevel = false;
    }
    return data;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelMsg,id]);
  return (
    <div className="SchoolDetail">
      {roleData&&roleData.productLevel ? (
        <Analysis
          type={"school"}
          roleData={roleData}
          schoolMsg={schoolMsg}
          tabid={SelectTab.tabid}
        ></Analysis>
      ) : (
        ""
      )}
      {/* <iframe
      title={'教师画像详情'}
      style={{width:width}}
      className='SchoolDetail-frame'
        src={
          BasicWebRootUrl +
          "/html/userPersona/index.html?headerType=develop&userType=1&userID=" +
          id+'&lg_tk='+getDataStorage('token')+'&lg_ic='+identityCode
        }
      ></iframe> */}
    </div>
  );
}
const mapStateToProps = (state) => {
  let {
    commonData: {
      roleMsg,
      basePlatFormMsg: { BasicWebRootUrl },
      contentHW,
    },
  } = state;
  return { roleMsg, BasicWebRootUrl, contentHW };
};
export default connect(mapStateToProps)(
  withRouter(memo(forwardRef(SchoolDetail)))
);
