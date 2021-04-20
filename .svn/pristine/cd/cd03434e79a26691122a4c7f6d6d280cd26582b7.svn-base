import {
  connect,
  // useSelector,
  //   useDispatch,
} from "react-redux";
import React, {
  // useCallback,
  memo,
  useEffect,
  useState,
  useReducer,
  // useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import "./index.scss";
import { handleRoute } from "../../util/public";
import { withRouter } from "react-router-dom";
import PersonalList from "./personalList";
import PersonalDetail from "./personalDetail";
//   import { Reducer, Context, initState } from "./reducer";
function TeacherPersonal(props, ref) {
  let {
    location,
    activeTab,
    removeTab,
    tabid,contentHW:{
      height
    },
    param, //param控制显示的模块
  } = props;
  const [Component, setComponent] = useState("");
  const [ID, setID] = useState("");
  // const [state, setDispatch] = useReducer(Reducer, initState);
  // let { component } = state;

  useEffect(() => {
    setComponent(param);
  }, [param]);
  // console.log(param,Component)
  useEffect(() => {
    if (location.pathname) {
      let Path = handleRoute(location.pathname);
      Path[0] === "personalDetail" && Path[1] && setID(Path[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="TeacherPersonal" style={{ height: height }}>
      {Component === "list" ? <PersonalList></PersonalList> : <></>}
      {Component === "detail" ? <PersonalDetail id={ID}></PersonalDetail> : <></>}
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    handleData: { teacherRecruitMsg },
    commonData: { roleMsg,contentHW },
  } = state;
  return { teacherRecruitMsg, roleMsg ,contentHW};
};
export default connect(mapStateToProps)(
  withRouter(memo(forwardRef(TeacherPersonal)))
);
