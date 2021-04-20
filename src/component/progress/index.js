import React, {
    useState,
    useEffect,
    memo,
    forwardRef
} from 'react';
import "./index.scss";
function Progress(props){
    let {
        step,
        max,
        percent,
        className,
        width,
        bgColor,
        barWidth
    } = props;
    let progressBarList = [];
    step = step? step: 25; //小方块总个数
    max = max? max: 100;  //最大值
    percent = percent? percent: 0;  //当前值
    let activeBarCount = parseInt(step * (percent / max)); //高亮的方块个数
    for(let i = 0; i < step; i++){
      let active = false;
      if(i < activeBarCount){
        active = true;
      }
      progressBarList.push(
        <div
        className={"progress-bar " + (active? "active": "")}
        style={{
          width: (barWidth? barWidth: `${(100 / step)}%`),
        }}
        ></div>
      )
    }
    return (
      <div 
      className={"my-progress " +(className? className: "")}
      id="my-progress" style={{
      width: (width? width: ""),
      backgroundColor: (bgColor? bgColor: ""),
      }}>
        <div 
        className="my-progress-bg" 
        style={{
        width: (
            barWidth? 
            activeBarCount*barWidth: 
            activeBarCount*(100 / step) + "%"
        )}}></div>
        {progressBarList}
      </div>
    )
}

export default Progress;