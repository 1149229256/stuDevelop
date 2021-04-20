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
import { getDataStorage } from "../../util/public";
import { withRouter } from "react-router-dom";
//   import { Reducer, Context, initState } from "./reducer";
function PersonalDetail(props, ref) {
  let { id, BasicWebRootUrl,roleMsg:{
    identityCode,
  } ,contentHW:{
    width
  }} = props;

  return (
    <div className="PersonalDetail">
      <iframe
      title={'教师画像详情'}
      style={{width:width}}
      className='PersonalDetail-frame'
        src={
          BasicWebRootUrl +
          "/html/userPersona/index.html?headerType=develop&userType=1&userID=" +
          id+'&lg_tk='+getDataStorage('token')+'&lg_ic='+identityCode
        }
      ></iframe>
    </div>
  );
}
const mapStateToProps = (state) => {
  let {
    commonData: {
      roleMsg,
      basePlatFormMsg: { BasicWebRootUrl },contentHW
    },
  } = state;
  return { roleMsg, BasicWebRootUrl,contentHW };
};
export default connect(mapStateToProps)(
  withRouter(memo(forwardRef(PersonalDetail)))
);
