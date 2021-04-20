/*
 *                   ___====-_  _-====___
 *             _--^^^#####//      \\#####^^^--_
 *          _-^##########// (    ) \\##########^-_
 *         -############//  |\^^/|  \\############-
 *       _/############//   (@::@)   \############\_
 *      /#############((     \\//     ))#############\
 *     -###############\\    (oo)    //###############-
 *    -#################\\  / VV \  //#################-
 *   -###################\\/      \//###################-
 *  _#/|##########/\######(   /\   )######/\##########|\#_
 *  |/ |#/\#/\#/\/  \#/\##\  |  |  /##/\#/  \/\#/\#/\#| \|
 *  `  |/  V  V  `   V  \#\| |  | |/#/  V   '  V  V  \|  '
 *     `   `  `      `   / | |  | | \   '      '  '   '
 *                      (  | |  | |  )
 *                     __\ | |  | | /__
 *                    (vvv(VVV)(VVV)vvv)
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                神兽保佑            永无BUG
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-12-09 16:25:31
 * @LastEditTime: 2020-12-09 16:35:29
 * @Description: 项目检查input输入
 * @FilePath: \teacher-development\src\hooks\useCheckInput.js
 */
import { useEffect, useState, useRef, useMemo } from "react";

// export default function useCheckInput({
//   value = "",
//   regular = "",
//   success = () => {},
//   error = () => {},
// }) {
//   let fun = () => {};
//   value = value || "";
//   regular = value || /^[A-Za-z0-9_()\u4e00-\u9fa5-]{0,100}$/;
//   success = success || fun;
//   error = error || fun;

//   if (value === "") {
//     error(true);
//     return;
//   }
//   // 普通：[A-Za-z0-9_()\u4e00-\u9fa5-]
//   // 严格：  /^[a-zA-Z0-9_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5 ]{0,48}[a-zA-Z0-9_\u4e00-\u9fa5]$|^[a-zA-Z0-9_\u4e00-\u9fa5]{1,50}$/
//   let Test = regular.test(value);
//   if (Test) {
//     success();
//   } else {
//     error(false);
//   }
// }
