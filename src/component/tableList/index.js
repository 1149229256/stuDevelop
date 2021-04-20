/*
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                               神兽保佑            永无BUG
 *
 * @Author: pengzhiwen
 * @LastEditors: pengzhiwen
 * @Description: 
 * //自制的表格列表，方便修改样式，用那些组件改样式太麻烦了
//使用规则
//传入tableHeader和data两个参数
//tableHeader格式：
// [
//     {
//         key: "xxx",  //data中该顺序位置对应的字段名
//         name: "xxx" //该顺序位置对应的表头名称
//         width: "xxx" //该字段所占的宽度，该功能不完善，最好自己计算所有宽度总和为100%否则可能会有问题
//     },
//     {
//         key: "xxx",
//         name: "xxx"
//     }
//     ...
// ]
//data格式：
//传入参数必须是数组，并且必须拥有与tableHeader内key值相同的所有字段，便于取值放于相应位置
//关于头像需要自己写地址参数，后续需要在tableHeader里添加一个头像对象
 */
import React, {
    useState,
    useEffect
} from "react";
import table from "../table";
import { Pagination, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { Empty } from "../common";
import "./index.scss";

function Table(props) {
    let {
        tableHeader,
        data,
        style
    } = props;
    const [currentIndex, setCurrentIndex] = useState(1);
    //不是数组就不收，哪来的回哪去吧
    if(!Array.isArray(tableHeader) || !Array.isArray(data)){
        return;
    }
    //若没有设置width值则默认都一样宽度
    let count = tableHeader.length;
    let width = parseInt(100/count) + "%";
    let updateDataList = [];
    console.log(data)
    data.forEach((item)=>{
        let sign = true;
        tableHeader.forEach((child)=>{
            if(child.key == "score" && !item[child.key]){
                sign = false;
            }
            if(child.key == "useTime" && !item[child.key]){
                sign = false;
            }
        })
        if(sign){
            updateDataList.push(item);
        }
    })
    return (
        <div className="data-table" style={style? style: null}>
            <div className="table-thead">
            {
                tableHeader.map((item, index)=>{
                    return (
                        <div
                        className="table-th" 
                        style={{
                            width
                        }}
                        key={index}
                        >{item.name}</div>
                    )
                })
            }
            </div>
            {  
                Array.isArray(updateDataList) &&
                updateDataList.length > 0?
                updateDataList.slice((currentIndex - 1)*8, currentIndex*8).map((item, index)=>{
                    let arr = [];
                    tableHeader.forEach((child, index1)=>{
                        if(child.key === "index"){
                            arr.push(
                            <div 
                            className="table-td" 
                            style={{
                                width
                            }}
                            key={index1}>
                                {
                                    index + 1
                                }
                            </div>
                            )
                        } else {
                            arr.push(
                            <div 
                            className="table-td" 
                            style={{
                                width
                            }}
                            key={index1}>
                                {
                                    child.key == "userName"?
                                    <img 
                                    className="user-head" 
                                    src={item.userImgUrl || item.studentImgUrl}
                                    alt="" />:
                                    ""
                                }
                                {
                                    item[child.key]?
                                    item[child.key]:
                                    "--"
                                }
                            </div>
                            )
                        } 
                    })
                    return (
                        <div className="table-tr">
                            {arr}
                        </div>
                    )
                }):
                <Empty
                // className={"list-empty"}
                style={{margin: "183px 0"}}
                title={"暂无数据"}
                type={"4"}
                ></Empty>
            }
            {
                updateDataList.length > 8?
                <ConfigProvider locale={zhCN}>
                    <Pagination
                    className="table-pagination"
                    size="small"
                    total={updateDataList.length}
                    current={currentIndex}
                    pageSize={8}
                    showQuickJumper={true}
                    showSizeChanger={false}
                    hideOnSinglePage
                    onChange={(pageIndex)=>{
                        setCurrentIndex(pageIndex);
                    }}
                    />
                </ConfigProvider>
                
                :
                ""
            }
        </div>  
    )
}

export default Table;