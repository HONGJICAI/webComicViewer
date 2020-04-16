import React from "react";
import ReactDOM from "react-dom";
import { PageNav } from "./PageNav";
import { act } from "react-dom/test-utils";

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
  let called = -1;
  const currentPage = 2;
  const totalPage = 10;
  act(() => {
    ReactDOM.render(
      <PageNav
        currentPage={currentPage}
        totalPage={totalPage}
        onClickSpecifyPage={(page: number) => {
          called = page;
        }}
      />,
      container
    );
  });

  const params = [
    { selector: "#prevpage", expectedCalledPage: currentPage - 1 },
    { selector: "#nextpage", expectedCalledPage: currentPage + 1 },
    { selector: "#firstpage", expectedCalledPage: 1 },
    { selector: "#lastpage", expectedCalledPage: totalPage },
  ];

  for (const param of params) {
    act(() => {
      const button = container.querySelector(param.selector);
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(called).toBe(param.expectedCalledPage);
  }
});
