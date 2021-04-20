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
 * @Author: pengzhiwen
 * @LastEditors: pengzhiwen
 * @Description: 平台框架
 */
import React, {
  //   useCallback,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  // useMemo,
  useReducer,
  createContext,
  // useContext,
  useRef,
  forwardRef,
  useLayoutEffect,
  ForwardedRef,
  useCallback,
} from "react";
import {
  connect,
  useDispatch
} from "react-redux";
import "./index.scss";
import { withRouter, useLocation } from "react-router-dom";
import $ from "jquery";
import { commonActions, handleActions } from "@/redux/actions";
import logo from "./images/image-top-name.png";
import { init } from "@/util/init";
import { Loading } from "@/component/common";

import LeftMenu from "./leftMenu";
import Icon_1 from "./images/icon-select-1.png";
import Icon_2 from "./images/icon-select-2.png";
import Tab from "./Tab";
import TopBar from "./TopBar";
import RouteTab from "./routeTab";
import Page from "./page";
import { handleRoute } from "@/util/public";
import fetch from "@/util/fetch";
import ipConfig from "@/util/ipConfig";
import { message } from "antd";
let { BasicProxy } = ipConfig;
// 创建frame的context
export const frameContext = createContext();
const initState = {
  contentHeight: 0,
};
const frameReducer = (state, actions) => {
  switch (actions.type) {
    case "RESIZE_CONTENT":
      return Object.assign({}, state, {
        contentHeight: actions.data,
      });

    default:
      return state;
  }
};

/**
 * @description: frame的children的属性需要包含tabid，tabname，可有param
 * @param {*}
 * @return {*}
 */
function Frame(props, ref) {
  // type控制显示骨架类型，不存在或false则界面loading
  // type:*default:默认模式，存在左侧菜单和默认头部，children为中部内容区
  // *default-teacher:没有左侧区域，只有中间区域
  // search为tab的搜索区域，undefined则不会出现
  const {
    type,
    // 初始化回调
    pageInit,
    className,
    moduleID,
    // 平台信息，头部的logo和名称
    platMsg,
    // 左侧菜单，结构看leftmenu里面注释
    leftMenu,
    children,
    // 主动获取frame当前的活动标签页，回调函数
    getActiveTab,
    // 控制tab的props，与antd的tabs一样配置
    tabPorps,
    // 回调函数，获取标签页主要区域的宽高
    onContentresize,
    // 是否需要进行默认的趋势化操作，缺省为需要，false为不需要，配合不需要登陆逻辑的界面
    onlyBase,
    search,
    commonData,
    setShowModule,
    commonData: {
      roleMsg: {identityCode},
    },
  } = props;
  console.log("frame", props);
  
  // 是否初始化
  let [Init, setInit] = useState(false);
  // 身份信息
  let [Identity, setIdentity] = useState(false);
  // 用户信息
  let [UserInfo, setUserInfo] = useState(false);
  // 基础平台信息
  let [BasePlatFormMsg, setBasePlatFormMsg] = useState(false);
  // 可用区域高度
  // const [contentHeight, setContentHeight] = useState(0);
  // 骨架外层loading
  let [FrameLoading, setFrameLoading] = useState(true);
  // 平台信息
  let [PlatMsg, setPlatMsg] = useState({ logo });
  // 各服务器url
  let [SystemServer, setSystemServer] = useState(null);
  // // init 的所有数据
  // const [InitData,setInitData] =useState(null)
  // 左侧菜单
  let [MenuList, setMenuList] = useState([]);
  // tab的ref；
  const tabRef = useRef({});
  // reduce
  const [state, dispatch] = useReducer(frameReducer, initState);
  // ComponentList
  const [ComponentList, setComponentList] = useState([]);

  // 单页面的,还保留头部的
  //   存得到路由标签
  const [routeList, setRouteList] = useState([]);
  //   存普通的节点
  const [domList, setDomList] = useState([]);
  //   存底部版本
  const [proversion, setProVersion] = useState("");

  // 路由
  const location = useLocation();

  // 设置modulename
  const [moduleName, setModuleName] = useState(undefined);
  // end 单页面

  // 单页面2
  //   存得到路由标签
  const [pageList, setPageList] = useState([]);
  // let { ComponentList, TabList } = state;
  // init成功
  const [initData, setInitData] = useState(false);
  //最后刷新时间
  const [lastTime, setLastTime] = useState("");
  // 页面初始化副作用，依赖moduleID，pageInit,type
  let userIdentity = "manager";
  if(identityCode == "IC0010"){
    userIdentity = "manager";
  }
  if(identityCode == "IC0013" || identityCode == "IC0011" || identityCode == "IC0012"){
    userIdentity = "teacher";
  }
  if(identityCode == "IC0014" || identityCode == "IC0015"){
    userIdentity = "student";
  }
  useLayoutEffect(() => {
    // if(userIdentity == "manager"){
    //   setMenuList([
    //     {
    //       key: "page/personalDetail",
    //       name: "智能画像",
    //       icon: Icon_2,
    //       children: [],
    //       params: [{ key: "page/personalDetail", title: "智能画像" }],
    //     },
    //     {
    //       key: "stuStatusMsg",
    //       name: "多维档案",
    //       icon: Icon_1,
    //       children: [
    //         {
    //           key: "stuStatusMsg",
    //           name: "学籍档案",
    //         },
    //         {
    //           key: "stuConditionMsg",
    //           name: "学情档案",
    //         },
    //         {
    //           key: "attendanceMsg",
    //           name: "考勤档案",
    //         }
      
    //       ],
    //     },
    //   ])
    // } else {
      setMenuList([
        {
          key: "page/personalDetail",
          name: "智能画像",
          icon: Icon_2,
          children: [],
          params: [{ key: "page/personalDetail", title: "智能画像" }],
        },
        {
          key: "stuStatusMsg",
          name: "多维档案",
          icon: Icon_1,
          children: [
            {
              key: "stuStatusMsg",
              name: "学籍档案",
            },
            {
              key: "stuConditionMsg",
              name: "学情档案",
            },
            {
              key: "attendanceMsg",
              name: "考勤档案",
            },
            {
              key: "healthMsg",
              name: "健康档案",
            },
            {
              key: "awardAndPunish",
              name: "奖惩档案",
            },
            {
              key: "schoolLiveMsg",
              name: "校园生活档案",
            },
      
          ],
        },
      ]);
    // }
  }, [identityCode])
  useLayoutEffect(()=>{
    let node = $(".link-child-box a");
    let currentIndex = 1;
    node.each((index, item)=>{
      if($(item).attr("class") && $(item).attr("class").indexOf("link-select") != -1){
        currentIndex = index + 1;
      }
    })
    let url = BasicProxy + "/cache/time?moduleId=" + currentIndex;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        setLastTime(result.data.substr(0, 16));
      }
    })
  }, [userIdentity]);
  useEffect(() => {
    //初始化，didmount，只依赖moduleid，依赖type会请求多次
    type &&
      // onlyBase !== false &&
      init(
        {moduleID,onlyBase:onlyBase},//onlyBase:只要基础信息，不用验证用户，不用登陆功能
        (data) => {
          //成功
          if (data.identityDetail && data.role.version !== "noPower") {
            //true表示该身份有效
            setIdentity(data.identityDetail);
            data.userInfo && setUserInfo(data.userInfo);
            data.basePlatformMsg && setBasePlatFormMsg(data.basePlatformMsg);
            setSystemServer(data.systemServer ? data.systemServer : false);
            // typeof pageInit === "function" && pageInit(data);
            setInitData(data);
            // type && setFrameLoading(false); //加载完毕，去掉laoding，需要type存在
            setInit(true);
          }else if(onlyBase){
            data.basePlatformMsg && setBasePlatFormMsg(data.basePlatformMsg);
            setInitData(data);
            setInit(true);
            
          } else {
            //身份无效
            // console.log('无效')
            document.location.href =
              data.basePlatformMsg.BasicWebRootUrl + "/Error.aspx?errcode=E011";
          }
        },
        () => {
          // type && setFrameLoading(true); //加载完毕，去掉laoding，需要type存在
        }
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleID]);

  // 监听type变化，修改loading,解决接口因为type变化请求多次问题请求多次
  // 初始化成功后的逻辑与初始化分开比较好
  useEffect(() => {
    // 初始化成功和loading还在才运行
    if ((Init ) && FrameLoading) {
      typeof pageInit === "function" &&
        pageInit(initData).then((isInit) => {
          if (isInit) {
            type && setFrameLoading(false);
          }
        });
    }
  }, [type, initData, Init, pageInit, FrameLoading, onlyBase]);
  // 平台信息副作用,
  useEffect(() => {
    // 对platMsg做把控，防止传进来的数据不对
    platMsg instanceof Object &&
      setPlatMsg({
        logo: platMsg.logo ? platMsg.logo : logo,
        ...platMsg,
      });
  }, [platMsg]);
  // 初始化左侧菜单列表和顶部数据
  // useEffect(() => {
  //   // 对platMsg做把控，防止传进来的数据不对
  //   platMsg instanceof Object &&
  //     setPlatMsg({
  //       logo: platMsg.logo ? platMsg.logo : logo,
  //       ...platMsg,
  //     });
  //   leftMenu instanceof Array && setMenuList(leftMenu);
  // }, [platMsg, leftMenu]);
  // 路由变化,控制头部modulename
  useEffect(() => {
    let Path = handleRoute(location.pathname);
    routeList.forEach((child, index) => {
      if (child.props.routeid === Path[0]) {
        setModuleName(child.props.routename);
      }
    });

    return () => {};
  }, [location, routeList]);
  // 当type不一样的时候，处理界面显示不同的模式，返回不同的节点列表
  useEffect(() => {
    // 默认的才有tab

    if (checkType("default")) {
      let List = [];
      children.forEach((child) => {
        try {
          // 不存在这两个参数的不要
          if (
            !child.props ||
            child.props.tabid === undefined ||
            child.props.tabname === undefined
          ) {
            return "";
          }
        } catch {
          return "";
        }

        List.push({
          children: child,
          props: {
            ...child.props,
            redirect:
              "/" +
              (child.props.redirect
                ? child.props.redirect
                : leftMenu[0]
                ? leftMenu[0].key
                : ""),
          },
        });
      });
      // 存compoent
      setComponentList(List);
    }
    // 教师端，也就是有路由的
    if (checkType("teacher")) {
      let routeList = [];
      let domList = [];
      let proversion = [];

      children instanceof Array &&
        children.forEach((child) => {
          // frametype为teacher的都是要的
          if (child.props.frametype === "teacher") {
            if (child.props.routeid) {
              routeList.push(child);
            } else if (child.props.proversion) {
              proversion.push(child);
            } else {
              domList.push(child);
            }
          }
        });
      setRouteList(routeList);
      setProVersion(proversion);
      setDomList(domList);
    }

    // 单页面,新开界面
    if (checkType("page")) {
      let pageList = [];
      let domList = [];
      let proversion = [];
      children instanceof Array &&
        children.forEach((child) => {
          // frametype为page的都是要的
          if (child.props.frametype === "page") {
            if (child.props.pageid) {
              pageList.push(child);
            } else if (child.props.proversion) {
              proversion.push(child);
            } else {
              domList.push(child);
            }
          }
        });
        console.log(pageList)

      setPageList(pageList);
      setProVersion(proversion);
      setDomList(domList);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, type, leftMenu]);

  // 对type字段解析，查看是否包含
  const checkType = useCallback(
    (key = null) => {
      return typeof type === "string" && type.includes(key);
    },
    [type]
  );
  let { activeTab, tabList, removeTab } = tabRef.current ? tabRef.current : {};
  // 返回方法，外部使用
  useImperativeHandle(
    ref,
    () => {
      return {
        // pageInit,
        activeTab,
        tabList,
        removeTab,
        contentHeight: state.contentHeight,
      };
    },
    [activeTab, tabList, removeTab, state.contentHeight]
  );
  // 保存活动的tab
  useEffect(() => {
    typeof getActiveTab === "function" && getActiveTab(activeTab);
    // dispatch(handleActions.setActiveTab(activeTab));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  let dispatchs = useDispatch();
  const getNewInfo = () => {
    let node = $(".link-child-box a");
    let currentIndex = 1;
    node.each((index, item)=>{
      if($(item).attr("class") && $(item).attr("class").indexOf("link-select") != -1){
        currentIndex = index + 1;
      }
    })
    let url = BasicProxy + "/cache/delete?moduleIds=" + currentIndex;
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200){
        dispatchs({
            type: commonActions.COMMON_REFLASH,
            data: true
        });
        //刷新后将状态还原，以便于下次刷新
        setTimeout(() => {
          dispatchs({
            type: commonActions.COMMON_REFLASH,
            data: false
          });
        }, 2000);
        //刷新后更新数据刷新时间显示
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        if(month < 10){
          month = "0" + month;
        }
        if(day < 10){
          day = "0" + day;
        }
        if(hour < 10){
          hour = "0" + hour;
        }
        if(minute < 10){
          minute = "0" + minute;
        }
        setLastTime(year + "-" + month + "-" + day + " " + hour + ":" + minute);
        message.destroy();
        message.config({
          rtl: false,
          getContainer: ()=>document.body
        });
        message.success("刷新成功~");
      }
    })
  }
  return (
    <frameContext.Provider value={{ state, dispatch }}>
      <Loading
        spinning={FrameLoading 
          // || MenuList.length === 0
        }
        opacity={false}
        tip={"加载中..."}
      >
        <div
          id="Frame"
          style={checkType("page") ? { minWidth: "auto" } : {}}
          className={`Frame ${className ? className : ""}`}
        >
          {checkType("page") ? (
            BasePlatFormMsg && (
              <Page
                pageList={pageList}
                useScrollbars={false}
                basePlatFormMsg={BasePlatFormMsg}
                domList={domList}
                ProVersion={proversion}
                commonData={commonData}
              ></Page>
            )
          ) : (
            <>
              <TopBar
                userInfo={UserInfo}
                basePlatFormMsg={BasePlatFormMsg}
                platMsg={PlatMsg}
                identity={Identity}
                type={type}
                systemServer={SystemServer}
                moduleName={moduleName}
                initData={initData}
              ></TopBar>

              {type ? (
                <div
                  className={`Frame-contain  ${
                    checkType("teacher") ? "Frame-contain-2" : ""
                  }`}
                >
                  {checkType("default") ? (
                    <div className="Frame-contain-left">
                      <LeftMenu list={MenuList} commonData={commonData} setShowModule={setShowModule}></LeftMenu>
                      <p className="reflash" onClick={getNewInfo}>最后刷新: {lastTime}<i className="reflashlogo"></i></p>
                    </div>
                  ) : (
                    ""
                  )}

                  <div
                    className={`Frame-contain-right ${
                      checkType("teacher") ? "only-center" : ""
                    }`}
                  >
                    {Init ? (
                      checkType("teacher") ? (
                        <RouteTab
                          routeList={routeList}
                          domList={domList}
                          basePlatFormMsg={BasePlatFormMsg}
                          ProVersion={proversion}
                        >
                          {children}
                        </RouteTab>
                      ) : ComponentList instanceof Array &&
                        ComponentList.length > 0 ? (
                        <Tab
                          tabPorps={tabPorps}
                          ref={tabRef}
                          componentList={ComponentList}
                          search={search}
                          type={type}
                          onContentresize={onContentresize}
                        >
                          {children}
                        </Tab>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </Loading>
    </frameContext.Provider>
  );
}
const mapStateToProps = (state) => {
  let {
    commonData: { isReflash },
  } = state;
  return { isReflash };
};
export default connect(mapStateToProps)(memo(forwardRef(Frame)));
