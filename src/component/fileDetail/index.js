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
 * @Date: 2020-12-08 13:54:00
 * @LastEditTime: 2020-12-15 09:28:43
 * @Description:
 * @FilePath: \teacher-development\src\component\fileDetail\index.js
 */

import React, {
  //   useCallback,
  memo,
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
  useImperativeHandle,
  // useMemo,
  // useReducer,
  // createContext,
  // useContext,
  useRef,
  forwardRef,
} from "react";
import "./index.scss";
import { Scrollbars } from "react-custom-scrollbars";
//   import { Search, Empty } from "../common";
import $ from "jquery";
import useDetailRequest from "../../hooks/useDetailRequest";
import { getRecruitDetail } from "../../api/recruit";
import { getTrainDetail } from "../../api/train";
import { Loading, Empty, EmptyReact } from "../common";
import { constructFileType, getDataStorage } from "../../util/public";
function FileDetail(props, ref) {
  // *type:分为recruit招聘、train培训,默认招聘
  // *schema:模式：preview预览,detail详情
  let {
    className,
    fileid,
    type,
    style,
    schema,
    height,
    onReturn,
    onComfirm,
    previewData,
    useScrollbars,
    ...reset
  } = props;
  // 获取数据
  // 预览不用获取数据，数据由上面传下来
  const [detailData, handleChange, loading, reload] = useDetailRequest(
    {},
    type === "train" ? getTrainDetail : getRecruitDetail
  );
  // 是否使用滚动条
  const UseScrollbars = useMemo(() => {
    return useScrollbars === undefined || useScrollbars ? true : false;
  }, [useScrollbars]);
  // 主文
  const preRef = useRef(null);
  useEffect(() => {
    schema !== "preview" && fileid && handleChange(fileid);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileid]);

  let { IsLoaded, IsExist, Title, Issue, ReleaseTime, Content, FileList } =
    schema !== "preview"
      ? detailData
      : {
          IsLoaded: true,
          IsExist: true,
          Title: "",
          Issue: "",
          ReleaseTime: "",
          Content: "",
          FileList: [],
          ...previewData,
        };

  useLayoutEffect(() => {
    if (Content) $(preRef.current).html(Content);
    // $("detail-content").html(Content);
  }, [Content]);
  // 文件上传路径

  const fileIP = useMemo(() => {
    let BasePlatformMsg = getDataStorage("BasePlatformMsg");
    return BasePlatformMsg instanceof Object && BasePlatformMsg.ResHttpRootUrl;
  }, []);

  useImperativeHandle(ref, () => ({
    reload,detailData
  }));
  return (
    <EmptyReact component={UseScrollbars ? Scrollbars : false}>
      <Loading
        opacity={false}
        spinning={schema !== "preview" && loading}
        tip={"加载中..."}
      >
        <div
          className={`lg-fileDetail ${className ? className : ""}`}
          {...reset}
        >
          {IsLoaded ? (
            IsExist ? (
              <div className="fileDetail-content">
                <div className="fd-content-top">
                  <span className="content-top-msg content-title" title={Title}>
                    {Title}
                  </span>
                  <span className="content-top-msg content-msg">
                    <span className={"cm-text"} title={ReleaseTime}>
                      {ReleaseTime}
                    </span>
                    <span className={"cm-text"} title={Issue}>
                      {Issue}
                    </span>
                  </span>
                  {schema === "preview" ? (
                    <span
                      className="preview-return"
                      onClick={() => {
                        typeof onReturn === "function" && onReturn();
                      }}
                    >
                      返回
                    </span>
                  ) : (
                    ""
                  )}
                  {schema === "preview" ? (
                    <span
                      className="preview-comfirm"
                      onClick={() => {
                        typeof onComfirm === "function" && onComfirm();
                      }}
                    >
                      确认发布
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <pre
                  ref={preRef}
                  className="detail-content"
                  id="detail-content"
                  style={{ whiteSpace: "pre-wrap", fontFamily: "微软雅黑" }}
                >
                  {/* {(()=>{
                    let parser = new DOMParser();
                    let doc=parser.parseFromString(Content, "text/xml");
                    return doc
                  })()} */}
                </pre>
                {FileList instanceof Array && FileList.length > 0 ? (
                  <div className="file-box">
                    <p className="fb-top">附件</p>
                    <div className="fb-content">
                      {FileList.map((child, index) => {
                        let { FileName, FileUrl, FileSize } = child;
                        // let filename = FileName.split(".");
                        let Index = FileName.lastIndexOf(".");
                        let filename = [];

                        if (Index === -1) {
                          filename = [FileName, ""];
                        }
                        filename[0] = FileName.slice(0, Index);
                        filename[1] = FileName.slice(Index);

                        return (
                          <div
                            key={index}
                            className={`file-bar file-type-${constructFileType(
                              FileName
                            )}`}
                          >
                            <span className="file-name" title={FileName}>
                              {filename[0]}
                            </span>
                            <span className="file-type" title={FileName}>
                              {filename[1]}
                            </span>
                            <span className="file-size" title={FileSize}>
                              [{FileSize}]
                            </span>
                            <a
                              href={fileIP + FileUrl}
                              // ref={'noreferrer'}
                              download={filename[0]}
                              // eslint-disable-next-line react/jsx-no-target-blank
                              target="_blank"
                              className="file-download"
                              // onClick={() => {
                              //   window.open(fileIP+FileUrl);
                              // }}
                            >
                              下载
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Empty
                className={"lg-fileDetail-empty"}
                type={"4"}
                title={"所查询信息不存在"}
              ></Empty>
            )
          ) : (
            ""
          )}
        </div>
      </Loading>
    </EmptyReact>
  );
}
export default memo(forwardRef(FileDetail));
