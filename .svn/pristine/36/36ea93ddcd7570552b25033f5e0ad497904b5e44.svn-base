import React, {
  //   useCallback,
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
} from "react";
import {
  connect,
  // useSelector,
  //   useDispatch,
} from "react-redux";
import FileDetail from "../../component/fileDetail";
import { Scrollbars } from "react-custom-scrollbars";
function Recruit(props, ref) {
  let { id, basePlatFormMsg } = props;
  const detailRef = useRef({});
  useEffect(() => {
    console.log(detailRef.current);
  }, [detailRef.current.detailData]);
  console.log(detailRef.current);

  return (
    <div className="page-recruit">
      <div className="pr-top">
          
      </div>
      <div className='pr-center'>
        <Scrollbars>
          <div className="pr-content">
            <FileDetail
              useScrollbars={false}
              ref={detailRef}
              fileid={id}
              type={"recruit"}
            ></FileDetail>
          </div>
          <div className="pr-provesion">
            {basePlatFormMsg && basePlatFormMsg.ProVersion}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  let { commonData } = state;
  return { ...commonData };
};
export default connect(mapStateToProps)(memo(forwardRef(Recruit)));
