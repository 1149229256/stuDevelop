import React, {
    useState,
    useEffect
} from "react";
import "./index.scss";

function Flag(props) {
    let {
        type,
        left,
        direction,
        dataType,
        data,
        userIdentity,
        dataList
    } = props;
    
    // const [dataList, setDataList] = useState([]);
    
    // console.log(updateDataList, "轨迹");
    // console.log("轨迹信息", dataType, dataList);
    return (
        <div 
        className={
            direction == 'top'?
            type == 'red'? 'top-flag-red': type == 'green'? 'top-flag-green': 'top-flag-blue':
            type == 'red'? 'bottom-flag-red': type == 'green'? 'bottom-flag-green': 'bottom-flag-blue'
        }
        style={{
            left: left
        }}
        >
            {
                data && Array.isArray(data) &&
                data.length > 0?
                data.map((item, index)=>{
                    return (
                    <div key={index}>
                        <div className="flag-circle">
                        <div className="in-circle"></div>
                        </div>
                        <div className="flag-line"></div>
                        <div className="flag-content">
                            <p className="content-title">
                                <span title={item.time}>{item.time}</span>
                                {
                                    item.eventType?
                                    <span 
                                    title={
                                        dataType == "awardAndPunish"?
                                        item.eventType == 1? "奖励信息": "处罚信息":
                                        item.eventType == 1? "上网": item.eventType == 2? "消费": "社交"
                                    }>
                                    {
                                        dataType == "awardAndPunish"?
                                        item.eventType == 1? "奖励信息": "处罚信息":
                                        item.eventType == 1? "上网": item.eventType == 2? "消费": "社交"
                                    }
                                    </span>:
                                    ""
                                }
                                
                            </p>
                            <p 
                            className="content-details"
                            title={item.content}
                            >{item.content}</p>
                        </div>
                    </div>
                    )
                })
                :
                ""
            }
            
        </div>
    )
}

export default Flag;