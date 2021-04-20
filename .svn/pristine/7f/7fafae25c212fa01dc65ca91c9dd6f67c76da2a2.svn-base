import { render, screen } from "@testing-library/react";
import App from "./index";
import { Provider } from "react-redux";
import store from "../../redux/store";
import React from "react";
test("renders learn react link", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
