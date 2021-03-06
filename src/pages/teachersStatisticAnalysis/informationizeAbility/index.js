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
 * @Date: 2020-12-28 09:45:45
 * @LastEditTime: 2020-12-28 09:45:45
 * @Description:
 * @FilePath: \teacher-development\src\pages\teachersStatisticAnalysis\informationizeAbility\index.js
 */

import {
  connect,
  // useSelector,
  useDispatch,
} from "react-redux";
import React, {
  // useCallback,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
  useLayoutEffect,
  forwardRef,
} from "react";
import "./index.scss";
import Bar from "../../../component/bar";
import TeacherInternet from "./teacherInternet";
import TeacherOnline from "./teacherOnline";

import { getTeachER, getTeachTP } from "../../../api/informationizeAbility";
// import teacherInternet from "./teacherInternet";
// import TeacherOnline from "./teacherOnline";
// import TeacherAge from "./teacherAge";
// import TeacherTitle from "./teacherTitle";
function InformationizeAbility(props, ref) {
  // *selectLevel:?????????selectLevel?????????????????????????????????????????????????????????????????????????????????selectLevel===2
  // *productLevel:?????????????????????????????????????????????????????????????????????????????????1????????????2???????????????3??????????????????4???????????????
  // *product:?????????productLevel???????????????,????????????????????????productLevel???commonData???levelHash?????????????????????????????????????????????
  let {
    term,
    HasHistory,
    onAnchorComplete,
    schoolID,
    collegeID,
    productMsg,
  } = props;
  const { selectLevel, productLevel } = productMsg;
  // ????????????
  const [teacherInternet, setTeacherInternet] = useState(false);
  const [teacherOnline, setTeacherOnline] = useState(false);

  //?????????bar?????????
  // const [anchorList, setAnchorList] = useState([]);
  // ??????????????????ref?????????????????????
  const erRef = useRef(null);
  const tpRef = useRef(null);
 
  useLayoutEffect(() => {
    // setAnchorList();
    typeof onAnchorComplete === "function" &&
      onAnchorComplete([
        { ref: erRef.current, name: "????????????" },
        { ref: tpRef.current, name: "????????????" },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ????????????
  useEffect(() => {
    // ?????????????????????????????????undefined
    if (term instanceof Object) {
      // ????????????
      getTeachER({
        term: term.value,
        schoolID,
        collegeID,
        selectLevel,
      }).then((data) => {
        if (data) {
          setTeacherInternet(data);
        }
      });
      // // ????????????
      // getTeachTP({
      //   term: term.value,
      //   schoolID,
      //   collegeID,
      //   selectLevel,
      // }).then((data) => {
      //   if (data) {
      //     setTeacherOnline(data);
      //   }
      // });
    }
  }, [term, schoolID, collegeID, selectLevel]);

  return (
    <div className="InformationizeAbility">
      <Bar loading={!teacherInternet} barName={"?????????????????? "} ref={erRef}>
        <TeacherInternet data={teacherInternet} productMsg={productMsg}></TeacherInternet>
      </Bar>
      {/* <Bar
        loading={!teacherOnline}
        barName={"????????????\\????????????"}
        ref={tpRef}
        topContext={HasHistory ? { title: "??????????????????????????? " } : false}
      >
        <TeacherOnline data={teacherOnline} productMsg={productMsg}></TeacherOnline>
      </Bar> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: {
      termInfo: { HasHistory },
    },
  } = state;
  // console.log(state)
  return { HasHistory };
};
export default connect(mapStateToProps)(
  memo(forwardRef(InformationizeAbility))
);
