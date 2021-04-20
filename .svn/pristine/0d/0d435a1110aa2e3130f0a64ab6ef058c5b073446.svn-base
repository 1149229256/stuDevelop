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
 * @LastEditTime: 2020-12-21 11:22:13
 * @Description:
 * @FilePath: \teacher-development\src\api\baseMsg.js
 */
import fetch from "../util/fetch";
import ipConfig from "../util/ipConfig";
let { BasicProxy } = ipConfig;
/**
 * @description:课时统计  http://192.168.129.1:8033/showdoc/web/#/21?page_id=2093
 * @param {*}
 * @return {*}
 */
export function getClassHour(payload = {}) {
  let { schoolID, collegeID, selectLevel, term } = payload;
  let url =
    BasicProxy +
    `/Statistics/Workload/ClassHour?SchoolID=${
      schoolID ? schoolID : ""
    }&CollegeID=${collegeID ? collegeID : ""}&SelectLevel=${
      selectLevel ? selectLevel : ""
    }&Term=${term ? term : ""}`;
  // "?" +
  // (pageIndex ? "pageIndex=" + pageIndex : "") +
  // (keyword ? "&keyword=" + keyword : "") +
  // (pageSize ? "&pageSize=" + pageSize : "");
  return fetch
    .get({ url, securityLevel: 2 })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        // "TermAvgCH":150,
        // "WeekAvgCH":14,
        // "AvgTeachClass":2,
        // "AvgTeachStu":60,
        // "SubSet":[{
        //     "NodeID":"XXXXXXXXXXX",
        //     "NodeName":"语文",            //节点名称（学科、学院等）
        //     "Total":50,                    //课时数量
        // }]
        return json.Data ? json.Data : {};
      } else {
        return false;
      }
    });
}

/**
 * @description:获取教师人数概况  http://192.168.129.1:8033/showdoc/web/#/21?page_id=2095
 * @param {*}
 * @return {*}
 */
export function getTeacherGanger(payload = {}) {
  let { schoolID, collegeID, selectLevel, term } = payload;
  let url =
    BasicProxy +
    `/Statistics/Workload/Ganger?SchoolID=${schoolID ? schoolID : ""}&CollegeID=${
      collegeID ? collegeID : ""
    }&SelectLevel=${selectLevel ? selectLevel : ""}&Term=${term ? term : ""}`;
  // "?" +
  // (pageIndex ? "pageIndex=" + pageIndex : "") +
  // (keyword ? "&keyword=" + keyword : "") +
  // (pageSize ? "&pageSize=" + pageSize : "");
  return fetch
    .get({ url, securityLevel: 2 })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        // "ClassCount":120,        //行政班数量
        // "GangerCount":119,        //班主任数量
        // "MaxClass":2,            //最大带班数量
        // "AvgClass":1,            //平均带班数量
        // "SubSet":[{
        //     "NodeID":"XXXXXXXXXXX",
        //     "NodeName":"高中一年级",            //节点名称（学科、学院等）
        //     "Total":1,                    //平均带班数量
        // }]
        return json.Data ? json.Data : {};
      } else {
        return false;
      }
    });
}

 