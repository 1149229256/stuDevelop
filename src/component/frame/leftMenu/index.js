
// leftmenu数据结构
// leftMenu: [
//   {
//     key: "teacherBaseMsg",
//     name: "师资统计分析",
//     icon: Icon_1,
//     children: [
//       {
//         key: "teacherBaseMsg",
//         name: "教师基本信息",
//       },
//       {
//         key: "workMsg",
//         name: "教师工作量",
//       },
//       {
//         key: "teachingAbility",
//         name: "教师教学能力",
//       },
//       {
//         key: "informationizeAbility",
//         name: "教师信息化能力",
//       },
//       {
//         key: "schoolResource",
//         name: "各校师资",
//       },
//     ],
//   },
//   {
//     key: "teacherPersona",
//     name: "教师画像查询",
//     icon: Icon_2,
//     children: [],
//   },
//   {
//     key: "teacherRecruit",
//     name: "教师招聘计划管理",
//     icon: Icon_3,
//     children: [],
//     // 除了左侧菜单的其它合法一级路由,打开这个路由，左侧会对应打开所属的节点
//     params: [
//       { key: "publishRecruit", title: "发布招聘计划" },
//       { key: "editRecruit", title: "编辑招聘计划" },
//       { key: "recruitDetail", title: "招聘计划详情" },
//     ],
//   },
//   {
//     key: "teacherTrain",
//     name: "教师培训计划管理",
//     icon: Icon_4,
//     children: [],
//   },
//   { key: "notice", name: "通知公告", icon: Icon_5, children: [] },
// ],
import React, {
  // useCallback,
  memo,
  useEffect,
  useState,
  // useImperativeHandle,
  // useMemo,
  //   useRef,
  forwardRef,
} from "react";
import $ from "jquery";
import { withRouter, NavLink } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { deepMap, handleRoute } from "../../../util/public";
import "./index.scss";
// 在listen中无法做到list的实时更新，唯有做这个全局变量进行更新
// let List = [];
/**
 * @description: 下拉箭头控制
 * @param {*}
 * @return {*}
 */
function MenuLink(props, ref) {
  let { children: List, location, UserID, setShowModule } = props;
  console.log("左边菜单", props)
  // list 全局赋值，保证listen里的值是最新
  // list里的key值要保证名字不重复切字符不全包含，
  // 下面的监听匹配是通过string.includes进行match的

  // 设置该层唯一打开的菜单,空表示没有打开
  const [openMenu, setOpenMenu] = useState("");
  // 设置选中的第一级菜单项，通过二级控制一级
  const [selectMenu, setSelectMenu] = useState(false);

  // 下级开关
  const [routeAgain, setRouteAgain] = useState(true);
  const [Path, setPath] = useState([]);

  //  路由监听
  useEffect(() => {
    // 控制当下级箭头操作时在不影响路由的前提下可控isactive
    // setRouteAgain(true);
    let Path = handleRoute(location.pathname);
    if(location.pathname.indexOf("page") != -1){
      window.location.reload();
      return;
    }
    setPath(Path);
    // let Path = location && location.pathname ? location.pathname : "";
    deepMap(List, ({ child, index, level, parent }) => {
      if (level === 1) {
        if (
          Path.some((path) => child.key === path) ||
          selectMenu === child.key
        ) {
          setSelectMenu(false);
          setOpenMenu(child.key);
        }
      } else if (level === 2) {
        if (Path.some((path) => child.key === path)) {
          setSelectMenu(parent[level - 2].key);
        }
      }
    });
    
  }, [location, List, selectMenu]);
  
  return (
    List instanceof Array &&
    List.map((child, index) => {
      let { key, name, icon, children, params } = child;
      // icon:*false,表示不要图标且位置也不要，*undefined,表示使用默认标点,
      // *true,保留图标位置，但不要图标,*string,图标url
      // children:是否有下一级，非array或array length为0不做渲染
      if (key === undefined) {
        //如果key 为undefined，这个节点不能渲染
        return "";
      }
      let haveChild = children instanceof Array && children.length > 0;
      // 初始时是否打开下级菜单
      let openChild = openMenu === key;
      
      return (
        <div key={index} className="select-box">
          <div className="select-sub">
            <NavLink
              isActive={(match, location) => {
                // 选择下级的话就必定上级选中
                if (
                  match ||
                  selectMenu === key ||
                  (params instanceof Array &&
                    params.some((param) => {
                      return param.key === Path[0];
                    })) ||
                  (children instanceof Array &&
                    children.some((child) => {
                      return (
                        child.params instanceof Array &&
                        child.params.some((param) => {
                          return param.key === Path[0];
                        })
                      );
                    }))
                ) {
                  // 一级级选中后影响一级选中
                  // setSelectMenu(false);
                  // 路由变化的open才能使用
                  if (routeAgain) {
                    // setOpenMenu(key);
                  }
                  return true;
                }
              }}
              to={"/" + (key.indexOf('page') == -1? key: key + "/" +　UserID)}
              activeClassName={"link-select"}
              className={`link-bar ${"link-level-1"}`}
            >
              {icon !== false ? (
                <i
                  className={`link-icon ${icon === undefined ? "dot" : ""}`}
                  style={
                    typeof icon === "string"
                      ? { backgroundImage: `url(${icon})` }
                      : {}
                  }
                ></i>
              ) : (
                ""
              )}
              <span className="link-name" title={name}>
                {name}
              </span>
            </NavLink>
            {haveChild ? (
              <i
                className={`link-arrow ${openChild ? "link-arrow-open" : ""}`}
                onClick={(e) => {
                  // 阻止合成事件的冒泡
                  e.stopPropagation();
                  // 阻止与原生事件的冒泡
                  e.nativeEvent.stopImmediatePropagation();
                  setRouteAgain(false);
                  // 可控制菜单的打开，取反
                  setOpenMenu(openChild ? false : key);
                }}
              ></i>
            ) : (
              ""
            )}
          </div>
          {haveChild ? (
            <div
              className={`link-child-box ${openChild ? "link-child-open" : ""}`}
              style={{ height: openChild ? `${children.length * 44}px` : 0 }}
            >
              {children.map((second, secondIndex) => {
                let { key, name, icon, params } = second;
                return (
                  <NavLink
                    isActive={(match, location) => {
                      //  选中操作，可影响上级，只做选中操作

                      // 选择下级的话就必定上级选中
                      if (
                        match ||
                        (params instanceof Array &&
                          params.some((param) => {
                            return param.key === Path[0];
                          }))
                      ) {
                        // 二级选中后影响一级选中
                        // setSelectMenu(child.key);
                        return true;
                      }
                    }}
                    key={secondIndex}
                    // location={'/'+key}
                    to={"/" + key}
                    onClick={()=>{
                      setShowModule(key);
                      let myEvent = new Event('resize');
                      setTimeout(() => {
                        window.dispatchEvent(myEvent);
                      }, 20);
                    }}
                    activeClassName={"link-select"}
                    className={`link-bar ${"link-level-2"}`}
                  >
                    {icon !== false ? (
                      <i
                        className={`link-icon ${
                          icon === undefined ? "dot" : ""
                        }`}
                        style={
                          typeof icon === "string"
                            ? { backgroundImage: `url(${icon})` }
                            : {}
                        }
                      ></i>
                    ) : (
                      ""
                    )}
                    <span className="link-name" title={name}>
                      {name}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          ) : (
            ""
          )}
          
        </div>
      );
    })
  );
}
function LeftMenu(props, ref) {
  let { 
    list: List,
    location,
    commonData: {
      userInfo: {
        UserID
      }
    },
    setShowModule
  } = props;
  
  return (
    <div className="LeftMenu">
      <Scrollbars>
        <MenuLink children={List} location={location} UserID={UserID} setShowModule={setShowModule}></MenuLink>{" "}
      </Scrollbars>
    </div>
  );
}

export default withRouter(memo(forwardRef(LeftMenu)));
