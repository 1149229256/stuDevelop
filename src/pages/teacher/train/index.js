import {
  connect,
  // useSelector,
  //   useDispatch,
} from "react-redux";
import React, {
  useCallback,
  memo,
  useMemo,
  useEffect,
  useState,
  useReducer,
  // useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import "./index.scss";
import { withRouter } from "react-router-dom";
import Table from "@/component/table";
import { getCruitListByTeacher, applyTrain } from "@/api/train";
import moment from "moment";
import {autoAlert} from '@/util/public'
import { Search,  } from "@/component/common";
function Train(props, ref) {
  let {
    history,
    roleMsg: { schoolID, collegeID, selectLevel },
  } = props;
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState({
    keyword,
    schoolID,
    collegeID,
    selectLevel,
  });
  const [SearchValue, setSearchValue] = useState("");
  // 获取table组件的ref
  const tableRef = useRef({});
  const typeList = {
    0: {
      className: "table-time-bottom",
      title: "--",
      handleType: 0,
      handleTitle: "报名",
      handleClassName: "table-apply-btn-no",
    },
    1: {
      className: "table-time-bottom-can",
      title: "可报名",
      handleType: 1,
      handleTitle: "报名",
      handleClassName: "table-apply-btn-no",
      action: 1,
    },
    2: {
      className: "table-time-bottom-no",
      title: "",
      handleType: 0,
      handleTitle: "报名",
      handleClassName: "table-apply-btn-no",
    },
    3: {
      className: "table-time-bottom-will",
      title: "未开始",
      handleType: 0,
      handleTitle: "报名",
      handleClassName: "table-apply-btn-no",
    },
    4: {
      className: "table-time-bottom-end",
      title: "已截止",
      handleType: 0,
      handleTitle: "报名",
      handleClassName: "table-apply-btn-no",
    },
    5: {
      className: "table-time-bottom-done",
      title: "已报名",
      handleType: 2,
      handleTitle: "取消报名",
      handleClassName: "table-apply-btn",
      action: 0,
    },
  };

  const columns = useMemo(() => {
    // table 的宽度最小为1040，各个列的width按这个来算1040/1200*设计图的width
    // let widthRate = 1040 / 1200;
    return [
      {
        // title: "序号",
        dataIndex: "index",
        align: "center",
        width: 70,
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
        width: 345,
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
              {title ? title : "--"}
            </span>
          );
        },
      },
      {
        title: "发布单位",
        align: "center",
        width: 120,
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
        title: "报名时间",
        align: "center",
        width: 230,
        // dataIndex: "ApplyEndTime",
        render: (data) => {
          let {
            ApplyEndTime,
            ApplyBeginTime,
            HasApplied,
            ApplyFlag,
            ApplyStatus,
          } = data;
          //   ApplyStatus=5
          // "ApplyStatus":5,        //当前报名状态：1可报名，2人数达到上限，3未开始，4已结束，5已报名
          let type = typeList[ApplyStatus];
          // 是否有效
          let canApply = moment() < moment(ApplyEndTime);
          return (
            <span className="table-time" title={ApplyEndTime}>
              {ApplyStatus ? (
                <>
                  <span className="table-time-top">
                    {ApplyEndTime && ApplyBeginTime
                      ? ApplyEndTime + "~" + ApplyEndTime
                      : "--"}
                  </span>
                  {typeList[ApplyStatus].title ? (
                    <span
                      className={`table-time-bottom ${typeList[ApplyStatus].className}`}
                    >
                      {typeList[ApplyStatus].title}
                    </span>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                "--"
              )}
            </span>
          );
        },
      },
      {
        title: "报名人数/限额",
        align: "center",
        width: 137,
        // dataIndex: "publisher",
        render: (data) => {
          let { Limit, ApplyCount, ApplyFlag } = data;
          let title =
            (ApplyCount ? ApplyCount : 0) + "/" + (Limit ? Limit : "--");
          return (
            <span className="table-limit" title={title}>
              <span className="table-limit-count">
                {ApplyFlag ? title : "--"}
              </span>
              {ApplyFlag && ApplyCount && ApplyCount === Limit ? (
                <span className="table-limit-no">满员</span>
              ) : (
                ""
              )}
            </span>
          );
        },
      },
      {
        title: "培训方式",
        align: "center",
        width: 120,
        dataIndex: "ActivityFlag",
        render: (data) => {
          let ActivityList = [
            { value: 1, title: "线上" },
            { value: 0, title: "线下" },
          ];
          let title = ActivityList[parseInt(data)]
            ? ActivityList[parseInt(data)].title
            : "--";
          return (
            <span
              className={`table-activity table-activity-${data}`}
              title={title}
            >
              {title}
            </span>
          );
        },
      },
      {
        title: "操作",
        align: "center",
        width: 130,

        // dataIndex: "time",
        render: (data) => {
          let { ApplyStatus, ApplyFlag } = data;
          let type = typeList[ApplyStatus];
        //   console.log(type, typeList, ApplyStatus, data);
          return (
            <span className="table-handle">
              {type.handleType ? (
                <span
                  className={`table-apply-btn ${type.handleClassName}`}
                  onClick={() => {
                    //   history.push("/editTrain/" + data.TID);
                    ApplyTrain({ TID: data.TID, Action: type.action }, () => {
                      autoAlert({
                        title: type.handleTitle + "成功",
                        type: "warn",
                        autoHide:true
                        // cancelShow: true,
                      });
                      tableRef.current.reloadList()
                    });

                  }}
                >
                  {type.handleTitle}
                </span>
              ) : (
                "--"
              )}
            </span>
          );
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 报名
  const ApplyTrain = useCallback(
    (param, success = () => {}, error = () => {}) => {
      applyTrain(param).then((res) => {
        if (res.result) {
          success();
        } else {
          error();
        }
      });
    },
    []
  );
  
  return (
    <div className="frame-type-route teacher-train">
      <div className="tt-handle-top">
        <Search
          width={264}
          placeHolder={"请输入关键词进行搜索..."}
          className="tht-search"
          Value={SearchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onClickSearch={(e) => {
            setKeyword(e.value);
            setQuery({ schoolID, collegeID, keyword: e.value, selectLevel });
          }}
          onCancelSearch={(e) => {
            setSearchValue("");
            setKeyword("");
          }}
        ></Search>
      </div>
      {/* <input placeholder></input> */}
      <Table
        className="tt-table"
        columns={columns}
        // dataSource={data}
        prepare={!!query.selectLevel}
        query={query}
        onDataChange={(data) => {}}
        ref={tableRef}
        api={getCruitListByTeacher}
      ></Table>
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    handleData: { teacherRecruitMsg },
    commonData: { roleMsg },
  } = state;
  return { teacherRecruitMsg, roleMsg };
};
export default connect(mapStateToProps)(withRouter(memo(forwardRef(Train))));
