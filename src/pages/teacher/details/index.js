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
import { withRouter } from "react-router-dom";
import FileDetail from "@/component/fileDetail";
import { getCruitList } from "@/api/train";
import moment from "moment";
import { Search } from "@/component/common";
function Train(props, ref) {
  let {
    history,
    roleMsg: { schoolID, collegeID, selectLevel },
  } = props;
 
  return (
    <div className="frame-type-route teacher-train-details">
       <FileDetail></FileDetail>
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    handleData: { teacherRecruitMsg },
    commonData: { roleMsg },
  } = state;
  return { teacherRecruitMsg, roleMsg };
};
export default connect(mapStateToProps)(withRouter(memo(forwardRef(Train))));
