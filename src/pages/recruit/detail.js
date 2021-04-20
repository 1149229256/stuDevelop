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
 * @LastEditTime: 2020-12-14 11:07:06
 * @Description:
 * @FilePath: \teacher-development\src\pages\recruit\detail.js
 */

import { connect } from "react-redux";
import React, {
  useCallback,
  memo,
  useEffect,
  useState,
  // useImperativeHandle,
  useRef,
  useContext,
  forwardRef,
} from "react";
import "./index.scss";
import { Carousel } from "antd";
import { withRouter } from "react-router-dom";
// import { handleActions } from "../../redux/actions";
import Editor from "../../component/editor";
import { Context } from "./reducer";
import { Loading } from "../../component/common";
import FileDetail from "../../component/fileDetail";
import { handleRoute } from "../../util/public";
import useDetailRequest from "../../hooks/useDetailRequest";
// import { getCruitList } from "../../api/recruit";
//   import { NavLink } from "react-router-dom";
function Datail(props, ref) {
  let {
    teacherRecruitMsg: { tabId },
    removeTab,
    activeTab,
    contentHW,
    location,
    id,
    history,
    dispatch,
  } = props;
  let { state, setDispatch } = useContext(Context);
  // 转到预览
  const [loading, setLoading] = useState(false);
  // 招聘id
  const [ID, setID] = useState(() => {
    return id ? id : "";
  });
  const detailRef = useRef(null);
  //获取招聘id
  useEffect(() => {
    if (location.pathname) {
      let Path = handleRoute(location.pathname);
      // if(Path[0] === "recruitDetail" &&
      // Path[1] ){
      //   setID(Path[1])
      // }else if(!Path[1]){
      //   // console.log('teacherRecruit')
      //   removeTab&&  removeTab("", "", "teacherRecruit", "")
      // }
      Path[0] === "recruitDetail" &&
        Path[1] &&
        Path[1] !== ID &&
        setID(Path[1]);
      if (Path[0] === "recruitDetail" && ID && detailRef.current) {
        //刷新
        detailRef.current.reload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  return (
    <Loading opacity={0.5} spinning={loading}>
      <div
        className=" Reacruit-context   Recruit-Datail"
        style={{ height: contentHW.height + "px" }}
      >
        <FileDetail ref={detailRef} fileid={ID} type={"recruit"}></FileDetail>
      </div>
    </Loading>
  );
}

const mapStateToProps = (state) => {
  let {
    handleData: { teacherRecruitMsg },
    commonData: { roleMsg, contentHW },
  } = state;
  return { teacherRecruitMsg, roleMsg, contentHW };
};
export default connect(mapStateToProps)(withRouter(memo(forwardRef(Datail))));
