import React, {
  //   useCallback,
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
import { Table, Empty, Loading, PagiNation } from "../common";
import { useTableRequest } from "./hooks";
function $Table(props, ref) {
  let {
    className,
    loading: outLoading,
    tip,
    opacity,
    query,
    // : Query
    pageProps,
    api,
    prepare,
    onDataChange,
    ...reset
  } = props;
  // let { dataSource } = reset;
  /* 控制表格查询条件 */
  // const [query, setQuery] = useState(typeof Query === "object" ? Query : {});
  // tableData：列表数据，handerChange:更改查询的条件，getList：获取数据
  const [
    tableData,
    handerChange,
    getList,
    loading,
    reloadList,
  ] = useTableRequest(query, api, prepare);
  const { PageIndex, PageSize, Total, List, IsError } = tableData;
  // useEffect(() => {
  //   console.log(query)
  // }, [query]);
  const PageProps = useMemo(() => {
    return pageProps instanceof Object ? pageProps : {};
  }, [pageProps]);
  useImperativeHandle(
    ref,
    () => ({
      getList,
      reloadList,
      data: tableData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getList, tableData, reloadList, Total]
  );
  // 监听tableData的变化
  useEffect(() => {
    // console.log(tableData);
    // 实时更新data给使用者
    typeof onDataChange === "function" && onDataChange(tableData);
  }, [tableData, onDataChange]);
  return (
    <Loading
      spinning={
        outLoading !== undefined
          ? outLoading instanceof Boolean
            ? outLoading
            : false
          : loading
      }
      tip={tip ? tip : "加载中..."}
      opacity={opacity ? opacity : false}
    >
      <div className={`lg-table-box ${className ? className : ""}`}>
        {!IsError && List instanceof Array && List.length > 0 ? (
          <>
            <Table
              dataSource={List}
              pagination={false}
              showSorterTooltip={false}
              onChange={(pagination, filters, sorter, extra) => {
                if(extra.action==='sort')
                handerChange({
                  sortFiled: sorter.columnKey,
                  sortType:
                    sorter.order === "ascend"
                      ? "ASC"
                      : sorter.order === "descend"
                      ? "DESC"
                      : "",
                });
              }}
              className={`lg-table`}
              {...reset}
            ></Table>
            <PagiNation
              showQuickJumper
              showSizeChanger
              // onShowSizeChange={(Current, PageSize) => {
              //   console.log(PageSize);
              //   handerChange({ PageSize });
              // }}
              pageSize={PageSize}
              current={PageIndex}
              hideOnSinglePage={Total === 0 ? true : false}
              total={Total}
              onChange={(pageIndex, pageSize) => {
                handerChange({
                  pageIndex,
                  pageSize:
                    PageProps.showSizeChanger === undefined ||
                    PageProps.showSizeChanger
                      ? pageSize
                      : PageSize,
                });
              }}
              {...PageProps}
            ></PagiNation>
          </>
        ) : (
          <Empty
            className={"lg-table-empty"}
            type={"4"}
            title={"暂无数据"}
          ></Empty>
        )}
      </div>
    </Loading>
  );
}
export default memo(forwardRef($Table));
