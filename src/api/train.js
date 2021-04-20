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
 * @LastEditTime: 2020-12-15 14:38:51
 * @Description:
 * @FilePath: \teacher-development\src\api\train.js
 */
import fetch from "../util/fetch";
import ipConfig from "../util/ipConfig";
let { BasicProxy } = ipConfig;
/**
 * @description: http://192.168.129.1:8033/showdoc/web/#/21?page_id=2076 管理员
 * @param {*}
 * @return {*}
 */
export function getCruitList(payload = {}) {
  // *TStatus:状态：0草稿；1正式发布
  let {
    pageIndex,
    pageSize,
    keyword,
    schoolID,
    collegeID,
    selectLevel,
    rStatus,
  } = payload;
  let url =
    BasicProxy +
    `/Train/List?SchoolID=${schoolID ? schoolID : ""}&TStatus=${
      parseInt(rStatus) === 0 ? 0 : 1
    }&PageIndex=${pageIndex ? pageIndex : 1}&PageSize=${
      pageSize ? pageSize : 10
    }&Keyword=${keyword ? keyword : ""}&CollegeID=${
      collegeID ? collegeID : ""
    }&SelectLevel=${selectLevel ? selectLevel : ""}`;
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
          data: {
            ...json.Data,
            List:
              json.Data.List instanceof Array
                ? json.Data.List.map((child, index) => {
                    // child:[{"TID":"xxxxxxxxxxxxxxxxxxx",        //ID，唯一标识
                    // "Title":"关于2020年白云区教师培招聘划",    //标题
                    // "Issue":"白云中学",                    //来源
                    // "TStatus":0,                        //状态：0草稿；1正式发布
                    // "ReleaseTime":"2020-01-01 12:00",    //发布时间
                    // "CreatorName":"张老师",            //发布者
                    // "UpdateTime":"2020-01-01 12:00" //最近一次编辑时间}]
                    let Index = (json.Data.PageIndex - 1) * 10 + index + 1;
                    Index = Index >= 10 ? Index : "0" + Index;
                    return {
                      ...child,
                      key: index,
                      index: Index,
                      title: child.Title,
                      source: child.Issue,
                      publisher: child.CreatorName,
                      time: child.ReleaseTime,
                    };
                  })
                : [],
            PageSize: pageSize,
            // List:  [
            //     {
            //       key: 0,
            //       index: "011111111111111",
            //       title:
            //         "2020年广州市白云区中小学及幼儿园聘任制教师招聘320名计划2020年广州市白云区中小学及幼儿园聘任制教师招聘320名计划",
            //       source: "辖区教育局辖区教育局辖区教育局",
            //       publisher: "祝泽森祝泽森祝泽森",
            //       time: "2020-08-29 13:59 020-08-29 13:59",
            //     },
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
 * @description: 教师获取 http://192.168.129.1:8033/showdoc/web/#/21?page_id=2201
 * @param {*}
 * @return {*}
 */
export function getCruitListByTeacher(payload = {}) {
  // *TStatus:状态：0草稿；1正式发布
  let {
    pageIndex,
    pageSize,
    keyword,
    schoolID,
    collegeID,
    selectLevel,
    rStatus,
  } = payload;
  let url =
    BasicProxy +
    `/Train/Teacher/List?SchoolID=${schoolID ? schoolID : ""}&TStatus=${
      parseInt(rStatus) === 0 ? 0 : 1
    }&PageIndex=${pageIndex ? pageIndex : 1}&PageSize=${
      pageSize ? pageSize : 10
    }&Keyword=${keyword ? keyword : ""}&CollegeID=${
      collegeID ? collegeID : ""
    }&SelectLevel=${selectLevel ? selectLevel : ""}`;
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
          data: {
            ...json.Data,
            List:
              json.Data.List instanceof Array
                ? json.Data.List.map((child, index) => {
                    // child:[{"TID":"xxxxxxxxxxxxxxxxxxx",        //ID，唯一标识
                    // "Title":"关于2020年白云区教师培招聘划",    //标题
                    // "Issue":"白云中学",                    //来源
                    // "TStatus":0,                        //状态：0草稿；1正式发布
                    // "ReleaseTime":"2020-01-01 12:00",    //发布时间
                    // "CreatorName":"张老师",            //发布者
                    // "UpdateTime":"2020-01-01 12:00" //最近一次编辑时间}]
                    let Index = (json.Data.PageIndex - 1) * 10 + index + 1;
                    Index = Index >= 10 ? Index : "0" + Index;
                    return {
                      ...child,
                      key: index,
                      index: Index,
                      title: child.Title,
                      source: child.Issue,
                      publisher: child.CreatorName,
                      time: child.ReleaseTime,
                    };
                  })
                : [],
            PageSize: pageSize,
            // List:  [
            //     {
            //       key: 0,
            //       index: "011111111111111",
            //       title:
            //         "2020年广州市白云区中小学及幼儿园聘任制教师招聘320名计划2020年广州市白云区中小学及幼儿园聘任制教师招聘320名计划",
            //       source: "辖区教育局辖区教育局辖区教育局",
            //       publisher: "祝泽森祝泽森祝泽森",
            //       time: "2020-08-29 13:59 020-08-29 13:59",
            //     },
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
 * @description: http://192.168.129.1:8033/showdoc/web/#/21?page_id=2077
 * @param {*}
 * @return {*}
 */
// 获取招聘详情
export function getTrainDetail(payload = {}) {
  // *ID：招聘id
  let { id } = payload;
  let url = BasicProxy + `/Train/Detail?TID=${id}`;

  return fetch
    .get({ url, securityLevel: 2, advance: false })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        return {
          StatusCode: json.StatusCode,
          ErrCode: json.ErrCode,
          data: {
            ...json.Data,
            ID: json.Data.TID,
          },
        };
      } else {
        return {
          StatusCode: json.StatusCode,
          ErrCode: json.ErrCode,
        };
      }
    });
}
// 发布招聘
/**
 * @description: http://192.168.129.1:8033/showdoc/web/#/21?page_id=2078
 * @param {*}
 * @return {*}
 */
export function publishTrain(payload = {}) {
  //   {
  //     "SchoolID":"xxx",    //发布者所属学校ID
  //     "CollegeID":"xxx",    //发布者所属学院ID
  //     "Title":"关于2020年白云区教师培训计划",    //标题
  //     "Issue":"白云中学",                    //来源
  //     "TStatus":0,                        //状态：0草稿；1正式发布
  //     "Content":"关于2020年白云区教师培训计划如下",    //正文
  //     "FileList":[{
  //         "FileName":"培训计划行程.xls",
  //         "FileUrl":"xxxxxxxxxxxxx",
  //         "FileSize":"23.4M"                //文件大小
  //     }，{
  //         "FileName":"培训计划宿舍安排.xls",
  //         "FileUrl":"xxxxxxxxxxxxx",
  //         "FileSize":"23.4M"                //文件大小
  //     }]
  // }

  let {
    SchoolID,
    CollegeID,
    SelectLevel,
    TStatus,
    Title,
    Issue,
    ReleaseTime,
    Content,
    FileList,
    Limit,
    ApplyBeginTime,
    ApplyEndTime,
    ActivityFlag,
    ApplyFlag,
  } = payload;
  let url = BasicProxy + `/Train/Add`;

  return fetch
    .post({
      url,
      securityLevel: 2,
      header: { "Content-Type": "application/json" },
      body: {
        SchoolID,
        CollegeID,
        SelectLevel,
        TStatus,
        Title,
        Issue,
        ReleaseTime,
        Content,
        FileList,
        Limit,
        ApplyBeginTime,
        ApplyEndTime,
        ActivityFlag,
        ApplyFlag,
      },
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        return {
          result: true,
        };
      } else {
        return { result: false };
      }
    });
}
// 编辑招聘
/**
 * @description: http://192.168.129.1:8033/showdoc/web/#/21?page_id=2078
 * @param {*}
 * @return {*}
 */
export function editTrain(payload = {}) {
  //   {
  //     "SchoolID":"xxx",    //发布者所属学校ID
  //     "CollegeID":"xxx",    //发布者所属学院ID
  //     "Title":"关于2020年白云区教师培训计划",    //标题
  //     "Issue":"白云中学",                    //来源
  //     "TStatus":0,                        //状态：0草稿；1正式发布
  //     "Content":"关于2020年白云区教师培训计划如下",    //正文
  //     "FileList":[{
  //         "FileName":"培训计划行程.xls",
  //         "FileUrl":"xxxxxxxxxxxxx",
  //         "FileSize":"23.4M"                //文件大小
  //     }，{
  //         "FileName":"培训计划宿舍安排.xls",
  //         "FileUrl":"xxxxxxxxxxxxx",
  //         "FileSize":"23.4M"                //文件大小
  //     }]
  // }

  let {
    // SchoolID,
    // CollegeID,
    // SelectLevel,
    TStatus,
    Title,
    Issue,
    TID,
    // ReleaseTime,
    Content,
    Limit,
    ApplyBeginTime,
    ApplyEndTime,
    ActivityFlag,
    ApplyFlag,
    FileList,
  } = payload;
  let url = BasicProxy + `/Train/Edit`;

  return fetch
    .post({
      url,
      securityLevel: 2,
      header: { "Content-Type": "application/json" },
      body: {
        // SchoolID,
        // CollegeID,
        // SelectLevel,
        TStatus,
        Title,
        TID,
        Issue,
        // ReleaseTime,
        Content,
        Limit,
        ApplyBeginTime,
        ApplyEndTime,
        ActivityFlag,
        ApplyFlag,
        FileList,
      },
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        return {
          result: true,
        };
      } else {
        return { result: false };
      }
    });
}
// 删除
/**
 * @description: http://192.168.129.1:8033/showdoc/web/#/21?page_id=2080
 * @param {*}
 * @return {*}
 */
export function deleteTrain(payload = {}) {
  let { TIDs } = payload;
  let url = BasicProxy + `/Train/Delete`;

  return fetch
    .post({
      url,
      securityLevel: 2,
      body: {
        TIDs,
      },
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        return {
          result: true,
        };
      } else {
        return { result: false };
      }
    });
}


/**
 * @description: 教师报名
 * @param {*}
 * @return {*}
 */
export function applyTrain(payload = {}) {
  let { TID,Action } = payload;
  let url = BasicProxy + `/Train/Teacher/Apply`;

  return fetch
    .post({
      url,
      securityLevel: 2,
      body: {
        TID:TID,Action
      },
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.StatusCode === 200) {
        return {
          result: true,
        };
      } else {
        return { result: false };
      }
    });
}