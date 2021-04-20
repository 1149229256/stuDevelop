import rootReducers, { initialState } from "../reducers";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import DevTools from "./DevTools"; // 辅助工具

let enhancer = applyMiddleware(thunk);
if (process.env.NODE_ENV === "development") {
  enhancer = compose(
    applyMiddleware(thunk, createLogger()),
    DevTools.instrument()
  );
}

let store = createStore(rootReducers, initialState, enhancer);

if (process.env.NODE_ENV === "development") {
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../reducers", () => {
      const nextRootReducer = require("../reducers").default;
      store.replaceReducer(nextRootReducer);
    });
  }
}

// export const StoreContext = createContext({});

/**
 *  action 支持传入一个异步的函数,如：
 *  const increaseCount = async dispatch => {
 *      await sleep(1000);
 *      dispatch({ type: 'increase' });
 *  }
 *  调用：
 *  dispatch(increaseCount)
 */
// const StoreReducer = (props) => {
//   const [state, origin_dispatch] = useReducer(reducer, initialState);
//   const dispatch = (action) => {
//     if (typeof action === "function") {
//       return action(origin_dispatch);
//     }
//     return origin_dispatch(action);
//   };
//   return (
//     <StoreContext.Provider value={{ state, dispatch }}>
//       {props.children}
//     </StoreContext.Provider>
//   );
// };

export default store;
