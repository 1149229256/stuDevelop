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
 * @Date: 2021-01-07 16:12:45
 * @LastEditTime: 2021-01-07 16:12:45
 * @Description:
 * @FilePath: \teacher-development\src\hooks\useDomSize.js
 */

import {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import $ from "jquery";
import { debounce } from "@/util/public";
export default function useDomSize(dom) {
  const [size, setSize] = useState({ height: 0, width: 0 });
  let tabContent = $(dom);

  // 获取可视区域高度
  useLayoutEffect(() => {
    if (tabContent) {
      return;
    }
    let height = tabContent.height();
    let width = tabContent.width();
    setSize({ height, width });
    let resize = (e) => {
      let height = tabContent.height();
      let width = tabContent.width();
      setSize({ height, width });
    };
    window.addEventListener("resize", debounce(resize, 500), false);

    return () => {
      window.removeEventListener("resize", debounce(resize, 500));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [size];
}
