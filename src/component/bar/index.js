import React, {
  //   useCallback,
  memo,
  // useEffect,
  useState,
  useImperativeHandle,
  // useMemo,
  // useReducer,
  // createContext,
  // useContext,
  useLayoutEffect,
  useRef,
  forwardRef,
} from "react";
import $ from "jquery";
import "./index.scss";
import { Loading, Empty } from "../common";

/**
 * @description: 在frame中使用的bar
 * @param {*}
 * @return {*}
 */
function $Bar(props, ref) {
  let {
    topContext,
    width,
    marginLR,
    style,
    className,
    barName,
    loading,
    barId,
    children,
    isEmpty,
    emptyTitle,
    userIdentity,
    ...reset
  } = props;
  // bar的高度
  // const [barHeight, setBarHeight] = useState(0);
  // 获取bar ref
  const barRef = useRef(null);
  // 挂载后
  // useLayoutEffect(() => {
  //   let bar = $(barRef.current);
  //   // setBarHeight(bar.height());
  //   console.log(barRef.current.height, bar.outerHeight(true));
  // }, []);
  useImperativeHandle(ref, () => {
    return barRef.current;
  });
  return (
    <div
      ref={barRef}
      style={Object.assign(
        {},
        {
          width: `calc(${width ? width : "100%"} - ${
            typeof marginLR === "number" ? marginLR * 2 : 32
          }px)`,
          marginLeft: typeof marginLR === "number" ? marginLR + "px" : "16px",
          marginRight: typeof marginLR === "number" ? marginLR + "px" : "16px",
        },
        style instanceof Object ? style : {}
      )}
      className={`frame-bar-context ${className ? className : ""}`}
      {...reset}
    >
      <div className="fbc-top">
        <span className="ftc-bar-name" title={barName}>
          {barName}
        </span>
        {topContext ? (
          <span className="ftc-top-custom">
            {
              //当loading为true时，阻止该区域点击,下级的捕获
              /** 后期自己看是否需要加可控属性 */
            }
            {loading ? (
              <div
                style={{ height: "100%", width: "100%", position: "absolute" }}
              ></div>
            ) : (
              ""
            )}
            {/* 判断是否是reactDom，是渲染，否用组件的 */}
            {/* *topContext:{
            title:按钮名称,存在才渲染
            icon:有就用这个，没有就有默认的
            className:类
            onClick:点击
          } */}
            {topContext.$$typeof ? (
              topContext
            ) : topContext.title ? (
              <span
                className={`ftc-default-btn ${
                  topContext.className ? topContext.className : ""
                }`}
                onClick={() => {
                  typeof topContext.onClick === "function" &&
                    topContext.onClick();
                }}
                style={
                  topContext.icon
                    ? {
                        background: `url(${topContext.icon}) no-repeat left center/15px 15px`,
                      }
                    : {}
                }
              >
                {topContext.title}
              </span>
            ) : (
              ""
            )}
          </span>
        ) : (
          ""
        )}
      </div>
      <div className="fbc-contain">
        <Loading
          spinning={loading ? loading : false}
          opacity={false}
          tip={"加载中..."}
        >
          {isEmpty === undefined || !isEmpty ? (
            <div className="fbc-contain-box">{children}</div>
          ) : (
            <Empty
              className={"bar-empty"}
              title={emptyTitle ? emptyTitle : "暂无数据..."}
              type={"4"}
            ></Empty>
          )}
        </Loading>
      </div>
    </div>
  );
}
// $Context.Bar = $Bar
export default memo(forwardRef($Bar));
