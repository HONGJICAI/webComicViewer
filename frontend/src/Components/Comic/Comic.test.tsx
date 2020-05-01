import "../../mocks"; // Must be imported before the tested file
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, MemoryRouter, Route } from "react-router-dom";
import { Comic } from "./Comic";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter initialEntries={["/comic"]}>
      <Route path="/" render={(props) => <Comic {...props} />} />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
