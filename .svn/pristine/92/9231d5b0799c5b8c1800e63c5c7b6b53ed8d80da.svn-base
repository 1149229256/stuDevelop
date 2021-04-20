/*
 *                   ___====-_  _-====___
 *             _--^^^#####//      \\#####^^^--_
 *          _-^##########// (    ) \\##########^-_
 *         -############//  |\^^/|  \\############-
 *       _/############//   (@::@)   \############\_
 *      /#############((     \\//     ))#############\
 *     -###############\\    (oo)    //###############-
 *    -#################\\  / VV \  //#################-
 *   -###################\\/      \//###################-
 *  _#/|##########/\######(   /\   )######/\##########|\#_
 *  |/ |#/\#/\#/\/  \#/\##\  |  |  /##/\#/  \/\#/\#/\#| \|
 *  `  |/  V  V  `   V  \#\| |  | |/#/  V   '  V  V  \|  '
 *     `   `  `      `   / | |  | | \   '      '  '   '
 *                      (  | |  | |  )
 *                     __\ | |  | | /__
 *                    (vvv(VVV)(VVV)vvv)
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                神兽保佑            永无BUG
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-12-07 15:17:40
 * @LastEditTime: 2020-12-15 09:16:53
 * @Description: 培训计划管理,可复用，所以尽量不要用reduce全局状态处理
 * @FilePath: \teacher-development\src\pages\train\index.js
 */

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
import Home from "./home";
import Publish from "./publish";
import Detail from "./detail";
import "./index.scss";
// import { handleRoute } from "../../util/public";
import { withRouter } from "react-router-dom";
import { Reducer, Context, initState } from "./reducer";
import Edit from "./edit";
function Train(props, ref) {
  let {
    teacherRecruitMsg,
    location,
    activeTab,
    removeTab,
    tabid,
    param, //param控制显示的模块
  } = props;
  const [Component, setComponent] = useState("");
  const [state, setDispatch] = useReducer(Reducer, initState);
  const homeRef = useRef({});
  let { component } = state;

  useEffect(() => {
    setComponent(param);
  }, [param]);
  // console.log(param,Component)
  // useEffect(() => {
  //   // console.log(location)
  //    //   if (location.pathname) {
  //   //     let Path = handleRoute(location.pathname);
  //   //     Path[0] === "trainDetail" &&
  //   //       Path[1] &&
  //   //       Path[1] !== ID &&
  //   //       setID(Path[1]);
  //   //   }
  // }, [])
  return (
    <Context.Provider value={{ state, setDispatch }}>
      <div className="Train">
        {Component === "home" ? (
          // component === "publish" ? (
          //   <Publish></Publish>
          // ) : (
          <Home ref={homeRef}></Home>
        ) : (
          // )
          ""
        )}
        {Component === "publish" ? (
          <Publish removeTab={removeTab}></Publish>
        ) : (
          ""
        )}
        {Component === "edit" ? <Edit removeTab={removeTab}></Edit> : ""}
        {tabid === "trainDetail" ? <Detail></Detail> : ""}
        {/* {Component === "edit" ? <Home></Home> : ""} */}
        {Component === "details" ? <Home></Home> : ""}
      </div>
    </Context.Provider>
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
