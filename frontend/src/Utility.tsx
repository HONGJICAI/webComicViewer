import Alert from "react-bootstrap/Alert";
import ReactDOM from "react-dom";
import React from "react";
export function IsMobile() {
  return window.matchMedia("only screen and (max-width: 760px)").matches;
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
