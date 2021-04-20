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
 * @Date: 2020-12-11 10:02:50
 * @LastEditTime: 2021-02-01 16:27:42
 * @Description: 招聘，培训详情请求hooks
 * @FilePath: \teacher-development\src\hooks\useDetailRequest.js
 */

/**
 * @description: 不会运行的时候就请求数据，需要使用者自己主动使用请求
 * @param {*}
 * @return {*}
 */
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
export default function useDetailRequest(query, api) {
  // 请求的id
  const [id, setID] = useState("");
  //   loading状态
  const [loading, setLoading] = useState(true);
  //储存返回的数据接口
  const [detailData, setDetailData] = useState({
    IsLoaded: false, //是否加载过
    IsExist: true, //是否存在
    IsError: false, //是否出错
    // IsLoaded>IsExist>IsError,判断级别
    ID: "", //ID，唯一标识
    Title: "", //标题
    Issue: "", //来源
    Status: 0, //状态：0草稿；1正式发布
    Content: "", //正文
    CreatorID: "", //发布者工号
    CreatorName: "", //发布者
    ReleaseTime: "", //发布时间
    UpdateTime: "", //最近一次编辑时间
    FileList: [
      //   {
      //     FileID: 20,
      //     FileName: "招聘岗位.xls", //文件名称
      //     FileUrl: "xxxxxxxxxxxxx", //文件路径
      //     FileSize: "23.4M", //文件大小
      //     DeleteFlag: 0, //文件删除标识
      //   },
    ],
  });
  //   请求处理
  const getDetailData = useCallback(
    async (payload) => {
      setLoading(true);
      payload = payload || { id, ...query };
      if (!api) {
        return;
      }
      //  请求,需要提前处理好json转换和处理成tableData的数据结构
      const data = await api(payload);
      // const res = await data.json();
      if (data.StatusCode === 200) {
        setDetailData({ ...data.data, IsExist: true, IsLoaded: true });
      } else {
        if (data.ErrCode === -2) {
          setDetailData({ IsExist: false, IsError: true, IsLoaded: true });
        } else {
          // 都当不存在处理
          setDetailData({ IsExist: false, IsError: true, IsLoaded: true });
        }
      }
      setLoading(false);
    },
    [api, id, query]
  );
  //   ID变化，请求
  useEffect(() => {
    //   必须有id
    id && getDetailData({ id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  //   修改id
  const handleChange = useCallback((id) => {
    setID(id);
  }, []);
  const reload = useCallback(()=>{
    id && getDetailData({ id });
  },[id])
  return [detailData, handleChange, loading,reload];
}
