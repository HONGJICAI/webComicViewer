import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ComicPageViewContent } from "./ComicPageViewContent";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const comic = {
    id: 1,
    name: "test",
    path: "test.zip",
    lastModifiedTime: 0,
    totalPage: 100,
  };
  ReactDOM.render(
    <Router>
      <ComicPageViewContent comic={comic} location={{ search: "&p=2" }} />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
