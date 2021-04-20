/*
 * ......................................&&.........................
 * ....................................&&&..........................
 * .................................&&&&............................
 * ...............................&&&&..............................
 * .............................&&&&&&..............................
 * ...........................&&&&&&....&&&..&&&&&&&&&&&&&&&........
 * ..................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&..............
 * ................&...&&&&&&&&&&&&&&&&&&&&&&&&&&&&.................
 * .......................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.........
 * ...................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...............
 * ..................&&&   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&............
 * ...............&&&&&@  &&&&&&&&&&..&&&&&&&&&&&&&&&&&&&...........
 * ..............&&&&&&&&&&&&&&&.&&....&&&&&&&&&&&&&..&&&&&.........
 * ..........&&&&&&&&&&&&&&&&&&...&.....&&&&&&&&&&&&&...&&&&........
 * ........&&&&&&&&&&&&&&&&&&&.........&&&&&&&&&&&&&&&....&&&.......
 * .......&&&&&&&&.....................&&&&&&&&&&&&&&&&.....&&......
 * ........&&&&&.....................&&&&&&&&&&&&&&&&&&.............
 * ..........&...................&&&&&&&&&&&&&&&&&&&&&&&............
 * ................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&............
 * ..................&&&&&&&&&&&&&&&&&&&&&&&&&&&&..&&&&&............
 * ..............&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&....&&&&&............
 * ...........&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&......&&&&............
 * .........&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.........&&&&............
 * .......&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...........&&&&............
 * ......&&&&&&&&&&&&&&&&&&&...&&&&&&...............&&&.............
 * .....&&&&&&&&&&&&&&&&............................&&..............
 * ....&&&&&&&&&&&&&&&.................&&...........................
 * ...&&&&&&&&&&&&&&&.....................&&&&......................
 * ...&&&&&&&&&&.&&&........................&&&&&...................
 * ..&&&&&&&&&&&..&&..........................&&&&&&&...............
 * ..&&&&&&&&&&&&...&............&&&.....&&&&...&&&&&&&.............
 * ..&&&&&&&&&&&&&.................&&&.....&&&&&&&&&&&&&&...........
 * ..&&&&&&&&&&&&&&&&..............&&&&&&&&&&&&&&&&&&&&&&&&.........
 * ..&&.&&&&&&&&&&&&&&&&&.........&&&&&&&&&&&&&&&&&&&&&&&&&&&.......
 * ...&&..&&&&&&&&&&&&.........&&&&&&&&&&&&&&&&...&&&&&&&&&&&&......
 * ....&..&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...........&&&&&&&&.....
 * .......&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&..............&&&&&&&....
 * .......&&&&&.&&&&&&&&&&&&&&&&&&..&&&&&&&&...&..........&&&&&&....
 * ........&&&.....&&&&&&&&&&&&&.....&&&&&&&&&&...........&..&&&&...
 * .......&&&........&&&.&&&&&&&&&.....&&&&&.................&&&&...
 * .......&&&...............&&&&&&&.......&&&&&&&&............&&&...
 * ........&&...................&&&&&&.........................&&&..
 * .........&.....................&&&&........................&&....
 * ...............................&&&.......................&&......
 * ................................&&......................&&.......
 * .................................&&..............................
 * ..................................&..............................
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-12-22 15:22:09
 * @LastEditTime: 2020-12-22 21:57:20
 * @Description: 教师画像列表
 * @FilePath: \teacher-development\src\pages\teacherPersonal\personalList.js
 */

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
  useLayoutEffect,
  useMemo,
  // useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import {
  Dropdown,
  Search,
  CheckBox,
  CheckBoxGroup,
} from "../../component/common";
import Table from "../../component/table";
import { getSchoolList } from "../../api/school";
// import { handleRoute } from "../../util/public";
import { withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Tooltip } from "antd";
import { handleRoute, correctNumber, transTime } from "../../util/public";

//   import { Reducer, Context, initState } from "./reducer";
function SchoolList(props, ref) {
  let {
    location,
    history,
    roleMsg: { productLevel, schoolID, collegeID },
    levelHash,
    levelMsg,
    termInfo: { TermInfo, HasHistory },
    contentHW: { height },
  } = props;
  const [SearchValue, setSearchValue] = useState("");
  // 获取当前级别的信息
  // const levelMsg = useMemo(() => {
  //   return levelHash[productLevel]
  //     ? levelHash[productLevel]
  //     : {
  //         productLevel: 1,
  //         selectLevel: 1,
  //         title: "",
  //         sub: "",
  //         belong: "",
  //         belondName: "",
  //       };
  // }, [levelHash, productLevel]);
  // 列筛选裂变
  const [Culomns] = useState([
    { value: 0, title: levelMsg.belong + "基础信息", canControl: false },
    { value: 1, title: "教师人数/师生比", canControl: true },
    { value: 2, title: "年龄/教龄统计", canControl: true },
    { value: 3, title: "学历统计", canControl: true },
    { value: 4, title: "职称统计", canControl: true },
    { value: 5, title: "课时统计", canControl: true },
    { value: 6, title: "行政班数量", canControl: true },
    { value: 7, title: "班主任数量", canControl: true },
    { value: 8, title: "电子资源上传统计", canControl: true },
    { value: 9, title: "电子教案制作统计", canControl: true },
    { value: 10, title: "精品课程制作统计", canControl: true },
    { value: 11, title: "电子督课平均估值分", canControl: true },
    { value: 12, title: "教研课题统计", canControl: true },
    { value: 13, title: "教研活动统计", canControl: true },
    { value: 14, title: "上机信息统计", canControl: true },
  ]);
  const [ListFirst, setListFirst] = useState(true);
  const [LoadTool, setLoad] = useState(false);
  // const [ToolClassName] = useState("more-content" + new Date().getTime());

  // 列选择
  const [CulomnsSelect, setCulomnsSelect] = useState([0, 1, 2, 3]);

  const [query, setQuery] = useState({
    // keyword: "",
    term: "",
    // type: "",
    keyword: "",
    schoolID: productLevel === 1 ? "" : schoolID,
    // nodeID: "",
    // nodeType: "",
  });
  // 设置显示的boolean
  const [visible, setVisible] = useState(false);
  const searchRef = useRef(null);
  const toolTipRef = useRef(null);
  // 学期
  const TermList = useMemo(() => {
    let data = [];
    if (TermInfo instanceof Array) {
      data = TermInfo.map((child) => ({
        value: child.Term,
        title: child.TermName,
      }));
      setQuery({ ...query, term: data[0].value });
      // setFirstSelect(data[0].value);
    }
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TermInfo]);
  // // 初始化列表
  // useEffect(() => {
  //   // 非教育局，使用node
  //   if (productLevel !== 1) {
  //     getNode({ collegeID, schoolID }).then((res) => {
  //       setFirstNodeList([
  //         { value: "", title: "全部" + levelMsg.sub },
  //         ...res.data[0],
  //       ]);
  //       setSecondNodeObj(res.data[1]);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [productLevel]);
  // 获取table组件的ref
  const tableRef = useRef({});

  const columns = useMemo(() => {
    let haveCollege = productLevel === 2; //大学
    let widthRate = 1; //1040 / 1200
    let EndCulomns = [];
    let culomnsData = [
      {
        title: "序号",
        width: 68 * widthRate,
        key: "index",
        // colSpan: 2,
        align: "center",
        dataIndex: "index",
        render: (data) => {
          return (
            <span className="table-index" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: levelMsg.belong + "名称",
        width: 124 * widthRate,
        // sorter: true,
        key: "SchoolName",
        align: "center",
        // dataIndex: "SchoolName",
        render: (data) => {
          let { NodeName, NodeID } = data;
          return (
            <span
              onClick={() => {
                history.push("/schoolDetail/" + NodeID);
              }}
              className="table-SchoolName"
              title={NodeName}
            >
              {NodeName ? NodeName : "--"}
            </span>
          );
        },
      },
      {
        title: levelMsg.belong + "学段",
        width: 124 * widthRate,
        // sorter: true,
        // colSpan:productLevel===1?1:0,//为大学时不渲染
        key: "Level",
        align: "center",
        dataIndex: "Level",
        render: (data) => {
          return (
            <span className="table-limit" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: "教师人数及师生比统计",
        className: "two-col",
        children: [
          {
            title: "教师人数",
            // sorter: true,
            align: "center",
            key: "TeacherCount",
            className: "two-col-bottom",

            width: 98 * widthRate,
            // dataIndex: "BenkePercent",
            render: (data) => {
              let { TeacherCount } = data;
              return (
                <span className="table-count" title={TeacherCount}>
                  {TeacherCount ? TeacherCount + "人" : "--"}
                </span>
              );
            },
          },
          {
            title: "男性人数",
            // sorter: true,
            align: "center",
            key: "MaleCount",
            className: "two-col-bottom",

            width: 82 * widthRate,
            dataIndex: "MaleCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data + "人" : "--"}
                </span>
              );
            },
          },
          {
            title: "女性人数",
            // sorter: true,
            align: "center",
            key: "FemaleCount",
            className: "two-col-bottom",

            width: 82 * widthRate,
            dataIndex: "FemaleCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data + "人" : "--"}
                </span>
              );
            },
          },
        ].concat(
          !haveCollege //大学是没有的
            ? [
                {
                  title: "师生比例",
                  // sorter: true,
                  align: "center",
                  key: "TeaStuRatio",
                  className: "two-col-bottom",

                  width: 98 * widthRate,
                  dataIndex: "TeaStuRatio",
                  render: (data) => {
                    return (
                      <span className="table-count" title={data}>
                        {data ? data : "--"}
                      </span>
                    );
                  },
                },
              ]
            : []
        ),
      },
      {
        title: "年龄/教龄统计",
        className: "two-col",
        children: [
          {
            title: "平均年龄",
            // sorter: true,
            align: "center",
            key: "AgeAvg",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "AgeAvg",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data + "岁" : "--"}
                </span>
              );
            },
          },
          {
            title: "平均教龄",
            // sorter: true,
            align: "center",
            key: "TeachAgeAvg",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "TeachAgeAvg",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data + "年" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "学历统计",
        className: "two-col",
        children: [
          {
            title: "本科率",
            // sorter: true,
            align: "center",
            key: "BenkePercent",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "BenkePercent",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "博士研究生及以上",
            // sorter: true,
            align: "center",
            key: "edu0",
            className: "two-col-bottom",

            width: 146 * widthRate,
            dataIndex: "EduUserCount",
            render: (data) => {
              let Data = data[0] || {
                NodeID: "edu0",
                NodeName: "博士研究生及以上",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "人" : "--"}
                </span>
              );
            },
          },
          {
            title: "硕士研究生",
            // sorter: true,
            align: "center",
            key: "edu1",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "EduUserCount",
            render: (data) => {
              let Data = data[1] || {
                NodeID: "edu1",
                NodeName: "硕士研究生",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "人" : "--"}
                </span>
              );
            },
          },
          {
            title: "本科",
            // sorter: true,
            align: "center",
            key: "edu2",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "EduUserCount",
            render: (data) => {
              let Data = data[1] || {
                NodeID: "edu2",
                NodeName: "本科",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "人" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "职称统计",
        className: "two-col",
        children: [
          {
            title: "中级职称人数比例",
            // sorter: true,
            align: "center",
            key: "MiddleTitlePercent",
            className: "two-col-bottom",

            width: 160 * widthRate,
            dataIndex: "MiddleTitlePercent",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: haveCollege ? "教授" : "正高级教师",
            // sorter: true,
            align: "center",
            key: "title0",
            className: "two-col-bottom",

            width: (haveCollege ? 82 : 98) * widthRate,
            dataIndex: "TitleUserCount",
            render: (data) => {
              let Data = data[0] || {
                NodeID: "title0",
                NodeName: "教授",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "人" : "--"}
                </span>
              );
            },
          },
          {
            title: haveCollege ? "副教授" : "高级教师",
            // sorter: true,
            align: "center",
            key: "title1",
            className: "two-col-bottom",

            width: 82 * widthRate,
            dataIndex: "TitleUserCount",
            render: (data) => {
              let Data = data[0] || {
                NodeID: "title1",
                NodeName: "副教授",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "人" : "--"}
                </span>
              );
            },
          },
          {
            title: haveCollege ? "讲师" : "一级教师",
            // sorter: true,
            align: "center",
            key: "title2",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "TitleUserCount",
            render: (data) => {
              let Data = data[0] || {
                NodeID: "title2",
                NodeName: "讲师",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "人" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "课时统计",
        className: "two-col",
        children: [
          {
            title: "人均周课时",
            // sorter: true,
            align: "center",
            key: "WeekAvgCH",
            className: "two-col-bottom",

            width: 112 * widthRate,
            dataIndex: "WeekAvgCH",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "人均学期总课时",
            // sorter: true,
            align: "center",
            key: "TermAvgCH",
            className: "two-col-bottom",

            width: 146 * widthRate,
            dataIndex: "TermAvgCH",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "行政班数量",
        // className: "two-col",
        // sorter: true,
        align: "center",
        key: "ClassCount",
        className: "two-col-center-border",

        width: 130 * widthRate,
        dataIndex: "ClassCount",
        render: (data) => {
          return (
            <span className="table-count" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: "班主任数量",
        // className: "two-col",
        // sorter: true,
        align: "center",
        key: "GangerCount",
        className: "two-col-center-border",

        width: 130 * widthRate,
        dataIndex: "GangerCount",
        render: (data) => {
          return (
            <span className="table-count" title={data}>
              {data ? data : "--"}
            </span>
          );
        },
      },
      {
        title: "电子资源上传统计",
        className: "two-col",
        children: [
          {
            title: "总上传数量",
            // sorter: true,
            align: "center",
            key: "ER_ResourceCount",
            className: "two-col-bottom",

            width: 112 * widthRate,
            dataIndex: "ER_ResourceCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "人均上传数量",
            // sorter: true,
            align: "center",
            key: "ER_AvgUploadResourceCount",
            className: "two-col-bottom",

            width: 112 * widthRate,
            dataIndex: "ER_AvgUploadResourceCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? correctNumber(data) : "--"}
                </span>
              );
            },
          },
          {
            title: "电子资源上传参与率",
            // sorter: true,
            align: "center",
            key: "ER_UploadedPercent",
            className: "two-col-bottom",

            width: 160 * widthRate,
            dataIndex: "ER_UploadedPercent",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? correctNumber(data) * 100 + "%" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "电子教案制作统计",
        className: "two-col",
        children: [
          {
            title: "总制作量",
            // sorter: true,
            align: "center",
            key: "TP_TPCount",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "TP_TPCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "人均制作数量",
            // sorter: true,
            align: "center",
            key: "TP_AvgUploadTPCount",
            className: "two-col-bottom",

            width: 112 * widthRate,
            dataIndex: "TP_AvgUploadTPCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "电子教案制作参与率",
            // sorter: true,
            align: "center",
            key: "TP_UploadedPercent",
            className: "two-col-bottom",

            width: 160 * widthRate,
            dataIndex: "TP_UploadedPercent",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? correctNumber(data) * 100 + "%" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "精品课程制作统计",
        className: "two-col",
        children: [
          {
            title: "精品课程数量",
            // sorter: true,
            align: "center",
            key: "EXC_ECCount",
            className: "two-col-bottom",

            width: 112 * widthRate,
            dataIndex: "EXC_ECCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "人均拥有数量",
            // sorter: true,
            align: "center",
            key: "EXC_AvgCount",
            className: "two-col-bottom",

            width: 112 * widthRate,
            dataIndex: "EXC_AvgCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? correctNumber(data) : "--"}
                </span>
              );
            },
          },
          {
            title: "拥有精品课程人数比例",
            // sorter: true,
            align: "center",
            key: "EXC_HasECPercent",
            className: "two-col-bottom",

            width: 178 * widthRate,
            dataIndex: "EXC_HasECPercent",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? correctNumber(data) * 100 + "%" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "电子督课平均估值分",
        // className: "two-col",
        // sorter: true,
        align: "center",
        key: "EVC_AvgScore",
        className: "two-col-center-border",

        width: 178 * widthRate,
        dataIndex: "EVC_AvgScore",
        render: (data) => {
          return (
            <span className="table-count" title={data}>
              {data ? correctNumber(data) : "--"}
            </span>
          );
        },
      },
      {
        title: "教研课题统计",
        className: "two-col",
        children: [
          {
            title: "教研课题数量",
            // sorter: true,
            align: "center",
            key: "RP_ProjectCount",
            className: "two-col-bottom",

            width: 130 * widthRate,
            dataIndex: "RP_ProjectCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "人均参与次数",
            // sorter: true,
            align: "center",
            key: "RP_AvgJoinCount",
            className: "two-col-bottom",

            width: 112 * widthRate,
            dataIndex: "RP_AvgJoinCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? correctNumber(data) : "--"}
                </span>
              );
            },
          },
          {
            title: "成果数量",
            // sorter: true,
            align: "center",
            key: "RP_CompletedCount",
            className: "two-col-bottom",

            width: 82 * widthRate,
            dataIndex: "RP_CompletedCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "教研课题参与率",
            // sorter: true,
            align: "center",
            key: "RP_HasJoinPercent",
            className: "two-col-bottom",

            width: 146 * widthRate,
            dataIndex: "RP_HasJoinPercent",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data === 0 || data ? correctNumber(data) * 100 + "%" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "教研活动统计",
        className: "two-col",
        children: [
          {
            title: "教研活动数量",
            // sorter: true,
            align: "center",
            key: "RA_ActivityCount",
            className: "two-col-bottom",

            width: 130 * widthRate,
            dataIndex: "RA_ActivityCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "人均参与次数",
            // sorter: true,
            align: "center",
            key: "RA_AvgJoinCount",
            className: "two-col-bottom",

            width: 112 * widthRate,
            dataIndex: "RA_AvgJoinCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data : "--"}
                </span>
              );
            },
          },
          {
            title: "教研活动参与率",
            // sorter: true,
            align: "center",
            key: "RA_HasJoinPercent",
            className: "two-col-bottom",

            width: 146 * widthRate,
            dataIndex: "RA_HasJoinPercent",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data === 0 || data ? correctNumber(data) * 100 + "%" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "上机信息统计",
        className: "two-col",
        children: [
          {
            title: "每人每日平均上机时长",
            // sorter: true,
            align: "center",
            key: "LI_DayAvgTimeSpan",
            className: "two-col-bottom",

            width: 178 * widthRate,
            dataIndex: "LI_DayAvgTimeSpan",
            render: (data) => {
              // data = 120
              let time = Number(data)
              let title = "";
              if ( time < 1) {
                title = "小于一分钟";
              } else if ( time < 60) {
                title =  time + "分钟";
              } else if ( time >= 60) {
                let minute = ( time % 60) ;
                title =
                  ( time / 60).toFixed() +
                  "小时" +
                  (minute > 0 ? minute.toFixed() + "分钟" : "");
              }
              return (
                <span className="table-count" title={title}>
                  {title ? title : "--"}
                </span>
              );
            },
          },

          {
            title: "均每日上机百分比",
            // sorter: true,
            align: "center",
            key: "LI_DayAvgOnlinePercent",
            className: "two-col-bottom",

            width: 146 * widthRate,
            dataIndex: "LI_DayAvgOnlinePercent",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? correctNumber(data) * 100 + "%" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: (
          <TableTip
            CulomnsSelect={CulomnsSelect}
            onCheckChange={(e) => {
              setCulomnsSelect(
                e.sort((a, b) => {
                  return a > b;
                })
              );
            }}
            // ToolClassName={ToolClassName}
            Culomns={Culomns}
          ></TableTip>
        ),
        align: "center",
        width: 60 * widthRate,
        fixed: "right",
        className: "two-col-center-border",

        // dataIndex: "time",
        render: (data) => {
          return <span className="table-columns"></span>;
        },
      },
    ];
    EndCulomns = EndCulomns.concat(
      culomnsData.slice(0, productLevel === 1 ? 3 : 2)
    ); //大学不要学段
    // CulomnsSelect.forEach((child, index) => {
    //   // 因为前面三个必选，同时不能用children，所以每个加2
    //   if (child !== 0 && culomnsData[child + 2]) {
    //     EndCulomns.push(culomnsData[child + 2]);
    //   }
    // });
    culomnsData.forEach((child, index) => {
      // 前三和最后的都不可控
      if (index >= 3 && index !== culomnsData.length - 1) {
        // value 是从0开始的，0是学校基础信息，不能取消，所以要为1以后，
        // index要3（包括3，index是0开始的）以后才是可选的
        if (
          CulomnsSelect.some((a) => {
            return a + 2 === index;
          })
        ) {
          EndCulomns.push(child);
        } else {
          //隐藏，改宽度
          child.title = "";
          child.width = 0;
          child.sorter = false;
          if (child.children) {
            child.children = child.children.map((c, i) => {
              c.title = "";
              c.width = 0;
              c.sorter = false;
              c.render = () => {
                return "";
              };
              return c;
            });
          } else {
            child.render = () => {
              return "";
            };
          }
          EndCulomns.push(child);
        }
      }
    });
    EndCulomns.push(culomnsData[culomnsData.length - 1]); //控制列
    return EndCulomns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelMsg, CulomnsSelect, visible]);

  // 监听列表，进来就更新，除了第一次
  useEffect(() => {
    if (!ListFirst) {
      let Path = handleRoute(location.pathname);

      if (Path[0] === "schoolResource") {
        tableRef.current.reloadList();
      }
    }

    ListFirst && setListFirst(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  //   useLayoutEffect(() => {
  //     // let dom = searchRef.current;
  //     // 点击iframe
  //     // 对点击不同节点来控制显示隐藏
  //     const fn = (node) => {
  //       let isOut = false;
  //       let dom = searchRef.current;
  //       let tool = toolTipRef.current;
  //       if (!dom.contains(node.target)&&(!tool||!tool.popupRef.current||tool.popupRef.current.getElement().contains(node.target))) {
  //         //判断是否包含点击的节点
  //         isOut = true;
  //       } else {
  //         isOut = false;
  //       }
  // console.log(!tool||!tool.popupRef.current||tool.popupRef.current.getElement() ,node.target)
  //       //点击的位置不在搜索框和搜索内容显示区
  //       setVisible(!isOut);
  //     };
  //     document.addEventListener("click", fn);
  //     return () => {
  //       document.removeEventListener("click", fn);
  //     };
  //   }, [searchRef, LoadTool]);
  return (
    <div className="SchoolList" style={{ height: height }}>
      <div className="pl-top">
        <div className="plt-select">
          {TermList.length > 0 && (
            <Dropdown
              width={150}
              height={240}
              dropList={TermList}
              title={"所统计学期"}
              value={query.term}
              className="school-dropdown"
              onChange={(e) => {}}
              onSelect={(e, option) => {
                setQuery({ ...query, term: e });
              }}
            ></Dropdown>
          )}
          {productLevel === 1 && (
            <Dropdown
              width={150}
              height={240}
              dropList={TermList}
              title={"学段类型"}
              value={query.term}
              className="school-dropdown"
              onChange={(e) => {}}
              onSelect={(e, option) => {
                setQuery({ ...query, term: e });
              }}
            ></Dropdown>
          )}
        </div>
        <div className="plt-search">
          <Search
            className="home-search"
            Value={SearchValue}
            placeHolder={"输入" + levelMsg.belong + "名称搜索"}
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
            // onHeaderRow={(c, i) => {
            //   console.log(c, i);
            // }}
            scroll={{ x: "max-content" }}
            className="Reacruit-table"
            columns={columns}
            // dataSource={data}
            // prepare={!!query.selectLevel}
            query={query}
            onDataChange={(data) => {}}
            ref={tableRef}
            api={getSchoolList}
          ></Table>
        </Scrollbars>
      </div>
    </div>
  );
}
function TableTip(props, ref) {
  let { CulomnsSelect, onCheckChange, Culomns } = props;
  // 设置显示的boolean
  const [visible, setVisible] = useState(false);
  // const [ToolClassName] = useState('more-content'+new Date().getTime())
  const searchRef = useRef(null);
  const toolTipRef = useRef(null);
  useLayoutEffect(() => {
    // let dom = searchRef.current;
    // 点击iframe
    // 对点击不同节点来控制显示隐藏
    const fn = (node) => {
      let isOut = false;
      let dom = searchRef.current;
      let tool = toolTipRef.current;
      // console.log(document.getElementById(ToolClassName));
      if (
        !dom.contains(node.target) &&
        (!tool || !tool.contains(node.target))
      ) {
        //判断是否包含点击的节点
        isOut = true;
      } else {
        isOut = false;
      }
      // console.log(searchRef, toolTipRef);
      //点击的位置不在搜索框和搜索内容显示区
      setVisible(!isOut);
    };
    document.addEventListener("click", fn);
    return () => {
      document.removeEventListener("click", fn);
    };
  }, []);
  // console.log(ToolClassName);
  return (
    <div className="open-columns">
      <Tooltip
        overlayClassName={`lg-table-more-tooltip`}
        // getPopupContainer={(e) => e}
        // placement={"bottomRight"}
        destroyTooltipOnHide={false}
        color={"#fff"}
        align={{
          points: ["tr", "br"], // align top left point of sourceNode with top right point of targetNode
          offset: [20, 10], // the offset sourceNode by 10px in x and 20px in y,
          // targetOffset: ["30%", "40%"], // the offset targetNode by 30% of targetNode width in x and 40% of targetNode height in y,
          overflow: { adjustX: true, adjustY: true }, // auto adjust position when sourceNode is overflowed
        }}
        // trigger={["click"]}
        visible={visible}
        title={
          <div ref={toolTipRef} className={`more-content `}>
            <p className="more-title">列筛选</p>
            <CheckBoxGroup
              value={CulomnsSelect}
              onChange={(e) => {
                onCheckChange(e);
                // setCulomnsSelect(
                //   e.sort((a, b) => {
                //     return a > b;
                //   })
                // );
              }}
            >
              <div className="more-map">
                <Scrollbars>
                  {Culomns.map((child, index) => {
                    return (
                      <div key={index} className="c-select-bar">
                        <CheckBox
                          value={child.value}
                          disabled={
                            child.canControl === undefined || !child.canControl
                          }
                        >
                          {child.title}
                        </CheckBox>
                      </div>
                    );
                  })}
                </Scrollbars>
              </div>{" "}
            </CheckBoxGroup>
          </div>
        }
      >
        <i
          onClick={() => {
            setVisible(true);
          }}
          ref={searchRef}
        ></i>
      </Tooltip>
    </div>
  );
}
const mapStateToProps = (state) => {
  let {
    commonData: { roleMsg, levelHash, contentHW, termInfo },
  } = state;
  return { roleMsg, levelHash, contentHW, termInfo };
};
export default connect(mapStateToProps)(
  withRouter(memo(forwardRef(SchoolList)))
);
