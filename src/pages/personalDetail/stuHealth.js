import React, {
    useCallback,
    memo,
    useEffect,
    useState,
    // useImperativeHandle,
    // useMemo,
    // useReducer,
    // createContext,
    // useContext,
    useRef,
    forwardRef,
    useLayoutEffect,
  } from "react";
  import Progress from "@/component/progress";
  import { Loading } from "../../component/common";
  import "./index.scss";
  
  /**
   * @description: 暂无数据表明是没有这个系统id或返回错误，加锁是没有权限看,前者权重大于后者
   * @param {*} props
   * @param {*} ref
   * @return {*}
   */
  function StuHealth(props, ref) {
    let {
      className,
      data,
      userIdentity,
    } = props;
    return (
      <div className={`card-content card-health ${className ? className : ""}`}>
        {
          userIdentity == "student"?
          <div>
            <p className="info-one">
              日常运动频率:<span>1次/天</span>
            </p>
            <p className="info-one">
              病假率:<span>9%</span>
            </p>
          </div>:
          ""
        }
        {/* <p className="info-one" style={{
            position: 'relative',
            top: '5px'
        }}>
            日常运动频率:<span>78分</span>
        </p>
        <p className="info-one" style={{
            position: 'relative',
            top: '5px'
        }}>
            病假率:<span>78分</span>
        </p> */}
        <div className="slice-line" style={{margin: '14px 0'}}></div>
        <div style={{marginBottom: 15}}>
            {/* <p className="grade-one" style={{display: 'block'}}>
                体质平均分数:<span>78分</span>
            </p> */}
            <div className="progress-container">
                <span className="grade-name">体重指数</span>
                <Progress
                className="grade-progress"
                percent={45} 
                step={25}
                width={114}
                max={100} />
                <span className="grade-num"><span>10</span>分</span>
            </div>
            <div className="progress-container">
                <span className="grade-name">视力</span>
                <Progress
                className="grade-progress"
                percent={20} 
                step={25}
                width={114}
                max={100} />
                <span className="grade-num"><span>10</span>分</span>
            </div>
            <div className="progress-container">
                <span className="grade-name">肺活量</span>
                <Progress
                className="grade-progress"
                percent={20} 
                step={25}
                width={114}
                max={100} />
                <span className="grade-num"><span>10</span>分</span>
            </div>
            <div className="progress-container">
                <span className="grade-name">50米跑</span>
                <Progress
                className="grade-progress"
                percent={20} 
                step={25}
                width={114}
                max={100} />
                <span className="grade-num"><span>10</span>分</span>
            </div>
        </div>
        <div>
          <p className="grade-one" style={{display: 'block'}}>
            中考体育平均成绩:<span>78分</span>
          </p>
          <div className="progress-container">
            <span className="grade-name">长跑</span>
            <Progress
            className="grade-progress"
            percent={20} 
            step={25}
            width={114}
            max={100} />
            <span className="grade-num"><span>10</span>分</span>
          </div>
          <div className="progress-container">
            <span className="grade-name">游泳</span>
            <Progress
            className="grade-progress"
            percent={20} 
            step={25}
            width={114}
            max={100} />
            <span className="grade-num"><span>10</span>分</span>
          </div>
          <div className="progress-container">
            <span className="grade-name">抛实心球</span>
            <Progress
            className="grade-progress"
            percent={20} 
            step={25}
            width={114}
            max={100} />
            <span className="grade-num"><span>10</span>分</span>
          </div>
          <div className="progress-container">
            <span className="grade-name">立定跳远</span>
            <Progress
            className="grade-progress"
            percent={20} 
            step={25}
            width={114}
            max={100} />
            <span className="grade-num"><span>10</span>分</span>
          </div>
        </div>
      </div>
    );
  }
  
  export default memo(forwardRef(StuHealth));
  