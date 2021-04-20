/*
 * _______________#########_______________________
 * ______________############_____________________
 * ______________#############____________________
 * _____________##__###########___________________
 * ____________###__######_#####__________________
 * ____________###_#######___####_________________
 * ___________###__##########_####________________
 * __________####__###########_####_______________
 * ________#####___###########__#####_____________
 * _______######___###_########___#####___________
 * _______#####___###___########___######_________
 * ______######___###__###########___######_______
 * _____######___####_##############__######______
 * ____#######__#####################_#######_____
 * ____#######__##############################____
 * ___#######__######_#################_#######___
 * ___#######__######_######_#########___######___
 * ___#######____##__######___######_____######___
 * ___#######________######____#####_____#####____
 * ____######________#####_____#####_____####_____
 * _____#####________####______#####_____###______
 * ______#####______;###________###______#________
 * ________##_______####________####______________
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2021-01-08 09:02:54
 * @LastEditTime: 2021-01-08 09:02:55
 * @Description:
 * @FilePath: \teacher-development\src\component\search\hooks.js
 */

import {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { changeToArray } from "@/util/public";
export function useSearchRequest(api, payload) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    //   没住嗯备好
    if (!payload) {
      return;
    }
    let proList = [];
    let Res = {};
    // 转换为数组
   let Api = changeToArray(api);

    proList = Api.map(async (child) => {
        setLoading(true)
      if (typeof child === "function") {
        let res = await child(payload);
        if (res.StatusCode === 200) {
          // proList.push(res.data);
          return res.data;
        }
      }
    });

    Promise.all(proList).then((res) => {
      res.forEach((child) => {
        if (child) Res = { ...Res, ...child };
      });
      setResult(Res);
      setLoading(false)
    });
  }, [api, payload]);

  return [result,loading];
}
