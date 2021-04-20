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
 *        佛曰:
 *                写字楼里写字间，写字间里程序员；
 *                程序人员写程序，又拿程序换酒钱。
 *                酒醒只在网上坐，酒醉还来网下眠；
 *                酒醉酒醒日复日，网上网下年复年。
 *                但愿老死电脑间，不愿鞠躬老板前；
 *                奔驰宝马贵者趣，公交自行程序员。
 *                别人笑我忒疯癫，我笑自己命太贱；
 *                不见满街漂亮妹，哪个归得程序员？
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-12-08 13:54:00
 * @LastEditTime: 2020-12-09 14:34:41
 * @Description:
 * @FilePath: \teacher-development\src\component\temple\index.js
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
  //   useRef,
  forwardRef,
} from "react";
import "./index.scss";
import { Empty } from "@/component/common";
import { Scrollbars } from "react-custom-scrollbars";
//   import { Search, Empty } from "../common";
import Bar from "./bar";
function SearchAll(props, ref) {
  let { className, data, keyword, ...reset } = props;
  const [List, setList] = useState([]);
  // 是否为空
  const [empty, setEmpty] = useState(true);
  // RecruitmentList: [{RID: "1", Title: "靓仔1号"}, {RID: "e5479537-3e07-4ff3-bc11-82bf2cea19be", Title: "123"}]
  // SchoolList: []
  // TeacherList: [{UserID: "12123", UserName: "12129", SchoolID: "S27-511-AF57", SchoolName: "一体化教育云"},…]
  // TrainList: [{TID: "234", Title: "10培训计划"}]
  const keyMap = {
    RecruitmentList: {
      key: "RecruitmentList",
      title: "招聘",
      tabid: "recruitDetail",
      idKey: "RID",
      nameKey: "Title",
    },
    SchoolList: {
      key: "SchoolList",
      title: "学校",
      tabid: "schoolDetail",
      idKey: "SchoolID",
      nameKey: "SchoolName",
    },
    CollegeList: {
      key: "CollegeList",
      title: "学院",
      tabid: "schoolDetail",
      idKey: "CollegeID",
      nameKey: "CollegeName",
    },
    TeacherList: {
      key: "TeacherList",
      title: "教师",
      tabid: "personalDetail",
      idKey: "UserID",
      nameKey: "UserName",
    },
    TrainList: {
      key: "TrainList",
      title: "培训",
      tabid: "trainDetail",
      idKey: "TID",
      nameKey: "Title",
    },
  };
  useEffect(() => {
    let List = [];
    let isEmpty = true;
    if (data && data instanceof Object) {
      for (let key in data) {
        if (keyMap[key]) {
          let dataList = [];
          data[key] instanceof Array &&
            data[key].forEach((child, index) => {
              let name = [];
              let nameArray =
                typeof child[keyMap[key].nameKey] === "string"
                  ? child[keyMap[key].nameKey].split(keyword ? keyword : "")
                  : [];
              // 对name进行keyword处理
              nameArray.forEach((c, index) => {
                name.push(c);
                    if (
                      nameArray.length - 1 !== index &&
                      nameArray.length - 1 !== 0
                    ) {
                      name.push(
                        <>
                          <span className="search-keyword">{keyword}</span>
                          {/* {c} */}
                        </>
                      );
                    }
                   
                    // 教师的需要在后面家学校，教育局
                    // if (
                    //   nameArray.length - 1 === index &&
                    //   key === "TeacherList"
                    // ) {
                    // }
                  });
              dataList.push({
                ...child,
                key,
                id: child[keyMap[key].idKey],
                name: name,
                tabid: keyMap[key].tabid,
                defaultName: child[keyMap[key].nameKey],
              });
            });
          List.push({ ...keyMap[key], List: dataList });
        }
        if (
          !data[key] ||
          (data[key] instanceof Array && data[key].length !== 0)
        ) {
          isEmpty = false;
        }
      }
      setEmpty(isEmpty);
      setList(List);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, keyword]);
  return (
    <div
      className="frame-search-all-content"
      style={{ height: "300px", width: "402px" }}
    >
      <Scrollbars>
        {!empty ? (
          List.map((child, index) => {
            return child.List.length > 0 ? (
              <Bar key={index} data={child}></Bar>
            ) : (
              <React.Fragment key={index}></React.Fragment>
            );
          })
        ) : (
          <Empty
            key={"index"}
            className={"frame-search-empty"}
            type={"4"}
            title={"暂无搜索数据"}
          ></Empty>
        )}
      </Scrollbars>
    </div>
  );
}
export default memo(forwardRef(SearchAll));
