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
 * @LastEditTime: 2020-12-14 20:13:28
 * @Description:
 * @FilePath: \teacher-development\src\pages\recruit\edit.js
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
import { Carousel, Tabs } from "antd";
import { withRouter } from "react-router-dom";
// import { handleActions } from "../../redux/actions";
import Editor from "../../component/editor";
import { Context } from "./reducer";
import { Loading } from "../../component/common";
import FileDetail from "../../component/fileDetail";
import { editRecruit } from "../../api/recruit";
import { handleRoute } from "../../util/public";

let { TabPane } = Tabs;
// import { getCruitList } from "../../api/recruit";
//   import { NavLink } from "react-router-dom";
function Publish(props, ref) {
  let {
    teacherRecruitMsg: { tabId },
    removeTab,
    activeTab,
    contentHW,
    location,
    history,
    roleMsg: { schoolID, collegeID, selectLevel },

    dispatch,
  } = props;
  let { state, setDispatch } = useContext(Context);
  // 转到预览
  const [preview, setPreview] = useState(false);
  // 转到预览
  const [ActiveTab, setActiveTab] = useState("publish");
  // 加载
  const [loading, setLoading] = useState(false);
  // 招聘id
  const [ID, setID] = useState("");
  // previewData
  const [previewData, setPreviewData] = useState({
    Title: "测试",
    Issue: "测试",
    ReleaseTime: "测试",
    Content: "测试",
    FileList: [],
  });
  // 轮播方法
  // const CarouselRef = useRef(null);
  // 发布
  const publish = useCallback(
    (data) => {
      // *RStatus:状态：0草稿；1正式发布
      setLoading(true);
      let { FileList, ReleaseTime, ...other } = data;
      // FileName:FileList[0].FileName,
      // FileUrl:FileList[0].FileUrl,
      // FileSize:FileList[0].FileSize,
      // setTimeout(() => {
      editRecruit({
        // SchoolID: schoolID,
        // CollegeID: collegeID,
        // SelectLevel: selectLevel,
        RID: ID,
        RStatus: 1,
        FileList,
        // ...previewData,
        ...other,
      }).then(({ result }) => {
        if (result) removeTab("", "", "teacherRecruit", "");
        else {
        }
        setLoading(false);

      });
      // }, 3000);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [previewData, removeTab, ID]
  );

  //获取招聘id
  useEffect(() => {
    if (location.pathname) {
      let Path = handleRoute(location.pathname);
      Path[0] === "editRecruit" && Path[1] && Path[1] !== ID && setID(Path[1]);

      // 请求
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    // <Carousel ref={CarouselRef} dots={false}>
    <Loading opacity={0.5} spinning={loading}>
      <Tabs
        activeKey={ActiveTab}
        renderTabBar={() => {
          return "";
        }}
      >
        <TabPane tab="publish" key="publish">
          <div
            // style={{ display: `${preview ? "none" : "block"}` }}
            className=" Reacruit-context Publish-context Recruit-publish"
          >
            <div className="context-top  ">
              <span className=" title-1">编辑招聘计划</span>
              <span className=" title-2">(提示: 发布后将在各校官网显示)</span>
            </div>
            <Editor
              fileid={ID}
              schema={"edit"}
              error={() => {
                removeTab("", "", "teacherRecruit", "", (active, param) => {});
              }}
              preview={{
                onClick: (data) => {
                  // data:{title, source, main}
                  // setPreviewData({Title:data.title, Issue:'测试', ReleaseTime:'测试', Content:'测试', FileList:[]})
                  setPreviewData(data);
                  setPreview(true);
                  setActiveTab("preview");

                  // CarouselRef.current.next();
                },
              }}
              draft={{
                onClick: (data) => {
                  // setLoading(true);

                  // setTimeout(() => {
                  //   removeTab("", "", "teacherRecruit");
                  // }, 3000);
                  // setPreviewData(data);

                  publish({ ...data, RStatus: 0 });
                },
              }}
              publish={{
                onClick: (data) => {
                  publish({ ...data, RStatus: 1 });
                },
              }}
              cancel={{
                onClick: () => {
                  removeTab("", "", "teacherRecruit", "", (active, param) => {
                    console.log(active, param);
                    // history.push('/teacherRecruit')
                  });
                },
              }}
            ></Editor>
          </div>
        </TabPane>
        <TabPane tab="preview" key="preview">
          {preview ? (
            <div className="Recruit-preview-box">
              <div
                style={{ height: contentHW.height + "px" }}
                // onClick={() => {
                //   // CarouselRef.current.prev();
                //   setPreview(false);
                //   setActiveTab('publish');

                // }}
              >
                <FileDetail
                  schema={"preview"}
                  type={"recruit"}
                  previewData={previewData}
                  onReturn={() => {
                    setPreview(false);
                    setActiveTab("publish");
                  }}
                  onComfirm={() => {
                    publish({ ...previewData, RStatus: 1 });
                  }}
                ></FileDetail>
              </div>
            </div>
          ) : (
            ""
          )}
        </TabPane>
      </Tabs>
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
export default connect(mapStateToProps)(withRouter(memo(forwardRef(Publish))));
