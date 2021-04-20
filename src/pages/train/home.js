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
 * @Date: 2020-12-07 16:08:21
 * @LastEditTime: 2020-12-15 15:44:32
 * @Description:
 * @FilePath: \teacher-development\src\pages\train\home.js
 */

import { connect } from "react-redux";
import React, {
  useCallback,
  memo,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  useRef,
  useContext,
  forwardRef,
  useLayoutEffect,
} from "react";
import "./index.scss";
import { withRouter, useHistory, useLocation } from "react-router-dom";
// import { handleActions } from "../../redux/actions";
import HomeTop from "../../component/homeTop";
import Table from "../../component/table";
import { Context } from "./reducer";
import { getCruitList, deleteTrain } from "../../api/train";
import { autoAlert } from "../../util/public";
//   import { NavLink } from "react-router-dom";
function Home(props, ref) {
  let {
    // teacherTrainMsg: { tabId },
    roleMsg: { schoolID, collegeID, selectLevel },
    // history,
    activeTab,
    dispatch,
  } = props;
  let history = useHistory();
  let location = useLocation();
  let {
    state: { keyword },
    setDispatch,
  } = useContext(Context);
  const [query, setQuery] = useState({
    keyword,
    schoolID,
    collegeID,
    selectLevel,
  });
  // 获取table组件的ref
  const tableRef = useRef({});
  // 草稿数量
  const [draft, setDraft] = useState(0);
  // 初始请求
  const initGet = useRef(false);
  // table 的宽度最小为1040，各个列的width按这个来算1040/1200*设计图的width
  let widthRate = 1040 / 1200;
  let columns = [
    {
      title: "序号",
      dataIndex: "index",
      align: "center",
      width: 102 * widthRate,
      textWrap: "word-break",
      render: (data) => {
        return (
          <span className="table-index" title={data}>
            {data}
          </span>
        );
      },
    },
    {
      title: "标题",
      width: 404 * widthRate,
      // dataIndex: "title",
      render: (data) => {
        let { title, TID } = data;
        return (
          <span
            onClick={() => {
              history.push("/trainDetail/" + TID);
            }}
            className="table-title"
            title={title}
          >
            {title?title:'--'}
          </span>
        );
      },
    },
    {
      title: "来源",
      align: "center",
      width: 128 * widthRate,
      dataIndex: "source",
      render: (data) => {
        return (
          <span className="table-source" title={data}>
            {data}
          </span>
        );
      },
    },

    {
      title: "报名截止时间",
      align: "center",
      width: 172 * widthRate,
      // dataIndex: "ApplyEndTime",
      render: (data) => {
        let {ApplyFlag,ApplyEndTime} =data
        return (
          <span className="table-time" title={ApplyEndTime}>
            {ApplyFlag&&ApplyEndTime?ApplyEndTime:'--'}
          </span>
        );
      },
    },
    {
      title: "报名人数/限额",
      align: "center",
      width: 90 * widthRate,
      // dataIndex: "publisher",
      render: (data) => {
        let { Limit,ApplyCount,ApplyFlag } = data;
        let title = (ApplyCount?ApplyCount:0)+'/'+(Limit?Limit:'--')
        return (
          <span className="table-limit" title={title}>
            {ApplyFlag?title:'--'}
          </span>
        );
      },
    },
    {
      title: "培训方式",
      align: "center",
      width: 90 * widthRate,
      dataIndex: "ActivityFlag",
      render: (data) => {
        let ActivityList = [
          { value: 1, title: "线上" },
          { value: 0, title: "线下" },
        ];
        let title = ActivityList[parseInt(data)]?ActivityList[parseInt(data)].title:'--';
        return (
          <span className={`table-activity table-activity-${data}`} title={title}>
            {title}
          </span>
        );
      },
    },
    {
      title: "操作",
      align: "center",
      width: 200 * widthRate,

      // dataIndex: "time",
      render: (data) => {
        return (
          <span className="table-handle">
            <span
              className="table-btn btn-edit"
              onClick={() => {
                history.push("/editTrain/" + data.TID);
              }}
            >
              编辑
            </span>
            <span
              className="table-btn btn-delete"
              onClick={() => {
                autoAlert({
                  title: "确定删除该培训计划?",
                  type: "btn-warn",
                  cancelShow: true,
                  onOk: () => {
                    DeleteTrain(
                      { TIDs: data.TID },
                      tableRef.current.reloadList.bind(this,{},false)
                    );
                  },
                });
              }}
            >
              删除
            </span>
          </span>
        );
      },
    },
  ];
  let draftColumns = [
    {
      title: "序号",
      dataIndex: "index",
      align: "center",
      width: 102 * widthRate,
      textWrap: "word-break",
      render: (data) => {
        return (
          <span className="table-index" title={data}>
            {data}
          </span>
        );
      },
    },
    {
      title: "标题",
      width: 300 * widthRate,
      // dataIndex: "title",
      render: (data) => {
        let { title, TID } = data;
        return (
          <span
            onClick={() => {
              // history.push("/trainDetail/" + TID);
            }}
            className="table-title"
            title={title}
          >
            {title?title:'--'}
          </span>
        );
      },
    },

    {
      title: "最后一次编辑时间",
      align: "center",
      width: 172 * widthRate,
      dataIndex: "UpdateTime",
      render: (data) => {
        return (
          <span className="table-time" title={data}>
            {data?data:'--'}
          </span>
        );
      },
    },
    {
      title: "操作",
      align: "center",
      width: 200 * widthRate,

      // dataIndex: "time",
      render: (data) => {
        return (
          <span className="table-handle">
            <span
              className="table-btn btn-edit"
              onClick={() => {
                history.push("/editTrain/" + data.TID);
              }}
            >
              编辑
            </span>
            <span
              className="table-btn btn-delete"
              onClick={() => {
                // autoAlert({
                //   title: "确定删除该草稿?",
                //   type: "btn-warn",
                //   cancelShow: true,
                //   onOk: () => {
                //     DeleteTrain({ TIDs: data.TID }, () => {
                //       tableRef.current.reloadList();

                //       homeTopRef.current.reloadDraft();
                //     });
                //   },
                // });
                DeleteTrain({ TIDs: data.TID }, () => {
                  tableRef.current.reloadList({},false);

                  homeTopRef.current.reloadDraft();
                });
              }}
            >
              删除
            </span>
          </span>
        );
      },
    },
  ];
  // 删除
  const DeleteTrain = useCallback(
    (param, success = () => {}, error = () => {}) => {
      deleteTrain(param).then((res) => {
        if (res.result) {
          success();
        } else {
          error();
        }
      });
    },
    []
  );
  // useEffect(() => {
  //   console.log(keyword, selectLevel);
  //   selectLevel && setQuery({ keyword, schoolID, collegeID, selectLevel });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // 设置草稿数量
  // useLayoutEffect(() => {
  //   console.log(tableRef.current, tableRef);
  //   setDraft(
  //     tableRef.current.data && tableRef.current.data.Draft
  //       ? tableRef.current.data.Draft
  //       : 0
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tableRef.current]);
  // 刷新

  useLayoutEffect(() => {
    let { pathname } = location;
    //第一次进来不请求
    if (!initGet.current) {
      initGet.current = true;
    } else {
      if (pathname === "/teacherTrain") {
        tableRef.current.reloadList();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  const topDraft = useMemo(() => {
    return {
      title: "草稿箱",
      count: draft,
      query: { selectLevel, schoolID, collegeID, rStatus: 0 },
      api: getCruitList,
      columns: draftColumns,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectLevel, schoolID, collegeID, draft]);
  // console.log(keyword)
  useImperativeHandle(ref, () => ({
    reloadList: tableRef.current.reloadList,
  }));
  //
  const homeTopRef = useRef(null);
  return (
    <div className="Reacruit-context Train-home">
      <HomeTop
        ref={homeTopRef}
        publish={{
          title: "发布培训计划",
          onClick: () => {
            history.push("/publishTrain");
          },
        }}
        draft={topDraft}
        search={{
          onSearch: (value) => {
            // console.log(value)
            setDispatch({ type: "SET_KEY_WORD", data: value });
            setQuery({ schoolID, collegeID, keyword: value, selectLevel });
          },
        }}
      ></HomeTop>
      <Table
        className="Reacruit-table"
        columns={columns}
        // dataSource={data}
        prepare={!!query.selectLevel}
        query={query}
        onDataChange={(data) => {
          setDraft(data && data.Draft ? data.Draft : 0);
        }}
        ref={tableRef}
        api={getCruitList}
      ></Table>
      {/* <div style={{height:'20px',width:'100px',background:'#a6a6a6'}} onClick={()=>{
      history.push(`/${tabId}/publish`  );
      dispatch(handleActions.setTeacherTrainMsg({tabName:'发布培训计划'}))
  }}></div> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    handleData: { teacherTrainMsg, activeTab },
    commonData: { roleMsg },
  } = state;
  return { teacherTrainMsg, roleMsg, activeTab };
};
export default connect(mapStateToProps, null, null, { forwardRef: true })(
  memo(forwardRef(Home))
);
