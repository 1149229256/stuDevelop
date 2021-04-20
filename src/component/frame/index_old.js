/*
 *                   江城子 . 程序员之歌
 * 
 *               十年生死两茫茫，写程序，到天亮。
 *                   千行代码，Bug何处藏。
 *               纵使上线又怎样，朝令改，夕断肠。
 * 
 *               领导每天新想法，天天改，日日忙。
 *                   相顾无言，惟有泪千行。
 *               每晚灯火阑珊处，夜难寐，加班狂。
 * 
 * 
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-12-03 08:54:32
 * @LastEditTime: 2020-12-03 08:54:33
 * @Description: 
 * @FilePath: \teacher-development\src\component\frame\index_old.js
 */

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
 * @Date: 2020-11-18 19:36:59
 * @LastEditTime: 2020-12-02 22:04:47
 * @Description: 平台框架
 * @FilePath: \teacher-development\src\component\frame\index.js
 */
import React, {
    //   useCallback,
    memo,
    useEffect,
    useState,
    useImperativeHandle,
    useMemo,
    useReducer,
    createContext,
    useContext,
    //   useRef,
    forwardRef,
  } from "react";
  import "./index.scss";
  import { NavLink, withRouter } from "react-router-dom";
  import { getDataStorage } from "../../util/public";
  import { LogOut } from "../../util/connect";
  import logo from "./images/image-top-name.png";
  import { init } from "../../util/init";
  import { Loading } from "../../component/common";
  import Icon_1 from "./images/icon-select-1.png";
  import Icon_2 from "./images/icon-select-2.png";
  import Icon_3 from "./images/icon-select-3.png";
  import Icon_4 from "./images/icon-select-4.png";
  import Icon_5 from "./images/icon-select-5.png";
  import LeftMenu from "./leftMenu";
  import { Tabs } from "antd";
  let { TabPane } = Tabs;
  
  function Frame(props, ref) {
    // type控制显示骨架类型，不存在或false则界面loading
    // type:*default:默认模式，存在左侧菜单和默认头部，children为中部内容区
    // *default-teacher:没有左侧区域，只有中间区域
    const {
      type,
      pageInit,
      className,
      moduleID,
      platMsg,
      leftMenu,
      children,
      history,
      location,
      search,
      setShowModule
    } = props;
    // 是否初始化
    let [Init, setInit] = useState(true);
    // 身份信息
    let [Identity, setIdentity] = useState(false);
    // 用户信息
    let [UserInfo, setUserInfo] = useState(false);
    // 基础平台信息
    let [BasePlatFormMsg, setBasePlatFormMsg] = useState(false);
  
    // 骨架外层loading
    let [FrameLoading, setFrameLoading] = useState(true);
    // 平台信息
    let [PlatMsg, setPlatMsg] = useState({ logo });
    // 左侧菜单
    let [MenuList, setMenuList] = useState([
      {
        key: "teacherBaseMsg",
        name: "师资统计分析",
        icon: Icon_1,
        children: [
          {
            key: "teacherBaseMsg",
            name: "教师基本信息",
          },
          {
            key: "workMsg",
            name: "教师工作量",
          },
          {
            key: "teachingAbility",
            name: "教师教学能力",
          },
          {
            key: "informationizeAbility",
            name: "教师信息化能力",
          },
          {
            key: "schoolResource",
            name: "各校师资",
          },
        ],
      },
      { key: "teacherPersona", name: "教师画像查询", icon: Icon_2, children: [] },
      {
        key: "teacherRecruit",
        name: "教师招聘计划管理",
        icon: Icon_3,
        children: [],
      },
      {
        key: "teacherTrain",
        name: "教师培训计划管理",
        icon: Icon_4,
        children: [],
      },
      { key: "notice", name: "通知公告", icon: Icon_5, children: [] },
    ]);
    // 设置标签选择
    const [TabActive, setTabActive] = useState("");
    // reduce
    // const [state, dispatch] = useReducer(frameReducer, initState);
    // ComponentList
    const [ComponentList, setComponentList] = useState([]);
    const [TabList, setTabList] = useState([]);
    // 路径
    const Path = useMemo(() => {
      // console.log(location);
  
      return location && typeof location.pathname === "string"
        ? location.pathname.substr(1).split("/")
        : "";
    }, [location]);
    // let { ComponentList, TabList } = state;
    // 页面初始化副作用，依赖moduleID，pageInit,type
    useEffect(() => {
      //初始化，didmount
      init(
        moduleID,
        (data) => {
          //成功
          console.log(data);
          if (data.identityDetail) {
            //true表示该身份有效
            setIdentity(data.identityDetail);
            data.userInfo && setUserInfo(data.userInfo);
            data.basePlatformMsg && setBasePlatFormMsg(data.basePlatformMsg);
  
            setInit(true);
            typeof pageInit === "function" && pageInit(data);
            type && setFrameLoading(false); //加载完毕，去掉laoding，需要type存在
          }
        },
        () => {
          // type && setFrameLoading(true); //加载完毕，去掉laoding，需要type存在
        }
      );
    }, [pageInit, moduleID, type]);
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
    useEffect(() => {
      // 对platMsg做把控，防止传进来的数据不对
      platMsg instanceof Object &&
        setPlatMsg({
          logo: platMsg.logo ? platMsg.logo : logo,
          ...platMsg,
        });
      leftMenu instanceof Array && setMenuList(leftMenu);
    }, [platMsg, leftMenu]);
    // 测试输出副作用
    useEffect(() => {
      console.log(TabList);
      // props.children.map((child, index) => {
      //   console.log(child.type);
      // });
      return () => {};
    }, [TabList]);
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
            },
          });
        });
        // 存compoent
        setComponentList(List);
      }
  
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children, type]);
    // 标签页
    useEffect(() => {
      // console.log(Path, ComponentList, TabList);
      // 查是否存在compoent
      Path instanceof Array &&
        Path.length > 0 &&
        ComponentList instanceof Array &&
        ComponentList.forEach((child, index) => {
          let { props } = child;
          // 路由匹配包含，同事看tablist是否存在,尽量不要tabid有字符一样
          if (
            Path[0].includes(props.tabid) &&
            !TabList.some((tab) => {
              // id一样，如果没有param就返回true，如果有param就看param是否一样，一样就true
              // 返回true说明tab是已经存在了这个tab，不会加，只会跳到对应的tab页
              // 当component的param是存在，但路由没有传，则照常打开窗口，逻辑使用者处理
              return (
                props.tabid === tab.props.tabid &&
                (!props.param || Path[1] === tab.props.param)
              );
            })
          ) {
            // tab数量最多10个，多了就删前面的
            if (TabList.length >= 10) {
              let len = TabList.length;
              for (let i = 0; i < len - 9; i++) {
                TabList.shift();
              }
            }
            // 如果有param，替换param
            let obj = {};
            if (child.props.param) {
              obj.param = Path[1];
              obj.tabid = Path[0];
            }
            TabList.push({ ...child, props: { ...props, ...obj } });
            console.log(TabList);
            setTabList(TabList);
          }
          setTabActive(Path[0] + (Path[1] ? "|" + Path[1] : ""));
        });
      // console.log(Path, ComponentList);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Path, ComponentList]);
    // 对type字段解析，查看是否包含
    const checkType = (key = null) => {
      return typeof type === "string" && type.includes(key);
    };
    // 返回方法，外部使用
    useImperativeHandle(ref, () => ({
      // pageInit,
    }));
    // bar跳转
    const routeTo = (active, param) => {
      history.push("/" + active.split("|")[0] + (param ? "/" + param : ""));
    };
    return (
      <Loading spinning={FrameLoading} opacity={false} tip={"加载中..."}>
        <div id="Frame" className={`Frame ${className ? className : ""}`}>
          {checkType("default") ? (
            <div className="Frame-topBar-1">
              <i
                className="Frame-logo"
                style={{ background: `url(${PlatMsg.logo})` }}
              ></i>
              {UserInfo ? (
                <div className={"Frame-userMsg"}>
                  <i
                    className="user-pic"
                    style={{
                      background: `url(${UserInfo.PhotoPath}) no-repeat center center/28px 28px`,
                      cursor:BasePlatFormMsg?'pointer':'auto'
                    }}
                    onClick={() => {
                      BasePlatFormMsg&& window.open(
                        BasePlatFormMsg.BasicWebRootUrl +
                          "/html/personalMgr/?lg_tk" +
                          getDataStorage("token") +
                          "#/"
                      );
                    }}
                  >
                    {" "}
                  </i>
                  <span title={UserInfo.UserName} className={"user-name"}>
                    {UserInfo.UserName}
                  </span>
                  <span
                    className="user-iden"
                    style={{
                      background: `url(${Identity.IconUrl}) no-repeat center center/contain  `,
                    }}
                    title={Identity.IdentityName}
                  >
                    {Identity.IdentityCode.includes("IC1")
                      ? Identity.IdentityName
                      : ""}
                  </span>
                  <span
                    className="logout"
                    onClick={() => {
                      LogOut({});
                    }}
                  ></span>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          <div
            className={`Frame-contain  ${
              checkType("teacher") ? "Frame-contain-2" : ""
            }`}
          >
            {type === "default" ? (
              <div className="Frame-contain-left">
                <LeftMenu list={MenuList} setShowModule={setShowModule}></LeftMenu>
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
                ComponentList instanceof Array && ComponentList.length > 0 ? (
                  <Tabs
                    activeKey={TabActive}
                    renderTabBar={(props, DefaultTabBar) => {
                      return (
                        <>
                          <DefaultTabBar
                            {...props}
                            onTabClick={(key, e) => {
                              // setTabActive(key);
                              console.log(TabList, key);
                              TabList.forEach((child) => {
                                let route = key.split("|");
                                if (
                                  route[0] === child.props.tabid &&
                                  route[1] === child.props.param
                                ) {
                                  // 通过路由修改
                                  routeTo(key, child.props.param);
                                  return true;
                                }
                                return false;
                              });
                            }}
                            className={`tab-nav-bar ${
                              search ? "haveSearch" : ""
                            }`}
                          ></DefaultTabBar>
                          {search ? (
                            <div className="search-context">{search}</div>
                          ) : (
                            ""
                          )}
                        </>
                      );
                    }}
                  >
                    {TabList.map((child, index) => {
                      let { children, props } = child;
                      return (
                        <TabPane
                          tab={
                            // <NavLink to={"/" + props.tabid} className="tab-name">
                            <div>
                              {props.tabname}
                              <i
                                className="tab-close-btn"
                                onClick={(e) => {
                                  // 阻止合成事件的冒泡
                                  e.stopPropagation();
                                  // 阻止与原生事件的冒泡
                                  e.nativeEvent.stopImmediatePropagation();
                                  // console.log(e);
                                  // 一个不许删
                                  if (TabList.length <= 1) {
                                    return;
                                  }
                                  let active = TabActive.split("|")[0];
                                  // let activeParam = TabActive.split("|")[1];
                                  let param = TabActive.split("|")[1];
                                  // 如果是删当前，选中往前移
                                  if (
                                    props.tabid === active &&
                                    props.param === param
                                  ) {
                                    let activeBar = {};
                                    if (index === TabList.length - 1) {
                                      //最后往前移
                                      activeBar = TabList[TabList.length - 2];
                                    } else {
                                      activeBar = TabList[index + 1];
                                    }
                                    active = activeBar.props.tabid;
                                    param = activeBar.props.param;
                                  }
                                  let List = [];
                                  TabList.forEach((tab) => {
                                    if (
                                      tab.props.tabid !== props.tabid ||
                                      tab.props.param !== props.param
                                    ) {
                                      List.push(tab);
                                    }
                                  });
                                  // 更新活动
                                  // setTabActive(active);
                                  // 更新列表
                                  setTabList(List);
                                  // 通过路由修改
                                  routeTo(active, param);
                                }}
                              ></i>
                            </div>
                          }
                          key={
                            props.tabid + (props.param ? "|" + props.param : "")
                          }
                        >
                          {children}
                        </TabPane>
                      );
                    })}
                  </Tabs>
                ) : (
                  children
                )
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Loading>
    );
  }
  export default withRouter(memo(forwardRef(Frame)));
  