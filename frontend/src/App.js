import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Comic from "./Comic.js"
import styled from 'styled-components';


function Index() {
  return <h2>Home WIP</h2>;
}

function Video() {
  return <h2>Video WIP</h2>;
}

function App() {
  const Nav = styled.nav`
  background-color: #61dafb;
  `;
  const Ul = styled.ul`
  margin:0;
  padding:0;
  display: table;
  width:100%;
  `;
  const Li = styled.li`
  width: 20%;
  display: inline;
  float: left;
`;
  return (
    <Router>
      <div>
        <div>
          <Nav>
            <Ul>
              <Li>
                <Link to="/">Home</Link>
              </Li>
              <Li>
                <Link to="/comic/">Comic</Link>
              </Li>
              <Li>
                <Link to="/video/">Video</Link>
              </Li>
              <Li>
                <Link to="/image/">Image</Link>
              </Li>
            </Ul>
          </Nav>
        </div>
        <div>
          <Route path="/" exact component={Index} />
          <Route path="/comic" component={Comic} />
          <Route path="/video" component={Video} />
        </div>
      </div>
    </Router>
  );
}

export default App;