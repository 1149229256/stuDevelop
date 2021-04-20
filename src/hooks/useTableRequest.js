/*
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                               神兽保佑            永无BUG
 *
 * @Author: zhuzesen
 * @LastEditors: zhuzesen
 * @Date: 2020-12-08 18:30:14
 * @LastEditTime: 2020-12-14 09:25:19
 * @Description: table请求的hooks
 * @FilePath: \teacher-development\src\hooks\useTableRequest.js
 */

import { useEffect, useState, useRef, useMemo } from "react";
export default function useTableRequest(query = {}, api, prepare = true) {
  // *prepare:是否准备好了，默认是，可以直接请求
  /* 是否是第一次请求 */
  const fisrtRequest = useRef(false);
  /* 保存分页信息 */
  const [pageOptions, setPageOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  /* 保存表格数据 */
  const [tableData, setTableData] = useState({
    List: [],
    Total: 10,
    PageSize: 10,
    PageIndex: 1,
    IsError: false,
  });
  // 保存是否在请求的状态
  const [loading, setLoading] = useState(false);
  const [isUnMount, setIsUnMount] = useState(false);

  /* 请求数据 ,数据处理逻辑根后端协调着来 */
  const getList = useMemo(() => {
    return async (payload) => {
      // console.log(payload);
      // 组件卸载了之后不应该再修改它的状态
      if (isUnMount) {
        return;
      }
      // console.log(payload);

      setLoading(true);
      payload = payload || { ...query, ...pageOptions };

      if (!api) {
        //api无效，静态更改前端数据
        setTableData({
          ...tableData,
          PageSize: payload.pageSize,
          PageIndex: payload.pageIndex,
        });
        fisrtRequest.current = true;

        return;
      }
      //  请求,需要提前处理好json转换和处理成tableData的数据结构
      const data = await api(payload);
      // const res = await data.json();
      if (data.StatusCode === 200) {
        setTableData(data.data);
        fisrtRequest.current = true;
      } else {
        setTableData({ isError: true });
      }
      setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* 改变分页，重新请求数据 */
  useEffect(() => {
    // console.log(query);
    fisrtRequest.current &&
      getList({
        ...pageOptions,
        ...query,
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOptions]);
  /* 改变查询条件。重新请求数据 */
  useEffect(() => {
    // console.log(query)
    prepare &&
      getList({
        ...pageOptions,

        ...query,
        pageIndex: 1,
      });
    return () => {
      setIsUnMount(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, prepare]);
  /* 处理分页逻辑 */
  const handerChange = useMemo(
    () => (options) => {
      return setPageOptions({ ...pageOptions, ...query, ...options });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageOptions, query]
  );
  // 刷新
  const reloadList = useMemo(
    () => (options) => {
      options = options || {};
      return getList({
        ...query,
        ...pageOptions,
        pageIndex: 1,
        ...options,
      });
    },
    [pageOptions, query, getList]
  );
  return [tableData, handerChange, getList, loading, reloadList];
}
