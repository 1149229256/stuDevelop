import React, {
  //   useCallback,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  // useMemo,
  useReducer,
  createContext,
  // useContext,
  useRef,
  forwardRef,
  useLayoutEffect,
  ForwardedRef,
  useCallback,
} from "react";
import "./index.scss";
import $ from "jquery";
import { withRouter, Router, Route, HashRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { handleRoute } from "@/util/public";

function RouteTab(props, ref) {
  let {
    children,
    routeList,
    basePlatFormMsg,
    domList,
    ProVersion,
    location,
    history,
  } = props;
  // 路由变化,控制头部modulename
  useEffect(() => {
    let Path = handleRoute(location.pathname);
    let isExist = false;
    routeList.forEach((child, index) => {
      if (child.props.routeid === Path[0]) {
        isExist = true;
        // 路由上有parma，但组件没有，改变路由
        if (Path[1] && !child.props.param) {
          history.push("/" + child.props.routeid);
        } else if (!Path[1] && child.props.param) {
          //有设置param但路由没有
          if (!routeList[0].props.param)
            history.push("/" + routeList[0].props.routeid);
          else {
            window.location.href =
              basePlatFormMsg.BasicWebRootUrl + "/Error.aspx?errcode=E012";

            //http://192.168.2.207:10108/Error.aspx?errcode=E012
          }
        }
      }
    });
    if (!isExist && routeList.length > 0) {
      history.push("/" + routeList[0].props.routeid);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, routeList]);
  return (
    <Scrollbars>
      <div className="lg-route-tab">
        {/* <div style={{ height: "1000px" }}> */}
        <HashRouter>
          {routeList.map((child, index) => {
            let param = child.props.param ? "/:" + child.props.param : "";
            return (
              <Route
                key={index}
                path={"/" + child.props.routeid + param}
                
                //   component={child}
              >
                {child}
              </Route>
            );
          })}
        </HashRouter>
        {/* </div> */}
        {ProVersion}
      </div>
    </Scrollbars>
  );
}

export default withRouter(memo(forwardRef(RouteTab)));
