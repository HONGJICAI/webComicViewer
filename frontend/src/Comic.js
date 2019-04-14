import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from 'styled-components';

let backendHost = "http://127.0.0.1:5000";
class ComicContent extends React.Component {
  constructor(props) {
    super(props);
    const uri = window.location.pathname.split('/');
    this.filename = uri[uri.length - 1];
    this.loadNumPerReq = 2;
    this.state = {
      maxPage: this.loadNumPerReq,
      continueLoading: true
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleScroll() {
    if (!this.state.continueLoading) {
      window.removeEventListener('scroll', this.handleScroll)
      return;
    }
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.setState({ maxPage: this.state.maxPage + this.loadNumPerReq });
    }
  }
  render() {
    const pages = Array.from(new Array(this.state.maxPage), (val, index) => index);
    const Img = styled.img`
        width: 100%;
    `;
    const contents = pages.map(val =>
      <Img src={`${backendHost}/api/v1/comics/${this.filename}?page=${val}`}
        onError={(e) => {
          e.target.onError = null; e.target.src = "";
          this.setState({
            continueLoading: false,
            maxPage: this.state.maxPage - 1
          })
        }
        }
      />
    );
    return (
      <div>
        <div>
          {contents}
        </div>
        <div>
          <button onClick={() => { window.scrollTo(0, 0) }}>Top</button>
        </div>
      </div>
    );
  }
}

class Comic extends React.Component {
  constructor(props) {
    super(props);
    this.state = { comics: [] };
    this.getList();
  }
  async getList() {
    try {
      let rsp = await fetch(`${backendHost}/api/v1/comics`);
      let data = await rsp.json();
      this.setState({ comics: data });
    }
    catch (e) {
      alert(e);
    }
  }
  render() {
    const listItems = this.state.comics.map((filename, idx) =>
      <li key={idx}>
        <Link to={`/comic/${filename}`}>{filename}</Link>
      </li>
    );
    const listRoute = this.state.comics.map(filename =>
      <Route path={`/comic/${filename}`}
        render={props => <ComicContent />}
      />
    );
    return (
      <Router>
        <h2>Comic</h2>
        <ul>
          {listItems}
        </ul>
        {listRoute}
      </Router>
    );
  }
}

export default Comic;