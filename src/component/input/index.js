import React, {
    useState,
    useEffect,
    useLayoutEffect,
    memo,
    useImperativeHandle,
    forwardRef
} from "react";
import "./index.scss";
import $ from "jquery";
import { Select } from "antd";
const { Option } = Select;
//输入框
function MyInput(props) {
    let {
        title,
        type,
        data,
        list,
        width,
        getValue,
        titleWidth,
        inputWidth,
        inputRef,
        className
    } = props;
    const [value, setValue] = useState(data? data: "");
    const [isUpdate, setIsUpdate] = useState(false);
    const saveValue = (e) => {
        setValue(e.target.value);
    }
    //判断当前值是否修改，用于学籍纠错
    useEffect(()=>{
        let compare = data? data: "";
        if(value != compare){
            setIsUpdate(true);
        } else {
            setIsUpdate(false);
        }
    }, [value]);
    useImperativeHandle(
        inputRef,
        () => ({
           value,
           isUpdate
        }),
        [value, data, type, list, isUpdate],
    )
    return (
        <div ref={inputRef} className="input-container" style={{width: width}}>
            <span className="input-title" style={{width: titleWidth}}>{title}:</span>
            <span className={className} style={{display: 'none'}}>{value}</span>
            {
                type == "select"?
                <Select 
                value={value? value: "否"}
                onChange={(value)=>setValue(value)}
                getPopupContainer={()=>$('.body-container')[0]}
                style={{width: inputWidth}}>
                    <Option value="否">否</Option>
                    <Option value="是">是</Option>
                </Select>:
                type == "list"?
                <Select 
                value={value} 
                onChange={(value)=>setValue(value)} 
                getPopupContainer={()=>$('.body-container')[0]}
                style={{width: inputWidth}}>
                    {
                        Array.isArray(list) &&
                        list.map((item, index)=>{
                            return (
                                <Option 
                                key={index} 
                                value={item}>
                                    {item}
                                </Option>
                            )
                        })
                    }
                </Select>:
                type == "input"?
                <input 
                className="input-btn" 
                type="text" 
                value={value} 
                onChange={saveValue} 
                style={{width: inputWidth}}/>:
                <div 
                className="input-btn" 
                style={{width: inputWidth, border: 0}}>
                    {value}
                </div>
            }
        </div>
            
    )
}

export default memo(forwardRef(MyInput));