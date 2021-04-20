import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./pages/app";
import Personal from "./pages/personalDetail";
import reportWebVitals from "./util/reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import * as serviceWorker from "./util/serviceWorker";
import { HashRouter as Router } from "react-router-dom";
// import { createHashHistory } from "history";
// let history = createHashHistory();
// console.log(history);
// const history = require("history").createHashHistory();
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        {/* <Route  history={history} path="/" component={App}></Route> */}
        <App />
        {/* <Personal /> */}
       </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.register();
