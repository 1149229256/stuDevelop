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
// import echarts from "echarts";
import {Select} from "antd";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import * as graphic from 'echarts/lib/util/graphic';
import { Empty } from "../../../component/common";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
let { BasicProxy } = ipConfig;
const {Option} = Select;
//   import { resizeForEcharts } from "../../../util/public";
function MyContact(props, ref) {
    let {
        currentTerm,
        userIdentity,
        currentClass,
        currentGrade,
        userInfo: {SchoolID, UserID},
        reflash
      } = props;
      const [currentDataType, setCurrentDataType] = useState("3");
    return (
        <div className="my-contact">
            <div className="show-top">
                <div className="contact-count">
                    <i className="livelogo"></i>
                    <p className="live-name">联系人数: <span>130人</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:982</p>:
                        <p>班级平均:1010; 年级平均:982</p>
                    }
                </div>
                <div className="online-contact-count">
                    <i className="livelogo"></i>
                    <p className="live-name">在线聊天次数: <span>12次</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:982</p>:
                        <p>班级平均:1010; 年级平均:982</p>
                    }
                </div>
                <div className="online-contact-frequency">
                    <i className="livelogo"></i>
                    <p className="live-name">在线聊天频率: <span>125</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:982</p>:
                        <p>班级平均:1010; 年级平均:982</p>
                    }
                </div>
                <div className="online-contact-time">
                    <i className="livelogo"></i>
                    <p className="live-name">在线聊天时长: <span>2次/天</span></p>
                    {
                        userIdentity == 'teacher'?
                        <p>年级平均:982</p>:
                        <p>班级平均:1010; 年级平均:982</p>
                    }
                </div>
            </div>
        </div>
    );
}
const mapStateToProps = (state) => {
    let { 
      commonData:{
        termInfo:{
          HasHistory,
          TermInfo
        },
        userInfo
      } 
    } = state;
    // console.log(state)
    return {HasHistory, TermInfo, userInfo};
}
export default connect(mapStateToProps)(memo(forwardRef(MyContact)));
  