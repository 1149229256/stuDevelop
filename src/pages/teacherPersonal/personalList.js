import {
  connect,
  // useSelector,
  //   useDispatch,
} from "react-redux";
import React, {
  // useCallback,
  memo,
  useEffect,
  useState,
  useReducer,
  useMemo,
  // useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import { Dropdown, Search } from "../../component/common";
import Table from "../../component/table";
import { getTeacherList, getNode } from "../../api/personal";
// import { handleRoute } from "../../util/public";
import { withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
//   import { Reducer, Context, initState } from "./reducer";
function PersonalList(props, ref) {
  let {
    location,
    history,
    roleMsg: { productLevel, schoolID, collegeID },
    levelHash,
    contentHW: { height },
  } = props;
  const [SearchValue, setSearchValue] = useState("");
  // 获取当前级别的信息
  const levelMsg = useMemo(() => {
    return levelHash[productLevel]
      ? levelHash[productLevel]
      : {
          productLevel: 1,
          selectLevel: 1,
          title: "",
          sub: "",
          belong: "",
          belondName: "",
        };
  }, [levelHash, productLevel]);
  // 学校node
  const [SchoolList, setSchoolList] = useState([
    { value: "", title: "全部学校" },
  ]);
  // 第一node
  const [FirstNodeList, setFirstNodeList] = useState([
    { value: "", title: "全部" + levelMsg.sub },
  ]);
  // 第二node,只有大学学校级别才有才有
  const [SecondNodeList, setSecondNodeList] = useState([
    { value: "", title: "全部教研室" },
  ]);
  // 保存第二级所有节点
  const [SecondNodeObj, setSecondNodeObj] = useState({});
  // 下拉选择
  const [firstSelect, setFirstSelect] = useState("");
  const [secondSelect, setSecondSelect] = useState("");
  const [query, setQuery] = useState({
    keyword: "",
    schoolID: productLevel === 1 ? "" : schoolID,
    nodeID: "",
    nodeType: "",
  });

  // 初始化列表
  useEffect(() => {
    // 非教育局，使用node
    if (productLevel !== 1) {
      getNode({ collegeID, schoolID }).then((res) => {
        if (res.StatusCode === 200) {
          console.log(res)
          setFirstNodeList([
            { value: "", title: "全部" + levelMsg.sub },
            ...res.data[0],
          ]);
          setSecondNodeObj(res.data[1]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productLevel]);
  // 获取table组件的ref
  const tableRef = useRef({});

  const columns = useMemo(() => {
    let widthRate = 1040 / 1200;
    return [
      {
        title: "教师姓名",
        // dataIndex: "index",
        key: "UserName",
        align: "left",
        width: 190 * widthRate,
        sorter: true,
        render: (data) => {
          let { UserName, PhotoPath } = data;
          return (
            <span className="table-name" title={UserName}>
              <i
                style={{
                  background: `url(${PhotoPath})no-repeat center 0/24px`,
                }}
              ></i>
              {UserName ? UserName : "--"}
            </span>
          );
        },
      },
      {
        title: "工号",
        width: 150 * widthRate,
        sorter: true,
        key: "UserID",
        align: "center",
        dataIndex: "UserID",
        render: (data) => {
          return (
            <span className="table-userid" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: levelMsg.belongBefore + levelMsg.belong,
        sorter: true,
        align: "center",
        key: levelMsg.belondName,

        width: 150 * widthRate,
        // dataIndex: "source",
        render: (data) => {
          let name = data[levelMsg.belondName];
          return (
            <span className="table-belondName" title={name}>
              {name ? name : "--"}
            </span>
          );
        },
      },

      {
        title: "性别",
        sorter: true,
        align: "center",
        key: "Gender",

        width: 95 * widthRate,
        dataIndex: "Gender",
        render: (data) => {
          return (
            <span className="table-Gender" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: "教龄",
        sorter: true,
        key: "TeachAge",
        align: "center",
        width: 95 * widthRate,
        dataIndex: "TeachAge",
        render: (data) => {
          return (
            <span className="table-TeachAge" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },

      {
        title: "政治面貌",
        sorter: true,
        key: "PoliticsCode",
        align: "center",
        width: 120 * widthRate,
        dataIndex: "Politics",
        render: (data) => {
          return (
            <span className="table-Politics" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: "教师职称",
        sorter: true,
        key: "TitleCode",
        align: "center",
        width: 120 * widthRate,
        dataIndex: "TitleName",
        render: (data) => {
          return (
            <span className="table-TitleName" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: "荣誉称号",
        align: "center",
        width: 140 * widthRate,
        dataIndex: "HonorNames",
        render: (data) => {
          return (
            <span className="table-HonorNames" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: "查看画像",
        align: "center",
        width: 140 * widthRate,

        // dataIndex: "time",
        render: (data) => {
          return (
            <span className="table-handle">
              <span
                className=" btn-check"
                onClick={() => {
                  // history.push("/personalDetail/" + data.UserID);
                  window.open(
                    window.location.search +
                      "#/page/personalDetail/" +
                      data.UserID
                  );
                }}
              ></span>
            </span>
          );
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelMsg]);
  return (
    <div className="PersonalList" style={{ height: height }}>
      <div className="pl-top">
        <div className="plt-select">
          {productLevel === 1 ? (
            <Dropdown
              width={150}
              height={240}
              dropList={SchoolList}
              title={"学校"}
              value={query.schoolID}
              className="school-dropdown"
              onChange={(e) => {}}
              onSelect={(e, option) => {
                setQuery({ ...query, schoolID: e });
              }}
            ></Dropdown>
          ) : (
            ""
          )}
          {productLevel !== 1 ? (
            <>
              <Dropdown
                width={150}
                height={240}
                dropList={FirstNodeList}
                title={productLevel === 3 ? "学科" : "教研室"}
                value={firstSelect}
                className="first-dropdown"
                onChange={(e) => {}}
                onSelect={(e, option) => {
                  setQuery({ ...query, nodeID: e, nodeType: option.nodeType });
                  setFirstSelect(e);
                  console.log(SecondNodeObj[e],e,SecondNodeObj)
                  setSecondNodeList(
                    SecondNodeObj[e]
                      ? SecondNodeObj[e]
                      : [{ value: "", title: "全部教研室" }]
                  );
                }}
              ></Dropdown>
              {productLevel === 2 ? (
                <Dropdown
                  width={150}
                  height={240}
                  disabled={firstSelect === ""}
                  dropList={SecondNodeList}
                  value={secondSelect}
                  className="second-dropdown"
                  onChange={(e) => {}}
                  onSelect={(e, option) => {
                    setQuery({
                      ...query,
                      nodeID: e,
                      nodeType: option.nodeType,
                    });
                    setSecondSelect(e);
                  }}
                ></Dropdown>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="plt-search">
          <Search
            className="home-search"
            Value={SearchValue}
            placeHolder={"输入教师姓名/工号搜索"}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onClickSearch={(e) => {
              setQuery({ ...query, keyword: SearchValue });
            }}
            onCancelSearch={(e) => {
              setSearchValue("");
              setQuery({ ...query, keyword: "" });
            }}
          ></Search>
        </div>
      </div>

      <div className="pl-table">
        <Scrollbars>
          <Table
            className="Reacruit-table"
            columns={columns}
            // dataSource={data}
            // prepare={!!query.selectLevel}
            query={query}
            onDataChange={(data) => {}}
            ref={tableRef}
            api={getTeacherList}
          ></Table>
        </Scrollbars>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: { roleMsg, levelHash, contentHW },
  } = state;
  return { roleMsg, levelHash, contentHW };
};
export default connect(mapStateToProps)(
  withRouter(memo(forwardRef(PersonalList)))
);
