import "whatwg-fetch";
// import loggerService from "./logger";
import "es6-promise";
import CryptoJS from "crypto-js";
import md5 from "md5";
import $ from "jquery";

import React from "react";
import ReactDOM from "react-dom";
// import { urlRemLg_tk } from "./public";
import { ErrorAlert } from "../component/common";
import { LogOut } from "./connect";
import { getAlertDom } from "./public";
const COMMONKEY = "123456789";
const TESTKEY = "abcdefgabcdefg12";

let notAuthorizedCounter = 0;
let fetchService = {
  fetch: (url, method, header, body) => {
    if (!header) {
      header = {};
    }

    return fetchService[method.toLowerCase()](url, header, body).catch(
      function (exception) {
        console.log("fetchService failed:" + exception);

        // token过期，重新获取token并发起请求
        if (exception.code === "401" || exception.code === "403") {
          notAuthorizedCounter++;
          // 最多重试3次
          if (notAuthorizedCounter > 2) {
            notAuthorizedCounter = 0;
            // loggerService.warn("401 or 403 received. Max attemps reached.");
            return;
          } else {
            return fetchService.fetch(url, method, header, body);
          }
        }
      }
    );
  },
  get: ({ url, header, securityLevel, config, advance }) => {
    //advance:是否提前处理,boolean:false表示不用提前，true表示使用，{}表示有选择的使用，里面为number，状态码
    if (!header) {
      //Content-Type: "application/x-www-form-urlencoded",
      // "application/json",
      // "multipart/form-data",
      header = {};
    }
    if (!config) {
      //fetch配置控制
      config = {};
    }
    if (!securityLevel) {
      securityLevel = 2;
    }
    if (advance === undefined) {
      advance = true; //
    }
    let result = fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*", //请求头，代表的、发送端（客户端）希望接收的数据类型
        "Content-Type": "application/x-www-form-urlencoded", //实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
        Authorization: requestSecure(url, TESTKEY, securityLevel),
        ...header,
      },
      redirect: "follow", //manual、*follow(自动重定向)、error，此项为重定向的相关配置
      // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI
      mode: "cors", //no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
      //允许指定的源进行跨域),same-origin(同源)
      cache: "no-cache", //*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
      credentials: "omit", //*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)
      ...config,
    });
    // result.then((res) => {
    //   //做提前处理
    //   let clone = res.clone();
    //   //console.log(clone.json());
    //   return clone;
    // }).then(
    //   (res) => res.json(),
    //   (err) => {
    //     return false;
    //   }
    // )
    result.then((res) => {
      //做提前处理
      // console.log(res)
      if (advance) {
        advanceFetch(res, advance);
      }
    });
    return result;
  },
  put: ({ url, header, body, securityLevel, config, advance, data }) => {
    // header["Content-Type"] = "application/json";
    if (!header) {
      header = {};
    }
    if (!config) {
      //fetch配置控制
      config = {};
    }
    if (!securityLevel) {
      securityLevel = 2;
    }
    if (advance === undefined) {
      advance = true; //
    }
    let content_type =
      header["Content-Type"] && header["Content-Type"] === "application/json"
        ? "json"
        : "default";
    let result = fetch(AESEncryptionUrl(url, TESTKEY, securityLevel), {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*", //请求头，代表的、发送端（客户端）希望接收的数据类型
        "Content-Type": "application/x-www-form-urlencoded", //实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
        Authorization: requestSecure(url, TESTKEY, securityLevel),

        ...header,
      },
      redirect: "follow", //manual、*follow(自动重定向)、error，此项为重定向的相关配置
      // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI
      mode: "cors", //no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
      //允许指定的源进行跨域),same-origin(同源)
      cache: "no-cache", //*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
      credentials: "omit", //*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)
      body: AESEncryptionBody(body, TESTKEY, securityLevel, content_type), //此处需要和headers里的"Content-Type"相对应
      // data: JSON.stringify(data),
      ...config,
    });
    result.then((res) => {
      //做提前处理
      if (advance) {
        advanceFetch(res, advance);
      }
    });

    return result;
  },
  delete: ({ url, header, body, securityLevel, config, advance, data }) => {
    // header["Content-Type"] = "application/json";
    if (!header) {
      header = {};
    }
    if (!config) {
      //fetch配置控制
      config = {};
    }
    if (!securityLevel) {
      securityLevel = 2;
    }
    if (advance === undefined) {
      advance = true; //
    }
    let content_type =
      header["Content-Type"] && header["Content-Type"] === "application/json"
        ? "json"
        : "default";
    let result = fetch(AESEncryptionUrl(url, TESTKEY, securityLevel), {
      method: "DELETE",
      headers: {
        Accept: "application/json, text/plain, */*", //请求头，代表的、发送端（客户端）希望接收的数据类型
        "Content-Type": "application/x-www-form-urlencoded", //实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
        Authorization: requestSecure(url, TESTKEY, securityLevel),

        ...header,
      },
      redirect: "follow", //manual、*follow(自动重定向)、error，此项为重定向的相关配置
      // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI
      mode: "cors", //no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
      //允许指定的源进行跨域),same-origin(同源)
      cache: "no-cache", //*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
      credentials: "omit", //*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)
      body: AESEncryptionBody(body, TESTKEY, securityLevel, content_type), //此处需要和headers里的"Content-Type"相对应
      data: JSON.stringify(data),
      ...config,
    });
    result.then((res) => {
      //做提前处理
      if (advance) {
        advanceFetch(res, advance);
      }
    });

    return result;
  },
  post: ({ url, header, body, securityLevel, config, advance }) => {
    // header["Content-Type"] = "application/json";
    if (!header) {
      header = {};
    }
    if (!config) {
      //fetch配置控制
      config = {};
    }
    if (!securityLevel) {
      securityLevel = 2;
    }
    if (advance === undefined) {
      advance = true; //
    }
    let content_type =
      header["Content-Type"] && header["Content-Type"] === "application/json"
        ? "json"
        : "default";
    let result = fetch(AESEncryptionUrl(url, TESTKEY, securityLevel), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*", //请求头，代表的、发送端（客户端）希望接收的数据类型
        "Content-Type": "application/x-www-form-urlencoded", //实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
        Authorization: requestSecure(url, TESTKEY, securityLevel),

        ...header,
      },
      redirect: "follow", //manual、*follow(自动重定向)、error，此项为重定向的相关配置
      // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI
      mode: "cors", //no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
      //允许指定的源进行跨域),same-origin(同源)
      cache: "no-cache", //*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
      credentials: "omit", //*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)
      body: AESEncryptionBody(body, TESTKEY, securityLevel, content_type), //此处需要和headers里的"Content-Type"相对应
      ...config,
    });
    result.then((res) => {
      //做提前处理
      if (advance) {
        advanceFetch(res, advance);
      }
    });

    return result;
  },
  post2: ({ url, header, body, securityLevel, config, advance }) => {
    // header["Content-Type"] = "application/json";
    if (!header) {
      header = {};
    }
    if (!config) {
      //fetch配置控制
      config = {};
    }
    if (!securityLevel) {
      securityLevel = 2;
    }
    if (advance === undefined) {
      advance = true; //
    }
    let content_type =
      header["Content-Type"] && header["Content-Type"] === "application/json"
        ? "json"
        : "default";
    let result = fetch(AESEncryptionUrl(url, TESTKEY, securityLevel), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*", //请求头，代表的、发送端（客户端）希望接收的数据类型
        "Content-Type": "application/x-www-form-urlencoded", //实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
        Authorization: requestSecure(url, TESTKEY, securityLevel),

        ...header,
      },
      redirect: "follow", //manual、*follow(自动重定向)、error，此项为重定向的相关配置
      // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI
      mode: "cors", //no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
      //允许指定的源进行跨域),same-origin(同源)
      cache: "no-cache", //*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
      credentials: "omit", //*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)
      body: AESEncryptionBody(body, TESTKEY, securityLevel, content_type), //此处需要和headers里的"Content-Type"相对应
      ...config,
    });
    result.then((res) => {
      //做提前处理
      if (advance) {
        advanceFetch(res, advance);
      }
    });

    return result;
  },
  tranfer: async ({ reqUrl, url, basicProxy = "", token }) => {
    let data = null;
    token =
      token || sessionStorage.getItem("token") || getQueryVariable("lg_tk");
    url =
      url ||
      basicProxy +
        "/Global/GetHttpRequestTransfer?appid=000&token=" +
        token +
        "&reqUrl=" +
        encodeURIComponent(reqUrl);
    try {
      let res = await fetchService.get({ url, securityLevel: 2, advance:false});
      let json = await res.json();
      data = JSON.parse(json);
      // console.log(json)

      // if (json.error === 0) {
      //   data = json;
      // } else {
      //   data = false; //有错误
      // }
    } catch {
      data = false; //有错误
    }
    return data;
  },
};

// fecth Advance 提前处理函数
/**
 * @description: post get 统一提前处理返回的数据
 * @param {*res:promise ,promise，advance：是否提前处理
 * false表示不用提前，true表示使用，{}表示有选择的使用，里面为number，状态码}
 * @return {*}
 */
function advanceFetch(res, advance) {
  //做提前处理
  let response = res.clone();
  // clone.then((response)=>{
  let AlertDom = getAlertDom();
  try {
    let json = response.json();
    json.then((json) => {
      // console.log(!json.StatusCode, json);
      let title = "";
      // return
      if(json.status){
        json.StatusCode = json.status;
      }
      
      if (!json) {
        title = "服务器出现未知异常，请重试或联系管理员";
        ReactDOM.render(
          // eslint-disable-next-line react/react-in-jsx-scope
          <ErrorAlert
            key={"alert-400-" + Math.round(Math.random() * 10000)}
            show={true}
            title={title}
          />,
          AlertDom
        );
        // withAlert()
        return;
      }

      if (!json.StatusCode) {
        title = "服务器出现未知异常，请重试或联系管理员";
        ReactDOM.render(
          // eslint-disable-next-line react/react-in-jsx-scope
          <ErrorAlert
            key={"alert-400-" + Math.round(Math.random() * 10000)}
            show={true}
            title={title}
          />,
          AlertDom
        );
        return;
      }
      if (json.StatusCode === 200) return;
      // console.log(json.StatusCode);

      let isAllSelect = false;
      let isSelect = {};
      if (advance === true) {
        isAllSelect = true;
      } else if (advance instanceof Array) {
        advance.forEach((child) => {
          isSelect[child] = true;
        });
      } else {
        console.log("参数错误");
        return;
      }
      switch (json.StatusCode) {
        case 400:
          if (isAllSelect || isSelect[400]) {
            title = json.msg;
            ReactDOM.render(
              // eslint-disable-next-line react/react-in-jsx-scope
              <ErrorAlert
                key={"alert-400-" + Math.round(Math.random() * 10000)}
                show={true}
                title={title}
              />,
              AlertDom
            );
          }
          break;
        case 500:
          if (isAllSelect || isSelect[500]) {
            title = "服务器出现未知异常，请重试或联系管理员";
            ReactDOM.render(
              // eslint-disable-next-line react/react-in-jsx-scope
              <ErrorAlert
                key={"alert-400-" + Math.round(Math.random() * 10000)}
                show={true}
                title={title}
              />,
              AlertDom
            );
          }
          break;
        case 401:
          if (isAllSelect || isSelect[401]) {
          }
          // TokenCheck();

          break;
        case 403:
          // if (isAllSelect || isSelect[403])
          // {

          // }
          // window.location.href = config.ErrorProxy + "/Error.aspx?errcode=E011";
          break;
        default:
        // window.location.href = config.ErrorProxy + "/Error.aspx?errcode=E011";
      }
    });
  } catch (e) {
    console.error(e);
  }

  // })
  // return clone;
}
/**
 * @description: 获取alert节点
 * @param {*}
 * @return {*}
 */
// function getAlertDom() {
//   let AlertDom = document.getElementById("alert");
//   if (!AlertDom) {
//     //alert节点不存在，创建一个
//     let body = document.getElementsByTagName("body")[0];
//     let alert = document.createElement("div");
//     alert.setAttribute("id", "alert");
//     body.appendChild(alert);
//     AlertDom = document.getElementById("alert");
//   }
//   return AlertDom;
// }
//请求安全，根据安全级别SecurityLevel返回token+签名
function requestSecure(params, securityKey, SecurityLevel = 1) {
  let token = sessionStorage.getItem("token") || getQueryVariable("lg_tk");
  let Autorization = null;

  if (!token && SecurityLevel !== 1) {
    console.log("token无效，请重新登录"); //后期会进行无token的事件操作
    //返回登录界面
    let baseUrl = sessionStorage.getItem("baseUrl");
    window.location.href = baseUrl;
    // LogOut({});
    return;
  }

  if (SecurityLevel === 1) {
    //级别1为不做任何安全认证
    return Autorization;
  } else if (SecurityLevel === 2) {
    //级别2为带上token
    Autorization = "X-Token=" + token;
  } else if (SecurityLevel === 3) {
    //级别2为带上token和签名
    Autorization =
      "X-Token=" + token + "&sign=" + getSign(token, params, securityKey);
  } else if (SecurityLevel === 4) {
    //级别4为带上token+随机字符串+时间戳+签名
    let timeStamp = formatDate(
      "http://192.168.2.248:8075/Global/GetTimestramp"
    ); //生成统一的时间戳
    let randomString = getRandomString(8, timeStamp);
    Autorization =
      "X-Token=" +
      token +
      "&randomString=" +
      randomString +
      "&sign=" +
      getSign(token, params, securityKey, randomString);
  } else {
    console.log("SecurityLevel有误，请重新设置");
  }
  // console.log(SecurityLevel,Autorization)
  return Autorization;
}
//生成随机字符串和时间戳(前端本地时间)
function getRandomString(len, timeStamp) {
  len = len || 8; //默认8位

  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let maxPos = $chars.length;
  let randomStr = "";
  for (let i = 0; i < len; i++) {
    randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return randomStr + timeStamp;
}
//格式化日期,
function formatDate(url) {
  let date = new Date();
  let fmt = "yyyyMMddHH";
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );

  let nonce = fetch(url, {
    method: "get", //*post、get、put、delete，此项为请求方法相关的配置
    mode: "no-cors", //no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
    //允许指定的源进行跨域),same-origin(同源)
    cache: "no-cache", //*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
    credentials: "include", //*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)

    headers: {
      Accept: "application/json, text/plain, */*", //请求头，代表的、发送端（客户端）希望接收的数据类型
      "Content-Type": "application/x-www-form-urlencodeed", //实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
    },
    redirect: "follow", //manual、*follow(自动重定向)、error，此项为重定向的相关配置
    // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI
    // 注意post时候参数的形式
  });

  return nonce;
}
function getSign(token, params, securityKey, randomString) {
  // 获取签名   返回一个包含"?"的参数串
  try {
    let param = handleParam(params); //处理params,返回序列化后的params

    let sign = calculateSign(param, securityKey, token, randomString);
    return sign;
  } catch (err) {
    console.log(err);
  }
}
// 生成sign
function calculateSign(param, securityKey, token, randomString) {
  //等级3时是不需要randomString

  return md5(token + param + securityKey + randomString); //签名顺序：token + 参数 + 秘钥 + randomString
}
//解析是get或post传进来的是url还是param，返回序列化字符串
function handleParam(params) {
  let param = "";
  if ("string" == typeof params) {
    let urlArray = params.split("?");
    param = urlArray[1];
  } else if ("object" == typeof params) {
    param = $.param(params);
  } else {
    console.log("参数不合法");
  }
  return param;
}
//获取url参数
function getQueryVariable(variable) {
  var query =
    window.location.search.substring(1) ||
    window.location.href.split("?")[1] ||
    window.location.href;

  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
}

// // 根据statuscode进行不同alter操作
// class ErrorAlert extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       show: props.show,
//     };
//   }

//   onOk = () => {
//     let { onOk } = this.props;
//     typeof onOk === "function" && onOk();
//     this.setState({
//       show: false,
//     });
//   };

//   onCancel = () => {
//     let { onCancel } = this.props;
//     typeof onCancel === "function" && onCancel();
//     this.setState({
//       show: false,
//     });
//   };
//   onClose = () => {
//     let { onClose } = this.props;
//     typeof onClose === "function" && onClose();
//     this.setState({
//       show: false,
//     });
//   };

//   render() {
//     // console.log(this.state.show)
//     return (
//       <Alert
//         show={this.state.show}
//         type="btn-error"
//         title={this.props.title}
//         onOk={this.onOk}
//         onCancel={this.onCancel}
//         onClose={this.onClose}
//         cancelShow={"n"}
//       ></Alert>
//     );
//   }
// }

//AES加密传输参数：post
function AESEncryptionBody(
  paramsObj,
  CRYPTOJSKEY = COMMONKEY,
  SecurityLevel,
  content_type
) {
  //加密所使用的的key，需要与服务器端的解密key相对应
  if (content_type === "json") {
    //let body = JSON.stringify(paramsObj);
    let plain = JSON.stringify(paramsObj); //json序列化
    // if (SecurityLevel === 4) {
    //     plain = getSign(paramsObj, CRYPTOJSKEY, randomString, 'post');
    // }

    // console.log(decrypt(encrypt(plain,CRYPTOJSKEY)))
    if (SecurityLevel === 3 || SecurityLevel === 4) {
      plain = JSON.stringify({ p: encrypt(plain, CRYPTOJSKEY) });
    }
    //console.log(plain)
    return plain;
  } else {
    //let body = JSON.stringify(paramsObj);
    let plain = $.param(paramsObj); //json序列化
    // if (SecurityLevel === 4) {
    //     plain = getSign(paramsObj, CRYPTOJSKEY, randomString, 'post');
    // }

    // console.log(decrypt(encrypt(plain,CRYPTOJSKEY)))
    if (SecurityLevel === 3 || SecurityLevel === 4) {
      plain = $.param({ p: encrypt(plain, CRYPTOJSKEY) });
    }

    return plain;
  }
}
//AES加密传输参数：get
function AESEncryptionUrl(url, CRYPTOJSKEY = COMMONKEY, SecurityLevel, IsDesk) {
  //加密所使用的的key，需要与服务器端的解密key相对应
  let newUrl = url;
  let urlArray = url.split("?");
  let params = urlArray[1];
  let host = urlArray[0];

  if (SecurityLevel === 3 || SecurityLevel === 4) {
    newUrl = host + "?p=" + encrypt(params, CRYPTOJSKEY); //参数加密处理
  }

  return newUrl;
}
// 加密
function encrypt(plaintText, CRYPTOJSKEY) {
  var options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  };
  var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
  var encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
  var encryptedBase64Str = encryptedData.toString().replace(/\//g, "_");
  encryptedBase64Str = encryptedBase64Str.replace(/\+/g, "-");
  return encryptedBase64Str;
}
//解密
// eslint-disable-next-line
function decrypt(encryptedBase64Str, CRYPTOJSKEY) {
  // eslint-disable-next-line
  var vals = encryptedBase64Str.replace(/\-/g, "+").replace(/_/g, "/");
  var options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  };
  var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
  var decryptedData = CryptoJS.AES.decrypt(vals, key, options);
  var decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData);
  return decryptedStr;
}
export default fetchService;
