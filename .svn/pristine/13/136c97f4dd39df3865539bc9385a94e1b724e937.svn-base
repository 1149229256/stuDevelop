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
 * @Date: 2020-12-25 10:29:46
 * @LastEditTime: 2020-12-25 10:29:46
 * @Description: 精品课程
 * @FilePath: \teacher-development\src\pages\teachersStatisticAnalysis\teachingAbility\teacherECP.js
 */

import {
  connect,
  // useSelector,
  useDispatch,
} from "react-redux";
import React, {
  // useCallback,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
  useLayoutEffect,
  forwardRef,
} from "react";
import { Tooltip } from "antd";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import {
  resizeForEcharts,
  deepCopy,
  correctNumber,
} from "../../../util/public";
function TeacherEC(props, ref) {
  let {
    className,
    levelHash,
    productMsg,
    data: {
      ECCount,
      AvgCount,
      // AvgUploadUserCount,
      TotalTeacher,
      HasECTeaCount,
      HasECPercent,
      AvgECPercent,
      SubSet,
    },
  } = props;
  productMsg = productMsg ? productMsg : {};
  // echart实例
  // 柱状
  const [subEchart, setSubEchart] = useState(null);

  //
  const [tprRchart, setTprRchart] = useState(null);
  const [tplRchart, setTplRchart] = useState(null);
  // dom ref
  const tprRef = useRef(null);
  const tplRef = useRef(null);
  const subRef = useRef(null);
  useLayoutEffect(() => {
    if (HasECPercent === undefined || HasECTeaCount === undefined) {
      return;
    }
    let myEchart_tpr = tprRchart;
    let myEchart_sub = subEchart;
    let myEchart_tpl = tplRchart;
    let color = [
      "#0a407d",
      "#49aaea",
      // "#2edba3",
      // "#fbb458",
      "#fd8273",
      "#3fb43f",
      "#e84855",
      "#e58d4c",
      "#2d3047",
      "#71add8",
    ];

    let dataset_tpl = [
      ["nodeName", "Count"],
      [
        "拥有精品课程",
        HasECTeaCount,
        // "拥有精品课程人数比例",
        HasECPercent,
        // "教师总人数",
        TotalTeacher,
        // "拥有精品课程人数",
        HasECTeaCount,
      ],
      [
        "未拥有精品课程",
        TotalTeacher - HasECTeaCount,
        HasECPercent,
        // "教师总人数",
        TotalTeacher,
        // "拥有精品课程人数",
        HasECTeaCount,
      ],
    ];
    let dataset_tpr = [
      ["nodeName", "Count"],
      [
        "高于人均课程精品",
        // AvgCount,
        AvgECPercent,
        HasECPercent,
        // "教师总人数",
        TotalTeacher,
        // "拥有精品课程人数",
        HasECTeaCount,
      ],
      [
        "人均课程精品",
        1 - Number(AvgECPercent),
        // Number(AvgECPercent)&& (Number(AvgCount) / Number(AvgECPercent)) * (1 - Number(AvgECPercent)),
        HasECPercent,
        // "教师总人数",
        TotalTeacher,
        // "拥有精品课程人数",
        HasECTeaCount,
      ],
    ];
    let labelColor = {};
    let labelSize = {};
    color.forEach((child, index) => {
      labelColor[`${index}`] = { color: child, fontSize: 12 };
      labelSize[`${index}16`] = { color: child, fontSize: 16 };
    });
    let dataset_sub = [["nodeName", "平均年龄", "平均教龄"]];
    let pieOption = {
      dataset: { source: [] },
      // title: {
      //   text: "教师年龄段人数分布",
      //   bottom: "7%",
      //   left: "center",
      //   // top: 180,
      //   textStyle: {
      //     color: "#333333",
      //     fontSize: 14,
      //   },
      // },
      tooltip: {
        // appendToBody: true,
        trigger: "item",
        backgroundColor: "rgba(0,0,0,0.7)",
        formatter: (params) => {
          let { data } = params;
          return `<div  class="t-tooltip">
                <p class="nodename" style='color:#fffd64;margin-bottom:0px'>拥有精品课程人数比例<span style='color:#fffd64;font-size:14px'>${parseInt(
                  !isNaN(data[2]) ? correctNumber(data[2] * 100) : 0
                )}</span>%</p>
                <p class="nodename" style='position:relative;color:#cccccc;margin-bottom:0px;padding-left: 12px;'  ><i style='position: absolute;
                width: 5px;
                height: 5px;
                left: 0;
                border-radius: 50%;
                background-color: #ffffff;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                -ms-border-radius: 50%;
                -o-border-radius: 50%;
                top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);'></i>教师总人数<span style='color:#ffffff; '>${
      data[3]
    }人</span></p>
          <p class="nodename" style='position:relative;color:#cccccc;margin-bottom:0px;padding-left: 12px;'   style='color:#ffffff; '>
          <i style='position: absolute;
                width: 5px;
                height: 5px;
                left: 0;
                border-radius: 50%;
                background-color: #ffffff;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                -ms-border-radius: 50%;
                -o-border-radius: 50%;
                top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);'></i>拥有精品课程人数<span>${
      data[4]
    }人</span></p> </div>
            `;
        },

        textStyle: {
          // color: "#fffd64",
        },
      },
      grid: {
        height: 200,

        containLabel: false,
      },
      legend: {
        show: false,
        // orient: "vertical",
        // left: 155,
        // top: 40,
        // itemWidth: 11,
        // itemHeight: 11,
        // textStyle: {
        //   color: "#999",
        // },
      },
      color: color,
      series: [
        {
          name: "精品课程制作参与率",
          type: "pie",
          radius: ["40%", "75%"],
          minAngle:4,
          top: 10,
          height: "90%",
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
            shadowColor: "rgba(0, 0, 0, 0.15)",
            shadowBlur: 7,
          },
          avoidLabelOverlap: true,
          label: {
            show: false,
            // color: null,
            formatter: (params) => {
              let colorIndex = 0;
              let sizeIndex = 0;
              color.forEach((child, index) => {
                if (child === params.color) {
                  colorIndex = index;
                  sizeIndex = index + "16";
                }
              });

              return `{${colorIndex}|${params.name}}\n{${sizeIndex}|${params.value[1]}}{${colorIndex}|人}`;
            },
            rich: {
              ...labelColor,
              ...labelSize,
            },
          },
        },
      ],
    };
    SubSet instanceof Array &&
      SubSet.forEach((child, index) => {
        let { NodeName, TotalTeacher, HasECTeaCount, HasECPercent } = child;
        dataset_sub.push([NodeName, HasECPercent, TotalTeacher, HasECTeaCount]);
      });
    let subOption = {
      dataZoom: {
        type: "slider",
        show: dataset_sub.length > 6,
        // xAxisIndex: [0],
        // start: 0,
        // end: 10/(dataset.length-1)*100,
        minSpan: (4 / (dataset_sub.length - 1)) * 100,
        maxSpan: (4 / (dataset_sub.length - 1)) * 100,
        zoomLock: true,
        showDetail: false,
        showDataShadow: false,
        height: 8,
        bottom: 0,
      },
      title: {
        text: "各" + productMsg.sub + "统计信息",
        // bottom: "4%",
        left: "center",
        top: 20,
        textStyle: {
          color: "#333333",
          fontSize: 14,
        },
      },
      // backgroundColor: "#f5f5f5",
      tooltip: {
        trigger: "axis",
        // appendToBody:true,

        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
        backgroundColor: "rgba(0,0,0,0.7)",
        borderColor: "transparent",
        borderWidth: 0,
        formatter: (params) => {
          let row = params[0];
          let { data } = row;

          return `<div  class="t-tooltip">
                <p class="nodename">拥有精品课程人数比例${parseInt(
                  correctNumber(data[1] * 100)
                )}%</p><p class='msg msg-2'>教师总人数<span>${
            data[2]
          }人</span></p><p class='msg msg-2'>拥有精品课程人数<span>${
            data[3]
          }人</span></p> </div>
            `;
        },
        // textStyle: {
        //   color: "#fff",
        // },
      },
      legend: {
        // data: ["男性教师", "女性教师"],
        show: false,
        // right: 50,
        // top: 40,
        // itemWidth: 11,
        // itemHeight: 11,
        // itemGap: 30,
        // // formatter: (id) => {
        // //   return `{name|${sexData[id].title}:}{count|${sexData[id].value}}{name|人}`;
        // // },
        // textStyle: {
        //   rich: {
        //     name: {
        //       fontSize: 12,
        //       color: "#999999",
        //     },
        //     count: {
        //       fontSize: 14,
        //       fontWeight: "bold",
        //       color: "#333",
        //     },
        //   },
        // },
      },
      grid: {
        left: 28,
        height: 180,
        right: 58,
        bottom: 20,
        containLabel: true,
      },
      dataset: {
        source: [],
      },
      xAxis: [
        {
          type: "category",
          name: productMsg.sub,
          nameGap: 12,
          // data: [
          //   "幼儿园教师",
          //   "小学教师",
          //   "初中教师",
          //   "高中教师",
          //   "中专教师 ",
          //   "中职教师",
          // ],

          nameTextStyle: {
            color: "#7c7c7c",
            fontSize: 12,
          },
          axisTick: {
            //刻度线
            show: false,
          },
          axisLine: {
            //x轴
            show: false,
            lineStyle: {
              // color:'#e6e6e6',
              // opacity:0.5
            },
          },
          axisLabel: {
            color: "#7c7c7c",
            fontSize: 12,
            formatter: (value) => {
              let data = value;
              if (typeof value === "string" && value.length > 6) {
                data = value.slice(0, 4) + "...";
              }
              return data;
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "拥有精品课程人数比例",
          max: 1,
          axisLabel: {
            color: "#7c7c7c",
            fontSize: 12,
            margin: 20,
            formatter: (value) => {
              return `${value * 100}%`;
            },
          },

          nameTextStyle: {
            color: "#7c7c7c",
            fontSize: 12,

            padding: [0, 0, 0, 120],
          },
          nameGap: 20,
        },
      ],
      series: [
        {
          // name: "女性教师",
          type: "bar",
          barGap: "4%",
          // barWidth: 5,
          barMaxWidth: 24,
          itemStyle: {
            color: {
              type: "linear",
              x: 1,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: "#7ecbff", // 0% 处的颜色
                },

                {
                  offset: 1,
                  color: "#1da4fe", // 100% 处的颜色
                },
              ],
            },
            borderRadius: [3, 3, 0, 0],
          },
          // data: [120, 132, 101, 134, 90, 230, 210],
        },
      ],
    };

    // TeachAgeList instanceof Array &&
    //   TeachAgeList.forEach((child, index) => {
    //     let { NodeName, Total } = child;
    //     dataset_tpr.push([NodeName, Total]);
    //   });

    if (!myEchart_tpr) {
      // 数据更新后，防止二次初始化echarts，第一次进来初始化echarts
      myEchart_tpr = echarts.init(tprRef.current);
      // 保存echart实例
      setTprRchart(myEchart_tpr);
      // 对界面resize进行监听重绘echart
      resizeForEcharts(myEchart_tpr);
    }
    if (!myEchart_tpl) {
      // 数据更新后，防止二次初始化echarts，第一次进来初始化echarts
      myEchart_tpl = echarts.init(tplRef.current);
      // 保存echart实例
      setTplRchart(myEchart_tpl);
      // 对界面resize进行监听重绘echart
      resizeForEcharts(myEchart_tpl);
    }
    if (!myEchart_sub) {
      // 数据更新后，防止二次初始化echarts，第一次进来初始化echarts
      myEchart_sub = echarts.init(subRef.current);
      // 保存echart实例
      setSubEchart(myEchart_sub);
      // 对界面resize进行监听重绘echart
      resizeForEcharts(myEchart_sub);
    }
    let tprOption = deepCopy(pieOption);
    let tplOption = deepCopy(pieOption);

    tprOption.dataset.source = dataset_tpr;
    tprOption.tooltip.show = false;
    tplOption.dataset.source = dataset_tpl;
    // tprOption.title.text = "教师教龄段人数分布";

    subOption.dataset.source = dataset_sub;

    // 设置option
    // myEchart_avg.setOption(avgOption);
    myEchart_tpr.setOption(tprOption);
    myEchart_tpl.setOption(tplOption);
    myEchart_sub.setOption(subOption);
    return () => {
      // 卸载echarts实例的事件
      // myEchart_avg.off();
      myEchart_tpr.off();
      myEchart_tpl.off();
      myEchart_sub.off();
    };
    // 依赖数据的变化重绘界面
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SubSet, productMsg]);

  return (
    <div className={`teacher-bar TeacherEC ${className ? className : ""} `}>
      <div className="ter-left">
        <p className="tb-tip">
          精品课程数量<span className="tb-tip-2">{ECCount}</span>
          节，人均拥有
          <span className="tb-tip-2">{AvgCount}</span>
          节精品课程
        </p>
        <div className="ter-pie-left">
          <div ref={tplRef} className="ter-echarts"></div>
          <p className="ter-all">
            <span>{correctNumber(HasECPercent * 100)}</span>%
          </p>
          <p className="ter-title">
            拥有精品课程人数比例
            <Tooltip
              title="疑问"
              color={"#0249a5"}
              overlayClassName="show-detail"
              getPopupContainer={(e) => e.parentNode}
              trigger={["hover"]}
            >
              <i className="tb-show-detail" onClick={() => {}}></i>
            </Tooltip>
          </p>
        </div>
        <div className="ter-pie-right">
          <div ref={tprRef} className="ter-echarts"></div>
          <p className="ter-all">
            <span>{correctNumber(AvgECPercent * 100)}</span>%
          </p>
          <p className="ter-title">
            人均课程精品率
            <Tooltip
              title="疑问"
              color={"#0249a5"}
              overlayClassName="show-detail"
              getPopupContainer={(e) => e.parentNode}
              trigger={["hover"]}
            >
              <i className="tb-show-detail" onClick={() => {}}></i>
            </Tooltip>
          </p>
        </div>
      </div>

      <div ref={subRef} className="tb-right ter-right"></div>
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: { levelHash },
  } = state;
  return { levelHash };
};
export default connect(mapStateToProps)(memo(forwardRef(TeacherEC)));
