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
 * @Description: 电子教案
 * @FilePath: \teacher-development\src\pages\teachersStatisticAnalysis\teachingAbility\teacherTP.js
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
import { resizeForEcharts, deepCopy } from "../../../util/public";
function TeacherOnline(props, ref) {
  let {
    className,
    levelHash,
    productMsg,
    data: {
      TPCount,
      AvgUploadTPCount,
      AvgUploadUserCount,
      TotalTeacher,
      HasUploadedCount,
      NoUploadedCount,
      UploadedPercent,
      SubSet,
 
    },
  } = props;
  productMsg = productMsg ? productMsg : {};
  // echart实例
  // 柱状
  const [subEchart, setSubEchart] = useState(null);

  //
  // dom ref
  const subRef = useRef(null);
  useLayoutEffect(() => {
    if(NoUploadedCount===undefined||HasUploadedCount===undefined){
      return;
    }
    let myEchart_sub = subEchart;
    

  
    let labelColor = {};
    let labelSize = {};
 
    let dataset_sub = [["nodeName", "平均在线办公时长", "平均在线教学时长"]];
    SubSet instanceof Array &&
    SubSet.forEach((child, index) => {
      let {
        NodeName,
        TotalTeacher,
        HasUploadedCount,
        UploadedPercent,
      } = child;
      dataset_sub.push([
        NodeName,
        TotalTeacher,
        HasUploadedCount,
        TotalTeacher,

      ]);
    });
    let subOption = {
      // title: {
      //   text: "各" + productMsg.sub + "统计信息",
      //   // bottom: "4%",
      //   left: "center",
      //   top: 20,
      //   textStyle: {
      //     color: "#333333",
      //     fontSize: 14,
      //   },
      // },
      // backgroundColor: "#f5f5f5",
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
          let { data ,name} = row;

          return `<div  class="t-tooltip">
                <p class="nodename">${
                  name
                }</p><p class='msg msg-2'>在线办公<span>${
            data[1]
          }小时</span></p><p class='msg msg-2'>在线教学<span>${
            data[2]
          }小时</span></p></div>
            `;
        },
        // textStyle: {
        //   color: "#fff",
        // },
      },
      legend: {
        // data: ["男性教师", "女性教师"],
        show: true,
        right: 50,
        top: 0,
        itemWidth: 11,
        itemHeight: 11,
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
          color: "#999999",
        },
      },
      grid: {
        left: 58,
        height: 175,
        right: 88,
        bottom: 0,
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
          name: "时长",
          // max: 1,
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

            padding: [0, 0, 0, 100],
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
          barMaxWidth:32,
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
                  color: "#ffb782", // 0% 处的颜色
                },
                {
                  offset: 0.5,
                  color: "#fba768", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#f7964e", // 100% 处的颜色
                },
              ],
            },
            borderRadius: [3, 3, 0, 0],
          },
          // data: [120, 132, 101, 134, 90, 230, 210],
        },{
          // name: "女性教师",
          type: "bar",
          barGap: "4%",
          // barWidth: 5,
          barMaxWidth:32,
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
                  color: "#a0dea0", // 0% 处的颜色
                },
                 
                {
                  offset: 1,
                  color: "#51ca51", // 100% 处的颜色
                },
              ],
            },
            borderRadius: [3, 3, 0, 0],
          },
        }
      ],
    };

    // TeachAgeList instanceof Array &&
    //   TeachAgeList.forEach((child, index) => {
    //     let { NodeName, Total } = child;
    //     dataset_ta.push([NodeName, Total]);
    //   });
   
    // if (!myEchart_avg) {
    //   // 数据更新后，防止二次初始化echarts，第一次进来初始化echarts
    //   myEchart_avg = echarts.init(avgRef.current);
    //   // 保存echart实例
    //   setAvgEchart(myEchart_avg);
    //   // 对界面resize进行监听重绘echart
    //   resizeForEcharts(myEchart_avg);
    // }
     
    if (!myEchart_sub) {
      // 数据更新后，防止二次初始化echarts，第一次进来初始化echarts
      myEchart_sub = echarts.init(subRef.current);
      // 保存echart实例
      setSubEchart(myEchart_sub);
      // 对界面resize进行监听重绘echart
      resizeForEcharts(myEchart_sub);
    }

    // taOption.title.text = "教师教龄段人数分布";

    subOption.dataset.source = dataset_sub;

    // 设置option
    // myEchart_avg.setOption(avgOption);
    myEchart_sub.setOption(subOption);
    return () => {
      // 卸载echarts实例的事件
      // myEchart_avg.off();
      myEchart_sub.off();
    };
    // 依赖数据的变化重绘界面
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SubSet, productMsg]);

  return (
    <div className={`teacher-bar TeacherOnline ${className ? className : ""} `}>
       <div className="tb-top">
        <p className="tb-tip">
          {productMsg && productMsg.title ? productMsg.title : ""}
          每人每日平均在线办公<span className="tb-tip-2">{TPCount}</span>
          次，共
          <span className="tb-tip-2">{AvgUploadTPCount}</span>小时；每人每日平均在线教学
          <span className="tb-tip-2">{AvgUploadUserCount}</span>次，共
          <span className="tb-tip-2">{TotalTeacher}</span>小时
        </p>
        <p className="tp-tilte">各{productMsg.sub}教师每日办公教学\办公统计信息</p>
        
      </div>

      <div ref={subRef} className="tb-charts"></div>
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: { levelHash },
  } = state;
  return { levelHash };
};
export default connect(mapStateToProps)(memo(forwardRef(TeacherOnline)));
