import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Comic } from "./Components/Comic/Comic";
import styled from "styled-components";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function Index() {
  return <h2>Home WIP</h2>;
}

function Video() {
  return <h2>Video WIP</h2>;
}

function App() {
  return (
    <Router>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand>Fun</Navbar.Brand>
        <Nav className="mr-auto">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/comic/" className="nav-link">
            Comic
          </Link>
          <Link to="/video/" className="nav-link">
            Video
          </Link>
          <Link to="/image/" className="nav-link">
            Image
          </Link>
        </Nav>
      </Navbar>
      <>
        <Route path="/" exact component={Index} />
        <Route path="/comic" component={Comic} />
        <Route path="/video" component={Video} />
      </>
    </Router>
  );
}

export default App;
