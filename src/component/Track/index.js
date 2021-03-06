/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 *
 * @Author: pengzhiwen
 * @LastEditors: pengzhiwen
 * @Description: 轨迹组件
 */
import React, {
    useState,
    useEffect
} from "react";
import Flag from "./flag";
import $ from "jquery";
import {Carousel} from "antd";
import {Empty} from "../common"
import "./index.scss";

function Track(props) {
    //type是区别模块
    let {
        type,
        userIdentity,
        data
    } = props;
    //暂时只显示6个
    const [showEmpty, setShowEmpty] = useState(false);
    // const [dataList, setDataList] = useState([]);
    data = Array.isArray(data) && data.slice(data.length - 6,);
    let circleList = [], flagList = [];
    for(let i = 0; i < 34*(data.length%6 == 0?parseInt(data.length/6): parseInt(data.length/6) + 1); i++){
        circleList.push(
            <div className="circle-one"></div>
        )
    }
    // useEffect(()=>{
        let arr = [];
        data.forEach((item)=>{
            if(type == "baseMsg"){
                let obj = {
                    time: item.recordDate,
                    content: item.content
                }
                arr.push(obj);
            }
            if(type == "stuConditionMsg"){
                let str = "";
                if(item.examScore){
                    str += "考试分数" + item.examScore + "分，";
                }
                if(item.homeworkScore){
                    str += "日常作业平均分数" + item.homeworkScore + "分，";
                }
                if(item.performanceScore){
                    str += "课堂表现总分数" + item.performanceScore + "分";
                }
                let obj = {
                    time: item.date,
                    content: str
                }
                arr.push(obj);
            }
            if(type == "attendanceMsg"){
                let str = "";
                if(userIdentity != "student"){
                    if(item.late){
                        str += "迟到人数" + item.late + "人，";
                    }
                    if(item.absent){
                        str += "缺勤人数" + item.absent + "人，";
                    }
                    if(item.leaveEarly){
                        str += "早退人数" + item.leaveEarly + "人，";
                    }
                    if(item.vacate){
                        str += "请假人数" + item.vacate + "人";
                    }
                }
                else {
                    if(item.late){
                        str += "迟到" + item.late + "次，";
                    }
                    if(item.absent){
                        str += "缺勤" + item.absent + "次，";
                    }
                    if(item.leaveEarly){
                        str += "早退" + item.leaveEarly + "次，";
                    }
                    if(item.vacate){
                        str += "请假" + item.vacate + "次";
                    }
                }
                if(str[str.length - 1] == "，"){
                    str = str.substr(0, str.length - 1);
                }
                let obj = {
                    time: item.date,
                    content: str
                }
                arr.push(obj);
            }
            if(type == "awardAndPunish"){
                if(userIdentity == "student"){
                    let obj = {
                        time: item.eventTime,
                        content: (
                            item.eventName?
                            item.eventType == 1?
                            "获得" + item.eventName:
                            (item.eventReason? "因为" + item.eventReason: "") + 
                            ("受到" + item.eventName):
                            ""
                        ),
                        eventType: item.eventType
                    }
                    arr.push(obj);
                } else {
                    let obj = {
                        time: item.eventTime,
                        content: (
                            item.eventName?
                            item.eventType == 1?
                            item.userName + "获得" + item.eventName:
                            item.userName + 
                            (item.eventReason? "因为" + item.eventReason: "") + 
                            ("受到" + item.eventName):
                            ""
                        ),
                        eventType: item.eventType
                    }
                    arr.push(obj);
                }
                
            }
            if(type == "schoolLiveMsg"){
                if(userIdentity == "student"){
                    let obj = {
                        time: item.eventTime,
                        content: item.eventName,
                        eventType: item.eventType
                    }
                    arr.push(obj);
                } else {
                    let obj = {
                        time: item.eventTime,
                        content: (
                            item.eventName?
                            item.userName + item.eventName:
                            ""
                        ),
                        eventType: item.eventType
                    }
                    arr.push(obj);
                }
                
            }
        })
        // setDataList(arr);
    // }, [type, data])
    let dataList = arr;
    let updateDataList = [];
    dataList.forEach((item)=>{
        if(item.content){
            updateDataList.push(item);
        }
    })
   if(Array.isArray(dataList) && dataList.length){
    dataList.forEach((item, j)=>{
        j = j + 1;
        flagList.push(
            <Flag
            userIdentity={userIdentity}
            dataType={type}
            direction={j%2 == 0? 'bottom': 'top'}
            type={j%3 == 0? 'red': j%3 == 2? 'green': 'blue'}
            left={j == 1? -5 + j*112: j*140 - 33}
            data={[item]}
            ></Flag>
        )
    })
   }
    const changeLeft = (type) => {
        let node = $(".circle-container");
        let currentLeft = parseInt(node.css('left'));
        console.log(currentLeft)
        if(type == "next"){
            if(currentLeft >= 952*(data.length%6 == 0?parseInt(data.length/6): parseInt(data.length/6) + 1)){
                return;
            }
            node.css("left", currentLeft - 952);

        }
        if(type == "prev"){
            node.css("left", currentLeft + 952);
        }
    }
    return (
        <div className="track-show">
            {/* <div className="next-page" onClick={()=>changeLeft("next")}></div>
            <div className="prev-page" onClick={()=>changeLeft("prev")}></div> */}
            <div className="show-container">
            {
                updateDataList && Array.isArray(updateDataList) &&
                updateDataList.length > 0?
                <div className="circle-container">
                    {flagList}
                    {circleList}
                </div>
                :
                <Empty
                // className={"bar-empty"}
                style={{position: 'relative', top: '80px'}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>
            }
            </div>
            
        </div>
    )
}

export default Track;