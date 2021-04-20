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
 * @Date: 2020-12-29 16:47:13
 * @LastEditTime: 2021-01-05 10:00:20
 * @Description:
 * @FilePath: \teacher-development\src\pages\teachersStatisticAnalysis\historyModal.js
 */

import React, {
  useCallback,
  memo,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  forwardRef,
} from "react";
import { Modal } from "../../component/common";
import { deepMap, resizeForEcharts,changeToArray } from "../../util/public";
import echarts from "echarts/lib/echarts";

import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
function HistoryModal(props, ref) {
  // *data:数据，结构看下面对data处理
  // *visible:控制弹窗的显示，
  // *title：弹窗的头部文案
  // *childKey:data有下级的时候的键,可缺省，默认为children
  // *类型选择名字，可缺省，默认类型选择
  let {
    title,
    visible,
    data,
    childKey,
    color,
    width,
    typeName,
    className,
    onClose,
  } = props;
  // 控制显示
  const [Visible, setVisible] = useState(visible ? true : false);
  // 处理后的数据
  const [Source, setSource] = useState([]);
  // 类型选择
  const [TypeSelect, setTypeSelect] = useState(0);
  // 展示的数据选择
  const [SourceSelect, setSourceSelect] = useState([]);
 
  // 柱状

 
  // 处理颜色
  const colors = useMemo(() => {
    return (
      color || [
        "#30a0f6",
        "#fbb458",
        "#fd8273",
        "#3fb43f",
        "#e84855",
        "#e58d4c",
        "#2d3047",
        "#71add8",
      ]
    );
  }, [color]);
  useEffect(() => {
    setVisible(!!visible);
  }, [visible]);
  // 对data进行处理
  useEffect(() => {
    if (data !== undefined && !(data instanceof Array)) {
      return;
    }
    const myData = data || [
      {
        nodeName: "全部",
        nodeID: "all",
        titleList: [
          ["", "年", "教师人均周课时", "节次"],
          ["人均总课时", "节"],
          ["人均任教班级", "个"],
          ["人均任教学生", "人"],
        ],
        xName: "周课时数",
        yName: "年份",
        source: [], //数据源
        type: ["测试1", "测试2"], //多个数据时候的名称lengen
        children: [
          {
            nodeName: "2018",
            nodeID: 2018,
            dataList: [["2018", "初中学段", "21"], ["150"], ["2"], ["60"]],
            source: [70, 65],
          },
          {
            nodeName: "2019",
            nodeID: 2019,
            dataList: [["2019", "初中学段", "21"], ["150"], ["2"], ["60"]],
            source: [60, 30],
          },
          {
            nodeName: "2020",
            nodeID: 2020,
            dataList: [["2020", "初中学段", "21"], ["150"], ["2"], ["60"]],
            source: [85, 40],
          },
        ],
      },
      {
        nodeName: "类型2",
        nodeID: "all1",
        titleList: [
          ["", "年", "教师人均周课时", "节次"],
          ["人均总课时", "节"],
          ["人均任教班级", "个"],
          ["人均任教学生", "人"],
        ],
        xName: "周课时数",
        yName: "年份",
        type: ["测试1", "测试2"], //多个数据时候的名称lengen
        children: [
          {
            nodeName: "2018",
            nodeID: 2018,
            dataList: [["2018", "初中学段", "21"], ["150"], ["2"], ["60"]],
            source: [10, 300],
          },
          {
            nodeName: "2019",
            nodeID: 2019,
            dataList: [["2019", "初中学段", "21"], ["150"], ["2"], ["60"]],
            source: [50, 60],
          },
          {
            nodeName: "2020",
            nodeID: 2020,
            dataList: [["2020", "初中学段", "21"], ["150"], ["2"], ["60"]],
            source: [20, 70],
          },
        ],
      },
      {
        nodeName: "类型3",
        nodeID: "all3",
        titleList: [
          ["", "年", "教师人均周课时", "节次"],
          ["人均总课时", "节"],
          ["人均任教班级", "个"],
          ["人均任教学生", "人"],
        ],
        xName: "周课时数",
        yName: "周课时数",
        type: ["测试1"], //多个数据时候的名称lengen
        children: [
          {
            nodeName: "2018",
            nodeID: 2018,
            dataList: [
              ["2018", "初中学段", "21"],
              ["<span class='title-2'>150</span>"],
              ["2"],
              ["60"],
            ],
            source: [10, 300],
          },
          {
            nodeName: "2019",
            nodeID: 2019,
            dataList: [["2019", "初中学段", "21"], ["150"], ["2"], ["60"]],
            source: [50, 60],
          },
          {
            nodeName: "2020",
            nodeID: 2020,
            dataList: [["2020", "初中学段", "21"], ["150"], ["2"], ["60"]],
            source: [20, 70],
          },
        ],
      },
    ];
    // 先判断有几层，一层不要类型选择，二层要
    let haveChald = false; //控制后面的数据加层,false加
    let source_level_2 = [];
    // let source_level_1 = []; //当只有一级的时候使用这个
    let source_level_1 = [
      {
        nodeName: "全部",
        nodeID: "all",
        xName: "x坐标轴",
        yName: "y坐标轴",
        children: [],
      },
    ]; //一层的时候默认的第一级
    let typeList = []; //做类型选择
    let typeIndex = -1; //第一层位置
    // let dataIndex = -1; //第二层位置
    // 处理方法,合成tooltip的title
    const handleSource = ({
      nodeName,
      nodeID,
      titleList,
      dataList,
      source,
      xName,
      yName,
      ...other
    }) => {
      // 没有用第一级的
      titleList = titleList || typeList[typeIndex].titleList || [];
      dataList = dataList || [];
      xName = xName || "x坐标轴";
      yName = yName || "y坐标轴";
      let tooltip = [];
      let maxLen =
        titleList.length > dataList.length ? titleList.length : dataList.length; //最长长度
      // 处理tooltip
      for (let i = 0; i < maxLen; i++) {
        // 第一级是行，第二级才拼起来，需要保持一样长度
        let title = changeToArray(titleList[i]); //转化为数组
        let data = changeToArray(dataList[i]);
        let maxLen2 = title.length > data.length ? title.length : data.length; //最长长度
        let culunm = [];
        for (let j = 0; j < maxLen2; j++) {
          culunm.push(title[j]);
          culunm.push(data[j]);
        }
        tooltip.push(culunm);
      }
      return {
        nodeName,
        nodeID,
        tooltip,
        source: changeToArray(source),
        xName,
        yName,
        ...other,
      };
    };
    deepMap(
      myData,
      ({ child, level, parent, indexArray }) => {
        let { nodeName, nodeID, titleList, xName, yName, type } = child;
        // 第一层
        if (level === 1) {
          typeIndex++;
          // dataIndex = 0;
          typeList[typeIndex] = {
            nodeName,
            nodeID,
            titleList: titleList,
            type: changeToArray(type),
          };
          source_level_2[typeIndex] = {
            nodeName,
            xName,
            yName,
            nodeID,
            type: changeToArray(type),
            children: [],
          };

          source_level_1[0].xName = xName || source_level_1[0].xName;
          source_level_1[0].yName = yName || source_level_1[0].yName;
          source_level_1[0].children.push(handleSource(child));
        }

        if (level === 2) {
          source_level_2[typeIndex].children.push(handleSource(child));

          // 干煸状态
          // dataIndex++;
          haveChald = true;
        }
      },
      childKey || "children"
    );
    if (!haveChald) {
      //一层，替换source
      // typeList_level_1[0].children = source_level_1;
      source_level_2 = source_level_1;
    }

    setTypeSelect(0);
    setSourceSelect(source_level_2[0].children);
    setSource(source_level_2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, childKey]);
  // 进行echarts 的挂载
 

  // 处理为数组
  const changeToArray = useCallback((param) => {
    let end = [];
    if (!(param instanceof Array)) {
      // if (!param) {
      //   end = [];
      // }
      if (typeof param === "object") {
        for (let i in param) {
          end.push(param[i]);
        }
      } else if (typeof param === "string") {
        end = [param];
      } else {
        end = [];
      }
    } else {
      end = param;
    }
    return end;
  }, []);

  // useImperativeHandle(ref,()=>({
  //   controlVisible:(bool)=>{
  //     setVisible(!!bool)
  //   }
  // }))
  return (
    <Modal
      className={`HistoryModal ${className ? className : ""}`}
      footer={null}
      type={"4"}
      visible={Visible}
      width={width || 886}
      title={title ? title : "历年人均"}
      onCancel={() => {
        setVisible(false);
        onClose(false);
      }}
    >
      {Visible ? (
        <>
          {Source.length > 1 ? (
            <p className="type-label">
              <span className="type-name">{typeName || "类型选择"}:</span>
              {Source.map((child, index) => {
                return (
                  <span
                    key={index}
                    onClick={() => {
                      setTypeSelect(index);
                      setSourceSelect(Source[index]);
                    }}
                    className={`type-select ${
                      index === TypeSelect ? "type-select-active" : ""
                    }`}
                  >
                    {child.nodeName}
                  </span>
                );
              })}
            </p>
          ) : (
            <div style={{height:'40px'}}></div>
          )}

          {/* <div ref={echartsRef} className="teacher-bar hm-echarts">
      
          </div> */}
          <MyEcharts
            colors={colors}
            Source={Source}
            Visible={Visible}
            TypeSelect={TypeSelect}
          ></MyEcharts>
        </>
      ) : (
        ""
      )}
    </Modal>
  );
}
function MyEcharts(props) {
  let { colors, Source, Visible, TypeSelect } = props;
  // 柱状

  let [myEchart, setMyEchart] = useState(null);

  // echartref
  const echartsRef = useRef(null);

  // 进行echarts 的挂载
  useLayoutEffect(() => {
    if (!Visible || Source.length === 0 || !echartsRef.current) {
      return;
    }
    if (!myEchart) {
      // 数据更新后，防止二次初始化echarts，第一次进来初始化echarts
      // eslint-disable-next-line react-hooks/exhaustive-deps
      myEchart = echarts.init(echartsRef.current);
      // 保存echart实例
      setMyEchart(myEchart);
      // 对界面resize进行监听重绘echart
      resizeForEcharts(myEchart);
    }
    let source = Source[TypeSelect];
    let data = [["nodename", ...source.type]];
    let series = [];
    source.children.forEach((child) => {
      let tooltip = "";
      child.tooltip.forEach((tip, index) => {
        tip = changeToArray(tip);
        let title = "";
        tip.forEach((data) => {
          title += data || "";
        });
        if (index === 0) {
          tooltip += `<p class="nodename">${title}</p>`;
        } else {
          tooltip += `<p class='msg msg-2'>${title}</p>`;
        }
      });
      data.push([child.nodeName, ...child.source, tooltip]);
    });
    source.type.forEach((child, index) => {
      series.push({
        type: "line",
        // xAxisIndex: 1,
        smooth: true,
        symbolSize: 7,
        showSymbol: false,
      });
    });
    let option = {
      dataset: {
        source: data,
      },
      color: colors,

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        backgroundColor: "rgba(0,0,0,0.7)",
        borderColor: "transparent",
        borderWidth: 0,
        formatter: (params) => {
          return `<div class='t-tooltip'>${
            params[0].data[params[0].data.length - 1]
          }</div>`;
        },
      },

      legend: {
        show: source.type.length > 1,
        right: 50,
        top: 0,
        // itemWidth: 11,
        // itemHeight: 11,
        itemGap: 30,
        // formatter: (id) => {
        //   return `{name|${sexData[id].title}:}{count|${sexData[id].value}}{name|人}`;
        // },
        textStyle: {
          rich: {
            name: {
              fontSize: 12,
              color: "#999999",
            },
            count: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            },
          },
        },
      },
      grid: {
        top: 30,
        // bottom: 20,
        right: 80,
        left: 40,
        containLabel: true,
        height: 330,
      },
      xAxis: {
        type: "category",
        name: source.xName,
        axisTick: {
          show: true,
          inside: true,
          alignWithLabel: true,
          length: 305,
          lineStyle: {
            color: "#e5e5e5",
          },
        },
        axisLine: {
          // onZero: false,
          lineStyle: {
            color: "#cccccc",
          },
        },
        nameTextStyle: {
          color: "#b8b8b8",
        },
        axisLabel: {
          color: "#666666",
          fontSize: 12,
          margin: 13,
        },
        splitLine: {
          show: false,
        },
      },

      yAxis: {
        type: "value",
        name: source.yName,
        axisLine: { show: false },
        nameTextStyle: {
          color: "#b8b8b8",
          align: "left",
        },
        axisLabel: {
          color: "#b8b8b8",
          margin: 20,
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },

      series: series,
    };

    // option.dataset.source = dataList;

    // 设置option
    myEchart.setOption(option);
    return () => {
      // 卸载echarts实例的事件

      myEchart.off();
    };
  }, [Source, Visible, TypeSelect]);
 
 return  <div ref={echartsRef} className="teacher-bar hm-echarts"></div>;
}
export default memo(forwardRef(HistoryModal));
