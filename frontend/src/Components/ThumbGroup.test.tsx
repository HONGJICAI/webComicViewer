import React from "react";
import ReactDOM from "react-dom";
import { ThumbGroup, IThumb } from "./ThumbGroup";
import { act } from "react-dom/test-utils";
import { Router, MemoryRouter } from "react-router-dom";

let container: any;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it("render PageNav without crashing", () => {
  const thumbArray: Array<IThumb> = [
    {
      thumbUrl: "/test.jpg",
      jumpToUrl: "/test",
      thumbName: "test",
    },
  ];
  act(() => {
    ReactDOM.render(
      <MemoryRouter>
        <ThumbGroup thumbArray={thumbArray} />
      </MemoryRouter>,
      container
    );
  });
});
