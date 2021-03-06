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
 * @Description: ??????????????????
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
  // ???????????????????????????
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
  // ???????????????
  const [Culomns] = useState([
    { value: 0, title: levelMsg.belong + "????????????", canControl: false },
    { value: 1, title: "????????????/?????????", canControl: true },
    { value: 2, title: "??????/????????????", canControl: true },
    { value: 3, title: "????????????", canControl: true },
    { value: 4, title: "????????????", canControl: true },
    { value: 5, title: "????????????", canControl: true },
    { value: 6, title: "???????????????", canControl: true },
    { value: 7, title: "???????????????", canControl: true },
    { value: 8, title: "????????????????????????", canControl: true },
    { value: 9, title: "????????????????????????", canControl: true },
    { value: 10, title: "????????????????????????", canControl: true },
    { value: 11, title: "???????????????????????????", canControl: true },
    { value: 12, title: "??????????????????", canControl: true },
    { value: 13, title: "??????????????????", canControl: true },
    { value: 14, title: "??????????????????", canControl: true },
  ]);
  const [ListFirst, setListFirst] = useState(true);
  const [LoadTool, setLoad] = useState(false);
  // const [ToolClassName] = useState("more-content" + new Date().getTime());

  // ?????????
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
  // ???????????????boolean
  const [visible, setVisible] = useState(false);
  const searchRef = useRef(null);
  const toolTipRef = useRef(null);
  // ??????
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
  // // ???????????????
  // useEffect(() => {
  //   // ?????????????????????node
  //   if (productLevel !== 1) {
  //     getNode({ collegeID, schoolID }).then((res) => {
  //       setFirstNodeList([
  //         { value: "", title: "??????" + levelMsg.sub },
  //         ...res.data[0],
  //       ]);
  //       setSecondNodeObj(res.data[1]);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [productLevel]);
  // ??????table?????????ref
  const tableRef = useRef({});

  const columns = useMemo(() => {
    let haveCollege = productLevel === 2; //??????
    let widthRate = 1; //1040 / 1200
    let EndCulomns = [];
    let culomnsData = [
      {
        title: "??????",
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
        title: levelMsg.belong + "??????",
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
        title: levelMsg.belong + "??????",
        width: 124 * widthRate,
        // sorter: true,
        // colSpan:productLevel===1?1:0,//?????????????????????
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
        title: "??????????????????????????????",
        className: "two-col",
        children: [
          {
            title: "????????????",
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
                  {TeacherCount ? TeacherCount + "???" : "--"}
                </span>
              );
            },
          },
          {
            title: "????????????",
            // sorter: true,
            align: "center",
            key: "MaleCount",
            className: "two-col-bottom",

            width: 82 * widthRate,
            dataIndex: "MaleCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data + "???" : "--"}
                </span>
              );
            },
          },
          {
            title: "????????????",
            // sorter: true,
            align: "center",
            key: "FemaleCount",
            className: "two-col-bottom",

            width: 82 * widthRate,
            dataIndex: "FemaleCount",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data + "???" : "--"}
                </span>
              );
            },
          },
        ].concat(
          !haveCollege //??????????????????
            ? [
                {
                  title: "????????????",
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
        title: "??????/????????????",
        className: "two-col",
        children: [
          {
            title: "????????????",
            // sorter: true,
            align: "center",
            key: "AgeAvg",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "AgeAvg",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data + "???" : "--"}
                </span>
              );
            },
          },
          {
            title: "????????????",
            // sorter: true,
            align: "center",
            key: "TeachAgeAvg",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "TeachAgeAvg",
            render: (data) => {
              return (
                <span className="table-count" title={data}>
                  {data ? data + "???" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "????????????",
        className: "two-col",
        children: [
          {
            title: "?????????",
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
            title: "????????????????????????",
            // sorter: true,
            align: "center",
            key: "edu0",
            className: "two-col-bottom",

            width: 146 * widthRate,
            dataIndex: "EduUserCount",
            render: (data) => {
              let Data = data[0] || {
                NodeID: "edu0",
                NodeName: "????????????????????????",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "???" : "--"}
                </span>
              );
            },
          },
          {
            title: "???????????????",
            // sorter: true,
            align: "center",
            key: "edu1",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "EduUserCount",
            render: (data) => {
              let Data = data[1] || {
                NodeID: "edu1",
                NodeName: "???????????????",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "???" : "--"}
                </span>
              );
            },
          },
          {
            title: "??????",
            // sorter: true,
            align: "center",
            key: "edu2",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "EduUserCount",
            render: (data) => {
              let Data = data[1] || {
                NodeID: "edu2",
                NodeName: "??????",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "???" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "????????????",
        className: "two-col",
        children: [
          {
            title: "????????????????????????",
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
            title: haveCollege ? "??????" : "???????????????",
            // sorter: true,
            align: "center",
            key: "title0",
            className: "two-col-bottom",

            width: (haveCollege ? 82 : 98) * widthRate,
            dataIndex: "TitleUserCount",
            render: (data) => {
              let Data = data[0] || {
                NodeID: "title0",
                NodeName: "??????",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "???" : "--"}
                </span>
              );
            },
          },
          {
            title: haveCollege ? "?????????" : "????????????",
            // sorter: true,
            align: "center",
            key: "title1",
            className: "two-col-bottom",

            width: 82 * widthRate,
            dataIndex: "TitleUserCount",
            render: (data) => {
              let Data = data[0] || {
                NodeID: "title1",
                NodeName: "?????????",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "???" : "--"}
                </span>
              );
            },
          },
          {
            title: haveCollege ? "??????" : "????????????",
            // sorter: true,
            align: "center",
            key: "title2",
            className: "two-col-bottom",

            width: 98 * widthRate,
            dataIndex: "TitleUserCount",
            render: (data) => {
              let Data = data[0] || {
                NodeID: "title2",
                NodeName: "??????",
                Total: 0,
              };
              return (
                <span className="table-count" title={Data.Total}>
                  {Data.Total === 0 || Data.Total ? Data.Total + "???" : "--"}
                </span>
              );
            },
          },
        ],
      },
      {
        title: "????????????",
        className: "two-col",
        children: [
          {
            title: "???????????????",
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
            title: "?????????????????????",
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
        title: "???????????????",
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
        title: "???????????????",
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
        title: "????????????????????????",
        className: "two-col",
        children: [
          {
            title: "???????????????",
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
            title: "??????????????????",
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
            title: "???????????????????????????",
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
        title: "????????????????????????",
        className: "two-col",
        children: [
          {
            title: "????????????",
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
            title: "??????????????????",
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
            title: "???????????????????????????",
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
        title: "????????????????????????",
        className: "two-col",
        children: [
          {
            title: "??????????????????",
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
            title: "??????????????????",
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
            title: "??????????????????????????????",
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
        title: "???????????????????????????",
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
        title: "??????????????????",
        className: "two-col",
        children: [
          {
            title: "??????????????????",
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
            title: "??????????????????",
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
            title: "????????????",
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
            title: "?????????????????????",
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
        title: "??????????????????",
        className: "two-col",
        children: [
          {
            title: "??????????????????",
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
            title: "??????????????????",
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
            title: "?????????????????????",
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
        title: "??????????????????",
        className: "two-col",
        children: [
          {
            title: "??????????????????????????????",
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
                title = "???????????????";
              } else if ( time < 60) {
                title =  time + "??????";
              } else if ( time >= 60) {
                let minute = ( time % 60) ;
                title =
                  ( time / 60).toFixed() +
                  "??????" +
                  (minute > 0 ? minute.toFixed() + "??????" : "");
              }
              return (
                <span className="table-count" title={title}>
                  {title ? title : "--"}
                </span>
              );
            },
          },

          {
            title: "????????????????????????",
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
    ); //??????????????????
    // CulomnsSelect.forEach((child, index) => {
    //   // ??????????????????????????????????????????children??????????????????2
    //   if (child !== 0 && culomnsData[child + 2]) {
    //     EndCulomns.push(culomnsData[child + 2]);
    //   }
    // });
    culomnsData.forEach((child, index) => {
      // ??????????????????????????????
      if (index >= 3 && index !== culomnsData.length - 1) {
        // value ??????0????????????0???????????????????????????????????????????????????1?????????
        // index???3?????????3???index???0?????????????????????????????????
        if (
          CulomnsSelect.some((a) => {
            return a + 2 === index;
          })
        ) {
          EndCulomns.push(child);
        } else {
          //??????????????????
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
    EndCulomns.push(culomnsData[culomnsData.length - 1]); //?????????
    return EndCulomns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelMsg, CulomnsSelect, visible]);

  // ????????????????????????????????????????????????
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
  //     // ??????iframe
  //     // ??????????????????????????????????????????
  //     const fn = (node) => {
  //       let isOut = false;
  //       let dom = searchRef.current;
  //       let tool = toolTipRef.current;
  //       if (!dom.contains(node.target)&&(!tool||!tool.popupRef.current||tool.popupRef.current.getElement().contains(node.target))) {
  //         //?????????????????????????????????
  //         isOut = true;
  //       } else {
  //         isOut = false;
  //       }
  // console.log(!tool||!tool.popupRef.current||tool.popupRef.current.getElement() ,node.target)
  //       //??????????????????????????????????????????????????????
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
              title={"???????????????"}
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
              title={"????????????"}
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
            placeHolder={"??????" + levelMsg.belong + "????????????"}
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
  // ???????????????boolean
  const [visible, setVisible] = useState(false);
  // const [ToolClassName] = useState('more-content'+new Date().getTime())
  const searchRef = useRef(null);
  const toolTipRef = useRef(null);
  useLayoutEffect(() => {
    // let dom = searchRef.current;
    // ??????iframe
    // ??????????????????????????????????????????
    const fn = (node) => {
      let isOut = false;
      let dom = searchRef.current;
      let tool = toolTipRef.current;
      // console.log(document.getElementById(ToolClassName));
      if (
        !dom.contains(node.target) &&
        (!tool || !tool.contains(node.target))
      ) {
        //?????????????????????????????????
        isOut = true;
      } else {
        isOut = false;
      }
      // console.log(searchRef, toolTipRef);
      //??????????????????????????????????????????????????????
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
            <p className="more-title">?????????</p>
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
