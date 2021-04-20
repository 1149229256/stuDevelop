import React, {
  useState,
  useImperativeHandle,
  useCallback,
  memo,
  useMemo,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import {
  correctNumber,
  autoAlert,
  getToken,
  getDataStorage,
} from "@/util/public";
import SparkMD5 from "spark-md5";
import $ from "jquery";

function UplaodInput(props, ref) {
  let {
    type,
    onUplaodPercert,
    onFileUplaod,
    initFile,
    onFileUpMD5,
    fileMD5,
    // : FileMD5
    // 文件上传使用
    schoolId,
  } = props;
  // 记录上传的完成度
  const [CompletePercert, setCompletePercert] = useState(false);
  const [UplaodParams, setUplaodParams] = useState([]);
  const InputRef = useRef(null);
  const [ForbinClick, setForbinClick] = useState(false);
  //   const [file, setFile] = useState(initFile||[]);
  // 文件的md5,检测文件的唯一性
  //   const [fileMD5, setFileMD5] = useState([]);
  const file = useMemo(() => {
    return initFile || [];
  }, [initFile]);
  //   const fileMD5 = useMemo(() => {
  //     return FileMD5 || [];
  //   }, [FileMD5]);
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
            // 每次创建完i后把file的outerHTML重置
            // eslint-disable-next-line no-self-assign
            // InputRef.current.outerHTML = InputRef.current.outerHTML;
            console.info("分开上传失败，当前第" + (skip + 1) + "块");
            error(data.Msg);
            return;
          }
          fileSavePath = data.Data.FileUrl;
          if (skip + 1 === totalCount) {
            //   当完成的时候
            setCompletePercert(100);
            setCompletePercert(false);
            setForbinClick(false);

            //此文件所有切块均已上传完毕
            success(data.Data);
            // 每次创建完i后把file的outerHTML重置
            // eslint-disable-next-line no-self-assign
            // InputRef.current.outerHTML = InputRef.current.outerHTML;
            // 1秒后关闭
            // setTimeout(() => {
            //   setCompletePercert(false);
            // }, 1000);
            return;
          }

          setCompletePercert(correctNumber(((skip + 1) / totalCount) * 100));
          setUplaodParams([file, ++skip, data.Data.FileUrl, success, error]);

          //当接收到请求返回结果后，递归调用自己，切下一块继续上传
          // data.Data.FileUrl是分开上传的关键，上传第一块时不需要,从第二块开始需要从上一个请求结果中拿到此参数再传给服务器接口
          //   upload(file, ++skip, data.Data.FileUrl, success, error);
        },
        error: function (jqXHR, txtStatus, errorThrown) {
          console.info("分开上传失败，当前第" + (skip + 1) + "块");
          setCompletePercert(false);
          // 每次创建完i后把file的outerHTML重置
          // eslint-disable-next-line no-self-assign
          //   InputRef.current.outerHTML = InputRef.current.outerHTML;
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
      setUplaodParams([
        File,
        0,
        "",
        (data) => {
          //   setFile([...file, data]);
          onFileUplaod([...file, data]);
          //   onFileUpMD5(fileMD5);
        },
        (msg) => {
          autoAlert({ title: msg });
        },
      ]);
      setCompletePercert(0);

      //   upload(
      //     File,
      //     0,
      //     "",
      //     (data) => {
      //       //   setFile([...file, data]);
      //       onFileUplaod([...file, data]);
      //     },
      //     (msg) => {
      //       autoAlert({ title: msg });
      //     }
      //   );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [upload, file]
  );
  useImperativeHandle(ref, () => ({
    file,
    CompletePercert,
  }));
  //   useEffect(() => {
  //     onUplaodPercert(CompletePercert);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [CompletePercert]);

  /**
   * @description: 因为上传的时候如果一直分片for，会阻塞界面的渲染，所以要分离递归
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    if (
      UplaodParams.length > 0 &&
      CompletePercert !== false &&
      CompletePercert !== 100
    )
      upload(...UplaodParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CompletePercert]);
  return (
    <span
      className="file-upload"
      style={{
        cursor: !ForbinClick ? "pointer" : "no-drop",
      }}
    >
      添加附件
      <input
        ref={InputRef}
        type="file"
        style={{
          cursor: !ForbinClick ? "pointer" : "no-drop",
          display: ForbinClick ? "none" : "inline-block",
        }}
        className="file-input"
        // disabled={!!ForbinClick}
        onClick={() => {
          setForbinClick(true);
        }}
        onChange={(e) => {
        //   setForbinClick(true);
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
          setForbinClick(false);

                // input.value = "";
                return false;
              } else {
                //支持chrome IE10
                if (window.FileReader) {
                  calculate(File, (file_md5) => {
                    // console.log(file_md5)
                    if (!fileMD5.some((child) => child === file_md5)) {
                      onFileUpMD5([...fileMD5, file_md5]);
                      fileUpload(File);
                      //   input.value = "";
                    } else {
                      autoAlert({ title: "文件已存在" });
          setForbinClick(false);

                      //   input.value = "";
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
                    fileUpload(File);
                    // input.value = "";
                  } else {
                    autoAlert({ title: "文件已存在" });
          setForbinClick(false);

                    // input.value = "";
                    return false;
                  }
                }
                // fileTip.innerHTML = '';
                // formData.append("file", file);
              }
            }
            input.value = "";
          }
        }}
      ></input>
      {CompletePercert !== false && (
        <span className="dom-CompletePercert">{CompletePercert}%</span>
      )}
    </span>
  );
}

export default memo(forwardRef(UplaodInput));
