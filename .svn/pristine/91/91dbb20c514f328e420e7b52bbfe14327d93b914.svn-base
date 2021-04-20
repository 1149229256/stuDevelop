/*
 *           佛曰:
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-11-17 14:10:48
 * @LastEditTime: 2020-12-10 16:22:02
 * @Description:
 * @FilePath: \teacher-development\src\redux\reducers\handleData\index.js
 */
import { handleActions } from "../../actions";
const handleData = (
  state = {
    teacherRecruitMsg: {
      tabName: "教师招聘计划管理",
      tabId: "teacherRecruit",
      component: "home",
      params: [
        { key: "", title: "教师招聘计划管理" },
        { key: "publish", title: "发布招聘计划" },
      ],
    },
    activeTab: "",
  },
  actions
) => {
  switch (actions.type) {
    case handleActions.COMMON_SET_ACTIVE_TAB:
      return Object.assign({}, state, {
        activeTab: actions.data,
      });
    case handleActions.COMMON_SET_TEACHER_RECRUIT_MSG:
      return Object.assign({}, state, {
        teacherRecruitMsg: { ...state.teacherRecruitMsg, ...actions.data },
      });

    default:
      return state;
  }
};
export default handleData;
