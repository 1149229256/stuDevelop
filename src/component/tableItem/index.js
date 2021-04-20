import React, {
    useState,
    useEffect
} from "react";
import "./index.scss";

function Item(props) {
    let {
        title,
        content,
        titleWidth,
        contentWidth
    } = props;
    return (
        <div className="list-one">
            <div className="list-title" style={{width: Number(titleWidth)}}>{title}</div>
            <div className="list-content" style={{width: Number(contentWidth)}}>{content}</div>
        </div>  
    )
}

export default Item;