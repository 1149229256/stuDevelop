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
 * @Date: 2020-11-18 15:49:51
 * @LastEditTime: 2020-12-07 14:39:16
 * @Description: token查询掉线机制
 * @FilePath: \teacher-development\src\util\connect.js
 */
// import config from "./ipConfig";

import $ from "jquery";
// import React from "react";
import {
  getQueryVariable,
  getDataStorage,
  setDataStorage,
  SimpleArrayNoRepeat,
  urlRemLg_tk,
  addOrgToUrl,removeParam
} from "./public";
import {getBasePlatformMsg} from './init';
// import { useHistory, useLocation } from "react-router-dom";
// import { createHashHistory } from "history";
// let history = createHashHistory();

/**
 * @description: token检查，是否有效
 * @param {*sysID:系统id，默认000；*callback：回调函数,*isFirst:是否是第一次进来}
 * @return {*}
 */
export const TokenCheck = async ({ sysID, callback, firstLoad }) => {
  sysID = sysID ? sysID : "L10"; //默认基础平台000；
  callback = callback ? callback : (tokenValid) => {}; //回调函数；params:*tokenvalid:token是否有效
  firstLoad = firstLoad ? firstLoad : false; //是否第一次进来判断，默认false
  // token的比重是URL_TOKEN>SESSION_TOKEN>LOCAL_TOKEN

  const { SESSION_TOKEN, URL_TOKEN, LOCAL_TOKEN } = getToken();
  // session暂无基础平台链接，先写死；
  // if(!baseIP){
    let BasePlatformMsg = JSON.parse(sessionStorage.getItem("BasePlatformMsg"));
    let BasicWebRootUrl = BasePlatformMsg? BasePlatformMsg.WebRootUrl: "";
    let baseIP = BasicWebRootUrl
  // }
//   let { BasicWebRootUrl: baseIP } =
//  await getBasePlatformMsg(['BasicWebRootUrl'])

      // console.log(getDataStorage("BasePlatformMsg").BasicWebRootUrl,baseIP)
  // // 柯里化
  const myTokenError = () => {
    tokenError(baseIP);
  };
  if (!SESSION_TOKEN && !URL_TOKEN && !LOCAL_TOKEN) {
    //检查三者是否都存在，不存在直接跳到登陆页
    myTokenError(); //掉线后重新定向到登陆页
  }
  let tokenList = SimpleArrayNoRepeat([URL_TOKEN, SESSION_TOKEN, LOCAL_TOKEN]); //去重后的
  let isSuccess = false;
  // 柯里化
  const myCheckToken = async (token, success = () => {}, error = () => {}) => {
    isSuccess = await checkToken(
      baseIP,
      token,
      sysID,
      () => {
        success();
      },
      error
    );
    // if (isSuccess) {
    //   success();
    // } else {
    //   error();
    // }
    return isSuccess;
  };
  let loop = 0;
  // 第一步：验证token

  let isComplete = false; //是否完成
  tokenList.forEach(async (child, index) => {
    if (isComplete) {
      return;
    }
    //some 返回true结束遍历，false继续遍历
    let result = await myCheckToken(
      child,
      () => {},
      () => {
        console.log(++loop, child);
      }
    );

    if (result) {
      //验证通过
      // 第二步：获取用户信息
      // 获取用户信息，不成功则跳登陆页
      let UserInfo = getDataStorage("UserInfo");
      if (!UserInfo || firstLoad) {
        //不存在就获取
        UserInfo = await getUserInfo();

        if (!UserInfo) {
          callback(false);
          // myTokenError();
          return;
        }
      }

      // 最后，执行回调
      callback(UserInfo,child);
      // 通过后需要轮询是否在线
      CirculTokenCheck();
      isComplete = true;
      return true;
    }
    if (index === tokenList.length - 1) {
      //最后都没通过，全部无效
      // alert("token失效");
      callback(false);
      myTokenError();
    }
    return result;
  });
};

/**
 * @description: 退出登陆
 * @param {*}
 * @return {*}
 */
export async function  LogOut ({ baseIP, sysID, init }) {
  const { SESSION_TOKEN, URL_TOKEN, LOCAL_TOKEN } = getToken();

  if (sysID) {
    sysID = "L10";
  }
  baseIP = baseIP
    ? baseIP
    : getDataStorage("BasePlatformMsg") instanceof Object
    ? getDataStorage("BasePlatformMsg").WebRootUrl
    : "";
  let token = URL_TOKEN || SESSION_TOKEN || LOCAL_TOKEN;

  setDataStorage("LogOuting", true);
  loginApi({
    token,
    sysID,
    baseIP,
    method: "Logout",
    success: (data) => {
      //验证成功，则
      let json = data;

      if (json.data.result) {
        //result为true

        sessionStorage.setItem("LogOuting", false);
        tokenError(baseIP, (init? init: false));
      }
    },
    error: (err) => {
      //请求失败后调用的函数

      alert(err);
    },
  });
}
/**
 * @description: 登陆jsonp的api
 * @param {*}
 * @return {*}
 */

 const loginApi =async ({ baseIP, token, method, sysID, success, error }) => {
  // if (!baseIP) {
  //   const { BasicWebRootUrl } = await getBasePlatformMsg(['BasicWebRootUrl'])
  //   baseIP = BasicWebRootUrl;
  // }
  if(!baseIP){
    let BasePlatformMsg = JSON.parse(sessionStorage.getItem("BasePlatformMsg"));
    let BasicWebRootUrl = BasePlatformMsg? BasePlatformMsg.WebRootUrl: "";
  //  let {BasicWebRootUrl} = await getBasePlatformMsg(['BasicWebRootUrl'])
   baseIP = BasicWebRootUrl
  }
  const ajax = $.ajax({
    url: `${baseIP}/UserMgr/Login/Api/Login.ashx?method=${method}&params=${sysID}${
      token ? "&token=" + token : ""
    }`,
    type: "GET",
    dataType: "jsonp",
    jsonp: "jsoncallback", //这里的值需要和回调函数名一样
    success: (data) => {
      typeof success === "function" && success(data);
    },
    error: (data) => {
      typeof error === "function" && error(data);
    },
  });

  return ajax;
};
/**
 * @description: 获取token，从url，session，local
 * @param {*}
 * @return {*SESSION_TOKEN,URL_TOKEN,LOCAL_TOKEN}
 */
const getToken = () => {
  const SESSION_TOKEN = getDataStorage("token"); //存在session的token
  const URL_TOKEN = getQueryVariable("lg_tk"); //存在session的token
  const LOCAL_TOKEN = getDataStorage("token", true); //存在localStorage的token
  return {
    SESSION_TOKEN,
    URL_TOKEN,
    LOCAL_TOKEN,
  };
};
/**
 * @description: 轮询是否在线是否有效
 * @param {*}
 * @return {*}
 */
const CirculTokenCheck = () => {
  if (!getDataStorage("lastTime")) {
    //session没有lasttime,给提供一个，一般是初始进来的时候
    let date = new Date();
    let time = date.getTime();
    setDataStorage("lastTime", time); //下次check前的时间
  }
  let interval = 60000;
  setTimeout(async () => {
    let lastTime = getDataStorage("lastTime");
    let date = new Date();
    let time = date.getTime();
    if (interval <= time - lastTime) {
      //少于interval秒不会请求，可能浏览器存在多个同源的站点运行了tokencheck
      // 保证该浏览器只有一个运行
      //当运行TokenCheck后，后台验证需要时间，成功会再次运行CirculTokenCheck
      // 在setTimeout后，时间间隔会大于interval
      // 如果另一个界面更新共用的session里的lasttime后
      // 时间会在interval之间更新，所以间隔会小于interval，该界面不在进行轮询
      // 尽量保证只有一个界面是进行轮询
      setDataStorage("lastTime", time);
      await TokenCheck({});
    }
  }, interval);
};
/**
 * @description: 获取用户信息
 * @param {*}
 * @return {*}
 */
export const getUserInfo = async (
  baseIP,
  token,
  sysID = "L10",
  fun = () => {}
) => {
  token = token ? token : getDataStorage("token");
  // baseIP = baseIP
  //   ? baseIP
  //   : getDataStorage("BasePlatformMsg") instanceof Object
  //   ? getDataStorage("BasePlatformMsg").BasicWebRootUrl
  //   : "";
  // if (!baseIP) {
  //   const { BasicWebRootUrl } = await getBasePlatformMsg(['BasicWebRootUrl'])
  //   baseIP = BasicWebRootUrl;
  // }
  if(!baseIP){
    let BasePlatformMsg = JSON.parse(sessionStorage.getItem("BasePlatformMsg"));
    let BasicWebRootUrl = BasePlatformMsg? BasePlatformMsg.WebRootUrl: "";
  //  let {BasicWebRootUrl} = await getBasePlatformMsg(['BasicWebRootUrl'])
   baseIP = BasicWebRootUrl
  }
  return new Promise((resolve) => {
    if (!token) {
      resolve(false);
      return;
    }
    loginApi({
      token,
      sysID,
      baseIP,
      method: "GetUserInfo",
      success: (data) => {
        if (!data || !data.data) {
          resolve(false);
          return;
        }
        let loginInfo = data ? (data.data ? data.data : {}) : {};

        let UserInfo = {};

        UserInfo["TruethUserType"] = loginInfo["UserType"];
        for(let key in loginInfo){
          let value = loginInfo[key]
          // console.log(key,value)
          if (key === "PhotoPath") {
            let date = new Date();
            let time = date.getTime();
            value = value + "?T=" + time;
          }
          // 锁控处理
          if (key === "LockerState" && parseInt(value) !== 1) {
            window.location.href =
              baseIP + "/LockerMgr/ErrorTips.aspx?ErrorCode=" + value;
            return;
          }
          UserInfo[key] = decodeURIComponent(value);
        }

        // for (let [key, value] of Object.entries(loginInfo)) {
        //   // console.log(key,value)
        //   if (key === "PhotoPath") {
        //     let date = new Date();
        //     let time = date.getTime();
        //     value = value + "?T=" + time;
        //   }
        //   // 锁控处理
        //   if (key === "LockerState" && parseInt(value) !== 1) {
        //     window.location.href =
        //       baseIP + "/LockerMgr/ErrorTips.aspx?ErrorCode=" + value;
        //     return;
        //   }
        //   UserInfo[key] = decodeURIComponent(value);
        // }

        UserInfo.isLogin = true;

        setDataStorage("UserInfo", UserInfo);

        fun();
        resolve(UserInfo);
      },
      error: (err) => {
        //请求失败后调用的函数
        resolve(false);
      },
    });
  });
};

/**
 * @description: 掉线页
 * @param {*initType:是否带lg_preurl}
 * @return {*}
 */
const routeToDisconnect = (baseIP, initType = true) => {
  window.location.href =
    baseIP +
    (initType
      ? "/?lg_preurl=" + encodeURIComponent(urlRemLg_tk(window.location.href))
      : "");
};

/**
 * @description: ajax获取token验证，返回promise
 * @param {*}
 * @return {*boolean,返回的都是布尔值，true 通过，false失败}
 */
const checkToken = (
  baseIP,
  token,
  sysID,
  success = () => {},
  error = () => {}
) => {
  return new Promise((resolve, reject) => {
    if (!baseIP || !token || !sysID) {
      resolve(false);
      console.error("baseIP or token or sysID is not undefined");
      return;
    }
    loginApi({
      token,
      sysID,
      baseIP,
      method: "tokenCheck",
      success: (data) => {
        if (data && data.data && data.data.result) {
          // console.log("success");

          tokenSuccess(token);
          success();
          resolve(true);
        } else {
          // console.log("error");

          error(); //这个error是每次验证失败都运行
          resolve(false);
        }
      },
      error: (data) => {
        // 出错就按token过期处理
        error();
        reject(false);
      },
    });
  });
};
/**
 * @description: 验证token成功后,需要存token等操作
 * @param {*}
 * @return {*}
 */
const tokenSuccess = (token) => {
  setDataStorage("token", token); //存在session
  setDataStorage("token", token, true); //local
  // 替换链接token
  window.history.pushState(
    null,
    null,
    addOrgToUrl(window.location.href, "lg_tk", token)
  );
};
/**
 * @description: 验证token失败后跳转至登陆页，需要所有token都验证完
 * @param {*initType:是否带上lg_preurl}
 * @return {*}
 */
const tokenError = (baseIP,initType=true) => {
  // 清掉storage
  sessionStorage.clear();
  localStorage.removeItem("token");
  routeToDisconnect(baseIP,initType); //掉线后重新定向到登陆页
};
/**
 * @description: 更新url上的token，有就替换，没有就加上
 * @param {*}
 * @return {*}
 */
