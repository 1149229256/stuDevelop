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
 
function TeacherFamous(props, ref) {
  let {
    className,
    levelHash,
    productMsg,
    // data: { Total, TeaSthRatio, MaleCount, FemaleCount, SubSet },
  } = props;
  productMsg = productMsg ? productMsg : {};
 
   

  return (
    <div className={`TeacherFamous ${className ? className : ""} `}>
      
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: { levelHash },
  } = state;
  return { levelHash };
};
export default connect(mapStateToProps)(memo(forwardRef(TeacherFamous)));
