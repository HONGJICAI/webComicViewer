import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

it("render homepage without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it("render /comic without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter initialEntries={["/comic"]}>
      <App />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it("render /video without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter initialEntries={["/video"]}>
      <App />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it("render /page404 with 404", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter initialEntries={["/page404"]}>
      <App />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
