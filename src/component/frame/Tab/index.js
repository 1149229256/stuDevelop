import React, {
  useCallback,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  useMemo,
  useLayoutEffect,
  //   useReducer,
  //   createContext,
  useContext,
  useRef,
  // forwardRef,
} from "react";
import { withRouter, useHistory, useLocation } from "react-router-dom";
// import {frameContext} from '../index'
import "./index.scss";
import $ from "jquery";
import { handleRoute, autoAlert } from "../../../util/public";
import { Tabs } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import { frameContext } from "../index";
import { debounce } from "../../../util/public";
let { TabPane } = Tabs;

function Tab(props, ref) {
  const {
    // type,

    // className,
    componentList: ComponentList,
    // children,
    // history,
    // location,
    onContentresize,
    // 传回来的tab的props，跟antd的Tab一样
    tabPorps,
    search,
  } = props;
  const history = useHistory();
  const location = useLocation();
  // 设置标签选择
  const [TabActive, setTabActive] = useState("");
  // reduce
  // const [state, dispatch] = useReducer(frameReducer, initState);
  // ComponentList
  //   const [ComponentList, setComponentList] = useState(componentList);
  const [TabList, setTabList] = useState([]);
  const [, setTabListLength] = useState(TabList.length);

  const { state, dispatch } = useContext(frameContext);
  // 路径
  const Path = useMemo(() => {
    // console.log(location);

    return location && typeof location.pathname === "string"
      ? handleRoute(location.pathname)
      : "";
  }, [location]);

  // 标签页
  useEffect(() => {
    // console.log(Path, ComponentList, TabList);
    // 查是否存在compoent
    let resetRoute = "";
    let tabkey = Path[0] + (Path[1] ? "|" + Path[1] : "");

    Path instanceof Array &&
      Path.length > 0 &&
      ComponentList instanceof Array &&
      ComponentList.forEach((child, index) => {
        let { props } = child;
        // 路由匹配包含，同事看tablist是否存在,尽量不要tabid有字符一样
        // 是否重定向，当节点设置了mustParam的时候，path没有param则会重定向到指定的redirct路径，没设置redirct则重定向到该节点key
        resetRoute = props.tabid === Path[0] && props.mustparam && !Path[1];
        if (
          Path[0] === props.tabid &&
          !TabList.some((tab) => {
            // id一样，如果没有param就返回true，如果有param就看param是否一样，一样就true
            // 返回true说明tab是已经存在了这个tab，不会加，只会跳到对应的tab页
            // 当component的param是存在，但路由没有传，则照常打开窗口，逻辑使用者处理

            return (
              props.tabid === tab.props.tabid &&
              (!props.param || Path[1] === tab.props.param)
            );
          }) &&
          !resetRoute
          //  &&
          // // paramList为限制二级路由的列表，如果路由出现不在列表的，不允许打开
          // (!props.paramList ||
          //   props.paramList.find((param) => {
          //     return !Path[1] || param.key === Path[1];
          //   }))
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
          obj.tabkey = tabkey;

          // if(props.paramList){
          //   props.paramList.some((param) => {
          //     obj.tabname = param.title;
          //     return param.key === (Path[1]?Path[1]:'');
          //   })
          // }
          TabList.push({ ...child, props: { ...props, ...obj } });
          setTabList(TabList);
          setTabListLength(TabList.length);
        }
        if (resetRoute) {
          resetRoute = props.redirect;
          // history.push(props.redirect);
        }
      });

    if (resetRoute) {
      history.push(resetRoute);
    } else {
      setTabActive(tabkey);
    }
    // console.log(Path, ComponentList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Path, ComponentList]);
  // bar跳转
  const routeTo = (active, param) => {
    history.push("/" + active.split("|")[0] + (param ? "/" + param : ""));
  };
  // 移除tab
  const removeTab = useCallback(
    /**
     * @description: *rmTabid:要移除的tabid,为'',undefined,null时删除当前tab，*reParam：有二级的时候要匹配的二级路由
     * nextTabid,nextParam:要route到自己想到的位置时，
     * @param {*}
     * @return {*}
     */
    (rmTabid, reParam, nextTabid, nextParam, onlyOne) => {
      if (TabList.length <= 0) {
        return;
      }
      let List = [];

      let tabIndex = 0;
      let active = TabActive.split("|")[0];
      // let activeParam = TabActive.split("|")[1];
      let param = TabActive.split("|")[1];
      if (TabList.length === 1) {
        // 当一个的时候，rmTabid有值，说明是先移除当前节点，再添加下一节点
        if (typeof onlyOne === "function") {
          // 更新活动
          // setTabActive(active);

          // 更新列表
          setTabList(List);

          // 通过路由修改
          routeTo(nextTabid || active, nextTabid ? nextParam : param);
          onlyOne(active, param);
        } else {
          routeTo(nextTabid || active, nextTabid ? nextParam : param);
          // rmTabid&&removeTab(rmTabid,reParam)
        }

        return;
      }

      if (!rmTabid) {
        rmTabid = active;
        reParam = param;
      }
      //不传rmTabid，表示移除当前tab 如果是删当前，选中往前移
      if (rmTabid === active && reParam === param) {
        let activeBar = {};
        // 找到该tab的位置
        TabList.some((child, index) => {
          if (child.props.tabid === active && child.props.param === param) {
            tabIndex = index;
            return true;
          }
          return false;
        });
        if (tabIndex === TabList.length - 1) {
          //最后往前移
          activeBar = TabList[TabList.length - 2];
        } else {
          activeBar = TabList[tabIndex + 1];
        }
        active = activeBar.props.tabid;
        param = activeBar.props.param;
      }
      // let List = [];
      TabList.forEach((tab) => {
        if (tab.props.tabid !== rmTabid || tab.props.param !== reParam) {
          List.push(tab);
        }
      });
      // 更新活动
      // setTabActive(active);

      // 更新列表
      setTabList(List);

      // 通过路由修改
      routeTo(nextTabid || active, nextTabid ? nextParam : param);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [TabList, TabActive]
  );
  // 向外部传值
  useImperativeHandle(
    ref,
    () => ({
      activeTab: TabActive,
      tabList: TabList,
      removeTab,
      // removeActiveTab: () => {
      //   removeTab(TabActive);
      // },
    }),
    [TabActive, TabList, removeTab]
  );
  // 获取可视区域高度
  useLayoutEffect(() => {
    let tabContent = $(".Frame-contain-right  .ant-tabs-content-holder");
    let height = tabContent.height();
    let width = tabContent.width();
    typeof onContentresize === "function" && onContentresize(height, width);
    dispatch({ type: "RESIZE_CONTENT", data: height });
    let resize = (e) => {
      let height = tabContent.height();
      let width = tabContent.width();
      typeof onContentresize === "function" && onContentresize(height, width);

      dispatch({ type: "RESIZE_CONTENT", data: height });
    };
    window.addEventListener("resize", debounce(resize, 500), false);

    return () => {
      window.removeEventListener("resize", debounce(resize, 500));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(ref)
  return (
    <Tabs
      {...tabPorps}
      animated={false}
      activeKey={TabActive}
      renderTabBar={(props, DefaultTabBar) => {
        // console.log(TabList, TabList.length);

        return (
          <>
            <DefaultTabBar
              {...props}
              // onTabClick={(key, e) => {
              //   // setTabActive(key);
              //   TabList.forEach((child) => {
              //     let route = key.split("|");
              //     if (
              //       route[0] === child.props.tabid &&
              //       route[1] === child.props.param
              //     ) {
              //       // 通过路由修改
              //       routeTo(key, child.props.param);
              //       return true;
              //     }
              //     return false;
              //   });
              // }}
              
              className={`tab-nav-bar ${search ? "haveSearch" : ""}`}
            ></DefaultTabBar>
            {/* {search ? <div className="search-context">{search}</div> : ""} */}
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
              <div
                className="tabname"
                title={props.tabname}
                onClick={(key, e) => {
                  // setTabActive(key);
                  // let route = key.split("|");
                  let myEvent = new Event('resize');
                  setTimeout(() => {
                    window.dispatchEvent(myEvent);
                  }, 20);
                  
                  routeTo(child.props.tabid, child.props.param);
                  // TabList.forEach((child) => {
                  //   let route = key.split("|");
                  //   if (
                  //     route[0] === child.props.tabid &&
                  //     route[1] === child.props.param
                  //   ) {
                  //     // 通过路由修改
                  //     routeTo(key, child.props.param);
                  //     return true;
                  //   }
                  //   return false;
                  // });
                }}
              >
                {props.tabname}
                <i
                  className="tab-close-btn"
                  onClick={(e) => {
                    // 阻止合成事件的冒泡
                    e.stopPropagation();
                    // 阻止与原生事件的冒泡
                    e.nativeEvent.stopImmediatePropagation();
                    // console.log(e);
                    removeTab(props.tabid, props.param);
                    // // 一个不许删
                    // if (TabList.length <= 1) {
                    //   return;
                    // }
                    // let active = TabActive.split("|")[0];
                    // // let activeParam = TabActive.split("|")[1];
                    // let param = TabActive.split("|")[1];
                    // // 如果是删当前，选中往前移
                    // if (props.tabid === active && props.param === param) {
                    //   let activeBar = {};
                    //   if (index === TabList.length - 1) {
                    //     //最后往前移
                    //     activeBar = TabList[TabList.length - 2];
                    //   } else {
                    //     activeBar = TabList[index + 1];
                    //   }
                    //   active = activeBar.props.tabid;
                    //   param = activeBar.props.param;
                    // }
                    // let List = [];
                    // TabList.forEach((tab) => {
                    //   if (
                    //     tab.props.tabid !== props.tabid ||
                    //     tab.props.param !== props.param
                    //   ) {
                    //     List.push(tab);
                    //   }
                    // });
                    // // 更新活动
                    // // setTabActive(active);
                    // // 更新列表
                    // setTabList(List);
                    // // 通过路由修改
                    // routeTo(active, param);
                  }}
                ></i>
              </div>
            }
            key={props.tabkey}
          >
            <Scrollbars>{children}</Scrollbars>
          </TabPane>
        );
      })}
    </Tabs>
  );
}
export default memo(React.forwardRef(Tab));
