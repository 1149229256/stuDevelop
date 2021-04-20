import React, {
  useCallback,
  memo,
  useEffect,
  useState,
  // useImperativeHandle,
  useMemo,
  // useReducer,
  // createContext,
  // useContext,
  useRef,
  forwardRef,
  useLayoutEffect,
} from "react";
import "./index.scss";
import echarts from "echarts/lib/echarts";
// import "echarts/lib/chart/radar";
import "echarts/lib/chart/bar";
import "echarts/lib/component/polar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/chart/radar";
import { resizeForEcharts } from "@/util/public";
import { Dropdown } from "@/component/common";
import {connect} from "react-redux";
import fetch from "../../util/fetch";
import {Empty} from "../../component/common";
import ipConfig from "../../util/ipConfig";
let { BasicProxy } = ipConfig;
/**
 * @description: 暂无数据表明是没有这个系统id或返回错误，加锁是没有权限看,前者权重大于后者
 * @param {*} props
 * @param {*} ref
 * @return {*}
 */
function Data(props, ref) {
    let {
        className,
        userIdentity,
        data,
        currentTerm,
        currentClass,
        userInfo: {UserID, SchoolID},
        setLoadVisible
    } = props;
    const [commentList, setCommentList] = useState({});
    useLayoutEffect(()=>{
    //获取排名信息
    ///api/status/student
    if(!UserID || !currentTerm.term){
      return;
    }
    if(userIdentity != "manager" && !currentClass.classId){
        return;
    }
    setLoadVisible(true);
    let url = BasicProxy + "/api/learning2/comprehensive?type=1" +
    "&studentId=" + UserID + 
    "&classId=" + currentClass.classId +
    "&gradeId=" + currentClass.gradeId +
    "&schoolId=" + SchoolID +
    "&termId=" + currentTerm.term;
    // "&start=" + (currentTerm.termStartDate? 
    // new Date(currentTerm.termStartDate).toLocaleDateString().replaceAll("/", "-"): "2021-01-01") + 
    // "&end=" + (currentTerm.termEndDate?
    // new Date(currentTerm.termEndDate).toLocaleDateString().replaceAll("/", "-"): "2021-03-01");
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>{
        return res.json();
    })
    .then((result)=>{
        if(result.status == 200 && result.data){
          setCommentList(result.data);
        }
        setLoadVisible(false);
    })
  }, [currentClass, UserID, currentTerm]);
  useEffect(() => {
    let xList = [], dataList = [];
    if(!Array.isArray(commentList.qualityItemList) || commentList.qualityItemList.length == 0){
        return;
    }
    commentList.qualityItemList.forEach((item)=>{
        let obj = {
            name: item.itemName,
            max: 100
        };
        xList.push(obj);
        if(item.rank == "A"){
            dataList.push(100);
        } else if(item.rank == "B"){
            dataList.push(80);
        } else if(item.rank == "C"){
            dataList.push(60);
        } else if(item.rank){
            dataList.push(40);
        } else {
            dataList.push(0);
        }
    })
    let myEchart = echarts.init(document.getElementById('evaluate-echart'));
    myEchart.resize();
    let option = {
    //   legend: {
    //       data: xList
    //   },
      grid: {
        top: 0,
        bottom: 0,
        left: 30,
        right: 30,
        containLabel: true
      },
      tooltip: {
        trigger: "item",
        appendToBody: true,
        formatter: function(params){
            let str = params.name + "<br/>";
            commentList.qualityItemList.forEach((item)=>{
                str += params.marker + item.itemName + ": " + item.rank + "<br/>";
            })
            
            return str;
        }
      },
      radar: [
          {
              indicator: xList,
              center: ['50%', '55%'],
              radius: 80,
              startAngle: 90,
              splitNumber: 5,
              shape: 'circle',
              name: {
                //   formatter: '{value}',
                  textStyle: {
                      color: '#999999'
                  }
              },
              splitArea: {
                  areaStyle: {
                      color: ['rgba(15,136,139,0.5)',
                          'rgba(15,136,139,0.4)', 'rgba(15,136,139,0.3)',
                          'rgba(15,136,139,0.2)', 'rgba(15,136,139,0.1)'],
                      shadowColor: 'rgba(0, 0, 0, 0.3)',
                      shadowBlur: 10
                  }
              },
              axisLine: {
                  lineStyle: {
                      color: 'rgba(15,136,139,0.2)'
                  }
              },
              splitLine: {
                  show: false,
              }
          },
      ],
      series: [
          {
              name: '雷达图',
              type: 'radar',
              emphasis: {
                  lineStyle: {
                      width: 2
                  }
              },
              data: [
                  {
                      value: dataList,
                      name: '综合评价',
                      symbol: 'circle',
                      symbolSize: 5,
                      itemStyle: {
                          color: '#52d8d7'
                      },
                      lineStyle: {
                          color: '#39ADAE'
                      }
                  },
              ]
          }
      ]
    }
    myEchart.setOption(option);
    window.addEventListener('resize', function(){
      myEchart.resize();
    })
  }, [commentList])
  return (
    <div className={`card-content card-evaluate ${className ? className : ""}`}>
        {
            !Array.isArray(commentList.qualityItemList) || commentList.qualityItemList.length == 0?
            <Empty
            title={"暂无数据"}
            className="pc-empty"
            type={"3"}
            ></Empty>:
            <div className="evaluate-echart" id="evaluate-echart"></div>
        }
      
    </div>
  );
}
const mapStateToProps = (state) => {
    let { commonData } = state;
    return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(Data)));
