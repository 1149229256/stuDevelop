/*
 *
 *    ┏┓　　　┏┓
 *  ┏┛┻━━━┛┻┓
 *  ┃　　　　　　　┃
 *  ┃　　　━　　　┃
 *  ┃　＞　　　＜　┃
 *  ┃　　　　　　　┃
 *  ┃...　⌒　...　┃
 *  ┃　　　　　　　┃
 *  ┗━┓　　　┏━┛
 *      ┃　　　┃
 *      ┃　　　┃
 *      ┃　　　┃
 *      ┃　　　┃  神兽保佑
 *      ┃　　　┃  代码无bug
 *      ┃　　　┃
 *      ┃　　　┗━━━┓
 *      ┃　　　　　　　┣┓
 *      ┃　　　　　　　┏┛
 *      ┗┓┓┏━┳┓┏┛
 *        ┃┫┫　┃┫┫
 *        ┗┻┛　┗┻┛
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-12-09 11:46:56
 * @LastEditTime: 2020-12-22 21:37:44
 * @Description:
 * @FilePath: \teacher-development\src\api\personal.js
 */
import fetch from "../util/fetch";
import ipConfig from "../util/ipConfig";
import moment from "moment";
import { deepMap, SetNaNToNumber } from "../util/public";
let { BasicProxy } = ipConfig;
/**
 * @description:.各校、学院师资 http://192.168.129.1:8033/showdoc/web/#/21?page_id=2246
 * @param {*}
 * @return {*}
 */
export function getSchoolList(payload = {}) {
  let {
    pageIndex,
    pageSize,
    keyword,
    schoolID,
    term,
    // nodeID,
    sortFiled,
    sortType,
  } = payload;
  let url =
    BasicProxy +
    `/Statistics/Basic/GetSubsetList?SchoolID=${
      schoolID ? schoolID : ""
    }&Term=${term ? term : ""}&PageIndex=${
      pageIndex ? pageIndex : 1
    }&PageSize=${pageSize ? pageSize : 10}${keyword ?'&Keyword='+ keyword : ""}${
      sortFiled ? "&SortFiled=" + sortFiled : ""
    }${sortType ? "&SortType=" + sortType : ""}`;

  return fetch
    .get({ url, securityLevel: 2 })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        return {
          StatusCode: json.StatusCode,
          data: {
            //     "Total":50,
            // "PageIndex":1,
            // "List":[{
            //     "UserID":"T001",        //ID，唯一标识
            //     "UserName":"白老师",    //标题
            //     "SchoolID":"S-11",
            //     "SchoolName":"白云中学",
            //     "Gender":"女",
            //     "TitleName":"一级教师",            //职称
            //     "Politics":"中共党员",    //政治面貌
            //     "TeachAge":2年,                  //教龄
            //     "HonorNames":"学科带头人,特级教师"
            // }]
            ...json.Data,
            List:
              json.Data.List  instanceof Array
                ? json.Data.List.map((child, index) => {
                    let Index = (json.Data.PageIndex - 1) * 10 + index + 1;
                    Index = Index >= 10 ? Index : "0" + Index;
                    return {
                      ...child,
                      key: index,
                      index: Index,
                    };
                  })
                : [],
            PageSize: pageSize,
          },
        };
      } else {
        return {
          StatusCode: json.StatusCode,
        };
      }
    });
}

/**
 * @description: 
 * @param {*}
 * @return {*}
 */
export function getSchoolMsg(payload = {}) {
  let {
   
    nodeID,
 
  } = payload;
  let url =
    BasicProxy +
    `/Statistics/Basic/GetSubsetDetail?nodeID=${
      nodeID ? nodeID : ""
    }`;

  return fetch
    .get({ url, securityLevel: 2 })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200&&json.Data) {
         
        return {
          StatusCode: json.StatusCode,
          Data:  json.Data
        };
      } else {
        return {
          StatusCode: 400,
        };
      }
    });
}