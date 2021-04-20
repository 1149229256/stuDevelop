/*
 *                        .::::.
 *                      .::::::::.
 *                     :::::::::::
 *                  ..:::::::::::'
 *               '::::::::::::'
 *                 .::::::::::
 *            '::::::::::::::..
 *                 ..::::::::::::.
 *               ``::::::::::::::::
 *                ::::``:::::::::'        .:::.
 *               ::::'   ':::::'       .::::::::.
 *             .::::'      ::::     .:::::::'::::.
 *            .:::'       :::::  .:::::::::' ':::::.
 *           .::'        :::::.:::::::::'      ':::::.
 *          .::'         ::::::::::::::'         ``::::.
 *      ...:::           ::::::::::::'              ``::.
 *     ````':.          ':::::::::'                  ::::..
 *                        '.:::::'                    ':'````..
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2021-01-06 11:20:21
 * @LastEditTime: 2021-01-06 11:20:21
 * @Description: 百度编辑器的hooks
 * @FilePath: \teacher-development\src\hooks\useUEditorLaod.js
 */

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import config from "@/util/ipConfig";
import { getDataStorage } from "@/util/public";
import { getBasePlatformMsg } from "@/util/init";
// import { addScript } from "@/util/public";
// import name from '@/';
/**
 * @description:赋值使用前修改下面的js文件地址
 * @param {*} id:ueditor的id
 * @return {*}
 */
const { EditorProxy } = config;

export default function useUEditorLaod(id, config) {
  // 编辑器实例
  const [UE, setUE] = useState(null);
  //   编辑器是否加载完毕
  const [Ready, setReady] = useState(null);
  const addElement = (
    params = {},
    element = "script",
    parent = "body",
    callback = () => {}
  ) => {
    try {
      let Element = document.createElement(element);
      // Element = { ...Element, ...params };
      for (let i in params) {
        Element[i] = params[i];
      }
      // 如果params带有id属性，判断dom是否有该节点了
      if (
        params.id &&
        // params.src &&
        document.getElementById(params.id)
        // &&
        // params.src === document.getElementById(params.id).src
      ) {
        callback("isExist");
        return;
      }
      document[parent].appendChild(Element);
      callback(true);
    } catch (e) {
      console.error(e);
    }
  };
  const addScript = useCallback(
    async (params = {}, element = "script", parent = "body") => {
      return new Promise((resolve, reject) => {
        addElement(
          {
            type: "text/javascript",
            charset: "utf-8",
            ...params,
            onload: () => {
              resolve(true);
              typeof params.onLoad === "function" && params.onLoad(true);
            },
            onerror: () => {
              resolve(false);
              typeof params.onLoad === "function" && params.onLoad(false);
            },
          },
          element,
          parent,
          (data) => {
            if (data === "isExist") {
              resolve(true);
            }
          }
        );
      });
    },
    []
  );
  useEffect(() => {
    async function loadScript() {
      //
      try {
        let { ResHttpRootUrl } = await getBasePlatformMsg(["ResHttpRootUrl"]);
        window.UEDITOR_HOME_URL = ResHttpRootUrl + "/UEditor/";

        // 因为有消息中心的js动态加入，导致如果编辑器js在他们中间加载css文件的ip地址错误，导致样式有问题，所以现在直接加载算了
        // addElement(
        //   {
        //     type: "text/css",
        //     rel: "stylesheet",
        //     href: ResHttpRootUrl + "/UEditor/themes/default/css/ueditor.css",
        //     id: "ueditor_link_ueditor",
        //   },
        //   "link",
        //   "head",
        //   (data) => {
        //     // resolve(data);
        //   }
        // );
        // 检查是否已经加载过jq
        let jqLaod = await addScript({
          src: ResHttpRootUrl + "/UEditor/third-party/jquery-1.10.2.min.js",
          id: "ueditor_script_jq",
          onLoad: () => {},
        });

        // 一个加载不成功就不加载了
        let configLaod =
          jqLaod &&
          (await addScript({
            src: ResHttpRootUrl + "/UEditor/ueditor.config.js",
            id: "ueditor_script_config",
            onLoad: () => {},
          }));

        let all_minLaod =
          configLaod &&
          (await addScript({
            src: ResHttpRootUrl + "/UEditor/ueditor.all.js",
            id: "ueditor_script_all_min",
            onLoad: () => {},
          }));

        let parseLaod =
          all_minLaod &&
          (await addScript({
            src: ResHttpRootUrl + "/UEditor/ueditor.parse.min.js",
            id: "ueditor_script_.parse",
            onLoad: () => {},
          }));

        let langLaod =
          parseLaod &&
          (await addScript({
            src: ResHttpRootUrl + "/UEditor/lang/zh-cn/zh-cn.js",
            id: "ueditor_script_lang_zh-cn",
            onLoad: () => {},
          }));
        console.log(jqLaod, configLaod, all_minLaod, parseLaod, langLaod);
        // js加载不成功
        if (!langLaod) {
          setReady(false);

          return;
        }
        // 必须等上面的脚本加载完
        //   if (configLaod && all_minLaod && langLaod && jqLaod && parseLaod) {
        //   let { toolbars, ...others } = config;
        //实例化编辑器
        //建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例

        let ue = window.UE.getEditor(id, {
          toolbars: [
            [
              "fontfamily",
              "fontsize",
              "bold",
              "italic",
              "underline",
              "fontborder",
              "justifyleft",
              "justifycenter",
              "justifyright",
              "lineheight",
              "link",
              "|",
              "emotion",
              "simpleupload",
              // "|",
              // "music",
              // "insertvideo",
            ],
          ],
          // 字数统计

          wordCount: false,

          // 元素路径

          elementPathEnabled: false,
          // emotionLocalization: true,
          ...config,
        });

        //   const ueditor_script_config = document.getElementById(
        //     "ueditor_script_config"
        //   );
        ue.ready(() => {
          setUE(ue);
          setReady(true);
        });
      } catch (e) {
        console.log(e);
        // 当出错的时候返回false，表示出错，加载不成功

        setReady(false);
      }
      //   }
      // Promise.all([configLaod, all_minLaod, langLaod,jqLaod]).then(
      //     ([configLaod, all_minLaod, langLaod,jqLaod]) => {

      //     }
      //   );
    }
    // setTimeout(() => {
    loadScript();
    // }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [UE, Ready];
}
