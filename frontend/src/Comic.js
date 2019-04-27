import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from 'styled-components';
import PageNav from './PageNav.js'

// let backendHost = "http://192.168.2.149:5000";
let backendHost = "http://192.168.2.116:5000";
class ComicContent extends React.Component {
  constructor(props) {
    super(props);
    this.filename = props.filename;
    this.loadNumPerReq = 3;
    this.state = {
      maxPage: this.loadNumPerReq,
      continueLoading: true
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener("keydown", this.handleKeyDown);

  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener("keydown", this.handleKeyDown);
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
    if (windowBottom + 100 >= docHeight) {
      this.setState({ maxPage: this.state.maxPage + this.loadNumPerReq });
    }
  }
  handleKeyDown = (event) => {
    console.log(event.key);
    const curY = document.documentElement.scrollTop || document.body.scrollTop;
    const curX = window.pageYOffset;
    switch (event.key) {
      case "ArrowRight":
        window.scrollTo(curX, curY + window.innerHeight);
        break;
      case "ArrowLeft":
        window.scrollTo(curX, Math.max(0, curY - window.innerHeight));
        break;
    }
  }
  render() {
    const pages = Array.from(new Array(this.state.maxPage), (val, index) => index);
    const Img = styled.img`
        width: 100%;
    `;
    const contents = pages.map((val, idx) =>
      <Img key={"Content" + this.filename + String(idx)}
        src={`${backendHost}/api/v1/comics/${this.filename}?page=${val}`}
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
        {contents}
      </div>
    );
  }
}


class ComicList extends React.Component {
  render() {
    const Img = styled.img`
      width: 25%;
    `;
    const comics = this.props.comics;
    const numPerPage = this.props.numPerPage;
    const listItems = comics.map((filename, idx) =>
      <li key={"List" + filename}>
        <Link to={`/comic/${filename}`}>
          <Img src={`${backendHost}/api/v1/comics/${filename}`}></Img>
          {filename}
        </Link>
      </li>
    );
    const listRoute = comics.map(filename =>
      <Route key={"Route" + filename} path={`/comic/${filename}`}
        render={() => <ComicContent filename={filename} />}
      />
    );
    return (
      <Router>
        {listRoute}
        <Route exact path='/comic'
          render={() =>
            <ul>
              {listItems.slice((this.props.curPage - 1) * numPerPage, Math.min(this.props.curPage * numPerPage, comics.length))}
            </ul>
          }
        />
      </Router>
    );
  }
}

class Comic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comics: [],
      renderContent: false,
      numPerPage: 10,
      curPage: 1
    };
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
    const totalPage = parseInt(this.state.comics.length / this.state.numPerPage) + (this.state.comics.length % this.state.numPerPage ? 1 : 0);
    const pageInfo = {
      curPage: this.state.curPage,
      totalPage: totalPage
    };
    const pageNav =
      <PageNav pageInfo={pageInfo}
        onClickPre={() => this.setState({ curPage: Math.max(1, this.state.curPage - 1) })}
        onClickNext={() => this.setState({ curPage: Math.min(totalPage, this.state.curPage + 1) })}
      />;
    return (
      <Router>
        <Route exact path='/comic'
          render={() => pageNav}
        />
        <ComicList
          comics={this.state.comics}
          numPerPage={this.state.numPerPage}
          curPage={this.state.curPage}
        />
        <Route exact path='/comic'
          render={() => pageNav}
        />
      </Router>
    );
  }
}

export default Comic;