import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, MemoryRouter, Route } from "react-router-dom";
import { ComicList } from "./ComicList";

it("renders without crashing", () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  const div = document.createElement("div");
  const pageInfo = {
    curPage: 0,
    totalPage: 10,
  };
  ReactDOM.render(
    <MemoryRouter initialEntries={["/comic"]}>
      <Route
        path="/"
        render={(props) => (
          <ComicList
            {...props}
            comics={[]}
            numPerPage={5}
            curPage={0}
            pageNav={pageInfo}
          />
        )}
      />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
