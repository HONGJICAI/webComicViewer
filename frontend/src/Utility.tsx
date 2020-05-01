import Alert from "react-bootstrap/Alert";
import ReactDOM from "react-dom";
import React from "react";
export function IsMobile() {
  return window.matchMedia("only screen and (max-width: 768px)").matches;
}
export function getTagsFromNames(names: Array<string>): Map<string, number> {
  let counter = new Map();
  names.forEach((name) => {
    const matched = name.match(/\[.*?\]/g);
    if (matched)
      matched.forEach((matched) => {
        const count = counter.has(matched) ? counter.get(matched) + 1 : 1;
        counter.set(matched, count);
      });
  });

  const sortedCounter = new Map(
    [...counter.entries()].sort((a, b) => b[1] - a[1])
  );
  return sortedCounter;
}
export function AppendAlertToBottom(heading: string, message: string) {
  let div = document.createElement("div");
  const alertComponent = (
    <Alert
      variant="danger"
      dismissible
      onClose={() => ReactDOM.unmountComponentAtNode(div)}
    >
      <Alert.Heading>{heading}</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
  ReactDOM.render(alertComponent, div);
  document.body.appendChild(div);
}
export function parseQueryString(url: string) {
  let ret = new Map();
  const queryString = url.split("?", 2);
  const kvArray = queryString.slice(-1)[0].split("&");
  kvArray.forEach((kvString) => {
    const kv = kvString.split("=");
    ret.set(kv[0], kv[1]);
  });
  return ret;
}
