
/* eslint-disable no-undef */
// import { func } from "prop-types";

// import config from "./config";
import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { ErrorAlert } from "../component/common";
import resolve from "resolve";
//对象深度对比
export const deepCompare = (x, y) => {
  var i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (
      isNaN(x) &&
      isNaN(y) &&
      typeof x === "number" &&
      typeof y === "number"
    ) {
      return true;
    }

    // Compare primitives andexport functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case whenexport functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handleexport functions passed across iframes
    if (
      (typeof x === "function" && typeof y === "function") ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)
    ) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof x[p]) {
        case "object":
        case "function":
          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
};

//获取url参数
export function getQueryVariable(variable) {
  // var query =
  // window.location.search.substring(1) ||
  // window.location.href.split("?")[1] ||
  // window.location.href;
  return getUrlQueryVariable(window.location.href, variable);
  // var vars = query.split("&");
  // for (var i = 0; i < vars.length; i++) {
  //   var pair = vars[i].split("=");
  //   if (pair[0] === variable) {
  //     return pair[1];
  //   }
  // }
  // return false;
}

//获取url参数
/**
 * @description: 通过参数url查询是否存在variable键
 * @param {*url：链接，variable：所查询的键}
 * @return {*boolean}
 */
export function getUrlQueryVariable(url, variable) {
  if (typeof url === "string" && !url.includes("?")) {
    //判断是否为字符串和包含？，不是则返回false
    return false;
  }
  let { urlSearch } = divideUrl(url);
  var vars = urlSearch.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
}

/**
 *
 * 返回对相应的数据类型
 */
export function getType(data) {
  return Object.prototype.toString.call(data).substring(8).split(/]/)[0];
}

/**
 *
 * @param {*} sourceObj
 * @param {*} compareObj
 *
 * 比较对象是否相等
 *
 */
export function comparisonObject(sourceObj, compareObj) {
  // eslint-disable-next-line no-throw-literal
  if (arguments.length < 2) throw "Incorrect number of parameters";
  let sourceType = getType(sourceObj);
  if (sourceType !== getType(compareObj)) return false;
  // Not objects and arrays
  if (
    sourceType !== "Array" &&
    sourceType !== "Object" &&
    sourceType !== "Set" &&
    sourceType !== "Map"
  ) {
    if (sourceType === "Number" && sourceObj.toString() === "NaN") {
      return compareObj.toString() === "NaN";
    }
    if (sourceType === "Date" || sourceType === "RegExp") {
      return sourceObj.toString() === compareObj.toString();
    }
    return sourceObj === compareObj;
  } else if (sourceType === "Array") {
    if (sourceObj.length !== compareObj.length) return false;
    if (sourceObj.length === 0) return true;
    for (let i = 0; i < sourceObj.length; i++) {
      if (!comparisonObject(sourceObj[i], compareObj[i])) return false;
    }
  } else if (sourceType === "Object") {
    let sourceKeyList = Reflect.ownKeys(sourceObj);
    let compareKeyList = Reflect.ownKeys(compareObj);
    let key;
    if (sourceKeyList.length !== compareKeyList.length) return false;
    for (let i = 0; i < sourceKeyList.length; i++) {
      key = sourceKeyList[i];
      if (key !== compareKeyList[i]) return false;
      if (!comparisonObject(sourceObj[key], compareObj[key])) return false;
    }
  } else if (sourceType === "Set" || sourceType === "Map") {
    // 把 Set Map 转为 Array
    if (!comparisonObject(Array.from(sourceObj), Array.from(compareObj)))
      return false;
  }
  return true;
}
// 处理链接，获取lg_tk
export function urlRemLg_tk(url) {
  let Url = decodeURIComponent(url);
  if (Url.indexOf("lg_tk") === -1) {
    return Url;
  }
  let lg_tk = "";
  if (Url.indexOf("#") === -1) {
    lg_tk = Url.split("lg_tk=")[1].split("&")[0];
  } else {
    lg_tk = Url.split("lg_tk=")[1].split("#")[0].split("&")[0];
  }

  lg_tk = Url.includes("&lg_tk=") ? "&lg_tk=" + lg_tk : "lg_tk=" + lg_tk;

  return Url.replace(lg_tk + "&", "").replace(lg_tk, "");
}
export function removeToken(url) {
  return removeParam(url, "lg_tk");
}
/**
 * @description: location去除指定键值,可
 * @param {*param:string 所去除的键，url：string,要处理的url}
 * @return {*success返回url}
 */
export function removeParam(url, param) {
  if (typeof url !== "string") {
    console.error("url类型应该为String");
    return url;
  }
  url = decodeURIComponent(url); //解码
  if (url.indexOf(param) === -1 || url.indexOf("?") === -1) {
    //不存在，直接返回
    return url;
  }
  let { urlHash, urlPath, urlSearch } = divideUrl(url);
  urlSearch = noHashUrl(urlSearch, param);
  return urlPath + "?" + urlSearch + "#/" + urlHash;
}
function noHashUrl(urlSearch, param) {
  let params = urlSearch.split("&");
  let search = [];
  for (let i = 0; i < params.length; i++) {
    let pair = params[i].split("=");
    if (pair[0] !== param) {
      search.push(params[i]);
    }
  }
  return search.join("&");
}
/**
 * @description: 替换url上的参数
 * @param {*}
 * @return {*}
 */
export const addOrgToUrl = (url = "", paramName = "", replaceWith = "") => {
  //url字符串添加参数
  //url:路径地址 paramName：参数名 replaceWith：参数值
  let { urlHash, urlPath, urlSearch } = divideUrl(url);
  let paraStr = paramName + "=" + replaceWith;
  // console.log(replaceWith,paramName)
  if (url.indexOf(paramName) > -1) {
    //原本存在
    // var re = eval("/(" + paramName + "=)([^&]*)/gi");
    // url = url.replace(re, paramName + "=" + replaceWith);
    url =
      urlPath +
      "?" +
      noHashUrl(urlSearch, paramName) +
      "&" +
      paraStr +
      "#/" +
      urlHash;
  } else {
    var idx = url.indexOf("?");
    if (idx < 0) {
      //没有?
      url = urlPath + "?" + paraStr + "#/" + urlHash;
    } else if (idx >= 0 && idx !== url.length - 1) {
      url = urlPath + "?" + urlSearch + "&" + paraStr + "#/" + urlHash;
    }
  }
  return url;
};

/**
 * @description: 处理url，分为三段，path,search,hash
 * @param {*}
 * @return {*}
 */
const divideUrl = (url) => {
  let urlSearch = "";
  let urlHash = "";
  let urlPath = "";
  let hashIndex = url.indexOf("#/"); //hash 的位置,查询是否有哈希，有先分离，后面加回来
  let searchIndex = url.indexOf("?"); //参数的位置
  if (hashIndex !== -1) {
    //不存在hash
    if (hashIndex < searchIndex) {
      //哈希在前面，直接切
      urlSearch = url.split("#/")[1].split("?")[1];
      urlPath = url.split("#/")[0];
      urlHash = url.split("#/")[1].split("?")[0];
    } else {
      //在后面，需要先去掉哈希
      urlSearch = url.split("#/")[0].split("?")[1];
      urlPath = url.split("#/")[0].split("?")[0];
      urlHash = url.split("#/")[1];
    }
  } else {
    urlSearch = url.split("?")[1];
    urlPath = url.split("?")[0];
  }
  return {
    urlHash,
    urlPath,
    urlSearch,
  };
};
// 处理url适合获取icon
export const UrlGetIcon = (url) => {
  let urlArr = "";
  // console.log(url,url instanceof String,typeof url)
  if (typeof url !== "string") {
    return;
  }
  if (url.indexOf("://") !== "-1") {
    urlArr = url.split("/").slice(0, 3).join("/");
    // console.log(urlArr)
    return urlArr;
  } else {
    urlArr = url.split("/")[0];
    // console.log(urlArr)

    return urlArr;
  }
};

/**
 * @description: 数组遍历，下级是对象切存在下级字段可进行深层遍历
 * @param {*array:遍历的数组，*childrenKey:代表下级的对象字段,*callback:查找的回调}
 * @return {*}
 */
export const deepMap = (
  array,
  callback = () => {},
  childrenKey = "children",
  levelback = false, //深遍历到第几层，缺省默认遍历全部，定义为number遍历到该层，从1开始，包括number层
  // 后面的为自己回调用
  level = 1,
  parent = [],
  indexArray = []
) => {
  if (!(array instanceof Array)) {
    return false;
  }

  array.forEach((child, index) => {
    let IndexArray = indexArray.map((child) => child);
    IndexArray.push(index);
    callback({ child, index, indexArray: IndexArray, level, parent });
    if (
      (!levelback || isNaN(levelback) || level < levelback) &&
      child[childrenKey] instanceof Array
    ) {
      deepMap(
        child[childrenKey],
        callback,
        childrenKey,
        levelback,
        level + 1,
        [child].concat(parent),
        IndexArray
      );
    }
  });
};
// export const requestNextAnimationFrame = (function () {
//   var originalWebkitMethod,
//     wrapper = undefined,
//     callback = undefined,
//     geckoVersion = 0,
//     userAgent = navigator.userAgent,
//     index = 0,
//     self = this;
//   if (window.webkitRequestAnimationFrame) {
//     wrapper =export function (time) {
//       if (time === undefined) {
//         time += new Date();
//       }
//       self.callback(time);
//     };
//     originalWebkitMethod = window.webkitRequestAnimationFrame;
//     window.webkitRequestAnimationFrame =export function (callback=()=>{}, element) {
//       if(!self ){
//         self = this;
//       }
//       console.log(self,this ,callback)
//       self.callback = callback;
//       originalWebkitMethod(wrapper, element);
//     };
//   }
//   if (window.mozRequestAnimationFrame) {
//     index = userAgent.indexOf("rv:");
//     if (userAgent.indexOf("Gecko") !== -1) {
//       geckoVersion = userAgent.substr(index + 3, 3);
//       if (geckoVersion === "2.0") {
//         window.mozRequestAnimationFrame = undefined;
//       }
//     }
//   }

//   return (
//     window.requestNextAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     window.mozRequestAnimationFrame ||
//     window.oRequestAnimationFrame ||
//     window.msRequestAnimationFrame ||
//    export function (callback, element) {
//       var start, finish;
//       window.setTimeout(function () {
//         start = +new Date();
//         callback(start);
//         finish = +new Date();
//         self.timeout = 1000 / 60 - (finish - start);
//       }, self.timeout);
//     }
//   );
// })();

export const IEVersion = () => {
  let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  // console.log(userAgent)
  let isIE =
    userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  let isIE11 =
    userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    let fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion < 10) {
      //IE版本低于10 跳转到错误页面
      //   window.location.href = config.ErrorProxy + "/browser-tips.html";
      return false;
      //   console.log("版本过低");

      //   console.log(fIEVersion);
    } else {
      console.log("这是IE10");
      return true; //IE版本>=10
    }
  } else if (isEdge) {
    console.log("这个edge");
    return true; //edge
  } else if (isIE11) {
    console.log("这是IE11");
    return true; //IE11
  } else {
    console.log("不是ie浏览器");
    return true;
  }
};
// 给教务系统，处理url，改变布局，设置跳转逻辑
export function checkUrlAndPostMsg(
  { sysid = "000", btnName = "", url = "" },
  useDefault = true,
  func = () => {}
) {
  let iFrame = getQueryVariable("iFrame");
  let isIFrame = false;
  // let { sysid, btnName, url } = params;
  // console.log(iFrame, sysid, btnName, url, arguments);
  if (iFrame === "true") {
    isIFrame = true;

    window.parent.postMessage({ sysid, btnName, url }, "*");
  } else if (useDefault) {
    window.open(url);
  }
  if (typeof arguments[arguments.length - 1] === "function") {
    arguments[arguments.length - 1](isIFrame);
  }
  // (isIFrame);
  return isIFrame;
}

// 设置用户角色,模块角色统一在这处理
export const setRole = (LoginMsg) => {
  // let {
  //   dispatch,
  //   DataState,
  //   PublicState: {
  //     LoginMsg: { UserType, UserClass },
  //   },
  // } = this.props;
  let { UserType, UserClass } = LoginMsg;
  let Role = "";
  UserType = parseInt(UserType);
  UserClass = parseInt(UserClass);
  if (UserType === 0 && (UserClass === 1 || UserClass === 2)) {
    //学校管理员（admin_学校代码，创建学校时生成）
    Role = "Admin-School";
  } else if (UserType === 0 && (UserClass === 3 || UserClass === 4)) {
    //学院管理员
    Role = "Admin-College";
  } else if (UserType === 1) {
    //教师,— UserClass=100000~111111：
    //后5位分别代表：
    //任课教师、班主任、教研者（V3.0无效，恒为0）、学科主管、校领导
    //（V3.0无效，恒为0），值为1时代表有该身份；
    Role = "Teacher";
  } else if (UserType === 2) {
    //学生
    Role = "Student";
  } else if (UserType === 7) {
    //学校领导（V3.0之后的版本才有此角色）
    // — UserClass=0 校长
    //— UserClass=1 副校长
    //— UserClass=2 教务主任
    Role = "Leader-School";
  } else if (UserType === 10) {
    //学院领导（V3.0之后的版本才有此角色）
    // — UserClass=3 院长
    //— UserClass=4 副院长
    Role = "Leader-College";
  } else if (UserType === 3) {
    //家长

    Role = "Parent";
  } else if (UserType === 4) {
    //教育专家

    Role = "Specialist";
  } else if (UserType === 5) {
    //教育局领导

    Role = "Leader-Education";
  }
  return { ...LoginMsg, Role };
};
// 数组与与元素 去重添加
export const noRepeat = (data, value) => {
  //data:Array,value:string
  let end = [];
  data instanceof Array && data.push(value);
  data instanceof Array &&
    data.forEach((child) => {
      // let isRepeat = false;
      // eslint-disable-next-line eqeqeq
      if (child === "" || child == undefined) {
        return;
      }
      if (end.length === 0) {
        end.push(child);
      } else {
        if (!end.some((child2) => child2 === child)) {
          end.push(child);
        }
      }
    });
  return end;
};
// 数组与数组去重合并
export const ArrayNoRepeat = (Arr1 = [], Arr2 = []) => {
  let end = Arr1;
  Arr2 instanceof Array &&
    Arr2.forEach((child, index) => {
      end = noRepeat(end, child);
    });
  return end;
};
/**
 * @description:数组内部去重
 * @param {*array}
 * @return {*array}
 */
export const SimpleArrayNoRepeat = (Arr) => {
  return ArrayNoRepeat(Arr, Arr);
};
// 适配工作平台跳转到对应班级
//array:[classid,classid]
export function matchParamfromArray(
  { param = "classid", array = [] },

  fn = () => {}
) {
  let Param = getQueryVariable(param);
  let Class = false;
  if (Param && array instanceof Array) {
    array.some((child) => {
      let isTrue = child.value === Param;
      if (isTrue) {
        Class = child;
      }
      return isTrue;
    });
  }
  fn(Class);
  return Class;
}
// 适配工作平台跳转到对应班级
//array:[classid,classid]
export function matchTypeAdd(
  { param = "type" },

  fn = () => {}
) {
  let Param = getQueryVariable(param);
  let isAdd = false;
  if (Param === "add") {
    isAdd = true;
  }
  fn(isAdd);
  return isAdd;
}
// export default {
//   deepCompare,
//   getQueryVariable,
//   getUrlQueryVariable,
//   comparisonObject,
//   urlRemLg_tk,
//   UrlGetIcon,
//   IEVersion,
//   // requestNextAnimationFrame,
//   checkUrlAndPostMsg,
//   setRole,
//   noRepeat,
//   ArrayNoRepeat,
//   matchTypeAdd,
//   matchParamfromArray,
// };
/**
 * @description: 存数据到storage,sessionStorage,localStorage
 * @param {*key:键,value:值，haveLocalStorage:是否存到localStorage}
 * @return {*boolean:是否存成功}
 */
export const setDataStorage = (
  key = "error",
  value = "key is undefined",
  haveLocalStorage = false
) => {
  value = value instanceof Object ? JSON.stringify(value) : value;
  sessionStorage.setItem(key, value);
  haveLocalStorage && localStorage.setItem(key, value);
};

/**
 * @description: 获取storage的数据
 * @param {*key:键，haveLocalStorage:是否取localStorage}
 * @return {*value:不存在返回null}
 */
export const getDataStorage = (key, haveLocalStorage = false) => {
  if (key === undefined) {
    console.log("Storage key is not undefined");
    return null;
  }
  let value = "";
  if (haveLocalStorage) {
    value = localStorage.getItem(key);
  } else {
    value = sessionStorage.getItem(key);
  }
  if (value === null) {
    console.log(key + " Storage is not exist");

    return null;
  }

  try {
    value = JSON.parse(value);
  } catch (e) {}
  return value;
};

/**
 * @description: 处理路由pathname,返回数组
 * @param {*}
 * @return {*}
 */
export const handleRoute = (pathname) => {
  console.log("pathname", pathname)
  return pathname.substr(1).split("/");
};

/**
 * @description: 项目检查input输入
 * @param {*}
 * @return {*}
 */
export function checkInput({ value, regular, success, error }) {
  let fun = () => {};
  value = value || "";
  regular = regular || /^[A-Za-z0-9_()\u4e00-\u9fa5-]{0,100}$/;
  success = success || fun;
  error = error || fun;

  if (value === "") {
    error(true);
    return;
  }
  // 普通：[A-Za-z0-9_()\u4e00-\u9fa5-]
  // 严格：  /^[a-zA-Z0-9_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5 ]{0,48}[a-zA-Z0-9_\u4e00-\u9fa5]$|^[a-zA-Z0-9_\u4e00-\u9fa5]{1,50}$/
  let Test = regular.test(value);
  if (Test) {
    success();
  } else {
    error(false);
  }
}

/**
 * @description: 获取alert节点
 * @param {*}
 * @return {*}
 */
export function getAlertDom() {
  let AlertDom = document.getElementById("alert");
  if (!AlertDom) {
    //alert节点不存在，创建一个
    let body = document.getElementsByTagName("body")[0];
    let alert = document.createElement("div");
    alert.setAttribute("id", "alert");
    body.appendChild(alert);
    AlertDom = document.getElementById("alert");
  }
  return AlertDom;
}
/**
 * @description: 打开提示框，自动挂载
 * @param {*}
 * @return {*}
 */
export const autoAlert = ({ title, type, autoHide, ...other }) => {
  title = title || "服务器出现未知异常，请重试或联系管理员";

  let AlertDom = getAlertDom();
  ReactDOM.render(
    // eslint-disable-next-line react/react-in-jsx-scope
    <ErrorAlert
      key={"alert-400-" + Math.round(Math.random() * 10000)}
      show={true}
      title={title}
      type={type}
      autoHide={autoHide}
      {...other}
    />,
    AlertDom
  );
};
/**
 * @description: 防抖，适用滚动、resize
 * @param {*}
 * @return {*}
 */
export function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay);
  };
}
// 分析文件类型
export const constructFileType = (fileName) => {
  //moduleType:plan,preview
  let VideoType = [
    "avi",
    "asf",
    "wmv",
    "avs",
    "flv",
    "mkv",
    "mov",
    "3gp",
    "mp4",
    "mpg",
    "mpeg",
    "dat",
    "ogm",
    "vob",
    "rm",
    "rmvb",
    "ts",
    "tp",
    "ifo",
    "nsv",
    "m4v",
    "m3u8",
    "3gpp",
    "3gpp2",
    "divx",
    "f4v",
    "ram",
    "v8",
    "swf",
    "m2v",
    "asx",
    "ndivx",
    "xvid",
  ];
  let AudioType = [
    "mp3",
    "aac",
    "wav",
    "cda",
    "flac",
    "m4a",
    "mid",
    "mka",
    "mp2",
    "mpa",
    "mpc",
    "ape",
    "ofr",
    "ogg",
    "ra",
    "wv",
    "tta",
    "ac3",
    "dts",
    "wma",
    "midi",
  ];
  // 压缩文件类型
  let CompressType = [
    "rar",
    "zip",
    "7z",
    "arj",
    "cab",
    "lzh",
    "ace",
    "gz",
    "uue",
    "bz2",
    "jar",
    "iso",
  ];
  let PicType = ["jpeg", "jpg", "tiff", "raw", "bmp", "gif", "png"];
  let type = "file"; //默认教案集
  let isDecide = false;
  if (typeof fileName === "string") {
    let index = fileName.lastIndexOf(".");
    if (index === -1) {
      // 不存在，表示是单纯的字符串，使用教案集
      // if(moduleType==='plan')
      // type = "plan";
      // else {
      type = "unknown";
      // }
    } else {
      let FileType = fileName.slice(index + 1).toLowerCase();
      VideoType.some((child) => {
        if (child === FileType) {
          //视屏
          type = "video";
          isDecide = true;
        }
        return child === FileType;
      });
      AudioType.some((child) => {
        //音频
        if (child === FileType) {
          type = "audio";
          isDecide = true;
          return child === FileType;
        }
        return child === FileType;
      });
      PicType.some((child) => {
        //图片
        if (child === FileType) {
          type = "pic";
          isDecide = true;
        }
        return child === FileType;
      });
      CompressType.some((child) => {
        //压缩
        if (child === FileType) {
          type = "zip";
          isDecide = true;
        }
        return child === FileType;
      });
      if (!isDecide) {
        //前面不匹配

        if (FileType === "doc" || FileType === "docx") {
          type = "doc";
        } else if (FileType === "xls" || FileType === "xlsx") {
          type = "excel";
        } else if (FileType === "ppt") {
          type = "ppt";
        } else if (FileType === "pdf") {
          type = "pdf";
        } else if (FileType === "html" || FileType === "xml") {
          type = "html";
        } else if (FileType === "txt") {
          type = "txt";
        } else {
          type = "unknown";
        }
      }
    }
  }
  return type;
};

/**
 * @description: 文件大小
 * @param {*}
 * @return {*}
 */
export const calculateFileSize = (fileSize) => {
  let unit = ["B", "KB", "M", "G", "T"];
  let i = unit.length - 1;
  let myUnit = "B";
  for (i; i >= 0; i--) {
    if (fileSize / Math.pow(1024, i) >= 1) {
      myUnit = unit[i];
      break;
    }
  }
  let str = Math.round((fileSize / Math.pow(1024, i)) * 100) / 100;
  let Size = str.toString() + myUnit;
  // // console.log(i,myUnit,Size)
  return Size;
};

/**
 * @description: 获取平台的token，先url，后session，最后local，如果都没有，直接掉线
 * @param {*}
 * @return {*}
 */
export const getToken = () => {
  let token =
    getQueryVariable("lg_tk") ||
    getDataStorage("token") ||
    getDataStorage("token", true);
  return token;
};

/**
 * @description: 使用echarts后，界面resize，对echarts实例要进行重绘
 * @param {*echartsInstance:echarts实例，必选，*params:function,返回{width,height},可缺省}
 * @return {*}
 */
export const resizeForEcharts = (echartsInstance, fn) => {
  if (!echartsInstance) {
    return;
  }
  $(window).resize(() => {
    let height = null;
    let width = null;
    if (typeof fn === "function") {
      let back = fn();
      if (back instanceof Object) {
        height = back.height || null;
        width = back.width || null;
      }
    }

    echartsInstance.resize(width, height);
  });
};

function getClass(o) {
  //判断数据类型
  return Object.prototype.toString.call(o).slice(8, -1);
}
/**
 * @description: 深拷贝
 * @param {*}
 * @return {*}
 */
export function deepCopy(obj) {
  var result,
    oClass = getClass(obj);

  if (oClass === "Object") result = {};
  //判断传入的如果是对象，继续遍历
  else if (oClass === "Array") result = [];
  //判断传入的如果是数组，继续遍历
  else return obj; //如果是基本数据类型就直接返回

  for (var i in obj) {
    var copy = obj[i];

    if (getClass(copy) === "Object") result[i] = deepCopy(copy);
    //递归方法 ，如果对象继续变量obj[i],下一级还是对象，就obj[i][i]
    else if (getClass(copy) === "Array") result[i] = deepCopy(copy);
    //递归方法 ，如果对象继续数组obj[i],下一级还是数组，就obj[i][i]
    else result[i] = copy; //基本数据类型则赋值给属性
  }

  return result;
}
// 处理为数组，
export const changeToArray = (param) => {
  let end = [];
  if (!(param instanceof Array)) {
    // if (!param) {
    //   end = [];
    // }
    if (typeof param === "object") {
      for (let i in param) {
        end.push(param[i]);
      }
    } else if (typeof param === "string") {
      end = [param];
    } else {
      end = [param];
    }
  } else {
    end = param;
  }
  return end;
};

/**
 * @description: 动态添加标签到dom
 * @param {*params:节点的属性，*element：所要添加的标签名，*parent:所添加的标签放到的位置}
 * @return {*}
 */
export const addElement = (
  params = {},
  element = "script",
  parent = "body",
  callback = () => {}
) => {
  try {
    let Element = document.createElement(element);
    // Element = { ...Element, ...params };
    for (let i in params) {
      Element[i] = params[i];
    }
    // 如果params带有id属性，判断dom是否有该节点了
    if (
      params.id &&
      // params.src &&
      document.getElementById(params.id)
      // &&
      // params.src === document.getElementById(params.id).src
    ) {
      callback(false);
      return;
    }
    document[parent].appendChild(Element);
    callback(true);
  } catch (e) {
    callback(false);

    console.error(e);
  }
};
/**
 * @description: 添加script,params传onLoad表示使用同步
 * @param {*}
 * @return {*}
 */
export const addScript = async (
  params = {},
  element = "script",
  parent = "body"
) => {
  // if (params.onLoad) {
  return new Promise((resolve, reject) => {
    addElement(
      {
        type: "text/javascript",
        charset: "utf-8",
        ...params,
        onload: () => {
          resolve(true);
          typeof params.onLoad === "function" && params.onLoad();
        },
      },
      element,
      parent,
      (data) => {
        // if(!data)
        resolve(data);
      }
    );
  });
  // } else {
  //   addElement({ type: "text/javascript", ...params }, element, parent);
  // }
};

export const SetNaNToNumber = (data) => {
  return isNaN(Number(data)) ? 0 : Number(data);
};

/**
 * @description: 时间转换,单纯的秒分时装换
 * @param {*time:要转换的时间，*front：转换前单位，*back：转换后单位}
 * 先简单点,分=>时
 * @return {*}
 */
export const transTime = (time, front, back) => {
  time = isNaN(time) ? 0 : Number(time);
  let data = {
    time: time,
    unit_zh: "分钟",
    unit_En_Up: "M",
    unit_En_Low: "m",
    // Time_zh: time + "分",
  };
  if (back === "h" || time >= 60) {
    data.time = Number((time / 60).toFixed(2));
    data.unit_zh = "小时";
    data.unit_En_Up = "H";
    data.unit_En_Low = "h";
  }
  data.Time_zh = data.time + data.unit_zh;
  data.Time_En = data.time + data.unit_En_Up;
  data.Time_En_Low = data.time + data.unit_En_Low;
  return data;
};
// 解决js数字失精问题
// 0.7*100=7.0000000000001
// 0.1+0.2=0.30000000000004
/**
 * @description:
 * @param {*} number:要操作的数
 * @param {*} keepDecimal:保留多少小数，缺省不操作
 * @return {*}
 */
export function correctNumber(number = 0, keepDecimal) {
  number = Number(number);
  try {
    let num = parseFloat(number.toPrecision(12));

    return keepDecimal === undefined && typeof keepDecimal === "number"
      ? num
      : Number(num.toFixed(keepDecimal));
  } catch (e) {
    console.log(e);
    return 0;
  }
}
/**
 * @description: 判断浏览器内核
 * @param {*}
 * @return {*}
 */
export const BrowserMsg = {
  versions: (function () {
    let u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      webApp: u.indexOf("Safari") === -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf("MicroMessenger") > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) === " qq", //是否QQ
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};

/**
 * @description: 判断各种浏览器类型和版本
 * @param {*} window
 * @return {*}
 */
export const Browser=Browser || (function(window){
	var document = window.document,
		navigator = window.navigator,
		agent = navigator.userAgent.toLowerCase(),
		//IE8+支持.返回浏览器渲染当前文档所用的模式
		//IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
		//IE10:10(兼容模式7||8||9)
		IEMode = document.documentMode,
		//chorme
		chrome = window.chrome || false,
		System = {
			//user-agent
			agent : agent,
			//是否为IE
			isIE : /msie/.test(agent),
			//Gecko内核
			isGecko: agent.indexOf("gecko")>0 && agent.indexOf("like gecko")<0,
			//webkit内核
			isWebkit: agent.indexOf("webkit")>0,
			//是否为标准模式
			isStrict: document.compatMode === "CSS1Compat",
			//是否支持subtitle
			supportSubTitle:function(){
				return "track" in document.createElement("track");
			},
			//是否支持scoped
			supportScope:function(){
				return "scoped" in document.createElement("style");
			},
			//获取IE的版本号
			ieVersion:function(){
				try {
				   return agent.match(/msie ([\d.]+)/)[1] || 0;
				} catch(e) {
				   console.log("error");
				   return IEMode;
				}
			},
			//Opera版本号
			operaVersion:function(){
				try {
					if(window.opera) {
						return agent.match(/opera.([\d.]+)/)[1];
					} else if(agent.indexOf("opr") > 0) {
						return agent.match(/opr\/([\d.]+)/)[1];
					}
				} catch(e) {
					console.log("error");
					return 0;
				}
			},
			//描述:version过滤.如31.0.252.152 只保留31.0
			versionFilter:function(){
				if(arguments.length === 1 && typeof arguments[0] === "string") {
					var version = arguments[0];
						start = version.indexOf(".");
					if(start>0){
						end = version.indexOf(".",start+1);
						if(end !== -1) {
							return version.substr(0,end);
						}
					}
					return version;
				} else if(arguments.length === 1) {
					return arguments[0];
				}
				return 0;
			}
		};

	try {
		//浏览器类型(IE、Opera、Chrome、Safari、Firefox)
		System.type = System.isIE?"IE":
			window.opera || (agent.indexOf("opr") > 0)?"Opera":
			(agent.indexOf("chrome")>0)?"Chrome":
			//safari也提供了专门的判定方式
			window.openDatabase?"Safari":
			(agent.indexOf("firefox")>0)?"Firefox":
			'unknow';

		//版本号
		System.version = (System.type === "IE")?System.ieVersion():
			(System.type === "Firefox")?agent.match(/firefox\/([\d.]+)/)[1]:
			(System.type === "Chrome")?agent.match(/chrome\/([\d.]+)/)[1]:
			(System.type === "Opera")?System.operaVersion():
			(System.type === "Safari")?agent.match(/version\/([\d.]+)/)[1]:
			"0";

		//浏览器外壳
		System.shell=function(){
			//遨游浏览器
			if(agent.indexOf("maxthon") > 0) {
				System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version ;
				return "傲游浏览器";
			}
			//QQ浏览器
			if(agent.indexOf("qqbrowser") > 0) {
				System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version ;
				return "QQ浏览器";
			}

			//搜狗浏览器
			if( agent.indexOf("se 2.x")>0) {
				return '搜狗浏览器';
			}

			//Chrome:也可以使用window.chrome && window.chrome.webstore判断
			if(chrome && System.type !== "Opera") {
				var external = window.external,
					clientInfo = window.clientInformation,
					//客户端语言:zh-cn,zh.360下面会返回undefined
					clientLanguage = clientInfo.languages;

				//猎豹浏览器:或者agent.indexOf("lbbrowser")>0
				if( external && 'LiebaoGetVersion' in external) {
					 return '猎豹浏览器';
				}
				//百度浏览器
				if (agent.indexOf("bidubrowser")>0) {
					System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
						agent.match(/chrome\/([\d.]+)/)[1];
					return "百度浏览器";
				}
				//360极速浏览器和360安全浏览器
				if( System.supportSubTitle() && typeof clientLanguage === "undefined") {
					//object.key()返回一个数组.包含可枚举属性和方法名称
					var storeKeyLen = Object.keys(chrome.webstore).length,
						v8Locale = "v8Locale" in window;
					return storeKeyLen > 1? '360极速浏览器':'360安全浏览器';
				}
				return "Chrome";
			}
			return System.type;
		};

		//浏览器名称(如果是壳浏览器,则返回壳名称)
		System.name = System.shell();
		//对版本号进行过滤过处理
		System.version = System.versionFilter(System.version);

	} catch(e) {
		console.log("error");
	}
	return {
		client:System
	};

})(window);
/**
 * @description: 
 * @param {*} removeSlashUrl:需要去掉 / 的链接 
 * @return {*}
 */
export const removeSlashUrl = (url)=>{

  const urlArr = url.split('');

  if (urlArr[urlArr.length-1]==='/'){

      return url.substr(0,urlArr.length-1);

  }else{

      return url;

  }

};