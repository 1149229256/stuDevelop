/*
 *
 * 　　┏┓　　　┏┓+ +
 * 　┏┛┻━━━┛┻┓ + +
 * 　┃　　　　　　　┃
 * 　┃　　　━　　　┃ ++ + + +
 *  ████━████ ┃+
 * 　┃　　　　　　　┃ +
 * 　┃　　　┻　　　┃
 * 　┃　　　　　　　┃ + +
 * 　┗━┓　　　┏━┛
 * 　　　┃　　　┃
 * 　　　┃　　　┃ + + + +
 * 　　　┃　　　┃
 * 　　　┃　　　┃ +  神兽保佑
 * 　　　┃　　　┃    代码无bug
 * 　　　┃　　　┃　　+
 * 　　　┃　 　　┗━━━┓ + +
 * 　　　┃ 　　　　　　　┣┓
 * 　　　┃ 　　　　　　　┏┛
 * 　　　┗┓┓┏━┳┓┏┛ + + + +
 * 　　　　┃┫┫　┃┫┫
 * 　　　　┗┻┛　┗┻┛+ + + +
 *
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2021-01-06 11:21:31
 * @LastEditTime: 2021-01-06 11:21:31
 * @Description: 封装好的百度编辑器
 * @FilePath: \teacher-development\src\component\UEditor\hooks\index.js
 */

import React, {
  useCallback,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  useMemo,
  // useReducer,
  // createContext,
  // useContext,
  //   useRef,
  forwardRef,
} from "react";
import "./index.scss";
import { Input } from "antd";
import { Loading } from "@/component/common";
// import $ from "jquery";
import useUEditorLaod from "./hooks/useUEditorLaod";
/**
 * @description: 使用前需要配置部署在服务器上的js文件:config.js,具体配置自己看官网文档，
 * 1、修改js文件路径
 * 2、需要定制个人的功能列表，通过修改config
 * 3、设置初始值：defaultValue
 * 4、通过onBlur获取编辑后的值
 * @param {*} props
 * @param {*} ref
 * @return {*}
 */
function UEditor(props, ref) {
  // id:为编辑器的id
  // config:为编辑器实例的时候的配置,具体配置看官网
  let { id, config, style, className, defaultValue, onBlur } = props;
  const [Id] = useState(() => {
    return id ? id : `UEditor_${new Date().getTime()}`;
  });
  //   Id：为需要自己定的编辑器id
  // config：实例编辑器的配置，参考官网文档
  const [UE, Ready] = useUEditorLaod(Id, config);
  useEffect(() => {
    //   UE有实例后才进来
    if (Ready && UE) {
      // 设初始值
      UE.setContent(defaultValue ? defaultValue : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UE, Ready]);
  //   设置事件
  useEffect(() => {
    if (Ready) {
      //   设置鼠标失去事件

      UE.addListener("blur", Blur);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Ready]);
  useImperativeHandle(ref, () => ({
    ...UE,
  }));
  const Blur = useCallback(() => {
    //   获取内容
    onBlur(UE.getContent());
  }, [UE, onBlur]);
  return (
    <Loading spinning={Ready === null} opacity={false} tip={'加载中...'}>
      {Ready !== false && (
        <div
          id={Id}
          onBlur={() => {
            console.log("dasdsa");
          }}
          className={`LG_UEditor ${className ? className : ""}`}
          //   type="text/plain"
          style={{ width: "931px", height: "370px", ...style }}
        ></div>
      )}
      {/* 当加载失败后，使用默认input */}
      {Ready === false && (
        <Input.TextArea
          defaultValue={defaultValue}
          className="LG_Input_default"
          onBlur={(e) => {
            console.log(e)
            onBlur(e.target.value);
          }}
          rows={10}
        ></Input.TextArea>
      )}
    </Loading>
  );
}

export default memo(forwardRef(UEditor));
