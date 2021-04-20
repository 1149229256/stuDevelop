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
 * @Date: 2021-01-08 09:27:21
 * @LastEditTime: 2021-01-08 09:27:22
 * @Description: 全局搜索
 * @FilePath: \teacher-development\src\api\search.js
 */

import fetch from "../util/fetch";
import ipConfig from "../util/ipConfig";
let { BasicProxy } = ipConfig;
/**
 * @description: http://192.168.129.1:8033/showdoc/web/#/21?page_id=2170 搜索
 * @param {*}
 * @return {*}
 */
export function getSearch(payload = {}) {
  // *TStatus:状态：0草稿；1正式发布
  let { keyword, schoolID, collegeID, selectLevel } = payload;
  let url =
    BasicProxy +
    `/Global/Search?SchoolID=${schoolID ? schoolID : ""}&Keyword=${
      keyword ? keyword : ""
    }&CollegeID=${collegeID ? collegeID : ""}&SelectLevel=${
      selectLevel ? selectLevel : ""
    }`;
  // "?" +
  // (pageIndex ? "pageIndex=" + pageIndex : "") +
  // (keyword ? "&keyword=" + keyword : "") +
  // (pageSize ? "&pageSize=" + pageSize : "");
  return fetch
    .get({ url, securityLevel: 2 })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        return {
          StatusCode: json.StatusCode,
          data: json.Data ? json.Data : {},
        };
      } else {
        return {
          StatusCode: json.StatusCode,
        };
      }
    });
}
