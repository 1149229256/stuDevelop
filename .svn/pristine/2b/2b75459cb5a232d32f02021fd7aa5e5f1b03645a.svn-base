/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-12-16 19:10:04
 * @LastEditTime: 2020-12-17 19:12:37
 * @Description: 锚点组件,需要与scrollBar配合使用 react-custom-scrollbars
 * 需要传scrolbar 的ref下来
 * @FilePath: \teacher-development\src\component\anchor\index.js
 */

import React, {
  useCallback,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  // useMemo,
  // useReducer,
  // createContext,
  // useContext,
  useRef,
  forwardRef,
} from "react";
import $ from "jquery";
import "./index.scss";
//   import { Search, Empty } from "../common";
// 滚动的client会变，要实时拿最新的值
// 根据每个块的高度进行锚点对应
// 1.client区域显示的块都不完整时，选取最大的那块
// 2.有一块完整的时候，选择完整的
// 3.有一块以上（不包括1块）完整时，选取最大的
function Anchor(props, ref) {
  // scrollref不存在，不出现anchor
  // bottomheightd多余的高度
  let { className, list, scrollref, bottomheight, ...reset } = props;
  //   设置anchor出现
  const [show, setShow] = useState(false);
  // 存新的list
  const [anchorList, setAnchorList] = useState([]);
  // 设置活动的块,这个由scroll改变来控制
  const [activeLink, setActiveLink] = useState(0);
  // 控制点击的事件不触发被动setActiveLink
  const refuseRef = useRef(false);
  //   处理list
  useEffect(() => {
    try {
      if (
        list instanceof Array &&
        list.length > 0 &&
        scrollref &&
        scrollref.current
      ) {
        let {
          scrollTop,
          handleScroll,
          getClientHeight,
          getScrollHeight,
        } = scrollref.current;
        // scrollTop(200)
        // s说明出现滚动了
        if (getClientHeight() < getScrollHeight()) {
          setShow(true);
        }
        let offsetTop = 0;
        let height = 0; //上一个高度
        let anchorList = [];
        // 配置好改变的位置
        console.log("传入的ref数组", list);
        console.log(scrollref.current);
        list.forEach((child, index) => {
          if (!child.ref) {
            return;
          }
          // if(index != 0){
          //   height = list[index - 1].ref.clientHeight;
          // } else {
          //   height = 0;
          // }
          
          let $ref = $(child.ref);
          offsetTop += height;

          // height = $ref.outerHeight(true);
          height = child.ref.clientHeight;
          console.log(height, child.name, child.ref.clientHeight)
          // 记录每块的高度和距离顶部的距离
          anchorList.push({
            ...child,
            $ref,
            offsetTop: offsetTop,
            // height: $ref.outerHeight(true),
            height: child.ref.clientHeight
          });
        });
        setAnchorList(anchorList);
      }
    } catch (e) {
      console.error(e);
      setShow(false);
    }
  }, [list, scrollref]);
  const onScroll = useCallback(() => {
    if (!show) {
      return;
    }
    let {
      scrollTop,
      handleScroll,
      getClientHeight,
      getScrollTop,
      getScrollHeight,
    } = scrollref.current;

    let ScrollTop = getScrollTop();//内容框滚动距离
    let ClientHeight = getClientHeight();//内容框可视高度
    let ScrollHeight = getScrollHeight();

    let activeBar = { isInit: true }; //记录
    anchorList.forEach((child, index) => {
      let { offsetTop, height } = child;
      let offsetForBottom = offsetTop + height;//bar头部加高度为bar的底部到内容框顶部的距离
      let fullBar = false;//是否是完整的bar
      let visualHeight = 0;//bard的可视高度
      let offsetVisualBottom = ClientHeight + ScrollTop;//内容框的高度加上滚动的头部距离为内容框底部距离内容框顶部距离

      if (ScrollTop >= offsetForBottom || offsetVisualBottom < offsetTop) {
        //这块直接不显示在可是区域
        return;
      }
      // 后面的是有内有显示在可是区域
      // 头部不完整
      if (ScrollTop > offsetTop && offsetForBottom <= offsetVisualBottom) {
        //不完整
        visualHeight = offsetForBottom - ScrollTop;
      }else if(ScrollTop <= offsetTop && offsetForBottom > offsetVisualBottom){
        // 底部不完整
        visualHeight = offsetVisualBottom - offsetTop;

      } else {
        //完整或者整个可视区域都是他
        fullBar = true;
        visualHeight = height;
      }
      let currentBar = { isInit: false, visualHeight, fullBar, index };
      if (activeBar.isInit) {
        activeBar = currentBar;
      } else {
        if (
          (!activeBar.fullBar && currentBar.fullBar) || // (activeBar.fullBar && currentBar.fullBar) ||
          (!activeBar.fullBar &&
            !currentBar.fullBar &&
            activeBar.visualHeight < currentBar.visualHeight)
        ) {
          //完整的替代不完整的, 不完整都的比大小,完整取第一个
          activeBar = currentBar;
        }
      }
    });
    if(!refuseRef.current)
    setActiveLink(activeBar.index);

    refuseRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorList, show]);
  useImperativeHandle(ref, () => {
    return {
      onScroll,
    };
  });
  // 点击滚动
  const onClickScroll = useCallback((data, index) => {
    refuseRef.current = true;
    console.log(data, index);
    // return;
    scrollref.current.scrollTop(data.offsetTop);
    setActiveLink(index);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return show ? (
    <div className={`lg-anchor ${className ? className : ""}`} {...reset}>
      <span
        style={{ top: activeLink * 54 + 8 + "px" }}
        className="anchor-link-active"
      >
        {/* {anchorList.map((child, index) => {
          return (
            <div
              style={{ top: index * 54 - 4 + "px" }}
              className="anchor-active"
              key={index}
              title={child.name}
              onClick={onClickScroll.bind(this,index)}
            >
              {child.name}
            </div>
          );
        })} */}
      </span>
      {anchorList.map((child, index) => {
        return (
          <div
            className={`anchor-link ${
              activeLink === index ? "anchor-link-2" : ""
            }`}
            key={index}
            title={child.name}
            onClick={onClickScroll.bind(this, child, index)}
          >
            {child.name}
          </div>
        );
      })}
    </div>
  ) : (
    <></>
  );
}

export default memo(forwardRef(Anchor));
