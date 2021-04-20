/*
 *                   江城子 . 程序员之歌
 *
 *               十年生死两茫茫，写程序，到天亮。
 *                   千行代码，Bug何处藏。
 *               纵使上线又怎样，朝令改，夕断肠。
 *
 *               领导每天新想法，天天改，日日忙。
 *                   相顾无言，惟有泪千行。
 *               每晚灯火阑珊处，夜难寐，加班狂。
 *
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2021-01-08 14:48:19
 * @LastEditTime: 2021-01-08 14:48:20
 * @Description:
 * @FilePath: \teacher-development\src\pages\searchAll\bar.js
 */

import React, {
  //   useCallback,
  memo,
  useEffect,
  useLayoutEffect,
  useState,
  // useImperativeHandle,
  // useMemo,
  // useReducer,
  // createContext,
  // useContext,
  useRef,
  forwardRef,
} from "react";
import {
  useHistory,
  // , Route, Switch, NavLink
} from "react-router-dom";
import $ from "jquery";
function Bar(props, ref) {
  const { data } = props;
  const [select, setSelect] = useState(true);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);
  const history = useHistory();
  useLayoutEffect(() => {
    let content = $(contentRef.current);
    setHeight(content.outerHeight());
  }, [data]);
  return (
    <div
      style={{ height: select ? height + 28 : 28 }}
      className={`search-bar ${select ? "search-bar-active" : ""}`}
    >
      <p className="bar-main">
        <span title={data.title}>{data.title}</span>
        <i
          onClick={() => {
            setSelect(!select);
          }}
          className={`bar-handle ${select ? "bar-handle-open" : ""}`}
        ></i>
      </p>

      <div ref={contentRef} className={`bar-content`}>
        {data.List instanceof Array && data.List.length > 0
          ? data.List.map((child, index) => {
              return (
                <div
                  className="bar-content-title"
                  key={index}
                  onClick={() => {
                    if (child.key === "TeacherList") {
                      //教师的打开个人画像
                      window.open(
                        window.location.search +
                          "#/page/personalDetail/" +
                          child.id
                      );
                    } else {
                      history.push("/" + child.tabid + "/" + child.id);
                    }
                  }}
                  title={child.defaultName}
                >
                  {child.name}
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default memo(forwardRef(Bar));
