/*
 *
 * 　　┏┓　　　┏┓+ +
 * 　┏┛┻━━━┛┻┓ + +
 * 　┃　　　　　　　┃
 * 　┃　　　━　　　┃ ++ + + +
 *  ████━████ ┃+
 * 　┃　　　　　　　┃ +
 * 　┃　　　┻　　　┃
 * 　┃　　　　　　　┃ + +
 * 　┗━┓　　　┏━┛
 * 　　　┃　　　┃
 * 　　　┃　　　┃ + + + +
 * 　　　┃　　　┃
 * 　　　┃　　　┃ +  神兽保佑
 * 　　　┃　　　┃    代码无bug
 * 　　　┃　　　┃　　+
 * 　　　┃　 　　┗━━━┓ + +
 * 　　　┃ 　　　　　　　┣┓
 * 　　　┃ 　　　　　　　┏┛
 * 　　　┗┓┓┏━┳┓┏┛ + + + +
 * 　　　　┃┫┫　┃┫┫
 * 　　　　┗┻┛　┗┻┛+ + + +
 *
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2021-01-07 20:05:14
 * @LastEditTime: 2021-01-07 20:05:15
 * @Description:
 * @FilePath: \teacher-development\src\component\search\index.js
 */

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
  useRef,
  useLayoutEffect,
  forwardRef,
} from "react";
import "./index.scss";
import { Tooltip } from "antd";
import { Search, Loading } from "../common";
import { useSearchRequest } from "./hooks";
//   import { Search, Empty } from "../common";
import { changeToArray } from "@/util/public";

function LGSearch(props, ref) {
  // api可能为数组多个请求
  let {
    className,
    width,
    searchResult,
    api,
    overlayStyle,
    overlayClassName,
  } = props;
  const [query, setQuery] = useState("");

  const [result, loading] = useSearchRequest(api, query);
  const [SearchValue, setSearchValue] = useState("");
  const [myResult, setMyResult] = useState(null);
  const searchRef = useRef(null);
  // 设置显示的boolean
  const [visible, setVisible] = useState(false);
  // useEffect(()=>{console.log('关在',query,api)},[api])
  useEffect(() => {
    setMyResult(result);
  }, [result]);
  useLayoutEffect(() => {
    let dom = searchRef.current;
    // 点击iframe
    // 对点击不同节点来控制显示隐藏
    const fn = (node) => {
      let isOut = false;
      if (!dom.contains(node.target)) {
        //判断是否包含点击的节点
        isOut = true;
      } else {
        isOut = false;
      }

      //点击的位置不在搜索框和搜索内容显示区
      setVisible(!isOut);
    };
    document.addEventListener("click", fn);
    return () => {
      document.removeEventListener("click", fn);
    };
  }, []);
  return (
    <Tooltip
      overlayClassName={`lg-search-box ${
        overlayClassName ? overlayClassName : ""
      }`}
      getPopupContainer={(e) => e}
      overlayStyle={overlayStyle ? overlayStyle : {}}
      // placement={"bottomRight"}
      color={"#fff"}
      align={{
        points: ["tr", "br"], // align top left point of sourceNode with top right point of targetNode
        offset: [0, -5], // the offset sourceNode by 10px in x and 20px in y,
        // targetOffset: ["30%", "40%"], // the offset targetNode by 30% of targetNode width in x and 40% of targetNode height in y,
        overflow: { adjustX: true, adjustY: true }, // auto adjust position when sourceNode is overflowed
      }}
      // trigger={["click"]}
      visible={visible}
      title={
        // <div style={{ minHeight: "300px", width: "402px" }}></div>
        <Loading opacity={false} spinning={loading} tip={"请稍候..."}>
          {typeof searchResult === "function"
            ? searchResult(myResult, query.keyword)
            : searchResult}
        </Loading>
      }
    >
      <div
        id="test"
        ref={searchRef}
        className={`lg-search ${className ? className : ""}`}
      >
        {/* <div style={{ width: "100px", height: "10px" }}></div> */}
        <Search
          placeHolder={"输入关键词搜索..."}
          className="lg-search-in"
          width={width ? width : 180}
          Value={SearchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onClickSearch={(e) => {
            setQuery({ keyword: e.value });
          }}
          onCancelSearch={(e) => {
            setSearchValue("");
            setMyResult({});
          }}
        ></Search>
      </div>
    </Tooltip>
  );
}
export default memo(forwardRef(LGSearch));
