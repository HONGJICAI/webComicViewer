import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Comic from "./Comic.js"



function Index() {
  return <h2>Home WIP</h2>;
}

function Video() {
  return <h2>Video WIP</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/comic/">Comic</Link>
            </li>
            <li>
              <Link to="/video/">Video</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/comic/" exact component={Comic} />
        <Route path="/video/" exact component={Video} />
      </div>
    </Router>
  );
}

export default AppRouter;