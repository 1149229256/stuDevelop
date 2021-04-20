import React, {
  //   useCallback,
  memo,
  useEffect,
  useState,
  // useImperativeHandle,
  // useMemo,
  // useReducer,
  // createContext,
  // useContext,
  //   useRef,
  forwardRef,
} from "react";
import { withRouter, Router, Route, HashRouter } from "react-router-dom";
import { handleRoute } from "@/util/public";
import { Scrollbars } from "react-custom-scrollbars";
import { EmptyReact } from "@/component/common";
import "./index.scss";
//   import { Search, Empty } from "../common";

function Page(props, ref) {
  let {
    className,
    basePlatFormMsg,
    pageList,
    location,
    history,
    useScrollbars,
    ProVersion,
    domList,
    // commonData: {
    //   userInfo: {
    //     UserID
    //   }
    // }
  } = props;
  useEffect(() => {
    let Path = handleRoute(location.pathname);
    let isExist = false;
    pageList.forEach((child, index) => {
      if (child.props.pageid === Path[1]) {
        isExist = true;
        // 路由上有parma，但组件没有，改变路由
        if (Path[2] && !child.props.param) {
          history.push("/page/" + child.props.pageid);
        } else if (!Path[2] && child.props.param) {
          //有设置param但路由没有,如果第一个也没有就有组件自己控制
          if (!pageList[0].props.param) {
            history.push("/page/" + pageList[0].props.pageid);
          } else {
            window.location.href =
              basePlatFormMsg.BasicWebRootUrl + "/Error.aspx?errcode=E012";

            //http://192.168.2.207:10108/Error.aspx?errcode=E012
          }
        }
      }
    });
    if (!isExist && pageList.length > 0) {
      let UserID = sessionStorage.getItem("UserInfo")? JSON.parse(sessionStorage.getItem("UserInfo")).UserID: "";
      history.push("/page/" + pageList[0].props.pageid + "/" + UserID);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageList, location]);
  return (
    <EmptyReact
      component={useScrollbars === undefined || useScrollbars ? Scrollbars : ""}
    >
      <div className={`lg-page ${className ? className : ""}`}>
        <HashRouter>
          {pageList.map((child, index) => {
            let param = child.props.param ? "/:" + child.props.param : "";
            return (
              <Route
                key={index}
                path={"/page/" + child.props.pageid + param}
                //   component={child}
              >
                {child}
              </Route>
            );
          })}
        </HashRouter>
        {/* <p className='lg-page-proversion'>{ProVersion}</p> */}
      </div>
    </EmptyReact>
  );
}
export default withRouter(memo(forwardRef(Page)));
