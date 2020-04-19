import "../../mocks"; // Must be imported before the tested file
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Comic } from "./Comic";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Router>
      <Comic />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
