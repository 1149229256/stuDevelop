import React, { useState, memo } from "react";

function Linkbtn(props) {
  let { className, type, title, onClick,children } = props;
  return (
    <span
      className={`card-linkbtn ${className?className:''} ${type && "card-linkbtn-" + type}`}
      onClick={onClick}
    >
      {children||title}
    </span>
  );
}
export default Linkbtn;
