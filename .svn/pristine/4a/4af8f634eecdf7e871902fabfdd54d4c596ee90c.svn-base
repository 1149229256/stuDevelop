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
 * @Description: 电子督课
 * @FilePath: \teacher-development\src\pages\teachersStatisticAnalysis\teachingAbility\teacherECourseP.js
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
// import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import { resizeForEcharts, deepCopy } from "../../../util/public";
function TeacherECourse(props, ref) {
  let {
    className,
    levelHash,
    productMsg,
    data: {
      AvgScore,

      SubSet,
    },
  } = props;
  productMsg = productMsg ? productMsg : {};
  // echart实例
  // 柱状
  const [subEchart, setSubEchart] = useState(null);

  const subRef = useRef(null);
  useLayoutEffect(() => {
    let myEchart_sub = subEchart;

    let dataset_sub = [["nodeName", "平均年龄", "平均教龄"]];
    SubSet instanceof Array &&
    SubSet.forEach((child, index) => {
      let { NodeName, AvgScore } = child;
      dataset_sub.push([NodeName, AvgScore]);
    });
    let subOption = {
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
          let { data, name } = row;

          return `<div  class="t-tooltip">
                <p class="nodename">${name}</p><p class='msg  '>评估得分:<span>${data[1]}</span></p>  </div>
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
      dataZoom: {
        type: "slider",
        show: dataset_sub.length>6,
        // xAxisIndex: [0],
        // start: 0,
        // end: 10/(dataset.length-1)*100,
        minSpan: (4 /(dataset_sub.length-1  )) * 100,
        maxSpan: (4 /(dataset_sub.length-1  )) * 100,
        zoomLock: true,
        showDetail: false,
        showDataShadow: false,
        height: 8,
        bottom: 0,
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
          name: "评估得分",
          max: 5,
          axisLabel: {
            color: "#7c7c7c",
            fontSize: 12,
            margin: 20,
            // formatter: (value) => {
            //   return `${value * 100}%`;
            // },
          },

          nameTextStyle: {
            color: "#7c7c7c",
            fontSize: 12,

            padding: [0, 0, 0, 50],
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
                  color: "#ffe88a", // 0% 处的颜色
                },

                {
                  offset: 1,
                  color: "#ffb709", // 100% 处的颜色
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
   

    if (!myEchart_sub) {
      // 数据更新后，防止二次初始化echarts，第一次进来初始化echarts
      myEchart_sub = echarts.init(subRef.current);
      // 保存echart实例
      setSubEchart(myEchart_sub);
      // 对界面resize进行监听重绘echart
      resizeForEcharts(myEchart_sub);
    }

    subOption.dataset.source = dataset_sub;

    // 设置option

    myEchart_sub.setOption(subOption);
    return () => {
      // 卸载echarts实例的事件

      myEchart_sub.off();
    };
    // 依赖数据的变化重绘界面
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SubSet, productMsg]);

  return (
    <div
      className={`teacher-bar TeacherECourse ${className ? className : ""} `}
    >
      <div className="ter-left">
        <p className="tb-tip">教师总体平均估值得分:</p>
        <div className="ter-echarts">
          {[1, 2, 3, 4, 5].map((child, index) => {
            let width = 54;
            if (child >= AvgScore + 1) {
              width = 0;
            } else if (child - AvgScore < 1&&child - AvgScore>0) {
              width = width * (AvgScore + 1 - child);
            }
            return (
              <span className="pentacle" key={index}>
                <span
                  className="pentacle-active"
                  style={{ width: width + "px" }}
                ></span>
              </span>
            );
          })}
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
export default connect(mapStateToProps)(memo(forwardRef(TeacherECourse)));
