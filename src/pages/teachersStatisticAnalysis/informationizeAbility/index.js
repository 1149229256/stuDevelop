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
  // *selectLevel:这里的selectLevel与用户的没关系，与看的级别有关，例如教育局的看学校的，selectLevel===2
  // *productLevel:产品类型，给用户看的界面类型，用来控制界面的一些属性：1教育局，2大学学校，3教育局学校，4大学学院，
  // *product:包含该productLevel的所有信息,有使用组件者使用productLevel和commonData的levelHash匹配使用，必须传，不传将出问题
  let {
    term,
    HasHistory,
    onAnchorComplete,
    schoolID,
    collegeID,
    productMsg,
  } = props;
  const { selectLevel, productLevel } = productMsg;
  // 教师人数
  const [teacherInternet, setTeacherInternet] = useState(false);
  const [teacherOnline, setTeacherOnline] = useState(false);

  //向上传bar的信息
  // const [anchorList, setAnchorList] = useState([]);
  // 获取每一块的ref，实现锚点功能
  const erRef = useRef(null);
  const tpRef = useRef(null);
 
  useLayoutEffect(() => {
    // setAnchorList();
    typeof onAnchorComplete === "function" &&
      onAnchorComplete([
        { ref: erRef.current, name: "上机信息" },
        { ref: tpRef.current, name: "教学办公" },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 初始请求
  useEffect(() => {
    // 第一次进来的时候可能为undefined
    if (term instanceof Object) {
      // 电子资源
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
      // // 电子教案
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
      <Bar loading={!teacherInternet} barName={"上机信息统计 "} ref={erRef}>
        <TeacherInternet data={teacherInternet} productMsg={productMsg}></TeacherInternet>
      </Bar>
      {/* <Bar
        loading={!teacherOnline}
        barName={"在线教学\\办公统计"}
        ref={tpRef}
        topContext={HasHistory ? { title: "查看历年参与率变化 " } : false}
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
