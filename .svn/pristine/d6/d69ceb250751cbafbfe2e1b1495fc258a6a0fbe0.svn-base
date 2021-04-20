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
 * @LastEditTime: 2020-12-15 14:35:04
 * @Description:招聘和培训共用的编辑区域组件，发布编辑
 * @FilePath: \teacher-development\src\component\editor\index.js
 */

import React, {
  useCallback,
  memo,
  useEffect,
  useState,
  // useImperativeHandle,
  useMemo,
  // useReducer,
  // createContext,
  // useContext,
  useRef,
  forwardRef,
} from "react";

import "./index.scss";
import { Input, DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import { Tip, Radio, RadioGroup } from "../common";
import useDetailRequest from "../../hooks/useDetailRequest";
import $ from "jquery";
import {
  checkInput,
  autoAlert,
  constructFileType,
  calculateFileSize,
  getToken,
  getDataStorage,
  correctNumber,
} from "../../util/public";
import { getRecruitDetail } from "../../api/recruit";
import { getTrainDetail } from "../../api/train";
import moment from "moment";
import SparkMD5 from "spark-md5";
import UEditor from "../UEditor";
import UplaodInput from "./UplaodInput";
const { TextArea } = Input;
const { RangePicker } = DatePicker;
let format = "YYYY-MM-DD HH:mm";
function Editor(props, ref) {
  // type:分招聘和培训，*recruit：招聘，*train:培训
  // schema:模式，分发布publish和编辑edit两种，默认发布，
  let {
    className,
    type,
    schema,
    preview,
    draft,
    cancel,
    fileid,
    publish,
    // 文件上传使用
    schoolId,
    error,
    ...reset
  } = props;
  type = type || "recruitment";
  let sourceName = type === "recruitment" ? "来源" : "发布单位";
  // 标题
  const [title, setTitle] = useState("");
  // 标题错误显示
  const [titleVisible, setTitleVisible] = useState(false);
  const [titleTip, setTitleTip] = useState("请输入标题");

  // 来源
  const [source, setSource] = useState("");
  // 来源错误显示
  const [sourceVisible, setSourceVisible] = useState(false);
  const [sourceTip, setSourceTip] = useState("请输入" + sourceName);

  // 附件
  const [file, setFile] = useState([]);
  // 附件错误显示
  const [fileVisible, setFileVisible] = useState(false);
  const [fileTip, setFileTip] = useState("附件错误");
  // 文件的md5,检测文件的唯一性
  const [fileMD5, setFileMD5] = useState([]);
  // 上传按钮是否可点击
  const [forbinClick, setForbinClick] = useState(false);
  // 正文
  const [main, setMain] = useState("");
  // 正文错误显示
  const [mainVisible, setMainVisible] = useState(false);
  const [mainTip, setMainTip] = useState("请输入正文");
  // 报名需求
  const [applyFlag, setApplyFlag] = useState(0);
  // 报名需求错误显示
  const [applyFlagVisible, setApplyFlagVisible] = useState(false);
  const [applyFlagTip, setApplyFlagTip] = useState("请选择是否启用报名");
  // 上传人数限制
  const [limit, setLimit] = useState("");
  // 上传人数限制错误显示
  const [limitVisible, setLimitVisible] = useState(false);
  const [limitTip, setLimitTip] = useState("请输入上传人数限制");
  // 培训方式
  const [activityFlag, setActivityFlag] = useState(0);
  // 培训方式错误显示
  const [activityFlagVisible, setActivityFlagVisible] = useState(false);
  const [activityFlagTip, setActivityFlagTip] = useState("请选择培训方式");

  // 报名起始时间
  const [applyBeginTime, setApplyBeginTime] = useState("");
  const [applyEndTime, setApplyEndTime] = useState("");
  // 报名起始时间错误显示
  const [applyTimeVisible, setApplyTimeVisible] = useState(false);
  const [applyTimeTip, setApplyTimeTip] = useState("请选择报名起止时间");
  // 是否允许报名,控制报名人数限制和报名起止
  const [allowApply, setAllowApply] = useState(false);

  // 记录上传的完成度
  const [CompletePercert, setCompletePercert] = useState(false);
  // 上传文件状态
  const UploadRef = useRef(false);

  // 预览不用获取数据，数据由上面传下来
  const [detailData, handleChange, loading] = useDetailRequest(
    {},
    type === "train" ? getTrainDetail : getRecruitDetail
  );

  // 启用报名选择
  const applyFlagList = useMemo(() => {
    return [
      { value: 1, title: "是" },
      { value: 0, title: "否" },
    ];
  }, []);
  // 启用报名选择
  const activityFlagList = useMemo(() => {
    return [
      { value: 1, title: "线上" },
      { value: 0, title: "线下" },
    ];
  }, []);
  // 编辑器实例
  const UEditorRef = useRef(null);
  //  请求
  useEffect(() => {
    schema !== "preview" && fileid && handleChange(fileid);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileid]);

  // 赋值
  useEffect(() => {
    if (detailData.IsLoaded && detailData.IsExist) {
      //加载完毕
      setTitle(detailData.Title);
      setFile(detailData.FileList);
      setMain(detailData.Content);
      setSource(detailData.Issue);

      if (type === "recruitment") {
        //招聘
      }
      if (type === "train") {
        setActivityFlag(detailData.ActivityFlag);
        setApplyBeginTime(detailData.ApplyBeginTime);
        setApplyEndTime(detailData.ApplyEndTime);
        setApplyFlag(detailData.ApplyFlag);
        setLimit(detailData.Limit);
      }
    } else if (!detailData.IsExist) {
      //不存在
      typeof error === "function" && error();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailData]);
  //  普通输入检查
  const checkGeneralInput = useCallback(
    (value, success = () => {}, error = (isNull) => {}) => {
      checkInput({ value, success, error });
    },
    []
  );
  // useEffect(() => {}, []);
  // 检查标题,返回结果是否对错
  const checkTitle = useCallback(
    (value) => {
      let result = true;
      checkGeneralInput(
        value || title,
        () => {
          setTitleVisible(false);
          result = true;
        },
        (isNull) => {
          if (isNull) {
            setTitleTip("请输入标题");
          } else {
            setTitleTip("标题格式不正确");
          }
          setTitleVisible(true);
          result = false;
        }
      );
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [title]
  );
  // 检查来源,返回结果是否对错
  const checkSource = useCallback(
    (value) => {
      let result = true;

      checkGeneralInput(
        value || source,
        () => {
          setSourceVisible(false);
          result = true;
        },
        (isNull) => {
          // 不是招聘的不能进来
          // if (type !== "recruitment") {
          //   return;
          // }
          if (isNull) {
            setSourceTip("请输入" + sourceName);
          } else {
            setSourceTip(sourceName + "格式不正确");
          }
          setSourceVisible(true);
          result = false;
        }
      );
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source]
  );
  // 检查正文,返回结果是否对错
  const checkContent = useCallback(
    (value) => {
      let result = true;

      value = value || main;
      if (!value) {
        setMainTip("请输入正文");
        setMainVisible(true);
        result = false;
      } else {
        setMainVisible(false);
        result = true;
      }
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [main]
  );
  // 检查是否启用报名,返回结果是否对错
  const checkApplyFlag = useCallback(
    (value) => {
      let result = true;
      if (type !== "train") {
        //不是培训的，检查都成功
        return true;
      }
      value = value || applyFlag;
      if (value === "") {
        // setLimitTip("请输入上传人数限制");
        setApplyFlagVisible(true);
        result = false;
      } else {
        setApplyFlagVisible(false);
        result = true;
      }
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyFlag]
  );
  // 检查培训方式,返回结果是否对错
  const checkActivityFlag = useCallback(
    (value) => {
      let result = true;
      if (type !== "train") {
        //不是培训的，检查都成功
        return true;
      }
      value = value || activityFlag;
      if (value === "") {
        // setLimitTip("请输入上传人数限制");
        setActivityFlagVisible(true);
        result = false;
      } else {
        setActivityFlagVisible(false);
        result = true;
      }
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activityFlag]
  );
  // 检查培训方式,返回结果是否对错
  const checkApplyTime = useCallback(
    (value) => {
      //value传moment
      let result = true;
      if (type !== "train") {
        //不是培训的，检查都成功
        return true;
      }
      let [begin, end] = value || [applyBeginTime, applyEndTime];
      begin = moment(begin);
      end = moment(end);
      if (!begin.isValid() && !end.isValid()) {
        setApplyTimeTip("请选择报名起止时间");
        setApplyTimeVisible(true);
        result = false;
      } else if (!begin.isValid()) {
        setApplyTimeTip("请选择报名起始时间");
        setApplyTimeVisible(true);
        result = false;
      } else if (!end.isValid()) {
        setApplyTimeTip("请选择报名终止时间");
        setApplyTimeVisible(true);
        result = false;
      } else if (end.diff(begin, "m") < 60) {
        setApplyTimeTip("起始时间与终止时间不能相差小于1小时");
        setApplyTimeVisible(true);
        result = false;
      } else {
        setApplyTimeVisible(false);
        result = true;
      }
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyBeginTime, applyEndTime]
  );
  // 检查上传人数限制,返回结果是否对错
  const checkLimit = useCallback(
    (value) => {
      let result = true;
      if (type !== "train") {
        //不是培训的，检查都成功
        return true;
      }
      value = value || limit;
      // if (value) {
      //   setLimitTip("请输入上传人数限制");
      //   setLimitVisible(true);
      //   result = false;
      // } else {
      //   setLimitVisible(false);
      //   result = true;
      // }
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limit]
  );
  // 检查所有
  const checkAll = (fn) => {
    let result = [
      checkContent(),
      checkSource(),
      checkTitle(),
      checkActivityFlag(),
      checkApplyFlag(),
      !allowApply || checkApplyTime(),
      !allowApply || checkLimit(),
    ];

    if (result.every((child) => child)) {
      typeof fn === "function" && fn();
    }
  };
  // 计算文件md5，判断文件是否重复
  const calculate = useCallback((file, callback = () => {}) => {
    let fileReader = new FileReader();
    // let  box=document.getElementById('box');
    let blobSlice =
      File.prototype.mozSlice ||
      File.prototype.webkitSlice ||
      File.prototype.slice;
    // let   file = document.getElementById("file").files[0];
    let chunkSize = 2097152;
    // read in chunks of 2MB
    let chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let spark = new SparkMD5();

    fileReader.onload = function (e) {
      // console.log("read chunk nr", currentChunk + 1, "of", chunks);
      spark.appendBinary(e.target.result); // append binary string
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        let file_md5 = spark.end();
        callback(file_md5);
        // console.log("finished loading");
        // // box.innerText='MD5 hash:'+spark.end();
        // console.log("MD5 hash:" + spark.end());
        // console.info("computed hash", spark.end()); // compute hash
      }
    };

    function loadNext() {
      let start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;

      fileReader.readAsBinaryString(blobSlice.call(file, start, end));
    }

    loadNext();
  }, []);

  // 上传文件
  // *file:input返回的数据，*skip：分块使用，*fileSavePath:第一次为空，之后的分块上传后会给之前上传返回的路径
  const upload = useCallback(
    (file, skip, fileSavePath, success = () => {}, error = () => {}) => {
      let formData = new FormData();
      let blockSize = 1024 * 1024 * 3; //2MB，设置块大小
      let totalCount = Math.ceil(file.size / blockSize); //计算总块数
      let nextSize = Math.min((skip + 1) * blockSize, file.size); //计算下一块大小（此处主要用于处理文件末端不足2MB的数据块）
      let fileData = file.slice(skip * blockSize, nextSize); //切块
      let token = getToken();
      // 文件上传路径
      let BasePlatformMsg = getDataStorage("BasePlatformMsg");
      let fileIP =
        BasePlatformMsg instanceof Object && BasePlatformMsg.ResHttpRootUrl;
      // 用户信息
      let UserInfo = getDataStorage("UserInfo");
      let schoolID =
        schoolId || (UserInfo instanceof Object && UserInfo.SchoolID);
      formData.append("FileName", file.name); //文件名称
      formData.append("File", fileData);
      formData.append("PlanType", type); //培训、招聘计划ID
      // formData.append("PlanID", "265A7E70-D7C2-4B49-AF8B-065AC475BA05"); //培训、招聘计划ID
      formData.append("Token", token);
      formData.append("SchoolID", schoolID);
      formData.append("FileSavePath", fileSavePath);

      $.ajax({
        url: fileIP + "/Upload.ashx",
        async: false, //设为同步请求
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data, textStatus, jqXHR) {
          if (data.StatusCode !== 200) {
            setCompletePercert(false);

            console.info("分开上传失败，当前第" + (skip + 1) + "块");
            error(data.Msg);
            return;
          }
          fileSavePath = data.Data.FileUrl;
          if (skip + 1 === totalCount) {
            setCompletePercert(100);

            //此文件所有切块均已上传完毕
            success(data.Data);
            // 1秒后关闭
            setTimeout(() => {
              setCompletePercert(false);
            }, 1000);
            return;
          }
          setCompletePercert(correctNumber(((skip + 1) / totalCount) * 100));

          //当接收到请求返回结果后，递归调用自己，切下一块继续上传
          // data.Data.FileUrl是分开上传的关键，上传第一块时不需要,从第二块开始需要从上一个请求结果中拿到此参数再传给服务器接口
          upload(file, ++skip, data.Data.FileUrl, success, error);
        },
        error: function (jqXHR, txtStatus, errorThrown) {
          console.info("分开上传失败，当前第" + (skip + 1) + "块");
          setCompletePercert(false);

          error("程序异常");
          return;
        },
      });
      return fileSavePath;
    },
    [schoolId, type]
  );

  // 文件上传封装
  const fileUpload = useCallback(
    (File) => {
      setForbinClick(true);
      setCompletePercert(0);

      upload(
        File,
        0,
        "",
        (data) => {
          setFile([...file, data]);
        },
        (msg) => {
          autoAlert({ title: msg });
        }
      );
    },
    [upload, file]
  );
  // 监听是否启动报名
  useEffect(() => {
    if (applyFlag === 0) {
      setAllowApply(false);
      setLimit("");
      setApplyBeginTime("");
      setApplyEndTime("");
      setApplyTimeVisible(false);
      //  checkLimit()
    } else {
      setAllowApply(true);
    }
  }, [applyFlag]);
  // useEffect(() => {
  //   console.log(CompletePercert);
  // }, [CompletePercert]);
  const dom = useMemo(() => {
    return (
      CompletePercert && (
        <span className="dom-CompletePercert">{CompletePercert}</span>
      )
    );
  }, [CompletePercert]);
  const onUplaodPercert = useCallback((percert) => {
    setCompletePercert(percert);
  }, []);
  const onFileUplaod = useCallback((file) => {
    setCompletePercert(false);
    setFile(file);
  }, []);
const onFileUpMD5 = useCallback((value)=>{
setFileMD5(value)
},[])

  return (
    <div className={`lg-editor ${className ? className : ""}`} {...reset}>
      <table className="editor-table">
        <tbody>
          <tr>
            <td className="must">标题:</td>
            <td>
              <Tip visible={titleVisible} title={titleTip}>
                <Input
                  value={title}
                  className="editor-input title-input"
                  maxLength={100}
                  placeholder={"请输入标题..."}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  onBlur={(e) => {
                    checkTitle(e.target.value);
                  }}
                ></Input>
              </Tip>
            </td>
          </tr>
          <tr>
            <td className="must">{sourceName}:</td>
            <td>
              <Tip visible={sourceVisible} title={sourceTip}>
                <Input
                  value={source}
                  className="editor-input source-input"
                  maxLength={30}
                  placeholder={`请输入${sourceName}...`}
                  onChange={(e) => {
                    setSource(e.target.value);
                  }}
                  onBlur={(e) => {
                    checkSource(e.target.value);
                  }}
                ></Input>
              </Tip>
            </td>
          </tr>
          {type === "train" ? (
            <tr>
              <td>是否启用报名:</td>
              <td>
                <Tip visible={applyFlagVisible} title={applyFlagTip}>
                  <RadioGroup
                    value={applyFlag}
                    onChange={(e) => {
                      setApplyFlag(e.target.value);
                      setApplyFlagVisible(false);
                      // setAllowApply(e.target.value === 0);
                    }}
                  >
                    {applyFlagList.map((child, index) => {
                      return (
                        <Radio key={index} value={child.value}>
                          {child.title}
                        </Radio>
                      );
                    })}
                  </RadioGroup>
                </Tip>
              </td>
            </tr>
          ) : (
            <></>
          )}
          {type === "train" ? (
            <tr>
              <td>报名人数限制:</td>
              <td>
                <Tip visible={limitVisible} title={limitTip}>
                  <Input
                    value={limit}
                    // max={}
                    disabled={!allowApply}
                    type={"number"}
                    className="editor-input limit-input"
                    maxLength={8}
                    // placeholder={"请输入报名人数限制..."}
                    onChange={(e) => {
                      setLimit(e.target.value);
                    }}
                    onBlur={(e) => {
                      checkLimit(e.target.value);
                    }}
                  ></Input>
                </Tip>
              </td>
            </tr>
          ) : (
            <></>
          )}
          {type === "train" ? (
            <tr>
              <td className="must">报名起止时间:</td>
              <td>
                <Tip
                  visible={allowApply && applyTimeVisible}
                  title={applyTimeTip}
                >
                  <RangePicker
                    onChange={(dates, dateString) => {
                      // console.log(dates, dateString);
                      setApplyBeginTime(dateString[0]);
                      setApplyEndTime(dateString[1]);
                      // checkApplyTime(dateString)
                      if (dateString[0] && dateString[1]) {
                        // 两个时间都选择了才进行检查
                        checkApplyTime(dates);

                        // setApplyTimeVisible(false);
                        // if(dates[0].diff(dates[1],'m')<60){
                        //   checkApplyTime(dates)
                        // }
                      }
                    }}
                    // 禁用，没选开始，不能选择结束
                    disabled={[
                      !allowApply || false,
                      !allowApply || !applyBeginTime,
                    ]}
                    allowEmpty={[
                      !allowApply || false,
                      !allowApply || !applyBeginTime,
                    ]}
                    value={[
                      applyBeginTime ? moment(applyBeginTime) : "",
                      applyEndTime ? moment(applyEndTime) : "",
                    ]}
                    disabledDate={(date) => {
                      let time = moment();
                      // console.log(date);
                      return time > date;
                    }}
                    // disabledTime={(date, partial) => {
                    // let now = moment();
                    // let begin = moment(applyBeginTime);
                    // let end = moment(applyEndTime);
                    // console.log(date, partial);
                    // if (partial === "start") {
                    //   // 开始时间必须小于结束一个小时，如果不小于，则修改结束时间
                    //   if (
                    //     end &&
                    //     date < end &&
                    //     date.diff(end, "minutes") < 60
                    //   ) {
                    //     setApplyEndTime(date.add(1, "h").format(format));
                    //   }
                    // }
                    // if (partial === "end") {
                    //   // 结束时间，如果开始时间选择了，结束时间不能小于开始时间+一个小时
                    //   if (date > begin && date.diff(begin, "minutes") < 60) {
                    //     setApplyEndTime(begin.add(1, "h").format(format));
                    //   }
                    // }
                    // }}
                    format={format}
                    locale={locale}
                    showTime
                  ></RangePicker>
                </Tip>
              </td>
            </tr>
          ) : (
            <></>
          )}
          {type === "train" ? (
            <tr>
              <td>培训方式:</td>
              <td>
                <Tip visible={activityFlagVisible} title={activityFlagTip}>
                  <RadioGroup
                    value={activityFlag}
                    onChange={(e) => {
                      setActivityFlag(e.target.value);
                      setActivityFlagVisible(false);
                    }}
                  >
                    {activityFlagList.map((child, index) => {
                      return (
                        <Radio key={index} value={child.value}>
                          {child.title}
                        </Radio>
                      );
                    })}
                  </RadioGroup>
                </Tip>
              </td>
            </tr>
          ) : (
            <></>
          )}
          <tr>
            <td>附件:</td>
            <td style={{ padding: 0 }}>
              <span>
                {file instanceof Array &&
                  file.map((child, index) => {
                    let Index = child.FileName.lastIndexOf(".");
                    let filename = [];
                    if (Index === -1) {
                      filename = [child.FileName, ""];
                    }
                    filename[0] = child.FileName.slice(0, Index);
                    filename[1] = child.FileName.slice(Index);
                    let fileSize = child.FileSize;
                    return (
                      <span
                        key={index}
                        className={`file-content file-type-${constructFileType(
                          child.FileName
                        )}`}
                      >
                        <span className="file-name" title={child.FileName}>
                          {filename[0]}
                        </span>
                        <span className="file-type" title={child.FileName}>
                          {filename[1]}
                        </span>
                        <span className="file-size" title={fileSize}>
                          [{fileSize}]
                        </span>
                        <b onClick={()=>{
                          setFile(file.slice(0,index).concat(file.slice(index+1)))
                          setFileMD5(fileMD5.slice(0,index).concat(fileMD5.slice(index+1)))
                          
                        }} className="file-delete">×</b>
                      </span>
                    );
                  })}
                {file instanceof Array && file.length < 5 ? (
                  <span className="handle-upload">
                    {/* <span className="file-upload">
                      添加附件
                      <input
                        type="file"
                        className="file-input"
                        onChange={(e) => {
                          const input = e.target;
                          const files = e.target.files;
                          if (files) {
                            for (let index = 0; index < files.length; index++) {
                              // console.log(files[index]);
                              const File = files[index];
                              // console.log(File);
                              if (File.size > 1024 * 1024 * 100) {
                                // fileTip.innerHTML = '文件大小不能超过3M!';
                                autoAlert({ title: "文件大小不能超过100M" });
                                input.value = "";
                                return false;
                              } else {
                                //支持chrome IE10
                                if (window.FileReader) {
                                  calculate(File, (file_md5) => {
                                    // console.log(file_md5)
                                    if (
                                      !fileMD5.some(
                                        (child) => child === file_md5
                                      )
                                    ) {
                                      setFileMD5([...fileMD5, file_md5]);
                                      setForbinClick(true);
                                      fileUpload(File);
                                    } else {
                                      autoAlert({ title: "文件已存在" });
                                      input.value = "";
                                      return false;
                                    }
                                  });
                                } else {
                                  if (
                                    !file.some(
                                      (child) =>
                                        child.FileName === File.name &&
                                        child.FileSize === File.size
                                    )
                                  ) {
                                    setForbinClick(true);

                                    fileUpload(File);
                                  } else {
                                    autoAlert({ title: "文件已存在" });
                                    input.value = "";
                                    return false;
                                  }
                                }
                                // fileTip.innerHTML = '';
                                // formData.append("file", file);
                              }
                            }
                          }
                        }}
                      ></input>
                      {dom}
                    </span>
                    */}
                    <span className="input-box">
                      {/* {CompletePercert && (
                        <span className="dom-CompletePercert">
                          {CompletePercert}
                        </span>
                      )} */}
                      <UplaodInput
                        // onUplaodPercert={onUplaodPercert}
                        initFile={file}
                        onFileUplaod={onFileUplaod}
                        onFileUpMD5={onFileUpMD5}
                        fileMD5={fileMD5}
                        ref={UploadRef}
                        schoolId={schoolId}
                        type={type}
                      ></UplaodInput>
                    </span>
                    <span className="file-tip">
                      提示: 附件会在正文文末以下载链接形式出现
                    </span>
                  </span>
                ) : (
                  ""
                )}
              </span>
            </td>
          </tr>
          <tr>
            <td className="must  ">正文:</td>
            <td>
              <Tip visible={mainVisible} title={mainTip}>
                {/* <TextArea
                  value={main}
                  className="editor-input main-input"
                  // maxLength={100}
                  placeholder={"请输入正文..."}
                  row={5}
                  onChange={(e) => {
                    setMain(e.target.value);
                  }}
                  onBlur={(e) => {
                    checkContent(e.target.value);
                  }}
                ></TextArea> */}
                <div className={"editor-input main-input"}>
                  {" "}
                  <UEditor
                    onBlur={(e) => {
                      checkContent(e);
                      setMain(e);
                    }}
                    defaultValue={main}
                    ref={UEditorRef}
                  ></UEditor>
                </div>
              </Tip>
            </td>
          </tr>
        </tbody>
      </table>
      <ul className="editor-handle">
        {preview ? (
          <li
            className="handle-preview"
            onClick={() => {
              checkAll(
                preview.onClick.bind(this, {
                  Title: title,
                  Issue: source,
                  Content: main,
                  Limit: limit,
                  ApplyBeginTime: applyBeginTime,
                  ApplyEndTime: applyEndTime,
                  ActivityFlag: activityFlag,
                  ApplyFlag: applyFlag,
                  ReleaseTime: moment().format("YYYY-MM-DD HH:mm"),
                  FileList: file,
                })
              );
            }}
          >
            预览
          </li>
        ) : (
          ""
        )}
        {draft && schema !== "edit" ? (
          <li
            className="handle-btn handle-draft"
            onClick={() => {
              checkAll(
                draft.onClick.bind(this, {
                  Title: title,
                  Issue: source,
                  Content: main,
                  Limit: limit,
                  ApplyBeginTime: applyBeginTime,
                  ApplyEndTime: applyEndTime,
                  ActivityFlag: activityFlag,
                  ApplyFlag: applyFlag,
                  // ReleaseTime: moment().format("YYYY-MM-DD HH:mm"),
                  FileList: file,
                })
              );
            }}
          >
            暂存为草稿
          </li>
        ) : (
          ""
        )}
        {publish ? (
          <li
            className="handle-btn handle-publish"
            onClick={() => {
              checkAll(
                publish.onClick.bind(this, {
                  Title: title,
                  Issue: source,
                  Content: main,
                  Limit: limit,
                  ApplyBeginTime: applyBeginTime,
                  ApplyEndTime: applyEndTime,
                  ActivityFlag: activityFlag,
                  ApplyFlag: applyFlag,
                  // ReleaseTime: moment().format("YYYY-MM-DD HH:mm"),
                  FileList: file,
                })
              );
            }}
          >
            确认发布
          </li>
        ) : (
          ""
        )}
        {cancel ? (
          <li
            className="handle-btn handle-cancel"
            onClick={() => {
              // checkAll(publish.onClick);

              cancel.onClick && cancel.onClick();
            }}
          >
            取消
          </li>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
}
export default memo(forwardRef(Editor));
