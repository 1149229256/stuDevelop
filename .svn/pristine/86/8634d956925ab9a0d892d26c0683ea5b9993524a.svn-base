/* eslint-disable no-undef */
(function(e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t)
    : "function" == typeof define && define.amd
    ? define(t)
    : (e.listenAppDurationTime = t);
})(this, function(url, sysID, modelID, userID, callback) {
  var startTime = new Date().getTime();
  var storageKey = String(sysID) + String(modelID);
  var isLoad = false;
  url = url + "api/v1/DataCol/DataDeliver";
  window.addEventListener("load", function() {
    if (!sysID || !modelID) {
      return;
    }
    isLoad = true;
    var basicData = getBasicData();
    var AppDurationTimeFlag = basicData.AppDurationTimeFlag;
    var storageKeyValue = basicData.storageKeyValue;
    var refreshTimeFlag = compareRefreshTime();
    storageKeyValue = storageKeyValue
      ? storageKeyValue
      : {
          startTime: startTime,
          endTime: 0,
          openWebTabsCount: 0,
          refreshTime: startTime,
          userID: userID
        };
    // 初始进入页面,断电的情况也是一种情况
    if (
      (!sessionStorage.getItem(storageKey) &&
        storageKeyValue.openWebTabsCount == 0) ||
      refreshTimeFlag
    ) {
      storageKeyValue.startTime = startTime;
      storageKeyValue.endTime = 0;
    }
    storageKeyValue.openWebTabsCount = refreshTimeFlag
      ? 1
      : storageKeyValue.openWebTabsCount + 1;
    storageKeyValue.openWebTabsCount = Math.max(
      storageKeyValue.openWebTabsCount,
      1
    );
    AppDurationTimeFlag[storageKey] = storageKeyValue;
    localStorage.setItem(
      "AppDurationTimeFlag",
      JSON.stringify(AppDurationTimeFlag)
    );
  });
  window.addEventListener("beforeunload", function() {
    try {
      if (!sysID || !modelID) {
        return;
      }
      var basicData = getBasicData();
      var AppDurationTimeFlag = basicData.AppDurationTimeFlag;
      var endTime = basicData.nowTime;
      var storageKeyValue = basicData.storageKeyValue;
      var openWebTabsCount = storageKeyValue.openWebTabsCount;
      openWebTabsCount = isLoad ? openWebTabsCount - 1 : openWebTabsCount;
      openWebTabsCount = Math.max(openWebTabsCount, 0);
      storageKeyValue.endTime = endTime;
      storageKeyValue.openWebTabsCount = openWebTabsCount;
      AppDurationTimeFlag[storageKey] = storageKeyValue;
      localStorage.setItem(
        "AppDurationTimeFlag",
        JSON.stringify(AppDurationTimeFlag)
      );
      if (openWebTabsCount == 0 && isLoad) {
        //进行相关操作
        sendData(url, storageKeyValue.startTime, endTime);
        if (typeof callback == "function") {
          callback(sysID, modelID, userID, storageKeyValue.startTime, endTime);
        }
      }
      sessionStorage.setItem(storageKey, true);
    } catch (e) {
      console.log(e);
    }
  });

  function getBasicData() {
    var AppDurationTimeFlag = localStorage.getItem("AppDurationTimeFlag");
    var nowTime = new Date().getTime();
    AppDurationTimeFlag = AppDurationTimeFlag
      ? JSON.parse(AppDurationTimeFlag)
      : {};
    var storageKeyValue = AppDurationTimeFlag[storageKey];
    return {
      AppDurationTimeFlag: AppDurationTimeFlag,
      nowTime: nowTime,
      storageKeyValue: storageKeyValue
    };
  }

  // 考虑断电等异常情况,30秒刷新一次，刷新时间超过一分钟就是数据有断层
  function compareRefreshTime() {
    setTimeout(compareRefreshTime, 30000);
    var basicData = getBasicData();
    var AppDurationTimeFlag = basicData.AppDurationTimeFlag;
    var storageKeyValue = basicData.storageKeyValue;
    if (!storageKeyValue) {
      return false;
    }
    if (!storageKeyValue.refreshTime) {
      return false;
    }
    var refreshTime = storageKeyValue.refreshTime;
    var nowTime = basicData.nowTime;
    var flag = nowTime - refreshTime > 60 * 1000;
    storageKeyValue.refreshTime = basicData.nowTime;
    AppDurationTimeFlag[storageKey] = storageKeyValue;
    localStorage.setItem(
      "AppDurationTimeFlag",
      JSON.stringify(AppDurationTimeFlag)
    );
    return flag;
  }
  // 发送请求
  function sendData(url, startTime, endTime) {
    var xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveObject) {
      xhr = new ActiveXobject("Microsoft.XMLHTTP");
    }
    var guid = Guid();
    var startDate = formatDate(startTime);
    var endDate = formatDate(endTime);
    var EventData = {
      DataList: [
        {
          EventID: "M37_V01_" + guid,
          UserID: userID,
          VisitModule: modelID,
          VisitTime: startDate,
          VisitEndTime: endDate,
          SysID: sysID
        }
      ]
    };
    EventData = JSON.stringify(EventData);
    var data = {
      SysID: sysID,
      EventFlag: "M37_V01",
      EventData: EventData
    };
    data = formatParams(data);
    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
  }
  //格式化参数
  function formatParams(data) {
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    return arr.join("&");
  }
  // 格式化时间戳
  function formatDate(dateTime) {
    var time = new Date(parseInt(dateTime));
    var y = time.getFullYear(); //年
    var m = time.getMonth() + 1; //月
    if (m < 10) {
      m = "0" + m;
    }
    var d = time.getDate(); //日
    if (d < 10) {
      d = "0" + d;
    }
    var h = time.getHours(); //时
    if (h < 10) {
      h = "0" + h;
    }
    var mm = time.getMinutes(); //分
    if (mm < 10) {
      mm = "0" + mm;
    }
    var s = time.getSeconds(); //秒
    if (s < 10) {
      s = "0" + s;
    }
    var timeStr = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
    return timeStr;
  }
  //生成随机 GUID 数
  function Guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }
});
