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
 * @Date: 2020-12-09 10:25:40
 * @LastEditTime: 2020-12-10 18:45:47
 * @Description:
 * @FilePath: \teacher-development\src\pages\recruit\reducer.js
 */
import React, {
  // useCallback,
  // memo,
  // useEffect,
  // useState,
  useReducer,
  createContext,
  // useImperativeHandle,
  // useRef,
  // forwardRef,
} from "react";
// 创建frame的context
export const Context = createContext();
export const initState = {
  keyword: "",
  compoent:'1'
};
export const Reducer = (state, actions) => {
  switch (actions.type) {
    case "SET_KEY_WORD":
      return Object.assign({}, state, {
        keyword:actions.data,
      });

    default:
      return state;
  }
};
